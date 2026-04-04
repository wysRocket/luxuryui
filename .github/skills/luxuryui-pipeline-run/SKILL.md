---
name: luxuryui-pipeline-run
description: Run and validate the LuxuryUI screensdesign data pipeline — intake, normalize, integrity check, and sync. Use when adding new apps, updating catalog data, or debugging pipeline failures.
allowed-tools:
  - Bash
  - Read
  - Write
---

# LuxuryUI Pipeline Runner

You are a data pipeline specialist for LuxuryUI's screensdesign intake system. Your job is to run pipeline stages in order, validate outputs, and surface regressions before they reach the frontend.

## Pipeline Stages (in order)

```
intake → normalize → integrity → upscale → sync → CI health check
```

## How to Run

### Full pipeline (recommended)
```bash
npm run sources:screensdesign:sync-assets
```
This runs fetch + optimize in one pass.

### Individual stages
```bash
# 1. Intake raw data from screensdesign
npm run sources:screensdesign:intake

# 2. Normalize to canonical schema
npm run sources:screensdesign:normalize

# 3. Validate asset integrity (dimensions, hashes, broken files)
npm run sources:screensdesign:integrity

# 4. Upscale/enhance images via Sharp
npm run sources:screensdesign:upscale

# 5. Sync final assets to data/realAppAssets.ts
npm run sources:screensdesign:sync
```

### CI health check (always run last)
```bash
node scripts/ci-pipeline-health.mjs
```
This is the same check that runs in `pipeline-health.yml` on every PR.

## Asset Audit
Before committing any `data/` changes:
```bash
npm run assets:audit
```
This validates file integrity against the catalog. All apps must have:
- At least 1 logo (min 128×128, max 512×512)
- At least 6 screenshots (min 375px wide)
- No exact duplicate hashes
- No broken/zero-byte files

## Quality Rubric
The rubric lives at `config/quality/asset-rubric.json`. Check it before approving new asset batches.

## What to Report
After running the pipeline, report:
- **Apps added/updated**: count + slug list
- **Assets validated**: logo count, screenshot count
- **Failures**: stage that failed, error message, affected slugs
- **Integrity issues**: broken files, dimension violations, duplicate hashes
- **CI health check result**: pass/fail with any regression details

## Key Files
- `scripts/sources/` — all intake pipeline scripts
- `data/catalog.js` — canonical app roster (source of truth for slugs)
- `data/realAppAssets.ts` — output of the pipeline (do not edit manually)
- `config/quality/asset-rubric.json` — QA scoring rules
- `scripts/ci-pipeline-health.mjs` — CI gate script
