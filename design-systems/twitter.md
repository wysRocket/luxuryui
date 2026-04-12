# Design System Inspired by Twitter (X)

## 1. Visual Theme & Atmosphere

Twitter's (now X) design language is defined by radical typographic clarity and chromatic restraint. The interface operates on a strict binary of pure black (`#000000`) and pure white (`#FFFFFF`), with a single action color — Twitter Blue (`#1D9BF0`) — that handles all interactive states, links, and brand moments. This three-color discipline gives Twitter an almost newspaper-like quality: information-dense, undecorated, and focused entirely on the text content being communicated.

The Chirp typeface is a critical brand asset — custom-designed for Twitter, it's a geometric sans-serif with distinctive letterforms (notably the lowercase 'a' and 'g') that is instantly recognizable. Chirp renders at many sizes across the interface, from the micro-text of timestamps to large display numerals in the engagement count columns. Its personality sits between functional clarity and personality — it doesn't feel like a system font, but it doesn't distract from the content either. The typeface does the heavy lifting that color refuses to.

The tweet thread UI is the design's most distinctive contribution: sequential posts are connected by a thin vertical line, creating a visual narrative that links replies and conversations into cohesive threads. This single design element — a 2px line — transformed how millions of people understand conversation structure on the internet. The timeline itself is a relentless stream: equal-width cards with no ranked visual hierarchy, each post deserving the same spatial treatment whether it has 3 likes or 3 million.

**Key Characteristics:**
- Pure black (`#000000`) or pure white (`#FFFFFF`) backgrounds only
- Single action color: Twitter Blue (`#1D9BF0`)
- Chirp custom typeface for all UI text
- 2px vertical thread connector line between replies
- Tweets have no card border — separated by `1px rgba` dividers only
- Like (heart) animates to pink, retweet to green on interaction
- Media attachments: 2×1, 2×2, or 4-photo grid within tweet
- Minimal chrome — max content, minimal navigation

## 2. Color Palette & Roles

### Primary
- **Twitter Blue** (`#1D9BF0`): Links, CTAs, follow button, active tab, mention text
- **Black** (`#000000`): Dark theme background
- **White** (`#FFFFFF`): Light theme background

### Interactive
- **Blue Hover Background** (`rgba(29,155,240,0.10)`): Icon button hover in dark theme
- **Blue Pressed** (`#1A8CD8`): Button active/pressed state
- **Follow Button Fill** (`#0F1419`): "Following" state button (reverse on dark)

### Surface
- **Tweet Divider** (`rgba(255,255,255,0.12)`): Dark mode divider between tweets
- **Tweet Divider Light** (`rgba(0,0,0,0.06)`): Light mode tweet divider
- **Sidebar Background** (`#000000`): Dark mode sidebar, transparent on light
- **Input Background** (`transparent`): Tweet compose field — no background
- **Modal Overlay** (`rgba(0,0,0,0.50)`): Behind modals and menus

### Text
- **Primary Dark** (`#0F1419`): Main text on light theme
- **Primary Light** (`#E7E9EA`): Main text on dark theme
- **Secondary Dark** (`#536471`): Timestamps, follower counts, metadata (light)
- **Secondary Light** (`#71767B`): Timestamps, metadata (dark)
- **Mention** (`#1D9BF0`): @mentions and #hashtags

### Engagement Colors
- **Like Pink** (`#F91880`): Heart icon active/liked state
- **Retweet Green** (`#00BA7C`): Retweet active state
- **Bookmark Blue** (`#1D9BF0`): Bookmarked state
- **Share** (`#1D9BF0`): Share icon, same as primary blue

## 3. Typography Rules

### Font Families
- **Primary**: `"Chirp", -apple-system, "Helvetica Neue", sans-serif` — all UI text
- **Extended Text (fallback)**: `"Helvetica Neue", Arial, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Tweet Body | Chirp | 15px | 400 | 20px | Core content unit |
| Tweet Body (large single) | Chirp | 20px | 400 | 28px | Single-image tweet expansion |
| Display Name | Chirp | 15px | 700 | 20px | Bold account name |
| Username Handle | Chirp | 15px | 400 | 20px | `@username` in secondary color |
| Timestamp | Chirp | 15px | 400 | 20px | Same size, secondary color |
| Engagement Count | Chirp | 13px | 400 | 16px | Like count, retweet count |
| Nav Label | Chirp | 20px | 400 | 24px | Desktop sidebar navigation |
| Section Header | Chirp | 20px | 900 | 24px | "What's happening", trending |
| Profile Stats | Chirp | 15px | 700 | 20px | Following/followers bold number |
| Profile Stats Label | Chirp | 15px | 400 | 20px | " Following" label, secondary |
| Trending Topic | Chirp | 15px | 700 | 20px | Hashtag trending |
| Quote Tweet Label | Chirp | 13px | 400 | 18px | Quote tweet inner content |

## 4. Component Stylings

### Buttons

**Primary (Follow)**
- Background: `#0F1419` (dark on light) / `#FFFFFF` (light on dark)
- Text: inverse of background, 15px Chirp 700
- Padding: `8px 20px`
- Border radius: `100px` (pill)
- Hover: slight opacity reduction (0.85)

