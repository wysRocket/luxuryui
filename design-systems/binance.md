---
name: Binance
colors:
  neutral: "#0B0E11"
  tertiary: "#F0B90B"
  primary: "#0B0E11"
typography:
  page-title:
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32
  h2:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22
  h3:
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20
  label:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16
rounded:
  sm: 2px
  md: 4px
  lg: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
---

## Overview

Binance is pure trading-desk power: data-dense, dark-first, and unapologetically complex. The signature yellow (`#F0B90B`) on a near-black background (`#0B0E11`) creates a visual combination that reads financial confidence and technical authority — the color of gold against a midnight terminal. This is not a consumer-friendly simplification of crypto; it's the real thing, and the UI says so.

The layout philosophy is maximum information density within a structured hierarchy. The trading view is a professional-grade multi-panel layout: order book on the left, chart in the center, trade history on the right, with order entry below. Every surface is dark gray at varying elevations — `#1E2329` for primary panels, `#2B3139` for secondary areas — creating a layered terminal aesthetic. Roboto is the typeface: neutral, engineered, screen-optimized, and legible at the 12–13px sizes that the data-dense tables require.

Yellow is the action color: CTAs, active tab indicators, highlighted prices, navigation selected states. Green (`#0ECB81`) means "buy" and "price up"; red (`#F6465D`) means "sell" and "price down." This buy/sell color convention is so deeply embedded in the Binance user's muscle memory that it must never be violated. Every price, every candle, every order is filtered through this two-color semantic system.

**Key Characteristics:**
- Background: `#0B0E11` (near-black)
- Panel surface: `#1E2329`
- Secondary surface: `#2B3139`
- Brand yellow: `#F0B90B`
- Buy green: `#0ECB81`
- Sell red: `#F6465D`
- Text primary: `#EAECEF`
- Text secondary: `#848E9C`
- Font: Roboto throughout
- Border: `#2B3139` (panel separation)

## Colors

### Primary
- **Binance Yellow** (`#F0B90B`): Brand, primary CTAs, active tabs, selected nav, highlights
- **Near Black** (`#0B0E11`): Root background, page canvas
- **Panel Dark** (`#1E2329`): Primary panel and card surfaces
- **Panel Mid** (`#2B3139`): Secondary surfaces, table row alternates, dividers

### Interactive
- **Yellow Hover** (`#D4A009`): CTA button hover — 12% darker
- **Yellow Focus Ring** (`rgba(240,185,11,0.4)`): Input and control focus
- **Row Hover** (`rgba(255,255,255,0.04)`): Table row hover background

### Surface
- **Background** (`#0B0E11`): Page root
- **Surface 1** (`#1E2329`): Cards, panels, modals
- **Surface 2** (`#2B3139`): Inner sections, table headers, tabs
- **Divider** (`rgba(255,255,255,0.08)`): Panel separators, table dividers
- **Input Background** (`#2B3139`): Form inputs and search fields

## Typography

### Font Families
- **Roboto**: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — all UI, monospace numbers in Roboto Mono for price data

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Page Title | Roboto | 24px | 700 | 32px | Dashboard section headers |
| H2 Panel Header | Roboto | 16px | 600 | 22px | "Order Book", "Recent Trades" |
| H3 Widget | Roboto | 14px | 600 | 20px | Panel sub-headers |
| Price (large) | Roboto Mono | 28px | 700 | 36px | Current market price — yellow or green/red |
| Price (table) | Roboto Mono | 13px | 400 | 18px | Order book prices — color-coded |
| Volume / Amount | Roboto Mono | 13px | 400 | 18px | `#848E9C` secondary |
| Table Header | Roboto | 12px | 500 | 16px | `#848E9C`, uppercase |
| Table Row | Roboto | 13px | 400 | 18px | `#EAECEF` default |
| Nav Link | Roboto | 14px | 500 | 20px | `#EAECEF`; active `#F0B90B` |
| Button | Roboto | 14px | 700 | 20px | CTA buttons |
| Badge / Tag | Roboto | 11px | 600 | 14px | Yellow / status tags |
| Caption | Roboto | 12px | 400 | 16px | `#848E9C` metadata |

## Layout

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32px
- Trading view panel gutter: 4px (ultra-tight)
- Dashboard card gutter: 12px

