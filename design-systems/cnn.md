---
name: CNN
colors:
  neutral: "#141414"
  secondary: "#666666"
  primary: "#CC0000"
  tertiary: "#A00000"
typography:
  h1:
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44
  h2:
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28
  h3:
    fontSize: 18px
    fontWeight: 700
    lineHeight: 24
  body-md:
    fontSize: 18px
    fontWeight: 400
    lineHeight: 30
  caption:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18
  label:
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

CNN's design language is urgency institutionalized. The brand red (`#CC0000`) demands immediate attention — it signals breaking news, live broadcasts, and the weight of real-time events. Against a near-black background (`#141414`) for the video-first interface, or stark white for article pages, the red creates an immediate sense of tension and importance. This is not a relaxing reading experience — it's a news wire made visual.

The typography is CNN Sans — CNN's custom-commissioned typeface introduced in 2022, a confident neo-grotesque with optical sizing. It replaces the previous patchwork of licensed fonts with a unified voice that works from the 11px captions on map graphics all the way to 72px breaking-news banner text. CNN Sans is deliberate, authoritative, and slightly compressed — giving it a journalistic gravitas that neutral system fonts lack.

The editorial grid is dense and layered. The top-of-homepage "hero" zone features a large lead story spanning 2–3 columns, flanked by smaller secondary stories in a sidebar. Below, stories are organized into section zones delineated by red horizontal rules. Live TV integration creates a persistent video player in the top-right corner. Breaking news banners override the top of the page with full-width red. The visual hierarchy always answers: what is happening right now?

**Key Characteristics:**
- Brand red: `#CC0000`
- Dark background: `#141414` (video UI, dark mode)
- Light background: `#FFFFFF` (article page)
- Text primary: `#1A1A1A` (light mode), `#FFFFFF` (dark mode)
- Text secondary: `#666666` (light) / `rgba(255,255,255,0.6)` (dark)
- Live/Breaking: `#CC0000` badge with white text
- Font: CNN Sans (custom neo-grotesque)
- Section divider: 3px `#CC0000` rule

## Colors

### Primary
- **CNN Red** (`#CC0000`): Logo, breaking news, live badges, section dividers, primary CTA
- **Charcoal** (`#141414`): Video player background, dark-mode page background, sticky nav
- **White** (`#FFFFFF`): Article surface, card backgrounds in light mode

### Interactive
- **Red Hover** (`#A00000`): Link and button hover state — deeper red
- **Red Focus** (`rgba(204,0,0,0.35)`): Focus ring on interactive elements
- **Underline Link** (`#CC0000`): All body-text links in red on hover

### Surface
- **Article White** (`#FFFFFF`): Long-form article background
- **Light Gray** (`#F7F7F7`): Sidebar and related-story background
- **Border Gray** (`#E0E0E0`): Card borders, section separators in light mode
- **Dark Panel** (`#1A1A1A`): Video-adjacent panels, dark-mode cards
- **Live Overlay** (`rgba(204,0,0,0.9)`): Live badge background

## Typography

### Font Families
- **CNN Sans**: `"CNN Sans", "Helvetica Neue", Arial, sans-serif` — all UI contexts, all sizes
- **CNN Sans Display**: Optical sizing variant for 28px+ headlines
- **Fallback**: `"Helvetica Neue", Arial, Helvetica, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Breaking News Banner | CNN Sans | 16px | 700 | 20px | White uppercase on `#CC0000`, letter-spacing 1px |
| Hero Headline | CNN Sans Display | 44px | 700 | 50px | Lead story, tight kerning |
| H1 Article | CNN Sans Display | 36px | 700 | 44px | Article page primary headline |
| H2 Section Header | CNN Sans | 22px | 700 | 28px | "Politics", "World", "Business" labels |
| H3 Story Teaser | CNN Sans | 18px | 700 | 24px | Secondary story card headlines |
| H4 Minor Story | CNN Sans | 15px | 600 | 21px | Sidebar stories |
| Article Body | CNN Sans | 18px | 400 | 30px | Long-form reading text |
| Subheading | CNN Sans | 20px | 700 | 26px | Article in-text subheadings (bold) |
| Byline / Metadata | CNN Sans | 13px | 400 | 18px | `#666666`, "By [Author] · [Date]" |
| Caption | CNN Sans | 13px | 400 | 18px | `#666666` italicized photo captions |
| Nav Link | CNN Sans | 14px | 700 | 18px | Sticky header nav items |
| Live Badge | CNN Sans | 11px | 700 | 14px | Uppercase, white on red |
| Legal | CNN Sans | 12px | 400 | 16px | Footer copyright |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px
- Section top border + padding: 3px rule + 16px
- Article max-width: 720px (left-aligned at desktop)
- Grid: 12-column

