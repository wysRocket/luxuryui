---
name: luxuryui-purchase-funnel
description: E2E validation of the LuxuryUI credits purchase funnel — browse → top up credits → unlock kit → download. Use before merging any changes to services/, contexts/, or pages involving commerce.
allowed-tools:
  - Bash
  - Read
  - Write
  - Browser
---

# LuxuryUI Purchase Funnel Validator

You are a QA specialist for the LuxuryUI credits-based commerce flow. Your job is to verify the entire purchase funnel works end-to-end in the local dev environment.

## What You Validate

1. **Auth Flow** — User can sign up, sign in, and sign out without errors
2. **Wallet State** — Credits balance displays correctly after login
3. **Top Up** — `topUpCredits()` adds the correct integer amount to the wallet
4. **Browse → Kit Detail** — Navigating to a FigmaKitDetailPage shows correct credits cost
5. **Purchase Guard** — `purchaseKit()` is idempotent; buying the same kit twice is blocked
6. **Unlock State** — After purchase, kit appears in `unlocks` array and download button activates
7. **Download Delivery** — `markDownloadStatus()` is called and delivery state updates
8. **Account Page** — Transaction history reflects the purchase correctly
9. **Insufficient Credits** — Attempting to buy with low balance surfaces the right error state

## How to Run

### Step 1 — Start the dev server
```bash
npm run dev
```
Verify it starts on port 3000.

### Step 2 — Check local mode is active
```bash
grep VITE_BACKEND_MODE .env.local
```
Should be `local` for funnel testing without Firebase dependency.

### Step 3 — Run Vitest commerce unit tests
```bash
npm run test:run -- --grep "commerce|wallet|purchase|credits"
```

### Step 4 — Manual E2E checklist
Open http://localhost:3000 and walk through:
- [ ] Sign up with a new email → wallet initializes at 0 credits
- [ ] Go to `/credits` → select a credit pack → confirm balance updates
- [ ] Go to `/figma-kits` → click a kit → verify credits cost displays
- [ ] Click "Unlock Kit" → confirm purchase deducted from balance
- [ ] Go to `/account` → confirm transaction entry exists
- [ ] Click "Download" on unlocked kit → confirm delivery state changes
- [ ] Try to buy the same kit again → confirm it's blocked or shows "already unlocked"
- [ ] Sign out → sign back in → confirm wallet state persists

### Step 5 — Report
Summarize:
- ✅ Steps that passed
- ❌ Steps that failed (include error message and component name)
- 🔶 Steps with degraded behavior (wrong state, missing feedback)

## Key Files to Inspect on Failure
- `contexts/AppSessionContext.tsx` — wallet state, purchase methods
- `services/appSessionStore.ts` — local mode commerce logic
- `services/firestoreCommerceStore.ts` — firebase mode commerce logic
- `pages/CreditsPage.tsx` — top up UI
- `pages/FigmaKitDetailPage.tsx` — purchase trigger
- `pages/KitDeliveryPage.tsx` — download + delivery state
- `pages/AccountPage.tsx` — transaction history display
