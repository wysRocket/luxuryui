import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppItem } from '../types';

interface SystemProfile {
  id: string;
  name: string;
  owner: string;
  platforms: string[];
  bestFor: string;
  principles: string[];
  components: string[];
  referenceApps: string[];
}

const SYSTEMS: SystemProfile[] = [
  {
    id: 'material-3',
    name: 'Material 3',
    owner: 'Google',
    platforms: ['Android', 'Web'],
    bestFor: 'Scalable product suites with dense interaction surfaces.',
    principles: ['Adaptive color tokens', 'High-component consistency', 'Strong motion semantics'],
    components: ['Top app bar', 'Navigation rail', 'Bottom sheet', 'Text field', 'Snackbars'],
    referenceApps: ['Google', 'YouTube', 'Duolingo', 'CNN'],
  },
  {
    id: 'human-interface',
    name: 'Human Interface Guidelines',
    owner: 'Apple',
    platforms: ['iOS', 'iPadOS'],
    bestFor: 'Native-feeling experiences with clear hierarchy and smooth transitions.',
    principles: ['Clarity first', 'Depth via motion', 'System-native controls'],
    components: ['Tab bars', 'Sheets', 'Segmented control', 'Navigation stack', 'Large titles'],
    referenceApps: ['Apple Music', 'Shazam', 'Wallet', 'TripAdvisor'],
  },
  {
    id: 'fluent',
    name: 'Fluent',
    owner: 'Microsoft',
    platforms: ['Web', 'Desktop'],
    bestFor: 'Enterprise dashboards and productivity ecosystems.',
    principles: ['Clear information density', 'Strong text hierarchy', 'Accessible defaults'],
    components: ['Command bar', 'Data grids', 'Panel', 'Dialogs', 'Persona chips'],
    referenceApps: ['LinkedIn', 'Notion', 'Asana', 'Trello'],
  },
  {
    id: 'polaris',
    name: 'Polaris',
    owner: 'Shopify',
    platforms: ['Web', 'Admin'],
    bestFor: 'Operational tools, merchant workflows, and settings-heavy products.',
    principles: ['Merchant outcomes', 'Predictable control patterns', 'Composable primitives'],
    components: ['Resource list', 'Index table', 'Form layouts', 'Contextual save bar', 'Toasts'],
    referenceApps: ['Shopify', 'PayPal', 'Pocket', 'Coursera'],
  },
  {
    id: 'atlassian',
    name: 'Atlassian Design System',
    owner: 'Atlassian',
    platforms: ['Web', 'Collaboration'],
    bestFor: 'Team software with heavy workflows and multi-role users.',
    principles: ['Collaboration-ready patterns', 'Clear status language', 'Composable navigation'],
    components: ['Inline dialog', 'Lozenges', 'Side navigation', 'Issue fields', 'Banners'],
    referenceApps: ['Slack', 'Monday.com', 'Linear', 'Zoom'],
  },
  {
    id: 'ant-design',
    name: 'Ant Design',
    owner: 'Ant Group',
    platforms: ['Web'],
    bestFor: 'B2B products requiring complex data entry and dashboards.',
    principles: ['Form efficiency', 'Dense yet readable layouts', 'Systematic component APIs'],
    components: ['Table', 'Drawer', 'Form', 'Cascader', 'Tag'],
    referenceApps: ['Binance', 'Kraken', 'Reuters', 'The New York Times'],
  },
];

interface DesignSystemsPageProps {
  apps: AppItem[];
}

const DesignSystemsPage: React.FC<DesignSystemsPageProps> = ({ apps }) => {
  const appByName = useMemo(() => {
    const map = new Map<string, AppItem>();
    for (const app of apps) {
      if (!map.has(app.name)) map.set(app.name, app);
    }
    return map;
  }, [apps]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/70 dark:to-gray-950 p-8 md:p-12 mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Design Systems</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">Design System Playbook</h1>
        <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          Evaluate major system approaches, compare component strategy, and jump into real app references for each style.
        </p>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        {SYSTEMS.map((system) => (
          <article key={system.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{system.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{system.owner}</p>
              </div>
              <div className="inline-flex items-center rounded-full bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-[11px] font-black">
                {system.platforms.join(' / ')}
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">{system.bestFor}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Principles</p>
                <ul className="space-y-1.5">
                  {system.principles.map((item) => (
                    <li key={`${system.id}-principle-${item}`} className="text-sm text-gray-700 dark:text-gray-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Core Components</p>
                <ul className="space-y-1.5">
                  {system.components.map((item) => (
                    <li key={`${system.id}-component-${item}`} className="text-sm text-gray-700 dark:text-gray-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Reference Apps</p>
              <div className="flex flex-wrap gap-2">
                {system.referenceApps.map((appName) => {
                  const app = appByName.get(appName);

                  if (!app) {
                    return (
                      <span
                        key={`${system.id}-${appName}`}
                        className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400"
                      >
                        {appName}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={`${system.id}-${appName}`}
                      to={`/apps/${app.id}/screens`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <img src={app.logo} alt={app.name} className="w-4 h-4 rounded-full object-cover" />
                      {app.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8">
        <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-5">Adoption Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            'Define token primitives and semantic aliases',
            'Map navigation patterns per platform context',
            'Set component QA rules for states and edge cases',
            'Create release cadence for UI kit updates',
          ].map((item) => (
            <div key={item} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DesignSystemsPage;
