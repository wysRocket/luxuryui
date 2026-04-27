---
name: Zara
colors:
  neutral: "#FFFFFF"
  primary: "#000000"
  tertiary: "#000000"
typography:
  label:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18
  body-md:
    fontSize: 14px
    fontWeight: 300
    lineHeight: 22
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16
---

## Overview

Zara's design system is the digital expression of a fashion philosophy: that luxury can be fast, that minimalism is the ultimate sophistication, and that the product — not the interface — is what demands attention. The visual language is radically reduced to pure black (`#000000`) and pure white (`#FFFFFF`), with no accent colors, no gradients, no decorative elements of any kind. Color, in the conventional UI sense, is simply absent. The fashion photography does all the communicating that color would otherwise handle.

This chromatic restraint is not a cost-cutting measure — it is Zara's aesthetic manifesto. The absence of color forces the photography to carry all emotional weight, which in turn means that every image must be extraordinary: editorial-quality, full-bleed, high-fashion, with near-professional lighting and model direction. The typography works in concert: display headings use a custom Zara serif that carries the character of printed fashion magazines, while interface copy uses a refined sans-serif that recedes into utility. The interplay between serif display type and sans-serif navigation creates a dual-personality interface that is simultaneously editorial and functional.

Products appear in a clean two-column grid with generous whitespace, product names in small, precise type, and prices in a matching weight. Adding a product to a bag, selecting a size, checking out — these flows are designed to feel effortless and invisible, so nothing interrupts the browsing experience. The interface never congratulates itself. It simply presents the clothes and steps aside.

**Key Characteristics:**
- Pure black (`#000000`) and pure white (`#FFFFFF`) only — no accent colors
- Custom Zara serif for display headings; Helvetica/Arial for UI chrome
- Full-bleed fashion photography as the primary design element
- Two-column product grid with minimal metadata per item
- No card borders, no shadows, no box-shadows — just whitespace
- Product image hover: secondary image crossfades in (no animation on mobile)
- Typography scale is very controlled — few sizes, distinct roles
- Shopping bag: minimal slide-in panel, line-item list in mono-weight type

## Colors

### Primary
- **Black** (`#000000`): All text, all icons, all borders, header, footer
- **White** (`#FFFFFF`): All backgrounds — page, cards, modals
- **Off-White** (`#F5F5F5`): Subtle background for secondary pages, loading states

### Interactive
- **Black Hover** (`#000000`): Buttons stay black — no hover color change (opacity shifts only)
- **Opacity Hover** (`0.70`): All links and buttons reduce to 70% opacity on hover
- **Pressed** (`0.50`): Press state, further opacity reduction

### Surface
- **Background** (`#FFFFFF`): Primary page background, always white
- **Overlay** (`rgba(0,0,0,0.40)`): Modal backdrop
- **Input Border** (`#000000`): Input fields use `1px solid #000000`, no rounding
- **Divider** (`rgba(0,0,0,0.12)`): Horizontal rules between sections
- **Border Light** (`rgba(0,0,0,0.08)`): Very subtle dividers within a component

### Text
- **Primary** (`#000000`): All text by default
- **Secondary** (`rgba(0,0,0,0.50)`): Metadata, subcopy, sizes below product names
- **Error** (`#000000`): Error messages also black — only weight/positioning differentiates
- **Disabled** (`rgba(0,0,0,0.25)`): Greyed-out sizes, unavailable options
- **Strikethrough** (`rgba(0,0,0,0.50)`): Sale original price (with line-through decoration)

### Semantic (minimal use)
- **Sale Red** (`#B12704`): The only non-black/white color; sale price tag ONLY
- **New Badge** (`#000000` bg, `#FFFFFF` text): "New" product label

## Typography

### Font Families
- **Display / Editorial**: `"Zara", "Larken", "Georgia", serif` — hero headings, campaign text, editorial
- **UI / Commerce**: `"HelveticaNeue-Light", "Helvetica Neue", Arial, sans-serif` — navigation, product names, buttons
- **Body Copy**: `"Helvetica Neue", Arial, sans-serif` — product descriptions, size guides, policy text

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Campaign Headline | Zara Serif | 64px | 400 | 72px | Full-bleed hero editorial text |
| Campaign Sub | Zara Serif | 32px | 400 | 40px | Secondary hero text, italic |
| Section Title | Helvetica Neue | 14px | 400 | 20px | "NEW ARRIVALS" — uppercase, tracked |
| Product Name | Helvetica Neue | 13px | 400 | 18px | Item name below image |
| Product Price | Helvetica Neue | 13px | 400 | 18px | Same size as name, below |
| Sale Price | Helvetica Neue | 13px | 400 | 18px | In #B12704 red, original struck |
| Nav Item | Helvetica Neue | 13px | 400 | 20px | Top navigation links, uppercase |
| Button Label | Helvetica Neue | 13px | 400 | 18px | "ADD TO BAG", "CHECKOUT" — caps |
| Body / Description | Helvetica Neue | 14px | 300 | 22px | Product description text |
| Size Label | Helvetica Neue | 12px | 400 | 16px | S, M, L, XS size grid |
| Filter Label | Helvetica Neue | 12px | 400 | 16px | Category/color filter chips |
| Caption | Helvetica Neue | 11px | 400 | 16px | Photo credits, material care icons |

