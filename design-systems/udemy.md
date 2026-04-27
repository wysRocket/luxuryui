---
name: Udemy
colors:
  tertiary: "#A435F0"
  neutral: "#FFFFFF"
  primary: "#A435F0"
  secondary: "#6A6F73"
typography:
  label:
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22
rounded:
  sm: 4px
  md: 8px
---

## Overview

Udemy's design system is built to communicate both aspiration and accessibility. The platform must simultaneously convince users that learning is achievable and that the content is high-quality — a balance expressed through a warm, approachable color palette anchored by Udemy Purple. The primary purple (`#A435F0`) is vibrant and motivating, appearing on CTAs, promotions, and brand moments. The darker shade (`#6A1FA1`) grounds the system for hover states and deeper UI contexts.

The course card grid is the defining UI pattern — a responsive mosaic of thumbnails, titles, instructor names, and ratings that users scan like a catalog. Typography density is high: a single card might contain 6+ pieces of information (thumbnail, title, instructor, rating, review count, price, badge). Udemy's system handles this gracefully by establishing clear type hierarchies and relying on bold weight and size contrast rather than color variety to create visual order.

The platform's mass-market positioning means the design must work for first-time online learners in emerging markets as well as power users comparing advanced courses. The result is a design that errs toward clarity over elegance: generous font sizes, high contrast, explicit labels, and prominent social proof signals (star ratings, student counts, bestseller badges). The Udemy custom font lends brand distinctiveness while remaining warm and legible. Video player design takes cues from YouTube: full-screen, skip controls, quality selector, playback speed — familiar patterns that lower the learning curve for new users.

**Key Characteristics:**
- Udemy Purple (`#A435F0`) for primary CTAs, brand moments, sale prices
- Dark Purple (`#6A1FA1`) for hover states and deeper brand elements
- White backgrounds with grey course card grids
- Udemy custom font for headings; system sans for body
- Star ratings in gold (`#E59819`) — central trust signal
- "Bestseller" badge in yellow-green (`#ECEB98` bg, `#3D3C0A` text)
- Course thumbnail: 16:9 aspect ratio, full-color, no borders
- Price display: crossed-out original + purple sale price

## Colors

### Primary
- **Udemy Purple** (`#A435F0`): Primary CTA, "Add to cart", sale price, brand accent
- **Dark Purple** (`#6A1FA1`): Hover states, selected nav, footer brand zone
- **White** (`#FFFFFF`): All page and card backgrounds

### Interactive
- **Purple Hover** (`#8710D8`): Button hover, darkened CTA
- **Purple Active** (`#7600BD`): Button pressed state
- **Link Blue** (`#5624D0`): Text links, breadcrumbs, category links

### Surface
- **Page Grey** (`#F7F9FA`): Page background in course listings
- **Card Border** (`#D1D7DC`): Card outlines, input borders
- **Input Background** (`#FFFFFF`): Form fields with border
- **Footer Background** (`#1C1D1F`): Dark footer zone

### Text
- **Primary** (`#1C1D1F`): Course titles, headings, primary body
- **Secondary** (`#6A6F73`): Instructor names, metadata, secondary copy
- **Muted** (`#9AA0A6`): Disabled states, placeholder text
- **Inverse** (`#FFFFFF`): Text on purple/dark backgrounds
- **Price Original** (`#6A6F73`): Strikethrough original price
- **Price Sale** (`#A435F0`): Sale/current price

### Semantic
- **Rating Gold** (`#E59819`): Star fill, average rating numbers
- **Bestseller Badge BG** (`#ECEB98`): Bestseller badge background
- **Bestseller Badge Text** (`#3D3C0A`): Bestseller badge text
- **New Badge** (`#A435F0`): "New" label on recent courses
- **Success** (`#2D7A00`): Enrollment confirmation, completion check

## Typography

### Font Families
- **Headings**: `"Udemy Sans", "SuisseWorks", "Helvetica Neue", sans-serif` — course names, section titles
- **UI**: `"Udemy Sans", -apple-system, "Helvetica Neue", sans-serif` — all UI labels
- **Body/Review**: `"Udemy Sans", "Georgia", serif` — review content, description paragraphs

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Heading | Udemy Sans | 36px | 700 | 44px | Landing page hero |
| Section Title | Udemy Sans | 24px | 700 | 30px | "Top Courses in...", "Popular" |
| Course Title | Udemy Sans | 16px | 700 | 22px | Card title, 2-line clamp |
| Instructor Name | Udemy Sans | 13px | 400 | 18px | Secondary on card |
| Rating Number | Udemy Sans | 13px | 700 | 18px | "4.7" bold, gold color |
| Review Count | Udemy Sans | 13px | 400 | 18px | "(45,231 ratings)" grey |
| Price | Udemy Sans | 16px | 700 | 22px | Sale price, purple |
| Original Price | Udemy Sans | 13px | 400 | 18px | Strikethrough, grey |
| Button Label | Udemy Sans | 16px | 700 | 22px | CTA text |
| Category Link | Udemy Sans | 14px | 400 | 20px | Breadcrumb, nav links |
| Description | Udemy Sans | 15px | 400 | 22px | Course about section |
| Curriculum Item | Udemy Sans | 14px | 400 | 20px | Lecture list items |

