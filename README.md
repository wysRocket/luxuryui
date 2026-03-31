<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LuxuryUI

This contains everything you need to run your app locally.

LuxuryUI is evolving from a premium screenshot library into a sellable Figma asset business with:

- reference browsing for apps, screens, and flows
- a commercial catalog of transformed Figma kits
- backstage curation, QA, and commercial-readiness pipelines

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](/Users/wysmyfree/Projects/luxuryui/.env.example) to `.env.local`
3. Run the app:
   `npm run dev`

### Runtime Modes

LuxuryUI now supports two runtime shapes:

- `local` mode works immediately and persists auth, credits, purchases, and unlocked kits in the browser
- live mode is enabled by env vars and is designed for Firebase auth/data plus Stripe checkout

Important runtime switches:

- `VITE_BACKEND_MODE=local|firebase`
- `VITE_PAYMENT_MODE=local|stripe`
- `VITE_GEMINI_API_KEY` for the live concierge

If you switch to Firebase or Stripe mode without the required keys, the app fails loudly in development instead of silently falling back.

## Agent Team

LuxuryUI now includes a backstage agent operating model for building the site with higher-quality assets and structured design intelligence.

- Team manifest: [config/agents/team.json](/Users/wysmyfree/Projects/luxuryui/config/agents/team.json)
- Agent overview: [docs/agents/README.md](/Users/wysmyfree/Projects/luxuryui/docs/agents/README.md)
- Shared quality rubric: [config/quality/asset-rubric.json](/Users/wysmyfree/Projects/luxuryui/config/quality/asset-rubric.json)
- Asset audit: [scripts/asset-audit.mjs](/Users/wysmyfree/Projects/luxuryui/scripts/asset-audit.mjs)

Run the audit with:

`npm run assets:audit`

Use strict mode to fail builds when coverage or provenance regress:

`npm run assets:audit -- --strict`

## Commercial Kit Pipeline

Generate the storefront-ready Figma kit artifacts:

`npm run commercial:generate`

Validate that all published kits have specs, manifests, and approved reviews:

`npm run commercial:readiness`

Run the full pipeline health check:

`npm run pipeline:health`
