# Design System Inspired by TikTok

## 1. Visual Theme & Atmosphere

TikTok's design system is built around a single core truth: the video is the interface. Every structural decision — the pure black base, the full-screen vertical frame, the minimal chrome — exists to eliminate distraction and let content claim 100% of the user's attention. The app is a stage, and the UI is a transparent curtain that drops out of sight the moment a video begins. This content-first philosophy has defined a generation of short-video UI patterns.

The accent palette is deliberately electric: neon cyan (`#69C9D0`) and hot pink (`#EE1D52`) derive from TikTok's iconic logo duotone. These colors are used with restraint in UI chrome — appearing on the like button's heart animation, the brand wordmark, and the recording button's gradient ring. The tension between the two hues creates instant brand recognition and energetic signal. They never appear together on interactive elements, preserving their individual semantic weight.

Typography is powered by Proxima Nova — a geometric humanist sans-serif that balances approachability with precision. On the video feed, text overlays use bold white with heavy drop shadows to survive over any video content. The creator tools and comment UI maintain lighter weights, signaling a shift from the performative feed to the conversational interface. Notification badges, share counts, and engagement metrics display in crisp white numerals — stark, immediate, legible at a glance.

**Key Characteristics:**
- Pure black (`#000000`) background — the content canvas
- Neon cyan (`#69C9D0`) + hot pink (`#EE1D52`) dual accent system
- Proxima Nova for all UI text — geometric and clean
- Full-screen 9:16 vertical video format is the primary layout unit
- Engagement metrics (likes, comments, shares) in vertical right-rail
- Bottom navigation in frosted glass over video content
- Heart animation uses hot pink fill on like tap
- Record button: pink-to-cyan gradient ring, 68px white center

## 2. Color Palette & Roles

### Primary
- **Pure Black** (`#000000`): Page background, video container background
- **Hot Pink** (`#EE1D52`): Like icon fill, brand accent, record gradient
- **Neon Cyan** (`#69C9D0`): Brand accent, follow button, record gradient secondary

### Interactive
- **Pink Hover** (`#FF2D63`): Brightened CTA hover state
- **Cyan Hover** (`#7ED8DF`): Lightened follow button hover
- **White Active** (`#FFFFFF`): Tab bar active icon

### Surface
- **Surface Black** (`rgba(0,0,0,0.85)`): Video overlay panels, comment sheet
- **Surface Glass** (`rgba(255,255,255,0.10)`): Frosted bottom nav background
- **Comment Bubble** (`rgba(255,255,255,0.12)`): Comment input, dark mode cards
- **Separator** (`rgba(255,255,255,0.12)`): Dividers between comment rows

### Text
- **Primary White** (`#FFFFFF`): All text on video, nav labels
- **Secondary White** (`rgba(255,255,255,0.65)`): Username, timestamps, secondary
- **Video Caption** (`#FFFFFF`): Bold with `text-shadow: 0 1px 8px rgba(0,0,0,0.80)`

### Semantic
- **Error / Delete** (`#FF3B30`): Destructive actions
- **Verified Badge** (`#20D5EC`): Creator verified checkmark
- **Live Badge** (`#FE2C55`): Live indicator on thumbnails

## 3. Typography Rules

### Font Families
- **Primary UI**: `"Proxima Nova", "Proxima Nova A", -apple-system, "Helvetica Neue", sans-serif` — all UI text
- **Video Overlay**: `"Proxima Nova", sans-serif` — bold weight, with text-shadow
- **Creator Caption**: `"Proxima Nova", sans-serif` — regular weight, truncated with expand

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| For You Header | Proxima Nova | 18px | 700 | 24px | Center-top feed label |
| Username | Proxima Nova | 15px | 700 | 20px | `@handle` on video overlay |
| Caption Text | Proxima Nova | 14px | 400 | 20px | Below username, 2-line clamp |
| Engagement Count | Proxima Nova | 14px | 600 | 18px | Like/comment/share count |
| Comment Text | Proxima Nova | 14px | 400 | 20px | Comment list body |
| Comment Username | Proxima Nova | 13px | 700 | 18px | Bold username in comments |
| Nav Label | Proxima Nova | 10px | 600 | 12px | Bottom tab labels, uppercase |
| Sound Name | Proxima Nova | 13px | 500 | 16px | Scrolling music credit |
| Duet/Stitch Label | Proxima Nova | 12px | 500 | 16px | Collaboration metadata |
| Badge Text | Proxima Nova | 10px | 700 | 12px | "LIVE", "NEW" badges |

## 4. Component Stylings

### Buttons

**Follow Button (unfollow state)**
- Background: `transparent`
- Border: `1px solid #FFFFFF`
- Text: `#FFFFFF`, 14px, weight 700
- Padding: `4px 14px`
- Border radius: `4px`
- Width: auto

