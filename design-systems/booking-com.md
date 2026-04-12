# Design System Inspired by Booking.com

## 1. Visual Theme & Atmosphere

Booking.com is the most blue website on the internet — and intentionally so. The entire brand is built around two shades of blue: the deep navy-blue (`#003580`) for authority and trust, and the bright action blue (`#0071C2`) for every interactive element and CTA. Blue dominates navigation, buttons, links, dates, badges, and highlights. This chromatic focus creates instant brand recognition and, more practically, funnels attention to every actionable surface through color consistency.

The UI is search-dominant. The landing experience is a full-width search widget on a deep blue hero, followed by dense results grids. Property cards are information-rich: photo, name, location, review score, price, and several trust signals all coexist in a compact layout. Open Sans is the workhorse typeface — highly legible at small sizes, neutral enough to step back when the property photography takes center stage.

Spacing is intentionally tight on results pages — Booking.com's A/B testing history has optimized for information density. More properties visible = more bookings. But property detail pages breathe more, with larger imagery, expanded amenity grids, and spacious booking widgets. Review scores use a green-to-orange gradient spectrum for psychological comfort, while the iconic "Genius" loyalty badge deploys yellow-on-dark-blue for visibility.

**Key Characteristics:**
- Brand blue (dark): `#003580`
- Action blue: `#0071C2`
- Background: `#FFFFFF`
- Text primary: `#333333`
- Text secondary: `#6B6B6B`
- Review score green: `#003580` (dark blue pill — Booking-specific)
- Sale/discount: `#CC0000`
- Font: Open Sans across all surfaces
- Link hover: `#00224F`

## 2. Color Palette & Roles

### Primary
- **Booking Dark Blue** (`#003580`): Header background, review score badges, Genius loyalty UI, footer
- **Booking Action Blue** (`#0071C2`): All CTA buttons, interactive links, date selection, active filters
- **White** (`#FFFFFF`): Primary content surface

### Interactive
- **Blue Hover** (`#00224F`): CTA button hover — darkened action blue
- **Blue Link Hover** (`#003580`): Text link hover color
- **Blue Focus** (`rgba(0,113,194,0.3)`): Input and control focus ring

### Surface
- **White** (`#FFFFFF`): Property cards, forms, content areas
- **Light Blue-Gray** (`#EBF3FF`): Available date highlights, filter active background
- **Light Gray** (`#F5F5F5`): Page background outside cards, section separators
- **Border** (`#CDCDCD`): Card borders, input outlines, dividers
- **Overlay** (`rgba(0,0,0,0.5)`): Modal backdrop

## 3. Typography Rules

### Font Families
- **Open Sans**: `"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif` — all UI contexts
- All weights: 400, 600, 700

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Search Title | Open Sans | 32px | 700 | 40px | "Find your next stay" white on blue |
| H1 Property Name | Open Sans | 28px | 700 | 36px | Detail page hotel name |
| H2 Section | Open Sans | 22px | 700 | 28px | "Popular destinations", "Hotels nearby" |
| H3 Card Title | Open Sans | 16px | 700 | 22px | Property card name |
| Property Subtitle | Open Sans | 14px | 400 | 20px | Location, property type |
| Body | Open Sans | 14px | 400 | 22px | Descriptions, amenity lists |
| Price (per night) | Open Sans | 24px | 700 | 30px | `#333333` — prominently bold |
| Price (discounted) | Open Sans | 18px | 700 | 24px | `#CC0000` red for sale price |
| Review Score | Open Sans | 16px | 700 | 20px | White on `#003580` dark blue pill |
| Review text | Open Sans | 13px | 400 | 18px | "Excellent" label beside score |
| Nav link | Open Sans | 14px | 700 | 20px | White on dark blue header |
| Filter / Tag | Open Sans | 13px | 600 | 18px | Filter pill labels |
| Caption | Open Sans | 12px | 400 | 16px | `#6B6B6B` photo caption, footnote |

## 4. Component Stylings

### Buttons
**Primary (Search / Reserve):**
- Background: `#0071C2`
- Border: none
- Border radius: 2px — Booking uses nearly-square corners
- Padding: `12px 24px`
- Font: Open Sans, 16px / 700 / white
- Hover: background `#005fa3`
- Active: background `#00224F`

