---
name: Uniswap
colors:
  neutral: "#0D0E0F"
  primary: "#FF007A"
  tertiary: "#E6006E"
typography:
  label:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28
rounded:
  sm: 6px
  md: 16px
  lg: 20px
---

## Overview

Uniswap's design language establishes a new visual category for decentralized finance: it is the first DeFi product to feel genuinely consumer-grade. The interface strips away the intimidating complexity of DEX mechanics and presents them through a design vocabulary borrowed from fintech — clean surfaces, confident typography, precise color usage. The result is an interface that feels as approachable as a currency exchange app while hiding extraordinary cryptographic complexity underneath.

The brand's defining visual element is the hot pink accent (`#FF007A`) — a deliberate deviation from the crypto industry's standard blue palettes. This singular chromatic choice communicates Uniswap's independence and confidence. Pink appears exclusively on the primary swap CTA, on selected states, and on the Uniswap logo — making it instantly identifiable without needing any text. The dark backgrounds (`#0D0E0F` for the deepest surfaces, `#1C1B20` for elevated components) create a premium digital-native feel that mirrors high-end trading terminal aesthetics.

Inter typeface provides a technical-adjacent character through its extensive OpenType features and precise metrics. Numbers render particularly well in Inter — transaction amounts, token prices, and liquidity figures all benefit from its tabular digit alignment. The swap interface itself is an exercise in minimal state management: two token selectors, an input, a flip button, and a CTA. This radical simplicity is the product's greatest design achievement — reducing a sophisticated AMM protocol to a form that takes less than 30 seconds to understand.

**Key Characteristics:**
- Hot pink (`#FF007A`) exclusive to primary CTA and brand identity
- Deep dark backgrounds: `#0D0E0F` (base) + `#1C1B20` (elevated)
- Inter typeface for all text — tabular numbers for financial values
- Swap card: single focused card, centered, max-width 480px
- Token selector as a custom dropdown with logos + symbol + full name
- Price impact color coding: green (good) → yellow → red (high slippage)
- Liquidity pool depth visualization using subtle gradient graphs
- Web3 connection badge showing chain logo + address truncated

## Colors

### Primary
- **Hot Pink** (`#FF007A`): Swap CTA button, brand logo, selected tab indicator
- **Base Dark** (`#0D0E0F`): Page background, outermost surface
- **Surface Elevated** (`#1C1B20`): Swap card, modals, panels

### Interactive
- **Pink Hover** (`#FF2994`): CTA hover, slightly brightened
- **Pink Pressed** (`#E6006E`): CTA pressed/active
- **Link Pink** (`#FF007A`): Text links, "Learn more" in brand contexts

### Surface
- **Surface 1** (`#0D0E0F`): Base background
- **Surface 2** (`#1C1B20`): Card, modal background
- **Surface 3** (`#28262F`): Input fields, dropdowns within card
- **Surface 4** (`#312F38`): Hover state on inputs, active token field
- **Border** (`rgba(255,255,255,0.10)`): Card borders, separators
- **Border Hover** (`rgba(255,255,255,0.18)`): Hovered border state

### Text
- **Primary** (`#FFFFFF`): Main values, token amounts, headings
- **Secondary** (`rgba(255,255,255,0.60)`): Subtext, labels, USD equivalent
- **Tertiary** (`rgba(255,255,255,0.35)`): Placeholder, disabled text
- **Pink Accent** (`#FF007A`): Pink-colored text in brand moments

### Semantic
- **Price Impact Green** (`#40B66B`): Good price impact (<0.1%)
- **Price Impact Yellow** (`#F3B71E`): Moderate impact (0.1%–3%)
- **Price Impact Red** (`#FD766B`): High impact / warning (>3%)
- **Pool Fee** (`rgba(255,0,122,0.20)`): Fee tier badge background
- **Chain Badge** (`#6B3FCC`): Ethereum chain indicator

## Typography

### Font Families
- **Primary**: `"Inter", -apple-system, "Helvetica Neue", sans-serif` — all text
- **Numeric (tabular)**: Inter with `font-feature-settings: "tnum" 1` — all prices and amounts

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Token Amount Input | Inter | 36px | 500 | 44px | Large swap input field |
| Token Symbol | Inter | 20px | 600 | 28px | Selected token symbol |
| USD Equivalent | Inter | 14px | 400 | 20px | "≈ $1,234.56" below amount |
| Swap Label | Inter | 14px | 500 | 20px | "You pay" / "You receive" |
| Price Info Row | Inter | 14px | 400 | 20px | Slippage, route, fee |
| CTA Button | Inter | 20px | 600 | 28px | "Swap" button text |
| Token List Name | Inter | 16px | 500 | 22px | Full token name in selector |
| Token List Symbol | Inter | 14px | 400 | 20px | Token ticker, secondary |
| Pool APR | Inter | 20px | 600 | 28px | Pool overview headline |
| Section Header | Inter | 20px | 600 | 28px | "Pools", "Tokens" tabs |
| Nav Label | Inter | 16px | 500 | 22px | Top navigation |
| Wallet Address | Inter | 14px | 500 | 20px | Truncated `0x123…abcd` |

