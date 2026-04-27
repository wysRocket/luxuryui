---
name: HotelTonight
colors:
  neutral: "#1A1A2E"
  tertiary: "#FFFFFF"
  primary: "#1A1A2E"
typography:
  body-md:
    fontFamily: Tiempos Headline
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 12px
  lg: 20px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

HotelTonight's design is bold, decisive, and luxuriously dark — a product built for last-minute hotel booking where confidence and speed matter above all else. The deep navy (`#1A1A2E`) and near-black backgrounds (`#0D0D17`) create a premium, nighttime atmosphere perfectly aligned with the last-minute travel use case. Bold photography bleeds edge-to-edge, making each hotel feel like a visual destination rather than a commodity listing.

The interface is deliberately minimal — there are no endless filter rails or comparison tables. HotelTonight presents curated options for tonight, ranked and merchandised with confidence. The white typography on dark surfaces creates extreme contrast, and accents of electric teal or bright white serve as the single interactive thread through the experience. The overall aesthetic says "decisive traveler" — sophisticated, uncluttered, and confident.

The product is mobile-first in philosophy and design: swipeable hotel cards, a single-page booking flow, and gesture-driven navigation all reflect an interface designed for quick decisions on the go. The typography is assertive, with large bold hotel names and oversized prices that communicate "you already know what you want."

**Key Characteristics:**
- Deep navy (`#1A1A2E`) and near-black (`#0D0D17`) as primary surfaces
- Full-bleed hotel photography as the primary UI element
- White text primary, high contrast on dark backgrounds
- Bright white or teal accent for sole CTA — one action per screen
- Minimal UI — no clutter, no feature sprawl
- Bold, oversized type for hotel name and price
- Swipeable card interactions on mobile
- Premium editorial curation aesthetic — not a search engine

## Colors

### Primary
- **Deep Navy** (`#1A1A2E`): Primary app background
- **Near Black** (`#0D0D17`): Cards below photography sections
- **Pure White** (`#FFFFFF`): All text on dark, primary CTA background

### Interactive
- **Electric Teal** (`#00D4C8`): Alternative accent for interactive highlights
- **Active White** (`rgba(255,255,255,0.95)`): Hover and pressed state
- **Focus** (`rgba(255,255,255,0.3)`): Focus ring on dark surfaces

### Surface
- **Card Dark** (`#12122A`): Booking summary cards
- **Overlay Dark** (`rgba(13,13,23,0.7)`): Image overlay for text legibility
- **Divider** (`rgba(255,255,255,0.12)`): Subtle white dividers
- **Secondary Text** (`rgba(255,255,255,0.6)`): Labels, metadata, secondary info

### Status
- **Deal Green** (`#2ECC71`): Price drop, "great deal" badge
- **Available Amber** (`#F39C12`): Limited availability warning
- **Sold Out Gray** (`#555577`): Grayed-out unavailable hotels

## Typography

### Font Families
- **Primary**: `Tiempos Headline` / `Georgia` — serif for hotel names (editorial weight)
- **UI / Meta**: `Graphik` / `Helvetica Neue` — all UI text, navigation, prices

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hotel Name | Tiempos Headline | 32px | 700 | 1.10 | Primary card hero text |
| Price Display | Graphik | 40px | 800 | 1.00 | Nightly rate — dominant |
| Night Count | Graphik | 16px | 400 | 1.00 | "/ night" suffix |
| Star Rating | Graphik | 14px | 600 | 1.00 | "★ 4.8 · 284 reviews" |
| Location | Graphik | 14px | 400 | 1.20 | Neighborhood, city |
| Amenity | Graphik | 13px | 500 | 1.30 | "Free Wi-Fi · Pool" |
| Section Label | Graphik | 11px | 700 | 1.00 | "TONIGHT'S PICKS" ALL CAPS |
| Body | Graphik | 15px | 400 | 1.60 | Hotel description |
| Navigation | Graphik | 11px | 600 | 1.00 | Tab bar labels |
| Book CTA | Graphik | 18px | 700 | 1.00 | "Book" — the only CTA |
| Timer | Graphik | 16px | 700 | 1.00 | "3 rooms left" urgency |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Border Radius Scale
- Small (4px): Status badges, tags
- Standard (8px): Buttons, form inputs
- Medium (12px): Hotel cards, containers
- Large (20px): Modals, bottom sheets

## Elevation & Depth

- **Hotel cards**: `box-shadow: 0 8px 32px rgba(0,0,0,0.5)` — strong dark shadow
- **Active card**: `box-shadow: 0 16px 48px rgba(0,0,0,0.7)` + scale(1.02)
- **Booking modal**: `box-shadow: 0 24px 80px rgba(0,0,0,0.8)`
- **Top nav bar**: `backdrop-filter: blur(12px)`, `background: rgba(13,13,23,0.85)`
- **No elevation between surface layers** — depth comes from photography contrast

## Components

### Buttons

**Primary "Book" CTA**
- Background: `#FFFFFF`
- Color: `#0D0D17` (dark text on white)
- Border-radius: 8px
- Padding: 16px 48px
- Font: Graphik 18px/700
- Hover: `rgba(255,255,255,0.9)`
- Full-width on mobile

**Secondary Ghost**
- Border: `1px solid rgba(255,255,255,0.4)`
- Color: `#FFFFFF`
- Background: transparent
- Radius: 8px

**Save/Heart**
- White heart icon, no background
- Active: filled white heart

### Cards & Containers
- Hotel card: full-bleed image top (60% of card height)
- Dark overlay bottom with hotel name + price
- `background: linear-gradient(transparent, rgba(13,13,23,0.95))` — scrim
- Radius: 12px, overflow: hidden
- Swipeable horizontally on mobile

## Do's and Don'ts

### Do
- Let hotel photography fill the entire card — no white mats or padding
- Use a single white CTA button per screen — HotelTonight is one-action design
- Apply the gradient scrim (`transparent → rgba(13,13,23,0.95)`) over image bottoms for text
- Use serif (Tiempos/Georgia) for hotel names — it communicates editorial quality
- Make the price the visual anchor: 40px/800 dominant in every card

### Don't
- Don't use light backgrounds — this is a dark-mode-only product
- Don't show more than 5–7 hotel options at once — curation is the product
- Don't add filter sidebars or sort dropdowns — simplicity is the differentiator
- Don't use colored CTAs — white button on dark is the HotelTonight signature

## Responsive Behavior

Breakpoints: 320px, 375px, 428px, 768px, 1024px
- Mobile: Full-screen hotel cards, swipe left/right navigation, 1-tap booking
- Tablet: 2-column card grid, map view toggle
- Web: Split screen — map left (60%), curated list right (40%)

## Agent Prompt Guide

### Quick Color Reference
- Background: `#1A1A2E`
- Near black: `#0D0D17`
- Text: `#FFFFFF`
- Secondary: `rgba(255,255,255,0.6)`
- CTA: `#FFFFFF` button with dark text
- Deal: `#2ECC71`

### Example Component Prompts
- "Build HotelTonight card: 12px radius, overflow hidden. Full-bleed hotel image 60% top. Gradient scrim (transparent → rgba(13,13,23,0.95)). Tiempos 32px/700 white hotel name. Graphik 40px/800 price bottom-right."
- "Create dark booking summary: #12122A bg, 8px radius. Hotel name, date, price breakdown in white Graphik. White 'Book' CTA full-width, dark text, 8px radius."
- "Design section label: Graphik 11px/700 ALL CAPS rgba(255,255,255,0.6). 'TONIGHT\'S PICKS' with teal underline accent."
