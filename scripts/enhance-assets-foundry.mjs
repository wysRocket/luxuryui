import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const envLocalPath = path.join(projectRoot, '.env.local');
const assetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');
const reportPath = path.join(__dirname, '.assets-enhance-report.json');

if (existsSync(envLocalPath)) {
  const envText = readFileSync(envLocalPath, 'utf8');
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }
    const [key, ...rest] = trimmed.split('=');
    if (key && !(key in process.env)) {
      process.env[key] = rest.join('=');
    }
  }
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const ALLOWED_MODEL_SIZES = [
  { width: 1024, height: 1024, size: '1024x1024' },
  { width: 1024, height: 1536, size: '1024x1536' },
  { width: 1536, height: 1024, size: '1536x1024' },
];
const ENHANCE_PROMPT =
  'Enhance this UI screenshot for production quality. Preserve the exact composition, framing, text, iconography, colors, spacing, device frame, and interaction layout. Do not crop, zoom, extend the canvas, resize the framing, invent elements, remove elements, or rewrite text. Improve clarity, anti-aliasing, and visual cleanliness while keeping the same design intent.';

const parseArg = (name, argv = process.argv.slice(2)) => {
  const value = argv.find((entry) => entry.startsWith(`--${name}=`));
  return value ? value.slice(name.length + 3) : null;
};

const provider = parseArg('provider') ?? 'auto';
const only = parseArg('only');
const limitArg = parseArg('limit');
const limit = limitArg ? Number(limitArg) : null;
const dryRun = process.argv.slice(2).includes('--dry-run');
const apiVersion = process.env.AZURE_OPENAI_IMAGE_API_VERSION ?? '2025-04-01-preview';
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT;
const isV1Endpoint = Boolean(endpoint && /\/openai\/v1\/?$/.test(endpoint));
const hasAzureConfig = Boolean(endpoint && apiKey && deployment);

if (limitArg && (!Number.isFinite(limit) || limit <= 0 || !Number.isInteger(limit))) {
  console.error(`Invalid --limit value: ${limitArg}`);
  process.exit(1);
}

if (!['auto', 'azure', 'sharp'].includes(provider)) {
  console.error(`Unsupported --provider value: ${provider}`);
  process.exit(1);
}

if (provider === 'azure' && !hasAzureConfig) {
  console.error(
    'Missing required env vars for --provider=azure: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_IMAGE_DEPLOYMENT',
  );
  process.exit(1);
}

const isImage = (fileName) => IMAGE_EXTS.has(path.extname(fileName).toLowerCase());
const toPublicPath = (filePath) =>
  `/${path.relative(path.join(projectRoot, 'public'), filePath).replace(/\\/g, '/')}`;

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

const prepareEditCanvas = async ({
  sourceBuffer,
  sourceWidth,
  sourceHeight,
  canvasWidth,
  canvasHeight,
}) => {
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

const applySharpEnhancement = async ({ sourceBuffer, ext }) =>
  encodeToOriginalFormat(
    sharp(sourceBuffer, { failOnError: false })
      .rotate()
      .normalise()
      .sharpen({ sigma: 0.85 }),
    ext,
  ).toBuffer();

const callImageEdit = async ({ inputPngBuffer, size }) => {
  const baseEndpoint = endpoint.replace(/\/$/, '');
  const url = isV1Endpoint
    ? `${baseEndpoint}/images/edits`
    : `${baseEndpoint}/openai/deployments/${deployment}/images/edits?api-version=${encodeURIComponent(
        apiVersion,
      )}`;

  const formData = new FormData();
  formData.set('prompt', ENHANCE_PROMPT);
  formData.set('n', '1');
  formData.set('quality', 'high');
  formData.set('size', size);
  if (isV1Endpoint) {
    formData.set('model', deployment);
  }
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
    const error = new Error(`HTTP ${response.status}: ${message}`);
    error.code = payload?.error?.code ?? response.status;
    throw error;
  }

  const base64Image = payload?.data?.[0]?.b64_json;
  if (!base64Image) {
    throw new Error('Image API response did not contain data[0].b64_json.');
  }

  return Buffer.from(base64Image, 'base64');
};

const isAzureDeploymentMissing = (error) =>
  Boolean(
    error &&
      typeof error === 'object' &&
      ('code' in error
        ? error.code === 'DeploymentNotFound'
        : String(error).includes('DeploymentNotFound')),
  );

