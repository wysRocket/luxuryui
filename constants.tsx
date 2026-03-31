import React from 'react';
import { LayoutGrid, Smartphone, Monitor, Layers, BookOpen, PenTool } from 'lucide-react';
import { AppItem, NavItem, FilterTag } from './types';
import { generateAppLogoAsset, generateAppScreenAsset } from './services/assetFactory';
import { REAL_APP_ASSETS } from './data/realAppAssets';
import { CATALOG_ENTRIES, PLATFORMS } from './data/catalog.js';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Browse', icon: <LayoutGrid size={20} />, path: '/' },
  { label: 'Apps', icon: <Smartphone size={20} />, path: '/apps' },
  { label: 'Screens', icon: <Monitor size={20} />, path: '/screens' },
  { label: 'Flows', icon: <Layers size={20} />, path: '/flows' },
  { label: 'Figma Kits', icon: <PenTool size={20} />, path: '/kits' },
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

export const MOCK_APPS: AppItem[] = CATALOG_ENTRIES.map((entry, i) => {
  const { category, name, slug } = entry;
  const platform = PLATFORMS[i % PLATFORMS.length] as AppItem['platform'];
  const realScreens = REAL_APP_ASSETS[name]?.screenshots ?? [];
  const screenCount = realScreens.length > 0 ? realScreens.length : 12 + (i * 7) % 80;
  const realAsset = REAL_APP_ASSETS[name];
  
  return {
    id: `app-${i}`,
    slug,
    name,
    category,
    platform,
    screenCount,
    image: realAsset?.screenshots.length
      ? realAsset.screenshots[i % realAsset.screenshots.length]
      : generateAppScreenAsset(
      {
        id: `app-${i}`,
        slug,
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
