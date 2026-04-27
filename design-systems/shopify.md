---
name: Shopify
colors:
  tertiary: "#008060"
  neutral: "#F6F6F7"
  primary: "#202223"
  secondary: "#6D7175"
typography:
  body-md:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16
  label:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20
rounded:
  sm: 4px
  md: 8px
  lg: 12px
---

## Overview

Shopify's design system — Polaris — is built around a merchant-first philosophy: clear, functional, and trustworthy. The interface prioritises clarity over decoration, using a restrained palette anchored by Shopify's signature green to signal commerce, growth, and action. Every surface is designed to reduce cognitive load for busy store owners managing inventory, orders, and analytics simultaneously.

The aesthetic is professional and clean: white and light gray surfaces dominate the main workspace, with Shopify Green reserved exclusively for primary actions, status indicators, and brand moments. Dark navy/forest tones appear in sidebar navigation and the Shopify admin header bar, grounding the interface with authority without feeling oppressive. Data density is high but legible — the design system is built to handle complex merchant dashboards without visual chaos.

Typography is set in Shopify Sans (a custom typeface) for brand moments and Inter for UI body text, creating a system that is both distinctive and highly readable at small sizes. The overall tone is enterprise-grade but approachable — a merchant running a multi-million dollar store should feel as comfortable as someone launching their first product.

