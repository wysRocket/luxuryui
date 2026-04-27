---
name: StockX
colors:
  neutral: "#FFFFFF"
  secondary: "#666666"
  primary: "#000000"
  tertiary: "#6BC73A"
rounded:
  sm: 2px
  md: 4px
  lg: 8px
---

## Overview

StockX's design is the visual language of financial markets applied to sneaker culture — precise, data-driven, and built for high-stakes decision-making. The white and black palette is deliberately neutral and authoritative: StockX wants you to trust the data, not be seduced by branding. Every pixel serves the bidding interface: current ask, current bid, last sale, price history charts. The interface must communicate market authority.

The neon green (`#85E04A`) is a calculated choice — it reads as "go," "live," "bid now" in the same way stock market green signals upward movement. Used exclusively for live bid prices, upward price movements, and primary purchase CTAs, this green is the only warm accent in an otherwise monochromatic system. Red (`#E84040`) serves as the bear market inverse: downward price movement, asks higher than bids, caution states.

Typography is bold and condensed — the typeface choices skew towards heavy weights and tight tracking, echoing streetwear's relationship with athletic and utility typography (Helvetica Condensed, Impact-adjacent typefaces for product names). Data density is very high: multiple prices, sizes, conditions, and market statistics must coexist without hierarchy confusion. The result is a design language that feels like a Bloomberg terminal wearing a Supreme box logo.

**Key Characteristics:**
- Primary canvas: `#FFFFFF` (white) — product pages, grid
- Dark accent: `#000000` (black) — navigation, key UI, primary text
- Neon green: `#85E04A` — live bid price, buy button, price up indicator
- Market red: `#E84040` — ask above bid, price down, alert
- Price grid: dense table with alternating `#FFFFFF` / `#F8F8F8` rows
- Bold condensed font: Helvetica Neue Condensed / custom display at heavy weights
- Border radius: near-zero (2–4px max) — market data tables use 0px radius
- Bid/Ask spread displayed prominently — always show both sides

## Colors

### Primary
- **Black** (`#000000`): Navigation bar, primary text, logo, dark CTA variant
- **White** (`#FFFFFF`): Page canvas, product cards, background
- **Off-White** (`#F8F8F8`): Alternating table rows, secondary card surface

### Market Accent
- **Neon Green** (`#85E04A`): Live bid price, buy CTA, price increase, "In Stock" indicator
- **Green Dark** (`#6BC73A`): Hover state on green buttons
- **Market Red** (`#E84040`): Ask price (seller), price decrease, high-ask warning
- **Red Light** (`#FFEDED`): Price down background tint on data cells

### Interactive
- **Black Button Hover** (`#222222`): Hover on dark buttons
- **Green Button Hover** (`#6BC73A`): Hover on bid/buy buttons
- **Gray 1** (`#F8F8F8`): Secondary surface, table row alternate
- **Gray 2** (`#EEEEEE`): Borders, dividers
- **Gray 3** (`#999999`): Metadata, disabled states
- **Gray 4** (`#666666`): Secondary text

### Text
- **Primary** (`#000000`): Product names, prices, data, headings
- **Secondary** (`#666666`): Labels, descriptions, metadata
- **Tertiary** (`#999999`): Captions, timestamps, supplementary
- **Green Price** (`#85E04A`): Last sale up, bid price
- **Red Price** (`#E84040`): Ask price, last sale down

## Typography

### Font Families
- **Helvetica Neue Condensed Bold**: `'Helvetica Neue Condensed', 'Arial Narrow', sans-serif` — Product names, price displays, key headers
- **Helvetica Neue**: `'Helvetica Neue', Helvetica, Arial, sans-serif` — Body text, labels, data tables
- **Tabular Numbers**: Always use tabular (monospaced) numerals for prices to align columns

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Product Name | Helvetica Neue Condensed | 32px | 700 | 38px | PDP hero, condensed tracking -0.5px |
| SKU / Style Code | Helvetica Neue | 14px | 400 | 20px | Product page subtitle, gray |
| Live Bid Price | Helvetica Neue | 36px | 700 | 44px | Current bid in green, tabular nums |
| Ask Price | Helvetica Neue | 36px | 700 | 44px | Current ask in red/black, tabular |
| Last Sale | Helvetica Neue | 28px | 700 | 36px | Last transaction price |
| Price Change | Helvetica Neue | 16px | 700 | 22px | "+$30 (4.2%)" with green/red |
| Table Header | Helvetica Neue | 12px | 700 | 16px | Column headers, uppercase |
| Table Data | Helvetica Neue | 13px | 400 | 18px | Bid/ask table rows, tabular nums |
| Card Price | Helvetica Neue | 16px | 700 | 22px | Grid card price |
| Navigation | Helvetica Neue | 14px | 500 | 20px | Nav links |
| Size Selector | Helvetica Neue | 14px | 700 | 20px | Size buttons |
| Badge | Helvetica Neue | 11px | 700 | 14px | "VERIFIED", "LOWEST ASK" — uppercase |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px`
- Product grid gap: `16px`
- Card padding: `16px`
- Data table cell padding: `10px 12px`
- Page horizontal margin: `16px` mobile, `40px` desktop

### Grid
- Product grid: 2-column (mobile) → 3 (sm) → 4 (md) → 5 (lg)
- PDP: split layout — 60% image left, 40% bid/ask right on desktop
- Max-width: `1440px`

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Data tables, bid/ask grids |
| `--radius-xs` | 2px | Tags, tiny chips |
| `--radius-sm` | 4px | Buttons, cards, filters |
| `--radius-md` | 8px | Modals |

## Elevation & Depth

StockX uses minimal elevation — the market data speaks for itself:

- **Flat** (page): `#FFFFFF` — no shadow
- **Card default**: `border: 1px solid #EEEEEE` — border-only elevation
- **Card hover**: `box-shadow: 0 4px 16px rgba(0,0,0,0.12)` — mouse hover
- **Sticky nav**: `box-shadow: 0 2px 8px rgba(0,0,0,0.1)` — top navigation when scrolled
- **Modal**: `box-shadow: 0 8px 32px rgba(0,0,0,0.2)` + `rgba(0,0,0,0.5)` backdrop
- **Tooltip**: `background: #000000`, `box-shadow: 0 4px 12px rgba(0,0,0,0.2)`

