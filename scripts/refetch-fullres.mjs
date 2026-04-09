/**
 * Re-fetches all app screenshots from iTunes / Google Play at full resolution.
 * Downloads as jpg, converts to webp, replaces old files, updates realAppAssets.ts.
 * Run: node scripts/refetch-fullres.mjs [AppName]
 */

import { mkdir, writeFile, unlink, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchFromItunes, fetchFromGooglePlay, slugify, extFromUrl } from './fetch-real-assets.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicAssetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');
const assetMapPath = path.join(projectRoot, 'data', 'realAppAssets.ts');

// Target resolution — iPhone 14 Pro Max / 5.5" fallback
const FULL_RES = '1290x2796bb.jpg';
const FALLBACK_RES = '1242x2208bb.jpg';

function toFullRes(url) {
  return url.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/i, `/${FULL_RES}`);
}

function toFallbackRes(url) {
  return url.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/i, `/${FALLBACK_RES}`);
}

async function downloadBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LuxuryUI Asset Bot/1.0', Accept: 'image/*' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function downloadWithFallback(url) {
  for (const candidate of [toFullRes(url), toFallbackRes(url), url]) {
    try {
      return { buffer: await downloadBuffer(candidate), url: candidate };
    } catch {
      continue;
    }
  }
  throw new Error(`All resolution attempts failed for ${url}`);
}

/** Convert a jpg/png buffer to webp using sharp (if available) or save as-is */
async function toWebp(buffer, outPath) {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(buffer).webp({ quality: 90 }).toFile(outPath);
  } catch {
    // sharp not available — write jpg and rename to .webp (browser handles it fine)
    await writeFile(outPath, buffer);
  }
}

/** Remove stale old-format files (e.g. screen-1.jpg when we now have screen-1.webp) */
async function removeStale(dir, base, keepExt) {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    if (ext === keepExt) continue;
    const p = path.join(dir, base + ext);
    if (existsSync(p)) await unlink(p).catch(() => {});
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Load app list
const { APP_NAMES_BY_CATEGORY } = await import('../data/catalog.js');
const appNames = [...new Set(Object.values(APP_NAMES_BY_CATEGORY).flat())];

const target = process.argv[2];
const toProcess = target
  ? appNames.filter((n) => n.toLowerCase() === target.toLowerCase())
  : appNames;

console.log(`\nRefetching ${toProcess.length} app(s) at full resolution...\n`);

const assetMap = {};
const results = { ok: [], failed: [] };

for (const name of toProcess) {
  try {
    await sleep(500);

    let metadata = await fetchFromItunes(name).catch(() => null);
    if (!metadata || metadata.screenshots.length === 0) {
      process.stdout.write(`  ${name}: iTunes empty, trying Google Play... `);
      metadata = await fetchFromGooglePlay(name).catch(() => null);
    }

    if (!metadata || metadata.screenshots.length === 0) {
      console.warn(`⚠  ${name}: no results`);
      results.failed.push(name);
      continue;
    }

    const slug = slugify(name);
    const appDir = path.join(publicAssetsRoot, slug);
    await mkdir(appDir, { recursive: true });

    // Logo
    const logoUrl = metadata.logo.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/i, '/512x512bb.jpg');
    const { buffer: logoBuf } = await downloadWithFallback(logoUrl).catch(
      () => downloadWithFallback(metadata.logo)
    );
    await toWebp(logoBuf, path.join(appDir, 'logo.webp'));
    await removeStale(appDir, 'logo', '.webp');

    // Screenshots
    const screenshotPaths = [];
    let i = 1;
    const screenInfo = [];

    for (const screenshotUrl of metadata.screenshots.slice(0, 8)) {
      const { buffer, url: usedUrl } = await downloadWithFallback(screenshotUrl);
      const outPath = path.join(appDir, `screen-${i}.webp`);
      await toWebp(buffer, outPath);
      await removeStale(appDir, `screen-${i}`, '.webp');
      const kb = Math.round(buffer.length / 1024);
      const res = usedUrl.includes('1290x') ? 'full' : usedUrl.includes('1242x') ? 'fallback' : 'original';
      screenInfo.push(`screen-${i}: ${kb}KB [${res}]`);
      screenshotPaths.push(`/assets/apps/${slug}/screen-${i}.webp`);
      i++;
    }

    assetMap[name] = {
      logo: `/assets/apps/${slug}/logo.webp`,
      screenshots: screenshotPaths,
      source: metadata.trackViewUrl,
    };

    console.log(`✓ ${name} (${screenshotPaths.length} screens)`);
    screenInfo.forEach((s) => console.log(`    ${s}`));
    results.ok.push(name);
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
    results.failed.push(name);
  }
}

// Merge with existing asset map (preserve entries we didn't re-fetch)
if (results.ok.length > 0) {
  let existing = {};
  try {
    const content = await readFile(assetMapPath, 'utf8');
    const match = content.match(/=\s*(\{[\s\S]*\});?\s*$/);
    if (match) existing = JSON.parse(match[1]);
  } catch {}

  const merged = { ...existing, ...assetMap };
  const ts = `export interface RealAppAsset {\n  logo: string;\n  screenshots: string[];\n  source: string;\n}\n\nexport const REAL_APP_ASSETS: Record<string, RealAppAsset> = ${JSON.stringify(merged, null, 2)};\n`;
  await writeFile(assetMapPath, ts);
  console.log(`\n📝 Updated realAppAssets.ts`);
}

console.log(`\n✅ Done: ${results.ok.length} succeeded, ${results.failed.length} failed`);
if (results.failed.length) console.log('Failed:', results.failed.join(', '));
