# Design System Inspired by Crypto Wallet

## 1. Visual Theme & Atmosphere

The generic crypto wallet design system establishes a visual language that communicates security, precision, and forward momentum. Built on a near-black canvas (`#0A0A0A`) with elevated dark surfaces, it creates a digital vault aesthetic — the interface feels protected, intentional, and serious. This is not a casual app; every design decision should reinforce the message that the user's assets are held with care and professionalism.

The accent is a crisp, confident green (`#00D18C`) — a color that signals both the financial domain (markets, gains, growth) and digital modernity. It appears on positive balance changes, confirm buttons, transaction success states, and interactive highlights. The contrast between the near-black surface and the luminous green creates instant visual hierarchy without relying on any secondary palette. Supporting values of grey and white handle all informational content, from token names to transaction details.

Portfolio visualization is the design's emotional core: a centered balance display (large, bold, high-contrast) communicates wealth at a glance. Below it, asset cards stack in a list that communicates diversification and position. Each asset shows a sparkline price chart — a tiny 48px-wide line chart that provides trend context without requiring the user to navigate away. Transaction history alternates sends (red directional indicator) and receives (green) to give the list an at-a-glance income/outflow narrative. The interface is always calm, always precise, never alarming unless there is genuine cause for alarm.

**Key Characteristics:**
- Near-black base (`#0A0A0A`) for primary page background
- Accent green (`#00D18C`) for gains, confirmations, active states
- Dark elevated surfaces (`#131313`, `#1A1A1A`) for cards and panels
- Inter typeface with tabular number features for all financial values
- Centered balance hero with portfolio total in `48px` weight 700
- Asset rows: logo + name + allocation % + value + sparkline
- Transaction list: directional icon (green receive / red send) + amount + hash
- QR code modal for receive addresses on dark background

## 2. Color Palette & Roles

### Primary
- **Background** (`#0A0A0A`): Deepest surface — page, behind all content
- **Accent Green** (`#00D18C`): CTAs, positive delta, receive indicator, active tab
- **White** (`#FFFFFF`): Primary text, large balance display

### Interactive
- **Green Hover** (`#00E89A`): CTA button hover, brighter accent
- **Green Pressed** (`#00B87A`): Pressed/active button
- **Red Action** (`#FF4D6A`): Send button, negative delta, warning

### Surface
- **Surface 1** (`#131313`): Primary card background, asset rows
- **Surface 2** (`#1A1A1A`): Elevated modals, bottom sheets
- **Surface 3** (`#222222`): Input fields, secondary panels
- **Surface 4** (`#2A2A2A`): Hover state on interactive surfaces
- **Border Subtle** (`rgba(255,255,255,0.08)`): Card borders, row dividers
- **Border Active** (`rgba(0,209,140,0.30)`): Green-tinted focused input border

### Text
- **Primary** (`#FFFFFF`): Balance, token names, primary labels
- **Secondary** (`rgba(255,255,255,0.55)`): USD values below token amount, subtitles
- **Tertiary** (`rgba(255,255,255,0.30)`): Timestamps, transaction hashes, placeholders
- **Green Text** (`#00D18C`): Positive price change, "+2.34%"
- **Red Text** (`#FF4D6A`): Negative price change, "-1.23%"

### Semantic
- **Confirm Green** (`#00D18C`): Transaction confirmation, success toast
- **Error Red** (`#FF4D6A`): Failed transaction, insufficient funds warning
- **Pending Yellow** (`#F5B400`): Pending transaction, awaiting confirmation
- **Network Badge** (`#6B3FCC`): Ethereum badge; varies by network

## 3. Typography Rules

### Font Families
- **Primary**: `"Inter", -apple-system, "Helvetica Neue", sans-serif` — all text
- **Numeric (tabular)**: Inter with `font-feature-settings: "tnum" 1, "lnum" 1` — all financial numbers

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Portfolio Balance | Inter | 48px | 700 | 56px | Center hero, tabular nums |
| Balance Delta | Inter | 18px | 500 | 24px | "+$123.45 (2.3%)" below balance |
| Section Header | Inter | 18px | 600 | 24px | "Assets", "Activity" |
| Asset Name | Inter | 16px | 600 | 22px | "Bitcoin", "Ethereum" |
| Asset Symbol | Inter | 14px | 400 | 20px | "BTC", "ETH" — secondary |
| Asset Value | Inter | 16px | 600 | 22px | "$42,350.00" — right-aligned |
| Asset Delta | Inter | 14px | 500 | 18px | "+3.2%" green/red |
| Transaction Amount | Inter | 16px | 600 | 22px | "+0.234 ETH" |
| Transaction Label | Inter | 14px | 400 | 20px | "Received from 0x12…" |
| Timestamp | Inter | 12px | 400 | 16px | "2h ago", "Jun 12" |
| CTA Button | Inter | 16px | 600 | 22px | "Send", "Receive", "Swap" |
| Address | Inter | 13px | 400 | 18px | `0x1234…abcd`, truncated |

## 4. Component Stylings

### Buttons

**Primary (Confirm / Receive)**
- Background: `#00D18C`
- Text: `#000000`, 16px Inter 600
- Padding: `14px 24px`
- Border radius: `12px`
- Hover: background `#00E89A`
- Active: background `#00B87A`
- Width: full-width in confirmation modals

