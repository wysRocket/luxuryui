import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronRight, ChevronDown, Check, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AppCard from './components/AppCard';
import AppSlider from './components/AppSlider';
import DesignAssistant from './components/DesignAssistant';
import StatsHero from './components/StatsHero';
import FeatureSection from './components/FeatureSection';
import TestimonialSection from './components/TestimonialSection';
import FooterCTASection from './components/FooterCTASection';
import AppDetailsModal from './components/AppDetailsModal';
import Footer from './components/Footer';
import { FILTER_TAGS, MOCK_APPS } from './constants';
import { AppItem } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const hasScrolledForCurrentSearch = useRef(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Automatic scroll when user types 3 symbols
  useEffect(() => {
    if (searchQuery.length >= 3 && !hasScrolledForCurrentSearch.current) {
      // Small timeout ensures that if the results section was hidden, 
      // it is now rendered and the ref is populated.
      const timer = setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          hasScrolledForCurrentSearch.current = true;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // Reset the scroll lock if the search is cleared or becomes too short
    if (searchQuery.length < 3) {
      hasScrolledForCurrentSearch.current = false;
    }
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Core Filtering Logic
  const filteredApps = MOCK_APPS.filter(app => {
    // 1. Category Pill Filter
    const categoryMatches = selectedFilter === 'all' || 
      app.category.toLowerCase() === selectedFilter.toLowerCase();
    
    // 2. Platform Dropdown Filter
    const platformMatches = selectedPlatform === 'all' || 
      app.platform.toLowerCase() === selectedPlatform.toLowerCase();
    
    // 3. Search Query Filter (Matches name, category, or platform)
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const searchMatches = normalizedQuery === '' || 
      app.name.toLowerCase().includes(normalizedQuery) ||
      app.category.toLowerCase().includes(normalizedQuery) ||
      app.platform.toLowerCase().includes(normalizedQuery);
    
    // Combined Filter Logic (Must satisfy all conditions)
    return categoryMatches && platformMatches && searchMatches;
  });

  const activeFiltersCount = (selectedFilter !== 'all' ? 1 : 0) + (selectedPlatform !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header 
          onOpenAssistant={() => setIsAssistantOpen(true)} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
            {/* Hero Section */}
            <StatsHero />

            {/* Features Section */}
            <FeatureSection />

            {/* Sticky Filter Bar */}
            <div className="sticky top-20 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 mb-8 -mx-4 px-4 md:-mx-8 md:px-8">
              <div className="py-4 flex items-center gap-3">
                
                {/* Filter Dropdown Trigger */}
                <div className="relative" ref={filterRef}>
                  <button 
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      isFilterDropdownOpen || activeFiltersCount > 0
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                        : 'bg-black text-white dark:bg-gray-800'
                    }`}
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-white text-black dark:bg-black dark:text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                        {activeFiltersCount}
                      </span>
                    )}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isFilterDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-30 overflow-hidden"
                      >
                         <div className="p-2">
                           <div className="flex items-center justify-between mb-2 px-2">
                             <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Platform</span>
                             {selectedPlatform !== 'all' && (
                               <button onClick={() => setSelectedPlatform('all')} className="text-xs text-red-500 hover:underline">Clear</button>
                             )}
                           </div>
                           <div className="space-y-1">
                             {['All', 'iOS', 'Android', 'Web'].map((platform) => (
                               <button
                                 key={platform}
                                 onClick={() => setSelectedPlatform(platform.toLowerCase())}
                                 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                   selectedPlatform === platform.toLowerCase()
                                     ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                                 }`}
                               >
                                 {platform}
                                 {selectedPlatform === platform.toLowerCase() && <Check size={14} />}
                               </button>
                             ))}
                           </div>
                         </div>
                         
                         <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                         <div className="p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center rounded-b-xl">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{filteredApps.length} results</span>
                            <button 
                              onClick={() => {
                                setSelectedPlatform('all');
                                setSelectedFilter('all');
                                setIsFilterDropdownOpen(false);
                              }}
                              className="text-xs font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              Reset all
                            </button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 flex-shrink-0"></div>

                {/* Horizontal Category List (Refined Pills) */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 mask-linear-fade">
                  {FILTER_TAGS.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedFilter(tag.id)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-2 border-2 ${
                        selectedFilter === tag.id 
                          ? 'bg-white border-black text-black dark:bg-gray-950 dark:border-white dark:text-white' 
                          : 'bg-gray-100 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black tracking-tight dark:text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Apps'}
              </h2>
              {filteredApps.length > 0 && (
                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
                  View all <ChevronRight size={16} />
                </button>
              )}
            </div>

            {/* Infinite Apps Slider (Hidden when searching for a cleaner grid view) */}
            {!searchQuery && (
              <div className="-mx-4 md:-mx-8 overflow-hidden">
                <AppSlider 
                    apps={filteredApps} 
                    onAppClick={(app) => setSelectedApp(app)} 
                    speed={Math.max(40, filteredApps.length * 8)} 
                />
              </div>
            )}

            {/* Empty State */}
            {filteredApps.length === 0 && (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-600">
                    <X size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}"` : 'Try adjusting your filters or search criteria.'}
                </p>
                <button 
                  onClick={() => { setSelectedFilter('all'); setSelectedPlatform('all'); setSearchQuery(''); }}
                  className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {filteredApps.length > 0 && (
              <>
                <div className="mt-16 mb-6">
                  <h2 
                    ref={resultsRef}
                    className="text-2xl font-black tracking-tight dark:text-white scroll-mt-32"
                  >
                    {searchQuery ? 'Matching Screens' : 'Featured Screens'}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[400px] mb-12">
                  {filteredApps.map(app => (
                    <div key={`${app.id}-grid`}>
                      <AppCard 
                        app={app} 
                        onClick={(app) => setSelectedApp(app)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Testimonial Section */}
          {!searchQuery && <TestimonialSection />}

          {/* CTA & Infinite Sliders Section */}
          {!searchQuery && <FooterCTASection isDarkMode={isDarkMode} />}
        </main>
        
        <Footer />
      </div>

      <DesignAssistant 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />

      <AppDetailsModal 
        app={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

export default App;