import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import AppCard from '../components/AppCard';
import AppDetailsModal from '../components/AppDetailsModal';
import AppSlider from '../components/AppSlider';
import FeatureSection from '../components/FeatureSection';
import FooterCTASection from '../components/FooterCTASection';
import StatsHero from '../components/StatsHero';
import TestimonialSection from '../components/TestimonialSection';
import { FILTER_TAGS, MOCK_APPS } from '../constants';
import { AppItem } from '../types';

interface BrowsePageProps {
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BrowsePage: React.FC<BrowsePageProps> = ({ isDarkMode, searchQuery, onSearchChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const hasScrolledForCurrentSearch = useRef(false);

  useEffect(() => {
    if (searchQuery.length >= 3 && !hasScrolledForCurrentSearch.current) {
      const timer = setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          hasScrolledForCurrentSearch.current = true;
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    if (searchQuery.length < 3) {
      hasScrolledForCurrentSearch.current = false;
    }

    return undefined;
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  const filteredApps = MOCK_APPS.filter((app) => {
    const categoryMatches = selectedFilter === 'all' || app.category.toLowerCase() === selectedFilter.toLowerCase();
    const platformMatches = selectedPlatform === 'all' || app.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const normalizedQuery = searchQuery.toLowerCase().trim();

    const searchMatches =
      normalizedQuery === '' ||
      app.name.toLowerCase().includes(normalizedQuery) ||
      app.category.toLowerCase().includes(normalizedQuery) ||
      app.platform.toLowerCase().includes(normalizedQuery);

    return categoryMatches && platformMatches && searchMatches;
  });

  const activeFiltersCount = (selectedFilter !== 'all' ? 1 : 0) + (selectedPlatform !== 'all' ? 1 : 0);

  return (
    <>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        <StatsHero />
        <FeatureSection />

        <div className="sticky top-20 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 mb-8 -mx-4 px-4 md:-mx-8 md:px-8">
          <div className="py-4 flex items-center gap-3">
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
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

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
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          Platform
                        </span>
                        {selectedPlatform !== 'all' && (
                          <button onClick={() => setSelectedPlatform('all')} className="text-xs text-red-500 hover:underline">
                            Clear
                          </button>
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

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

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

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 flex-shrink-0" />

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 mask-linear-fade">
              {FILTER_TAGS.map((tag) => (
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

        {!searchQuery && (
          <div className="-mx-4 md:-mx-8 overflow-hidden">
            <AppSlider apps={filteredApps} onAppClick={(app) => setSelectedApp(app)} speed={Math.max(40, filteredApps.length * 8)} />
          </div>
        )}

        {filteredApps.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-600">
              <X size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery
                ? `We couldn't find anything matching "${searchQuery}"`
                : 'Try adjusting your filters or search criteria.'}
            </p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedPlatform('all');
                onSearchChange('');
              }}
              className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {filteredApps.length > 0 && (
          <>
            <div className="mt-16 mb-6">
              <h2 ref={resultsRef} className="text-2xl font-black tracking-tight dark:text-white scroll-mt-32">
                {searchQuery ? 'Matching Screens' : 'Featured Screens'}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[400px] mb-12">
              {filteredApps.map((app) => (
                <div key={`${app.id}-grid`}>
                  <AppCard app={app} onClick={(nextApp) => setSelectedApp(nextApp)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {!searchQuery && <TestimonialSection />}
      {!searchQuery && <FooterCTASection isDarkMode={isDarkMode} />}

      <AppDetailsModal app={selectedApp} isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} />
    </>
  );
};

export default BrowsePage;
