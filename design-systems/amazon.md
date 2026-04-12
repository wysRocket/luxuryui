# Design System Inspired by Amazon

## 1. Visual Theme & Atmosphere

Amazon's design language is utilitarian commerce at scale — every pixel earns its place by driving conversion or reducing friction. The palette pairs a rich navy header (`#131921`) with crisp white content surfaces, punctuated by the signature Amazon orange (`#FF9900`) that draws the eye to every actionable element. The result is a no-nonsense density that communicates abundance: Amazon has everything, and you can find it right now.

The typography system leans on Amazon Ember — a custom humanist sans-serif — to maintain legibility across a staggering information hierarchy. Product titles are dense and multi-line; metadata (ratings, sellers, delivery estimates) clusters beneath in a carefully tiered scale. Shadow use is deliberately restrained: a single low-contrast drop shadow defines card edges without adding visual weight that would slow scanning.

Spacing is tight by modern standards, reflecting years of A/B testing that shows denser layouts convert better for intent-driven shoppers. Star ratings in amber (`#F5A623`), green "In Stock" badges (`#007600`), and "Prime" blue (`#00A8E1`) are the only color departures — each carries a precise transactional signal, never decoration.

**Key Characteristics:**
- Header background: `#131921` (dark navy/near-black)
- Primary accent: `#FF9900` (Amazon orange) for all CTAs and interactive highlights
- Surface: `#FFFFFF` for product pages; `#F3F3F3` for section separators
- Link color: `#007185` (teal) — never plain blue
- Rating star color: `#F5A623`
- Prime badge color: `#00A8E1`
- Stock positive: `#007600` (dark green)
- Border radius: 4px maximum — intentionally minimal

## 2. Color Palette & Roles

### Primary
- **Amazon Orange** (`#FF9900`): Primary CTA button background, "Add to Cart", promotional badges
- **Navy Header** (`#131921`): Top navigation bar background, footer sub-nav background
- **Dark Link Teal** (`#007185`): All body-level hyperlinks, breadcrumbs, filter chips

### Interactive
- **Orange Hover** (`#E47911`): CTA button hover/pressed state — 10% darker than base orange
- **Teal Hover** (`#C7511F`): Secondary link hover on white backgrounds
- **Gold Input Focus** (`#E77600`): Focus ring on text inputs and search bar

### Surface
- **White** (`#FFFFFF`): Primary product card and page background
- **Light Gray** (`#F3F3F3`): Section separators, sidebar backgrounds, review blocks
- **Mid Gray** (`#DDDDDD`): Divider lines, card borders
- **Overlay Dark** (`rgba(0,0,0,0.65)`): Modal overlays and mega-menu backdrops

## 3. Typography Rules

### Font Families
- **Amazon Ember**: `"Amazon Ember", Arial, sans-serif` — primary for all UI text, product copy, and navigation
- **Bookerly**: `"Bookerly", Georgia, serif` — Kindle / reading contexts only, not main UI

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Page H1 (product title) | Amazon Ember | 21px | 400 | 29px | Multi-line, 3-line clamp on cards |
| H2 (section header) | Amazon Ember | 24px | 700 | 32px | "Related items", "Customers also bought" |
| H3 (widget title) | Amazon Ember | 18px | 700 | 24px | Deal widgets, category banners |
| Body / Description | Amazon Ember | 14px | 400 | 20px | Default content text |
| Price (whole) | Amazon Ember | 28px | 400 | 36px | Integer part of price, bright red `#B12704` |
| Price (decimal) | Amazon Ember | 13px | 400 | 16px | Superscript cents |
| Rating count | Amazon Ember | 14px | 400 | 20px | `#007185` link color |
| Nav link | Amazon Ember | 13px | 700 | 18px | White on dark header |
| Small / metadata | Amazon Ember | 12px | 400 | 18px | Seller name, delivery date |
| Badge text | Amazon Ember | 11px | 700 | 14px | "Prime", "Best Seller" labels |
| Legal / footnote | Amazon Ember | 11px | 400 | 16px | `#767676` on white |

