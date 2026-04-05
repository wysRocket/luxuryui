/**
 * Upscale all app screenshots in public/assets/apps/ to high-quality WebP.
 *
 * Steps per image:
 *   1. Read metadata to get original dimensions
 *   2. 2× upscale via Lanczos3 (best quality for UI screenshots)
 *   3. Sharpen to restore edges lost during compression
 *   4. Encode as WebP quality 82
 *   5. Write .webp alongside original
 *   6. Delete original if output is under 500KB quality gate
 *
 * Idempotent: skips files where a .webp already exists.
 * Run: node scripts/upscale-assets.mjs
 */

import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');
const manifestPath = path.join(__dirname, '.upscale-manifest.json');

const MAX_WEBP_SIZE = 500 * 1024; // 500KB quality gate
const WEBP_QUALITY = 82;
const SHARPEN_SIGMA = 0.8;

const isSourceImage = (file) => /\.(jpe?g|png)$/i.test(file);

const fmt = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;
const pct = (before, after) => {
  const change = ((after - before) / before) * 100;
  return change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
};

const processImage = async (filePath) => {
  const ext = path.extname(filePath);
  const webpPath = filePath.slice(0, -ext.length) + '.webp';

  if (existsSync(webpPath)) {
    return { status: 'skipped', reason: 'webp exists' };
  }

  const beforeStat = await stat(filePath);
  const meta = await sharp(filePath).metadata();

  const newWidth = meta.width * 2;
  const newHeight = meta.height * 2;

  await sharp(filePath, { failOnError: false })
    .rotate() // auto-orient from EXIF
    .resize({ width: newWidth, height: newHeight, kernel: 'lanczos3', fit: 'fill' })
    .sharpen({ sigma: SHARPEN_SIGMA })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(webpPath);

  const afterStat = await stat(webpPath);

  if (afterStat.size > MAX_WEBP_SIZE) {
    await unlink(webpPath);
    return {
      status: 'flagged',
      source: filePath,
      originalSize: beforeStat.size,
      outputSize: afterStat.size,
      reason: `Output ${fmt(afterStat.size)} exceeds 500KB gate — original kept, webp deleted`,
    };
  }

  await unlink(filePath);

  return {
    status: 'converted',
    source: filePath,
    output: webpPath,
    originalSize: beforeStat.size,
    outputSize: afterStat.size,
    originalDimensions: `${meta.width}×${meta.height}`,
    outputDimensions: `${newWidth}×${newHeight}`,
  };
};

const run = async () => {
  const appDirs = await readdir(assetsRoot, { withFileTypes: true });
  const manifest = [];

  let converted = 0;
  let skipped = 0;
  let flagged = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  console.log(`\n🔍  Scanning ${assetsRoot}\n`);

  for (const entry of appDirs) {
    if (!entry.isDirectory()) continue;
    const appDir = path.join(assetsRoot, entry.name);
    const files = await readdir(appDir);

    for (const file of files) {
      if (!isSourceImage(file)) continue;
      const filePath = path.join(appDir, file);

      const result = await processImage(filePath);
      manifest.push(result);

      if (result.status === 'converted') {
        converted++;
        totalBefore += result.originalSize;
        totalAfter += result.outputSize;
        console.log(
          `  ✅  ${path.relative(projectRoot, result.source).padEnd(60)} ` +
          `${fmt(result.originalSize).padStart(8)} → ${fmt(result.outputSize).padStart(8)}  (${pct(result.originalSize, result.outputSize)})  ` +
          `${result.originalDimensions} → ${result.outputDimensions}`
        );
      } else if (result.status === 'flagged') {
        flagged++;
        console.log(`  🚩  FLAGGED  ${path.relative(projectRoot, result.source)} — ${result.reason}`);
      } else {
        skipped++;
      }
    }
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n' + '─'.repeat(80));
  console.log(`\n  Converted : ${converted}`);
  console.log(`  Skipped   : ${skipped}  (webp already existed)`);
  console.log(`  Flagged   : ${flagged}  (manual review needed — originals kept)`);
  if (converted > 0) {
    console.log(`\n  Total before : ${fmt(totalBefore)}`);
    console.log(`  Total after  : ${fmt(totalAfter)}`);
    console.log(`  Saved        : ${fmt(totalBefore - totalAfter)} (${pct(totalBefore, totalAfter)})`);
  }
  console.log(`\n  Manifest written → scripts/.upscale-manifest.json`);
  console.log('\n  Next: node scripts/update-asset-refs.mjs --dry-run\n');

  if (flagged > 0) {
    console.log(`  ⚠️  ${flagged} image(s) exceeded the 500KB quality gate. Review the manifest and re-run with adjusted settings if needed.\n`);
    process.exit(1);
  }
};

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
