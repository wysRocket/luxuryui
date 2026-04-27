---
name: Threads
colors:
  neutral: "#000000"
  primary: "#FFFFFF"
  tertiary: "#0095F6"
typography:
  body-md:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22
  label:
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20
  h1:
    fontSize: 18px
    fontWeight: 700
    lineHeight: 24
rounded:
  sm: 8px
  md: 12px
  lg: 20px
---

## Overview

Threads — Meta's text-centric social platform, launched as an Instagram companion — is one of the most minimal consumer social apps ever shipped at scale. The design is almost aggressively simple: pure black or white backgrounds, system typefaces at comfortable reading sizes, and near-zero decorative elements. This restraint is a deliberate positioning choice: Threads is for text, ideas, and conversation — the anti-media, anti-algorithm antidote to visual-first social media.

The dual-mode design (light: white canvas; dark: pure black `#000000`) is implemented without any "dark gray" compromise. When in dark mode, Threads goes full black — which is uncommon for social apps (most use `#121212` or `#1C1C1E`) but serves two purposes: OLED battery efficiency and maximum contrast for white text. The system typeface (SF Pro on iOS, Roboto on Android, segoe UI on Windows) means the app has no distinctive typeface DNA — it inherits the OS voice, which paradoxically makes it feel more native and trustworthy than branded alternatives.

Thread stitching — the vertical line connecting a series of reply posts — is the app's most distinctive visual element. This thin vertical line (`1.5px`, gray) connects a parent post's avatar to the space where the first reply avatar will appear, creating a visual metaphor for conversation threads that gives the product its name. The line is thin, quiet, and purposeful — everything about Threads is.

**Key Characteristics:**
- Dark mode canvas: `#000000` (pure black — OLED optimised)
- Light mode canvas: `#FFFFFF` (pure white)
- Dark surface: `#101010` for cards/containers in dark mode
- Text: `#FFFFFF` (dark mode) / `#000000` (light mode)
- Secondary text: `rgba(255,255,255,0.6)` (dark) / `rgba(0,0,0,0.5)` (light)
- System typeface: SF Pro / Roboto — no custom font
- Thread line: `1.5px solid rgba(255,255,255,0.2)` (dark) / `rgba(0,0,0,0.15)` (light)
- Border radius: minimal — 12px for bottom sheets, 0 on post cards

## Colors

### Light Mode
- **Canvas** (`#FFFFFF`): Page background, all surfaces
- **Surface Alt** (`#F2F2F2`): Input backgrounds, secondary surfaces
- **Primary Text** (`#000000`): Post body, names, headings
- **Secondary Text** (`rgba(0,0,0,0.5)`): Timestamps, metadata, follower counts
- **Divider** (`rgba(0,0,0,0.1)`): Post separators, bottom nav borders
- **Thread Line** (`rgba(0,0,0,0.15)`): Vertical conversation connector
- **Black CTA** (`#000000`): Follow button, primary actions in light mode

### Dark Mode
- **Canvas** (`#000000`): Root background — pure black
- **Surface** (`#101010`): Slightly elevated surfaces (barely perceptible)
- **Surface Alt** (`#1A1A1A`): Input fields, secondary cards
- **Primary Text** (`#FFFFFF`): Post body, names, UI text
- **Secondary Text** (`rgba(255,255,255,0.5)`): Timestamps, metadata
- **Divider** (`rgba(255,255,255,0.1)`): Post separators
- **Thread Line** (`rgba(255,255,255,0.2)`): Vertical conversation connector
- **White CTA** (`#FFFFFF`): Follow button, primary button in dark mode

### Accent
- **Instagram Pink/Orange** (`#E1306C`): Minimal use — cross-app linking to Instagram
- **Link Blue** (`#0095F6`): Instagram's blue, used for hyperlinks in post body
- **Like Red** (`#FF3040`): Heart icon when liked (same red as Instagram)

## Typography