## Layout

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`
- Card internal padding: `12px`
- Section horizontal padding: `16px` mobile, `24px` tablet, `48px` desktop
- Section vertical spacing: `40px` between sections

### Grid System
- Mobile: 1-column course cards
- Tablet: 2-column course cards
- Desktop: 3-4 column grid, max-width `1340px`
- Course page: `calc(100% - 360px)` content | `360px` sidebar
- Card gap: `16px`

### Border Radius Scale
- `0px` — course cards, thumbnails (flat Udemy aesthetic)
- `4px` — buttons, badges, tags
- `8px` — modals, dropdowns
- `100px` — pill search bar

## Elevation & Depth

### Shadow Scale
- **Card Default** — `none` (border only)
- **Card Hover** — `0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)`
- **Purchase Sidebar** — `0 2px 8px rgba(0,0,0,0.12)`
- **Modal** — `0 4px 24px rgba(0,0,0,0.20)`
- **Tooltip** — `0 2px 8px rgba(0,0,0,0.24)`

## Components

### Buttons

**Primary (Add to Cart / Enroll)**
- Background: `#A435F0`
- Text: `#FFFFFF`, 16px Udemy Sans 700
- Padding: `14px 24px`
- Border radius: `4px`
- Hover: background `#8710D8`
- Active: background `#7600BD`
- Width: full-width in sidebar, auto inline

**Secondary**
- Background: `#FFFFFF`
- Border: `2px solid #1C1D1F`
- Text: `#1C1D1F`, 16px weight 700
- Same dimensions
- Hover: background `#F7F9FA`

**Wishlist (Icon)**
- Background: `transparent`
- Border: `2px solid #1C1D1F`
- Icon: heart outline
- Padding: `12px`
- Hover: background `#F7F9FA`
- Active: heart fill `#A435F0`

### Cards & Containers

**Course Card**
- Background: `#FFFFFF`
- Border: `1px solid #D1D7DC`
- Border radius: `0px` (flat, Udemy uses no radius on cards)
- Box shadow: none default, `0 2px 4px rgba(0,0,0,0.08)` on hover
- Thumbnail: 16:9, full-width, no radius
- Content padding: `12px`
- Title: 16px bold, 2-line clamp
- Instructor: 13px secondary, 1-line clamp
- Rating row: stars + number + count, 13px
- Price row: sale purple + crossed original grey

**Purchase Sidebar**
- Background: `#FFFFFF`
- Border: `1px solid #D1D7DC`
- Padding: `24px`
- Position: sticky top-aligned on desktop
- Shadow: `0 2px 8px rgba(0,0,0,0.12)`
- Video preview: 16:9 with play overlay

**Course Curriculum Item**
- Height: 48px min
- Padding: `12px 16px`
- Left: expand icon + lecture title
- Right: duration in grey
- Hover: background `#F7F9FA`
- Completed: checkmark icon `#2D7A00`

## Do's and Don'ts

### Do
- Show the original crossed-out price alongside the sale price — the discount drives conversion
- Display social proof prominently: rating, review count, student count on every course card
- Use the "Bestseller" badge exactly as specified — it's a significant trust signal
- Apply full-width buttons in purchase contexts — maximizes tap target on mobile
- Use the 16:9 thumbnail ratio strictly — consistent grid layout depends on it

### Don't
- Don't round course card corners — Udemy's flat card is intentional
- Don't use purple for anything other than CTAs and brand moments
- Don't display prices without context (discount, original price) in promotional contexts
- Don't reduce title to 1-line clamp on cards — 2 lines maintains scannable grid

## Responsive Behavior

**Breakpoints:**
- `375px` — mobile: 1-column, purchase bar is bottom-sticky
- `768px` — tablet: 2-column grid, sidebar below video
- `1024px` — desktop: 3-column grid, sticky sidebar
- `1340px` — max width; 4-column grid in search results

**Platform Adaptations:**
- Mobile: video player full-screen, curriculum collapsible
- Purchase sidebar: bottom sticky bar on mobile showing price + CTA
- Search filters: drawer on mobile, left sidebar on desktop
- Course previews: autoplay on hover (desktop), tap to preview (mobile)

## Agent Prompt Guide

### Quick Color Reference
- Brand Purple: `#A435F0`
- Hover Purple: `#8710D8`
- Background: `#FFFFFF`
- Text Primary: `#1C1D1F`
- Text Secondary: `#6A6F73`
- Rating Gold: `#E59819`

### Example Component Prompts
- "Design a Udemy course card grid: white flat cards (no radius), 16:9 thumbnail, course title in Udemy Sans 16px bold 2-line clamp, instructor in grey, gold star rating, purple sale price with grey strikethrough original, hover shadow"
- "Create a Udemy purchase sidebar: sticky white panel, 16:9 video preview with play overlay, purple Add to Cart button full-width, price stack, 30-day guarantee badge"
- "Build a Udemy bestseller badge: #ECEB98 background, #3D3C0A text, 4px radius, 12px uppercase bold, positioned top-left of card thumbnail"
- "Design a Udemy hero section: dark background, white headline in Udemy Sans 36px bold, purple search bar pill, subcategory links below"
