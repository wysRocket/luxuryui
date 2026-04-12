# Design System Inspired by Monday.com

## 1. Visual Theme & Atmosphere

Monday.com's design language is built on a radical premise: project management doesn't have to be gray. The Work OS uses a vibrant, multi-color column system where status, priority, and category fields each carry their own color identity — hot pink, vivid purple, electric orange, sky blue, and bright green all coexist in the same board view. The visual result is somewhere between a spreadsheet and a stained-glass window, and it works because of a disciplined underlying system.

The white-dominant canvas (`#FFFFFF`) provides the neutral foundation that makes the column colors pop without overwhelming. Poppins is the brand's typeface — geometric, friendly, and excellent for cell-level text at 13–14px. The grid-first layout means most users spend their time in a density-optimized board view where 24 columns of data fit comfortably on a 1440px display.

The design philosophy is "colorful clarity" — the colors aren't decorative; each hue is a semantic signal. Pink means stuck, green means done, orange means working on it, yellow means waiting. This color vocabulary is learned quickly and becomes muscle memory, allowing users to scan 50-row boards and extract status at a glance. The same color system extends to group headers, timeline bars, and chart slices.

**Key Characteristics:**
- Multi-color semantic system: pink `#FF158A`, purple `#784BD1`, orange `#FDAB3D`, blue `#579BFC`, green `#00C875`
- White dominant: `#FFFFFF` — board and page backgrounds
- Poppins — geometric, friendly, works well at small cell sizes
- Board/grid as primary interaction surface: dense, scrollable, color-rich
- Group headers: colored left border + group color fill at 10% opacity
- Status column: pill-shaped, filled with semantic color
- Dark mode: `#1F1F2E` background variant available
- Hover states reveal action icons (edit, checkbox, menu)

## 2. Color Palette & Roles

### Primary
- **Monday Blue** (`#0073EA`): brand, primary CTAs, nav active states
- **White** (`#FFFFFF`): board background, cell fills
- **Dark Text** (`#323338`): primary cell and heading text
- **Gray Text** (`#676879`): secondary labels, placeholder text

### Status Column Colors (Semantic)
- **Done Green** (`#00C875`): completed items
- **Working Orange** (`#FDAB3D`): in progress
- **Stuck Pink** (`#FF158A`): blocked/stuck
- **Low Priority Blue** (`#579BFC`): low priority tasks
- **Purple** (`#784BD1`): custom category
- **Gray** (`#C4C4C4`): no status / blank

### Interactive
- **Blue Hover** (`#0060D0`): CTA hover
- **Row Hover** (`rgba(0,115,234,0.04)`): board row hover
- **Selected Row** (`rgba(0,115,234,0.08)`): selected state
- **Add Row Button**: `#E6F2FF` background on hover, plus icon

### Surface
- **Board Background** (`#F6F7FB`): behind board chrome
- **Cell Border** (`rgba(0,0,0,0.06)`): grid lines
- **Group Header Tint** (10% of group color): colored group row fill

## 3. Typography Rules

### Font Families
- **Poppins**: `"Poppins", "Inter", sans-serif` — all text
- **System Mono**: `monospace` — formula cells, ID columns

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display | Poppins | 32px | 700 | 1.15 | Dashboard titles |
| H1 | Poppins | 24px | 700 | 1.2 | Board name |
| H2 | Poppins | 18px | 600 | 1.3 | Group name in board |
| H3 | Poppins | 15px | 600 | 1.35 | Column header |
| Cell Text | Poppins | 13px | 400 | 1.4 | Board cell content |
| Status Pill | Poppins | 12px | 600 | 1.0 | Uppercase status label in colored pill |
| Column Header | Poppins | 12px | 500 | 1.2 | All-caps, gray |
| Caption | Poppins | 11px | 400 | 1.3 | Timestamps, IDs |
| Button | Poppins | 14px | 600 | 1.0 | CTA text |

## 4. Component Stylings

### Buttons
- **Primary**: `background: #0073EA`, `color: #FFFFFF`, `border-radius: 4px`, `padding: 10px 20px`, `font: Poppins 14px 600`
- **Hover**: `background: #0060D0`
- **Secondary**: `border: 1px solid #0073EA`, `color: #0073EA`, `background: transparent`, `border-radius: 4px`
- **Add Item**: `color: #676879`, dashed `border: 1px dashed #C4C4C4`, `border-radius: 4px`, hover → blue fill
- **Status Pill**: filled with semantic color, `border-radius: 4px`, Poppins 12px 600 uppercase, white text

### Cards & Containers
- **Board Cell**: `border-right: 1px solid rgba(0,0,0,0.06)`, `border-bottom: 1px solid rgba(0,0,0,0.06)`, `padding: 0 12px`, 40px row height
- **Group Header Row**: left border 4px solid group color, fill group-color at 10% opacity, Poppins 15px 600
- **Card View Card**: `background: #FFFFFF`, `border-radius: 8px`, `border: 1px solid rgba(0,0,0,0.08)`, colored status stripe top
- **Widget Container**: `background: #FFFFFF`, `border-radius: 8px`, `border: 1px solid rgba(0,0,0,0.10)`, `padding: 20px`

## 5. Layout Principles

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48
- Board row height: 40px
- Column header height: 36px
- Left sidebar: 260px

### Border Radius Scale
- **0px** — board cell grid (sharp grid lines)
- **4px** — buttons, status pills, column headers
- **8px** — card view cards, widgets, modals
- **50%** — member avatars in cells

## 6. Depth & Elevation

- **Level 0** (board): flat grid, hairline borders
- **Level 1** (widget): `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` — dashboard widgets
- **Level 2** (dropdown): `box-shadow: 0 4px 16px rgba(0,0,0,0.12)` — column menus
- **Level 3** (modal): `box-shadow: 0 8px 32px rgba(0,0,0,0.18)` — full modals
- **Status pill drop shadow**: none — flat pills read more clearly in dense grids

## 7. Do's and Don'ts

### Do
- Use the semantic color system consistently — never assign colors arbitrarily
- Keep board row height at 40px — density is core to the product
- Show group color as 4px left border and 10% opacity fill
- Use Poppins at 12–13px for cell content — it's optimized for this size
- Allow horizontal scroll on boards — never truncate columns to fit

### Don't
- Don't use more than 8 distinct status colors per board
- Don't round board cells — the grid must remain visually continuous
- Don't use drop shadows on status pills — flat fills read better at density
- Don't use blue for status meanings — reserve it for brand/interactive elements

## 8. Responsive Behavior
Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (full board)

- **375px**: card view default; board view requires horizontal scroll; bottom nav
- **768px**: condensed board view with 4 pinned columns; sidebar collapsed
- **1024px**: full board view; sidebar expanded at 260px
- **1440px**: wide board with all columns; dashboard grid 3-column

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: `#0073EA`
- Background: `#FFFFFF`
- Board bg: `#F6F7FB`
- Text: `#323338`
- Done: `#00C875`
- Stuck: `#FF158A`

### Example Component Prompts
- "A board row 40px height: task name Poppins 13px left, status pill 'Done' #00C875 Poppins 12px 600 uppercase white, person avatar 24px circle, date 12px gray — all separated by 1px rgba(0,0,0,0.06) cell borders"
- "A group header with 4px left border in #FF158A, 10% opacity pink row fill, Poppins 15px 600 group name, collapse chevron right"
- "A primary CTA button with #0073EA background, white Poppins 14px 600, 4px radius, 10px×20px padding"
