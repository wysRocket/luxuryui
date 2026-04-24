import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { auditFinalizationState } from './lib/kitFinalization.mjs';
import { getKitArtifactPaths } from './lib/commercialArtifactPaths.mjs';

const execFileAsync = promisify(execFile);

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const commercialRoot = path.join(projectRoot, 'data', 'curation', 'commercial');

const productsPath = path.join(commercialRoot, 'figma-kit-products.json');
const specsPath = path.join(commercialRoot, 'figma-kit-specs.json');
const ledgerPath = path.join(commercialRoot, 'generated-kit-runs.json');
const generatedArtifactsRoot = path.join(commercialRoot, 'generated-kit-artifacts');

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

export const isSafeKitSlug = (slug) => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export const assertSafeKitSlug = (slug) => {
  if (!isSafeKitSlug(slug)) {
    throw new Error(`Unsafe kit slug for commercial artifact path: ${slug}`);
  }

  return slug;
};

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

const isGitIgnored = async (filePath) => {
  try {
    await execFileAsync('git', ['check-ignore', '--quiet', filePath], { cwd: projectRoot });
    return true;
  } catch (error) {
    if (error?.code === 1) {
      return false;
    }

    throw error;
  }
};

const isGitTracked = async (filePath) => {
  try {
    await execFileAsync(
      'git',
      ['ls-files', '--error-unmatch', '--', path.relative(projectRoot, filePath)],
      { cwd: projectRoot },
    );
    return true;
  } catch (error) {
    if (error?.code === 1) {
      return false;
    }

    throw error;
  }
};

const readReproducibleLedger = async (filePath) => {
  if (await isGitIgnored(filePath)) {
    return { runs: [] };
  }

  return readJsonIfExists(filePath, { runs: [] });
};

const readTrackedJsonIfExists = async (filePath, fallback = null) => {
  if (!(await isGitTracked(filePath))) {
    return fallback;
  }

  return readJsonIfExists(filePath, fallback);
};

export const selectAuditTimestamp = ({ products, env = process.env, currentNow = new Date().toISOString() } = {}) =>
  products?.generatedAt ?? env?.COMMERCIAL_FINALIZATION_AUDIT_NOW ?? currentNow;

