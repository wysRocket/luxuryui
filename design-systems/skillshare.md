---
name: Skillshare
colors:
  neutral: "#002333"
  tertiary: "#00DE7A"
  primary: "#FFFFFF"
typography:
  h1:
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44
  body-md:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18
  label:
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24
    letterSpacing: 0.5px
rounded:
  sm: 4px
  md: 12px
  lg: 24px
---

## Overview

Skillshare's visual identity is rooted in creative education — a space where learning feels inspiring rather than academic. The dominant dark teal-black background (`#002333`) creates an immersive, cinema-like environment that puts video content and thumbnails front and center. This dark canvas allows colorful class thumbnails to glow with maximum contrast, making browsing feel like exploring a curated gallery rather than a course catalogue.

The signature yellow-green accent (`#00DE7A`) is electric and energetic — it conveys momentum, growth, and the reward of skill-building. Used exclusively for CTAs, progress indicators, and key interactive elements, it creates strong visual hierarchy on dark surfaces without competition from any secondary accent color. The design system is confident in its restraint: two primary tones (dark + accent green) do nearly all the heavy lifting.

Typography is set in Proxima Nova — a geometric sans-serif that balances approachability with professionalism. Its clean, rounded letterforms match Skillshare's creative-but-credible brand tone. Type sizing is generous, especially in course titles and instructor names, to support a quick-browse, video-first experience on both desktop and mobile.

**Key Characteristics:**
- Dark canvas: `#002333` (deep teal-black) for all page backgrounds
- Accent: `#00DE7A` (yellow-green) for CTAs, progress bars, highlights
- Surface cards: `#00334D` (slightly lighter teal) for content cards
- Text primary: `#FFFFFF`; secondary: `rgba(255,255,255,0.65)`
- Proxima Nova throughout — geometric sans-serif, humanist feel
- Border radius: 8px for cards, 24px for buttons and pills
- Video thumbnails at 16:9 ratio with instructor avatar overlay
- Progress bars in `#00DE7A` on `rgba(255,255,255,0.15)` track

## Colors

### Primary
- **Teal Black** (`#002333`): Page background, app shell, navigation bar
- **Card Surface** (`#00334D`): Course cards, panel backgrounds, raised elements
- **Mid Teal** (`#004060`): Hover states on cards, secondary panels
- **Accent Green** (`#00DE7A`): CTAs, progress bars, enrollment badges, active states

### Interactive
- **Green Hover** (`#00C66E`): Hover on accent green buttons
- **Green Active** (`#00A85D`): Pressed state for primary buttons
- **White Hover** (`rgba(255,255,255,0.1)`): Hover on dark nav items and ghost buttons

### Surface
- **Base Canvas** (`#002333`): Root background
- **Card Layer** (`#00334D`): Elevated cards and containers
- **Overlay** (`rgba(0,0,0,0.7)`): Video overlays, modal backdrops
- **Subtle Divider** (`rgba(255,255,255,0.08)`): Section separators on dark
- **Input Background** (`rgba(255,255,255,0.1)`): Form inputs on dark canvas

### Text
- **Primary** (`#FFFFFF`): Headings, course titles, primary labels
- **Secondary** (`rgba(255,255,255,0.65)`): Instructor names, metadata, captions
- **Tertiary** (`rgba(255,255,255,0.4)`): Timestamps, supplementary info
- **Accent** (`#00DE7A`): Highlighted text, active links, enrollment status

### Status
- **Success / Active** (`#00DE7A`): Enrollment, completion, progress
- **Warning** (`#FFD166`): Expiry notices, soft warnings
- **Error** (`#FF6B6B`): Form errors, failed states

## Typography

### Font Families
- **Proxima Nova**: `'Proxima Nova', 'Proxima Nova Soft', sans-serif` — Primary typeface for all UI: headings, body, labels
- **System Fallback**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — Fallback stack
- **Georgia**: `Georgia, 'Times New Roman', serif` — Long-form essay/editorial content only (rarely used)

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Display | Proxima Nova | 56px | 700 | 64px | Marketing landing sections |
| Section Heading | Proxima Nova | 36px | 700 | 44px | Page section titles |
| Content Heading | Proxima Nova | 28px | 700 | 36px | Category/playlist titles |
| Card Title | Proxima Nova | 18px | 600 | 26px | Course card titles |
| Subtitle | Proxima Nova | 16px | 600 | 24px | Instructor names, section labels |
| Body L | Proxima Nova | 16px | 400 | 26px | Course descriptions, long text |
| Body M | Proxima Nova | 14px | 400 | 22px | Labels, UI controls |
| Caption | Proxima Nova | 12px | 400 | 18px | Duration, view counts, metadata |
| Badge | Proxima Nova | 11px | 700 | 16px | Pills: "NEW", "POPULAR", category tags |
| Button | Proxima Nova | 16px | 700 | 24px | CTA buttons (uppercase tracking +0.5px) |
| Nav Item | Proxima Nova | 14px | 600 | 20px | Navigation links |

## Layout

