// LuxuryUI Kit Publisher — Figma Plugin
// Single-file build mode: auto-detects which kit belongs to the current Figma file
// and builds Cover / Flow / Kit Details pages inside it.
// Requires the local server: npm run figma:publish

const SERVER = 'http://localhost:7777';

// ─── Figma page builders ──────────────────────────────────────────────────────

/** Mobile frame size (iPhone 14 Pro baseline) */
const FRAME_W = 390;
const FRAME_H = 844;

/** Spacing / layout constants */
const PAD = 40;
const SECTION_GAP = 32;
const CHIP_H = 36;
const CHIP_PAD = 16;

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};

const PALETTE = {
  black: hexToRgb('#0A0A0A'),
  white: hexToRgb('#FFFFFF'),
  surface: hexToRgb('#111111'),
  accent: hexToRgb('#C9A96E'), // luxury gold
  muted: hexToRgb('#6B7280'),
  border: hexToRgb('#1F1F1F'),
  chip: hexToRgb('#1A1A1A'),
};

const setFill = (node, color, opacity = 1) => {
  node.fills = [{ type: 'SOLID', color, opacity }];
};

const addText = async (parent, content, { x, y, w, h, size, weight, color, align } = {}) => {
  const t = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: weight === 700 ? 'Bold' : weight === 600 ? 'Semi Bold' : weight === 500 ? 'Medium' : 'Regular' });
  t.characters = content;
  t.fontSize = size !== undefined ? size : 14;
  t.fontName = { family: 'Inter', style: weight === 700 ? 'Bold' : weight === 600 ? 'Semi Bold' : weight === 500 ? 'Medium' : 'Regular' };
  t.fills = [{ type: 'SOLID', color: color || PALETTE.white }];
  if (w) t.resize(w, h !== undefined ? h : t.height);
  if (align) t.textAlignHorizontal = align;
  t.x = x !== undefined ? x : 0;
  t.y = y !== undefined ? y : 0;
  parent.appendChild(t);
  return t;
};

const addRect = (parent, { x, y, w, h, color, opacity, radius } = {}) => {
  const r = figma.createRectangle();
  r.resize(w !== undefined ? w : 100, h !== undefined ? h : 100);
  r.x = x !== undefined ? x : 0;
  r.y = y !== undefined ? y : 0;
  if (color) setFill(r, color, opacity !== undefined ? opacity : 1);
  if (radius) r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
};

// ─── Cover page ──────────────────────────────────────────────────────────────

const buildCoverPage = async (page, kit) => {
  page.name = 'Cover';
  const frame = figma.createFrame();
  frame.name = 'Cover';
  frame.resize(1440, 960);
  setFill(frame, PALETTE.black);
  page.appendChild(frame);

  // Background gradient overlay
  const grad = figma.createRectangle();
  grad.resize(1440, 960);
  grad.fills = [{
    type: 'GRADIENT_RADIAL',
    gradientTransform: [[0.5, 0, 0.5], [0, 0.5, 0.5]],
    gradientStops: [
      { position: 0, color: { r: PALETTE.accent.r, g: PALETTE.accent.g, b: PALETTE.accent.b, a: 0.12 } },
      { position: 1, color: { r: PALETTE.black.r, g: PALETTE.black.g, b: PALETTE.black.b, a: 0 } },
    ],
    opacity: 1,
  }];
  frame.appendChild(grad);

  // Kit name
  const appName = kit.sourceAppSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const flowName = kit.sourceFlowId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  await addText(frame, `${appName} — ${flowName} Kit`, {
    x: PAD * 2, y: 380, w: 900, size: 64, weight: 700, color: PALETTE.white,
  });
  await addText(frame, 'LuxuryUI Figma Flow Kit', {
    x: PAD * 2, y: 470, w: 600, size: 24, weight: 400, color: PALETTE.accent,
  });
  await addText(frame, `${kit.screenBlueprints.length} screens · ${kit.componentInventory.length} components · ${kit.tokenInventory.length} token sets`, {
    x: PAD * 2, y: 520, w: 800, size: 18, weight: 400, color: PALETTE.muted,
  });

  // Divider
  addRect(frame, { x: PAD * 2, y: 570, w: 80, h: 2, color: PALETTE.accent });

  await addText(frame, 'luxuryui.com', {
    x: PAD * 2, y: 590, w: 400, size: 14, weight: 400, color: PALETTE.muted,
  });
};

