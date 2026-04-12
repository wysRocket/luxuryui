# Design System Inspired by Babbel

## 1. Visual Theme & Atmosphere

Babbel's visual language communicates progress, warmth, and confident approachability — the antithesis of the intimidating language classroom. The palette is rooted in deep, rich greens: a near-black forest green (`#003D2B`) anchors the brand with gravitas, while a vibrant lime-accented green (`#6CC24A`) energizes CTAs and progress elements. Together they read as: natural, growing, alive — a clever metaphor for language acquisition itself.

The interface is intentionally rounded and soft. Border radii are generous (12–20px on major containers), typography is spaced with breathing room, and interactive elements glow with a satisfying highlight on completion. The core experience is the lesson flow: flash cards, multiple-choice, listening exercises. These lesson surfaces use a clean white card on a soft off-white or light-green-tinted background to reduce eye fatigue during study sessions that can last 15–30 minutes.

Progress is the primary narrative. The UI is saturated with streaks, XP bars, progress rings, and level badges — all in the signature green. Correct answers trigger a green checkmark animation; incorrect answers briefly flash a warm amber (`#F5A623`) without punishment. The overall character is: a trusted study companion who celebrates every small win.

**Key Characteristics:**
- Dark brand green: `#003D2B`
- Light accent green: `#6CC24A`
- Background: `#FFFFFF` (lessons), `#F4F9F6` (app shell subtle tint)
- Text primary: `#1A2E28`
- Text secondary: `#5C7269`
- Correct/success: `#6CC24A`
- Error/incorrect: `#E5534B`
- Warning/hint: `#F5A623`
- Border radius: 12–20px consistently

## 2. Color Palette & Roles

### Primary
- **Forest Green** (`#003D2B`): Navigation header, primary badge backgrounds, brand anchor
- **Vivid Green** (`#6CC24A`): Primary CTAs, progress bars, correct-answer state, streak counters
- **Lesson Surface** (`#FFFFFF`): Exercise card backgrounds — pure white for focus

### Interactive
- **Green Hover** (`#58A83C`): CTA button hover state — slightly deeper
- **Green Focus Ring** (`rgba(108,194,74,0.4)`): Keyboard focus outline
- **Option Hover** (`#EFF7EA`): Multiple-choice option hover background

### Surface
- **App Shell** (`#F4F9F6`): Slight green-tinted off-white for app chrome (not lesson surfaces)
- **Card White** (`#FFFFFF`): All exercise and lesson cards
- **Border Light** (`#D7E8DF`): Card outlines, dividers, input borders
- **Correct Tint** (`#EFF7EA`): Selected correct answer highlight background
- **Error Tint** (`#FDECEA`): Incorrect answer highlight background

## 3. Typography Rules

### Font Families
- **Babbel uses a custom typeface** based on a friendly humanist sans: `"Source Sans Pro", "Nunito", -apple-system, sans-serif`
- All weight variants used: 400 (regular), 600 (semi-bold), 700 (bold)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| App Header Title | Custom/Source Sans Pro | 22px | 700 | 28px | Course and section names |
| Lesson Headline | Custom | 28px | 700 | 36px | "Lesson 3 of 10" hero text |
| Exercise Prompt | Custom | 22px | 600 | 30px | Question text in lessons |
| H2 Section | Custom | 20px | 700 | 26px | Dashboard section headers |
| H3 Card Title | Custom | 17px | 600 | 24px | Course card titles |
| Body | Custom | 15px | 400 | 22px | Descriptions, instructions |
| Answer Option | Custom | 16px | 500 | 22px | Multiple-choice option text |
| Nav Label | Custom | 13px | 600 | 18px | Bottom tab labels |
| Progress Label | Custom | 13px | 600 | 18px | "23 XP", "Day 14 streak" |
| Caption / Hint | Custom | 13px | 400 | 18px | `#5C7269` translation hints |
| Badge / Level | Custom | 11px | 700 | 14px | Level badge, XP pill |
| Legal | Custom | 11px | 400 | 16px | `#8A9E96` footer text |

## 4. Component Stylings

### Buttons
**Primary (Continue / Start Lesson):**
- Background: `#6CC24A`
- Border: none
- Border radius: 14px
- Padding: `14px 32px`
- Font: 16px / 700 / white
- Hover: background `#58A83C`, transform `translateY(-1px)`, box-shadow `0 4px 12px rgba(108,194,74,0.35)`
- Disabled: background `#C8E6B8`, cursor not-allowed

