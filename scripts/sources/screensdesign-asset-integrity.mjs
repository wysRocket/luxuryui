/**
 * screensdesign-asset-integrity.mjs
 *
 * Phase 3: Asset Integrity
 *
 * Scans public/assets/apps/ and validates each app against the quality rubric:
 *   - Logo: required, min 96×96
 *   - Screenshots: min 6, min 320×480, no exact hash duplicates
 *
 * Writes: data/curation/coverage/screensdesign-quality-report.json
 *
 * Usage:
 *   node scripts/sources/screensdesign-asset-integrity.mjs
 */

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const APPS_DIR = path.join(projectRoot, 'public', 'assets', 'apps');
const RUBRIC_PATH = path.join(projectRoot, 'config', 'quality', 'asset-rubric.json');
const OUT_DIR = path.join(projectRoot, 'data', 'curation', 'coverage');
const OUT_PATH = path.join(OUT_DIR, 'screensdesign-quality-report.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const isImage = (f) => IMAGE_EXTS.has(path.extname(f).toLowerCase());
const isLogo = (f) => path.basename(f, path.extname(f)).toLowerCase() === 'logo';
const isScreen = (f) => /^screen-\d+$/i.test(path.basename(f, path.extname(f)));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Audit a single app directory
// ---------------------------------------------------------------------------

const auditApp = async (slug, rubric) => {
  const dir = path.join(APPS_DIR, slug);
  const entries = await readdir(dir);
  const imageFiles = entries.filter(isImage);

  const logoFiles = imageFiles.filter(isLogo);
  const screenFiles = imageFiles.filter(isScreen).sort();

  const issues = [];
  const warnings = [];

  // --- Logo ---
  let logoResult = null;
  if (logoFiles.length === 0) {
    issues.push('missing logo');
    logoResult = { file: null, status: 'fail', reason: 'not found' };
  } else {
    const logoFile = logoFiles[0];
    const logoPath = path.join(dir, logoFile);
    const dims = await getDimensions(logoPath);
    if (!dims) {
      issues.push(`logo unreadable: ${logoFile}`);
      logoResult = { file: logoFile, status: 'fail', reason: 'unreadable' };
    } else {
      const minW = rubric.assets.logo.minWidth;
      const minH = rubric.assets.logo.minHeight;
      const dimOk = dims.width >= minW && dims.height >= minH;
      logoResult = {
        file: logoFile,
        width: dims.width,
        height: dims.height,
        status: dimOk ? 'pass' : 'warn',
      };
      if (!dimOk) warnings.push(`logo under min size ${minW}×${minH}: ${dims.width}×${dims.height}`);
    }
  }

  // --- Screenshots ---
  const screenResults = [];
  const hashMap = new Map(); // hash → file
  const duplicates = [];

  for (const f of screenFiles) {
    const fp = path.join(dir, f);
    const dims = await getDimensions(fp);
    const hash = await sha256(fp);

    if (!dims) {
      screenResults.push({ file: f, status: 'fail', reason: 'unreadable' });
      issues.push(`screenshot unreadable: ${f}`);
      continue;
    }

    const pw = rubric.assets.screenshots.minWidth;
    const ph = rubric.assets.screenshots.minHeight;
    const dimOk = dims.width >= pw && dims.height >= ph;

    let status = 'pass';
    let reason = undefined;

    if (!dimOk) {
      status = 'warn';
      reason = `under min ${pw}×${ph}: ${dims.width}×${dims.height}`;
      warnings.push(`${f} ${reason}`);
    }

    if (hashMap.has(hash)) {
      duplicates.push({ file: f, duplicateOf: hashMap.get(hash) });
      status = 'fail';
      reason = `exact duplicate of ${hashMap.get(hash)}`;
      issues.push(`duplicate screenshot: ${f} = ${hashMap.get(hash)}`);
    } else {
      hashMap.set(hash, f);
    }

    screenResults.push({ file: f, width: dims.width, height: dims.height, hash, status, ...(reason ? { reason } : {}) });
  }

  const minCount = rubric.assets.screenshots.minimumCount;
  const targetCount = rubric.assets.screenshots.targetCount;
  const validScreens = screenResults.filter((s) => s.status !== 'fail');

  let countStatus = 'pass';
  if (validScreens.length < minCount) {
    countStatus = 'fail';
    issues.push(`insufficient screenshots: ${validScreens.length} < ${minCount} required`);
  } else if (validScreens.length < targetCount) {
    countStatus = 'warn';
    warnings.push(`below target: ${validScreens.length} < ${targetCount} target`);
  }

  // --- Provenance (structure only — no network check here) ---
  // Real provenance validation happens after scraper runs.

  const status =
    issues.length > 0 ? 'fail' : warnings.length > 0 ? 'warn' : 'pass';

  return {
    slug,
    status,
    logo: logoResult,
    screenshots: {
      count: screenFiles.length,
      validCount: validScreens.length,
      countStatus,
      duplicates,
      files: screenResults,
    },
    issues,
    warnings,
  };
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const run = async () => {
  const rubric = JSON.parse(await readFile(RUBRIC_PATH, 'utf8'));
  const appDirs = (await readdir(APPS_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  console.log(`Auditing ${appDirs.length} apps…`);

  const apps = [];
  for (const slug of appDirs) {
    process.stdout.write(`  ${slug}… `);
    const result = await auditApp(slug, rubric);
    apps.push(result);
    console.log(result.status);
  }

  const passed = apps.filter((a) => a.status === 'pass').length;
  const warned = apps.filter((a) => a.status === 'warn').length;
  const failed = apps.filter((a) => a.status === 'fail').length;

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
    failedApps: apps.filter((a) => a.status === 'fail').map((a) => a.slug),
    warnedApps: apps.filter((a) => a.status === 'warn').map((a) => a.slug),
    apps,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`\nQuality report → ${OUT_PATH}`);
  console.log(`  passed: ${passed}  warned: ${warned}  failed: ${failed}  (${output.summary.passRate} pass rate)`);
  if (output.failedApps.length) console.log(`  failed: ${output.failedApps.join(', ')}`);
  if (output.warnedApps.length) console.log(`  warned: ${output.warnedApps.join(', ')}`);
};

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
