# Commercial Kit Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a canonical finalization gate so LuxuryUI only publishes and delivers kits with verified Stitch-to-Figma final assets.

**Architecture:** Keep Stitch runs and reconstruction packets as intermediate artifacts, then add `release/finalization.json` as the commercial source of truth. Catalog generation, readiness checks, CI, and buyer delivery all derive from finalization status instead of trusting product JSON or reconstruction packets directly.

**Tech Stack:** Node ESM scripts, TypeScript shared types, React delivery page, existing JSON catalog files, Vitest.

---

## File Structure

- Create: `scripts/commercial/lib/kitFinalization.mjs`
- Create: `scripts/commercial/audit-kit-finalization.mjs`
- Create: `scripts/commercial/__tests__/kitFinalization.test.ts`
- Create: `scripts/commercial/__tests__/auditKitFinalization.test.ts`
- Create: `scripts/commercial/__tests__/commercialReadiness.test.ts`
- Modify: `package.json`
- Modify: `types.ts`
- Modify: `data/figmaKits.ts`
- Modify: `scripts/commercial/lib/commercialArtifactPaths.mjs`
- Modify: `scripts/commercial/generate-figma-kits.mjs`
- Modify: `scripts/commercial/validate-commercial-readiness.mjs`
- Modify: `scripts/ci-pipeline-health.mjs`
- Modify: `services/appSessionStore.ts`
- Modify: `pages/KitDeliveryPage.tsx`
- Modify: `scripts/commercial/__tests__/generateFigmaKits.test.ts`
- Modify: `src/test/data/figmaKitProductAssets.test.ts`
- Generated at runtime: `data/curation/commercial/generated-kit-artifacts/<kitSlug>/release/finalization.json`
- Generated at runtime: `data/curation/commercial/coverage/commercial-finalization-audit.json`

## Public Interfaces

Finalization statuses:

```ts
export type KitFinalizationStatus =
  | 'blocked'
  | 'audited'
  | 'eligible_for_export'
  | 'exported_from_stitch'
  | 'content_verified'
  | 'delivery_verified'
  | 'finalized';
```

Audit classifications:

```ts
export type KitAuditClassification = 'finalized' | 'repairable' | 'must_regenerate' | 'blocked';
```

Export-capable Stitch modes:

```ts
export type StitchExportMode = 'rapid' | 'standard';
```

Only `finalizationStatus === 'finalized'` and `auditClassification === 'finalized'` can make a kit published.

## Task 1: Add Finalization Paths And Types

**Files:**
- Modify: `scripts/commercial/lib/commercialArtifactPaths.mjs`
- Modify: `types.ts`
- Test: `scripts/commercial/__tests__/kitPackaging.test.ts`

- [ ] **Step 1: Extend the path test**

Add this assertion to the existing `getKitArtifactPaths` test in `scripts/commercial/__tests__/kitPackaging.test.ts`:

```ts
expect(paths.finalizationPath).toBe('/workspace/data/curation/commercial/generated-kit-artifacts/monzo-figma-kit/release/finalization.json');
expect(paths.finalizationAuditPath).toBe('/workspace/data/curation/commercial/coverage/commercial-finalization-audit.json');
```

- [ ] **Step 2: Run the path test and verify it fails**

Run: `npm run test:run -- scripts/commercial/__tests__/kitPackaging.test.ts`

Expected: FAIL because `finalizationPath` and `finalizationAuditPath` are undefined.

- [ ] **Step 3: Add finalization paths**

Update `getKitArtifactPaths` in `scripts/commercial/lib/commercialArtifactPaths.mjs` so the returned object includes:

```js
releaseDir: path.join(generatedKitArtifactsDir, 'release'),
finalizationPath: path.join(generatedKitArtifactsDir, 'release', 'finalization.json'),
finalizationAuditPath: path.join(rootDir, 'data', 'curation', 'commercial', 'coverage', 'commercial-finalization-audit.json'),
```

- [ ] **Step 4: Add shared TypeScript types**

Add these exports to `types.ts` after the existing generated artifact type aliases:

```ts
export type KitFinalizationStatus =
  | "blocked"
  | "audited"
  | "eligible_for_export"
  | "exported_from_stitch"
  | "content_verified"
  | "delivery_verified"
  | "finalized";

export type KitAuditClassification = "finalized" | "repairable" | "must_regenerate" | "blocked";
export type StitchExportMode = "rapid" | "standard";
export type FinalizationCheckStatus = "pass" | "fail";

export interface KitFinalizationCheck {
  status: FinalizationCheckStatus;
  reason: string | null;
  verifiedAt: string | null;
}

export interface KitExportEvidence {
  method: "stitch-export-to-figma";
  exportedAt: string | null;
  finalAssetId: string | null;
  finalAssetUrl: string | null;
  source: "stitch" | "manual-record";
}

export interface KitFinalizationRecord {
  schema: "1";
  kitSlug: string;
  productId: string;
  finalizationStatus: KitFinalizationStatus;
  auditClassification: KitAuditClassification;
  stitchProjectId: string | null;
  stitchMode: StitchExportMode | null;
  exportEligibility: KitFinalizationCheck;
  exportEvidence: KitExportEvidence;
  contentVerification: KitFinalizationCheck & {
    requiredPages: string[];
    expectedScreenCount: number;
    expectedComponentCount: number;
    expectedTokenCount: number;
  };
  deliveryVerification: KitFinalizationCheck & {
    fulfillmentType: "stitch-figma-export" | "none";
    handoffUrl: string | null;
  };
  blockingReasons: string[];
  updatedAt: string;
}
```

