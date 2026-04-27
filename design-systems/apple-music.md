---
name: Apple Music
colors:
  tertiary: "#FA2D48"
  neutral: "#000000"
  secondary: "#FFFFFF"
  primary: "#000000"
typography:
  h1:
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34
  h2:
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28
  h3:
    fontSize: 20px
    fontWeight: 600
    lineHeight: 25
rounded:
  sm: 2px
  md: 12px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
---

## Overview

Apple Music operates in near-total darkness — a true black (`#000000`) canvas that makes album artwork explode with color. Every element defers to the music's visual identity: the app itself recedes so the content leads. This approach is grounded in the SF Pro typeface and Apple's Human Interface Guidelines, giving the product an unmistakable premium character even before a single interaction.

The signature red (`#FA2D48`) appears sparingly: the Apple Music logomark, the "Now Playing" progress bar, and select action states. This restraint amplifies its impact — when red appears, it means something is playing or actionable. The rest of the palette works in grayscale: dark gray surfaces (`#1C1C1E`), mid-tone dividers (`#3A3A3C`), and white body text (`#FFFFFF`) form the backbone. Glass morphism powers the sidebar and mini-player: a `backdrop-filter: blur(24px)` over a `rgba(28,28,30,0.85)` fill that floats above artwork without fully obscuring it.

SF Pro Display handles headings with optical kerning tightened at large sizes; SF Pro Text governs body copy at paragraph sizes. The system is entirely Apple's own, maintaining complete visual harmony with iOS and macOS host environments. Spacing is generous — 20px minimum gutters, 28px vertical rhythm — giving the dense catalog space to breathe.

**Key Characteristics:**
- Primary background: `#000000` (true black)
- Primary surface: `#1C1C1E` (elevated dark gray, iOS systemGray6)
- Brand red: `#FA2D48` (Apple Music red)
- Body text: `#FFFFFF`
- Secondary text: `rgba(255,255,255,0.55)`
- Divider: `rgba(255,255,255,0.12)`
- Glass surface: `rgba(28,28,30,0.85)` + `backdrop-filter: blur(24px)`
- Border radius: 12px cards, 50% for avatar/artist circles

## Colors

### Primary
- **True Black** (`#000000`): Root page background, fullscreen player
- **Apple Music Red** (`#FA2D48`): Brand, progress bars, liked/hearted state, active nav
- **Elevated Surface** (`#1C1C1E`): Card backgrounds, sheet modals, sidebar base

### Interactive
- **Red Hover** (`#D4203A`): Red button pressed state
- **White Secondary** (`rgba(255,255,255,0.7)`): Secondary interactive text, tap-state labels
- **Glass Hover** (`rgba(255,255,255,0.08)`): List row hover on dark surfaces

### Surface
- **Surface 1** (`#1C1C1E`): Elevated cards and panels
- **Surface 2** (`#2C2C2E`): Sheet inner sections, grouped table backgrounds
- **Glass** (`rgba(28,28,30,0.85)`): Translucent sidebar and mini-player
- **Overlay** (`rgba(0,0,0,0.6)`): Modal backdrop dimmer

## Typography

### Font Families
- **SF Pro Display**: `-apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif` — all headings ≥ 20px
- **SF Pro Text**: `-apple-system, "SF Pro Text", BlinkMacSystemFont, sans-serif` — body and metadata ≤ 17px
- **SF Pro Rounded**: `-apple-system, "SF Pro Rounded", sans-serif` — playful contexts, bubble counts

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display / Feature Title | SF Pro Display | 34px | 700 | 41px | "For You" section headers, artist page |
| H1 Album Title | SF Pro Display | 28px | 700 | 34px | Color-sampled from artwork |
| H2 Section | SF Pro Display | 22px | 700 | 28px | "Recently Played", "New Releases" |
| H3 Playlist Label | SF Pro Display | 20px | 600 | 25px | Carousel headers |
| Song Title | SF Pro Text | 17px | 400 | 22px | Primary list item text, white |
| Artist / Album (secondary) | SF Pro Text | 15px | 400 | 20px | `rgba(255,255,255,0.55)` |
| Metadata / Duration | SF Pro Text | 13px | 400 | 18px | `rgba(255,255,255,0.4)` |
| Nav Tab Label | SF Pro Text | 10px | 500 | 12px | White active, 55% white inactive |
| Badge / Count | SF Pro Rounded | 12px | 700 | 15px | Red pill on notification icons |
| Now Playing Controls | SF Pro Text | 13px | 600 | 17px | Time stamps, shuffle/repeat labels |
| Legal / Footnote | SF Pro Text | 11px | 400 | 14px | `rgba(255,255,255,0.3)` |

