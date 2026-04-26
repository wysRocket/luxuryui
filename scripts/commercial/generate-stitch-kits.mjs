import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
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

// Default delay between kits (ms) — keeps us under Stitch rate limits.
// Override with --delay=N (milliseconds).
const DEFAULT_KIT_DELAY_MS = 10_000;

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isQuotaError = (error) => {
  const msg = error instanceof Error ? error.message : String(error);
  return /resource.*exhausted|quota|rate.?limit|429/i.test(msg);
};

/**
 * Retry an async fn with exponential backoff, specifically for quota/rate-limit errors.
 * Non-quota errors are re-thrown immediately without retry.
 */
export const withRetry = async (fn, { maxAttempts = 3, baseDelayMs = 60_000, label = '' } = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isQuotaError(error) || attempt === maxAttempts) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.log(`\n    quota hit${label ? ` (${label})` : ''} — waiting ${delay / 1000}s before retry ${attempt + 1}/${maxAttempts}...`);
      await sleep(delay);
    }
  }
  throw lastError;
};

export const parseOnlyArg = (argv) => {
  const onlyArg = argv.find((arg) => arg.startsWith('--only='));
  return onlyArg ? onlyArg.slice('--only='.length) : null;
};

export const parseSkipExistingFlag = (argv) => argv.includes('--skip-existing');

export const parseDelayArg = (argv) => {
  const flag = argv.find((a) => a.startsWith('--delay='));
  if (!flag) return DEFAULT_KIT_DELAY_MS;
  const parsed = Number(flag.slice('--delay='.length));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_KIT_DELAY_MS;
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
      // Gate: source asset quality must be 'pass' or 'warn' (sufficient screenshots for design
      // inspiration). We intentionally do NOT require product.status === 'published' or
      // review.reviewStatus === 'approved' here — those come AFTER a successful
      // Stitch run, so requiring them would create a circular dependency.
      // product.status and review.reviewStatus are promoted by generate-figma-kits.mjs
      // once reconstruction is complete.
      return (
        (review?.sourceQuality === 'pass' || review?.sourceQuality === 'warn') &&
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
  const skipExisting = parseSkipExistingFlag(process.argv.slice(2));
  const kitDelayMs = parseDelayArg(process.argv.slice(2));
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

  // Build set of already-generated slugs for --skip-existing support.
  const alreadyGeneratedSlugs = new Set(
    (ledgerState?.runs ?? [])
      .filter((r) => r.status === 'generated' || r.status === 'completed')
      .map((r) => r.kitSlug)
  );

  for (const { product, spec, flow } of eligibleKits) {
    if (skipExisting && alreadyGeneratedSlugs.has(product.slug)) {
      console.log(`  skipping ${product.slug} (already generated)`);
      continue;
    }
    const kitIndex = eligibleKits.findIndex(({ product: p }) => p.slug === product.slug) + 1;
    process.stdout.write(`  [${kitIndex}/${eligibleKits.length}] ${product.slug} ... `);
    const artifactPaths = getKitArtifactPaths(product.slug, projectRoot);
    const stitchDir = await ensureDir(path.join(artifactPaths.generatedKitArtifactsDir, STITCH_OUTPUT_DIRNAME));
    
    // We try to pull the analysis data & images from Gemini
    let analysisData = null;
    let base64Image = null;
    let imageMimeType = null;
    
    // Find the first screen (screen-1.webp) corresponding to this product from /assets/apps/ or dist/
    // Since our product appName maps to the folder, we look into public/assets/apps/${product.sourceAppSlug}/
    // e.g. "Zoom" -> "zoom" and we need to fetch multiple if needed 
    try {
        const appAssetsDir = path.join(projectRoot, 'public', 'assets', 'apps', product.sourceAppSlug || product.sourceAppName.toLowerCase());
        const FilePath = path.join(appAssetsDir, 'screen-1.webp'); 
        
        const fileStat = await stat(FilePath).catch(() => null);
        if (fileStat) {
            const actualImages = await readFile(FilePath);
            base64Image = actualImages.toString('base64');
            imageMimeType = 'image/webp';
            
            const analysisPath = path.join(appAssetsDir, 'screen-1.upscale-analysis.md');
            analysisData = await readFile(analysisPath, 'utf8').catch(() => null);
            if (base64Image) {
                console.log(`\n  (Attached ${product.sourceAppSlug || product.sourceAppName}/screen-1.webp to Stitch generation...)`);
            }
        }
    } catch(err) {
        // Just ignore if we can't find source assets
    }
    
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
      analysisData,
      base64Image,
      imageMimeType,
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
      console.log('blocked (STITCH_API_KEY not set)');
      failures.push(`${product.slug}: STITCH_API_KEY is not set. Export the key before running commercial:generate:stitch.`);
      continue;
    }

    const client = await createStitchClient({ apiKey: process.env.STITCH_API_KEY });
    let projectId = null;
    const existingRun = ledgerState.runs?.find(r => r.productId === product.id && r.stitchProjectId);
    
    try {
      const collectedArtifacts = await withRetry(
        async () => {
          let project;
          if (existingRun?.stitchProjectId) {
              projectId = existingRun.stitchProjectId;
              console.log(`(reusing existing project ${projectId})`);
              project = client.project(projectId);
          } else {
              projectId = await client.createProject(product.title);
              project = client.project(projectId);
          }
          
          const screen = await project.generate(prompt, DEFAULT_DEVICE_TYPE);
          return collectGeneratedScreenArtifacts({
            client,
            project,
            baseScreen: screen,
            targetScreenCount: getTargetScreenCount(spec.includedFrames),
          });
        },
        { maxAttempts: 3, baseDelayMs: 60_000, label: product.slug }
      );
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
      console.log(`generated (${collectedArtifacts.selectedScreenIds.length} screens, project ${projectId})`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStatus = isQuotaError(error) ? 'quota_error' : 'runtime_error';
      const failedMetadata = {
        ...baseMetadata,
        status: errorStatus,
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
        status: errorStatus,
        metadata: failedMetadata,
        errorMessage,
      });

      records.push(runRecord);
      ledgerState = await appendRunToLedger({
        ledgerPath: generatedRunsPath,
        ledgerState,
        runRecord,
      });
      console.log(`ERROR: ${errorMessage}`);
      failures.push(`${product.slug}: ${errorMessage}`);

      // Quota errors are account-wide — stop the batch immediately rather than
      // burning through retries on every remaining kit. Re-run with
      // --skip-existing once the quota window resets.
      if (errorStatus === 'quota_error') {
        console.log('\nQuota exhausted — stopping batch. Re-run with --skip-existing once quota resets.');
        break;
      }
    } finally {
      await client.close();
    }

    // Rate-limit guard: pause between kits to avoid quota exhaustion.
    if (kitDelayMs > 0 && records.length < eligibleKits.length) {
      await sleep(kitDelayMs);
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
