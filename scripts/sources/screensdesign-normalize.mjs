/**
 * screensdesign-normalize.mjs
 *
 * Phase 2: Normalization
 *
 * Reads raw intake and discovery data, then produces a canonical entity set
 * at data/curation/normalized/screensdesign-normalized.json.
 *
 * Source priority:
 *   1. App-detail candidates in the raw intake JSON (if any)
 *   2. App seeds in the discovery JSON (fallback when intake has no app routes)
 *   3. Full sitemap fetch when --full flag is passed
 *
 * Usage:
 *   node scripts/sources/screensdesign-normalize.mjs
 *   node scripts/sources/screensdesign-normalize.mjs --full
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const INTAKE_PATH = path.join(projectRoot, 'data', 'curation', 'raw', 'screensdesign-intake.json');
const DISCOVERY_PATH = path.join(projectRoot, 'data', 'curation', 'coverage', 'screensdesign-discovery.json');
const OUT_DIR = path.join(projectRoot, 'data', 'curation', 'normalized');
const OUT_PATH = path.join(OUT_DIR, 'screensdesign-normalized.json');

const SITEMAP_URL = 'https://screensdesign.com/sitemap.xml';
const USER_AGENT = 'LuxuryUI Source Intake Bot/1.0 (+https://luxuryuilib.com)';

const APP_ROUTE_RE = /^\/apps\/([^/]+)\/?$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const slugToDisplayName = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const extractSlug = (url) => {
  const pathname = new URL(url).pathname;
  const m = APP_ROUTE_RE.exec(pathname);
  return m ? m[1] : null;
};

const buildEntity = (url, fetchedAt) => {
  const slug = extractSlug(url);
  if (!slug) return null;

  return {
    id: `screensdesign:${slug}`,
    canonicalSlug: slug,
    displayName: slugToDisplayName(slug),
    platform: ['iOS'],
    normalizationStatus: 'slug-only',
    sourceRoutes: [url],
    provenance: {
      sourceUrl: url,
      sourceType: 'screensdesign',
      fetchedAt,
      appIdentifier: slug,
    },
  };
};

// ---------------------------------------------------------------------------
// Source: intake JSON
// ---------------------------------------------------------------------------

const loadFromIntake = async () => {
  const raw = JSON.parse(await readFile(INTAKE_PATH, 'utf8'));
  const candidates = (raw.routeCandidates ?? []).filter(
    (r) => r.type === 'app-detail-candidate',
  );
  return { routes: candidates.map((r) => r.url), fetchedAt: raw.fetchedAt };
};

// ---------------------------------------------------------------------------
// Source: discovery seeds (fallback)
// ---------------------------------------------------------------------------

const loadFromDiscovery = async () => {
  const raw = JSON.parse(await readFile(DISCOVERY_PATH, 'utf8'));
  const seeds = raw.seeds?.appDetailSample ?? [];
  return {
    routes: seeds.map((s) => s.url),
    fetchedAt: raw.discoveredAt,
  };
};

// ---------------------------------------------------------------------------
// Source: full sitemap fetch (--full flag)
// ---------------------------------------------------------------------------

const loadFromSitemap = async () => {
  console.log('Fetching sitemap…');
  const res = await fetch(SITEMAP_URL, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/xml,text/xml,*/*' },
  });
  if (!res.ok) throw new Error(`Sitemap fetch failed (${res.status})`);
  const xml = await res.text();

  const fetchedAt = new Date().toISOString();
  const locRe = /<loc>(https:\/\/screensdesign\.com[^<]+)<\/loc>/g;
  const routes = [];
  let m;
  while ((m = locRe.exec(xml))) {
    if (APP_ROUTE_RE.test(new URL(m[1]).pathname)) {
      routes.push(m[1]);
    }
  }
  console.log(`Sitemap: found ${routes.length} app-detail routes.`);
  return { routes, fetchedAt };
};

// ---------------------------------------------------------------------------
// Normalize and deduplicate
// ---------------------------------------------------------------------------

const normalize = (routes, fetchedAt) => {
  const bySlug = new Map();
  const rejected = [];

  for (const url of routes) {
    const entity = buildEntity(url, fetchedAt);
    if (!entity) {
      rejected.push({ url, reason: 'could not extract slug' });
      continue;
    }

    if (bySlug.has(entity.id)) {
      // Merge duplicate routes
      bySlug.get(entity.id).sourceRoutes.push(url);
    } else {
      bySlug.set(entity.id, entity);
    }
  }

  return { entities: [...bySlug.values()], rejected };
};

// ---------------------------------------------------------------------------
// Validate provenance against rubric required fields
// ---------------------------------------------------------------------------

const REQUIRED_PROVENANCE = ['sourceUrl', 'sourceType', 'fetchedAt', 'appIdentifier'];

const validateProvenance = (entity) => {
  const missing = REQUIRED_PROVENANCE.filter((f) => !entity.provenance[f]);
  return missing.length === 0 ? null : missing;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const run = async () => {
  const fullSitemap = process.argv.includes('--full');

  let routes;
  let fetchedAt;
  let sourceDescription;

  if (fullSitemap) {
    ({ routes, fetchedAt } = await loadFromSitemap());
    sourceDescription = 'full-sitemap';
  } else {
    const intakeData = await loadFromIntake();
    if (intakeData.routes.length > 0) {
      ({ routes, fetchedAt } = intakeData);
      sourceDescription = 'intake-app-detail-candidates';
      console.log(`Using ${routes.length} app-detail candidates from intake.`);
    } else {
      ({ routes, fetchedAt } = await loadFromDiscovery());
      sourceDescription = 'discovery-seeds';
      console.log(
        `Intake has no app-detail candidates (SPA limitation). Falling back to ${routes.length} discovery seeds.`,
      );
    }
  }

  const normalizedAt = new Date().toISOString();
  const { entities, rejected } = normalize(routes, fetchedAt);

  const validationErrors = [];
  for (const entity of entities) {
    const missing = validateProvenance(entity);
    if (missing) {
      validationErrors.push({ id: entity.id, missingProvenanceFields: missing });
    }
  }

  const duplicatesMerged = entities.filter((e) => e.sourceRoutes.length > 1).length;

  const output = {
    schema: '1',
    source: 'screensdesign',
    normalizedAt,
    sourceDescription,
    summary: {
      inputRoutes: routes.length,
      entitiesProduced: entities.length,
      duplicatesMerged,
      rejected: rejected.length,
      validationErrors: validationErrors.length,
    },
    entities,
    report: {
      validationErrors,
      rejectedRoutes: rejected,
      warnings:
        sourceDescription === 'discovery-seeds'
          ? [
              'Normalized from discovery seeds only. Run with --full to normalize the complete sitemap (2369 apps). Detail-page enrichment (screenshots, category, platform) is pending until scraper runs.',
            ]
          : [],
    },
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`\nNormalized ${entities.length} entities → ${OUT_PATH}`);
  console.log(`  source:           ${sourceDescription}`);
  console.log(`  input routes:     ${routes.length}`);
  console.log(`  entities:         ${entities.length}`);
  console.log(`  duplicates merged:${duplicatesMerged}`);
  console.log(`  rejected:         ${rejected.length}`);
  console.log(`  validation errors:${validationErrors.length}`);
  if (output.report.warnings.length > 0) {
    for (const w of output.report.warnings) console.warn(`  ⚠  ${w}`);
  }
};

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
