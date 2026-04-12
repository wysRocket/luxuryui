# Design System Inspired by Calm

## 1. Visual Theme & Atmosphere

Calm is perhaps the most atmospherically cohesive app in existence — every design decision serves the emotional goal of reducing stress and evoking serenity. The foundation is a deep blue-to-indigo gradient (`#1B3D6E` to `#4A90D9`) that reads like looking up into a twilight sky. Over this, nature photography — forests, oceans, sunrises — creates an immediate sensory transportation. The UI disappears into this environment as much as possible.

Gold (`#F5A623`) is the primary interactive accent, chosen for its warmth and its association with candlelight and sunsets — both calming visual anchors. It appears on the most important interactive moments: the meditation session CTA, the premium unlock badge, the progress ring completion. Typography is set in a custom rounded sans that feels soft at the edges — lowercase greetings, gentle weights, generous tracking. Nothing shouts.

The overall layout philosophy is "as little chrome as possible." Navigation is minimal, settings are buried, and the meditation player fills the screen with nature video and near-invisible playback controls. The Calm design system is about creating a product that users forget they are using, because the experience of being in it feels like rest itself.

**Key Characteristics:**
- Background gradient: `#1B3D6E` → `#4A90D9` (dark-to-mid blue, top-to-bottom)
- Gold accent: `#F5A623`
- Text primary: `#FFFFFF`
- Text secondary: `rgba(255,255,255,0.65)`
- Surface card: `rgba(255,255,255,0.12)` glass
- Divider: `rgba(255,255,255,0.15)`
- Nature photography: full-bleed background at all times
- Border radius: 16–24px (generous, soft)

## 2. Color Palette & Roles

### Primary
- **Deep Blue** (`#1B3D6E`): Gradient start, deepest background layer
- **Sky Blue** (`#4A90D9`): Gradient end, lighter sky tones
- **Calm Gold** (`#F5A623`): Premium CTAs, progress indicators, subscription highlights

### Interactive
- **Gold Hover** (`#E09118`): CTA button hover — slightly richer gold
- **White Active** (`rgba(255,255,255,0.9)`): Meditation control active state
- **Glass Hover** (`rgba(255,255,255,0.2)`): Glass card hover state

### Surface
- **Glass Card** (`rgba(255,255,255,0.12)`): Program cards, session tiles floating over gradient
- **Glass Dark** (`rgba(0,0,0,0.25)`): Player overlays, bottom control bar
- **Divider** (`rgba(255,255,255,0.15)`): Separator lines on dark backgrounds
- **Overlay Light** (`rgba(255,255,255,0.08)`): Subtle section separation

## 3. Typography Rules

### Font Families
- **Calm Custom (rounded sans)**: `"Circular", "Nunito", -apple-system, BlinkMacSystemFont, sans-serif` — warm, rounded, soft-edged
- All heading text leans lowercase for approachability

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Greeting / Hero | Circular/Nunito | 32px | 300 | 40px | White, lowercase "good morning" |
| H1 Section | Circular/Nunito | 26px | 600 | 34px | "Sleep", "Meditate", "Music" |
| H2 Program Title | Circular/Nunito | 20px | 600 | 27px | Session collection titles |
| H3 Session Name | Circular/Nunito | 17px | 500 | 24px | Individual session card titles |
| Body | Circular/Nunito | 15px | 400 | 23px | `rgba(255,255,255,0.8)` |
| Duration / Metadata | Circular/Nunito | 13px | 400 | 18px | `rgba(255,255,255,0.6)` |
| CTA Button | Circular/Nunito | 16px | 600 | 22px | White on gold |
| Player Timer | Circular/Nunito | 48px | 200 | 56px | Countdown, thin weight, centered |
| Nav Tab | Circular/Nunito | 11px | 500 | 14px | `rgba(255,255,255,0.7)` inactive; white active |
| Premium Badge | Circular/Nunito | 12px | 700 | 16px | Gold label on dark pill |
| Quote / Affirmation | Circular/Nunito | 22px | 300 | 32px | Italic, centered, breathing room |
| Legal | Circular/Nunito | 11px | 400 | 15px | `rgba(255,255,255,0.4)` |

## 4. Component Stylings

### Buttons
**Primary (Start Session / Subscribe):**
- Background: `#F5A623`
- Border: none
- Border radius: 980px (full pill)
- Padding: `14px 32px`
- Font: 16px / 600 / `#FFFFFF`
- Hover: background `#E09118`, box-shadow `0 4px 16px rgba(245,166,35,0.4)`
- Glow: subtle gold shadow on hover for warmth

