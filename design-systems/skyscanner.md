---
name: Skyscanner
colors:
  secondary: "#444560"
  neutral: "#FFFFFF"
  primary: "#0770E3"
  tertiary: "#0654B2"
typography:
  body-md:
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16
rounded:
  sm: 4px
  md: 12px
  lg: 16px
---

## Overview

Skyscanner's design language — Backpack — is optimised for the search-first, comparison-heavy workflow of flight booking. The interface is airy and open: predominantly white surfaces with a confident sky-blue accent (`#0770E3`) that immediately evokes travel, altitude, and forward movement. The visual design de-clutters the complex task of comparing hundreds of routes, dates, and prices by using rigorous whitespace, clear typographic hierarchy, and a minimal color vocabulary.

The aesthetic is functional-first but warm — not cold like a financial tool, but not playful like a travel brochure. Flight grids and date pickers dominate the experience, and Backpack's layout principles ensure that dense price data remains scannable at a glance. The search bar is always the hero element, often given full-bleed treatment with destination photography as backdrop, transitioning to white canvas once results load.

Skyscanner uses its proprietary "Skyscanner" typeface for brand and UI text — a clean, geometric sans-serif that performs well at both large marketing scales and small 11px metadata labels in price grids. The overall result is a design system that earns trust through consistency and clarity: you always know where you are and what to do next.

**Key Characteristics:**
- Sky blue: `#0770E3` for all primary interactive elements and CTAs
- Background: `#FFFFFF` (white), secondary surface `#F1F2F8` (light lavender-white)
- Dark text: `#111236` (deep navy) for headings and primary labels
- Body text: `#444560` (mid navy-gray)
- Price highlight: `#0770E3` for cheapest fares, `#00A698` for eco-friendly indicator
- Border radius: 12px for search form, 8px for result cards, 4px for inputs
- Date picker grid cells: 36px × 36px minimum touch target
- Price "best deal" badge: `#D74100` (dark orange-red accent, used sparingly)

## Colors

### Primary
- **Sky Blue** (`#0770E3`): Search CTA, "View deal" buttons, selected date highlights, flight links
- **Deep Navy** (`#111236`): Page headings, primary data labels, logo mark
- **Eco Teal** (`#00A698`): Eco/sustainable travel badges, green travel indicators

### Interactive
- **Blue Hover** (`#0654B2`): Hover on primary blue buttons
- **Blue Active** (`#053F87`): Pressed/active blue interactive elements
- **Blue Light** (`#E4F0FF`): Selected state backgrounds, focus rings, chip selected state

### Surface
- **White Canvas** (`#FFFFFF`): Primary page background, card surfaces
- **Pale Blue-White** (`#F1F2F8`): Secondary page sections, sidebar backgrounds
- **Divider** (`#DDDDE5`): Horizontal rules, table borders, card borders
- **Modal Overlay** (`rgba(17,18,54,0.5)`): Drawer and modal backdrops

### Text
- **Primary** (`#111236`): Page titles, flight routes, key data
- **Body** (`#444560`): Descriptions, secondary data, form labels
- **Subtle** (`#68697F`): Captions, stop counts, metadata
- **Disabled** (`#ABADB8`): Inactive inputs, unavailable dates
- **Price Accent** (`#0770E3`): Best-price indicators in fare grids
- **Deal Red** (`#D74100`): "Best deal" badge, price drops

### Status
- **On-time / Available** (`#00A698`): Flight status green, available seats
- **Alert** (`#FF7110`): Delays, disruptions, attention banners
- **Error** (`#E00`): Hard errors, unavailable routes

## Typography

### Font Families
- **Skyscanner**: `'Skyscanner', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — Primary UI typeface for all text
- **System Fallback**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` — Web fallback

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display | Skyscanner | 48px | 700 | 56px | Marketing hero, destination headers |
| Heading XL | Skyscanner | 36px | 700 | 44px | Search results page title |
| Heading L | Skyscanner | 28px | 700 | 36px | Section headers |
| Heading M | Skyscanner | 24px | 700 | 32px | Flight card route display |
| Heading S | Skyscanner | 20px | 700 | 28px | Modal titles, filter panel title |
| Body L | Skyscanner | 18px | 400 | 28px | Search form fields |
| Body M | Skyscanner | 16px | 400 | 24px | Default body text |
| Body S | Skyscanner | 14px | 400 | 20px | Labels, filter options, descriptions |
| Caption | Skyscanner | 12px | 400 | 16px | Stop counts, luggage info, timestamps |
| Price Display | Skyscanner | 24px | 700 | 32px | Fare prices, bold and blue |
| Badge | Skyscanner | 11px | 700 | 16px | "CHEAPEST", "FASTEST", "ECO" pills |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px`
- Card padding: `20px 24px`
- Section gaps: `32px`
- Page max-width: `1296px`
- Left sidebar (filters): `260px` fixed

### Grid
- Results list: single fluid column after 260px filter sidebar
- Mobile: no sidebar, filters via bottom sheet
- Date picker: 7-column calendar grid

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 4px | Input fields, tags |
| `--radius-sm` | 8px | Dropdowns, tooltips |
| `--radius-md` | 12px | Cards, search form |
| `--radius-lg` | 16px | Modals, drawers |
| `--radius-full` | 9999px | Buttons, chips, pills |

## Elevation & Depth

- **Flat** (page bg): No shadow
- **Card** (result): `box-shadow: 0 1px 4px rgba(17,18,54,0.08)` — default
- **Card Hover**: `box-shadow: 0 4px 16px rgba(17,18,54,0.12)` — hovered flight result
- **Search Form**: `box-shadow: 0 8px 32px rgba(17,18,54,0.15)` — main search widget
- **Modal**: `box-shadow: 0 16px 48px rgba(17,18,54,0.25)` — drawer/modal panels
- **Tooltip**: `box-shadow: 0 4px 12px rgba(17,18,54,0.15)` — price tooltips on calendar

## Components

### Buttons
**Primary Button (Search / Book)**
- Background: `#0770E3`
- Text: `#FFFFFF`, weight 700, 16px
- Border-radius: `24px`
- Padding: `14px 24px`
- Hover: `background: #0654B2`
- Active: `background: #053F87`
- Box-shadow: `0 2px 8px rgba(7,112,227,0.3)`