**Follow Button (follow state)**
- Background: `#EE1D52`
- Border: none
- Text: `#FFFFFF`
- Same dimensions

**Record Button**
- Outer ring: gradient `#EE1D52` → `#69C9D0`, 3px, 76px diameter
- Middle white ring: 4px white, 70px diameter
- Inner: `#FFFFFF`, 64px circle
- Active (recording): inner shrinks to 28px square with rounded corners

**Share/Action Button (right rail)**
- Container: 40px × 40px circle
- Background: `rgba(255,255,255,0.15)`
- Icon: `#FFFFFF`, 22px
- Tap: scale `0.90`, then spring back to `1.0`
- Label below: 12px, 600 weight, white

### Cards & Containers

**Comment Sheet**
- Background: `rgba(22,22,22,0.98)`
- Border-radius: `16px 16px 0 0`
- Handle: 36px × 4px, `rgba(255,255,255,0.30)`, radius 2px, centered top
- Padding: `16px`
- Max-height: 80vh

**Discover Card (grid)**
- Aspect ratio: 9:16
- Border-radius: `4px`
- Background: `#000000` fallback
- Overlay: username in bottom-left, 13px bold white with shadow

**Creator Profile Card**
- Background: `#000000`
- Avatar: 86px circle, `2px solid #FFFFFF` border
- Username: 16px, bold, white
- Stats row: follower/following/likes in 15px bold, labels in 12px muted

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 48px`
- Right engagement rail: `16px` from edge, icons spaced `28px` apart vertically
- Bottom overlay (username, caption): `16px` from bottom of video, `16px` left margin

### Grid System
- Feed: single-column full-screen — 100vw × 100vh per video
- Discover/Search: 2-column grid, `2px` gap between cells
- Profile grid: 3-column grid, `2px` gap, 9:16 cells

### Border Radius Scale
- `0px` — video cells in grid, full-screen video
- `4px` — profile grid cells, small cards
- `8px` — tags, filter chips
- `12px` — notification items
- `16px` — comment sheet, bottom sheets
- `50%` — avatars, icon action circles

## 6. Depth & Elevation

### Shadow Scale
- **Video Overlay Text** — `text-shadow: 0 1px 8px rgba(0,0,0,0.80)` — caption legibility on video
- **Icon Glow (Hot Pink)** — `drop-filter: drop-shadow(0 0 8px rgba(238,29,82,0.60))` — liked state heart
- **Comment Sheet** — `box-shadow: 0 -4px 24px rgba(0,0,0,0.60)`
- **Nav Glass** — `backdrop-filter: blur(20px) saturate(180%)`

### Overlay Treatments
- Bottom caption gradient: `linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 50%)`
- Right rail gradient: `linear-gradient(to left, rgba(0,0,0,0.40) 0%, transparent 40%)`

## 7. Do's and Don'ts

### Do
- Keep the video at 100% viewport — never crop or add borders to the video frame
- Use the hot pink/cyan duotone only for brand moments — record button and logo
- Apply text-shadow on all video overlay text — content behind it is unpredictable
- Animate engagement numbers when they change — spring physics, not easing curves
- Use glass morphism (`backdrop-filter`) for overlaid navigation only

### Don't
- Don't use colored backgrounds behind video content — it breaks the immersive frame
- Don't mix the two accent colors on the same interactive element
- Don't reduce the record button ring — the gradient ring is non-negotiable brand
- Don't paginate the feed — infinite swipe is the core interaction model
- Don't show skeleton loaders on video frames — fade-in from black instead

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — primary design target; full-screen video feed
- `768px` — tablet; 2-column discover, side-by-side video comparison
- `1024px` — web; persistent sidebar nav, fixed right panel for comments
- `1280px` — desktop; three-panel layout (nav | video | comments)

**Platform Adaptations:**
- Web: video constrained to 9:16 centered with dark letterbox
- Tablet: split-view with comments visible alongside video
- Mobile: swipe-up for next, swipe-right for camera, double-tap to like
- Desktop: keyboard shortcuts (Space = pause, Right = next, L = like)

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#000000`
- Accent Pink: `#EE1D52`
- Accent Cyan: `#69C9D0`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255,255,255,0.65)`
- Glass Surface: `rgba(255,255,255,0.10)`

### Example Component Prompts
- "Design a full-screen TikTok video player with black background, right-rail engagement buttons (heart in hot pink #EE1D52, comment, share as white circles), caption overlay at bottom-left with text-shadow, and glass bottom nav"
- "Create a record button with pink-to-cyan gradient outer ring, white middle ring, white center circle, all centered on black background"
- "Build a TikTok comment sheet with dark frosted background radius 16px top, scrollable comments using Proxima Nova, hot pink username highlights, thumb-up counts"
- "Design a TikTok discover grid: 2-column 9:16 cells with 2px gap, dark overlay with username in bottom-left, play count in bottom-right"
