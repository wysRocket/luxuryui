---
name: Sleep Cycle
colors:
  neutral: "#1C1C3A"
  tertiary: "#FFD700"
  primary: "#FFFFFF"
typography:
  body-md:
    fontSize: 17px
    fontWeight: 400
    lineHeight: 26
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16
rounded:
  sm: 8px
  md: 20px
  lg: 28px
---

## Overview

Sleep Cycle's design is built around the intimacy of sleep data — a deeply personal, nightly ritual that demands calm, trust, and clarity. The dominant dark navy-purple canvas (`#1C1C3A`) evokes the night sky, creating an environment that feels at home on a bedside table at 11 PM. This is not a clinical health dashboard; it's a sleep companion — and the visual language reinforces that distinction through flowing gradients, warm gold data accents, and unhurried typography.

The signature soft gold / amber (`#FFD700`) used for sleep quality scores and alarm highlights is the warmest color in the system — it reads as the light of morning, the reward for good rest. Wave graph visualizations are the product's most distinctive UI element: smooth sinusoidal curves rendered in gold-to-purple gradients show sleep phases (Light, Deep, REM, Awake) without the hard-edged bar charts of typical fitness apps. Everything curves; nothing is jagged.

The type system prioritizes legibility in low-light conditions: large, high-contrast numerals for scores and times, with generous line-height for reading at arm's length from a charging phone. The alarm interface — large circular selector, glowing warm ring — references traditional analog clocks, creating a familiar, trustworthy touch point for the most critical moment: waking up.

**Key Characteristics:**
- Canvas: `#1C1C3A` (deep navy-purple) — primary background throughout
- Secondary surface: `#252545` — card and panel backgrounds
- Gold accent: `#FFD700` (soft gold) for quality scores, alarm ring, chart peaks
- Teal secondary: `#4ECDC4` for phases and sleep stage breakdowns
- Text: `#FFFFFF` primary; `rgba(255,255,255,0.6)` secondary
- Sleep wave gradient: `linear-gradient(135deg, #FFD700 0%, #7B68EE 50%, #4ECDC4 100%)`
- Border radius: 20px for cards; alarm circle is 240px circle
- No hard borders — depth via gradient overlays and transparency

## Colors

### Primary
- **Night Navy** (`#1C1C3A`): All page backgrounds, app canvas
- **Panel Dark** (`#252545`): Elevated cards, stat panels, bottom sheets
- **Deep Indigo** (`#1A1A4E`): Hover states, secondary panel variation

### Accent & Data
- **Gold** (`#FFD700`): Sleep quality score, alarm time display, chart peak
- **Amber** (`#FFC400`): Alarm ring glow, slightly deeper gold for contrast
- **Teal** (`#4ECDC4`): REM phase indicator, secondary stats, secondary chart line
- **Purple-Lavender** (`#7B68EE`): Deep sleep phase, middle wave gradient, chart fill
- **Wake Red** (`#FF6B6B`): Awake phase indicators, alarm disengagement

### Surface & Structure
- **Glass Card** (`rgba(255,255,255,0.06)`): Frosted glass cards, stat tiles
- **Glass Border** (`rgba(255,255,255,0.1)`): Subtle card borders
- **Overlay** (`rgba(28,28,58,0.85)`): Dark overlay for modals and bottom sheets
- **Divider** (`rgba(255,255,255,0.08)`): Section dividers

### Text
- **Primary** (`#FFFFFF`): Times, scores, key data, headings
- **Secondary** (`rgba(255,255,255,0.6)`): Labels, descriptions, phase names
- **Tertiary** (`rgba(255,255,255,0.35)`): Timestamps, supplementary metadata
- **Score Gold** (`#FFD700`): Quality percentage, premium numbers

### Status
- **Excellent** (`#FFD700`): 80%+ sleep quality
- **Good** (`#4ECDC4`): 60–80% quality range
- **Fair** (`#7B68EE`): 40–60% range
- **Poor** (`#FF6B6B`): Below 40% quality

