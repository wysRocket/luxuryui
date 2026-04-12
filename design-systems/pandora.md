# Design System Inspired by Pandora

## 1. Visual Theme & Atmosphere

Pandora's design language centers on the album artwork — every station, playlist, and track makes the cover art the visual hero of the interface. The structural palette is a clean blue (`#224099` for brand headers, `#005483` for interactive elements) layered over white surfaces, creating a trustworthy, accessible audio platform aesthetic that never competes with the colorful album art it frames. This is a design system built for visual neutrality: the chrome recedes so the music's visual identity can breathe.

The interface is deliberately traditional in its organizational clarity — clear section labels, thumb rating controls (up/down) that reference the brand's core interaction model, and station artwork displayed at generous sizes. Typography is clean and functional: a blend of system sans-serif for body content with bold weight variations providing hierarchy. The audio player controls are persistently accessible at the bottom, with a minimal dark-tinted overlay that works against any album art background color.

Light mode is the primary experience — white backgrounds with blue interactive elements create the clean, radio-dial simplicity that differentiates Pandora from more complex streaming competitors. The station/track art grid uses consistent square aspect ratios at generous sizes, creating a visual rhythm similar to a physical record collection laid out flat.

**Key Characteristics:**
- Brand blue `#224099` (headers) + interactive blue `#005483` (CTAs, links)
- White `#FFFFFF` primary surface — art-forward design with neutral chrome
- Blue-tinted dark player bar `rgba(0, 40, 80, 0.95)` for persistent bottom player
- Station art: square aspect ratio, generous 160px+ grid display
- Thumb rating UI: oversized up/down icons as primary interaction model
- System sans-serif typography (SF Pro / Roboto) — functional clarity
- Soft gray `#F5F7FA` for section backgrounds and alternating rows
- Minimal icon set — play, pause, skip, thumb-up, thumb-down, menu

## 2. Color Palette & Roles

### Primary
- **Brand Blue** (`#224099`): App bar, wordmark, section dividers, brand moments
- **Interactive Blue** (`#005483`): Buttons, links, active tabs, selected state indicators
- **White** (`#FFFFFF`): All primary background surfaces, cards, panels

### Audio Player
- **Player Dark Blue** (`rgba(0, 40, 80, 0.95)`): Persistent bottom player bar
- **Player Text White** (`#FFFFFF`): All text within the player bar
- **Progress Blue** (`#00AEEF`): Playback progress bar fill, seeker dot

### Interactive
- **Blue Hover** (`#004070`): Button and link hover darkening
- **Blue Light BG** (`rgba(0, 84, 131, 0.08)`): Selected item background, tab underline area
- **Blue Underline** (`#005483`): Active tab indicator line

### Status
- **Thumb Up Green** (`#1DB954`): Positive thumb rating confirmation flash
- **Thumb Down Gray** (`#787878`): Negative rating, skip state
- **Station Playing Blue** (`#00AEEF`): Now playing indicator dot

### Neutrals
- **Gray 800** (`#333333`): Primary text, station/track names
- **Gray 600** (`#666666`): Artist names, secondary metadata
- **Gray 400** (`#999999`): Tertiary labels, timestamps
- **Gray 100** (`#F5F7FA`): Section background, alternating rows
- **Divider** (`#E0E4E9`): Row separators, section lines

### Surface
- **Card Background** (`#FFFFFF`): Station cards, track rows
- **Section Header BG** (`rgba(34, 64, 153, 0.05)`): Tinted section backgrounds

## 3. Typography Rules

### Font Families
- **SF Pro Display**: `-apple-system, BlinkMacSystemFont, sans-serif` — iOS primary
- **Roboto**: `'Roboto', sans-serif` — Android / web primary
- **Arial fallback**: `Arial, Helvetica, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| App Title / Wordmark | SF Pro / Roboto | 20px | 700 | 28px | White on brand blue header |
| Section Title | SF Pro / Roboto | 18px | 700 | 24px | Dark `#333333` |
| Station Name | SF Pro / Roboto | 16px | 600 | 22px | Dark, station card |
| Track Name (Player) | SF Pro / Roboto | 16px | 700 | 22px | White in player bar |
| Artist Name | SF Pro / Roboto | 14px | 400 | 20px | Gray `#666666` |
| Artist Name (Player) | SF Pro / Roboto | 13px | 400 | 18px | Off-white player bar |
| Tab Label | SF Pro / Roboto | 13px | 600 | 18px | Active: blue, Inactive: gray |
| List Item Title | SF Pro / Roboto | 15px | 500 | 22px | Dark |
| List Item Meta | SF Pro / Roboto | 13px | 400 | 18px | Gray `#666666` |
| Button Label | SF Pro / Roboto | 14px | 700 | 20px | Uppercase tracked |
| Caption | SF Pro / Roboto | 12px | 400 | 16px | Gray `#999999` |
| Genre Label | SF Pro / Roboto | 11px | 600 | 14px | Uppercase, blue `#005483` |

## 4. Component Stylings

### Buttons

