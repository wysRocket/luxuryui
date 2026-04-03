# Stitch-To-Figma Commercial Kit Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current spec-only commercial kit generator with a real two-step pipeline that generates transformed screens with Stitch SDK, reconstructs them into Figma-ready delivery packs, and plugs those artifacts into the existing LuxuryUI unlock/download flow.

**Architecture:** Keep the current source-intake and quality gates as the eligibility layer, then add a new commercial generation layer with two phases: `Stitch generation` and `Figma reconstruction/package build`. Treat Stitch output as an intermediate artifact with provenance, QA, and retry metadata; treat the Figma pack as the sellable delivery artifact that the storefront unlock flow serves.

**Tech Stack:** Vite + React + TypeScript, Node ESM scripts, `@google/stitch-sdk`, Vitest, existing JSON-driven commercial catalog files, existing account/unlock/download flow.

---

## File Structure

- Create: `scripts/commercial/lib/stitchClient.mjs`
- Create: `scripts/commercial/lib/stitchPromptBuilder.mjs`
- Create: `scripts/commercial/lib/commercialArtifactPaths.mjs`
- Create: `scripts/commercial/lib/kitPackaging.mjs`
- Create: `scripts/commercial/generate-stitch-kits.mjs`
- Create: `scripts/commercial/rebuild-figma-kits.mjs`
- Create: `scripts/commercial/package-kit-deliveries.mjs`
- Create: `scripts/commercial/__tests__/stitchPromptBuilder.test.ts`
- Create: `scripts/commercial/__tests__/kitPackaging.test.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`
- Modify: `.env.example`
- Modify: `types.ts`
- Modify: `data/figmaKits.ts`
- Modify: `scripts/commercial/generate-figma-kits.mjs`
- Modify: `services/appSessionStore.ts`
- Modify: `pages/KitDeliveryPage.tsx`
- Modify: `README.md`
- Generate at runtime: `data/curation/commercial/generated-kit-runs.json`
- Generate at runtime: `data/curation/commercial/generated-kit-artifacts/<kit-slug>/...`
- Generate at runtime: `data/curation/commercial/delivery-packs/<kit-slug>.json`

## Public Interfaces And Data Model Changes

- Add a `generatedArtifacts` section to each commercial manifest record with:
  - `stitchProjectId`
  - `selectedScreenIds`
  - `stitchHtmlFiles`
  - `stitchPreviewImages`
  - `reconstructionStatus`
  - `deliveryPackPath`
- Add a `delivery` payload extension on `FigmaKitProduct` for:
  - `artifactFormat`
  - `artifactVersion`
  - `downloadFileName`
  - `previewImages`
- Add a new top-level generated artifact index file:
  - `generated-kit-runs.json` with one record per generation run
- Keep `figmaFileKey` nullable; use it only after reconstruction/publish succeeds
- Introduce explicit generation statuses:
  - `pending`
  - `generated`
  - `reconstructed`
  - `packaged`
  - `failed`

## Task 1: Add SDK And Test Infrastructure

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`
- Modify: `.env.example`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Write the failing test setup expectation**

```ts
import { describe, expect, it } from 'vitest';

