# Design System Inspired by Notion

## 1. Visual Theme & Atmosphere

Notion's design language is built around the concept of a blank sheet of paper — infinitely flexible, quietly structured, never imposing. The near-black text (`#191919`) on pure white (`#FFFFFF`) creates a reading experience that references print typography rather than digital interfaces. Every element of the UI recedes to make the content primary; the tool disappears so the thinking can emerge.

The typeface system is anchored by the custom Notion font — a humanist sans-serif optimized for long-form reading at screen resolutions. It balances the informal warmth of a notebook with the precision of a design tool. Heading weights step from Bold (700) through Regular (400) to create document-like hierarchy. The sidebar uses a warm gray (`#F7F7F7`) that is barely distinguishable from white, creating spatial organization without visual noise.

Accent colors appear as block type indicators and database property labels — but they're deliberately muted (60% saturation) to remain secondary to content. The "default" blue (`#2382C4`) for links and selected states is the only blue in the system. Hover states are the palest possible gray (`#F2F2F2`) — Notion's interaction model is almost invisible, relying on spatial discovery rather than persistent visual affordances.

**Key Characteristics:**
- Near-black `#191919` text on `#FFFFFF` base — print-like reading experience
- Warm sidebar gray `#F7F7F7` for navigation — barely differentiated from base
- Custom Notion font: humanist sans-serif optimized for long-form screen reading
- Muted block-type accent palette — 60% saturation pastels for tag/property colors
- Ghost interaction model: hover states `#F2F2F2` appear only on interaction
- Link blue `#2382C4` as the sole interactive blue — consistent across light/dark
- Dark mode: `#191919` surface, `#FFFFFF` text, warm darks throughout
- Block-based editing model: every content unit is a draggable, transformable block

## 2. Color Palette & Roles

### Primary
- **Near Black** (`#191919`): Default text color, icon fills, primary UI elements
- **Pure White** (`#FFFFFF`): Page background, workspace canvas
- **Link Blue** (`#2382C4`): All interactive links, selection highlight, active nav items

### Sidebar & Navigation
- **Sidebar Gray** (`#F7F7F7`): Sidebar background — distinct but quiet
- **Hover Gray** (`#F2F2F2`): Row and item hover state
- **Selected Blue** (`rgba(35, 130, 196, 0.08)`): Selected sidebar item background
- **Drag Handle** (`#C7C7C7`): Visible on block hover for reorder handle

### Text Hierarchy
- **Primary Text** (`#191919`): All body content, heading text
- **Secondary Text** (`#787774`): Metadata, captions, placeholder text
- **Tertiary Text** (`#ABABAB`): Disabled states, hint text
- **Placeholder** (`rgba(25, 25, 25, 0.4)`): Empty block prompts

### Block Type Accents (Muted Palette)
- **Default Gray** (`#9B9A97`): Default text, callout blocks
- **Brown** (`#64473A`): Database brown property
- **Orange** (`#D9730D`): Warning callout, orange tag
- **Yellow** (`#DFAB01`): Highlight, yellow property
- **Green** (`#0F7B6C`): Success callout, green tag
- **Blue** (`#0B6E99`): Info callout, blue property
- **Purple** (`#6940A5`): Purple heading, property label
- **Pink** (`#AD1A72`): Pink callout accent
- **Red** (`#E03E3E`): Error callout, red tag

### Dark Mode
- **Dark Base** (`#191919`): Main background
- **Dark Surface** (`#202020`): Sidebar, elevated panels
- **Dark Border** (`#37352F`): Dividers, subtle borders
- **Dark Hover** (`#2F2F2F`): Hover state on dark

## 3. Typography Rules

### Font Families
- **Notion (Custom)**: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif` — All UI and content text
- **Notion Serif**: `Georgia, Times, serif` — Serif page style option
- **Notion Mono**: `iawriter-mono, Nitti, "Noto Sans Mono", "Cascadia Code", monospace` — Code blocks, inline code

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Page Title | Notion | 40px | 700 | 1.2 | Near-black, left-aligned |
| H1 | Notion | 30px | 700 | 1.3 | Near-black |
| H2 | Notion | 24px | 600 | 1.3 | Near-black |
| H3 | Notion | 20px | 600 | 1.4 | Near-black |
| Body Text | Notion | 16px | 400 | 1.6 | Primary reading size |
| Small Body | Notion | 14px | 400 | 1.5 | Properties, captions |
| Caption / Label | Notion | 12px | 400 | 1.4 | Gray `#787774` |
| Code Block | Notion Mono | 14px | 400 | 1.7 | Background `#F7F6F3` |
| Inline Code | Notion Mono | 85% | 400 | inherit | Red text `#EB5757`, gray bg |
| Sidebar Item | Notion | 14px | 400 | 1.5 | Near-black, truncated |
| Database Cell | Notion | 14px | 400 | 1.5 | Compact table reading |
| Breadcrumb | Notion | 13px | 400 | 1.4 | Gray secondary |

## 4. Component Stylings

### Buttons

**Primary Button**
```
background: #000000
color: #FFFFFF
font: 14px 500
padding: 6px 12px
border-radius: 4px
border: none
hover: background #1A1A1A
transition: background 120ms ease
```

