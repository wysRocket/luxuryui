import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, LayoutGrid, Calendar, Share2, Bookmark, Info } from 'lucide-react';
import { AppItem } from '../types';

interface AppDetailsModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ app, isOpen, onClose }) => {
  const [showPlatformTooltip, setShowPlatformTooltip] = useState(false);

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
            {/* Image Section - The "Larger View" */}
            <motion.div 
              layoutId={`app-image-container-${app.id}`}
              className="w-full md:w-3/5 h-[400px] md:h-auto relative bg-gray-100 dark:bg-gray-800 overflow-hidden"
            >
              <motion.div 
                layoutId={`app-image-${app.id}`}
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${app.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              
              {/* Close Button Mobile */}
              <button 
                onClick={onClose}
                className="md:hidden absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <X size={20} />
              </button>
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
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Screens</p>
                    <p className="text-sm font-semibold dark:text-gray-200">{app.screenCount} items</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">About this app</h4>
                <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
                  Explore the complete user journey and design patterns of {app.name}. This curated collection features {app.screenCount} high-resolution screens covering critical flows like onboarding, checkout, and profile settings.
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <button className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-200 dark:shadow-none">
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