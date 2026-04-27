---
name: Loom
colors:
  tertiary: "#625DF5"
  neutral: "#F5F4FF"
  primary: "#625DF5"
typography:
  h1:
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
  h2:
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.25
  h3:
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Loom's design language occupies the intersection of consumer delight and enterprise trustworthiness. The primary purple (`#625DF5`) is vibrant enough to communicate creative energy, yet controlled enough for B2B SaaS contexts. It appears against clean white surfaces for the primary product UI, and against dark overlays for the video player — creating two distinct visual registers that cleanly separate "creating" from "watching."

The interface is built around the video recording metaphor: the camera viewfinder circle, the glowing red record dot, the timeline scrubber. These UI affordances translate into the design vocabulary — circular elements appear throughout (avatar rings, record button glows, camera bubble). Loom uses a rounded, friendly type scale; there is nothing sharp or intimidating about the UI, because screen recording is already an anxiety-inducing activity for many users.

Typography is set in Inter for all UI chrome. Body text in the video feed and description areas is comfortable at 15–16px with generous line-height. The color system is deliberately restrained in the main app — purple CTAs, white backgrounds, gray secondary text — allowing the video thumbnails and previews to carry the visual weight of each page.

**Key Characteristics:**
- Brand purple: `#625DF5` — record button glow, CTAs, brand
- White-dominant: `#FFFFFF` — library and dashboard backgrounds
- Dark player: `#1A1A2E` — video player background, fullscreen overlays
- Inter — rounded, approachable, excellent screen legibility
- Circular record button: 64px, red `#FF3B30` with glow ring
- Video thumbnails carry visual weight — large, 16:9, hover reveals controls
- 12px border-radius on cards — friendly, not corporate
- Player controls appear on hover, fade at 0.3s

## Colors

### Primary
- **Loom Purple** (`#625DF5`): primary CTAs, selected states, recording indicator ring, brand
- **White** (`#FFFFFF`): page and card backgrounds, video library
- **Ink** (`#1A1A2E`): primary text, video player background
- **Text Default** (`#2D2D3A`): body text, video titles

### Interactive
- **Purple Hover** (`#4F4ADE`): CTA hover state
- **Record Red** (`#FF3B30`): live recording dot and button fill
- **Record Glow** (`rgba(255,59,48,0.35)`): animated glow ring during recording
- **Purple Light** (`rgba(98,93,245,0.10)`): hover fill for ghost buttons, selected row bg

### Surface
- **Page Background** (`#F5F4FF`): very light purple tint — library background
- **Card** (`#FFFFFF`): video thumbnail cards
- **Border** (`rgba(0,0,0,0.08)`): card outlines, section dividers
- **Player Dark** (`#1A1A2E`): video player, fullscreen background
- **Scrubber Filled** (`#625DF5`): progress fill on video scrubber

## Typography

### Font Families
- **Inter**: `"Inter", sans-serif` — all UI text
- **System** (fallback): `-apple-system, BlinkMacSystemFont, Roboto`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display | Inter | 36px | 700 | 1.1 | Landing hero |
| H1 | Inter | 28px | 700 | 1.2 | Section titles |
| H2 | Inter | 22px | 700 | 1.25 | Library headings |
| H3 | Inter | 18px | 600 | 1.3 | Card group titles |
| Body Large | Inter | 16px | 400 | 1.6 | Video descriptions |
| Body Default | Inter | 14px | 400 | 1.5 | UI text, captions |
| Label | Inter | 13px | 500 | 1.3 | View count, duration badge |
| Micro | Inter | 11px | 400 | 1.3 | Timestamps, keyboard hints |
| Player Time | Inter | 13px | 500 | 1.0 | Monospaced feel; current/total time |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Library grid: 3 columns at desktop, 2 at tablet, 1 at mobile
- Card gap: 16px

### Border Radius Scale
- **4px** — tags, duration badges
- **8px** — buttons, inputs, thumbnail inner
- **12px** — video cards, player, modals
- **50%** — camera bubble, avatar, record button

## Elevation & Depth

- **Level 0** (background): `#F5F4FF` — library canvas
- **Level 1** (card): `1px solid rgba(0,0,0,0.08)` — video cards flat
- **Level 2** (hover card): `box-shadow: 0 4px 16px rgba(0,0,0,0.12)` — hover state
- **Level 3** (modal): `box-shadow: 0 8px 32px rgba(0,0,0,0.20)` — share modal
- **Record glow**: `box-shadow: 0 0 0 8px rgba(255,59,48,0.35)` — animated pulse

## Components

### Buttons
- **Primary**: `background: #625DF5`, `color: #FFFFFF`, `border-radius: 8px`, `padding: 10px 20px`, `font: Inter 14px 600`
- **Hover**: `background: #4F4ADE`
- **Ghost**: `border: 1.5px solid rgba(98,93,245,0.30)`, `color: #625DF5`, `background: transparent`, hover `background: rgba(98,93,245,0.10)`
- **Record Button**: 64px circle, `background: #FF3B30`, animated `box-shadow: 0 0 0 8px rgba(255,59,48,0.35)` — pulsing during recording
- **Share CTA**: `background: #625DF5`, full-width in video share modal, 48px height

### Cards & Containers
- **Video Card**: `background: #FFFFFF`, `border-radius: 12px`, `border: 1px solid rgba(0,0,0,0.08)`, hover `box-shadow: 0 4px 16px rgba(0,0,0,0.12)`
- **Thumbnail**: 16:9 ratio, `border-radius: 8px` top corners, hover reveals timestamp overlay
- **Camera Bubble**: 80px circle, floating bottom-right during recording, `border: 3px solid #FF3B30`
- **Player Container**: `background: #1A1A2E`, `border-radius: 12px`, controls overlay fade in on hover

## Do's and Don'ts

### Do
- Use the camera-bubble-on-recording metaphor consistently for live recording states
- Animate the record button glow with a CSS pulse — this is a core brand moment
- Keep video thumbnails at 16:9 ratio always
- Use dark `#1A1A2E` only for player and recording contexts
- Show duration badge top-right on all thumbnails

### Don't
- Don't use orange or red outside of recording contexts
- Don't clutter the player chrome — controls should appear only on hover
- Don't use purple backgrounds outside of CTA buttons
- Don't use border-radius above 12px on the player

## Responsive Behavior

Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)

- **375px**: single-column library; full-screen player; bottom sheet for settings
- **768px**: 2-column grid; sidebar collapses; player at 100% width
- **1024px**: 3-column grid; persistent left nav; player max 960px wide centered

## Agent Prompt Guide

### Quick Color Reference
- Brand: `#625DF5`
- Background: `#F5F4FF`
- Card: `#FFFFFF`
- Text: `#2D2D3A`
- Record: `#FF3B30`
- Player BG: `#1A1A2E`

### Example Component Prompts
- "A video card with white background, 12px radius, 1px border rgba(0,0,0,0.08), 16:9 thumbnail top, Inter 14px 600 title, view count and duration in 13px #666, hover shadow 0 4px 16px rgba(0,0,0,0.12)"
- "A record button: 64px circle, #FF3B30 fill, animated glow ring rgba(255,59,48,0.35) 8px spread, centered in toolbar"
- "A primary share button with #625DF5 fill, white Inter 14px 600, 8px radius, 48px height, full width"
