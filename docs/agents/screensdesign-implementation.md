# Screensdesign-Style Implementation Plan

This document defines a Claude Code-style development-agent workflow for implementing a high-quality ingestion pipeline inspired by Screensdesign.

## Scope

- Build engineering pipeline for intake, normalization, QA, enrichment, and publication.
- Keep crawler behavior compliant and respectful.
- Integrate approved outputs into existing LuxuryUI pages.

## Team Manifest

- Team config: `config/agents/screensdesign-dev-team.json`
- Existing global team: `config/agents/team.json`

## Phase Plan

### Phase 1: Policy and Discovery

1. Source Policy Agent writes crawl allowlist, denylist, and attribution requirements.
2. Source Discovery Agent builds seed URLs and route patterns for listing/detail pages.
3. Pipeline Orchestrator validates scope before any deep crawl.

Deliverables:

- `data/curation/coverage/screensdesign-policy.json`
- `data/curation/coverage/screensdesign-discovery.json`

### Phase 2: Intake and Canonicalization

1. Scraper Engineering Agent runs intake crawler and writes raw snapshots.
2. Normalization Agent maps raw pages to canonical entities and slugs.
3. Metadata Enrichment Agent adds platform/category/provenance fields.

Deliverables:

- `data/curation/raw/screensdesign-intake.json`
- `data/curation/normalized/screensdesign-normalized.json`

### Phase 3: Quality and Flow Intelligence

1. Asset Integrity Agent validates image dimensions, duplicates, and broken URLs.
2. Flow Tagging Agent applies journey labels and confidence scores.
3. Pipeline Orchestrator blocks publication when coverage or quality fails.

Deliverables:

- `data/curation/coverage/screensdesign-quality-report.json`
- `data/curation/flows/screensdesign-flow-packs.json`

### Phase 4: Frontend Integration and Release

1. Frontend Integration Agent binds curated dataset to existing pages.
2. CI and Observability Agent enables strict checks and drift alerts.
3. Orchestrator runs release checklist and publishes.

Deliverables:

- UI integration PR
- CI checks for intake health and asset quality

## Starter Command

Run the initial source-intake scaffold:

`npm run sources:screensdesign:intake`

This starter command creates a crawl snapshot and route candidates without downloading assets.

## Agent Execution Order

1. pipeline-orchestrator
2. source-policy
3. source-discovery
4. scraper-engineering
5. normalization
6. asset-integrity
7. metadata-enrichment
8. flow-tagging
9. frontend-integration
10. ci-observability

## Guardrails

- Respect target site terms, robots, and access controls.
- Do not bypass authentication or anti-bot controls.
- Preserve provenance for every record used by product surfaces.
