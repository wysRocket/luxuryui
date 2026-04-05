# Image Quality Upscale & Deduplication

**Date:** 2026-04-05  
**Status:** Approved

## Problem

All app screenshots in `public/assets/apps/` average ~27KB — heavily over-compressed JPEGs that look blurry and pixelated at modern display sizes. Additionally, `public/assets/publish-ready/apps/` is a 100% duplicate of 35 apps already in `public/assets/apps/`, adding ~8.4MB of redundant files that get mirrored into `dist/` on every build.

## Goal

Replace low-quality source images with sharp, crisp WebP files at 200–300KB each. Update all URL references. Leave `publish-ready/` untouched for now; deferred to a follow-up decision after the pipeline runs.

## Approach

Local processing using **Sharp** (Node.js). No external API calls. Reproducible batch script. Lanczos3 2× upscale + sharpening filter + WebP encode produces retina-ready images at a fraction of the size that AI upscalers output.

Rejected alternatives:
- **Gemini upscale + re-compress**: Best possible quality, but 650+ API calls is expensive, rate-limited, and slow. Marginal quality gain over Lanczos3 at target size.
- **WebP re-encode only**: Faster, but doesn't add pixel data — won't fix truly blurry sources.

---

## Pipeline: `scripts/upscale-assets.mjs`

**Input:** All `.jpg`, `.jpeg`, `.png` files under `public/assets/apps/`  
**Output:** `.webp` files at the same paths, original files deleted after successful write

### Processing steps per image

1. Read source file
2. Upscale 2× with Lanczos3 resampling (`sharp().resize({ width: w*2, height: h*2, kernel: 'lanczos3' })`)
3. Apply sharpening (`sharpen({ sigma: 0.8 })`) — recovers edge detail lost in compression
4. Encode to WebP at quality 82 (`{ quality: 82, effort: 6 }`)
5. Write `.webp` output to same directory
6. Delete original JPG/PNG on success
7. Log: `original path | original size → new size`

### Idempotency

If a `.webp` already exists at the target path, skip. Safe to re-run.

### Quality gate

If any output WebP exceeds 500KB, flag it in the report and skip deletion of the original. Manual review required before proceeding.

### Manifest

Before processing begins, write `scripts/.upscale-manifest.json`:
```json
[
  { "source": "public/assets/apps/airbnb/screen-1.jpg", "originalSize": 27648, "output": "public/assets/apps/airbnb/screen-1.webp" },
  ...
]
```

This is the audit trail. The manifest is gitignored (local artifact).

---

## Reference Updates: `scripts/update-asset-refs.mjs`

After images are converted, URL references in data files must be updated.

**Targets:** `data/**/*.ts`, `constants.tsx`  
**Transform:** Replace `/assets/apps/**/*.jpg` and `*.png` → `*.webp` (only for paths where a `.webp` was successfully written)

**Usage:**
```bash
node scripts/update-asset-refs.mjs --dry-run   # preview changes
node scripts/update-asset-refs.mjs              # apply
```

---

## Safety & Rollback

- All source images are git-tracked. Rollback: `git checkout public/assets/apps/`
- The manifest documents every file touched
- Quality gate prevents accidental deletion of originals for oversized outputs
- Run `npm run build` after conversion to verify `dist/` is correct

---

## Execution Order

```
1. npm install sharp   (if not already installed)
2. node scripts/upscale-assets.mjs
3. review report / manifest
4. node scripts/update-asset-refs.mjs --dry-run
5. node scripts/update-asset-refs.mjs
6. npm run build
7. verify site visually
8. git commit
```

---

## Out of Scope

- `public/assets/publish-ready/` deduplication — deferred, revisit after pipeline runs
- `dist/assets/` — build artifact, always mirrors `public/`, no action needed
- Existing `images/` directory (generated Stitch thumbnails) — separate concern
