---
name: Tidal
colors:
  neutral: "#000000"
  tertiary: "#1F4FFF"
  primary: "#000000"
rounded:
  sm: 4px
  md: 8px
  lg: 12px
---

## Overview

Tidal's design language is rooted in the philosophy that premium audio deserves a premium visual stage. The interface is built on a pure black canvas (`#000000`) that functions as a darkroom for music — allowing album artwork and artist photography to emerge with full luminous impact. Nothing competes with the music. Every surface, every element, every typographic decision exists to serve the listening experience and signal quality.

The brand is defined by restraint. White text on black, with Tidal Blue (`#1F4FFF`) reserved exclusively for interactive moments — play buttons, active states, selected tracks. This chromatic discipline creates an interface that feels editorial rather than utilitarian. Large, full-bleed hero images of artists are treated like gallery prints: uncropped, unsaturated-adjusted, respected. The grid breathes. Negative space is intentional and generous.

Typography is clean and geometric — primarily a humanist sans-serif rendered at controlled weights. Headers are bold and large, communicating confidence. Body text is light and airy against the dark backgrounds. The overall effect is reminiscent of a high-end HiFi equipment catalogue: technical precision expressed through elegant minimalism. Tidal never shouts; it resonates.

**Key Characteristics:**
- Pure black (`#000000`) base — zero grey substitute
- Tidal Blue (`#1F4FFF`) strictly for CTAs and active states
- White (`#FFFFFF`) as the only text color on dark surfaces
- Full-bleed artist photography with no borders or roundness
- 8px spacing base with generous breathing room at 32–64px sections
- Circular album art thumbnails (48px small, 240px hero)
- Subtle separators at `rgba(255,255,255,0.08)` — barely visible
- HiFi badge and lossless quality indicators in monochrome

## Colors

### Primary
- **Pure Black** (`#000000`): Primary background — all screens
- **Tidal Blue** (`#1F4FFF`): Brand accent, play button, active track, CTA primary
- **White** (`#FFFFFF`): All body and display text on dark

### Interactive
- **Blue Hover** (`#3D6AFF`): Button hover state, elevated from Tidal Blue
- **Blue Pressed** (`#1640CC`): Button active/pressed state
- **Selection Highlight** (`rgba(31,79,255,0.15)`): Selected row/item background

### Surface
- **Surface Dark** (`rgba(255,255,255,0.04)`): Card and list row background
- **Surface Elevated** (`rgba(255,255,255,0.08)`): Hovered card, modal background
- **Separator** (`rgba(255,255,255,0.08)`): List dividers, section borders
- **Overlay** (`rgba(0,0,0,0.72)`): Image overlays for text legibility
- **Muted Text** (`rgba(255,255,255,0.50)`): Secondary labels, metadata
- **Subtle Text** (`rgba(255,255,255,0.35)`): Placeholders, tertiary info

### Semantic
- **Success Green** (`#1DB954`): Playback progress (minimal use)
- **Error Red** (`#FF3B30`): Error states, failed playback
- **Quality Gold** (`#F0A500`): HiFi/Master quality badge

## Typography

### Font Families
- **Primary UI**: `"Inter", "Helvetica Neue", -apple-system, sans-serif` — all UI elements, navigation, labels
- **Display / Hero**: `"GT America", "Inter", sans-serif` — hero titles, featured album headings
- **Monospace**: `"JetBrains Mono", "Courier New", monospace` — track timestamps, bit rate readouts

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Title | GT America | 48px | 700 | 52px | Full-bleed section headers |
| Section Header | Inter | 22px | 600 | 28px | "New Releases", "Top Tracks" |
| Card Title | Inter | 16px | 600 | 22px | Album/playlist name |
| Track Title | Inter | 15px | 500 | 20px | Currently playing track |
| Artist Name | Inter | 14px | 400 | 18px | Subtitle on track rows |
| Metadata Label | Inter | 12px | 400 | 16px | Duration, track count, quality |
| Nav Label | Inter | 11px | 500 | 14px | Bottom nav tabs, uppercase |
| Timestamp | JetBrains Mono | 11px | 400 | 14px | Track progress, time codes |
| Quality Badge | Inter | 10px | 700 | 12px | "HIFI", "MASTER" — all caps |