**Ghost (Following state)**
- Background: `transparent`
- Border: `1px solid rgba(255,255,255,0.20)` dark / `1px solid rgba(0,0,0,0.20)` light
- Text: context color, 15px Chirp 700
- Hover: red tint — border `#F4212E`, text `#F4212E`, bg `rgba(244,33,46,0.10)` (unfollow affordance)

**Tweet Button**
- Background: `#1D9BF0`
- Text: `#FFFFFF`, 15px Chirp 700
- Padding: `12px 24px` or `16px` (circle on small)
- Border radius: `100px`
- Hover: background `#1A8CD8`

**Icon Button (engagement actions)**
- Size: 34px tap target
- Icon: 18px
- Background: `transparent`
- Hover: circular hover ring `rgba(29,155,240,0.10)` — 34px circle
- Different tints per action: blue for reply/share, pink for like hover, green for retweet hover

### Cards & Containers

**Tweet Row**
- Background: `transparent`
- Padding: `12px 16px`
- Border-bottom: `1px solid rgba(255,255,255,0.12)` (dark) / `rgba(0,0,0,0.06)` (light)
- No border-radius — full-width list items
- Hover: background `rgba(255,255,255,0.03)` (dark) / `rgba(0,0,0,0.03)` (light)

**Thread Connector**
- Width: `2px`
- Color: `#333639` (dark) / `#CFD9DE` (light)
- Positioned left of avatar, connecting sequential tweets

**Profile Header**
- Banner image: 16:5 aspect ratio, full width
- Avatar: 48px (mobile) / 64px (desktop), circular, `4px solid` border matching background color
- Bio area: `16px` padding, text at 15px weight 400

**Dropdown Menu**
- Background: `#000000` (dark) / `#FFFFFF` (light)
- Border radius: `16px`
- Box shadow: `0 0 24px rgba(255,255,255,0.20)` dark / `0 0 24px rgba(0,0,0,0.16)` light
- Item padding: `16px`
- Item hover: background tint

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32px`
- Tweet horizontal padding: `16px`
- Tweet vertical padding: `12px`
- Avatar: 48px, with `12px` gap to content
- Desktop layout: 600px center column, 280px right sidebar, left nav min 60px

### Grid System
- Mobile: single-column full-width timeline
- Desktop: 3-column layout — sidebar | timeline | trending
- Timeline max-width: `600px`, centered
- No card grid — content is a flat sequential list

### Border Radius Scale
- `0px` — tweet rows (full-width list)
- `4px` — image attachments within tweets (2px on corners touching edge)
- `12px` — quote tweet inner border
- `16px` — dropdown menus, modals
- `100px` — all buttons (pill)
- `50%` — avatars

## 6. Depth & Elevation

### Shadow Scale
- **No decorative shadows** — Twitter uses zero box-shadow on content
- **Dropdown** — `0 0 24px rgba(255,255,255,0.20)` (dark) / `0 0 24px rgba(0,0,0,0.16)` (light)
- **Modal** — `0 8px 40px rgba(0,0,0,0.40)`
- **Sticky Header** — `rgba(0,0,0,0.60)` backdrop-filter blur, no shadow

### Overlay Treatments
- Modal backdrop: `rgba(91,112,131,0.40)` — Twitter's signature tinted overlay, not pure black
- Bottom sheet: slides up from 100vh, no shadow (dark bg suffices)

## 7. Do's and Don'ts

### Do
- Use Chirp at every text size — font consistency is a core brand signal
- Maintain the 2px thread line between reply tweets — it's Twitter's signature thread UX
- Use circular `rgba` hover rings on icon buttons — no rectangular hover states
- Apply blue only to interactive elements — never as decorative color
- Show both display name (bold) and @handle (secondary) side by side on every tweet

### Don't
- Don't add card borders or box-shadows to tweet rows — they're separated by dividers only
- Don't use any color other than pink/green for engagement animations — they're semantic
- Don't break the timeline's uniform column width — tweet hierarchy is temporal, not visual
- Don't use gradients — Twitter's design is resolutely flat and chromatic

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — mobile: bottom tab nav, full-width timeline
- `768px` — tablet: persistent left nav icons (no labels), wider timeline
- `1024px` — desktop: full 3-column layout with sidebar labels
- `1280px` — wide: right panel expands to show more trending

**Platform Adaptations:**
- Mobile: bottom 5-tab navigation (home, search, notification, messages, profile)
- Desktop: left sidebar navigation with icon + label, Tweet button
- Compose: inline in timeline on desktop, full-screen modal on mobile
- Notifications: unified tab on mobile, right sidebar widget on desktop

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand Blue: `#1D9BF0`
- Background Dark: `#000000`
- Background Light: `#FFFFFF`
- Text Primary Dark: `#E7E9EA`
- Text Secondary Dark: `#71767B`
- Engagement Pink: `#F91880`

### Example Component Prompts
- "Design a dark-mode Twitter tweet row: black background, 48px circular avatar, display name in Chirp 15px bold white, @handle in secondary grey, tweet body 15px normal white, four icon buttons (reply/retweet/like/share) with circular rgba hover rings"
- "Create a Twitter thread: two tweets connected by a 2px vertical grey line left-aligned with avatars, reply indented, timestamps in secondary color"
- "Build a Twitter follow button: white pill button on dark background, Chirp 15px bold, 100px border-radius, with hover state showing red unfollow tint"
- "Design a Twitter profile header: banner image 16:5, circular avatar overlapping bottom edge, display name + handle + bio below, following/follower stats in Chirp"
