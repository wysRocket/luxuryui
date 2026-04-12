# Design System Inspired by SoundCloud

## 1. Visual Theme & Atmosphere

SoundCloud's visual identity is defined by its signature orange — a warm, energetic `#FF5500` that has become synonymous with independent music, emerging artists, and direct creator-to-listener relationships. Against the deep near-black canvas (`#1A1A1A`), this orange reads as electric warmth: campfire energy on a dark stage. The design celebrates rawness and authenticity rather than the polished, curated aesthetics of Spotify; SoundCloud's creators upload bedroom recordings and street-recorded freestyles alongside professionally mixed tracks.

The waveform is SoundCloud's most distinctive design element — a rectangular visualization of audio amplitude that doubles as a scrub timeline. Orange fill left-of-playhead, gray unplayed region right — this binary waveform is instantly recognisable and has been copied by countless audio platforms. Track artwork fills square tiles at consistent sizes, and the visual density is high: hundreds of tracks, reposts, and comments are displayed in a social feed format that rewards scrolling.

Typography uses a custom SoundCloud typeface for logotype, while the interface is set primarily in a neutral system sans-serif (historically Helvetica, now system fonts on native). The font system is deliberately unobtrusive: music and waveforms are the product, not typography. Comment avatars on waveforms (positioned at the exact second of the comment) are a signature UX pattern — social annotation directly on the audio timeline.

**Key Characteristics:**
- Orange: `#FF5500` — the single most important brand color; waveform fill, CTAs
- Dark canvas: `#1A1A1A` — primary background
- Mid dark: `#232323` — cards, elevated surfaces
- Light dark: `#2A2A2A` — hover states, subtle elevation
- Waveform gray: `#4D4D4D` — unplayed portion of waveform
- Text: `#FFFFFF` primary; `#999999` secondary/metadata
- Border radius: minimal — 4px for cards, 2px for waveform, 50% for avatars
- Orange gradient: `linear-gradient(to right, #FF5500, #FF7A00)` on gradients

## 2. Color Palette & Roles

### Primary
- **SoundCloud Orange** (`#FF5500`): Waveform fill (played), primary CTA, follow button, active states
- **Orange Light** (`#FF7A00`): Gradient partner, hover warm-up
- **Orange Muted** (`#FF550033`): Background tint on track hover, selected state light fill

### Interactive
- **Orange Hover** (`#E64D00`): Pressed CTA button
- **White Interactive** (`rgba(255,255,255,0.85)`): Secondary button labels, ghost button text
- **Like Red** (`#F50`): Heart/like states (same orange family, full-saturation)

### Surface
- **Canvas** (`#1A1A1A`): Root page background
- **Card** (`#232323`): Track cards, player panels, sidebar
- **Hover** (`#2A2A2A`): Hovered rows and cards
- **Subtle** (`#313131`): Tertiary surfaces, dividers
- **Divider** (`rgba(255,255,255,0.1)`): Horizontal rules between tracks
- **Player Bar** (`#111111`): Sticky bottom player bar

### Text
- **Primary** (`#FFFFFF`): Track titles, artist names, main content
- **Secondary** (`#999999`): Metadata, play counts, timestamps
- **Tertiary** (`#666666`): Inactive labels, inactive tabs
- **Orange Accent** (`#FF5500`): Highlighted artist names, active state labels

### Waveform Specific
- **Played** (`#FF5500`): Left of playhead fill
- **Unplayed** (`#4D4D4D`): Right of playhead, default waveform
- **Comment Dot** (`#FF5500`): Comment marker on waveform timeline

## 3. Typography Rules

### Font Families
- **SoundCloud Sans (custom)**: `'SoundCloudSans', sans-serif` — Logotype only
- **System Sans**: `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif` — All UI text
- **Fallback Mono**: `'Courier New', monospace` — Edge case numeric displays

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Artist Name (hero) | System | 32px | 700 | 40px | Profile page artist name |
| Track Title (player) | System | 18px | 700 | 24px | Current playing track |
| Track Title (feed) | System | 16px | 700 | 22px | Feed/card track title |
| Artist Name (card) | System | 14px | 400 | 20px | Card artist attribution |
| Play Count | System | 13px | 400 | 18px | "1.2M plays" metadata |
| Tab Label | System | 14px | 700 | 20px | Tracks / Albums / Reposts |
| Bio Text | System | 14px | 400 | 22px | Artist bio body text |
| Comment Text | System | 13px | 400 | 18px | Waveform comment overlay |
| Time Display | System | 12px | 400 | 16px | Track duration, current time |
| Section Header | System | 12px | 700 | 16px | Section headings, uppercase |
| Button Label | System | 14px | 700 | 20px | Follow, Like, Repost buttons |

## 4. Component Stylings

### Buttons
**Follow Button**
- Default: `background: transparent`, `border: 1px solid #FF5500`, `color: #FF5500`
- Followed: `background: #FF5500`, `color: #FFFFFF`
- Hover (default): `background: rgba(255,85,0,0.1)`
- Border-radius: `4px`
- Padding: `6px 14px`, font-size 14px, weight 700