### Font Families
- **SF Pro Display**: `'SF Pro Display', -apple-system, sans-serif` — iOS headings, display text
- **SF Pro Text**: `'SF Pro Text', -apple-system, sans-serif` — iOS body text, UI labels
- **Roboto**: `'Roboto', sans-serif` — Android equivalent
- **Segoe UI**: `'Segoe UI', sans-serif` — Windows/web equivalent
- **System stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Post Body | System | 15px | 400 | 22px | Primary thread content |
| Username | System | 15px | 700 | 22px | Display name, bold |
| Handle | System | 14px | 400 | 20px | @username, secondary |
| Timestamp | System | 13px | 400 | 18px | "2h", "Jun 12" |
| Reply Count | System | 13px | 400 | 18px | "142 replies" |
| Follow Button | System | 14px | 700 | 20px | "Follow" label |
| Nav Label | System | 10px | 500 | 14px | Bottom navigation text |
| Section Heading | System | 18px | 700 | 24px | "Following", "For you" |
| Profile Name | System | 20px | 700 | 26px | Profile page display name |
| Profile Bio | System | 15px | 400 | 22px | User biography text |
| Link in Post | System | 15px | 400 | 22px | URL, colored `#0095F6` |
| Quoted Thread | System | 14px | 400 | 20px | Quoted/embedded thread text |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px`
- Post horizontal padding: `12px`
- Avatar to content gap: `12px`
- Post vertical padding: `12px 0`
- Between post gap: `0` (flush, separated by thread line / whitespace)
- Bottom navigation height: `83px` (iOS safe area included)

### Core Layout
- Avatar column: 48px wide (fixed)
- Content column: `flex: 1` fluid right of avatar
- Max-width: `600px` for web Threads

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Post cards, page surfaces |
| `--radius-sm` | 8px | Action sheets inner items |
| `--radius-md` | 10px | Follow button |
| `--radius-lg` | 12px | Quoted thread, media |
| `--radius-xl` | 20px | Bottom sheet top corners |
| `--radius-full` | 9999px | Avatars |

## Elevation & Depth

Threads uses near-zero elevation — the black canvas provides all the context needed:

- **Base** (post canvas): `#000000` — no shadow, no depth
- **Bottom Sheet**: `box-shadow: 0 -4px 30px rgba(0,0,0,0.5)` on dark, lighter on light
- **Modal**: `box-shadow: 0 8px 40px rgba(0,0,0,0.6)`
- **Tooltip**: flat, `background: #1A1A1A` (dark) text white
- **Quote thread**: color/border only, no shadow

## Components

### Buttons
**Follow Button (unfollowed)**
- Background: `#FFFFFF` (dark mode) / `#000000` (light mode)
- Text: `#000000` (dark mode) / `#FFFFFF` (light mode), weight 700, 14px
- Border: `1px solid rgba(255,255,255,0.2)` (dark) / `1px solid rgba(0,0,0,0.2)` (light)
- Border-radius: `10px`
- Padding: `7px 16px`
- Height: `34px`

**Following Button (followed state)**
- Background: transparent
- Border: `1px solid rgba(255,255,255,0.2)` (dark) / `1px solid rgba(0,0,0,0.2)` (light)
- Text: secondary color, weight 600, 14px
- Border-radius: `10px`

**Like / Reply / Rethread / Share (icon buttons)**
- Icon: 24px
- Default: `rgba(255,255,255,0.6)` (dark) / `rgba(0,0,0,0.5)` (light)
- Like active: `#FF3040` filled heart
- Tap: subtle scale `0.9` then `1.0` spring bounce
- No background, no border

### Cards & Containers
**Thread Post**
- Background: `#000000` (dark) / `#FFFFFF` (light) — no card surface
- No border, no border-radius — posts are flush with canvas
- Border-bottom: `none` — separator only via whitespace gap or hairline
- Layout: avatar left (48px circle) + content right column

