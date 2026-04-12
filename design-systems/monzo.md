# Design System Inspired by Monzo

## 1. Visual Theme & Atmosphere

Monzo redefined what a bank could look like: approachable, transparent, and designed around the card — specifically, its iconic hot coral card (`#FF3B6E`). The design system is built on the tension between this warm, expressive coral and a clean, modern white surface that keeps banking information crystal clear. Dark mode is a first-class citizen, using a sophisticated near-black (`#1A1A2E`) that maintains the coral's vibrancy against dark contexts.

Typography is set in the custom "Monzo" typeface — a geometric rounded sans-serif developed exclusively for the brand. It is friendly and distinctive, reading with warmth at display sizes and clinical precision at table sizes for account numbers and transaction amounts. On platforms where the custom font isn't loaded, a tightly-matched system font stack maintains character.

The design philosophy is "banking made human." Transactions are categorized and surfaced with spending insights, visualized in circular charts using a 10-color category palette. The card is literally illustrated at the center of the app — the physical card image is a UI element, tappable to reveal details. Notifications are celebratory rather than anxious. The pot system (savings goals) uses playful imagery while maintaining the rigorous design grid.

**Key Characteristics:**
- Hot coral: `#FF3B6E` (light mode) / `#FF5F57` (dark mode variant) — the defining brand color
- White: `#FFFFFF` — light mode dominant canvas
- Dark: `#1A1A2E` — dark mode background
- Custom Monzo typeface — geometric rounded sans; fallback `-apple-system`
- Card-first UI: physical card render is a core navigation element
- Pot illustrations: playful, illustrative, on-brand
- Category color system: 10 distinct colors for spending insights
- Smooth iOS-native feel: spring animations, swipe gestures

## 2. Color Palette & Roles

### Primary
- **Monzo Coral** (`#FF3B6E`): brand, primary CTAs, active states, card color
- **White** (`#FFFFFF`): light mode backgrounds
- **Dark Background** (`#1A1A2E`): dark mode app shell
- **Text Primary** (`#0D1120`): light mode heading and body text
- **Text Dark** (`#E8EAF6`): dark mode primary text
- **Text Secondary** (`#8A8FA4`): metadata, timestamps, secondary labels

### Interactive
- **Coral Hover** (`#E02E5F`): button hover / pressed state
- **Coral Glow** (`rgba(255,59,110,0.25)`): focus ring, notification badge glow
- **Success** (`#00CC88`): money received, transfer confirmed
- **Alert** (`#FF6B35`): spending over budget, unusual transactions
- **Danger** (`#FF3355`): account freeze, failed payment

### Surface
- **Card Surface Light** (`#F5F6FA`): list item backgrounds, light mode
- **Card Surface Dark** (`#252840`): panel fills in dark mode
- **Border Light** (`rgba(0,0,0,0.08)`): dividers in light mode
- **Border Dark** (`rgba(255,255,255,0.08)`): dividers in dark mode
- **Category Colors**: Groceries `#FF6B35`, Transport `#5C9BD6`, Entertainment `#784BD1`, Eating Out `#FF3B6E`, Shopping `#FDAB3D`, Bills `#00C875`, Health `#00CC88`, Travel `#4EC9B0`, Personal `#AB47BC`, General `#8A8FA4`

## 3. Typography Rules

### Font Families
- **Monzo (Custom)**: `"Monzo", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif` — all text
- **Tabular figures**: `font-variant-numeric: tabular-nums` on all financial amounts

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Account Balance | Monzo | 48px | 700 | 1.0 | Tabular nums; hero of home screen |
| Display | Monzo | 34px | 700 | 1.1 | Onboarding, pot titles |
| H1 | Monzo | 28px | 700 | 1.15 | Screen titles |
| H2 | Monzo | 22px | 700 | 1.2 | Section headers |
| H3 | Monzo | 18px | 600 | 1.3 | Card and tile titles |
| Body Large | Monzo | 17px | 400 | 1.6 | Transaction descriptions |
| Body Default | Monzo | 15px | 400 | 1.5 | UI text, labels |
| Amount | Monzo | 15px | 700 | 1.3 | Tabular nums; colored |
| Caption | Monzo | 13px | 400 | 1.4 | Dates, merchant categories |
| Micro | Monzo | 11px | 500 | 1.3 | Badge text, card number hint |

