import { describe, expect, it } from 'vitest';
import {
  EXPORT_CAPABLE_STITCH_MODES,
  auditFinalizationState,
  isFinalizedForSale,
  normalizeStitchMode,
} from '../lib/kitFinalization.mjs';

describe('kit finalization', () => {
  it('recognizes export-capable Stitch modes', () => {
    expect(EXPORT_CAPABLE_STITCH_MODES).toEqual(['rapid', 'standard']);
    expect(normalizeStitchMode('Rapid')).toBe('rapid');
    expect(normalizeStitchMode('STANDARD')).toBe('standard');
    expect(normalizeStitchMode('experimental')).toBe(null);
  });

  it('blocks kits when Stitch mode cannot be proven export-capable', () => {
    const result = auditFinalizationState({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: { includedFrames: ['Cover page', 'Transformed screen 1'], componentAbstractions: ['Button'], colorStyles: ['Palette'] },
      reconstruction: { reconstructionStatus: 'done', contentBuiltAt: '2026-04-24T10:00:00.000Z' },
      stitchRun: { stitchProjectId: 'project-1', stitchMode: 'experimental' },
      existingFinalization: null,
      now: '2026-04-24T12:00:00.000Z',
    });

    expect(result.auditClassification).toBe('must_regenerate');
    expect(result.finalizationStatus).toBe('blocked');
    expect(result.blockingReasons).toContain('blocked_non_exportable_stitch_mode');
  });

  it('classifies exported content without delivery verification as repairable', () => {
    const result = auditFinalizationState({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: { includedFrames: ['Cover page', 'Flow overview', 'Transformed screen 1'], componentAbstractions: ['Button'], colorStyles: ['Palette'] },
      reconstruction: { reconstructionStatus: 'done', contentBuiltAt: '2026-04-24T10:00:00.000Z' },
      stitchRun: { stitchProjectId: 'project-1', stitchMode: 'rapid' },
      existingFinalization: {
        exportEvidence: {
          method: 'stitch-export-to-figma',
          exportedAt: '2026-04-24T10:05:00.000Z',
          finalAssetId: 'figma-123',
          finalAssetUrl: 'https://www.figma.com/design/figma-123',
          source: 'stitch',
        },
      },
      now: '2026-04-24T12:00:00.000Z',
    });

    expect(result.auditClassification).toBe('repairable');
    expect(result.finalizationStatus).toBe('content_verified');
    expect(result.blockingReasons).toContain('blocked_delivery_handoff_unverified');
  });

  it('accepts finalized kits only when export, content, and delivery pass', () => {
    const result = auditFinalizationState({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: { includedFrames: ['Cover page', 'Flow overview', 'Transformed screen 1'], componentAbstractions: ['Button'], colorStyles: ['Palette'] },
      reconstruction: { reconstructionStatus: 'done', contentBuiltAt: '2026-04-24T10:00:00.000Z' },
      stitchRun: { stitchProjectId: 'project-1', stitchMode: 'rapid' },
      existingFinalization: {
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
      },
      now: '2026-04-24T12:00:00.000Z',
    });

    expect(result.auditClassification).toBe('finalized');
    expect(result.finalizationStatus).toBe('finalized');
    expect(isFinalizedForSale(result)).toBe(true);
  });

  it('blocks finalized status when export or delivery evidence is malformed', () => {
    const result = auditFinalizationState({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: { includedFrames: ['Cover page'], componentAbstractions: ['Button'], colorStyles: ['Palette'] },
      reconstruction: { reconstructionStatus: 'done', contentBuiltAt: '2026-04-24T10:00:00.000Z' },
      stitchRun: { stitchProjectId: 'project-1', stitchMode: 'standard' },
      existingFinalization: {
        exportEvidence: {
          method: 'stitch-export-to-figma',
          exportedAt: 'soon',
          finalAssetId: 'figma-123',
          finalAssetUrl: 'not-a-url',
          source: 'stitch',
        },
        deliveryVerification: {
          status: 'pass',
          reason: null,
          verifiedAt: '2026-04-24T10:10:00.000Z',
          fulfillmentType: 'stitch-figma-export',
          handoffUrl: 'not-a-url',
        },
      },
      now: '2026-04-24T12:00:00.000Z',
    });

    expect(result.finalizationStatus).toBe('blocked');
    expect(result.auditClassification).toBe('repairable');
    expect(result.blockingReasons).toContain('blocked_export_evidence_incomplete');
    expect(result.blockingReasons).toContain('blocked_delivery_handoff_unverified');
    expect(isFinalizedForSale(result)).toBe(false);
  });

  it('does not count whitespace-only content as verified content', () => {
    const result = auditFinalizationState({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: { includedFrames: ['   '], componentAbstractions: ['\t'], colorStyles: ['\n'] },
      reconstruction: { reconstructionStatus: 'done', contentBuiltAt: '2026-04-24T10:00:00.000Z' },
      stitchRun: { stitchProjectId: 'project-1', stitchMode: 'rapid' },
      existingFinalization: {
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
      },
      now: '2026-04-24T12:00:00.000Z',
    });

    expect(result.auditClassification).toBe('must_regenerate');
    expect(result.finalizationStatus).toBe('blocked');
    expect(result.contentVerification.status).toBe('blocked');
    expect(result.contentVerification.includedFrameCount).toBe(0);
    expect(result.contentVerification.componentAbstractionCount).toBe(0);
    expect(result.contentVerification.colorStyleCount).toBe(0);
    expect(result.blockingReasons).toContain('blocked_missing_required_content');
    expect(isFinalizedForSale(result)).toBe(false);
  });
});
