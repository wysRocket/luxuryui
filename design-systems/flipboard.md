# Design System Inspired by Flipboard

## 1. Visual Theme & Atmosphere

Flipboard's design is a love letter to print journalism translated to digital — it captures the tactile drama of magazine page flips and the editorial boldness of newsstand covers. The brand red (`#E12828`) is vivid, authoritative, and urgent: it anchors the logo, marks unread counts, and appears on featured section headers. The signature UI interaction — the 3D flip tile animation — is both a navigational metaphor and a brand identity statement.

The typographic treatment is unapologetically editorial: large, bold serif headlines dominate story tiles, while sans-serif body text handles article summaries. The cover flow grid alternates between large hero tiles (spanning 2 columns) and smaller secondary tiles, mimicking a magazine layout rather than a uniform feed. Photography is the #1 content element — images bleed edge-to-edge, with text overlaid on gradient scrims.

Flipboard supports both dark and light modes with equal fidelity. In dark mode (`#0F0F0F` base), the red becomes more luminous; in light mode, white surfaces and warm grays create a clean reading environment. The design respects long-form reading: generous line-heights, comfortable column widths, and distraction-free article views.

**Key Characteristics:**
- Flipboard Red (`#E12828`) for logo, unread badges, featured headers
- Magazine-grid tile layout with 2:1 hero + 1:1 secondary tiles
- Bold editorial serif headings + clean sans-serif body text
- Full-bleed photography with gradient overlay text treatment
- 3D flip tile animation as brand signature
- Dark mode (`#0F0F0F`) and light mode (`#F8F8F8`) equally first-class
- Generous typography spacing — optimized for reading
- Minimal UI chrome — content takes maximum space

## 2. Color Palette & Roles

### Primary
- **Flipboard Red** (`#E12828`): Logo, unread badge, section accent
- **Near Black** (`#0F0F0F`): Dark mode background, article text
- **Near White** (`#F8F8F8`): Light mode background

### Interactive
- **Hover Red** (`#C71F1F`): Darker red on button hover
- **Link Red** (`#E12828`): In-content links
- **Focus** (`rgba(225,40,40,0.3)`): Focus ring

### Surface
- **Dark Card** (`#1C1C1C`): Dark mode tile backgrounds
- **Light Card** (`#FFFFFF`): Light mode tile backgrounds
- **Section Gray** (`#F0F0F0`): Light mode section dividers
- **Muted Text** (`#8A8A8A`): Publication name, timestamps
- **Body Text Dark** (`#1C1C1C`): Article body in light mode
- **Body Text Light** (`#E8E8E8`): Article body in dark mode

## 3. Typography Rules

### Font Families
- **Editorial / Headline**: `Georgia` / `Merriweather` — serif for story titles
- **UI / Meta**: `Helvetica Neue` / `system-ui` — nav, labels, meta
- **Body**: `Georgia` at 18px — optimized for long-form reading

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Cover Hero | Georgia | 36px | 700 | 1.15 | Hero tile headline |
| Story Headline | Georgia | 22px | 700 | 1.25 | Grid tile title |
| Feature Title | Georgia | 28px | 700 | 1.20 | 2-col hero tile |
| Article Title | Georgia | 32px | 700 | 1.20 | Article detail page |
| Body Text | Georgia | 18px | 400 | 1.80 | Long-form reading |
| Section Label | Helvetica Neue | 13px | 700 | 1.00 | ALL CAPS section header |
| Publication | Helvetica Neue | 12px | 600 | 1.00 | Source attribution |
| Timestamp | Helvetica Neue | 11px | 400 | 1.00 | "3 hours ago" |
| Nav | Helvetica Neue | 14px | 600 | 1.00 | Top navigation |
| Badge | Helvetica Neue | 11px | 700 | 1.00 | Unread count |

## 4. Component Stylings

### Buttons

**Primary Red**
- Background: `#E12828`
- Radius: 4px
- Padding: 10px 20px
- Font: Helvetica Neue 14px/700, white
- Hover: `#C71F1F`

**Follow Button**
- Border: `1px solid #E12828`
- Color: `#E12828`
- Background: transparent
- Radius: 4px

**Icon Actions**
- No background — icon-only
- Color: `#8A8A8A`, active: `#E12828`

### Cards & Containers
- Story tile: full image bleed, gradient scrim bottom `rgba(0,0,0,0.65)`
- Headline over image: white, bold serif
- No border-radius on tiles (magazine-style sharp edges: 0px–2px)
- Section header: `E12828` left border 3px, label all-caps

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Tile gap: 2px–4px (magazine tight grid)

### Border Radius Scale
- None (0px): Image tiles, story cards — magazine feel
- Subtle (2px): Buttons in some contexts
- Small (4px): Buttons, badges, tag chips
- Medium (8px): Modals, bottom sheets

## 6. Depth & Elevation

- **Tiles**: No shadow — image contrast creates definition
- **Scrim**: `background: linear-gradient(transparent, rgba(0,0,0,0.75))` over image
- **Sticky nav**: `box-shadow: 0 2px 8px rgba(0,0,0,0.2)`
- **Modal**: `box-shadow: 0 16px 48px rgba(0,0,0,0.5)`
- **Flip animation**: `perspective: 1000px`, rotateY 180deg

## 7. Do's and Don'ts

### Do
- Use full-bleed photography — never crop or constrain images in tiles
- Apply editorial serif for headlines — it signals long-form, quality journalism
- Use section labels in ALL CAPS Helvetica Neue — it's the Flipboard convention
- Keep tile grid tight (2–4px gap) for the magazine-page effect
- Support both dark and light mode with equal visual quality

### Don't
- Don't use rounded tile corners — sharp edges maintain the print metaphor
- Don't dilute red — it means "Flipboard brand" and "unread", nothing else
- Don't add excessive UI chrome — content coverage is the interface
- Don't use decorative colors — red, black, and photography carry the visual weight

## 8. Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px
- Mobile: Single-column stacked tiles, swipe navigation between sections
- Tablet: 2-column magazine grid, side panel for section nav
- Desktop: 3-column grid, persistent left nav, article in center column

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand red: `#E12828`
- Dark bg: `#0F0F0F`
- Light bg: `#F8F8F8`
- Card dark: `#1C1C1C`
- Muted: `#8A8A8A`
- Body text: `#1C1C1C`

### Example Component Prompts
- "Build magazine story tile: full-bleed image. Bottom gradient scrim rgba(0,0,0,0.65). Georgia 22px/700 white headline over scrim. 12px/400 publication name + timestamp bottom."
- "Create section header: #E12828 left border 3px. Helvetica Neue 13px/700 ALL CAPS label. Dark bg #1C1C1C."
- "Design hero tile (2-col): full-bleed landscape photo. Large Georgia 36px/700 white title. Flipboard logo small top-left #E12828."
