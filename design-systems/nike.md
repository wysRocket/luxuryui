---
name: Nike
colors:
  neutral: "#FFFFFF"
  tertiary: "#757575"
  primary: "#111111"
  secondary: "#666666"
typography:
  body-md:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26
  label:
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18
    letterSpacing: 1px
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18
rounded:
  sm: 4px
  md: 8px
  lg: 30px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Nike's digital design language is a direct translation of the brand's physical identity: bold, uncompromising, athlete-first. The foundation is near-black (`#111111`) and pure white (`#FFFFFF`) — a palette that lets product photography and athlete imagery dominate without color competition. This is a brand that has nothing to prove through decoration; the products, the athletes, and the stories speak through full-bleed photography that extends edge-to-edge with no container constraints.

Typography is the secondary brand asset after the Swoosh. Trade Gothic Bold Condensed drives campaign and product headings with aggressive uppercase letterforms that reference the brand's print advertising legacy. Helvetica Neue provides the functional layer — clean, neutral, authoritative for product descriptions, pricing, and navigation. The combination of these two typefaces creates a dual personality: brand voice (aggressive, uppercase, condensed) and product voice (precise, measured, trustworthy).

The interface is deliberately minimal — a gallery for products and stories. Spacing is generous; white space is not empty but intentional. The cart and checkout flows strip back to pure utility, while editorial campaign pages lean into full-screen immersion. Nike.com exemplifies a brand whose digital product is indistinguishable from its advertising.

**Key Characteristics:**
- Black `#111111` + white `#FFFFFF` strict two-tone foundation
- Full-bleed photography: 100vw images, no container padding
- Trade Gothic Bold Condensed for display/campaign text — uppercase always
- Helvetica Neue for product names, descriptions, nav, utility text
- Generous white space: 80px+ section gaps on desktop
- Orange `#FA5400` used sparingly — sale tags, Member benefits, Nike By You
- Member Gold `#C9A84C` for NikePlus tier indicators
- Zero decorative borders or dividers — white space handles separation

## Colors

### Primary
- **Jet Black** (`#111111`): Nav, primary buttons, text, footer, CTAs
- **Pure White** (`#FFFFFF`): Product pages, card backgrounds, primary backgrounds
- **Nike Orange** (`#FA5400`): Sale callouts, Nike By You personalization, discount tags

### Brand Accents
- **Member Gold** (`#C9A84C`): NikePlus, member-exclusive pricing, loyalty tier
- **Victory Red** (`#D22630`): Sport collection accents, Jordan Brand integration
- **Sport Green** (`#2B703A`): Sustainable materials, Move to Zero collection

### Neutrals
- **Gray 800** (`#222222`): Heavy secondary text
- **Gray 600** (`#666666`): Descriptions, metadata, secondary labels
- **Gray 400** (`#999999`): Tertiary text, inactive states, placeholder
- **Gray 100** (`#F5F5F5`): Subtle surface, hover states, alternate rows
- **Off White** (`#FAFAFA`): Section backgrounds to differentiate from product white

### Interactive
- **Black Hover** (`#000000`): Button deepens to true black on hover
- **Link Gray** (`#757575`): Inline links, nav hover states
- **Red Alert** (`#E31837`): Error states, size-out-of-stock indicators

### Surface
- **Card Border** (`rgba(0,0,0,0.1)`): Subtle product card borders
- **Nav Shadow** (`rgba(0,0,0,0.15)`): Sticky nav elevation
- **Overlay Dark** (`rgba(0,0,0,0.6)`): Image overlay for text legibility

## Typography

### Font Families
- **Trade Gothic Bold Condensed**: `'Trade Gothic LT Std Bold Condensed', 'Impact', sans-serif` — Campaign headlines, product launch text, section heroes
- **Helvetica Neue**: `'Helvetica Neue', 'Arial', sans-serif` — Product names, descriptions, nav, utility
- **Nike Futura (Custom)**: Used in specific Jordan/Air Max campaigns

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Campaign Hero | Trade Gothic | 72px | Bold Condensed | 68px | Uppercase, negative tracking -1px |
| Hero Subhead | Trade Gothic | 48px | Bold Condensed | 48px | Uppercase |
| Section Title | Trade Gothic | 36px | Bold Condensed | 38px | Uppercase |
| Product Name | Helvetica Neue | 22px | 700 | 28px | Title case |
| Product Subname | Helvetica Neue | 16px | 400 | 22px | Gray `#666666` |
| Price | Helvetica Neue | 20px | 700 | 24px | Black, sale in orange |
| Body Copy | Helvetica Neue | 16px | 400 | 26px | Generous line height |
| Nav Item | Helvetica Neue | 15px | 500 | 20px | Uppercase, tracked +0.5px |
| Button Label | Helvetica Neue | 14px | 700 | 18px | Uppercase, tracked +1px |
| Caption | Helvetica Neue | 12px | 400 | 18px | Gray `#999999` |
| Sale Tag | Helvetica Neue | 13px | 700 | 16px | Orange `#FA5400`, uppercase |
| Legal/Fine | Helvetica Neue | 11px | 400 | 16px | Gray `#999999` |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 120px
- Section padding desktop: 80px vertical
- Product grid gap: 16px mobile, 24px desktop
- Page margins: 20px mobile, 40px tablet, 80px desktop (max-content 1440px)

