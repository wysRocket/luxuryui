---
name: BBC News
colors:
  neutral: "#FFFFFF"
  secondary: "#63676A"
  primary: "#BB1919"
  tertiary: "#BB1919"
typography:
  h1:
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48
  h2:
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30
  h3:
    fontSize: 20px
    fontWeight: 700
    lineHeight: 26
  body-md:
    fontSize: 18px
    fontWeight: 400
    lineHeight: 30
  caption:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

BBC News carries the visual authority of a global public broadcaster: structured, trustworthy, and deliberately un-designed in the decorative sense. The palette is anchored by BBC Red (`#BB1919`) — the same red used on the BBC logo for decades — paired with pure white content surfaces and near-black text (`#1A1A1A`). The result is a newspaper-in-digital-form aesthetic that signals editorial credibility without relying on visual flourish.

The Reith type family — BBC's bespoke typeface commissioned in 2017 — is the cornerstone of the system. Reith Serif anchors long-form article text and headline treatments; Reith Sans handles navigation, metadata, and UI labels. This custom family gives BBC News a uniquely authoritative voice that no system font can replicate. Type sizing is large and high-contrast for accessibility compliance across BBC's global audience demographic.

Layout is grid-heavy and editorial: a classic 12-column system with sections delineated by thin red horizontal rules (`#BB1919`), story importance communicated by size and position rather than color. Breaking news triggers a full-width red banner. The information density is deliberately high — BBC News assumes an engaged, literate reader who wants to see many stories simultaneously without excessive scrolling.

**Key Characteristics:**
- Brand red: `#BB1919`
- Background: `#FFFFFF`
- Text primary: `#1A1A1A`
- Text secondary: `#63676A`
- Section divider red rule: `#BB1919` (3px horizontal rule)
- Link color: `#1A1A1A` (underlined) / `#BB1919` on hover
- Navigation: `#1A1A1A` on white (top bar) and `#FFFFFF` on `#1A1A1A` (sticky scroll)
- Font: Reith Serif (articles), Reith Sans (UI)

## Colors

### Primary
- **BBC Red** (`#BB1919`): Logo, breaking news banners, section divider rules, primary action states, hover link color
- **Black** (`#1A1A1A`): All body text, primary navigation, article headlines
- **White** (`#FFFFFF`): Page and card backgrounds

### Interactive
- **Red Hover** (`#981515`): Navigation and link hover state — darker BBC red
- **Link Underline** (`#1A1A1A`): Article body links are black-underlined; hover transitions to red
- **Focus Ring** (`#BB1919`): Keyboard focus outline, 2px solid

### Surface
- **White** (`#FFFFFF`): Primary article and card surface
- **Light Gray** (`#F2F2F2`): Related content panels, sidebar background
- **Mid Gray** (`#D9D9D9`): Dividers within card clusters
- **Dark Nav** (`#1A1A1A`): Sticky header background on scroll
- **Overlay** (`rgba(0,0,0,0.7)`): Video and image overlays

## Typography

### Font Families
- **Reith Serif**: `"BBC Reith Serif", Georgia, "Times New Roman", serif` — article body, long-form headlines
- **Reith Sans**: `"BBC Reith Sans", Arial, Helvetica, sans-serif` — UI labels, navigation, captions, metadata

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Breaking News Banner | Reith Sans | 14px | 700 | 18px | White on `#BB1919`, uppercase |
| H1 Lead Story | Reith Serif | 40px | 700 | 48px | Above-fold primary headline |
| H1 Article | Reith Serif | 32px | 700 | 40px | Article page headline |
| H2 Section | Reith Sans | 24px | 700 | 30px | "UK News", "World", "Sport" headers |
| H3 Story Teaser | Reith Serif | 20px | 700 | 26px | Secondary story grid headlines |
| H4 Minor Story | Reith Serif | 17px | 600 | 22px | Sidebar / related stories |
| Article Body | Reith Serif | 18px | 400 | 30px | Long-form article text |
| Caption | Reith Sans | 13px | 400 | 18px | `#63676A` image captions |
| Metadata / Byline | Reith Sans | 13px | 400 | 18px | Author, publish time, category label |
| Nav Primary | Reith Sans | 14px | 700 | 18px | Top navigation items |
| Tags / Labels | Reith Sans | 12px | 700 | 16px | Story topic tags, uppercase |
| Legal | Reith Sans | 12px | 400 | 16px | Footer copyright |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48px
- Column gutter: 16px
- Article max-width: 640px (centered, left margin at desktop)
- Grid: 12-column, editorial

