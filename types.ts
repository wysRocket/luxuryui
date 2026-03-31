import React from 'react';

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  platform: 'iOS' | 'Android' | 'Web';
  screenCount: number;
  image: string; // URL for the cover image
  logo: string; // URL for the app logo
  lastUpdated: string;
  sourceQuality?: 'pass' | 'warn' | 'fail' | 'unknown';
  qualityWarnings?: string[];
  assetOrigin?: 'real' | 'generated';
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface FilterTag {
  id: string;
  label: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ReferenceApp extends AppItem {
  researchStatus: 'reference-only' | 'kit-ready';
  sourceQuality: 'pass' | 'warn' | 'fail' | 'unknown';
}

export type FigmaKitType = 'screen-kit' | 'flow-kit' | 'component-kit' | 'full-system';
export type FigmaKitStatus = 'draft' | 'ready' | 'published' | 'blocked';

export interface CreditPackConfig {
  minCredits: number;
  maxCredits: number;
  defaultCredits: number;
  sliderStep: number;
  buttonSteps: [number, number];
  currencyRates: {
    EUR: number;
    GBP: number;
  };
}

export interface CreditQuote {
  credits: number;
  eurTotal: number;
  gbpTotal: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface CreditWallet {
  userId: string;
  balance: number;
  lifetimePurchased: number;
  lifetimeSpent: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'topup' | 'purchase' | 'refund';
  creditsDelta: number;
  relatedKitId?: string;
  relatedOrderId?: string;
  createdAt: string;
}

export interface CreditTopUp {
  id: string;
  userId: string;
  creditsPurchased: number;
  eurAmount: number;
  gbpAmount: number;
  stripeSessionId: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
}

export interface KitUnlock {
  id: string;
  userId: string;
  productId: string;
  creditsSpent: number;
  unlockedAt: string;
  downloadStatus: 'available' | 'downloaded';
}

export interface KitOrder {
  id: string;
  userId: string;
  productId: string;
  creditCost: number;
  status: 'unlocked' | 'fulfilled';
  fulfilledAt: string | null;
}

export interface FigmaKitProduct {
  id: string;
  slug: string;
  title: string;
  sourceAppSlug: string;
  sourceAppName: string;
  primaryFlowId: string;
  type: FigmaKitType;
  status: FigmaKitStatus;
  figmaFileKey: string | null;
  thumbnail: string | null;
  gallery: string[];
  includedScreens: number;
  includedComponents: string[];
  includedTokens: string[];
  licenseTier: string;
  creditCost: number;
  bundleIds: string[];
  transformationNotes: string[];
  qualityScore: number;
  completenessScore: number;
  lastReviewedAt: string;
  previewPath: string;
  purchasePath: string;
  delivery: {
    format: string;
    fulfillment: string;
    includes: string[];
  };
}

export interface KitSpec {
  productId: string;
  productSlug: string;
  targetKitType: FigmaKitType;
  selectedSourceFlowId: string;
  includedFrames: string[];
  componentAbstractions: string[];
  colorStyles: string[];
  textStyles: string[];
  spacingScale: string[];
  gridConvention: string;
  renameRules: string[];
  placeholderContentPolicy: string[];
  previewImages: string[];
  deliveryChecklist: string[];
}

export interface CommercialReview {
  productId: string;
  productSlug: string;
  sourceAppSlug: string;
  reviewStatus: 'approved' | 'blocked';
  sourceQuality: 'pass' | 'warn' | 'fail' | 'unknown';
  originalityStatus: 'transformed' | 'too-close' | 'needs-review';
  completenessStatus: 'pass' | 'fail';
  provenanceStatus: 'linked' | 'partial' | 'missing';
  readyForSale: boolean;
  legalNotes: string[];
  editorialNotes: string[];
  reviewedAt: string;
}
