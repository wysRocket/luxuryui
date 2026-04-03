import { describe, expect, it } from 'vitest';
import { buildDeliveryManifest, buildFigmaReconstructionPacket } from '../lib/kitPackaging.mjs';
import { selectBestRun } from '../rebuild-figma-kits.mjs';

describe('buildDeliveryManifest', () => {
  it('stores the download filename and artifact paths', () => {
    const manifest = buildDeliveryManifest({ kitSlug: 'monzo-figma-kit' });
    expect(manifest.downloadFileName).toBe('monzo-figma-kit-delivery-pack.json');
  });

  it('includes stitch artifacts and figma reconstruction files', () => {
    const manifest = buildDeliveryManifest({
      kitSlug: 'monzo-figma-kit',
      figmaSourceFiles: ['figma/pages.json'],
      stitchPreviewImages: ['previews/cover.png'],
    });

    expect(manifest.artifacts.figmaSourceFiles).toHaveLength(1);
    expect(manifest.artifacts.stitchPreviewImages).toHaveLength(1);
  });

  it('returns empty artifact arrays when none provided', () => {
    const manifest = buildDeliveryManifest({ kitSlug: 'monzo-figma-kit' });
    expect(manifest.artifacts.figmaSourceFiles).toEqual([]);
    expect(manifest.artifacts.stitchPreviewImages).toEqual([]);
  });

  it('uses artifactVersion 1', () => {
    const manifest = buildDeliveryManifest({ kitSlug: 'monzo-figma-kit' });
    expect(manifest.artifactVersion).toBe(1);
  });
});

describe('buildFigmaReconstructionPacket', () => {
  it('produces a pending packet when no Stitch run is available', () => {
    const packet = buildFigmaReconstructionPacket({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: null,
      stitchRun: null,
    });

    expect(packet.reconstructionStatus).toBe('pending');
    expect(packet.figmaFileKey).toBeNull();
    expect(packet.nextAction).toBe('publish-via-figma-workflow');
    expect(packet.screenBlueprints).toHaveLength(0);
    expect(packet.pageOrder).toEqual(['Cover', 'Flow', 'Components', 'Tokens', 'License']);
  });

  it('produces a done packet when a Stitch run with screens is available', () => {
    const stitchRun = {
      status: 'success',
      selectedScreenIds: ['scr_1', 'scr_2'],
      screens: [
        { htmlUrl: 'https://stitch.example/1.html', previewUrl: 'https://stitch.example/1.png' },
        { htmlUrl: 'https://stitch.example/2.html', previewUrl: 'https://stitch.example/2.png' },
      ],
    };

    const packet = buildFigmaReconstructionPacket({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec: null,
      stitchRun,
    });

    expect(packet.reconstructionStatus).toBe('done');
    expect(packet.screenBlueprints).toHaveLength(2);
    expect(packet.screenBlueprints[0].screenId).toBe('scr_1');
    expect(packet.screenBlueprints[0].htmlUrl).toBe('https://stitch.example/1.html');
  });

  it('merges spec componentInventory and tokenInventory when provided', () => {
    const spec = {
      componentAbstractions: ['Hero', 'CTA'],
      colorStyles: ['Primary', 'Neutral'],
    };

    const packet = buildFigmaReconstructionPacket({
      productId: 'figma-kit:monzo',
      kitSlug: 'monzo-figma-kit',
      spec,
      stitchRun: null,
    });

    expect(packet.componentInventory).toEqual(['Hero', 'CTA']);
    expect(packet.tokenInventory).toEqual(['Primary', 'Neutral']);
  });
});

describe('selectBestRun', () => {
  it('returns null for empty or missing records', () => {
    expect(selectBestRun([])).toBeNull();
    expect(selectBestRun(null as unknown as [])).toBeNull();
  });

  it('returns null when all runs failed', () => {
    expect(selectBestRun([{ status: 'failed' }, { status: 'blocked_missing_api_key' }])).toBeNull();
  });

  it('returns the last successful run', () => {
    const runs = [
      { status: 'success', runId: 'a' },
      { status: 'failed', runId: 'b' },
      { status: 'success', runId: 'c' },
    ];
    expect(selectBestRun(runs)?.runId).toBe('c');
  });

  it('prefers the last successful run over a newer failed run', () => {
    const runs = [
      { status: 'success', runId: 'good' },
      { status: 'failed', runId: 'bad' },
    ];
    expect(selectBestRun(runs)?.runId).toBe('good');
  });
});