// ─── Flow page (main screens) ────────────────────────────────────────────────

const buildFlowPage = async (page, kit) => {
  page.name = 'Flow';
  const screens = kit.screenBlueprints || [];
  const cols = Math.min(screens.length, 4);
  const rows = Math.ceil(screens.length / cols);
  const gutter = 48;
  const canvasW = cols * FRAME_W + (cols + 1) * gutter;
  const canvasH = rows * FRAME_H + (rows + 1) * gutter + 120;

  const canvas = figma.createFrame();
  canvas.name = 'Flow Overview';
  canvas.resize(canvasW, canvasH);
  setFill(canvas, PALETTE.surface);
  page.appendChild(canvas);

  // Title
  await addText(canvas, 'User Flow — Screen Reference', {
    x: gutter, y: PAD, w: 800, size: 32, weight: 700, color: PALETTE.white,
  });

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const sx = gutter + col * (FRAME_W + gutter);
    const sy = 100 + row * (FRAME_H + gutter + 48);

    // Screen frame
    const sf = figma.createFrame();
    sf.name = screen.name || ('Screen ' + (i + 1));
    sf.resize(FRAME_W, FRAME_H);
    sf.x = sx;
    sf.y = sy;
    setFill(sf, PALETTE.border);
    sf.cornerRadius = 16;
    sf.clipsContent = true;
    canvas.appendChild(sf);

    // Try to load image
    if (screen.previewUrl || screen.sourceAssetPath) {
      try {
        const imgUrl = screen.previewUrl || screen.sourceAssetPath;
        // Construct absolute URL if relative public path
        const fetchUrl = imgUrl.startsWith('http') ? imgUrl : `http://localhost:7777/asset${imgUrl}`;
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const buf = await response.arrayBuffer();
          const img = figma.createImage(new Uint8Array(buf));
          const imgRect = figma.createRectangle();
          imgRect.resize(FRAME_W, FRAME_H);
          imgRect.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
          sf.appendChild(imgRect);
        } else {
          // Fallback: placeholder
          addRect(sf, { x: 0, y: 0, w: FRAME_W, h: FRAME_H, color: PALETTE.chip });
          await addText(sf, screen.name || ('Screen ' + (i + 1)), {
            x: PAD, y: FRAME_H / 2 - 20, w: FRAME_W - PAD * 2, size: 16, weight: 500, color: PALETTE.muted, align: 'CENTER',
          });
        }
      } catch (_) {
        addRect(sf, { x: 0, y: 0, w: FRAME_W, h: FRAME_H, color: PALETTE.chip });
      }
    }

    // Label below frame
    await addText(canvas, screen.sourceLabel || screen.name || ('Screen ' + (i + 1)), {
      x: sx, y: sy + FRAME_H + 12, w: FRAME_W, size: 13, weight: 400, color: PALETTE.muted, align: 'CENTER',
    });
  }
};

// ─── Kit Details page (Components + Tokens + License combined) ───────────────
// Combines all three into one page to stay within Figma Starter 3-page limit.

