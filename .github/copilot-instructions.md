# LuxuryUI — Copilot Instructions

## Project Overview
LuxuryUI is a **premium design asset marketplace** — a curated reference library of app screenshots, user flows, and commercial Figma kits backed by an agent-driven curation pipeline. Users browse UI references, unlock Figma kits with credits, and get AI-powered design guidance via the Gemini concierge.

---

## Tech Stack
- **React 19** + **TypeScript 5.8** — strict mode
- **Vite 6** — dev server on port 3000; `@/` path alias maps to project root
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin; custom `@theme` in `index.css`
- **Framer Motion 12** — animations only; no layout logic
- **Firebase 12** — Auth (email/password + Google OAuth) + Firestore wallet
- **Google Genai (Gemini)** — live concierge in `services/geminiService.ts`
- **Google Stitch SDK** — Figma kit generation pipeline in `scripts/commercial/`
- **Vitest 4** — testing with jsdom environment

---

## Architecture Rules

### State Management
- **Context API only** — single `AppSessionContext` for auth + commerce state
- No Redux, Zustand, or external state libraries
- All components consume state via `useAppSession()` hook — never import context directly
- Commerce mutations (`topUpCredits`, `purchaseKit`, `markDownloadStatus`) live in `services/` only

### Backend Modes
- `VITE_BACKEND_MODE=local` → localStorage-backed auth and wallet (default for dev)
- `VITE_BACKEND_MODE=firebase` → Firebase Auth + Firestore wallet
- **Never hardcode Firebase calls** — always route through `services/authBackend.ts` and `services/firestoreCommerceStore.ts`
- Missing Firebase keys in firebase mode **fail loudly** — check `services/runtimeConfig.ts`

### File Organization
- `components/` — reusable UI only; no business logic, no direct API calls
- `pages/` — route-level views; compose from components, read from context
- `services/` — all business logic, API clients, backend abstractions
- `contexts/` — React context + provider only; delegates to services
- `data/` — static curated data; changes require agent sign-off (see Agents section)
- `config/` — agent configs and quality rubrics; not runtime code
- `scripts/` — Node.js pipeline scripts; not imported by the app

### Styling
- **Tailwind classes only** — no inline styles, no CSS modules, no styled-components
- Dark mode via `.dark` class on `<html>` — not via `prefers-color-scheme` media query
- Custom theme tokens defined in `index.css` `@theme` block — extend there, not in `tailwind.config`
- Responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)

### TypeScript
- All types live in `types.ts` — add new interfaces there, not inline
- No `any` — use `unknown` and narrow properly
- Strict null checks are enabled — handle `null | undefined` explicitly
- `@/` path alias is configured — use it instead of relative imports across directories

---

## Commerce Rules (Critical)
- **Credits are integers** — never use floats for wallet balances
- `purchaseKit()` must be **idempotent** — check `unlocks` array before executing purchase
- `markDownloadStatus()` must be called **after every kit download** to update delivery state
- Kit unlock state is authoritative in Firestore (firebase mode) or localStorage (local mode)
- Never mutate wallet state directly in components — always call context methods

---

## Data Pipeline Rules
- All app catalog changes flow through `data/catalog.js` → `constants.tsx`
- Assets must pass `config/quality/asset-rubric.json` before entering `data/realAppAssets.ts`
- Never commit raw/unvalidated assets — run `npm run assets:audit` first
- Screensdesign intake: `npm run sources:screensdesign:integrity` must pass before publish
- Commercial kits: `npm run commercial:readiness` must pass before `commercial:package`

---

## Testing
- Test files live in `src/test/`
- New `services/` files require unit tests — no untested commerce logic
- Use `vitest` globals (`describe`, `it`, `expect`) — no imports needed (configured in `vite.config.ts`)
- Run: `npm run test:run` for CI, `npm run test` for watch mode
- Commerce flows require E2E coverage — use the `luxuryui-purchase-funnel` skill

