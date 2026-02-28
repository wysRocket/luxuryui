import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sparkles, Sun, Moon, X, ArrowLeft, TrendingUp, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_APPS, FILTER_TAGS } from '../constants';

interface HeaderProps {
  onOpenAssistant: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenAssistant, 
  isDarkMode, 
  toggleDarkMode,
  searchQuery,
  onSearchChange
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const trendingCategories = FILTER_TAGS.filter(t => t.id !== 'all').slice(0, 5);
  const popularApps = MOCK_APPS.slice(0, 4);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between h-20 px-4 md:px-8 gap-6 md:gap-12">
        
        {/* Left Side: Brand (Mobile) and Desktop Search */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="lg:hidden font-black text-2xl tracking-tighter dark:text-white shrink-0 mr-6">LuxuryUI</div>
          
          {/* Desktop Search Bar: Optimized to occupy all free space */}
          <div className="hidden md:flex flex-1 max-w-5xl items-center relative" ref={searchRef}>
            <div className={`relative w-full transition-all duration-500 ease-out ${isSearchFocused ? 'scale-[1.005]' : ''}`}>
              <Search 
                className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none ${isSearchFocused ? 'text-black dark:text-white' : 'text-gray-400'}`} 
                size={18} 
              />
              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for apps, categories, platforms..." 
                className={`w-full bg-gray-100/70 dark:bg-gray-900/70 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 border border-transparent focus:border-gray-200 dark:focus:border-gray-700 rounded-full pl-14 pr-16 py-3 text-[15px] outline-none transition-all dark:text-white font-medium shadow-none focus:shadow-2xl focus:shadow-black/5`}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 {searchQuery ? (
                   <button 
                    onClick={() => onSearchChange('')}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                    aria-label="Clear search"
                   >
                     <X size={16} />
                   </button>
                 ) : (
                   <kbd className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-[11px] font-black text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 pointer-events-none shadow-sm uppercase tracking-tighter">
                     <span className="text-[13px] leading-none opacity-60">⌘</span> K
                   </kbd>
                 )}
              </div>
            </div>

            {/* Quick Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && !searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.99 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-3 w-full bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl shadow-black/10 dark:shadow-white/5 border border-gray-100 dark:border-gray-800 p-6 z-50 overflow-hidden"
                >
                  <div className="space-y-8">
                    {/* Trending Categories */}
                    <div>
                      <div className="flex items-center gap-2 mb-5 px-1 text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
                        <TrendingUp size={14} className="text-blue-500" />
                        Trending Categories
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              onSearchChange(cat.label);
                              setIsSearchFocused(false);
                            }}
                            className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800/40 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full text-[15px] font-bold transition-all transform active:scale-95 border border-transparent hover:border-black dark:hover:border-white"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Popular Apps */}
                    <div>
                      <div className="flex items-center gap-2 mb-5 px-1 text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
                        <Zap size={14} className="text-orange-500" />
                        Popular Apps
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {popularApps.map(app => (
                          <button
                            key={app.id}
                            onClick={() => {
                              onSearchChange(app.name);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-5 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all group text-left border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                          >
                            <img src={app.logo} alt={app.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105" />
                            <div className="min-w-0">
                              <p className="text-[15px] font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">{app.name}</p>
                              <p className="text-[12px] text-gray-500 font-medium truncate opacity-80">{app.category} • {app.platform}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Search Footer */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-600 font-black px-1 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Clock size={12} />
                          Recent Searches
                        </div>
                        <button className="hover:text-red-500 transition-colors font-black">Clear History</button>
                      </div>
                      <div className="mt-4 text-center py-8 text-[15px] text-gray-400 italic font-medium bg-gray-50/40 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        No recent search history available
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side Actions: compact and shrink-resistant */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Open Search"
          >
            <Search size={22} />
          </button>

          <button 
            onClick={toggleDarkMode}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <button 
              onClick={onOpenAssistant}
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-full text-[11px] font-black shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all hover:scale-[1.03] active:scale-95 tracking-widest uppercase"
          >
              <Sparkles size={16} />
              AI Studio
          </button>
            
          <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-950"></span>
          </button>
          
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>
          
          <button className="hidden sm:block text-[15px] font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white px-3 transition-colors">Log in</button>
          <button className="hidden sm:block px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-[15px] font-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5 tracking-tight">
            Sign Up
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-50 bg-white dark:bg-gray-950 px-4 flex items-center gap-4 md:hidden"
          >
            <button 
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-gray-500 dark:text-gray-400"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 relative">
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search screens..." 
                className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-2xl pl-5 pr-12 py-3.5 text-[16px] outline-none dark:text-white font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button 
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-[15px] font-black text-gray-900 dark:text-white px-1"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