### Border Radius Scale
- Data table rows: 0px
- Input fields: 4px
- Buttons: 4px
- Cards (dashboard): 8px
- Modal: 8px
- Avatar: 50%
- Pill (tag): 2px

## Elevation & Depth

Binance uses border-based panel separation, not shadow:

**Primary panel:**
```
background: #1E2329;
border: 1px solid #2B3139;
border-radius: 4px;
```

**Secondary inner surface:**
```
background: #2B3139;
border-bottom: 1px solid rgba(255,255,255,0.08);
```

**Dropdown / context menu:**
```
background: #1E2329;
border: 1px solid #2B3139;
box-shadow: 0 4px 12px rgba(0,0,0,0.5);
```

**Modal:**
```
background: #1E2329;
border: 1px solid #2B3139;
box-shadow: 0 8px 32px rgba(0,0,0,0.6);
border-radius: 8px;
```

## Components

### Buttons
**Primary Buy:**
- Background: `#0ECB81`
- Border: none
- Border radius: 4px
- Padding: `10px 20px`
- Font: Roboto, 14px / 700 / `#FFFFFF`
- Hover: background `#09B574`, box-shadow `0 2px 8px rgba(14,203,129,0.3)`

**Primary Sell:**
- Background: `#F6465D`
- Border: none
- Border radius: 4px
- Same padding as Buy
- Hover: background `#D93B50`, box-shadow `0 2px 8px rgba(246,70,93,0.3)`

**Secondary (Yellow outline):**
- Background: `transparent`
- Border: `1px solid #F0B90B`
- Border radius: 4px
- Color: `#F0B90B`
- Hover: background `rgba(240,185,11,0.1)`

**Primary Brand (Register/Confirm):**
- Background: `#F0B90B`
- Border: none
- Border radius: 4px
- Color: `#1A1A1A` (dark text on yellow)
- Hover: background `#D4A009`

### Cards & Containers
**Trading Panel:**
- Background: `#1E2329`
- Border: `1px solid #2B3139`
- Border radius: 4px
- No box-shadow — border-based separation at this scale

**Dashboard Card / Asset Row:**
- Background: `#1E2329`
- Border radius: 8px
- Padding: 16px
- Hover: background `#2B3139`

## Do's and Don'ts

### Do
- Use green (`#0ECB81`) exclusively for "buy" and price increase — never for non-financial positive states
- Use red (`#F6465D`) exclusively for "sell" and price decrease
- Keep border radii tight (4px) on trading surfaces — professional terminal aesthetic
- Use Roboto Mono for all price and quantity data in tables
- Maintain the `#0B0E11` root background on all pages — no light surfaces in the trading UI

### Don't
- Don't use yellow (`#F0B90B`) for buy/sell buttons — that breaks the semantic color system
- Don't increase card border radius above 8px on trading panels — it looks consumer, not professional
- Don't add decorative shadows in the trading interface — border separation is the convention
- Don't use light backgrounds anywhere in the main app — Binance is dark-first always

## Responsive Behavior

Breakpoints:
- Mobile: 0–768px — simplified single-column view; full trading UI on dedicated app only
- Tablet: 769–1024px — 2-panel layout; order book collapses to tab
- Desktop: 1025–1440px — full 3-panel trading layout with chart, order book, trade history
- Wide: 1441px+ — panels expand; chart gains more real estate; sidebar stays fixed

## Agent Prompt Guide

### Quick Color Reference
- Background: `#0B0E11`
- Panel: `#1E2329`
- Brand Yellow: `#F0B90B`
- Buy Green: `#0ECB81`
- Sell Red: `#F6465D`
- Text Primary: `#EAECEF`
- Text Secondary: `#848E9C`
- Divider: `rgba(255,255,255,0.08)`

### Example Component Prompts
- "Binance order book panel: #1E2329 background, 1px #2B3139 border, 4px radius, table header in #848E9C Roboto 12px uppercase, price column in Roboto Mono 13px — green (#0ECB81) for bids, red (#F6465D) for asks, amount in #EAECEF"
- "Binance market price ticker: current BTC price in Roboto Mono 28px bold yellow (#F0B90B) or green/red, 24h change percentage badge, all on #1E2329 dark panel — dense, terminal-style"
- "Binance buy/sell order entry panel: #1E2329 background, side-by-side Buy button (#0ECB81) and Sell button (#F6465D), 4px radius, Roboto 14px bold white text, input fields in #2B3139 with yellow focus ring"
