# Design System Inspired by MyFitnessPal

## 1. Visual Theme & Atmosphere

MyFitnessPal's design language centers on clarity, density, and motivation. The primary navy blue (`#005594`) anchors a trustworthy, clinical aesthetic that signals data accuracy and health authority. Against white backgrounds (`#FFFFFF`) and light gray surfaces (`#F5F7FA`), the navy creates strong contrast that makes dense calorie logs and macro breakdowns scannable at a glance. The palette is deliberately restrained — this is utility software where the user's data is the hero, not decorative chrome.

Typography follows a strict Roboto hierarchy, leveraging the typeface's high legibility at small sizes to accommodate the dense tabular data that defines the core logging experience. Tight line heights and compact spacing allow maximum information density without overwhelming the user. Data visualization — particularly the signature macro donut charts in teal (`#00B0B9`), carbs orange (`#E8823A`), and protein pink (`#E84393`) — provides the only moments of chromatic richness, making nutritional insights visually immediate.

The interface mood is purposeful and clinical with bursts of achievement energy. Progress bars animate smoothly; calorie remaining counters use green (`#4CAF50`) for positive and red (`#E53935`) for deficit states. The overall atmosphere says: "your health data, presented with precision."

**Key Characteristics:**
- Primary navy `#005594` used exclusively for primary actions, brand headers, and nav
- White `#FFFFFF` base with light gray `#F5F7FA` surface differentiation
- Roboto across all text — Regular (400), Medium (500), Bold (700)
- Macro donut chart palette: teal `#00B0B9` (fat), orange `#E8823A` (carbs), pink `#E84393` (protein)
- Dense 8px base grid — compact 12px / 14px body text for data tables
- Success green `#4CAF50` / warning orange `#FF9800` / error red `#E53935` status system
- Divider lines `#E0E4E9` separate log entries without heavy visual weight
- Card elevation via shadow `0 1px 3px rgba(0,0,0,0.12)` — flat-adjacent, minimal depth

## 2. Color Palette & Roles

### Primary
- **Navy Blue** (`#005594`): Brand anchor — nav bar, primary buttons, section headers, progress fills
- **White** (`#FFFFFF`): Page backgrounds, card faces, input fields
- **Light Gray** (`#F5F7FA`): Alternating table rows, screen backgrounds, section separators

### Macro Colors
- **Fat Teal** (`#00B0B9`): Fat macro segment in donut, fat grams text emphasis
- **Carbs Orange** (`#E8823A`): Carbs macro segment, primary chart accent
- **Protein Pink** (`#E84393`): Protein macro segment, strength-related highlights
- **Calorie Gold** (`#F5A623`): Calorie summary highlight, achievement callouts

### Status
- **Success Green** (`#4CAF50`): Calories remaining positive, goal achieved states
- **Warning Orange** (`#FF9800`): Near limit, approaching goal warnings
- **Error Red** (`#E53935`): Over-calorie budget, deficit alerts
- **Deficit Dark Red** (`#B71C1C`): Critical calorie over states

### Interactive
- **Navy Hover** (`#004478`): Primary button hover darkening
- **Navy Light** (`#E3F0FA`): Button ghost hover state background
- **Teal CTA** (`#00B0B9`): Premium/upgrade CTAs, secondary actions

### Surface
- **Table Row Alt** (`rgba(245, 247, 250, 1.0)`): Alternating log rows
- **Divider** (`rgba(224, 228, 233, 1.0)`): Row separators, section lines
- **Card Shadow** (`rgba(0, 0, 0, 0.08)`): Subtle card lift

## 3. Typography Rules

### Font Families
- **Roboto**: `'Roboto', sans-serif` — All UI text, data tables, input labels, navigation
- **Roboto Condensed**: `'Roboto Condensed', sans-serif` — Compact data headers, macro labels
- **System fallback**: `-apple-system, BlinkMacSystemFont, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| App Header | Roboto | 20px | 700 | 28px | White on navy nav |
| Section Title | Roboto | 18px | 700 | 24px | Navy `#005594` |
| Card Header | Roboto | 16px | 600 | 22px | Dark `#1A1A2E` |
| Body / Log Entry | Roboto | 14px | 400 | 20px | Dark gray `#333333` |
| Data Label | Roboto Condensed | 12px | 500 | 16px | Gray `#666666`, uppercase |
| Macro Value | Roboto | 24px | 700 | 28px | Macro color per nutrient |
| Calorie Counter | Roboto | 36px | 700 | 40px | Navy or status color |
| Table Cell | Roboto | 13px | 400 | 18px | Compact log rows |
| Caption / Meta | Roboto | 11px | 400 | 16px | Light gray `#999999` |
| Button Label | Roboto | 14px | 700 | 20px | Uppercase tracking 0.5px |
| Input Placeholder | Roboto | 14px | 400 | 20px | `#AAAAAA` |
| Tab Label | Roboto | 12px | 500 | 16px | Active navy, inactive gray |

## 4. Component Stylings

### Buttons

**Primary Button**
```
background: #005594
color: #FFFFFF
font: Roboto 14px 700 uppercase tracking-wide
padding: 12px 24px
border-radius: 4px
border: none
hover: background #004478
active: background #003366
shadow: 0 2px 4px rgba(0, 85, 148, 0.3)
```

