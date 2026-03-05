import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AppCard from '../components/AppCard';
import AppDetailsModal from '../components/AppDetailsModal';
import AppSlider from '../components/AppSlider';
import { AppItem } from '../types';

interface CollectionPageProps {
  title: string;
  description: string;
  apps: AppItem[];
}

const CollectionPage: React.FC<CollectionPageProps> = ({ title, description, apps }) => {
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const sortedApps = useMemo(() => {
    return [...apps].sort((a, b) => b.screenCount - a.screenCount);
  }, [apps]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/70 dark:to-gray-950 p-8 md:p-12"
      >
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Library</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-bold">
          {apps.length} collections available <ArrowRight size={14} />
        </div>
      </motion.section>

      {apps.length > 0 && (
        <div className="mt-10 -mx-4 md:-mx-8 overflow-hidden">
          <AppSlider apps={apps} onAppClick={(app) => setSelectedApp(app)} speed={Math.max(40, apps.length * 8)} reverse />
        </div>
      )}

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">Curated examples</h2>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Sorted by screen count</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[400px]">
          {sortedApps.map((app) => (
            <div key={`${title}-${app.id}`}>
              <AppCard app={app} onClick={(nextApp) => setSelectedApp(nextApp)} />
            </div>
          ))}
        </div>
      </section>

      <AppDetailsModal app={selectedApp} isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
};

export default CollectionPage;
