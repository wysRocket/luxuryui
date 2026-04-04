// LuxuryUI Kit Publisher — Figma Plugin
// Connects to the local publish-to-figma.mjs server on :7777
// Creates a Figma file per kit with Cover / Flow / Components / Tokens / License pages.

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
  t.fontSize = size ?? 14;
  t.fontName = { family: 'Inter', style: weight === 700 ? 'Bold' : weight === 600 ? 'Semi Bold' : weight === 500 ? 'Medium' : 'Regular' };
  t.fills = [{ type: 'SOLID', color: color ?? PALETTE.white }];
  if (w) t.resize(w, h ?? t.height);
  if (align) t.textAlignHorizontal = align;
  t.x = x ?? 0;
  t.y = y ?? 0;
  parent.appendChild(t);
  return t;
};

const addRect = (parent, { x, y, w, h, color, opacity, radius } = {}) => {
  const r = figma.createRectangle();
  r.resize(w ?? 100, h ?? 100);
  r.x = x ?? 0;
  r.y = y ?? 0;
  if (color) setFill(r, color, opacity ?? 1);
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
      { position: 0, color: { ...PALETTE.accent, a: 0.12 } },
      { position: 1, color: { ...PALETTE.black, a: 0 } },
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
  const screens = kit.screenBlueprints ?? [];
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
    sf.name = screen.name ?? `Screen ${i + 1}`;
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
        const imgUrl = screen.previewUrl ?? screen.sourceAssetPath;
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
          await addText(sf, screen.name ?? `Screen ${i + 1}`, {
            x: PAD, y: FRAME_H / 2 - 20, w: FRAME_W - PAD * 2, size: 16, weight: 500, color: PALETTE.muted, align: 'CENTER',
          });
        }
      } catch {
        addRect(sf, { x: 0, y: 0, w: FRAME_W, h: FRAME_H, color: PALETTE.chip });
      }
    }

    // Label below frame
    await addText(canvas, screen.sourceLabel ?? screen.name ?? `Screen ${i + 1}`, {
      x: sx, y: sy + FRAME_H + 12, w: FRAME_W, size: 13, weight: 400, color: PALETTE.muted, align: 'CENTER',
    });
  }
};

// ─── Components page ─────────────────────────────────────────────────────────

const buildComponentsPage = async (page, kit) => {
  page.name = 'Components';
  const components = kit.componentInventory ?? [];
  const canvasH = Math.max(600, components.length * 120 + 200);

  const frame = figma.createFrame();
  frame.name = 'Component Inventory';
  frame.resize(1200, canvasH);
  setFill(frame, PALETTE.surface);
  page.appendChild(frame);

  await addText(frame, 'Component Inventory', {
    x: PAD, y: PAD, w: 800, size: 36, weight: 700, color: PALETTE.white,
  });
  await addText(frame, `${components.length} abstracted components ready for use`, {
    x: PAD, y: PAD + 52, w: 600, size: 16, weight: 400, color: PALETTE.muted,
  });

  addRect(frame, { x: PAD, y: PAD + 80, w: 1200 - PAD * 2, h: 1, color: PALETTE.border });

  for (let i = 0; i < components.length; i++) {
    const y = 120 + i * 100;

    // Card
    const card = addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 80, color: PALETTE.chip, radius: 12 });

    // Index chip
    addRect(frame, { x: PAD + 16, y: y + 22, w: 36, h: 36, color: PALETTE.accent, radius: 8 });
    await addText(frame, String(i + 1), {
      x: PAD + 16, y: y + 28, w: 36, size: 16, weight: 700, color: PALETTE.black, align: 'CENTER',
    });

    await addText(frame, components[i], {
      x: PAD + 72, y: y + 14, w: 700, size: 20, weight: 600, color: PALETTE.white,
    });
    await addText(frame, 'Abstracted · Brand-neutral · Production-ready', {
      x: PAD + 72, y: y + 42, w: 700, size: 13, weight: 400, color: PALETTE.muted,
    });
  }
};

// ─── Tokens page ─────────────────────────────────────────────────────────────

const buildTokensPage = async (page, kit) => {
  page.name = 'Tokens';
  const tokens = kit.tokenInventory ?? [];
  const spec = kit.spec ?? {};
  const canvasH = Math.max(800, tokens.length * 120 + 400);

  const frame = figma.createFrame();
  frame.name = 'Style Tokens';
  frame.resize(1200, canvasH);
  setFill(frame, PALETTE.surface);
  page.appendChild(frame);

  await addText(frame, 'Style Tokens', {
    x: PAD, y: PAD, w: 800, size: 36, weight: 700, color: PALETTE.white,
  });

  let y = 100;

  // Token sets
  for (const token of tokens) {
    const card = addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 72, color: PALETTE.chip, radius: 12 });
    addRect(frame, { x: PAD + 16, y: y + 16, w: 40, h: 40, color: PALETTE.accent, radius: 8 });
    await addText(frame, token, {
      x: PAD + 72, y: y + 12, w: 700, size: 20, weight: 600, color: PALETTE.white,
    });
    await addText(frame, 'Applied across all frames in this kit', {
      x: PAD + 72, y: y + 40, w: 700, size: 13, weight: 400, color: PALETTE.muted,
    });
    y += 88;
  }

  y += 32;
  addRect(frame, { x: PAD, y, w: 1200 - PAD * 2, h: 1, color: PALETTE.border });
  y += 32;

  await addText(frame, 'Spacing Scale', {
    x: PAD, y, w: 400, size: 24, weight: 700, color: PALETTE.white,
  });
  y += 48;

  await addText(frame, '4 · 8 · 12 · 16 · 24 · 32 (8pt grid)', {
    x: PAD, y, w: 800, size: 16, weight: 400, color: PALETTE.muted,
  });
};

