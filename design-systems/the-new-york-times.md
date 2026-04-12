# Design System Inspired by The New York Times

## 1. Visual Theme & Atmosphere

The New York Times digital design is an exercise in translating 170 years of print authority into pixels. The visual system is unapologetically classical: black text on white paper, NYT Cheltenham serif for news headings, and a grid system that directly references the newspaper's column-based layout. There is no color in the traditional sense — black, white, and shades of gray do all the work, with color appearing only for section labeling (Opinion, Arts, Travel) and the rare interactive data visualization.

The design communicates premium through restraint. No gradients, no shadows heavier than the lightest wash, no decorative elements — the journalism earns the reader's trust, and the design gets out of the way. Density is high but never chaotic: the homepage presents dozens of articles across a complex grid, yet every element feels intentional. The typographic hierarchy is clear enough that readers instinctively know which story is the lead and which is secondary.

The paywall experience is handled with the same authority as the rest of the product — the soft paywall is a gradient fade into a white surface with a low-key but firm subscription prompt. The NYT's design never begs; it invites. Digital subscribers experience the same editorial gravity in apps and web browsers that print subscribers have always found in the physical paper.

**Key Characteristics:**
- Black text: `#121212` (near-black) — primary body and headlines
- White canvas: `#FFFFFF` — all reading surfaces
- Gray secondary: `#727272` — bylines, timestamps, secondary metadata
- Section accent: `#326891` (NYT blue) for Opinion section, varies per section
- NYT Cheltenham serif for all editorial headings (licensed)
- NYT Franklin Gothic / Imperial for bylines and labels
- Grid: 6-column base, newspaper-style with vertical rules
- No border radius on article cards (sharp edges = newspaper authority)

## 2. Color Palette & Roles

### Primary (Monochrome System)
- **Near-Black** (`#121212`): Headlines, body text, primary content
- **Pure White** (`#FFFFFF`): Page background, reading canvas
- **Light Gray** (`#F7F7F7`): Secondary page surfaces, photo captions bg
- **Rule Gray** (`#E2E2E2`): Column rules, horizontal dividers, card borders

### Section Accent Colors
- **Opinion Blue** (`#326891`): Opinion section branding and accent
- **Arts Red** (`#A30000`): Arts/Culture section accent
- **Travel Green** (`#4A7C59`): Travel section accent
- **Sports Navy** (`#1A1A2E`): Sports section
- **Food Orange** (`#C4570D`): Cooking/Food section

### Interactive
- **Link Black** (`#121212`): All article headline links (no color, underline on hover)
- **Link Hover Underline**: `text-decoration: underline` only — no color change
- **Focus Ring** (`rgba(50,104,145,0.3)`): NYT blue focus ring on interactive elements

### Text
- **Headline** (`#121212`): Article titles, section headers
- **Body** (`#121212`): Article body text (same as headline)
- **Byline** (`#727272`): Author attribution
- **Metadata** (`#727272`): Timestamps, section labels, read time
- **Caption** (`#666666`): Photo captions, chart labels

## 3. Typography Rules

### Font Families
- **NYT Cheltenham**: `'nyt-cheltenham', Georgia, serif` — All editorial headings, article titles (licensed serif)
- **NYT Franklin**: `'nyt-franklin', 'Helvetica Neue', Arial, sans-serif` — Bylines, labels, UI chrome, navigation
- **Georgia**: `Georgia, serif` — Body fallback when custom fonts fail
- **Stymie**: Slab serif variant used for some sub-headings and pull quotes

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Lead Headline | NYT Cheltenham | 48px | 700 | 52px | Top story, homepage hero |
| Main Headline | NYT Cheltenham | 36px | 700 | 40px | Primary section story |
| Secondary Headline | NYT Cheltenham | 26px | 700 | 30px | Second-tier articles |
| Tertiary Headline | NYT Cheltenham | 20px | 600 | 24px | Briefing items, small cards |
| Article Body | Georgia | 18px | 400 | 28px | Standard article reading text |
| Byline | NYT Franklin | 13px | 700 | 18px | "By First Last", uppercase |
| Timestamp | NYT Franklin | 12px | 400 | 16px | "June 14, 2025" |
| Section Label | NYT Franklin | 11px | 700 | 14px | "OPINION", "ARTS" — uppercase |
| Caption | NYT Franklin | 13px | 400 | 18px | Photo caption text |
| Navigation | NYT Franklin | 13px | 500 | 18px | Top nav section links |
| Kicker | NYT Franklin | 12px | 700 | 16px | Story type label above headline |
| Pull Quote | NYT Cheltenham | 24px | 300 | 32px | Light weight serif pull quote |

## 4. Component Stylings

### Buttons
**Subscribe Button**
- Background: `#121212`
- Text: `#FFFFFF`, NYT Franklin weight 700, 14px, uppercase, letter-spacing `1px`
- Border-radius: `0px` (sharp — newspaper authority)
- Padding: `10px 20px`
- Hover: `background: #333333`

**Continue Reading (soft paywall)**
- Background: `#FFFFFF`
- Border: `1px solid #121212`
- Text: `#121212`, weight 700, 13px, uppercase
- Border-radius: `0`
- Hover: `background: #121212`, `color: #FFFFFF`

