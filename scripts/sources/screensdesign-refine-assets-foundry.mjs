import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { selectPublishScreenshotPaths } from './lib/publishAssetPipeline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const QUALITY_REPORT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-quality-report.json',
);
const PUBLISH_READY_DIR = path.join(projectRoot, 'public', 'assets', 'publish-ready', 'apps');
const OUT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-refine-report.json',
);

const RAW_PUBLIC_ROOT = '/assets/apps/';
const PUBLISH_PUBLIC_ROOT = '/assets/publish-ready/apps/';
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const ALLOWED_MODEL_SIZES = [
  { width: 1024, height: 1024, size: '1024x1024' },
  { width: 1024, height: 1536, size: '1024x1536' },
  { width: 1536, height: 1024, size: '1536x1024' },
];
const REFINE_PROMPT =
  'Enhance this UI screenshot for production quality. Preserve the exact composition, text, iconography, colors, spacing, and interaction layout. Do not invent or remove UI elements. Improve clarity, anti-aliasing, and visual cleanliness while keeping the same design intent.';

const parseArg = (name, argv = process.argv.slice(2)) => {
  const value = argv.find((entry) => entry.startsWith(`--${name}=`));
  return value ? value.slice(name.length + 3) : null;
};

const mode = parseArg('mode') ?? 'all';
const only = parseArg('only');
const dryRun = process.argv.slice(2).includes('--dry-run');
const apiVersion = process.env.AZURE_OPENAI_IMAGE_API_VERSION ?? '2025-04-01-preview';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT;

if (!endpoint || !apiKey || !deployment) {
  console.error(
    'Missing required env vars: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_IMAGE_DEPLOYMENT',
  );
  process.exit(1);
}

const isImage = (fileName) => IMAGE_EXTS.has(path.extname(fileName).toLowerCase());

const publicPathToFsPath = (publicPath) =>
  path.join(projectRoot, 'public', publicPath.replace(/^\//, ''));

const toPublishPublicPath = (publicPath, slug, fileName) =>
  publicPath.startsWith(PUBLISH_PUBLIC_ROOT)
    ? publicPath
    : `${PUBLISH_PUBLIC_ROOT}${slug}/${fileName}`;

const inferMime = (ext) => {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    default:
      return 'image/png';
  }
};

const selectModelSize = (sourceWidth, sourceHeight) => {
  const sourceRatio = sourceWidth / sourceHeight;
  const scored = ALLOWED_MODEL_SIZES.map((item) => {
    const ratio = item.width / item.height;
    const ratioDiff = Math.abs(ratio - sourceRatio);
    const areaDiff = Math.abs(item.width * item.height - sourceWidth * sourceHeight);
    return { ...item, score: ratioDiff * 10000 + areaDiff / 1000000 };
  });
  scored.sort((left, right) => left.score - right.score);
  return scored[0];
};

const prepareEditCanvas = async ({ sourceBuffer, sourceWidth, sourceHeight, canvasWidth, canvasHeight }) => {
  const scale = Math.min(canvasWidth / sourceWidth, canvasHeight / sourceHeight);
  const renderWidth = Math.max(1, Math.round(sourceWidth * scale));
  const renderHeight = Math.max(1, Math.round(sourceHeight * scale));
  const left = Math.floor((canvasWidth - renderWidth) / 2);
  const top = Math.floor((canvasHeight - renderHeight) / 2);

  const resizedSource = await sharp(sourceBuffer)
    .resize(renderWidth, renderHeight, {
      fit: 'fill',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  const canvasBuffer = await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 15, g: 15, b: 18, alpha: 1 },
    },
  })
    .composite([{ input: resizedSource, left, top }])
    .png()
    .toBuffer();

  return {
    canvasBuffer,
    crop: { left, top, width: renderWidth, height: renderHeight },
  };
};

const encodeToOriginalFormat = (pipeline, ext) => {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return pipeline.jpeg({ quality: 94, mozjpeg: true, progressive: true });
    case '.png':
      return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
    case '.webp':
      return pipeline.webp({ quality: 94, effort: 6 });
    case '.avif':
      return pipeline.avif({ quality: 65, effort: 7 });
    default:
      return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  }
};

