/**
 * Update image URL references from .jpg/.png to .webp in data files.
 *
 * Targets: app asset references and commercial kit data.
 * Rewrites to the matching .webp file when it exists on disk.
 * If a /assets/publish-ready/apps/... reference no longer exists, it falls back to
 * the equivalent /assets/apps/... .webp file when available.
 *
 * Usage:
 *   node scripts/update-asset-refs.mjs --dry-run   # preview only
 *   node scripts/update-asset-refs.mjs              # apply changes
 */

import { readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const isDryRun = process.argv.includes('--dry-run');

const TARGET_FILES = [
  'data/realAppAssets.ts',
  'data/curation/commercial/figma-kit-products.json',
  'data/curation/commercial/figma-kit-specs.json',
];

// Matches any /assets/apps/... or /assets/publish-ready/apps/... path ending in .jpg, .jpeg, or .png inside a string literal
const IMAGE_REF_RE = /(["'])(\/assets\/(?:publish-ready\/)?apps\/[^"']+?)\.(jpe?g|png)(["'])/gi;

const resolveReplacementUrl = (imagePath) => {
  const preferredWebpUrl = `${imagePath}.webp`;
  const preferredWebpDiskPath = path.join(projectRoot, 'public', preferredWebpUrl.replace(/^\//, ''));
  if (existsSync(preferredWebpDiskPath)) {
    return preferredWebpUrl;
  }

  if (imagePath.startsWith('/assets/publish-ready/apps/')) {
    const rawWebpUrl = imagePath.replace('/assets/publish-ready/apps/', '/assets/apps/') + '.webp';
    const rawWebpDiskPath = path.join(projectRoot, 'public', rawWebpUrl.replace(/^\//, ''));
    if (existsSync(rawWebpDiskPath)) {
      return rawWebpUrl;
    }
  }

  return null;
};

const rewriteFile = async (relPath) => {
  const absPath = path.join(projectRoot, relPath);

  let content;
  try {
    content = await readFile(absPath, 'utf-8');
  } catch {
    console.warn(`  ⚠️  File not found: ${relPath}`);
    return { changed: 0, skipped: 0 };
  }

  let changed = 0;
  let skipped = 0;
  const lines = [];

  const newContent = content.replace(IMAGE_REF_RE, (match, openQuote, imagePath, ext, closeQuote) => {
    const replacementUrl = resolveReplacementUrl(imagePath);

    if (replacementUrl) {
      changed++;
      lines.push(`    ${imagePath}.${ext}  →  ${replacementUrl}`);
      return `${openQuote}${replacementUrl}${closeQuote}`;
    } else {
      skipped++;
      lines.push(`    ⚠️  no webp found for ${imagePath}.${ext} — skipped`);
      return match;
    }
  });

  console.log(`\n  ${relPath}  (${changed} changed, ${skipped} skipped)`);
  lines.forEach((l) => console.log(l));

  if (changed > 0 && !isDryRun) {
    await writeFile(absPath, newContent, 'utf-8');
    console.log(`  ✅  Written`);
  } else if (changed > 0 && isDryRun) {
    console.log(`  📋  Dry run — not written`);
  }

  return { changed, skipped };
};

const run = async () => {
  console.log(`\n${isDryRun ? '📋  DRY RUN — no files will be modified\n' : '✏️   Updating asset references\n'}`);

  let totalChanged = 0;
  let totalSkipped = 0;

  for (const file of TARGET_FILES) {
    const result = await rewriteFile(file);
    totalChanged += result.changed;
    totalSkipped += result.skipped;
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n  Total references updated : ${totalChanged}`);
  console.log(`  Total references skipped : ${totalSkipped}  (no .webp on disk)`);

  if (isDryRun && totalChanged > 0) {
    console.log('\n  Run without --dry-run to apply.\n');
  } else if (!isDryRun && totalChanged > 0) {
    console.log('\n  Next: npm run build && verify site\n');
  } else {
    console.log('\n  Nothing to do — all refs already up to date or no webp files found.\n');
  }
};

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
