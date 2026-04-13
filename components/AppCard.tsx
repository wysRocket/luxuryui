import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { AppItem } from '../types';
import { Smartphone, Monitor, Maximize2, Bookmark, AlertTriangle, BadgeCheck, Sparkles } from 'lucide-react';
import { getPublishedKitForAppSlug } from '../data/figmaKits';

interface AppCardProps {
  app: AppItem | null;
  onClick: (app: AppItem) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sourceQuality = app?.sourceQuality ?? 'unknown';
  const assetOrigin = app?.assetOrigin ?? 'generated';
  const isVerified = sourceQuality === 'pass' && assetOrigin === 'real';
  const isWarn = sourceQuality === 'warn';
  const qualityLabel = isVerified
    ? 'Verified set'
    : isWarn
      ? 'Mixed quality'
      : assetOrigin === 'generated'
        ? 'Generated preview'
        : 'Preview set';
  const qualityIcon = isVerified ? BadgeCheck : isWarn ? AlertTriangle : Sparkles;
  const QualityIcon = qualityIcon;
  
  // 1. Interactive 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  // 2. Scroll-Based Parallax Logic
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const yRange = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imageY = useSpring(yRange, { stiffness: 100, damping: 30 });

  const hasKit = Boolean(app && getPublishedKitForAppSlug(app.slug));

  if (!app) {
    return null;
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col gap-4 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(app)}
      style={{ perspective: "1500px" }}
    >
      <motion.div 
        className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm z-0"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ 
          y: -10,
          scale: 1.02,
          boxShadow: "0 45px 90px -15px rgba(0, 0, 0, 0.35)" 
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          mass: 0.8 
        }}
      >
        {/* Subtle Glint */}
        <motion.div 
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
        >
            <div className={`absolute inset-[-100%] rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out ${
              isVerified ? 'bg-gradient-to-tr from-transparent via-white/10 to-transparent' : 'bg-gradient-to-tr from-transparent via-white/5 to-transparent'
            }`} />
        </motion.div>

        {/* NEW: Quick Save Bookmark Button */}
        <motion.button
          className="absolute top-5 left-5 z-40 p-2.5 rounded-xl bg-black/20 backdrop-blur-md text-white border border-white/10 group/bookmark"
          style={{ transform: "translateZ(50px)" }}
          whileHover={{ scale: 1.15, backgroundColor: "rgba(0,0,0,0.6)" }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); }}
        >
          <Bookmark size={18} className="transition-all duration-300 group-hover/bookmark:fill-white" />
        </motion.button>

        {/* Parallax Image Layer */}
        <motion.div 
          className={`absolute pointer-events-none ${isVerified ? 'inset-[-15%] w-[130%] h-[130%]' : 'inset-0 w-full h-full p-5'}`}
          style={{ 
            y: imageY, 
            translateZ: "30px",
          }}
        >
            {isVerified ? (
              <motion.img
                src={app.image}
                alt={`${app.name} preview`}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.95)" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(3,7,18,0.98))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                <div className="mb-3 absolute top-8 left-1/2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/12" />
                <motion.img
                  src={app.image}
                  alt={`${app.name} preview`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="h-full w-full rounded-[1.5rem] bg-black object-contain"
                  style={{ filter: 'brightness(0.98)' }}
                />
              </div>
            )}
        </motion.div>

        {!isVerified && (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.36))] z-10 pointer-events-none" />
        )}

        {/* Hover Controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center z-30" style={{ transform: "translateZ(60px)" }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-8 group-hover:translate-y-0"
            >
                <Maximize2 size={24} className="text-gray-900 dark:text-white" />
            </motion.div>
        </div>

        {/* Screen Count Badge */}
        <motion.div 
          className="absolute top-5 right-5 bg-black/80 dark:bg-gray-900/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 z-40"
          style={{ transform: "translateZ(80px)" }}
        >
          {app.screenCount} screens
        </motion.div>

        {isVerified && (
          <div
            className="absolute right-5 bottom-5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] z-40 transition-opacity duration-300 group-hover:opacity-0 border-emerald-300/20 bg-emerald-400/15 text-white"
            style={{ transform: 'translateZ(74px)' }}
          >
            <span className="inline-flex items-center gap-1.5">
              <QualityIcon size={11} />
              {qualityLabel}
            </span>
          </div>
        )}

        {hasKit && (
          <div
            className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-emerald-400/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white z-40 transition-opacity duration-300 group-hover:opacity-0"
            style={{ transform: "translateZ(70px)" }}
          >
            Figma kit
          </div>
        )}

        {/* Source Quality Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-40" style={{ transform: "translateZ(100px)" }}>
           <div className="px-5 pb-5">
              <div className="flex justify-between items-end gap-3 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter shrink-0">
                  {isVerified ? 'Premium preview' : 'Reference preview'}
                </span>
                <span className="text-[10px] font-black text-white/85 truncate text-right">
                  {isVerified ? 'High-confidence source' : assetOrigin === 'generated' ? 'Generated fallback' : 'Use for research'}
                </span>
              </div>
              <div className="h-[3px] w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className={`h-full shadow-[0_0_10px_rgba(255,255,255,0.45)] ${isVerified ? 'bg-white' : 'bg-amber-300'}`}
                  initial={{ width: 0 }}
                  animate={{ width: isHovered ? (isVerified ? '100%' : '62%') : "0%" }}
                  transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.1 }}
                />
              </div>
           </div>
        </div>
      </motion.div>

      {/* Info Section */}
      <div className="flex items-center gap-4 px-2 mt-2">
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
            <motion.img 
              src={app.logo} 
              alt={app.name} 
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="w-12 h-12 rounded-xl border border-gray-100 dark:border-gray-800 object-cover shadow-sm transition-shadow group-hover:shadow-lg"
            />
        </motion.div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <motion.h3 
            className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate"
          >
            {app.name}
          </motion.h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            <span className="font-medium">{app.category}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></span>
            <div className="flex items-center gap-1.5 font-semibold">
               {app.platform === 'iOS' || app.platform === 'Android' ? <Smartphone size={13} /> : <Monitor size={13} />}
               {app.platform}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppCard;
