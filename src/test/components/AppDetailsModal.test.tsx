import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, afterEach } from 'vitest';
import AppDetailsModal from '@/components/AppDetailsModal';
import type { AppItem, FigmaKitProduct } from '@/types';

const { screenshots, relatedKit } = vi.hoisted(() => {
  const screenshots = [
    '/assets/apps/test/screen-1.png',
    '/assets/apps/test/screen-2.png',
    '/assets/apps/test/screen-3.png',
  ];

  const relatedKit: FigmaKitProduct = {
    id: 'kit-1',
    slug: 'test-kit',
    title: 'Test Kit',
    sourceAppSlug: 'test-app',
    sourceAppName: 'Test App',
    primaryFlowId: 'flow-1',
    type: 'flow-kit',
    status: 'published',
    figmaFileKey: null,
    thumbnail: '/assets/apps/test/kit.png',
    gallery: ['/assets/apps/test/kit.png'],
    includedScreens: 8,
    includedComponents: ['Cards'],
    includedTokens: ['Colors'],
    licenseTier: 'Commercial',
    creditCost: 140,
    bundleIds: [],
    transformationNotes: ['Approved'],
    qualityScore: 95,
    completenessScore: 93,
    lastReviewedAt: '2026-04-10',
    previewPath: '/kits/test-kit',
    purchasePath: '/account',
    delivery: {
      format: 'Figma',
      fulfillment: 'Download',
      includes: ['Editable file'],
    },
  };

  return { screenshots, relatedKit };
});

vi.mock('@/contexts/AppSessionContext', () => ({
  useAppSession: () => ({
    isAuthenticated: true,
    wallet: { balance: 180 },
    hasUnlocked: () => false,
  }),
}));

vi.mock('@/data/realAppAssets', () => ({
  REAL_APP_ASSETS: {
    'Test App': {
      logo: '/assets/apps/test/logo.png',
      screenshots,
      source: 'https://example.com/test-app',
    },
  },
}));

vi.mock('@/data/figmaKits', () => ({
  formatCreditCost: (amount: number) => `${amount} credits`,
  getPublishedKitForAppSlug: (slug: string) => (slug === 'test-app' ? relatedKit : undefined),
}));

const app: AppItem = {
  id: 'test-app-id',
  slug: 'test-app',
  name: 'Test App',
  category: 'Finance',
  platform: 'iOS',
  screenCount: 3,
  image: screenshots[0],
  logo: '/assets/apps/test/logo.png',
  lastUpdated: '2026-04-10',
  sourceQuality: 'pass',
  assetOrigin: 'real',
};

describe('AppDetailsModal', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderModal = () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <AppDetailsModal app={app} isOpen onClose={() => undefined} />
        </MemoryRouter>,
      );
    });
  };

  it('keeps the primary action row above the commercial status card', () => {
    renderModal();

    const actionsButton = screenText('View all screens');
    const commercialLabel = screenText('Commercial Status');

    const actionsRow = actionsButton.closest('div');
    const commercialCard = commercialLabel.closest('div');

    expect(actionsRow).toBeTruthy();
    expect(commercialCard).toBeTruthy();
    expect(
      Boolean(
        actionsRow &&
          commercialCard &&
          (actionsRow.compareDocumentPosition(commercialCard) & Node.DOCUMENT_POSITION_FOLLOWING),
      ),
    ).toBe(true);
  });

  it('anchors the screenshot rail at the bottom of the preview pane with horizontal overflow', () => {
    renderModal();

    const firstThumb = screenLabel('Show screenshot 1');
    const rail = firstThumb.parentElement;

    expect(rail?.className).toContain('overflow-x-auto');
    expect(rail?.parentElement?.className).toContain('absolute');
    expect(rail?.parentElement?.className).toContain('bottom-32');
  });

  it('surfaces a mobile summary card with the primary action above the detail scroll area', () => {
    renderModal();

    const primaryAction = screenText('View all screens');
    const summaryCard = primaryAction.closest('div');
    const summaryWrapper = summaryCard?.parentElement;
    const previewBadge = screenText('Curated Preview');
    const previewPane = previewBadge.closest('div[class*="bg-[#0b0b0f]"]');

    expect(summaryCard?.className).toContain('rounded-[1.75rem]');
    expect(summaryWrapper?.className).toContain('md:hidden');
    expect(previewPane?.className).toContain('h-[56svh]');
  });
});

const screenText = (text: string) => {
  const node = Array.from(document.querySelectorAll('*')).find(
    (element) => element.textContent?.trim() === text,
  );

  if (!node) {
    throw new Error(`Unable to find text: ${text}`);
  }

  return node as HTMLElement;
};

const screenLabel = (label: string) => {
  const node = document.querySelector(`[aria-label="${label}"]`);
  if (!node) {
    throw new Error(`Unable to find label: ${label}`);
  }
  return node as HTMLElement;
};
