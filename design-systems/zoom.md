# Design System Inspired by Zoom

## 1. Visual Theme & Atmosphere

Zoom's design system is purpose-built for reliability and focus. As the world's most widely-used video conferencing platform, its interface must disappear during meetings — enabling human connection without the software calling attention to itself. The palette centers on two distinct blues: the deep, authoritative `#0B5CFF` for primary brand and navigation elements, and the brighter, more accessible `#2D8CFF` for interactive states and in-meeting controls. Together they project the calm competence of enterprise technology made friendly.

The meeting interface is where Zoom's design philosophy is most visible: a grid of participant video tiles, each with a nameplate, audio/video status indicators, and reaction badges. The system must handle any number of participants — from 2 to 1000 — through a dynamic grid that reorganizes itself. Active speakers are elevated. The active speaker border animation (a gentle `#2D8CFF` pulsing outline) is one of Zoom's most recognized design signatures, communicating "this person is talking" without any audio cue, enabling accessibility in silent environments.

Outside of meetings, Zoom presents a clean SaaS dashboard: white surfaces, the Zoom Sans typeface, and a structured information hierarchy. Scheduled meetings appear as cards, contacts as list items, and the recording library as a media grid. The design system borrows conventions from enterprise productivity software — data tables, filter bars, breadcrumb navigation, settings panels — and gives them a friendly, consumer-adjacent veneer through the use of rounded corners, approachable illustrations, and the brand's characteristic blue.

**Key Characteristics:**
- Deep Blue (`#0B5CFF`) for nav, brand, primary CTAs
- Bright Blue (`#2D8CFF`) for in-meeting controls, hover states, active speaker ring
- White (`#FFFFFF`) and light grey (`#F4F4F4`) for all dashboard surfaces
- Zoom Sans typeface — custom humanist sans-serif
- Active speaker pulse ring: `2px solid #2D8CFF`, animated opacity 0.4→1→0.4
- Video tile: `8px` border-radius, dark background (`#1F1F1F`) with name overlay
- Meeting control bar: dark (`#282828`) pill or bar at bottom, frosted glass option
- 49-participant Speaker View / Gallery View toggling

## 2. Color Palette & Roles

### Primary
- **Deep Blue** (`#0B5CFF`): Navigation, primary brand, CTA buttons, selected states
- **Bright Blue** (`#2D8CFF`): Active speaker ring, in-meeting controls (active), hover
- **White** (`#FFFFFF`): Dashboard backgrounds, card surfaces, modals

### Interactive
- **Blue Hover** (`#1B6AFF`): Button hover state, slightly elevated from Deep Blue
- **Blue Pressed** (`#0048D4`): Button pressed state
- **In-meeting Active** (`#2D8CFF`): Currently speaking / active microphone indicator
- **Red Action** (`#E02020`): End call button, mute forced indicator

### Surface
- **Page Background** (`#F4F4F4`): Dashboard and settings backgrounds
- **Card White** (`#FFFFFF`): Meeting cards, contact panels, main content areas
- **Video Tile Dark** (`#1F1F1F`): Video participant tile background (when camera off)
- **Control Bar** (`#282828`): In-meeting bottom control bar
- **Hover Surface** (`rgba(0,92,255,0.06)`): Nav item hover background
- **Selected Surface** (`rgba(0,92,255,0.10)`): Active nav item background

### Text
- **Primary** (`#1F1F1F`): Main body text, meeting titles, contact names
- **Secondary** (`#747487`): Timestamps, metadata, helper text
- **Muted** (`#A0A0B0`): Placeholder text, disabled states
- **Inverse** (`#FFFFFF`): Text on blue/dark backgrounds
- **Nameplate** (`#FFFFFF`): Video tile participant name overlays

### Semantic
- **Green Active** (`#00B383`): Unmuted microphone indicator, video on
- **Red Muted** (`#E02020`): Muted mic, video off indicator, end call
- **Orange Warning** (`#FF8C00`): Poor connection, bandwidth warning
- **Yellow Reaction** (`#FFD700`): Raise hand, emoji reaction overlays

