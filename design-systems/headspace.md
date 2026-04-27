---
name: Headspace
colors:
  neutral: "#FFF8F5"
  tertiary: "#E05A2B"
  secondary: "#9E9E9E"
typography:
  body-md:
    fontFamily: GT Walsheim
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: GT Walsheim
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 8px
  md: 20px
  lg: 24px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Headspace's design is warm, playful, and disarmingly friendly — the antithesis of sterile wellness apps. The brand orange (`#FF7043` / `#F47D31`) creates an immediate sense of warmth and approachability, while a carefully curated palette of muted secondary hues (dusty blues, warm yellows, sage greens) supports a diverse range of meditation moods and topics without creating visual noise. The design communicates "meditation is for everyone" through illustration-first content, rounded forms, and an intentionally low-pressure visual tone.

Typography is set in GT Walsheim — a friendly, slightly condensed grotesque with a geometric warmth that distinguishes it from colder sans-serif choices. Headlines feel conversational, not authoritative. The most distinctive design element is the character illustration system: a set of simple, circular animated characters (affectionately called "the Headspace people") that appear throughout the product to represent emotions, meditation states, and app moments with minimal but expressive detail.

Motion is intentional and calming: transitions are slow and eased (400–600ms), pulsing circles simulate breathing exercises, and the UI never rushes or demands attention. The overall atmosphere is "a mindful friend who knows a lot about meditation" — warm, encouraging, and visually quiet.

**Key Characteristics:**
- Headspace Orange (`#FF7043` / `#F47D31`) as primary brand color
- Rich secondary palette: dusty blue (`#4A90D9`), warm yellow (`#F5C842`), sage (`#78B593`)
- Warm off-white surface (`#FFF8F5`) — never pure white
- GT Walsheim typeface — all text, multiple weights
- Circular character illustration system as primary visual storytelling
- Slow, breathing-paced motion (400–600ms ease-out)
- All corners rounded 12px–24px; no sharp edges anywhere
- Dark mode available (`#1A1A2A`) for sleep/evening sessions

## Colors

### Primary
- **Headspace Orange** (`#FF7043`): CTAs, active states, logo, progress
- **Orange Mid** (`#F47D31`): Gradient companion, hover states
- **Warm White** (`#FFF8F5`): Primary surface — warm tinted white

### Interactive
- **Hover Orange** (`#E05A2B`): Pressed/hover on primary CTA
- **Focus** (`rgba(255,112,67,0.3)`): Focus ring
- **Active Indicator** (`#FF7043`): Tab bar dot, selected state

### Surface
- **Light Peach** (`#FFE8DC`): Card backgrounds, subtle tints
- **Dark Navy** (`#1A1A2A`): Sleep mode background
- **Muted Blue** (`#F0F4F8`): Secondary card backgrounds
- **Primary Text** (`#2D2D2D`): Near-black, warm
- **Muted Text** (`#9E9E9E`): Secondary labels

### Secondary Palette
- **Sky Blue** (`#4A90D9`): Focus meditations, breathing exercises
- **Warm Yellow** (`#F5C842`): Morning sessions, happiness content
- **Sage Green** (`#78B593`): Nature, stress relief content
- **Soft Purple** (`#9B8EC4`): Sleep, evening content
- **Dusty Rose** (`#E89B8C`): Emotions, relationships content

## Typography

