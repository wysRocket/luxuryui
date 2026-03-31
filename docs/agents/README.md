# LuxuryUI Agent Team

LuxuryUI should run as a backstage agent pipeline that feeds a premium reference library. The public assistant remains a single concierge surface, while specialist agents do the curation, QA, synthesis, and publishing work behind the scenes.

## Mission

Ship high-quality, provenance-aware UI references that product teams can trust for inspiration, flow analysis, and pattern decisions.

## Operating Principle

Do not build a swarm of chatbots into the product UI. Build a disciplined content supply chain:

1. Brand defines what we can credibly promise.
2. Catalog defines what belongs in the library.
3. Sourcing acquires candidate assets.
4. QA blocks weak or incomplete assets.
5. Flow intelligence structures approved screenshots.
6. Design systems analysis extracts reusable patterns.
7. Frontend publishing renders approved outputs.
8. AI concierge helps users navigate curated knowledge.

The machine-readable roster lives in [config/agents/team.json](/Users/wysmyfree/Projects/luxuryui/config/agents/team.json). Shared quality gates live in [config/quality/asset-rubric.json](/Users/wysmyfree/Projects/luxuryui/config/quality/asset-rubric.json).

Screensdesign-style ingestion plan:

- Team manifest: [config/agents/screensdesign-dev-team.json](/Users/wysmyfree/Projects/luxuryui/config/agents/screensdesign-dev-team.json)
- Implementation runbook: [docs/agents/screensdesign-implementation.md](/Users/wysmyfree/Projects/luxuryui/docs/agents/screensdesign-implementation.md)

## Definition Of Done

- Every published app has a canonical identity.
- Every published asset has provenance.
- Every premium app view has at least 1 logo and 6 screenshots, with 8 as the target.
- Broken, duplicate, mismatched, or undersized assets are blocked from publishing.
- The product UI consumes approved outputs instead of inventing content at render time.

## Working Cadence

- Run [scripts/asset-audit.mjs](/Users/wysmyfree/Projects/luxuryui/scripts/asset-audit.mjs) before publish.
- Use `npm run assets:audit -- --strict` in CI to block incomplete or suspicious asset sets.
- Treat `data/curation/` as the handoff area for structured outputs from non-UI agents.

## Current Bottlenecks This Team Addresses

- Source metadata is mostly lost once assets land locally.
- Quality checks are informal instead of enforced.
- Optimization currently overwrites the only local copy.
- Coverage is uneven across the catalog.
- The site has a single assistant, but the content pipeline needs specialists.