const callImageEdit = async ({ inputPngBuffer, size }) => {
  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/images/edits?api-version=${encodeURIComponent(
    apiVersion,
  )}`;

  const formData = new FormData();
  formData.set('prompt', REFINE_PROMPT);
  formData.set('n', '1');
  formData.set('quality', 'high');
  formData.set('size', size);
  formData.set('image', new Blob([inputPngBuffer], { type: 'image/png' }), 'input.png');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
    },
    body: formData,
  });

  const rawText = await response.text();
  let payload;

  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error(`Unexpected response: ${rawText.slice(0, 500)}`);
  }

  if (!response.ok) {
    const message = payload?.error?.message ?? rawText;
    throw new Error(`HTTP ${response.status}: ${message}`);
  }

  const base64Image = payload?.data?.[0]?.b64_json;
  if (!base64Image) {
    throw new Error('Image API response did not contain data[0].b64_json.');
  }

  return Buffer.from(base64Image, 'base64');
};

const readPublishDirFiles = async (slug) => {
  const publishDir = path.join(PUBLISH_READY_DIR, slug);

  try {
    return (await readdir(publishDir)).filter(isImage);
  } catch {
    return [];
  }
};

const collectTargets = async ({ qualityReport, selectionMode, selectedSlug }) => {
  const apps = selectedSlug
    ? qualityReport.apps.filter((app) => app.slug === selectedSlug)
    : qualityReport.apps;
  const targets = [];

  for (const app of apps) {
    const publishDirFiles = await readPublishDirFiles(app.slug);
    const rawScreens = app.screenshots?.files ?? [];
    const rawScreenFiles = rawScreens.map((file) => file.file);
    const selectedPublicPaths = selectPublishScreenshotPaths({
      slug: app.slug,
      rawScreenshotFiles: rawScreenFiles,
      publishDirFiles,
    });

    const rawStatusByFile = new Map(rawScreens.map((screen) => [screen.file, screen]));
    for (const publicPath of selectedPublicPaths) {
      const fileName = path.basename(publicPath);
      const rawScreen = rawStatusByFile.get(fileName);
      if (selectionMode === 'warn' && rawScreen?.status !== 'warn') {
        continue;
      }

      targets.push({
        slug: app.slug,
        fileName,
        sourcePublicPath: publicPath,
        outputPublicPath: toPublishPublicPath(publicPath, app.slug, fileName),
      });
    }
  }

  return targets;
};

export const run = async () => {
  if (!['all', 'warn'].includes(mode)) {
    throw new Error(`Unsupported mode "${mode}". Use --mode=all or --mode=warn.`);
  }

  const qualityReport = JSON.parse(await readFile(QUALITY_REPORT_PATH, 'utf8'));
  const targets = await collectTargets({
    qualityReport,
    selectionMode: mode,
    selectedSlug: only,
  });

  const startedAt = Date.now();
  const results = [];
  let refinedCount = 0;
  let failedCount = 0;

  for (const target of targets) {
    const sourcePath = publicPathToFsPath(target.sourcePublicPath);
    const outputPath = publicPathToFsPath(target.outputPublicPath);
    const ext = path.extname(target.fileName);

    try {
      const sourceBuffer = await readFile(sourcePath);
      const sourceMeta = await sharp(sourceBuffer).metadata();
      const sourceWidth = sourceMeta.width ?? 0;
      const sourceHeight = sourceMeta.height ?? 0;

      if (!sourceWidth || !sourceHeight) {
        throw new Error('Unable to detect source dimensions.');
      }

      const modelSize = selectModelSize(sourceWidth, sourceHeight);
      const prepared = await prepareEditCanvas({
        sourceBuffer,
        sourceWidth,
        sourceHeight,
        canvasWidth: modelSize.width,
        canvasHeight: modelSize.height,
      });

      let finalBuffer = sourceBuffer;
      if (!dryRun) {
        const editedBuffer = await callImageEdit({
          inputPngBuffer: prepared.canvasBuffer,
          size: modelSize.size,
        });

        const extracted = await sharp(editedBuffer)
          .extract(prepared.crop)
          .resize(sourceWidth, sourceHeight, { fit: 'fill' })
          .toBuffer();

        finalBuffer = await encodeToOriginalFormat(sharp(extracted), ext).toBuffer();
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, finalBuffer);
      }

      results.push({
        ...target,
        status: dryRun ? 'dry-run' : 'refined',
        sourceSizeBytes: sourceBuffer.byteLength,
        outputSizeBytes: finalBuffer.byteLength,
        width: sourceWidth,
        height: sourceHeight,
        modelSize: modelSize.size,
        mimeType: inferMime(ext),
      });
      refinedCount += 1;
      console.log(`Refined ${target.slug}/${target.fileName} (${sourceWidth}x${sourceHeight})`);
    } catch (error) {
      failedCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        ...target,
        status: 'failed',
        error: message,
      });
      console.warn(`Failed ${target.slug}/${target.fileName}: ${message}`);
    }
  }

  const report = {
    schema: '1',
    generatedAt: new Date().toISOString(),
    mode,
    only: only ?? null,
    dryRun,
    settings: {
      deployment,
      apiVersion,
    },
    summary: {
      totalTargets: targets.length,
      refined: refinedCount,
      failed: failedCount,
      durationSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(2)),
    },
    results,
  };

  await writeFile(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Refine report → ${OUT_PATH}`);
  console.log(
    `Targets: ${report.summary.totalTargets}, refined: ${report.summary.refined}, failed: ${report.summary.failed}`,
  );
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
