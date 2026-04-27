---
name: Coursera
colors:
  tertiary: "#0056D2"
  neutral: "#FFFFFF"
  primary: "#0056D2"
typography:
  h1:
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40
  h2:
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32
  h3:
    fontSize: 18px
    fontWeight: 700
    lineHeight: 25
  body-md:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16
rounded:
  sm: 4px
  md: 8px
  lg: 20px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Coursera's visual system embodies trusted academia made accessible — the authority of a university combined with the approachability of modern SaaS. The brand is organized around a clear primary blue (`#0056D2`) that feels educational and reliable, paired with generous white surfaces that give breathing room to the complex credential and course content hierarchy. This is not an entertainment platform; every design decision serves a learner who is invested, goal-oriented, and time-conscious.

Open Sans is the workhorse typeface — widely available, highly legible at small sizes, and neutral enough to step back from the course content and partner university brand assets that populate the UI. The card-based grid is the fundamental layout pattern: course cards with partner university logos, ratings, duration estimates, and difficulty levels pack information efficiently while maintaining visual consistency across tens of thousands of courses.

Progress tracking is a primary UX concern — learners return to see how far they've come. This creates a recurring visual motif: progress bars in the primary blue, completion percentages, and skill achievement badges. The certificate moment is the emotional peak of the product, rendered with a warm gold accent that makes it feel genuinely ceremonial. Light blue accents (`#E8F1FB`) appear as background tints on highlighted elements and enrolled course states.

**Key Characteristics:**
- Primary blue: `#0056D2`
- Light blue tint: `#E8F1FB`
- Background: `#FFFFFF`
- Page background: `#F9F9F9`
- Text primary: `#1F1F1F`
- Text secondary: `#636363`
- Success/completion: `#0056D2` (same blue — progress = brand)
- Certificate gold: `#D6AE54`
- Font: Open Sans
- Border radius: 8px cards

## Colors

### Primary
- **Coursera Blue** (`#0056D2`): CTAs, nav active, progress bars, links, enrolled state
- **Dark Blue** (`#00419E`): Navigation background, dark mode elements, button hover
- **Light Blue Tint** (`#E8F1FB`): Enrolled course highlight, feature block backgrounds

### Interactive
- **Blue Hover** (`#00419E`): Primary button hover — darker blue
- **Blue Link Hover** (`#003D91`): Text link hover
- **Blue Focus Ring** (`rgba(0,86,210,0.3)`): Input and control keyboard focus

### Surface
- **White** (`#FFFFFF`): Course cards, modal backgrounds, article surfaces
- **Page Gray** (`#F9F9F9`): App shell background between cards
- **Border** (`#E0E0E0`): Card borders, dividers, input outlines
- **Light Blue Tint** (`#E8F1FB`): Section highlights, enrolled state background
- **Gold** (`#D6AE54`): Certificate and badge accent

## Typography

### Font Families
- **Open Sans**: `"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif` — all text
- Weights used: 400 (regular), 600 (semi-bold), 700 (bold)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Page Hero | Open Sans | 40px | 700 | 48px | Category / search hero headline |
| H1 Course Title | Open Sans | 32px | 700 | 40px | Course detail page |
| H2 Section | Open Sans | 24px | 700 | 32px | "Recommended for You", "New Courses" |
| H3 Card Title | Open Sans | 18px | 700 | 25px | Course card headline |
| H4 Widget | Open Sans | 16px | 600 | 22px | Sidebar widget titles |
| Body | Open Sans | 16px | 400 | 26px | Course descriptions |
| Course Description (card) | Open Sans | 14px | 400 | 20px | 2-line clamp on grid cards |
| Instructor Name | Open Sans | 14px | 400 | 20px | `#636363`, below course title |
| Rating / Count | Open Sans | 14px | 600 | 20px | Yellow star + count in `#1F1F1F` |
| Nav Primary | Open Sans | 14px | 600 | 20px | `#1F1F1F` on white nav |
| Progress Label | Open Sans | 13px | 600 | 18px | "67% complete" blue label |
| Badge / Tag | Open Sans | 12px | 700 | 16px | Difficulty, duration, skill tags |
| Caption / Metadata | Open Sans | 12px | 400 | 16px | `#636363` timestamp, credits |
| Legal | Open Sans | 11px | 400 | 16px | `#888888` footer |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64px
- Card gutter: 16px
- Content max-width: 1200px
- Section vertical padding: 48px

### Border Radius Scale
- Micro (tags, badges): 4px
- Input / button: 4px
- Course card: 8px
- Modal: 8px
- Pill (difficulty badge): 20px
- Avatar / partner logo: 4px (square-ish logos) or 50%
- Progress bar: 4px

