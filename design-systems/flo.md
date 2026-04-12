# Design System Inspired by Flo

## 1. Visual Theme & Atmosphere

Flo's design is intimate, premium, and deeply personal — a femtech product that must earn trust in one of the most private areas of a person's life. The visual language combines deep purple-violet gradients (`#8B5CF6` to `#6D28D9`) with soft dark surfaces to create a premium, spa-like atmosphere that feels protective and calm. This contrasts deliberately with clinical white medical apps — Flo communicates "personal companion" not "medical dashboard."

The primary metaphor is the moon cycle and water — organic, circular forms dominate the UI, from the circular calendar at the center of the product to the soft gradient orbs used as decorative elements. Typography is clean and modern: a neutral geometric sans-serif for data and labels, with occasional soft-weight type for emotional messaging. White text on dark surfaces ensures legibility while maintaining the premium dark aesthetic.

Premium membership ("Flo Premium") elevates the visual treatment further: deeper gradients, golden accents, and unlock animations reinforce the value of the subscription tier. The design system must simultaneously handle clinical data (cycle tracking, symptom logging) and emotional moments (pregnancy announcements, health milestones) with equal sensitivity.

**Key Characteristics:**
- Purple-violet gradient (`#8B5CF6` → `#6D28D9`) as primary brand expression
- Deep dark base (`#0D0D1A` to `#1A1A2E`) — premium dark-native
- Circular calendar UI as the signature centerpiece
- Soft lavender secondary (`#C4B5FD`) for labels and secondary accents
- Gold accent (`#F59E0B`) for Flo Premium upsell moments
- Rounded, organic shapes throughout (12px–50% radius)
- White text on dark: always high-contrast for health data legibility

## 2. Color Palette & Roles

### Primary
- **Flo Purple** (`#8B5CF6`): Active states, selected cycle days, CTAs
- **Deep Violet** (`#6D28D9`): Gradient terminus, premium accents
- **Dark Base** (`#0D0D1A`): App background, deep surfaces

### Interactive
- **Hover Violet** (`#7C3AED`): Button hover, pressed state
- **Lavender Secondary** (`#C4B5FD`): Labels, secondary links, hints
- **Selected** (`rgba(139,92,246,0.25)`): Calendar day selection highlight

### Surface
- **Card Dark** (`#1A1A2E`): Primary card backgrounds
- **Elevated Card** (`#252540`): Secondary cards, bottom sheets
- **Divider** (`rgba(196,181,253,0.15)`): Subtle soft-purple separators
- **Body Text** (`#FFFFFF`): Primary text on dark
- **Muted Text** (`#9CA3AF`): Secondary labels, hints

### Status & Health
- **Period Red** (`#F87171`): Menstruation indicator days
- **Fertile Green** (`#34D399`): Fertile window days
- **Ovulation Blue** (`#60A5FA`): Ovulation day marker
- **PMS Amber** (`#FBBF24`): PMS prediction zone
- **Premium Gold** (`#F59E0B`): Premium badge, upsell moments

## 3. Typography Rules

### Font Families
- **Primary**: `Inter` / SF Pro — clean geometric, all UI text
- **Display**: `Inter` at weight 700–800 — section titles and metric displays
- **Body**: `Inter` 400 — symptom descriptions, health insights

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Calendar Day | Inter | 16px | 600 | 1.00 | Circular day indicator |
| Cycle Phase | Inter | 28px | 700 | 1.10 | "Day 14 of your cycle" |
| Section Title | Inter | 20px | 700 | 1.25 | Dashboard sections |
| Insight Title | Inter | 17px | 600 | 1.35 | Health insight card title |
| Body Insight | Inter | 15px | 400 | 1.60 | Insight explanation text |
| Metric Number | Inter | 40px | 800 | 1.00 | Key health numbers |
| Metric Label | Inter | 13px | 500 | 1.20 | "days until next period" |
| Symptom Label | Inter | 14px | 500 | 1.30 | Symptom toggle options |
| Navigation | Inter | 11px | 600 | 1.00 | Bottom tab labels |
| Caption | Inter | 12px | 400 | 1.40 | Footnotes, citations |
| Premium Badge | Inter | 12px | 700 | 1.00 | "PRO" badge label |