## Layout

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 24, 32, 40, 48, 64, 80px`
- Product grid gap: `8px` (extremely tight — fashion editorial density)
- Page horizontal padding: `16px` (mobile), `24px` (tablet), `40px` (desktop)
- Section vertical gap: `64px`
- Product name top margin: `8px` below image

### Grid System
- Mobile: 2-column product grid, `8px` gap
- Tablet: 3-column product grid
- Desktop: 4-column product grid, max-width `1440px`
- Hero: full-bleed, no constraints
- Gap between image and text metadata: `8px`

### Border Radius Scale
- `0px` — absolutely everything: buttons, inputs, cards, modals, images, panels
- Zero radius is a brand-level requirement, not a style preference

## Elevation & Depth

### Shadow Scale
- **No shadows of any kind** — this is a hard rule for Zara's aesthetic
- Hierarchy is established through whitespace, type size, and opacity alone
- Shopping bag panel uses a left border, not a shadow
- Modal overlays use background color change, not box-shadow

### Overlay Treatments
- Modal backdrop: `rgba(0,0,0,0.40)` — simple, no blur
- Editorial text overlay: pure white or black text directly on image
- No frosted glass, no backdrop-filter, no blur effects

## Components

### Buttons

**Primary (Add to Bag)**
- Background: `#000000`
- Text: `#FFFFFF`, 13px Helvetica Neue 400, letter-spacing `0.1em`
- Text transform: `uppercase`
- Padding: `14px 0`
- Width: `100%` in product context
- Border radius: `0px` (no rounding — ever)
- Hover: opacity `0.75`

**Secondary / Ghost**
- Background: `#FFFFFF`
- Border: `1px solid #000000`
- Text: `#000000`, 13px uppercase, letter-spacing `0.1em`
- Same dimensions
- Hover: opacity `0.70`

**Size Selector**
- Width: `48px × 48px` or wider for text sizes
- Background: `#FFFFFF`
- Border: `1px solid rgba(0,0,0,0.20)`
- Text: 12px, black
- Selected: border `2px solid #000000`
- Sold out: `rgba(0,0,0,0.25)` text, diagonal line through
- Hover: border `1px solid #000000`

### Cards & Containers

**Product Card**
- Background: `#FFFFFF`
- Border: none
- Border radius: `0px`
- Box shadow: none
- Image: 2:3 portrait ratio, full-width, `object-fit: cover`
- Image hover: crossfade to secondary product image (0.3s ease)
- Product name: 13px, black, below image with `8px` top margin
- Price: 13px, same weight, 4px below name

**Shopping Bag Panel**
- Background: `#FFFFFF`
- Width: `400px`, slides in from right
- Border-left: `1px solid rgba(0,0,0,0.12)`
- Padding: `24px`
- No border-radius (full-height panel)
- Overlay: `rgba(0,0,0,0.40)` behind panel

**Editorial Hero**
- Full viewport width and height
- Image: `100vw × 100vh`, `object-fit: cover`
- Text overlay: absolute positioned, typically bottom-left or center
- No overlay gradient unless image is light and text is dark
- White text on dark imagery, or black text on light imagery

**Size Guide Modal**
- Background: `#FFFFFF`
- Width: `600px`
- No border-radius
- Padding: `40px`
- Border: `1px solid rgba(0,0,0,0.12)`
- Overlay: `rgba(0,0,0,0.40)`

## Do's and Don'ts

### Do
- Use full-bleed editorial photography at maximum fidelity — it's the entire design
- Keep all text at small sizes (11–14px) — Zara UI text is deliberately understated
- Uppercase all button labels and navigation items with letter-spacing `0.08–0.12em`
- Maintain zero border-radius everywhere without exception
- Let whitespace do the heavy lifting — generous margins around product grids

### Don't
- Don't introduce any accent color except `#B12704` for sale prices
- Don't add shadows, gradients, or visual effects of any kind
- Don't use font weights above 400 in UI contexts — Zara is categorically light
- Don't crop images to non-standard ratios — always 2:3 portrait for products
- Don't add hover animations beyond opacity or image crossfade

## Responsive Behavior

**Breakpoints:**
- `375px` — mobile; 2-column grid, full-bleed hero, slide-out bag
- `768px` — tablet; 3-column grid, navigation expands
- `1024px` — desktop; 4-column grid, hover interactions activate
- `1440px` — wide; max-width container, same 4-column grid

**Platform Adaptations:**
- Mobile: no hover crossfade (tap to view secondary image)
- Mobile navigation: hamburger → full-screen black overlay menu
- Desktop: image crossfade on hover, persistent navigation bar
- Bag: slide-in panel on desktop, full-page on mobile

## Agent Prompt Guide

### Quick Color Reference
- Background: `#FFFFFF`
- Primary Text: `#000000`
- Secondary Text: `rgba(0,0,0,0.50)`
- Button Background: `#000000`
- Sale Price: `#B12704`
- Divider: `rgba(0,0,0,0.12)`

### Example Component Prompts
- "Design a Zara product grid: white background, 2-column mobile / 4-column desktop, 2:3 portrait product images with 8px gap, product name and price below each in Helvetica Neue 13px, no borders no shadows no rounding"
- "Create a Zara full-bleed editorial hero: 100vh image, white serif headline 64px bottom-left positioned, black 'SHOP NOW' uppercase button in bottom corner"
- "Build a Zara add-to-bag flow: size selector grid (0px radius squares, selected = 2px black border), full-width black 'ADD TO BAG' button uppercase, no shadows anywhere"
- "Design a Zara shopping bag slide-in panel: 400px white panel from right, left border 1px black, product line items with image + name + price, total at bottom, checkout button full-width black"
