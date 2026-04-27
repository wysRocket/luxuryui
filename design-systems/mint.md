---
name: Mint
colors:
  tertiary: "#00A651"
  neutral: "#F5F5F5"
  primary: "#00A651"
  secondary: "#757575"
typography:
  h1:
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.15
  h2:
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
  h3:
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 12px
  lg: 24px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Mint by Intuit established the design language for modern personal finance apps — clean white surfaces, confidently green accents, and a data-visualization-forward approach that makes budgets feel manageable rather than stressful. The primary green (`#00A651`) communicates money, health, and growth without the anxiety-inducing red that financial apps often default to for alerts. A secondary mint-teal (`#2AB27B`) provides depth and hover states.

The design philosophy is "financial clarity made friendly." Charts are smooth and colorful without being garish — a donut chart for spending categories uses a curated palette of 8 brand-approved colors. The type system uses Avenir, a geometric humanist sans-serif that combines approachability with the precision expected in a financial context. Numbers are always set in tabular figures for column alignment.

Navigation is category-centric: Accounts, Budgets, Transactions, Bills, Trends, Goals — each with a distinctive color-coded icon. The app surfaces the financial story with minimal user configuration, using large type for totals, small type for details, and charts as the primary communication medium. Green dominates positive states; neutral grays carry negative or static states; red is reserved only for genuine alerts.

**Key Characteristics:**
- Primary green: `#00A651` — brand, positive financial states, CTAs
- Secondary mint: `#2AB27B` — hover states, chart fills, secondary accents
- White dominant: `#FFFFFF` — cards, content backgrounds
- Avenir — geometric, humanist, friendly precision
- Tabular-nums on all financial values
- 8-color spending category palette: Avenir at 12px, rounded legend dots
- Smooth donut charts for budget categories
- Red `#E53935` reserved only for overspent / alerts

## Colors

### Primary
- **Mint Green** (`#00A651`): brand, primary CTAs, income indicators, on-track budgets
- **Teal** (`#2AB27B`): hover states, chart secondary, progress fills
- **White** (`#FFFFFF`): card and page backgrounds
- **Ink** (`#212121`): primary text, account names, transaction amounts
- **Gray** (`#757575`): secondary text, dates, categories

### Interactive
- **Green Hover** (`#00843F`): button hover, link hover
- **Red Alert** (`#E53935`): overspent budgets, late bills, negative balance
- **Category Colors**: Food `#FF6B35`, Transport `#4EC9B0`, Shopping `#7B68EE`, Health `#00C9A7`, Entertainment `#FFB347`, Travel `#5C9BD6`, Bills `#FF8A65`, Personal `#AB47BC`

### Surface
- **Page Background** (`#F5F5F5`): light gray behind cards
- **Card** (`#FFFFFF`): account cards, transaction lists
- **Border** (`rgba(0,0,0,0.08)`): card outlines, row separators
- **Chart Track** (`#E8E8E8`): donut/progress bar unfilled track

## Typography

### Font Families
- **Avenir**: `"Avenir", "Avenir Next", "Nunito", sans-serif` — all text at all sizes
- **System fallback**: `"Helvetica Neue", Helvetica, Arial, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Account Total | Avenir | 36px | 800 | 1.0 | Tabular nums, ink or green |
| H1 | Avenir | 28px | 800 | 1.15 | Page titles |
| H2 | Avenir | 22px | 700 | 1.2 | Section headers |
| H3 | Avenir | 18px | 700 | 1.3 | Card titles |
| Body Large | Avenir | 16px | 400 | 1.6 | Descriptions |
| Body Default | Avenir | 14px | 400 | 1.5 | Transaction labels |
| Amount | Avenir | 14px | 600 | 1.3 | Tabular nums; positive green, negative red |
| Label | Avenir | 12px | 700 | 1.2 | Category tags, uppercase |
| Caption | Avenir | 11px | 400 | 1.4 | Dates, metadata |

## Layout

### Spacing System
- Base: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Card gap: 12px
- Content padding: 16px mobile, 24px desktop

### Border Radius Scale
- **4px** — category dots, small badges
- **8px** — inputs, small tags
- **12px** — account cards, chart containers, budget cards
- **24px** — primary buttons (pill)
- **50%** — account institution logos, avatar circles

## Elevation & Depth

- **Level 0** (page): `#F5F5F5` — neutral background
- **Level 1** (card): `1px solid rgba(0,0,0,0.08)` — flat cards
- **Level 2** (hover): `box-shadow: 0 2px 8px rgba(0,0,0,0.10)` — interactive hover
- **Level 3** (modal): `box-shadow: 0 8px 32px rgba(0,0,0,0.18)` — full dialog
- **Green progress glow**: `box-shadow: 0 0 0 2px rgba(0,166,81,0.25)` — focus state

## Components

### Buttons
- **Primary**: `background: #00A651`, `color: #FFFFFF`, `border-radius: 24px`, `padding: 12px 24px`, `font: Avenir 16px 800`
- **Hover**: `background: #00843F`
- **Secondary**: `border: 2px solid #00A651`, `color: #00A651`, `background: transparent`, `border-radius: 24px`
- **Alert / Destructive**: `background: #E53935`, `color: #FFFFFF`, `border-radius: 24px`
- **Ghost**: `color: #00A651`, no border, hover underline

### Cards & Containers
- **Account Card**: `background: #FFFFFF`, `border-radius: 12px`, `border: 1px solid rgba(0,0,0,0.08)`, `padding: 20px`, account name + total + institution logo
- **Transaction Row**: `padding: 12px 16px`, `border-bottom: 1px solid rgba(0,0,0,0.06)`, category dot left, merchant name, amount right (green positive / red negative)
- **Budget Card**: `border-radius: 12px`, progress bar with color, remaining amount
- **Chart Container**: `background: #FFFFFF`, `border-radius: 12px`, padding 16px, donut or bar chart centered

## Do's and Don'ts

### Do
- Color transaction amounts green (income/positive) or red (expense) consistently
- Use tabular-nums for all financial figures — alignment is critical
- Show category spending in the 8-color palette with circular legend dots
- Use pill-shaped buttons (24px radius) — financial apps feel more trustworthy with rounded shapes
- Present overspent budgets in red immediately — don't soften urgent information

### Don't
- Don't use red for neutral negative values — only for genuinely urgent alerts
- Don't show account numbers without masking (show last 4 only)
- Don't animate financial totals with counting effects — trustworthiness requires stability
- Don't use more than 8 category colors — consistency aids pattern recognition

## Responsive Behavior

Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)

- **375px**: single-column; bottom tab navigation; stacked account cards
- **768px**: 2-column dashboard; sidebar navigation; wider charts
- **1024px**: full dashboard: account sidebar | transactions | budget overview

## Agent Prompt Guide

### Quick Color Reference
- Brand: `#00A651`
- Background: `#F5F5F5`
- Card: `#FFFFFF`
- Text: `#212121`
- Income: `#00A651`
- Expense: `#E53935`

### Example Component Prompts
- "A transaction row with 12px 16px padding, 1px rgba(0,0,0,0.06) bottom border, 8px category color dot left, Avenir 14px merchant name, Avenir 14px 600 tabular-nums amount right — green if positive, red if negative"
- "A budget card with 12px radius, white background, Avenir 18px 700 category name, green progress bar at 4px height, 'X left of $Y' in 12px gray below"
- "A primary CTA with #00A651 fill, white Avenir text 16px 800, pill border-radius 24px, 12px×24px padding"
