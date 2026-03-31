/**
 * screensdesign-sync-assets.mjs
 *
 * Phase 4: Frontend Integration
 *
 * Regenerates data/realAppAssets.ts from the Phase 3 quality report.
 * Only apps that passed or warned are included; failed apps (insufficient
 * screenshots, duplicates, unreadable) are excluded from the frontend data.
 *
 * Run this after the integrity audit to keep the frontend in sync with
 * the pipeline outputs.
 *
 * Writes: data/realAppAssets.ts
 *
 * Usage:
 *   node scripts/sources/screensdesign-sync-assets.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_NAMES_BY_CATEGORY } from '../../data/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const QUALITY_REPORT_PATH = path.join(
  projectRoot,
  'data',
  'curation',
  'coverage',
  'screensdesign-quality-report.json',
);
const OUT_PATH = path.join(projectRoot, 'data', 'realAppAssets.ts');

// ---------------------------------------------------------------------------
// Name → slug (must match screensdesign-flow-packs.mjs)
// ---------------------------------------------------------------------------

const nameToSlug = (name) =>
  name
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// ---------------------------------------------------------------------------
// Build slug → display name index from catalog
// ---------------------------------------------------------------------------

const buildSlugToNameIndex = () => {
  const index = new Map();
  for (const names of Object.values(APP_NAMES_BY_CATEGORY)) {
    for (const name of names) {
      index.set(nameToSlug(name), name);
    }
  }
  return index;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const run = async () => {
  const report = JSON.parse(await readFile(QUALITY_REPORT_PATH, 'utf8'));
  const slugToName = buildSlugToNameIndex();

  const included = [];
  const excluded = [];
  const unknown = [];

  for (const appReport of report.apps) {
    const { slug, status, logo, screenshots } = appReport;

    if (status === 'fail') {
      excluded.push({ slug, reason: 'quality-fail' });
      continue;
    }

    const name = slugToName.get(slug);
    if (!name) {
      unknown.push(slug);
      continue; // spurious directory not in catalog
    }

    // Logo path
    const logoPath =
      logo?.file ? `/assets/apps/${slug}/${logo.file}` : null;

    if (!logoPath) {
      excluded.push({ slug, reason: 'missing-logo' });
      continue;
    }

    // Valid screenshot paths (exclude individually failed screens)
    const screenshotPaths = (screenshots.files ?? [])
      .filter((f) => f.status !== 'fail')
      .map((f) => `/assets/apps/${slug}/${f.file}`);

    included.push({ name, slug, logo: logoPath, screenshots: screenshotPaths });
  }

  // Sort by app name for deterministic output
  included.sort((a, b) => a.name.localeCompare(b.name));

  // ---------------------------------------------------------------------------
  // Generate TypeScript source
  // ---------------------------------------------------------------------------

  const entries = included.map(({ name, logo, screenshots }) => {
    const screensStr = screenshots
      .map((s) => `      ${JSON.stringify(s)}`)
      .join(',\n');

    return [
      `  ${JSON.stringify(name)}: {`,
      `    "logo": ${JSON.stringify(logo)},`,
      `    "screenshots": [\n${screensStr}\n    ],`,
      `    "source": "local-cache"`,
      `  }`,
    ].join('\n');
  });

  const ts = [
    `export interface RealAppAsset {`,
    `  logo: string;`,
    `  screenshots: string[];`,
    `  source: string;`,
    `}`,
    ``,
    `export const REAL_APP_ASSETS: Record<string, RealAppAsset> = {`,
    entries.join(',\n'),
    `};`,
    ``,
  ].join('\n');

  await writeFile(OUT_PATH, ts);

  console.log(`\nrealAppAssets.ts → ${OUT_PATH}`);
  console.log(`  included: ${included.length} apps`);
  console.log(`  excluded (fail): ${excluded.filter((e) => e.reason === 'quality-fail').map((e) => e.slug).join(', ') || 'none'}`);
  console.log(`  skipped (not in catalog): ${unknown.join(', ') || 'none'}`);
};

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
