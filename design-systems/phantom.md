# Design System Inspired by Phantom

## 1. Visual Theme & Atmosphere

Phantom's design language is the gold standard of Web3 premium — a dark, deep-space aesthetic where purple glass morphism floats above void-black backgrounds to create an interface that feels simultaneously futuristic and trustworthy. The deep dark base (`#1A1F2E`) and near-black (`#0E1118`) create a layered spatial depth, while the signature purple spectrum — from soft lavender (`#AB9FF2`) to deep violet (`#512DA8`) — anchors the crypto-native identity without resorting to the neon excess of lesser Web3 interfaces.

Glass morphism is used with restraint and purpose. Wallet cards and token list items use `backdrop-filter: blur(20px)` with semi-transparent purple-tinted backgrounds, creating the sensation that crypto assets float in a dimensional space. Gradient treatments — from deep purple to transparent — give NFT thumbnails and portfolio summary cards a premium, editorial quality. This is not a mere aesthetic choice; the layered depth communicates that your assets exist in a sophisticated, protected environment.

The typography follows a clean Inter-led hierarchy with monospace (`SF Mono` / `JetBrains Mono`) used exclusively for wallet addresses and transaction hashes — the critical data that requires letter-by-letter accuracy. NFT display is the showpiece of the system: grid layouts with subtle animated gradient borders, rarity indicators, and collection badges create a gallery-quality browsing experience for digital assets.

**Key Characteristics:**
- Deep dark base `#1A1F2E` + near-black `#0E1118` background system
- Purple spectrum: `#AB9FF2` (soft lavender) to `#512DA8` (deep violet) accent
- Glass morphism cards: `backdrop-filter blur(20px)` + rgba purple tint overlays
- Inter for all UI text; SF Mono / JetBrains Mono for addresses and hashes
- Gradient hero: `linear-gradient(135deg, #512DA8, #AB9FF2)` for primary surfaces
- NFT grid: 4px animated gradient border on hover, rarity color-coded badges
- Solana green `#9945FF` / `#14F195` teal for SOL-specific contexts
- Micro-animations: 250ms spring on balance updates, token list loads with stagger

## 2. Color Palette & Roles

### Primary
- **Deep Dark** (`#1A1F2E`): Primary app background and card surfaces
- **Void Black** (`#0E1118`): Deepest background layer, nav bar, bottom safe area
- **Lavender** (`#AB9FF2`): Primary purple accent — highlights, active states, CTAs

### Purple Spectrum
- **Deep Violet** (`#512DA8`): Dark purple for gradients, background tones
- **Medium Purple** (`#7B5EA7`): Mid-gradient purple, secondary elements
- **Periwinkle** (`#C4B5FD`): Light purple, disabled button states, chip backgrounds
- **Purple Tint** (`rgba(171, 159, 242, 0.12)`): Glassmorphic card tint
- **Purple Glow** (`rgba(171, 159, 242, 0.25)`): Box-shadow glow on active cards

### Solana Brand
- **Solana Purple** (`#9945FF`): SOL-native branding moments
- **Solana Teal** (`#14F195`): SOL confirmation, success states in Solana context

### Status
- **Confirm Green** (`#22D18C`): Transaction confirmed, wallet connected
- **Pending Amber** (`#F5A623`): Transaction pending, awaiting confirmation
- **Error Red** (`#EF4444`): Transaction failed, insufficient funds, error
- **Warning Orange** (`#F97316`): Low balance warning, fee spike alert

### Neutrals (Dark System)
- **Gray 800** (`#2D3348`): Card borders, subtle dividers
- **Gray 700** (`#3D4462`): Secondary surface differentiators
- **Gray 500** (`#6B7280`): Secondary text, labels
- **Gray 300** (`#9CA3AF`): Tertiary text, disabled text
- **White** (`#FFFFFF`): Primary text on dark, SOL amounts
- **Off White** (`#E5E7EB`): Secondary text, body content