const collectTargets = async () => {
  const targets = [];
  const appDirs = await readdir(assetsRoot, { withFileTypes: true });

  for (const entry of appDirs) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (only && entry.name !== only) {
      continue;
    }

    const appDir = path.join(assetsRoot, entry.name);
    const files = await readdir(appDir, { withFileTypes: true });
    for (const fileEntry of files) {
      if (!fileEntry.isFile() || !isImage(fileEntry.name)) {
        continue;
      }

      targets.push({
        slug: entry.name,
        fileName: fileEntry.name,
        filePath: path.join(appDir, fileEntry.name),
      });

      if (limit && targets.length >= limit) {
        return targets;
      }
    }
  }

  return targets;
};

const replaceFileAtomically = async (targetPath, nextBuffer) => {
  const tempPath = `${targetPath}.copilot-enhance.tmp`;
  await writeFile(tempPath, nextBuffer);
  await rename(tempPath, targetPath);
};

const run = async () => {
  const startedAt = Date.now();
  const targets = await collectTargets();
  const results = [];
  let enhancedCount = 0;
  let failedCount = 0;
  let fallbackTriggered = false;
  let fallbackReason = null;
  let effectiveProvider = provider === 'auto' ? (hasAzureConfig ? 'azure' : 'sharp') : provider;

  console.log(`Enhancing ${targets.length} image(s) from ${assetsRoot}`);
  console.log(`Provider mode: ${provider} (starting with ${effectiveProvider})`);

  for (const target of targets) {
    try {
      const ext = path.extname(target.fileName);
      const sourceBuffer = await readFile(target.filePath);
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
      let providerUsed = effectiveProvider;
      if (!dryRun) {
        if (effectiveProvider === 'azure') {
          try {
            const editedBuffer = await callImageEdit({
              inputPngBuffer: prepared.canvasBuffer,
              size: modelSize.size,
            });

            const extracted = await sharp(editedBuffer)
              .extract(prepared.crop)
              .resize(sourceWidth, sourceHeight, { fit: 'fill' })
              .toBuffer();

            finalBuffer = await encodeToOriginalFormat(sharp(extracted), ext).toBuffer();
          } catch (error) {
            if (provider === 'auto' && isAzureDeploymentMissing(error)) {
              fallbackTriggered = true;
              fallbackReason = 'Azure image deployment is unavailable for this resource.';
              effectiveProvider = 'sharp';
              providerUsed = 'sharp';
              console.warn('Azure image deployment unavailable; falling back to sharp enhancement.');
              finalBuffer = await applySharpEnhancement({ sourceBuffer, ext });
            } else {
              throw error;
            }
          }
        } else {
          finalBuffer = await applySharpEnhancement({ sourceBuffer, ext });
        }

        await replaceFileAtomically(target.filePath, finalBuffer);
      }

      results.push({
        slug: target.slug,
        fileName: target.fileName,
        publicPath: toPublicPath(target.filePath),
        status: dryRun ? 'dry-run' : 'enhanced',
        provider: dryRun ? effectiveProvider : providerUsed,
        sourceSizeBytes: sourceBuffer.byteLength,
        outputSizeBytes: finalBuffer.byteLength,
        width: sourceWidth,
        height: sourceHeight,
        modelSize: modelSize.size,
      });
      enhancedCount += 1;
      console.log(
        `${dryRun ? 'Planned' : 'Enhanced'} ${target.slug}/${target.fileName} (${sourceWidth}x${sourceHeight})`,
      );
    } catch (error) {
      failedCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        slug: target.slug,
        fileName: target.fileName,
        publicPath: toPublicPath(target.filePath),
        status: 'failed',
        error: message,
      });
      console.warn(`Failed ${target.slug}/${target.fileName}: ${message}`);
    }
  }

  const report = {
    schema: '1',
    generatedAt: new Date().toISOString(),
    dryRun,
    only: only ?? null,
    limit: limit ?? null,
    settings: {
      deployment,
      apiVersion,
      endpointMode: isV1Endpoint ? 'v1' : 'deployment-path',
      outputBehavior: 'preserve-original-dimensions',
      provider,
      effectiveProvider,
      fallbackTriggered,
      fallbackReason,
    },
    summary: {
      totalTargets: targets.length,
      enhanced: enhancedCount,
      failed: failedCount,
      durationSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(2)),
    },
    results,
  };

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Enhance report -> ${reportPath}`);
  console.log(
    `Targets: ${report.summary.totalTargets}, enhanced: ${report.summary.enhanced}, failed: ${report.summary.failed}`,
  );

  if (failedCount > 0) {
    process.exit(1);
  }
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
