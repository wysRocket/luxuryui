# Design System Inspired by Etsy

## 1. Visual Theme & Atmosphere

Etsy's design evokes warmth, craft, and human connection — a deliberate counter to the sterile efficiency of mass-market e-commerce. The brand orange (`#F1641E`) is expressive and handmade-feeling, not corporate: it appears on the wordmark, primary CTAs, and critical UI moments. The surface palette leans warm — off-whites (`#FAF7F4`), warm grays, and earth tones — creating a tactile, artisanal atmosphere that mirrors the handcrafted products being sold.

Typography balances editorial sophistication with approachability. Guardian Egyptian (a high-quality serif) appears in editorial contexts like homepage headlines and category stories, while Graphik (a contemporary grotesque) handles all UI text, navigation, and form elements. The pairing creates a marketplace that feels both trustworthy and culturally sophisticated — like a well-curated indie magazine, not a tech product.

The product grid gives each item breathing room with generous whitespace, favoring image quality over density. Seller identity is a first-class citizen: shop names, owner photos, and "Made by hand" signals appear prominently. The emotional dimension — favorites, reviews, story sections — reinforces the community marketplace positioning.

**Key Characteristics:**
- Etsy Orange (`#F1641E`) as sole brand accent — used sparingly for maximum impact
- Warm off-white base (`#FAF7F4`) — never pure white
- Guardian Egyptian serif for editorial; Graphik sans-serif for UI
- Product images given generous space — always the primary visual
- Star ratings in yellow (`#D5A021`), hearts in orange for favorites
- Subtle warm borders (`#E8E4DF`) instead of cool grays
- Rounded corners moderate: 4px–12px, never pill-shaped CTAs
- "Story" copy sections with artisan photography backgrounds

## 2. Color Palette & Roles

### Primary
- **Etsy Orange** (`#F1641E`): Logo, primary CTA, active states, links
- **Warm White** (`#FAF7F4`): Page background — slightly warm, not pure white
- **Rich Black** (`#222222`): Primary text, headings

### Interactive
- **Hover Orange** (`#D25416`): Darker orange on button hover
- **Link Orange** (`#F1641E`): In-text links
- **Focus Ring** (`rgba(241,100,30,0.3)`): Accessible focus states

### Surface
- **Card White** (`#FFFFFF`): Product card background
- **Warm Gray** (`#F5EFE8`): Section dividers, alternate rows
- **Warm Border** (`#E8E4DF`): Card borders, separators
- **Mid Text** (`#6D6D6D`): Secondary labels, seller name
- **Muted** (`#A8A8A8`): Caption, timestamps

### Status
- **Star Gold** (`#D5A021`): Review stars, shop ratings
- **Favorite Red** (`#E8604B`): Saved/heart active state
- **Success Green** (`#2E7D32`): "In stock", order confirmed
- **Sale Tag** (`#D32F2F`): Sale price labels

## 3. Typography Rules

### Font Families
- **Editorial**: `Guardian Egyptian` — serif, homepage heroes, category stories
- **UI / Body**: `Graphik` — all navigation, buttons, product text, forms
- **Fallback**: `Georgia`, `serif` (Guardian) / `Helvetica Neue` (Graphik)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Homepage Hero | Guardian Egyptian | 56px | 700 | 1.10 | Editorial serif headline |
| Category Hero | Guardian Egyptian | 40px | 700 | 1.15 | Category page title |
| Section Heading | Graphik | 24px | 600 | 1.25 | "Picks for you" |
| Product Title | Graphik | 14px | 400 | 1.50 | 2-line clamp on card |
| Shop Name | Graphik | 13px | 600 | 1.30 | Seller attribution |
| Price | Graphik | 16px | 600 | 1.00 | Primary price display |
| Sale Price | Graphik | 16px | 700 | 1.00 | Red, struck original beside |
| Review Count | Graphik | 13px | 400 | 1.20 | "(2,847)" in muted |
| Body Copy | Graphik | 16px | 400 | 1.60 | Listing description |
| Navigation | Graphik | 14px | 500 | 1.00 | Top nav categories |
| Button | Graphik | 15px | 600 | 1.00 | CTA text |
| Caption | Graphik | 12px | 400 | 1.40 | Tags, metadata |

## 4. Component Stylings

### Buttons

**Primary CTA**
- Background: `#F1641E`
- Border-radius: 28px (pill)
- Padding: 12px 24px
- Font: Graphik 15px/600, white
- Hover: `#D25416`
- No border

**Secondary Outline**
- Background: `#FFFFFF`
- Border: `1px solid #D5CBC5`
- Color: `#222222`
- Radius: 28px

**Favorite Heart**
- Icon-only, transparent bg
- Resting: `#A8A8A8`
- Active: `#E8604B`
- No border/background

### Cards & Containers
- Product card: white bg, no border (uses shadow for definition)
- Hover: `box-shadow: 0 4px 16px rgba(0,0,0,0.1)` + translateY(-2px)
- Image: aspect-ratio 1:1 or 4:3, top of card
- Favorites button top-right corner overlay

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 56px, 80px

### Border Radius Scale
- Small (4px): Badges, status chips
- Medium (8px): Cards, images
- Large (12px): Modals, feature containers
- Pill (28px): CTA buttons

## 6. Depth & Elevation

- **Default cards**: No border, no shadow — clean white
- **Hover elevation**: `box-shadow: 0 4px 16px rgba(0,0,0,0.10)`, translateY(-2px)
- **Sticky nav**: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- **Modals**: `box-shadow: 0 12px 40px rgba(0,0,0,0.18)`
- **Philosophy**: Elevate on interaction, not at rest

## 7. Do's and Don'ts

### Do
- Let product photography be the hero — don't compete with it
- Use Guardian Egyptian serif for any editorial or storytelling context
- Keep the orange accent meaningful — CTAs, active states, logo only
- Use warm tones (`#FAF7F4`) instead of pure white for backgrounds
- Show seller names prominently — seller identity is a trust signal

### Don't
- Don't use orange as a decoration — it loses its CTA power
- Don't use cool grays — warm tones only (`#E8E4DF`, not `#E0E0E0`)
- Don't compress the product grid — quality over density
- Don't omit review stars and counts — social proof is critical here

## 8. Responsive Behavior

Breakpoints: 320px, 480px, 640px, 768px, 1024px, 1280px, 1600px
- Mobile: 2-column grid, hamburger nav, full-width CTAs
- Tablet: 3-column grid, filter bar horizontal scroll
- Desktop: 4-column grid, top category rail, left filter sidebar on search

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand orange: `#F1641E`
- Background: `#FAF7F4`
- Card: `#FFFFFF`
- Text: `#222222`
- Secondary: `#6D6D6D`
- Stars: `#D5A021`

### Example Component Prompts
- "Build product card: white bg, no border. Product image 1:1 ratio top. Graphik 14px/400 title, 2-line clamp. Price 16px/600 #222222. Orange heart top-right overlay. Hover: shadow 0 4px 16px rgba(0,0,0,0.1), translateY(-2px)."
- "Create section header: Guardian Egyptian 24px/700 #222222. Subtext Graphik 16px/400 #6D6D6D. 'See all' link #F1641E."
- "Design orange pill CTA: #F1641E bg, 28px radius, Graphik 15px/600 white. Hover: #D25416."