## 4. Component Stylings

### Buttons

**Primary CTA**
- Background: `linear-gradient(135deg, #8B5CF6, #6D28D9)`
- Border-radius: 28px (pill)
- Padding: 16px 32px
- Font: Inter 16px/700, white
- Hover: brightness(1.08)

**Secondary Ghost**
- Border: `1px solid #8B5CF6`
- Color: `#C4B5FD`
- Background: transparent
- Radius: 28px

**Symptom Toggle (Pill chip)**
- Resting: `#252540` bg, `#9CA3AF` text
- Selected: `rgba(139,92,246,0.25)` bg, `#C4B5FD` text, `1px solid #8B5CF6` border
- Radius: 50px

### Cards & Containers
- Insight card: `#1A1A2E` bg, 16px radius, no border
- Purple accent bar: 3px top border `linear-gradient(90deg, #8B5CF6, #6D28D9)`
- Cycle calendar: circular SVG, period days in `#F87171`, fertile in `#34D399`

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Border Radius Scale
- Small (8px): Tags, inline badges
- Medium (12px): Symptom chips (alternative)
- Standard (16px): Insight cards, widget cards
- Large (24px): Modals, bottom sheets
- Pill (28px–50%): CTA buttons, cycle calendar

## 6. Depth & Elevation

- **Base**: `#0D0D1A` — no elevation
- **Cards**: `box-shadow: 0 4px 16px rgba(0,0,0,0.4)`
- **Purple glow**: `box-shadow: 0 0 32px rgba(139,92,246,0.25)` — selected/active
- **Modal**: `box-shadow: 0 24px 64px rgba(0,0,0,0.7)`
- **Gradient orb decor**: `filter: blur(60px)` opacity 0.3 — ambient background glow

## 7. Do's and Don'ts

### Do
- Use the purple gradient for CTAs and primary active states — it's the trust anchor
- Display the circular calendar as the hero UI element on the main dashboard
- Use warm, empathetic copy tones — this is a personal health product
- Color-code cycle phases consistently: red (period), green (fertile), blue (ovulation)
- Differentiate Free vs Premium with gold accents and locked states

### Don't
- Don't use clinical white backgrounds — the dark premium aesthetic is essential to Flo's brand trust
- Don't mix too many health status colors in one view — one phase per visual focus
- Don't show explicit medical diagnoses — always frame as "insights" not "diagnoses"
- Don't use aggressive urgency patterns — this audience requires calm, supportive UX

## 8. Responsive Behavior

Breakpoints: 320px, 375px, 428px (iPhone sizes), 768px, 1024px
- Mobile: Single-column, circular calendar hero, swipeable insight cards
- Tablet: Calendar + insights side by side
- Web app: 3-panel layout — nav, calendar, detail panel

## 9. Agent Prompt Guide

### Quick Color Reference
- Purple: `#8B5CF6`
- Deep violet: `#6D28D9`
- Background: `#0D0D1A`
- Card: `#1A1A2E`
- Muted text: `#9CA3AF`
- Period: `#F87171`, Fertile: `#34D399`

### Example Component Prompts
- "Build Flo cycle card: #1A1A2E bg, 16px radius, purple gradient 3px top border. Circular SVG calendar 200px. Phase label Inter 20px/700 white. Below: insight text 15px/400 #9CA3AF."
- "Create symptom toggle chips: #252540 bg resting, 50px radius, #9CA3AF text. Selected: rgba(139,92,246,0.25) bg, #8B5CF6 border, #C4B5FD text."
- "Design gradient CTA: linear-gradient(135deg, #8B5CF6, #6D28D9), 28px radius, Inter 16px/700 white."
