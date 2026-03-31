type BackendMode = 'local' | 'firebase';
type PaymentMode = 'local' | 'stripe';

const readEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[key];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }

  return undefined;
};

export const RUNTIME_CONFIG = {
  backendMode: (readEnv('VITE_BACKEND_MODE') === 'firebase' ? 'firebase' : 'local') as BackendMode,
  paymentMode: (readEnv('VITE_PAYMENT_MODE') === 'stripe' ? 'stripe' : 'local') as PaymentMode,
  hasLiveConcierge: Boolean(readEnv('VITE_GEMINI_API_KEY') || readEnv('GEMINI_API_KEY')),
  issues: [] as string[],
};

if (RUNTIME_CONFIG.backendMode === 'firebase') {
  const requiredFirebaseKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_APP_ID',
  ];

  for (const key of requiredFirebaseKeys) {
    if (!readEnv(key)) {
      RUNTIME_CONFIG.issues.push(`Missing ${key} for Firebase mode.`);
    }
  }
}

if (RUNTIME_CONFIG.paymentMode === 'stripe' && !readEnv('VITE_STRIPE_PUBLISHABLE_KEY')) {
  RUNTIME_CONFIG.issues.push('Missing VITE_STRIPE_PUBLISHABLE_KEY for Stripe mode.');
}

export const getRuntimeWarnings = (): string[] => {
  const warnings: string[] = [];

  if (RUNTIME_CONFIG.backendMode === 'local') {
    warnings.push('Running in local workspace mode. Auth, credits, and unlocks persist in this browser only.');
  }

  if (RUNTIME_CONFIG.paymentMode === 'local') {
    warnings.push('Credit top-ups are completed instantly in-app until a live Stripe checkout is configured.');
  }

  return [...warnings, ...RUNTIME_CONFIG.issues];
};

export const assertRuntimeConfiguration = (): void => {
  if (RUNTIME_CONFIG.issues.length > 0) {
    throw new Error(RUNTIME_CONFIG.issues.join(' '));
  }
};
