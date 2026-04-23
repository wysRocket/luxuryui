import { httpsCallable } from 'firebase/functions';
import { getCreditQuote } from '../data/figmaKits';
import { getFirebaseFunctionsClient } from './firebaseClient';

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
  credits: number;
  eurAmount: number;
  gbpAmount: number;
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
  const amount =
    params.currency === 'EUR'
      ? quote.eurTotal.toFixed(2)
      : quote.gbpTotal.toFixed(2);

  const fn = httpsCallable<unknown, SafepayCheckoutResult>(
    getFirebaseFunctionsClient(),
    'createPaymentSession',
  );
  const result = await fn({ amount, currency: params.currency, customer: params.customer });
  return result.data;
}

export async function refreshSafepayStatus(invoice: string): Promise<SafepayStatusResult> {
  const fn = httpsCallable<unknown, SafepayStatusResult>(
    getFirebaseFunctionsClient(),
    'refreshPaymentStatus',
  );
  const result = await fn({ invoice });
  return result.data;
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
