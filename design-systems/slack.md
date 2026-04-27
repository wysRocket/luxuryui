---
name: Slack
colors:
  neutral: "#4A154B"
  tertiary: "#1264A3"
  primary: "#1D1C1D"
  secondary: "#616061"
typography:
  body-md:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22
  code:
    fontFamily: Slack Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20
rounded:
  sm: 2px
  md: 6px
  lg: 8px
---

## Overview

Slack's design language is defined by the tension between its bold aubergine brand identity and its deliberately neutral work surface. The sidebar — saturated, dark, and richly colored — signals "this is Slack," while the main message canvas is almost aggressively white and spacious, ensuring that the actual work content (code snippets, images, links, threads) receives zero visual competition. This bifurcated approach is intentional: branding lives in the chrome, work lives in the center.

The aubergine (`#4A154B`) is one of the most recognisable application colors in SaaS design. It reads as confident and premium without being corporate blue, setting Slack apart from every email client and project management tool. The sidebar may alternatively appear in light gray, dark navy, or deep teal depending on workspace theme customisation — this theme system is a core Slack UX feature that allows teams to claim identity while the product chrome provides structure.

Typography is Lato — a humanist sans-serif that balances warmth with technical legibility. Message text reads naturally at the density Slack requires (hundreds of messages per channel), while the bold weight of channel names and usernames creates fast visual scanning. Emoji reactions, file previews, and link unfurl cards are all embedded within this typographic system with clear size hierarchy.

**Key Characteristics:**
- Aubergine sidebar: `#4A154B` — identity color; nav sidebar background
- Brand purple: `#611F69` — hover state in sidebar; secondary purple
- White work surface: `#FFFFFF` — message canvas, absolutely clean
- Interactive blue: `#1264A3` — links, mentions, interactive elements
- Unread badge: `#E01E5A` — notification dot, mention badge
- Lato typeface throughout at 400/700 weights
- Message bubble border-radius: 4px (flat/functional, not bubbly)
- Emoji reactions: `border: 1px solid #D1D2D3`, 28px pill with count

## Colors

### Primary Brand
- **Aubergine** (`#4A154B`): Sidebar background (default), brand primary
- **Deep Purple** (`#611F69`): Sidebar item hover, secondary purple surface
- **Purple Active** (`#350D36`): Pressed states in sidebar, active channel bg

### Interactive (Work Surface)
- **Link Blue** (`#1264A3`): Text links, mentions, @-tags, external links
- **Blue Hover** (`#0B4C7A`): Hovered links
- **Blue Focus Ring** (`rgba(18,100,163,0.25)`): Input focus rings
- **Action Green** (`#2BAC76`): Online presence dot, positive status
- **Mention Yellow** (`#FFF8C5`): Background highlight for @-mentions

### Surface
- **Canvas White** (`#FFFFFF`): Message thread area, main content
- **Sidebar** (`#4A154B`): Default sidebar background
- **Input Background** (`#FFFFFF`): Message input, search
- **Hover Surface** (`#F8F8F8`): Message hover state background
- **Divider** (`#DDDDDD`): Horizontal rules, section dividers
- **Overlay** (`rgba(0,0,0,0.5)`): Modal backdrop

### Text (Work Surface)
- **Primary** (`#1D1C1D`): Message body text, channel names
- **Secondary** (`#616061`): Timestamps, metadata, muted labels
- **Sidebar Text** (`rgba(255,255,255,0.7)`): Inactive channel names on purple sidebar
- **Sidebar Active** (`#FFFFFF`): Selected/active channel name on sidebar
- **Unread** (`#FFFFFF`): Channel names with new messages on sidebar
- **Mention** (`#E01E5A`): @-mention text highlight, notification count

### Status
- **Online** (`#2BAC76`): Green presence dot
- **Away** (`#ECB22E`): Yellow presence, away/snooze
- **DND** (`#E01E5A`): Red DND indicator
- **Offline** (`transparent` with gray border): Offline presence

## Typography

