import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  downloadImage,
  extFromUrl,
  fetchFromGooglePlay,
  fetchFromItunes,
  slugify,
} from '../fetch-real-assets.mjs';
import { APP_NAMES_BY_CATEGORY } from '../../data/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const RESCUE_REPORT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-rescue-report.json',
);
const RAW_ASSETS_DIR = path.join(projectRoot, 'public', 'assets', 'apps');
const PUBLISH_READY_DIR = path.join(projectRoot, 'public', 'assets', 'publish-ready', 'apps');
const MANUAL_RESCUE_DIR = path.join(projectRoot, 'data', 'curation', 'rescue-assets');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const isImage = (file) => IMAGE_EXTS.has(path.extname(file).toLowerCase());
const dedupe = (values = []) => [...new Set(values.filter(Boolean))];

const slugToName = Object.fromEntries(
  Object.values(APP_NAMES_BY_CATEGORY)
    .flat()
    .map((name) => [slugify(name), name]),
);

const parseOnlyArg = (argv = process.argv.slice(2)) => {
  const onlyArg = argv.find((arg) => arg.startsWith('--only='));
  return onlyArg ? onlyArg.slice('--only='.length) : null;
};

const sha256 = async (filePath) => {
  const buffer = await readFile(filePath);
  return createHash('sha256').update(buffer).digest('hex');
};

const listExistingHashes = async (dirPath) => {
  try {
    const files = (await readdir(dirPath)).filter(isImage);
    const hashes = new Set();
    for (const fileName of files) {
      hashes.add(await sha256(path.join(dirPath, fileName)));
    }
    return hashes;
  } catch {
    return new Set();
  }
};

const nextRescueFileName = async (dirPath, ext) => {
  let index = 1;
  try {
    const files = await readdir(dirPath);
    const rescueFiles = files
      .filter((file) => /^rescue-screen-\d+\./i.test(file))
      .map((file) => Number(file.match(/^rescue-screen-(\d+)\./i)?.[1] ?? 0));
    if (rescueFiles.length > 0) {
      index = Math.max(...rescueFiles) + 1;
    }
  } catch {
    index = 1;
  }

  return `rescue-screen-${index}${ext}`;
};

const loadCandidateScreenshotUrls = async (appName) => {
  const [itunesResult, googlePlayResult] = await Promise.allSettled([
    fetchFromItunes(appName),
    fetchFromGooglePlay(appName),
  ]);

  return dedupe([
    ...(itunesResult.status === 'fulfilled' ? itunesResult.value?.screenshots ?? [] : []),
    ...(googlePlayResult.status === 'fulfilled' ? googlePlayResult.value?.screenshots ?? [] : []),
  ]);
};

const addFetchedScreenshots = async ({ appName, missingScreenshots, outputDir, existingHashes }) => {
  let added = 0;
  const screenshotUrls = await loadCandidateScreenshotUrls(appName);

  if (screenshotUrls.length === 0) {
    return added;
  }

  for (const screenshotUrl of screenshotUrls) {
    if (added >= missingScreenshots) {
      break;
    }

    const ext = extFromUrl(screenshotUrl);
    const tempName = `.__rescue_tmp__${Date.now()}_${added}${ext}`;
    const tempPath = path.join(outputDir, tempName);
    await downloadImage(screenshotUrl, tempPath);
    const hash = await sha256(tempPath);

    if (existingHashes.has(hash)) {
      await unlink(tempPath).catch(() => {});
      continue;
    }

    const finalName = await nextRescueFileName(outputDir, ext);
    const finalPath = path.join(outputDir, finalName);
    await rename(tempPath, finalPath).catch(async () => {
      await copyFile(tempPath, finalPath);
      await unlink(tempPath).catch(() => {});
    });
    existingHashes.add(hash);
    added += 1;
  }

  return added;
};

const addManualScreenshots = async ({ slug, missingScreenshots, outputDir, existingHashes }) => {
  const manualDir = path.join(MANUAL_RESCUE_DIR, slug);
  let added = 0;

  try {
    const files = (await readdir(manualDir)).filter(isImage).sort();

    for (const fileName of files) {
      if (added >= missingScreenshots) {
        break;
      }

      const sourcePath = path.join(manualDir, fileName);
      const hash = await sha256(sourcePath);

      if (existingHashes.has(hash)) {
        continue;
      }

      const finalName = await nextRescueFileName(outputDir, path.extname(fileName));
      await copyFile(sourcePath, path.join(outputDir, finalName));
      existingHashes.add(hash);
      added += 1;
    }
  } catch {
    return added;
  }

  return added;
};

export const run = async ({ only = parseOnlyArg() } = {}) => {
  const rescueReport = JSON.parse(await readFile(RESCUE_REPORT_PATH, 'utf8'));
  const candidates = only
    ? rescueReport.candidates.filter((candidate) => candidate.slug === only)
    : rescueReport.candidates;

  for (const candidate of candidates) {
    const outputDir = path.join(PUBLISH_READY_DIR, candidate.slug);
    await mkdir(outputDir, { recursive: true });

    const existingHashes = new Set([
      ...(await listExistingHashes(path.join(RAW_ASSETS_DIR, candidate.slug))),
      ...(await listExistingHashes(outputDir)),
    ]);

    const appName = slugToName[candidate.slug] ?? candidate.appName ?? candidate.slug;
    let remaining = candidate.missingScreenshots;

    try {
      const fetched = await addFetchedScreenshots({
        appName,
        missingScreenshots: remaining,
        outputDir,
        existingHashes,
      });
      remaining -= fetched;
    } catch {
      // Network fetch is best-effort; manual drop-in remains the fallback.
    }

    if (remaining > 0) {
      const manual = await addManualScreenshots({
        slug: candidate.slug,
        missingScreenshots: remaining,
        outputDir,
        existingHashes,
      });
      remaining -= manual;
    }

    console.log(`${candidate.slug}: added ${candidate.missingScreenshots - remaining}/${candidate.missingScreenshots} rescue screenshot(s)`);
  }
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
