---
name: MetaMask
colors:
  tertiary: "#E2761B"
  neutral: "#24272A"
  primary: "#24272A"
  secondary: "#9FA6AE"
typography:
  h1:
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
  h2:
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.25
  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: 4px
  md: 10px
  lg: 12px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

MetaMask is the browser gateway to Web3 — a crypto wallet that must simultaneously communicate trustworthiness for holding financial assets and approachability for onboarding newcomers to an intimidating paradigm. The signature orange (`#E2761B`) derives from the fox mascot's vibrant fur, and it anchors the brand identity across the fox-themed iconography, primary buttons, and accent highlights. The interface shell runs on dark charcoal (`#24272A`) in the browser extension, with lighter surfaces for transaction confirmation dialogs.

The design must solve a uniquely difficult UX problem: presenting cryptographic addresses, gas fees, and transaction data in a way that feels safe to act on. MetaMask uses color coding consistently — orange for primary actions, green for confirmations and received assets, red for high-risk warnings and destructive operations. The typographic approach is cautious: monospaced fonts for all addresses and hex data, comfortable sans-serif for instructions.

Trust is signaled through consistency rather than decoration: the fox logo appears on every screen, color conventions never deviate, and the "Confirm" button is always unmistakably the primary orange CTA. The UI for transaction confirmation is deliberately ceremonial — centered, modal, with full detail visible before any action is taken.

**Key Characteristics:**
- Brand orange: `#E2761B` — primary CTA, fox accent, active states
- Dark shell: `#24272A` — browser extension background
- Mid-surface: `#3B3D42` — cards and panels inside the dark shell
- Roboto for UI text; Roboto Mono for addresses, hex values
- Trust color system: orange = action, green = safe/receive, red = risk/send
- Centered confirmation modal: 360px wide, always full-detail
- Fox mascot: never altered, always present in header
- Gas fee display: always prominent, never hidden

## Colors

### Primary
- **MetaMask Orange** (`#E2761B`): primary CTAs, confirm button, active highlights
- **Shell Dark** (`#24272A`): browser extension shell background
- **Surface** (`#3B3D42`): card and panel backgrounds inside extension
- **Text Primary** (`#FFFFFF`): headings and primary text on dark surfaces
- **Text Secondary** (`#9FA6AE`): metadata, helper text, gas estimates

### Interactive
- **Orange Hover** (`#D16918`): CTA hover state
- **Receive Green** (`#00C689`): incoming transactions, positive balance change
- **Send Red** (`#FF3355`): outgoing transactions, high-risk flags
- **Warning Yellow** (`#F8C000`): elevated gas warning, phishing alert

### Surface
- **Border** (`rgba(255,255,255,0.10)`): separators in dark UI
- **Input Dark** (`#2D3035`): text input fills
- **Overlay** (`rgba(0,0,0,0.60)`): modal backdrop
- **Pending Gray** (`#6A737D`): pending transaction state

## Typography

### Font Families
- **Roboto**: `"Roboto", "Inter", sans-serif` — all UI text, labels, instructions
- **Roboto Mono**: `"Roboto Mono", monospace` — all crypto addresses, hex values, gas data

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Account Balance | Roboto | 32px | 700 | 1.0 | ETH and USD value |
| H1 | Roboto | 22px | 700 | 1.2 | Screen titles |
| H2 | Roboto | 18px | 600 | 1.25 | Section labels |
| Body | Roboto | 14px | 400 | 1.5 | Transaction details |
| Address | Roboto Mono | 13px | 400 | 1.5 | Letter-spacing 0.04em |
| Gas Fee | Roboto Mono | 13px | 500 | 1.4 | Tabular nums; orange or yellow |
| Hex Data | Roboto Mono | 11px | 400 | 1.4 | Raw transaction data |
| Label | Roboto | 12px | 700 | 1.2 | Uppercase tags |
| Caption | Roboto | 11px | 400 | 1.3 | Timestamps, network name |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40
- Extension popup: 360px wide, 600px tall — fixed
- Content padding: 16px horizontal

### Border Radius Scale
- **4px** — small tags, network badges
- **8px** — inputs, address displays, secondary buttons
- **10px** — transaction cards
- **12px** — modal containers
- **50%** — token icons, account avatars

## Elevation & Depth

- **Level 0** (shell): `#24272A` — extension background
- **Level 1** (card): `#3B3D42` — transaction and token panels
- **Level 2** (input): `#2D3035` — text inputs, address displays
- **Level 3** (modal): `rgba(0,0,0,0.60)` overlay + `#3B3D42` centered card
- **Orange focus**: `box-shadow: 0 0 0 2px rgba(226,118,27,0.45)`
- **Red risk glow**: `box-shadow: 0 0 0 2px rgba(255,51,85,0.45)` — high-risk warnings

## Components

### Buttons
- **Confirm (Primary)**: `background: #E2761B`, `color: #FFFFFF`, `border-radius: 8px`, `padding: 14px 24px`, `font: Roboto 16px 700`, width 100%
- **Hover**: `background: #D16918`
- **Reject (Secondary)**: `border: 1px solid rgba(255,255,255,0.25)`, `color: #FFFFFF`, `background: transparent`, `border-radius: 8px`, width 100%
- **Add Network**: `border: 1px solid #E2761B`, `color: #E2761B`, `background: transparent`
- **Danger**: `background: #FF3355` — for disconnect wallet, revoke permission

### Cards & Containers
- **Transaction Card**: `background: #3B3D42`, `border-radius: 10px`, `border: 1px solid rgba(255,255,255,0.10)`, `padding: 16px`
- **Address Display**: `background: #2D3035`, `border-radius: 8px`, `padding: 12px`, `font-family: Roboto Mono 13px`
- **Gas Selector**: 3 options (low/market/aggressive), radio pill group, `border-radius: 8px`, selected state orange border
- **Token Row**: 44px height, token icon left, name + balance, price change right

## Do's and Don'ts

### Do
- Always use Roboto Mono for addresses — readability of hex is a security concern
- Show gas fees before confirm — never hidden or de-emphasized
- Color incoming transactions green, outgoing red — consistently
- Present full transaction detail before the Confirm button
- Use orange only for safe/confirm actions; red only for risk/reject

### Don't
- Don't truncate addresses to fewer than 8 chars at start and end (checksum safety)
- Don't style the Confirm button anything other than orange
- Don't animate the confirmation UI — stability signals security
- Don't use bright backgrounds — the dark shell is a trust signal

## Responsive Behavior

Breakpoints: 360px (extension popup fixed), 768px (mobile web), 1024px (desktop web)

- **360px extension**: fixed popup; scrollable confirmation details above sticky buttons
- **768px**: full-screen mobile wallet; bottom sheet for confirmations
- **1024px**: dashboard view with sidebar navigation

## Agent Prompt Guide

### Quick Color Reference
- Brand: `#E2761B`
- Background: `#24272A`
- Card: `#3B3D42`
- Text: `#FFFFFF`
- Receive: `#00C689`
- Send: `#FF3355`

### Example Component Prompts
- "A transaction confirmation card with #3B3D42 background, 10px radius, 1px rgba(255,255,255,0.10) border, Roboto 14px recipient address in Roboto Mono, gas fee in orange mono, full-width orange Confirm button below"
- "An address display with #2D3035 background, 8px radius, Roboto Mono 13px white, 0.04em letter-spacing, copy icon right"
- "A token row 44px height: 32px circular token icon, Roboto 14px 600 name left, balance and USD value right-aligned, green if positive day change"