## Layout

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 48px`
- Card padding: `8px` outer, `16px` per input panel
- Gap between swap panels: `2px` (flip button bridges it)
- Navigation height: `72px`
- Page padding: `16px` mobile, `0px` desktop (card centered)

### Layout Structure
- Max-width for swap card: `480px`
- Centered in viewport vertically (slightly above center) and horizontally
- Pools table: full-width, max-width `1400px`
- Tokens table: same as pools
- Left nav (desktop): hidden; top nav only

### Border Radius Scale
- `0px` — price impact lines, chart lines
- `6px` — small badges, fee tier chips
- `12px` — tooltips, small dropdowns
- `16px` — token input panels
- `20px` — main swap card, swap button
- `100px` — connect wallet, token selector pill

## Elevation & Depth

### Shadow Scale
- **Base Page** — no shadow (dark background provides context)
- **Swap Card** — `0 4px 32px rgba(0,0,0,0.40)`
- **Token Dropdown** — `0 4px 24px rgba(0,0,0,0.60)`, border radius 20px
- **Tooltip** — `0 4px 16px rgba(0,0,0,0.50)`
- **Modal** — `0 8px 40px rgba(0,0,0,0.70)`

### Depth Cues
- Nested panels use progressively lighter surface colors (Surface 1 → 2 → 3 → 4)
- No gradients used as depth metaphors — pure flat color steps

## Components

### Buttons

**Primary (Swap CTA)**
- Background: `#FF007A`
- Text: `#FFFFFF`, 20px Inter 600
- Padding: `16px`
- Border radius: `20px`
- Width: `100%`
- Hover: background `#FF2994`
- Active: background `#E6006E`
- Disabled: background `rgba(255,0,122,0.40)`, cursor not-allowed

**Connect Wallet**
- Background: `rgba(255,0,122,0.15)`
- Text: `#FF007A`, 16px Inter 600
- Padding: `12px 20px`
- Border radius: `100px`
- Border: `1px solid rgba(255,0,122,0.30)`
- Hover: background `rgba(255,0,122,0.25)`

**Token Selector**
- Background: `#28262F`
- Text: `#FFFFFF`, 20px Inter 600
- Padding: `8px 12px`
- Border radius: `100px`
- Display: token logo (24px) + symbol + chevron
- Hover: background `#312F38`

**Fee Tier Badge**
- Background: `rgba(255,0,122,0.20)`
- Text: `#FF007A`, 12px Inter 600
- Padding: `2px 8px`
- Border radius: `6px`

### Cards & Containers

**Swap Card**
- Background: `#1C1B20`
- Border: `1px solid rgba(255,255,255,0.10)`
- Border radius: `20px`
- Padding: `8px`
- Max width: `480px`, centered
- Box shadow: `0 4px 32px rgba(0,0,0,0.40)`

**Token Input Panel**
- Background: `#28262F`
- Border radius: `16px`
- Padding: `16px`
- Label: "You pay" in secondary text, 14px
- Amount: 36px Inter 500 white
- Token selector: right-aligned pill
- USD value: below amount, 14px secondary
- Focus: border `1px solid rgba(255,0,122,0.50)`

**Flip Button (between inputs)**
- Background: `#1C1B20`
- Border: `4px solid #0D0E0F`
- Shape: `40px × 40px` circle
- Icon: swap arrows, white
- Positioned: centered between two panels, z-index above both
- Hover: background `#28262F`, icon rotates 180°

**Price Info Panel**
- Background: `transparent`
- Expanded from collapsed row
- Label-value pairs at 14px
- Route display: token → token with hop steps

## Do's and Don'ts

### Do
- Reserve `#FF007A` exclusively for the swap CTA and logo — diluting it destroys its signal value
- Use tabular numbers (Inter `tnum`) for all financial values — alignment is critical in trading
- Color-code price impact immediately and clearly — user safety depends on it
- Keep the swap card at max-width `480px` — wider breaks the focused interaction model
- Show gas estimate, minimum received, and route before the user confirms

### Don't
- Don't use bright colors other than pink — the dark+pink system is the brand
- Don't add decorative gradients to backgrounds — dark solids are the aesthetic
- Don't show token amounts without USD equivalents — cross-reference is essential
- Don't animate the swap card position — it should feel stable and anchored

## Responsive Behavior

**Breakpoints:**
- `375px` — mobile: full-width card, bottom nav tabs (Swap/Pool/Tokens/NFTs)
- `768px` — tablet: card centered with padding, top nav visible
- `1024px` — desktop: pools table visible, left stats panel
- `1440px` — wide: full analytics dashboard alongside swap

**Platform Adaptations:**
- Mobile: card is full-width with `16px` horizontal padding
- Token search: full-screen overlay on mobile, dropdown on desktop
- Transaction history: bottom sheet on mobile, right panel on desktop

## Agent Prompt Guide

### Quick Color Reference
- Hot Pink: `#FF007A`
- Background: `#0D0E0F`
- Surface Card: `#1C1B20`
- Input Surface: `#28262F`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255,255,255,0.60)`

### Example Component Prompts
- "Design a Uniswap swap card: #1C1B20 background 20px radius, two stacked input panels in #28262F 16px radius, hot pink #FF007A full-width swap button, flip button circle between panels, Inter typography"
- "Create a Uniswap token selector: #28262F pill background, token logo 24px + symbol in Inter 20px 600 weight + chevron, hovering darkens to #312F38"
- "Build a Uniswap price impact row: label in secondary rgba white, value color-coded green/yellow/red based on percentage, Inter 14px, collapsed by default with expand arrow"
- "Design a Uniswap pools table: dark background, columns for Pool Name/TVL/APR/Volume, pink accent on selected row, fee tier badges in pink-tinted chips"
