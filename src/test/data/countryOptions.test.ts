import { describe, expect, it } from "vitest";
import {
  COUNTRY_OPTIONS,
  normalizeCountryCode,
} from "@/data/countryOptions";

describe("countryOptions", () => {
  it("loads a stable ISO country list without browser region APIs", () => {
    expect(COUNTRY_OPTIONS.length).toBeGreaterThan(200);
    expect(COUNTRY_OPTIONS.some((country) => country.code === "GB")).toBe(true);
    expect(COUNTRY_OPTIONS.some((country) => country.code === "US")).toBe(true);
  });

  it("normalizes invalid saved country values to the default", () => {
    expect(normalizeCountryCode("gb")).toBe("GB");
    expect(normalizeCountryCode("United Kingdom")).toBe("GB");
  });
});