**Secondary (Sign In):**
- Background: `#FFFFFF`
- Border: `2px solid #0071C2`
- Border radius: 2px
- Color: `#0071C2`
- Hover: background `#EBF3FF`

**Genius / Loyalty Badge:**
- Background: `#003580`
- Color: `#FFD700`
- Border radius: 4px
- Font: Open Sans, 12px / 700

### Cards & Containers
**Property Card (Results):**
- Background: `#FFFFFF`
- Border: `1px solid #CDCDCD`
- Border radius: 4px
- Box-shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Layout: image left (landscape 200px wide), details right
- Hover: box-shadow `0 4px 16px rgba(0,0,0,0.15)`

**Search Widget:**
- Background: `#FFFFFF`
- Border: none
- Border radius: 4px
- Box-shadow: `0 2px 16px rgba(0,0,0,0.25)`
- Padding: 16px
- Sits on `#003580` dark blue hero background

## 5. Layout Principles

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48px
- Card gutter: 12px
- Content max-width: 1200px
- Results list: single column on results; 2-col grid on map view

### Border Radius Scale
- Input fields: 2px
- Buttons: 2px — Booking uses intentionally minimal radius
- Cards: 4px
- Review score badge: 8px (notched corner only — distinctive Booking shape)
- Avatar: 50%
- Tags/pills: 4px

## 6. Depth & Elevation

**Resting property card:**
```
box-shadow: 0 2px 8px rgba(0,0,0,0.1);
border: 1px solid #CDCDCD;
```

**Hover property card:**
```
box-shadow: 0 4px 16px rgba(0,0,0,0.15);
```

**Search widget on hero:**
```
box-shadow: 0 2px 16px rgba(0,0,0,0.25);
```

**Modal:**
```
box-shadow: 0 8px 32px rgba(0,0,0,0.2);
border-radius: 4px;
```

**Date picker dropdown:**
```
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
border: 1px solid #CDCDCD;
```

## 7. Do's and Don'ts

### Do
- Use `#0071C2` for all actionable elements — Booking's blue monoculture is its power
- Keep card border radius at 4px max — Booking's angular cards signal efficiency and seriousness
- Display the Booking.com review score in the distinctive dark blue notched badge (`#003580`)
- Put `#CC0000` red on discounted prices only — urgency without overuse
- Make the search widget the hero of every page — it's the product's core interaction

### Don't
- Don't use border radius above 8px on property cards — rounded cards feel wrong for this brand
- Don't remove the blue header — it's the primary brand anchor across all Booking properties
- Don't use alternative accent colors for CTAs — the all-blue convention is intentional and must not dilute
- Don't reduce information density on results pages — denser = higher conversion in this context

## 8. Responsive Behavior

Breakpoints:
- Mobile: 0–576px — full-width vertical property cards; bottom search bar sticky
- Tablet: 577–992px — 2-column grid with filter sidebar collapsible
- Desktop: 993–1200px — single-column wide list view; filter sidebar 220px fixed
- Wide: 1200px+ — map split view option; list 600px / map remainder

## 9. Agent Prompt Guide

### Quick Color Reference
- Action Blue: `#0071C2`
- Dark Blue: `#003580`
- Background: `#FFFFFF`
- Page Gray: `#F5F5F5`
- Text: `#333333`
- Secondary: `#6B6B6B`
- Discount Red: `#CC0000`
- Border: `#CDCDCD`

### Example Component Prompts
- "Booking.com property card: white background, 1px #CDCDCD border, 4px radius, hotel photo left 200px, property name Open Sans 16px bold #333333, location in #6B6B6B 13px, review score in #003580 dark blue notched badge white text, price right-aligned 24px bold — dense, trust-first"
- "Booking.com search hero: #003580 dark blue full-width background, white Open Sans headline 32px bold, white search widget on top — destination input, date pickers, guest count, blue #0071C2 'Search' CTA — all in one horizontal bar"
- "Booking.com filter sidebar: #FFFFFF white background, filter group headers Open Sans 14px bold, checkbox filters with #0071C2 blue checked state, 'Show results' sticky CTA button at bottom in solid blue"
