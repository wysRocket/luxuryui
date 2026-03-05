import { AppItem } from '../types';
import { REAL_APP_ASSETS } from './realAppAssets';

export interface FlowDefinition {
  id: string;
  title: string;
  description: string;
  categories: string[];
  steps: string[];
  objective: string;
}

export interface FlowScreen {
  appName: string;
  url: string;
}

export const FLOW_DEFINITIONS: FlowDefinition[] = [
  {
    id: 'onboarding',
    title: 'Onboarding Flow',
    description: 'How leading apps introduce value, collect intent, and drive first successful action.',
    categories: ['Finance', 'Health', 'Education', 'Business'],
    objective: 'Reduce time-to-value in the first session.',
    steps: ['Welcome & Value Proposition', 'Permission Setup', 'Personalization', 'Activation Event', 'Completion State'],
  },
  {
    id: 'checkout',
    title: 'Checkout Flow',
    description: 'Browse-to-buy progression with cart clarity, payment confidence, and low-friction confirmation.',
    categories: ['Shopping', 'Travel', 'Finance'],
    objective: 'Increase conversion while minimizing abandonment.',
    steps: ['Cart Review', 'Shipping & Contact', 'Payment Selection', 'Order Summary', 'Confirmation'],
  },
  {
    id: 'search-discovery',
    title: 'Search & Discovery Flow',
    description: 'Pattern sequence for query entry, filtering, ranking, and result confidence.',
    categories: ['Shopping', 'News', 'Travel', 'Music'],
    objective: 'Improve findability with fewer query reformulations.',
    steps: ['Query Entry', 'Contextual Suggestions', 'Filter & Sort', 'Result Scanning', 'Detail Drilldown'],
  },
  {
    id: 'social-engagement',
    title: 'Social Engagement Flow',
    description: 'Interaction loops for feed browsing, content creation, reactions, and retention touchpoints.',
    categories: ['Social', 'Music', 'News'],
    objective: 'Maximize meaningful engagement per session.',
    steps: ['Feed Entry', 'Post Consumption', 'Reaction / Reply', 'Creation Prompt', 'Notification Return'],
  },
  {
    id: 'account-settings',
    title: 'Account & Settings Flow',
    description: 'Secure profile management, privacy controls, and account maintenance states.',
    categories: ['Business', 'Finance', 'Social', 'Health'],
    objective: 'Make account control clear and trustworthy.',
    steps: ['Profile Overview', 'Personal Data Edit', 'Privacy Controls', 'Security Action', 'Saved Success State'],
  },
  {
    id: 'subscription-upgrade',
    title: 'Subscription Upgrade Flow',
    description: 'Monetization journey from plan discovery to successful upgrade completion.',
    categories: ['Business', 'Music', 'Education', 'Health'],
    objective: 'Increase plan upgrade conversion with transparent value framing.',
    steps: ['Plan Comparison', 'Feature Value Reinforcement', 'Billing Selection', 'Payment & Confirmation', 'Post-Upgrade State'],
  },
];

const withRealAssets = (app: AppItem): boolean => {
  return (REAL_APP_ASSETS[app.name]?.screenshots?.length || 0) > 0;
};

const uniqueByName = (apps: AppItem[]): AppItem[] => {
  const seen = new Set<string>();
  const result: AppItem[] = [];

  for (const app of apps) {
    if (seen.has(app.name)) continue;
    seen.add(app.name);
    result.push(app);
  }

  return result;
};

export const getFlowApps = (apps: AppItem[], flow: FlowDefinition, limit = 8): AppItem[] => {
  const preferred = uniqueByName(
    apps.filter((app) => flow.categories.includes(app.category) && withRealAssets(app))
  );

  if (preferred.length >= limit) {
    return preferred.slice(0, limit);
  }

  const filler = uniqueByName(
    apps.filter((app) => !preferred.some((candidate) => candidate.name === app.name) && withRealAssets(app))
  );

  return [...preferred, ...filler].slice(0, limit);
};

export const getFlowScreens = (flowApps: AppItem[], maxScreens = 14): FlowScreen[] => {
  const screens: FlowScreen[] = [];

  for (const app of flowApps) {
    const realScreens = REAL_APP_ASSETS[app.name]?.screenshots ?? [];
    const sample = realScreens.slice(0, 3);

    for (const url of sample) {
      screens.push({ appName: app.name, url });
      if (screens.length >= maxScreens) {
        return screens;
      }
    }
  }

  return screens;
};
