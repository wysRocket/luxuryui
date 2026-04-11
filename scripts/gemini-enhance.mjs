import { GoogleGenAI } from '@google/genai';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load env
const envRaw = await readFile(path.join(projectRoot, '.env'), 'utf8').catch(() => '');
for (const line of envRaw.split('\n')) {
  const [k, ...v] = line.split('=');
  if (k && v.length && !process.env[k.trim()]) process.env[k.trim()] = v.join('=').trim();
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) { console.error('❌ VITE_GEMINI_API_KEY not found'); process.exit(1); }

const appSlug = process.argv[2];
if (!appSlug) { console.error('Usage: node scripts/gemini-enhance.mjs <app-slug> [--test]'); process.exit(1); }
const testOnly = process.argv.includes('--test');

const appDir = path.join(projectRoot, 'public', 'assets', 'apps', appSlug);
const files = (await readdir(appDir)).filter(f => f.startsWith('screen-') && f.endsWith('.webp')).sort();

if (testOnly) {
  console.log(`🧪 Test mode — processing only: ${files[0]}`);
}
const targets = testOnly ? [files[0]] : files;
console.log(`🎨 Enhancing ${targets.length} screen(s) for "${appSlug}" via Gemini 2.5 Flash Image...\n`);

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `This is a mobile app UI screenshot. 
Your task: recreate this exact screenshot with maximum sharpness, crispness and visual quality.
Rules:
- Keep ALL text content exactly as shown — do not change any words
- Keep the exact same layout, UI components, colors, icons, and proportions
- Keep the same dimensions and aspect ratio
- Enhance rendering quality: sharper edges, cleaner text, richer colors
- Output should look like the same screen captured on a premium high-DPI display
Do not add, remove or move any UI element.`;

for (const filename of targets) {
  const inputPath = path.join(appDir, filename);
  const imageBytes = await readFile(inputPath);
  const base64 = imageBytes.toString('base64');

  process.stdout.write(`  ${filename} ... `);
  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-preview-05-20',
      config: { responseModalities: ['IMAGE', 'TEXT'] },
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/webp', data: base64 } },
          { text: PROMPT },
        ],
      }],
    });

    let saved = false;
    for await (const chunk of response) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        const outputBuffer = Buffer.from(part.inlineData.data, 'base64');
        // Save back over the original (keep .webp)
        const outputPath = path.join(appDir, filename);
        await writeFile(outputPath, outputBuffer);
        console.log(`✅ saved (${(outputBuffer.length / 1024).toFixed(0)} KB)`);
        saved = true;
        break;
      }
    }
    if (!saved) console.log('⚠️  no image in response');
  } catch (err) {
    console.log(`❌ ${err.message?.slice(0, 80)}`);
  }

  // Small delay between requests
  if (targets.indexOf(filename) < targets.length - 1) await new Promise(r => setTimeout(r, 1500));
}

console.log('\nDone.');