**Secondary Button**
- Background: `#FFFFFF`
- Border: `2px solid #0770E3`
- Text: `#0770E3`, weight 700, 16px
- Border-radius: `24px`
- Hover: `background: #E4F0FF`

**Filter Chip (toggle)**
- Default: `background: #FFFFFF`, `border: 1px solid #DDDDE5`, text `#444560`
- Selected: `background: #E4F0FF`, `border: 1px solid #0770E3`, text `#0770E3`
- Border-radius: `20px`, padding `8px 16px`, font-weight 600

### Cards & Containers
**Flight Result Card**
- Background: `#FFFFFF`
- Border: `1px solid #DDDDE5`
- Border-radius: `12px`
- Padding: `20px 24px`
- Hover: `box-shadow: 0 4px 16px rgba(17,18,54,0.12)`, `border-color: #0770E3`
- "Best" badge: top-left, bg `#0770E3`, text white, 11px pill

**Price Calendar Grid Cell**
- Size: 40px × 40px minimum
- Default: `#FFFFFF` bg, `#444560` price text
- Cheapest: `#E4F0FF` bg, `#0770E3` text, weight 700
- Selected: `#0770E3` bg, `#FFFFFF` text
- Hover: `#F1F2F8` bg
- Disabled/unavailable: `#F1F2F8` bg, `#ABADB8` text, cursor not-allowed

**Search Form Container**
- Background: `#FFFFFF`
- Border-radius: `12px`
- Box-shadow: `0 8px 32px rgba(17,18,54,0.15)`
- Padding: `24px`

**Airline Logo Chip**
- 32px × 32px, `border-radius: 6px`
- Border: `1px solid #DDDDE5`
- White background

## Do's and Don'ts

### Do
- Place the search bar at the very top — it IS the product; give it max vertical space
- Show price in `#0770E3` bold for cheapest options — blue = best deal in this context
- Use `#F1F2F8` for alternating surfaces and filter panels — not gray, always the brand pale lavender
- Apply `border-radius: 24px` to all CTA buttons — Skyscanner uses full-pill primaries
- Always show stop count, duration, and carrier alongside price — never show price in isolation

### Don't
- Never use more than 2 accent colors per page — sky blue and eco teal only
- Don't truncate route names — LHRJFK or London → New York must always read fully
- Avoid dark backgrounds in results — white is essential for price comparison readability
- Don't use radio buttons for single-selection filters — use chip toggles instead
- Avoid animating the price grid — users are scanning rapidly; animations distract

## Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — stacked search form, full-screen date picker, no filters sidebar
- `sm`: 480px–768px — compact search bar, results list only
- `md`: 768px–1024px — filter drawer accessible, compact flight cards
- `lg`: 1024px–1280px — 260px filter sidebar, full flight card layout
- `xl`: 1280px+ — max 1296px centered, expanded price calendar view

**Date picker:** Full-screen modal on mobile; inline popover on desktop

**Filters:** Bottom sheet on mobile; persistent left sidebar on desktop (`≥1024px`)

## Agent Prompt Guide

### Quick Color Reference
- Primary blue: `#0770E3`
- Deep navy text: `#111236`
- Body text: `#444560`
- Page background: `#FFFFFF`
- Secondary bg: `#F1F2F8`
- Selected chip: `#E4F0FF`

### Example Component Prompts
- "Skyscanner flight result card: white background, 12px border-radius, 1px #DDDDE5 border, left section showing airline logo 32px + route 'LHR → JFK' in Skyscanner font 20px #111236 weight 700, departure/arrival times 16px #444560, right side showing price '#0770E3' 28px weight 700, blue pill 'Select' button"
- "Price calendar grid with 7-column layout, cell size 40px: default cells white bg #444560 price, cheapest cell #E4F0FF bg #0770E3 price weight 700, selected cell #0770E3 bg white text"
- "Search form widget: white background 12px radius, box-shadow 0 8px 32px rgba(17,18,54,0.15), horizontal layout with 'From' 'To' destination inputs, date range picker, passengers selector, large blue '#0770E3' 'Search flights' pill button 24px radius"
