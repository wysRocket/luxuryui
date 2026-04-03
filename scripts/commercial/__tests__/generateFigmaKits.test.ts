import { describe, expect, it } from 'vitest';
import {
  buildGeneratedArtifactsBridge,
  mergeRecordsByProductId,
  selectGeneratedArtifactsRun,
} from '../generate-figma-kits.mjs';

describe('generate-figma-kits Stitch artifact bridge', () => {
  it('seeds generated artifact metadata from the latest Stitch ledger run when available', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      exportPackageFileName: 'monzo-figma-kit.fig',
      previewCount: 3,
      latestRun: {
        generatedAt: '2026-04-03T01:00:00.000Z',
        generationStatus: 'generated',
        stitchProjectId: 'projects/project-123',
        selectedScreenIds: ['screen-123'],
        stitchHtmlFiles: ['https://example.com/screen.html'],
        stitchPreviewImages: ['https://example.com/screen.png'],
      },
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.generatedAt).toBe('2026-04-03T01:00:00.000Z');
    expect(generatedArtifacts.stage).toBe('generated');
    expect(generatedArtifacts.generationStatus).toBe('generated');
    expect(generatedArtifacts.stitchProjectId).toBe('projects/project-123');
    expect(generatedArtifacts.selectedScreenIds).toEqual(['screen-123']);
    expect(generatedArtifacts.stitchHtmlFiles).toEqual(['https://example.com/screen.html']);
    expect(generatedArtifacts.stitchPreviewImages).toEqual(['https://example.com/screen.png']);
    expect(generatedArtifacts.paths.generatedKitArtifactsDir).toBe('data/curation/commercial/generated-kit-artifacts/monzo-figma-kit');
    expect(generatedArtifacts.commercialReady).toBe(true);
  });

  it('falls back to pending pre-generation metadata when no Stitch ledger run exists', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      exportPackageFileName: 'monzo-figma-kit.fig',
      previewCount: 0,
      latestRun: undefined,
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.generatedAt).toBe('2026-04-03T00:00:00.000Z');
    expect(generatedArtifacts.stage).toBe('pending');
    expect(generatedArtifacts.generationStatus).toBe('pending');
    expect(generatedArtifacts.stitchProjectId).toBe(null);
    expect(generatedArtifacts.selectedScreenIds).toEqual([]);
    expect(generatedArtifacts.stitchHtmlFiles).toEqual([]);
    expect(generatedArtifacts.stitchPreviewImages).toEqual([]);
    expect(generatedArtifacts.commercialReady).toBe(false);
  });

  it('prefers the last successful generated run over a newer failed run', () => {
    const selectedRun = selectGeneratedArtifactsRun([
      {
        runId: 'generated-run',
        generatedAt: '2026-04-03T01:00:00.000Z',
        generationStatus: 'generated',
        stitchProjectId: 'projects/project-123',
        selectedScreenIds: ['screen-good'],
        stitchHtmlFiles: ['https://example.com/good.html'],
        stitchPreviewImages: ['https://example.com/good.png'],
      },
      {
        runId: 'failed-run',
        generatedAt: '2026-04-03T02:00:00.000Z',
        generationStatus: 'failed',
        stitchProjectId: 'projects/project-456',
        selectedScreenIds: [],
        stitchHtmlFiles: [],
        stitchPreviewImages: [],
      },
    ]);

    expect(selectedRun?.runId).toBe('generated-run');

    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      exportPackageFileName: 'monzo-figma-kit.fig',
      previewCount: 3,
      latestRun: selectedRun,
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.generationStatus).toBe('generated');
    expect(generatedArtifacts.stitchProjectId).toBe('projects/project-123');
    expect(generatedArtifacts.selectedScreenIds).toEqual(['screen-good']);
    expect(generatedArtifacts.commercialReady).toBe(true);
  });

  it('merges scoped record updates without dropping untouched catalog entries', () => {
    const merged = mergeRecordsByProductId(
      [
        { id: 'figma-kit:monzo', title: 'Old Monzo' },
        { id: 'figma-kit:revolut', title: 'Revolut' },
      ],
      [{ id: 'figma-kit:monzo', title: 'New Monzo' }]
    );

    expect(merged).toEqual([
      { id: 'figma-kit:monzo', title: 'New Monzo' },
      { id: 'figma-kit:revolut', title: 'Revolut' },
    ]);
  });

  it('marks failed generated artifacts as not commercially ready', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      exportPackageFileName: 'monzo-figma-kit.fig',
      previewCount: 3,
      latestRun: {
        generatedAt: '2026-04-03T02:00:00.000Z',
        generationStatus: 'failed',
        stitchProjectId: null,
        selectedScreenIds: [],
        stitchHtmlFiles: [],
        stitchPreviewImages: [],
      },
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.stage).toBe('failed');
    expect(generatedArtifacts.generationStatus).toBe('failed');
    expect(generatedArtifacts.commercialReady).toBe(false);
  });
});