const toTime = (run) => {
  const candidate = run?.generatedAt ?? run?.completedAt ?? run?.updatedAt ?? run?.createdAt ?? null;
  const timestamp = candidate ? Date.parse(candidate) : Number.NaN;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const SUCCESSFUL_STITCH_RUN_STATUSES = new Set(['generated', 'completed', 'success']);

const isSuccessfulStitchRun = (run) =>
  SUCCESSFUL_STITCH_RUN_STATUSES.has(run?.generationStatus) || SUCCESSFUL_STITCH_RUN_STATUSES.has(run?.status);

const selectLatestRun = (runs = []) => {
  const sortedRuns = [...runs].sort((a, b) => toTime(b) - toTime(a));
  return sortedRuns.find(isSuccessfulStitchRun) ?? sortedRuns[0] ?? null;
};

const groupRunsBySlug = (runs = []) => {
  const runsBySlug = new Map();

  for (const run of runs) {
    if (!run?.kitSlug) {
      continue;
    }

    runsBySlug.set(run.kitSlug, [...(runsBySlug.get(run.kitSlug) ?? []), run]);
  }

  return runsBySlug;
};

const addBlockingReason = (record, reason) => ({
  ...record,
  blockingReasons: reason
    ? [...new Set([...(record.blockingReasons ?? []), reason])]
    : record.blockingReasons ?? [],
});

const getFinalizationForSlug = (finalizationsBySlug, slug) => {
  const finalization = finalizationsBySlug.get(slug) ?? null;
  const latestFinalization = Array.isArray(finalization) ? finalization[0] ?? null : finalization;

  if (!latestFinalization) {
    return null;
  }

  return {
    ...latestFinalization,
    deliveryVerification: unwrapDeliveryVerification(latestFinalization.deliveryVerification),
  };
};

const unwrapDeliveryVerification = (deliveryVerification) => {
  let current = deliveryVerification ?? null;

  while (current && Object.prototype.hasOwnProperty.call(current, 'verification')) {
    current = current.verification ?? null;
  }

  return current;
};

const buildSummary = (records, integrityViolations) => ({
  total: records.length,
  finalized: records.filter((record) => record.auditClassification === 'finalized').length,
  repairable: records.filter((record) => record.auditClassification === 'repairable').length,
  mustRegenerate: records.filter((record) => record.auditClassification === 'must_regenerate').length,
  blocked: records.filter((record) => record.auditClassification === 'blocked').length,
  integrityViolations: integrityViolations.length,
});

export const buildFinalizationAudit = ({
  products,
  specs,
  reconstructionsBySlug = new Map(),
  stitchRunsBySlug = new Map(),
  finalizationsBySlug = new Map(),
  now = new Date().toISOString(),
}) => {
  const specByProductId = new Map((specs?.kitSpecs ?? []).map((spec) => [spec.productId, spec]));
  const records = [];
  const integrityViolations = [];

  for (const product of products?.products ?? []) {
    assertSafeKitSlug(product.slug);

    const stitchRun = selectLatestRun(stitchRunsBySlug.get(product.slug) ?? []);
    const existingFinalization = getFinalizationForSlug(finalizationsBySlug, product.slug);
    const baseRecord = auditFinalizationState({
      productId: product.id,
      kitSlug: product.slug,
      spec: specByProductId.get(product.id) ?? null,
      reconstruction: reconstructionsBySlug.get(product.slug) ?? null,
      stitchRun,
      existingFinalization,
      now,
    });
    const isCatalogMismatch = product.status === 'published' && baseRecord.finalizationStatus !== 'finalized';
    const record = {
      ...addBlockingReason(
        baseRecord,
        isCatalogMismatch ? 'blocked_catalog_finalization_mismatch' : null,
      ),
      productStatus: product.status ?? null,
    };

    if (isCatalogMismatch) {
      integrityViolations.push(`${product.slug} is published but finalizationStatus is ${baseRecord.finalizationStatus}`);
    }

    records.push(record);
  }

  return {
    schema: '1',
    auditedAt: now,
    summary: buildSummary(records, integrityViolations),
    integrityViolations,
    records,
  };
};

const loadReconstructionsBySlug = async (products) => {
  const reconstructionsBySlug = new Map();

  for (const product of products?.products ?? []) {
    assertSafeKitSlug(product.slug);

    const reconstructionPath = path.join(generatedArtifactsRoot, product.slug, 'figma', 'reconstruction.json');
    const reconstruction = await readTrackedJsonIfExists(reconstructionPath, null);
    if (reconstruction) {
      reconstructionsBySlug.set(product.slug, reconstruction);
    }
  }

  return reconstructionsBySlug;
};

const loadFinalizationsBySlug = async (products) => {
  const finalizationsBySlug = new Map();

  for (const product of products?.products ?? []) {
    assertSafeKitSlug(product.slug);

    const finalization = await readTrackedJsonIfExists(
      getKitArtifactPaths(product.slug, projectRoot).finalizationPath,
      null,
    );
    if (finalization) {
      finalizationsBySlug.set(product.slug, finalization);
    }
  }

  return finalizationsBySlug;
};

const writeAuditOutputs = async (audit) => {
  for (const record of audit.records) {
    assertSafeKitSlug(record.kitSlug);

    await writeJson(getKitArtifactPaths(record.kitSlug, projectRoot).finalizationPath, record);
  }

  const auditPath = getKitArtifactPaths('catalog', projectRoot).finalizationAuditPath;
  await writeJson(auditPath, audit);
};

const runCli = async () => {
  const [products, specs, ledger] = await Promise.all([
    readJson(productsPath),
    readJson(specsPath),
    readReproducibleLedger(ledgerPath),
  ]);
  const [reconstructionsBySlug, finalizationsBySlug] = await Promise.all([
    loadReconstructionsBySlug(products),
    loadFinalizationsBySlug(products),
  ]);
  const audit = buildFinalizationAudit({
    products,
    specs,
    reconstructionsBySlug,
    stitchRunsBySlug: groupRunsBySlug(ledger.runs ?? []),
    finalizationsBySlug,
    now: selectAuditTimestamp({ products }),
  });

  await writeAuditOutputs(audit);

  console.log(JSON.stringify(audit.summary, null, 2));

  if (audit.integrityViolations.length > 0) {
    process.exitCode = 1;
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
