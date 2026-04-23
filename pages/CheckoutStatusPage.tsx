import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Wallet, ArrowRight } from 'lucide-react';
import { useAppSession } from '../contexts/AppSessionContext';
import {
  clearPendingCheckout,
  readPendingCheckout,
  refreshSafepayStatus,
  type PendingCheckout,
  type SafepayStatusResult,
} from '../services/safepayService';

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 60; // ~4 minutes

type PageState = 'loading' | 'polling' | 'success' | 'failed' | 'no-invoice';

const CheckoutStatusPage: React.FC = () => {
  const { user } = useAppSession();
  const [searchParams] = useSearchParams();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [creditsAdded, setCreditsAdded] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const pollAttempts = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasApplied = useRef(false);

  const applyCredits = useCallback(
    async (result: SafepayStatusResult, checkout: PendingCheckout) => {
      if (hasApplied.current || !user) return;
      hasApplied.current = true;

      // Credits are applied server-side by the Cloud Function when payment completes.
      const credits = result.credits > 0 ? result.credits : checkout.credits;
      setCreditsAdded(credits);
      clearPendingCheckout();
      setPageState('success');
    },
    [user],
  );

  const pollStatus = useCallback(
    async (invoice: string, checkout: PendingCheckout) => {
      if (pollAttempts.current >= MAX_POLL_ATTEMPTS) {
        setPageState('polling');
        setErrorMessage(
          'Payment is taking longer than expected. Come back to this page to check status.',
        );
        return;
      }

      pollAttempts.current += 1;

      try {
        const result = await refreshSafepayStatus(invoice);

        if (result.status === 'completed') {
          await applyCredits(result, checkout);
          return;
        }

        if (result.status === 'failed' || result.status === 'manual_review') {
          setPageState('failed');
          setErrorMessage(
            result.status === 'failed'
              ? 'Payment was declined or cancelled. No credits were added.'
              : 'Payment requires manual review. Contact support with your invoice ID.',
          );
          return;
        }

        // Still processing — schedule next poll
        pollTimer.current = setTimeout(
          () => void pollStatus(invoice, checkout),
          POLL_INTERVAL_MS,
        );
      } catch (error) {
        // Network error — retry
        pollTimer.current = setTimeout(
          () => void pollStatus(invoice, checkout),
          POLL_INTERVAL_MS * 2,
        );
        console.warn('Poll error, retrying:', error);
      }
    },
    [applyCredits],
  );

  useEffect(() => {
    const invoiceFromUrl = searchParams.get('invoice');
    const checkoutData = readPendingCheckout();
    const invoice = invoiceFromUrl || checkoutData?.invoice;

    if (!invoice) {
      setPageState('no-invoice');
      return;
    }

    const resolvedCheckout: PendingCheckout = checkoutData ?? {
      invoice,
      credits: 0,
      eurAmount: 0,
      gbpAmount: 0,
    };

    setPending(resolvedCheckout);
    setPageState('polling');
    void pollStatus(invoice, resolvedCheckout);

    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [searchParams, pollStatus]);

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white" />
      </div>
    );
  }

  if (pageState === 'no-invoice') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto w-full">
        <div className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={40} />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            No Payment Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn&apos;t find a pending payment to check. Start a new top-up from the pricing page.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black"
          >
            Go to Pricing
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  if (pageState === 'success') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto w-full">
        <div className="rounded-[32px] border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center">
          <CheckCircle className="mx-auto mb-4 text-emerald-600 dark:text-emerald-400" size={48} />
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
            Payment Successful
          </h1>
          {creditsAdded > 0 && (
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
              +{creditsAdded} credits added to your wallet
            </p>
          )}
          {pending?.invoice && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-mono">
              Invoice: {pending.invoice}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/account"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black"
            >
              <Wallet size={14} />
              View Wallet
            </Link>
            <Link
              to="/kits"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
            >
              Browse Kits
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === 'failed') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto w-full">
        <div className="rounded-[32px] border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            Payment Not Completed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{errorMessage}</p>
          {pending?.invoice && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-mono">
              Invoice: {pending.invoice}
            </p>
          )}
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  // Polling state
  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto w-full">
      <div className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
        <Clock className="mx-auto mb-4 text-blue-500 animate-pulse" size={48} />
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          Confirming Payment
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Waiting for SafePay to confirm your payment. This usually takes a few seconds.
        </p>
        {pending?.invoice && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-mono">
            Invoice: {pending.invoice}
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">{errorMessage}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Go to Account
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStatusPage;
