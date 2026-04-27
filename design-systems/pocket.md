---
name: Pocket
colors:
  tertiary: "#EF4056"
  neutral: "#FFFFFF"
  secondary: "#555555"
typography:
  body-md:
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontSize: 15px
    fontWeight: 600
    lineHeight: 20
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16
rounded:
  sm: 4px
  md: 8px
  lg: 28px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Pocket's design language is optimized for one thing above all else: the reading experience. The interface disappears when you're consuming content, and reasserts itself with a confident, clean identity when you're managing your saved article library. The signature red (`#EF4056`) is the brand's single color statement — vivid, energetic, and decisive against the otherwise stark white-and-gray system. This red signals "save this," "this is important," and "your attention belongs here."

The save-and-read workflow creates two distinct interface modes. The browsing/library mode uses white cards with generous typography and subtle thumbnail previews — it feels like a well-organized magazine archive. The reading mode strips all chrome away entirely, presenting only article text in the user's preferred typeface (Georgia serif or system sans) at configurable sizes, with warm sepia or true-dark background options. The transition between modes is the Pocket experience.

Dark mode is a true dark reading environment — not just a dark chrome with light cards, but a complete system inversion where even article cards go dark. The `#1C1C1E` iOS-native dark (or `#1A1A1A` for web) provides the base, with card surfaces at `#2C2C2E`. Typography in reading mode uses line heights of 1.6+ and comfortable measure (65-75 characters per line) for sustained reading comfort.

**Key Characteristics:**
- Pocket red `#EF4056` as the singular brand accent — save button, CTAs, tags
- White `#FFFFFF` primary library surface; `#1C1C1E` dark mode base
- System sans-serif (SF Pro on iOS, Roboto on Android) for UI chrome
- Georgia / custom reading typeface for article reading mode
- Article cards: thumbnail right, title + metadata left — compact but readable
- Tags system: red pill chips for categorization
- Save button: distinctive 28px radius, full red, bold label
- Configurable reading: font size, font family, background (white/sepia/dark)

## Colors

### Primary
- **Pocket Red** (`#EF4056`): Brand accent — save button, tag fills, active states, CTAs
- **White** (`#FFFFFF`): Library background, article cards (light mode)
- **Off White** (`#FAFAFA`): Section backgrounds, alternating surfaces

### Dark Mode
- **Dark Base** (`#1C1C1E`): App background (dark)
- **Dark Card** (`#2C2C2E`): Article cards, elevated surfaces (dark)
- **Dark Divider** (`#3A3A3C`): Row separators in dark mode
- **Dark Surface 2** (`#3C3C3E`): Tag backgrounds, secondary surfaces (dark)

### Reading Backgrounds
- **Light Mode** (`#FFFFFF`): Default reading background
- **Sepia** (`#F9F3E8`): Warm reading mode
- **Dark Read** (`#1C1C1E`): True dark reading
- **Sepia Text** (`#4A3728`): Text on sepia background

### Interactive
- **Red Hover** (`#D4364A`): Primary button hover darkening
- **Red Light** (`rgba(239, 64, 86, 0.10)`): Tag hover, ghost button background
- **Red Border** (`rgba(239, 64, 86, 0.40)`): Ghost button border

### Neutrals
- **Text Dark** (`#222222`): Article titles, primary text (light)
- **Text Medium** (`#555555`): Meta text, authors, descriptions
- **Text Light** (`#888888`): Secondary labels, timestamps, word counts
- **Gray 200** (`#E0E0E0`): Dividers, borders, input outlines
- **Gray 100** (`#F5F5F5`): Subtle backgrounds, hover states (light)

## Typography

### Font Families
- **SF Pro (UI)**: `-apple-system, BlinkMacSystemFont, sans-serif` — All library/nav UI
- **Georgia (Reading)**: `Georgia, 'Times New Roman', serif` — Default article reading
- **Roboto (Android)**: `'Roboto', sans-serif` — Android variant
- **System Mono**: `'Courier New', monospace` — Code snippets in articles

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| App Title | SF Pro | 17px | 600 | 22px | Nav bar title |
| Section Header | SF Pro | 20px | 700 | 26px | Library section titles |
| Article Title (Card) | SF Pro | 17px | 600 | 23px | 2-line clamp |
| Article Title (Read) | Georgia | 26px | 700 | 1.3 | Reading mode hero |
| Author Name | SF Pro | 14px | 400 | 20px | Red `#EF4056` or gray |
| Domain / Source | SF Pro | 13px | 400 | 18px | Gray `#888888` |
| Read Time | SF Pro | 13px | 400 | 18px | Gray `#888888`, minutes |
| Body Reading | Georgia | 19px | 400 | 1.65 | Comfortable reading size |
| Body Small | Georgia | 17px | 400 | 1.6 | User-configurable |
| Tag Label | SF Pro | 12px | 600 | 16px | White on red, uppercase |
| Button Label | SF Pro | 15px | 600 | 20px | White on red |
| Caption | SF Pro | 12px | 400 | 16px | Gray `#888888` |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px
- Article card padding: 16px
- Reading content padding: 24px sides, 40px top
- Reading max-width: 680px (comfortable line measure)
- Tag chip spacing: 8px horizontal, 4px vertical between chips
- Section gaps: 24px

