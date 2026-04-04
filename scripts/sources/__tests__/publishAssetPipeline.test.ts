import { describe, expect, it } from 'vitest';
import {
  buildRescueCandidates,
  calculateUpscaleDimensions,
  selectPublishScreenshotPaths,
} from '../lib/publishAssetPipeline.mjs';

describe('publishAssetPipeline', () => {
  it('calculates the minimum upscale needed to satisfy the screenshot rubric', () => {
    expect(
      calculateUpscaleDimensions({
        width: 288,
        height: 512,
        minWidth: 320,
        minHeight: 480,
      }),
    ).toEqual({
      width: 320,
      height: 569,
    });

    expect(
      calculateUpscaleDimensions({
        width: 392,
        height: 696,
        minWidth: 320,
        minHeight: 480,
      }),
    ).toBeNull();
  });

  it('prefers publish-ready overrides and rescue screenshots over raw screenshot paths', () => {
    const selectedPaths = selectPublishScreenshotPaths({
      slug: 'monzo',
      rawScreenshotFiles: ['screen-1.png', 'screen-2.png'],
      publishDirFiles: ['screen-1.png', 'rescue-screen-3.png'],
    });

    expect(selectedPaths).toEqual([
      '/assets/publish-ready/apps/monzo/screen-1.png',
      '/assets/apps/monzo/screen-2.png',
      '/assets/publish-ready/apps/monzo/rescue-screen-3.png',
    ]);
  });

  it('builds rescue candidates only for sparse publish-fail apps', () => {
    const candidates = buildRescueCandidates({
      publishApps: [
        {
          slug: 'cnn',
          status: 'fail',
          screenshots: {
            validCount: 5,
          },
          issues: ['insufficient screenshots: 5 < 6 required'],
        },
        {
          slug: 'monzo',
          status: 'pass',
          screenshots: {
            validCount: 8,
          },
          issues: [],
        },
      ],
      requiredCount: 6,
    });

    expect(candidates).toEqual([
      {
        slug: 'cnn',
        currentValidCount: 5,
        missingScreenshots: 1,
      },
    ]);
  });
});