**Section Filter**
- Default: `background: #FFFFFF`, `border: 1px solid #E2E2E2`, `color: #727272`, 12px
- Active: `border-color: #121212`, `color: #121212`, weight 700
- Border-radius: `0`

### Cards & Containers
**Article Card (Grid)**
- No background fill — transparent; content sits on page bg
- No border — horizontal rule `border-top: 1px solid #E2E2E2` above card
- No border-radius — sharp grid edges throughout
- Image: 100% card width, aspect ratio 3:2, object-fit cover
- Kicker: NYT Franklin 11px uppercase `#727272` above headline
- Headline: NYT Cheltenham, size varies by prominence
- Byline: NYT Franklin 13px `#727272`

**Lead Story Card (Homepage)**
- Full-width image or left-heavy 2:1 layout
- Headline: NYT Cheltenham 48px weight 700
- Summary: Georgia 16px `#121212` weight 400
- Horizontal rule separating from secondary stories

**Paywall Fade**
- Last 2 paragraphs: `mask-image: linear-gradient(to bottom, #121212 0%, transparent 100%)`
- Below: white `#FFFFFF` background with subscribe prompt
- Separator: `border-top: 3px solid #121212`

**Photo Caption**
- Background: none (sits below photo)
- Font: NYT Franklin 13px `#666666`, weight 400
- Attribution: weight 700, same size
- Max-width: matches photo width

**Paywall Box**
- Border-top: `3px solid #121212`
- Padding: `24px 0`
- Headline: NYT Cheltenham 24px
- Subhead: NYT Franklin 14px `#727272`
- Subscribe button: full-width `#121212`

## 5. Layout Principles

### Spacing System
- Base unit: **4px** (print grid influences: uses multiples of 4–8)
- Scale: `4px, 8px, 12px, 16px,24px, 32px, 40px, 48px, 64px, 80px`
- Column gutter: `16px` (web), `24px` (desktop)
- Article body max-width: `680px`
- Homepage content max-width: `1260px`

### Grid (Newspaper-Inspired)
- 6-column grid on desktop
- Column rules: `1px solid #E2E2E2` between content columns
- Lead story: spans 4–6 columns
- Secondary stories: 2–3 columns
- Mobile: single column

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | ALL cards, ALL buttons — never rounded |
| `--radius-sm` | 2px | Only interactive tags in very rare UI contexts |

The NYT design system explicitly avoids all border-radius on editorial elements.

## 6. Depth & Elevation

The NYT design system has virtually no elevation. Authority is communicated through typographic hierarchy and column structure, not shadow:

- **Page** (base): `#FFFFFF` — no shadow anywhere
- **Navigation** (scrolled): `border-bottom: 1px solid #E2E2E2` — no shadow
- **Tooltip**: `background: #121212`, text white — no shadow, flat dark
- **Subscribe Modal**: `box-shadow: 0 4px 16px rgba(0,0,0,0.15)` — one of the only shadows in the system
- **Sticky Nav**: flat, no shadow — border-bottom only

## 7. Do's and Don'ts

### Do
- Use NYT Cheltenham for all editorial headings — the serif is the brand voice, not the orange
- Apply 0 border-radius to all cards and buttons — sharpness = newspaper authority
- Maintain the 6-column newspaper grid with visible column rules
- Set article body text in Georgia 18px with generous line-height 28px
- Use uppercase NYT Franklin for all labels, bylines, and section headers

### Don't
- Never add color to article headlines or body — all editorial text is black on white
- Don't add hover color effects to article card images — only headline underline on hover
- Avoid gradients anywhere on editorial surfaces — the NYT does not do decoration
- Never apply border-radius to article card images — sharp crops are the standard
- Don't use thin weights for headlines — NYT Cheltenham must be weight 700 for authority

## 8. Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — single column, headline 28px, body 17px
- `sm`: 480px–768px — single column, lead headline 36px
- `md`: 768px–1024px — 2–3 column grid begins, lead story full-width
- `lg`: 1024px–1260px — 6-column grid, column rules visible
- `xl`: 1260px+ — max-width 1260px centered, full newspaper grid

**Navigation:** On mobile, horizontal scrolling section nav; full text nav on desktop

**Paywall:** Soft fade at paragraph 5 on mobile, paragraph 8 on desktop

## 9. Agent Prompt Guide

### Quick Color Reference
- Near-black: `#121212`
- White canvas: `#FFFFFF`
- Rule/divider: `#E2E2E2`
- Secondary text/byline: `#727272`
- Opinion blue: `#326891`
- Section label: `#727272` uppercase

### Example Component Prompts
- "New York Times-style article card: transparent background, horizontal rule border-top 1px #E2E2E2, 3:2 image above, kicker label 'U.S.' in NYT Franklin 11px #727272 uppercase below image, headline in NYT Cheltenham 26px #121212 weight 700 below, byline 'By Jane Smith' NYT Franklin 13px #727272 weight 700 uppercase"
- "NYT homepage 6-column grid: white canvas, column rules 1px #E2E2E2 between columns, lead story spanning 4 columns with NYT Cheltenham 48px headline, secondary stories 2-column with 20px headlines"
- "NYT subscribe button: background #121212, text white NYT Franklin 14px weight 700 uppercase letter-spacing 1px, border-radius 0, padding 10px 20px, hover background #333333"
