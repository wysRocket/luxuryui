# Design System Inspired by Shazam

## 1. Visual Theme & Atmosphere

Shazam's design language is defined by a single transcendent moment: the deep blue pulse of the recognition button, expanding outward in concentric rings, waiting to name the song filling the room. The entire design system orbits this interaction. The background is a deep navy-to-midnight blue gradient (`#3668C0` to `#1A2A6C`) that creates the sensation of digital space — vast, calm, and receptive. Against this dark canvas, the cyan-teal accent (`#08F7E6`) vibrates with the frequency of music itself, used for recognition pulses, active states, and moments of discovery.

The Apple ecosystem integration is profound and intentional. Shazam (owned by Apple since 2018) uses SF Pro throughout, honors iOS safe areas, supports Dynamic Island integration, and uses Apple's system blue as a secondary interactive color where the custom cyan would clash. The animation language is distinctly Apple: spring physics, smooth deceleration curves, and the signature pulse ring animation that expands outward on tap with satisfying elastic timing.

Discovery and history form the secondary surfaces of the experience. After a successful Shazam, the recognized track card appears with album artwork filling the full width, artist name, and play controls — a mini now-playing experience. The My Shazams library uses a clean list format with large album art thumbnails against a consistent dark background, maintaining the immersive space atmosphere even in browsing mode.

**Key Characteristics:**
- Deep dark blue gradient: `#1A2A6C` to `#3668C0` — immersive space aesthetic
- Cyan-teal accent `#08F7E6` for the signature button glow, pulse rings, active states
- Pure black `#000000` as deepest layer for nav bar and overlay surfaces
- SF Pro throughout — Apple ecosystem native
- Signature pulse animation: 3 concentric rings expanding from button, cyan with alpha
- Album art: full-width hero on recognition result cards
- Minimal chrome — the recognition button is the only persistent primary UI
- Blur-glass result cards: `backdrop-filter blur(40px)` with dark tint over album art

## 2. Color Palette & Roles

### Primary
- **Deep Midnight** (`#1A2A6C`): Dark base of gradient background
- **Bright Blue** (`#3668C0`): Light end of gradient, also used in interactive elements
- **Cyan Teal** (`#08F7E6`): Signature accent — Shazam button glow, pulse rings, active

### Gradient System
- **Background Gradient**: `radial-gradient(ellipse at center, #3668C0 0%, #1A2A6C 60%, #0D1433 100%)`
- **Button Glow**: `radial-gradient(circle, rgba(8,247,230,0.4) 0%, transparent 70%)`
- **Pulse Ring 1**: `rgba(8, 247, 230, 0.35)` — inner ring
- **Pulse Ring 2**: `rgba(8, 247, 230, 0.20)` — mid ring
- **Pulse Ring 3**: `rgba(8, 247, 230, 0.10)` — outer ring

### Apple System Colors (Secondary)
- **System Blue** (`#0A84FF`): Apple blue for links, system-native interactive elements
- **System Green** (`#30D158`): Apple Music add, save confirmation
- **System Red** (`#FF453A`): Remove from library, error (dark mode variants)

### Result / Recognition
- **Result Glass BG** (`rgba(0, 0, 0, 0.50)`): Glass card background over album art
- **Result Blur** (`backdrop-filter: blur(40px)`): Applied to result overlay card
- **White Primary** (`#FFFFFF`): Track name, key result text
- **White Secondary** (`rgba(255,255,255,0.75)`): Artist name, secondary result info
- **White Tertiary** (`rgba(255,255,255,0.50)`): Metadata, captions on glass

### Dark Neutrals
- **Pure Black** (`#000000`): Nav bar, absolute darkest layer
- **Navy 900** (`#0D1433`): Gradient endpoint, deepest app surface
- **Navy 800** (`#162060`): Elevated surfaces on dark gradient
- **Navy 700** (`#1D2E7A`): Card backgrounds, list surfaces