## Typography

### Font Families
- **SF Pro Display / Rubik**: `'Rubik', 'SF Pro Display', -apple-system, sans-serif` — Display sizes, scores, times, hero numerals
- **SF Pro Text / Rubik**: `'Rubik', -apple-system, sans-serif` — UI body, labels, descriptions
- **System Mono**: `'SF Mono', 'Roboto Mono', monospace` — Precise time values in alarm interface

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Sleep Score | Rubik | 72px | 300 | 80px | Central quality % — gold, light weight |
| Alarm Time | Rubik | 64px | 200 | 72px | Main alarm display — ultra-light |
| Heading XL | Rubik | 32px | 600 | 40px | Section headers, "Your Sleep" |
| Heading L | Rubik | 24px | 600 | 32px | Stat category headings |
| Heading M | Rubik | 20px | 500 | 28px | Card titles |
| Body L | Rubik | 17px | 400 | 26px | Descriptions, analysis text |
| Body M | Rubik | 15px | 400 | 22px | Labels, settings items |
| Data Label | Rubik | 13px | 500 | 18px | Phase labels, axis labels on chart |
| Caption | Rubik | 11px | 400 | 16px | Timestamps, supplementary info |
| Stat Number | Rubik | 36px | 300 | 44px | Duration stats (7h 42m) |
| Phase Tag | Rubik | 12px | 600 | 16px | "DEEP" "REM" "LIGHT" "AWAKE" |

## Layout

### Spacing System
- Base unit: **8px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px`
- Card padding: `20px 20px`
- Section gaps: `24px`
- Safe area: respect iOS/Android status bar and home indicator (16px bottom, 48px top)

### Grid
- Mobile-first single column
- Two-column stat grid at `≥480px`
- Alarm interface: centered with circular layout
- Chart: full-width, height 180px minimum

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Tags, small chips |
| `--radius-md` | 12px | Settings rows, input fields |
| `--radius-lg` | 20px | Cards, bottom sheets |
| `--radius-xl` | 28px | Buttons, large pills |
| `--radius-full` | 9999px | Alarm circle, presence dots |

## Elevation & Depth

A layered system on the dark canvas — no hard shadows, only glow and transparency:

- **Base** (canvas): `#1C1C3A` — raw background
- **Panel** (card): `rgba(255,255,255,0.06)` with backdrop blur — glass card
- **Bottom Sheet**: `#252545`, slides up from bottom, rounded-top 24px
- **Gold Glow** (alarm/score): `box-shadow: 0 0 40px rgba(255,215,0,0.25)` — warm halo around key data
- **Teal Glow** (charts): `filter: drop-shadow(0 0 8px rgba(78,205,196,0.4))` — chart line glow
- **Modal**: `#1A1A4E` at 95% opacity, blur backdrop

## Components

### Buttons
**Primary Button (Set Alarm)**
- Background: `linear-gradient(135deg, #FFD700, #FFC400)`
- Text: `#1C1C3A`, weight 700, 16px
- Border-radius: `28px`
- Padding: `14px 32px`
- Box-shadow: `0 8px 32px rgba(255,215,0,0.3)`
- Hover: shadow intensifies to `rgba(255,215,0,0.5)`

**Ghost Button**
- Background: `rgba(255,255,255,0.08)`
- Border: `1px solid rgba(255,255,255,0.2)`
- Text: `#FFFFFF`, weight 500, 15px
- Border-radius: `28px`
- Hover: `background: rgba(255,255,255,0.14)`

**Alarm Dismiss Button**
- Large circle: 80px diameter
- Background: radial gradient gold center to transparent
- Animate: pulsing glow `0 0 0 20px rgba(255,215,0,0)` keyframe ring

