# Design System Inspired by Reuters

## 1. Visual Theme & Atmosphere

Reuters' design language is rooted in journalism's oldest virtues: clarity, speed, and authority. The brand orange (`#FF8000`) cuts through noise with the visual urgency of a breaking news ticker — it signals immediacy, importance, and the wire-service DNA that has defined Reuters for 170 years. Against a dark navy editorial palette (`#001440` / `#0A2240`), the orange vibrates with the energy of live information, while deep backgrounds evoke the seriousness of global financial and geopolitical news coverage.

The typographic system is dense and intentional. The Reuters Slab typeface (a custom slab-serif commissioned for the brand) gives headlines their distinctive editorial authority — thick strokes, tight tracking, and a slightly condensed rhythm that packs maximum information into minimum vertical space. Body text uses a highly legible transitional serif for article reading. Data visualization — market tickers, financial charts, economic indicators — uses a monospace family for numerical precision and a clean, Bloomberg-esque chart aesthetic.

Layout principles favor information density over decoration. The editorial grid packs multiple stories at multiple hierarchical levels, reflecting the news wire's aggregate model. Breaking news banners interrupt the natural scroll with orange urgency. Market data tickers scroll persistently. The overall atmosphere says: this is where the news happens first, presented without editorial embellishment.

**Key Characteristics:**
- Reuters orange `#FF8000` for breaking news, CTAs, active states, live indicators
- Dark navy `#001440` for editorial surfaces, headers, section backgrounds
- Reuters Slab custom typeface for all display/headline text
- Transitional serif (Georgia) for article body text
- Roboto Mono for market tickers, financial data, timestamps
- Dense editorial grid: multiple story tiers, no wasted white space
- Live indicator: pulsing orange dot + "LIVE" badge for real-time content
- Market data strip: persistent top or bottom, dark bg, green/red price moves

## 2. Color Palette & Roles

### Primary
- **Reuters Orange** (`#FF8000`): Breaking news, live indicators, primary CTAs, brand
- **Deep Navy** (`#001440`): Editorial headers, section backgrounds, dark surfaces
- **Dark Blue** (`#0A2240`): Secondary dark surface, card backgrounds on dark theme

### Editorial
- **White** (`#FFFFFF`): Article backgrounds, body text on dark, card faces
- **Off White** (`#F8F8F6`): Page background — slightly warm, newsprint reference
- **Light Gray** (`#EBEBEB`): Section separators, dividers, rule lines

### Data / Market
- **Market Green** (`#1A9B48`): Positive price moves, percentage gains
- **Market Red** (`#D4361A`): Negative price moves, percentage losses
- **Neutral Gray** (`#6B6B6B`): Flat market data, unchanged values

### Breaking / Live
- **Live Orange** (`#FF8000`): Live badge background
- **Live Text** (`#FFFFFF`): White text on orange live badge
- **Breaking Banner** (`#FF8000`): Full-width breaking news banner background
- **Breaking Border** (`rgba(255, 128, 0, 0.40)`): Orange left border on breaking stories

### Neutrals
- **Text Black** (`#1A1A1A`): Headline text on white backgrounds
- **Text Dark Navy** (`#001440`): Display text on editorial surfaces
- **Text Medium** (`#4A4A4A`): Body text, descriptions
- **Text Light** (`#6B6B6B`): Meta information, captions, bylines
- **Gray 300** (`#C0C0C0`): Decorative dividers, subtle borders

### Interactive
- **Orange Hover** (`#E67200`): CTA button hover
- **Orange Dark** (`#CC6600`): Active/pressed state
- **Navy Link** (`#003399`): Inline article links (light mode)
- **Orange Link** (`#FF8000`): Interactive links on dark surfaces

## 3. Typography Rules

### Font Families
- **Reuters Slab (Custom)**: `'Reuters Slab', 'Rockwell', 'Courier New', serif` — All headlines, section titles, display text
- **Georgia**: `Georgia, 'Times New Roman', serif` — Article body, long-form reading
- **Roboto Mono**: `'Roboto Mono', 'Courier New', monospace` — Market data, tickers, timestamps, financial figures
- **Roboto**: `'Roboto', sans-serif` — Navigation, UI labels, captions

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Breaking Banner | Reuters Slab | 18px | 700 | 24px | White on orange, uppercase |
| Lead Headline | Reuters Slab | 36px | 700 | 42px | Dark navy, tight tracking |
| Section Headline | Reuters Slab | 26px | 700 | 32px | Dark, category pages |
| Card Headline (L) | Reuters Slab | 22px | 700 | 28px | Top story card |
| Card Headline (M) | Reuters Slab | 17px | 600 | 23px | Secondary story |
| Card Headline (S) | Reuters Slab | 15px | 600 | 20px | Tertiary, brief items |
| Body Article | Georgia | 18px | 400 | 1.7 | Long-form reading |
| Byline / Author | Roboto | 13px | 600 | 18px | Gray `#6B6B6B`, uppercase |
| Section Label | Roboto | 11px | 700 | 14px | Orange `#FF8000`, uppercase |
| Timestamp | Roboto Mono | 12px | 400 | 16px | Gray `#6B6B6B` |
| Market Ticker | Roboto Mono | 14px | 500 | 20px | White on dark |
| Price Change | Roboto Mono | 14px | 700 | 20px | Green or red |
| Navigation | Roboto | 14px | 500 | 20px | Dark navy or white |

## 4. Component Stylings

### Buttons

**Primary CTA (Orange)**
```
background: #FF8000
color: #FFFFFF
font: Roboto 14px 700 uppercase tracking 0.5px
padding: 12px 24px
border-radius: 2px (near-flat — editorial precision)
border: none
hover: background #E67200
transition: background 150ms ease
```