### Surface (Glassmorphic)
- **Glass Card** (`rgba(171, 159, 242, 0.08)`): Standard glass card background
- **Glass Elevated** (`rgba(171, 159, 242, 0.14)`): Elevated modal, sheet glass
- **Glass Border** (`rgba(171, 159, 242, 0.20)`): Glass card border/outline

## 3. Typography Rules

### Font Families
- **Inter**: `'Inter', -apple-system, sans-serif` — All UI labels, body text, amounts
- **SF Mono**: `'SF Mono', 'JetBrains Mono', 'Fira Code', monospace` — Addresses, hashes
- **System fallback**: `-apple-system, BlinkMacSystemFont, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Portfolio Balance | Inter | 40px | 700 | 48px | White, center-display |
| SOL Amount | Inter | 28px | 700 | 36px | Lavender `#AB9FF2` |
| Section Header | Inter | 20px | 700 | 28px | White |
| Token Name | Inter | 17px | 600 | 24px | White |
| Token Balance | Inter | 17px | 700 | 24px | White, right-aligned |
| Token USD Value | Inter | 14px | 400 | 20px | Gray `#9CA3AF` |
| Wallet Address | SF Mono | 13px | 400 | 20px | Lavender, truncated middle |
| TX Hash | SF Mono | 12px | 400 | 18px | Gray `#6B7280`, full hash |
| NFT Title | Inter | 15px | 600 | 22px | White |
| NFT Collection | Inter | 13px | 400 | 18px | Lavender `#AB9FF2` |
| Rarity Badge | Inter | 11px | 700 | 14px | Uppercase, rarity color |
| Button Label | Inter | 15px | 600 | 20px | White or black per bg |
| Caption | Inter | 12px | 400 | 16px | Gray `#9CA3AF` |

## 4. Component Stylings

### Buttons

**Primary CTA (Purple Gradient)**
```
background: linear-gradient(135deg, #512DA8, #AB9FF2)
color: #FFFFFF
font: Inter 15px 600
padding: 14px 28px
border-radius: 12px
border: none
hover: filter brightness(1.1)
shadow: 0 4px 20px rgba(171, 159, 242, 0.35)
transition: all 200ms ease
```

**Secondary / Lavender Ghost**
```
background: rgba(171, 159, 242, 0.10)
color: #AB9FF2
border: 1px solid rgba(171, 159, 242, 0.30)
padding: 13px 27px
border-radius: 12px
hover: background rgba(171, 159, 242, 0.18)
backdrop-filter: blur(8px)
```

**Destructive / Danger**
```
background: rgba(239, 68, 68, 0.12)
color: #EF4444
border: 1px solid rgba(239, 68, 68, 0.25)
border-radius: 12px
padding: 13px 27px
hover: background rgba(239, 68, 68, 0.20)
```

### Cards & Containers

**Wallet Balance Card (Glass)**
```
background: rgba(171, 159, 242, 0.08)
backdrop-filter: blur(20px)
border: 1px solid rgba(171, 159, 242, 0.20)
border-radius: 20px
padding: 24px
gradient-overlay: linear-gradient(135deg, rgba(81,45,168,0.3), transparent)
balance: 40px 700 white center
address: SF Mono 13px lavender truncated below
shadow: 0 8px 32px rgba(171,159,242,0.10)
```

**Token List Row**
```
background: rgba(171, 159, 242, 0.06)
border: 1px solid rgba(171, 159, 242, 0.12)
border-radius: 12px
padding: 16px
layout: token-icon (40px) | name+network | balance+usd right
margin-bottom: 8px
hover: background rgba(171, 159, 242, 0.12)
transition: all 150ms ease
```

**NFT Card**
```
background: #1A1F2E
border-radius: 16px
overflow: hidden
image: top 200px, object-fit cover
on-hover: border gradient animated 4px rgba(171,159,242,0.6)
padding: 12px (metadata below image)
title: Inter 15px 600 white
collection: Inter 13px lavender
rarity badge: absolute top-right, pill, color by rarity tier
```

