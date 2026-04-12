# Design System Inspired by Trello

## 1. Visual Theme & Atmosphere

Trello pioneered the kanban board as consumer software — and its design system reflects that origin: approachable, tactile, and clear. The interface is built on white and light neutral surfaces, with Trello Blue (`#0052CC`) anchoring the brand identity across headers, active states, and primary calls to action. The aesthetic is firmly SaaS productivity: clean, scannable, and optimized for information density without feeling clinical.

Cards are the fundamental unit of information — small rectangles with subtle shadows that feel physical, like paper cards pinned to a corkboard. Color labels are prominent: bright, high-saturation strips at the top of cards that provide immediate categorical signal without requiring text. The drag-and-drop nature of the interface is communicated through visual affordances: cards lift on hover (deeper shadow), columns accept drop targets with a blue highlight border, and the whole board feels malleable and organizational.

Background customization is a unique Trello brand element — users can set full-board backgrounds (solid colors, gradients, photography). The system is designed to remain functional and readable over any background. Cards maintain consistent white surfaces regardless of board background, and the header bar adapts between light and dark modes dynamically. Lato is the primary typeface: humanist, readable, and friendly — matching Trello's promise that project management doesn't have to feel like work.

**Key Characteristics:**
- Trello Blue (`#0052CC`) for all primary interactive elements and brand
- White (`#FFFFFF`) card surfaces — consistent regardless of board background
- Lato typeface — humanist sans, weights 400 and 700 primarily
- Color label strips in 14 distinct hues for card categorization
- Cards have `2px` rounded corners and `0 1px 0 rgba(9,30,66,0.25)` shadow
- Board column (list) width: `272px`, fixed
- Drag-and-drop ghost: 8° rotation, 0.9 opacity, elevated shadow
- Horizontal scrolling board with sticky list headers

## 2. Color Palette & Roles

### Primary
- **Trello Blue** (`#0052CC`): Primary button, link, active state, focused input border
- **White** (`#FFFFFF`): Card surface, page background (when no board bg)
- **Dark Ink** (`#172B4D`): Primary text color on white surfaces

### Interactive
- **Blue Hover** (`#0065FF`): Button hover, link hover
- **Blue Pressed** (`#0747A6`): Button active, pressed state
- **Danger Red** (`#DE350B`): Delete actions, error states
- **Danger Hover** (`#FF5630`): Destructive action hover

### Surface
- **Board Gutter** (`#0079BF`): Default board background (medium blue)
- **List Background** (`rgba(9,30,66,0.08)`): Column background on light boards
- **List Dark** (`rgba(0,0,0,0.24)`): Column background on dark/photo boards
- **Card Shadow** (`rgba(9,30,66,0.25)`): Standard card box shadow
- **Overlay** (`rgba(9,30,66,0.54)`): Modal backdrop, board overlay

### Text
- **Primary** (`#172B4D`): Card titles, column names, body text
- **Secondary** (`#5E6C84`): Metadata, card member count, due dates
- **Subtle** (`#8993A4`): Placeholder text, disabled labels
- **Inverse** (`#FFFFFF`): Text on blue backgrounds

### Color Labels (14 system colors)
- Green (`#61BD4F`), Yellow (`#F2D600`), Orange (`#FF9F1A`), Red (`#EB5A46`)
- Purple (`#C377E0`), Blue (`#0079BF`), Sky (`#00C2E0`), Lime (`#51E898`)
- Pink (`#FF78CB`), Black (`#344563`), and 4 additional semantic tones

## 3. Typography Rules

### Font Families
- **Primary**: `"Lato", -apple-system, "Helvetica Neue", sans-serif` — all UI text
- **Monospace**: `"Courier New", monospace` — code blocks in card descriptions

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Board Name | Lato | 18px | 700 | 24px | Header bar, truncated |
| List Name | Lato | 15px | 700 | 20px | Column header, editable |
| Card Title | Lato | 14px | 400 | 20px | Card face text |
| Card Label | Lato | 12px | 700 | 14px | Color label text (optional) |
| Checklist Item | Lato | 14px | 400 | 20px | Normal/strikethrough done |
| Due Date | Lato | 12px | 400 | 16px | Date badge on card |
| Description | Lato | 14px | 400 | 20px | Card back, markdown rendered |
| Button Label | Lato | 14px | 700 | 20px | Primary/secondary CTA |
| Nav Label | Lato | 14px | 400 | 20px | Top navigation links |
| Member Name | Lato | 12px | 400 | 16px | Comment author, tooltip |
| Section Header | Lato | 12px | 700 | 16px | Card back section labels, uppercase |

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#0052CC`
- Text: `#FFFFFF`, 14px, Lato 700
- Padding: `8px 16px`
- Border radius: `3px`
- Hover: background `#0065FF`
- Active: background `#0747A6`
- Box shadow: none