**Secondary / Ghost**
```
background: rgba(0,0,0,0.04)
color: #191919
border: none
padding: 6px 12px
border-radius: 4px
hover: background rgba(0,0,0,0.08)
```

**Inline Text Button / Link**
```
color: #2382C4
text-decoration: none
font: inherit size/weight
hover: text-decoration underline
cursor: pointer
```

**New Page Button (Sidebar)**
```
background: transparent
color: #787774
padding: 4px 8px
border-radius: 4px
font: 14px 400
hover: background #F2F2F2, color #191919
icon: + left-aligned
```

### Cards & Containers

**Gallery Database Card**
```
background: #FFFFFF
border: 1px solid rgba(55, 53, 47, 0.16)
border-radius: 4px
padding: 8px
hover: box-shadow 0 1px 3px rgba(0,0,0,0.1)
cover image: top, height 100px, object-fit cover
```

**Callout Block**
```
background: rgba(241, 241, 239, 1.0) (gray) / tinted by type
border-radius: 4px
padding: 16px
icon: 24px emoji/icon left
text: 16px 400 near-black
```

**Code Block**
```
background: #F7F6F3
border-radius: 4px
padding: 32px
font: Notion Mono 14px
language label: top-right 12px gray
copy button: top-right, appears on hover
```

**Sidebar Navigation Item**
```
padding: 2px 8px
border-radius: 4px
height: 28px
icon: 18px left
title: 14px 400, truncate overflow
hover: background #F2F2F2
active: background rgba(35,130,196,0.08), color link blue
```

## 5. Layout Principles

### Spacing System
- Base: 4px
- Scale: 2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Page content max-width: 900px (full), 720px (center column default)
- Block vertical spacing: 1px between inline blocks, 4px between block-types
- Sidebar width: 240px default, collapsible to 0
- Page padding: 96px left/right (desktop), 16px (mobile)

### Border Radius Scale
- `2px` — Tags, property badges, inline elements
- `4px` — Buttons, cards, callout blocks, code blocks, inputs
- `8px` — Modals, dropdown menus, command palette
- `50%` — Avatar icons, circular selection dots

### Grid
- Mobile: Single column, 16px margins
- Tablet: 240px sidebar + flexible content
- Desktop: 240px sidebar + 900px max-width content centered
- Database views: Full-width within content column, horizontal scroll

## 6. Depth & Elevation

```
Level 0 - Canvas:    #FFFFFF, no shadow (page background)
Level 1 - Hover:     rgba(0,0,0,0.04) background only (no shadow)
Level 2 - Card:      0 1px 3px rgba(0,0,0,0.10) (database gallery cards)
Level 3 - Dropdown:  0 4px 12px rgba(15,15,15,0.1), 0 1px 2px rgba(15,15,15,0.08)
Level 4 - Modal:     0 8px 40px rgba(15,15,15,0.20)
Popover:             0 0 0 1px rgba(15,15,15,0.05), 0 3px 6px rgba(15,15,15,0.1)
Notion avoids deep shadows — space and border create hierarchy
```

## 7. Do's and Don'ts

### Do
- Use `#F2F2F2` as the only hover color — Notion's ghost interactions must feel subtle
- Make block drag handles appear only on hover (not persistent) to reduce visual noise
- Use 900px max-width for content — full-bleed text lines are unreadable
- Apply `4px` border-radius consistently — Notion uses a single radius for all containers
- Use muted block accent colors at 60% saturation — they're secondary to content
- Maintain near-black `#191919` for all text — full black `#000000` is too harsh

### Don't
- Don't use full black `#000000` for text — `#191919` is the Notion standard
- Don't add heavy card shadows — the design relies on whitespace and thin borders
- Don't use bright, saturated block colors — they compete with content priority
- Don't persist toolbar/action buttons — they should appear contextually on selection only

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — Mobile: sidebar collapses to drawer, full-width content
- `640px` — Large mobile: expanded content width
- `768px` — Tablet: sidebar can be toggled but is hidden by default
- `1024px` — Desktop: persistent sidebar, 900px content max-width
- `1440px` — Wide: sidebar + 900px content, white space fills remainder

**Adaptive Patterns:**
- Sidebar: hidden (drawer) mobile → persistent 240px desktop
- Page title: 40px → 32px mobile
- Content padding: 96px desktop → 16px mobile
- Database: scroll-x on mobile → full table on desktop

## 9. Agent Prompt Guide

### Quick Color Reference
```
Near Black:      #191919   — all text, primary UI
Link Blue:       #2382C4   — interactive elements, selections
Sidebar Gray:    #F7F7F7   — navigation background
Hover Gray:      #F2F2F2   — hover state
Secondary Text:  #787774   — metadata, labels
Dark Hover:      #2F2F2F   — dark mode hover
```

### Example Component Prompts
- "A Notion sidebar navigation item: 240px wide, 28px height, 14px regular Notion font, emoji icon left, page title truncated, hover state `#F2F2F2` background 4px radius"
- "A Notion callout block: light gray `#F1F1EF` background 4px radius, 24px emoji icon left-aligned, 16px body text near-black, no border"
- "A Notion gallery database card: white background 4px radius, 1px light border, 100px cover image top full-width, property labels below 12px gray"
- "A Notion H1 heading: 30px 700 near-black `#191919`, hover reveals drag handle left and slash-command right, block editing affordances"
