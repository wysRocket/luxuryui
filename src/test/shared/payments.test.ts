import { describe, expect, it } from "vitest";
import {
  amountMajorToMinor,
  creditsFromMinorAmount,
} from "@/shared/payments/catalog.js";
import { normalizeCustomerProfile } from "@/shared/payments/customer.js";

describe("shared payment helpers", () => {
  it("accepts the one-credit SafePay amount floor", () => {
    const amountMinor = amountMajorToMinor("0.01", "EUR");

    expect(amountMinor).toBe(1);
    expect(creditsFromMinorAmount(amountMinor, "EUR")).toBe(1);
  });

  it("normalizes only two-letter country codes", () => {
    expect(normalizeCustomerProfile({ countryCode: "gb" }).countryCode).toBe(
      "GB",
    );
    expect(normalizeCustomerProfile({ countryCode: "United Kingdom" }).countryCode).toBe(
      "",
    );
  });
});
