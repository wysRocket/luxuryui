import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Coins,
  Euro,
  PackageCheck,
  PoundSterling,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  clampCredits,
  CREDIT_PACK_CONFIG,
  FIGMA_KIT_SUMMARY,
  formatCreditCost,
  formatCurrencyAmount,
  getCreditQuote,
  getPublishedFigmaKits,
} from "../data/figmaKits";
import { useAppSession } from "../contexts/AppSessionContext";
import { RUNTIME_CONFIG } from "../services/runtimeConfig";

const CreditsPage: React.FC = () => {
  const { isAuthenticated, topUpCredits, initiateCheckout, paymentMode, wallet, isBusy } = useAppSession();
  const [credits, setCredits] = useState(CREDIT_PACK_CONFIG.defaultCredits);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const quote = getCreditQuote(credits);
  const availableCredits = wallet?.balance ?? 0;
  const affordableKits = useMemo(
    () =>
      getPublishedFigmaKits()
        .filter((kit) => kit.creditCost <= availableCredits + quote.credits)
        .slice(0, 4),
    [availableCredits, quote.credits],
  );

  // SafePay billing form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("GB");
  const [city, setCity] = useState("");
  const [currency, setCurrency] = useState<"EUR" | "GBP">("GBP");

  const adjustCredits = (delta: number) => {
    setCredits((currentCredits) => clampCredits(currentCredits + delta));
  };

  const handleTopUp = async () => {
    setStatusMessage("");
    setErrorMessage("");

    try {
      const topUp = await topUpCredits(credits);
      setStatusMessage(
        `Added ${topUp.creditsPurchased} credits to your wallet.`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not complete the credit top-up.",
      );
    }
  };

  const handleSafepayCheckout = async () => {
    setStatusMessage("");
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !city.trim()) {
      setErrorMessage("Please fill in all billing fields.");
      return;
    }

    try {
      await initiateCheckout({
        credits,
        currency,
        customer: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: "",
          phone: phone.trim(),
          countryCode: countryCode.trim().toUpperCase().slice(0, 2),
          city: city.trim(),
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not initiate checkout. Please try again.",
      );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(2,6,23,1)_100%)] p-8 md:p-12 mb-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">
            Credits
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            Top Up Credits For Editable Figma Kits
          </h1>
          <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Browse the research library for free, top up credits when you are
            ready, and spend those credits on transformed Figma kits with
            screens, components, tokens, and delivery notes. Signed-in buyers
            should treat this page as a pricing explainer and use their account
            hub for repeat top-ups.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-black text-white dark:text-black">
            <PackageCheck size={15} />
            {FIGMA_KIT_SUMMARY.publishedProducts} kits available for credits
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Coins size={15} />
            Credits-only checkout
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Wallet size={15} />
            One top-up flow for every kit
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-8 mb-10">
        <article className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">
                Credit Top-Up
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                Choose your credits
              </h2>
            </div>
            <div className="rounded-[24px] bg-gray-50 dark:bg-gray-950/50 px-5 py-4 border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-2">
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

          <div className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5 md:p-6 mb-8">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustCredits(-10)}
                  className="rounded-full border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-black text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => adjustCredits(-1)}
                  className="rounded-full border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-black text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-colors"
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
                  className="rounded-full border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-black text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => adjustCredits(10)}
                  className="rounded-full border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-black text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">
                <Euro size={14} />
                EUR Total
              </div>
              <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                {formatCurrencyAmount("EUR", quote.eurTotal)}
              </p>
            </div>
            <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">
                <PoundSterling size={14} />
                GBP Total
              </div>
              <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                {formatCurrencyAmount("GBP", quote.gbpTotal)}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-5 py-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-2">
              Current wallet
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {availableCredits} credits
            </p>
          </div>

          {/* SafePay billing form */}
          {paymentMode === "safepay" && isAuthenticated && (
            <div className="mb-6 rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5 space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                Billing Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900000"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Country (ISO code)</label>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="GB"
                    maxLength={2}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as "EUR" | "GBP")}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {isAuthenticated ? (
              paymentMode === "safepay" ? (
                <>
                  <button
                    type="button"
                    onClick={handleSafepayCheckout}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black disabled:opacity-60"
                  >
                    {isBusy ? "Redirecting to SafePay..." : "Proceed to SafePay"}
                  </button>
                  <Link
                    to="/account"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
                  >
                    Open buyer portal
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/account"
                    className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black"
                  >
                    Open buyer portal
                  </Link>
                  {RUNTIME_CONFIG.backendMode === "local" && (
                    <button
                      type="button"
                      onClick={handleTopUp}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 disabled:opacity-60"
                    >
                      {isBusy ? "Processing top-up..." : "Top up here instead"}
                    </button>
                  )}
                </>
              )
            ) : (
              <>
                <Link
                  to={`/login?redirect=${encodeURIComponent("/pricing")}`}
                  className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black"
                >
                  Sign in to top up
                </Link>
                <Link
                  to={`/signup?redirect=${encodeURIComponent("/pricing")}`}
                  className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Currency display is informational. Signed-in buyers should manage
            repeat top-ups from account, then spend credits on approved Figma
            kits in the storefront.
          </p>
        </article>

        <aside className="space-y-6">
          <article className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">
              How It Works
            </p>
            <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              <p>1. Browse reference apps, screens, and flows for free.</p>
              <p>2. Top up credits once you find a transformed kit you want.</p>
              <p>
                3. Spend credits on approved Figma kits with editable files and
                commercial packaging.
              </p>
            </div>
          </article>

          <article className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
                  Unlockable Now
                </p>
                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  Kits within this top-up
                </h3>
              </div>
              <Link
                to="/kits"
                className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400"
              >
                Browse kits
                <ArrowRight size={14} />
              </Link>
            </div>

            {affordableKits.length > 0 ? (
              <div className="space-y-3">
                {affordableKits.map((kit) => (
                  <Link
                    key={kit.id}
                    to={kit.previewPath}
                    className="block rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                  >
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-1">
                      {kit.title}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                      {formatCreditCost(kit.creditCost)}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {availableCredits + quote.credits >= kit.creditCost
                        ? "Within your current balance + selected top-up"
                        : "Requires a larger top-up"}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                Increase the top-up to unlock one of the published kits.
              </div>
            )}
          </article>
        </aside>
      </section>
    </div>
  );
};

export default CreditsPage;
