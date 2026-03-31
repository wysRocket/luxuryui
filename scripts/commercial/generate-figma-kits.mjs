import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG_ENTRIES, slugify } from '../../data/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const qualityReportPath = path.join(projectRoot, 'data', 'curation', 'coverage', 'screensdesign-quality-report.json');
const flowPacksPath = path.join(projectRoot, 'data', 'curation', 'flows', 'screensdesign-flow-packs.json');
const outputDir = path.join(projectRoot, 'data', 'curation', 'commercial');

const DEFAULT_FLOW_BY_CATEGORY = {
  Finance: 'account-settings',
  Crypto: 'account-settings',
  Shopping: 'checkout',
  Social: 'social-engagement',
  Travel: 'search-discovery',
  Business: 'subscription-upgrade',
  Health: 'onboarding',
  Music: 'subscription-upgrade',
  Education: 'onboarding',
  News: 'search-discovery',
};

const FLOW_COMPONENTS = {
  onboarding: ['Welcome hero', 'Preference picker', 'Progress tracker', 'Primary CTA footer'],
  checkout: ['Cart summary', 'Line item row', 'Payment selector', 'Confirmation state'],
  'search-discovery': ['Search header', 'Suggestion chip row', 'Result card', 'Filter bottom sheet'],
  'social-engagement': ['Feed card', 'Reaction rail', 'Composer sheet', 'Notification prompt'],
  'account-settings': ['Profile header', 'Settings list', 'Security action tile', 'Success toast'],
  'subscription-upgrade': ['Plan comparison card', 'Feature checklist', 'Billing selector', 'Upgrade confirmation'],
};

const CATEGORY_TOKENS = {
  Finance: ['Neutral finance palette', 'Data-heavy typography scale', 'Tight 8pt spacing grid'],
  Crypto: ['High-contrast market palette', 'Compact metric typography', 'Dense dashboard spacing'],
  Shopping: ['Merchandising accent palette', 'Commerce hierarchy styles', 'Responsive card spacing'],
  Social: ['Expressive social accent palette', 'Feed-first text styles', 'Engagement spacing system'],
  Travel: ['Editorial travel palette', 'Search and booking typography', 'Comfort-first spacing scale'],
  Business: ['Productivity neutral palette', 'Enterprise text hierarchy', 'Operational spacing rhythm'],
  Health: ['Calm wellness palette', 'Soft onboarding typography', 'Breathing room spacing scale'],
  Music: ['Media-dark palette', 'Subscription typography', 'Immersive content spacing'],
  Education: ['Learning accent palette', 'Structured lesson typography', 'Guided flow spacing'],
  News: ['Editorial mono accents', 'Scanning typography', 'Reading-friendly rhythm'],
};

const sanitizeScreenshots = (slug, screenshotFiles = []) =>
  screenshotFiles.map((file) => `/assets/apps/${slug}/${file.file}`);

const scoreForStatus = (status, screenshotCount) => {
  if (status === 'pass') return Math.min(98, 88 + Math.min(screenshotCount, 8));
  if (status === 'warn') return Math.min(82, 62 + Math.min(screenshotCount, 8));
  if (status === 'fail') return Math.min(54, 28 + Math.min(screenshotCount, 6) * 2);
  return 20;
};

const completenessForStatus = (status, screenshotCount) => {
  const coveragePct = Math.min(1, screenshotCount / 8);

  if (status === 'pass') return Math.round(90 + coveragePct * 10);
  if (status === 'warn') return Math.round(52 + coveragePct * 18);
  if (status === 'fail') return Math.round(20 + coveragePct * 20);
  return 10;
};

const creditCostForKit = (qualityScore, completenessScore, includedScreens) => {
  let credits = includedScreens >= 7 ? 120 : 90;

  if (qualityScore >= 95 && completenessScore >= 95) {
    credits += 20;
  } else if (qualityScore < 90 || completenessScore < 90) {
    credits -= 10;
  }

  return Math.max(60, credits);
};