### Border Radius Scale
- BBC News uses **0px** throughout all editorial surfaces — strict right-angle grid
- Exception: Video play button circle: 50%
- Exception: Avatar/profile: 50%

## Elevation & Depth

BBC News has no elevation system in the traditional sense — the editorial grid provides hierarchy:

**All story cards:**
```
/* No shadow — flat editorial grid */
border: none;
background: #FFFFFF;
```

**Video player hover overlay:**
```
background: rgba(0,0,0,0.7);
```

**Navigation dropdown:**
```
box-shadow: 0 4px 8px rgba(0,0,0,0.15);
background: #1A1A1A;
```

**Breaking news bar:**
```
background: #BB1919;
/* No shadow — authority through color, not depth */
```

## Components

### Buttons
**Primary (Subscribe / Video Play):**
- Background: `#BB1919`
- Border: none
- Border radius: 0px — BBC favors sharp corners
- Padding: `10px 20px`
- Font: Reith Sans, 14px / 700 / white
- Hover: background `#981515`

**Secondary (Load More):**
- Background: `#FFFFFF`
- Border: `2px solid #1A1A1A`
- Border radius: 0px
- Color: `#1A1A1A`
- Hover: background `#F2F2F2`

**Breaking News CTA:**
- Full-width red banner (`#BB1919`)
- Text: white Reith Sans 14px bold uppercase
- "BREAKING" label + headline inline

### Cards & Containers
**Story Card:**
- Background: `#FFFFFF`
- Border: none — section separation via spacing and red rule dividers
- Border radius: 0px
- No box-shadow — flat editorial aesthetic
- Image ratio: 16:9 standard; 1:1 for small grid items
- Hover: headline text color shifts to `#BB1919`

**Section Container:**
- Top border: `3px solid #BB1919` — editorial section rule
- Padding-top: 12px
- Background: `#FFFFFF`

## Do's and Don'ts

### Do
- Use the 3px red horizontal rule (`#BB1919`) to divide every editorial section
- Set all article body text in Reith Serif at minimum 18px for accessibility
- Make headline hover states transition to `#BB1919` — it's the key interactive signal
- Keep all border radii at 0px on editorial cards — right-angle grids are BBC's identity
- Use uppercase with letter-spacing for topic tags and section labels

### Don't
- Don't add decorative shadows to story cards — BBC's authority comes from flat editorial grid
- Don't use color to differentiate story importance — use size and position only
- Don't replace Reith Serif in article bodies — it's an accessibility and brand requirement
- Don't use red for body text or metadata — it's reserved for brand markers and interaction

## Responsive Behavior

Breakpoints:
- Mobile: 0–600px — single column, headline-first, image below
- Tablet: 600–1008px — 2-column story grid; top nav collapses to hamburger
- Desktop: 1008px+ — 12-column editorial grid; main story left, sidebar right
- Wide: 1280px+ — content area capped at 1280px; outer margins increase

## Agent Prompt Guide

### Quick Color Reference
- BBC Red: `#BB1919`
- Background: `#FFFFFF`
- Text: `#1A1A1A`
- Secondary Text: `#63676A`
- Section Rule: 3px `#BB1919` border-top
- Panel Background: `#F2F2F2`
- Dark Nav: `#1A1A1A`

### Example Component Prompts
- "BBC News story card: white background, zero border radius, 16:9 image top, 3px red top border rule (#BB1919), headline in Reith Serif 20px bold #1A1A1A, hover headline turns red — flat editorial, no shadow, newspaper grid"
- "BBC News breaking news banner: full-width #BB1919 red bar, 'BREAKING' white uppercase Reith Sans label left, breaking story headline white bold right — zero radius, flat authority"
- "BBC News section header: 3px #BB1919 top rule, 'World News' in Reith Sans 24px bold uppercase #1A1A1A, horizontal rule divides from story grid below — editorial newspaper section marker"
