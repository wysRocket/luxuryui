import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  PUBLISH_READY_PUBLIC_ROOT,
  calculateUpscaleDimensions,
} from './lib/publishAssetPipeline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const QUALITY_REPORT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-quality-report.json',
);
const PUBLISH_QUALITY_REPORT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-publish-quality-report.json',
);
const RUBRIC_PATH = path.join(projectRoot, 'config', 'quality', 'asset-rubric.json');
const RAW_APPS_DIR = path.join(projectRoot, 'public', 'assets', 'apps');
const PUBLISH_READY_DIR = path.join(projectRoot, 'public', 'assets', 'publish-ready', 'apps');
const OUT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-upscale-report.json',
);

const parseOnlyArg = (argv = process.argv.slice(2)) => {
  const onlyArg = argv.find((arg) => arg.startsWith('--only='));
  return onlyArg ? onlyArg.slice('--only='.length) : null;
};

const encodeImage = (pipeline, ext) => {
  const normalized = ext.toLowerCase();

  if (normalized === '.jpg' || normalized === '.jpeg') {
    return pipeline.jpeg({ quality: 92, mozjpeg: true, progressive: true });
  }

  if (normalized === '.png') {
    return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  }

  if (normalized === '.webp') {
    return pipeline.webp({ quality: 92, effort: 6 });
  }

  return pipeline;
};

export const shouldUpscaleScreenshot = (screenFile = {}) =>
  screenFile.status === 'warn' && typeof screenFile.reason === 'string' && screenFile.reason.includes('under min');

const publicPathToFsPath = (publicPath) =>
  path.join(projectRoot, 'public', publicPath.replace(/^\//, ''));

export const run = async ({ only = parseOnlyArg() } = {}) => {
  const [qualityReport, publishQualityReport, rubric] = await Promise.all([
    readFile(QUALITY_REPORT_PATH, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(PUBLISH_QUALITY_REPORT_PATH, 'utf8')
      .then((raw) => JSON.parse(raw))
      .catch(() => null),
    readFile(RUBRIC_PATH, 'utf8').then((raw) => JSON.parse(raw)),
  ]);

  const minWidth = rubric.assets.screenshots.minWidth;
  const minHeight = rubric.assets.screenshots.minHeight;
  const apps = only
    ? qualityReport.apps.filter((app) => app.slug === only)
    : qualityReport.apps;
  const publishQualityBySlug = new Map(
    (publishQualityReport?.apps ?? []).map((app) => [app.slug, app])
  );
  const results = [];

  for (const app of apps) {
    const publishDir = path.join(PUBLISH_READY_DIR, app.slug);
    let upscaledCount = 0;
    const publishQualityApp = publishQualityBySlug.get(app.slug) ?? null;
    const sourceScreens = publishQualityApp?.screenshots?.files?.length
      ? publishQualityApp.screenshots.files
      : (app.screenshots.files ?? []);

    for (const screenFile of sourceScreens) {
      if (!shouldUpscaleScreenshot(screenFile)) {
        continue;
      }

      const targetSize = calculateUpscaleDimensions({
        width: screenFile.width,
        height: screenFile.height,
        minWidth,
        minHeight,
      });

      if (!targetSize) {
        continue;
      }

      const sourcePublicPath = screenFile.publicPath ?? `/assets/apps/${app.slug}/${screenFile.file}`;
      const inputPath = screenFile.publicPath
        ? publicPathToFsPath(screenFile.publicPath)
        : path.join(RAW_APPS_DIR, app.slug, screenFile.file);
      const outputPublicPath = sourcePublicPath.startsWith(PUBLISH_READY_PUBLIC_ROOT)
        ? sourcePublicPath
        : `${PUBLISH_READY_PUBLIC_ROOT}/${app.slug}/${screenFile.file}`;
      const outputPath = publicPathToFsPath(outputPublicPath);
      const tempOutputPath =
        inputPath === outputPath
          ? `${outputPath}.tmp${path.extname(outputPath)}`
          : outputPath;

      await mkdir(publishDir, { recursive: true });

      const pipeline = sharp(inputPath, { failOnError: false })
        .rotate()
        .resize({
          width: targetSize.width,
          height: targetSize.height,
          fit: 'inside',
          withoutEnlargement: false,
        });

      await encodeImage(pipeline, path.extname(screenFile.file)).toFile(tempOutputPath);

      if (tempOutputPath !== outputPath) {
        await rename(tempOutputPath, outputPath);
      }

      results.push({
        slug: app.slug,
        file: screenFile.file,
        inputPath,
        outputPath,
        publicPath: outputPublicPath,
        sourcePublicPath,
        sourceWidth: screenFile.width,
        sourceHeight: screenFile.height,
        targetWidth: targetSize.width,
        targetHeight: targetSize.height,
      });
      upscaledCount += 1;
    }

    if (upscaledCount === 0) {
      results.push({
        slug: app.slug,
        file: null,
        skipped: true,
      });
    }
  }

  const output = {
    schema: '1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalApps: apps.length,
      upscaledScreenshots: results.filter((entry) => entry.file).length,
    },
    results,
  };

  await writeFile(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Upscale report → ${OUT_PATH}`);
  console.log(`Upscaled screenshots: ${output.summary.upscaledScreenshots}`);
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
