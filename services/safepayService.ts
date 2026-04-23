import { getAuth } from 'firebase/auth';
import { getCreditQuote } from '../data/figmaKits';
import { RUNTIME_CONFIG } from './runtimeConfig';

async function getFirebaseIdToken(): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in before topping up credits.');
  return user.getIdToken();
}

async function callEdgeFunction<T>(path: string, body: unknown): Promise<T> {
  const token = await getFirebaseIdToken();
  const url = `${RUNTIME_CONFIG.supabase.url}/functions/v1/${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: RUNTIME_CONFIG.supabase.anonKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'Payment request failed.');
  return data as T;
}

export interface SafepayCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
}

export interface SafepayCheckoutResult {
  paymentId: string;
  invoice: string;
  checkoutUrl: string;
}

export interface SafepayStatusResult {
  invoice: string;
  status: 'processing' | 'completed' | 'failed' | 'manual_review';
  creditsApplied: boolean;
  balanceDelta: number;
  providerStatusId: number | null;
  providerStatusText: string;
}

export interface PendingCheckout {
  invoice: string;
  credits: number;
  eurAmount: number;
  gbpAmount: number;
}

const PENDING_KEY = 'luxuryui.pending-checkout';

export async function createSafepayPaymentSession(params: {
  credits: number;
  currency: 'EUR' | 'GBP';
  customer: SafepayCustomer;
}): Promise<SafepayCheckoutResult> {
  const quote = getCreditQuote(params.credits);
  const amount = params.currency === 'EUR'
    ? quote.eurTotal.toFixed(2)
    : quote.gbpTotal.toFixed(2);

  return callEdgeFunction<SafepayCheckoutResult>('create-payment-session', {
    amount,
    currency: params.currency,
    customer: params.customer,
  });
}

export async function refreshSafepayStatus(invoice: string): Promise<SafepayStatusResult> {
  return callEdgeFunction<SafepayStatusResult>('refresh-payment-status', { invoice });
}

export function storePendingCheckout(data: PendingCheckout): void {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
}

export function readPendingCheckout(): PendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  sessionStorage.removeItem(PENDING_KEY);
}
