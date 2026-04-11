/**
 * Enhance all app screenshots in public/assets/apps/ in-place.
 *
 * Per-image logic:
 *   - width <  500px → upscale 4× (target ~944px) via Lanczos3
 *   - width <  900px → upscale 2× via Lanczos3
 *   - width ≥  900px → keep original dimensions
 *   Then apply: unsharp mask + CLAHE local contrast + WebP quality 90
 *
 * Overwrites webp files in place. Idempotent: re-running sharpens already-
 * processed files again, which is safe (deterministic gains plateau quickly).
 *
 * Run:  node scripts/enhance-webp.mjs
 *       node scripts/enhance-webp.mjs --dry-run
 */

import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsRoot  = path.join(projectRoot, 'public', 'assets', 'apps');

const TARGET_MIN_WIDTH = 944; // ~iPhone SE retina minimum
const WEBP_QUALITY     = 90;
const SHARPEN_SIGMA    = 1.0; // unsharp mask radius
const SHARPEN_M1       = 1.5; // flat-area threshold
const SHARPEN_M2       = 0.7; // jagged-area damping

/**
 * Enhance a single image buffer.
 * Exported for unit-test use — no file I/O here.
 *
 * @param {Buffer} input      - raw WebP (or any Sharp-readable) image bytes
 * @param {number} targetMinWidth - minimum output width before upscaling kicks in
 * @returns {Promise<Buffer>} enhanced WebP buffer at quality 90
 */
export async function enhanceImageBuffer(input, targetMinWidth = TARGET_MIN_WIDTH) {
  const meta = await sharp(input).metadata();
  const srcW  = meta.width  ?? 0;
  const srcH  = meta.height ?? 0;

  let pipeline = sharp(input, { failOnError: false }).rotate(); // auto-orient

  if (srcW < targetMinWidth) {
    // Calculate scale factor to hit targetMinWidth exactly
    const scale = targetMinWidth / srcW;
    const newW  = Math.round(srcW * scale);
    const newH  = Math.round(srcH * scale);
    pipeline = pipeline.resize({
      width:  newW,
      height: newH,
      kernel: 'lanczos3',
      fit:    'fill',
    });
  }
  // images ≥ targetMinWidth keep their dimensions

  return pipeline
    .clahe({ width: 32, height: 32, maxSlope: 3 }) // local contrast enhancement
    .sharpen({ sigma: SHARPEN_SIGMA, m1: SHARPEN_M1, m2: SHARPEN_M2 })
    .normalise()                                    // stretch histogram to full range
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();
}

/* ── Batch runner ────────────────────────────────────────────────────── */

const fmt   = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const isDry = process.argv.includes('--dry-run');

const processFile = async (filePath) => {
  const before = await stat(filePath);
  const input  = await readFile(filePath);
  const meta   = await sharp(input).metadata();

  const output = await enhanceImageBuffer(input, TARGET_MIN_WIDTH);

  if (!isDry) {
    await writeFile(filePath, output);
  }

  const after = { size: output.length };
  const outMeta = await sharp(output).metadata();
  return {
    file:   path.relative(projectRoot, filePath),
    beforeSizeKB: (before.size / 1024).toFixed(1),
    afterSizeKB:  (after.size / 1024).toFixed(1),
    beforeDims: `${meta.width}×${meta.height}`,
    afterDims:  `${outMeta.width}×${outMeta.height}`,
    upscaled: (outMeta.width ?? 0) > (meta.width ?? 0),
  };
};

const run = async () => {
  if (isDry) console.log('\n⚠️  DRY RUN — files will not be overwritten\n');
  console.log(`\n🎨  Enhancing screenshots in ${assetsRoot}\n`);

  const appDirs = await readdir(assetsRoot, { withFileTypes: true });
  const results = [];
  let upscaled  = 0;
  let sharpened = 0;
  let errors    = 0;

  for (const entry of appDirs) {
    if (!entry.isDirectory()) continue;
    const appDir = path.join(assetsRoot, entry.name);
    const files  = await readdir(appDir);

    for (const file of files) {
      if (!file.endsWith('.webp') || file === 'logo.webp') continue;

      const filePath = path.join(appDir, file);
      try {
        const result = await processFile(filePath);
        results.push(result);
        if (result.upscaled) {
          upscaled++;
          console.log(`  ⬆  ${result.file.padEnd(60)} ${result.beforeDims} → ${result.afterDims}   ${result.beforeSizeKB}KB → ${result.afterSizeKB}KB`);
        } else {
          sharpened++;
          if (sharpened <= 5 || sharpened % 50 === 0) {
            process.stdout.write(`  ✨  ${result.file}\r`);
          }
        }
      } catch (err) {
        errors++;
        console.error(`  ❌  ${file}: ${err.message}`);
      }
    }
  }

  const manifestPath = path.join(__dirname, '.enhance-manifest.json');
  if (!isDry) {
    await writeFile(manifestPath, JSON.stringify(results, null, 2));
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`\n  Upscaled  : ${upscaled}`);
  console.log(`  Sharpened : ${sharpened}`);
  console.log(`  Errors    : ${errors}`);
  console.log(`  Total     : ${results.length}`);
  if (!isDry) console.log(`\n  Manifest  → scripts/.enhance-manifest.json`);
  console.log('\n  Next: git add -A public/assets/apps && git commit && npm run deploy\n');

  if (errors > 0) process.exit(1);
};

// Only run the batch when executed directly (not when imported in tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch((err) => { console.error('Fatal:', err); process.exit(1); });
}