**Secondary (Skip / Review):**
- Background: `#FFFFFF`
- Border: `2px solid #D7E8DF`
- Border radius: 14px
- Color: `#1A2E28`
- Hover: border-color `#6CC24A`, background `#EFF7EA`

**Answer Option Button:**
- Background: `#FFFFFF`
- Border: `2px solid #D7E8DF`
- Border radius: 12px
- Padding: `14px 20px`
- Font: 16px / 500 / `#1A2E28`
- Hover: border-color `#6CC24A`, background `#EFF7EA`
- Selected Correct: background `#EFF7EA`, border `2px solid #6CC24A`, green checkmark icon
- Selected Wrong: background `#FDECEA`, border `2px solid #E5534B`, red X icon

### Cards & Containers
**Course Card:**
- Background: `#FFFFFF`
- Border: `1px solid #D7E8DF`
- Border radius: 16px
- Box-shadow: `0 2px 8px rgba(0,61,43,0.08)`
- Padding: 20px
- Hover: box-shadow `0 4px 16px rgba(0,61,43,0.14)`, translateY `-2px`

**Progress/Streak Card:**
- Background: `#003D2B`
- Border radius: 16px
- Padding: 20px
- Text: white and `#6CC24A` for stats

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px
- Lesson card padding: 24px
- Answer grid gap: 12px
- Bottom nav height: 60px
- Progress bar height: 8px

### Border Radius Scale
- Tag / badge: 6px
- Input / option button: 12px
- Card / panel: 16px
- Primary CTA: 14px (slightly less than card for visual variety)
- Progress bar: 4px (pill)
- Avatar / streak flame icon: 50%

## 6. Depth & Elevation

Babbel uses soft, warm-green-tinted shadows to reinforce the brand palette:

**Resting card:**
```
box-shadow: 0 2px 8px rgba(0,61,43,0.08);
```

**Hover card:**
```
box-shadow: 0 4px 16px rgba(0,61,43,0.14);
transform: translateY(-2px);
```

**Primary CTA button hover:**
```
box-shadow: 0 4px 12px rgba(108,194,74,0.35);
transform: translateY(-1px);
```

**Modal:**
```
box-shadow: 0 8px 32px rgba(0,0,0,0.16);
border-radius: 20px;
```

## 7. Do's and Don'ts

### Do
- Use `#6CC24A` vivid green for all positive, forward-moving actions (Continue, Submit, Correct)
- Show progress indicators everywhere — streaks, XP, lesson progress bars are central UX
- Keep lesson surface cards pure white for maximum focus during exercises
- Use `#003D2B` dark green for hero headers, badges, and structural brand elements
- Round corners generously (12–16px) to maintain the friendly, approachable character

### Don't
- Don't use red for primary error states in the main UI — reserve `#E5534B` for answer-wrong only
- Don't use flat/sharp corners — rounded corners are foundational to the brand identity
- Don't put two different green shades side-by-side without clear role differentiation
- Don't underuse the progress system — it's the primary engagement mechanic

## 8. Responsive Behavior

Breakpoints:
- Mobile: 0–640px — single column lesson flow; bottom tab navigation
- Tablet: 641–1024px — side navigation appears; 2-column course grid
- Desktop: 1025px+ — 3-column course grid; lesson experience remains centered 640px max-width

## 9. Agent Prompt Guide

### Quick Color Reference
- Dark Green: `#003D2B`
- Accent Green: `#6CC24A`
- Background: `#F4F9F6` (shell) / `#FFFFFF` (lessons)
- Text: `#1A2E28`
- Secondary Text: `#5C7269`
- Correct: `#6CC24A` on `#EFF7EA`
- Incorrect: `#E5534B` on `#FDECEA`
- Border: `#D7E8DF`

### Example Component Prompts
- "Babbel multiple-choice exercise card: white background, 16px radius, question text in #1A2E28 22px semi-bold, four answer option buttons with #D7E8DF 2px border, 12px radius, hover turns green-tinted (#EFF7EA) border — correct answer highlights green (#6CC24A border + checkmark)"
- "Babbel dashboard course card: white card with subtle green shadow, 16px radius, language flag icon, course title 17px bold, progress bar in #6CC24A on gray track, '3 of 10 lessons' caption in #5C7269"
- "Babbel green CTA button: #6CC24A fill, white text 16px bold, 14px radius, 14px vertical padding, hover deepens to #58A83C with green glow shadow — forward-moving, confident"
