import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildGeneratedArtifactsBridge,
  deriveCommercialPublication,
  isFinalizationRecordForKit,
  mergeRecordsByProductId,
  readFinalizationIfExists,
  selectGeneratedArtifactsRun,
} from '../generate-figma-kits.mjs';
import { isFinalizedForSale } from '../lib/kitFinalization.mjs';

const buildFinalizedRecord = ({
  kitSlug = 'monzo-figma-kit',
  productId = 'figma-kit:monzo',
} = {}) => ({
  kitSlug,
  productId,
  finalizationStatus: 'finalized',
  auditClassification: 'finalized',
  exportEligibility: { status: 'pass' },
  contentVerification: { status: 'pass' },
  exportVerification: { status: 'pass' },
  deliveryVerification: { status: 'pass' },
  exportEvidence: {
    finalAssetId: 'figma-file-123',
    finalAssetUrl: 'https://www.figma.com/file/figma-file-123/Monzo',
  },
});

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
    // Stitch run alone is not sufficient — reconstruction must also be done for commercialReady.
    expect(generatedArtifacts.commercialReady).toBe(false);
  });

  it('marks a kit as packaged but not commercially ready when finalization is missing', () => {
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
      reconstruction: { reconstructionStatus: 'done' },
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.generationStatus).toBe('packaged');
    expect(generatedArtifacts.stage).toBe('packaged');
    expect(generatedArtifacts.commercialReady).toBe(false);
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

  it('marks a direct reconstruction packet as packaged without making it commercially ready', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      exportPackageFileName: 'monzo-figma-kit.fig',
      previewCount: 3,
      latestRun: undefined,
      reconstruction: {
        reconstructionStatus: 'done',
        generationSource: 'direct',
        sourceAppSlug: 'monzo',
        sourceFlowId: 'onboarding',
        screenBlueprints: [
          { sourceAssetPath: '/assets/apps/monzo/screen-1.png' },
          { sourceAssetPath: '/assets/apps/monzo/screen-2.png' },
        ],
      },
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.stage).toBe('packaged');
    expect(generatedArtifacts.generationStatus).toBe('packaged');
    expect(generatedArtifacts.generationSource).toBe('direct');
    expect(generatedArtifacts.sourceAppSlug).toBe('monzo');
    expect(generatedArtifacts.sourceFlowId).toBe('onboarding');
    expect(generatedArtifacts.sourceAssetPaths).toEqual([
      '/assets/apps/monzo/screen-1.png',
      '/assets/apps/monzo/screen-2.png',
    ]);
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
    // Without a done reconstruction packet, commercialReady stays false even on a good run.
    expect(generatedArtifacts.commercialReady).toBe(false);
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

  it('publishes packaged kits when publish-quality passes even if raw source quality is warn', () => {
    expect(
      deriveCommercialPublication({
        isPackaged: true,
        publishQualityStatus: 'pass',
        validScreenshotCount: 6,
      }),
    ).toEqual({
      status: 'published',
      reviewStatus: 'approved',
      publishReadyForSale: true,
      completenessStatus: 'pass',
    });
  });

  it('keeps sparse kits blocked when publish-quality still fails screenshot count', () => {
    expect(
      deriveCommercialPublication({
        isPackaged: true,
        publishQualityStatus: 'fail',
        validScreenshotCount: 5,
      }),
    ).toEqual({
      status: 'blocked',
      reviewStatus: 'blocked',
      publishReadyForSale: false,
      completenessStatus: 'fail',
    });
  });

  it('publishes warn-status kits when the publish audit marks them sale-ready', () => {
    expect(
      deriveCommercialPublication({
        isPackaged: true,
        publishQualityStatus: 'warn',
        publishReadyForSale: true,
        validScreenshotCount: 6,
      }),
    ).toEqual({
      status: 'published',
      reviewStatus: 'approved',
      publishReadyForSale: true,
      completenessStatus: 'pass',
    });
  });

  it('requires finalized/pass checks before a finalization record is sale-ready', () => {
    const finalized = buildFinalizedRecord();

    expect(isFinalizedForSale(finalized)).toBe(true);
    expect(isFinalizedForSale({ ...finalized, finalizationStatus: 'content_verified' })).toBe(false);
    expect(isFinalizedForSale({ ...finalized, auditClassification: 'repairable' })).toBe(false);
    expect(
      isFinalizedForSale({
        ...finalized,
        deliveryVerification: { status: 'fail' },
      }),
    ).toBe(false);
  });

  it('requires finalization identity to match the current catalog item', () => {
    const finalized = buildFinalizedRecord();

    expect(
      isFinalizationRecordForKit(finalized, {
        kitSlug: 'monzo-figma-kit',
        productId: 'figma-kit:monzo',
      }),
    ).toBe(true);
    expect(
      isFinalizationRecordForKit(finalized, {
        kitSlug: 'revolut-figma-kit',
        productId: 'figma-kit:monzo',
      }),
    ).toBe(false);
    expect(
      isFinalizationRecordForKit(finalized, {
        kitSlug: 'monzo-figma-kit',
        productId: 'figma-kit:revolut',
      }),
    ).toBe(false);
  });

  it('keeps packaged generated artifacts blocked when finalization is missing', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      publishReadyForSale: true,
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
      reconstruction: { reconstructionStatus: 'done' },
      finalization: null,
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.generationStatus).toBe('packaged');
    expect(generatedArtifacts.commercialReady).toBe(false);
    expect(generatedArtifacts.publishReadyForSale).toBe(false);
  });

  it('marks packaged generated artifacts commercially ready when finalization passes', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      productId: 'figma-kit:monzo',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      publishReadyForSale: true,
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
      reconstruction: { reconstructionStatus: 'done' },
      finalization: buildFinalizedRecord(),
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.commercialReady).toBe(true);
    expect(generatedArtifacts.publishReadyForSale).toBe(true);
    expect(generatedArtifacts.finalizationStatus).toBe('finalized');
    expect(generatedArtifacts.auditClassification).toBe('finalized');
    expect(generatedArtifacts.finalAssetId).toBe('figma-file-123');
    expect(generatedArtifacts.finalAssetUrl).toBe('https://www.figma.com/file/figma-file-123/Monzo');
  });

  it('ignores finalized records copied into the wrong kit folder', () => {
    const generatedArtifacts = buildGeneratedArtifactsBridge({
      productSlug: 'monzo-figma-kit',
      productId: 'figma-kit:monzo',
      generatedAt: '2026-04-03T00:00:00.000Z',
      commercialReady: true,
      publishReadyForSale: true,
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
      reconstruction: { reconstructionStatus: 'done' },
      finalization: buildFinalizedRecord({
        kitSlug: 'revolut-figma-kit',
        productId: 'figma-kit:revolut',
      }),
      rootDir: '/workspace',
    });

    expect(generatedArtifacts.generationStatus).toBe('packaged');
    expect(generatedArtifacts.commercialReady).toBe(false);
    expect(generatedArtifacts.publishReadyForSale).toBe(false);
    expect(generatedArtifacts.finalizationStatus).toBe(null);
    expect(generatedArtifacts.finalAssetId).toBe(null);
  });

  it('returns null for missing finalization files and throws on malformed finalization JSON', async () => {
    const missingPath = path.join(tmpdir(), `missing-finalization-${Date.now()}.json`);
    await expect(readFinalizationIfExists(missingPath)).resolves.toBe(null);

    const tempDir = await mkdtemp(path.join(tmpdir(), 'luxuryui-finalization-'));
    const malformedPath = path.join(tempDir, 'finalization.json');

    try {
      await writeFile(malformedPath, '{ not-json', 'utf8');
      await expect(readFinalizationIfExists(malformedPath)).rejects.toThrow(
        `Malformed finalization JSON at ${malformedPath}`,
      );
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
