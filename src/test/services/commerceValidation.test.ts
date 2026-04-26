import { describe, expect, it } from "vitest";
import { getFigmaKitBySlug } from "@/data/figmaKits";
import { assertPurchasableKit } from "@/services/commerceValidation";

describe("commerceValidation", () => {
  it("allows published kits with a positive credit price", () => {
    const kit = getFigmaKitBySlug("monzo-figma-kit");

    expect(kit).toBeTruthy();
    expect(() => assertPurchasableKit(kit!)).not.toThrow();
  });

  it("blocks kits that would otherwise be acquired for free", () => {
    const kit = getFigmaKitBySlug("monzo-figma-kit");

    expect(kit).toBeTruthy();
    expect(() => assertPurchasableKit({ ...kit!, creditCost: 0 })).toThrow(
      "valid credit price",
    );
  });
});
