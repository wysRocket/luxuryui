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
