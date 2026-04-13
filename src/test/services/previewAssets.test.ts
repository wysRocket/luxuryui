import { describe, expect, it, vi } from 'vitest';
import type { AppItem } from '@/types';
import {
  getPreviewImageForApp,
  getPreviewScreensForApp,
  hasPreviewScreensForApp,
} from '@/services/previewAssets';

vi.mock('@/data/realAppAssets', () => ({
  REAL_APP_ASSETS: {
    'Verified App': {
      logo: '/assets/apps/verified/logo.png',
      screenshots: ['/assets/apps/verified/screen-1.png', '/assets/apps/verified/screen-2.png'],
      source: 'https://example.com/verified',
    },
    'Warn App': {
      logo: '/assets/apps/warn/logo.png',
      screenshots: ['/assets/apps/warn/screen-1.png', '/assets/apps/warn/screen-2.png'],
      source: 'https://example.com/warn',
    },
  },
}));

const verifiedApp: AppItem = {
  id: 'verified',
  slug: 'verified-app',
  name: 'Verified App',
  category: 'Finance',
  platform: 'iOS',
  screenCount: 2,
  image: '/assets/apps/verified/screen-1.png',
  logo: '/assets/apps/verified/logo.png',
  lastUpdated: '2026-04-13',
  sourceQuality: 'pass',
  assetOrigin: 'real',
};

const warnApp: AppItem = {
  ...verifiedApp,
  id: 'warn',
  slug: 'warn-app',
  name: 'Warn App',
  image: '/assets/apps/warn/screen-1.png',
  logo: '/assets/apps/warn/logo.png',
  sourceQuality: 'warn',
};

describe('previewAssets', () => {
  it('keeps real screenshots when local preview assets exist', () => {
    expect(hasPreviewScreensForApp(verifiedApp)).toBe(true);
    expect(getPreviewImageForApp(verifiedApp)).toBe('/assets/apps/verified/screen-1.png');
    expect(getPreviewScreensForApp(verifiedApp, 8)).toEqual([
      '/assets/apps/verified/screen-1.png',
      '/assets/apps/verified/screen-2.png',
    ]);
  });

  it('does not hide local screenshots for warn apps', () => {
    expect(hasPreviewScreensForApp(warnApp)).toBe(true);
    expect(getPreviewImageForApp(warnApp)).toBe('/assets/apps/warn/screen-1.png');
    expect(getPreviewScreensForApp(warnApp, 8)).toEqual([
      '/assets/apps/warn/screen-1.png',
      '/assets/apps/warn/screen-2.png',
    ]);
  });

  it('falls back to generated previews only when no local screenshots exist', () => {
    const generatedOnlyApp: AppItem = {
      ...verifiedApp,
      id: 'generated',
      slug: 'generated-app',
      name: 'Generated App',
      image: '',
      logo: '',
      assetOrigin: 'generated',
    };

    expect(hasPreviewScreensForApp(generatedOnlyApp)).toBe(false);
    expect(getPreviewImageForApp(generatedOnlyApp)).toMatch(/^data:image\/svg\+xml;utf8,/);
    expect(getPreviewScreensForApp(generatedOnlyApp, 6)).toHaveLength(6);
  });
});
