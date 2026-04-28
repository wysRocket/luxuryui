export const isFirestorePermissionDeniedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code =
    "code" in error && typeof error.code === "string" ? error.code : "";
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return (
    code === "permission-denied" ||
    code === "firestore/permission-denied" ||
    /missing or insufficient permissions/i.test(message)
  );
};

/**
 * Returns true when a Firebase / Firestore error corresponds to gRPC status
 * code 16 (UNAUTHENTICATED) — i.e. requests made without a valid auth
 * credential.  This happens when Firestore is accessed before the user has
 * signed in, when the ID token has expired and has not yet been refreshed, or
 * when the Firebase app is initialised with an invalid / missing API key.
 */
export const isFirestoreUnauthenticatedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code =
    "code" in error && typeof error.code === "string" ? error.code : "";
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  return (
    code === "unauthenticated" ||
    code === "firestore/unauthenticated" ||
    /missing required authentication credential/i.test(message)
  );
};