## 3. Typography Rules

### Font Families
- **Primary**: `"Zoom Sans", "Helvetica Neue", -apple-system, sans-serif` — all UI text
- **Meeting UI**: `"Zoom Sans", sans-serif` — nameplates, in-meeting overlays
- **Monospace**: `"Courier New", monospace` — meeting IDs, passcodes

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Page Title | Zoom Sans | 28px | 700 | 36px | Dashboard main headings |
| Section Header | Zoom Sans | 20px | 600 | 28px | "Upcoming Meetings", "Contacts" |
| Meeting Title | Zoom Sans | 18px | 600 | 26px | Card heading, meeting name |
| Body Text | Zoom Sans | 14px | 400 | 22px | Descriptions, settings text |
| Meeting ID | Zoom Sans | 16px | 400 | 22px | Monospace-style ID display |
| Button Label | Zoom Sans | 14px | 600 | 20px | CTA text |
| Nav Label | Zoom Sans | 14px | 500 | 20px | Sidebar navigation items |
| Nameplate | Zoom Sans | 13px | 500 | 18px | Video tile participant name |
| Control Label | Zoom Sans | 11px | 400 | 14px | Below in-meeting icon buttons |
| Timestamp | Zoom Sans | 13px | 400 | 18px | Meeting time, recording date |
| Badge Text | Zoom Sans | 11px | 700 | 14px | "Host", "Co-host", role labels |
| Metadata | Zoom Sans | 13px | 400 | 18px | Attendee count, duration |

## 4. Component Stylings

### Buttons

**Primary (New Meeting / Join)**
- Background: `#0B5CFF`
- Text: `#FFFFFF`, 14px Zoom Sans 600
- Padding: `10px 20px`
- Border radius: `8px`
- Hover: background `#1B6AFF`
- Active: background `#0048D4`

**Secondary**
- Background: `#FFFFFF`
- Border: `1px solid #C2C2D6`
- Text: `#1F1F1F`, 14px weight 600
- Same dimensions
- Hover: background `#F4F4F4`, border `#A0A0B0`

**End Call (destructive)**
- Background: `#E02020`
- Icon: phone-down, `#FFFFFF`, 20px
- Shape: `44px × 44px` circle
- Hover: background `#C01010`
- Animation: brief scale pulse on press

**In-meeting Control Button**
- Background: `rgba(255,255,255,0.15)` (default) / `rgba(255,255,255,0.25)` (hover)
- Icon: 22px, `#FFFFFF`
- Shape: `44px × 44px` circle or `48px` pill with label
- Active state (mic/camera on): background `rgba(45,140,255,0.30)`, icon `#2D8CFF`
- Muted state: icon `#E02020`, background `rgba(224,32,32,0.20)`

### Cards & Containers

**Meeting Card**
- Background: `#FFFFFF`
- Border: `1px solid rgba(0,0,0,0.08)`
- Border radius: `8px`
- Padding: `16px 20px`
- Shadow: `0 1px 4px rgba(0,0,0,0.08)`
- Hover: shadow `0 4px 12px rgba(0,0,0,0.12)`, border `rgba(11,92,255,0.20)`
- Left accent: `4px solid #0B5CFF` on left edge for upcoming meetings

**Video Tile (gallery view)**
- Background: `#1F1F1F` (camera off) or video stream
- Border radius: `8px`
- Active speaker: `2px solid #2D8CFF`, animated opacity pulse
- Nameplate: absolute bottom-left, `#FFFFFF` 13px 500, dark semi-transparent bg
- Muted icon: top-right, 20px, `#E02020` mic icon
- Aspect ratio: 16:9

**Meeting Control Bar**
- Background: `#282828`
- Height: `72px`
- Border radius: `0px` (full-width) or `100px` (floating pill variant)
- Padding: `0 24px`
- Controls: evenly spaced icon buttons with labels below

