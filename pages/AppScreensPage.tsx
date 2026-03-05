import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, LayoutGrid } from 'lucide-react';
import { MOCK_APPS } from '../constants';
import { buildGeneratedScreens } from '../services/assetFactory';
import { REAL_APP_ASSETS } from '../data/realAppAssets';

const AppScreensPage: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();

  const app = useMemo(() => MOCK_APPS.find((item) => item.id === appId), [appId]);

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
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-black">
              <LayoutGrid size={15} />
              {screens.length} screens
            </span>
            <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={15} />
              Export
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {screens.map((screen, index) => (
          <article
            key={`${app.id}-screen-${index}`}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <img
              src={screen}
              alt={`${app.name} screen ${index + 1}`}
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
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
