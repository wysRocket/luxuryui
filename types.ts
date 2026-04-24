import type { ReactNode } from "react";

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  platform: "iOS" | "Android" | "Web";
  screenCount: number;
  image: string; // URL for the cover image
  logo: string; // URL for the app logo
  lastUpdated: string;
  sourceQuality?: "pass" | "warn" | "fail" | "unknown";
  qualityWarnings?: string[];
  assetOrigin?: "real" | "generated";
}

export interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

export interface FilterTag {
  id: string;
  label: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface ReferenceApp extends AppItem {
  researchStatus: "reference-only" | "kit-ready";
  sourceQuality: "pass" | "warn" | "fail" | "unknown";
}

export type FigmaKitType =
  | "screen-kit"
  | "flow-kit"
  | "component-kit"
  | "full-system";
export type FigmaKitStatus = "draft" | "ready" | "published" | "blocked";

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

export type AuthProvider = "local" | "firebase-password" | "firebase-google";
export type AuthStatus = "loading" | "authenticated" | "anonymous";
export type AdminStatus = "idle" | "loading" | "ready";
export type UserRole = "user" | "admin";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  provider: AuthProvider;
}

export type UserProfile = AuthenticatedUser;

export interface AuthBackend {
  signUp: (input: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<AuthenticatedUser>;
  signIn: (input: {
    email: string;
    password: string;
  }) => Promise<AuthenticatedUser>;
  signInWithGoogle: () => Promise<AuthenticatedUser>;
  signOut: () => Promise<void>;
  onAuthStateChanged: (
    listener: (user: AuthenticatedUser | null) => void,
  ) => () => void;
  getCurrentUser: () => Promise<AuthenticatedUser | null>;
}

export interface CreditWallet {
  userId: string;
  balance: number;
  lifetimePurchased: number;
  lifetimeSpent: number;
  createdAt?: string;
  updatedAt: string;
}

export interface UserProfileRecord {
  uid: string;
  email: string;
  displayName: string;
  provider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleRecord {
  userId: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: "topup" | "purchase" | "refund";
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
  status: "pending" | "succeeded" | "failed";
  createdAt: string;
}

export interface KitUnlock {
  id: string;
  userId: string;
  productId: string;
  creditsSpent: number;
  unlockedAt: string;
  downloadStatus: "available" | "downloaded";
}

export interface KitOrder {
  id: string;
  userId: string;
  productId: string;
  creditCost: number;
  status: "unlocked" | "fulfilled";
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

export type GeneratedKitArtifactStage = "planned" | "pending" | "generated" | "packaged" | "ready" | "failed";
export type GeneratedKitGenerationStatus = "pending" | "generated" | "packaged" | "failed";
export type GeneratedKitSource = "stitch" | "direct";
export type PublishQualityStatus = "pass" | "warn" | "fail" | "unknown";
export type PublishAssetOrigin = "raw" | "upscaled" | "rescued";

export type KitFinalizationStatus =
  | "blocked"
  | "audited"
  | "eligible_for_export"
  | "exported_from_stitch"
  | "content_verified"
  | "delivery_verified"
  | "finalized";

export type KitAuditClassification = "finalized" | "repairable" | "must_regenerate" | "blocked";
export type StitchExportMode = "rapid" | "standard";
export type FinalizationCheckStatus = "pass" | "fail";

export interface KitFinalizationCheck {
  status: FinalizationCheckStatus;
  reason: string | null;
  verifiedAt: string | null;
}

export interface KitExportEvidence {
  method: "stitch-export-to-figma";
  exportedAt: string | null;
  finalAssetId: string | null;
  finalAssetUrl: string | null;
  source: "stitch" | "manual-record";
}

export interface KitFinalizationRecord {
  schema: "1";
  kitSlug: string;
  productId: string;
  finalizationStatus: KitFinalizationStatus;
  auditClassification: KitAuditClassification;
  stitchProjectId: string | null;
  stitchMode: StitchExportMode | null;
  exportEligibility: KitFinalizationCheck;
  exportEvidence: KitExportEvidence;
  contentVerification: KitFinalizationCheck & {
    requiredPages: string[];
    expectedScreenCount: number;
    expectedComponentCount: number;
    expectedTokenCount: number;
  };
  deliveryVerification: KitFinalizationCheck & {
    fulfillmentType: "stitch-figma-export" | "none";
    handoffUrl: string | null;
  };
  blockingReasons: string[];
  updatedAt: string;
}

export interface GeneratedKitArtifactPaths {
  generatedArtifactsRootDir: string;
  generatedKitArtifactsDir: string;
  deliveryPacksDir: string;
  deliveryPackPath: string;
}

export interface GeneratedKitArtifacts {
  kitSlug: string;
  generatedAt: string;
  stage: GeneratedKitArtifactStage;
  generationStatus: GeneratedKitGenerationStatus;
  generationSource?: GeneratedKitSource | null;
  commercialReady: boolean;
  publishQualityStatus?: PublishQualityStatus | null;
  publishReadyForSale?: boolean;
  publishAssetOrigin?: PublishAssetOrigin | null;
  exportPackageFileName: string;
  previewCount: number;
  stitchProjectId?: string | null;
  selectedScreenIds?: string[];
  stitchHtmlFiles?: string[];
  stitchPreviewImages?: string[];
  sourceAssetPaths?: string[];
  sourceAppSlug?: string | null;
  sourceFlowId?: string | null;
  paths: GeneratedKitArtifactPaths;
}

export interface CommercialReview {
  productId: string;
  productSlug: string;
  sourceAppSlug: string;
  reviewStatus: "approved" | "blocked";
  sourceQuality: PublishQualityStatus;
  publishQualityStatus?: PublishQualityStatus;
  originalityStatus: "transformed" | "too-close" | "needs-review";
  completenessStatus: "pass" | "fail";
  provenanceStatus: "linked" | "partial" | "missing";
  readyForSale: boolean;
  publishReadyForSale?: boolean;
  publishAssetOrigin?: PublishAssetOrigin;
  legalNotes: string[];
  editorialNotes: string[];
  reviewedAt: string;
}

export interface AppSessionState {
  authStatus: AuthStatus;
  user: AuthenticatedUser | null;
  wallet: CreditWallet | null;
  transactions: CreditTransaction[];
  topUps: CreditTopUp[];
  unlocks: KitUnlock[];
  orders: KitOrder[];
}

export interface AdminOverviewSnapshot {
  profiles: UserProfileRecord[];
  roles: UserRoleRecord[];
  wallets: CreditWallet[];
  transactions: CreditTransaction[];
  topUps: CreditTopUp[];
  unlocks: KitUnlock[];
  orders: KitOrder[];
}

export interface CommerceStore {
  ensureWallet: (user: UserProfile) => Promise<CreditWallet> | CreditWallet;
  subscribeToWallet: (
    userId: string,
    listener: (wallet: CreditWallet | null) => void,
  ) => () => void;
  subscribeToTransactions: (
    userId: string,
    listener: (transactions: CreditTransaction[]) => void,
  ) => () => void;
  subscribeToTopUps: (
    userId: string,
    listener: (topUps: CreditTopUp[]) => void,
  ) => () => void;
  subscribeToOrders: (
    userId: string,
    listener: (orders: KitOrder[]) => void,
  ) => () => void;
  subscribeToUnlocks: (
    userId: string,
    listener: (unlocks: KitUnlock[]) => void,
  ) => () => void;
  topUpCredits: (user: UserProfile, credits: number) => Promise<CreditTopUp>;
  purchaseKit: (user: UserProfile, kit: FigmaKitProduct) => Promise<KitUnlock>;
  markDownloadStatus: (
    userId: string,
    unlockId: string,
    status: KitUnlock["downloadStatus"],
  ) => Promise<void> | void;
}
