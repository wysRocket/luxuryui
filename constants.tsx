import React from 'react';
import { LayoutGrid, Smartphone, Monitor, Layers, BookOpen } from 'lucide-react';
import { AppItem, NavItem, FilterTag } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Browse', icon: <LayoutGrid size={20} />, active: true },
  { label: 'Apps', icon: <Smartphone size={20} /> },
  { label: 'Screens', icon: <Monitor size={20} /> },
  { label: 'Flows', icon: <Layers size={20} /> },
  { label: 'Dictionary', icon: <BookOpen size={20} /> },
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

const APP_NAMES_BY_CATEGORY: Record<string, string[]> = {
  Finance: ['Monzo', 'Revolut', 'Mint', 'Robinhood', 'PayPal', 'Wallet', 'Wealthfront', 'N26'],
  Crypto: ['Coinbase', 'Binance', 'MetaMask', 'Kraken', 'Phantom', 'Uniswap', 'Ledger'],
  Shopping: ['Amazon', 'eBay', 'Shopify', 'Etsy', 'Zara', 'ASOS', 'Nike', 'StockX'],
  Social: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Snapchat', 'WhatsApp', 'Threads', 'BeReal'],
  Travel: ['Airbnb', 'Expedia', 'Hopper', 'Booking.com', 'Skyscanner', 'TripAdvisor', 'Kaykay', 'HotelTonight'],
  Business: ['Slack', 'Zoom', 'Trello', 'Notion', 'Asana', 'Monday.com', 'Linear', 'Loom'],
  Health: ['Headspace', 'Calm', 'Strava', 'Nike Run Club', 'MyFitnessPal', 'Fitbit', 'Flo', 'Sleep Cycle'],
  Music: ['Spotify', 'Apple Music', 'SoundCloud', 'Tidal', 'Deezer', 'Pandora', 'Shazam'],
  Education: ['Duolingo', 'Coursera', 'MasterClass', 'Udemy', 'Khan Academy', 'Skillshare', 'Babbel'],
  News: ['The New York Times', 'BBC News', 'CNN', 'Reuters', 'Flipboard', 'Substack', 'Pocket'],
};

const CATEGORIES = ['Finance', 'Travel', 'Social', 'Shopping', 'Business', 'Health', 'Crypto', 'Education', 'Music', 'News'];
const PLATFORMS = ['iOS', 'Android', 'Web'] as const;

export const MOCK_APPS: AppItem[] = Array.from({ length: 40 }).map((_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  const names = APP_NAMES_BY_CATEGORY[category] || ['Generic App'];
  const name = names[Math.floor(i / CATEGORIES.length) % names.length];
  
  return {
    id: `app-${i}`,
    name,
    category,
    platform: PLATFORMS[i % PLATFORMS.length],
    screenCount: 12 + (i * 7) % 80,
    image: `https://picsum.photos/400/800?random=${i + 100}`, 
    logo: `https://picsum.photos/100/100?random=${i}`,
    lastUpdated: '2 days ago',
  };
});
