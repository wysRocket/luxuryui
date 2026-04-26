import productsData from './curation/commercial/figma-kit-products.json';
import specsData from './curation/commercial/figma-kit-specs.json';
import reviewsData from './curation/commercial/commercial-reviews.json';
import manifestsData from './curation/commercial/figma-content-manifests.json';
import {
  CommercialReview,
  CreditPackConfig,
  CreditQuote,
  FigmaKitProduct,
  GeneratedKitArtifacts,
  KitSpec,
} from '../types';
import { FLOW_DEFINITIONS } from './flows';

const figmaKitProducts = productsData.products as FigmaKitProduct[];
const figmaKitSpecs = specsData.kitSpecs as KitSpec[];
const figmaKitReviews = reviewsData.reviews as CommercialReview[];
const GENERATED_ARTIFACTS_ROOT_DIR = 'data/curation/commercial/generated-kit-artifacts';
const DELIVERY_PACKS_DIR = 'data/curation/commercial/delivery-packs';
type FigmaContentManifest = {
  productId: string;
  productSlug: string;
  figmaFileKey: string | null;
  pageOrder: string[];
  pageBlueprints: Array<{ name: string; contents: string[] }>;
  exportPackage: {
    fileName: string;
    previewCount: number;
    commercialReady: boolean;
  };
  generatedArtifacts: GeneratedKitArtifacts;
};

const buildGeneratedArtifactPathDefaults = (productSlug: string) => ({
  generatedArtifactsRootDir: GENERATED_ARTIFACTS_ROOT_DIR,
  generatedKitArtifactsDir: `${GENERATED_ARTIFACTS_ROOT_DIR}/${productSlug}`,
  deliveryPacksDir: DELIVERY_PACKS_DIR,
  deliveryPackPath: `${DELIVERY_PACKS_DIR}/${productSlug}.json`,
});

const normalizeGeneratedArtifacts = (
  manifest: {
    productSlug: string;
    exportPackage: {
      fileName: string;
      previewCount: number;
      commercialReady: boolean;
    };
    generatedArtifacts?: Partial<GeneratedKitArtifacts>;
  },
  generatedAtFallback: string
): GeneratedKitArtifacts => {
  const fallbackGenerationStatus =
    manifest.generatedArtifacts?.generationStatus ??
    (manifest.generatedArtifacts?.stage === 'failed'
      ? 'failed'
      : manifest.exportPackage.commercialReady || manifest.generatedArtifacts?.stage === 'generated' || manifest.generatedArtifacts?.stage === 'ready'
        ? 'generated'
        : 'pending');

  return {
    kitSlug: manifest.productSlug,
    generatedAt: manifest.generatedArtifacts?.generatedAt ?? generatedAtFallback,
    stage: manifest.generatedArtifacts?.stage ?? (manifest.exportPackage.commercialReady ? 'ready' : 'pending'),
    generationStatus: fallbackGenerationStatus,
    generationSource: manifest.generatedArtifacts?.generationSource ?? null,
    commercialReady: manifest.generatedArtifacts?.commercialReady ?? manifest.exportPackage.commercialReady,
    publishQualityStatus: manifest.generatedArtifacts?.publishQualityStatus ?? null,
    publishReadyForSale: manifest.generatedArtifacts?.publishReadyForSale ?? manifest.exportPackage.commercialReady,
    publishAssetOrigin: manifest.generatedArtifacts?.publishAssetOrigin ?? null,
    finalizationStatus: manifest.generatedArtifacts?.finalizationStatus ?? null,
    auditClassification: manifest.generatedArtifacts?.auditClassification ?? null,
    finalAssetId: manifest.generatedArtifacts?.finalAssetId ?? null,
    finalAssetUrl: manifest.generatedArtifacts?.finalAssetUrl ?? null,
    exportPackageFileName: manifest.generatedArtifacts?.exportPackageFileName ?? manifest.exportPackage.fileName,
    previewCount: manifest.generatedArtifacts?.previewCount ?? manifest.exportPackage.previewCount,
    stitchProjectId: manifest.generatedArtifacts?.stitchProjectId ?? null,
    selectedScreenIds: manifest.generatedArtifacts?.selectedScreenIds ?? [],
    stitchHtmlFiles: manifest.generatedArtifacts?.stitchHtmlFiles ?? [],
    stitchPreviewImages: manifest.generatedArtifacts?.stitchPreviewImages ?? [],
    sourceAssetPaths: manifest.generatedArtifacts?.sourceAssetPaths ?? [],
    sourceAppSlug: manifest.generatedArtifacts?.sourceAppSlug ?? null,
    sourceFlowId: manifest.generatedArtifacts?.sourceFlowId ?? null,
    paths: {
      ...buildGeneratedArtifactPathDefaults(manifest.productSlug),
      ...manifest.generatedArtifacts?.paths,
    },
  };
};

