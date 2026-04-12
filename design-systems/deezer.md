# Design System Inspired by Deezer

## 1. Visual Theme & Atmosphere

Deezer's design is an energetic, music-first experience defined by a bold magenta-to-violet gradient and deep dark surfaces. The primary accent, Deezer Pink (`#A238FF` to `#EF5466`), pulses with energy across playback controls, progress bars, and highlighted UI states. The dark base (`#1A1A2A`) creates a cinematic backdrop that makes album artwork and gradient accents visually pop — a strategy that puts music discovery at the center of the visual hierarchy.

The typography is bold and unapologetic. Large circular album artwork tiles dominate the grid with generous 12px border radii, while rounded sans-serif fonts keep the interface legible and modern. The card system uses subtle elevation — a faint glow or inner border — to lift content off the dark canvas without competing with album art. Animation is purposeful: the audio visualizer pulses, track transitions slide, and the heart icon bounces on favorite.

The overall feeling is "premium nightclub meets music magazine" — dark, energetic, and always centered on the music.

**Key Characteristics:**
- Deezer Pink gradient (`#A238FF` → `#EF5466`) as primary brand expression
- Deep dark base (`#1A1A2A`) with secondary surface (`#242436`)
- Circular and rounded album art cards (12px–50% border-radius)
- White (`#FFFFFF`) primary text, muted gray (`#B2B2C9`) secondary
- Accent green (`#1ED760` for play state) — Spotify-adjacency in playlist context
- Bold display font for artist names and section headers
- Progress bar and waveform tinted with hot pink gradient
- 8px base spacing grid with 16/24/32px rhythm

## 2. Color Palette & Roles

### Primary
- **Deezer Magenta** (`#EF5466`): CTA buttons, now-playing bar, highlight states
- **Deezer Violet** (`#A238FF`): Gradient terminus, premium badge, active nav
- **Gradient** (`linear-gradient(135deg, #A238FF, #EF5466)`): Brand expression across buttons, progress

### Interactive
- **Hover Pink** (`#FF6B7A`): Button hover lift on Magenta
- **Focus Violet** (`#B85EFF`): Focus ring on interactive elements
- **Active Play** (`#1ED760`): Play/pause active state, now-playing indicator

### Surface
- **Base Dark** (`#1A1A2A`): Page background, sidebar
- **Card Surface** (`#242436`): Card backgrounds, mini-player
- **Elevated Surface** (`#2E2E44`): Modals, dropdowns, hover card
- **Overlay** (`rgba(26,26,42,0.85)`): Backdrop blur overlays

## 3. Typography Rules

### Font Families
- **Primary UI**: `DeezerText` / `Circular` — navigation, body, labels
- **Display**: `Circular Black` / `DeezerDisplay` — hero artist names, playlist titles

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Artist Hero | DeezerDisplay | 72px | 900 | 1.00 | Album/artist page hero |
| Page Title | DeezerDisplay | 36px | 800 | 1.10 | Section headers |
| Card Title | Circular | 18px | 700 | 1.30 | Album/playlist title |
| Card Subtitle | Circular | 14px | 400 | 1.40 | Artist name under card |
| Track Title | Circular | 16px | 600 | 1.25 | Track list primary |
| Track Meta | Circular | 13px | 400 | 1.38 | Duration, plays |
| Nav Label | Circular | 12px | 600 | 1.00 | Sidebar nav items |
| Player Track | Circular | 14px | 700 | 1.20 | Mini-player track name |
| Player Artist | Circular | 12px | 400 | 1.20 | Mini-player artist |
| Caption | Circular | 11px | 400 | 1.45 | Timestamps, metadata |

## 4. Component Stylings

### Buttons

**Primary CTA (Gradient)**
- Background: `linear-gradient(135deg, #A238FF, #EF5466)`
- Border-radius: 50px (full pill)
- Padding: 12px 32px
- Font: Circular 15px/700
- Hover: brightness(1.1) + slight scale(1.02)

**Secondary Outlined**
- Border: `1px solid #EF5466`
- Background: transparent
- Color: `#EF5466`
- Radius: 50px

**Icon Button (Play)**
- Background: `#EF5466` or gradient
- Shape: 56px circle
- Icon: white, 24px

### Cards & Containers
- Album card: 12px border-radius, `#242436` background
- Hover: `box-shadow: 0 8px 32px rgba(162,56,255,0.25)`
- Grid: 4–6 columns desktop, 2–3 mobile
- Padding: 16px internal

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px, 80px

### Border Radius Scale
- Subtle (4px): Progress bars, sliders
- Small (8px): Tags, badges
- Medium (12px): Album cards
- Large (20px): Modals, feature cards
- Pill (50px): CTA buttons
- Circle (50%): Album art, avatar, play button

## 6. Depth & Elevation

- **Level 0**: Base `#1A1A2A` — no shadow
- **Level 1**: `box-shadow: 0 2px 8px rgba(0,0,0,0.4)` — cards
- **Level 2**: `box-shadow: 0 8px 32px rgba(162,56,255,0.25)` — hover, featured
- **Level 3**: `box-shadow: 0 16px 48px rgba(0,0,0,0.7)` — modals
- **Glow**: `box-shadow: 0 0 24px rgba(239,84,102,0.5)` — active player

## 7. Do's and Don'ts

### Do
- Use the gradient (`#A238FF` → `#EF5466`) for primary actions and brand moments
- Keep album artwork as the visual hero — don't compete with it
- Use circular/pill shapes for playback controls (56px circles)
- Apply dark surfaces consistently — never use white as a base
- Use spacing multiples of 8px throughout the layout

### Don't
- Don't use the pink gradient on secondary/tertiary actions — dilutes brand
- Don't use sharp corners on interactive elements — always ≥ 8px radius
- Don't overlay text directly on album art without a gradient scrim
- Don't use light/white backgrounds — Deezer is always dark-native

## 8. Responsive Behavior

Breakpoints: 320px, 640px, 768px, 1024px, 1280px, 1440px
- Mobile: 2-col grid, bottom mini-player bar, collapsed sidebar
- Tablet: 3-col grid, slide-out sidebar
- Desktop: 4–6 col grid, persistent left sidebar (240px), fixed bottom player (90px)

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand gradient: `linear-gradient(135deg, #A238FF, #EF5466)`
- Background: `#1A1A2A`
- Card surface: `#242436`
- Primary text: `#FFFFFF`
- Secondary text: `#B2B2C9`
- Active/play: `#1ED760`

### Example Component Prompts
- "Build a dark music card: #242436 background, 12px radius. Album art top. White 18px/700 title, #B2B2C9 14px artist. Hover: violet glow shadow rgba(162,56,255,0.25)."
- "Create gradient pill CTA: linear-gradient(135deg, #A238FF, #EF5466), 50px radius, white 15px/700 text. Hover: brightness(1.1)."
- "Design a now-playing bar: fixed bottom, #242436, gradient progress bar (#A238FF→#EF5466). Circular play button 56px #EF5466."