describe('test environment', () => {
  it('runs commercial pipeline tests in node/jsdom without config errors', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Add dependencies and scripts**

```json
{
  "scripts": {
    "commercial:generate:stitch": "node scripts/commercial/generate-stitch-kits.mjs",
    "commercial:rebuild:figma": "node scripts/commercial/rebuild-figma-kits.mjs",
    "commercial:package": "node scripts/commercial/package-kit-deliveries.mjs",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "@google/stitch-sdk": "^0.0.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@vitest/coverage-v8": "^3.2.4",
    "jsdom": "^26.1.0",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 3: Extend Vite and TypeScript for Vitest**

```ts
/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
```

- [ ] **Step 4: Add non-browser env vars for the scripts**

```env
STITCH_API_KEY=
STITCH_DEFAULT_MODEL=
COMMERCIAL_OUTPUT_ROOT=data/curation/commercial
```

- [ ] **Step 5: Verify**

Run: `npm run test:run`

Expected: Vitest starts successfully and exits with at least one passing placeholder test.

## Task 2: Introduce Artifact Pathing And Pipeline Types

**Files:**
- Create: `scripts/commercial/lib/commercialArtifactPaths.mjs`
- Modify: `types.ts`
- Modify: `data/figmaKits.ts`

- [ ] **Step 1: Write the failing unit test for artifact path generation**

```ts
import { describe, expect, it } from 'vitest';
import { getKitArtifactPaths } from '../lib/commercialArtifactPaths.mjs';

describe('getKitArtifactPaths', () => {
  it('builds stable directories for a kit slug', () => {
    const paths = getKitArtifactPaths('monzo-figma-kit');
    expect(paths.baseDir).toContain('monzo-figma-kit');
    expect(paths.deliveryManifestPath).toContain('delivery-packs');
  });
});
```

- [ ] **Step 2: Add a single source of truth for generated paths**

```js
export const getKitArtifactPaths = (kitSlug, rootDir) => ({
  baseDir: path.join(rootDir, 'generated-kit-artifacts', kitSlug),
  stitchDir: path.join(rootDir, 'generated-kit-artifacts', kitSlug, 'stitch'),
  figmaDir: path.join(rootDir, 'generated-kit-artifacts', kitSlug, 'figma'),
  previewsDir: path.join(rootDir, 'generated-kit-artifacts', kitSlug, 'previews'),
  deliveryManifestPath: path.join(rootDir, 'delivery-packs', `${kitSlug}.json`),
});
```

- [ ] **Step 3: Extend shared types**

```ts
export interface GeneratedKitArtifacts {
  generationStatus: 'pending' | 'generated' | 'reconstructed' | 'packaged' | 'failed';
  stitchProjectId: string | null;
  selectedScreenIds: string[];
  stitchHtmlFiles: string[];
  stitchPreviewImages: string[];
  reconstructionStatus: 'pending' | 'done' | 'failed';
  deliveryPackPath: string | null;
}
```

- [ ] **Step 4: Wire selectors for generated artifacts**

```ts
export const getGeneratedArtifactsForKit = (productId: string) =>
  FIGMA_CONTENT_MANIFESTS.find((manifest) => manifest.productId === productId)?.generatedArtifacts;
```

- [ ] **Step 5: Verify**

Run: `npm run test:run -- scripts/commercial/__tests__/kitPackaging.test.ts`

Expected: path generation tests pass.

## Task 3: Build The Stitch Prompt Builder And Generation Step

**Files:**
- Create: `scripts/commercial/lib/stitchPromptBuilder.mjs`
- Create: `scripts/commercial/lib/stitchClient.mjs`
- Create: `scripts/commercial/generate-stitch-kits.mjs`
- Modify: `scripts/commercial/generate-figma-kits.mjs`

- [ ] **Step 1: Write failing tests for prompt composition**

```ts
import { describe, expect, it } from 'vitest';
import { buildCommercialKitPrompt } from '../lib/stitchPromptBuilder.mjs';

describe('buildCommercialKitPrompt', () => {
  it('injects transformation rules and flow scaffolding', () => {
    const prompt = buildCommercialKitPrompt({
      appName: 'Monzo',
      flowId: 'onboarding',
      screenshots: ['/assets/apps/monzo/screen-1.png'],
      renameRules: ['Replace brand nouns'],
    });

    expect(prompt).toContain('Do not mirror source branding');
    expect(prompt).toContain('onboarding');
    expect(prompt).toContain('Replace brand nouns');
  });
});
```

- [ ] **Step 2: Implement prompt builder with deterministic sections**

```js
export const buildCommercialKitPrompt = ({
  appName,
  flowId,
  screenshots,
  renameRules,
  componentAbstractions,
  colorStyles,
}) => `
Create an original ${flowId} product flow inspired by the attached reference screens for ${appName}.

SOURCE EVIDENCE:
${screenshots.map((item, index) => `${index + 1}. ${item}`).join('\n')}

TRANSFORMATION RULES:
- Do not mirror source branding, icons, copy, or exact layouts.
- Produce original UI suitable for a commercial design kit.
${renameRules.map((rule) => `- ${rule}`).join('\n')}

REQUIRED OUTPUT:
- 1 cover screen
- 6-8 transformed flow screens
- shared component patterns for ${componentAbstractions.join(', ')}
- token direction for ${colorStyles.join(', ')}
`;
```

- [ ] **Step 3: Wrap Stitch SDK in a narrow client**

```js
import { stitch } from '@google/stitch-sdk';

export const generateCommercialScreens = async ({ title, prompt }) => {
  const project = await stitch.createProject(title);
  const screen = await project.generate(prompt);
  const variants = await screen.variants({ variantCount: 3 });
  return { project, screen, variants };
};
```

- [ ] **Step 4: Persist Stitch outputs as intermediate artifacts**

```js
const runRecord = {
  productId: kit.id,
  productSlug: kit.slug,
  generatedAt: new Date().toISOString(),
  generationStatus: 'generated',
  stitchProjectId: project.id,
  selectedScreenIds,
  stitchHtmlFiles,
  stitchPreviewImages,
};
```

- [ ] **Step 5: Gate execution to approved commercial kits only**

Run: `npm run commercial:generate:stitch -- --only=monzo-figma-kit`

Expected: one generated artifact folder exists and `generated-kit-runs.json` gains one `generated` entry.

## Task 4: Reconstruct Stitch Output Into Figma-Ready Kit Sources

**Files:**
- Create: `scripts/commercial/rebuild-figma-kits.mjs`
- Modify: `scripts/commercial/lib/commercialArtifactPaths.mjs`
- Modify: `types.ts`
- Modify: `scripts/commercial/generate-figma-kits.mjs`

- [ ] **Step 1: Write the failing packaging test for reconstruction output**

```ts
import { describe, expect, it } from 'vitest';
import { buildDeliveryManifest } from '../lib/kitPackaging.mjs';

describe('buildDeliveryManifest', () => {
  it('includes stitch artifacts and figma reconstruction files', () => {
    const manifest = buildDeliveryManifest({
      kitSlug: 'monzo-figma-kit',
      figmaSourceFiles: ['figma/pages.json'],
      stitchPreviewImages: ['previews/cover.png'],
    });

    expect(manifest.artifacts.figmaSourceFiles).toHaveLength(1);
    expect(manifest.artifacts.stitchPreviewImages).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Choose a repo-owned reconstruction contract**

```json
{
  "pageOrder": ["Cover", "Flow", "Components", "Tokens", "License"],
  "screens": [{ "name": "Screen 1", "htmlPath": "stitch/screen-1.html" }],
  "components": ["Welcome hero", "Preference picker"],
  "tokens": ["Neutral finance palette", "Data-heavy typography scale"]
}
```

- [ ] **Step 3: Implement reconstruction as a publishable Figma source packet**

```js
const figmaSource = {
  productId: kit.id,
  productSlug: kit.slug,
  figmaFileKey: null,
  pageOrder: ['Cover', 'Flow', 'Components', 'Tokens', 'License'],
  screenBlueprints,
  componentInventory: spec.componentAbstractions,
  tokenInventory: spec.colorStyles,
};
```

- [ ] **Step 4: Define the manual/agentic publish boundary explicitly**

```js
const publishStatus = {
  reconstructionStatus: 'done',
  figmaFileKey: null,
  nextAction: 'publish-via-figma-workflow',
};
```

- [ ] **Step 5: Verify**

Run: `npm run commercial:rebuild:figma -- --only=monzo-figma-kit`

Expected: the kit gets a `figma/` folder with a reconstruction packet and manifest status becomes `reconstructed`.

## Task 5: Build Real Delivery Packs And Replace JSON-Only Downloads

**Files:**
- Create: `scripts/commercial/lib/kitPackaging.mjs`
- Create: `scripts/commercial/package-kit-deliveries.mjs`
- Modify: `services/appSessionStore.ts`
- Modify: `pages/KitDeliveryPage.tsx`

- [ ] **Step 1: Write the failing delivery-pack manifest test**

```ts
import { describe, expect, it } from 'vitest';
import { buildDeliveryManifest } from '../lib/kitPackaging.mjs';

describe('buildDeliveryManifest', () => {
  it('stores the download filename and artifact paths', () => {
    const manifest = buildDeliveryManifest({ kitSlug: 'monzo-figma-kit' });
    expect(manifest.downloadFileName).toBe('monzo-figma-kit-delivery-pack.json');
  });
});
```

- [ ] **Step 2: Package downloadable artifact manifests**

```js
export const buildDeliveryManifest = ({ kitSlug, figmaSourceFiles = [], stitchPreviewImages = [] }) => ({
  artifactVersion: 1,
  kitSlug,
  downloadFileName: `${kitSlug}-delivery-pack.json`,
  artifacts: {
    figmaSourceFiles,
    stitchPreviewImages,
  },
});
```

- [ ] **Step 3: Change app download behavior to serve the real delivery manifest**

```ts
const payload = {
  exportedAt: now(),
  kit,
  spec,
  review,
  manifest,
  generatedArtifacts: manifest?.generatedArtifacts ?? null,
};
```

- [ ] **Step 4: Expose artifact status in the delivery UI**

```tsx
{generatedArtifacts?.deliveryPackPath ? (
  <p className="text-sm text-emerald-600">Delivery pack prepared</p>
) : (
  <p className="text-sm text-amber-600">Delivery pack not generated yet</p>
)}
```

- [ ] **Step 5: Verify**

Run: `npm run commercial:package -- --only=monzo-figma-kit`

Expected: a delivery-pack record exists and the unlocked download returns artifact-aware JSON instead of catalog-only JSON.

## Task 6: Rewire Commercial Catalog Generation Around Artifact Status

**Files:**
- Modify: `scripts/commercial/generate-figma-kits.mjs`
- Modify: `data/figmaKits.ts`
- Modify: `types.ts`
- Modify: `README.md`

- [ ] **Step 1: Update publish rules**

```js
const isApproved =
  sourceQuality === 'pass' &&
  screenshotCount >= 6 &&
  generatedArtifacts?.generationStatus === 'packaged';
```

- [ ] **Step 2: Attach generated artifact metadata to each manifest/product**

```js
products.push({
  ...existingProduct,
  figmaFileKey: generatedArtifacts?.figmaFileKey ?? null,
  delivery: {
    ...existingProduct.delivery,
    artifactFormat: 'figma-source-packet',
    artifactVersion: 1,
    downloadFileName: `${kitSlug}-delivery-pack.json`,
    previewImages: generatedArtifacts?.stitchPreviewImages ?? gallery,
  },
});
```

- [ ] **Step 3: Document the new operator workflow**

```md
1. `npm run commercial:generate:stitch`
2. `npm run commercial:rebuild:figma`
3. Publish/review the Figma reconstruction packet
4. `npm run commercial:package`
5. `npm run commercial:generate`
```

- [ ] **Step 4: Verify**

Run: `npm run commercial:generate && npm run build`

Expected: generated catalog JSON is valid and the app still builds cleanly.

## Test Plan

- Unit test prompt generation for flow-specific rules, rename policies, and source evidence formatting.
- Unit test artifact path creation to prevent delivery-path drift.
- Unit test delivery manifest generation for file naming and artifact lists.
- Smoke test `commercial:generate:stitch` on one published kit and one blocked kit.
- Smoke test `commercial:rebuild:figma` to confirm required pages are emitted.
- Smoke test `commercial:package` and then manual check [KitDeliveryPage.tsx](/Users/wysmyfree/Projects/luxuryui/pages/KitDeliveryPage.tsx) in local mode.
- Regression check `npm run commercial:generate`, `npm run pipeline:health`, and `npm run build`.

## Assumptions And Defaults

- Stitch SDK remains an intermediate-generation tool only; it does not become the final delivery format.
- The first implementation ships a real, repo-owned Figma reconstruction packet plus delivery manifest, with `figmaFileKey` populated only after an explicit publish step succeeds.
- Blocked kits remain blocked even if generation scripts are run manually.
- Delivery downloads remain JSON-backed in v1, but now represent real artifact inventories instead of catalog metadata only.
- Vitest is the preferred testing harness for this repo going forward.