**Secondary / Ghost**
```
background: transparent
color: #FF8000
border: 1.5px solid #FF8000
padding: 10px 22px
border-radius: 2px
hover: background rgba(255,128,0,0.08)
```

**Subscribe Button**
```
background: #001440
color: #FFFFFF
border-radius: 2px
padding: 12px 24px
font: Roboto 14px 700 uppercase
hover: background #0A2240
```

### Cards & Containers

**Lead Story Card**
```
background: #FFFFFF
border-radius: 0 (editorial — no radius)
border-bottom: 2px solid #FF8000 (orange accent top or bottom)
image: top, 16:9 aspect ratio
section-label: orange uppercase 11px above headline
headline: Reuters Slab 22px 700
byline: gray 13px below headline
```

**Breaking News Banner**
```
background: #FF8000
width: 100vw
padding: 10px 20px
layout: "BREAKING" badge left | headline text | timestamp right
font: Reuters Slab 18px 700 white
animation: slide-in from top on new content
```

**Market Data Ticker**
```
background: #001440
height: 36px
display: flex horizontal scroll
item: symbol | price | change (±%) | arrow icon
font: Roboto Mono 13px
colors: white symbol / gray price / green-red change
animation: continuous scroll loop 30s linear
```

**Story Grid (Editorial)**
```
Lead: full-width or 2/3 width, large image
Secondary: side-by-side 1/2 width, medium image
Brief items: text-only list, 1px bottom border, orange left border on breaking
padding: 0 (edge grid layout, internal padding per card)
```

**Live Badge**
```
background: #FF8000
color: #FFFFFF
font: Roboto 11px 700 uppercase
padding: 3px 8px
border-radius: 2px
pulse dot: white 6px circle, opacity 1→0.3 1s ease-in-out infinite
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px
- Article content max-width: 720px
- Page margins: 16px mobile, 24px tablet, 40px desktop
- Editorial grid: 12-column CSS grid
- Story gap: 1px solid #EBEBEB (tight — news density)
- Section spacing: 32px between sections

### Border Radius Scale
- `0px` — All editorial containers, cards, buttons (flat = authoritative)
- `2px` — Minimal radius for UI controls (badges, chips)
- `4px` — Dropdown menus, tooltips
- Reuters uses minimal border-radius throughout for editorial authority

### Grid
- Mobile: Single column, 16px margins
- Tablet: 2-column grid, 24px margins
- Desktop: 12-column grid, max-width 1440px, 40px margins
- Article: centered 720px max-width column

## 6. Depth & Elevation

```
Level 0 - Flat:   #F8F8F6 background, no shadow (editorial flat design)
Level 1 - Card:   1px border #EBEBEB only, no shadow
Level 2 - Nav:    0 2px 4px rgba(0,0,0,0.10)
Level 3 - Modal:  0 4px 20px rgba(0,0,0,0.20)
Level 4 - Ticker: 0 2px 8px rgba(0,20,64,0.30)
Reuters avoids shadows in editorial content — flat authority
```

## 7. Do's and Don'ts

### Do
- Use `#FF8000` orange for breaking news and live content — it signals urgency
- Keep border-radius at 0–2px for editorial containers — flatness equals authority
- Display section labels in orange uppercase above every headline
- Use Reuters Slab for all display and headline text — it carries the brand voice
- Show market data tickers persistently — financial data is Reuters core product
- Apply tight line heights (1.15–1.3) to headlines for dense editorial rhythm

### Don't
- Don't use orange for decorative purposes — it must always signal urgency/action
- Don't add rounded corners to editorial cards or story containers
- Don't use light typography weights for headlines — bold/700 minimum for authority
- Don't pad the editorial grid generously — information density is the editorial value

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — Mobile: single column, full-width stories
- `640px` — Large mobile: 2-column brief items
- `768px` — Tablet: 2-column grid, side-by-side lead stories
- `1024px` — Desktop: 3-column or 12-column grid, persistent sidebar
- `1440px` — Wide: max-width 1440px, lateral whitespace fills remainder

**Adaptive Patterns:**
- Lead headline: 36px desktop → 26px tablet → 22px mobile
- Market ticker: scrolling horizontal (mobile) → persistent bar (desktop)
- Breaking banner: stacked (mobile) → horizontal inline (desktop)
- Article: full-width (mobile) → 720px centered (desktop)

## 9. Agent Prompt Guide

### Quick Color Reference
```
Reuters Orange:  #FF8000   — breaking news, live, CTAs
Deep Navy:       #001440   — editorial dark surfaces
Market Green:    #1A9B48   — positive price moves
Market Red:      #D4361A   — negative price moves
Text Dark:       #1A1A1A   — headlines on white
Off White:       #F8F8F6   — page background
```

### Example Component Prompts
- "A Reuters breaking news banner: full-width orange `#FF8000` background, white Reuters Slab 18px bold 'BREAKING: Headline text', LIVE pulse dot left, timestamp Roboto Mono right"
- "A Reuters story card: no border-radius, orange section label 11px uppercase above, Reuters Slab 22px 700 headline, gray byline below, 16:9 image top, 1px bottom border"
- "A Reuters market data ticker: dark navy `#001440` bar 36px height, Roboto Mono 13px: white symbol | gray price | green/red percentage change, continuously scrolling"
- "A Reuters LIVE badge: orange `#FF8000` background 2px radius, white uppercase 'LIVE' 11px bold, white pulsing dot left, used inline with breaking story headlines"
