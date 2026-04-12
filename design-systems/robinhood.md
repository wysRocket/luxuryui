# Design System Inspired by Robinhood

## 1. Visual Theme & Atmosphere

Robinhood's design language democratizes finance through radical visual simplicity. The signature green (`#00C805`) on white — or its dark-mode variant on deep charcoal (`#1B1B1B`) — creates an interface that feels optimistic, approachable, and distinctly un-bank-like. This is financial software designed to attract a generation that grew up with consumer apps, not brokerage firms. Every design decision strips away traditional finance UI complexity in favor of consumer-grade clarity.

The stock chart is the hero of the interface. Robinhood pioneered the full-width sparkline chart that fills the top half of every stock detail page, with a single colored line (green for positive performance, red for negative) and a gradient fill that reinforces the emotional character of the asset's movement. The line responds to swipe gestures, updating the price display in real-time as the finger drags — this interaction is Robinhood's signature innovation and the design system must support it at the forefront.

Typography historically used Snell Roundhand (a script typeface) for the wordmark — a deliberately approachable, human choice that differentiated from stiff financial serif brands. The app UI itself uses a clean system sans (SF Pro on iOS) with generous sizing that never feels cramped. Dark mode in `#1B1B1B` creates a premium trading terminal aesthetic for power users, while light mode remains the accessible onboarding default.

**Key Characteristics:**
- Signature green `#00C805` for positive performance, portfolio gains, primary CTAs
- Red `#FF5000` for negative performance, loss states, sell actions
- Clean white `#FFFFFF` light mode, deep charcoal `#1B1B1B` dark mode
- Full-width stock chart as primary UI element — green line on white/dark
- SF Pro (iOS) / Roboto (Android) for all UI text
- Gradient chart fill: green-to-transparent (positive), red-to-transparent (negative)
- Large portfolio balance display: 48px+ at top of home screen
- Minimal chrome — bottom tabs only, no persistent headers on stock pages

## 2. Color Palette & Roles

### Primary
- **Gain Green** (`#00C805`): Positive performance, gains, portfolio up, buy actions
- **Loss Red** (`#FF5000`): Negative performance, losses, portfolio down, sell actions
- **Charcoal Dark** (`#1B1B1B`): Dark mode base background
- **White** (`#FFFFFF`): Light mode base background

### Chart System
- **Chart Green Line** (`#00C805`): Positive performance chart line
- **Chart Red Line** (`#FF5000`): Negative performance chart line
- **Chart Green Fill** (`rgba(0, 200, 5, 0.10)`): Green gradient fill under positive chart
- **Chart Red Fill** (`rgba(255, 80, 0, 0.10)`): Red gradient fill under negative chart
- **Chart Crosshair** (`rgba(255,255,255,0.6)` on dark / `rgba(0,0,0,0.2)` on light): Scrub indicator

### Interactive
- **Green Hover** (`#00AA04`): Buy button hover darkening
- **Red Hover** (`#E04600`): Sell button hover
- **Green Alpha** (`rgba(0, 200, 5, 0.12)`): Selected watchlist item background

### Status
- **Positive Text** (`#00C805`): All positive percentage changes, gains display
- **Negative Text** (`#FF5000`): All negative percentage changes, losses
- **Neutral Gray** (`#888888`): Flat positions, unchanged values
- **Pending Blue** (`#2196F3`): Pending orders, processing states

### Neutrals (Light)
- **Text Primary** (`#111111`): Stock names, portfolio values
- **Text Secondary** (`#888888`): Tickers, metadata, shares count
- **Gray 100** (`#F5F5F5`): Section backgrounds, list separators
- **Gray 200** (`#E0E0E0`): Dividers, borders

### Neutrals (Dark)
- **Dark Base** (`#1B1B1B`): App background
- **Dark Surface** (`#252525`): Card backgrounds
- **Dark Card** (`#2C2C2C`): Elevated items
- **Dark Border** (`#333333`): Dividers
- **Dark Text Secondary** (`#888888`): Metadata on dark

## 3. Typography Rules

### Font Families
- **SF Pro Display**: `-apple-system, BlinkMacSystemFont, sans-serif` — iOS (primary)
- **Roboto**: `'Roboto', sans-serif` — Android / Web
- **Snell Roundhand**: `'Snell Roundhand', cursive` — Wordmark only, never in UI

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Portfolio Balance | SF Pro | 48px | 700 | 56px | Top of home screen |
| Balance Change | SF Pro | 18px | 500 | 24px | Green/red, below balance |
| Stock Price | SF Pro | 32px | 700 | 38px | Top of stock detail |
| Price Change | SF Pro | 16px | 500 | 22px | Green/red + percentage |
| Chart Hover Price | SF Pro | 24px | 700 | 30px | Live update during scrub |
| Stock Name | SF Pro | 22px | 600 | 28px | Full name on detail page |
| Ticker Symbol | SF Pro | 14px | 400 | 20px | Gray `#888888` |
| Watchlist Item | SF Pro | 16px | 600 | 22px | Stock name in list |
| Watchlist Price | SF Pro | 16px | 600 | 22px | Right-aligned |
| Shares / Position | SF Pro | 14px | 400 | 20px | Gray metadata |
| Button Label | SF Pro | 17px | 600 | 24px | Buy/Sell bold |
| Section Label | SF Pro | 13px | 600 | 18px | Uppercase, gray |
| Order Detail | SF Pro | 15px | 400 | 22px | Order confirmation text |

## 4. Component Stylings

### Buttons

