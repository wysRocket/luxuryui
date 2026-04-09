import { describe, expect, it } from "vitest";
import {
  CREDIT_PACK_CONFIG,
  clampCredits,
  getCreditQuote,
} from "@/data/figmaKits";

describe("figmaKits pricing math", () => {
  it("clamps to configured min and max", () => {
    expect(clampCredits(CREDIT_PACK_CONFIG.minCredits - 10)).toBe(
      CREDIT_PACK_CONFIG.minCredits,
    );
    expect(clampCredits(CREDIT_PACK_CONFIG.maxCredits + 10)).toBe(
      CREDIT_PACK_CONFIG.maxCredits,
    );
  });

  it("rounds credit values to whole numbers", () => {
    expect(clampCredits(120.2)).toBe(120);
    expect(clampCredits(120.8)).toBe(121);
  });

  it("falls back to default credits for non-finite values", () => {
    expect(clampCredits(Number.NaN)).toBe(CREDIT_PACK_CONFIG.defaultCredits);
    expect(clampCredits(Number.POSITIVE_INFINITY)).toBe(
      CREDIT_PACK_CONFIG.defaultCredits,
    );
  });

  it("returns currency totals rounded to cents", () => {
    expect(getCreditQuote(123)).toEqual({
      credits: 123,
      eurTotal: 79.95,
      gbpTotal: 68.88,
    });
  });
});
