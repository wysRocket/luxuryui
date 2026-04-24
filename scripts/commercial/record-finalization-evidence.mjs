import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getKitArtifactPaths } from './lib/commercialArtifactPaths.mjs';
import { normalizeStitchMode } from './lib/kitFinalization.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const commercialRoot = path.join(projectRoot, 'data', 'curation', 'commercial');
const productsPath = path.join(commercialRoot, 'figma-kit-products.json');

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const EVIDENCE_SOURCES = new Set(['stitch', 'manual-record']);

const isCanonicalIsoTimestamp = (value) => {
  if (!hasText(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
};

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const readJsonIfExists = async (filePath, fallback = null) => {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallback;
    }

    throw error;
  }
};

const writeJson = async (filePath, payload) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
};

export const parseArgs = (argv = []) => {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const rawArg = argv[index];
    if (!rawArg.startsWith('--')) {
      continue;
    }

    const [rawKey, inlineValue] = rawArg.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = inlineValue ?? argv[index + 1];

    if (inlineValue === undefined) {
      index += 1;
    }

    args[key] = value;
  }

  return args;
};

export const extractFigmaAssetId = (finalAssetUrl) => {
  if (!hasText(finalAssetUrl)) {
    return null;
  }

  try {
    const url = new URL(finalAssetUrl);
    if (!url.hostname.endsWith('figma.com')) {
      return null;
    }

    const [, assetId] = url.pathname.match(/^\/(?:design|file)\/([^/]+)/) ?? [];
    return assetId ?? null;
  } catch {
    return null;
  }
};

export const buildFinalizationEvidenceRecord = ({
  product,
  existingFinalization = {},
  stitchProjectId,
  stitchMode,
  finalAssetUrl,
  finalAssetId = extractFigmaAssetId(finalAssetUrl),
  exportedAt,
  verifiedAt = exportedAt,
  source = 'stitch',
}) => {
  const normalizedStitchMode = normalizeStitchMode(stitchMode);

  if (!product?.id || !product?.slug) {
    throw new Error('A matching product is required before recording finalization evidence.');
  }

  if (!hasText(stitchProjectId)) {
    throw new Error('stitchProjectId is required.');
  }

  if (!normalizedStitchMode) {
    throw new Error('stitchMode must be one of: rapid, standard.');
  }

  if (!hasText(finalAssetUrl) || !extractFigmaAssetId(finalAssetUrl)) {
    throw new Error('finalAssetUrl must be a Figma design/file URL.');
  }

  if (!hasText(finalAssetId)) {
    throw new Error('finalAssetId is required or must be derivable from finalAssetUrl.');
  }

  if (!isCanonicalIsoTimestamp(exportedAt)) {
    throw new Error('exportedAt must be a canonical ISO timestamp.');
  }

  if (!isCanonicalIsoTimestamp(verifiedAt)) {
    throw new Error('verifiedAt must be a canonical ISO timestamp.');
  }

  if (!EVIDENCE_SOURCES.has(source)) {
    throw new Error('source must be one of: stitch, manual-record.');
  }

  return {
    ...existingFinalization,
    productId: product.id,
    kitSlug: product.slug,
    recordedAt: exportedAt,
    finalizationStatus: existingFinalization.finalizationStatus ?? 'content_verified',
    auditClassification: existingFinalization.auditClassification ?? 'repairable',
    exportEligibility: {
      status: 'pass',
      stitchProjectId,
      stitchMode,
      normalizedStitchMode,
      reasons: [],
    },
    exportEvidence: {
      method: 'stitch-export-to-figma',
      exportedAt,
      finalAssetId,
      finalAssetUrl,
      source,
    },
    deliveryVerification: {
      status: 'pass',
      reason: null,
      verifiedAt,
      fulfillmentType: 'stitch-figma-export',
      handoffUrl: finalAssetUrl,
    },
    blockingReasons: ['pending_finalization_audit'],
  };
};

export const recordFinalizationEvidence = async ({
  kitSlug,
  stitchProjectId,
  stitchMode,
  finalAssetUrl,
  finalAssetId,
  exportedAt = new Date().toISOString(),
  verifiedAt = exportedAt,
  source = 'stitch',
  rootDir = projectRoot,
}) => {
  const products = await readJson(path.join(rootDir, 'data', 'curation', 'commercial', 'figma-kit-products.json'));
  const product = products.products.find((candidate) => candidate.slug === kitSlug);

  if (!product) {
    throw new Error(`Unknown kit slug: ${kitSlug}`);
  }

  const finalizationPath = getKitArtifactPaths(product.slug, rootDir).finalizationPath;
  const existingFinalization = await readJsonIfExists(finalizationPath, {});
  const record = buildFinalizationEvidenceRecord({
    product,
    existingFinalization,
    stitchProjectId,
    stitchMode,
    finalAssetUrl,
    finalAssetId,
    exportedAt,
    verifiedAt,
    source,
  });

  await writeJson(finalizationPath, record);

  return { finalizationPath, record };
};

const runCli = async () => {
  const args = parseArgs(process.argv.slice(2));
  const kitSlug = args.kit ?? args.kitSlug;

  if (!kitSlug) {
    throw new Error('Usage: npm run commercial:record-finalization -- --kit=monzo-figma-kit --stitch-project-id=projects/... --stitch-mode=rapid --final-asset-url=https://www.figma.com/design/...');
  }

  const result = await recordFinalizationEvidence({
    kitSlug,
    stitchProjectId: args.stitchProjectId,
    stitchMode: args.stitchMode,
    finalAssetUrl: args.finalAssetUrl,
    finalAssetId: args.finalAssetId,
    exportedAt: args.exportedAt,
    verifiedAt: args.verifiedAt,
    source: args.source ?? 'stitch',
  });

  console.log(`Recorded finalization evidence for ${result.record.kitSlug}`);
  console.log(`Next: npm run commercial:audit:finalization && npm run commercial:generate`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
