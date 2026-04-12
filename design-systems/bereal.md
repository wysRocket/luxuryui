# Design System Inspired by BeReal

## 1. Visual Theme & Atmosphere

BeReal's design aesthetic is a radical statement against polished social media. Where Instagram is aspirational and curated, BeReal is deliberately raw, immediate, and anti-design. The entire visual system is built on pure black (`#000000`) backgrounds, stark white text, and a single yellow accent (`#FFE500`) that marks the brand's most critical interaction: the "Time to BeReal" notification moment. Everything else is stripped away.

Helvetica Neue is the typeface — simple, neutral, no personality imposed by the font itself. This forces the content (real, unfiltered dual-camera photos) to be the entire visual statement. Button shapes are rounded to full pills, which softens the otherwise harsh monochrome palette enough to feel approachable rather than menacing. The result communicates: this is your real life, unedited, no filter, just as it is.

The UI is sparse to the point of minimalism — almost nothing on screen competes with the photo. The dual-camera format (front + back camera stacked) is the signature layout element, with the front-cam inset overlapping the back-cam in a small rounded rectangle. Discovery feeds scroll vertically with minimal chrome: just photos, usernames in white, a small "Late" badge when appropriate, and emoji reactions. Anti-design is the design.

**Key Characteristics:**
- Background: `#000000` (true black always)
- Text: `#FFFFFF` (white only)
- Accent: `#FFE500` (yellow) — BeReal notification button only
- Font: Helvetica Neue throughout
- Border radius: 24px+ on pills; 12px on camera inset
- No gradients, no decorative shadows, no color variety
- Secondary gray: `rgba(255,255,255,0.5)` for metadata

## 2. Color Palette & Roles

### Primary
- **True Black** (`#000000`): Every background surface — no exceptions
- **Pure White** (`#FFFFFF`): All text, icons, and UI elements on dark
- **BeReal Yellow** (`#FFE500`): The "Time to BeReal" CTA button — used nowhere else

### Interactive
- **White Pressed** (`rgba(255,255,255,0.85)`): Interactive white elements on press state
- **Yellow Hover/Press** (`#E5CE00`): Slightly dimmed yellow for button press state
- **Glass Button** (`rgba(255,255,255,0.15)`): Secondary action buttons (share, send, etc.)

### Surface
- **Black** (`#000000`): Root background — the only background
- **Dark Overlay** (`rgba(0,0,0,0.6)`): Metadata text container behind photo
- **Glass Card** (`rgba(255,255,255,0.1)`): Subtle card separation when needed
- **Reaction Bar** (`rgba(0,0,0,0.75)`): Emoji reaction overlay on photos

## 3. Typography Rules

### Font Families
- **Helvetica Neue**: `"Helvetica Neue", Helvetica, Arial, sans-serif` — exclusively used throughout
- No other typeface exists in the BeReal design system

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Notification / Hero | Helvetica Neue | 24px | 700 | 30px | "Time to BeReal" main message |
| Username | Helvetica Neue | 15px | 700 | 20px | White, above the photo |
| Post Time | Helvetica Neue | 13px | 400 | 18px | `rgba(255,255,255,0.5)`, "2 min ago" |
| "Late" Badge | Helvetica Neue | 11px | 700 | 14px | White on dark pill — "3 hours late" |
| Comment text | Helvetica Neue | 14px | 400 | 20px | White on black |
| Reaction / Emoji count | Helvetica Neue | 13px | 700 | 18px | White reaction count beside emoji |
| Section header | Helvetica Neue | 20px | 700 | 26px | "My Friends", "Discovery" |
| Nav tab | Helvetica Neue | 11px | 500 | 14px | White, bottom tab labels |
| Button label | Helvetica Neue | 16px | 700 | 22px | "BeReal" yellow button text (black) |
| Caption | Helvetica Neue | 13px | 400 | 18px | `rgba(255,255,255,0.55)` |

## 4. Component Stylings

