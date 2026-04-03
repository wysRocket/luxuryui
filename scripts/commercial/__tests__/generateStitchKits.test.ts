import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  appendRunToLedger,
  collectGeneratedScreenArtifacts,
  DEFAULT_DEVICE_TYPE,
  createRunRecord,
  getTargetScreenCount,
  loadExistingLedger,
  writeKitArtifacts,
  writeRunLedger,
} from '../generate-stitch-kits.mjs';

describe('generate-stitch-kits runtime contracts', () => {
  it('persists Stitch URL outputs in metadata instead of pretending local downloads exist', async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), 'stitch-kit-artifacts-'));
    const stitchDir = path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'monzo-figma-kit', 'stitch');
    const metadata = {
      runId: 'run-1',
      kitSlug: 'monzo-figma-kit',
      productId: 'figma-kit:monzo',
      deviceType: DEFAULT_DEVICE_TYPE,
      generationStatus: 'generated',
      stitchProjectId: 'projects/project-123',
      selectedScreenIds: ['screen-123'],
      stitchHtmlFiles: ['https://example.com/screen.html'],
      stitchPreviewImages: ['https://example.com/screen.png'],
      status: 'generated',
    };

    const artifacts = await writeKitArtifacts({
      stitchDir,
      prompt: 'Prompt body',
      metadata,
    });

    expect(DEFAULT_DEVICE_TYPE).toBe('MOBILE');
    expect(artifacts.htmlPath).toBe(null);
    expect(artifacts.imagePath).toBe(null);
    expect(artifacts.metadataPath).toContain('/run.json');

    const persistedMetadata = JSON.parse(await readFile(artifacts.metadataPath, 'utf8'));
    expect(persistedMetadata.generationStatus).toBe('generated');
    expect(persistedMetadata.stitchProjectId).toBe('projects/project-123');
    expect(persistedMetadata.selectedScreenIds).toEqual(['screen-123']);
    expect(persistedMetadata.stitchHtmlFiles).toEqual(['https://example.com/screen.html']);
    expect(persistedMetadata.stitchPreviewImages).toEqual(['https://example.com/screen.png']);
  });

  it('appends run history to an existing ledger instead of replacing it', async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), 'stitch-kit-ledger-'));
    const ledgerPath = path.join(rootDir, 'generated-kit-runs.json');

    await writeFile(
      ledgerPath,
      `${JSON.stringify({
        schema: '1',
        generatedAt: '2026-04-03T00:00:00.000Z',
        summary: { totalRuns: 1, blockedRuns: 1, completedRuns: 0 },
        runs: [{ runId: 'old-run', kitSlug: 'old-kit', status: 'blocked_missing_api_key' }],
      })}\n`
    );

    const existingLedger = await loadExistingLedger(ledgerPath);
    const newRun = createRunRecord({
      rootDir,
      runId: 'new-run',
      kitSlug: 'monzo-figma-kit',
      stitchDir: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'monzo-figma-kit', 'stitch'),
      artifacts: {
        promptPath: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'monzo-figma-kit', 'stitch', 'prompt.txt'),
        metadataPath: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'monzo-figma-kit', 'stitch', 'run.json'),
        htmlPath: null,
        imagePath: null,
      },
      status: 'blocked_missing_api_key',
      metadata: {
        deviceType: DEFAULT_DEVICE_TYPE,
        generationStatus: 'failed',
        stitchProjectId: null,
        selectedScreenIds: [],
        stitchHtmlFiles: [],
        stitchPreviewImages: [],
      },
    });

    await writeRunLedger({
      ledgerPath,
      existingLedger,
      newRecords: [newRun],
    });

    const persistedLedger = JSON.parse(await readFile(ledgerPath, 'utf8'));
    expect(persistedLedger.summary.totalRuns).toBe(2);
    expect(persistedLedger.runs).toHaveLength(2);
    expect(persistedLedger.runs[0].runId).toBe('old-run');
    expect(persistedLedger.runs[1].runId).toBe('new-run');
    expect(persistedLedger.runs[1].generationStatus).toBe('failed');
    expect(persistedLedger.runs[1].stitchProjectId).toBe(null);
    expect(persistedLedger.runs[1].selectedScreenIds).toEqual([]);
    expect(persistedLedger.runs[1].stitchHtmlFiles).toEqual([]);
    expect(persistedLedger.runs[1].stitchPreviewImages).toEqual([]);
  });

  it('collects a base screen plus variants into multi-screen artifact metadata', async () => {
    const baseScreen = {
      id: 'screen-base',
      getHtml: async () => 'https://example.com/base.html',
      getImage: async () => 'https://example.com/base.png',
    };
    const variantCalls = [];
    let nextVariantIndex = 0;

    const collected = await collectGeneratedScreenArtifacts({
      client: {
        getHtml: async (screen) => screen.getHtml(),
        getImage: async (screen) => screen.getImage(),
      },
      project: {
        variants: async (_screen, _prompt, options) => {
          variantCalls.push(options.variantCount);

          return Array.from({ length: options.variantCount }, () => {
            nextVariantIndex += 1;
            return {
              id: `screen-variant-${nextVariantIndex}`,
              getHtml: async () => `https://example.com/variant-${nextVariantIndex}.html`,
              getImage: async () => `https://example.com/variant-${nextVariantIndex}.png`,
            };
          });
        },
      },
      baseScreen,
      targetScreenCount: 8,
    });

    expect(variantCalls).toEqual([5, 2]);
    expect(collected.selectedScreenIds).toHaveLength(8);
    expect(collected.selectedScreenIds[0]).toBe('screen-base');
    expect(collected.stitchHtmlFiles).toHaveLength(8);
    expect(collected.stitchPreviewImages).toHaveLength(8);
  });

  it('fails when Stitch returns fewer screens than the target flow requires', async () => {
    const baseScreen = {
      id: 'screen-base',
      getHtml: async () => 'https://example.com/base.html',
      getImage: async () => 'https://example.com/base.png',
    };

    await expect(
      collectGeneratedScreenArtifacts({
        client: {
          getHtml: async (screen) => screen.getHtml(),
          getImage: async (screen) => screen.getImage(),
        },
        project: {
          variants: async (_screen, _prompt, options) =>
            Array.from({ length: Math.max(0, options.variantCount - 1) }, (_, index) => ({
              id: `screen-variant-${index + 1}`,
              getHtml: async () => `https://example.com/variant-${index + 1}.html`,
              getImage: async () => `https://example.com/variant-${index + 1}.png`,
            })),
        },
        baseScreen,
        targetScreenCount: 8,
      })
    ).rejects.toThrow('Stitch returned incomplete screen artifacts');
  });

  it('durably appends successful and failed run records across iterations', async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), 'stitch-kit-durable-ledger-'));
    const ledgerPath = path.join(rootDir, 'generated-kit-runs.json');
    let ledgerState = await loadExistingLedger(ledgerPath);

    const successRun = createRunRecord({
      rootDir,
      runId: 'success-run',
      kitSlug: 'kit-a',
      stitchDir: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'kit-a', 'stitch'),
      artifacts: {
        promptPath: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'kit-a', 'stitch', 'prompt.txt'),
        metadataPath: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'kit-a', 'stitch', 'run.json'),
        htmlPath: null,
        imagePath: null,
      },
      status: 'generated',
      metadata: {
        generationStatus: 'generated',
        stitchProjectId: 'project-a',
        selectedScreenIds: ['screen-a'],
        stitchHtmlFiles: ['https://example.com/a.html'],
        stitchPreviewImages: ['https://example.com/a.png'],
      },
    });

    ledgerState = await appendRunToLedger({ ledgerPath, ledgerState, runRecord: successRun });

    const failedRun = createRunRecord({
      rootDir,
      runId: 'failed-run',
      kitSlug: 'kit-b',
      stitchDir: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'kit-b', 'stitch'),
      artifacts: {
        promptPath: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'kit-b', 'stitch', 'prompt.txt'),
        metadataPath: path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'kit-b', 'stitch', 'run.json'),
        htmlPath: null,
        imagePath: null,
      },
      status: 'runtime_error',
      metadata: {
        generationStatus: 'failed',
        stitchProjectId: 'project-b',
        selectedScreenIds: [],
        stitchHtmlFiles: [],
        stitchPreviewImages: [],
      },
      errorMessage: 'Generation failed mid-run.',
    });

    ledgerState = await appendRunToLedger({ ledgerPath, ledgerState, runRecord: failedRun });

    const persistedLedger = JSON.parse(await readFile(ledgerPath, 'utf8'));
    expect(ledgerState.runs).toHaveLength(2);
    expect(persistedLedger.runs.map((run) => run.runId)).toEqual(['success-run', 'failed-run']);
    expect(persistedLedger.runs[1].generationStatus).toBe('failed');
    expect(persistedLedger.runs[1].errorMessage).toBe('Generation failed mid-run.');
  });

  it('keeps the generated screen target aligned with valid 6-8 screen kit specs', () => {
    expect(
      getTargetScreenCount([
        'Cover page',
        'Flow overview',
        'Transformed screen 1',
        'Transformed screen 2',
        'Transformed screen 3',
        'Transformed screen 4',
        'Transformed screen 5',
        'Transformed screen 6',
      ])
    ).toBe(6);

    expect(
      getTargetScreenCount([
        'Cover page',
        'Flow overview',
        'Transformed screen 1',
        'Transformed screen 2',
        'Transformed screen 3',
        'Transformed screen 4',
        'Transformed screen 5',
        'Transformed screen 6',
        'Transformed screen 7',
        'Transformed screen 8',
      ])
    ).toBe(8);
  });
});