### Border Radius Scale
- CNN uses **0px** throughout all editorial and news surfaces — zero radius = urgency and authority
- Exception: video play button: 50%
- Exception: author avatar: 50%
- Exception: profile icon in nav: 50%

## Elevation & Depth

CNN's editorial surfaces are flat — the editorial grid and color create hierarchy:

**All story cards (light mode):**
```
border: none;
background: #FFFFFF;
/* No shadow — flat editorial grid */
```

**Sticky navigation (dark):**
```
background: #141414;
box-shadow: 0 2px 8px rgba(0,0,0,0.3);
```

**Video player overlay:**
```
background: rgba(0,0,0,0.7);
```

**Breaking news bar:**
```
background: #CC0000;
/* No shadow — pure flat authority */
```

**Modal:**
```
background: #FFFFFF;
box-shadow: 0 8px 32px rgba(0,0,0,0.25);
```

## Components

### Buttons
**Primary (Subscribe / Watch Live):**
- Background: `#CC0000`
- Border: none
- Border radius: 0px — CNN uses sharp square corners
- Padding: `10px 20px`
- Font: CNN Sans, 14px / 700 / white / uppercase / letter-spacing 0.5px
- Hover: background `#A00000`

**Secondary (Sign In):**
- Background: `transparent`
- Border: `2px solid #CC0000`
- Border radius: 0px
- Color: `#CC0000`
- Hover: background `rgba(204,0,0,0.06)`

**Breaking News CTA:**
- Full-width `#CC0000` bar
- "BREAKING NEWS" uppercase white label left
- Story headline white 16px bold right
- No radius, full-bleed

### Cards & Containers
**Story Card:**
- Background: `#FFFFFF`
- Border: none (section rules provide structure)
- Border radius: 0px
- No box-shadow
- Image ratio: 16:9
- Hover: headline transitions to `#CC0000`

**Video Tile (Dark):**
- Background: `#141414`
- No border
- Border radius: 0px
- Overlay: red `LIVE` badge top-left

**Section Container:**
- Border-top: `3px solid #CC0000`
- Padding-top: 16px
- Margin-bottom: 32px

## Do's and Don'ts

### Do
- Use the 3px `#CC0000` red top-rule on every editorial section — it's the CNN visual grammar
- Apply CNN Sans at 18px / 30px line-height for all article body text — readability at scale
- Make breaking news headlines transition to red on hover — color signals news urgency
- Keep all border radii at 0px on editorial content — square corners = news authority
- Deploy "LIVE" and "BREAKING" badges in `#CC0000` with white text, always uppercase

### Don't
- Don't use red for decorative purposes — it carries news urgency and must be respected
- Don't add border radius to story cards — it softens the urgency the brand deliberately constructs
- Don't use a font other than CNN Sans — it was commissioned specifically for CNN's authority voice
- Don't reduce article body text below 18px — CNN's readership spans a wide age range

## Responsive Behavior

Breakpoints:
- Mobile: 0–640px — single column; sticky top bar with logo and hamburger
- Tablet: 641–1024px — 2-column story grid; video player expands
- Desktop: 1025–1280px — 3-column lead layout; persistent sidebar
- Wide: 1281px+ — hero story full-width; below-fold 3–4 column grid

## Agent Prompt Guide

### Quick Color Reference
- CNN Red: `#CC0000`
- Background (dark): `#141414`
- Background (light): `#FFFFFF`
- Text: `#1A1A1A`
- Secondary Text: `#666666`
- Section Rule: 3px `#CC0000` border-top
- Live Badge: `#CC0000` background, white text

### Example Component Prompts
- "CNN story card grid: white surface, zero border radius, 16:9 image, section red top rule 3px (#CC0000), H3 headline CNN Sans 18px bold #1A1A1A, byline in #666666 13px — hover headline turns red, flat editorial no shadow"
- "CNN breaking news banner: full-width #CC0000 bar, 'BREAKING NEWS' white uppercase CNN Sans left with letter-spacing, story headline white bold 16px right — urgent, zero radius, full bleed"
- "CNN video player card: #141414 dark background, red LIVE badge top-left (#CC0000 pill white text uppercase), 16:9 thumbnail, story title white CNN Sans 18px below — dark, broadcast-authority aesthetic"