**Primary Button (Blue)**
```
background: #005483
color: #FFFFFF
font: 14px 700 uppercase tracking 0.5px
padding: 12px 24px
border-radius: 24px (pill)
border: none
hover: background #004070
shadow: 0 2px 6px rgba(0, 84, 131, 0.25)
```

**Secondary / Ghost**
```
background: transparent
color: #005483
border: 2px solid #005483
padding: 10px 22px
border-radius: 24px
hover: background rgba(0,84,131,0.08)
```

**Thumb Up/Down Buttons**
```
icon-size: 28px (in-line) / 40px (player bar)
color-default: #787878
color-active-up: #1DB954
color-active-down: #005483
background: transparent
border: none
padding: 8px
hit-target: 44px × 44px minimum
animation: scale 1→1.2→1 on tap, 200ms spring
```

### Cards & Containers

**Station Card (Grid)**
```
aspect-ratio: 1/1
background: #FFFFFF
border-radius: 8px
overflow: hidden
image: full-card cover art
label: gradient overlay bottom, station name white 14px 600
shadow: 0 2px 8px rgba(0,0,0,0.12)
playing indicator: top-left blue dot + animation
```

**Now Playing Bar (Persistent)**
```
position: fixed bottom
height: 64px
background: rgba(0, 40, 80, 0.95)
backdrop-filter: blur(20px)
padding: 0 16px
layout: art-thumbnail left | title+artist center | controls right
art-thumbnail: 44px × 44px, 4px radius
controls: thumb-down | play/pause | thumb-up icons white
```

**Track Row (List)**
```
height: 56px
padding: 8px 16px
layout: 48px album art | track + artist | duration right
border-bottom: 1px solid #E0E4E9
hover: background #F5F7FA
playing: left border 3px solid #005483
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px
- Card grid gap: 12px mobile, 16px desktop
- Section padding: 16px top/bottom, page margin 16px
- Player bar: fixed 64px height, adds 64px bottom padding to content
- Station grid: 2 columns mobile, 3-4 columns tablet, 5-6 desktop

### Border Radius Scale
- `4px` — Tags, genre chips, small elements
- `8px` — Station cards, track rows
- `12px` — Modal panels, large cards
- `24px` — Pill buttons
- `50%` — Avatar, circular play button

### Grid
- Mobile: 2-column station grid, 16px margins
- Tablet: 3-column grid, 24px margins
- Desktop: 5-6 column grid, 40px margins, max-width 1200px

## 6. Depth & Elevation

```
Level 0 - Background: #F5F7FA (section) / #FFFFFF (content)
Level 1 - Card:       0 2px 8px rgba(0,0,0,0.10)
Level 2 - Dropdown:   0 4px 16px rgba(0,0,0,0.15)
Level 3 - Player:     0 -2px 20px rgba(0,0,0,0.20) (cast upward)
Level 4 - Modal:      0 8px 32px rgba(0,0,0,0.25)
Header shadow:        0 2px 4px rgba(0,0,0,0.10)
```

## 7. Do's and Don'ts

### Do
- Display station artwork at large sizes (160px+) — it's the primary visual element
- Keep the bottom player persistent and always accessible
- Use blue `#005483` for all interactive elements — one interactive color keeps the chrome neutral
- Display thumb rating buttons at generous hit targets (44px minimum)
- Use the lightest possible background tints to let artwork colors dominate

### Don't
- Don't use complex gradients or textures in UI chrome — they compete with album art
- Don't use more than two blues (`#224099` brand, `#005483` interactive) in the system
- Don't hide the thumb rating UI — it's Pandora's core interaction model
- Don't apply heavy shadows to station art cards — soft shadows only

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — Mobile: 2-column station grid, bottom player
- `640px` — Large mobile: 3-column grid
- `768px` — Tablet: 4-column grid, persistent sidebar possible
- `1024px` — Desktop: 5-column grid, full sidebar nav
- `1280px` — Wide: 6-column grid, max-width 1200px

**Adaptive Patterns:**
- Station grid: 2-col → 4-col → 6-col
- Player bar: 64px mobile → 80px desktop with expanded controls
- Navigation: bottom tab mobile → left sidebar desktop
- Station art: 140px mobile → 180px desktop cards

## 9. Agent Prompt Guide

### Quick Color Reference
```
Brand Blue:      #224099   — app bar, wordmark, brand moments
Interactive Blue:#005483   — buttons, links, active states
Progress Blue:   #00AEEF   — playback bar, now-playing dot
Player Dark:     rgba(0,40,80,0.95) — persistent player bar
White:           #FFFFFF   — all surfaces
Gray Text:       #666666   — artist names, metadata
```

### Example Component Prompts
- "A Pandora station card: square 160px, full album art fill, bottom gradient overlay, white station name 14px 600, top-left blue now-playing animated dot indicator"
- "A Pandora bottom player bar: dark blue rgba(0,40,80,0.95), blur backdrop, 44px album art left, track name 16px white center, thumb-down/play/thumb-up icons white right"
- "A track list row: 56px height, 48px square album art, track name 15px dark + artist 13px gray, duration right, playing left border 3px blue"
- "A Pandora genre chip pill: blue `#005483` border 24px radius, uppercase blue label 11px, white background, active fills blue with white text"