**Transaction History Row**
```
background: transparent
padding: 16px 0
border-bottom: 1px solid rgba(171,159,242,0.10)
icon: left 40px circle, activity-type icon
content: TX type + address truncated | amount + status right
amount color: green (+) / gray (-)
status: small pill badge
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Card padding: 24px (wallet card), 16px (token/tx rows)
- Section gaps: 24px between wallet sections
- NFT grid gap: 12px
- Page margins: 20px mobile, 24px max

### Border Radius Scale
- `8px` — Small chips, status badges
- `12px` — Token rows, buttons, smaller cards
- `16px` — NFT cards, confirmation modals
- `20px` — Wallet balance card, primary panels
- `50%` — Token icons, avatar circles

### Grid
- Mobile: Single column, 20px margins
- NFT Grid: 2-column mobile, 3-column tablet
- Token list: single column list
- Desktop: 360px app-width centered (mobile-first web app)

## 6. Depth & Elevation

```
Level 0 - Base:       #0E1118 (deepest background)
Level 1 - App BG:     #1A1F2E (app background)
Level 2 - Glass Card: rgba(171,159,242,0.08) + blur(20px)
Level 3 - Modal:      rgba(171,159,242,0.14) + blur(40px) + 0 8px 40px rgba(0,0,0,0.5)
Level 4 - Alert:      #1A1F2E + 0 16px 60px rgba(0,0,0,0.6)
Glow accent:          0 0 40px rgba(171,159,242,0.20) on wallet card
```

## 7. Do's and Don'ts

### Do
- Use `backdrop-filter: blur(20px)` on glass cards — it's the Phantom signature
- Apply neon glow shadows `rgba(171,159,242,0.25)` on hover for premium feel
- Use SF Mono / JetBrains Mono exclusively for wallet addresses and TX hashes
- Display NFTs in gallery quality with rarity badges and collection metadata
- Animate portfolio balance updates with spring physics
- Use Solana teal `#14F195` for SOL confirmation states (blockchain-native color)

### Don't
- Don't use light or white backgrounds — Phantom is a dark-only system
- Don't use glassmorphism without dark backgrounds — it only works on dark
- Don't display full wallet addresses without middle truncation (0x1234...5678)
- Don't use harsh fully-saturated colors — the muted purple system is the aesthetic

## 8. Responsive Behavior

**Breakpoints:**
- `390px` — Primary mobile (iPhone wallet experience)
- `430px` — Large iPhone: expanded NFT grid
- `768px` — Browser extension popup: 360px fixed-width panel
- `1024px` — Web wallet: centered 480px max-width, sidebar optional
- `1440px` — Dashboard: 2-column with portfolio chart left, actions right

**Adaptive Patterns:**
- Balance: 40px mobile → 56px desktop dashboard
- NFT grid: 2-col mobile → 3-col desktop
- Navigation: bottom tab bar mobile → left sidebar desktop
- Wallet address: middle-truncated at all sizes

## 9. Agent Prompt Guide

### Quick Color Reference
```
Deep Dark BG:    #1A1F2E   — app background
Void Black:      #0E1118   — deepest layer, nav
Lavender:        #AB9FF2   — primary purple accent
Deep Violet:     #512DA8   — gradient dark end
Glass Tint:      rgba(171,159,242,0.08) — card backgrounds
Solana Teal:     #14F195   — SOL confirmation green
```

### Example Component Prompts
- "A Phantom wallet balance card: dark `#1A1F2E` with purple glass overlay rgba(171,159,242,0.08), blur backdrop, 20px radius, '$4,291.73' 40px white bold center, wallet address SF Mono lavender below, subtle purple glow shadow"
- "A Phantom NFT grid card: 16px radius, full NFT image top 200px, title 15px bold white below, collection name 13px lavender, rarity badge pill top-right with tier color"
- "A Phantom token list row: 12px radius glass card, token icon left 40px, name 17px 600 white + network label, balance right 17px bold white + USD value 14px gray below"
- "A Phantom primary CTA: purple gradient 135deg from `#512DA8` to `#AB9FF2`, white Inter 15px 600, 12px radius, purple glow shadow 0 4px 20px"
