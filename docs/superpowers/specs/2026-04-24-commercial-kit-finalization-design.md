# Commercial Kit Finalization Design

## Goal

LuxuryUI should only sell kits that have a verified final Figma asset, not just a generated blueprint or storefront metadata. A kit is finished only when it comes from a Stitch project mode that supports Figma export, the export has happened, the exported file has built content, and the user-facing delivery flow can hand over the final asset.

## Current Problem

The commercial kit pipeline has multiple competing sources of truth:

- `figma-kit-products.json` can say a kit is published and include a `figmaFileKey`.
- `figma-content-manifests.json` can still have a null `figmaFileKey`.
- `generated-kit-artifacts/<kit>/figma/reconstruction.json` tracks reconstruction and content build metadata separately.
- The delivery page downloads a JSON metadata pack instead of handing over the real final Figma asset.
- The pipeline health check can pass while those states disagree.

This lets a kit look sellable before the buyer can actually receive a verified final asset.

## Decision

Add a canonical finalization stage and make it the only publication gate. Existing Stitch runs and reconstruction packets stay as intermediate artifacts, but they no longer certify commercial readiness by themselves.

The canonical record lives at:

```text
data/curation/commercial/generated-kit-artifacts/<kitSlug>/release/finalization.json
```

`finalization.json` becomes the source of truth for whether a kit can be published, unlocked, and delivered.

## Finalization Record

Each record must include:

- `kitSlug`: the commercial kit slug.
- `productId`: the catalog product id.
- `finalizationStatus`: one of `blocked`, `audited`, `eligible_for_export`, `exported_from_stitch`, `content_verified`, `delivery_verified`, or `finalized`.
- `auditClassification`: one of `finalized`, `repairable`, `must_regenerate`, or `blocked`.
- `stitchProjectId`: the Stitch project id used for the final asset.
- `stitchMode`: the Stitch mode used to generate the project.
- `exportEligibility`: pass or fail with a reason.
- `exportEvidence`: export method, exported-at timestamp, final Figma asset identifier or URL, and source evidence.
- `contentVerification`: required pages, expected screen count, component count, token count, verification timestamp, and pass or fail result.
- `deliveryVerification`: delivery URL or handoff reference, fulfillment type, verification timestamp, and pass or fail result.
- `blockingReasons`: machine-readable reason codes for anything preventing publication.
- `updatedAt`: timestamp for the latest finalization update.

The important rule is conservative: if export-capable Stitch origin cannot be proven, the kit cannot be published.

## Audit Classifications

The audit step walks every commercial kit and writes or updates `finalization.json`.

`finalized` means all finalization checks pass and the buyer can receive the final Figma asset.

`repairable` means intermediate artifacts exist and the kit may be completed without regenerating from scratch.

`must_regenerate` means the existing Stitch project was created in a mode that does not support Figma export, or the export path cannot be proven.

`blocked` means required source artifacts, reconstruction packets, quality approvals, or delivery metadata are missing.

Common blocking reason codes:

- `blocked_non_exportable_stitch_mode`
- `blocked_unknown_stitch_mode`
- `blocked_missing_stitch_project`
- `blocked_missing_export_evidence`
- `blocked_missing_required_pages`
- `blocked_missing_content_verification`
- `blocked_delivery_handoff_unverified`
- `blocked_catalog_finalization_mismatch`

## State Machine

Finalization moves forward through these states:

1. `audited`
2. `eligible_for_export`
3. `exported_from_stitch`
4. `content_verified`
5. `delivery_verified`
6. `finalized`

Failures do not silently fall back to published metadata. A failed kit remains blocked with clear reason codes until the missing step is completed or the kit is regenerated from an export-capable Stitch mode.

## Catalog Publication Gate

`scripts/commercial/generate-figma-kits.mjs` must derive product publication from finalization truth.

A product may be `published` only when:

- `finalizationStatus === "finalized"`
- `auditClassification === "finalized"`
- export eligibility passed
- content verification passed
- delivery verification passed
- publish-quality checks still pass

`figma-kit-products.json` and `figma-content-manifests.json` become derived catalog views. They must not be treated as the authority for final readiness.

The current `publish-to-figma.mjs` flow must stop acting as publication authority. It can remain as a migration or repair helper for old kits if useful, but final publication must be based on `finalization.json`.

## Delivery Contract

The current delivery flow creates a downloadable JSON blob with kit metadata. Under the stricter bar, that JSON is support metadata, not the product deliverable.

Primary delivery artifact:

- the final exported Figma asset reference produced from Stitch export

Secondary delivery artifact:

- optional blueprint, provenance, and license metadata

`pages/KitDeliveryPage.tsx` and `services/appSessionStore.ts` must read the finalization record through the manifest or a typed data helper. If a kit is not finalized, the delivery page must not offer the buyer a finished-asset download. If a kit is finalized, the page must hand over the final Figma asset and may also provide the support metadata pack.

## Readiness And CI

`scripts/commercial/validate-commercial-readiness.mjs` must fail when a published kit lacks a finalized finalization record.

`scripts/ci-pipeline-health.mjs` must fail when:

- product JSON says `published` but finalization is not finalized
- product and manifest final asset identifiers disagree
- delivery still points to blueprint-only fulfillment for finalized kits
- a kit relies on a Stitch project whose export-capable mode cannot be proven

Tests should cover:

- finalization record parsing and status derivation
- publication blocking when finalization is missing or incomplete
- catalog and manifest agreement on final asset identity
- delivery readiness for finalized kits
- integrity failures for blueprint-only delivery

## Existing Catalog Migration

The first migration should audit all current kits and create a conservative finalization record for each one.

Rules:

- If export-capable Stitch mode cannot be proven, classify the kit as `must_regenerate`.
- If export evidence exists but content or delivery verification is missing, classify it as `repairable`.
- If product JSON says `published` but finalization is not finalized, report an integrity violation.
- If the kit is from an export-capable Stitch project and all checks pass, classify it as `finalized`.

This will likely reduce the published catalog temporarily, but it makes the storefront honest and gives a concrete repair queue.

## Implementation Phases

Phase 1: Audit and finalization schema

- Add finalization record types.
- Add an audit script that creates `release/finalization.json` for every kit.
- Add a catalog-wide audit report with `finalized`, `repairable`, `must_regenerate`, and `blocked` counts.

Phase 2: Catalog derivation and readiness enforcement

- Update catalog generation to derive `published` only from finalized records.
- Update commercial readiness and pipeline health checks.
- Add regression tests for publication gating and catalog consistency.

Phase 3: Real delivery handoff

- Update manifest and product delivery fields to reference the final exported Figma asset.
- Update the delivery page and session store download path.
- Add tests for finalized delivery and blocked delivery.

## Out Of Scope

- Rebuilding every commercial kit immediately.
- Replacing Stitch generation prompts.
- Redesigning storefront merchandising pages.
- Building a new buyer account system.
- Removing old reconstruction packets before migration is complete.

## Success Criteria

- No kit can be marked `published` unless its `finalization.json` is finalized.
- Pipeline health fails when finalization, product, manifest, or delivery state disagree.
- Buyers receive a real final Figma asset reference for finalized kits.
- Blueprint JSON remains available only as support metadata.
- Existing unfinished Stitch projects are visible as `repairable` or `must_regenerate`, not hidden behind green readiness checks.