## 4. Component Stylings

### Buttons
- **Primary**: `background: #FF3B6E`, `color: #FFFFFF`, `border-radius: 14px`, `padding: 16px 24px`, `font: Monzo 17px 700`, width 100% on mobile
- **Hover / Pressed**: `background: #E02E5F`, scale: 0.98
- **Secondary**: `background: rgba(255,59,110,0.10)`, `color: #FF3B6E`, `border-radius: 14px`
- **Ghost**: `border: 1.5px solid rgba(0,0,0,0.15)`, `color: #0D1120`, `background: transparent`, `border-radius: 14px`
- **Dark mode primary**: identical coral on `#1A1A2E` — coral reads even more vibrantly

### Cards & Containers
- **Transaction Row**: 60px height, merchant icon 40px circle left, name + category, amount right (coral/red or positive green), 1px border-bottom
- **Pot Card**: `border-radius: 16px`, illustration top half, coral header accent, progress bar with coral fill
- **Payment Card Render**: the physical Monzo card — `border-radius: 16px`, coral gradient surface, white Monzo wordmark, embossed card number
- **Insight Widget**: `border-radius: 14px`, `background: #F5F6FA`, spending chart + summary text
- **Modal / Sheet**: `border-radius: 24px` top corners only (bottom sheet pattern), `background: #FFFFFF`

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Transaction row height: 60px
- Tab bar height: 83px (includes iOS home indicator inset)
- Content horizontal padding: 20px

### Border Radius Scale
- **8px** — tags, small badges
- **12px** — input fields
- **14px** — primary buttons, secondary cards
- **16px** — pot cards, physical card render
- **24px** — bottom sheets, modal drawers
- **50%** — merchant icons, avatar circles

## 6. Depth & Elevation

- **Level 0** (background): `#FFFFFF` light / `#1A1A2E` dark
- **Level 1** (list): `#F5F6FA` light / `#252840` dark — list item surfaces
- **Level 2** (card): `box-shadow: 0 2px 12px rgba(0,0,0,0.08)` — pot cards, widgets
- **Level 3** (bottom sheet): `box-shadow: 0 -4px 24px rgba(0,0,0,0.16)` — modal sheets
- **Coral card shadow**: `box-shadow: 0 8px 32px rgba(255,59,110,0.30)` — physical card
- **Focus ring**: `box-shadow: 0 0 0 3px rgba(255,59,110,0.25)`

## 7. Do's and Don'ts

### Do
- Use the physical card render prominently on the home screen
- Color spending amounts with category colors for instant categorization
- Support dark mode as first-class — coral works on both backgrounds
- Use spring animations for bottom sheet and card flips (iOS-native feel)
- Show account balance at 48px with tabular-nums — it's the most important number

### Don't
- Don't use coral for anything other than brand/action elements
- Don't use red for normal outgoing transactions — only for genuinely failed/dangerous states
- Don't exceed 24px border-radius on anything except bottom sheets
- Don't show full card numbers in the UI — mask to last 4 digits always

## 8. Responsive Behavior
Breakpoints: 375px (iPhone SE), 390px (iPhone 15 Pro), 430px (iPhone 15 Pro Max), 768px (iPad)

- **375px**: standard single-column; fixed bottom tab bar; 60px transaction rows
- **390–430px**: slightly larger type scale (+1px); wider card render
- **768px (iPad)**: 2-column layout; persistent left sidebar; wider pots grid

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: `#FF3B6E`
- Background light: `#FFFFFF`
- Background dark: `#1A1A2E`
- Text: `#0D1120`
- Success: `#00CC88`
- Card shadow: `rgba(255,59,110,0.30)`

### Example Component Prompts
- "A Monzo home screen balance display: Monzo typeface 48px 700 tabular-nums, centered, coral for the balance amount, 'Account balance' in 15px 400 gray above it"
- "A transaction row 60px height: 40px circle merchant icon with category color border, Monzo 15px 600 merchant name, 13px gray category below, Monzo 15px 700 tabular-nums amount right-aligned — coral if debit, green if credit"
- "A primary CTA button: #FF3B6E fill, white Monzo 17px 700, 14px border-radius, full-width, 56px height, pressed state scale 0.98"
