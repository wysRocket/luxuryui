/**
 * ci-pipeline-health.mjs
 *
 * Phase 4: CI and Observability
 *
 * Validates all pipeline artifacts and enforces quality thresholds.
 * Exits with code 1 if any check fails — intended to run in CI on push to main.
 *
 * Checks:
 *   1. Quality report: exists, pass+warn rate ≥ PASS_WARN_THRESHOLD
 *   2. Flow packs: exists, all 6 flows ready, per-flow app count ≥ 2
 *   3. realAppAssets.ts: exists, contains ≥ MIN_APP_COUNT entries
 *
 * Usage:
 *   node scripts/ci-pipeline-health.mjs
 */

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkCommercialReadiness } from './commercial/validate-commercial-readiness.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

const PASS_WARN_THRESHOLD = 0.85;   // ≥85% of audited apps must pass or warn
const MIN_APP_COUNT       = 60;     // realAppAssets.ts must contain ≥N apps
const MIN_FLOWS_READY     = 6;      // all expected flows must be ready
const MIN_APPS_PER_FLOW   = 2;      // each ready flow must have ≥2 apps

// ---------------------------------------------------------------------------
// Artifact paths
// ---------------------------------------------------------------------------

const QUALITY_REPORT_PATH = path.join(
  projectRoot, 'data', 'curation', 'coverage', 'screensdesign-quality-report.json',
);
const FLOW_PACKS_PATH = path.join(
  projectRoot, 'data', 'curation', 'flows', 'screensdesign-flow-packs.json',
);
const REAL_APP_ASSETS_PATH = path.join(projectRoot, 'data', 'realAppAssets.ts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fileExists = async (p) => {
  try { await stat(p); return true; } catch { return false; }
};

const countPattern = (str, re) => {
  let n = 0;
  let m;
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = g.exec(str)) !== null) { n++; m; }
  return n;
};

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const checks = [];
let allPassed = true;

const pass  = (msg) => { checks.push({ status: 'PASS', msg }); };
const fail  = (msg) => { checks.push({ status: 'FAIL', msg }); allPassed = false; };
const warn  = (msg) => { checks.push({ status: 'WARN', msg }); };
const info  = (msg) => { checks.push({ status: 'INFO', msg }); };

// ---------------------------------------------------------------------------
// Check 1: Quality report
// ---------------------------------------------------------------------------

const checkQualityReport = async () => {
  if (!await fileExists(QUALITY_REPORT_PATH)) {
    fail('Quality report not found — run: npm run sources:screensdesign:integrity');
    return;
  }

  const report = JSON.parse(await readFile(QUALITY_REPORT_PATH, 'utf8'));
  const { total, passed, warned, failed } = report.summary;

  info(`Quality report: ${total} apps audited (passed ${passed}, warned ${warned}, failed ${failed})`);

  const passWarnRate = (passed + warned) / (total || 1);
  if (passWarnRate >= PASS_WARN_THRESHOLD) {
    pass(`Pass+warn rate ${(passWarnRate * 100).toFixed(1)}% ≥ ${(PASS_WARN_THRESHOLD * 100).toFixed(0)}% threshold`);
  } else {
    fail(`Pass+warn rate ${(passWarnRate * 100).toFixed(1)}% < ${(PASS_WARN_THRESHOLD * 100).toFixed(0)}% threshold — ${failed} apps failed quality`);
  }

  if (report.failedApps.length > 0) {
    warn(`Failed apps (excluded from frontend): ${report.failedApps.join(', ')}`);
  }
};

// ---------------------------------------------------------------------------
// Check 2: Flow packs
// ---------------------------------------------------------------------------

const checkFlowPacks = async () => {
  if (!await fileExists(FLOW_PACKS_PATH)) {
    fail('Flow packs not found — run: npm run sources:screensdesign:flow-packs');
    return;
  }

  const packs = JSON.parse(await readFile(FLOW_PACKS_PATH, 'utf8'));
  const { totalFlows, ready, insufficientCoverage } = packs.summary;

  info(`Flow packs: ${totalFlows} flows (${ready} ready, ${insufficientCoverage} insufficient)`);

  if (ready >= MIN_FLOWS_READY) {
    pass(`${ready}/${totalFlows} flows ready ≥ ${MIN_FLOWS_READY} required`);
  } else {
    fail(`Only ${ready}/${totalFlows} flows ready — ${MIN_FLOWS_READY} required`);
  }

  for (const pack of packs.packs) {
    if (pack.status !== 'ready') {
      fail(`Flow "${pack.flowId}" is not ready (status: ${pack.status})`);
      continue;
    }
    if (pack.coverage.appCount < MIN_APPS_PER_FLOW) {
      fail(`Flow "${pack.flowId}" has ${pack.coverage.appCount} apps < ${MIN_APPS_PER_FLOW} minimum`);
    } else {
      pass(`Flow "${pack.flowId}": ${pack.coverage.appCount} apps, ${pack.coverage.screenshotCount} screenshots`);
    }
  }
};

// ---------------------------------------------------------------------------
// Check 3: realAppAssets.ts
// ---------------------------------------------------------------------------

const checkRealAppAssets = async () => {
  if (!await fileExists(REAL_APP_ASSETS_PATH)) {
    fail('realAppAssets.ts not found — run: npm run sources:screensdesign:sync-assets');
    return;
  }

  const src = await readFile(REAL_APP_ASSETS_PATH, 'utf8');

  // Count top-level app entries: lines that match `  "AppName": {`
  const entryCount = countPattern(src, /^\s{2}"[^"]+": \{$/m);

  if (entryCount >= MIN_APP_COUNT) {
    pass(`realAppAssets.ts: ${entryCount} app entries ≥ ${MIN_APP_COUNT} minimum`);
  } else {
    fail(`realAppAssets.ts: only ${entryCount} app entries < ${MIN_APP_COUNT} minimum`);
  }

  if (!src.includes('export const REAL_APP_ASSETS')) {
    fail('realAppAssets.ts is missing the REAL_APP_ASSETS export');
  }
};

const checkCommercialArtifacts = async () => {
  const result = await checkCommercialReadiness();

  info(`Commercial kits: ${result.summary.publishedProducts}/${result.summary.totalProducts} published`);

  if (result.findings.length === 0) {
    pass('Published Figma kits have matching specs, manifests, approved reviews, and verified final Figma assets');
    return;
  }

  for (const finding of result.findings) {
    fail(`Commercial readiness: ${finding.message}`);
  }
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const run = async () => {
  console.log('Pipeline health check\n');

  await checkQualityReport();
  await checkFlowPacks();
  await checkRealAppAssets();
  await checkCommercialArtifacts();

  console.log('');
  for (const c of checks) {
    const icon = c.status === 'PASS' ? '✓' : c.status === 'FAIL' ? '✗' : c.status === 'WARN' ? '⚠' : '·';
    console.log(`  ${icon} [${c.status}] ${c.msg}`);
  }

  console.log('');
  const passed = checks.filter((c) => c.status === 'PASS').length;
  const failed = checks.filter((c) => c.status === 'FAIL').length;
  const warned = checks.filter((c) => c.status === 'WARN').length;

  console.log(`Result: ${passed} passed, ${failed} failed, ${warned} warned`);

  if (!allPassed) {
    console.log('\nPipeline health check FAILED — see failures above.');
    process.exit(1);
  } else {
    console.log('\nPipeline health check PASSED.');
  }
};

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
