---
name: Nike Run Club
colors:
  neutral: "#000000"
  tertiary: "#C8F04F"
  secondary: "#888888"
  primary: "#000000"
typography:
  body-md:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 24
  label:
    fontSize: 15px
    fontWeight: 700
    lineHeight: 20
    letterSpacing: 0.5px
rounded:
  sm: 8px
  md: 16px
  lg: 24px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Nike Run Club's design language is engineered for the dark — a pure black (`#000000`) canvas that serves as the athlete's night sky, against which neon yellow-green (`#C8F04F`) pulses like a heartbeat monitor. This is sport-performance UI: every element is designed to be readable at a glance while running, during post-run review in variable light, and in the analytics deep-dive at the desktop. The darkness isn't aesthetic preference — it reduces eye strain during outdoor use and makes GPS data and achievement visuals pop with maximum luminance contrast.

The neon yellow-green accent is the system's single energetic color, used for active states, progress rings, personal records, achievement badges, and primary CTAs. It references the visual language of sports timing displays, reflective athletic wear, and high-visibility running gear. Every use of this color signals "this is happening" or "you did something significant." Data visualization — elevation charts, pace graphs, split tables — uses this accent against white-on-dark-gray surfaces with surgical precision.

Secondary type is handled in gray gradients, allowing a rich hierarchy on the dark canvas without introducing additional colors. The achievement and badge system uses gradients from dark gray to dark teal for secondary milestones, with the neon reserved for peak achievements. Motion is expressive: route maps animate trace-in on load, activity rings fill with spring physics, and Guided Run audio sync creates visual pulse beats.

**Key Characteristics:**
- Pure black `#000000` base with neon yellow-green `#C8F04F` single accent
- Dark gray surface `#1A1A1A` for elevated cards and modals
- Custom "NRC" display font for large metric readouts (speed, pace, distance)
- Helvetica Neue / SF Pro for secondary labels and body text
- Activity rings: circular progress in neon on dark gray track
- GPS route map: animated trace-in on dark gray map tiles
- Data-dense split tables: compact 12px Roboto Mono for pace data
- Elevation and pace charts: area fill in neon at 30% opacity + solid stroke

## Colors

### Primary
- **True Black** (`#000000`): App background, base surface, nav bar
- **Neon Yellow-Green** (`#C8F04F`): Primary accent — active states, PRs, CTAs, progress fills
- **Dark Gray Surface** (`#1A1A1A`): Card backgrounds, list items, elevated surfaces

### Neutrals (Dark System)
- **Gray 800** (`#2A2A2A`): Progress ring tracks, inactive chart fills
- **Gray 700** (`#3A3A3A`): Dividers, input borders
- **Gray 500** (`#666666`): Secondary text, labels, metadata
- **Gray 400** (`#888888`): Tertiary text, disabled states
- **White** (`#FFFFFF`): Primary text on dark, high-emphasis labels
- **Off White** (`#F0F0F0`): Secondary text, body content

### Achievement Palette
- **PR Gold** (`#FFD700`): Personal record highlights
- **Streak Orange** (`#FF6B35`): Streak badges, monthly challenge
- **Distance Blue** (`#4FC3F7`): Distance milestones
- **Community Purple** (`#CE93D8`): Group run, pacesetter badges

### Status
- **Active Neon** (`#C8F04F`): Current run, live tracking, active session
- **Paused Amber** (`#FFB74D`): Run paused state
- **Complete Teal** (`#4DB6AC`): Run completed, session closed
- **Error Red** (`#EF5350`): GPS lost, sync failure

### Interactive
- **Neon Hover** (`#D4F570`): Neon button hover (lightened)
- **Neon Dim** (`rgba(200, 240, 79, 0.15)`): Ghost button, selected state background

## Typography

### Font Families
- **NRC Display (Custom)**: `'NRC Display', 'Helvetica Neue', sans-serif` — Pace, distance, time large readouts
- **Helvetica Neue**: `'Helvetica Neue', 'SF Pro Display', sans-serif` — Headlines, section titles
- **Roboto Mono**: `'Roboto Mono', monospace` — Split tables, pace per km, timestamp data
- **SF Pro**: `-apple-system, BlinkMacSystemFont, sans-serif` — Body copy (iOS)

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Live Pace Readout | NRC Display | 72px | 800 | 72px | Neon `#C8F04F`, tabular nums |
| Distance Hero | NRC Display | 96px | 900 | 96px | White, during active run |
| Metric Label | Helvetica Neue | 12px | 500 | 16px | Gray `#888888`, uppercase tracked |
| Section Header | Helvetica Neue | 22px | 700 | 28px | White |
| Run Card Title | Helvetica Neue | 18px | 700 | 24px | White |
| Run Card Meta | Helvetica Neue | 14px | 400 | 20px | Gray `#888888` |
| Split Table Data | Roboto Mono | 14px | 400 | 20px | White, tabular aligned |
| Split Label | Roboto Mono | 11px | 500 | 16px | Gray500, uppercase |
| Achievement Title | Helvetica Neue | 16px | 700 | 22px | White |
| Body / Description | Helvetica Neue | 15px | 400 | 24px | Off-white `#F0F0F0` |
| Button Label | Helvetica Neue | 15px | 700 | 20px | Uppercase tracked +0.5px |
| Coach Prompt | Helvetica Neue | 17px | 400 | 26px | Light italic, guidance text |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Card padding: 20px standard
- Live run screen: 24px margins, centered metric display
- Split table row: 48px height, 16px horizontal padding
- Section gaps: 32px between sections

