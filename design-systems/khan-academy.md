# Design System Inspired by Khan Academy

## 1. Visual Theme & Atmosphere

Khan Academy's design language is built on the principle that learning should feel approachable, encouraging, and free from anxiety. The interface uses a clean white canvas with a confident teal-green (#14BF96) as the primary brand color — a hue that communicates growth, health, and forward momentum. A secondary blue (#1865F2) handles interactive elements and links, creating a clear two-tone system that guides students intuitively through content.

Lato is the brand's workhorse typeface — humanist, warm, and extremely readable across all sizes and learning contexts. At large display sizes it feels friendly and welcoming; at body sizes it maintains excellent legibility for long-form reading sessions. The type scale is conservative and generous in line-height, reflecting a deliberate choice to reduce cognitive load during learning.

Progress and mastery visualization is central to the UI. The green accent appears in progress rings, mastery cells, energy point counters, and skill badges, consistently reinforcing positive reinforcement loops. The interface is student-friendly by design — rounded corners, generous white space, and a flat illustration style that welcomes all ages.

**Key Characteristics:**
- Brand green: `#14BF96` — mastery, progress, success, brand
- Action blue: `#1865F2` — interactive links, video CTAs, primary buttons
- White-dominant surface: `#FFFFFF` — educational content needs breathing room
- Lato typeface — humanist, friendly, highly legible at all sizes
- Rounded corners (8–16px) throughout — nothing feels sharp or intimidating
- Progress mastery grid: 5-level system from white to deep green
- Flat, inclusive illustration style — no photography in core UI
- High contrast text for accessibility (WCAG AA minimum)

## 2. Color Palette & Roles

### Primary
- **Khan Green** (`#14BF96`): mastery indicators, progress fills, success states, brand
- **Khan Blue** (`#1865F2`): primary buttons, links, video play overlays
- **White** (`#FFFFFF`): content backgrounds, card surfaces
- **Ink** (`#21242C`): primary heading and body text

### Interactive
- **Blue Hover** (`#1454CE`): CTA button hover state
- **Green Hover** (`#0FA07D`): mastery hover, progress hover
- **Link Hover** (`#1454CE`): underlined on hover
- **Danger Red** (`#D92916`): incorrect answer feedback, error states

### Surface
- **Background** (`#F7F8FA`): page-level background behind content blocks
- **Card** (`#FFFFFF`): lesson cards, exercise wrappers
- **Border** (`rgba(33,36,44,0.12)`): card outlines, input borders
- **Mastery 1–5** (`#FFFFFF`, `#D6F0E8`, `#70C6A8`, `#14BF96`, `#0E8A6A`): mastery grid spectrum

## 3. Typography Rules

### Font Families
- **Lato**: `"Lato", sans-serif` — primary typeface for all UI text and body content
- **Georgia** (fallback): used in article rendering for long-form math textbooks

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display | Lato | 40px | 700 | 1.15 | Hero headings, unit titles |
| H1 | Lato | 32px | 700 | 1.2 | Course titles |
| H2 | Lato | 24px | 700 | 1.3 | Section headers |
| H3 | Lato | 20px | 600 | 1.35 | Lesson headers |
| H4 | Lato | 16px | 700 | 1.4 | Card titles |
| Body Large | Lato | 16px | 400 | 1.65 | Exercise instructions |
| Body Default | Lato | 15px | 400 | 1.6 | General UI text |
| Body Small | Lato | 13px | 400 | 1.5 | Metadata, timestamps |
| Label | Lato | 12px | 700 | 1.2 | Uppercase badge text, 0.06em tracking |
| Tiny | Lato | 11px | 400 | 1.4 | Legal, fine print |

## 4. Component Stylings

### Buttons
- **Primary**: `background: #1865F2`, `color: #FFFFFF`, `border-radius: 8px`, `padding: 12px 20px`, `font-size: 16px`, `font-weight: 700`
- **Hover**: `background: #1454CE`
- **Green Primary**: `background: #14BF96`, `color: #FFFFFF` — used on "Start learning" CTAs
- **Secondary / Ghost**: `border: 2px solid #1865F2`, `color: #1865F2`, `background: transparent`, `border-radius: 8px`
- **Disabled**: `background: #C8CACE`, `color: #7D8189`

### Cards & Containers
- **Course Card**: `background: #FFFFFF`, `border-radius: 12px`, `border: 1px solid rgba(33,36,44,0.12)`, `padding: 20px`, `box-shadow: 0 1px 4px rgba(33,36,44,0.08)`
- **Exercise Container**: `border-radius: 8px`, `background: #FFFFFF`, inner shadow on focus state
- **Mastery Grid Cell**: 36×36px, rounded 4px, background based on mastery level 1–5
- **Progress Ring**: SVG circle, green stroke `#14BF96` on gray `#E5E7EB` track

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
- Content max-width: 720px for reading, 1200px for dashboard
- Sidebar: 240px fixed; main content fluid

### Border Radius Scale
- **4px** — mastery grid cells, tags
- **8px** — buttons, inputs, small cards
- **12px** — course cards, lesson containers
- **16px** — modal dialogs, onboarding panels
- **9999px** — progress bars, pill badges

## 6. Depth & Elevation

- **Level 0** (inline): no shadow, border only — exercise step items
- **Level 1** (card): `box-shadow: 0 1px 4px rgba(33,36,44,0.08)` — course cards
- **Level 2** (floating): `box-shadow: 0 4px 12px rgba(33,36,44,0.12)` — dropdowns, tooltips
- **Level 3** (modal): `box-shadow: 0 8px 32px rgba(33,36,44,0.18)` — modal dialogs
- Green glow on success: `box-shadow: 0 0 0 3px rgba(20,191,150,0.30)` — correct answer ring

## 7. Do's and Don'ts

### Do
- Use green exclusively for mastery, success, and progress signals
- Use blue for all primary interactive calls to action
- Maintain generous line-height (1.6+) in all instructional content
- Apply rounded corners (8px+) everywhere — sharp UI is anxiety-inducing
- Show progress constantly — energy points, mastery levels, streaks

### Don't
- Don't use red for anything other than incorrect feedback — it's anxiety-inducing
- Don't let content lines exceed 720px — readability deteriorates for math/science text
- Don't mix display typefaces into learning content — Lato only
- Don't use shadows heavier than level 2 in content areas

## 8. Responsive Behavior
Breakpoints: 360px (mobile), 600px (tablet portrait), 960px (tablet landscape), 1280px (desktop)

- **360px**: single column; collapsible sidebar; stacked mastery cells
- **600px**: 2-column course grid; inline sidebar toggle
- **960px**: full sidebar visible; 2-column course grid; video at 100% width
- **1280px**: 3-column course grid; wide dashboard mastery view

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: `#14BF96`
- Interactive: `#1865F2`
- Background: `#F7F8FA`
- Text: `#21242C`
- Success/Correct: `#14BF96`
- Error/Incorrect: `#D92916`

### Example Component Prompts
- "A course card with white background, 12px radius, 1px border rgba(33,36,44,0.12), Lato 16px 700 title, green progress bar at 4px height, and mastery level 3 badge"
- "A primary CTA button with #1865F2 fill, white Lato text at 16px bold, 8px radius, hover state at #1454CE, 12px×20px padding"
- "A mastery grid showing 5 skill cells, 36px wide, 4px radius, spanning white through #14BF96 tones left to right"