const figmaKitManifests = manifestsData.manifests.map((manifest) => {
  return {
    ...manifest,
    generatedArtifacts: normalizeGeneratedArtifacts(manifest, manifestsData.generatedAt),
  } satisfies FigmaContentManifest;
}) as FigmaContentManifest[];

export const FIGMA_KIT_PRODUCTS = figmaKitProducts;
export const KIT_SPECS = figmaKitSpecs;
export const COMMERCIAL_REVIEWS = figmaKitReviews;
export const FIGMA_CONTENT_MANIFESTS = figmaKitManifests;

export const CREDIT_PACK_CONFIG: CreditPackConfig = {
  minCredits: 1,
  maxCredits: 20_000,
  defaultCredits: 120,
  sliderStep: 1,
  buttonSteps: [10, 1],
  currencyRates: {
    EUR: 0.01,
    GBP: 0.0086,
  },
};

const roundCurrency = (amount: number): number =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

export const clampCredits = (credits: number): number =>
  Math.min(
    CREDIT_PACK_CONFIG.maxCredits,
    Math.max(
      CREDIT_PACK_CONFIG.minCredits,
      Math.round(Number.isFinite(credits) ? credits : CREDIT_PACK_CONFIG.defaultCredits),
    ),
  );

export const getCreditQuote = (credits: number): CreditQuote => {
  const clampedCredits = clampCredits(credits);

  return {
    credits: clampedCredits,
    eurTotal: roundCurrency(clampedCredits * CREDIT_PACK_CONFIG.currencyRates.EUR),
    gbpTotal: roundCurrency(clampedCredits * CREDIT_PACK_CONFIG.currencyRates.GBP),
  };
};

export const formatCreditCost = (credits: number): string => `${credits} credits`;

export const formatCurrencyAmount = (currency: 'EUR' | 'GBP', amount: number): string =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const getPublishedFigmaKits = (): FigmaKitProduct[] =>
  FIGMA_KIT_PRODUCTS.filter((product) => product.status === 'published');

export const getBlockedFigmaKits = (): FigmaKitProduct[] =>
  FIGMA_KIT_PRODUCTS.filter((product) => product.status !== 'published');

export const getFigmaKitBySlug = (slug: string): FigmaKitProduct | undefined =>
  FIGMA_KIT_PRODUCTS.find((product) => product.slug === slug);

export const getFigmaKitById = (productId: string): FigmaKitProduct | undefined =>
  FIGMA_KIT_PRODUCTS.find((product) => product.id === productId);

export const getPublishedKitForAppSlug = (sourceAppSlug: string): FigmaKitProduct | undefined =>
  getPublishedFigmaKits().find((product) => product.sourceAppSlug === sourceAppSlug);

export const getFigmaKitSpec = (productId: string): KitSpec | undefined =>
  KIT_SPECS.find((spec) => spec.productId === productId);

export const getCommercialReview = (productId: string): CommercialReview | undefined =>
  COMMERCIAL_REVIEWS.find((review) => review.productId === productId);

export const getFigmaManifest = (productId: string) =>
  FIGMA_CONTENT_MANIFESTS.find((manifest) => manifest.productId === productId);

export const getGeneratedArtifactsForKit = (productId: string) =>
  getFigmaManifest(productId)?.generatedArtifacts;

export const getPublishedKitsForFlow = (flowId: string): FigmaKitProduct[] =>
  getPublishedFigmaKits().filter((product) => product.primaryFlowId === flowId);

export const getFlowLabelForKit = (flowId: string): string =>
  FLOW_DEFINITIONS.find((flow) => flow.id === flowId)?.title ?? 'Flow Kit';

export const FIGMA_KIT_SUMMARY = {
  totalProducts: FIGMA_KIT_PRODUCTS.length,
  publishedProducts: getPublishedFigmaKits().length,
  blockedProducts: getBlockedFigmaKits().length,
  publishedFlows: [...new Set(getPublishedFigmaKits().map((product) => product.primaryFlowId))].length,
};
