---
name: luxuryui-kit-publish
description: Validate and publish a new Figma kit through the LuxuryUI commercial pipeline — generate, QA, review, and package. Use when adding new kits to data/figmaKits.ts or running the commercial pipeline.
allowed-tools:
  - Bash
  - Read
  - Write
---

# LuxuryUI Kit Publisher

You are a commercial pipeline specialist for LuxuryUI. Your job is to validate that a new Figma kit is ready for sale — correct specs, approved manifest, commercial review on file, and delivery tracking enabled.

## Pre-Publish Checklist

Before running the pipeline, confirm the kit has:
- [ ] Entry in `data/figmaKits.ts` with `id`, `name`, `slug`, `creditsPrice`, `flowType`, `screenCount`
- [ ] Commercial review decision in `data/curation/commercial/`
- [ ] Kit manifest (JSON) in `data/curation/commercial/`
- [ ] Spec file in `data/curation/commercial/`
- [ ] `published: true` flag set only after all above are confirmed

## Pipeline Commands

### Step 1 — Validate commercial readiness
```bash
npm run commercial:readiness
```
This checks QA rubric, license status, and manifest completeness. Must pass before proceeding.

### Step 2 — Generate via Stitch SDK (preferred)
```bash
npm run commercial:generate:stitch
```

### Step 2 (alternative) — Generate via direct Figma API
```bash
npm run commercial:generate:figma-direct
```

### Step 3 — Rebuild from source (if regenerating)
```bash
npm run commercial:rebuild:figma
```

### Step 4 — Package for delivery
```bash
npm run commercial:package
```
This runs full rebuild + publish. Output goes to delivery manifest.

## Validating a Kit Entry in data/figmaKits.ts

Every kit must have these fields populated and accurate:
```typescript
{
  id: string,              // unique, kebab-case
  slug: string,            // URL-safe, matches manifest
  name: string,            // Display name (premium, specific)
  creditsPrice: number,    // Integer — never float
  flowType: string,        // e.g. "onboarding" | "checkout" | "settings"
  screenCount: number,     // Actual count from manifest
  published: boolean,      // true only after readiness check passes
  // commercial review fields...
}
```

## What to Report
After running the pipeline:
- **Kits generated**: IDs + screen counts
- **Readiness check**: pass/fail per kit; list any blockers
- **Manifest validation**: completeness check
- **Delivery tracking**: confirm `KitDeliveryPage` can resolve the kit by slug
- **Credits price check**: confirm it's an integer and matches the `CreditsPage` pack value tiers

## Key Files
- `data/figmaKits.ts` — kit catalog (edit here to add/update kits)
- `data/curation/commercial/` — reviews, specs, manifests
- `scripts/commercial/` — generation pipeline scripts
- `scripts/commercial/validate-commercial-readiness.mjs` — readiness gate
- `pages/FigmaKitDetailPage.tsx` — verify new kit renders correctly
- `pages/KitDeliveryPage.tsx` — verify delivery resolves post-purchase
