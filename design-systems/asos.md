---
name: ASOS
colors:
  tertiary: "#000000"
  secondary: "#696969"
  primary: "#000000"
  neutral: "#F0F0F0"
typography:
  h2:
    fontFamily: Arial
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28
  h3:
    fontFamily: Arial
    fontSize: 18px
    fontWeight: 700
    lineHeight: 24
  label:
    fontFamily: Arial
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20
  body-md:
    fontFamily: Arial
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22
  caption:
    fontFamily: Arial
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16
rounded:
  sm: 2px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

ASOS operates with radical simplicity: black, white, and product photography. The brand's design philosophy treats every non-product pixel as potential noise — the UI's job is to disappear so that fashion imagery can dominate. The signature accent is a sharp red (`#CC0202`) reserved exclusively for sale pricing, promotional banners, and error states, creating an immediate Pavlovian association: red means discount.

The typographic system relies on Arial and Helvetica — web-safe, no-nonsense grotesques that load fast and feel direct. Headlines are heavy (700–900 weight) and set in uppercase for editorial impact; body copy sits at 14px with generous line-height. The grid is product-photography-first: square card cells with hover overlays that reveal secondary product angle and quick-add controls. Whitespace is used liberally between grid rows but tightly between product image and metadata within a card.

Dark mode is a deliberate black (`#000000`) header and footer frame sandwiching the white (`#FFFFFF`) product content zone — the contrast signals "this is fashion." Navigation mega-menus are rich with editorial category photography. The overall aesthetic is: fast fashion speed, editorial photography quality, zero-friction commerce.

**Key Characteristics:**
- Primary accent: `#CC0202` (ASOS red) — sale prices and promotions only
- Header/footer: `#000000`
- Content surface: `#FFFFFF`
- Background alt: `#F6F6F6` (light gray for filter panels)
- Text primary: `#1A1A1A`
- Text secondary: `#696969`
- Border: `#D4D4D4`
- Font: Arial, Helvetica, sans-serif

## Colors

### Primary
- **ASOS Black** (`#000000`): Header, footer, primary navigation, CTA button default
- **ASOS Red** (`#CC0202`): Sale price, discount badge, promotional overlay, error validation
- **Body Text** (`#1A1A1A`): All product titles and main UI text

### Interactive
- **Black Hover** (`#333333`): Button hover state lightens from full black
- **Red Link Hover** (`#990000`): Sale price link hover (darker red)
- **Gray Hover** (`#F0F0F0`): List item and filter chip hover background

### Surface
- **White** (`#FFFFFF`): Product cards, content background, form inputs
- **Light Gray** (`#F6F6F6`): Sidebar filter panel, breadcrumb bar
- **Mid Gray** (`#D4D4D4`): Card borders, input outlines, dividers
- **Overlay Dark** (`rgba(0,0,0,0.5)`): Hover product overlay, modal backdrop

## Typography

### Font Families
- **Primary**: `Arial, Helvetica, "Helvetica Neue", sans-serif` — all UI contexts
- **Editorial Uppercase**: `Arial Black, Arial, sans-serif` — hero banners and category headers at heavy weight

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Banner Title | Arial Black | 48px | 900 | 52px | All-caps, white on dark imagery |
| Category Header | Arial | 28px | 700 | 34px | Uppercase, page section titles |
| H2 Editorial | Arial | 22px | 700 | 28px | Sub-category titles |
| H3 Section | Arial | 18px | 700 | 24px | Filter group labels, widget headers |
| Product Title | Arial | 14px | 400 | 20px | `#1A1A1A`, 2-line clamp |
| Brand Name | Arial | 14px | 700 | 20px | Above product title, brand logo-adjacent |
| Price (original) | Arial | 14px | 400 | 20px | `#696969`, strikethrough on sale |
| Price (sale) | Arial | 14px | 700 | 20px | `#CC0202` bold — sale ONLY |
| Nav link | Arial | 14px | 700 | 20px | White on black header |
| Body / Description | Arial | 14px | 400 | 22px | Product detail copy |
| Caption / Label | Arial | 12px | 400 | 16px | `#696969` size guide, color label |
| Legal | Arial | 11px | 400 | 16px | `#A0A0A0` footer terms |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48px
- Product grid gutter: 16px
- Content max-width: 1280px

