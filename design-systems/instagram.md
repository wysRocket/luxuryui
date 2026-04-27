---
name: Instagram
colors:
  tertiary: "#0095F6"
  neutral: "#FFFFFF"
  primary: "#262626"
  secondary: "#737373"
typography:
  caption:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
rounded:
  sm: 2px
  md: 8px
  lg: 16px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Instagram's design is the definitive visual-first social interface — every decision defers to the photography and video content that makes up the feed. The UI is intentionally invisible: pure white backgrounds (`#FFFFFF`), thin hairline borders, and minimal chrome ensure that user-generated content reads as the only visual hierarchy that matters. The iconic gradient logo (purple `#8A3AB9` → pink `#E95950` → orange `#FCCC63`) is the rare exception — a vivid brand moment in an otherwise restrained UI.

Typography uses the system sans-serif (San Francisco on iOS, Roboto on Android, and a web-optimized stack on desktop) — a deliberate choice that makes the interface feel native, fast, and invisible rather than branded. Type scales are compact and efficient: username labels, caption text, and engagement counts are all rendered at sizes that maximize information density without competing with photos.

Stories — the horizontal bubble-tray of circular avatars at the top of the feed — introduced a new UI paradigm globally adopted across social apps. The gradient ring indicator (distinguishing unviewed stories from viewed ones) is one of the most recognized UX patterns in mobile design. The Reels and video feed use an immersive full-screen, zero-chrome presentation model that puts content in full focus.

**Key Characteristics:**
- Logo gradient: `#8A3AB9` → `#C13584` → `#E95950` → `#FCCC63` (purple-pink-orange)
- White primary surface (`#FFFFFF`) — maximum content prominence
- System font stack (SF Pro, Roboto) — native feel, no brand font
- Hairline borders (`rgba(0,0,0,0.0975)`) — minimal visual structure
- Story ring gradient: full logo gradient applied as border
- Bold blue (`#0095F6`) for links, CTAs, and interactive text
- Near-black (`#262626`) for all primary text
- Stories, Feed, and Reels as three distinct visual contexts

## Colors

### Primary
- **Instagram Blue** (`#0095F6`): Follow button, links, interactive text
- **Pure White** (`#FFFFFF`): Primary background — content is king
- **Near Black** (`#262626`): All primary text

### Interactive
- **Hover Blue** (`#1AA1F7`): Blue button hover
- **Active Blue** (`rgba(0,149,246,0.1)`): Tint for active states
- **Like Red** (`#ED4956`): Heart icon active state
- **Story Ring** (`linear-gradient(#8A3AB9, #C13584, #E95950, #FCCC63)`): Unviewed story

### Surface
- **White** (`#FFFFFF`): Feed cards, post containers
- **Light Gray** (`#FAFAFA`): App page background (hairline diff from white)
- **Border** (`rgba(0,0,0,0.0975)`): Card borders, dividers — extremely subtle
- **Secondary Text** (`#737373`): Username subtitles, timestamps
- **Disabled** (`#C7C7C7`): Inactive icons

### Dark Mode
- **Background** (`#000000`): Pure black — OLED optimized
- **Card Dark** (`#121212`): Post containers in dark mode
- **Text Dark** (`#FAFAFA`): Primary text in dark mode

## Typography

### Font Families
- **iOS**: `SF Pro Display` / `SF Pro Text` — system default
- **Android**: `Roboto` — system default
- **Web**: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Profile Name | System | 16px | 700 | 1.20 | Profile page header |
| Username | System | 14px | 600 | 1.20 | Feed post header |
| Caption | System | 14px | 400 | 1.50 | Post caption text |
| Comment | System | 14px | 400 | 1.50 | Comment body |
| Engagement | System | 14px | 600 | 1.20 | "2,847 likes" |
| Timestamp | System | 12px | 400 | 1.20 | "3 hours ago" |
| Story Label | System | 11px | 600 | 1.00 | Username under story bubble |
| Hashtag | System | 14px | 400 | 1.50 | Blue `#0095F6` inline |
| Navigation | System | 10px | 500 | 1.00 | Tab bar labels |
| Button | System | 14px | 600 | 1.00 | "Follow", "Message" |
| Explore Tag | System | 12px | 700 | 1.20 | Category chips |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px
- Post padding: 12px horizontal
- Story bubble: 60px width, 4px gap between bubbles

