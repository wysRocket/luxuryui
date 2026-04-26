import { getCommercialReview, getGeneratedArtifactsForKit } from "../data/figmaKits";
import type { FigmaKitProduct } from "../types";

export const assertPurchasableKit = (kit: FigmaKitProduct): void => {
  const review = getCommercialReview(kit.id);

  if (!review?.readyForSale || kit.status !== "published") {
    throw new Error("This kit is still research-only and cannot be unlocked yet.");
  }

  const artifacts = getGeneratedArtifactsForKit(kit.id);

  if (
    artifacts?.finalizationStatus !== "finalized" ||
    !artifacts.finalAssetUrl ||
    !artifacts.finalAssetVerifiedAt
  ) {
    throw new Error("This kit is missing a verified final Figma asset and cannot be unlocked yet.");
  }

  if (
    !Number.isFinite(kit.creditCost) ||
    !Number.isInteger(kit.creditCost) ||
    kit.creditCost < 1
  ) {
    throw new Error("This kit is missing a valid credit price and cannot be unlocked.");
  }
};