**Thread Line (conversation connector)**
- Left of avatar column, vertically centered below avatar
- Width: `1.5px`
- Color: `rgba(255,255,255,0.2)` (dark) / `rgba(0,0,0,0.15)` (light)
- Extends from bottom of parent avatar circle to top of reply avatar
- Terminals: small circle avatar "stack" of 2–3 replier avatars at bottom of parent post

**Reply Preview (mini avatars at thread bottom)**
- 3 stacked 16px avatar circles
- Positioned left under thread line terminus
- Overlap: -4px between each avatar
- Shown on parent post to indicate "has replies"

**Quote Thread (embedded post)**
- Border: `1px solid rgba(255,255,255,0.15)` (dark) / `1px solid rgba(0,0,0,0.1)` (light)
- Border-radius: `12px`
- Padding: `12px`
- Background: `rgba(255,255,255,0.04)` (dark) / `rgba(0,0,0,0.03)` (light)
- Font: 14px, secondary color — clearly subordinate

**Image/Media in Post**
- Border-radius: `12px`
- Max-height: `500px`, object-fit cover
- Full-width within content column (not full-bleed)
- Tap → fullscreen lightbox

**Bottom Sheet**
- Background: `#1A1A1A` (dark) / `#FFFFFF` (light)
- Border-radius: `20px 20px 0 0`
- Top handle: 4px × 36px, `rgba(255,255,255,0.3)` (dark) / `rgba(0,0,0,0.2)` (light)
- Padding: `20px 16px`

## Do's and Don'ts

### Do
- Use pure `#000000` for dark mode — not `#121212` or `#1C1C1E`; Threads goes all-black
- Draw the thread connector line at exactly `1.5px` — thin, quiet, purposeful
- Show 2–3 mini reply avatars stacked at the bottom of the parent post thread line
- Keep post font at exactly 15px / 22px line-height — comfortable density for reading
- Apply `border-radius: 10px` to follow buttons — the one slightly rounded element in the UI

### Don't
- Never add a card background or border to individual posts — posts are always canvas-flush
- Don't use any accent color beyond `#FF3040` (like heart) — no orange, no purple, no teal
- Avoid heavy animations — Threads interactions should be near-instant with only micro-bounces
- Don't put more than 5 items in the bottom navigation — Threads has 5 exact
- Avoid introducing any custom typeface — system font only, always

## Responsive Behavior

**Breakpoints (mobile-first native app):**
- `xs`: 320px — compact, all elements minimum viable
- `sm`: 375px–414px — standard iPhone, optimal layout
- `md`: 414px+ — slightly larger font scales, more post visible above fold
- `lg`: 768px+ (web) — single column centered max-width 600px with margins

**Web (threads.net):** Single-column centered at 600px max-width; sidebar navigation at `≥1024px`

**Gestures:** Swipe-right to go back; pull-to-refresh; long-press post for share sheet

## Agent Prompt Guide

### Quick Color Reference
- Dark canvas: `#000000`
- Light canvas: `#FFFFFF`
- Dark surface: `#1A1A1A`
- Primary text (dark): `#FFFFFF`
- Secondary text (dark): `rgba(255,255,255,0.5)`
- Thread line: `rgba(255,255,255,0.2)`

### Example Component Prompts
- "Threads-style post on dark mode pure black #000000 canvas: 48px circle avatar left, content column right — username in System 15px white weight 700, timestamp in rgba(255,255,255,0.5) 13px same line, post body in System 15px white weight 400 line-height 22px below, action bar with heart/reply/rethread/share icons at rgba(255,255,255,0.6) 24px below post; vertical thread line 1.5px rgba(255,255,255,0.2) connecting to reply below"
- "Threads follow button: border 1px rgba(255,255,255,0.2), bg transparent on followed / bg white on unfollowed, text System 14px weight 700 black/white, border-radius 10px, height 34px padding 7px 16px"
- "Thread connector with reply preview: 1.5px vertical line rgba(255,255,255,0.2) below parent avatar, bottom terminus showing 3 stacked 16px reply avatars with -4px overlap, parent post showing '42 replies' in System 13px rgba(255,255,255,0.5)"
