---
name: Snapchat
colors:
  tertiary: "#FFFC00"
  neutral: "#000000"
  primary: "#FFFFFF"
typography:
  caption:
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24
rounded:
  sm: 6px
  md: 16px
  lg: 20px
---

## Overview

Snapchat's design language is defined by one of the most audacious color choices in consumer technology: a full-saturation yellow (`#FFFC00`) on a black canvas, with the ghost mascot (Ghostface Chillah) serving as the singular, unmistakable brand icon. This combination is instantly recognisable, playful, and youthful — a deliberate rejection of the blue/white corporate palette that dominates social media. The camera is not a feature of Snapchat; it IS Snapchat, and the UI is built around making it invisible.

The interface minimises chrome: the camera viewfinder is fullscreen by default, with minimal persistent UI elements. Stories and Discover content uses dark overlays on top of imagery, ensuring content (photography, video, illustrated Snap content) is always the visual hero. When text must appear on the dark canvas, it is white; when interactive elements need to stand out against dark camera feeds, yellow is the signal.

Typography uses Helvetica Neue — clean, Swiss, and deliberately unemotional. This neutrality is intentional: the type system stays out of the way so that AR filters, lenses, stickers, and user creativity can dominate the visual experience. The ghost icon appears throughout as a consistent mascot anchor — appearing in notifications, friend requests, Bitmoji replacements, and brand moments.

**Key Characteristics:**
- Brand yellow: `#FFFC00` (near-pure yellow) — icon backgrounds, CTAs, highlights
- App canvas: `#000000` (pure black) — camera backgrounds, dark surfaces
- Dark surface: `#111111` — cards, bottom sheets in dark mode
- Ghost white: `#FFFFFF` — text on dark, light overlay elements
- Discover purple: `#6B1FD4` — Discover tab accent (occasionally used)
- Helvetica Neue throughout — clean Swiss type, not a brand statement
- Camera viewfinder: 100vw × 100vh, fullscreen
- Lens/filter buttons: 60px circles with yellow active state

## Colors

### Primary
- **Snap Yellow** (`#FFFC00`): App icon, primary CTAs, active camera controls, highlights
- **Pure Black** (`#000000`): Camera canvas, primary dark background
- **Ghost White** (`#FFFFFF`): Text on black, overlay text on camera feeds

### Interactive
- **Yellow Hover** (`#F5F000`): Slightly deeper yellow for pressed states
- **Yellow Glow** (`rgba(255,252,0,0.3)`): Focus rings, selected state aura
- **White 80%** (`rgba(255,255,255,0.8)`): Secondary interactive labels on dark
- **Red Snap** (`#FF3B30`): Red notifications, unviewed snap indicators

### Surface
- **Pure Black** (`#000000`): Base app canvas
- **Dark Card** (`#111111`): Chat list backgrounds, bottom sheets
- **Mid Dark** (`#1C1C1E`): Elevated panels over black
- **Overlay Dark** (`rgba(0,0,0,0.6)`): Story caption overlays, controls over camera
- **Overlay Light** (`rgba(255,255,255,0.1)`): Glass buttons over camera feed

### Text
- **White** (`#FFFFFF`): All primary text on dark surfaces
- **White 80%** (`rgba(255,255,255,0.8)`): Secondary text, metadata
- **White 50%** (`rgba(255,255,255,0.5)`): Tertiary text, hints
- **Yellow** (`#FFFC00`): Brand moments, active state labels
- **Black** (`#000000`): Text on yellow backgrounds (contrast)

### Status / Indicators
- **Red** (`#FF3B30`): New snaps, notifications, urgent
- **Blue** (`#007AFF`): Opened snaps, chat messages (iOS blue)
- **Purple** (`#6B1FD4`): Discover content category accent

## Typography

### Font Families
- **Helvetica Neue**: `'Helvetica Neue', Helvetica, Arial, sans-serif` — All UI text
- **Avenir**: `'Avenir', 'Avenir Next', sans-serif` — Occasional marketing moments
- **System Font**: `-apple-system, BlinkMacSystemFont, sans-serif` — System fallback and Android

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Snap Count | Helvetica Neue | 48px | 700 | 56px | Friend streak count, score display |
| Section Header | Helvetica Neue | 22px | 700 | 28px | "Stories", "Discover" section heads |
| Story Username | Helvetica Neue | 17px | 700 | 22px | Friend username on story ring |
| Chat Username | Helvetica Neue | 15px | 600 | 20px | Chat list sender name |
| Chat Preview | Helvetica Neue | 14px | 400 | 20px | Message preview text in chat list |
| Caption (camera) | Helvetica Neue | 18px | 500 | 24px | Text on snaps, story captions |
| Filter Label | Helvetica Neue | 11px | 600 | 14px | Lens category labels |
| Nav Tab Label | Helvetica Neue | 10px | 500 | 14px | Bottom navigation labels |
| Notification | Helvetica Neue | 13px | 400 | 18px | Push notification text |
| Snap Timer | Helvetica Neue | 28px | 700 | 36px | Countdown timer on snap |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px`
- Chat list row height: `72px`
- Story ring margin: `12px` horizontal
- Bottom navigation height: `83px` (includes iOS safe area)

### Core Layout
- Camera: 100vw × 100vh fullscreen — the zero-chrome baseline
- Bottom navigation: 5 tabs fixed bottom (Map, Chat, Camera, Stories, Profile)
- Camera tab is always the center tab — largest icon, always yellow-active
- Content areas: Dark `#111111` surfaces sliding in from sides

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Notification badges |
| `--radius-md` | 12px | Story cards, Discover tiles |
| `--radius-lg` | 16px | Bottom sheets, media overlays |
| `--radius-xl` | 20px | Large panels |
| `--radius-full` | 9999px | Buttons, avatars, capture button |