## Layout

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px`
- Component internal padding: `16px` or `24px`
- Section vertical spacing: `40px` between major sections
- Page horizontal padding: `24px` (mobile), `48px` (tablet), `80px` (desktop)

### Grid System
- Mobile: 1-column, 2-column album grid
- Tablet: 3–4 column album grid
- Desktop: 4–6 column album grid, max-width `1280px`, centered
- Card gap: `16px`

### Border Radius Scale
- `0px` — artist photography, full-bleed images
- `4px` — album art thumbnails
- `8px` — small UI elements, tags
- `12px` — modals, sheets
- `100px` — pill buttons, input fields
- `50%` — circular play button, avatar

## Elevation & Depth

### Shadow Scale
- **Level 0** — No shadow (base surfaces, track rows)
- **Level 1** — `0 2px 8px rgba(0,0,0,0.40)` — hovered cards
- **Level 2** — `0 8px 24px rgba(0,0,0,0.60)` — floating UI, dropdowns
- **Level 3** — `0 16px 48px rgba(0,0,0,0.80)` — modals, overlays
- **Playbar Lift** — `0 -4px 20px rgba(0,0,0,0.50)` — persistent playback bar

### Overlay Treatments
- Image overlay for text legibility: `linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 60%)`
- Section fade: `linear-gradient(to right, #000000 0%, transparent 30%)` — for scrollable rows

## Components

### Buttons

**Primary (Play / CTA)**
- Background: `#1F4FFF`
- Text: `#FFFFFF`, 15px, weight 600
- Padding: `14px 32px`
- Border radius: `100px` (pill)
- Hover: background `#3D6AFF`, transform `translateY(-1px)`
- Active: background `#1640CC`

**Icon Button (Play/Pause)**
- Size: 56px × 56px
- Background: `#FFFFFF`
- Icon color: `#000000`
- Border radius: `50%`
- Hover: scale `1.05`, background `rgba(255,255,255,0.90)`

**Ghost Button**
- Background: `transparent`
- Border: `1px solid rgba(255,255,255,0.20)`
- Text: `#FFFFFF`, 14px, weight 500
- Padding: `10px 24px`
- Border radius: `100px`
- Hover: border-color `rgba(255,255,255,0.50)`, bg `rgba(255,255,255,0.06)`

**Text Link**
- Color: `#1F4FFF`
- No underline by default
- Hover: underline, color `#3D6AFF`

### Cards & Containers

**Album Card**
- Width: 180px (3-up grid on desktop)
- Image: 180px × 180px, border-radius `4px`
- Background: `transparent`
- Title: 14px, weight 600, `#FFFFFF`, 1 line clamp
- Subtitle: 12px, weight 400, `rgba(255,255,255,0.50)`, 1 line clamp
- Gap from image to text: `10px`

**Track Row**
- Height: 56px
- Padding: `0 16px`
- Background: `transparent`
- Hover: background `rgba(255,255,255,0.06)`
- Active: background `rgba(31,79,255,0.12)`
- Left: track number or thumbnail (40px circle)
- Right: duration in monospace

**Playback Bar (Persistent)**
- Height: 72px
- Background: `#0A0A0A`
- Border-top: `1px solid rgba(255,255,255,0.08)`
- Contains: album art (48px circle), track info, progress slider, controls

**Modal / Sheet**
- Background: `#111111`
- Border-radius: `16px 16px 0 0` (bottom sheet) or `12px` (center modal)
- Padding: `24px`
- Shadow: `0 -8px 40px rgba(0,0,0,0.60)`

## Do's and Don'ts

### Do
- Use pure `#000000` — never a near-black substitute like `#111` for page backgrounds
- Let album artwork breathe — maintain generous margin around art
- Keep Tidal Blue for interactive states only — not decoration
- Use circular thumbnails consistently for artist photos; square for albums
- Show quality badge (HIFI/MASTER) on every track row — it's a core value signal
- Apply `rgba` overlays on photography to maintain text contrast

### Don't
- Don't use gradients as background treatments — black is the background
- Don't mix font weights loosely — stay within 400, 500, 600, 700
- Don't add color to icons — all icons should be `#FFFFFF` or `rgba(255,255,255,0.50)`
- Don't use card borders as separators — use spacing and subtle background
- Don't round album art beyond 4px — editorial sharpness is intentional

## Responsive Behavior

**Breakpoints:**
- `sm`: 375px — single-column mobile; full-screen album view
- `md`: 768px — two-column, expanded now-playing panel
- `lg`: 1024px — persistent sidebar (240px), main content area
- `xl`: 1280px — full desktop; multi-column grid; fixed playbar 72px

**Mobile-first adaptations:**
- Bottom nav replaces sidebar on mobile (5 tabs, 56px height)
- Playback bar collapses to 64px strip; tap to expand full-screen player
- Album grid shifts from 2-col to 3-col at md, 4-col at lg
- Search bar replaces hero banner on sm breakpoint

## Agent Prompt Guide

### Quick Color Reference
- Background: `#000000`
- Brand Accent: `#1F4FFF`
- Text Primary: `#FFFFFF`
- Text Muted: `rgba(255,255,255,0.50)`
- Surface Card: `rgba(255,255,255,0.04)`
- Separator: `rgba(255,255,255,0.08)`

### Example Component Prompts
- "Design a dark music player screen with pure black background, Tidal Blue play button, circular album art, and Inter typography in white and muted white"
- "Create a track list row with circular thumbnail, song title in white 15px semibold, artist in muted white 14px, duration in JetBrains Mono right-aligned, subtle hover state"
- "Build an album card grid on black, 180px cards with 4px radius art, title in white 14px bold, subtitle in muted white, no background on card"
- "Design a HiFi music hero banner: full-bleed artist photography, gradient overlay, large white title, Tidal Blue CTA pill button"
