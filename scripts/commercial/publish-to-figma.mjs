import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync, existsSync, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const PORT = 7777;
const ARTIFACTS_DIR = path.join(projectRoot, 'data', 'curation', 'commercial', 'generated-kit-artifacts');
const PUBLIC_DIR = path.join(projectRoot, 'public');

// ─── Helpers ────────────────────────────────────────────────────────────────

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const json = (res, statusCode, data) => {
  cors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

const collectBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

// ─── Load all reconstruction packets ────────────────────────────────────────

const loadAllPackets = async () => {
  const packets = [];
  let dirs = [];
  try {
    const { readdirSync } = await import('node:fs');
    dirs = readdirSync(ARTIFACTS_DIR).filter((name) =>
      existsSync(path.join(ARTIFACTS_DIR, name, 'figma', 'reconstruction.json'))
    );
  } catch {
    return packets;
  }

  for (const kitSlug of dirs) {
    const packetPath = path.join(ARTIFACTS_DIR, kitSlug, 'figma', 'reconstruction.json');
    try {
      const packet = await readJson(packetPath);
      packets.push({ kitSlug, packet, packetPath });
    } catch {
      // skip unreadable
    }
  }

  return packets;
};

// ─── Update figmaFileKey in a reconstruction.json ───────────────────────────

const updateFigmaFileKey = async (kitSlug, figmaFileKey) => {
  const packetPath = path.join(ARTIFACTS_DIR, kitSlug, 'figma', 'reconstruction.json');
  let packet;
  try {
    packet = await readJson(packetPath);
  } catch {
    throw new Error(`No reconstruction.json found for ${kitSlug}`);
  }

  packet.figmaFileKey = figmaFileKey;
  packet.figmaPublishedAt = new Date().toISOString();
  packet.nextAction = 'done';

  await writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`);
  return packet;
};

// ─── Request router ─────────────────────────────────────────────────────────

const handleRequest = async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Preflight
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /kit-by-file/:fileKey — return reconstruction packet for a specific Figma file
  if (req.method === 'GET' && url.pathname.startsWith('/kit-by-file/')) {
    const fileKey = url.pathname.slice('/kit-by-file/'.length);
    const all = await loadAllPackets();
    const found = all.find(({ packet }) => packet.figmaFileKey === fileKey);
    if (found) {
      json(res, 200, { ok: true, kitSlug: found.kitSlug, packet: found.packet });
    } else {
      json(res, 404, { ok: false, error: `No kit found for fileKey: ${fileKey}` });
    }
    return;
  }

  // GET /kits — return all reconstruction packets that need a figmaFileKey
  if (req.method === 'GET' && url.pathname === '/kits') {
    const all = await loadAllPackets();
    const pending = all.filter(({ packet }) => !packet.figmaFileKey);
    const done = all.filter(({ packet }) => Boolean(packet.figmaFileKey));
    json(res, 200, {
      total: all.length,
      pending: pending.length,
      done: done.length,
      kits: pending.map(({ kitSlug, packet }) => ({
        kitSlug,
        productId: packet.productId,
        pageOrder: packet.pageOrder,
        screenBlueprints: packet.screenBlueprints,
        componentInventory: packet.componentInventory,
        tokenInventory: packet.tokenInventory,
        transformationNotes: packet.transformationNotes,
        sourceAppSlug: packet.sourceAppSlug,
        sourceFlowId: packet.sourceFlowId,
      })),
    });
    return;
  }

  // GET /progress — summary of how many are done
  if (req.method === 'GET' && url.pathname === '/progress') {
    const all = await loadAllPackets();
    const done = all.filter(({ packet }) => Boolean(packet.figmaFileKey));
    const built = all.filter(({ packet }) => Boolean(packet.contentBuiltAt));
    json(res, 200, {
      total: all.length,
      done: done.length,
      pending: all.length - done.length,
      contentBuilt: built.length,
      contentPending: all.length - built.length,
      completedKits: done.map(({ kitSlug, packet }) => ({
        kitSlug,
        figmaFileKey: packet.figmaFileKey,
        figmaUrl: `https://www.figma.com/design/${packet.figmaFileKey}`,
        publishedAt: packet.figmaPublishedAt,
        contentBuilt: Boolean(packet.contentBuiltAt),
      })),
    });
    return;
  }

  // POST /content-built — mark a kit's Figma file as having content built
  // Body: { kitSlug: string }
  if (req.method === 'POST' && url.pathname === '/content-built') {
    let body;
    try {
      body = JSON.parse(await collectBody(req));
    } catch {
      json(res, 400, { error: 'Invalid JSON body' });
      return;
    }
    const { kitSlug } = body;
    if (!kitSlug) {
      json(res, 400, { error: 'kitSlug is required' });
      return;
    }
    const packetPath = path.join(ARTIFACTS_DIR, kitSlug, 'figma', 'reconstruction.json');
    try {
      const packet = JSON.parse(await readFile(packetPath, 'utf8'));
      packet.contentBuiltAt = new Date().toISOString();
      await writeFile(packetPath, JSON.stringify(packet, null, 2) + '\n');
      console.log(`  🎨 ${kitSlug} — content built`);
      json(res, 200, { ok: true, kitSlug, contentBuiltAt: packet.contentBuiltAt });
    } catch (err) {
      json(res, 404, { error: err.message });
    }
    return;
  }

  // POST /figma-key — write figmaFileKey back to reconstruction.json
  // Body: { kitSlug: string, figmaFileKey: string }
  if (req.method === 'POST' && url.pathname === '/figma-key') {
    let body;
    try {
      body = JSON.parse(await collectBody(req));
    } catch {
      json(res, 400, { error: 'Invalid JSON body' });
      return;
    }

    const { kitSlug, figmaFileKey } = body;
    if (!kitSlug || !figmaFileKey) {
      json(res, 400, { error: 'kitSlug and figmaFileKey are required' });
      return;
    }

    try {
      const updated = await updateFigmaFileKey(kitSlug, figmaFileKey);
      console.log(`  ✅ ${kitSlug} → figma.com/file/${figmaFileKey}`);
      json(res, 200, { ok: true, kitSlug, figmaFileKey, updatedAt: updated.figmaPublishedAt });
    } catch (err) {
      json(res, 404, { error: err.message });
    }
    return;
  }

  // POST /figma-keys — batch update (array of { kitSlug, figmaFileKey })
  if (req.method === 'POST' && url.pathname === '/figma-keys') {
    let body;
    try {
      body = JSON.parse(await collectBody(req));
    } catch {
      json(res, 400, { error: 'Invalid JSON body' });
      return;
    }

    if (!Array.isArray(body)) {
      json(res, 400, { error: 'Body must be an array of { kitSlug, figmaFileKey }' });
      return;
    }

    const results = [];
    for (const { kitSlug, figmaFileKey } of body) {
      try {
        await updateFigmaFileKey(kitSlug, figmaFileKey);
        console.log(`  ✅ ${kitSlug} → figma.com/file/${figmaFileKey}`);
        results.push({ kitSlug, ok: true, figmaFileKey });
      } catch (err) {
        results.push({ kitSlug, ok: false, error: err.message });
      }
    }
    json(res, 200, { results });
    return;
  }

  // GET /asset/* — proxy local public assets to plugin (bypasses Figma's no-local-file restriction)
  if (req.method === 'GET' && url.pathname.startsWith('/asset/')) {
    const assetPath = url.pathname.slice('/asset'.length); // e.g. /assets/apps/monzo/screen-1.png
    const fsPath = path.join(PUBLIC_DIR, assetPath);
    // Security: ensure path stays inside PUBLIC_DIR
    if (!fsPath.startsWith(PUBLIC_DIR)) {
      json(res, 403, { error: 'Forbidden' });
      return;
    }
    if (!existsSync(fsPath)) {
      json(res, 404, { error: 'Asset not found' });
      return;
    }
    cors(res);
    const ext = path.extname(fsPath).toLowerCase();
    const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[ext] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    createReadStream(fsPath).pipe(res);
    return;
  }

  json(res, 404, { error: 'Not found' });
};

