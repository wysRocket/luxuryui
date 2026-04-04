import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  derivePublishAssetOrigin,
  selectPublishScreenshotPaths,
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
const RUBRIC_PATH = path.join(projectRoot, 'config', 'quality', 'asset-rubric.json');
const PUBLISH_READY_DIR = path.join(projectRoot, 'public', 'assets', 'publish-ready', 'apps');
const OUT_DIR = path.join(projectRoot, 'data', 'curation', 'coverage');
const OUT_PATH = path.join(OUT_DIR, 'screensdesign-publish-quality-report.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const isImage = (f) => IMAGE_EXTS.has(path.extname(f).toLowerCase());
const isLogo = (f) => path.basename(f, path.extname(f)).toLowerCase() === 'logo';
const publicPathToFsPath = (publicPath) =>
  path.join(projectRoot, 'public', publicPath.replace(/^\//, ''));

const sha256 = async (filePath) => {
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
};

const getDimensions = async (filePath) => {
  try {
    const meta = await sharp(filePath).metadata();
    return { width: meta.width ?? 0, height: meta.height ?? 0 };
  } catch {
    return null;
  }
};

const readPublishDirFiles = async (slug) => {
  const publishDir = path.join(PUBLISH_READY_DIR, slug);
  try {
    return (await readdir(publishDir)).filter(isImage);
  } catch {
    return [];
  }
};

export const auditPublishApp = async ({ rawApp, rubric, publishDirFiles }) => {
  const issues = [];
  const warnings = [];

  const publishLogoOverride = publishDirFiles.find(isLogo);
  const rawLogoPath = rawApp.logo?.file
    ? `/assets/apps/${rawApp.slug}/${rawApp.logo.file}`
    : null;
  const publishLogoPath = publishLogoOverride
    ? `/assets/publish-ready/apps/${rawApp.slug}/${publishLogoOverride}`
    : rawLogoPath;

  let logoResult = null;
  if (!publishLogoPath) {
    issues.push('missing logo');
    logoResult = { file: null, status: 'fail', reason: 'not found' };
  } else {
    const dims = await getDimensions(publicPathToFsPath(publishLogoPath));
    if (!dims) {
      issues.push(`logo unreadable: ${publishLogoPath}`);
      logoResult = { file: publishLogoPath, status: 'fail', reason: 'unreadable' };
    } else {
      const minW = rubric.assets.logo.minWidth;
      const minH = rubric.assets.logo.minHeight;
      const dimOk = dims.width >= minW && dims.height >= minH;
      logoResult = {
        file: path.basename(publishLogoPath),
        publicPath: publishLogoPath,
        width: dims.width,
        height: dims.height,
        status: dimOk ? 'pass' : 'warn',
        sourceOrigin: publishLogoOverride ? 'rescued' : 'raw',
      };

      if (!dimOk) {
        warnings.push(`logo under min size ${minW}×${minH}: ${dims.width}×${dims.height}`);
      }
    }
  }

  const rawScreenshotFiles = (rawApp.screenshots?.files ?? []).map((file) => file.file);
  const selectedPublicPaths = selectPublishScreenshotPaths({
    slug: rawApp.slug,
    rawScreenshotFiles,
    publishDirFiles,
  });

  const screenResults = [];
  const hashMap = new Map();
  const duplicates = [];

  for (const publicPath of selectedPublicPaths) {
    const filePath = publicPathToFsPath(publicPath);
    const dims = await getDimensions(filePath);
    const fileName = path.basename(publicPath);

    if (!dims) {
      screenResults.push({ file: fileName, publicPath, status: 'fail', reason: 'unreadable' });
      issues.push(`screenshot unreadable: ${fileName}`);
      continue;
    }

    const hash = await sha256(filePath);
    const pw = rubric.assets.screenshots.minWidth;
    const ph = rubric.assets.screenshots.minHeight;
    const dimOk = dims.width >= pw && dims.height >= ph;

    let status = 'pass';
    let reason;

    if (!dimOk) {
      status = 'warn';
      reason = `under min ${pw}×${ph}: ${dims.width}×${dims.height}`;
      warnings.push(`${fileName} ${reason}`);
    }

    if (hashMap.has(hash)) {
      duplicates.push({ file: fileName, duplicateOf: hashMap.get(hash) });
      status = 'fail';
      reason = `exact duplicate of ${hashMap.get(hash)}`;
      issues.push(`duplicate screenshot: ${fileName} = ${hashMap.get(hash)}`);
    } else {
      hashMap.set(hash, fileName);
    }

    const sourceOrigin = publicPath.includes('/publish-ready/')
      ? fileName.startsWith('rescue-screen-')
        ? 'rescued'
        : 'upscaled'
      : 'raw';

    screenResults.push({
      file: fileName,
      publicPath,
      width: dims.width,
      height: dims.height,
      hash,
      status,
      sourceOrigin,
      ...(reason ? { reason } : {}),
    });
  }

  const minCount = rubric.assets.screenshots.minimumCount;
  const targetCount = rubric.assets.screenshots.targetCount;
  const validScreens = screenResults.filter((screen) => screen.status !== 'fail');

  let countStatus = 'pass';
  if (validScreens.length < minCount) {
    countStatus = 'fail';
    issues.push(`insufficient screenshots: ${validScreens.length} < ${minCount} required`);
  } else if (validScreens.length < targetCount) {
    countStatus = 'warn';
    warnings.push(`below target: ${validScreens.length} < ${targetCount} target`);
  }

  const status = issues.length > 0 ? 'fail' : warnings.length > 0 ? 'warn' : 'pass';
  const blockingWarnings = warnings.filter((warning) => !warning.startsWith('below target:'));
  const publishReadyForSale = issues.length === 0 && blockingWarnings.length === 0;

  return {
    slug: rawApp.slug,
    sourceStatus: rawApp.status,
    status,
    publishReadyForSale,
    publishAssetOrigin: derivePublishAssetOrigin(selectedPublicPaths),
    logo: logoResult,
    screenshots: {
      count: selectedPublicPaths.length,
      validCount: validScreens.length,
      countStatus,
      duplicates,
      files: screenResults,
    },
    blockingWarnings,
    issues,
    warnings,
  };
};

export const run = async () => {
  const [qualityReport, rubric] = await Promise.all([
    readFile(QUALITY_REPORT_PATH, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(RUBRIC_PATH, 'utf8').then((raw) => JSON.parse(raw)),
  ]);

  const apps = [];
  for (const rawApp of qualityReport.apps) {
    const publishDirFiles = await readPublishDirFiles(rawApp.slug);
    apps.push(await auditPublishApp({ rawApp, rubric, publishDirFiles }));
  }

  const passed = apps.filter((app) => app.status === 'pass').length;
  const warned = apps.filter((app) => app.status === 'warn').length;
  const failed = apps.filter((app) => app.status === 'fail').length;

  const output = {
    schema: '1',
    auditedAt: new Date().toISOString(),
    rubricVersion: String(rubric.version),
    summary: {
      total: apps.length,
      passed,
      warned,
      failed,
      passRate: `${((passed / apps.length) * 100).toFixed(1)}%`,
    },
    failedApps: apps.filter((app) => app.status === 'fail').map((app) => app.slug),
    warnedApps: apps.filter((app) => app.status === 'warn').map((app) => app.slug),
    apps,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Publish-quality report → ${OUT_PATH}`);
  console.log(`  passed: ${passed}  warned: ${warned}  failed: ${failed}  (${output.summary.passRate} pass rate)`);
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
