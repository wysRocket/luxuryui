import type { AppItem, FigmaKitProduct } from "../types";

export type ResearchTier = "verified" | "research" | "generated";
export type CommercialState = "none" | "available" | "owned";
export type CreditState = "signed_out" | "insufficient" | "ready";

export interface AppPresentationState {
  researchTier: ResearchTier;
  commercialState: CommercialState;
  creditState: CreditState;
  hasCommercialOffer: boolean;
}

export const getResearchTier = ({
  sourceQuality,
  assetOrigin,
}: Pick<AppItem, "sourceQuality" | "assetOrigin">): ResearchTier => {
  if (assetOrigin === "generated") {
    return "generated";
  }

  if (sourceQuality === "pass") {
    return "verified";
  }

  return "research";
};

export const getCommercialState = ({
  relatedKit,
  isOwned,
}: {
  relatedKit?: FigmaKitProduct;
  isOwned: boolean;
}): CommercialState => {
  if (!relatedKit) {
    return "none";
  }

  return isOwned ? "owned" : "available";
};

export const getCreditState = (
  isAuthenticated: boolean,
  walletBalance: number,
  creditCost: number,
): CreditState => {
  if (!isAuthenticated) {
    return "signed_out";
  }

  return walletBalance >= creditCost ? "ready" : "insufficient";
};

export const getAppPresentationState = ({
  app,
  relatedKit,
  isAuthenticated,
  walletBalance,
  isOwned,
}: {
  app: AppItem;
  relatedKit?: FigmaKitProduct;
  isAuthenticated: boolean;
  walletBalance: number;
  isOwned: boolean;
}): AppPresentationState => ({
  researchTier: getResearchTier(app),
  commercialState: getCommercialState({ relatedKit, isOwned }),
  creditState: getCreditState(
    isAuthenticated,
    walletBalance,
    relatedKit?.creditCost ?? Number.POSITIVE_INFINITY,
  ),
  hasCommercialOffer: Boolean(relatedKit),
});

export const getAvailableToUnlockKits = ({
  publishedKits,
  ownedProductIds,
  walletBalance,
}: {
  publishedKits: FigmaKitProduct[];
  ownedProductIds: string[];
  walletBalance: number;
}): FigmaKitProduct[] => {
  const ownedSet = new Set(ownedProductIds);

  return publishedKits
    .filter((kit) => !ownedSet.has(kit.id))
    .sort((left, right) => {
      const leftAffordable = left.creditCost <= walletBalance ? 0 : 1;
      const rightAffordable = right.creditCost <= walletBalance ? 0 : 1;

      return (
        leftAffordable - rightAffordable ||
        left.creditCost - right.creditCost ||
        left.title.localeCompare(right.title)
      );
    });
};
