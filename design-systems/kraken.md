---
name: Kraken
colors:
  tertiary: "#5741D9"
  neutral: "#1C1C28"
  primary: "#5741D9"
typography:
  h2:
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
  h3:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
---

## Overview

Kraken's design language positions the exchange as the professional-grade platform for serious crypto traders. The interface runs almost entirely on a dark charcoal palette — `#1C1C28` as the deepest background, with progressively lighter surfaces at `#242435` and `#2D2D42` — creating a multi-layer depth system that keeps dense trading data readable without eye strain during long sessions.

The brand's defining color is a vivid violet-purple (`#5741D9`) deployed on CTAs, active states, and key data highlights. It reads with authority against the dark backgrounds and carries enough distinctiveness to differentiate Kraken from the orange-dominant Coinbase and Binance branding. Secondary charts use a full data visualization spectrum: green for gains, red for losses, blue for volume bars, and purple for Kraken's own analytics overlays.

Typography skews dense: the platform uses Inter for UI chrome and DM Mono / Roboto Mono for all numerical data — prices, percentages, and order book values are always monospaced for column alignment and decimal-precision scanning. The result is an interface that feels more like a Bloomberg terminal than a consumer fintech app.

**Key Characteristics:**
- Brand purple: `#5741D9` — CTAs, active tabs, selection indicators
- Dark system: `#1C1C28` base, `#242435` cards, `#2D2D42` elevated surfaces
- Inter for UI chrome; DM Mono for all financial numerics
- Trading green: `#00C853` / trading red: `#FF3D57` — profit/loss across all contexts
- Dense information architecture: 6–8 data columns in order book view
- Candle chart defaults: 1m, 5m, 1h, 1D resolution tabs
- Low-border approach: 1px `rgba(255,255,255,0.07)` separators on dark surfaces
- No rounded corners above 8px — sharp, precise, professional aesthetic

## Colors

### Primary
- **Kraken Purple** (`#5741D9`): brand primary, CTAs, selected tabs, progress indicators
- **Deep Background** (`#1C1C28`): page and app shell background
- **Card Surface** (`#242435`): primary card and panel backgrounds
- **Elevated Surface** (`#2D2D42`): dropdowns, tooltips, active rows
- **Text Primary** (`#E8E8F0`): headings, key data points

### Interactive
- **Purple Hover** (`#4633B8`): CTA hover state
- **Purple Active** (`#3D2BA3`): pressed state, active tab underline
- **Gain Green** (`#00C853`): positive price change, buy side
- **Loss Red** (`#FF3D57`): negative price change, sell side
- **Volume Blue** (`#1A73E8`): volume bars in chart

### Surface
- **Separator** (`rgba(255,255,255,0.07)`): between rows, table cells
- **Input Background** (`rgba(255,255,255,0.05)`): form field fills
- **Hover Row** (`rgba(87,65,217,0.12)`): order book row hover

## Typography

### Font Families
- **Inter**: `"Inter", sans-serif` — all UI chrome, labels, navigation, headings
- **DM Mono**: `"DM Mono", "Roboto Mono", monospace` — all financial numerals

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Live Price | DM Mono | 36px | 600 | 1.0 | Tabular; colored by direction |
| Display | Inter | 28px | 700 | 1.15 | Dashboard section titles |
| H2 | Inter | 20px | 700 | 1.2 | Panel headers |
| H3 | Inter | 16px | 600 | 1.3 | Card titles |
| Body | Inter | 14px | 400 | 1.5 | Descriptions, labels |
| Order Book Row | DM Mono | 13px | 400 | 1.4 | Tight; tabular alignment |
| Table Cell | DM Mono | 12px | 400 | 1.3 | Dense data tables |
| Label/Tag | Inter | 11px | 600 | 1.2 | Uppercase, 0.08em tracking |
| Caption | Inter | 11px | 400 | 1.4 | Timestamps, footnotes |

## Layout

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40
- Trading UI default density: 4px vertical row padding in order book
- Panel padding: 16px

### Border Radius Scale
- **0px** — order book rows, table rows
- **4px** — buy/sell buttons, input fields
- **6px** — primary CTA buttons
- **8px** — panel cards, chart containers
- **12px** — modal dialogs, drawers

## Elevation & Depth

- **Level 0** (base): `#1C1C28` — app background
- **Level 1** (panel): `#242435` — main content panels
- **Level 2** (elevated): `#2D2D42` — dropdowns, hover rows
- **Level 3** (modal): `box-shadow: 0 8px 40px rgba(0,0,0,0.60)` on `#2D2D42`
- **Purple focus ring**: `box-shadow: 0 0 0 2px rgba(87,65,217,0.50)` on inputs

## Components

### Buttons
- **Primary**: `background: #5741D9`, `color: #FFFFFF`, `border-radius: 6px`, `padding: 12px 24px`, `font: Inter 14px 700`
- **Hover**: `background: #4633B8`
- **Buy Button**: `background: #00C853`, `color: #000000`, `border-radius: 4px`
- **Sell Button**: `background: #FF3D57`, `color: #FFFFFF`, `border-radius: 4px`
- **Ghost**: `border: 1px solid rgba(255,255,255,0.15)`, `color: #E8E8F0`, `background: transparent`
- **Tab Active**: bottom border `2px solid #5741D9`, text `#FFFFFF`, no fill

### Cards & Containers
- **Panel Card**: `background: #242435`, `border-radius: 8px`, `border: 1px solid rgba(255,255,255,0.07)`
- **Order Book Container**: 0 border-radius, full-bleed within panel, monospace rows
- **Chart Container**: `background: #1C1C28`, `border-radius: 4px`
- **Modal**: `background: #2D2D42`, `border-radius: 12px`, `box-shadow: 0 8px 40px rgba(0,0,0,0.60)`

## Do's and Don'ts

### Do
- Use DM Mono for every number that users compare side-by-side
- Color gains green and losses red consistently — never swap these conventions
- Keep border-radius ≤ 8px — rounding above this breaks the professional aesthetic
- Maintain separator opacity at 0.07 — higher makes the dark UI feel cluttered
- Show trading pair 24h change % in colored type inline with the price

### Don't
- Don't use white backgrounds — even modals stay on the dark surface palette
- Don't animate price tickers with heavy transitions — subtle 150ms color flash only
- Don't round order book rows — 0px radius is intentional
- Don't use purple for gain/loss coloring — reserve it strictly for brand/CTA

## Responsive Behavior

Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (pro wide)

- **375px**: single panel at a time; tab bar switches between Chart / Order Book / Trade
- **768px**: 2-panel split: chart left, order book right
- **1024px**: 3-panel layout: order book | chart | trade ticket
- **1440px**: full pro layout with depth chart + extended order history

## Agent Prompt Guide

### Quick Color Reference
- Brand: `#5741D9`
- Background: `#1C1C28`
- Card: `#242435`
- Text: `#E8E8F0`
- Gain: `#00C853`
- Loss: `#FF3D57`

### Example Component Prompts
- "An order book panel with #242435 background, 8px radius, DM Mono 12px tabular rows, gain green asks and loss red bids, 4px row padding, 1px rgba(255,255,255,0.07) separator"
- "A primary trade CTA button with #5741D9 background, white Inter text 14px bold, 6px radius, hover #4633B8"
- "A live price display using DM Mono 36px semibold, colored green if positive, red if negative, with 24h change % badge to the right"
