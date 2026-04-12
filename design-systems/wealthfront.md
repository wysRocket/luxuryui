# Design System Inspired by Wealthfront

## 1. Visual Theme & Atmosphere

Wealthfront's design system communicates one idea above all others: trustworthy sophistication. As a robo-advisor managing billions in client assets, the interface must project the calm confidence of a seasoned wealth manager while remaining approachable to first-time investors. The dark navy foundation (`#1B2C4B`) evokes the deep midnight blue of private banking suites — authoritative, grounded, and reassuringly stable. It is never harsh or cold; it reads as executive, not austere.

The light blue accent (`#0096FF`) provides the system's only significant chromatic moment. Used on primary CTAs, active data states, and chart lines, it carries connotations of clarity, intelligence, and forward motion — well-suited to an AI-driven platform. Against the navy, it creates a contrast that feels curated rather than functional. Secondary information — account values, allocation percentages, performance figures — is expressed in light neutral whites and soft greys that recede appropriately without becoming invisible.

Avenir is the typeface of choice: a geometric humanist sans-serif with roots in modernist design that has become the quiet signature of premium financial products. Its proportions are elegant, its numerals are clean, and it renders beautifully at both display and caption sizes. Portfolio charts are the emotional centerpiece of the product: the performance line chart shows historical growth in a smooth, upward-trending curve (on a good day), rendered in Wealthfront's accent blue against a navy background, with subtle grid lines at key milestones. These charts are designed to make long-term investing feel emotionally satisfying and visually compelling.

**Key Characteristics:**
- Dark navy (`#1B2C4B`) as the signature brand background
- Light blue (`#0096FF`) for all interactive and active states
- Avenir typeface — geometric humanist, premium financial associations
- Portfolio line chart in accent blue on dark navy is the hero element
- Projection bands (light blue gradient fill) show future value ranges
- Clean table-style allocation breakdowns: asset class + % + dollar value
- Goal progress bars in light blue against dark surface
- CTA buttons: `#0096FF` pill, high contrast on dark backgrounds

## 2. Color Palette & Roles

### Primary
- **Navy Base** (`#1B2C4B`): Primary dark surface, backgrounds, hero sections
- **Light Blue** (`#0096FF`): CTAs, active states, chart lines, selected states
- **White** (`#FFFFFF`): Primary text on dark, light-mode card surfaces

### Interactive
- **Blue Hover** (`#0080DC`): Button hover, slightly darkened
- **Blue Active** (`#0067B3`): Button pressed state
- **Blue Soft** (`rgba(0,150,255,0.15)`): Hover background on dark surfaces

### Surface
- **Surface Dark** (`#1B2C4B`): Primary dark surface
- **Surface Medium** (`#243855`): Elevated cards on dark
- **Surface Light** (`#2D4468`): Dropdowns, panels above medium
- **Surface White** (`#FFFFFF`): Light mode card surfaces
- **Border Dark** (`rgba(255,255,255,0.10)`): Dividers on dark surfaces
- **Border Light** (`rgba(0,0,0,0.10)`): Dividers on light surfaces

### Chart Colors
- **Portfolio Line** (`#0096FF`): Main performance curve
- **Projection Band** (`rgba(0,150,255,0.15)`): Future projection fill
- **Benchmark Line** (`rgba(255,255,255,0.30)`): Comparison index dotted line
- **Gain Zone** (`rgba(0,200,100,0.10)`): Positive return area fill
- **Loss Zone** (`rgba(255,80,80,0.10)`): Negative return area fill

### Text
- **Primary Dark Bg** (`#FFFFFF`): Main text on navy
- **Secondary Dark Bg** (`rgba(255,255,255,0.60)`): Subtext, metadata on dark
- **Tertiary Dark Bg** (`rgba(255,255,255,0.35)`): Disabled, placeholders on dark
- **Primary Light Bg** (`#1B2C4B`): Text on white surfaces
- **Accent Blue** (`#0096FF`): Highlighted figures, active values

## 3. Typography Rules

### Font Families
- **Primary**: `"Avenir Next", "Avenir", -apple-system, "Helvetica Neue", sans-serif` — all UI text
- **Numeric (tabular)**: Avenir Next with tabular figure rendering for financial values

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Account Total | Avenir Next | 44px | 700 | 52px | Portfolio balance hero |
| Performance % | Avenir Next | 24px | 600 | 32px | "+12.4% this year" |
| Section Header | Avenir Next | 22px | 600 | 30px | "Your Portfolio", "Goals" |
| Card Heading | Avenir Next | 18px | 600 | 26px | Goal name, account type |
| Table Value | Avenir Next | 16px | 500 | 22px | Allocation dollar values |
| Table Label | Avenir Next | 16px | 400 | 22px | Asset class names |
| Body Text | Avenir Next | 15px | 400 | 24px | About sections, disclosures |
| CTA Button | Avenir Next | 16px | 600 | 22px | "Get Started", "Deposit" |
| Chart Label | Avenir Next | 12px | 400 | 16px | Year markers, axis labels |
| Metadata | Avenir Next | 13px | 400 | 18px | Last updated, account details |
| Caption | Avenir Next | 11px | 400 | 16px | Regulatory disclosures, footnotes |

## 4. Component Stylings

### Buttons

**Primary CTA**
- Background: `#0096FF`
- Text: `#FFFFFF`, 16px Avenir Next 600
- Padding: `14px 32px`
- Border radius: `100px` (pill)
- Hover: background `#0080DC`
- Active: background `#0067B3`
- Width: auto or full-width in forms