### Font Families
- **Lato**: `'Lato', -apple-system, BlinkMacSystemFont, sans-serif` — All text throughout the application
- **Slack Mono / Menlo**: `'Menlo', 'Monaco', 'Courier New', monospace` — Inline code and code blocks

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Workspace Name | Lato | 18px | 900 | 24px | Sidebar header, workspace title |
| Channel Name (header) | Lato | 18px | 700 | 24px | Active channel name in top bar |
| Section Label | Lato | 12px | 700 | 16px | Sidebar section headers (CHANNELS, DMs) uppercase |
| Channel List Item | Lato | 15px | 400 | 22px | Inactive channel names in sidebar |
| Channel Unread | Lato | 15px | 700 | 22px | Unread channel names — bold |
| Message Body | Lato | 15px | 400 | 22px | Standard message text |
| Message Username | Lato | 15px | 700 | 22px | Sender name above message |
| Timestamp | Lato | 12px | 400 | 16px | Message timestamps, gray |
| Thread Reply Count | Lato | 13px | 700 | 18px | "X replies" thread link |
| Inline Code | Slack Mono | 14px | 400 | 20px | `backtick code`, 14px mono |
| Code Block | Slack Mono | 13px | 400 | 20px | Multi-line fenced code |
| Emoji Reaction | Lato | 13px | 400 | 18px | Reaction count beside emoji |
| Input Text | Lato | 15px | 400 | 22px | Message composer text |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px`
- Message vertical padding: `8px 20px`
- Sidebar item padding: `6px 16px`
- Section headers uppercase spacing: letter-spacing `0.08em`

### Fixed Layout Structure
- Sidebar: `220px` fixed left (channels/DM list)
- Main message area: fluid center
- Thread panel (if open): `400px` fixed right
- No horizontal scroll at desktop widths

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 2px | Inline elements |
| `--radius-sm` | 4px | Avatars, buttons, tags, code blocks |
| `--radius-md` | 6px | Nav items, popovers |
| `--radius-lg` | 8px | Message composer, modals |
| `--radius-full` | 9999px | Presence dots, reaction pills, badges |

## Elevation & Depth

- **Flat** (canvas): `#FFFFFF` — no shadow; messages are intentionally flat
- **Toolbar / Action Bar**: `box-shadow: 0 1px 4px rgba(0,0,0,0.15)` — message action menu
- **Popover / Emoji Picker**: `box-shadow: 0 4px 20px rgba(0,0,0,0.2)`, `border: 1px solid #DDDDDD`
- **Modal**: `box-shadow: 0 8px 32px rgba(0,0,0,0.25)`, backdrop `rgba(0,0,0,0.5)`
- **Notification Toast**: `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`, bg `#1D1C1D` text white
- **Sidebar**: flat, no shadow — contained by background color difference from canvas

## Components

### Buttons
**Primary Button**
- Background: `#007a5a` (Slack green — used in CTAs like "Create Workspace")
- Text: `#FFFFFF`, weight 700, 15px
- Border-radius: `4px`
- Padding: `10px 20px`
- Hover: `background: #006048`

**Secondary Button**
- Background: `#FFFFFF`
- Border: `1px solid #DDDDDD`
- Text: `#1D1C1D`, weight 700
- Border-radius: `4px`
- Hover: `background: #F8F8F8`

**Sidebar Nav Item**
- Default: `color: rgba(255,255,255,0.7)`, background transparent, padding `6px 12px 6px 16px`
- Hover: `background: rgba(255,255,255,0.1)`, `color: #FFFFFF`, `border-radius: 6px`
- Active/Selected: `background: rgba(255,255,255,0.2)`, `color: #FFFFFF`, `border-radius: 6px`
- Unread: `color: #FFFFFF`, weight 700

### Cards & Containers
**Message Container**
- Background: `#FFFFFF` (default), `#FFF8C5` (mention highlight)
- Padding: `8px 20px 8px 72px` (with avatar space on left)
- Hover: `background: #F8F8F8`, show action toolbar
- No border-radius; flat row layout

