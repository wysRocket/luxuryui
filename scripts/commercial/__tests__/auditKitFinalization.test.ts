import { describe, expect, it } from 'vitest';
import { buildFinalizationAudit } from '../audit-kit-finalization.mjs';

describe('commercial finalization audit', () => {
  it('creates conservative finalization records and summary counts', () => {
    const result = buildFinalizationAudit({
      products: {
        products: [
          { id: 'figma-kit:monzo', slug: 'monzo-figma-kit', status: 'published' },
          { id: 'figma-kit:revolut', slug: 'revolut-figma-kit', status: 'published' },
        ],
      },
      specs: {
        kitSpecs: [
          { productId: 'figma-kit:monzo', includedFrames: ['Cover page', 'Flow overview', 'Transformed screen 1'], componentAbstractions: ['Button'], colorStyles: ['Palette'] },
          { productId: 'figma-kit:revolut', includedFrames: ['Cover page', 'Transformed screen 1'], componentAbstractions: [], colorStyles: [] },
        ],
      },
      reconstructionsBySlug: new Map([
        ['monzo-figma-kit', { reconstructionStatus: 'done', contentBuiltAt: '2026-04-24T10:00:00.000Z' }],
        ['revolut-figma-kit', { reconstructionStatus: 'done' }],
      ]),
      stitchRunsBySlug: new Map([
        ['monzo-figma-kit', [{ stitchProjectId: 'project-1', stitchMode: 'rapid' }]],
        ['revolut-figma-kit', [{ stitchProjectId: 'project-2', stitchMode: 'experimental' }]],
      ]),
      finalizationsBySlug: new Map([
        ['monzo-figma-kit', {
          exportEvidence: {
            method: 'stitch-export-to-figma',
            exportedAt: '2026-04-24T10:05:00.000Z',
            finalAssetId: 'figma-123',
            finalAssetUrl: 'https://www.figma.com/design/figma-123',
            source: 'stitch',
          },
          deliveryVerification: {
            status: 'pass',
            reason: null,
            verifiedAt: '2026-04-24T10:10:00.000Z',
            fulfillmentType: 'stitch-figma-export',
            handoffUrl: 'https://www.figma.com/design/figma-123',
          },
        }],
      ]),
      now: '2026-04-24T12:00:00.000Z',
    });

    expect(result.summary).toEqual({
      total: 2,
      finalized: 1,
      repairable: 0,
      mustRegenerate: 1,
      blocked: 0,
      integrityViolations: 1,
    });
    expect(result.records[0].finalizationStatus).toBe('finalized');
    expect(result.records[1].blockingReasons).toContain('blocked_non_exportable_stitch_mode');
    expect(result.integrityViolations).toEqual([
      'revolut-figma-kit is published but finalizationStatus is blocked',
    ]);
  });
});