### Border Radius Scale
- `8px` — Data chips, metric badges
- `12px` — Small cards, filter pills
- `16px` — Run history cards, achievement cards
- `24px` — Large modal sheets
- `50px` — All CTA buttons (pill)
- `50%` — Start/stop circular buttons, avatar

### Grid
- Mobile (primary): Single column, 16px margins
- Run screen: Full-bleed, 0 margin (immersive)
- Metrics row: 3-column flex, equal widths
- Split table: 6-column fixed-width grid

## Elevation & Depth

```
Level 0 - Base:        #000000 background
Level 1 - Surface:     #1A1A1A (cards) + no shadow (dark system)
Level 2 - Elevated:    #242424 + 0 4px 16px rgba(0,0,0,0.4)
Level 3 - Modal Sheet: #1A1A1A + 0 -8px 40px rgba(0,0,0,0.6)
Neon Glow:             0 0 20px rgba(200,240,79,0.35) — used on active states only
Map Card:              0 8px 24px rgba(0,0,0,0.5)
```

## Components

### Buttons

**Primary CTA (Neon)**
```
background: #C8F04F
color: #000000
font: Helvetica Neue 15px 700 uppercase tracking 0.5px
padding: 16px 32px
border-radius: 50px (full pill)
border: none
hover: background #D4F570
active: background #B8E040, transform scale(0.98)
shadow: 0 0 20px rgba(200, 240, 79, 0.35) (neon glow)
transition: all 180ms ease
```

**Ghost Button**
```
background: rgba(200, 240, 79, 0.1)
color: #C8F04F
border: 1.5px solid #C8F04F
padding: 14px 30px
border-radius: 50px
hover: background rgba(200, 240, 79, 0.2)
```

**Start Run Button (Large)**
```
width: 80px
height: 80px
border-radius: 50%
background: #C8F04F
shadow: 0 0 40px rgba(200, 240, 79, 0.5)
icon: play SVG in black center
pulse animation: scale 1→1.06→1 2s infinite during active
```

### Cards & Containers

**Run History Card**
```
background: #1A1A1A
border-radius: 16px
padding: 20px
border: none
map-preview: top full-width, 160px height, dark map tiles
stats row: 3 columns below map (pace | distance | duration)
shadow: 0 4px 16px rgba(0,0,0,0.4)
```

**Active Run Overlay (Full Screen)**
```
background: #000000
safe-area: bottom padding for gesture nav
live-metric: centered 96px distance, 72px pace
status ring: 120px circular progress neon
```

**Activity Ring Component**
```
size: 80px (card) / 160px (detail)
track: circle stroke #2A2A2A stroke-width 8px
fill: animated stroke #C8F04F stroke-dasharray animated
center: percentage text 18px 700 neon
animation: spring physics on load
```

**Elevation Chart**
```
chart-type: area chart
background: transparent
fill: rgba(200, 240, 79, 0.15)
stroke: #C8F04F, 2px
x-axis: Roboto Mono 11px gray
y-axis: Roboto Mono 11px gray
grid lines: rgba(255,255,255,0.05) horizontal
```

## Do's and Don'ts

### Do
- Use `#C8F04F` neon exclusively for primary active states, PRs, and CTA buttons
- Design for glanceability — key metrics must be readable in 200ms or less
- Apply neon glow `box-shadow: 0 0 20px rgba(200,240,79,0.35)` to active run button
- Use Roboto Mono for all pace/split data — tabular numerals prevent layout shifts
- Animate activity rings with spring physics on page load for premium feel
- Keep the live run screen minimal — one primary metric dominant, others secondary

### Don't
- Don't use white backgrounds — this is a dark-only design system
- Don't introduce additional accent colors for standard UI — the neon is the sole accent
- Don't use neon text below 14px — luminance contrast is harsh at small sizes
- Don't use border-radius below 8px — soft rounding is part of the sport-premium feel

## Responsive Behavior

**Breakpoints:**
- `390px` — Primary mobile target, full-screen run mode
- `430px` — iPhone Pro Max, larger metric readouts
- `768px` — iPad: 2-column layout, expanded map + metrics split
- `1024px` — Web dashboard: route map full-width, stats panel right

**Adaptive Patterns:**
- Live pace: 72px mobile → 96px large screen
- Run screen: full-bleed mobile, windowed on desktop
- Activity rings: 80px card → 160px detail view → 240px dashboard
- Split table: scrollable horizontal mobile → full table desktop

## Agent Prompt Guide

### Quick Color Reference
```
True Black:      #000000   — app background, base
Neon Accent:     #C8F04F   — primary accent, active, PRs, CTAs
Dark Surface:    #1A1A1A   — cards, elevated surfaces
Gray Track:      #2A2A2A   — progress ring tracks, inactive
White Text:      #FFFFFF   — primary text on dark
Gray Meta:       #888888   — labels, secondary text
```

### Example Component Prompts
- "A NRC run history card: dark `#1A1A1A` background 16px radius, dark map preview top 160px, three stats below (pace | distance | time) in white 18px bold with gray labels, neon accent on PR"
- "A circular activity ring 160px: dark gray `#2A2A2A` track, neon `#C8F04F` fill animated stroke, completion percentage 18px bold neon center"
- "A live run screen: pure black full-screen, centered 96px white distance value '5.23 km', 72px neon pace '4:32 /km' below, circular start button with neon glow"
- "A neon pill CTA button: `#C8F04F` background, black uppercase text 15px, 50px radius, neon glow box-shadow"
