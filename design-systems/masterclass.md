---
name: MasterClass
colors:
  tertiary: "#D4A853"
  neutral: "#000000"
  primary: "#000000"
typography:
  h1:
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1
  h2:
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.1
  h3:
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
  body-lg:
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

MasterClass operates at the highest tier of online education — its design system communicates cinematic quality, exclusivity, and access to mastery. The dominant palette is pure black (`#000000`) as the canvas, against which gold (`#D4A853`) and white create a palette that feels like a luxury film credit sequence. Every page feels like an opening scene from a documentary about someone extraordinary.

The editorial photography is the true hero of the interface. Full-bleed instructor portraits, captured in high-contrast black-and-white with dramatic chiaroscuro lighting, occupy the majority of above-fold real estate. The design system exists to frame and elevate these images, never to compete with them. Text elements are positioned over images using semi-transparent overlays rather than pushing images aside.

Typography is the second hero element. MasterClass uses Tiempos Headline — a premium condensed serif — for all display text. The tight tracking, high contrast between strokes, and condensed width gives headings an editorial newspaper quality. At body scale, a clean humanist sans-serif provides reading comfort. The combination communicates: "The knowledge here is as refined as the presentation."

**Key Characteristics:**
- Gold: `#D4A853` — primary CTA, star ratings, premium accent — never overused
- Pure black: `#000000` — dominant background; cinematic gravitas
- Tiempos Headline — condensed serif for all display headings
- Full-bleed B&W photography with dramatic lighting
- White text on black/image — no dark text on dark surface ever
- Hover state reveals full-color tinted image from grayscale
- Card overlays: `linear-gradient(to top, rgba(0,0,0,0.85) 40%, transparent)`
- Vertical rhythm dictated by 8px base, generous 64–96px section spacing

## Colors

### Primary
- **MasterClass Gold** (`#D4A853`): primary CTA buttons, star ratings, hover accents
- **Black** (`#000000`): page background, hero areas
- **White** (`#FFFFFF`): primary body and heading text on black
- **Off-White** (`#F2F0E8`): long-form lesson text, slightly warm for comfort

### Interactive
- **Gold Hover** (`#C49B43`): CTA hover, button pressed state
- **Gold Glow** (`rgba(212,168,83,0.20)`): focus ring on gold CTAs
- **White Hover** (`rgba(255,255,255,0.90)`): text link hover
- **Card Hover** (full-color reveal): transition from grayscale to color on image cards

### Surface
- **Dark Panel** (`#0A0A0A`): course detail sections, transcript backgrounds
- **Overlay Gradient**: `linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 100%)`
- **Border Subtle** (`rgba(255,255,255,0.10)`): dividers on dark backgrounds
- **Gold Border** (`rgba(212,168,83,0.30)`): form inputs, emphasized containers

## Typography

### Font Families
- **Tiempos Headline**: `"Tiempos Headline", "Georgia", serif` — all display headings (H1–H3)
- **Inter / Haas Grotesk**: `"Inter", "Helvetica Neue", sans-serif` — body, UI labels, navigation
- **System Mono** (rare): course chapter codes, technical content

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Display | Tiempos Headline | 72px | 700 | 0.95 | Condensed; instructor name |
| H1 | Tiempos Headline | 52px | 700 | 1.0 | Course title |
| H2 | Tiempos Headline | 36px | 600 | 1.1 | Chapter headings |
| H3 | Tiempos Headline | 24px | 600 | 1.2 | Section subheadings |
| Body Large | Inter | 18px | 400 | 1.7 | Lesson descriptions |
| Body Default | Inter | 15px | 400 | 1.65 | UI text, comments |
| Label | Inter | 12px | 600 | 1.2 | Uppercase, 0.1em tracking; categories |
| Caption | Inter | 11px | 400 | 1.4 | Duration, dates |
| Navigation | Inter | 14px | 500 | 1.0 | Nav links |

## Layout