**Secondary / Ghost Button**
```
background: transparent
color: #005594
border: 2px solid #005594
padding: 10px 22px
border-radius: 4px
hover: background #E3F0FA
```

**CTA / Premium Button**
```
background: #00B0B9
color: #FFFFFF
border-radius: 4px
padding: 12px 24px
font: Roboto 14px 700
```

**Log Add Button (+ icon)**
```
background: #005594
color: white
width: 48px
height: 48px
border-radius: 50%
shadow: 0 3px 8px rgba(0, 85, 148, 0.35)
position: fixed bottom-right
```

### Cards & Containers

**Daily Summary Card**
```
background: #FFFFFF
border-radius: 8px
padding: 16px
shadow: 0 1px 4px rgba(0,0,0,0.10)
border: none
```

**Log Entry Row**
```
background: #FFFFFF (odd) / #F5F7FA (even)
padding: 12px 16px
border-bottom: 1px solid #E0E4E9
min-height: 48px
```

**Macro Donut Card**
```
background: #FFFFFF
border-radius: 12px
padding: 20px
shadow: 0 2px 8px rgba(0,0,0,0.08)
donut-size: 120px center
legend: right-aligned labels with color dots
```

**Nutrient Progress Bar**
```
height: 6px
background-track: #E0E4E9
fill: #005594 (default) / #4CAF50 (goal met) / #E53935 (over)
border-radius: 3px
animation: width ease-out 0.4s
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Component padding: 16px standard, 12px compact (data rows)
- Section gaps: 24px between content sections
- List item height: 48px minimum touch target

### Border Radius Scale
- `2px` — Input fields, table cells (near-flat)
- `4px` — Buttons, chips, small badges
- `8px` — Standard cards, modals
- `12px` — Summary cards, donut card containers
- `50%` — Avatar images, FAB add button

### Grid
- Mobile: single column, 16px horizontal margins
- Tablet: 2-column log + summary split at 768px
- Web: left sidebar nav (240px) + main content (flexible)

## 6. Depth & Elevation

```
Level 0 - Flat:      no shadow (table rows, backgrounds)
Level 1 - Card:      0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)
Level 2 - Modal:     0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08)
Level 3 - FAB:       0 4px 16px rgba(0,85,148,0.30)
Level 4 - Drawer:    0 8px 24px rgba(0,0,0,0.20)
Nav Bar:             0 2px 4px rgba(0,0,0,0.12) (persistent shadow)
```

## 7. Do's and Don'ts

### Do
- Use `#005594` navy exclusively for primary interactive elements and brand surfaces
- Keep macro values large (24px+) and colored by nutrient type for instant scanning
- Alternate row backgrounds (`#FFFFFF` / `#F5F7FA`) in all food log tables
- Use status colors (`#4CAF50` / `#E53935`) contextually for calorie remaining states
- Display calorie counters prominently at 36px+ — the core metric deserves visual priority
- Animate progress bars on data load with `ease-out 0.4s` for perceived responsiveness

### Don't
- Don't mix macro colors decoratively — teal=fat, orange=carbs, pink=protein, always
- Don't use border-radius above 12px — the clinical aesthetic requires restrained softness
- Don't use typefaces other than Roboto in the core app UI
- Don't place CTAs or ads inline in food log rows — preserve data table integrity

## 8. Responsive Behavior

**Breakpoints:**
- `320px` — Minimum mobile: single-column, full-width cards, 12px margins
- `375px` — Standard mobile: 16px margins, standard component sizing
- `768px` — Tablet: 2-column layout (diary left, summary right), expanded macro cards
- `1024px` — Desktop web: persistent left nav 240px, content max-width 960px
- `1280px` — Large desktop: max-width 1200px centered

**Adaptive Patterns:**
- Macro donut: 120px mobile → 160px tablet → 200px desktop
- Nav: bottom tab bar mobile → left sidebar desktop
- Food log: full-width rows mobile → fixed-width table desktop with sortable columns
- Calorie counter: centered hero mobile → top summary bar desktop

## 9. Agent Prompt Guide

### Quick Color Reference
```
Primary Navy:    #005594   — buttons, nav, brand
Success Green:   #4CAF50   — positive states, goal met
Error Red:       #E53935   — over budget, deficit
Fat Teal:        #00B0B9   — fat macro, CTA secondary
Carbs Orange:    #E8823A   — carbs macro
Protein Pink:    #E84393   — protein macro
```

### Example Component Prompts
- "A food diary log row with meal name left, calories right, divider bottom, alternating white/light-gray rows, Roboto 14px, MyFitnessPal navy accent"
- "A circular macro donut chart 120px with three segments: teal fat, orange carbs, pink protein; centered remaining calorie count 36px bold navy"
- "A daily calorie summary card: white card 8px radius, shadow 0 1px 4px, top stat '1,847 cal remaining' in 36px bold green, three macro bars below in respective macro colors"
- "A navy blue mobile navigation bar with white Roboto labels and active state underline in white, shadow 0 2px 4px below"
