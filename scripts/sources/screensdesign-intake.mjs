import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const outDir = path.join(projectRoot, 'data', 'curation', 'raw');
const outPath = path.join(outDir, 'screensdesign-intake.json');

const BASE_URL = 'https://screensdesign.com';
const USER_AGENT = 'LuxuryUI Source Intake Bot/1.0 (+https://luxuryuilib.com)';

const HREF_RE = /href=["']([^"'#]+)["']/gi;

const toAbsolute = (href) => {
  try {
    return new URL(href, BASE_URL).toString();
  } catch {
    return null;
  }
};

const inDomain = (url) => {
  try {
    return new URL(url).hostname.endsWith('screensdesign.com');
  } catch {
    return false;
  }
};

const classifyRoute = (url) => {
  const pathname = new URL(url).pathname;

  if (/\/apps?\//i.test(pathname)) return 'app-detail-candidate';
  if (/\/category\//i.test(pathname)) return 'category-candidate';
  if (/\/tag\//i.test(pathname)) return 'tag-candidate';
  if (/\/collections?\//i.test(pathname)) return 'collection-candidate';

  return 'other';
};

const extractLinks = (html) => {
  const links = [];
  let match = HREF_RE.exec(html);

  while (match) {
    const absolute = toAbsolute(match[1]);
    if (absolute && inDomain(absolute)) {
      links.push(absolute);
    }
    match = HREF_RE.exec(html);
  }

  return [...new Set(links)];
};

const fetchPage = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url} (${response.status})`);
  }

  const html = await response.text();
  return {
    url,
    status: response.status,
    fetchedAt: new Date().toISOString(),
    links: extractLinks(html),
  };
};

const run = async () => {
  // This starter intentionally stays shallow and writes route candidates only.
  const root = await fetchPage(BASE_URL);

  const routeCandidates = root.links.map((url) => ({
    url,
    type: classifyRoute(url),
  }));

  const result = {
    source: BASE_URL,
    fetchedAt: new Date().toISOString(),
    policy: {
      mode: 'shallow-discovery',
      note: 'This script is an initial route-intake scaffold. Add policy checks before deep crawling.',
    },
    pages: [root],
    routeCandidates,
    counts: {
      discoveredLinks: root.links.length,
      appDetailCandidates: routeCandidates.filter((r) => r.type === 'app-detail-candidate').length,
      categoryCandidates: routeCandidates.filter((r) => r.type === 'category-candidate').length,
      tagCandidates: routeCandidates.filter((r) => r.type === 'tag-candidate').length,
      collectionCandidates: routeCandidates.filter((r) => r.type === 'collection-candidate').length,
    },
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`);

  console.log(`Saved intake snapshot: ${outPath}`);
  console.log(`Discovered links: ${result.counts.discoveredLinks}`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
