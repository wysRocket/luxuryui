import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppItem } from '../types';
import { FLOW_DEFINITIONS, getFlowApps, getFlowScreens } from '../data/flows';

interface FlowsPageProps {
  apps: AppItem[];
}

const FlowsPage: React.FC<FlowsPageProps> = ({ apps }) => {
  const flowCards = useMemo(() => {
    return FLOW_DEFINITIONS.map((flow) => {
      const flowApps = getFlowApps(apps, flow, 7);
      const screens = getFlowScreens(flowApps, 8);

      return {
        flow,
        flowApps,
        screens,
      };
    });
  }, [apps]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/70 dark:to-gray-950 p-8 md:p-12"
      >
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Flow Library</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">Real Product Flows</h1>
        <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          End-to-end references from live products. Open any flow to review the sequence, key decisions, and step-level visual patterns.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-bold">
          {flowCards.length} structured flow packs <Sparkles size={14} />
        </div>
      </motion.section>

      <section className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-7">
        {flowCards.map(({ flow, flowApps, screens }, index) => (
          <motion.article
            key={flow.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="p-6 md:p-7 border-b border-gray-100 dark:border-gray-800">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">{flow.objective}</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">{flow.title}</h2>
              <p className="text-sm md:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{flow.description}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {flow.steps.map((step) => (
                  <span
                    key={`${flow.id}-${step}`}
                    className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300"
                  >
                    {step}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {flowApps.slice(0, 5).map((app) => (
                    <img
                      key={`${flow.id}-${app.id}`}
                      src={app.logo}
                      alt={app.name}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 object-cover"
                      title={app.name}
                    />
                  ))}
                  {flowApps.length > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 text-[10px] font-black text-gray-600 dark:text-gray-300 flex items-center justify-center">
                      +{flowApps.length - 5}
                    </div>
                  )}
                </div>

                <Link
                  to={`/flows/${flow.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-black"
                >
                  Open flow <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="p-4 md:p-5 bg-gray-50/80 dark:bg-gray-950/60">
              <div className="grid grid-cols-4 gap-3">
                {screens.map((screen, screenIndex) => (
                  <div
                    key={`${flow.id}-screen-${screenIndex}`}
                    className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    title={screen.appName}
                  >
                    <img src={screen.url} alt={`${flow.title} preview ${screenIndex + 1}`} className="w-full h-36 object-cover" loading="lazy" />
                  </div>
                ))}
                {screens.length === 0 && (
                  <div className="col-span-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No screenshots available for this flow yet.
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <LayoutGrid size={14} />
                {screens.length} preview screens from {flowApps.length} apps
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default FlowsPage;