### Spacing System
- Base unit: **8px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px`
- Card internal padding: `16px`
- Section vertical gaps: `48px` or `64px`
- Page horizontal padding: `24px` (mobile), `40px` (tablet), `80px` (desktop)

### Grid
- Course card grid: 1 column (mobile) → 2 (sm) → 3 (md) → 4 (lg) → 5 (xl)
- Gutter between cards: `20px`
- Content max-width: `1440px`
- Featured/hero: full bleed at all widths

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Category pills, tags |
| `--radius-md` | 8px | Input fields, tooltips |
| `--radius-lg` | 12px | Course cards, panels |
| `--radius-xl` | 16px | Featured banners |
| `--radius-full` | 24px | Buttons, avatar circles |

## Elevation & Depth

The depth system creates clear hierarchy on the consistently dark canvas:

- **Base** (canvas): `#002333` — no shadow
- **Card** (elevated): `#00334D`, `box-shadow: 0 4px 20px rgba(0,0,0,0.3)` — course cards
- **Hover Card**: `box-shadow: 0 16px 40px rgba(0,0,0,0.4)` — hovered course cards
- **Modal / Drawer**: `box-shadow: 0 24px 80px rgba(0,0,0,0.6)`, backdrop `rgba(0,0,0,0.7)` blur-4px
- **Tooltip**: `box-shadow: 0 4px 16px rgba(0,0,0,0.5)`, bg `#004060`
- **Video player overlay**: gradient `linear-gradient(transparent 60%, rgba(0,0,0,0.8))` at bottom

## Components

### Buttons
**Primary Button (Enroll / Start)**
- Background: `#00DE7A`
- Text: `#002333`, weight 700, 16px, letter-spacing `0.5px`, uppercase
- Border-radius: `24px`
- Padding: `12px 28px`
- Hover: `background: #00C66E`, subtle scale `transform: scale(1.02)`
- Active: `background: #00A85D`
- No border, no box-shadow

**Ghost Button**
- Background: `transparent`
- Border: `2px solid rgba(255,255,255,0.5)`
- Text: `#FFFFFF`, weight 600, 14px
- Border-radius: `24px`
- Hover: `border-color: #FFFFFF`, `background: rgba(255,255,255,0.08)`

**Text Button**
- Background: transparent, no border
- Text: `#00DE7A`, weight 600
- Hover: text color `#00C66E`, underline

### Cards & Containers
**Course Card**
- Background: `#00334D`
- Border-radius: `12px`
- Overflow: hidden
- Thumbnail: 16:9 ratio, full-width, object-fit cover
- Bottom padding: `16px`
- Hover: `transform: translateY(-4px)`, `box-shadow: 0 16px 40px rgba(0,0,0,0.4)`
- Transition: `all 0.2s ease`

**Instructor Avatar Chip (on card)**
- Avatar: 32px circle, `border: 2px solid #002333`
- Positioned bottom-left of thumbnail overlapping card edge

**Progress Bar**
- Track: `rgba(255,255,255,0.15)`, height `4px`, border-radius `2px`
- Fill: `#00DE7A`, border-radius `2px`
- Label: `12px rgba(255,255,255,0.65)` showing "X% complete"

**Category Pill**
- Background: `rgba(0,222,122,0.15)`
- Border: `1px solid rgba(0,222,122,0.4)`
- Text: `#00DE7A`, 11px, weight 700, uppercase, letter-spacing 1px
- Border-radius: `4px`
- Padding: `3px 8px`

### Navigation
- Background: `#002333` with `border-bottom: 1px solid rgba(255,255,255,0.08)`
- Logo: white
- Nav items: `rgba(255,255,255,0.8)` text, hover `#FFFFFF`
- Active tab: `color: #FFFFFF`, `border-bottom: 2px solid #00DE7A`

## Do's and Don'ts

### Do
- Use `#00DE7A` exclusively for primary CTAs and progress — one accent rules the dark canvas
- Give course thumbnails room to breathe — the art IS the content
- Use `rgba(255,255,255,0.65)` for secondary text — not gray, never off-white, always alpha-white on dark
- Apply 12px border-radius to cards and 24px to buttons — these radii define the brand's approachability
- Let instructor avatars overlap thumbnails at card bottom for personality and authenticity

### Don't
- Never use a light/white background except for marketing hero CTAs or modal confirmations
- Don't add a second accent color — `#00DE7A` works alone; adding yellow or blue dilutes focus
- Avoid text lighter than `rgba(255,255,255,0.4)` — anything lower is effectively invisible
- Don't use uppercase for body text — only button labels and badge pills get uppercase treatment
- Avoid heavy drop shadows that compete with card lift on hover

## Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — 1 course column, stacked hero, drawer navigation
- `sm`: 480px–768px — 2 course columns, compact header
- `md`: 768px–1024px — 3 course columns, full navigation visible
- `lg`: 1024px–1440px — 4 course columns, sidebar filters
- `xl`: 1440px+ — 5 course columns, max-width 1440px centered

**Navigation:** Hamburger at `<768px`, full horizontal nav at `≥768px`

**Video player:** Full-width at mobile, 16:9 constrained with sidebar lesson list at `≥1024px`

## Agent Prompt Guide

### Quick Color Reference
- Canvas: `#002333`
- Card surface: `#00334D`
- Primary accent: `#00DE7A`
- Primary text: `#FFFFFF`
- Secondary text: `rgba(255,255,255,0.65)`
- Category pill border: `rgba(0,222,122,0.4)`

### Example Component Prompts
- "Skillshare-style course card on dark teal-black #00334D surface, 16:9 thumbnail image at top with instructor 32px avatar circle overlapping at bottom-left, course title in Proxima Nova 18px white weight 600, instructor name in rgba(255,255,255,0.65) 14px, project count metadata in rgba(255,255,255,0.4) 12px, '#00DE7A' progress bar at 60% fill at card bottom"
- "Dark navigation bar #002333 with Skillshare logo left, horizontal nav links in Proxima Nova 14px rgba(255,255,255,0.8), active link white with 2px #00DE7A border-bottom, green '#00DE7A' 'Get Started' pill button right side"
- "Category filter pills: background rgba(0,222,122,0.15), border 1px rgba(0,222,122,0.4), text #00DE7A 11px uppercase weight 700, border-radius 4px — active state bg #00DE7A text #002333"