---

## CI/CD
- `deploy.yml` — triggers on push to `main`; runs `npm run deploy` to Hostinger
- `pipeline-health.yml` — runs on all PRs; validates screensdesign pipeline integrity
- **Both workflows must pass** before merging to `main`
- Never bypass CI for data pipeline changes

---

## Agent Team (config/agents/team.json)
Work is divided across specialist agents. Always use the right agent for the right task:

| Agent | Owns | When to invoke |
|---|---|---|
| `brand-positioning` | Messaging, CTAs, copy | Before any user-facing text changes |
| `catalog-strategist` | App roster, slugs, coverage | Before adding/renaming apps |
| `asset-sourcing` | Raw asset acquisition | When adding new app assets |
| `asset-qa` | Quality rubric enforcement | After sourcing, before publishing |
| `flow-intelligence` | Flow extraction, step labeling | When creating/updating flows |
| `design-systems-analyst` | Cross-app pattern synthesis | When writing pattern docs |
| `frontend-publishing` | UI integration of approved assets | After QA signs off |
| `ai-concierge` | User-facing assistant, routing | Gemini concierge tuning |
| `commerce-guard` | Credits math, purchase integrity | Before any commerce code changes |
| `firestore-security-auditor` | Firestore rules, schema security | Before any rules/schema changes |
| `concierge-tuning` | Gemini prompts, fallback heuristics | When tuning AI responses |
| `performance-bundle` | Bundle sizes, Core Web Vitals | Before/after major dependency changes |
| `seo-discoverability` | Meta tags, OG, structured data | When adding/updating public pages |

---

## Skills to Use

### Before Starting Any Feature
```
skill: brainstorming          # Explore intent + requirements before coding
skill: gsd-discuss-phase      # Structured planning for multi-stage work
```

### During Implementation
```
skill: test-driven-development       # Write tests first for services/ changes
skill: dispatching-parallel-agents   # Run pipeline agents in parallel
skill: systematic-debugging          # For pipeline failures or auth bugs
```

### Before Completing Work
```
skill: verification-before-completion  # Confirm it actually works before claiming done
skill: requesting-code-review          # Peer review before merging services/ changes
skill: luxuryui-purchase-funnel        # E2E test the credits → unlock → download flow
skill: luxuryui-pipeline-run           # Validate screensdesign pipeline health
skill: luxuryui-kit-publish            # Validate + publish new Figma kits
```

### For UI Work
```
skill: stitch-design     # High-fidelity screen generation/editing
skill: stitch-loop       # Iterative UI building
skill: shadcn-ui         # Component guidance
skill: design-md         # Design system documentation
skill: enhance-prompt    # Refine UI prompts before generation
skill: gstack            # Browser-test UI flows and visual regression
```

---

## Environment Variables
```env
VITE_BACKEND_MODE=local|firebase          # Required
VITE_PAYMENT_MODE=local|stripe            # Required
VITE_GEMINI_API_KEY=                      # Optional; enables live concierge
VITE_FIREBASE_API_KEY=                    # Required in firebase mode
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_GOOGLE_AUTH_ENABLED=true|false
VITE_FIREBASE_AUTHORIZED_DOMAINS=localhost,yourdomain.com
```
Copy `.env.example` → `.env.local` and never commit `.env.local`.

---

## Common Mistakes to Avoid
- ❌ Calling Firebase directly in components — use `useAppSession()` methods
- ❌ Using floats for credits — always integers
- ❌ Skipping `markDownloadStatus()` after kit downloads
- ❌ Publishing assets that haven't passed `asset-rubric.json` QA
- ❌ Adding new routes without updating `App.tsx` route list
- ❌ Dark mode with `@media (prefers-color-scheme)` — use `.dark` class
- ❌ Relative imports across directory boundaries — use `@/` alias
- ❌ Inventing product claims in UI copy — route through `brand-positioning` agent
