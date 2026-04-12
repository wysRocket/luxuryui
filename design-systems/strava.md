# Design System Inspired by Strava

## 1. Visual Theme & Atmosphere

Strava's design language is built for athletes: energetic, data-rich, and achievement-oriented. The signature orange (`#FC4C02`) reads as effort, heat, and speed — it's the color of race bibs, safety vests, and finish line tape. Against a white canvas for the activity feed and dark segments for map-heavy views, this orange creates a dual personality: clean social network during browsing, intense athletic tool during activity tracking.

Route maps are Strava's most distinctive visual element — GPS traces in orange on dark cartographic backgrounds (`#252528` map tiles) create a dynamic, personal visual record of athletic achievements. Segment leaderboard tables are dense with competitive data: current rank, KOM/QOM times, athlete names and avatars. The social feed blends activity summaries (distance, pace, elevation) with social interactions (kudos, comments) in a format recognisable to any Facebook or Instagram user who has also run a 10K.

Typography is set in Roboto throughout — a clean, metric-friendly sans-serif that handles everything from 11px split times to 48px personal records without losing legibility. Strava's data visualizations (elevation profiles, pace charts, heart rate graphs) use muted chart backgrounds that ensure the orange data line dominates. The overall system is functional-athletic: no-nonsense, performance-affirming, built for people who track every kilometer.

**Key Characteristics:**
- Orange: `#FC4C02` — primary brand, CTAs, active states, segment records
- Dark map: `#252528` — map canvas background for route visualization
- White canvas: `#FFFFFF` — activity feed, social surfaces
- Light gray: `#F7F7FA` — page background, card alt surfaces
- Roboto typeface throughout — metric-optimized
- Kudos orange heart: 24px, `#FC4C02`, fill on clicked
- Segment crown: KOM/QOM gold `#FFB800` icon
- Border radius: 8px for cards, 4px for buttons, 2px for tags

## 2. Color Palette & Roles

### Primary
- **Strava Orange** (`#FC4C02`): Brand identity, primary CTAs, active states, segment lines on map
- **Orange Dark** (`#D94002`): Button hover, pressed state
- **Orange Light** (`#FFF0EB`): Light tint for highlighted achievement backgrounds

### Performance Data Colors
- **Orange** (`#FC4C02`): Default data line — pace, speed, power
- **Red** (`#E8002D`): Heart rate high zones, maximum effort
- **Green** (`#2CAD38`): Personal records, achievements, KOM/QOM current holder
- **Gold** (`#FFB800`): KOM/QOM segment crown, achievement badges
- **Blue** (`#2B7EFF`): Cadence, secondary chart lines
- **Purple** (`#9B59B6`): Power zones (cycling), VO2 data

### Surface
- **White** (`#FFFFFF`): Activity feed cards, main canvas
- **Page Gray** (`#F7F7FA`): Page background behind cards
- **Card Border** (`#E8E8E8`): Card borders, dividers
- **Map Dark** (`#252528`): Map tile base for route visualization
- **Overlay Dark** (`rgba(0,0,0,0.5)`): Map control overlays

### Text
- **Primary** (`#242428`): Activity titles, names, main content
- **Secondary** (`#6D6D78`): Metadata, timestamps, stats labels
- **Tertiary** (`#9E9EA8`): Captions, supplementary info
- **Orange Active** (`#FC4C02`): Active nav, highlighted stats

### Status
- **Achievement Green** (`#2CAD38`): PRs, personal records
- **KOM Gold** (`#FFB800`): King/Queen of the Mountain
- **Alert** (`#E8002D`): High HR, safety alerts

## 3. Typography Rules

### Font Families
- **Roboto**: `'Roboto', -apple-system, BlinkMacSystemFont, sans-serif` — All UI text, labels, stats
- **Roboto Condensed**: `'Roboto Condensed', sans-serif` — Data displays, stat numbers, leaderboard
- **Roboto Mono**: `'Roboto Mono', monospace` — Split times, precise pace values

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Activity Title | Roboto | 20px | 700 | 28px | Feed card heading |
| Stat Number (large) | Roboto Condensed | 36px | 700 | 44px | Distance, time on summary |
| Stat Label | Roboto | 12px | 500 | 16px | "Distance", "Pace", "Elevation" — uppercase |
| Pace Display | Roboto Mono | 24px | 700 | 32px | "/mi or /km pace, split times |
| Athlete Name | Roboto | 15px | 700 | 22px | Feed card athlete name |
| Segment Name | Roboto | 16px | 700 | 22px | Segment leaderboard name |
| Leaderboard Rank | Roboto Condensed | 18px | 700 | 24px | "#1", "#2" rank column |
| Nav Label | Roboto | 12px | 500 | 16px | Bottom nav labels |
| Kudos Count | Roboto | 14px | 500 | 20px | "142 kudos" |
| Map Tooltip | Roboto | 13px | 500 | 18px | GPS coordinate tooltip |
| Achievement | Roboto Condensed | 28px | 700 | 36px | "PR!" personal record display |
| Body | Roboto | 15px | 400 | 22px | Activity description body text |

## 4. Component Stylings

### Buttons
**Primary Button (Follow / Subscribe)**
- Background: `#FC4C02`
- Text: `#FFFFFF`, Roboto weight 700, 15px
- Border-radius: `4px`
- Padding: `10px 20px`
- Hover: `background: #D94002`
- Active: `background: #B83500`
- Box-shadow: none

**Secondary / Outline Button**
- Background: `#FFFFFF`
- Border: `1px solid #FC4C02`
- Text: `#FC4C02`, weight 700, 15px
- Border-radius: `4px`
- Hover: `background: #FFF0EB`

