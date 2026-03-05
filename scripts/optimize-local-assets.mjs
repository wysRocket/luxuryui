import { readdir, rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');

const isImage = (file) => /\.(jpe?g|png|webp)$/i.test(file);

const optimizeImage = async (filePath, fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  const isLogo = fileName.startsWith('logo.');
  const maxWidth = isLogo ? 128 : 900;

  let pipeline = sharp(filePath, { failOnError: false })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true });

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: isLogo ? 74 : 62, mozjpeg: true, progressive: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: isLogo ? 80 : 64, compressionLevel: 9, adaptiveFiltering: true, palette: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: isLogo ? 74 : 62, effort: 5 });
  }

  const tempPath = `${filePath}.tmp`;
  await pipeline.toFile(tempPath);

  const [before, after] = await Promise.all([stat(filePath), stat(tempPath)]);

  // Keep the original if optimization made it larger.
  if (after.size >= before.size) {
    await unlink(tempPath);
    return { before: before.size, after: before.size, changed: false };
  }

  await rename(tempPath, filePath);
  return { before: before.size, after: after.size, changed: true };
};

const run = async () => {
  const appDirs = await readdir(assetsRoot);

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let changed = 0;

  for (const dir of appDirs) {
    const absoluteDir = path.join(assetsRoot, dir);
    const files = await readdir(absoluteDir);

    for (const fileName of files) {
      if (!isImage(fileName)) continue;

      const filePath = path.join(absoluteDir, fileName);
      const result = await optimizeImage(filePath, fileName);
      totalBefore += result.before;
      totalAfter += result.after;
      processed += 1;
      if (result.changed) changed += 1;
    }
  }

  const beforeMb = (totalBefore / (1024 * 1024)).toFixed(2);
  const afterMb = (totalAfter / (1024 * 1024)).toFixed(2);
  const savedMb = ((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2);
  const savedPct = totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : '0.0';

  console.log(`Processed: ${processed} images (${changed} optimized)`);
  console.log(`Before: ${beforeMb} MB`);
  console.log(`After:  ${afterMb} MB`);
  console.log(`Saved:  ${savedMb} MB (${savedPct}%)`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
