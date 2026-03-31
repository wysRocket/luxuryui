import productsData from './curation/commercial/figma-kit-products.json';
import specsData from './curation/commercial/figma-kit-specs.json';
import reviewsData from './curation/commercial/commercial-reviews.json';
import manifestsData from './curation/commercial/figma-content-manifests.json';
import { CommercialReview, CreditPackConfig, CreditQuote, FigmaKitProduct, KitSpec } from '../types';
import { FLOW_DEFINITIONS } from './flows';

const figmaKitProducts = productsData.products as FigmaKitProduct[];
const figmaKitSpecs = specsData.kitSpecs as KitSpec[];
const figmaKitReviews = reviewsData.reviews as CommercialReview[];
const figmaKitManifests = manifestsData.manifests as Array<{
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
}>;

export const FIGMA_KIT_PRODUCTS = figmaKitProducts;
export const KIT_SPECS = figmaKitSpecs;
export const COMMERCIAL_REVIEWS = figmaKitReviews;
export const FIGMA_CONTENT_MANIFESTS = figmaKitManifests;

export const CREDIT_PACK_CONFIG: CreditPackConfig = {
  minCredits: 25,
  maxCredits: 500,
  defaultCredits: 120,
  sliderStep: 1,
  buttonSteps: [10, 1],
  currencyRates: {
    EUR: 0.65,
    GBP: 0.56,
  },
};

export const clampCredits = (credits: number): number =>
  Math.min(CREDIT_PACK_CONFIG.maxCredits, Math.max(CREDIT_PACK_CONFIG.minCredits, credits));

export const getCreditQuote = (credits: number): CreditQuote => {
  const clampedCredits = clampCredits(credits);

  return {
    credits: clampedCredits,
    eurTotal: Number((clampedCredits * CREDIT_PACK_CONFIG.currencyRates.EUR).toFixed(2)),
    gbpTotal: Number((clampedCredits * CREDIT_PACK_CONFIG.currencyRates.GBP).toFixed(2)),
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
