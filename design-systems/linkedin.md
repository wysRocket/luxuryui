# Design System Inspired by LinkedIn

## 1. Visual Theme & Atmosphere

LinkedIn's design system is purpose-built for professional trust and ambient social proof. The dominant palette — LinkedIn Blue (`#0A66C2`) against white — signals corporate reliability in a way that no other color pairing does for a professional audience. The interface is clean without being sterile, warm without being casual. Every element is calibrated to read "office-appropriate" at all times.

Source Sans Pro is LinkedIn's primary typeface — a humanist sans-serif commissioned for legibility at screen resolutions and optimized for reading dense professional content. The type hierarchy is generous: headings are large and confident, body text is comfortable at 14–16px with relaxed 1.5 line-height. The feed, the core interaction surface, uses a card-based layout with subtle shadows that makes each piece of content feel like a document placed on a white desk.

The design prioritizes connection and engagement signals: profile photos are circular (always), reaction counts are prominent, connection badges appear next to names. Navigation is persistent and structured, and the LinkedIn blue appears wherever an action can be taken — buttons, links, active tabs, notification badges. Secondary colors are minimal: gray for chrome, white for surfaces, and controlled use of gold for premium features.

**Key Characteristics:**
- LinkedIn Blue: `#0A66C2` — all primary interactive elements, brand color
- White dominant: `#FFFFFF` — feed cards, profile cards, page backgrounds
- Source Sans Pro — professional, humanist, excellent for long-form reading
- Circular profile photos throughout — 24px to 128px
- Card-based feed with controlled box shadows
- Gold premium accent: `#B9852D` — LinkedIn Premium badges, job alerts
- Gray system: `#F3F2EF` background, `#666666` secondary text
- Connection degree badges: 1st, 2nd, 3rd with blue/gray coloring

## 2. Color Palette & Roles

### Primary
- **LinkedIn Blue** (`#0A66C2`): primary buttons, links, active states, brand
- **White** (`#FFFFFF`): card and page backgrounds
- **Ink** (`#000000`): primary heading text
- **Body Text** (`#191919`): profile names, post text
- **Secondary Text** (`#666666`): metadata, timestamps, secondary labels

### Interactive
- **Blue Hover** (`#0956A4`): button hover state
- **Blue Active** (`#084D8C`): pressed state
- **Like Blue** (`#378FE9`): like reaction color
- **Premium Gold** (`#B9852D`): premium badge, upgrade CTAs

### Surface
- **Page Background** (`#F3F2EF`): feed background, profile backgrounds
- **Card** (`#FFFFFF`): post cards, profile sections, job listings
- **Border** (`rgba(0,0,0,0.08)`): card outlines, dividers
- **Notification Red** (`#E34E2E`): unread badge on nav

## 3. Typography Rules

### Font Families
- **Source Sans Pro**: `"Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif` — all text
- **System UI** (mobile): `-apple-system, BlinkMacSystemFont` on iOS/Android native apps

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display / Hero | Source Sans Pro | 32px | 700 | 1.15 | Landing pages, major headers |
| H1 | Source Sans Pro | 24px | 700 | 1.2 | Profile name, page titles |
| H2 | Source Sans Pro | 20px | 700 | 1.25 | Section headers, card titles |
| H3 | Source Sans Pro | 16px | 600 | 1.3 | Job titles, company names |
| Body Large | Source Sans Pro | 16px | 400 | 1.6 | Post body, about sections |
| Body Default | Source Sans Pro | 14px | 400 | 1.5 | Feed posts, comments |
| Caption | Source Sans Pro | 12px | 400 | 1.4 | Timestamps, "1st", locations |
| Label | Source Sans Pro | 12px | 700 | 1.2 | Button text, tags |
| Notification | Source Sans Pro | 11px | 700 | 1.0 | Badge count, red dot |

## 4. Component Stylings

### Buttons
- **Primary**: `background: #0A66C2`, `color: #FFFFFF`, `border-radius: 24px`, `padding: 10px 24px`, `font: Source Sans Pro 16px 600`
- **Hover**: `background: #0956A4`
- **Secondary / Outline**: `border: 1.5px solid #0A66C2`, `color: #0A66C2`, `background: transparent`, `border-radius: 24px`
- **Secondary Hover**: `background: rgba(10,102,194,0.08)`
- **Connect**: `border: 1.5px solid #666666`, `color: #666666`, pill shape — becomes blue after connecting
- **Ghost**: `color: #666666`, no border, hover `background: rgba(0,0,0,0.05)`

### Cards & Containers
- **Feed Card**: `background: #FFFFFF`, `border-radius: 8px`, `border: 1px solid rgba(0,0,0,0.08)`, `box-shadow: 0 0 0 1px rgba(0,0,0,0.08)`, `margin-bottom: 8px`
- **Profile Card**: `border-radius: 8px`, top banner image with circular avatar overlapping bottom edge
- **Sidebar Widget**: `background: #FFFFFF`, `border-radius: 8px`, `border: 1px solid rgba(0,0,0,0.08)`
- **Modal**: `background: #FFFFFF`, `border-radius: 8px`, `box-shadow: 0 4px 24px rgba(0,0,0,0.20)`

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48
- Feed max-width: 552px centered
- Left sidebar: 225px fixed
- Right sidebar: 300px fixed

### Border Radius Scale
- **4px** — skill tags, small badges
- **8px** — cards, modals, sidebars
- **24px** — primary and secondary buttons (pill shape)
- **50%** — profile photos, avatar circles

## 6. Depth & Elevation

- **Level 0** (background): `#F3F2EF` — page canvas
- **Level 1** (card): `box-shadow: 0 0 0 1px rgba(0,0,0,0.08)` — feed cards, flat
- **Level 2** (dropdown): `box-shadow: 0 2px 8px rgba(0,0,0,0.14)` — nav dropdowns
- **Level 3** (modal): `box-shadow: 0 4px 24px rgba(0,0,0,0.20)` — full modals
- **Blue underline** (active nav): `border-bottom: 2px solid #0A66C2`, 48px height

## 7. Do's and Don'ts

### Do
- Always use circular profile photos — never rectangular
- Use pill-shaped buttons (border-radius 24px) for all primary and secondary CTAs
- Show connection degree (1st, 2nd, 3rd) beside every name
- Use LinkedIn Blue for all actionable elements consistently
- Keep feed cards on the `#F3F2EF` background to create depth separation

### Don't
- Don't use heavy shadows — LinkedIn cards are nearly flat with single-pixel borders
- Don't mix font weights aggressively — two weights maximum per card
- Don't use red except for notification badges
- Don't exceed 552px feed card width — professional reading context

## 8. Responsive Behavior
Breakpoints: 375px (mobile), 768px (tablet), 1128px (desktop)

- **375px**: single-column; bottom tab navigation; collapsed sidebars
- **768px**: feed + right sidebar; hamburger for left sidebar
- **1128px**: full 3-column: left profile sidebar | feed | right sidebar

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: `#0A66C2`
- Background: `#F3F2EF`
- Card: `#FFFFFF`
- Text: `#191919`
- Secondary: `#666666`
- Premium: `#B9852D`

### Example Component Prompts
- "A LinkedIn feed card with white background, 8px radius, single-pixel border rgba(0,0,0,0.08), circular 48px avatar, Source Sans Pro 14px body text, blue text link, like/comment/share action row at bottom"
- "A Connect button with 1.5px border #666666, pill shape 24px radius, Source Sans Pro 16px 600, turns blue after connection"
- "A primary CTA with #0A66C2 fill, white text, pill border-radius 24px, 10px×24px padding"
