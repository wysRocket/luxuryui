---
name: Kayak
colors:
  tertiary: "#FF690F"
  neutral: "#FFFFFF"
  primary: "#1A1A1A"
typography:
  h1:
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.05em
  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 2px
  md: 8px
  lg: 20px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
---

## Overview

Kayak's design language is defined by confident utility and travel optimism. The interface is built around a brilliant orange (#FF690F) that commands attention without overwhelming the white-dominant canvas beneath it. Every pixel is tuned for rapid decision-making — users arrive with a destination in mind, and the UI compresses the path from search intent to booking confidence as tightly as possible.

The surface is predominantly white (#FFFFFF) with light neutral separators. Kayak relies on the San Francisco system font stack on Apple devices and Roboto on Android, lending it a native, trustworthy feel. There is no decorative typeface — readability and scanning speed are paramount. Price figures, flight durations, and airline names are all typeset for fast comparison, using tabular figures and tight tracking.

Color is deployed sparingly as a signal layer — orange for primary calls-to-action, green for the best price indicators, red-orange for "selling out" warnings. The visual hierarchy funnels attention from search bar → price filters → results grid → primary CTA. Background photography is muted and blurred, used only in destination discovery contexts.

**Key Characteristics:**
- Primary orange: `#FF690F` — used exclusively for CTAs, selected states, and active filter chips
- White canvas: `#FFFFFF` — 90%+ of surface area; orange is an accent, not a background
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto` — no custom typeface
- Price display: tabular-nums, bold weight, 24–32px — the single most scanned element
- Filter bar: horizontal scroll with pill-shaped chips, 8px radius, 1px border
- Grid density: results show 3–5 data points per row without visual clutter
- Icon style: filled, monochromatic, 20–24px; airplane, hotel bed, car icons
- Elevation: flat with hairline separators; no drop shadows in results lists

## Colors

### Primary
- **Kayak Orange** (`#FF690F`): primary CTA buttons, active tab indicators, brand color
- **White** (`#FFFFFF`): page backgrounds, card surfaces, input fields
- **Ink** (`#1A1A1A`): primary body text, prices, airport codes
- **Graphite** (`#4A4A4A`): secondary text, airline names, secondary labels

### Interactive
- **Orange Hover** (`#E55A00`): CTA button hover and pressed state
- **Best Price Green** (`#00A550`): cheapest price badge, "Great Deal" flags
- **Alert Red** (`#E53935`): "Last 2 seats", price increase warnings
- **Selection Blue** (`#1976D2`): calendar date range selection fill

### Surface
- **Page Background** (`#F4F4F4`): light gray behind card results
- **Card Surface** (`#FFFFFF`): individual result cards
- **Border Hairline** (`rgba(0,0,0,0.10)`): separators between results, input outlines
- **Filter Chip** (`rgba(255,105,15,0.10)`): active filter chip fill with orange border

## Typography

### Font Families
- **System UI**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` — all text
- **Monospace** (tabular): `font-variant-numeric: tabular-nums` applied to all price and time displays

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display Price | System UI | 32px | 800 | 1.0 | Tabular nums; orange or ink |
| Result Price | System UI | 24px | 700 | 1.1 | Tabular nums; ink |
| Search Input | System UI | 18px | 400 | 1.4 | Placeholder gray |
| Section Heading | System UI | 16px | 700 | 1.25 | Uppercase tracking 0.05em |
| Card Title | System UI | 15px | 600 | 1.3 | Airline/hotel name |
| Body Default | System UI | 14px | 400 | 1.5 | Descriptions, amenities |
| Label / Tag | System UI | 12px | 600 | 1.2 | Filter chips, badges |
| Legal / Fine Print | System UI | 11px | 400 | 1.4 | Fees, disclaimers |

## Layout

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Standard component padding: 16px
- Section separation: 24–32px

### Border Radius Scale
- **2px** — hairline accents, progress bars
- **4px** — form inputs, small tags
- **6px** — primary buttons
- **8px** — result cards, list items
- **12px** — search hero container, filter drawer
- **16px** — modal dialogs, bottom sheets
- **20px** — filter pill chips, badge lozenges

## Elevation & Depth

- **Level 0** (flat): hairline border `1px solid rgba(0,0,0,0.08)` — result rows
- **Level 1** (card): `box-shadow: 0 1px 4px rgba(0,0,0,0.10)` — result cards
- **Level 2** (popover): `box-shadow: 0 4px 16px rgba(0,0,0,0.14)` — date picker, dropdowns
- **Level 3** (modal): `box-shadow: 0 8px 40px rgba(0,0,0,0.20)` — booking modal, alerts
- **Orange glow** (CTA hover): `box-shadow: 0 2px 8px rgba(255,105,15,0.35)`

## Components

### Buttons
- **Primary CTA**: `background: #FF690F`, `color: #FFFFFF`, `border-radius: 6px`, `padding: 14px 24px`, `font-weight: 700`, `font-size: 16px`
- **Hover state**: `background: #E55A00`, `box-shadow: 0 2px 8px rgba(255,105,15,0.35)`
- **Disabled**: `background: #CCCCCC`, `color: #888888`, `cursor: not-allowed`
- **Secondary**: `border: 2px solid #FF690F`, `color: #FF690F`, `background: transparent`, `border-radius: 6px`
- **Filter Chip**: `border: 1px solid #E0E0E0`, `border-radius: 20px`, `padding: 6px 14px`, `font-size: 13px`, active uses `border-color: #FF690F`, `background: rgba(255,105,15,0.08)`

### Cards & Containers
- **Result Card**: `background: #FFFFFF`, `border-radius: 8px`, `border: 1px solid rgba(0,0,0,0.08)`, `padding: 16px`
- **Selected Card**: adds `border: 2px solid #FF690F`
- **Search Box**: `border-radius: 12px`, `padding: 20px`, `background: #FFFFFF`, `box-shadow: 0 4px 16px rgba(0,0,0,0.12)`
- **Modal**: `border-radius: 16px`, `background: #FFFFFF`, `box-shadow: 0 8px 40px rgba(0,0,0,0.18)`

## Do's and Don'ts

### Do
- Use orange exclusively for primary CTAs and active/selected states
- Apply tabular-nums to all price and time elements for alignment
- Keep result cards flat with hairline borders — avoid heavy shadows in lists
- Show the cheapest option visually differentiated with green `#00A550`
- Use the full system font stack for native feel across platforms

### Don't
- Don't use orange for decorative backgrounds or illustrations — it loses signal value
- Don't use custom display fonts — the brand depends on native system legibility
- Don't crowd filter chips — maintain 8px gap and horizontal scroll for overflow
- Don't animate price values — stability signals trustworthiness in fare display

## Responsive Behavior

Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)

- **375px**: single-column result stack; sticky search bar at top; bottom sheet for filters
- **768px**: side-by-side map/results layout; inline filter bar
- **1024px**: three-panel layout (filters | results | map preview)
- **1280px**: expanded price comparison grid with additional columns

## Agent Prompt Guide

### Quick Color Reference
- Brand: `#FF690F`
- Background: `#FFFFFF`
- Text primary: `#1A1A1A`
- Text secondary: `#4A4A4A`
- Best price: `#00A550`
- Border: `rgba(0,0,0,0.10)`

### Example Component Prompts
- "A flight results card with white background, #1A1A1A airline name at 15px semibold, #FF690F price at 24px bold tabular-nums, and an orange CTA button at 6px radius"
- "A search hero with 12px-radius white container, shadow level 2, and orange search button spanning full width at 56px height"
- "A horizontal filter bar with pill chips at 20px radius, 1px #E0E0E0 border, orange active state, and 4px gap spacing"
