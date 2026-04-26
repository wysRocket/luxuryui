import { describe, expect, it } from "vitest";
import {
  CREDIT_PACK_CONFIG,
  clampCredits,
  getCreditQuote,
} from "@/data/figmaKits";

describe("figmaKits pricing math", () => {
  it("allows one-credit top-ups as the pricing floor", () => {
    expect(CREDIT_PACK_CONFIG.minCredits).toBe(1);
    expect(getCreditQuote(1)).toEqual({
      credits: 1,
      eurTotal: 0.01,
      gbpTotal: 0.01,
    });
  });

  it("matches the cloudbase max top-up amount", () => {
    const maxQuote = getCreditQuote(CREDIT_PACK_CONFIG.maxCredits);

    expect(CREDIT_PACK_CONFIG.maxCredits).toBe(20_000);
    expect(maxQuote.eurTotal).toBe(200);
  });

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
      eurTotal: 1.23,
      gbpTotal: 1.06,
    });
  });
});
