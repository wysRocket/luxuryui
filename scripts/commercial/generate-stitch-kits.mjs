import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCommercialKitPrompt } from './lib/stitchPromptBuilder.mjs';
import { createStitchClient, DEFAULT_STITCH_DEVICE_TYPE } from './lib/stitchClient.mjs';
import { getKitArtifactPaths } from './lib/commercialArtifactPaths.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const productsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-kit-products.json');
const specsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-kit-specs.json');
const reviewsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'commercial-reviews.json');
const flowPacksPath = path.join(projectRoot, 'data', 'curation', 'flows', 'screensdesign-flow-packs.json');
const generatedRunsPath = path.join(projectRoot, 'data', 'curation', 'commercial', 'generated-kit-runs.json');

const STITCH_OUTPUT_DIRNAME = 'stitch';
export const DEFAULT_DEVICE_TYPE = DEFAULT_STITCH_DEVICE_TYPE;

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

export const parseOnlyArg = (argv) => {
  const onlyArg = argv.find((arg) => arg.startsWith('--only='));
  return onlyArg ? onlyArg.slice('--only='.length) : null;
};

export const getEligibleKits = ({ products, specs, reviews, flowPacks, only }) => {
  const specByProductId = new Map(specs.kitSpecs.map((spec) => [spec.productId, spec]));
  const reviewByProductId = new Map(reviews.reviews.map((review) => [review.productId, review]));
  const flowById = new Map(flowPacks.packs.map((pack) => [pack.flowId, pack]));

  return products.products
    .filter((product) => !only || product.slug === only)
    .map((product) => ({
      product,
      spec: specByProductId.get(product.id),
      review: reviewByProductId.get(product.id),
      flow: flowById.get(product.primaryFlowId),
    }))
    .filter(({ product, spec, review, flow }) => {
      return (
        product.status === 'published' &&
        review?.reviewStatus === 'approved' &&
        review?.readyForSale === true &&
        Boolean(spec) &&
        Boolean(flow)
      );
    });
};

export const ensureDir = async (dirPath) => {
  await mkdir(dirPath, { recursive: true });
  return dirPath;
};

export const toRelative = (filePath, rootDir = projectRoot) =>
  path.relative(rootDir, filePath).replace(/\\/g, '/');

export const createRunRecord = ({
  rootDir = projectRoot,
  runId,
  kitSlug,
  stitchDir,
  artifacts,
  status,
  metadata = {},
  errorMessage = null,
}) => ({
  runId,
  kitSlug,
  generatedAt: new Date().toISOString(),
  status,
  generationStatus: metadata.generationStatus ?? status,
  artifactPaths: {
    stitchDir: toRelative(stitchDir, rootDir),
    promptPath: toRelative(artifacts.promptPath, rootDir),
    metadataPath: toRelative(artifacts.metadataPath, rootDir),
    htmlPath: artifacts.htmlPath ? toRelative(artifacts.htmlPath, rootDir) : null,
    imagePath: artifacts.imagePath ? toRelative(artifacts.imagePath, rootDir) : null,
  },
  deviceType: metadata.deviceType ?? DEFAULT_DEVICE_TYPE,
  stitchProjectId: metadata.stitchProjectId ?? null,
  selectedScreenIds: metadata.selectedScreenIds ?? [],
  stitchHtmlFiles: metadata.stitchHtmlFiles ?? [],
  stitchPreviewImages: metadata.stitchPreviewImages ?? [],
  errorMessage,
});

export const loadExistingLedger = async (ledgerPath = generatedRunsPath) => {
  try {
    return JSON.parse(await readFile(ledgerPath, 'utf8'));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return {
        schema: '1',
        generatedAt: null,
        summary: {
          totalRuns: 0,
          preparedRuns: 0,
          blockedRuns: 0,
          completedRuns: 0,
        },
        runs: [],
      };
    }

    throw error;
  }
};

const summarizeRuns = (runs) => ({
  totalRuns: runs.length,
  preparedRuns: runs.filter((run) => run.status === 'prepared').length,
  blockedRuns: runs.filter((run) => run.status !== 'generated').length,
  completedRuns: runs.filter((run) => run.status === 'generated').length,
});