// ─── License page ────────────────────────────────────────────────────────────

const buildLicensePage = async (page, kit) => {
  page.name = 'License';

  const frame = figma.createFrame();
  frame.name = 'License';
  frame.resize(1200, 800);
  setFill(frame, PALETTE.black);
  page.appendChild(frame);

  await addText(frame, 'License & Usage', {
    x: PAD * 2, y: PAD * 2, w: 800, size: 36, weight: 700, color: PALETTE.white,
  });

  addRect(frame, { x: PAD * 2, y: PAD * 2 + 56, w: 60, h: 3, color: PALETTE.accent });

  const licenseText = [
    'This Figma kit is licensed for personal and commercial use by the purchasing individual or team.',
    '',
    'You MAY:',
    '  · Use this kit to design products, apps, and client work.',
    '  · Modify and adapt the components for your own projects.',
    '  · Use this kit across multiple projects for the license holder.',
    '',
    'You MAY NOT:',
    '  · Redistribute, resell, or sublicense this kit.',
    '  · Share this file with individuals outside the purchasing team.',
    '  · Claim authorship or remove LuxuryUI attribution.',
    '',
    'All screenshots and UI references used as inspiration are sourced from publicly available',
    'app store materials. All components are fully abstracted and brand-neutral.',
    '',
    '© LuxuryUI · luxuryui.com · All rights reserved.',
  ].join('\n');

  await addText(frame, licenseText, {
    x: PAD * 2, y: PAD * 2 + 96, w: 1200 - PAD * 4, size: 16, weight: 400, color: PALETTE.muted,
  });
};

// ─── Create a full kit file ───────────────────────────────────────────────────

const createKitFile = async (kit) => {
  const appName = kit.sourceAppSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const flowName = kit.sourceFlowId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const fileName = `${appName} — ${flowName} Figma Flow Kit`;

  // Figma Plugin API: work inside current file by creating a new page per kit
  // (Figma plugins cannot create new files directly; we use one file per run
  //  with pages grouped by kit, then the user duplicates per kit if needed.)
  // Each "kit" becomes a top-level section with sub-pages.

  const coverPage = figma.createPage();
  await buildCoverPage(coverPage, kit);

  const flowPage = figma.createPage();
  await buildFlowPage(flowPage, kit);

  const componentsPage = figma.createPage();
  await buildComponentsPage(componentsPage, kit);

  const tokensPage = figma.createPage();
  await buildTokensPage(tokensPage, kit);

  const licensePage = figma.createPage();
  await buildLicensePage(licensePage, kit);

  return { coverPage, flowPage, componentsPage, tokensPage, licensePage };
};

// ─── Main plugin entry ────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 480, height: 600, title: 'LuxuryUI Kit Publisher' });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'fetch-kits') {
    try {
      const res = await fetch(`${SERVER}/kits`);
      const data = await res.json();
      figma.ui.postMessage({ type: 'kits-loaded', data });
    } catch {
      figma.ui.postMessage({ type: 'error', message: `Cannot reach server at ${SERVER}. Run: npm run figma:publish` });
    }
  }

  if (msg.type === 'fetch-progress') {
    try {
      const res = await fetch(`${SERVER}/progress`);
      const data = await res.json();
      figma.ui.postMessage({ type: 'progress-loaded', data });
    } catch {
      figma.ui.postMessage({ type: 'error', message: 'Server not reachable.' });
    }
  }

  if (msg.type === 'publish-kits') {
    const { kits } = msg;
    const results = [];

    figma.ui.postMessage({ type: 'status', message: `Publishing ${kits.length} kits...` });

    for (let i = 0; i < kits.length; i++) {
      const kit = kits[i];
      figma.ui.postMessage({ type: 'status', message: `[${i + 1}/${kits.length}] Creating ${kit.kitSlug}...` });

      try {
        await createKitFile(kit);

        // The current file's key is the figmaFileKey for this kit
        const figmaFileKey = figma.fileKey ?? 'local-preview';

        // POST the key back to the server
        await fetch(`${SERVER}/figma-key`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kitSlug: kit.kitSlug, figmaFileKey }),
        });

        results.push({ kitSlug: kit.kitSlug, figmaFileKey, ok: true });
        figma.ui.postMessage({ type: 'kit-done', kitSlug: kit.kitSlug, figmaFileKey });
      } catch (err) {
        results.push({ kitSlug: kit.kitSlug, ok: false, error: err.message });
        figma.ui.postMessage({ type: 'kit-error', kitSlug: kit.kitSlug, error: err.message });
      }
    }

    figma.ui.postMessage({ type: 'all-done', results });
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};