### Font Families
- **Primary**: `GT Walsheim` — all UI text, all weights
- **Fallback**: `Helvetica Rounded`, `Arial Rounded MT Bold`, `sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Welcome Hero | GT Walsheim | 44px | 700 | 1.10 | "Take 10" style headlines |
| Section Title | GT Walsheim | 26px | 700 | 1.20 | "For you today" |
| Card Title | GT Walsheim | 18px | 600 | 1.30 | Session title |
| Session Duration | GT Walsheim | 14px | 400 | 1.00 | "10 min · Beginner" |
| Body | GT Walsheim | 16px | 400 | 1.65 | Intro copy, descriptions |
| Player Headline | GT Walsheim | 22px | 700 | 1.20 | Now-playing title |
| Timer Display | GT Walsheim | 56px | 300 | 1.00 | Countdown timer |
| Nav Label | GT Walsheim | 11px | 600 | 1.00 | Bottom tab labels |
| Badge | GT Walsheim | 12px | 700 | 1.00 | "NEW", streak count |
| Onboarding | GT Walsheim | 28px | 700 | 1.25 | Question screens |
| Caption | GT Walsheim | 13px | 400 | 1.40 | Contextual hints |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px

### Border Radius Scale
- Small (8px): Tags, small chips
- Medium (16px): Input fields, secondary cards
- Large (20px): Session cards, feature tiles
- XL (24px): Bottom sheets, modals
- Pill (50px): All CTA buttons
- Circle (50%): Character illustrations, avatar, play button

## Elevation & Depth

- **Cards resting**: `box-shadow: 0 2px 12px rgba(0,0,0,0.08)`
- **Cards hover**: `box-shadow: 0 6px 24px rgba(0,0,0,0.12)` + scale(1.02)
- **Orange CTA**: `box-shadow: 0 4px 16px rgba(255,112,67,0.35)` — warm glow
- **Player overlay**: `box-shadow: 0 24px 64px rgba(0,0,0,0.4)`
- **Breathing animation**: pulsing `box-shadow: 0 0 0 Xpx rgba(255,112,67,0.2)` expanding ring

## Components

### Buttons

**Primary CTA**
- Background: `#FF7043`
- Border-radius: 50px (full pill)
- Padding: 16px 36px
- Font: GT Walsheim 17px/700, white
- Hover: `#E05A2B`
- Shadow: `0 4px 16px rgba(255,112,67,0.35)`

**Secondary Ghost**
- Border: `2px solid #FF7043`
- Color: `#FF7043`
- Background: transparent
- Radius: 50px

**Subtle White**
- Background: `rgba(255,255,255,0.9)`
- Color: `#2D2D2D`
- Radius: 50px
- Used on colored/image backgrounds

### Cards & Containers
- Session card: rounded 20px, overflow hidden for image
- Background gradient per mood category
- Bottom metadata: duration + level in small type
- Hover: subtle scale(1.02) + shadow increase

## Do's and Don'ts

### Do
- Use the circular character illustrations generously — they carry the Headspace identity
- Apply warm orange only to CTAs and key active states — it's an action color
- Maintain slow, deliberate animation timing (400–600ms) throughout
- Use category-specific color gradients on session cards (not all orange)
- Keep the layout breathing — generous whitespace is part of the meditation metaphor

### Don't
- Don't use sharp corners anywhere — Headspace is all curves
- Don't rush animations — fast motion is antithetical to the brand
- Don't use pure white backgrounds — warm white (`#FFF8F5`) is the base
- Don't crowd sessions — cards need visual breathing room between them

## Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px
- Mobile: Single-column cards, bottom navigation (5 tabs), fixed player bar
- Tablet: 2-column card grid, expanded player view
- Web: 3-column grid, sidebar navigation, full-screen player mode

## Agent Prompt Guide

### Quick Color Reference
- Orange: `#FF7043`
- Background: `#FFF8F5`
- Dark (sleep): `#1A1A2A`
- Text: `#2D2D2D`
- Muted: `#9E9E9E`
- Sky blue: `#4A90D9`

### Example Component Prompts
- "Build session card: 20px radius, overflow hidden. Gradient background (#4A90D9→#78B593) top. GT Walsheim 18px/600 white title bottom-left. Duration '10 min' 14px/400 white 70% opacity."
- "Design breathing circle: 160px circle, orange (#FF7043). Pulsing box-shadow animation from 0px to 40px rgba(255,112,67,0.2). GT Walsheim timer 56px/300 white center."
- "Create orange pill CTA: #FF7043, 50px radius, GT Walsheim 17px/700 white, shadow 0 4px 16px rgba(255,112,67,0.35)."
