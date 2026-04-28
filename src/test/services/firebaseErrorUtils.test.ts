import { describe, expect, it } from "vitest";

import {
  isFirestorePermissionDeniedError,
  isFirestoreUnauthenticatedError,
} from "@/services/firebaseErrorUtils";

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

  describe("isFirestoreUnauthenticatedError", () => {
    it("detects errors with code 'unauthenticated'", () => {
      expect(
        isFirestoreUnauthenticatedError({
          code: "unauthenticated",
          name: "FirebaseError",
          message: "Request is missing required authentication credential.",
        }),
      ).toBe(true);
    });

    it("detects errors with the prefixed code 'firestore/unauthenticated'", () => {
      expect(
        isFirestoreUnauthenticatedError({
          code: "firestore/unauthenticated",
          name: "FirebaseError",
          message: "UNAUTHENTICATED",
        }),
      ).toBe(true);
    });

    it("detects errors with message matching the gRPC UNAUTHENTICATED pattern", () => {
      expect(
        isFirestoreUnauthenticatedError({
          code: "some-other-code",
          message:
            "Request is missing required authentication credential. Expected OAuth 2 access token.",
        }),
      ).toBe(true);
    });

    it("returns false for permission-denied errors", () => {
      expect(
        isFirestoreUnauthenticatedError({
          code: "permission-denied",
          name: "FirebaseError",
          message: "Missing or insufficient permissions.",
        }),
      ).toBe(false);
    });

    it("returns false for unrelated errors", () => {
      expect(
        isFirestoreUnauthenticatedError({
          code: "auth/popup-blocked",
          name: "FirebaseError",
        }),
      ).toBe(false);
      expect(
        isFirestoreUnauthenticatedError(new Error("Something else broke")),
      ).toBe(false);
    });

    it("returns false for null and non-objects", () => {
      expect(isFirestoreUnauthenticatedError(null)).toBe(false);
      expect(isFirestoreUnauthenticatedError(undefined)).toBe(false);
      expect(isFirestoreUnauthenticatedError("unauthenticated")).toBe(false);
    });
  });
});
