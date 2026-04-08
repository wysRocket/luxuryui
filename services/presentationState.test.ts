import { describe, expect, it } from "vitest";
import type { AppItem, FigmaKitProduct } from "../types";
import {
  getAppPresentationState,
  getAvailableToUnlockKits,
  getCommercialState,
  getCreditState,
  getResearchTier,
} from "./presentationState";

const baseApp: AppItem = {
  id: "app-1",
  slug: "flo",
  name: "Flo",
  category: "Health",
  platform: "Web",
  screenCount: 8,
  image: "/flo/cover.webp",
  logo: "/flo/logo.webp",
  lastUpdated: "2026-04-08",
  sourceQuality: "pass",
  assetOrigin: "real",
};

const baseKit: FigmaKitProduct = {
  id: "kit-1",
  slug: "flo-figma-kit",
  title: "Flo Figma Kit",
  sourceAppSlug: "flo",
  sourceAppName: "Flo",
  primaryFlowId: "onboarding",
  type: "flow-kit",
  status: "published",
  figmaFileKey: null,
  thumbnail: "/flo/kit.webp",
  gallery: ["/flo/kit.webp"],
  includedScreens: 8,
  includedComponents: ["Cards"],
  includedTokens: ["Color"],
  licenseTier: "Commercial",
  creditCost: 140,
  bundleIds: [],
  transformationNotes: ["Transformed from curated research."],
  qualityScore: 92,
  completenessScore: 90,
  lastReviewedAt: "2026-04-08",
  previewPath: "/kits/flo-figma-kit",
  purchasePath: "/pricing",
  delivery: {
    format: "Figma",
    fulfillment: "Download",
    includes: ["Editable file"],
  },
};

describe("presentationState", () => {
  it("classifies premium real assets as verified research", () => {
    expect(getResearchTier(baseApp)).toBe("verified");
  });

  it("downgrades mixed real assets to research tier", () => {
    expect(
      getResearchTier({
        ...baseApp,
        sourceQuality: "warn",
      }),
    ).toBe("research");
  });

  it("never gives generated assets premium treatment", () => {
    expect(
      getResearchTier({
        ...baseApp,
        sourceQuality: "pass",
        assetOrigin: "generated",
      }),
    ).toBe("generated");
  });

  it("computes commercial state from kit presence and ownership", () => {
    expect(getCommercialState({ relatedKit: undefined, isOwned: false })).toBe(
      "none",
    );
    expect(getCommercialState({ relatedKit: baseKit, isOwned: false })).toBe(
      "available",
    );
    expect(getCommercialState({ relatedKit: baseKit, isOwned: true })).toBe(
      "owned",
    );
  });

  it("computes credit CTA state for signed-out, insufficient, and ready users", () => {
    expect(getCreditState(false, 0, baseKit.creditCost)).toBe("signed_out");
    expect(getCreditState(true, 20, baseKit.creditCost)).toBe("insufficient");
    expect(getCreditState(true, 180, baseKit.creditCost)).toBe("ready");
  });

  it("builds an app presentation state that keeps research primary and commerce secondary", () => {
    expect(
      getAppPresentationState({
        app: {
          ...baseApp,
          sourceQuality: "warn",
        },
        relatedKit: baseKit,
        isAuthenticated: true,
        walletBalance: 90,
        isOwned: false,
      }),
    ).toEqual({
      researchTier: "research",
      commercialState: "available",
      creditState: "insufficient",
      hasCommercialOffer: true,
    });
  });

  it("returns available-to-unlock kits with affordable ones first", () => {
    const kits = [
      {
        ...baseKit,
        id: "kit-expensive",
        slug: "flo-premium-figma-kit",
        title: "Flo Premium Figma Kit",
        creditCost: 220,
      },
      {
        ...baseKit,
        id: "kit-affordable",
        slug: "flo-core-figma-kit",
        title: "Flo Core Figma Kit",
        creditCost: 90,
      },
      {
        ...baseKit,
        id: "kit-owned",
        slug: "flo-owned-figma-kit",
        title: "Flo Owned Figma Kit",
        creditCost: 120,
      },
    ];

    expect(
      getAvailableToUnlockKits({
        publishedKits: kits,
        ownedProductIds: ["kit-owned"],
        walletBalance: 110,
      }).map((kit) => kit.id),
    ).toEqual(["kit-affordable", "kit-expensive"]);
  });
});