### Spacing System
- Base: 8px
- Scale: 8, 16, 24, 32, 48, 64, 80, 96, 128
- Section separation: 80–96px on desktop
- Card grid: 3 columns desktop, 2 tablet, 1 mobile
- Content max-width: 1200px

### Border Radius Scale
- **0px** — hero images, full-bleed sections (no clipping)
- **4px** — buttons, lesson rows, cards
- **8px** — modals, tooltips
- **50%** — play button, avatar circles

## Elevation & Depth

- **Level 0** (base): `#000000` — cinematic black canvas
- **Level 1** (panel): `#0A0A0A` — slightly lifted content areas
- **Level 2** (overlay): gradient `rgba(0,0,0,0.85)` on image cards
- **Level 3** (modal): `box-shadow: 0 16px 64px rgba(0,0,0,0.90)`, `border: 1px solid rgba(255,255,255,0.15)`
- **Gold focus**: `box-shadow: 0 0 0 2px rgba(212,168,83,0.40)`

## Components

### Buttons
- **Primary CTA**: `background: #D4A853`, `color: #000000`, `border-radius: 4px`, `padding: 16px 32px`, `font: Inter 16px 700`, `text-transform: uppercase`, `letter-spacing: 0.08em`
- **Hover**: `background: #C49B43`
- **Ghost / Secondary**: `border: 1px solid rgba(255,255,255,0.50)`, `color: #FFFFFF`, `background: transparent`, hover `border-color: #FFFFFF`
- **Enroll CTA** (large): full-width on mobile, 56px height, uppercase gold
- **Play Button**: 64px circle, white fill, `background: rgba(255,255,255,0.15)` backdrop-blur

### Cards & Containers
- **Course Card**: full-bleed image, `border-radius: 4px`, gradient overlay, title at bottom in Tiempos Headline white
- **Instructor Card**: 3:4 portrait ratio, B&W photo, name in Tiempos Headline at bottom
- **Lesson Row**: `background: transparent`, `border-bottom: 1px solid rgba(255,255,255,0.10)`, hover `background: rgba(255,255,255,0.05)`
- **Modal**: `background: #000000`, `border: 1px solid rgba(255,255,255,0.15)`, `border-radius: 8px`

## Do's and Don'ts

### Do
- Use Tiempos Headline for all H1–H3 — it is non-negotiable for brand identity
- Use gradient overlays to make text readable over photography — never solid bars
- Desaturate course photography to B&W in default state; reveal color on hover
- Reserve gold exclusively for CTAs and star ratings — it signals premium value
- Use uppercase + letter-spacing for category labels and button text

### Don't
- Don't use light backgrounds — every surface is black or near-black
- Don't use illustrations or flat icons — photography is the only visual language
- Don't use border-radius above 8px — it conflicts with the editorial aesthetic
- Don't mix serif and sans-serif at the same hierarchy level

## Responsive Behavior

Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (cinematic wide)

- **375px**: full-bleed hero; stacked course cards; bottom sticky CTA
- **768px**: 2-column course grid; hero image at 60vh
- **1024px**: 3-column grid; hero at full viewport height
- **1440px**: expanded typography scale; wider image gutters

## Agent Prompt Guide

### Quick Color Reference
- Brand gold: `#D4A853`
- Background: `#000000`
- Panel: `#0A0A0A`
- Text: `#FFFFFF`
- Overlay: `rgba(0,0,0,0.85)`
- Border: `rgba(255,255,255,0.10)`

### Example Component Prompts
- "A course card with full-bleed B&W portrait, 4px radius, gradient overlay from transparent to rgba(0,0,0,0.85), Tiempos Headline 24px white title bottom-left, Inter 12px uppercase gold category tag"
- "A primary enroll CTA with #D4A853 background, black Inter text 16px 700 uppercase, 4px radius, full-width, 56px height, letter-spacing 0.08em"
- "A lesson list row with transparent background, 1px rgba(255,255,255,0.10) bottom border, Inter 15px white title, 12px gray duration right-aligned, hover rgba(255,255,255,0.05) fill"