### Status
- **Success Cyan** (`#08F7E6`): Recognition successful glow
- **Listening Pulse** (`rgba(8,247,230,0.6)`): Active listening animation
- **Error Red** (`#FF453A`): Recognition failed, no result

## 3. Typography Rules

### Font Families
- **SF Pro Display**: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif` — All display text, headers
- **SF Pro Text**: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif` — Body, labels, metadata
- **SF Pro Rounded**: `'SF Pro Rounded', -apple-system, sans-serif` — Friendly labels, count badges

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Recognition Prompt | SF Pro Display | 17px | 400 | 24px | "Tap to Shazam" white alpha |
| Track Name (Result) | SF Pro Display | 26px | 700 | 32px | White on glass result card |
| Artist Name (Result) | SF Pro Display | 18px | 500 | 24px | White 75% alpha |
| Section Header | SF Pro Display | 20px | 700 | 26px | White |
| Library Track Name | SF Pro Text | 16px | 600 | 22px | White |
| Library Artist | SF Pro Text | 14px | 400 | 20px | White 75% alpha |
| Genre / Tag | SF Pro Text | 12px | 500 | 16px | Cyan `#08F7E6`, uppercase |
| Tab Label | SF Pro Text | 10px | 500 | 12px | White active, alpha inactive |
| Button Label | SF Pro Display | 15px | 600 | 20px | White on dark |
| Timestamp | SF Pro Text | 12px | 400 | 16px | White 50% alpha |
| Caption | SF Pro Text | 12px | 400 | 16px | White 60% alpha |
| Count Badge | SF Pro Rounded | 12px | 700 | 16px | White on cyan/blue pill |

## 4. Component Stylings

### Buttons

**Shazam Recognition Button (Hero)**
```
background: radial-gradient(circle, #08F7E6 30%, #0B97F5 100%)
width: 120px
height: 120px
border-radius: 50%
shadow: 0 0 60px rgba(8, 247, 230, 0.50)
icon: Shazam 'S' mark white center 48px
tap animation: scale 0.95→1.05→1.0 spring 400ms
listening: pulsing rings animation (see below)
```

**Pulse Ring Animation**
```
.ring-1: width/height 160px, position absolute center, border-radius 50%
         background rgba(8,247,230,0.35), scale 1→1.4 opacity 1→0, 1.5s ease-out infinite
.ring-2: same, delay 0.5s, scale 1→1.7
.ring-3: same, delay 1.0s, scale 1→2.0
```

**Secondary Action Button**
```
background: rgba(255, 255, 255, 0.12)
color: #FFFFFF
border: 1px solid rgba(255, 255, 255, 0.20)
backdrop-filter: blur(8px)
border-radius: 22px
padding: 12px 24px
font: SF Pro 15px 600
hover: background rgba(255,255,255,0.20)
```

**Apple Music Play Button**
```
background: #FF2D55 (Apple Music red)
color: #FFFFFF
border-radius: 22px
padding: 12px 24px
font: SF Pro 15px 600
icon: play triangle left
```

### Cards & Containers

**Recognition Result Card**
```
position: covers bottom 60% of screen
background: rgba(0, 0, 0, 0.50)
backdrop-filter: blur(40px)
border-radius: 24px 24px 0 0 (bottom sheet style)
padding: 24px
album-art: 120px × 120px, 16px radius, left or top
track-name: SF Pro 26px 700 white
artist-name: SF Pro 18px 500 white 75%
action row: play | share | add-to-library icons
border-top: 1px solid rgba(255,255,255,0.10)
```

**My Shazams Library Row**
```
background: rgba(255,255,255,0.06)
border-radius: 12px
padding: 14px 16px
layout: 56px album art | track+artist | date right
margin-bottom: 8px
album-art-radius: 8px
hover: background rgba(255,255,255,0.10)
```

