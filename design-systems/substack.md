---
name: Substack
colors:
  tertiary: "#FF6719"
  secondary: "#0F0F0F"
  neutral: "#FFFFFF"
  primary: "#0F0F0F"
typography:
  h1:
    fontSize: 28px
    fontWeight: 700
    lineHeight: 36
  body-md:
    fontSize: 19px
    fontWeight: 400
    lineHeight: 34
  label:
    fontSize: 15px
    fontWeight: 700
    lineHeight: 22
  caption:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18
rounded:
  sm: 2px
  md: 6px
  lg: 8px
---

## Overview

Substack's design philosophy is radical simplicity in service of writing. The platform is built around a single conviction: great writing deserves great reading conditions, and nothing should compete with the text. The dominant white canvas, generous line lengths, and Georgia serif body text create reading conditions reminiscent of a quality magazine or newspaper — intentionally removed from the scrolling, stimulus-heavy norm of social media platforms.

The orange accent (`#FF6719`) appears only at decision moments: subscription CTAs, active states, and brand-marking elements. Its warmth evokes the intimacy of an author-reader relationship — not a corporate product, but a personal creative economy. This restrained use of orange against an otherwise completely neutral black-and-white palette ensures maximum impact at conversion moments. Substack's design earns trust through visual quietness; writers and readers don't want noise, they want clarity.

Typography is the design system's primary creative statement. Georgia serif for article body text creates the authority and reading comfort associated with print journalism. Headings use Georgia for maximum tonal consistency. UI chrome (navigation, buttons, labels, metadata) switches to a clean system sans-serif, creating a clear two-tier system: editorial = serif, product = sans. This split reinforces Substack's positioning as a hybrid between a publication and a software product.

**Key Characteristics:**
- Canvas: `#FFFFFF` — pure white for all reading surfaces
- Orange: `#FF6719` — subscription CTAs, active links, brand accent
- Text: `#0F0F0F` (near-black) for body; `#666666` for metadata
- Georgia for article body, headings in editorial context
- System sans for all UI chrome (nav, buttons, labels)
- Max reading line length: 680px — never wider
- Body text: 18–20px with 1.7–1.8 line-height — generous reading spec
- Border radius: 6px for buttons, 4px for small elements

## Colors

### Primary
- **Near-Black** (`#0F0F0F`): Body text, headings, primary content
- **Orange** (`#FF6719`): CTAs, active nav, links on hover, branding
- **Orange Dark** (`#E55B10`): Button hover state

### Interactive
- **Orange** (`#FF6719`): Primary interactive color — subscribe button, active states
- **Orange Hover** (`#E55B10`): Hover on orange buttons
- **Link Default** (`#0F0F0F`): Body text links (underlined, same color as text)
- **Link Hover** (`#FF6719`): Link hover turns orange
- **Focus Ring** (`rgba(255,103,25,0.25)`): Orange focus ring on interactive elements

### Surface
- **White** (`#FFFFFF`): Reading canvas, article background, page background
- **Light Gray** (`#F7F7F7`): Subtle section tint, sidebar backgrounds
- **Card Gray** (`#FAFAFA`): Newsletter card backgrounds
- **Divider** (`#E6E6E6`): Horizontal rules, section dividers
- **Border** (`#D4D4D4`): Input borders, card borders

### Text
- **Primary** (`#0F0F0F`): Article body, headings, key content
- **Secondary** (`#666666`): Publication dates, bylines, subscriber counts
- **Tertiary** (`#999999`): Captions, supplementary metadata
- **Orange Accent** (`#FF6719`): Highlighted links, active navigation

### Status
- **Success** (`#22C55E`): Subscription confirmed, payment success
- **Error** (`#EF4444`): Form errors, payment failures

## Typography

### Font Families
- **Georgia**: `Georgia, 'Times New Roman', serif` — Article body text, editorial headings, post titles
- **System Sans**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` — All UI chrome: navigation, buttons, labels, metadata
- **Freight Display / Custom**: For marketing hero sections (when used)

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Article Title | Georgia | 36px | 700 | 44px | Post page headline |
| Article Title (feed) | Georgia | 24px | 700 | 32px | Feed card headline |
| Section Heading | Georgia | 28px | 700 | 36px | Within-article H2 |
| Subsection | Georgia | 22px | 700 | 30px | Within-article H3 |
| Article Body | Georgia | 19px | 400 | 34px | Reading text — very generous |
| Author Name (article) | System | 16px | 700 | 22px | Byline on post page |
| Publication Name | System | 14px | 700 | 20px | Publication brand label |
| Subscriber Count | System | 14px | 400 | 20px | "12,400 subscribers" |
| Post Date | System | 14px | 400 | 20px | "June 14" |
| Nav Item | System | 15px | 500 | 22px | Top navigation links |
| Button | System | 15px | 700 | 22px | Subscribe, CTA buttons |
| Caption | System | 13px | 400 | 18px | Image captions, footnotes |
| Tag / Category | System | 12px | 600 | 16px | Category tags, pill labels |

## Layout

### Spacing System
- Base unit: **4px**
- Scale: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px`
- Article content max-width: `680px`
- Card padding: `24px`
- Section vertical rhythm: `48px` between sections
- Page horizontal padding: `16px` (mobile), `32px` (tablet), `auto` (desktop with max-width)

