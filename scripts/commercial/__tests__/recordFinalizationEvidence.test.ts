import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildFinalizationEvidenceRecord,
  extractFigmaAssetId,
  parseArgs,
  recordFinalizationEvidence,
} from '../record-finalization-evidence.mjs';

const product = {
  id: 'figma-kit:monzo',
  slug: 'monzo-figma-kit',
};

describe('record finalization evidence', () => {
  it('parses hyphenated CLI args into camelCase keys', () => {
    expect(parseArgs([
      '--kit=monzo-figma-kit',
      '--stitch-project-id',
      'projects/123',
      '--stitch-mode=rapid',
      '--final-asset-url',
      'https://www.figma.com/design/file-123/Monzo',
    ])).toEqual({
      kit: 'monzo-figma-kit',
      stitchProjectId: 'projects/123',
      stitchMode: 'rapid',
      finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
    });
  });

  it('extracts Figma asset ids from design and file URLs', () => {
    expect(extractFigmaAssetId('https://www.figma.com/design/file-123/Monzo')).toBe('file-123');
    expect(extractFigmaAssetId('https://www.figma.com/file/file-456/Monzo')).toBe('file-456');
    expect(extractFigmaAssetId('https://example.com/design/file-123')).toBe(null);
  });

  it('builds a tracked evidence record without forcing publication before audit', () => {
    const record = buildFinalizationEvidenceRecord({
      product,
      stitchProjectId: 'projects/monzo',
      stitchMode: 'Rapid',
      finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
      exportedAt: '2026-04-24T10:05:00.000Z',
    });

    expect(record.finalizationStatus).toBe('content_verified');
    expect(record.auditClassification).toBe('repairable');
    expect(record.exportEligibility).toMatchObject({
      status: 'pass',
      stitchProjectId: 'projects/monzo',
      normalizedStitchMode: 'rapid',
    });
    expect(record.exportEvidence).toMatchObject({
      finalAssetId: 'file-123',
      finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
    });
    expect(record.deliveryVerification).toMatchObject({
      status: 'pass',
      handoffUrl: 'https://www.figma.com/design/file-123/Monzo',
    });
    expect(record.blockingReasons).toEqual(['pending_finalization_audit']);
  });

  it('rejects non-exportable Stitch modes', () => {
    expect(() => buildFinalizationEvidenceRecord({
      product,
      stitchProjectId: 'projects/monzo',
      stitchMode: 'experimental',
      finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
      exportedAt: '2026-04-24T10:05:00.000Z',
    })).toThrow('stitchMode must be one of: rapid, standard');
  });

  it('rejects non-canonical timestamps before writing evidence', () => {
    expect(() => buildFinalizationEvidenceRecord({
      product,
      stitchProjectId: 'projects/monzo',
      stitchMode: 'rapid',
      finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
      exportedAt: '2026-04-24',
    })).toThrow('exportedAt must be a canonical ISO timestamp');
  });

  it('rejects unsupported evidence sources', () => {
    expect(() => buildFinalizationEvidenceRecord({
      product,
      stitchProjectId: 'projects/monzo',
      stitchMode: 'rapid',
      finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
      exportedAt: '2026-04-24T10:05:00.000Z',
      source: 'spreadsheet',
    })).toThrow('source must be one of: stitch, manual-record');
  });

  it('writes finalization evidence to the kit release path', async () => {
    const rootDir = await mkdtemp(path.join(tmpdir(), 'luxuryui-finalization-'));

    try {
      const commercialDir = path.join(rootDir, 'data', 'curation', 'commercial');
      await mkdir(commercialDir, { recursive: true });
      await writeFile(
        path.join(commercialDir, 'figma-kit-products.json'),
        JSON.stringify({ products: [product] }, null, 2),
      );

      const { finalizationPath } = await recordFinalizationEvidence({
        kitSlug: 'monzo-figma-kit',
        stitchProjectId: 'projects/monzo',
        stitchMode: 'standard',
        finalAssetUrl: 'https://www.figma.com/design/file-123/Monzo',
        exportedAt: '2026-04-24T10:05:00.000Z',
        rootDir,
      });
      const written = JSON.parse(await readFile(finalizationPath, 'utf8'));

      expect(finalizationPath).toBe(
        path.join(rootDir, 'data', 'curation', 'commercial', 'generated-kit-artifacts', 'monzo-figma-kit', 'release', 'finalization.json'),
      );
      expect(written.exportEvidence.finalAssetId).toBe('file-123');
      expect(written.exportEligibility.normalizedStitchMode).toBe('standard');
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