### Border Radius Scale
- `4px` — Tag chips, small badges
- `6px` — Thumbnail images in cards
- `8px` — Settings panels, input fields
- `12px` — Modal sheets, bottom drawers
- `28px` — All pill buttons

### Grid
- Mobile: Single column list, 0 margins (edge-to-edge cards)
- Tablet: 2-column article grid, 16px margins
- Reading: centered column 680px max-width

## Elevation & Depth

```
Level 0 - Background: #FAFAFA (section) / #1C1C1E (dark)
Level 1 - Card:       0 1px 0 #E0E0E0 (border-bottom only, flat-adjacent)
Level 2 - Nav:        0 0.5px 0 rgba(0,0,0,0.12)
Level 3 - Bottom Sheet: 0 -4px 24px rgba(0,0,0,0.15)
Level 4 - Modal:      0 8px 32px rgba(0,0,0,0.25)
Save button:          0 2px 8px rgba(239,64,86,0.35)
```

## Components

### Buttons

**Primary Save Button**
```
background: #EF4056
color: #FFFFFF
font: SF Pro 15px 600
padding: 12px 24px
border-radius: 28px (pill)
border: none
shadow: 0 2px 8px rgba(239, 64, 86, 0.35)
hover: background #D4364A
transition: all 180ms ease
icon: bookmark icon left
```

**Ghost Button**
```
background: transparent
color: #EF4056
border: 1.5px solid rgba(239, 64, 86, 0.4)
padding: 10px 22px
border-radius: 28px
hover: background rgba(239, 64, 86, 0.08)
```

**Reading Controls**
```
font-size buttons: circle 36px, gray background, +/- icons
font-family toggle: segmented control 3 options
background toggle: 4 circle swatches (white/sepia/gray/black)
brightness: 0 (hidden) — system brightness used
```

### Cards & Containers

**Article Card (List View)**
```
background: #FFFFFF (light) / #2C2C2E (dark)
padding: 16px
border-bottom: 1px solid #E0E0E0 (light) / #3A3A3C (dark)
layout: text-block left | thumbnail right (80px × 80px, 6px radius)
title: SF Pro 17px 600, 2-line clamp
meta: source + read-time, 13px gray below title
tag chips: below meta, red pill 4px radius
save-state icon: bookmark top-right of thumbnail
```

**Tag Chip**
```
background: #EF4056
color: #FFFFFF
font: SF Pro 12px 600 uppercase
padding: 4px 10px
border-radius: 4px
hover: background #D4364A
untagged variant: background rgba(239,64,86,0.1), color #EF4056
```

**Reading Mode Container**
```
max-width: 680px
margin: 0 auto
padding: 40px 24px
font: Georgia 19px 1.65
background: per-user preference (white/sepia/dark)
no borders, no shadows — pure content
```

**Empty State Card**
```
illustration: red-tinted Pocket icon 80px
headline: SF Pro 20px 700 center
sub: SF Pro 16px 400 gray center
CTA: red pill button below
```

## Do's and Don'ts

### Do
- Use `#EF4056` red exclusively — it's the single color that makes Pocket identifiable
- Design article cards for scannability: clear title hierarchy, source, read time
- Make the reading experience configurable — font, size, and background options
- Use Georgia (or system serif) as the default reading typeface
- Make the "save" action the most prominent CTA on every surface
- Support true dark reading mode (`#1C1C1E` background) not just dark chrome

### Don't
- Don't use red for error states — reserve it entirely for brand/save interactions
- Don't exceed 680px content width in reading mode — line measure matters
- Don't persist heavy navigation in reading mode — zero chrome for reading
- Don't use decorative elements in article cards — content metadata is sufficient

## Responsive Behavior

**Breakpoints:**
- `375px` — Mobile: single-column list, full-width cards
- `640px` — Large mobile: 2-column card grid option
- `768px` — Tablet: sidebar + article list split
- `1024px` — Desktop: 3-column layout or 2-column + preview
- `Reading`: max-width 680px centered at all breakpoints

**Adaptive Patterns:**
- Article cards: list (mobile) → grid (tablet) → 3-col (desktop)
- Reading: full-screen mobile → centered column desktop
- Navigation: bottom tab mobile → left sidebar desktop
- Save button: fixed bottom (mobile) → nav bar (desktop)

## Agent Prompt Guide

### Quick Color Reference
```
Pocket Red:      #EF4056   — save button, tags, CTAs, active states
White:           #FFFFFF   — light mode background
Dark Base:       #1C1C1E   — dark mode background
Dark Card:       #2C2C2E   — dark mode card surfaces
Gray Meta:       #888888   — timestamps, word counts, sources
Sepia BG:        #F9F3E8   — warm reading mode
```

### Example Component Prompts
- "A Pocket article card: white background, title 17px 600 two-line clamp left, domain 13px gray + read time below, 80px square thumbnail right 6px radius, tag chips red pill below meta"
- "A Pocket save pill button: red `#EF4056` background, white 15px 600, 28px radius, bookmark icon left, shadow 0 2px 8px red alpha"
- "A Pocket reading mode view: Georgia 19px body text on white, max-width 680px centered, 40px top padding, no nav chrome, line height 1.65"
- "A Pocket tag chip: red `#EF4056` background, white uppercase 12px bold, 4px radius, 4px 10px padding, horizontal scrollable row of chips below article cards"