### Grid
- Home feed: single column, max-width `720px` centered
- Publication homepage: 2-column article grid at `≥768px`
- Article page: single column, max-width `680px`

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 2px | Tags, tiny elements |
| `--radius-sm` | 4px | Inline chips |
| `--radius-md` | 6px | Buttons |
| `--radius-lg` | 8px | Cards |
| `--radius-full` | 9999px | Avatar, pill tags |

## Elevation & Depth

Substack uses almost no shadows — the editorial aesthetic is flat and clean:

- **Base** (page): `#FFFFFF` — flat white
- **Feed Card**: `border: 1px solid #E6E6E6` — border only
- **Nav (scrolled)**: `box-shadow: 0 1px 4px rgba(0,0,0,0.08)` — very subtle
- **Subscribe Modal**: `box-shadow: 0 8px 32px rgba(0,0,0,0.15)`, backdrop 40% dark
- **Tooltip**: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`, bg `#0F0F0F` text white
- **Focus Ring**: `box-shadow: 0 0 0 3px rgba(255,103,25,0.25)` on focused inputs/buttons

## Components

### Buttons
**Primary Subscribe Button**
- Background: `#FF6719`
- Text: `#FFFFFF`, System sans weight 700, 15px
- Border-radius: `6px`
- Padding: `10px 20px`
- Hover: `background: #E55B10`
- Active: `background: #CC500E`
- Box-shadow: none (flat)
- Letter-spacing: `0`

**Secondary Button**
- Background: `#FFFFFF`
- Border: `1px solid #D4D4D4`
- Text: `#0F0F0F`, weight 600, 15px
- Border-radius: `6px`
- Hover: `background: #F7F7F7`, `border-color: #999999`

**Ghost / Text Button**
- Background: transparent, no border
- Text: `#666666`, weight 500
- Hover: text `#0F0F0F`

### Cards & Containers
**Newsletter Feed Card**
- Background: `#FFFFFF`
- Border: `1px solid #E6E6E6`
- Border-radius: `8px`
- Padding: `24px`
- Cover image: 16:9 ratio above card content, `border-radius: 8px 8px 0 0`
- Post title: Georgia 24px `#0F0F0F` weight 700
- Excerpt: Georgia 16px `#666666` weight 400, 2-line clamp
- Metadata row: System 14px `#999999` — author · date · read time

**Publication Header**
- Background: `#FFFFFF` (or custom publication color)
- Publication name: System 22px weight 700 `#0F0F0F`
- Tagline: System 16px `#666666`
- Subscriber count: System 14px `#666666`
- Subscribe button: `#FF6719` orange prominent right

**Article Reading View**
- Max-width: `680px` centered
- Body font: Georgia 19px, line-height 34px
- Paragraph gap: `24px`
- First paragraph: no indent; block paragraphs
- Blockquote: `border-left: 4px solid #FF6719`, `padding-left: 20px`, color `#666666` italic

**Author Bio Card**
- Background: `#FAFAFA`
- Border: `1px solid #E6E6E6`
- Border-radius: `8px`
- Padding: `20px`
- Avatar: 48px circle
- Author name: System 16px weight 700
- Bio: System 14px `#666666`

### Subscription Paywall Box
- Background: `linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF 40%)` fade over last paragraph
- Below fade: orange subscribe button full-width
- Subtext: System 14px `#666666` "This post is for subscribers only"

## Do's and Don'ts

### Do
- Set article body text in Georgia 19px with line-height 34px — reading is the product
- Constrain content column to 680px max-width — never allow full-bleed text
- Use `#FF6719` exclusively for the subscribe CTA — it must always win visual attention
- Apply generous paragraph spacing (24px) — white space is a reading luxury, not waste
- Show author avatar + name + date on every article — byline anchors the human relationship

### Don't
- Never use a serif font for UI chrome (buttons, nav) — serif = editorial only
- Don't add heavy box shadows — Substack's authority comes from restraint
- Avoid multi-column article layouts — single-column reading is non-negotiable
- Don't use orange for body text links — links are underlined in black; orange on hover only
- Avoid truncating article headlines — titles deserve full visibility in the feed

## Responsive Behavior

**Breakpoints:**
- `xs`: 0–480px — single column, 16px padding, body text 17px
- `sm`: 480px–768px — 20px padding, body text 18px, feed card expands
- `md`: 768px–1024px — 2-column feed on publication homepage
- `lg`: 1024px+ — max-width 680px reading column centered, sidebar navigation visible

**Reading experience:** Body text size steps up from 17px (mobile) to 19px (desktop)

**Paywall:** Fade overlay on last paragraph → full-width orange subscribe button at all widths

## Agent Prompt Guide

### Quick Color Reference
- Orange CTA: `#FF6719`
- Body text: `#0F0F0F`
- Metadata/secondary: `#666666`
- Canvas: `#FFFFFF`
- Card border: `#E6E6E6`
- Blockquote accent: `#FF6719`

### Example Component Prompts
- "Substack-style article card: white bg #FFFFFF, border 1px #E6E6E6, 8px radius, 16:9 cover image at top with 8px radius top corners, headline in Georgia 24px #0F0F0F weight 700 below, excerpt in Georgia 16px #666666 weight 400 2-line clamp, metadata row System 14px #999999 'Author · Jun 14 · 5 min read'"
- "Article reading view: max-width 680px centered, Georgia 19px #0F0F0F weight 400 line-height 34px, paragraph gap 24px, blockquote with border-left 4px #FF6719 padding-left 20px text #666666 italic"
- "Subscribe CTA button: background #FF6719, text white System 15px weight 700, border-radius 6px, padding 10px 20px, hover background #E55B10"
