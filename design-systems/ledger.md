---
name: Ledger
colors:
  tertiary: "#FF4B00"
  neutral: "#000000"
  primary: "#000000"
typography:
  h1:
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
  h2:
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
  h3:
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Ledger is the world's leading hardware crypto wallet brand, and its design system reflects a singular focus: security meets premium hardware aesthetics. The brand operates at the intersection of consumer electronics and financial grade security — the same emotional territory as Apple Watch or a high-end vault. The interface is strikingly minimal, dominated by pure black (`#000000`) backgrounds and sharp white typography, with a singular accent orange (`#FF4B00`) deployed only at moments of critical action.

The design vocabulary rejects anything decorative or playful. There is no illustration; iconography is line-based and geometric. Every interaction involving the hardware device (connecting, confirming, signing a transaction) is presented with ceremonial weight — large centered typography, generous vertical breathing room, and orange glows for confirmation states. The digital interface defers to the physical device; the screen never competes with the Ledger Nano's tiny display.

Typography is set in Basis Grotesque — a geometric sans-serif that pairs technical precision with a Swiss design heritage. The type is always either white on black or black on white — never gray on gray. Security-critical information (addresses, seed phrase words) appears in a monospaced typeface with generous letter-spacing to prevent misreading.

**Key Characteristics:**
- Brand orange: `#FF4B00` — the single accent, reserved for CTAs and confirmation states
- Pure black: `#000000` — dominant background; security equals darkness
- White: `#FFFFFF` — typography, iconography on black backgrounds
- Basis Grotesque — geometric, precise, European design heritage
- Monospace for crypto addresses: 8px letter-spacing, 13px
- Zero decorative elements — no illustrations, no gradients
- Icon style: 2px stroke, geometric, 24px grid
- Hardware device centered prominently in onboarding flows

## Colors

### Primary
- **Ledger Orange** (`#FF4B00`): primary CTA, confirm action, active state, brand mark
- **Black** (`#000000`): page backgrounds, dark panels
- **White** (`#FFFFFF`): primary text on dark; full-surface light mode card fills
- **Near-White** (`#F9F9F9`): light mode page background

### Interactive
- **Orange Hover** (`#E04200`): CTA hover state
- **Orange Glow** (`rgba(255,75,0,0.20)`): focus ring on interactive elements
- **Danger** (`#FF4B4B`): high-risk transaction warnings, seed phrase alerts
- **Success** (`#00D97E`): confirmed transaction, device connected

### Surface
- **Dark Card** (`#111111`): elevated surfaces on dark backgrounds
- **Dark Border** (`rgba(255,255,255,0.10)`): separators in dark UI
- **Light Card** (`#FFFFFF`): cards in light/onboarding contexts
- **Light Border** (`rgba(0,0,0,0.10)`): separators in light UI

## Typography

### Font Families
- **Basis Grotesque**: `"Basis Grotesque Pro", "Inter", sans-serif` — all headings and UI text
- **IBM Plex Mono**: `"IBM Plex Mono", monospace` — crypto addresses, seed phrase words

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Display | Basis Grotesque | 56px | 700 | 1.05 | Landing page, device intro |
| H1 | Basis Grotesque | 40px | 700 | 1.1 | Section titles |
| H2 | Basis Grotesque | 28px | 700 | 1.2 | Step headings in onboarding |
| H3 | Basis Grotesque | 20px | 600 | 1.3 | Card titles |
| Body Large | Basis Grotesque | 17px | 400 | 1.6 | Instructions |
| Body Default | Basis Grotesque | 15px | 400 | 1.55 | General UI text |
| Crypto Address | IBM Plex Mono | 13px | 400 | 1.6 | Letter-spacing 0.08em |
| Seed Word | IBM Plex Mono | 15px | 500 | 1.5 | Numbered, wide tracking |
| Label | Basis Grotesque | 12px | 700 | 1.2 | Uppercase, 0.1em tracking |
| Caption | Basis Grotesque | 11px | 400 | 1.4 | Help text, metadata |

## Layout

### Spacing System
- Base: 8px
- Scale: 8, 16, 24, 32, 40, 48, 64, 80, 96
- Onboarding step max-width: 480px centered
- Hardware visual: min-height 240px centered in viewport

### Border Radius Scale
- **0px** — sharp corners for seed phrase cells, address rows (security = precision)
- **4px** — buttons, input fields, address containers
- **8px** — panel cards
- **12px** — modal dialogs

## Elevation & Depth

- **Level 0** (base): `#000000` — app background
- **Level 1** (card): `#111111` — panels and containers
- **Level 2** (modal): `box-shadow: 0 16px 64px rgba(0,0,0,0.90)` — maximum drama
- **Orange focus**: `box-shadow: 0 0 0 2px rgba(255,75,0,0.40)` — input and button focus
- **Success glow**: `box-shadow: 0 0 0 2px rgba(0,217,126,0.30)` — confirmed transaction

## Components

### Buttons
- **Primary (Dark BG)**: `background: #FF4B00`, `color: #FFFFFF`, `border-radius: 4px`, `padding: 16px 32px`, `font: Basis Grotesque 16px 700`
- **Primary (Light BG)**: identical colors and radius
- **Hover**: `background: #E04200`
- **Ghost**: `border: 1px solid rgba(255,255,255,0.25)`, `color: #FFFFFF`, `background: transparent`
- **Destructive**: `background: #FF4B4B`, `color: #FFFFFF` — for "wipe device" class actions
- **Disabled**: `opacity: 0.35`, `cursor: not-allowed`

### Cards & Containers
- **Dark Panel**: `background: #111111`, `border-radius: 8px`, `border: 1px solid rgba(255,255,255,0.10)`
- **Address Display**: `background: #111111`, `border-radius: 4px`, `padding: 16px`, `font-family: IBM Plex Mono`
- **Seed Phrase Grid**: 4-column grid, each word in `#111111` cell with monospace text, numbered
- **Modal**: `background: #000000`, `border-radius: 12px`, `border: 1px solid rgba(255,255,255,0.15)`, `box-shadow: 0 16px 64px rgba(0,0,0,0.90)`

## Do's and Don'ts

### Do
- Reserve orange exclusively for confirmation and action moments — it signals "proceed"
- Use IBM Plex Mono for all addresses and seed words — scanning accuracy is critical
- Present seed phrases with numbered rows, one word per cell
- Maintain pure black backgrounds in security-critical screens
- Show hardware device illustration centered and large in onboarding

### Don't
- Don't use orange for decorative purposes or secondary actions
- Don't use gray text on black — only white; gray reads as "disabled" and erodes trust
- Don't round corners beyond 12px — it conflicts with the hardware industrial aesthetic
- Don't introduce photography or illustration into the transaction confirmation UI

## Responsive Behavior

Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)

- **375px**: single-column; onboarding wizard fills full screen; device visual above fold
- **768px**: 2-column: device visual left, step content right
- **1024px**: centered max-width 1000px; feature grid 3-column

## Agent Prompt Guide

### Quick Color Reference
- Brand: `#FF4B00`
- Background: `#000000`
- Card: `#111111`
- Text: `#FFFFFF`
- Success: `#00D97E`
- Border: `rgba(255,255,255,0.10)`

### Example Component Prompts
- "A crypto address display with #111111 background, 4px radius, IBM Plex Mono 13px text, 0.08em letter-spacing, orange copy icon to the right"
- "A transaction confirm button with #FF4B00 background, white Basis Grotesque text 16px bold, 4px radius, full-width, 56px height"
- "A seed phrase grid with 4 columns, #111111 cells, numbered IBM Plex Mono words, 8px gap, no border-radius"