## Elevation & Depth

**Resting course card:**
```
box-shadow: 0 2px 8px rgba(0,0,0,0.08);
border: 1px solid #E0E0E0;
border-radius: 8px;
```

**Hover course card:**
```
box-shadow: 0 4px 16px rgba(0,0,0,0.12);
border-color: #0056D2;
```

**Certificate card:**
```
box-shadow: 0 4px 16px rgba(214,174,84,0.2);
border: 2px solid #D6AE54;
```

**Modal:**
```
box-shadow: 0 8px 32px rgba(0,0,0,0.16);
border-radius: 8px;
```

**Sticky nav:**
```
box-shadow: 0 1px 4px rgba(0,0,0,0.1);
background: #FFFFFF;
```

## Components

### Buttons
**Primary (Enroll / Start):**
- Background: `#0056D2`
- Border: none
- Border radius: 4px
- Padding: `12px 24px`
- Font: Open Sans, 16px / 700 / white
- Hover: background `#00419E`
- Active: background `#003D91`

**Secondary (Learn More):**
- Background: `#FFFFFF`
- Border: `2px solid #0056D2`
- Border radius: 4px
- Color: `#0056D2`
- Hover: background `#E8F1FB`

**Ghost (Save / Wishlist):**
- Background: `transparent`
- Color: `#0056D2`
- Hover: text-decoration underline

**Enrolled State (Continue):**
- Background: `#0056D2`
- Border: none
- Border radius: 4px
- With progress bar beneath button in same blue

### Cards & Containers
**Course Card:**
- Background: `#FFFFFF`
- Border: `1px solid #E0E0E0`
- Border radius: 8px
- Box-shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Padding: 16px
- Partner logo: 32px height, top-right corner
- Hover: box-shadow `0 4px 16px rgba(0,0,0,0.12)`, border-color `#0056D2`

**Enrolled Course Card:**
- Background: `#E8F1FB`
- Border: `1px solid #0056D2`
- Border radius: 8px
- Progress bar: 8px tall, `#0056D2` fill on `#D0E3FA` track

**Certificate Card:**
- Background: `#FFFFFF`
- Border: `2px solid #D6AE54`
- Border radius: 8px
- Gold accent header strip
- Box-shadow: `0 4px 16px rgba(214,174,84,0.2)`

## Do's and Don'ts

### Do
- Use `#0056D2` blue for all progress bars, enrollment states, and primary actions — learning = blue
- Show partner university logos prominently on course cards — credential authority is a selling point
- Display ratings with yellow star + numeric score + review count for social proof
- Use the `#E8F1FB` blue tint for enrolled course highlight backgrounds
- Reserve `#D6AE54` gold exclusively for certificates and credentials — it must feel special

### Don't
- Don't use red for anything in the main UI — it's reserved for error states only
- Don't reduce card border radius below 8px — Coursera's slightly rounded cards soften the academic feel
- Don't omit the difficulty/duration/skill tags from course cards — they're primary decision signals
- Don't use the certificate gold for interactive elements — diluting the credential ceremony moment is harmful

## Responsive Behavior

Breakpoints:
- Mobile: 0–640px — single column course list; bottom tab nav; progress widget top-right
- Tablet: 641–1024px — 2-column grid; filter drawer slide-in
- Desktop: 1025–1440px — 3-column grid; left filter sidebar 240px
- Wide: 1441px+ — 4-column grid; sidebar stays 240px; content caps at 1200px

## Agent Prompt Guide

### Quick Color Reference
- Brand Blue: `#0056D2`
- Dark Blue: `#00419E`
- Light Tint: `#E8F1FB`
- Background: `#FFFFFF`
- Page Shell: `#F9F9F9`
- Text: `#1F1F1F`
- Secondary: `#636363`
- Certificate Gold: `#D6AE54`
- Border: `#E0E0E0`

### Example Component Prompts
- "Coursera course card: white background, 1px #E0E0E0 border, 8px radius, partner university logo top-right, course title Open Sans 18px bold, instructor name in #636363 14px, star rating row, blue #0056D2 Enroll button — hover adds blue border and deeper shadow"
- "Coursera progress dashboard: enrolled course card in #E8F1FB light blue, 1px blue border, 8px radius, course title, 8px progress bar in #0056D2 on #D0E3FA track, '67% complete' label blue, 'Continue' button — learning momentum UI"
- "Coursera certificate card: white surface, 2px gold border (#D6AE54), gold header strip, credential title in #1F1F1F Open Sans 20px bold, partner university name, gold seal graphic — ceremonial, special, achievement"