**Secondary (Glass):**
- Background: `rgba(255,255,255,0.15)`
- Border: `1px solid rgba(255,255,255,0.25)`
- Border radius: 980px
- Color: `#FFFFFF`
- Backdrop-filter: `blur(12px)`
- Hover: background `rgba(255,255,255,0.22)`

**Minimal (Text link):**
- Background: `transparent`
- Color: `rgba(255,255,255,0.8)`
- Hover: color `#FFFFFF`

### Cards & Containers
**Session Card (Glass):**
- Background: `rgba(255,255,255,0.12)`
- Border: `1px solid rgba(255,255,255,0.18)`
- Border radius: 20px
- Backdrop-filter: `blur(16px) saturate(120%)`
- Padding: 20px
- Box-shadow: `0 4px 24px rgba(0,0,0,0.2)`
- Hover: background `rgba(255,255,255,0.18)`, scale `1.02`

**Nature Background Tile:**
- Full-bleed image
- Overlay gradient: `linear-gradient(to bottom, rgba(27,61,110,0.3), rgba(27,61,110,0.7))`
- Border radius: 16px for card context

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px
- Session card grid gap: 16px
- Player vertical centering: full viewport height
- Content max-width: 480px (mobile-optimized even on web)

### Border Radius Scale
- Tags / badges: 8px
- Input fields: 12px
- Session cards: 20px
- Modal sheets: 24px top corners
- Buttons: 980px pill
- Avatar: 50%
- Progress ring: 50% (SVG circle)

## 6. Depth & Elevation

Calm uses atmospheric depth through blur and transparency rather than shadow:

**Session card floating:**
```
background: rgba(255,255,255,0.12);
backdrop-filter: blur(16px) saturate(120%);
border: 1px solid rgba(255,255,255,0.18);
box-shadow: 0 4px 24px rgba(0,0,0,0.2);
```

**Player control bar:**
```
background: rgba(0,0,0,0.3);
backdrop-filter: blur(20px);
```

**Bottom modal sheet:**
```
background: rgba(27,61,110,0.95);
backdrop-filter: blur(24px);
border-radius: 24px 24px 0 0;
```

**Gold CTA hover:**
```
box-shadow: 0 4px 16px rgba(245,166,35,0.4);
```

## 7. Do's and Don'ts

### Do
- Always place UI over nature photography or the blue gradient — never on plain white
- Use glass morphism (`backdrop-filter: blur`) for all card surfaces floating over imagery
- Apply the gold (`#F5A623`) to the single most important action per screen
- Use light-weight typography (300–400) for headings — softness is intentional
- Animate transitions with long easing (600ms+, ease-in-out) to maintain the calm tempo

### Don't
- Don't use sharp corners anywhere — the brand is entirely soft and rounded
- Don't add harsh red error states — use warm amber and gentle messaging for mistakes
- Don't use any bright, saturated accent beyond gold — the palette restraint creates the atmosphere
- Don't display dense information tables or lists — minimalism in content density is the product

## 8. Responsive Behavior

Breakpoints:
- Mobile: 0–640px — single column, full-bleed imagery, bottom tab nav — native feel
- Tablet: 641–1024px — 2-column session grid; sidebar nav at 220px
- Desktop: 1025px+ — centered content column max 960px; ambient nature video background
- Wide: 1280px+ — video background fills screen; content stays centered in 960px column

## 9. Agent Prompt Guide

### Quick Color Reference
- Gradient: `#1B3D6E` → `#4A90D9`
- Gold Accent: `#F5A623`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255,255,255,0.65)`
- Glass Surface: `rgba(255,255,255,0.12)` + blur
- Divider: `rgba(255,255,255,0.15)`

### Example Component Prompts
- "Calm meditation session card: glass morphism surface rgba(255,255,255,0.12) with 16px blur, 20px radius, nature photo thumbnail, session title in white Nunito 17px medium, duration in 60%-opacity white 13px — floats over blue gradient background"
- "Calm player screen: full-bleed ocean nature video background, blue gradient overlay, centered session timer 48px thin white, gold progress ring, play/pause controls in white glass pills, minimal chrome — atmosphere first"
- "Calm gold subscribe CTA: #F5A623 full-pill button, white text 16px semi-bold, 14px vertical padding, hover glows with gold shadow rgba(245,166,35,0.4) — warm, inviting, singular action on screen"
