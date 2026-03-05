import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AppItem } from '../types';
import { FLOW_DEFINITIONS, getFlowApps, getFlowScreens } from '../data/flows';

interface FlowDetailPageProps {
  apps: AppItem[];
}

const FlowDetailPage: React.FC<FlowDetailPageProps> = ({ apps }) => {
  const { flowId } = useParams<{ flowId: string }>();

  const flow = useMemo(() => FLOW_DEFINITIONS.find((item) => item.id === flowId), [flowId]);

  const flowApps = useMemo(() => {
    if (!flow) return [];
    return getFlowApps(apps, flow, 10);
  }, [apps, flow]);

  const flowScreens = useMemo(() => {
    return getFlowScreens(flowApps, 24);
  }, [flowApps]);

  if (!flow) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Flow</p>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-3">Flow not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The requested flow does not exist.</p>
          <Link
            to="/flows"
            className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-black"
          >
            <ArrowLeft size={16} />
            Back to flows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/70 dark:to-gray-950 p-8 md:p-12 mb-10">
        <Link
          to="/flows"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          All flows
        </Link>

        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-3">{flow.objective}</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">{flow.title}</h1>
        <p className="text-[15px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-6">{flow.description}</p>

        <div className="flex flex-wrap gap-2">
          {flow.categories.map((category) => (
            <span
              key={`${flow.id}-${category}`}
              className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">Flow Steps</h2>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {flow.steps.length} step sequence
          </div>
        </div>

        <div className="space-y-5">
          {flow.steps.map((step, index) => {
            const preview = flowScreens[index % Math.max(flowScreens.length, 1)];
            return (
              <motion.article
                key={`${flow.id}-${step}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
                  <div className="p-6 md:p-8">
                    <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[11px] font-black text-gray-600 dark:text-gray-300 mb-4">
                      Step {index + 1}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-3">{step}</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mb-5">
                      Review how this stage is handled in high-performing products and compare structural choices, visual hierarchy, and interaction density.
                    </p>
                    {preview && (
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Reference app: {preview.appName}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950/40 p-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
                    {preview ? (
                      <img
                        src={preview.url}
                        alt={`${flow.title} step ${index + 1}`}
                        className="w-full h-full min-h-[280px] rounded-xl object-cover border border-gray-100 dark:border-gray-800"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[280px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        Screen preview unavailable
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">Related App Galleries</h2>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
            <Layers size={13} />
            {flowApps.length} apps
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {flowApps.map((app) => (
            <Link
              key={`${flow.id}-${app.id}`}
              to={`/apps/${app.id}/screens`}
              className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={app.logo} alt={app.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-gray-800" />
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{app.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{app.category}</p>
                </div>
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-300 inline-flex items-center gap-1">
                Open app screens <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FlowDetailPage;