### Border Radius Scale
- None (0px): Post image containers — full bleed
- Small (4px): Category chips in Explore
- Standard (8px): Buttons, badges
- Large (16px): Bottom sheets
- Circle (50%): Story avatars, profile photos
- Story ring: 66px circle with 2px gradient border

## Elevation & Depth

- **Feed**: No shadows — pure flat, border-defined
- **Stories tray**: No shadow — hairline bottom border
- **Modal sheets**: `box-shadow: 0 -2px 20px rgba(0,0,0,0.15)`
- **Story viewer**: Full-screen, no UI chrome — zero elevation needed
- **Action sheet**: `box-shadow: 0 -4px 16px rgba(0,0,0,0.1)`
- **Dark mode**: Contrast only — no shadows needed on black surfaces

## Components

### Buttons

**Follow (Primary)**
- Background: `#0095F6`
- Border-radius: 8px
- Padding: 7px 16px
- Font: System 14px/600, white
- Hover: `#1AA1F7`

**Following (Toggled)**
- Background: `#FFFFFF`
- Border: `1px solid #DBDBDB`
- Color: `#262626`
- Radius: 8px

**Story Add Button**
- Circle 56px, `#FFFFFF` background
- Plus icon in blue `#0095F6`
- Gradient ring on outer edge

### Cards & Containers
- Post container: white bg, no radius (full-width on mobile)
- Border-bottom: `1px solid rgba(0,0,0,0.0975)`
- Image: full-width, aspect-ratio 1:1 or 4:5 (portrait)
- Header: username 14px/600 + 3-dot menu
- Footer: heart, comment, share, bookmark icons + likes count

## Do's and Don'ts

### Do
- Make content the only visual hierarchy — UI should be invisible
- Use the gradient ring consistently for unviewed stories
- Apply blue (`#0095F6`) only to interactive text and Follow buttons
- Maintain full-width, edge-to-edge images in the feed — no card padding on images
- Preserve the 1:1 square and 4:5 portrait aspect ratios for feed images

### Don't
- Don't use branded typefaces — system fonts are the Instagram standard
- Don't add decorative backgrounds or colored sections in the feed
- Don't use heavy shadows — hairline borders are the entire structure system
- Don't add icons or labels that compete with content
- Don't apply border-radius to post images — they bleed edge to edge

## Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px (web.instagram.com)
- Mobile: Single-column feed, full-width images, fixed bottom nav
- Tablet: 2-column Explore grid, larger story bubbles
- Web: 3-column layout — feed center (470px), suggestions right sidebar

## Agent Prompt Guide

### Quick Color Reference
- Blue (CTA): `#0095F6`
- Background: `#FFFFFF` (light), `#000000` (dark)
- Text: `#262626`
- Secondary: `#737373`
- Like red: `#ED4956`
- Story ring: `linear-gradient(#8A3AB9, #C13584, #E95950, #FCCC63)`

### Example Component Prompts
- "Build Instagram feed post: white bg, full-width. Header: 40px avatar + username 14px/600 + 3-dot. Full-width 1:1 image. Footer: heart/comment/share/bookmark icons 24px, likes 14px/600, caption 14px/400."
- "Create story bubble: 60px circle, user photo. Gradient ring 2px border (linear-gradient #8A3AB9→#C13584→#E95950→#FCCC63). Username 11px/600 centered below."
- "Design follow button: #0095F6 bg, 8px radius, 7px/16px padding, system 14px/600 white. Toggled: white bg, 1px solid #DBDBDB, #262626 text."
