import { createStitchClient } from './commercial/lib/stitchClient.mjs';

// Load .env.local manually
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

try {
  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
} catch {}

const apiKey = process.env.STITCH_API_KEY;
if (!apiKey) {
  console.error('❌  STITCH_API_KEY is not set in .env.local');
  process.exit(1);
}

console.log('🔌 Connecting to Stitch API...\n');

const { StitchToolClient, Stitch } = await import('@google/stitch-sdk');
const toolClient = new StitchToolClient({ apiKey });
const stitch = new Stitch(toolClient);

const projects = await stitch.projects();
console.log(`Found ${projects.length} project(s):\n`);
for (const p of projects) {
  const id = p.projectId ?? p.id ?? p._raw?.projectId;
  const title = p.title ?? p._raw?.title ?? '(untitled)';
  console.log(`  • ${title}`);
  console.log(`    ID: ${id}`);
  console.log('');
}

await toolClient.close();
