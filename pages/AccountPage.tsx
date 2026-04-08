import { type FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useAppSession } from "../contexts/AppSessionContext";
import {
  clampCredits,
  CREDIT_PACK_CONFIG,
  formatCreditCost,
  formatCurrencyAmount,
  FIGMA_KIT_PRODUCTS,
  getCreditQuote,
  getPublishedFigmaKits,
} from "../data/figmaKits";
import { getAvailableToUnlockKits, getCreditState } from "../services/presentationState";

const AccountPage: FC = () => {
  const {
    backendMode,
    user,
    wallet,
    transactions,
    unlocks,
    orders,
    topUps,
    warnings,
    topUpCredits,
    isBusy,
  } = useAppSession();
  const [credits, setCredits] = useState(CREDIT_PACK_CONFIG.defaultCredits);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const providerLabel =
    user?.provider === "firebase-google"
      ? "Signed in with Google"
      : user?.provider === "firebase-password"
        ? "Signed in with email and password"
        : "Private workspace account";

  const quote = getCreditQuote(credits);
  const availableCredits = wallet?.balance ?? 0;

  const ownedKits = useMemo(
    () =>
      [...unlocks]
        .sort(
          (left, right) =>
            new Date(right.unlockedAt).getTime() - new Date(left.unlockedAt).getTime(),
        )
        .map((unlock) => ({
          unlock,
          kit: FIGMA_KIT_PRODUCTS.find((product) => product.id === unlock.productId),
        }))
        .filter(
          (
            entry,
          ): entry is { unlock: (typeof unlocks)[number]; kit: (typeof FIGMA_KIT_PRODUCTS)[number] } =>
            Boolean(entry.kit),
        ),
    [unlocks],
  );

  const availableToUnlock = useMemo(
    () =>
      getAvailableToUnlockKits({
        publishedKits: getPublishedFigmaKits(),
        ownedProductIds: unlocks.map((unlock) => unlock.productId),
        walletBalance: availableCredits,
      }).slice(0, 6),
    [unlocks, availableCredits],
  );

  const handleTopUp = async () => {
    setStatusMessage("");
    setErrorMessage("");

    try {
      const topUp = await topUpCredits(credits);
      setStatusMessage(`Added ${topUp.creditsPurchased} credits to your wallet.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not complete the credit top-up.",
      );
    }
  };

  const adjustCredits = (delta: number) => {
    setCredits((currentCredits) => clampCredits(currentCredits + delta));
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 md:p-8">
      <section className="mb-8 overflow-hidden rounded-[32px] border border-gray-100 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-8 dark:border-gray-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(2,6,23,1)_100%)] md:p-10">
        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">
              Your Account
            </p>
            <h1 className="mb-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
              {user?.displayName ?? "Private Buyer Portal"}
            </h1>
            <p className="mb-5 text-[15px] text-gray-600 dark:text-gray-400">
              {user?.email}
            </p>
            <p className="max-w-2xl text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              Manage your wallet, add credits, and access the editable kits you already own.
              Research lives in the library, commercial inventory lives in the catalog, and
              everything you have purchased lives here.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {backendMode === "firebase" && (
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                Firebase wallet sync
              </div>
            )}
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-gray-700 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200">
              {providerLabel}
            </div>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            {warnings.join(" ")}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-gray-100 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                  <Wallet size={14} />
                  Balance
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {availableCredits} credits
                </p>
              </div>
              <div className="rounded-[24px] border border-gray-100 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                  <CreditCard size={14} />
                  Purchased
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {wallet?.lifetimePurchased ?? 0} credits
                </p>
              </div>
              <div className="rounded-[24px] border border-gray-100 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                  <PackageCheck size={14} />
                  Owned
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {ownedKits.length} kits
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-gray-100 bg-white/80 p-6 dark:border-gray-800 dark:bg-gray-950/40">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                Client Library
              </p>
              <h2 className="mb-3 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Owned Kits
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Purchased kits stay grouped here so you can reopen delivery without scanning the storefront again.
              </p>
            </div>
          </div>

          <article className="rounded-[28px] border border-gray-100 bg-white/90 p-6 dark:border-gray-800 dark:bg-gray-950/60 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  Top Up Credits
                </p>
                <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                  Refill from your account
                </h2>
              </div>
              <div className="rounded-[24px] border border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/50">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                  Selected
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                    {quote.credits}
                  </span>
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    credits
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-[24px] border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950/50">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustCredits(-10)}
                    className="rounded-full border border-gray-200 px-4 py-3 text-sm font-black text-gray-800 transition-colors hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustCredits(-1)}
                    className="rounded-full border border-gray-200 px-4 py-3 text-sm font-black text-gray-800 transition-colors hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900"
                  >
                    -1
                  </button>
                </div>

                <div className="flex-1 px-1">
                  <input
                    type="range"
                    min={CREDIT_PACK_CONFIG.minCredits}
                    max={CREDIT_PACK_CONFIG.maxCredits}
                    step={CREDIT_PACK_CONFIG.sliderStep}
                    value={quote.credits}
                    onChange={(event) =>
                      setCredits(clampCredits(Number(event.target.value)))
                    }
                    className="w-full accent-black dark:accent-white"
                    aria-label="Select credits"
                  />
                  <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                    <span>{CREDIT_PACK_CONFIG.minCredits} credits</span>
                    <span>{CREDIT_PACK_CONFIG.maxCredits} credits</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustCredits(1)}
                    className="rounded-full border border-gray-200 px-4 py-3 text-sm font-black text-gray-800 transition-colors hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustCredits(10)}
                    className="rounded-full border border-gray-200 px-4 py-3 text-sm font-black text-gray-800 transition-colors hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-900"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                  EUR Total
                </p>
                <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                  {formatCurrencyAmount("EUR", quote.eurTotal)}
                </p>
              </div>
              <div className="rounded-[24px] border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                  GBP Total
                </p>
                <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                  {formatCurrencyAmount("GBP", quote.gbpTotal)}
                </p>
              </div>
            </div>

            {statusMessage && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
                {statusMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleTopUp}
                disabled={isBusy}
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white disabled:opacity-60 dark:bg-white dark:text-black"
              >
                {isBusy
                  ? "Processing top-up..."
                  : `Complete top-up for ${formatCreditCost(quote.credits)}`}
              </button>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200"
              >
                Open pricing explainer
              </Link>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {backendMode === "firebase"
                ? "Your wallet and unlock history persist through Firebase Auth + Firestore. Top-ups here remain instant mock payments until Stripe checkout is connected."
                : "Use the account hub for repeat top-ups, then spend credits from the commercial catalog when you are ready to unlock a kit."}
            </p>
          </article>
        </div>
      </section>

      <section className="mb-8 rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Owned Kits
            </p>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Your delivery library
            </h2>
          </div>
          <Link to="/kits" className="text-sm font-black text-blue-600 dark:text-blue-400">
            Browse catalog
          </Link>
        </div>

        {ownedKits.length > 0 ? (
          <div className="space-y-3">
            {ownedKits.map(({ unlock, kit }) => (
              <Link
                key={unlock.id}
                to={`/kits/${kit.slug}/delivery`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 transition-colors hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-700"
              >
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    {kit.title}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Unlocked {new Date(unlock.unlockedAt).toLocaleDateString()} •{" "}
                    {formatCreditCost(unlock.creditsSpent)}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400">
                  Open delivery <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No owned kits yet. Add credits above, then unlock your first editable kit from the catalog.
          </div>
        )}
      </section>

      <section className="mb-8 rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Available To Unlock
            </p>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Catalog picks for your current wallet
            </h2>
          </div>
          <Link to="/kits" className="text-sm font-black text-blue-600 dark:text-blue-400">
            See full catalog
          </Link>
        </div>

        {availableToUnlock.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {availableToUnlock.map((kit) => {
              const creditState = getCreditState(true, availableCredits, kit.creditCost);

              return (
                <Link
                  key={kit.id}
                  to={kit.previewPath}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-colors hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-700"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-gray-700 dark:border-gray-700 dark:text-gray-200">
                      <ShieldCheck size={12} />
                      Commercial catalog
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                        creditState === "ready"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200"
                      }`}
                    >
                      <Sparkles size={12} />
                      {creditState === "ready" ? "Unlock-ready" : "Needs top-up"}
                    </div>
                  </div>
                  <p className="mb-1 text-lg font-black text-gray-900 dark:text-white">
                    {kit.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCreditCost(kit.creditCost)} • {kit.includedScreens} screens •{" "}
                    {kit.includedTokens.length} token groups
                  </p>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {creditState === "ready"
                      ? "Your current balance is enough to move into the editable kit preview now."
                      : `Add ${Math.max(0, kit.creditCost - availableCredits)} more credits to unlock this kit.`}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            You already own every published kit or the commercial catalog is temporarily unavailable.
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            Recent Credit Activity
          </p>
          <h2 className="mb-5 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Wallet history
          </h2>

          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 8).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <div>
                    <p className="text-sm font-black capitalize text-gray-900 dark:text-white">
                      {transaction.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-black ${
                      transaction.creditsDelta >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {transaction.creditsDelta >= 0 ? "+" : ""}
                    {transaction.creditsDelta} credits
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No wallet activity yet.
            </div>
          )}
        </article>

        <div className="space-y-8">
          <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Recent Top-Ups
            </p>
            <h2 className="mb-5 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Credit purchases
            </h2>

            {topUps.length > 0 ? (
              <div className="space-y-3">
                {topUps.slice(0, 6).map((topUp) => (
                  <div
                    key={topUp.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-950/40"
                  >
                    <p className="text-sm font-black text-gray-900 dark:text-white">
                      {topUp.creditsPurchased} credits
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrencyAmount("EUR", topUp.eurAmount)} /{" "}
                      {formatCurrencyAmount("GBP", topUp.gbpAmount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No credit purchases yet.
              </div>
            )}
          </article>

          <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Recent Orders
            </p>
            <h2 className="mb-5 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Unlock history
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-950/40"
                  >
                    <p className="text-sm font-black text-gray-900 dark:text-white">
                      {FIGMA_KIT_PRODUCTS.find((product) => product.id === order.productId)
                        ?.title ?? order.productId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCreditCost(order.creditCost)} • {order.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No unlocked kit orders yet.
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