### Buttons
**Primary (Time to BeReal):**
- Background: `#FFE500`
- Border: none
- Border radius: 980px (full pill)
- Padding: `14px 32px`
- Font: Helvetica Neue, 16px / 700 / color `#000000`
- Press: background `#E5CE00`, scale `0.97`
- Box-shadow: none — flat yellow

**Secondary (Glass Action):**
- Background: `rgba(255,255,255,0.15)`
- Border: none
- Border radius: 980px
- Font: 14px / 600 / white
- Backdrop-filter: `blur(8px)`
- Press: background `rgba(255,255,255,0.25)`

**Icon Button:**
- Background: `rgba(255,255,255,0.1)`
- Size: 40×40px
- Border radius: 50%
- Icon: white, 20px

### Cards & Containers
**BeReal Post (dual camera):**
- Full-width or square frame
- Back camera: full-width 4:3 or 3:4 image, border radius 12px
- Front camera inset: 90×120px, border-radius 12px, overlaid top-left of back camera
- White border: `2px solid #FFFFFF` on the inset for separation
- Username + time: white text, overlaid bottom-left
- Reaction bar: `rgba(0,0,0,0.75)` pill below photo

**Discovery/Feed Separator:**
- No card chrome — photos are edge-to-edge
- Username white bold above; timestamp and "Late" badge below-left of image

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32px
- Content inset: 16px left/right margins
- Feed item vertical spacing: 24px gap
- Camera inset position: 8px from top-left of back camera

### Border Radius Scale
- Camera inset / photo corners: 12px
- Modal / bottom sheet: 20px top corners
- Buttons: 980px (full pill exclusively)
- Icon buttons: 50%
- "Late" badge: 980px pill

## 6. Depth & Elevation

BeReal has no elevation hierarchy — flat black is the canvas:

**Photo overlay text:**
```
text-shadow: 0 1px 3px rgba(0,0,0,0.8);
```

**Front camera inset border:**
```
border: 2px solid #FFFFFF;
border-radius: 12px;
```

**Glass action buttons:**
```
background: rgba(255,255,255,0.15);
backdrop-filter: blur(8px);
```

**Bottom sheet modal:**
```
background: #111111;
border-radius: 20px 20px 0 0;
/* No shadow — darkness is separation enough */
```

## 7. Do's and Don'ts

### Do
- Use `#FFE500` yellow exclusively for the "Time to BeReal" notification CTA — nowhere else
- Keep the background true black (`#000000`) — no dark grays, no off-blacks
- Use full-pill border radius (980px) on all buttons — it's the only soft element in the system
- Overlay all text on photos with `text-shadow` — no opaque text blocks behind captions
- Embrace sparse UI — more white space, less chrome

### Don't
- Don't add color anywhere beyond black, white, and yellow — the constraint is the brand
- Don't use gradients or decorative shadows on any surface
- Don't use any typeface other than Helvetica Neue
- Don't add rounded corners to the photo itself at the feed level — edge-to-edge is authentic

## 8. Responsive Behavior

Breakpoints (mobile-first always):
- Mobile: 0–480px — full-screen native experience; this is a mobile-native product
- Tablet: 481–768px — centered post card max 480px wide; black sidebar fill
- Desktop (web): 769px+ — single centered column 480px; black margins; minimal header

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#000000`
- Text: `#FFFFFF`
- Yellow CTA: `#FFE500`
- Secondary Text: `rgba(255,255,255,0.5)`
- Glass Button: `rgba(255,255,255,0.15)`
- Photo inset border: `#FFFFFF`

### Example Component Prompts
- "BeReal dual-camera post card: black background, full-width back camera photo with 12px radius, small front camera inset 90×120px top-left with 2px white border and 12px radius, username in white Helvetica Neue 15px bold overlay, timestamp in 50%-opacity white below — raw, unpolished"
- "BeReal notification button: #FFE500 yellow fill, black text Helvetica Neue 16px bold, full pill 980px radius — 'Time to BeReal' text center, flat no-shadow, on true black background"
- "BeReal feed: true black (#000000) full page, posts edge-to-edge with 24px vertical gap, no cards no borders, white text metadata overlaid — anti-design social feed"
