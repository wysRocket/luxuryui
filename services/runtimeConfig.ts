export type BackendMode = "local" | "firebase";
export type PaymentMode = "local" | "stripe" | "safepay";

const readEnv = (key: string): string | undefined => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const value = import.meta.env[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  }

  return undefined;
};

const readBooleanEnv = (key: string): boolean | undefined => {
  const value = readEnv(key);
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }

  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  return undefined;
};

const rawPaymentMode = readEnv("VITE_PAYMENT_MODE");

export const RUNTIME_CONFIG = {
  backendMode: (readEnv("VITE_BACKEND_MODE") === "firebase"
    ? "firebase"
    : "local") as BackendMode,
  paymentMode: (rawPaymentMode === "safepay"
    ? "safepay"
    : rawPaymentMode === "stripe"
    ? "stripe"
    : "local") as PaymentMode,
  hasLiveConcierge: Boolean(
    readEnv("VITE_GEMINI_API_KEY") || readEnv("GEMINI_API_KEY"),
  ),
  firebase: {
    apiKey: readEnv("VITE_FIREBASE_API_KEY") ?? "",
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN") ?? "",
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID") ?? "",
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET") ?? "",
    appId: readEnv("VITE_FIREBASE_APP_ID") ?? "",
    googleAuthEnabled: readBooleanEnv("VITE_FIREBASE_GOOGLE_AUTH_ENABLED"),
    authorizedDomains: (readEnv("VITE_FIREBASE_AUTHORIZED_DOMAINS") ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  },
  issues: [] as string[],
};

if (RUNTIME_CONFIG.backendMode === "firebase") {
  const requiredFirebaseKeys = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_APP_ID",
  ];

  for (const key of requiredFirebaseKeys) {
    if (!readEnv(key)) {
      RUNTIME_CONFIG.issues.push(`Missing ${key} for Firebase mode.`);
    }
  }
}

if (
  RUNTIME_CONFIG.paymentMode === "stripe" &&
  !readEnv("VITE_STRIPE_PUBLISHABLE_KEY")
) {
  RUNTIME_CONFIG.issues.push(
    "Missing VITE_STRIPE_PUBLISHABLE_KEY for Stripe mode.",
  );
}

export const getRuntimeWarnings = (): string[] => {
  const warnings: string[] = [];

  if (RUNTIME_CONFIG.backendMode === "local") {
    warnings.push(
      "Running in local workspace mode. Auth, credits, and unlocks persist in this browser only.",
    );
  } else {
    warnings.push(
      "Running with Firebase accounts and Firestore wallet sync. Payment processing is still mock/local until SafePay checkout is configured.",
    );

    if (RUNTIME_CONFIG.firebase.googleAuthEnabled === false) {
      warnings.push(
        "Firebase Google sign-in is marked disabled by VITE_FIREBASE_GOOGLE_AUTH_ENABLED=false.",
      );
    }

    if (RUNTIME_CONFIG.firebase.googleAuthEnabled === undefined) {
      warnings.push(
        "Set VITE_FIREBASE_GOOGLE_AUTH_ENABLED=true after enabling Google provider in Firebase Auth to track deployment readiness.",
      );
    }

    if (RUNTIME_CONFIG.firebase.authorizedDomains.length === 0) {
      warnings.push(
        "Set VITE_FIREBASE_AUTHORIZED_DOMAINS to a comma-separated list of Firebase Auth authorized domains for deployment verification.",
      );
    }
  }

  if (RUNTIME_CONFIG.paymentMode === "local") {
    warnings.push(
      "Credit top-ups are completed instantly in-app until a live SafePay checkout is configured.",
    );
  }

  if (RUNTIME_CONFIG.paymentMode === "safepay") {
    warnings.push(
      "Running with SafePay live checkout. Payments are processed via SafePay and credits are applied to Firebase wallet.",
    );
  }

  return [...warnings, ...RUNTIME_CONFIG.issues];
};

export const assertRuntimeConfiguration = (): void => {
  if (RUNTIME_CONFIG.issues.length > 0) {
    throw new Error(RUNTIME_CONFIG.issues.join(" "));
  }
};
