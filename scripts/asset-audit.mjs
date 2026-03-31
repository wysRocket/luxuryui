import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { APP_NAMES_BY_CATEGORY } from '../data/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');
const args = new Set(process.argv.slice(2));

const MIN_SCREENSHOTS = 6;
const TARGET_SCREENSHOTS = 8;
const MIN_LOGO_SIZE = 96;
const MIN_SCREENSHOT_WIDTH = 320;
const MIN_SCREENSHOT_HEIGHT = 480;

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isImage = (fileName) => /\.(jpe?g|png|webp)$/i.test(fileName);

const getMetadata = async (filePath) => {
  try {
    const meta = await sharp(filePath, { failOnError: false }).metadata();
    return {
      width: meta.width || 0,
      height: meta.height || 0,
      format: meta.format || 'unknown',
    };
  } catch {
    return {
      width: 0,
      height: 0,
      format: 'unknown',
    };
  }
};

const hashFile = async (filePath) => {
  const buffer = await readFile(filePath);
  return createHash('sha1').update(buffer).digest('hex');
};

const printList = (label, items) => {
  if (items.length === 0) return;
  console.log(`${label} (${items.length})`);
  for (const item of items) {
    console.log(`- ${item}`);
  }
  console.log('');
};

const run = async () => {
  const expectedApps = [...new Set(Object.values(APP_NAMES_BY_CATEGORY).flat())].sort((a, b) => a.localeCompare(b));
  const expectedSlugs = new Map(expectedApps.map((name) => [name, slugify(name)]));
  const assetDirs = (await readdir(assetsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const realAssetsModule = await import(pathToFileURL(path.join(projectRoot, 'data', 'realAppAssets.ts')).href);
  const realAssets = realAssetsModule.REAL_APP_ASSETS || {};

  const missingDirectories = [];
  const missingLogos = [];
  const belowMinimum = [];
  const belowTarget = [];
  const brokenFiles = [];
  const undersizedLogos = [];
  const undersizedScreens = [];
  const duplicateScreens = [];
  const provenanceGaps = [];
  const mapCoverageGaps = [];

  let appsMeetingMinimum = 0;
  let appsMeetingTarget = 0;

  for (const appName of expectedApps) {
    const slug = expectedSlugs.get(appName);
    const dir = path.join(assetsRoot, slug);

    let files;
    try {
      files = (await readdir(dir)).filter(isImage);
    } catch {
      missingDirectories.push(`${appName} -> ${slug}`);
      continue;
    }

    const logoFile = files.find((file) => file.startsWith('logo.'));
    const screenFiles = files
      .filter((file) => file.startsWith('screen-'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const assetEntry = realAssets[appName];
    if (!assetEntry) {
      mapCoverageGaps.push(appName);
    } else if (!assetEntry.source || assetEntry.source === 'local-cache') {
      provenanceGaps.push(appName);
    }

    if (!logoFile) {
      missingLogos.push(appName);
    } else {
      const logoPath = path.join(dir, logoFile);
      const meta = await getMetadata(logoPath);
      if (!meta.width || !meta.height) {
        brokenFiles.push(`${appName}: ${logoFile}`);
      } else if (meta.width < MIN_LOGO_SIZE || meta.height < MIN_LOGO_SIZE) {
        undersizedLogos.push(`${appName}: ${logoFile} (${meta.width}x${meta.height})`);
      }
    }

    if (screenFiles.length >= MIN_SCREENSHOTS) {
      appsMeetingMinimum += 1;
    } else {
      belowMinimum.push(`${appName}: ${screenFiles.length}`);
    }

    if (screenFiles.length >= TARGET_SCREENSHOTS) {
      appsMeetingTarget += 1;
    } else {
      belowTarget.push(`${appName}: ${screenFiles.length}`);
    }

    const hashes = new Map();
    for (const fileName of screenFiles) {
      const filePath = path.join(dir, fileName);
      const meta = await getMetadata(filePath);

      if (!meta.width || !meta.height) {
        brokenFiles.push(`${appName}: ${fileName}`);
        continue;
      }

      if (meta.width < MIN_SCREENSHOT_WIDTH || meta.height < MIN_SCREENSHOT_HEIGHT) {
        undersizedScreens.push(`${appName}: ${fileName} (${meta.width}x${meta.height})`);
      }

      const hash = await hashFile(filePath);
      if (hashes.has(hash)) {
        duplicateScreens.push(`${appName}: ${fileName} duplicates ${hashes.get(hash)}`);
      } else {
        hashes.set(hash, fileName);
      }
    }
  }

  const expectedSlugSet = new Set(expectedSlugs.values());
  const unexpectedDirectories = assetDirs.filter((slug) => !expectedSlugSet.has(slug));

  const summary = {
    expectedApps: expectedApps.length,
    mappedApps: Object.keys(realAssets).length,
    assetDirectories: assetDirs.length,
    appsMeetingMinimum,
    appsMeetingTarget,
    minimumScreenshotCount: MIN_SCREENSHOTS,
    targetScreenshotCount: TARGET_SCREENSHOTS,
    missingDirectories: missingDirectories.length,
    unexpectedDirectories: unexpectedDirectories.length,
    missingLogos: missingLogos.length,
    belowMinimum: belowMinimum.length,
    belowTarget: belowTarget.length,
    brokenFiles: brokenFiles.length,
    undersizedLogos: undersizedLogos.length,
    undersizedScreens: undersizedScreens.length,
    duplicateScreens: duplicateScreens.length,
    provenanceGaps: provenanceGaps.length,
    mapCoverageGaps: mapCoverageGaps.length,
  };

  const details = {
    missingDirectories,
    unexpectedDirectories,
    missingLogos,
    belowMinimum,
    belowTarget,
    brokenFiles,
    undersizedLogos,
    undersizedScreens,
    duplicateScreens,
    provenanceGaps,
    mapCoverageGaps,
  };

  if (args.has('--json')) {
    console.log(JSON.stringify({ summary, details }, null, 2));
  } else {
    console.log('LuxuryUI Asset Audit');
    console.log('');
    for (const [key, value] of Object.entries(summary)) {
      console.log(`${key}: ${value}`);
    }
    console.log('');

    printList('Missing directories', missingDirectories);
    printList('Unexpected directories', unexpectedDirectories);
    printList('Missing logos', missingLogos);
    printList(`Apps below minimum screenshot count (${MIN_SCREENSHOTS})`, belowMinimum);
    printList(`Apps below target screenshot count (${TARGET_SCREENSHOTS})`, belowTarget);
    printList('Broken files', brokenFiles);
    printList('Undersized logos', undersizedLogos);
    printList('Undersized screenshots', undersizedScreens);
    printList('Exact duplicate screenshots', duplicateScreens);
    printList('Provenance gaps', provenanceGaps);
    printList('Map coverage gaps', mapCoverageGaps);
  }

  const hasBlockingIssues = [
    missingDirectories,
    unexpectedDirectories,
    missingLogos,
    belowMinimum,
    brokenFiles,
    duplicateScreens,
    provenanceGaps,
    mapCoverageGaps,
  ].some((items) => items.length > 0);

  if (args.has('--strict') && hasBlockingIssues) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