**Buy Button (Green)**
```
background: #00C805
color: #FFFFFF
font: SF Pro 17px 600
padding: 16px 32px
border-radius: 50px (pill)
border: none
width: 100% (mobile)
hover: background #00AA04
shadow: 0 3px 12px rgba(0, 200, 5, 0.30)
transition: all 200ms ease
```

**Sell Button (Red)**
```
background: #FF5000
color: #FFFFFF
border-radius: 50px
padding: 16px 32px
font: SF Pro 17px 600
hover: background #E04600
shadow: 0 3px 12px rgba(255, 80, 0, 0.30)
```

**Split Buy/Sell Row**
```
layout: Buy button left 48% | gap 4% | Sell button right 48%
both: 50px height, 50px border-radius
```

### Cards & Containers

**Portfolio Summary**
```
background: #FFFFFF (light) / #1B1B1B (dark)
padding: 24px 20px 0 20px
balance: 48px 700, full-width centered
change: 18px 500, green/red below
chart: full-width below text, no horizontal margin
```

**Stock Chart**
```
width: 100vw (edge-to-edge)
height: 180px (summary) / 280px (detail)
line: #00C805 (positive) / #FF5000 (negative), 2px stroke
fill: gradient rgba(green/red, 0.10) to transparent bottom
background: transparent (inherits screen bg)
scrub: vertical hairline + price update on touch
time filters: 1D | 1W | 1M | 3M | 1Y | ALL — pills below chart
```

**Watchlist Row**
```
background: #FFFFFF (light) / #252525 (dark)
padding: 16px 20px
height: 64px
layout: company-name left (16px 600) | mini-chart center 80px | price+change right
change: 14px, green or red colored percentage
border-bottom: 1px solid #F5F5F5 (light) / #333333 (dark)
```

**Position Card**
```
background: #FFFFFF
padding: 16px 20px
position data: shares held, average cost, total return
return: green (positive) / red (negative), 16px bold
chart: small sparkline 60px right
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px
- Horizontal margin: 20px standard
- Chart: 0 margin (full-bleed)
- Touch targets: 48px minimum
- Section spacing: 32px

### Border Radius Scale
- `8px` — Time filter pills, chips
- `12px` — Cards, modals (light radius)
- `50px` — All buttons (pill)
- `50%` — Stock icon circles

### Grid
- Mobile: Single column, 20px margins
- Stock detail: full-bleed chart, content below
- Watchlist: single column list
- Web: max-width 480px centered (mobile-first)

## 6. Depth & Elevation

```
Level 0 - Background: #FFFFFF (light) / #1B1B1B (dark)
Level 1 - Card:       0 1px 0 #F5F5F5 (border-bottom only)
Level 2 - Modal:      0 8px 32px rgba(0,0,0,0.20)
Level 3 - Bottom Sheet: 0 -4px 24px rgba(0,0,0,0.15)
Buy/Sell buttons:     0 3px 12px rgba(0,200,5,0.30) or red variant
Robinhood avoids decorative shadows — flat, clean surfaces
```

## 7. Do's and Don'ts

### Do
- Use `#00C805` exclusively for gains, buy actions, and positive states
- Use `#FF5000` exclusively for losses, sell actions, and negative states
- Make the stock chart full-bleed (100vw) — it's the primary UI affordance
- Display portfolio balance at 48px+ — the financial data is the centerpiece
- Support chart scrubbing interaction — drag to reveal historical price points
- Use pill buttons (`border-radius: 50px`) for all Buy/Sell actions

### Don't
- Don't use green for decorative elements — it must always mean "gain/buy"
- Don't use red for errors unrelated to financial loss — keep red=financial-negative
- Don't add heavy shadows or gradients to non-chart UI elements
- Don't display complex order types prominently — simplicity is the brand promise

## 8. Responsive Behavior

**Breakpoints:**
- `390px` — Primary mobile (iPhone, full-screen charts)
- `430px` — iPhone Pro Max: slightly larger balance text
- `768px` — Tablet/browser: 2-column watchlist + chart
- `1024px` — Desktop: portfolio sidebar + main chart view
- `1440px` — Wide desktop: expanded dashboard layout

**Adaptive Patterns:**
- Chart: 180px summary → 280px detail mobile → 400px desktop
- Balance: 48px mobile → 64px desktop
- Buttons: full-width mobile → auto side-by-side desktop
- Watchlist: list mobile → table with sortable columns desktop

## 9. Agent Prompt Guide

### Quick Color Reference
```
Gain Green:      #00C805   — positive, portfolio up, buy
Loss Red:        #FF5000   — negative, portfolio down, sell
Dark Base:       #1B1B1B   — dark mode background
Dark Surface:    #252525   — dark mode cards
Text Primary:    #111111   — light mode text
Gray Meta:       #888888   — tickers, shares, metadata
```

### Example Component Prompts
- "A Robinhood portfolio home: white background, '$ 12,847.23' 48px 700 centered, '+$234.18 (1.85%)' 18px green below, full-bleed green stock chart 180px below the balance"
- "A Robinhood stock watchlist row: 64px height, company name 16px 600 left, 80px sparkline center green, price 16px bold right + percentage green below, thin bottom divider"
- "A Robinhood Buy pill button: green `#00C805` full-width, white SF Pro 17px 600, 50px border-radius, green glow shadow, matching red Sell button side-by-side"
- "A Robinhood stock detail chart: full-width 280px, green `#00C805` 2px line on white, green gradient fill rgba(0,200,5,0.10) to transparent, time filter pills below: 1D 1W 1M 3M 1Y ALL"
