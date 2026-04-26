import { beforeEach, describe, expect, it } from "vitest";
import { getFigmaKitBySlug } from "@/data/figmaKits";
import {
  purchaseKitWithCredits,
  topUpWalletCredits,
} from "@/services/appSessionStore";
import type { UserProfile } from "@/types";

const user: UserProfile = {
  uid: "buyer-1",
  email: "buyer@example.com",
  displayName: "Buyer",
  provider: "local",
  createdAt: "2026-04-26T00:00:00.000Z",
};

describe("appSessionStore commerce", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
      removeItem: (key: string) => {
        values.delete(key);
      },
      clear: () => {
        values.clear();
      },
      key: (index: number) => Array.from(values.keys())[index] ?? null,
      get length() {
        return values.size;
      },
    };

    Object.defineProperty(window, "localStorage", {
      value: storage,
      configurable: true,
    });
  });

  it("allows a one-credit top-up", async () => {
    const topUp = await topUpWalletCredits(user, 1);

    expect(topUp.creditsPurchased).toBe(1);
    expect(topUp.eurAmount).toBe(0.01);
  });

  it("blocks kit purchases when the wallet has insufficient credits", async () => {
    const kit = getFigmaKitBySlug("monzo-figma-kit");

    expect(kit).toBeTruthy();
    await expect(purchaseKitWithCredits(user, kit!)).rejects.toThrow(
      "Not enough credits",
    );
  });

  it("blocks unfinalized kits even when the wallet has enough credits", async () => {
    const kit = getFigmaKitBySlug("revolut-figma-kit");

    expect(kit).toBeTruthy();
    await topUpWalletCredits(user, 1000);
    await expect(purchaseKitWithCredits(user, kit!)).rejects.toThrow(
      "research-only",
    );
  });
});
