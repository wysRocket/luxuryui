import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_NAMES_BY_CATEGORY } from '../data/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');
const outputTsPath = path.join(projectRoot, 'data', 'realAppAssets.ts');

const appNames = [...new Set(Object.values(APP_NAMES_BY_CATEGORY).flat())];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const run = async () => {
  const map = {};

  for (const name of appNames) {
    const slug = slugify(name);
    const dir = path.join(assetsRoot, slug);

    let files;
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }

    const logo = files.find((file) => file.startsWith('logo.'));
    const screens = files
      .filter((file) => file.startsWith('screen-'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (!logo || screens.length === 0) continue;

    map[name] = {
      logo: `/assets/apps/${slug}/${logo}`,
      screenshots: screens.map((file) => `/assets/apps/${slug}/${file}`),
      source: 'local-cache',
    };
  }

  const fileContents = `export interface RealAppAsset {\n  logo: string;\n  screenshots: string[];\n  source: string;\n}\n\nexport const REAL_APP_ASSETS: Record<string, RealAppAsset> = ${JSON.stringify(map, null, 2)};\n`;

  await writeFile(outputTsPath, fileContents);
  console.log(`Rebuilt real app asset map with ${Object.keys(map).length} entries.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