**Message Action Toolbar (hover)**
- Background: `#FFFFFF`
- Border: `1px solid #DDDDDD`
- Border-radius: `6px`
- Box-shadow: `0 1px 4px rgba(0,0,0,0.15)`
- Positioned absolutely top-right on message hover

**User Avatar**
- Size: 36px × 36px, `border-radius: 4px`
- Presence dot: 10px circle, bottom-right of avatar

**Emoji Reaction Pill**
- Background: `#F8F8F8`
- Border: `1px solid #D1D2D3`
- Border-radius: `24px`
- Padding: `3px 8px`
- Font: 13px Lato, text `#1D1C1D`
- Hover: `background: #E8F5FA`, `border-color: #1264A3`

**Link Unfurl Card**
- Border-left: `4px solid #DDDDDD`
- Padding: `8px 12px`
- Background: `#FFFFFF`
- Image preview: 400px max-width, `border-radius: 4px`

**Code Block**
- Background: `#F2F2F2`
- Border: `1px solid #DDDDDD`
- Border-radius: `4px`
- Padding: `8px 12px`
- Font: Slack Mono 13px
- Border-left: `4px solid #E8E8E8`

### Message Composer
- Border: `1px solid #DDDDDD`
- Border-radius: `8px`
- Background: `#FFFFFF`
- Focus: `border-color: rgba(29,28,29,0.5)`, `box-shadow: 0 0 0 3px rgba(18,100,163,0.15)`
- Toolbar icons: 20px, `#616061`, hover `#1D1C1D`

## Do's and Don'ts

### Do
- Keep the main message canvas pure white — every distraction away from messages is a UX failure
- Bold the username above each message at 700 weight — it anchors the identity in dense threads
- Show timestamps on hover only (full format), inline as relative time (e.g., "3:42 PM")
- Use `border-radius: 4px` on avatars — not circles (Slack uses rounded-square avatars)
- Uppercase sidebar section labels with tracking `0.08em` and weight 700 at 12px

### Don't
- Never use the aubergine sidebar color on the main canvas — they exist in separate zones
- Don't animate message appearance — messages must appear instantly; latency is already present
- Avoid making link colors anything other than `#1264A3` — users need immediate link recognition
- Don't add borders between individual messages — use whitespace for separation
- Avoid custom fonts in code blocks — mono must be consistent for code readability

## Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — sidebar hidden, bottom navigation tabs (Home/DMs/Activity), full-screen message view
- `sm`: 480px–768px — swipeable sidebar drawer, condensed channel list
- `md`: 768px–1024px — 200px sidebar visible, no thread panel
- `lg`: 1024px–1280px — 220px sidebar, thread panel available as overlay
- `xl`: 1280px+ — full three-panel layout (sidebar + messages + thread)

**Thread panel:** Opens as overlay at `<1280px`, inline panel at `≥1280px`

## Agent Prompt Guide

### Quick Color Reference
- Sidebar background: `#4A154B`
- Sidebar hover: `rgba(255,255,255,0.1)`
- Canvas white: `#FFFFFF`
- Link blue: `#1264A3`
- Primary text: `#1D1C1D`
- Secondary/timestamp: `#616061`

### Example Component Prompts
- "Slack-style channel sidebar: background #4A154B, workspace name in Lato 18px white weight 900 at top, section label 'CHANNELS' in Lato 12px rgba(255,255,255,0.7) uppercase weight 700 letter-spacing 0.08em, channel list items #channel-name in Lato 15px rgba(255,255,255,0.7), active channel item background rgba(255,255,255,0.2) text white rounded-6px"
- "Message row: white canvas, 36px rounded-4px avatar left, username in Lato 15px #1D1C1D weight 700 + timestamp in Lato 12px #616061 on same line, message body in Lato 15px #1D1C1D weight 400 below, emoji reactions as pills border 1px #D1D2D3 bg #F8F8F8 rounded-full"
- "Message composer: white background, border 1px #DDDDDD, border-radius 8px, Lato 15px placeholder text #616061, bottom toolbar with format/emoji/attachment icons in #616061 at 20px"
