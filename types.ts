import React from 'react';

export interface AppItem {
  id: string;
  name: string;
  category: string;
  platform: 'iOS' | 'Android' | 'Web';
  screenCount: number;
  image: string; // URL for the cover image
  logo: string; // URL for the app logo
  lastUpdated: string;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface FilterTag {
  id: string;
  label: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
