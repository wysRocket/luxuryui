# Design System Inspired by Asana

## 1. Visual Theme & Atmosphere

Asana's visual language bridges productivity and personality. Where most project management tools feel clinical or austere, Asana injects warmth through a coral/salmon palette (`#F06A6A`), generous white space, and the unmistakable celebration moments — the unicorn, phoenix, and narwhal confetti animations that fire when you complete a task. The brand personality is: "work is serious, but the experience of doing it doesn't have to be." This playful confidence runs through every design decision.

Sofia Pro is the typeface — a geometric sans-serif with rounded terminals that feels friendly without sacrificing readability. It pairs with an 8px base grid that yields generous but structured layouts. The primary surface is pure white (`#FFFFFF`) for content areas, offset by `#F6F8F9` cool-gray backgrounds on panels and sidebars. The coral accent (`#F06A6A`) commands all primary CTAs and active states; Asana also deploys a rich gradient from coral-pink (`#FC636B`) to a warm peach on hero surfaces and illustration backgrounds.

Shadows are soft and diffuse — think `0 1px 4px rgba(0,0,0,0.1)` — reinforcing the light, approachable brand personality. There are no harsh borders on interactive elements; instead, card separation comes from `1px solid #E8ECEE` dividers that feel structural without being heavy.

**Key Characteristics:**
- Primary accent: `#F06A6A` (coral/salmon)
- Background: `#FFFFFF` (content), `#F6F8F9` (panels)
- Sidebar: `#1E1F27` dark (or white in light theme variant)
- Text primary: `#151B26`
- Text secondary: `#6D7886`
- Border/divider: `#E8ECEE`
- Success green: `#00C781`
- Font: Sofia Pro across all text

## 2. Color Palette & Roles

### Primary
- **Asana Coral** (`#F06A6A`): Primary buttons, active nav highlights, task completion checkmarks
- **Asana Pink-Coral** (`#FC636B`): Gradient origin for hero sections and marketing surfaces
- **Midnight Dark** (`#1E1F27`): Sidebar background in default dark-sidebar theme

### Interactive
- **Coral Hover** (`#D94F4F`): Primary button hover — 15% darkened coral
- **Link Blue** (`#4A90D9`): In-line hyperlinks within descriptions and comments
- **Focus Ring** (`rgba(240,106,106,0.4)`): Keyboard focus outline on interactive elements

### Surface
- **White** (`#FFFFFF`): Primary content background
- **Cool Gray** (`#F6F8F9`): Panel backgrounds, project list sidebar inner areas
- **Border Gray** (`#E8ECEE`): Card borders, divider lines, input outlines
- **Overlay** (`rgba(0,0,0,0.5)`): Modal backdrop

## 3. Typography Rules

### Font Families
- **Sofia Pro**: `"Sofia Pro", -apple-system, BlinkMacSystemFont, sans-serif` — all UI text
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Page Title | Sofia Pro | 32px | 700 | 40px | Project name, board header |
| H1 | Sofia Pro | 24px | 700 | 32px | Section headers within projects |
| H2 | Sofia Pro | 20px | 700 | 28px | Modal titles, panel headers |
| H3 | Sofia Pro | 16px | 600 | 24px | Card headings, widget titles |
| Body | Sofia Pro | 14px | 400 | 22px | Task descriptions, comments |
| Task Name | Sofia Pro | 14px | 500 | 20px | List item primary text |
| Secondary / Metadata | Sofia Pro | 13px | 400 | 18px | `#6D7886` assignee, due date |
| Nav Label | Sofia Pro | 13px | 600 | 18px | Sidebar navigation items |
| Badge / Count | Sofia Pro | 11px | 700 | 14px | Notification count pills |
| Small / Caption | Sofia Pro | 12px | 400 | 16px | Timestamps, field labels |
| Button | Sofia Pro | 14px | 700 | 20px | All button text |

## 4. Component Stylings