const buildKitDetailsPage = async (page, kit) => {
  page.name = 'Kit Details';
  const components = kit.componentInventory || [];
  const tokens = kit.tokenInventory || [];
  const totalH = Math.max(1200, 200 + components.length * 100 + 80 + tokens.length * 88 + 600);

  const frame = figma.createFrame();
  frame.name = 'Kit Details';
  frame.resize(1200, totalH);
  setFill(frame, PALETTE.surface);
  page.appendChild(frame);

  let y = PAD;

  // ── Components section
  await addText(frame, 'Component Inventory', { x: PAD, y, w: 800, size: 32, weight: 700, color: PALETTE.white });
  y += 48;
  await addText(frame, String(components.length) + ' abstracted components ready for use', { x: PAD, y, w: 600, size: 15, weight: 400, color: PALETTE.muted });
  y += 40;
  addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 1, color: PALETTE.border });
  y += 24;

  for (let i = 0; i < components.length; i++) {
    addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 80, color: PALETTE.chip, radius: 12 });
    addRect(frame, { x: PAD + 16, y: y + 22, w: 36, h: 36, color: PALETTE.accent, radius: 8 });
    await addText(frame, String(i + 1), { x: PAD + 16, y: y + 28, w: 36, size: 16, weight: 700, color: PALETTE.black, align: 'CENTER' });
    await addText(frame, components[i], { x: PAD + 72, y: y + 14, w: 700, size: 18, weight: 600, color: PALETTE.white });
    await addText(frame, 'Abstracted · Brand-neutral · Production-ready', { x: PAD + 72, y: y + 42, w: 700, size: 13, weight: 400, color: PALETTE.muted });
    y += 96;
  }

  y += 40;
  addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 1, color: PALETTE.border });
  y += 40;

  // ── Tokens section
  await addText(frame, 'Style Tokens', { x: PAD, y, w: 800, size: 32, weight: 700, color: PALETTE.white });
  y += 48;

  for (let i = 0; i < tokens.length; i++) {
    addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 72, color: PALETTE.chip, radius: 12 });
    addRect(frame, { x: PAD + 16, y: y + 16, w: 40, h: 40, color: PALETTE.accent, radius: 8 });
    await addText(frame, tokens[i], { x: PAD + 72, y: y + 12, w: 700, size: 18, weight: 600, color: PALETTE.white });
    await addText(frame, 'Applied across all screens in this kit', { x: PAD + 72, y: y + 40, w: 700, size: 13, weight: 400, color: PALETTE.muted });
    y += 88;
  }

  y += 40;
  await addText(frame, 'Spacing Scale', { x: PAD, y, w: 400, size: 20, weight: 700, color: PALETTE.white });
  y += 36;
  await addText(frame, '4 · 8 · 12 · 16 · 24 · 32 (8pt grid)', { x: PAD, y, w: 800, size: 15, weight: 400, color: PALETTE.muted });
  y += 60;
  addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 1, color: PALETTE.border });
  y += 40;

  // ── License section
  await addText(frame, 'License & Usage', { x: PAD, y, w: 800, size: 32, weight: 700, color: PALETTE.white });
  y += 48;
  addRect(frame, { x: PAD, y, w: 60, h: 3, color: PALETTE.accent });
  y += 24;

  var licLines = [
    'This Figma kit is licensed for personal and commercial use by the purchasing individual or team.',
    '',
    'You MAY:',
    '  Use this kit to design products, apps, and client work.',
    '  Modify and adapt the components for your own projects.',
    '  Use this kit across multiple projects for the license holder.',
    '',
    'You MAY NOT:',
    '  Redistribute, resell, or sublicense this kit.',
    '  Share this file with individuals outside the purchasing team.',
    '  Claim authorship or remove LuxuryUI attribution.',
    '',
    'All screenshots and UI references are sourced from publicly available app store materials.',
    'All components are fully abstracted and brand-neutral.',
    '',
    'luxuryui.com   All rights reserved.',
  ];

  await addText(frame, licLines.join('\n'), { x: PAD, y, w: 1200 - PAD * 2, size: 15, weight: 400, color: PALETTE.muted });
};

// ─── Build content in the current file ───────────────────────────────────────

var buildContentInCurrentFile = async function(kit, onStatus) {
  onStatus('Building Cover page...');
  var coverPage = figma.currentPage;
  await buildCoverPage(coverPage, kit);

  onStatus('Building Flow page...');
  var flowPage = figma.createPage();
  await buildFlowPage(flowPage, kit);

  onStatus('Building Kit Details page...');
  var detailsPage = figma.createPage();
  await buildKitDetailsPage(detailsPage, kit);

  figma.currentPage = coverPage;
  figma.viewport.scrollAndZoomIntoView(coverPage.children);
};