**Participant Panel**
- Background: `#FFFFFF`
- Width: `320px`, slides in from right
- Border-left: `1px solid rgba(0,0,0,0.10)`
- Participant row: 48px height, avatar + name + mute status

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`
- Card padding: `16px 20px`
- Dashboard sidebar: `240px` width
- Content area padding: `24px`
- Section vertical gap: `32px`

### Meeting Layout
- Gallery view: responsive grid of 16:9 video tiles; 4×4 max per page
- Speaker view: 1 large tile (70–80% width) + thumbnail strip (right or bottom)
- Control bar: sticky bottom, full-width or floating pill
- Panel sidebar (chat/participants): `320px`, slides over content

### Border Radius Scale
- `0px` — full-width control bar (when non-floating)
- `4px` — small badges, status indicators
- `8px` — cards, video tiles, buttons, panels
- `100px` — floating control bar pill, pill buttons
- `50%` — avatar circles, icon-only round buttons

## 6. Depth & Elevation

### Shadow Scale
- **Meeting Card Default** — `0 1px 4px rgba(0,0,0,0.08)`
- **Meeting Card Hover** — `0 4px 12px rgba(0,0,0,0.12)`
- **Floating Control Bar** — `0 8px 24px rgba(0,0,0,0.24)`
- **Participant Panel** — `none` (border only)
- **Modal** — `0 8px 32px rgba(0,0,0,0.20)`
- **Tooltip** — `0 2px 8px rgba(0,0,0,0.16)`

### Active Speaker Animation
```
@keyframes speakerPulse {
  0%, 100% { opacity: 0.40; }
  50%       { opacity: 1.00; }
}
border: 2px solid #2D8CFF;
animation: speakerPulse 1.5s ease-in-out infinite;
```

## 7. Do's and Don'ts

### Do
- Apply the active speaker pulse ring to exactly one tile at a time — clarity over animation
- Use `#E02020` red consistently for all muted/off states — semantic color matters in meetings
- Keep the control bar visible and accessible at all times during meetings
- Display meeting ID in large, copy-able format — users frequently need to share it
- Show participant count prominently in the meeting header for context

### Don't
- Don't use custom accent colors for individual user tiles — uniformity enables scanning
- Don't hide the end call button — it must always be visible and prominent
- Don't animate multiple elements simultaneously during a meeting — visual noise degrades focus
- Don't truncate participant names beyond 20 characters without a tooltip
- Don't remove the "Muted" indicator — it's a critical accessibility and etiquette signal

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — mobile: speaker view only, control icons without labels
- `768px` — tablet: 2×2 gallery, larger controls with labels
- `1024px` — desktop: 4×4 gallery, persistent sidebar panels, full controls
- `1440px` — wide: larger tile grid, picture-in-picture recording indicator

**Platform Adaptations:**
- Mobile: simplified 4-button control bar (mic/camera/chat/end)
- Tablet: 6-button bar with participants panel toggle
- Desktop: full control bar with all options, floating labels
- Web: browser-native full-screen API, overlay controls

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary Blue: `#0B5CFF`
- Active Blue: `#2D8CFF`
- Background: `#FFFFFF`
- Video Tile: `#1F1F1F`
- Control Bar: `#282828`
- Red (End/Mute): `#E02020`

### Example Component Prompts
- "Design a Zoom gallery view meeting screen: dark #1F1F1F video tiles in 4×4 grid with 8px radius, active speaker tile with pulsing #2D8CFF 2px border, white nameplates bottom-left of each tile, dark control bar at bottom with mic/camera/share/react/end-call buttons"
- "Create a Zoom meeting card for the dashboard: white card 8px radius, blue left accent border, meeting title in Zoom Sans 18px bold, date/time below, participant count, blue Join and grey Start buttons"
- "Build a Zoom in-meeting control bar: #282828 dark pill, icon buttons with labels below (Mute/Unmute, Stop Video, Share Screen, Chat, Participants, End), End Call in red circle"
- "Design a Zoom participant sidebar panel: white 320px panel, participant rows 48px with circular avatar, name, blue microphone active / red muted indicator, Invite button at top"