**Secondary Button**
- Background: `rgba(9,30,66,0.08)`
- Text: `#172B4D`, 14px, Lato 700
- Padding: `8px 16px`
- Border radius: `3px`
- Hover: background `rgba(9,30,66,0.16)`

**Danger Button**
- Background: `#DE350B`
- Text: `#FFFFFF`
- Same dimensions as primary
- Hover: `#FF5630`

**Add Card Button**
- Background: `transparent`
- Text: `rgba(9,30,66,0.70)`, 14px, weight 400
- Hover: background `rgba(9,30,66,0.08)`, text `#172B4D`
- Padding: `8px`
- Border radius: `3px`
- Prefix: `+` symbol

### Cards & Containers

**Card**
- Background: `#FFFFFF`
- Border radius: `3px`
- Box shadow: `0 1px 0 rgba(9,30,66,0.25)`
- Padding: `8px 8px 4px`
- Hover: box-shadow `0 4px 8px -2px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)`, cursor `grab`
- Active (dragging): rotate `5deg`, opacity `0.85`, shadow `0 8px 16px -4px rgba(9,30,66,0.45)`
- Color label strip: `4px` height, full width, border-radius `3px 3px 0 0`

**List (Column)**
- Width: `272px`, flex-shrink 0
- Background: `#EBECF0`
- Border radius: `3px`
- Padding: `8px`
- Max height: calc(100vh - 88px), overflow-y auto

**List Header**
- Height: `40px`
- Font: Lato 700, 15px
- Color: `#172B4D`
- Editable on click

**Add Card Placeholder (Drop Target)**
- Background: `rgba(0,82,204,0.12)`
- Border: `2px dashed #0052CC`
- Border radius: `3px`
- Height matches card height estimate

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 24, 32, 40, 48, 64px`
- Card vertical padding: `8px`
- Card horizontal padding: `8px`
- Gap between cards: `8px`
- Gap between lists: `8px`
- Board padding: `8px 8px 0`

### Board Layout
- Header bar: 40px height, sticky
- Board horizontal scroll: lists in flex row, horizontal overflow scroll
- List width: `272px` (fixed, non-responsive)
- Add List button: same width `272px` as list

### Border Radius Scale
- `2px` — color labels, member avatars (square variant)
- `3px` — cards, lists, buttons, input fields
- `50%` — member avatar circles
- `100px` — pills for tags/badges

## 6. Depth & Elevation

### Shadow Scale
- **Card Default** — `0 1px 0 rgba(9,30,66,0.25)`
- **Card Hover** — `0 4px 8px -2px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)`
- **Card Dragging** — `0 8px 16px -4px rgba(9,30,66,0.45)`
- **Modal** — `0 8px 16px -4px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)`
- **Dropdown** — `0 4px 8px -2px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)`

## 7. Do's and Don'ts

### Do
- Keep list width at exactly `272px` — deviation breaks the board's spatial familiarity
- Use color labels for quick visual categorization — they're the fastest scanning aid
- Apply all shadow values exactly — the specific shadow formula is a Trello signature
- Use Lato 700 for list names and buttons — consistency across the board is essential
- Maintain card corner radius at `3px` — rounder breaks the paper-card metaphor

### Don't
- Don't change card background away from white — it must be consistent on all board backgrounds
- Don't add animations beyond lift/drop on drag — the UI should feel instant and direct
- Don't truncate card titles on card face at less than 2 lines — users need to read them
- Don't use font weights outside 400/700 for Lato — the system is binary
- Don't use shadows for decorative depth — only for interactive states

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — mobile: single-column view, swipe between lists, full-screen card
- `768px` — tablet: 2-column board, side-by-side lists
- `1024px` — desktop: horizontal scroll with 3-4 visible lists
- `1280px+` — wide desktop: show 5+ lists, sidebar calendar/timeline toggle

**Platform Adaptations:**
- Mobile: swipe horizontally between lists instead of scroll
- Card detail: full-screen modal on mobile, right-panel slide on desktop
- Board switcher: bottom sheet on mobile, left sidebar on desktop
- Drag-and-drop: touch events on mobile, mouse events on desktop

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary Blue: `#0052CC`
- Background: `#FFFFFF`
- List Background: `#EBECF0`
- Text Primary: `#172B4D`
- Text Secondary: `#5E6C84`
- Card Shadow: `rgba(9,30,66,0.25)`

### Example Component Prompts
- "Design a Trello kanban board column with light grey #EBECF0 background, 272px width, stack of white cards with 3px radius and 0 1px 0 rgba(9,30,66,0.25) shadow, Lato 14px card titles in #172B4D"
- "Create a draggable Trello card with white background, 3px radius, color label strip in green at top, title text, member avatar, due date badge, and elevated shadow for drag state"
- "Build a Trello card detail modal with left content area and right sidebar, Lato typography, checklist with progress bar, Trello Blue primary button"
- "Design a Trello board header bar with blue background, board name in white Lato bold, star/filter actions, member avatars row, share button"
