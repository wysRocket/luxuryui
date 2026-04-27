---
name: Fitbit
colors:
  tertiary: "#00B0B9"
  neutral: "#121212"
  primary: "#121212"
  secondary: "#9E9E9E"
typography:
  body-md:
    fontFamily: Proxima Nova
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: Proxima Nova
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: 4px
  md: 12px
  lg: 24px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Fitbit's design is clean, data-forward, and motivational — a digital health dashboard that transforms raw biometric data into actionable personal insight. The teal/cyan accent (`#00B0B9`) is the brand's primary energizer: it appears on progress rings, active metric callouts, heart rate indicators, and primary CTAs, conveying wellness, clarity, and momentum. The base surfaces are predominantly dark (`#121212`, `#1E1E1E`) for the device-adjacent dashboard experience, though the companion app also supports a clean white mode.

Typography is handled by Proxima Nova — a geometric humanist sans-serif widely associated with clean, premium apps — at multiple weights to create a rich data hierarchy. Key metrics (step counts, heart rate, sleep hours) are rendered in display-scale numbers at maximum contrast, with supporting labels in muted secondary tones. The visual language of progress rings (circular SVG progress indicators) is the single most distinctive Fitbit design pattern.

The overall atmosphere is "precision wellness technology" — premium but not exclusive, scientific but approachable, motivational without being overwhelming.

**Key Characteristics:**
- Teal accent (`#00B0B9`) for progress rings, active states, primary CTA
- Dark base (`#121212`) with elevated card surfaces (`#1E1E1E`, `#2A2A2A`)
- Proxima Nova across all text — multiple weights for data hierarchy
- Circular progress ring as core visual pattern
- Large numeric display for key health metrics
- White text (`#FFFFFF`) and muted gray (`#9E9E9E`) for dark mode
- 12px border radius on cards and widgets
- Minimal use of color outside of the teal accent

## Colors

### Primary
- **Fitbit Teal** (`#00B0B9`): Progress rings, active metrics, CTAs
- **Dark Base** (`#121212`): App background — dashboard
- **Pure White** (`#FFFFFF`): Primary text on dark surfaces

### Interactive
- **Hover Teal** (`#00989F`): Button hover, ring interaction
- **Focus Ring** (`rgba(0,176,185,0.35)`): Accessible focus outline
- **Active Indicator** (`#00D4DD`): Lighter teal for "now" markers

### Surface
- **Card Dark** (`#1E1E1E`): Widget card backgrounds
- **Elevated Card** (`#2A2A2A`): Secondary cards, drawers
- **Divider** (`rgba(255,255,255,0.1)`): Subtle separators
- **Muted Text** (`#9E9E9E`): Labels, units, secondary info

### Status
- **Heart Rate Red** (`#FF4757`): Elevated heart rate zones
- **Sleep Purple** (`#7C4DFF`): Sleep data visualization
- **Active Green** (`#4CAF50`): Goals met, positive delta
- **Calories Orange** (`#FF6B35`): Caloric data tracks

## Typography

### Font Families
- **Primary**: `Proxima Nova` — all UI text
- **Display**: `Proxima Nova` at weight 800 — large metric numbers
- **Fallback**: `Helvetica Neue`, `Arial`, `sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Metric Display | Proxima Nova | 64px | 800 | 1.00 | Step count, heart rate hero |
| Metric Large | Proxima Nova | 40px | 700 | 1.00 | Secondary metric cards |
| Section Header | Proxima Nova | 18px | 700 | 1.25 | Dashboard card titles |
| Metric Unit | Proxima Nova | 16px | 400 | 1.00 | "steps", "bpm", "hrs" |
| Widget Title | Proxima Nova | 15px | 600 | 1.30 | Card header |
| Body | Proxima Nova | 14px | 400 | 1.50 | Descriptions, guidance |
| Label | Proxima Nova | 13px | 600 | 1.20 | Data point labels |
| Caption | Proxima Nova | 12px | 400 | 1.30 | Timestamps, fine print |
| Navigation | Proxima Nova | 11px | 600 | 1.00 | Bottom tab labels |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Border Radius Scale
- Small (4px): Badges, inline tags
- Medium (8px): Slider tracks, progress bars
- Standard (12px): Dashboard widgets, cards
- Large (20px): Bottom sheets, modals
- Pill (24px–50%): CTA buttons, progress rings

## Elevation & Depth

- **Base surface**: `#121212` — no shadow
- **Cards**: `box-shadow: 0 2px 12px rgba(0,0,0,0.3)`
- **Active/featured**: `box-shadow: 0 4px 20px rgba(0,176,185,0.3)` — teal glow
- **Modals**: `box-shadow: 0 16px 48px rgba(0,0,0,0.7)`
- **Progress ring glow**: `filter: drop-shadow(0 0 8px rgba(0,176,185,0.6))`

## Components

### Buttons

**Primary CTA**
- Background: `#00B0B9`
- Border-radius: 24px (pill)
- Padding: 14px 32px
- Font: Proxima Nova 16px/700, white or dark
- Hover: `#00989F`

**Secondary Outline**
- Border: `1px solid #00B0B9`
- Color: `#00B0B9`
- Background: transparent
- Radius: 24px

**Ghost / Subtle**
- Background: `rgba(255,255,255,0.08)`
- Color: `#FFFFFF`
- Radius: 12px

### Cards & Containers
- Metric widget: `#1E1E1E` bg, 12px radius, no border
- Padding: 20px
- Progress ring: centered 120px–160px circle, teal stroke
- `box-shadow: 0 2px 12px rgba(0,0,0,0.3)` baseline

## Do's and Don'ts

### Do
- Use large, bold numeric displays for key health metrics — the number IS the interface
- Apply teal exclusively to progress and achievement — it means "doing well"
- Keep the card grid modular and consistent — 2-column or 1-column dashboard tiles
- Show trend arrows and percentage deltas alongside metrics — direction matters
- Use progress rings consistently — they're the Fitbit signature component

### Don't
- Don't use white surfaces as primary background — this is a dark-mode-first app
- Don't crowd multiple metrics into one card — one metric = one card
- Don't use more than 2 accent colors at once on a dashboard view
- Don't animate constantly — reserve motion for goal achievement moments

## Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px
- Mobile: Single-column scrolling dashboard, bottom tab bar
- Tablet: 2-column widget grid, persistent sidebar with profile
- Web: 3-column grid dashboard, left navigation sidebar
- Companion watch UI: minimal — large text, single metric per screen

## Agent Prompt Guide

### Quick Color Reference
- Teal accent: `#00B0B9`
- Background: `#121212`
- Card: `#1E1E1E`
- Text: `#FFFFFF`
- Muted: `#9E9E9E`
- Heart rate red: `#FF4757`

### Example Component Prompts
- "Build Fitbit metric card: #1E1E1E bg, 12px radius, 20px padding. Centered progress ring 140px teal (#00B0B9). Below: metric number 64px/800 white. Unit label 16px/400 #9E9E9E."
- "Create dashboard grid: dark #121212 base. 2-col widget cards #1E1E1E, 12px radius, 12px gap. Step count card: ring + number hero."
- "Design teal CTA: #00B0B9 bg, 24px radius, Proxima Nova 16px/700 white. Hover: #00989F."