// ─── Main plugin entry ────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 480, height: 640, title: 'LuxuryUI Kit Publisher' });

function fetchWithTimeout(url, ms) {
  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() { reject(new Error('timeout')); }, ms);
    fetch(url).then(
      function(res) { clearTimeout(timer); resolve(res); },
      function(err) { clearTimeout(timer); reject(err); }
    );
  });
}

// On load: try auto-detect by fileKey, fall back to manual picker
(async function init() {
  var fileKey = figma.fileKey;
  if (fileKey) {
    try {
      var r = await fetchWithTimeout(SERVER + '/kit-by-file/' + fileKey, 5000);
      var d = await r.json();
      if (d.ok) {
        figma.ui.postMessage({ type: 'kit-detected', kitSlug: d.kitSlug, meta: {
          screenCount: (d.packet.screenBlueprints || []).length,
          componentCount: (d.packet.componentInventory || []).length,
          tokenCount: (d.packet.tokenInventory || []).length,
          sourceAppSlug: d.packet.sourceAppSlug,
          sourceFlowId: d.packet.sourceFlowId,
        }});
        return;
      }
    } catch (_) { /* fall through */ }
  }
  try {
    var r2 = await fetchWithTimeout(SERVER + '/all-kits', 5000);
    var list = await r2.json();
    figma.ui.postMessage({ type: 'show-picker', kits: list });
  } catch (err) {
    figma.ui.postMessage({
      type: 'server-error',
      message: 'Cannot reach server at localhost:7777\n\nMake sure you ran:\nnpm run figma:publish'
    });
  }
})();

figma.ui.onmessage = async function(msg) {
  // build-current: UI sends just the kitSlug, plugin fetches full data itself
  if (msg.type === 'build-current') {
    var kitSlug = msg.kitSlug;
    figma.ui.postMessage({ type: 'status', message: 'Fetching kit data...' });
    var kit;
    try {
      var r = await fetchWithTimeout(SERVER + '/kit-by-slug/' + kitSlug, 8000);
      var d = await r.json();
      if (!d.ok) {
        figma.ui.postMessage({ type: 'build-error', message: 'Kit not found: ' + kitSlug });
        return;
      }
      kit = d.packet;
    } catch (err) {
      figma.ui.postMessage({ type: 'build-error', message: 'Could not fetch kit: ' + err.message });
      return;
    }

    try {
      await buildContentInCurrentFile(kit, function(statusMsg) {
        figma.ui.postMessage({ type: 'status', message: statusMsg });
      });
      try {
        await fetch(SERVER + '/content-built', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kitSlug: kitSlug }),
        });
      } catch (_) { /* non-fatal */ }
      figma.ui.postMessage({ type: 'build-done', kitSlug: kitSlug });
    } catch (err) {
      figma.ui.postMessage({ type: 'build-error', message: err.message });
    }
  }

  if (msg.type === 'retry') {
    (async function retryInit() {
      var fileKey = figma.fileKey;
      if (fileKey) {
        try {
          var r = await fetchWithTimeout(SERVER + '/kit-by-file/' + fileKey, 5000);
          var d = await r.json();
          if (d.ok) {
            figma.ui.postMessage({ type: 'kit-detected', kitSlug: d.kitSlug, meta: {
              screenCount: (d.packet.screenBlueprints || []).length,
              componentCount: (d.packet.componentInventory || []).length,
              tokenCount: (d.packet.tokenInventory || []).length,
              sourceAppSlug: d.packet.sourceAppSlug,
              sourceFlowId: d.packet.sourceFlowId,
            }});
            return;
          }
        } catch (_) { /* fall through */ }
      }
      try {
        var r2 = await fetchWithTimeout(SERVER + '/all-kits', 5000);
        var list = await r2.json();
        figma.ui.postMessage({ type: 'show-picker', kits: list });
      } catch (err) {
        figma.ui.postMessage({
          type: 'server-error',
          message: 'Cannot reach server at localhost:7777\n\nMake sure you ran:\nnpm run figma:publish'
        });
      }
    })();
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};
