import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LayoutGrid, PackageCheck } from 'lucide-react';
import { MOCK_APPS } from '../constants';
import { buildGeneratedScreens } from '../services/assetFactory';
import { REAL_APP_ASSETS } from '../data/realAppAssets';
import { formatCreditCost, getPublishedKitForAppSlug } from '../data/figmaKits';
import { useAppSession } from '../contexts/AppSessionContext';
import { getAppPresentationState } from '../services/presentationState';

const AppScreensPage: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const { isAuthenticated, wallet, hasUnlocked } = useAppSession();

  const app = useMemo(() => MOCK_APPS.find((item) => item.id === appId), [appId]);
  const relatedKit = useMemo(() => (app ? getPublishedKitForAppSlug(app.slug) : undefined), [app]);
  const kitUnlocked = relatedKit ? hasUnlocked(relatedKit.id) : false;
  const presentation = useMemo(
    () =>
      app
        ? getAppPresentationState({
            app,
            relatedKit,
            isAuthenticated,
            walletBalance: wallet?.balance ?? 0,
            isOwned: kitUnlocked,
          })
        : undefined,
    [app, relatedKit, isAuthenticated, wallet?.balance, kitUnlocked]
  );

  const screens = useMemo(() => {
    if (!app) return [];

    const realScreens = REAL_APP_ASSETS[app.name]?.screenshots ?? [];
    if (realScreens.length > 0) {
      return realScreens;
    }

    const fallbackCount = Math.min(Math.max(app.screenCount, 12), 72);
    return buildGeneratedScreens(app, fallbackCount);
  }, [app]);

  if (!app) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Missing app</p>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-3">App not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">This app no longer exists in the current library.</p>
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-black"
          >
            <ArrowLeft size={16} />
            Back to apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/70 dark:to-gray-950 p-8 md:p-12 mb-10">
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          All apps
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-3">Screen gallery</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-3">{app.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-[15px] md:text-base">
              {app.category} for {app.platform} • {REAL_APP_ASSETS[app.name] ? 'Live app-store screenshots' : 'Generated fallback previews'}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-black">
              <LayoutGrid size={15} />
              {screens.length} screens
            </span>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
              presentation?.researchTier === 'verified'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-200'
                : presentation?.researchTier === 'research'
                  ? 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-200'
                  : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200'
            }`}>
              {presentation?.researchTier === 'verified'
                ? 'Verified research'
                : presentation?.researchTier === 'research'
                  ? 'Research preview'
                  : 'Generated reference'}
            </span>
            {relatedKit ? (
              <>
                <Link
                  to={relatedKit.previewPath}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Preview kit
                </Link>
                <Link
                  to={
                    kitUnlocked
                      ? `/kits/${relatedKit.slug}/delivery`
                      : !isAuthenticated
                        ? `/login?redirect=${encodeURIComponent(relatedKit.previewPath)}`
                        : presentation?.creditState === 'ready'
                          ? relatedKit.previewPath
                          : '/account'
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  {kitUnlocked ? 'Open delivery' : !isAuthenticated ? 'Sign in to unlock' : presentation?.creditState === 'ready' ? 'View editable kit' : 'Top up in account'}
                </Link>
              </>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 text-sm font-bold">
                Research only
              </span>
            )}
          </div>
        </div>
      </section>

      {presentation?.researchTier !== 'verified' && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 px-6 py-5 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300 mb-2">Quality note</p>
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
            {presentation?.researchTier === 'generated'
              ? 'These screens remain available for directional research, but generated imagery is intentionally kept out of the premium presentation tier.'
              : 'These screens are still useful for reference work, but the source set is not visually consistent enough to present as a premium asset preview.'}
          </p>
        </section>
      )}

      <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-7 mb-10">
        {relatedKit ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Commercial Layer</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
                This app has a transformed Figma kit ready for credits
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl">
                Browse the source research here, then jump into the original editable kit to see what is included, how it was transformed, and how it is packaged for commercial use. This kit currently unlocks for {formatCreditCost(relatedKit.creditCost)}.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={relatedKit.previewPath}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                View what’s included
              </Link>
              <Link
                to={
                  kitUnlocked
                    ? `/kits/${relatedKit.slug}/delivery`
                    : !isAuthenticated
                      ? `/login?redirect=${encodeURIComponent(relatedKit.previewPath)}`
                      : presentation?.creditState === 'ready'
                        ? relatedKit.previewPath
                        : '/account'
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-5 py-3 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <PackageCheck size={16} />
                {kitUnlocked ? 'Open delivery' : !isAuthenticated ? 'Sign in to unlock' : presentation?.creditState === 'ready' ? 'View editable kit' : 'Top up in account'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Commercial Layer</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-3">This app is currently reference-only</h2>
              <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl">
                The screenshots are still useful for research, but this source set has not passed the commercial quality gate required for a sellable Figma kit yet.
              </p>
            </div>
            <Link
              to="/kits"
              className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400"
            >
              Browse approved kits
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      <section className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {screens.map((screen, index) => (
          <article
            key={`${app.id}-screen-${index}`}
            className="break-inside-avoid mb-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 overflow-hidden"
          >
            <img
              src={screen}
              alt={`${app.name} screen ${index + 1}`}
              className="w-full h-auto block"
              loading={index < 8 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index < 4 ? 'high' : 'low'}
            />
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Screen {index + 1}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{app.category} pattern reference</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AppScreensPage;
