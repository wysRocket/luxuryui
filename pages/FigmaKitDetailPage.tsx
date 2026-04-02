import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileStack, Layers3, Palette, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  formatCreditCost,
  formatCurrencyAmount,
  getCommercialReview,
  getCreditQuote,
  getFigmaKitBySlug,
  getFigmaKitSpec,
  getFigmaManifest,
  getFlowLabelForKit,
} from '../data/figmaKits';
import { useAppSession } from '../contexts/AppSessionContext';

const FigmaKitDetailPage: React.FC = () => {
  const { kitSlug } = useParams<{ kitSlug: string }>();
  const navigate = useNavigate();
  const { backendMode, isAuthenticated, wallet, hasUnlocked, purchaseKit, isBusy } = useAppSession();
  const [purchaseError, setPurchaseError] = useState('');

  const kit = useMemo(() => (kitSlug ? getFigmaKitBySlug(kitSlug) : undefined), [kitSlug]);
  const spec = useMemo(() => (kit ? getFigmaKitSpec(kit.id) : undefined), [kit]);
  const review = useMemo(() => (kit ? getCommercialReview(kit.id) : undefined), [kit]);
  const manifest = useMemo(() => (kit ? getFigmaManifest(kit.id) : undefined), [kit]);

  if (!kit) {
    return <Navigate to="/kits" replace />;
  }

  const flowLabel = getFlowLabelForKit(kit.primaryFlowId);
  const quote = getCreditQuote(kit.creditCost);
  const alreadyUnlocked = hasUnlocked(kit.id);
  const hasEnoughCredits = (wallet?.balance ?? 0) >= kit.creditCost;

  const handlePurchase = async () => {
    setPurchaseError('');

    try {
      await purchaseKit(kit);
      navigate(`/kits/${kit.slug}/delivery`);
    } catch (error) {
      setPurchaseError(error instanceof Error ? error.message : 'Could not unlock this kit.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto w-full">
      <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden mb-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_32%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-8 md:p-10">
            <div className="absolute inset-0 opacity-30">
              {kit.thumbnail && <img src={kit.thumbnail} alt="" aria-hidden="true" className="w-full h-full object-cover mix-blend-screen" />}
            </div>

            <div className="relative z-10">
              <Link
                to="/kits"
                className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={15} />
                All kits
              </Link>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
                  {flowLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                  <CheckCircle2 size={12} />
                  {review?.readyForSale ? 'Approved for credits' : 'Research only'}
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl md:text-5xl font-black tracking-tight text-white mb-4">{kit.title}</h1>
              <p className="max-w-2xl text-[15px] md:text-lg leading-relaxed text-white/75">
                A transformed Figma flow kit built from curated research, packaged with reusable screens, components, tokens, and delivery notes for teams who want to move faster than screenshot-copying.
              </p>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55 mb-2">Screens</p>
                  <p className="text-2xl font-black text-white">{kit.includedScreens}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55 mb-2">Components</p>
                  <p className="text-2xl font-black text-white">{kit.includedComponents.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55 mb-2">Tokens</p>
                  <p className="text-2xl font-black text-white">{kit.includedTokens.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55 mb-2">Credits</p>
                  <p className="text-2xl font-black text-white">{kit.creditCost}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-gray-800">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Unlock This Kit</p>
            <div className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-6 mb-6">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Credits-only purchase</p>
              <p className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">{formatCreditCost(kit.creditCost)}</p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                {formatCurrencyAmount('EUR', quote.eurTotal)} / {formatCurrencyAmount('GBP', quote.gbpTotal)} top-up value
              </p>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
                {backendMode === 'firebase'
                  ? 'Delivered as an editable Figma file with notes, tokens, and reusable sections for commercial product work. Your unlock state now persists to your Firebase-backed account.'
                  : 'Delivered as an editable Figma file with notes, tokens, and reusable sections for commercial product work.'}
              </p>
              {purchaseError && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                  {purchaseError}
                </div>
              )}
              {review?.readyForSale ? (
                <div className="flex flex-col gap-3">
                  {alreadyUnlocked ? (
                    <Link
                      to={`/kits/${kit.slug}/delivery`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Open delivery
                      <Download size={15} />
                    </Link>
                  ) : !isAuthenticated ? (
                    <Link
                      to={`/login?redirect=${encodeURIComponent(`/kits/${kit.slug}`)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Sign in to buy
                      <ArrowRight size={15} />
                    </Link>
                  ) : hasEnoughCredits ? (
                    <button
                      type="button"
                      onClick={handlePurchase}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-60"
                    >
                      {isBusy ? 'Unlocking kit...' : `Buy with ${kit.creditCost} credits`}
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <Link
                      to="/pricing"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Top up credits
                      <ArrowRight size={15} />
                    </Link>
                  )}

                  {!alreadyUnlocked && isAuthenticated && !hasEnoughCredits && (
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      You have {wallet?.balance ?? 0} credits. Add {Math.max(0, kit.creditCost - (wallet?.balance ?? 0))} more to unlock this kit.
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  This kit is still in research mode and cannot be bought with credits yet.
                </div>
              )}
            </div>

            <div className="space-y-3">
              {kit.delivery.includes.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 mb-10">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Preview Gallery</p>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Research-informed preview set</h2>
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Source app: {kit.sourceAppName}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kit.gallery.map((image, index) => (
              <div key={image} className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <img src={image} alt={`${kit.title} preview ${index + 1}`} className="w-full h-[320px] object-cover" />
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-black text-gray-900 dark:text-white">Preview {index + 1}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Research input used to guide the transformed kit</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-4">
              <FileStack size={14} />
              Included In The File
            </div>
            <div className="space-y-3">
              {spec?.includedFrames.map((frame) => (
                <div key={frame} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {frame}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-4">
              <Layers3 size={14} />
              Component Set
            </div>
            <div className="space-y-2">
              {kit.includedComponents.map((component) => (
                <div key={component} className="text-sm text-gray-700 dark:text-gray-300">• {component}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-4">
              <Palette size={14} />
              Tokens And Rules
            </div>
            <div className="space-y-2 mb-4">
              {kit.includedTokens.map((token) => (
                <div key={token} className="text-sm text-gray-700 dark:text-gray-300">• {token}</div>
              ))}
            </div>
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
              {spec?.gridConvention}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <article className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Transformation Notes</p>
          <div className="space-y-3">
            {kit.transformationNotes.map((note) => (
              <p key={note} className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">{note}</p>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">Commercial Readiness</p>
          <div className="space-y-3 mb-4">
            {review?.legalNotes.map((note) => (
              <p key={note} className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">{note}</p>
            ))}
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-4 mb-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-2">Review Status</div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
              <ShieldCheck size={15} className="text-emerald-500" />
              {review?.reviewStatus === 'approved' ? 'Approved for credits' : 'Blocked'}
            </div>
          </div>
          {manifest && (
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-2">Delivery Package</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">{manifest.exportPackage.fileName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{manifest.pageOrder.join(' • ')}</div>
            </div>
          )}
          <Link
            to={
              alreadyUnlocked
                ? `/kits/${kit.slug}/delivery`
                : review?.readyForSale
                  ? isAuthenticated
                    ? hasEnoughCredits
                      ? `/kits/${kit.slug}`
                      : '/pricing'
                    : `/login?redirect=${encodeURIComponent(`/kits/${kit.slug}`)}`
                  : '/kits'
            }
            className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400"
          >
            {alreadyUnlocked ? 'Open delivery' : review?.readyForSale ? (isAuthenticated && hasEnoughCredits ? 'Ready to unlock' : 'Top up credits') : 'Browse approved kits'}
            <Download size={15} />
          </Link>
        </article>
      </section>
    </div>
  );
};

export default FigmaKitDetailPage;
