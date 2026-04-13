import { GoogleGenAI } from '@google/genai';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load .env.local first (takes priority), then .env
for (const envFile of ['.env', '.env.local']) {
  try {
    const raw = await readFile(path.join(projectRoot, envFile), 'utf8');
    for (const line of raw.split('\n')) {
      const [k, ...v] = line.split('=');
      if (k?.trim() && v.length) process.env[k.trim()] = v.join('=').trim();
    }
  } catch {}
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('❌ GEMINI_API_KEY not found in .env.local'); process.exit(1); }

const appSlug = process.argv[2];
if (!appSlug) { console.error('Usage: node scripts/gemini-enhance.mjs <app-slug> [--test]'); process.exit(1); }
const testOnly = process.argv.includes('--test');
const retrySmall = process.argv.includes('--retry-small');
const RETRY_THRESHOLD_KB = 500;

const appDir = path.join(projectRoot, 'public', 'assets', 'apps', appSlug);
const allFiles = (await readdir(appDir)).filter(f => f.startsWith('screen-') && (f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))).sort();

let files = allFiles;
if (retrySmall) {
  const { statSync } = await import('node:fs');
  files = allFiles.filter(f => {
    const sizeKB = statSync(path.join(appDir, f)).size / 1024;
    return sizeKB < RETRY_THRESHOLD_KB;
  });
  console.log(`🔁 Retry mode: ${files.length} screen(s) under ${RETRY_THRESHOLD_KB}KB\n`);
}
const targets = testOnly ? [files[0]] : files;

console.log(`🎨 Enhancing ${targets.length} screen(s) for "${appSlug}" via Gemini Flash Image...\n`);

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Find working image gen model
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const PROMPT = `This is a mobile app UI screenshot.
Recreate this exact screenshot with maximum sharpness and visual quality.
- Keep ALL text exactly as shown — do not change any words
- Keep the exact same layout, UI components, colors, icons, proportions
- Enhance rendering quality: sharper edges, cleaner text, richer colors
- Same dimensions and aspect ratio
- Do not add, remove, or move any UI element`;

for (const filename of targets) {
  const inputPath = path.join(appDir, filename);
  const imageBytes = await readFile(inputPath);
  const base64 = imageBytes.toString('base64');
  const originalSize = (imageBytes.length / 1024).toFixed(0);

  process.stdout.write(`  ${filename} (${originalSize}KB) → `);
  try {
    const response = await ai.models.generateContentStream({
      model: IMAGE_MODEL,
      config: { responseModalities: ['IMAGE', 'TEXT'] },
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: filename.endsWith('.png') ? 'image/png' : 'image/webp', data: base64 } },
          { text: PROMPT },
        ],
      }],
    });

    let saved = false;
    for await (const chunk of response) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        const outputBuffer = Buffer.from(part.inlineData.data, 'base64');
        await writeFile(inputPath, outputBuffer);
        console.log(`✅ ${(outputBuffer.length / 1024).toFixed(0)}KB`);
        saved = true;
        break;
      } else if (part?.text) {
        console.log(`⚠️  text only: ${part.text.slice(0, 60)}`);
        saved = true;
        break;
      }
    }
    if (!saved) console.log('⚠️  no output');
  } catch (err) {
    const msg = err.message?.slice(0, 100) ?? String(err);
    console.log(`❌ ${msg}`);
  }

  if (targets.indexOf(filename) < targets.length - 1) await new Promise(r => setTimeout(r, 2000));
}

console.log('\n✅ Done.');