**Like / Repost Buttons (icon + count)**
- Default: icon `#999999`, count `#999999`
- Active: icon `#FF5500`, count `#FF5500`
- Hover: icon `rgba(255,85,0,0.8)`

**Play Button (waveform/card overlay)**
- Size: 48px circle
- Background: `rgba(255,85,0,0.9)` or pure `#FF5500`
- Icon: white triangle, centered
- Hover: `background: #E64D00`, scale `1.05`

### Cards & Containers
**Track Feed Card**
- Background: `#232323`
- Border-radius: `4px`
- Padding: `16px`
- Artwork: 80px × 80px square, left-aligned, `border-radius: 4px`
- Hover: `background: #2A2A2A`
- Layout: artwork left, track info right, waveform below info

**Waveform Player**
- Container: full-width, height `64px`
- Bars: 2px wide, 2px gap, height proportional to amplitude
- Played fill: `#FF5500`
- Unplayed fill: `#4D4D4D`
- Playhead cursor: 1px solid `#FFFFFF`
- Comment markers: 4px × 12px `#FF5500` vertical ticks at timestamp position

**Artist Profile Header**
- Background: artwork-extracted gradient or `#232323`
- Avatar: 120px circle, `border: 4px solid #1A1A1A`
- Overlay: `linear-gradient(transparent 40%, #1A1A1A 100%)`

**Sticky Bottom Player**
- Background: `#111111`
- Height: `60px`
- Border-top: `1px solid rgba(255,255,255,0.1)`
- Artwork: 48px square left, track info center, controls right
- Progress bar: 3px full-width, orange filled / gray unfilled

## 5. Layout Principles

### Spacing System
- Base unit: **8px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px`
- Card padding: `16px`
- Feed item gap: `0` (contiguous rows with dividers)
- Profile page horizontal padding: `24px`
- Max-width: `1180px`

### Grid
- Feed: single column, full-width track cards
- Tracks tab on profile: 3-column grid at `≥768px`
- Sidebar (web): `240px` fixed, primary content fluid

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 2px | Waveform bars |
| `--radius-sm` | 4px | Cards, buttons, artwork thumbnails |
| `--radius-md` | 8px | Dropdowns, popovers |
| `--radius-lg` | 12px | Modals |
| `--radius-full` | 9999px | Avatars, play dots |

## 6. Depth & Elevation

- **Base** (canvas): `#1A1A1A` — no shadow
- **Card**: `#232323` — elevated by color, no box-shadow by default
- **Card Hover**: `#2A2A2A` — color shift only, no shadow
- **Player Bar**: `#111111` + `border-top: 1px solid rgba(255,255,255,0.1)` — fixed bottom layer
- **Popover / Tooltip**: `#313131`, `box-shadow: 0 4px 16px rgba(0,0,0,0.5)`
- **Modal**: `#232323`, `box-shadow: 0 8px 32px rgba(0,0,0,0.7)`

## 7. Do's and Don'ts

### Do
- Use orange (`#FF5500`) for every waveform played-region — it's the core UX signal
- Show play count, like count, and comment count as metadata on every track card
- Display artwork as exact squares (1:1 ratio) — never crop to non-square or circle
- Use `border-radius: 4px` only — SoundCloud is deliberately rectilinear
- Place comment dots precisely on the waveform at their timestamp position

### Don't
- Never use a light or white canvas — dark is the product's DNA
- Don't round avatars with anything less than 50% — only artist profile photos are circle-cropped
- Avoid gradients on UI surfaces (cards, buttons) — gradients live only in waveform fills and hero images
- Don't truncate track titles at less than 2 lines — music titles are identity; they deserve space
- Avoid placing CTAs in orange unless they are the primary action — orange must remain a power signal

## 8. Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — single-column feed, track cards stack vertically, full-width waveform
- `sm`: 480px–768px — compact navigation, track grid 2-column
- `md`: 768px–1024px — sidebar 200px, feed full-width
- `lg`: 1024px–1180px — 240px sidebar, 3-column track grid
- `xl`: 1180px+ — max-width 1180px centered

**Player bar:** Always fixed at bottom, full-width, all breakpoints

## 9. Agent Prompt Guide

### Quick Color Reference
- Orange: `#FF5500`
- Canvas: `#1A1A1A`
- Card: `#232323`
- Waveform unplayed: `#4D4D4D`
- Primary text: `#FFFFFF`
- Secondary text: `#999999`

### Example Component Prompts
- "SoundCloud-style track card: dark background #232323, 80px square artwork left with 4px radius, track title in System 16px white weight 700 right of artwork, artist name in System 14px #999999, waveform below spanning full card width — orange #FF5500 played 40%, gray #4D4D4D unplayed 60%, 2px bars, play count + like count in #999999 13px below waveform"
- "SoundCloud waveform player: full-width 64px height, amplitude bars 2px wide 2px gap, played region fill #FF5500, unplayed fill #4D4D4D, 1px white playhead cursor, comment dot markers as 4px wide #FF5500 vertical ticks at specific positions"
- "Follow button: border 1px #FF5500, text #FF5500 Helvetica 14px weight 700, bg transparent, border-radius 4px, padding 6px 14px — followed state: bg #FF5500 text white"