## Elevation & Depth

- **Camera Layer** (base): `#000000` viewfinder — deepest layer
- **Camera Overlay Controls**: `rgba(255,255,255,0.1)` glass buttons — float over camera
- **Story Overlay**: `rgba(0,0,0,0.6)` gradient over story content for text legibility
- **Chat Surface**: `#111111` — first elevated surface above camera
- **Bottom Sheet**: `#111111` + top shadow `0 -4px 20px rgba(0,0,0,0.5)`
- **Modal**: `#1C1C1E` + `box-shadow: 0 -8px 40px rgba(0,0,0,0.7)`

## Components

### Buttons
**Primary Button**
- Background: `#FFFC00`
- Text: `#000000`, weight 700, 16px
- Border-radius: `24px`
- Padding: `12px 28px`
- No shadow
- Hover/press: scale `0.97`

**Ghost Button**
- Background: `rgba(255,255,255,0.1)`
- Border: `1px solid rgba(255,255,255,0.3)`
- Text: `#FFFFFF`, weight 600, 15px
- Border-radius: `24px`

**Camera Capture Button**
- Outer ring: 76px circle, `border: 4px solid #FFFFFF`
- Inner fill: 64px circle, `background: #FFFFFF`
- Press: inner fills to 56px, outer stays
- Held (video): inner stays white, outer ring animates to `#FF3B30`

**Lens Selector Button**
- Size: 60px circle
- Default: `background: rgba(0,0,0,0.5)`, `border: 2px solid rgba(255,255,255,0.4)`
- Active: `background: #FFFC00`, icon in `#000000`
- Border-radius: 50%

### Cards & Containers
**Story Ring (Friend Avatar)**
- Avatar: 56px circle
- Unviewed ring: `border: 3px solid #FFFC00` + `box-shadow: 0 0 8px rgba(255,252,0,0.5)`
- Viewed ring: `border: 3px solid rgba(255,255,255,0.3)`
- Username: Helvetica Neue 11px white below

**Chat List Row**
- Background: `#111111`
- Bitmoji avatar: 48px circle left
- Username: 15px white weight 600
- Preview: 14px `rgba(255,255,255,0.6)`
- Indicator dot (new snap): 10px `#FF3B30` circle right
- Divider: `rgba(255,255,255,0.06)` 1px

**Discover Card**
- Border-radius: `12px`
- Thumbnail: 16:9, object-fit cover, full card top
- Gradient overlay bottom: `linear-gradient(transparent, rgba(0,0,0,0.8))`
- Publisher name + title: white Helvetica Neue at overlay bottom

**Bottom Sheet**
- Background: `#111111`
- Top drag handle: 4px × 36px, `background: rgba(255,255,255,0.3)`, centered
- Border-radius: `20px 20px 0 0`

## Do's and Don'ts

### Do
- Make the camera the center of everything — all navigation radiates from it
- Use `#FFFC00` exclusively for primary brand moments and active states — one color, maximum impact
- Use fullscreen imagery for all content cards — no visible card backgrounds when photo/video fills
- Keep text on camera: white with subtle text-shadow `0 1px 4px rgba(0,0,0,0.5)` for legibility
- Apply yellow ring glow on story avatars to signal unviewed: `box-shadow: 0 0 8px rgba(255,252,0,0.5)`

### Don't
- Never use the yellow on dark-surface cards as fill — reserve it for interactive elements and CTAs
- Don't add more than a 3-level navigation hierarchy — Snapchat lives in 5 horizontal zones
- Avoid gradients that aren't dark-to-transparent overlays on media — keep surfaces pure black
- Don't use color for text inside the camera view except white — colored text on camera imagery fails
- Avoid using red except for notification indicators — red means "new snap from someone"

## Responsive Behavior

**Breakpoints (mobile-first native app):**
- `xs`: 320px — compact camera, minimized bottom nav labels
- `sm`: 375px–414px — standard iPhone layout, all elements full-size
- `md`: 414px+ — larger phone, story rings expand slightly
- `lg`: 768px+ — tablet mode, split-view chat + camera possible

**Native gestures:** Swipe left → chat; swipe right → stories; swipe up → Discover; pinch = zoom camera

## Agent Prompt Guide

### Quick Color Reference
- Brand yellow: `#FFFC00`
- Dark canvas: `#000000`
- Card surface: `#111111`
- Primary text: `#FFFFFF`
- Secondary text: `rgba(255,255,255,0.6)`
- Notification red: `#FF3B30`

### Example Component Prompts
- "Snapchat-style friend story row: black background #111111, 56px circle avatar left with yellow #FFFC00 border 3px ring + glow rgba(255,252,0,0.4), username in Helvetica Neue 15px white weight 600 right of avatar, 'Tap to view' in rgba(255,255,255,0.5) 13px below username"
- "Camera capture interface: fullscreen black #000000, large white 76px circle button centered at bottom with 64px white inner fill, left side lens selector 60px circles rgba(0,0,0,0.5), top bar with flash/flip icons in white 22px"
- "Snapchat yellow CTA button: background #FFFC00, text #000000 Helvetica Neue 16px weight 700, border-radius 24px, padding 12px 28px, no shadow, on-press scale 0.97 transform"