- [ ] **Step 5: Run the test**

Run: `npm run test:run -- scripts/commercial/__tests__/kitPackaging.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add types.ts scripts/commercial/lib/commercialArtifactPaths.mjs scripts/commercial/__tests__/kitPackaging.test.ts
git commit -m "feat: add commercial kit finalization paths"
```

## Task 2: Add Finalization Library

**Files:**
- Create: `scripts/commercial/lib/kitFinalization.mjs`
- Create: `scripts/commercial/__tests__/kitFinalization.test.ts`

- [ ] **Step 1: Write failing finalization tests**

Create `scripts/commercial/__tests__/kitFinalization.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run the finalization tests and verify they fail**

Run: `npm run test:run -- scripts/commercial/__tests__/kitFinalization.test.ts`

Expected: FAIL because `kitFinalization.mjs` does not exist.

- [ ] **Step 3: Implement finalization helpers**

Create `scripts/commercial/lib/kitFinalization.mjs`:

```js
export const EXPORT_CAPABLE_STITCH_MODES = ['rapid', 'standard'];

export const normalizeStitchMode = (mode) => {
  if (typeof mode !== 'string') return null;
  const normalized = mode.trim().toLowerCase();
  return EXPORT_CAPABLE_STITCH_MODES.includes(normalized) ? normalized : null;
};

const check = ({ status, reason = null, verifiedAt = null }) => ({ status, reason, verifiedAt });

const buildExportEvidence = (existingFinalization = {}) => ({
  method: 'stitch-export-to-figma',
  exportedAt: existingFinalization?.exportEvidence?.exportedAt ?? null,
  finalAssetId: existingFinalization?.exportEvidence?.finalAssetId ?? null,
  finalAssetUrl: existingFinalization?.exportEvidence?.finalAssetUrl ?? null,
  source: existingFinalization?.exportEvidence?.source ?? 'stitch',
});

const getExpectedScreenCount = (spec) =>
  (spec?.includedFrames ?? []).filter((frame) => /^Transformed screen \d+$/i.test(frame)).length;

const getRequiredPages = (spec) =>
  (spec?.includedFrames ?? []).filter((frame) => /cover page|flow overview|component set|style tokens|usage notes/i.test(frame));

const hasExportEvidence = (evidence) => Boolean(evidence.exportedAt && (evidence.finalAssetId || evidence.finalAssetUrl));

const getDeliveryVerification = (existingFinalization = {}, evidence) => {
  const existing = existingFinalization?.deliveryVerification;
  if (existing?.status === 'pass' && existing.handoffUrl) {
    return {
      status: 'pass',
      reason: null,
      verifiedAt: existing.verifiedAt ?? null,
      fulfillmentType: existing.fulfillmentType ?? 'stitch-figma-export',
      handoffUrl: existing.handoffUrl,
    };
  }

  return {
    status: 'fail',
    reason: 'blocked_delivery_handoff_unverified',
    verifiedAt: null,
    fulfillmentType: 'none',
    handoffUrl: evidence.finalAssetUrl ?? null,
  };
};

export const isFinalizedForSale = (record) =>
  record?.finalizationStatus === 'finalized' &&
  record?.auditClassification === 'finalized' &&
  record?.exportEligibility?.status === 'pass' &&
  record?.contentVerification?.status === 'pass' &&
  record?.deliveryVerification?.status === 'pass';

