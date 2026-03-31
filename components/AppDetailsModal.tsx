import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, LayoutGrid, Share2, Bookmark, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCreditCost, getPublishedKitForAppSlug } from '../data/figmaKits';
import { REAL_APP_ASSETS } from '../data/realAppAssets';
import { AppItem } from '../types';
import { useAppSession } from '../contexts/AppSessionContext';

interface AppDetailsModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ app, isOpen, onClose }) => {
  const [showPlatformTooltip, setShowPlatformTooltip] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, wallet, hasUnlocked } = useAppSession();
  const realScreenshots = app ? REAL_APP_ASSETS[app.name]?.screenshots : undefined;
  const screenshots = useMemo(() => {
    if (!app) {
      return [];
    }

    const baseScreenshots = realScreenshots?.length ? realScreenshots : [app.image];
    const orderedScreenshots = [app.image, ...baseScreenshots].filter(Boolean);

    return Array.from(new Set(orderedScreenshots));
  }, [app, realScreenshots]);
  const relatedKit = app ? getPublishedKitForAppSlug(app.slug) : undefined;
  const kitUnlocked = relatedKit ? hasUnlocked(relatedKit.id) : false;
  const hasEnoughCredits = relatedKit ? (wallet?.balance ?? 0) >= relatedKit.creditCost : false;
  const sourceQuality = app.sourceQuality ?? 'unknown';
  const qualityMessage =
    sourceQuality === 'pass'
      ? 'This source set meets the current premium preview bar.'
      : sourceQuality === 'warn'
        ? 'This source set is useful for research, but some screenshots are mixed-resolution.'
        : app.assetOrigin === 'generated'
          ? 'This app currently uses generated preview imagery instead of a fully verified source set.'
          : 'This source set is still in preview mode.';

  useEffect(() => {
    if (!app) {
      setActiveScreenshot('');
      return;
    }

    setActiveScreenshot(app.image);
  }, [app]);

  if (!app) return null;

  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case 'iOS':
        return "Native Apple iOS interface patterns and components.";
      case 'Android':
        return "Material Design patterns and Android system behaviors.";
      case 'Web':
        return "Responsive web layouts and browser-based interactions.";
      default:
        return "Optimized for digital interaction.";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div
            layoutId={`app-card-container-${app.id}`}
            className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors duration-300 relative z-10"
          >
            {/* Image Section */}
            <motion.div 
              className="w-full md:w-3/5 h-[420px] md:h-auto relative overflow-hidden bg-[#0b0b0f]"
            >
              <div className="absolute inset-0">
                <img
                  src={activeScreenshot}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover scale-110 opacity-35 blur-3xl"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(12,12,14,0.3),rgba(12,12,14,0.92))]" />
              </div>

              <div className="relative z-10 flex h-full flex-col p-5 md:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                    <span>Curated Preview</span>
                    <span className="h-1 w-1 rounded-full bg-white/50" />
                    <span>{screenshots.length} shots</span>
                  </div>
                  
                  {/* Close Button Mobile */}
                  <button 
                    onClick={onClose}
                    className="md:hidden p-2 bg-white/12 backdrop-blur-md rounded-full text-white hover:bg-white/25 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-1 items-center justify-center py-6 md:py-10">
                  <div className="w-full max-w-[260px] md:max-w-[360px]">
                    <div className="rounded-[2rem] border border-white/10 bg-black/55 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                      <div className="mb-3 flex justify-center">
                        <div className="h-1.5 w-20 rounded-full bg-white/18" />
                      </div>
                      <div className="overflow-hidden rounded-[1.55rem] bg-black ring-1 ring-white/8">
                        <motion.img
                          key={activeScreenshot}
                          initial={{ opacity: 0.7, scale: 0.985 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          src={activeScreenshot}
                          alt={`${app.name} screenshot preview`}
                          className="aspect-[9/19.5] w-full bg-black object-contain"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {screenshots.length > 1 && (
                  <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                    {screenshots.slice(0, 8).map((screenshot, index) => {
                      const isActive = screenshot === activeScreenshot;

                      return (
                        <button
                          key={screenshot}
                          type="button"
                          onClick={() => setActiveScreenshot(screenshot)}
                          className={`group relative shrink-0 overflow-hidden rounded-[1.15rem] border transition-all ${
                            isActive
                              ? 'border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                          aria-label={`Show screenshot ${index + 1}`}
                        >
                          <img
                            src={screenshot}
                            alt={`${app.name} screenshot ${index + 1}`}
                            className={`h-24 w-[4.4rem] bg-black object-cover transition-transform duration-300 ${
                              isActive ? 'scale-[1.03]' : 'group-hover:scale-[1.03]'
                            }`}
                            draggable={false}
                          />
                          <div className={`absolute inset-0 ring-1 ring-inset transition-colors ${
                            isActive ? 'ring-white/35' : 'ring-white/0 group-hover:ring-white/20'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              
            </motion.div>

            {/* Details Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full md:w-2/5 p-6 md:p-10 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.img 
                    layoutId={`app-logo-${app.id}`}
                    src={app.logo} 
                    alt={app.name} 
                    className="w-16 h-16 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm object-cover" 
                  />
                  <div>
                    <motion.h2 
                        layoutId={`app-name-${app.id}`}
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                        {app.name}
                    </motion.h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{app.category}</p>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 dark:text-gray-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="relative flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPlatformTooltip(!showPlatformTooltip)}
                    className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 cursor-help transition-colors"
                  >
                    {app.platform === 'iOS' || app.platform === 'Android' ? <Smartphone size={20} /> : <Monitor size={20} />}
                  </motion.button>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      Platform
                      <Info size={8} />
                    </p>
                    <p className="text-sm font-semibold dark:text-gray-200">{app.platform}</p>
                  </div>

                  <AnimatePresence>
                    {showPlatformTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 10, x: -10 }}
                        className="absolute bottom-full left-0 mb-2 w-48 bg-gray-900 dark:bg-white text-white dark:text-black p-3 rounded-xl shadow-xl text-xs z-50 pointer-events-none"
                      >
                        <div className="font-bold mb-1">{app.platform}</div>
                        {getPlatformInfo(app.platform)}
                        <div className="absolute top-full left-4 -mt-1 border-8 border-transparent border-t-gray-900 dark:border-t-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <LayoutGrid size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Preview Set</p>
                    <p className="text-sm font-semibold dark:text-gray-200">{screenshots.length} curated shots</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">About this app</h4>
                <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
                  Explore the user journey and design patterns of {app.name}. This preview focuses on curated reference screens that help you study navigation, visual tone, and core product flows without stretching low-resolution assets beyond their comfort zone.
                </p>
              </div>

              <div className={`mb-8 rounded-2xl border px-5 py-4 ${
                sourceQuality === 'pass'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-100'
                  : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-100'
              }`}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-2">
                  {sourceQuality === 'pass' ? 'Verified preview quality' : 'Reference quality note'}
                </p>
                <p className="text-sm leading-relaxed">{qualityMessage}</p>
              </div>

              <div className="mb-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-2">Commercial Status</p>
                {relatedKit ? (
                  <>
                    <h4 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-2">Editable Figma kit available</h4>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-4">
                      This app has an approved transformed flow kit in the commercial catalog. Use the screenshots for research, then jump to the editable file package when you need production-ready assets. Current unlock cost: {formatCreditCost(relatedKit.creditCost)}.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={relatedKit.previewPath}
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        View what’s included
                      </Link>
                      <Link
                        to={
                          kitUnlocked
                            ? `/kits/${relatedKit.slug}/delivery`
                            : !isAuthenticated
                              ? `/login?redirect=${encodeURIComponent(relatedKit.previewPath)}`
                              : hasEnoughCredits
                                ? relatedKit.previewPath
                                : relatedKit.purchasePath
                        }
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                      >
                        {kitUnlocked ? 'Open delivery' : !isAuthenticated ? 'Sign in to buy' : hasEnoughCredits ? 'Use credits' : 'Top up credits'}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-2">Research-only reference</h4>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      This source set is still useful for inspiration, but it has not passed the commercial gate required for a sellable Figma kit yet.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/apps/${app.id}/screens`);
                  }}
                  className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  View all screens
                </button>
                <button className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Bookmark size={20} />
                </button>
                <button className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppDetailsModal;
