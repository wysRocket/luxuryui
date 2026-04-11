import { describe, expect, it } from "vitest";

import { isFirestorePermissionDeniedError } from "@/services/firebaseErrorUtils";

describe("firebaseErrorUtils", () => {
  it("detects Firestore permission-denied errors", () => {
    expect(
      isFirestorePermissionDeniedError({
        code: "permission-denied",
        name: "FirebaseError",
      }),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(
      isFirestorePermissionDeniedError({
        code: "auth/popup-blocked",
        name: "FirebaseError",
      }),
    ).toBe(false);
    expect(
      isFirestorePermissionDeniedError(new Error("Something else broke")),
    ).toBe(false);
  });
});
