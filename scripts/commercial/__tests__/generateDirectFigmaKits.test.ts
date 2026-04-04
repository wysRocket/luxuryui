import { describe, expect, it } from 'vitest';
import {
  buildDirectSourceDescriptor,
  collectDirectSourceAssets,
  getEligibleDirectKits,
} from '../generate-direct-figma-kits.mjs';

describe('generate-direct-figma-kits', () => {
  it('selects source assets from the matched flow app before falling back to quality data', () => {
    const selectedAssets = collectDirectSourceAssets({
      flowApp: {
        screenshots: [
          '/assets/apps/monzo/screen-1.png',
          '/assets/apps/monzo/screen-2.png',
          '/assets/apps/monzo/screen-3.png',
        ],
      },
      qualityApp: {
        screenshots: {
          files: [
            { file: 'screen-4.png' },
            { file: 'screen-5.png' },
          ],
        },
      },
      appSlug: 'monzo',
      targetScreenCount: 2,
    });

    expect(selectedAssets).toEqual([
      '/assets/apps/monzo/screen-1.png',
      '/assets/apps/monzo/screen-2.png',
    ]);
  });

  it('builds direct packet input with provenance and transformation notes', () => {
    const directSource = buildDirectSourceDescriptor({
      product: {
        sourceAppSlug: 'monzo',
        primaryFlowId: 'onboarding',
        transformationNotes: ['Generalize brand nouns.'],
      },
      spec: {
        includedFrames: ['Cover page', 'Transformed screen 1', 'Transformed screen 2'],
        renameRules: ['Swap proprietary icon metaphors.'],
        placeholderContentPolicy: ['Do not reuse source marketing copy.'],
      },
      review: {
        editorialNotes: ['Reference pack is commercially viable once transformed.'],
      },
      flow: {
        steps: ['Welcome & Value Proposition', 'Permission Setup'],
      },
      flowApp: {
        screenshots: [
          '/assets/apps/monzo/screen-1.png',
          '/assets/apps/monzo/screen-2.png',
        ],
      },
      qualityApp: null,
    });

    expect(directSource.generationSource).toBe('direct');
    expect(directSource.sourceAppSlug).toBe('monzo');
    expect(directSource.sourceFlowId).toBe('onboarding');
    expect(directSource.sourceAssetPaths).toEqual([
      '/assets/apps/monzo/screen-1.png',
      '/assets/apps/monzo/screen-2.png',
    ]);
    expect(directSource.sourceLabels).toEqual(['Welcome & Value Proposition', 'Permission Setup']);
    expect(directSource.transformationNotes).toEqual([
      'Generalize brand nouns.',
      'Swap proprietary icon metaphors.',
      'Do not reuse source marketing copy.',
      'Reference pack is commercially viable once transformed.',
    ]);
  });

  it('includes failed-quality kits in direct generation when quality assets exist', () => {
    const kits = getEligibleDirectKits({
      products: {
        products: [
          {
            id: 'figma-kit:cnn',
            slug: 'cnn-figma-kit',
            sourceAppSlug: 'cnn',
            primaryFlowId: 'search-discovery',
          },
        ],
      },
      specs: {
        kitSpecs: [
          {
            productId: 'figma-kit:cnn',
            includedFrames: ['Cover page', 'Transformed screen 1', 'Transformed screen 2'],
          },
        ],
      },
      reviews: {
        reviews: [
          {
            productId: 'figma-kit:cnn',
            sourceQuality: 'fail',
          },
        ],
      },
      flowPacks: {
        packs: [],
      },
      qualityReport: {
        apps: [
          {
            slug: 'cnn',
            screenshots: {
              files: [{ file: 'screen-1.jpg' }, { file: 'screen-2.jpg' }],
            },
          },
        ],
      },
      only: null,
    });

    expect(kits).toHaveLength(1);
    expect(kits[0].product.slug).toBe('cnn-figma-kit');
    expect(kits[0].qualityApp?.slug).toBe('cnn');
    expect(kits[0].flow).toBeNull();
  });
});