## 4. Component Stylings

### Buttons
**Primary (Add to Cart):**
- Background: `#FFD814` (yellow-gold, not orange — Amazon's cart button is yellow)
- Border: `1px solid #FCD200`
- Border radius: 8px
- Padding: `9px 17px`
- Font: 13px / 700
- Hover: background `#F7CA00`, box-shadow `0 2px 5px rgba(213,217,217,0.5)`

**Secondary (Buy Now):**
- Background: `#FFA41C`
- Border: `1px solid #FF8F00`
- Border radius: 8px
- Same padding and font as primary
- Hover: background `#FA8900`

**Ghost (See all results):**
- Background: `transparent`
- Border: `1px solid #D5D9D9`
- Color: `#0F1111`
- Hover: background `#F7FAFA`

### Cards & Containers
- Background: `#FFFFFF`
- Border: none (uses shadow instead)
- Box-shadow: `0 2px 5px rgba(213,217,217,0.5), 0 1px 2px rgba(0,0,0,0.15)`
- Border radius: 8px
- Padding: 16px
- Image container: square ratio with `object-fit: contain` on white background

## 5. Layout Principles

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px
- Column gutter: 16px standard; 12px on mobile
- Content max-width: 1500px centered

### Border Radius Scale
- Micro (badges, tags): 3px
- Default (cards, inputs, buttons): 8px
- Pill (Prime badge): 24px
- Avatar: 50% circle

## 6. Depth & Elevation

Amazon uses a minimal two-level elevation system:

**Level 1 — Card resting:**
```
box-shadow: 0 2px 5px rgba(213,217,217,0.5), 0 1px 2px rgba(0,0,0,0.15);
```

**Level 2 — Hover / dropdown:**
```
box-shadow: 0 6px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12);
```

**Level 3 — Modal / mega-menu:**
```
box-shadow: 0 8px 28px rgba(0,0,0,0.28);
```

No blurred glass or layered translucency — pure hard shadow realism.

## 7. Do's and Don'ts

### Do
- Use `#FF9900` exclusively for promotional highlights and badges — never for body text
- Keep card border radius at 8px across all product surfaces
- Display prices with `#B12704` for the primary amount to trigger urgency
- Use `#007185` teal for all clickable links — never default browser blue
- Always show delivery date in green `#007600` to reinforce Prime value

### Don't
- Don't use gradients on CTA buttons — Amazon's buttons are flat fills
- Don't exceed 4 typeface weights — the brand vocabulary is intentionally narrow
- Don't use orange (`#FF9900`) as a link color — it conflicts with CTA hierarchy
- Don't increase card radius above 8px — it softens the utilitarian brand feel

## 8. Responsive Behavior

Breakpoints:
- Mobile: 0–480px — single column, sticky header compresses to search-dominant
- Tablet: 481–768px — 2-column product grid
- Desktop SM: 769–1024px — 3–4 column grid, sidebar appears
- Desktop LG: 1025–1500px — 5–6 column grid with sponsored slots
- Wide: 1500px+ — grid caps at 7 items; outer gutters expand

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand Orange: `#FF9900`
- CTA Yellow: `#FFD814`
- Header Navy: `#131921`
- Link Teal: `#007185`
- Price Red: `#B12704`
- Surface: `#FFFFFF` / `#F3F3F3`
- Success Green: `#007600`

### Example Component Prompts
- "Amazon-style product card with white background, 8px radius shadow card, orange star ratings (#F5A623), teal review count link, yellow Add to Cart button (#FFD814), and dark price in #B12704 — dense but scannable"
- "Amazon top navigation bar: #131921 background, Amazon Ember font in white, orange search button on right, 'Delivering to' location widget, Prime badge in #00A8E1"
- "Amazon checkout button row: large yellow primary CTA (#FFD814) above smaller orange Buy Now (#FFA41C), both 8px radius, stacked vertically with 8px gap on white card"