export const auditFinalizationState = ({
  productId,
  kitSlug,
  spec = null,
  reconstruction = null,
  stitchRun = null,
  existingFinalization = null,
  now = new Date().toISOString(),
}) => {
  const blockingReasons = [];
  const stitchMode = normalizeStitchMode(stitchRun?.stitchMode ?? stitchRun?.metadata?.stitchMode ?? existingFinalization?.stitchMode);
  const rawStitchMode = stitchRun?.stitchMode ?? stitchRun?.metadata?.stitchMode ?? existingFinalization?.stitchMode ?? null;
  const stitchProjectId = stitchRun?.stitchProjectId ?? reconstruction?.stitchProjectId ?? existingFinalization?.stitchProjectId ?? null;

  if (!stitchProjectId) blockingReasons.push('blocked_missing_stitch_project');
  if (!rawStitchMode) blockingReasons.push('blocked_unknown_stitch_mode');
  if (rawStitchMode && !stitchMode) blockingReasons.push('blocked_non_exportable_stitch_mode');

  const exportEvidence = buildExportEvidence(existingFinalization ?? {});
  if (!hasExportEvidence(exportEvidence)) blockingReasons.push('blocked_missing_export_evidence');

  const contentBuilt = Boolean(reconstruction?.contentBuiltAt ?? existingFinalization?.contentVerification?.verifiedAt);
  if (!contentBuilt) blockingReasons.push('blocked_missing_content_verification');

  const deliveryVerification = getDeliveryVerification(existingFinalization ?? {}, exportEvidence);
  if (deliveryVerification.status !== 'pass') blockingReasons.push('blocked_delivery_handoff_unverified');

  const exportEligibilityStatus = stitchProjectId && stitchMode ? 'pass' : 'fail';
  const contentStatus = contentBuilt ? 'pass' : 'fail';
  const exportStatus = hasExportEvidence(exportEvidence) ? 'pass' : 'fail';

  let finalizationStatus = 'blocked';
  if (exportEligibilityStatus === 'pass') finalizationStatus = 'eligible_for_export';
  if (exportEligibilityStatus === 'pass' && exportStatus === 'pass') finalizationStatus = 'exported_from_stitch';
  if (exportEligibilityStatus === 'pass' && exportStatus === 'pass' && contentStatus === 'pass') finalizationStatus = 'content_verified';
  if (exportEligibilityStatus === 'pass' && exportStatus === 'pass' && contentStatus === 'pass' && deliveryVerification.status === 'pass') {
    finalizationStatus = 'finalized';
  }

  let auditClassification = 'blocked';
  if (blockingReasons.includes('blocked_non_exportable_stitch_mode') || blockingReasons.includes('blocked_unknown_stitch_mode')) {
    auditClassification = 'must_regenerate';
  } else if (finalizationStatus === 'finalized') {
    auditClassification = 'finalized';
  } else if (stitchProjectId || reconstruction?.reconstructionStatus === 'done') {
    auditClassification = 'repairable';
  }

  return {
    schema: '1',
    kitSlug,
    productId,
    finalizationStatus,
    auditClassification,
    stitchProjectId,
    stitchMode,
    exportEligibility: check({
      status: exportEligibilityStatus,
      reason: exportEligibilityStatus === 'pass' ? null : blockingReasons.find((reason) => reason.includes('stitch')) ?? 'blocked_missing_stitch_project',
      verifiedAt: exportEligibilityStatus === 'pass' ? now : null,
    }),
    exportEvidence,
    contentVerification: {
      ...check({
        status: contentStatus,
        reason: contentStatus === 'pass' ? null : 'blocked_missing_content_verification',
        verifiedAt: contentBuilt ? reconstruction?.contentBuiltAt ?? existingFinalization?.contentVerification?.verifiedAt ?? now : null,
      }),
      requiredPages: getRequiredPages(spec),
      expectedScreenCount: getExpectedScreenCount(spec),
      expectedComponentCount: spec?.componentAbstractions?.length ?? 0,
      expectedTokenCount: spec?.colorStyles?.length ?? 0,
    },
    deliveryVerification,
    blockingReasons: [...new Set(blockingReasons)],
    updatedAt: now,
  };
};
```

- [ ] **Step 4: Run finalization tests**

Run: `npm run test:run -- scripts/commercial/__tests__/kitFinalization.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/commercial/lib/kitFinalization.mjs scripts/commercial/__tests__/kitFinalization.test.ts
git commit -m "feat: add kit finalization state model"
```

## Task 3: Add Catalog Audit Script

**Files:**
- Create: `scripts/commercial/audit-kit-finalization.mjs`
- Create: `scripts/commercial/__tests__/auditKitFinalization.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing audit tests**

Create `scripts/commercial/__tests__/auditKitFinalization.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the audit test and verify it fails**

Run: `npm run test:run -- scripts/commercial/__tests__/auditKitFinalization.test.ts`

Expected: FAIL because the audit script does not exist.

- [ ] **Step 3: Implement the audit builder and CLI**

Create `scripts/commercial/audit-kit-finalization.mjs` with these exports:

```js
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getKitArtifactPaths } from './lib/commercialArtifactPaths.mjs';
import { auditFinalizationState } from './lib/kitFinalization.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const commercialDir = path.join(projectRoot, 'data', 'curation', 'commercial');

