import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppItem } from '../types';

interface DictionaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  whenToUse: string;
  avoid: string;
  exampleApps: string[];
}

const TERMS: DictionaryTerm[] = [
  {
    id: 'empty-state',
    term: 'Empty State',
    category: 'Feedback',
    definition: 'A purposeful screen shown when no user data exists yet.',
    whenToUse: 'First-time use, no results, cleared lists, and permission-locked areas.',
    avoid: 'Showing a blank area with no action path.',
    exampleApps: ['Notion', 'Spotify', 'Airbnb'],
  },
  {
    id: 'progressive-disclosure',
    term: 'Progressive Disclosure',
    category: 'Cognitive Load',
    definition: 'Reveal complexity in steps, not all at once.',
    whenToUse: 'Advanced settings, onboarding, and checkout personalization.',
    avoid: 'Forcing users through many steps for a simple one-field task.',
    exampleApps: ['Robinhood', 'Duolingo', 'Revolut'],
  },
  {
    id: 'contextual-onboarding',
    term: 'Contextual Onboarding',
    category: 'Onboarding',
    definition: 'Teach features at the moment users need them.',
    whenToUse: 'Feature unlocks, first interaction with complex controls.',
    avoid: 'Long onboarding carousels before user intent is known.',
    exampleApps: ['Slack', 'Zoom', 'Shopify'],
  },
  {
    id: 'single-primary-action',
    term: 'Single Primary Action',
    category: 'Conversion',
    definition: 'One clear dominant CTA per decision block.',
    whenToUse: 'Pricing, plan upgrades, checkout, subscription prompts.',
    avoid: 'Multiple equal-emphasis CTAs competing for attention.',
    exampleApps: ['PayPal', 'Booking.com', 'Coursera'],
  },
  {
    id: 'skeleton-loading',
    term: 'Skeleton Loading',
    category: 'Performance',
    definition: 'Placeholder structure shown while content loads.',
    whenToUse: 'Feed, cards, search result lists, profile summaries.',
    avoid: 'Long skeleton durations without progress indication.',
    exampleApps: ['Instagram', 'LinkedIn', 'CNN'],
  },
  {
    id: 'sticky-navigation',
    term: 'Sticky Navigation',
    category: 'Navigation',
    definition: 'Persistent nav controls that stay visible while scrolling.',
    whenToUse: 'Large lists, dashboards, and multistep flows.',
    avoid: 'Oversized sticky bars reducing content visibility.',
    exampleApps: ['Amazon', 'TripAdvisor', 'The New York Times'],
  },
  {
    id: 'error-recovery',
    term: 'Error Recovery',
    category: 'Reliability',
    definition: 'Clear recovery path after validation or network failures.',
    whenToUse: 'Forms, payments, authentication, upload processes.',
    avoid: 'Generic “something went wrong” with no remediation.',
    exampleApps: ['N26', 'Kraken', 'MetaMask'],
  },
  {
    id: 'progress-indicator',
    term: 'Progress Indicator',
    category: 'Onboarding',
    definition: 'Explicitly communicates current step and completion horizon.',
    whenToUse: 'Onboarding, KYC, checkout, multi-stage account setup.',
    avoid: 'Misleading progress that jumps unpredictably.',
    exampleApps: ['Monzo', 'Asana', 'Udemy'],
  },
  {
    id: 'social-proof',
    term: 'Social Proof',
    category: 'Trust',
    definition: 'Signals credibility via usage, ratings, reviews, or endorsements.',
    whenToUse: 'Landing sections, plan pages, trial-to-paid transitions.',
    avoid: 'Unverifiable counters and anonymous testimonials.',
    exampleApps: ['Airbnb', 'Zara', 'Skillshare'],
  },
  {
    id: 'micro-interaction',
    term: 'Micro Interaction',
    category: 'Feedback',
    definition: 'Small animation or state change confirming user input.',
    whenToUse: 'Toggles, save actions, add-to-collection, and reactions.',
    avoid: 'Decorative animation that delays task completion.',
    exampleApps: ['TikTok', 'Threads', 'Nike Run Club'],
  },
  {
    id: 'semantic-grouping',
    term: 'Semantic Grouping',
    category: 'Information Architecture',
    definition: 'Organize content by user intent rather than internal teams.',
    whenToUse: 'Settings pages, search filters, documentation hubs.',
    avoid: 'Mixing unrelated controls in one visual block.',
    exampleApps: ['Notion', 'Pocket', 'Spotify'],
  },
  {
    id: 'choice-architecture',
    term: 'Choice Architecture',
    category: 'Conversion',
    definition: 'Structure options to make good decisions easier.',
    whenToUse: 'Plan selection, checkout upsells, preference setup.',
    avoid: 'Dark patterns that hide price or lock-in details.',
    exampleApps: ['Apple Music', 'Deezer', 'MasterClass'],
  },
];

interface DictionaryPageProps {
  apps: AppItem[];
}

const DictionaryPage: React.FC<DictionaryPageProps> = ({ apps }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(TERMS.map((term) => term.category))).sort((a, b) => a.localeCompare(b))];
  }, []);

  const appByName = useMemo(() => {
    const map = new Map<string, AppItem>();
    for (const app of apps) {
      if (!map.has(app.name)) map.set(app.name, app);
    }
    return map;
  }, [apps]);

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return TERMS.filter((term) => {
      const categoryMatch = selectedCategory === 'All' || term.category === selectedCategory;
      const textMatch =
        normalized.length === 0 ||
        term.term.toLowerCase().includes(normalized) ||
        term.definition.toLowerCase().includes(normalized) ||
        term.whenToUse.toLowerCase().includes(normalized);

      return categoryMatch && textMatch;
    });
  }, [query, selectedCategory]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/70 dark:to-gray-950 p-8 md:p-12 mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Dictionary</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">Product Design Dictionary</h1>
        <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-6">
          Practical terminology for designers, PMs, and engineers. Each term includes definition, use context, and live app references.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search term, pattern, or usage..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-[15px] outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <div className="inline-flex items-center rounded-2xl bg-black dark:bg-white text-white dark:text-black px-5 py-3 text-sm font-black">
            {filteredTerms.length} terms
          </div>
        </div>
      </section>

      <section className="mb-7 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-colors ${
              selectedCategory === category
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTerms.map((term) => (
          <article key={term.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{term.term}</h2>
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-[11px] font-black text-gray-600 dark:text-gray-300">
                {term.category}
              </span>
            </div>

            <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 mb-5">{term.definition}</p>

            <div className="space-y-3 mb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">When to use</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{term.whenToUse}</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Avoid</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{term.avoid}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Reference apps</p>
              <div className="flex flex-wrap gap-2">
                {term.exampleApps.map((appName) => {
                  const app = appByName.get(appName);

                  if (!app) {
                    return (
                      <span
                        key={`${term.id}-${appName}`}
                        className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400"
                      >
                        {appName}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={`${term.id}-${appName}`}
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

        {filteredTerms.length === 0 && (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-14 text-center text-gray-500 dark:text-gray-400">
            No dictionary terms match your search.
          </div>
        )}
      </section>
    </div>
  );
};

export default DictionaryPage;
