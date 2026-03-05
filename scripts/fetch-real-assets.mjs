import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gplay from 'google-play-scraper';
import { APP_NAMES_BY_CATEGORY } from '../data/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicAssetsRoot = path.join(projectRoot, 'public', 'assets', 'apps');
const outputTsPath = path.join(projectRoot, 'data', 'realAppAssets.ts');

const appNames = [...new Set(Object.values(APP_NAMES_BY_CATEGORY).flat())];
const STORE_COUNTRIES = ['us', 'gb', 'ca'];
const QUERY_ALIASES = {
  Kayak: ['KAYAK Flights, Hotels & Cars'],
  Zoom: ['Zoom Workplace'],
  CNN: ['CNN News'],
  Reuters: ['Reuters News'],
  Pocket: ['Pocket: Stay Informed'],
  Threads: ['Threads, an Instagram app'],
  BeReal: ['BeReal. Your friends for real.'],
  Sleep: ['Sleep Cycle'],
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const scoreResult = (query, result) => {
  const q = normalize(query);
  const name = normalize(result.trackName || result.trackCensoredName || '');

  if (!name) return -1;

  if (name === q) return 100;
  if (name.startsWith(q)) return 85;
  if (name.includes(q)) return 70;
  if (q.includes(name)) return 60;

  return 10;
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const extFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    const ext = path.extname(parsed.pathname).toLowerCase();
    if (ext === '.png' || ext === '.jpeg' || ext === '.jpg' || ext === '.webp') return ext;
  } catch {
    return '.jpg';
  }

  return '.jpg';
};

const readLocalAssetMap = async () => {
  const map = {};

  for (const name of appNames) {
    const slug = slugify(name);
    const dir = path.join(publicAssetsRoot, slug);

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

  return map;
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const fetchJsonWithRetry = async (url, maxAttempts = 6) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LuxuryUI Asset Bot/1.0',
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return response.json();
    }

    if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
      await sleep(650 * attempt);
      continue;
    }

    throw new Error(`Request failed (${response.status})`);
  }

  throw new Error('Request exhausted retries');
};

const downloadImage = async (url, filePath) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'LuxuryUI Asset Bot/1.0',
      Accept: 'image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
};

const fetchFromItunes = async (name) => {
  const terms = [name, ...(QUERY_ALIASES[name] || [])];

  for (const country of STORE_COUNTRIES) {
    for (const term of terms) {
      const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=15&country=${country}`;
      const payload = await fetchJsonWithRetry(endpoint);
      const results = Array.isArray(payload.results) ? payload.results : [];

      if (results.length === 0) continue;

      const best = [...results]
        .map((result) => ({ result, score: scoreResult(name, result) }))
        .sort((a, b) => b.score - a.score)[0]?.result;

      if (!best) continue;

      const logo = best.artworkUrl512 || best.artworkUrl100 || '';
      const screenshots = unique([
        ...(best.screenshotUrls || []),
        ...(best.ipadScreenshotUrls || []),
        ...(best.appletvScreenshotUrls || []),
      ]).slice(0, 8);

      if (!logo || screenshots.length === 0) continue;

      return {
        trackName: best.trackName || name,
        trackViewUrl: best.trackViewUrl || endpoint,
        logo,
        screenshots,
      };
    }
  }

  return null;
};

const fetchFromGooglePlay = async (name) => {
  const terms = [name, ...(QUERY_ALIASES[name] || [])];

  for (const term of terms) {
    const searchResults = await gplay.search({
      term,
      num: 8,
      lang: 'en',
      country: 'us',
    });

    if (!Array.isArray(searchResults) || searchResults.length === 0) continue;

    const best = [...searchResults]
      .map((result) => ({ result, score: scoreResult(name, { trackName: result.title }) }))
      .sort((a, b) => b.score - a.score)[0]?.result;

    if (!best?.appId) continue;

    const details = await gplay.app({
      appId: best.appId,
      lang: 'en',
      country: 'us',
    });

    const logo = details.icon || '';
    const screenshots = unique(details.screenshots || []).slice(0, 8);

    if (!logo || screenshots.length === 0) continue;

    return {
      trackName: details.title || name,
      trackViewUrl: details.url || `https://play.google.com/store/apps/details?id=${best.appId}`,
      logo,
      screenshots,
    };
  }

  return null;
};

const run = async () => {
  await mkdir(publicAssetsRoot, { recursive: true });

  const assetMap = await readLocalAssetMap();
  const failures = [];
  const namesToFetch = appNames.filter((name) => !assetMap[name]);

  console.log(`Existing local entries: ${Object.keys(assetMap).length}`);
  console.log(`Fetching missing entries: ${namesToFetch.length}`);

  for (const name of namesToFetch) {
    try {
      await sleep(480);
      let metadata = null;

      try {
        metadata = await fetchFromItunes(name);
      } catch {
        metadata = null;
      }

      if (!metadata) {
        metadata = await fetchFromGooglePlay(name);
      }

      if (!metadata) {
        failures.push(name);
        continue;
      }

      const slug = slugify(name);
      const appDir = path.join(publicAssetsRoot, slug);
      await mkdir(appDir, { recursive: true });

      const logoExt = extFromUrl(metadata.logo);
      const logoFile = `logo${logoExt}`;
      await downloadImage(metadata.logo, path.join(appDir, logoFile));

      const screenshotPaths = [];
      let index = 1;
      for (const screenshotUrl of metadata.screenshots) {
        const ext = extFromUrl(screenshotUrl);
        const fileName = `screen-${index}${ext}`;
        await downloadImage(screenshotUrl, path.join(appDir, fileName));
        screenshotPaths.push(`/assets/apps/${slug}/${fileName}`);
        index += 1;
      }

      if (screenshotPaths.length === 0) {
        failures.push(name);
        continue;
      }

      assetMap[name] = {
        logo: `/assets/apps/${slug}/${logoFile}`,
        screenshots: screenshotPaths,
        source: metadata.trackViewUrl,
      };

      console.log(`Fetched ${name}: ${screenshotPaths.length} screenshots`);
    } catch (error) {
      failures.push(name);
      console.error(`Failed ${name}:`, error instanceof Error ? error.message : String(error));
    }
  }

  const fileContents = `export interface RealAppAsset {\n  logo: string;\n  screenshots: string[];\n  source: string;\n}\n\nexport const REAL_APP_ASSETS: Record<string, RealAppAsset> = ${JSON.stringify(assetMap, null, 2)};\n`;

  await writeFile(outputTsPath, fileContents);

  console.log(`\nGenerated ${Object.keys(assetMap).length}/${appNames.length} real app asset entries.`);
  if (failures.length > 0) {
    console.log(`Missing entries (${failures.length}): ${failures.join(', ')}`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
