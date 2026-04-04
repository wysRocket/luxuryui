import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTargetScreenCount, parseOnlyArg as parseStitchOnlyArg } from './generate-stitch-kits.mjs';
import { run as syncCommercialKitCatalog } from './generate-figma-kits.mjs';
import { getKitArtifactPaths } from './lib/commercialArtifactPaths.mjs';
import { buildDeliveryManifest, buildFigmaReconstructionPacket } from './lib/kitPackaging.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const productsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-kit-products.json');
const specsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-kit-specs.json');
const reviewsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'commercial-reviews.json');
const flowPacksPath = path.join(projectRoot, 'data', 'curation', 'flows', 'screensdesign-flow-packs.json');
const qualityReportPath = path.join(projectRoot, 'data', 'curation', 'coverage', 'screensdesign-quality-report.json');
const publishQualityReportPath = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-publish-quality-report.json'
);

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const ensureDir = async (dirPath) => {
  await mkdir(dirPath, { recursive: true });
  return dirPath;
};

const normalizeRelativePath = (filePath) => filePath.replace(/\\/g, '/');

const dedupe = (values = []) => [...new Set(values.filter(Boolean))];

export const collectDirectSourceAssets = ({
  flowApp,
  qualityApp,
  publishQualityApp,
  appSlug,
  targetScreenCount,
}) => {
  const flowAssets = Array.isArray(flowApp?.screenshots) ? flowApp.screenshots : [];
  const publishAssets = (publishQualityApp?.screenshots?.files ?? [])
    .filter((file) => file?.status !== 'fail')
    .map((file) => file.publicPath)
    .filter(Boolean);
  const qualityAssets = (qualityApp?.screenshots?.files ?? []).map(
    (file) => `/assets/apps/${appSlug}/${file.file}`
  );

  return dedupe([...flowAssets, ...publishAssets, ...qualityAssets]).slice(0, targetScreenCount);
};

export const buildDirectSourceDescriptor = ({
  product,
  spec,
  review,
  flow,
  flowApp,
  qualityApp,
  publishQualityApp,
}) => {
  const targetScreenCount = getTargetScreenCount(spec?.includedFrames ?? []);
  const sourceAssetPaths = collectDirectSourceAssets({
    flowApp,
    qualityApp,
    publishQualityApp,
    appSlug: product.sourceAppSlug,
    targetScreenCount,
  });

  return {
    generationSource: 'direct',
    sourceAppSlug: product.sourceAppSlug,
    sourceFlowId: product.primaryFlowId,
    sourceAssetPaths,
    sourceLabels: sourceAssetPaths.map(
      (_, index) => flow?.steps?.[index] ?? `Reference screen ${index + 1}`
    ),
    transformationNotes: dedupe([
      ...(product.transformationNotes ?? []),
      ...(spec?.renameRules ?? []),
      ...(spec?.placeholderContentPolicy ?? []),
      ...(review?.editorialNotes ?? []),
    ]),
  };
};

export const getEligibleDirectKits = ({
  products,
  specs,
  reviews,
  flowPacks,
  qualityReport,
  publishQualityReport,
  only,
}) => {
  const specByProductId = new Map(specs.kitSpecs.map((spec) => [spec.productId, spec]));
  const reviewByProductId = new Map(reviews.reviews.map((review) => [review.productId, review]));
  const flowById = new Map(flowPacks.packs.map((pack) => [pack.flowId, pack]));
  const qualityBySlug = new Map(qualityReport.apps.map((app) => [app.slug, app]));
  const publishQualityBySlug = new Map(
    (publishQualityReport?.apps ?? []).map((app) => [app.slug, app])
  );

  return products.products
    .filter((product) => !only || product.slug === only)
    .map((product) => {
      const flow =
        flowById.get(product.primaryFlowId) ??
        flowPacks.packs.find((pack) => pack.apps.some((app) => app.slug === product.sourceAppSlug)) ??
        null;
      const flowApp = flow?.apps?.find((app) => app.slug === product.sourceAppSlug) ?? null;
      const qualityApp = qualityBySlug.get(product.sourceAppSlug) ?? null;
      const publishQualityApp = publishQualityBySlug.get(product.sourceAppSlug) ?? null;

      return {
        product,
        spec: specByProductId.get(product.id) ?? null,
        review: reviewByProductId.get(product.id) ?? null,
        flow,
        flowApp,
        qualityApp,
        publishQualityApp,
      };
    })
    .filter(({ spec, flowApp, qualityApp, publishQualityApp }) => {
      if (!spec) {
        return false;
      }

      return collectDirectSourceAssets({
        flowApp,
        qualityApp,
        publishQualityApp,
        appSlug: flowApp?.slug ?? qualityApp?.slug ?? '',
        targetScreenCount: getTargetScreenCount(spec.includedFrames ?? []),
      }).length > 0;
    });
};

export const run = async ({ only = parseStitchOnlyArg(process.argv.slice(2)) } = {}) => {
  const [products, specs, reviews, flowPacks, qualityReport, publishQualityReport] = await Promise.all([
    readJson(productsPath),
    readJson(specsPath),
    readJson(reviewsPath),
    readJson(flowPacksPath),
    readJson(qualityReportPath),
    readJson(publishQualityReportPath).catch(() => null),
  ]);

  const eligibleKits = getEligibleDirectKits({
    products,
    specs,
    reviews,
    flowPacks,
    qualityReport,
    publishQualityReport,
    only,
  });

  if (eligibleKits.length === 0) {
    console.log(only ? `No eligible kits found for --only=${only}.` : 'No eligible kits found for direct generation.');
    return [];
  }
  for (const { product, spec, review, flow, flowApp, qualityApp, publishQualityApp } of eligibleKits) {
    const artifactPaths = getKitArtifactPaths(product.slug, projectRoot);
    const figmaDir = path.join(artifactPaths.generatedKitArtifactsDir, 'figma');
    await ensureDir(figmaDir);

    const directSource = buildDirectSourceDescriptor({
      product,
      spec,
      review,
      flow,
      flowApp,
      qualityApp,
      publishQualityApp,
    });
    const packet = buildFigmaReconstructionPacket({
      productId: product.id,
      kitSlug: product.slug,
      spec,
      stitchRun: null,
      directSource,
    });

    const packetPath = path.join(figmaDir, 'reconstruction.json');
    await writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`);

    const previewImages = (packet.screenBlueprints ?? [])
      .map((screen) => screen?.previewUrl ?? screen?.sourceAssetPath ?? null)
      .filter(Boolean);
    const deliveryManifest = buildDeliveryManifest({
      kitSlug: product.slug,
      figmaSourceFiles: [normalizeRelativePath(path.relative(projectRoot, packetPath))],
      stitchPreviewImages: previewImages,
      rootDir: projectRoot,
    });

    await ensureDir(artifactPaths.deliveryPacksDir);
    await writeFile(
      artifactPaths.deliveryPackPath,
      `${JSON.stringify(deliveryManifest, null, 2)}\n`
    );
  }

  await syncCommercialKitCatalog({ only });

  console.log(`Generated ${eligibleKits.length} direct Figma packet(s).`);
  return eligibleKits.map(({ product }) => product.slug);
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