// ─── Main ────────────────────────────────────────────────────────────────────

const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error('Server error:', err.message);
    try {
      json(res, 500, { error: err.message });
    } catch {
      res.end();
    }
  }
});

server.listen(PORT, async () => {
  const all = await loadAllPackets();
  const pending = all.filter(({ packet }) => !packet.figmaFileKey);
  const done = all.filter(({ packet }) => Boolean(packet.figmaFileKey));

  console.log('\n🎨 LuxuryUI Figma Publisher Server');
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`   Kits total:   ${all.length}`);
  console.log(`   Published:    ${done.length}`);
  console.log(`   Pending:      ${pending.length}\n`);
  console.log('─'.repeat(50));
  console.log('STEP 1 — Open Figma desktop app');
  console.log('STEP 2 — Plugins → Development → Import plugin from manifest');
  console.log(`         Select: ${path.join(__dirname, 'figma-plugin', 'manifest.json')}`);
  console.log('STEP 3 — Run the plugin from any Figma file');
  console.log('STEP 4 — Click "Publish All Kits" in the plugin UI');
  console.log('STEP 5 — Plugin will create files and POST figmaFileKeys here');
  console.log('─'.repeat(50));
  console.log('\nEndpoints:');
  console.log(`  GET  http://localhost:${PORT}/kits       — pending kit specs`);
  console.log(`  GET  http://localhost:${PORT}/progress   — completion status`);
  console.log(`  POST http://localhost:${PORT}/figma-key  — { kitSlug, figmaFileKey }`);
  console.log(`  POST http://localhost:${PORT}/figma-keys — [{ kitSlug, figmaFileKey }, ...]`);
  console.log('\nWaiting for plugin...\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop any other publish-to-figma process.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