**Key Characteristics:**
- Primary green: `#008060` (Shopify Green) for all CTAs and positive states
- Dark surface: `#004C3F` for hover states and dark-mode header bars
- Background: `#F6F6F7` (off-white) for page canvas; `#FFFFFF` for card surfaces
- Text primary: `#202223`; secondary: `#6D7175`; disabled: `#8C9196`
- Status colors: Success `#008060`, Warning `#FFC453`, Critical `#D72C0D`, Info `#006FBB`
- Border radius: 8px for cards, 4px for inputs, 28px for pills/badges
- Spacing base unit: 4px (scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Elevation via subtle box shadows — no dramatic depth; flat-leaning design

## Colors

### Primary
- **Shopify Green** (`#008060`): Primary CTA buttons, success states, brand accent, active nav indicators
- **Dark Green** (`#004C3F`): Hover state for primary buttons, top navigation bar background
- **Shopify Purple** (`#5C2D91`): Secondary brand accent for admin premium features

### Interactive
- **Green Hover** (`#006E52`): Hover on primary green buttons
- **Green Pressed** (`#003D30`): Active/pressed state for primary actions
- **Blue Link** (`#006FBB`): Inline text links, secondary interactive elements
- **Blue Link Hover** (`#005599`): Hovered text link state

### Surface
- **Canvas** (`#F6F6F7`): Page-level background, outer container wash
- **Card Surface** (`#FFFFFF`): Card backgrounds, modal backgrounds
- **Subdued** (`#FAFBFB`): Input backgrounds, subdued card variants
- **Dark Nav** (`#1A1A1A`): Sidebar navigation in dark mode
- **Overlay** (`rgba(0, 0, 0, 0.5)`): Modal backdrops, drawer overlays

### Text
- **Primary** (`#202223`): Main body text, headings
- **Secondary** (`#6D7175`): Supporting labels, metadata, captions
- **Disabled** (`#8C9196`): Placeholder text, disabled input labels
- **On-dark** (`#FFFFFF`): Text on green buttons and dark surfaces
- **Critical** (`#D72C0D`): Error messages, destructive action labels

### Status
- **Success** (`#008060`): Positive badges, fulfillment status
- **Warning** (`#FFC453`): Pending states, attention badges
- **Critical** (`#D72C0D`): Error banners, destructive actions
- **Info** (`#006FBB`): Informational banners, tip callouts
- **Highlight** (`#EBF9FC`): Info badge backgrounds

## Typography

### Font Families
- **Shopify Sans**: `'Shopify Sans', sans-serif` — Brand headings, admin hero text, marketing surfaces
- **Inter**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` — All UI text, labels, body, data tables
- **SF Mono / Roboto Mono**: `'SFMono-Regular', 'Roboto Mono', monospace` — Code snippets, API keys, liquid templates

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display XL | Shopify Sans | 40px | 700 | 48px | Marketing hero, empty states |
| Display L | Shopify Sans | 32px | 700 | 40px | Page-level hero headings |
| Heading XL | Inter | 24px | 600 | 32px | Section titles in dashboards |
| Heading L | Inter | 20px | 600 | 28px | Card titles, modal headings |
| Heading M | Inter | 16px | 600 | 24px | Subsection labels |
| Heading S | Inter | 14px | 600 | 20px | Table column headers, form labels |
| Body L | Inter | 16px | 400 | 24px | Primary body text |
| Body M | Inter | 14px | 400 | 20px | Default UI text, list items |
| Body S | Inter | 12px | 400 | 16px | Captions, metadata, timestamps |
| Caption | Inter | 11px | 400 | 16px | Badge labels, tooltips |
| Code | SF Mono | 13px | 400 | 20px | API keys, code blocks |
| Button | Inter | 14px | 500 | 20px | All button labels |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px`
- Component padding: typically `16px` or `20px`
- Section gaps: `24px` or `32px`
- Page margins: `16px` (mobile), `32px` (tablet), `32px` auto-centered (desktop, max-width 1280px)

### Grid
- 12-column grid
- Gutter: `16px`
- Admin sidebar width: `240px` (collapsed: `72px`)
- Content max-width: `1280px`

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Inputs, small badges, checkboxes |
| `--radius-md` | 6px | Buttons, dropdowns |
| `--radius-lg` | 8px | Cards, modals, panels |
| `--radius-xl` | 12px | Large containers |
| `--radius-full` | 9999px | Pill badges, avatar chips |

## Elevation & Depth

Shopify uses subtle, functional elevation — no dramatic shadows or glassmorphism. The elevation system communicates layer relationships rather than aesthetic depth.

**Elevation Scale:**
- **Level 0** (flat): No shadow — page backgrounds, inline elements
- **Level 1** (card): `box-shadow: 0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)` — standard cards
- **Level 2** (raised): `box-shadow: 0 2px 6px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.12)` — dropdowns, popovers
- **Level 3** (overlay): `box-shadow: 0 4px 16px rgba(0,0,0,0.15), 0 0 2px rgba(0,0,0,0.1)` — modals, toasts
- **Level 4** (modal): `box-shadow: 0 8px 24px rgba(0,0,0,0.2)` — command bar, contextual menus

## Components

### Buttons
**Primary Button**
- Background: `#008060`
- Text: `#FFFFFF`, weight 500, size 14px
- Border-radius: `6px`
- Padding: `8px 16px`
- Hover: `background: #006E52`
- Active: `background: #003D30`
- Disabled: `background: #AEB4B9`, `color: #FFFFFF`
- Box-shadow: none (flat)

**Secondary Button**
- Background: `#FFFFFF`
- Border: `1px solid #C9CDD2`
- Text: `#202223`, weight 500
- Hover: `background: #F6F6F7`, `border-color: #8C9196`

**Destructive Button**
- Background: `#D72C0D`
- Text: `#FFFFFF`
- Hover: `background: #BC2200`

**Plain Button (text link style)**
- Background: transparent
- Text: `#006FBB`
- No border, no shadow

### Cards & Containers
**Standard Card**
- Background: `#FFFFFF`
- Border: `1px solid #E4E5E7`
- Border-radius: `8px`
- Box-shadow: `0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)`
- Padding: `20px`

**Section Card**
- Border-radius: `8px`
- Overflow: `hidden`
- Internal sections separated by `1px solid #E4E5E7` dividers

**Banner (Info)**
- Background: `#EBF9FC`
- Border-left: `4px solid #006FBB`
- Border-radius: `4px`
- Padding: `12px 16px`

**Data Table**
- Header bg: `#F6F6F7`
- Row border: `1px solid #E4E5E7`
- Hover row: `background: #F6F6F7`
- Striped variant: alternating `#FFFFFF` / `#FAFBFB`

### Form Inputs
- Border: `1px solid #C9CDD2`
- Border-radius: `6px`
- Background: `#FFFFFF`
- Focus: `border-color: #006FBB`, `box-shadow: 0 0 0 3px rgba(0,111,187,0.2)`
- Height: `36px` (single line)
- Font: Inter 14px / `#202223`

### Badges
- Border-radius: `28px` (pill)
- Padding: `2px 10px`
- Font: 12px, weight 500
- Success: bg `#AEE9D1`, text `#003D1E`
- Warning: bg `#FFEA8A`, text `#4E2400`
- Critical: bg `#FED3D1`, text `#4E0900`

## Do's and Don'ts

### Do
- Use `#008060` exclusively for primary CTAs — it signals "the most important action on screen"
- Maintain 4px base spacing — use multiples: 8, 12, 16, 20, 24, 32
- Use status colors consistently: `#D72C0D` = error only, `#FFC453` = warning only
- Keep card borders at exactly `1px solid #E4E5E7` — not `#D4D4D4` or `#EEEEEE`
- Apply `border-radius: 8px` to all card containers; `6px` for buttons; `4px` for inputs
- Show data density — merchants expect tables and stats, not marketing whitespace

### Don't
- Never use green for anything other than success/positive/primary-CTA — avoid decorative green
- Don't use bold weights above 700 — Shopify's scale caps at 700
- Avoid shadows heavier than Level 3 — Shopify is a functional, not theatrical interface
- Don't use color alone to communicate status — always pair with icon or text label
- Avoid centered layouts for data-heavy pages — use left-aligned grid with sidebar navigation

## Responsive Behavior

**Breakpoints:**
- `xs`: 0–490px — single column, full-width cards, hamburger nav
- `sm`: 490px–768px — 2-column grid, condensed sidebar
- `md`: 768px–1024px — sidebar visible (240px), 2-3 column grid
- `lg`: 1024px–1280px — full admin layout, multi-column data tables
- `xl`: 1280px+ — centered at max-width 1280px, full dashboard layout

**Sidebar behavior:** Collapses to icon-only at `<1024px`; full-drawer on mobile tap

**Card stacking:** Multi-column cards collapse to single column at `<768px`

**Data tables:** Horizontal scroll enabled at `<768px`; priority columns hidden at `<490px`

## Agent Prompt Guide

### Quick Color Reference
- Primary action: `#008060`
- Primary hover: `#006E52`
- Page background: `#F6F6F7`
- Card surface: `#FFFFFF`
- Primary text: `#202223`
- Secondary text: `#6D7175`

### Example Component Prompts
- "Shopify Polaris-style product card with white background, 8px radius, 1px #E4E5E7 border, product image at top, title in Inter 16px #202223, price in Inter 14px #6D7175, and green '#008060' 'Add to cart' button at bottom"
- "Admin dashboard header bar with dark green #004C3F background, Shopify logo left, navigation items in white Inter 14px center, user avatar and notification bell right"
- "Order status badge pill with border-radius 28px, success state: bg #AEE9D1 text #003D1E, Inter 12px weight 500, text 'Fulfilled'"
- "Data table with #F6F6F7 header row, Inter 14px column headers weight 600 #202223, 1px #E4E5E7 row borders, hover state bg #F6F6F7"