### Buttons
**Primary:**
- Background: `#F06A6A`
- Border: none
- Border radius: 6px
- Padding: `8px 16px`
- Font: 14px / 700 / white
- Hover: background `#D94F4F`, box-shadow `0 2px 8px rgba(240,106,106,0.4)`
- Transition: `all 0.15s ease`

**Secondary:**
- Background: `#FFFFFF`
- Border: `1px solid #C8D0D8`
- Border radius: 6px
- Color: `#151B26`
- Hover: background `#F6F8F9`, border-color `#98A5B3`

**Ghost (Danger):**
- Background: `transparent`
- Color: `#F06A6A`
- Hover: background `rgba(240,106,106,0.08)`

### Cards & Containers
**Task Card (Board view):**
- Background: `#FFFFFF`
- Border: `1px solid #E8ECEE`
- Border radius: 8px
- Box-shadow: `0 1px 4px rgba(0,0,0,0.08)`
- Padding: 12px
- Hover: box-shadow `0 2px 8px rgba(0,0,0,0.12)`, transform `translateY(-1px)`

**Project Panel:**
- Background: `#F6F8F9`
- Border-right: `1px solid #E8ECEE`
- No shadow — flat panel

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Task row height: 40px
- Sidebar width: 248px
- Top bar height: 52px

### Border Radius Scale
- Micro (checkbox, tag): 3px
- Default (button, card, input): 6px–8px
- Large (modal, sheet): 12px
- Avatar: 50%
- Pill (status badge): 24px

## 6. Depth & Elevation

Asana's elevation is intentionally light — nothing competes with the colorful task and project content:

**Level 0 — Flat panel:**
```
/* No shadow; border-based separation */
border: 1px solid #E8ECEE;
```

**Level 1 — Card resting:**
```
box-shadow: 0 1px 4px rgba(0,0,0,0.08);
```

**Level 2 — Card hover / dropdown:**
```
box-shadow: 0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
```

**Level 3 — Modal:**
```
box-shadow: 0 8px 32px rgba(0,0,0,0.16);
```

## 7. Do's and Don'ts

### Do
- Use `#F06A6A` coral exclusively for primary actions — it's the brand's strongest signal
- Apply `#00C781` green for task completion checkmarks and success states
- Use `#F6F8F9` cool-gray for sidebar and panel backgrounds to separate from white content
- Keep border radius at 6–8px — the brand leans rounded but not pill-shaped
- Trigger celebration animations on task completion — these are core to the brand personality

### Don't
- Don't use harsh `1px solid` borders on cards — prefer light shadow at resting state
- Don't replicate the coral on informational text — it dilutes the CTA hierarchy
- Don't use pure black for text — `#151B26` provides the right warmth for Sofia Pro
- Don't mix the dark sidebar with a gray background — contrast must be `#1E1F27` on `#FFFFFF`

## 8. Responsive Behavior

Breakpoints:
- Mobile: 0–640px — sidebar collapses to bottom sheet; task list full-width
- Tablet: 641–1024px — sidebar overlay on tap; board view 2-column
- Desktop: 1025–1440px — 248px fixed sidebar, board or list view full-width
- Wide: 1441px+ — sidebar stays 248px; content area expands; board shows more columns

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand Coral: `#F06A6A`
- Background: `#FFFFFF`
- Panel: `#F6F8F9`
- Sidebar Dark: `#1E1F27`
- Text Primary: `#151B26`
- Text Secondary: `#6D7886`
- Success: `#00C781`
- Divider: `#E8ECEE`

### Example Component Prompts
- "Asana-style kanban board card: white background, 1px #E8ECEE border, 8px radius, Sofia Pro 14px task title in #151B26, coral (#F06A6A) tag pill, avatar circle, due date in #6D7886 — light shadow on hover"
- "Asana left sidebar: #1E1F27 dark background, project list items in white Sofia Pro 13px semi-bold, coral active indicator dot (#F06A6A), plus icon for adding projects, avatar and workspace name at top"
- "Asana task detail modal: white surface, 12px radius, 32px padding, H2 modal title in #151B26, coral primary button, secondary ghost button, assignee avatar row, due date picker in gray field"
