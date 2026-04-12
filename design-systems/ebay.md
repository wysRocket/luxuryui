# Design System Inspired by eBay

## 1. Visual Theme & Atmosphere

eBay's design is dense, utilitarian, and marketplace-first — every pixel is optimized for product discovery and conversion. The iconic four-color wordmark (red `#E53238`, blue `#0064D2`, yellow `#F5AF02`, green `#86B817`) creates a playful brand identity that contrasts with the otherwise restrained, white-dominant UI. The design philosophy prioritizes information density: tight grids, compact product tiles, and minimal whitespace to maximize the number of items visible above the fold.

Typography is set in Market Sans — eBay's proprietary typeface — a clean, neutral grotesque designed for maximum legibility across pricing, product names, and metadata. Text hierarchy is practical: large bold prices dominate each card, with shipping and condition info rendered in smaller secondary type. The red accent is used sparingly for urgency markers (auction countdown timers, "Buy It Now" labels, limited availability warnings).

The interaction model is search-first: the top search bar is always prominent, and filters stack along the left rail. The overall atmosphere is "department store catalog" — comprehensive, familiar, and conversion-optimized above all else.

**Key Characteristics:**
- Four-color wordmark: red (`#E53238`), blue (`#0064D2`), yellow (`#F5AF02`), green (`#86B817`)
- White primary surface (`#FFFFFF`) with light gray containers (`#F7F7F7`)
- Market Sans proprietary font — all UI text
- Bold price display as primary visual hierarchy on product cards
- Red (`#E53238`) for urgency states, blue (`#0064D2`) for links and CTAs
- Dense 4–6 column product grid with compact 8px gaps
- Border radius conservative: 4px–8px throughout

## 2. Color Palette & Roles

### Primary
- **eBay Blue** (`#0064D2`): Links, primary CTA, trusted badge, header
- **eBay Red** (`#E53238`): Urgency, sale price, auctions, "Watch" heart
- **Pure White** (`#FFFFFF`): Primary surface, card backgrounds

### Interactive
- **Hover Blue** (`#004BB4`): Button hover on blue CTA
- **Link Blue** (`#3665F3`): In-text hyperlinks (lighter shade)
- **Active Green** (`#2A7D0E`): "Sold" indicator, positive price delta

### Surface
- **Light Gray** (`#F7F7F7`): Page background, alternate row
- **Border Gray** (`#D8D8D8`): Card borders, separators
- **Mid Gray** (`#767676`): Secondary text, metadata
- **Dark Text** (`#191919`): Primary text, product titles

### Status
- **Yellow** (`#F5AF02`): Star ratings, "Top Rated" badge
- **Green** (`#86B817`): Free shipping badge, positive indicators
- **Orange** (`#FF6900`): "Hot" label, deals

## 3. Typography Rules

### Font Families
- **Primary**: `Market Sans` — all UI text, proprietary eBay typeface
- **Fallback**: `Helvetica Neue`, `Arial`, `sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Search Bar | Market Sans | 18px | 400 | 1.30 | Placeholder text |
| Page Heading | Market Sans | 28px | 700 | 1.20 | Category headers |
| Section Title | Market Sans | 20px | 700 | 1.25 | "Related" sections |
| Product Title | Market Sans | 14px | 400 | 1.40 | Product card name (2-line clamp) |
| Price Primary | Market Sans | 20px | 700 | 1.00 | Main bid/sale price |
| Price Struck | Market Sans | 14px | 400 | 1.00 | Strikethrough original |
| Shipping Label | Market Sans | 13px | 400 | 1.30 | "+shipping" info |
| Condition | Market Sans | 12px | 600 | 1.20 | "New", "Used - Like New" |
| Bid Count | Market Sans | 13px | 400 | 1.20 | "14 bids" |
| CTA Button | Market Sans | 16px | 700 | 1.00 | "Buy It Now", "Place Bid" |
| Navigation | Market Sans | 14px | 400 | 1.00 | Category nav |

## 4. Component Stylings

### Buttons

**Primary "Buy It Now"**
- Background: `#0064D2`
- Border-radius: 24px (pill)
- Padding: 10px 20px
- Font: Market Sans 16px/700, white
- Hover: `#004BB4`
- Width: 100% on card

**Secondary "Add to Cart"**
- Background: `#FFFFFF`
- Border: `1px solid #0064D2`
- Color: `#0064D2`
- Radius: 24px

**Watchlist Heart**
- Icon button, no background
- Color: `#E53238` when active
- Border: `1px solid #D8D8D8` in resting

### Cards & Containers
- Product card: white, `1px solid #D8D8D8`, 4px radius
- Hover: `box-shadow: 0 4px 12px rgba(0,0,0,0.12)`
- Image ratio: 1:1 (square), object-fit: contain, white bg
- Price bold and large — most prominent element

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px

### Border Radius Scale
- Minimal (0px): Table rows, input fields (no radius)
- Small (4px): Product cards, image containers
- Medium (8px): Category chips, filter pills
- Pill (24px): CTA buttons, action buttons

## 6. Depth & Elevation

- **Cards default**: `border: 1px solid #D8D8D8`, no shadow
- **Cards hover**: `box-shadow: 0 4px 12px rgba(0,0,0,0.12)`
- **Modals**: `box-shadow: 0 8px 32px rgba(0,0,0,0.2)`
- **Sticky header**: `box-shadow: 0 2px 4px rgba(0,0,0,0.08)`
- Philosophy: border-first, shadow only on interaction

## 7. Do's and Don'ts

### Do
- Lead with price as the dominant card element — it's the decision driver
- Use blue (`#0064D2`) for all primary CTAs — trust and action color
- Use red (`#E53238`) exclusively for urgency: auction timers, sale labels
- Keep grid density high — eBay shoppers scan, they don't browse
- Show condition and shipping info on every product card

### Don't
- Don't use decorative illustration or heavy brand moments — this is utilitarian
- Don't apply rounded corners to product images — keep them square
- Don't use gradients or complex backgrounds — white surfaces only
- Don't hide shipping costs — price transparency is a eBay trust signal

## 8. Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px, 1600px
- Mobile: 2-column grid, stacked category chips, bottom search
- Tablet: 3-column grid, filter sidebar collapsible
- Desktop: 4–6 column grid, persistent left filter rail (220px)
- Left nav filter rail persists at 1024px+

## 9. Agent Prompt Guide

### Quick Color Reference
- CTA blue: `#0064D2`
- Urgency red: `#E53238`
- Rating yellow: `#F5AF02`
- Background: `#FFFFFF`
- Text primary: `#191919`
- Secondary: `#767676`

### Example Component Prompts
- "Build product card: white bg, 1px solid #D8D8D8, 4px radius. Square image top. Product title Market Sans 14px/400 2-line clamp. Price 20px/700 #191919. 'Buy It Now' blue pill CTA."
- "Create urgency timer: #E53238 text, Market Sans 13px/700. Clock icon left. 'Ends in 2h 14m' format."
- "Design auction row: product image left 80px square. Title, bid count 13px/400, current bid 20px/700 #E53238."