**Danger (Send)**
- Background: `rgba(255,77,106,0.15)`
- Text: `#FF4D6A`, 16px Inter 600
- Border: `1px solid rgba(255,77,106,0.30)`
- Border radius: `12px`
- Hover: background `rgba(255,77,106,0.25)`

**Action Pill (Send / Receive / Swap / Buy)**
- Background: `#1A1A1A`
- Border: `1px solid rgba(255,255,255,0.10)`
- Icon: 24px, `#FFFFFF`
- Label: 13px, 500, secondary white below icon
- Shape: `12px` radius, `64px × 72px`
- Hover: background `#222222`, border green tint

### Cards & Containers

**Asset Row**
- Background: `#131313`
- Border-bottom: `1px solid rgba(255,255,255,0.08)`
- Height: `72px`
- Padding: `16px`
- Left: token logo 40px + name/symbol column
- Right: value + delta + 48px sparkline
- Hover: background `#1A1A1A`

**Transaction Row**
- Background: `transparent`
- Border-bottom: `1px solid rgba(255,255,255,0.06)`
- Height: `64px`
- Padding: `16px`
- Left: directional icon (32px circle, green/red fill) + label column
- Right: amount + secondary USD

**Portfolio Card (hero)**
- Background: `linear-gradient(180deg, #131313 0%, #0A0A0A 100%)`
- Border radius: `20px`
- Padding: `24px`
- Balance: centered, 48px bold white
- Delta row: centered, green/red 18px
- Chart: full-width sparkline, 80px height, green line

**Confirmation Modal**
- Background: `#1A1A1A`
- Border: `1px solid rgba(255,255,255,0.10)`
- Border radius: `20px`
- Padding: `24px`
- Transaction summary in center
- Gas estimate row at 14px secondary
- Confirm button full-width green at bottom

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24, 32, 48px`
- Row padding: `16px` horizontal
- Section gap: `24px`
- Page horizontal padding: `16px` mobile, `24px` desktop
- Hero section top padding: `40px`

### Layout Structure
- Mobile-first single column
- Balance hero centered, `100%` width
- Action pills: 4-up horizontal row below balance
- Assets: full-width list below action pills
- Tab bar (bottom): Home | Assets | Activity | Settings (56px height)

### Border Radius Scale
- `0px` — sparkline charts, horizontal bars
- `8px` — tags, network badges
- `12px` — buttons, input fields
- `16px` — asset rows (grouped card view)
- `20px` — main portfolio card, modals, bottom sheets
- `50%` — token logos, transaction direction icons

## 6. Depth & Elevation

### Shadow Scale
- **Base** — no shadow (dark bg is grounding layer)
- **Asset Card Group** — `0 2px 16px rgba(0,0,0,0.40)`
- **Modal / Sheet** — `0 -8px 40px rgba(0,0,0,0.60)`
- **Confirmation** — `0 8px 40px rgba(0,0,0,0.70)`
- **Green Glow (CTA)** — `0 0 20px rgba(0,209,140,0.20)` — on primary confirm button

### Overlay Treatments
- Bottom sheet: slides from bottom, background blurs via `backdrop-filter: blur(16px)`
- QR code modal: white QR on `#1A1A1A` surface with green border frame

## 7. Do's and Don'ts

### Do
- Always display USD equivalents alongside crypto amounts — dual denomination is essential
- Color-code all deltas: green for positive, red for negative — never leave delta uncolored
- Use tabular number alignment for all financial values — columns must align vertically
- Show transaction status (pending/confirmed/failed) with corresponding semantic color
- Display network indicator on every balance and transaction — chain context is critical

### Don't
- Don't use green for non-financial positive states — preserve its semantic meaning
- Don't truncate balance values — show full precision or use compact notation (1.23M)
- Don't use rounded token logos that clip logos with transparency — use circle crop with fallback
- Don't animate balance numbers on load without easing — jarring number jumps damage trust

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — primary mobile target; all content single-column
- `768px` — tablet; portfolio card wider, assets 2-column
- `1024px` — desktop; sidebar navigation, main content area
- `1280px` — wide; side-by-side portfolio + activity panel

**Platform Adaptations:**
- Mobile: biometric authentication gate (FaceID/TouchID visual)
- QR scanner: full-screen camera overlay with green scan frame
- Address input: hardware keyboard with monospace display
- Desktop: web3 wallet connection (MetaMask etc.) via browser extension

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#0A0A0A`
- Accent Green: `#00D18C`
- Surface Card: `#131313`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255,255,255,0.55)`
- Red Danger: `#FF4D6A`

### Example Component Prompts
- "Design a crypto wallet portfolio screen: #0A0A0A background, centered balance display in Inter 48px bold white, green delta below, 4-button action row (Send/Receive/Swap/Buy) on dark cards, asset list below with token logos + sparklines"
- "Create a wallet asset row: 40px token logo, token name in Inter 16px bold white, symbol in secondary, right-aligned USD value + percentage delta in green/red"
- "Build a transaction confirmation modal: #1A1A1A dark card 20px radius, summary of send amount + recipient address, gas fee row, full-width green confirm button with subtle glow"
- "Design a wallet receive screen with QR code centered on dark surface, wallet address in Inter monospace below, copy button and share button in secondary style"