## Layout

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 44, 64px
- Section vertical padding: 32px
- Card grid gutter: 16px
- Mini-player height: 64px fixed

### Border Radius Scale
- Micro (progress bar): 2px
- Tag/badge: 6px
- Card artwork: 12px
- Sheet modal: 16px top corners
- Button/pill: 980px (fully rounded)
- Avatar/disc: 50%

## Elevation & Depth

Apple Music creates depth entirely through darkness gradients and blur, not box-shadow:

**Resting card:**
```
box-shadow: 0 4px 16px rgba(0,0,0,0.6);
```

**Glass surface (sidebar, mini-player):**
```
background: rgba(28,28,30,0.85);
backdrop-filter: blur(24px) saturate(180%);
```

**Fullscreen player (vibrant artwork background):**
```
background: [artwork-dominant-color];
/* overlaid with rgba(0,0,0,0.4) gradient to bottom */
```

**Modal overlay:**
```
background: rgba(0,0,0,0.6);
backdrop-filter: blur(8px);
```

## Components

### Buttons
**Primary (Subscribe / Download):**
- Background: `#FA2D48`
- Border: none
- Border radius: 980px (fully pill)
- Padding: `10px 20px`
- Font: SF Pro Text, 15px / 600
- Color: `#FFFFFF`
- Hover: background `#D4203A`, scale `1.02`

**Secondary (Add to Library):**
- Background: `rgba(255,255,255,0.12)`
- Border: none
- Border radius: 980px
- Color: `#FFFFFF`
- Hover: background `rgba(255,255,255,0.2)`

**Icon Button (Heart, More):**
- Background: `transparent`
- Color: `rgba(255,255,255,0.55)`
- Active: `#FA2D48`
- Hit target: 44×44px minimum

### Cards & Containers
**Album / Playlist Card:**
- Background: artwork image — card has no explicit background
- Border radius: 12px on artwork image
- Shadow: `0 4px 16px rgba(0,0,0,0.6)`
- Text below card on black, no card background

**Glass Sheet (Mini-Player / Sidebar):**
- Background: `rgba(28,28,30,0.85)`
- `backdrop-filter: blur(24px) saturate(180%)`
- Border-top: `1px solid rgba(255,255,255,0.08)`
- Border radius (sheet): 16px top corners

## Do's and Don'ts

### Do
- Use true `#000000` (not `#0a0a0a`) for the root background — artwork pops harder
- Derive accent colors dynamically from album artwork for the Now Playing view
- Maintain 55% white opacity for secondary text — never plain gray hex on dark
- Apply `backdrop-filter: blur(24px)` to the mini-player and sidebar panels
- Keep touch targets at 44×44px minimum per Apple HIG

### Don't
- Don't use the Apple Music red (`#FA2D48`) for decorative purposes — it signals action/playback only
- Don't add visible card borders on dark surfaces — elevation is conveyed by shadow alone
- Don't use system blue or any non-red accent — the monochrome-plus-red system is strict
- Don't use light mode patterns in Apple Music UI contexts — the product is dark-first

## Responsive Behavior

Breakpoints:
- Mobile (iOS): 390px — single column, bottom tab bar, floating mini-player
- Tablet (iPadOS): 768px — sidebar appears (glass panel), 2–3 column grid
- Desktop (macOS): 1024px+ — persistent sidebar at 240px, main content 3–4 columns
- Wide: 1440px+ — grid expands to 5–6 album columns; sidebar stays fixed

## Agent Prompt Guide

### Quick Color Reference
- Brand Red: `#FA2D48`
- Background: `#000000`
- Surface: `#1C1C1E`
- Body Text: `#FFFFFF`
- Secondary Text: `rgba(255,255,255,0.55)`
- Glass: `rgba(28,28,30,0.85)` + blur
- Divider: `rgba(255,255,255,0.12)`

### Example Component Prompts
- "Apple Music Now Playing card: true black background, album art centered with 12px radius and deep shadow, song title in white SF Pro 20px bold, artist name in 55%-opacity white 15px, red progress bar (#FA2D48), playback controls in white with 44px hit targets"
- "Apple Music sidebar navigation: glass morphism panel rgba(28,28,30,0.85) with 24px blur, nav items in white SF Pro 15px, active item highlighted with red dot (#FA2D48), artwork thumbnails with 8px radius"
- "Apple Music horizontal carousel: section header in white SF Pro Display 22px bold, album cards 160px wide with 12px radius artwork shadow, two-line title below in 13px white and 11px secondary-opacity artist name"