const readJson = async (filePath, fallback = null) => {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

const latestRun = (runs = []) => [...runs].reverse().find((run) => run.generationStatus === 'generated' || run.status === 'generated') ?? runs.at(-1) ?? null;

export const buildFinalizationAudit = ({
  products,
  specs,
  reconstructionsBySlug,
  stitchRunsBySlug,
  finalizationsBySlug,
  now = new Date().toISOString(),
}) => {
  const specByProductId = new Map((specs?.kitSpecs ?? []).map((spec) => [spec.productId, spec]));
  const records = [];
  const integrityViolations = [];

  for (const product of products?.products ?? []) {
    const record = auditFinalizationState({
      productId: product.id,
      kitSlug: product.slug,
      spec: specByProductId.get(product.id) ?? null,
      reconstruction: reconstructionsBySlug.get(product.slug) ?? null,
      stitchRun: latestRun(stitchRunsBySlug.get(product.slug) ?? []),
      existingFinalization: finalizationsBySlug.get(product.slug) ?? null,
      now,
    });
    records.push(record);

    if (product.status === 'published' && record.finalizationStatus !== 'finalized') {
      integrityViolations.push(`${product.slug} is published but finalizationStatus is ${record.finalizationStatus}`);
      record.blockingReasons = [...new Set([...record.blockingReasons, 'blocked_catalog_finalization_mismatch'])];
    }
  }

  const count = (classification) => records.filter((record) => record.auditClassification === classification).length;
  return {
    schema: '1',
    generatedAt: now,
    summary: {
      total: records.length,
      finalized: count('finalized'),
      repairable: count('repairable'),
      mustRegenerate: count('must_regenerate'),
      blocked: count('blocked'),
      integrityViolations: integrityViolations.length,
    },
    integrityViolations,
    records,
  };
};
```

Add a `main` function in the same file that:

```js
const loadMaps = async () => {
  const products = await readJson(path.join(commercialDir, 'figma-kit-products.json'), { products: [] });
  const specs = await readJson(path.join(commercialDir, 'figma-kit-specs.json'), { kitSpecs: [] });
  const ledger = await readJson(path.join(commercialDir, 'generated-kit-runs.json'), { runs: [] });
  const artifactsDir = path.join(commercialDir, 'generated-kit-artifacts');
  const reconstructionsBySlug = new Map();
  const finalizationsBySlug = new Map();

  const kitDirs = existsSync(artifactsDir) ? await readdir(artifactsDir) : [];
  for (const kitSlug of kitDirs) {
    const paths = getKitArtifactPaths(kitSlug, projectRoot);
    const reconstruction = await readJson(path.join(paths.generatedKitArtifactsDir, 'figma', 'reconstruction.json'), null);
    const finalization = await readJson(paths.finalizationPath, null);
    if (reconstruction) reconstructionsBySlug.set(kitSlug, reconstruction);
    if (finalization) finalizationsBySlug.set(kitSlug, finalization);
  }

  const stitchRunsBySlug = new Map();
  for (const run of ledger.runs ?? []) {
    const existing = stitchRunsBySlug.get(run.kitSlug) ?? [];
    existing.push(run);
    stitchRunsBySlug.set(run.kitSlug, existing);
  }

  return { products, specs, reconstructionsBySlug, stitchRunsBySlug, finalizationsBySlug };
};

const main = async () => {
  const inputs = await loadMaps();
  const audit = buildFinalizationAudit(inputs);
  for (const record of audit.records) {
    const paths = getKitArtifactPaths(record.kitSlug, projectRoot);
    await mkdir(paths.releaseDir, { recursive: true });
    await writeFile(paths.finalizationPath, `${JSON.stringify(record, null, 2)}\n`);
  }
  const auditPath = getKitArtifactPaths('catalog', projectRoot).finalizationAuditPath;
  await mkdir(path.dirname(auditPath), { recursive: true });
  await writeFile(auditPath, `${JSON.stringify(audit, null, 2)}\n`);
  console.log(`Finalization audit: ${audit.summary.finalized} finalized, ${audit.summary.repairable} repairable, ${audit.summary.mustRegenerate} must regenerate, ${audit.summary.blocked} blocked`);
  if (audit.summary.integrityViolations > 0) process.exitCode = 1;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
```

- [ ] **Step 4: Add package script**

Add this to `package.json` scripts:

```json
"commercial:audit:finalization": "node scripts/commercial/audit-kit-finalization.mjs"
```

- [ ] **Step 5: Run tests**

Run: `npm run test:run -- scripts/commercial/__tests__/auditKitFinalization.test.ts scripts/commercial/__tests__/kitFinalization.test.ts`

Expected: PASS.

- [ ] **Step 6: Run the audit script**

Run: `npm run commercial:audit:finalization`

Expected: command writes `finalization.json` files and `commercial-finalization-audit.json`. It may exit non-zero because the current catalog has published kits without finalized records; that is expected for the first run.

- [ ] **Step 7: Commit**

```bash
git add package.json scripts/commercial/audit-kit-finalization.mjs scripts/commercial/__tests__/auditKitFinalization.test.ts data/curation/commercial/generated-kit-artifacts data/curation/commercial/coverage
git commit -m "feat: audit commercial kit finalization"
```

## Task 4: Gate Catalog Generation On Finalization

**Files:**
- Modify: `scripts/commercial/generate-figma-kits.mjs`
- Modify: `scripts/commercial/__tests__/generateFigmaKits.test.ts`
- Modify: `data/figmaKits.ts`
- Modify: `types.ts`

- [ ] **Step 1: Add failing publication gate tests**

Append these tests to `scripts/commercial/__tests__/generateFigmaKits.test.ts`:

```ts
import { isFinalizedForSale } from '../lib/kitFinalization.mjs';

it('only treats finalized records as commercial-ready', () => {
  expect(isFinalizedForSale({
    finalizationStatus: 'finalized',
    auditClassification: 'finalized',
    exportEligibility: { status: 'pass' },
    contentVerification: { status: 'pass' },
    deliveryVerification: { status: 'pass' },
  })).toBe(true);

  expect(isFinalizedForSale({
    finalizationStatus: 'content_verified',
    auditClassification: 'repairable',
    exportEligibility: { status: 'pass' },
    contentVerification: { status: 'pass' },
    deliveryVerification: { status: 'fail' },
  })).toBe(false);
});

it('keeps publication blocked when finalization is missing even if reconstruction is packaged', () => {
  const generatedArtifacts = buildGeneratedArtifactsBridge({
    productSlug: 'monzo-figma-kit',
    generatedAt: '2026-04-24T00:00:00.000Z',
    commercialReady: true,
    exportPackageFileName: 'monzo-figma-kit.fig',
    previewCount: 3,
    latestRun: {
      generatedAt: '2026-04-24T01:00:00.000Z',
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
});
```

- [ ] **Step 2: Run the tests and verify the bridge test fails**

Run: `npm run test:run -- scripts/commercial/__tests__/generateFigmaKits.test.ts`

Expected: FAIL because `buildGeneratedArtifactsBridge` does not accept finalization yet and still marks packaged kits commercial-ready.

- [ ] **Step 3: Update the generated artifact bridge**

In `scripts/commercial/generate-figma-kits.mjs`, import:

```js
import { isFinalizedForSale } from './lib/kitFinalization.mjs';
```

Add `finalization = null` to `buildGeneratedArtifactsBridge` arguments and change `commercialReady` derivation to:

```js
const finalizationReady = isFinalizedForSale(finalization);
```

Then set:

```js
commercialReady: commercialReady && isArtifactReady && finalizationReady,
publishReadyForSale: publishReadyForSale && isArtifactReady && finalizationReady,
finalizationStatus: finalization?.finalizationStatus ?? null,
auditClassification: finalization?.auditClassification ?? null,
finalAssetUrl: finalization?.exportEvidence?.finalAssetUrl ?? null,
finalAssetId: finalization?.exportEvidence?.finalAssetId ?? null,
```

- [ ] **Step 4: Load finalization records during catalog generation**

In the `run` function, create `finalizationBySlug` beside `reconstructionBySlug`:

```js
const finalizationBySlug = new Map();
```

Inside the existing `CATALOG_ENTRIES` loop that reads reconstruction packets, also read:

```js
const finalizationPath = path.join(
  projectRoot,
  'data',
  'curation',
  'commercial',
  'generated-kit-artifacts',
  kitSlug,
  'release',
  'finalization.json'
);
try {
  finalizationBySlug.set(kitSlug, JSON.parse(await readFile(finalizationPath, 'utf8')));
} catch {
  finalizationBySlug.set(kitSlug, null);
}
```

In the product loop:

```js
const finalization = finalizationBySlug.get(kitSlug) ?? null;
const finalizationReady = isFinalizedForSale(finalization);
```

Update `isPackaged`:

```js
const isPackaged =
  reconstruction?.reconstructionStatus === 'done' &&
  (hasSuccessfulStitchRun || hasDirectPacket);
const isFinalized = isPackaged && finalizationReady;
```

Pass `isFinalized` to `deriveCommercialPublication`:

```js
const publication = deriveCommercialPublication({
  isPackaged: isFinalized,
  publishQualityStatus,
  publishReadyForSale: finalizationReady ? publishQuality?.publishReadyForSale : false,
  validScreenshotCount: publishValidScreenshotCount,
  minimumCount: minimumScreenshotCount,
});
```

Pass `finalization` into `buildGeneratedArtifactsBridge`.

- [ ] **Step 5: Extend TypeScript generated artifact types**

Add these optional fields to `GeneratedKitArtifacts` in `types.ts`:

```ts
finalizationStatus?: KitFinalizationStatus | null;
auditClassification?: KitAuditClassification | null;
finalAssetId?: string | null;
finalAssetUrl?: string | null;
```

Add the same fields to `normalizeGeneratedArtifacts` in `data/figmaKits.ts`:

```ts
finalizationStatus: manifest.generatedArtifacts?.finalizationStatus ?? null,
auditClassification: manifest.generatedArtifacts?.auditClassification ?? null,
finalAssetId: manifest.generatedArtifacts?.finalAssetId ?? null,
finalAssetUrl: manifest.generatedArtifacts?.finalAssetUrl ?? null,
```

- [ ] **Step 6: Run tests**

Run: `npm run test:run -- scripts/commercial/__tests__/generateFigmaKits.test.ts`

Expected: PASS after updating any old tests that expected packaged reconstruction alone to be commercial-ready. Those tests should now expect `commercialReady: false` without finalized finalization.

- [ ] **Step 7: Regenerate catalog**

Run: `npm run commercial:generate`

Expected: kits without finalized records become blocked. The generated JSON diff should show publication status derived from finalization.

- [ ] **Step 8: Commit**

```bash
git add types.ts data/figmaKits.ts scripts/commercial/generate-figma-kits.mjs scripts/commercial/__tests__/generateFigmaKits.test.ts data/curation/commercial/figma-kit-products.json data/curation/commercial/figma-content-manifests.json data/curation/commercial/commercial-reviews.json data/curation/commercial/figma-kit-specs.json
git commit -m "feat: gate kit catalog on finalization"
```

## Task 5: Harden Commercial Readiness And CI

**Files:**
- Modify: `scripts/commercial/validate-commercial-readiness.mjs`
- Modify: `scripts/ci-pipeline-health.mjs`
- Create: `scripts/commercial/__tests__/commercialReadiness.test.ts`

- [ ] **Step 1: Write failing readiness tests**

Create `scripts/commercial/__tests__/commercialReadiness.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { collectCommercialReadinessFindings } from '../validate-commercial-readiness.mjs';

describe('commercial readiness finalization gate', () => {
  it('fails published kits without finalized finalization evidence', () => {
    const findings = collectCommercialReadinessFindings({
      productsDoc: { products: [{ id: 'figma-kit:monzo', slug: 'monzo-figma-kit', status: 'published', creditCost: 140, thumbnail: '/assets/apps/monzo/screen-1.png', gallery: ['/assets/apps/monzo/screen-1.png'], purchasePath: '/pricing' }] },
      reviewsDoc: { reviews: [{ productId: 'figma-kit:monzo', reviewStatus: 'approved', readyForSale: true, publishQualityStatus: 'pass', publishReadyForSale: true }] },
      specsDoc: { kitSpecs: [{ productId: 'figma-kit:monzo' }] },
      manifestsDoc: { manifests: [{ productId: 'figma-kit:monzo', generatedArtifacts: { commercialReady: true, publishReadyForSale: true, finalizationStatus: 'content_verified' } }] },
      finalizationsBySlug: new Map([['monzo-figma-kit', { finalizationStatus: 'content_verified', auditClassification: 'repairable' }]]),
    });

    expect(findings.map((finding) => finding.message)).toContain('monzo-figma-kit is published without finalized delivery-ready finalization');
  });

  it('passes finalized kits with delivery-ready finalization evidence', () => {
    const findings = collectCommercialReadinessFindings({
      productsDoc: { products: [{ id: 'figma-kit:monzo', slug: 'monzo-figma-kit', status: 'published', creditCost: 140, thumbnail: '/assets/apps/monzo/screen-1.png', gallery: ['/assets/apps/monzo/screen-1.png'], purchasePath: '/pricing', figmaFileKey: 'figma-123' }] },
      reviewsDoc: { reviews: [{ productId: 'figma-kit:monzo', reviewStatus: 'approved', readyForSale: true, publishQualityStatus: 'pass', publishReadyForSale: true }] },
      specsDoc: { kitSpecs: [{ productId: 'figma-kit:monzo' }] },
      manifestsDoc: { manifests: [{ productId: 'figma-kit:monzo', figmaFileKey: 'figma-123', generatedArtifacts: { commercialReady: true, publishReadyForSale: true, finalizationStatus: 'finalized', finalAssetUrl: 'https://www.figma.com/design/figma-123' } }] },
      finalizationsBySlug: new Map([['monzo-figma-kit', {
        finalizationStatus: 'finalized',
        auditClassification: 'finalized',
        exportEligibility: { status: 'pass' },
        contentVerification: { status: 'pass' },
        deliveryVerification: { status: 'pass' },
        exportEvidence: { finalAssetUrl: 'https://www.figma.com/design/figma-123' },
      }]]),
    });

    expect(findings).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the readiness tests and verify they fail**

Run: `npm run test:run -- scripts/commercial/__tests__/commercialReadiness.test.ts`

Expected: FAIL because `collectCommercialReadinessFindings` is not exported.

- [ ] **Step 3: Refactor readiness findings into a pure function**

In `scripts/commercial/validate-commercial-readiness.mjs`, export:

```js
export const collectCommercialReadinessFindings = ({
  productsDoc,
  reviewsDoc,
  specsDoc,
  manifestsDoc,
  finalizationsBySlug = new Map(),
}) => {
  const reviewById = new Map(reviewsDoc.reviews.map((review) => [review.productId, review]));
  const specById = new Map(specsDoc.kitSpecs.map((spec) => [spec.productId, spec]));
  const manifestById = new Map(manifestsDoc.manifests.map((manifest) => [manifest.productId, manifest]));
  const findings = [];

  for (const product of productsDoc.products) {
    const review = reviewById.get(product.id);
    const spec = specById.get(product.id);
    const manifest = manifestById.get(product.id);
    const finalization = finalizationsBySlug.get(product.slug) ?? null;

    if (!review) {
      findings.push({ status: 'FAIL', message: `${product.slug} is missing a commercial review` });
      continue;
    }
    if (!spec) findings.push({ status: 'FAIL', message: `${product.slug} is missing a kit spec` });
    if (!manifest) findings.push({ status: 'FAIL', message: `${product.slug} is missing a content manifest` });

    if (product.status === 'published') {
      if (finalization?.finalizationStatus !== 'finalized' || finalization?.auditClassification !== 'finalized') {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without finalized delivery-ready finalization` });
      }
      if (finalization?.deliveryVerification?.status !== 'pass') {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without verified final asset delivery` });
      }
      if (manifest?.generatedArtifacts?.finalAssetUrl && finalization?.exportEvidence?.finalAssetUrl && manifest.generatedArtifacts.finalAssetUrl !== finalization.exportEvidence.finalAssetUrl) {
        findings.push({ status: 'FAIL', message: `${product.slug} manifest final asset URL disagrees with finalization` });
      }
      if (!manifest?.generatedArtifacts?.finalAssetUrl && !finalization?.exportEvidence?.finalAssetUrl) {
        findings.push({ status: 'FAIL', message: `${product.slug} is published without a final asset URL` });
      }
    }
  }

  return findings;
};
```

Update `checkCommercialReadiness` to load all `release/finalization.json` records into `finalizationsBySlug`, call this pure function, and keep the existing summary shape.

- [ ] **Step 4: Update CI health messaging**

In `scripts/ci-pipeline-health.mjs`, change the commercial success message to:

```js
pass('Published Figma kits have finalized export, content, and delivery evidence');
```

The failures already flow from `checkCommercialReadiness`.

- [ ] **Step 5: Run tests**

Run: `npm run test:run -- scripts/commercial/__tests__/commercialReadiness.test.ts`

Expected: PASS.

- [ ] **Step 6: Run readiness and health checks**

Run: `npm run commercial:readiness`

Expected: FAIL if the current generated catalog still has published kits without finalized records.

Run: `npm run pipeline:health`

Expected: FAIL for the same commercial finalization reasons until the catalog is regenerated/blocking states are aligned.

- [ ] **Step 7: Commit**

```bash
git add scripts/commercial/validate-commercial-readiness.mjs scripts/ci-pipeline-health.mjs scripts/commercial/__tests__/commercialReadiness.test.ts
git commit -m "feat: enforce finalization in commercial readiness"
```

## Task 6: Change Delivery To Use Final Assets

**Files:**
- Modify: `services/appSessionStore.ts`
- Modify: `pages/KitDeliveryPage.tsx`
- Modify: `types.ts`
- Test: existing frontend/service tests if present

- [ ] **Step 1: Add delivery return type**

In `types.ts`, add:

```ts
export interface KitDeliveryAsset {
  kind: "figma-final-asset";
  url: string;
  assetId: string | null;
  metadataUrl: string | null;
  fileName: string;
}
```

- [ ] **Step 2: Update `createDeliveryDownload` to require final asset evidence**

Replace the current blob-only return in `services/appSessionStore.ts` with:

```ts
const finalAssetUrl = manifest?.generatedArtifacts.finalAssetUrl ?? null;
const finalAssetId = manifest?.generatedArtifacts.finalAssetId ?? kit?.figmaFileKey ?? null;
const isFinalized = manifest?.generatedArtifacts.finalizationStatus === 'finalized';

if (!kit || !manifest || !isFinalized || !finalAssetUrl) {
  throw new Error('This kit is not finalized for delivery yet.');
}

const supportPayload = {
  exportedAt: now(),
  unlockedBy: {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    provider: user.provider,
  },
  unlock,
  kit,
  spec,
  review,
  manifest,
};

const blob = new Blob([JSON.stringify(supportPayload, null, 2)], { type: 'application/json' });
const metadataUrl = URL.createObjectURL(blob);

return {
  url: finalAssetUrl,
  fileName: kit.delivery.downloadFileName ?? `${kit.slug}.figma-url`,
  assetId: finalAssetId,
  metadataUrl,
};
```

Update the function signature to return `{ url: string; fileName: string; assetId: string | null; metadataUrl: string | null }`.

- [ ] **Step 3: Update delivery page action**

In `pages/KitDeliveryPage.tsx`, change button copy from `Download delivery pack` to:

```tsx
Open final Figma asset
```

Change `handleDownload` to open the final asset in a new tab:

```tsx
const { url, metadataUrl } = createDownload(kit.id);
window.open(url, '_blank', 'noopener,noreferrer');

if (metadataUrl) {
  window.setTimeout(() => URL.revokeObjectURL(metadataUrl), 0);
}
```

Update the intro copy to:

```tsx
Your kit is unlocked. Open the final Figma asset and keep the delivery blueprint here for provenance and support.
```

- [ ] **Step 4: Show blocked delivery state**

Before the primary button, compute:

```tsx
const finalAssetUrl = manifest?.generatedArtifacts.finalAssetUrl ?? null;
const isFinalized = manifest?.generatedArtifacts.finalizationStatus === 'finalized';
```

Render a disabled state when not finalized:

```tsx
{!isFinalized || !finalAssetUrl ? (
  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
    Final asset delivery is not available for this kit yet.
  </div>
) : (
  <button type="button" onClick={handleDownload} className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black">
    <Download size={16} />
    Open final Figma asset
  </button>
)}
```

- [ ] **Step 5: Run typecheck/build**

Run: `npm run build`

Expected: PASS after TypeScript and Vite compile the delivery changes.

- [ ] **Step 6: Commit**

```bash
git add types.ts services/appSessionStore.ts pages/KitDeliveryPage.tsx
git commit -m "feat: deliver finalized figma assets"
```

## Task 7: Regenerate, Verify, And Document Current Catalog State

**Files:**
- Modify: generated commercial JSON under `data/curation/commercial/`
- Modify: `README.md`
- Modify: `src/test/data/figmaKitProductAssets.test.ts`

- [ ] **Step 1: Run finalization audit**

Run: `npm run commercial:audit:finalization`

Expected: writes finalization records and exits non-zero if integrity violations remain.

- [ ] **Step 2: Regenerate catalog from finalization truth**

Run: `npm run commercial:generate`

Expected: only finalized kits remain published; unfinished kits become blocked.

- [ ] **Step 3: Update product asset integrity test**

In `src/test/data/figmaKitProductAssets.test.ts`, add an assertion that published products include final asset metadata:

```ts
import manifestsData from '@/data/curation/commercial/figma-content-manifests.json';

const manifestById = new Map(manifestsData.manifests.map((manifest) => [manifest.productId, manifest]));

const missingFinalAssets = productsData.products
  .filter((product) => product.status === 'published')
  .filter((product) => {
    const manifest = manifestById.get(product.id);
    return manifest?.generatedArtifacts?.finalizationStatus !== 'finalized' || !manifest?.generatedArtifacts?.finalAssetUrl;
  })
  .map((product) => product.slug);

expect(missingFinalAssets).toEqual([]);
```

- [ ] **Step 4: Update README pipeline commands**

In the Commercial Kit Pipeline section of `README.md`, add:

```md
Audit final Figma asset readiness:

`npm run commercial:audit:finalization`

Only kits with finalized Stitch export, content verification, and delivery verification can be published by `npm run commercial:generate`.
```

- [ ] **Step 5: Run verification**

Run: `npm run test:run -- scripts/commercial/__tests__/kitFinalization.test.ts scripts/commercial/__tests__/auditKitFinalization.test.ts scripts/commercial/__tests__/generateFigmaKits.test.ts scripts/commercial/__tests__/commercialReadiness.test.ts src/test/data/figmaKitProductAssets.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

Run: `npm run pipeline:health`

Expected: PASS only when generated catalog and finalization records agree. If it fails because no kits are finalized yet, the correct next step is to record Stitch export evidence or regenerate kits in export-capable Stitch mode, not to loosen the gate.

- [ ] **Step 6: Commit**

```bash
git add README.md src/test/data/figmaKitProductAssets.test.ts data/curation/commercial
git commit -m "chore: regenerate catalog from finalization audit"
```

## Execution Notes

- Treat generated JSON diffs carefully. If the first audit blocks most or all kits, that is a valid result of the stricter gate.
- Do not manually edit `figma-kit-products.json` to force publication.
- Do not use `publish-to-figma.mjs` as proof of finalization unless it writes the new finalization evidence.
- For existing kits, use `repairable` only when there is enough evidence to complete export, content, and delivery verification without regeneration.
- For Stitch projects created in non-exportable modes, keep the result as `must_regenerate`.

## Self-Review Checklist

- Spec coverage: finalization record, audit classifications, state machine, publication gate, delivery contract, readiness checks, migration, and success criteria are each mapped to tasks.
- Red-flag scan: no task uses unresolved marker text or an unspecified implementation step.
- Type consistency: `finalizationStatus`, `auditClassification`, `finalAssetId`, and `finalAssetUrl` are introduced before later tasks consume them.
