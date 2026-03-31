/**
 * screensdesign-flow-packs.mjs
 *
 * Phase 3: Flow Tagging
 *
 * Maps approved local-asset apps to flow definitions, producing a structured
 * set of flow packs with step metadata and confidence scores.
 *
 * Writes: data/curation/flows/screensdesign-flow-packs.json
 *
 * Usage:
 *   node scripts/sources/screensdesign-flow-packs.mjs
 */

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// We import catalog.js as an ES module (it exports ES-style)
import { APP_NAMES_BY_CATEGORY } from '../../data/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const APPS_DIR = path.join(projectRoot, 'public', 'assets', 'apps');
const FLOWS_DIR = path.join(projectRoot, 'data', 'curation', 'flows');
const OUT_PATH = path.join(FLOWS_DIR, 'screensdesign-flow-packs.json');

// ---------------------------------------------------------------------------
// Flow definitions (mirrors data/flows.ts FLOW_DEFINITIONS)
// ---------------------------------------------------------------------------

const FLOW_DEFINITIONS = [
  {
    id: 'onboarding',
    title: 'Onboarding Flow',
    description: 'How leading apps introduce value, collect intent, and drive first successful action.',
    categories: ['Finance', 'Health', 'Education', 'Business'],
    objective: 'Reduce time-to-value in the first session.',
    steps: ['Welcome & Value Proposition', 'Permission Setup', 'Personalization', 'Activation Event', 'Completion State'],
  },
  {
    id: 'checkout',
    title: 'Checkout Flow',
    description: 'Browse-to-buy progression with cart clarity, payment confidence, and low-friction confirmation.',
    categories: ['Shopping', 'Travel', 'Finance'],
    objective: 'Increase conversion while minimizing abandonment.',
    steps: ['Cart Review', 'Shipping & Contact', 'Payment Selection', 'Order Summary', 'Confirmation'],
  },
  {
    id: 'search-discovery',
    title: 'Search & Discovery Flow',
    description: 'Pattern sequence for query entry, filtering, ranking, and result confidence.',
    categories: ['Shopping', 'News', 'Travel', 'Music'],
    objective: 'Improve findability with fewer query reformulations.',
    steps: ['Query Entry', 'Contextual Suggestions', 'Filter & Sort', 'Result Scanning', 'Detail Drilldown'],
  },
  {
    id: 'social-engagement',
    title: 'Social Engagement Flow',
    description: 'Interaction loops for feed browsing, content creation, reactions, and retention touchpoints.',
    categories: ['Social', 'Music', 'News'],
    objective: 'Maximize meaningful engagement per session.',
    steps: ['Feed Entry', 'Post Consumption', 'Reaction / Reply', 'Creation Prompt', 'Notification Return'],
  },
  {
    id: 'account-settings',
    title: 'Account & Settings Flow',
    description: 'Secure profile management, privacy controls, and account maintenance states.',
    categories: ['Business', 'Finance', 'Social', 'Health'],
    objective: 'Make account control clear and trustworthy.',
    steps: ['Profile Overview', 'Personal Data Edit', 'Privacy Controls', 'Security Action', 'Saved Success State'],
  },
  {
    id: 'subscription-upgrade',
    title: 'Subscription Upgrade Flow',
    description: 'Monetization journey from plan discovery to successful upgrade completion.',
    categories: ['Business', 'Music', 'Education', 'Health'],
    objective: 'Increase plan upgrade conversion with transparent value framing.',
    steps: ['Plan Comparison', 'Feature Value Reinforcement', 'Billing Selection', 'Payment & Confirmation', 'Post-Upgrade State'],
  },
];

// ---------------------------------------------------------------------------
// Name → slug
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
// Discover which apps have local assets
// ---------------------------------------------------------------------------

