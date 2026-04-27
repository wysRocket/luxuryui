---
name: Hopper
colors:
  neutral: "#FFFFFF"
  primary: "#7B3FF2"
  tertiary: "#6A2EDE"
  secondary: "#757575"
typography:
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sm: 8px
  md: 16px
  lg: 20px
spacing:
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
---

## Overview

Hopper's design is built around a single compelling proposition: predictive pricing intelligence that saves you money. The purple brand (`#7B3FF2`) reads as sophisticated and trustworthy — smarter than the brash reds of bargain travel sites, more energetic than the conservative blues of corporate OTAs. Against a white or light gray surface, the purple CTAs and price prediction indicators create a clear visual hierarchy that constantly directs users toward the savings-first interaction model.

The Hopper bunny mascot — a cartoonish but expressive rabbit — is woven into the product as a UI character: it reacts to price predictions (happy bunny = good time to book, concerned bunny = wait), appears in onboarding, and celebratory moments. This character integration bridges the gap between playful consumer brand and serious financial savings tool.

Typography is clean and systematic — a contemporary geometric sans-serif serves all text hierarchies, with price data rendered in large, bold display type to make savings immediately legible. The color-coded pricing calendar (green for cheap, yellow for moderate, red for expensive) is the most distinctive data visualization in the product. The overall experience communicates: "We've done the analysis; trust us."

**Key Characteristics:**
- Hopper Purple (`#7B3FF2`) as primary brand and CTA color
- White primary surface (`#FFFFFF`) — clean, savings-focused
- Bold price display typography as primary visual hierarchy
- Green-yellow-red pricing heat map calendar (signature data viz)
- Bunny mascot integrated as reactive UI character
- Secondary teal (`#00D9C0`) for "watch" mode and price alerts
- 12px–20px border radius throughout
- Bold prediction confidence metrics in prominent display

## Colors

### Primary
- **Hopper Purple** (`#7B3FF2`): CTAs, active states, brand elements
- **Pure White** (`#FFFFFF`): Primary surface
- **Near Black** (`#1A1A1A`): Primary text, headings

### Interactive
- **Hover Purple** (`#6A2EDE`): Button hover
- **Light Purple** (`#EDE7FF`): Selected state background, tint
- **Focus** (`rgba(123,63,242,0.3)`): Focus ring

### Surface
- **Light Gray** (`#F5F5F5`): Alternate sections, input backgrounds
- **Border** (`#E0E0E0`): Card borders, dividers
- **Secondary Text** (`#757575`): Labels, metadata, subtext

### Price Calendar Colors
- **Cheap Green** (`#4CAF50`): Lowest price days
- **Moderate Yellow** (`#FFC107`): Medium price days
- **Expensive Red** (`#F44336`): High price days
- **Teal Watch** (`#00D9C0`): "Watch this trip" active state

## Typography

### Font Families
- **Primary**: `Inter` / `SF Pro` — all UI text
- **Display**: `Inter` at weight 800 — price displays, key metrics

### Hierarchy

| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Price Hero | Inter | 52px | 800 | 1.00 | "Save $240" display |
| Prediction Headline | Inter | 28px | 700 | 1.15 | "Now is a great time" |
| Section Title | Inter | 20px | 700 | 1.25 | Trip summary headers |
| Price Display | Inter | 24px | 700 | 1.00 | Flight/hotel price |
| Price Comparison | Inter | 16px | 400 | 1.00 | Strikethrough original |
| Flight Detail | Inter | 15px | 500 | 1.40 | Times, stops, duration |
| Hotel Name | Inter | 17px | 600 | 1.30 | Property title |
| Body | Inter | 15px | 400 | 1.55 | Descriptions |
| Calendar Day | Inter | 14px | 600 | 1.00 | Date numbers on calendar |
| Navigation | Inter | 12px | 600 | 1.00 | Bottom tab labels |
| Prediction Badge | Inter | 12px | 700 | 1.00 | "Buy now", "Wait" |

## Layout

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Border Radius Scale
- Small (8px): Input fields, chips
- Standard (12px): Small cards, badges
- Medium (16px): Flight/hotel cards, CTAs
- Large (20px): Modals, bottom sheets
- Pill (50px): Prediction badges, tags

## Elevation & Depth

- **Cards**: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- **Cards hover**: `box-shadow: 0 4px 16px rgba(123,63,242,0.15)` — purple tint
- **Prediction confidence**: purple glow `0 0 20px rgba(123,63,242,0.2)`
- **Modals**: `box-shadow: 0 16px 48px rgba(0,0,0,0.2)`
- **Sticky header**: `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`

## Components

### Buttons

**Primary CTA**
- Background: `#7B3FF2`
- Border-radius: 16px
- Padding: 16px 32px
- Font: Inter 17px/700, white
- Hover: `#6A2EDE`
- Width: typically full-width on mobile

**Watch This Trip**
- Background: `rgba(0,217,192,0.12)`
- Border: `1px solid #00D9C0`
- Color: `#00D9C0`
- Radius: 16px

**Price Prediction Badge**
- Pill shape, 50px radius
- Green: "Buy now" — `#4CAF50` bg
- Red: "Wait" — `#F44336` bg
- White text, Inter 12px/700

### Cards & Containers
- Flight card: white, `1px solid #E0E0E0`, 16px radius
- Prediction confidence meter: horizontal bar, purple fill
- Price calendar: grid of 30 cells, color-coded by price tier
- Hover: `box-shadow: 0 4px 16px rgba(123,63,242,0.15)`

## Do's and Don'ts

### Do
- Make the price prediction the #1 visual element — "Buy now" vs "Wait" badge
- Use the price calendar heat map prominently — it's the most unique Hopper feature
- Apply purple consistently to all primary interactions — it's the trust color
- Show the bunny mascot at key decision moments (price alert, booking confirmation)
- Display savings amounts in green with large typography — it's the conversion hook

### Don't
- Don't show flight data without a prediction — it removes Hopper's core differentiator
- Don't use red or yellow as UI colors outside of the pricing calendar
- Don't bury the savings amount — it should always be the first number users see
- Don't add decorative imagery — product UI data is the visual content

## Responsive Behavior

Breakpoints: 320px, 480px, 768px, 1024px, 1280px
- Mobile: Full-width cards, bottom sheet date picker, single-column results
- Tablet: Side-by-side search + results, calendar visible
- Web: Map + list view, persistent price calendar sidebar

## Agent Prompt Guide

### Quick Color Reference
- Purple: `#7B3FF2`
- Background: `#FFFFFF`
- Text: `#1A1A1A`
- Cheap: `#4CAF50`, Moderate: `#FFC107`, Expensive: `#F44336`
- Watch teal: `#00D9C0`

### Example Component Prompts
- "Build Hopper flight card: white bg, 1px solid #E0E0E0, 16px radius. Flight route top. Price 24px/700 right-aligned. 'Buy now' green pill badge. Confidence meter purple bar below."
- "Create price calendar: 7-col grid, each cell 44px. Green (#4CAF50) cheapest days, yellow (#FFC107) mid, red (#F44336) expensive. Purple border on selected date."
- "Design prediction hero: Inter 28px/700 #1A1A1A headline. Savings '240' 52px/800 green below. Purple CTA full-width 16px radius."
