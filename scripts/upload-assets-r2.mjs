/**
 * Upload all app screenshots + logos to Cloudflare R2
 * Usage: node scripts/upload-assets-r2.mjs [--dry-run]
 *
 * Requires in .env.local:
 *   R2_ACCOUNT_ID=...
 *   R2_ACCESS_KEY_ID=...
 *   R2_SECRET_ACCESS_KEY=...
 *   R2_BUCKET=luxuryui-assets
 *   R2_PUBLIC_URL=https://pub-xxxx.r2.dev   (or custom domain)
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load env files
for (const envFile of ['.env', '.env.local']) {
  try {
    const raw = await readFile(path.join(projectRoot, envFile), 'utf8');
    for (const line of raw.split('\n')) {
      const [k, ...v] = line.split('=');
      if (k?.trim() && v.length && !process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  } catch {}
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET || 'luxuryui-assets';
const DRY_RUN = process.argv.includes('--dry-run');

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ Missing R2 credentials. Add to .env.local:');
  console.error('   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  process.exit(1);
}

// Use AWS SDK v3 S3 client (R2 is S3-compatible)
const { S3Client, PutObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3').catch(() => {
  console.error('❌ Run: npm install @aws-sdk/client-s3');
  process.exit(1);
});

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const MIME_MAP = {
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const appsDir = path.join(projectRoot, 'public', 'assets', 'apps');
const appEntries = await readdir(appsDir);
const apps = [];
for (const f of appEntries) {
  try {
    const s = await stat(path.join(appsDir, f));
    if (s.isDirectory()) apps.push(f);
  } catch {}
}

let total = 0, uploaded = 0, skipped = 0, failed = 0;

for (const app of apps) {
  const appDir = path.join(appsDir, app);
  const files = (await readdir(appDir)).filter(f => Object.keys(MIME_MAP).some(ext => f.endsWith(ext)));

  for (const file of files) {
    const filePath = path.join(appDir, file);
    const key = `apps/${app}/${file}`;
    const ext = path.extname(file);
    const contentType = MIME_MAP[ext] || 'application/octet-stream';
    total++;

    if (DRY_RUN) {
      console.log(`  [dry] would upload → ${key}`);
      continue;
    }

    // Check if already uploaded (skip if exists)
    try {
      await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      skipped++;
      continue;
    } catch {}

    try {
      const fileBuffer = await readFile(filePath);
      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      }));
      process.stdout.write(`  ✅ ${key}\n`);
      uploaded++;
    } catch (err) {
      console.error(`  ❌ ${key}: ${err.message}`);
      failed++;
    }
  }
}

console.log(`\n📦 Done: ${uploaded} uploaded, ${skipped} already existed, ${failed} failed (${total} total)`);
