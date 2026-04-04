import { getKitArtifactPaths } from './commercialArtifactPaths.mjs';

const DEFAULT_PAGE_ORDER = ['Cover', 'Flow', 'Components', 'Tokens', 'License'];

const dedupe = (values = []) => [...new Set(values.filter(Boolean))];

const buildStitchScreenBlueprints = (stitchRun) =>
  (stitchRun?.selectedScreenIds ?? []).map((screenId, index) => ({
    name: `Screen ${index + 1}`,
    screenId,
    htmlUrl: stitchRun?.stitchHtmlFiles?.[index] ?? stitchRun?.screens?.[index]?.htmlUrl ?? null,
    previewUrl: stitchRun?.stitchPreviewImages?.[index] ?? stitchRun?.screens?.[index]?.previewUrl ?? null,
  }));

const buildDirectScreenBlueprints = (directSource) =>
  (directSource?.sourceAssetPaths ?? []).map((sourceAssetPath, index) => ({
    name: `Screen ${index + 1}`,
    screenId: `${directSource.sourceAppSlug ?? 'source'}-source-screen-${index + 1}`,
    htmlUrl: null,
    previewUrl: sourceAssetPath,
    sourceAssetPath,
    sourceAppSlug: directSource?.sourceAppSlug ?? null,
    sourceFlowId: directSource?.sourceFlowId ?? null,
    sourceLabel: directSource?.sourceLabels?.[index] ?? `Reference screen ${index + 1}`,
  }));

/**
 * Build a delivery manifest that describes the downloadable artifacts for a kit.
 * This is the authoritative shape served by createDeliveryDownload().
 *
 * @param {object} opts
 * @param {string} opts.kitSlug
 * @param {string[]} [opts.figmaSourceFiles]
 * @param {string[]} [opts.stitchPreviewImages]
 * @param {string} [opts.rootDir]
 */
export const buildDeliveryManifest = ({ kitSlug, figmaSourceFiles = [], stitchPreviewImages = [], rootDir }) => {
  const paths = getKitArtifactPaths(kitSlug, rootDir);

  return {
    artifactVersion: 1,
    kitSlug,
    downloadFileName: `${kitSlug}-delivery-pack.json`,
    artifacts: {
      figmaSourceFiles,
      stitchPreviewImages,
    },
    paths: {
      generatedKitArtifactsDir: paths.generatedKitArtifactsDir,
      deliveryPackPath: paths.deliveryPackPath,
    },
  };
};

/**
 * Build the Figma reconstruction packet for a kit.
 * This represents a publishable source structure — not yet a .fig file,
 * but the full specification needed to produce one.
 *
 * @param {object} opts
 * @param {string} opts.productId
 * @param {string} opts.kitSlug
 * @param {object} opts.spec  — KitSpec from figma-kit-specs.json
 * @param {object} opts.stitchRun — latest successful Stitch run record, or null
 * @param {object} [opts.directSource]
 */
export const buildFigmaReconstructionPacket = ({ productId, kitSlug, spec, stitchRun, directSource = null }) => {
  const stitchScreenBlueprints = buildStitchScreenBlueprints(stitchRun);
  const directScreenBlueprints = buildDirectScreenBlueprints(directSource);
  const screenBlueprints = directScreenBlueprints.length > 0 ? directScreenBlueprints : stitchScreenBlueprints;
  const generationSource = directScreenBlueprints.length > 0 ? 'direct' : 'stitch';

  return {
    productId,
    kitSlug,
    figmaFileKey: null,
    pageOrder: DEFAULT_PAGE_ORDER,
    screenBlueprints,
    componentInventory: spec?.componentAbstractions ?? [],
    tokenInventory: spec?.colorStyles ?? [],
    generationSource,
    sourceAppSlug: directSource?.sourceAppSlug ?? null,
    sourceFlowId: directSource?.sourceFlowId ?? null,
    sourceAssetPaths: directSource?.sourceAssetPaths ?? [],
    transformationNotes: dedupe([
      ...(directSource?.transformationNotes ?? []),
      ...(spec?.renameRules ?? []),
      ...(spec?.placeholderContentPolicy ?? []),
    ]),
    reconstructionStatus: screenBlueprints.length > 0 ? 'done' : 'pending',
    nextAction: 'publish-via-figma-workflow',
    reconstructedAt: new Date().toISOString(),
  };
};