const run = async () => {
  const [qualityReport, flowPacks] = await Promise.all([
    readFile(qualityReportPath, 'utf8').then((raw) => JSON.parse(raw)),
    readFile(flowPacksPath, 'utf8').then((raw) => JSON.parse(raw)),
  ]);

  const qualityBySlug = new Map(qualityReport.apps.map((app) => [app.slug, app]));
  const flowById = new Map(flowPacks.packs.map((pack) => [pack.flowId, pack]));
  const appFlowMap = new Map();

  for (const pack of flowPacks.packs) {
    for (const app of pack.apps) {
      if (!appFlowMap.has(app.slug)) {
        appFlowMap.set(app.slug, []);
      }
      appFlowMap.get(app.slug).push({
        flowId: pack.flowId,
        title: pack.title,
        objective: pack.objective,
      });
    }
  }

  const generatedAt = new Date().toISOString();
  const products = [];
  const kitSpecs = [];
  const manifests = [];
  const reviews = [];

  for (const entry of CATALOG_ENTRIES) {
    const quality = qualityBySlug.get(entry.slug);
    const sourceQuality = quality?.status ?? 'unknown';
    const screenshotFiles = quality?.screenshots?.files ?? [];
    const screenshotCount = quality?.screenshots?.validCount ?? 0;
    const flowMatches = appFlowMap.get(entry.slug) ?? [];
    const primaryFlowId = flowMatches[0]?.flowId ?? DEFAULT_FLOW_BY_CATEGORY[entry.category] ?? 'onboarding';
    const primaryFlow = flowById.get(primaryFlowId);
    const gallery = sanitizeScreenshots(entry.slug, screenshotFiles.slice(0, 3));
    const includedScreens = Math.max(5, Math.min(8, screenshotCount || 5));
    const includedComponents = FLOW_COMPONENTS[primaryFlowId] ?? FLOW_COMPONENTS.onboarding;
    const includedTokens = CATEGORY_TOKENS[entry.category] ?? CATEGORY_TOKENS.Business;
    const isApproved = sourceQuality === 'pass' && screenshotCount >= 6;
    const status = isApproved ? 'published' : 'blocked';
    const reviewStatus = isApproved ? 'approved' : 'blocked';
    const kitSlug = `${entry.slug}-figma-kit`;
    const titleFlow = primaryFlow?.title?.replace(/\s+Flow$/i, '') ?? 'Flow';
    const title = `${entry.name} ${titleFlow} Figma Flow Kit`;
    const qualityScore = scoreForStatus(sourceQuality, screenshotCount);
    const completenessScore = completenessForStatus(sourceQuality, screenshotCount);
    const creditCost = creditCostForKit(qualityScore, completenessScore, includedScreens);

    products.push({
      id: `figma-kit:${entry.slug}`,
      slug: kitSlug,
      title,
      sourceAppSlug: entry.slug,
      sourceAppName: entry.name,
      primaryFlowId,
      type: 'flow-kit',
      status,
      figmaFileKey: isApproved ? `luxuryui/${primaryFlowId}/${entry.slug}/v1` : null,
      thumbnail: gallery[0] ?? null,
      gallery,
      includedScreens,
      includedComponents,
      includedTokens,
      licenseTier: 'Commercial',
      creditCost,
      bundleIds: [`flow-${primaryFlowId}`, `category-${slugify(entry.category)}`],
      transformationNotes: [
        `Transform ${entry.name} reference patterns into an original ${titleFlow.toLowerCase()} kit with renamed UI copy and generalized components.`,
        'Do not mirror source branding, iconography, or raw layout one-for-one.',
        'Package the result as an editable Figma file with tokens, component variants, and usage notes.',
      ],
      qualityScore,
      completenessScore,
      lastReviewedAt: generatedAt,
      previewPath: `/kits/${kitSlug}`,
      purchasePath: '/pricing',
      delivery: {
        format: 'Figma file',
        fulfillment: 'Own-site delivery pack',
        includes: [
          'Editable Figma flow file',
          'Cover and usage page',
          'Core component section',
          'Color and text style tokens',
          'Commercial license summary',
        ],
      },
    });

    kitSpecs.push({
      productId: `figma-kit:${entry.slug}`,
      productSlug: kitSlug,
      targetKitType: 'flow-kit',
      selectedSourceFlowId: primaryFlowId,
      includedFrames: [
        'Cover page',
        'Flow overview',
        ...Array.from({ length: includedScreens }, (_, index) => `Transformed screen ${index + 1}`),
        'Component set',
        'Style tokens',
        'Usage notes',
      ],
      componentAbstractions: includedComponents,
      colorStyles: includedTokens,
      textStyles: ['Display / Hero', 'Heading / Section', 'Body / Default', 'Label / UI'],
      spacingScale: ['4', '8', '12', '16', '24', '32'],
      gridConvention: '8pt spacing system with 12-column desktop and 4-column mobile reference grids',
      renameRules: [
        'Replace brand-specific nouns with generalized product language.',
        'Swap proprietary icon metaphors for neutral system metaphors.',
        'Use placeholder but realistic content across all frames.',
      ],
      placeholderContentPolicy: [
        'No direct reuse of source marketing copy.',
        'Use generalized avatars, illustrations, and product names.',
        'Keep tone premium, but not source-identical.',
      ],
      previewImages: gallery,
      deliveryChecklist: [
        'All frames renamed and grouped',
        'Component variants exposed',
        'Styles converted to reusable tokens',
        'Commercial license metadata attached',
      ],
    });

    manifests.push({
      productId: `figma-kit:${entry.slug}`,
      productSlug: kitSlug,
      figmaFileKey: isApproved ? `luxuryui/${primaryFlowId}/${entry.slug}/v1` : null,
      pageOrder: ['Cover', 'Flow', 'Components', 'Tokens', 'License'],
      pageBlueprints: [
        { name: 'Cover', contents: ['Hero frame', 'What is included', 'Transformation notes'] },
        { name: 'Flow', contents: Array.from({ length: includedScreens }, (_, index) => `Screen ${index + 1}`) },
        { name: 'Components', contents: includedComponents },
        { name: 'Tokens', contents: includedTokens },
        { name: 'License', contents: ['Usage guidance', 'Commercial terms', 'Support links'] },
      ],
      exportPackage: {
        fileName: `${kitSlug}.fig`,
        previewCount: gallery.length,
        commercialReady: isApproved,
      },
    });

    reviews.push({
      productId: `figma-kit:${entry.slug}`,
      productSlug: kitSlug,
      sourceAppSlug: entry.slug,
      reviewStatus,
      sourceQuality,
      originalityStatus: 'transformed',
      completenessStatus: isApproved ? 'pass' : 'fail',
      provenanceStatus: quality ? 'linked' : 'missing',
      readyForSale: isApproved,
      legalNotes: [
        'Use source screenshots as research evidence only.',
        'Do not sell source screenshots or source-identical layouts as the deliverable.',
      ],
      editorialNotes: isApproved
        ? ['Approved for storefront merchandising as an original transformed kit.']
        : ['Blocked until source quality and catalog readiness improve.'],
      reviewedAt: generatedAt,
    });
  }

  const summary = {
    totalProducts: products.length,
    publishedProducts: products.filter((product) => product.status === 'published').length,
    blockedProducts: products.filter((product) => product.status === 'blocked').length,
    flowsRepresented: [...new Set(products.filter((product) => product.status === 'published').map((product) => product.primaryFlowId))].length,
  };

  await mkdir(outputDir, { recursive: true });

  await Promise.all([
    writeFile(
      path.join(outputDir, 'figma-kit-products.json'),
      `${JSON.stringify({ schema: '2', generatedAt, summary, products }, null, 2)}\n`
    ),
    writeFile(
      path.join(outputDir, 'figma-kit-specs.json'),
      `${JSON.stringify({ schema: '1', generatedAt, summary, kitSpecs }, null, 2)}\n`
    ),
    writeFile(
      path.join(outputDir, 'figma-content-manifests.json'),
      `${JSON.stringify({ schema: '1', generatedAt, summary, manifests }, null, 2)}\n`
    ),
    writeFile(
      path.join(outputDir, 'commercial-reviews.json'),
      `${JSON.stringify({ schema: '1', generatedAt, summary, reviews }, null, 2)}\n`
    ),
  ]);

  console.log(`Generated ${summary.totalProducts} Figma kit records (${summary.publishedProducts} published / ${summary.blockedProducts} blocked).`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