**Trending Discover Card**
```
aspect-ratio: 1/1 (square)
background: album art full fill
border-radius: 12px
overlay: gradient bottom-to-top dark 50%
text: white track + artist bottom-left
shadow: 0 8px 24px rgba(0,0,0,0.40)
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px
- Recognition screen: button centered vertically, 20px horizontal margins
- Library list: 8px between items, 20px horizontal margins
- Result card: 24px internal padding
- Safe areas: iOS safe area insets honored (Dynamic Island support)

### Border Radius Scale
- `8px` — Album art in lists, secondary buttons
- `12px` — Discover cards, library rows
- `16px` — Album art on result card
- `22px` — Pill action buttons
- `24px` — Result bottom sheet card
- `50%` — Main recognition button

### Grid
- Mobile: Single column, 20px margins (recognition-first design)
- Discover grid: 2-column, 12px gap
- Library: single column list
- Desktop/web: centered 390px, blue gradient full-bleed background

## 6. Depth & Elevation

```
Level 0 - BG Gradient:    radial-gradient deep navy to black
Level 1 - Library Rows:   rgba(255,255,255,0.06) + 0 shadow
Level 2 - Cards:          rgba(255,255,255,0.10) + 0 8px 24px rgba(0,0,0,0.40)
Level 3 - Result Sheet:   rgba(0,0,0,0.50) + blur(40px) + 0 -8px 40px rgba(0,0,0,0.5)
Button Glow:              0 0 60px rgba(8,247,230,0.50) (essential)
Shazam button:            central; highest visual z-weight in system
```

## 7. Do's and Don'ts

### Do
- Center the Shazam button as the single primary focal point of the recognition screen
- Animate pulse rings during listening — the animation IS the interaction feedback
- Use `backdrop-filter: blur(40px)` on result cards over album art backgrounds
- Honor iOS safe areas and Dynamic Island (top notch awareness)
- Display album art as a full-width hero whenever space allows
- Use SF Pro throughout — this is an Apple-native product

### Don't
- Don't clutter the recognition screen — one button, minimal text, dark gradient only
- Don't use cyan `#08F7E6` for non-recognition states — it must mean "Shazam is active"
- Don't break the dark blue gradient for light mode — Shazam is dark-first always
- Don't reduce the recognition button below 120px — it must be confident and unmissable

## 8. Responsive Behavior

**Breakpoints:**
- `390px` — Primary iPhone target: recognition button centered, full gradient bg
- `430px` — iPhone Pro Max: larger button optional, discovery cards larger
- `768px` — iPad: recognition button larger (160px), 2-column discovery grid
- `1024px` — Mac Catalyst / web: centered 500px column on dark blue full-bleed

**Adaptive Patterns:**
- Recognition button: 120px mobile → 160px tablet → 180px desktop
- Pulse rings: scale proportionally with button size
- Result card: bottom sheet (mobile) → centered floating card (desktop)
- Library: full-width list mobile → 2-column desktop

## 9. Agent Prompt Guide

### Quick Color Reference
```
Deep Midnight:   #1A2A6C   — gradient dark end
Bright Blue:     #3668C0   — gradient light end
Cyan Teal:       #08F7E6   — Shazam accent, pulse, glow
Pure Black:      #000000   — nav bar, deepest layer
White:           #FFFFFF   — primary text
White Alpha:     rgba(255,255,255,0.75) — secondary text on dark
```

### Example Component Prompts
- "A Shazam recognition screen: full-screen dark blue radial gradient from `#3668C0` center to `#1A2A6C`, centered 120px circular button with cyan teal gradient, 3 expanding pulse rings rgba(8,247,230,0.35/0.20/0.10), 'Tap to Shazam' 17px white below"
- "A Shazam recognition result card: bottom sheet 24px top radius, dark glass rgba(0,0,0,0.5) blur(40px), album art 120px 16px radius left, track name 26px white bold, artist 18px white 75%, Apple Music play button right"
- "A Shazam My Shazams library row: dark navy rounded card 12px radius, 56px square album art 8px radius, track name 16px white 600, artist 14px white 75%, date shazamed right 12px white 50%"
- "A Shazam discovery card grid: 2-column, square aspect ratio, full album art background, dark gradient overlay bottom, white track + artist text bottom-left, 12px radius, shadow 0 8px 24px dark"