const getLocalAssets = async () => {
  const entries = await readdir(APPS_DIR, { withFileTypes: true });
  const appDirs = new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name));

  const assets = new Map(); // slug → { slug, screenshots, hasLogo }

  for (const slug of appDirs) {
    const files = await readdir(path.join(APPS_DIR, slug));
    const screenshots = files
      .filter((f) => /^screen-\d+\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()
      .map((f) => `/assets/apps/${slug}/${f}`);
    const hasLogo = files.some((f) => /^logo\.(jpg|jpeg|png|webp)$/i.test(f));
    const logo = hasLogo ? `/assets/apps/${slug}/${files.find((f) => /^logo\./i.test(f))}` : null;

    assets.set(slug, { slug, screenshots, logo });
  }

  return assets;
};

// ---------------------------------------------------------------------------
// Build a reverse map: slug → { name, category }
// ---------------------------------------------------------------------------

const buildCatalogIndex = () => {
  const index = new Map(); // slug → { name, category }
  for (const [category, names] of Object.entries(APP_NAMES_BY_CATEGORY)) {
    for (const name of names) {
      index.set(nameToSlug(name), { name, category });
    }
  }
  return index;
};

// ---------------------------------------------------------------------------
// Build a flow pack
// ---------------------------------------------------------------------------

const buildPack = (flow, catalogIndex, localAssets, minScreenshots = 6) => {
  const appEntries = [];

  for (const [slug, appInfo] of catalogIndex) {
    if (!flow.categories.includes(appInfo.category)) continue;
    const assets = localAssets.get(slug);
    if (!assets) continue;

    const confidence = assets.screenshots.length >= minScreenshots ? 'high' : 'low';
    if (confidence === 'low') continue; // quarantine low-confidence per Phase 3 spec

    appEntries.push({
      name: appInfo.name,
      slug,
      category: appInfo.category,
      confidence,
      screenshotCount: assets.screenshots.length,
      logo: assets.logo,
      screenshots: assets.screenshots,
    });
  }

  // Sort: primary categories first, then alphabetically
  appEntries.sort((a, b) => {
    const ai = flow.categories.indexOf(a.category);
    const bi = flow.categories.indexOf(b.category);
    if (ai !== bi) return ai - bi;
    return a.name.localeCompare(b.name);
  });

  const totalScreenshots = appEntries.reduce((s, a) => s + a.screenshotCount, 0);

  return {
    flowId: flow.id,
    title: flow.title,
    description: flow.description,
    objective: flow.objective,
    categories: flow.categories,
    steps: flow.steps,
    apps: appEntries,
    coverage: {
      appCount: appEntries.length,
      screenshotCount: totalScreenshots,
      highConfidence: appEntries.filter((a) => a.confidence === 'high').length,
      lowConfidenceQuarantined: 0, // already excluded above
    },
    status: appEntries.length >= 2 ? 'ready' : 'insufficient-coverage',
  };
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const run = async () => {
  const localAssets = await getLocalAssets();
  const catalogIndex = buildCatalogIndex();

  console.log(`Local app dirs: ${localAssets.size}`);
  console.log(`Catalog entries: ${catalogIndex.size}`);

  // Match catalog entries to local dirs
  let matched = 0;
  for (const slug of catalogIndex.keys()) {
    if (localAssets.has(slug)) matched++;
  }
  console.log(`Catalog↔local matches: ${matched}`);

  const packs = FLOW_DEFINITIONS.map((flow) =>
    buildPack(flow, catalogIndex, localAssets),
  );

  const ready = packs.filter((p) => p.status === 'ready').length;
  const insufficient = packs.filter((p) => p.status === 'insufficient-coverage').length;

  const output = {
    schema: '1',
    generatedAt: new Date().toISOString(),
    source: 'local-assets',
    note: 'Flow packs are built from locally verified assets. Screenshot-level step labeling requires scraper detail data (Phase 3 scraper run).',
    summary: {
      totalFlows: packs.length,
      ready,
      insufficientCoverage: insufficient,
    },
    packs,
  };

  await mkdir(FLOWS_DIR, { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`\nFlow packs → ${OUT_PATH}`);
  for (const p of packs) {
    const icon = p.status === 'ready' ? '✓' : '✗';
    console.log(`  ${icon} ${p.flowId}: ${p.coverage.appCount} apps, ${p.coverage.screenshotCount} screenshots`);
  }
};

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