### Cards & Containers
**Stat Glass Card**
- Background: `rgba(255,255,255,0.06)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Border-radius: `20px`
- Backdrop-filter: `blur(10px)`
- Padding: `20px`

**Sleep Phase Timeline Bar**
- Container: full-width, height 8px, border-radius 4px
- Segments color-coded: Deep `#7B68EE`, REM `#4ECDC4`, Light `rgba(255,255,255,0.3)`, Awake `#FF6B6B`
- Labels: 12px Rubik weight 600 uppercase below

**Alarm Ring Selector**
- Outer circle: 240px, `border: 4px solid rgba(255,215,0,0.3)`
- Glow: `box-shadow: 0 0 40px rgba(255,215,0,0.2), 0 0 80px rgba(255,215,0,0.08)`
- Drag handle: 20px gold circle on ring
- Center: alarm time in Rubik 64px weight 200 white

**Sleep Wave Chart**
- Background: transparent over `#1C1C3A`
- Wave fill: `linear-gradient(180deg, rgba(255,215,0,0.3) 0%, rgba(123,104,238,0.2) 50%, rgba(78,205,196,0.1) 100%)`
- Wave stroke: `#FFD700`, stroke-width 2px
- Grid lines: `rgba(255,255,255,0.05)`, dashed
- Y-axis labels: Rubik 11px `rgba(255,255,255,0.35)`

## Do's and Don'ts

### Do
- Use gold (`#FFD700`) only for the most important data points — sleep score, alarm time, top stats
- Apply `backdrop-filter: blur(10px)` to glass cards — it communicates depth on the dark canvas
- Keep wave charts smooth — use cubic bezier curves; never sharp angles on sleep data
- Display sleep time as large light-weight numerals — `Rubik 64px weight 200`
- Respect native safe areas with 16px+ bottom padding for thumb reach

### Don't
- Never use a white or light background for any screen — the dark environment is sacred
- Don't use hard-edged bar charts for sleep data — smooth wave forms only
- Avoid putting secondary data in primary gold — gold = your sleep score, nothing else
- Don't add more than 4 sleep phase colors — Deep, REM, Light, Awake is the complete set
- Avoid vibration-heavy animations before/during alarm — build calm with fade and pulse

## Responsive Behavior

**Breakpoints (mobile-first):**
- `xs`: 320px–375px — compact single column, score centered, minimal labels
- `sm`: 375px–430px — standard iPhone layout, full alarm ring
- `md`: 430px–768px — larger phone / small tablet, 2-column stat grid
- `lg`: 768px+ — tablet view, side-by-side chart and stats panel

**Native behaviors:** Pull-to-refresh on history; swipe-up to expand alarm detail; haptic feedback on alarm dismiss

## Agent Prompt Guide

### Quick Color Reference
- Canvas: `#1C1C3A`
- Card surface: `rgba(255,255,255,0.06)`
- Gold accent: `#FFD700`
- Teal accent: `#4ECDC4`
- Primary text: `#FFFFFF`
- Secondary text: `rgba(255,255,255,0.6)`

### Example Component Prompts
- "Sleep Cycle-style sleep score card: dark navy #1C1C3A background, frosted glass card rgba(255,255,255,0.06) with border rgba(255,255,255,0.1) and 20px radius, large gold #FFD700 percentage '87%' in Rubik 72px weight 300 centered, 'Sleep Quality' label in rgba(255,255,255,0.6) 13px below, box-shadow glow 0 0 40px rgba(255,215,0,0.2)"
- "Alarm time ring: 240px circle border 4px rgba(255,215,0,0.3), outer glow box-shadow 0 0 40px rgba(255,215,0,0.2), center showing '06:30' in Rubik 64px weight 200 white, drag handle as 20px gold circle on ring perimeter"
- "Sleep wave chart: transparent background, smooth SVG path with gradient fill from rgba(255,215,0,0.3) at peaks to rgba(78,205,196,0.1) at valleys, gold stroke line 2px, phase labels 'DEEP' 'REM' 'LIGHT' in Rubik 12px uppercase rgba(255,255,255,0.6) below timeline"