### Border Radius Scale
- `0px` — Product cards, full-bleed editorial containers
- `4px` — Input fields, notification banners
- `8px` — Dropdown menus, tooltip bubbles
- `30px` — All buttons (pill is the Nike signature)
- `50%` — Avatar, circular icon elements

### Grid
- Mobile: 2-column product grid (flex), 20px margins
- Tablet: 3-column product grid, 40px margins
- Desktop: 4-column product grid, 80px margins, max-width 1440px
- Editorial: Full-bleed (0 margin) for hero and campaign sections

## Elevation & Depth

```
Level 0 - Flat:      no shadow (product cards, backgrounds)
Level 1 - Nav:       0 1px 0 rgba(0,0,0,0.1) (sticky nav bottom border only)
Level 2 - Drawer:    0 4px 20px rgba(0,0,0,0.15)
Level 3 - Modal:     0 8px 40px rgba(0,0,0,0.25)
Level 4 - Toast:     0 4px 12px rgba(0,0,0,0.20)
Nike avoids heavy shadows — depth through photography, not elevation
```

## Components

### Buttons

**Primary CTA (Black)**
```
background: #111111
color: #FFFFFF
font: Helvetica Neue 14px 700 uppercase tracking 1px
padding: 16px 32px
border-radius: 30px (pill — signature Nike shape)
border: none
width: auto (desktop) / 100% (mobile)
hover: background #000000, transform scale(1.01)
transition: all 180ms ease
```

**Secondary / Ghost**
```
background: transparent
color: #111111
border: 1px solid #111111
padding: 15px 31px
border-radius: 30px
hover: background #111111, color #FFFFFF
transition: all 200ms ease
```

**White Button (on dark surfaces)**
```
background: #FFFFFF
color: #111111
border-radius: 30px
padding: 16px 32px
hover: background #F5F5F5
```

**Member Button (Gold)**
```
background: #C9A84C
color: #111111
border-radius: 30px
padding: 16px 32px
font: Helvetica Neue 14px 700 uppercase
```

### Cards & Containers

**Product Card**
```
background: #FFFFFF
border-radius: 0 (flat — Nike avoids heavy radius on product cards)
padding: 0 (image edge-to-edge) + 12px content padding
hover: .product-image transform scale(1.03) 300ms ease
badge: absolute top-left, background #FA5400, text 11px 700 white uppercase
```

**Editorial / Campaign Card**
```
width: 100% (full-bleed image)
overlay: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)
text: white Trade Gothic on gradient
no border, no border-radius
```

**Filter Chip**
```
background: #FFFFFF
border: 1px solid #CCCCCC
border-radius: 30px
padding: 8px 16px
font: Helvetica Neue 13px 500
active: background #111111, color white, border transparent
```

## Do's and Don'ts

### Do
- Use full-bleed photography as primary UI element — images should touch screen edges
- Apply pill border-radius (`30px`) exclusively to buttons — it's the brand signature
- Keep Trade Gothic UPPERCASE always — lowercase Trade Gothic breaks brand voice
- Use white space generously — 80px+ section gaps on desktop convey premium
- Limit orange `#FA5400` to sale/promotional contexts only — not decorative
- Design for athlete imagery first: high-contrast text treatments over dark image overlays

### Don't
- Don't add heavy card shadows — Nike uses minimal depth, photography creates hierarchy
- Don't mix Trade Gothic and Helvetica Neue in the same text block
- Don't use decorative borders or dividers — white space separates sections
- Don't add color beyond black, white, and orange in standard product UI

## Responsive Behavior

**Breakpoints:**
- `390px` — Mobile (iPhone): 2-column grid, stacked nav
- `640px` — Large mobile: hamburger menu
- `768px` — Tablet: 3-column grid, horizontal nav visible
- `1024px` — Desktop: 4-column grid, mega-menu nav
- `1440px` — Max-width content container
- `1920px` — Full-bleed editorial (images scale to viewport)

**Adaptive Patterns:**
- Hero text: 72px desktop → 48px tablet → 32px mobile Trade Gothic
- Product grid: 4-col → 3-col → 2-col
- Nav: full mega-menu → hamburger on mobile
- CTA buttons: fixed-width desktop → 100% mobile

## Agent Prompt Guide

### Quick Color Reference
```
Jet Black:       #111111   — primary, buttons, text
Pure White:      #FFFFFF   — backgrounds, product cards
Nike Orange:     #FA5400   — sale only, promotions
Member Gold:     #C9A84C   — NikePlus tier highlights
Gray Text:       #666666   — secondary descriptions
Link Gray:       #757575   — nav hover, inline links
```

### Example Component Prompts
- "A Nike product card: white background, full-bleed product photo, product name 22px Helvetica Neue bold below, color name 14px gray, price 20px bold, zero border-radius, subtle scale hover"
- "A full-bleed campaign hero: edge-to-edge athlete photo, dark overlay gradient bottom half, white Trade Gothic 72px uppercase headline, white pill button 'Shop Now'"
- "Nike pill-shaped primary button: black background, white uppercase Helvetica Neue 14px tracked, 30px border-radius, 16px 32px padding, hover deepens to #000000"
- "A product filter chip row: pill-shaped chips with gray border, active chip fills black with white text, scrollable horizontal on mobile"