## Components

### Buttons
**Buy / Place Bid (Primary)**
- Background: `#85E04A`
- Text: `#000000`, weight 700, 16px, uppercase, letter-spacing `1px`
- Border-radius: `4px`
- Padding: `14px 32px`
- Hover: `background: #6BC73A`
- Width: typically full-width on mobile, fixed 240px on desktop

**Sell / Place Ask (Secondary)**
- Background: `#000000`
- Text: `#FFFFFF`, weight 700, 16px, uppercase
- Border-radius: `4px`
- Padding: `14px 32px`
- Hover: `background: #222222`

**Size Button (toggle)**
- Default: `border: 1px solid #EEEEEE`, bg `#FFFFFF`, text `#000000` weight 700 14px
- Selected: `border: 2px solid #000000`, bg `#000000`, text `#FFFFFF`
- Out of stock: `background: #F8F8F8`, text `#CCCCCC`, cursor not-allowed, strikethrough
- Border-radius: `4px`
- Size: 48px × 48px

**Ghost Filter Button**
- Border: `1px solid #EEEEEE`
- Background: `#FFFFFF`
- Text: `#000000` 13px weight 500
- Border-radius: `4px`
- Active: `border-color: #000000`, weight 700

### Cards & Containers
**Product Grid Card**
- Background: `#FFFFFF`
- Border: `1px solid #EEEEEE`
- Border-radius: `4px`
- Image: square 1:1 object-fit contain, padded 16px
- Bottom: product name Helvetica Neue Condensed 14px black, "Lowest Ask" in gray 12px, price in black 16px weight 700
- Hover: `box-shadow: 0 4px 16px rgba(0,0,0,0.12)`, `border-color: #CCCCCC`

**Bid/Ask Data Table**
- Header: `#F8F8F8`, text uppercase 12px weight 700 `#000000`
- Rows: alternating `#FFFFFF` / `#F8F8F8`, `border-bottom: 1px solid #EEEEEE`
- Price column: tabular numerals, bid in `#85E04A`, ask in `#E84040`
- Border-radius: 0 (sharp data table)

**Price History Chart**
- Background: `#FFFFFF`
- Grid lines: `#EEEEEE`, 1px horizontal
- Line: `#000000` 2px stroke
- Data points: 5px circle `#000000`
- Hovered: tooltip with bg `#000000` text white
- Area fill: `rgba(133,224,74,0.1)` under price line

**Price Change Indicator**
- Up: `#85E04A` bg light `rgba(133,224,74,0.1)`, text `#85E04A`, "▲ $30 (4.2%)"
- Down: `#E84040` bg light `rgba(232,64,64,0.1)`, text `#E84040`, "▼ $20 (2.8%)"
- Border-radius: `4px`, padding `4px 8px`

## Do's and Don'ts

### Do
- Show both bid AND ask prices simultaneously — StockX is a two-sided market
- Use `#85E04A` green exclusively for buyer-side prices and CTAs — it means "go"
- Display price change with both absolute ($) and percentage (%) in the same indicator
- Use tabular numerals (monospaced) for all price columns to enable clean alignment
- Bold all size selectors and apply 48×48px minimum touch targets

### Don't
- Never use green for anything other than bid prices and upward movement — it has a single meaning
- Don't add border-radius over 4px to cards or buttons — StockX is angular and market-serious
- Avoid decorative gradients or drop shadows on product images — clean white background only
- Don't truncate sneaker product names — full product title + colorway is always shown
- Avoid loading charts lazily — price data must appear synchronously with the product page

## Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — 2-column product grid, stacked PDP (image above bid/ask)
- `sm`: 480px–768px — 3-column grid, compact filters
- `md`: 768px–1024px — 4-column grid, split PDP layout begins
- `lg`: 1024px–1440px — 5-column grid, full PDP split + bid table
- `xl`: 1440px+ — max-width 1440px centered

**PDP layout:** Stacked on mobile; side-by-side 60/40 split at `≥768px`

## Agent Prompt Guide

### Quick Color Reference
- White canvas: `#FFFFFF`
- Black primary: `#000000`
- Bid green: `#85E04A`
- Ask red: `#E84040`
- Card border: `#EEEEEE`
- Secondary text: `#666666`

### Example Component Prompts
- "StockX-style product card: white background #FFFFFF, border 1px #EEEEEE, 4px radius, square product image (sneaker) with white padding bg, product name in Helvetica Neue Condensed 14px black below, 'Lowest Ask' in #999999 12px, price '$245' in Helvetica Neue 16px #000000 weight 700, hover box-shadow 0 4px 16px rgba(0,0,0,0.12)"
- "Bid/Ask display panel: two columns side by side, left column 'Current Bid' label 12px uppercase #666666, price '$220' in Helvetica Neue 36px #85E04A weight 700 below; right column 'Lowest Ask' label, price '$245' in #E84040 36px weight 700; separator line 1px #EEEEEE between"
- "Size selector grid: 5-column grid of 48×48px buttons, border 1px #EEEEEE bg white text #000000 14px weight 700, selected state border 2px #000000 bg #000000 text white, out-of-stock bg #F8F8F8 text #CCCCCC"
