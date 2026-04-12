# Design System Inspired by TripAdvisor

## 1. Visual Theme & Atmosphere

TripAdvisor's design system embodies the spirit of exploration: warm, trustworthy, and community-driven. The signature green — a bright, optimistic `#34E0A1` for highlights and the deeper, authoritative `#00AA6C` for primary interactive elements — is among the most recognizable brand colors in travel. Green signals freshness, nature, and the go-ahead to book with confidence. Against white backgrounds, these greens create an inviting, energetic interface that never feels corporate or intimidating.

The review-centric nature of the product shapes every layout decision. User-generated content — star ratings, review snippets, traveler photos — occupies more visual real estate than brand-produced imagery. Cards are generous in size, showing photo, name, rating bubble (TripAdvisor's iconic green owl badge format), review count, and price tier all in a single scannable unit. The information hierarchy is ruthlessly optimized for decision-making: can I afford it? Is it well-reviewed? Is it near me?

Trip Sans — TripAdvisor's custom typeface — gives the brand a proprietary voice: it's geometric, friendly, and slightly rounded. Used at large sizes for hero headings, it communicates confidence without coldness. The interface balances photography (hotel exterior shots, restaurant interiors, destination landscapes) with dense text blocks from community reviews. Map integration throughout — from search results to individual property pages — emphasizes the spatial nature of travel planning. The design is fundamentally about orientation: where am I going, and can I trust this information?

**Key Characteristics:**
- TripAdvisor Green Bright (`#34E0A1`) for highlights and secondary accents
- TripAdvisor Green Dark (`#00AA6C`) for primary interactive states and buttons
- White (`#FFFFFF`) primary surface for all content areas
- Trip Sans for display headings; Inter/system font for body and UI
- Star/bubble rating system as core visual language component
- Card-based layout with generous 16px padding inside cards
- Map integration with green pins matching brand color
- Review snippet cards with user avatar + rating + date

## 2. Color Palette & Roles

### Primary
- **Green Primary** (`#00AA6C`): CTAs, active states, primary button, selected filter
- **Green Light** (`#34E0A1`): Highlights, success confirmations, badges
- **White** (`#FFFFFF`): All primary surfaces, card backgrounds, page background

### Interactive
- **Green Dark** (`#007A4D`): Button hover and active/pressed state
- **Blue Link** (`#007AFF`): External links, "Read more" text links
- **Red Alert** (`#D93025`): Price alerts, urgent callouts

### Surface
- **Background Grey** (`#F2F2F2`): Page background behind cards
- **Card Surface** (`#FFFFFF`): Card backgrounds, panels
- **Border Light** (`rgba(0,0,0,0.10)`): Card borders, dividers
- **Surface Tinted** (`#F0FBF7`): Light green tinted backgrounds for callouts

### Text
- **Primary** (`#151515`): Main headings, property names, review titles
- **Secondary** (`#555555`): Body text, review content
- **Tertiary** (`#888888`): Timestamps, metadata, review counts
- **Link** (`#00AA6C`): Branded links, "See all" actions

### Semantic
- **Rating Green** (`#00AA6C`): Rating bubble background (excellent)
- **Rating Yellow** (`#FFBE00`): Star fill color
- **Price Tier** (`#555555`): $ $$ $$$ dollar signs
- **Verified** (`#00AA6C`): Verified review badge

## 3. Typography Rules

### Font Families
- **Display**: `"Trip Sans", "Helvetica Neue", sans-serif` — hero headings, property names
- **UI**: `"Inter", -apple-system, "Helvetica Neue", sans-serif` — body, labels, navigation
- **Review Text**: `"Georgia", serif` — extended review body text for readability

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Hero Heading | Trip Sans | 40px | 700 | 48px | Destination/search hero |
| Section Title | Trip Sans | 24px | 700 | 32px | "Top Hotels", "Restaurants" |
| Property Name | Trip Sans | 20px | 700 | 28px | Hotel/restaurant name on card |
| Rating Number | Inter | 18px | 700 | 24px | "4.5", "Excellent" |
| Review Title | Inter | 16px | 700 | 22px | Review headline |
| Body / Review | Georgia | 15px | 400 | 24px | Review paragraph text |
| Card Metadata | Inter | 14px | 400 | 20px | Price, category, distance |
| Button Label | Inter | 15px | 700 | 20px | CTA text |
| Filter Tag | Inter | 13px | 500 | 18px | Filter chips |
| Timestamp | Inter | 12px | 400 | 16px | Review dates, "3 months ago" |
| Badge Label | Inter | 11px | 700 | 14px | "Travellers' Choice", badges |

## 4. Component Stylings

### Buttons

**Primary (Book Now / See Availability)**
- Background: `#00AA6C`
- Text: `#FFFFFF`, 15px Inter 700
- Padding: `12px 24px`
- Border radius: `4px`
- Hover: background `#007A4D`
- Width: full-width on mobile, auto on desktop

**Secondary**
- Background: `#FFFFFF`
- Border: `1px solid #00AA6C`
- Text: `#00AA6C`, 15px Inter 700
- Same dimensions as primary
- Hover: background `#F0FBF7`

**Filter Chip**
- Background: `#FFFFFF`
- Border: `1px solid rgba(0,0,0,0.20)`
- Text: `#151515`, 13px, weight 500
- Padding: `8px 16px`
- Border radius: `20px`
- Selected: background `#00AA6C`, text `#FFFFFF`, border `#00AA6C`

### Cards & Containers

**Hotel/Restaurant Card**
- Background: `#FFFFFF`
- Border: `1px solid rgba(0,0,0,0.10)`
- Border radius: `8px`
- Box shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Image: 16:9 or 4:3, border-radius `8px 8px 0 0`
- Padding: `16px`
- Hover: box-shadow `0 4px 16px rgba(0,0,0,0.12)`, border-color `rgba(0,0,0,0.20)`

**Rating Bubble**
- Shape: rounded rectangle `24px radius` or circle
- Background: `#00AA6C` (excellent 4.5+), `#3FD1A2` (very good), `#FFBE00` (average)
- Text: `#FFFFFF`, 14px Inter 700
- Size: 40px × 40px for list view, 56px for detail view

**Review Card**
- Background: `#FFFFFF`
- Border: `1px solid rgba(0,0,0,0.10)`
- Border radius: `8px`
- Padding: `20px`
- Avatar: 40px circle
- Stars: `#FFBE00` filled, `#CCCCCC` empty, 16px each

**Map Pin**
- Background: `#00AA6C`
- Text: `#FFFFFF`, price or rank number
- Shape: rounded pill `20px radius`
- Selected: background `#151515`, size scales up 1.2×

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`
- Card padding: `16px` internal
- Section vertical gaps: `32px`
- Page horizontal padding: `16px` (mobile), `24px` (tablet), `48px` (desktop)

### Grid System
- Mobile: 1-column card stack
- Tablet: 2-column card grid
- Desktop: 3-column card grid, max-width `1200px`
- Search/Map: split `420px` list + map fill remainder
- Card gap: `16px`

### Border Radius Scale
- `0px` — map tiles
- `4px` — buttons, badges
- `8px` — cards, image thumbnails, tooltips
- `20px` — filter chips, pills
- `50%` — user avatars

## 6. Depth & Elevation

### Shadow Scale
- **Card Default** — `0 2px 8px rgba(0,0,0,0.08)`
- **Card Hover** — `0 4px 16px rgba(0,0,0,0.12)`
- **Sticky Header** — `0 2px 4px rgba(0,0,0,0.10)`
- **Modal** — `0 8px 32px rgba(0,0,0,0.16)`
- **Tooltip** — `0 2px 8px rgba(0,0,0,0.20)`
- **Map Card** — `0 4px 12px rgba(0,0,0,0.20)`

## 7. Do's and Don'ts

### Do
- Show review count prominently alongside the rating — number of reviews is as important as the score
- Use full-color, high-resolution destination photography — it's the primary emotional hook
- Apply green for all positive confirmation states, not just primary CTAs
- Display TripAdvisor Travellers' Choice badge on qualifying properties
- Include distance and price tier on every card — essential filters for decision-making

### Don't
- Don't use the bright green (`#34E0A1`) for buttons — it's for highlights only; use `#00AA6C` for interactive
- Don't show ratings without review count — bare numbers lose credibility
- Don't truncate property names on desktop cards — users need the full name to evaluate
- Don't use red for non-alert elements — in a travel context, red signals danger or problems
- Don't mix Georgia serif and Trip Sans in the same text block

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — mobile; single column list, map as separate tab
- `768px` — tablet; 2-column grid, map toggle overlay
- `1024px` — desktop; 3-column grid, side-by-side list+map
- `1280px` — wide; larger map panel, 4-column grid in list mode

**Platform Adaptations:**
- Mobile: map hidden by default, accessible via toggle; sticky "Map" FAB
- Filters: bottom sheet on mobile, horizontal filter bar on desktop
- Photos: swipeable carousel on mobile, hover-play on desktop
- Review expansion: full page on mobile, inline expand on desktop

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand Green: `#00AA6C`
- Accent Green: `#34E0A1`
- Background: `#FFFFFF`
- Text Primary: `#151515`
- Text Secondary: `#555555`
- Card Border: `rgba(0,0,0,0.10)`

### Example Component Prompts
- "Design a TripAdvisor hotel card: white background, 8px radius, 4:3 hotel photo, green rating bubble #00AA6C, property name in Trip Sans 20px bold, star rating in gold, review count and price tier in grey metadata row, green Book Now button"
- "Create a TripAdvisor search result list with left-aligned hotel photos, property details right, rating bubbles, and a green map pin legend"
- "Build a review card with circular user avatar, yellow star rating, review title in Inter 16px bold, review body in Georgia 15px, date in tertiary grey"
- "Design a TripAdvisor filter bar with horizontal scrolling chips, green selected state, white unselected with border"
