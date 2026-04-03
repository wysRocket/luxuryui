/**
 * Task 4: Figma Reconstruction Step
 *
 * For each kit with a successful Stitch run, produce a Figma reconstruction
 * packet under generated-kit-artifacts/{kitSlug}/figma/reconstruction.json
 * and a delivery manifest under delivery-packs/{kitSlug}.json.
 *
 * This is the publishable source structure for a Figma kit. A subsequent manual
 * or agentic publish step can promote it to a real .fig file via figmaFileKey.
 *
 * Usage:
 *   node scripts/commercial/rebuild-figma-kits.mjs
 *   node scripts/commercial/rebuild-figma-kits.mjs --only=monzo-figma-kit
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getKitArtifactPaths } from './lib/commercialArtifactPaths.mjs';
import { buildFigmaReconstructionPacket, buildDeliveryManifest } from './lib/kitPackaging.mjs';

const _metaUrl = new URL('../../', import.meta.url);
const projectRoot = (_metaUrl.protocol === 'file:'
  ? fileURLToPath(_metaUrl)
  : _metaUrl.pathname
).replace(/[/\\]$/, '');

const FIGMA_CONTENT_MANIFESTS_PATH = path.join(
  projectRoot, 'data', 'curation', 'commercial', 'figma-content-manifests.json'
);
const FIGMA_KIT_SPECS_PATH = path.join(
  projectRoot, 'data', 'curation', 'commercial', 'figma-kit-specs.json'
);
const STITCH_LEDGER_PATH = path.join(
  projectRoot, 'data', 'curation', 'commercial', 'generated-kit-runs.json'
);

const readJSON = async (filePath) => {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
};

const ensureDir = async (dir) => {
  await mkdir(dir, { recursive: true });
  return dir;
};

/**
 * Pick the best Stitch run for a kit: last generated/successful, or null.
 */
export const selectBestRun = (ledgerRecords) => {
  if (!Array.isArray(ledgerRecords) || ledgerRecords.length === 0) return null;
  const successful = ledgerRecords.filter(
    (r) =>
      r?.generationStatus === 'generated' ||
      r?.status === 'generated' ||
      r?.status === 'success'
  );
  if (successful.length === 0) return null;
  return successful[successful.length - 1];
};

const parseOnlyFlag = (args) => {
  const flag = args.find((a) => a.startsWith('--only='));
  return flag ? flag.slice('--only='.length) : null;
};

const main = async () => {
  const onlySlug = parseOnlyFlag(process.argv.slice(2));

  const [manifests, specs, ledger] = await Promise.all([
    readJSON(FIGMA_CONTENT_MANIFESTS_PATH),
    readJSON(FIGMA_KIT_SPECS_PATH),
    readJSON(STITCH_LEDGER_PATH),
  ]);

  if (!manifests) {
    console.error('Could not read figma-content-manifests.json');
    process.exit(1);
  }

  const specsMap = {};
  const specEntries = Array.isArray(specs?.kitSpecs)
    ? specs.kitSpecs
    : Array.isArray(specs)
      ? specs
      : [];
  for (const s of specEntries) {
    if (s.productId) specsMap[s.productId] = s;
  }

  const ledgerBySlug = {};
  if (Array.isArray(ledger?.runs)) {
    for (const run of ledger.runs) {
      if (!run.kitSlug) continue;
      if (!ledgerBySlug[run.kitSlug]) ledgerBySlug[run.kitSlug] = [];
      ledgerBySlug[run.kitSlug].push(run);
    }
  }

  const entries = Array.isArray(manifests?.manifests) ? manifests.manifests : [];
  const targets = onlySlug ? entries.filter((m) => m.productSlug === onlySlug) : entries;

  if (targets.length === 0) {
    console.log(onlySlug ? `No manifest found for kit slug: ${onlySlug}` : 'No manifests to process.');
    return;
  }

  let processed = 0;
  let skipped = 0;

  for (const manifest of targets) {
    const { productSlug: kitSlug, productId } = manifest;
    if (!kitSlug || !productId) {
      skipped++;
      continue;
    }

    const spec = specsMap[productId] ?? null;
    const bestRun = selectBestRun(ledgerBySlug[kitSlug] ?? []);

    const artifactPaths = getKitArtifactPaths(kitSlug, projectRoot);
    const figmaDir = path.join(artifactPaths.generatedKitArtifactsDir, 'figma');
    await ensureDir(figmaDir);

    const packet = buildFigmaReconstructionPacket({ productId, kitSlug, spec, stitchRun: bestRun });
    const packetPath = path.join(figmaDir, 'reconstruction.json');
    await writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`);

    const stitchPreviewImages = bestRun?.stitchPreviewImages ?? [];
    const deliveryManifest = buildDeliveryManifest({
      kitSlug,
      figmaSourceFiles: [path.relative(projectRoot, packetPath)],
      stitchPreviewImages,
      rootDir: projectRoot,
    });

    await ensureDir(artifactPaths.deliveryPacksDir);
    await writeFile(artifactPaths.deliveryPackPath, `${JSON.stringify(deliveryManifest, null, 2)}\n`);

    const statusLabel = packet.reconstructionStatus === 'done' ? 'reconstructed' : 'pending';
    console.log(`  ${kitSlug}: ${statusLabel} (${packet.screenBlueprints.length} screens)`);
    processed++;
  }

  console.log(`\nRebuilt ${processed} kit(s), skipped ${skipped}.`);
};

// Only run when executed directly, not when imported by tests.
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