### Border Radius Scale
- ASOS uses **0px** throughout all product and commerce surfaces — square corners are the brand
- Exception: avatar/profile: 50%
- Exception: tag/badge pill: 2px (very slight rounding only)

## Elevation & Depth

ASOS keeps elevation nearly flat — the fashion photography provides visual hierarchy:

**Resting product card:**
```
border: 1px solid #D4D4D4;
/* No shadow */
```

**Hover product card:**
```
border-color: #000000;
/* No shadow — hard border sharpens on hover */
```

**Dropdown / mega-menu:**
```
box-shadow: 0 8px 16px rgba(0,0,0,0.12);
background: #FFFFFF;
```

**Modal:**
```
box-shadow: 0 4px 24px rgba(0,0,0,0.2);
```

## Components

### Buttons
**Primary (Add to Bag):**
- Background: `#000000`
- Border: none
- Border radius: 0px — intentionally sharp, square corners
- Padding: `12px 24px`
- Font: Arial, 14px / 700 / white / uppercase / letter-spacing 1px
- Hover: background `#333333`
- Active: background `#000000`, ring `2px solid #000000` offset

**Secondary (Save to Wishlist):**
- Background: `#FFFFFF`
- Border: `1px solid #1A1A1A`
- Border radius: 0px
- Color: `#1A1A1A`
- Hover: background `#F6F6F6`

**Promotional (Sale CTA):**
- Background: `#CC0202`
- Border: none
- Border radius: 0px
- Color: `#FFFFFF`
- Font: uppercase, letter-spacing 1px
- Hover: background `#990000`

### Cards & Containers
**Product Grid Card:**
- Background: `#FFFFFF`
- Border: `1px solid #D4D4D4`
- Border radius: 0px — completely square
- Hover: border-color `#000000`; overlay appears on image showing alt view + quick-add button
- Image ratio: 4:5 portrait (fashion standard)
- Image hover: `opacity 0.9` + overlay `rgba(0,0,0,0.08)`

**Filter Panel:**
- Background: `#F6F6F6`
- Border-right: `1px solid #D4D4D4`
- Border radius: 0px

## Do's and Don'ts

### Do
- Keep all border radii at 0px for commerce-facing elements — square is the ASOS identity
- Reserve `#CC0202` exclusively for sale prices and promotional messaging
- Use uppercase + letter-spacing on all primary CTAs (`letter-spacing: 1px`)
- Let product photography be the hero — card padding is minimal (8px max)
- Use 4:5 portrait ratio for all product images — this is the fashion standard

### Don't
- Don't add rounded corners to product cards or buttons — it conflicts with the brand's sharp aesthetic
- Don't use red for anything other than sale/promotional states — it loses urgency
- Don't use decorative shadows on product cards — flat borders maintain editorial crispness
- Don't vary the font — Arial/Helvetica uniformity is intentional and must be maintained

## Responsive Behavior

Breakpoints:
- Mobile: 0–640px — 2-column grid; filters collapse to slide-up bottom sheet
- Tablet: 641–1024px — 3-column grid; filter sidebar overlays on tap
- Desktop SM: 1025–1280px — 4-column grid; left filter sidebar permanent (220px)
- Desktop LG: 1281px+ — 5-column grid; top filter bar option appears

## Agent Prompt Guide

### Quick Color Reference
- Brand Black: `#000000`
- Sale Red: `#CC0202`
- Surface: `#FFFFFF`
- Panel Gray: `#F6F6F6`
- Text: `#1A1A1A`
- Secondary Text: `#696969`
- Border: `#D4D4D4`

### Example Component Prompts
- "ASOS product grid card: white surface, 1px #D4D4D4 border, zero radius, 4:5 portrait product photo, brand name in #1A1A1A Arial 14px bold, product title in 14px regular, original price in #696969 strikethrough, sale price in #CC0202 bold — completely flat, no shadow"
- "ASOS black header navigation: #000000 background, ASOS logo white on left, nav links in white Arial 14px bold uppercase with 1px letter-spacing, search bar in center with white outline, bag/wishlist icons right aligned"
- "ASOS add-to-bag button: full-width #000000 background, white text Arial 14px uppercase bold letter-spacing-1, zero border radius, hover lighten to #333333 — square, direct, fashion-fast"