**Secondary**
- Background: `transparent`
- Border: `2px solid rgba(255,255,255,0.30)` (on dark)
- Text: `#FFFFFF`, 16px 600
- Same padding and radius
- Hover: border `rgba(255,255,255,0.60)`, bg `rgba(255,255,255,0.06)`

**Ghost (light mode)**
- Background: `transparent`
- Border: `2px solid #0096FF`
- Text: `#0096FF`, 16px 600
- Hover: background `rgba(0,150,255,0.08)`

### Cards & Containers

**Portfolio Card (dark)**
- Background: `#243855`
- Border: `1px solid rgba(255,255,255,0.10)`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 4px 24px rgba(0,0,0,0.30)`

**Goal Progress Card**
- Background: `#243855`
- Border radius: `12px`
- Padding: `20px`
- Progress bar: 8px height, blue fill on `rgba(255,255,255,0.12)` track, `100px` radius
- Goal name: 18px 600, white
- Progress label: "On Track" in green or "Adjust Plan" in yellow

**Allocation Table Row**
- Height: 56px
- Border-bottom: `1px solid rgba(255,255,255,0.08)`
- Left: color swatch (12px circle) + asset class name
- Right: percentage + dollar value
- Hover: background `rgba(255,255,255,0.04)`

**Performance Chart Container**
- Background: `#1B2C4B`
- Border radius: `16px`
- Padding: `24px 24px 16px`
- Chart: SVG/Canvas full width, 240px height minimum
- Time selector tabs: 1M | 3M | YTD | 1Y | ALL
- Tooltip: dark card with precise date + value + delta

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`
- Card padding: `24px`
- Section gap: `32px`
- Page padding: `16px` mobile, `32px` tablet, `64px` desktop

### Grid System
- Mobile: single column, full-width cards
- Tablet: 2-column card grid
- Desktop: main content area + `320px` sidebar
- Dashboard max-width: `1200px`, centered
- Chart: always full-width within its container

### Border Radius Scale
- `0px` — chart lines, table cell edges
- `4px` — small badges, tag chips
- `8px` — progress bar fills, small elements
- `12px` — compact cards, menu items
- `16px` — main cards, panels
- `100px` — CTA buttons, pills

## 6. Depth & Elevation

### Shadow Scale
- **Surface Card** — `0 4px 24px rgba(0,0,0,0.30)`
- **Sticky Header** — `0 2px 8px rgba(0,0,0,0.40)`
- **Tooltip / Chart Callout** — `0 4px 16px rgba(0,0,0,0.50)`
- **Modal** — `0 8px 48px rgba(0,0,0,0.60)`
- **Blue Accent Glow** — `0 0 16px rgba(0,150,255,0.15)` — CTA buttons

### Chart Depth Cues
- Area fill under performance line: `rgba(0,150,255,0.12)` to transparent gradient
- Grid lines: `rgba(255,255,255,0.06)` — barely visible
- Hover crosshair: `rgba(255,255,255,0.20)` vertical line

## 7. Do's and Don'ts

### Do
- Display the portfolio performance chart prominently — it's the product's emotional payoff
- Show both absolute dollar values and percentage changes for all performance figures
- Use Avenir Next consistently at specified weights — font weight drift breaks the premium feel
- Color-code goal status: blue (on track), green (ahead), yellow (behind), red (at risk)
- Include regulatory disclosures in 11px Avenir, in tertiary color — legally required

### Don't
- Don't use bright or saturated accent colors beyond `#0096FF` — the palette is intentionally restrained
- Don't show real-time market data without timestamps — context for recency is legally important
- Don't animate chart redraws without smooth easing — jarring chart transitions break trust
- Don't use red for general UI states — it signals financial loss and should be reserved for it
- Don't round financial figures beyond two decimal places without explicit compact notation

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — mobile: stacked cards, tab-switched performance/allocation
- `768px` — tablet: 2-column dashboard, chart expands
- `1024px` — desktop: persistent sidebar with account nav
- `1200px` — max width; 3-column layout for full dashboard

**Platform Adaptations:**
- Mobile: chart is swipeable across time periods (1M/3M/YTD/1Y)
- Allocation: pie chart on desktop, progress bars on mobile
- Deposit flow: multi-step modal on desktop, full-page flow on mobile
- Goal projections: interactive sliders on desktop, tap-to-edit on mobile

## 9. Agent Prompt Guide

### Quick Color Reference
- Navy Background: `#1B2C4B`
- Accent Blue: `#0096FF`
- Surface Elevated: `#243855`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255,255,255,0.60)`
- Chart Line: `#0096FF`

### Example Component Prompts
- "Design a Wealthfront portfolio dashboard: #1B2C4B navy background, centered account total in Avenir Next 44px bold white, performance line chart in #0096FF blue on dark surface, time period selector tabs, allocation breakdown table below"
- "Create a Wealthfront goal card: #243855 elevated card 16px radius, goal name in Avenir Next 18px bold white, blue progress bar on dark track showing 68% complete, 'On Track' label in green"
- "Build a Wealthfront CTA button: #0096FF pill button, Avenir Next 16px 600 white, 100px radius, subtle blue glow shadow"
- "Design a Wealthfront allocation table: dark navy surface, rows with color swatches + asset class names + right-aligned percentage and dollar values, subtle row hover state"
