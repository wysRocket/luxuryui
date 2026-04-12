# Design System Inspired by Expedia

## 1. Visual Theme & Atmosphere

Expedia's design is bold, search-centric, and aspiration-driven — every interface decision is optimized to get travelers from intent to booking as efficiently as possible. The brand yellow (`#FFCC00`), a vivid golden hue, energizes the primary CTA and the distinctive yellow header band, immediately signaling action and warmth. Below the fold, the palette shifts to trustworthy navy (`#1E3A5F`) for informational hierarchy and deep-travel imagery backdrops that evoke wanderlust.

Typography is set in Expedia Sans — the brand's proprietary typeface — a modern geometric sans-serif with slightly rounded terminals that balances authority with friendliness. The type system is pragmatic: large display numbers for price comparisons, bold labels for travel dates and destinations, and compact metadata for flight details and amenity lists. The visual design prioritizes the search widget above everything else, with the hero photography serving as atmospheric backdrop rather than content.

The overall atmosphere is confident and efficient — "we'll handle the complexity, you just travel" — with trust signals (ATOL protection, verified badges, price guarantees) woven into the conversion flow.

**Key Characteristics:**
- Expedia Yellow (`#FFCC00`) for CTAs and the iconic brand header band
- Dark navy (`#1E3A5F`) for secondary brand elements and info hierarchy
- White surfaces (`#FFFFFF`) for listing cards, dominant below the hero
- Expedia Sans proprietary typeface across all UI
- Travel photography heroes — always full-bleed with overlay gradient
- Search widget as the #1 UI priority — always sticky or prominent
- Price as primary hierarchy in listing cards (large, bold, right-aligned)

## 2. Color Palette & Roles

### Primary
- **Expedia Yellow** (`#FFCC00`): Primary CTA, logo accent, active tabs
- **Brand Navy** (`#1E3A5F`): Header, secondary headings, trust elements
- **Pure White** (`#FFFFFF`): Card surfaces, primary UI background

### Interactive
- **Hover Yellow** (`#E6B800`): Darkened yellow on CTA hover
- **Active Blue** (`#0073BB`): Links, date picker highlights, focus states
- **Selected Teal** (`#007A87`): Selected tab, confirmation states

### Surface
- **Light Gray** (`#F5F5F5`): Page background between sections
- **Border Gray** (`#DCDCDC`): Card borders, input borders
- **Secondary Text** (`#5A6271`): Meta information, labels
- **Primary Text** (`#1A1A1A`): Headings, product names

### Status
- **Savings Green** (`#2D7738`): Price drop, deal badge
- **Urgency Red** (`#D73C3C`): "Selling fast", last rooms
- **Rating Orange** (`#F5A623`): Star ratings, VIP badge
- **Verified Blue** (`#0073BB`): Verified property badge

## 3. Typography Rules

### Font Families
- **Primary**: `Expedia Sans` — proprietary, all UI text
- **Fallback**: `system-ui`, `-apple-system`, `sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Headline | Expedia Sans | 48px | 700 | 1.10 | Travel inspiration copy |
| Page Title | Expedia Sans | 32px | 700 | 1.20 | "New York Hotels" |
| Section Header | Expedia Sans | 22px | 600 | 1.25 | "Recommended for you" |
| Property Name | Expedia Sans | 18px | 600 | 1.30 | Hotel/flight primary |
| Price Display | Expedia Sans | 24px | 700 | 1.00 | Right-aligned on card |
| Price Label | Expedia Sans | 12px | 400 | 1.20 | "per night" suffix |
| Original Price | Expedia Sans | 16px | 400 | 1.00 | Strikethrough |
| Flight Detail | Expedia Sans | 15px | 500 | 1.40 | Times, duration, stops |
| Meta / Label | Expedia Sans | 13px | 400 | 1.30 | Amenity list, tags |
| CTA Button | Expedia Sans | 16px | 700 | 1.00 | "Search", "Book now" |
| Navigation | Expedia Sans | 14px | 500 | 1.00 | Top nav items |

## 4. Component Stylings

### Buttons

**Primary CTA (Yellow)**
- Background: `#FFCC00`
- Color: `#1A1A1A` (black text on yellow)
- Border-radius: 4px
- Padding: 14px 28px
- Font: Expedia Sans 16px/700
- Hover: `#E6B800`

**Secondary Action**
- Background: `#FFFFFF`
- Border: `2px solid #1E3A5F`
- Color: `#1E3A5F`
- Radius: 4px

**Search Submit**
- Background: `#FFCC00`
- Full-height inside search widget
- Icon + "Search" label

### Cards & Containers
- Hotel card: white, `1px solid #DCDCDC`, 8px radius
- Image: 40% left, content 60% right (horizontal layout)
- Price section: right-aligned, yellow "Book" CTA below
- Hover: `box-shadow: 0 4px 16px rgba(0,0,0,0.12)`

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px

### Border Radius Scale
- Sharp (0px–2px): Legacy form elements
- Small (4px): Buttons, cards, inputs (primary Expedia radius)
- Medium (8px): Cards, badges, chips
- Large (16px): Modals, bottom sheets

## 6. Depth & Elevation

- **Cards**: `box-shadow: 0 1px 4px rgba(0,0,0,0.08)` default
- **Hover**: `box-shadow: 0 4px 16px rgba(0,0,0,0.12)` + translateY(-2px)
- **Search widget**: `box-shadow: 0 4px 24px rgba(0,0,0,0.2)` — prominent
- **Modals**: `box-shadow: 0 16px 48px rgba(0,0,0,0.25)`
- **Sticky header**: `box-shadow: 0 2px 8px rgba(30,58,95,0.15)` — navy-tinted

## 7. Do's and Don'ts

### Do
- Make the search widget the most prominent element on every page
- Use full-bleed travel photography with gradient overlay (`rgba(0,0,0,0.35)`) on heroes
- Always right-align price on listing cards — it's the decision anchor
- Show savings and price drops in green (`#2D7738`) with dollar amount
- Use yellow CTA consistently — it's the trust signal for "this is actionable"

### Don't
- Don't use yellow as decoration — it's a functional action color only
- Don't use sharp 0px radius — minimum 4px throughout
- Don't hide fees — total price transparency is a brand promise
- Don't bury social proof — star ratings and review counts near the price

## 8. Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px, 1440px
- Mobile: Stacked search fields, single-column results, bottom sheet filters
- Tablet: 2-column search widget row, side-by-side card layout
- Desktop: Inline search bar, map + list split view, filter sidebar 280px

## 9. Agent Prompt Guide

### Quick Color Reference
- CTA yellow: `#FFCC00`
- Brand navy: `#1E3A5F`
- Background: `#FFFFFF`
- Text: `#1A1A1A`
- Secondary: `#5A6271`
- Savings: `#2D7738`

### Example Component Prompts
- "Build hotel card: white bg, 1px solid #DCDCDC, 8px radius. Image 40% left. Property name 18px/600. Price 24px/700 right-aligned. Yellow 'Select' CTA button 4px radius."
- "Create search hero: full-bleed travel photo, rgba(0,0,0,0.35) gradient overlay. Centered white headline 48px/700. Yellow search widget below with 4 input fields + #FFCC00 submit button."
