# Design System Inspired by Duolingo

## 1. Visual Theme & Atmosphere

Duolingo's design is relentlessly cheerful, gamified, and approachable — built to make language learning feel more like a game than homework. The signature Duolingo Green (`#58CC02`) dominates interactive elements, progress indicators, and the iconic feather-shaped logo. Below it, a complementary dark green (`#58A700`) provides shadow and depth for the classic button "push" effect — the 3D raised button that has become one of Duolingo's most recognizable design patterns.

The surface is bright white (`#FFFFFF`) with warm off-white card backgrounds (`#F7F7F7`). Typography is set in Nubank DIN or a custom Duolingo-specific rounded sans-serif that feels approachable without being childish. The hierarchy is playful but deliberate: XP counts, streak flames, and hearts use bold numeric displays with emoji-adjacent iconography to reinforce the game loop at every step.

Motion is central — correct answers trigger celebration animations, incorrect ones shake, and the owl mascot (Duo) reacts expressively. The design communicates constant positive reinforcement, treating every micro-interaction as a reward moment.

**Key Characteristics:**
- Duolingo Green (`#58CC02`) + dark shadow green (`#58A700`) for 3D button effect
- Bright white surfaces (`#FFFFFF`) with light gray card fills (`#F7F7F7`)
- Bold rounded sans-serif (Feather Bold / DIN Rounded) for all primary UI
- Red lives/error (`#FF4B4B`), gold XP/streak (`#FFC800`), blue skill (`#1CB0F6`)
- 3D "push" button: main color top + darker shade bottom border
- Heavy use of illustration and character animation (Duo owl)
- 16px border radius on most interactive elements; full pill on some CTAs
- Progress bar in green with XP counter — always visible during lessons

## 2. Color Palette & Roles

### Primary
- **Duolingo Green** (`#58CC02`): CTAs, correct answers, progress, streak
- **Green Shadow** (`#58A700`): Button bottom border / 3D shadow effect
- **Pure White** (`#FFFFFF`): Primary surface, backgrounds

### Interactive
- **Hover Green** (`#61E002`): Button hover state
- **Error Red** (`#FF4B4B`): Wrong answers, hearts, error states
- **Correct Teal** (`#00B7B7`): Alternative correct flash

### Surface
- **Light Gray** (`#F7F7F7`): Card backgrounds, lesson tiles
- **Border Gray** (`#E5E5E5`): Card borders, dividers
- **Dark Text** (`#3C3C3C`): Primary body text
- **Muted Text** (`#777777`): Secondary labels, hints

### Status Colors
- **XP Gold** (`#FFC800`): Streak counter, XP display, crown icons
- **Blue Skill** (`#1CB0F6`): Progress rings, skill icons, links
- **Purple** (`#CE82FF`): Legendary league, special achievements
- **Orange** (`#FF9600`): Streak shield, bonus items

## 3. Typography Rules

### Font Families
- **Primary**: `DinRound` / `Nunito` (rounded variant) — all UI text
- **Display**: `DinRound Bold` / custom Duolingo Display — lesson headers, XP counts

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Lesson Hero | DinRound | 28px | 800 | 1.15 | "Translate this sentence" |
| Section Title | DinRound | 22px | 700 | 1.20 | Unit headers |
| Card Title | DinRound | 18px | 700 | 1.30 | Skill names |
| XP Counter | DinRound | 20px | 800 | 1.00 | Numeric, bold |
| Streak Count | DinRound | 28px | 800 | 1.00 | Orange, large |
| Answer Option | DinRound | 17px | 600 | 1.35 | Choice buttons |
| Body | DinRound | 16px | 400 | 1.50 | Explanations |
| Hint / Sub | DinRound | 14px | 400 | 1.40 | Tips, subtext |
| Navigation | DinRound | 13px | 700 | 1.00 | Tab bar labels |
| Caption | DinRound | 12px | 600 | 1.30 | Badges, tags |

## 4. Component Stylings

### Buttons

**Primary 3D Button (Signature)**
- Background: `#58CC02`
- Border-bottom: `4px solid #58A700` (creates 3D push depth)
- Border-radius: 16px
- Padding: 14px 24px
- Font: DinRound 17px/700, white
- Active/Press: translateY(2px) + border-bottom shrinks to 2px
- Hover: `#61E002`

**Answer Choice Button**
- Background: `#FFFFFF`
- Border: `2px solid #E5E5E5`
- Radius: 12px
- Correct: border `#58CC02`, bg `#D7FFB8`
- Incorrect: border `#FF4B4B`, bg `#FFDFE0`

**Disabled**
- Background: `#E5E5E5`
- Text: `#AFAFAF`
- No border-bottom shadow

### Cards & Containers
- Skill card: white bg, `2px solid #E5E5E5` border, 16px radius
- Completed skill: green tint `rgba(88,204,2,0.1)`, green border
- Streak card: gold `#FFC800` accent, trophy icon

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Border Radius Scale
- Small (8px): Badges, chips
- Medium (12px): Answer choice buttons
- Large (16px): Primary buttons, skill cards
- XL (24px): Feature cards, modals
- Pill (999px): Tag pills, streak badges

## 6. Depth & Elevation

- **3D Button**: `border-bottom: 4px solid #58A700` — signature elevation
- **Cards**: `box-shadow: 0 2px 0px #E5E5E5` — subtle lift
- **Modal**: `box-shadow: 0 8px 24px rgba(0,0,0,0.15)`
- **Celebration overlay**: `box-shadow: 0 0 32px rgba(88,204,2,0.4)` — correct answer glow
- **No dark shadows** — shadow system stays in border tones not rgba blacks

## 7. Do's and Don'ts

### Do
- Always use the 3D button effect (border-bottom shadow) on primary CTAs
- Use green for every positive reinforcement moment — it's the reward color
- Reserve red (`#FF4B4B`) strictly for errors, hearts, and failure states
- Use gold (`#FFC800`) for streak, XP, and achievement moments
- Keep surfaces white — Duolingo is a light-mode-first app

### Don't
- Don't use flat buttons — the 3D effect is the Duolingo signature
- Don't mix multiple bright colors in the same component — one accent at a time
- Don't use dark backgrounds — this is not a dark-mode product
- Don't overcrowd: one lesson prompt per screen, one primary CTA per view

## 8. Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px
- Mobile: Single-column lesson flow, bottom navigation bar (5 icons)
- Tablet: 2-column skill grid, persistent progress sidebar
- Web: 3-column layout with left nav, center lesson, right streak panel

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary: `#58CC02` (green)
- Button shadow: `#58A700`
- Error: `#FF4B4B`
- XP/Streak: `#FFC800`
- Background: `#FFFFFF`
- Text: `#3C3C3C`

### Example Component Prompts
- "Build a 3D CTA button: #58CC02 background, border-bottom 4px #58A700, 16px radius, white DinRound 17px/700. Active state: translateY(2px)."
- "Create answer choice: white bg, 2px solid #E5E5E5, 12px radius. Correct state: #D7FFB8 bg, #58CC02 border. Error state: #FFDFE0 bg, #FF4B4B border."
- "Design streak counter: #FFC800 text, DinRound 28px/800, flame emoji left, 'day streak' caption 14px/600."