export const writeRunLedger = async ({ ledgerPath = generatedRunsPath, existingLedger, newRecords }) => {
  const mergedRuns = [...(existingLedger?.runs ?? []), ...newRecords];
  const payload = {
    schema: '1',
    generatedAt: new Date().toISOString(),
    summary: summarizeRuns(mergedRuns),
    runs: mergedRuns,
  };

  await writeFile(ledgerPath, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
};

export const appendRunToLedger = async ({
  ledgerPath = generatedRunsPath,
  ledgerState,
  runRecord,
}) =>
  writeRunLedger({
    ledgerPath,
    existingLedger: ledgerState,
    newRecords: [runRecord],
  });

export const writeKitArtifacts = async ({ stitchDir, prompt, metadata }) => {
  await ensureDir(stitchDir);
  const promptPath = path.join(stitchDir, 'prompt.txt');
  const metadataPath = path.join(stitchDir, 'run.json');
  const htmlPath = null;
  const imagePath = null;

  await writeFile(promptPath, `${prompt}\n`);
  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

  return { promptPath, metadataPath, htmlPath, imagePath };
};

const STITCH_VARIANT_PROMPT =
  'Create additional transformed flow screens that expand this commercial kit into a cohesive 6-8 screen flow set.';

export const getTargetScreenCount = (includedFrames = []) => {
  const transformedScreenCount = includedFrames.filter((frame) =>
    frame.startsWith('Transformed screen')
  ).length;

  return Math.max(6, Math.min(8, transformedScreenCount));
};

export const collectGeneratedScreenArtifacts = async ({
  client,
  project,
  baseScreen,
  targetScreenCount,
  variantPrompt = STITCH_VARIANT_PROMPT,
}) => {
  const variantScreens = [];
  let remainingVariantCount = Math.max(0, targetScreenCount - 1);

  while (remainingVariantCount > 0) {
    const variantCount = Math.min(5, remainingVariantCount);
    const batch = await project.variants(baseScreen, variantPrompt, {
      variantCount,
      creativeRange: 'EXPLORE',
      aspects: ['LAYOUT', 'TEXT_CONTENT', 'COLOR_SCHEME'],
    });

    variantScreens.push(...batch);
    remainingVariantCount -= batch.length;

    if (batch.length === 0) {
      break;
    }
  }

  const screens = [baseScreen, ...variantScreens];
  const htmlUrls = await Promise.all(screens.map((screen) => client.getHtml(screen)));
  const imageUrls = await Promise.all(screens.map((screen) => client.getImage(screen)));
  const selectedScreenIds = screens.map((screen) => screen.id ?? screen.screenId).filter(Boolean);
  const stitchHtmlFiles = htmlUrls.filter(Boolean);
  const stitchPreviewImages = imageUrls.filter(Boolean);

  if (
    screens.length !== targetScreenCount ||
    new Set(selectedScreenIds).size !== targetScreenCount ||
    stitchHtmlFiles.length !== targetScreenCount ||
    stitchPreviewImages.length !== targetScreenCount
  ) {
    throw new Error('Stitch returned incomplete screen artifacts.');
  }

  return {
    screens,
    selectedScreenIds,
    stitchHtmlFiles,
    stitchPreviewImages,
  };
};

export const main = async () => {
  const only = parseOnlyArg(process.argv.slice(2));
  const [products, specs, reviews, flowPacks] = await Promise.all([
    readJson(productsPath),
    readJson(specsPath),
    readJson(reviewsPath),
    readJson(flowPacksPath),
  ]);

  const eligibleKits = getEligibleKits({ products, specs, reviews, flowPacks, only });

  if (only && eligibleKits.length === 0) {
    throw new Error(`No approved commercial kit found for --only=${only}.`);
  }

  if (!only && eligibleKits.length === 0) {
    throw new Error('No approved commercial kits are ready for Stitch generation.');
  }

  const runId = `stitch-run-${Date.now()}`;
  const records = [];
  let ledgerState = await loadExistingLedger(generatedRunsPath);
  const failures = [];

  for (const { product, spec, flow } of eligibleKits) {
    const artifactPaths = getKitArtifactPaths(product.slug, projectRoot);
    const stitchDir = await ensureDir(path.join(artifactPaths.generatedKitArtifactsDir, STITCH_OUTPUT_DIRNAME));
    const prompt = buildCommercialKitPrompt({
      appName: product.sourceAppName,
      flow: {
        id: flow.flowId,
        title: flow.title,
        objective: flow.objective,
        steps: flow.steps,
      },
      components: spec.componentAbstractions,
      tokens: spec.colorStyles,
      bundleIds: product.bundleIds ?? [],
    });

    const baseMetadata = {
      runId,
      kitSlug: product.slug,
      productId: product.id,
      deviceType: DEFAULT_DEVICE_TYPE,
      generationStatus: 'pending',
      promptSections: ['app', 'flow', 'reference screenshots', 'rename rules', 'components', 'design tokens'],
      stitchProjectId: null,
      selectedScreenIds: [],
      stitchHtmlFiles: [],
      stitchPreviewImages: [],
      status: 'prepared',
    };

    if (!process.env.STITCH_API_KEY) {
      const failedMetadata = {
        ...baseMetadata,
        status: 'blocked_missing_api_key',
        generationStatus: 'failed',
      };
      const artifacts = await writeKitArtifacts({
        stitchDir,
        prompt,
        metadata: failedMetadata,
      });

      const runRecord = createRunRecord({
        rootDir: projectRoot,
        runId,
        kitSlug: product.slug,
        stitchDir,
        artifacts,
        status: 'blocked_missing_api_key',
        metadata: failedMetadata,
        errorMessage: 'STITCH_API_KEY is not set. Export the key before running commercial:generate:stitch.',
      });

      records.push(runRecord);
      ledgerState = await appendRunToLedger({
        ledgerPath: generatedRunsPath,
        ledgerState,
        runRecord,
      });
      failures.push(`${product.slug}: STITCH_API_KEY is not set. Export the key before running commercial:generate:stitch.`);
      continue;
    }

    const client = await createStitchClient({ apiKey: process.env.STITCH_API_KEY });
    let projectId = null;

    try {
      projectId = await client.createProject(product.title);
      const project = client.project(projectId);
      const screen = await project.generate(prompt, DEFAULT_DEVICE_TYPE);
      const collectedArtifacts = await collectGeneratedScreenArtifacts({
        client,
        project,
        baseScreen: screen,
        targetScreenCount: getTargetScreenCount(spec.includedFrames),
      });
      const metadata = {
        ...baseMetadata,
        status: 'generated',
        generationStatus: 'generated',
        stitchProjectId: projectId,
        selectedScreenIds: collectedArtifacts.selectedScreenIds,
        stitchHtmlFiles: collectedArtifacts.stitchHtmlFiles,
        stitchPreviewImages: collectedArtifacts.stitchPreviewImages,
      };
      const artifacts = await writeKitArtifacts({
        stitchDir,
        prompt,
        metadata,
      });

      const runRecord = createRunRecord({
        rootDir: projectRoot,
        runId,
        kitSlug: product.slug,
        stitchDir,
        artifacts,
        status: 'generated',
        metadata,
      });

      records.push(runRecord);
      ledgerState = await appendRunToLedger({
        ledgerPath: generatedRunsPath,
        ledgerState,
        runRecord,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const failedMetadata = {
        ...baseMetadata,
        status: 'runtime_error',
        generationStatus: 'failed',
        stitchProjectId: projectId,
      };
      const artifacts = await writeKitArtifacts({
        stitchDir,
        prompt,
        metadata: failedMetadata,
      });
      const runRecord = createRunRecord({
        rootDir: projectRoot,
        runId,
        kitSlug: product.slug,
        stitchDir,
        artifacts,
        status: 'runtime_error',
        metadata: failedMetadata,
        errorMessage,
      });

      records.push(runRecord);
      ledgerState = await appendRunToLedger({
        ledgerPath: generatedRunsPath,
        ledgerState,
        runRecord,
      });
      failures.push(`${product.slug}: ${errorMessage}`);
    } finally {
      await client.close();
    }
  }

  if (failures.length > 0) {
    throw new Error(failures.join('\n'));
  }

  console.log(`Prepared ${records.length} Stitch kit run(s).`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
