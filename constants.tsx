import React from 'react';
import { LayoutGrid, Smartphone, Monitor, Layers, BookOpen } from 'lucide-react';
import { AppItem, NavItem, FilterTag } from './types';
import { generateAppLogoAsset, generateAppScreenAsset } from './services/assetFactory';
import { REAL_APP_ASSETS } from './data/realAppAssets';
import { APP_NAMES_BY_CATEGORY, CATEGORIES, PLATFORMS } from './data/catalog.js';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Browse', icon: <LayoutGrid size={20} />, path: '/' },
  { label: 'Apps', icon: <Smartphone size={20} />, path: '/apps' },
  { label: 'Screens', icon: <Monitor size={20} />, path: '/screens' },
  { label: 'Flows', icon: <Layers size={20} />, path: '/flows' },
  { label: 'Dictionary', icon: <BookOpen size={20} />, path: '/dictionary' },
];

export const FILTER_TAGS: FilterTag[] = [
  { id: 'all', label: 'All' },
  { id: 'finance', label: 'Finance' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'social', label: 'Social' },
  { id: 'travel', label: 'Travel' },
  { id: 'business', label: 'Business' },
  { id: 'education', label: 'Education' },
  { id: 'health', label: 'Health' },
  { id: 'music', label: 'Music' },
  { id: 'news', label: 'News' },
];

export const MOCK_APPS: AppItem[] = Array.from({ length: 40 }).map((_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length] as keyof typeof APP_NAMES_BY_CATEGORY;
  const names = APP_NAMES_BY_CATEGORY[category] || ['Generic App'];
  const name = names[Math.floor(i / CATEGORIES.length) % names.length];
  const platform = PLATFORMS[i % PLATFORMS.length] as AppItem['platform'];
  const screenCount = 12 + (i * 7) % 80;
  const realAsset = REAL_APP_ASSETS[name];
  
  return {
    id: `app-${i}`,
    name,
    category,
    platform,
    screenCount,
    image: realAsset?.screenshots.length
      ? realAsset.screenshots[i % realAsset.screenshots.length]
      : generateAppScreenAsset(
      {
        id: `app-${i}`,
        name,
        category,
        platform,
        screenCount,
        image: '',
        logo: '',
        lastUpdated: '2 days ago',
      },
      i
      ),
    logo: realAsset?.logo || generateAppLogoAsset(name, i),
    lastUpdated: '2 days ago',
  };
});
