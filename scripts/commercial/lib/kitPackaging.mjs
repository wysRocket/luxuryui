import { getKitArtifactPaths } from './commercialArtifactPaths.mjs';

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
 */
export const buildFigmaReconstructionPacket = ({ productId, kitSlug, spec, stitchRun }) => {
  const screenBlueprints = (stitchRun?.selectedScreenIds ?? []).map((screenId, i) => ({
    name: `Screen ${i + 1}`,
    screenId,
    htmlUrl: stitchRun?.screens?.[i]?.htmlUrl ?? null,
    previewUrl: stitchRun?.screens?.[i]?.previewUrl ?? null,
  }));

  return {
    productId,
    kitSlug,
    figmaFileKey: null,
    pageOrder: ['Cover', 'Flow', 'Components', 'Tokens', 'License'],
    screenBlueprints,
    componentInventory: spec?.componentAbstractions ?? [],
    tokenInventory: spec?.colorStyles ?? [],
    reconstructionStatus: screenBlueprints.length > 0 ? 'done' : 'pending',
    nextAction: 'publish-via-figma-workflow',
    reconstructedAt: new Date().toISOString(),
  };
};
