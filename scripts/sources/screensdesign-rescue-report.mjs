import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_NAMES_BY_CATEGORY } from '../../data/catalog.js';
import { buildRescueCandidates } from './lib/publishAssetPipeline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const PUBLISH_QUALITY_REPORT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-publish-quality-report.json',
);
const RUBRIC_PATH = path.join(projectRoot, 'config', 'quality', 'asset-rubric.json');
const OUT_DIR = path.join(projectRoot, 'data', 'curation', 'coverage');
const OUT_PATH = path.join(OUT_DIR, 'screensdesign-rescue-report.json');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const slugToName = Object.fromEntries(
  Object.values(APP_NAMES_BY_CATEGORY)
    .flat()
    .map((name) => [slugify(name), name]),
);

export const run = async () => {
  const [publishReport, rubric] = await Promise.all([
    readFile(PUBLISH_QUALITY_REPORT_PATH, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(RUBRIC_PATH, 'utf8').then((raw) => JSON.parse(raw)),
  ]);

  const requiredCount = rubric.assets.screenshots.minimumCount;
  const candidates = buildRescueCandidates({
    publishApps: publishReport.apps,
    requiredCount,
  }).map((candidate) => ({
    ...candidate,
    appName: slugToName[candidate.slug] ?? candidate.slug,
    manualDropDir: `data/curation/rescue-assets/${candidate.slug}`,
    publishReadyDir: `public/assets/publish-ready/apps/${candidate.slug}`,
  }));

  const output = {
    schema: '1',
    generatedAt: new Date().toISOString(),
    requiredScreenshotCount: requiredCount,
    candidates,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Rescue report → ${OUT_PATH}`);
  console.log(`Sparse kits needing rescue: ${candidates.length}`);
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