**Kudos Button**
- Icon: heart outline `#9E9EA8`, 24px
- Kudoed state: heart filled `#FC4C02`, with brief scale pulse animation
- Count: Roboto 14px `#6D6D78` beside icon
- Hover: heart `rgba(252,76,2,0.2)` bg circle 40px diameter

### Cards & Containers
**Activity Feed Card**
- Background: `#FFFFFF`
- Border: `1px solid #E8E8E8`
- Border-radius: `8px`
- Padding: `16px`
- Map thumbnail: 100% width, height 200px, `border-radius: 4px`, dark map tiles
- Orange route trace on map: stroke `#FC4C02` 3px
- Stat row: 3–4 columns with Roboto Condensed stat numbers

**Stat Tile**
- No border; part of card content
- Label: Roboto 12px `#6D6D78` uppercase weight 500
- Value: Roboto Condensed 28px `#242428` weight 700
- Unit: Roboto 14px `#6D6D78` (e.g., "km", "/km")

**Segment Leaderboard Row**
- Rank: Roboto Condensed 18px weight 700, gold for #1
- Crown icon: 16px gold `#FFB800` beside rank 1
- Athlete avatar: 32px circle
- Name + pace: Roboto 14px
- Hover: `background: #F7F7FA`

**Elevation Profile Chart**
- Background: `#F7F7FA`
- Area fill: `rgba(252,76,2,0.1)`
- Line: `#FC4C02` 2px stroke
- Grid: `#E8E8E8` 1px horizontal
- Axis labels: Roboto Mono 11px `#9E9EA8`

## 5. Layout Principles

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px`
- Card padding: `16px`
- Stat grid gap: `16px`
- Feed vertical gap between cards: `12px`
- Page padding: `16px` (mobile), `32px` (desktop)

### Grid
- Activity feed: single column, max-width `700px` centered
- Dashboard: 2-column at `≥768px` (feed + leaderboard sidebar)
- Map fullscreen at mobile; split at `≥1024px`

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 2px | Tags, achievement badges |
| `--radius-sm` | 4px | Buttons, map thumbnails |
| `--radius-md` | 8px | Cards |
| `--radius-lg` | 12px | Modals, bottom sheets |
| `--radius-full` | 9999px | Avatars, kudos button hover ring |

## 6. Depth & Elevation

- **Page** (background): `#F7F7FA` — no shadow
- **Feed Card**: `border: 1px solid #E8E8E8`, `border-radius: 8px` — low elevation via border
- **Map Controls**: `box-shadow: 0 2px 8px rgba(0,0,0,0.2)` — buttons over map
- **Segment Popup** (map tap): `box-shadow: 0 4px 16px rgba(0,0,0,0.15)`, bg `#FFFFFF`
- **Bottom Sheet**: `box-shadow: 0 -4px 20px rgba(0,0,0,0.1)`, bg `#FFFFFF`
- **Modal**: `box-shadow: 0 8px 32px rgba(0,0,0,0.2)`, backdrop 50%

## 7. Do's and Don'ts

### Do
- Show GPS route trace in `#FC4C02` orange on the dark map — it's the emotional heart of the activity card
- Display 3–4 key stats (distance, moving time, elevation, pace) in Roboto Condensed bold below map
- Use the kudos heart at `#FC4C02` filled on active — give it a brief pulse animation on click
- Show KOM/QOM with gold crown icon `#FFB800` — achievement recognition is core to Strava's psychology
- Mark personal records in green `#2CAD38` — PRs are the most important milestone for any activity

### Don't
- Never use orange for secondary or decorative purposes — `#FC4C02` signals performance achievement
- Don't use dark backgrounds for the activity feed — white social canvas is essential for UX legibility
- Avoid putting pace in non-monospace font — split time alignment requires tabular numerals
- Don't show the map without the orange route trace — a gray map with no trace is meaningless
- Avoid loading elevation charts lazily on mobile — it's a primary data element

## 8. Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — single-column feed, compact stat row (2 stats), map 180px height
- `sm`: 480px–768px — 4-stat grid on activity card
- `md`: 768px–1024px — segment sidebar visible, map 200px
- `lg`: 1024px+  — split layout: feed left (700px), segment leaderboard sidebar right

**Map view:** Full-screen on mobile; 60/40 split with analysis panel on desktop

**Bottom nav:** 5 tabs: Feed, Explore, Record (large orange circle), Groups, Profile

## 9. Agent Prompt Guide

### Quick Color Reference
- Strava orange: `#FC4C02`
- Dark map: `#252528`
- White canvas: `#FFFFFF`
- Page background: `#F7F7FA`
- Primary text: `#242428`
- Metadata/labels: `#6D6D78`

### Example Component Prompts
- "Strava activity feed card: white bg #FFFFFF, border 1px #E8E8E8, 8px radius, full-width map thumbnail 200px height with dark #252528 map tiles and orange #FC4C02 route trace SVG 3px stroke, athlete avatar 40px circle + name Roboto 15px #242428 weight 700 + timestamp #9E9EA8 below, activity title Roboto 20px #242428 weight 700, stat row with 4 stats: value Roboto Condensed 28px #242428 + label Roboto 12px #6D6D78 uppercase"
- "Elevation profile chart: bg #F7F7FA, area fill rgba(252,76,2,0.1), orange #FC4C02 line 2px, grid lines #E8E8E8 horizontal, axis labels Roboto Mono 11px #9E9EA8, interactive hover showing tooltip bg #242428 white text"
- "Segment leaderboard row: rank column Roboto Condensed 18px weight 700, #1 rank with gold #FFB800 crown icon, 32px athlete avatar circle, athlete name Roboto 14px #242428, pace Roboto Mono 14px, hover bg #F7F7FA"
