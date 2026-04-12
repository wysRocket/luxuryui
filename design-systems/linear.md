# Design System Inspired by Linear

## 1. Visual Theme & Atmosphere

Linear's design system is perhaps the most influential in modern SaaS UI — a near-perfect expression of the philosophy that excellent software should feel inevitable. The palette is near-black (`#1C1C1E`) with purple-tinted accents (`#5E6AD2`) and a surface hierarchy so subtle it's defined by 4–5% lightness increments rather than hard borders. The result is a UI that feels simultaneously minimal and information-dense.

Inter is the sole typeface — chosen for its pixel-perfect hinting, consistent weight rendering, and extraordinary legibility at 12–13px, which is where Linear's dense issue list views live. The type scale is compact and restrained, reflecting a keyboard-first philosophy where power users rarely look at labels — they use shortcuts. Every UI element is sized precisely: 32px inputs, 28px list rows, 20px icon targets.

Linear is famous for its performance aesthetics: instant feedback, 60fps transitions, zero jank. Animations are easing-function precise (cubic-bezier curves), never bouncy or playful. Hover states reveal themselves in 80–100ms; loading states are skeleton screens, never spinners. The design communicates that the team respects the user's time above all else.

**Key Characteristics:**
- Brand purple: `#5E6AD2` — accent on active states, CTAs, selected items
- Near-black: `#1C1C1E` — app shell background in dark mode
- Inter — sole typeface; pixel-perfect at 12–13px
- 4px base grid; everything divisible by 4
- Ultra-subtle surface layering: 4–6% lightness steps
- Hairline borders: `rgba(255,255,255,0.07)` — almost invisible
- Icon style: custom 16px, 1.5px stroke, geometric
- Keyboard shortcut hints visible on all commands

## 2. Color Palette & Roles

### Primary
- **Linear Purple** (`#5E6AD2`): active items, selected states, primary CTA
- **Background** (`#1C1C1E`): app shell
- **Surface 1** (`#232326`): sidebar, panel backgrounds
- **Surface 2** (`#2C2C30`): cards, list items
- **Surface 3** (`#353539`): hover state, dropdown backgrounds
- **Text Primary** (`#E8E8ED`): headings, active labels
- **Text Secondary** (`#9898A6`): metadata, timestamps, keyboard hints

### Interactive
- **Purple Hover** (`#4F5BBF`): CTA hover, active item darker
- **Focus Ring** (`rgba(94,106,210,0.40)`): keyboard focus outline
- **Destructive** (`#E5484D`): delete, irreversible actions
- **Success** (`#46A758`): completed issues, done states

### Surface
- **Border Subtle** (`rgba(255,255,255,0.07)`): separators
- **Border Default** (`rgba(255,255,255,0.12)`): input outlines
- **Overlay** (`rgba(0,0,0,0.50)`): modal backdrops

## 3. Typography Rules

### Font Families
- **Inter**: `"Inter", sans-serif` — sole typeface for all text at all sizes

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Display | Inter | 28px | 700 | 1.15 | Onboarding only |
| H1 | Inter | 22px | 700 | 1.2 | Project/team titles |
| H2 | Inter | 18px | 600 | 1.25 | Section headers |
| H3 | Inter | 15px | 600 | 1.3 | Group headers |
| Body | Inter | 14px | 400 | 1.5 | Descriptions, comments |
| List Item | Inter | 13px | 400 | 1.4 | Issue titles — the core UI |
| Label | Inter | 12px | 500 | 1.3 | Status, priority labels |
| Micro | Inter | 11px | 400 | 1.3 | Keyboard hints, timestamps |
| Keyboard | Inter | 11px | 500 | 1.0 | kbd style, `background: #353539`, 4px radius |

## 4. Component Stylings

### Buttons
- **Primary**: `background: #5E6AD2`, `color: #FFFFFF`, `border-radius: 6px`, `padding: 8px 16px`, `font: Inter 14px 500`, `height: 32px`
- **Hover**: `background: #4F5BBF`
- **Ghost**: `background: transparent`, `color: #E8E8ED`, hover `background: #353539`, `border-radius: 6px`
- **Destructive**: `background: #E5484D`, `color: #FFFFFF`
- **Icon Button**: 28px×28px, `border-radius: 6px`, hover `background: #353539`

### Cards & Containers
- **Issue Row**: `padding: 8px 12px`, `border-bottom: 1px solid rgba(255,255,255,0.07)`, hover `background: #2C2C30`
- **Panel**: `background: #232326`, `border-right: 1px solid rgba(255,255,255,0.07)`
- **Command Palette**: `background: #2C2C30`, `border-radius: 12px`, `border: 1px solid rgba(255,255,255,0.12)`, `box-shadow: 0 8px 48px rgba(0,0,0,0.70)`, max-width 640px
- **Modal**: `background: #232326`, `border-radius: 10px`, `box-shadow: 0 16px 64px rgba(0,0,0,0.60)`

## 5. Layout Principles

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Sidebar width: 220px
- Issue list row height: 36px
- Panel header height: 48px

### Border Radius Scale
- **4px** — badges, status labels, keyboard hints
- **6px** — buttons, inputs
- **8px** — dropdowns, context menus
- **10px** — modals
- **12px** — command palette

## 6. Depth & Elevation

- **Level 0** (shell): `#1C1C1E` — background
- **Level 1** (panel): `#232326` — sidebar, panels
- **Level 2** (surface): `#2C2C30` — list items, cards
- **Level 3** (hover): `#353539` — hover states, dropdowns
- **Level 4** (overlay): `box-shadow: 0 16px 64px rgba(0,0,0,0.60)` — modals
- **Command Palette**: `box-shadow: 0 8px 48px rgba(0,0,0,0.70)` — highest drama

## 7. Do's and Don'ts

### Do
- Use exactly Inter at pixel-precise sizes — no size between the defined scale
- Keep hover states instant: 80ms transition, ease
- Show keyboard shortcuts inline for every command
- Use `rgba(255,255,255,0.07)` for separators — never a visible border color
- Maintain 4px grid discipline for every measurement

### Don't
- Don't use bounce easing — Linear animations are cubic-bezier, never spring
- Don't use spinners — skeleton screens or instant optimistic updates only
- Don't add decorative elements — no gradients, no illustrations, no photography
- Don't exceed 12px border-radius in main UI chrome

## 8. Responsive Behavior
Breakpoints: 768px (tablet), 1024px (desktop), 1440px (wide)

- **768px**: sidebar collapses to icon rail (48px); full-screen issue detail on tap
- **1024px**: standard 3-panel: sidebar | list | detail
- **1440px**: wider detail panel; enhanced sidebar with project counts

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand: `#5E6AD2`
- Background: `#1C1C1E`
- Surface: `#232326`
- Text: `#E8E8ED`
- Secondary text: `#9898A6`
- Border: `rgba(255,255,255,0.07)`

### Example Component Prompts
- "An issue list row with #2C2C30 hover background, Inter 13px text #E8E8ED, 36px height, priority icon 16px left, status label 12px #9898A6, 4px status color dot"
- "A command palette with #2C2C30 background, 12px radius, blur backdrop, #5E6AD2 selected item highlight, Inter 14px, shadow 0 8px 48px rgba(0,0,0,0.70)"
- "A primary button with #5E6AD2 fill, Inter 14px 500, 6px radius, 32px height, 8px×16px padding"
