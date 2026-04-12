# Design System Inspired by PayPal

## 1. Visual Theme & Atmosphere

PayPal's design language is built entirely on trust. The dominant dark blue (`#003087`) combined with lighter sky blue (`#009CDE`) creates the reassuring two-tone blue system that signals financial authority and security. These are not accidental colors — they carry decades of association with banking, stability, and global reach. Every design decision reinforces this trust signal: generous white space, clean Roboto typography, and conservative use of color create an interface that feels safe to conduct financial transactions within.

The visual hierarchy is strict: the send/request payment action is always the most prominent element on screen. Transaction history uses a clean list format with merchant logos, amounts in high-contrast bold, and status badges (Pending, Completed, Refunded) using a restrained traffic-light color system. Data density is carefully managed — PayPal provides enough transaction detail to build confidence without overwhelming users who just want to check their balance.

Dark mode adapts the palette intelligently: `#003087` becomes a deep navy surface, `#009CDE` maintains its role as the interactive accent, and white text provides clarity. The PayPal debit card representation uses a gradient from dark navy to medium blue. Trust signals — SSL indicators, verified merchant badges, PayPal protection notices — are designed as subtle but consistent elements that appear at decision points in the transaction flow.

**Key Characteristics:**
- Dark blue `#003087` (primary brand) + sky blue `#009CDE` (interactive/accent)
- White `#FFFFFF` as primary page background — clean, minimal chrome
- Roboto across all text — the Google font chosen for cross-platform legibility
- Conservative status palette: green completed, amber pending, red failed
- Merchant logos prominently displayed in transaction history
- Split layout on payment flows: action left + summary/security right (desktop)
- Security badge language integrated at checkout confirmation steps
- High-contrast bold amounts: large font, right-aligned in transaction lists

## 2. Color Palette & Roles

### Primary
- **Dark Navy Blue** (`#003087`): App bar, primary buttons, nav, brand surfaces
- **Sky Blue** (`#009CDE`): Secondary actions, links, highlights, progress fills
- **White** (`#FFFFFF`): All primary page and card backgrounds

### Interactive
- **Navy Hover** (`#002469`): Primary button hover — darkens with authority
- **Sky Hover** (`#0077B5`): Sky blue interactive hover
- **Navy Light BG** (`rgba(0, 48, 135, 0.06)`): Selected state background
- **Focus Ring** (`rgba(0, 156, 222, 0.35)`): Input focus outline

### Status
- **Success Green** (`#00CF9D`): Completed transactions, verified states
- **Warning Amber** (`#FF9600`): Pending, processing states
- **Error Red** (`#D20000`): Failed, declined, error states
- **Refund Purple** (`#8B39CC`): Refunded transaction type

### Neutrals
- **Text Dark** (`#2C2E2F`): Primary body text
- **Text Medium** (`#536166`): Secondary labels, metadata
- **Text Light** (`#9DA3A6`): Disabled, placeholder, tertiary text
- **Gray 100** (`#F5F7FA`): Page section backgrounds
- **Gray 200** (`#E4E7E9`): Dividers, input borders
- **Gray 300** (`#C8CDD0`): Disabled border states

### Surface
- **Card Background** (`#FFFFFF`): Standard cards
- **Section BG** (`#F5F7FA`): Alternate surfaces
- **Nav Dark** (`#003087`): Full-width dark blue nav

## 3. Typography Rules

### Font Families
- **Roboto**: `'Roboto', 'Helvetica Neue', Arial, sans-serif` — All text
- **System fallback**: `-apple-system, BlinkMacSystemFont, sans-serif`

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Balance Display | Roboto | 40px | 700 | 48px | Dark navy or white |
| Section Header | Roboto | 24px | 700 | 32px | Dark `#2C2E2F` |
| Card Title | Roboto | 18px | 700 | 26px | Dark |
| Send Amount (Hero) | Roboto | 48px | 300 | 56px | Light weight, large entry |
| Transaction Amount | Roboto | 18px | 700 | 24px | Right-aligned, status-colored |
| Transaction Name | Roboto | 15px | 500 | 22px | Dark `#2C2E2F` |
| Transaction Date | Roboto | 13px | 400 | 18px | Gray `#536166` |
| Button Primary | Roboto | 16px | 700 | 24px | White on navy |
| Input Label | Roboto | 13px | 500 | 18px | Gray `#536166`, uppercase |
| Input Value | Roboto | 16px | 400 | 24px | Dark, full-width |
| Status Badge | Roboto | 12px | 700 | 16px | Uppercase, status color |
| Caption | Roboto | 12px | 400 | 18px | Gray `#9DA3A6` |

## 4. Component Stylings

### Buttons

**Primary Button (Navy)**
```
background: #003087
color: #FFFFFF
font: Roboto 16px 700
padding: 14px 28px
border-radius: 25px (pill — PayPal signature)
border: none
width: 100% (mobile) / auto (desktop)
hover: background #002469
shadow: 0 2px 8px rgba(0, 48, 135, 0.30)
transition: all 200ms ease
```

**Secondary Button (Sky Blue)**
```
background: #009CDE
color: #FFFFFF
border-radius: 25px
padding: 14px 28px
hover: background #0077B5
```

**Ghost Button**
```
background: transparent
color: #003087
border: 2px solid #003087
border-radius: 25px
padding: 12px 26px
hover: background rgba(0,48,135,0.06)
```

**Pay Now CTA**
```
background: linear-gradient(135deg, #009CDE, #003087)
color: #FFFFFF
border-radius: 25px
padding: 16px 48px
font: Roboto 18px 700
shadow: 0 4px 14px rgba(0, 48, 135, 0.35)
```

### Cards & Containers

**Transaction Row**
```
background: #FFFFFF
padding: 16px 20px
border-bottom: 1px solid #E4E7E9
layout: merchant-logo (40px) | name+date | amount right
merchant-logo: 40px circle, white bg, border 1px #E4E7E9
amount: 18px 700, green (+), dark (-)
status badge: top-right, rounded pill 4px
```

**Balance Card**
```
background: #003087
color: #FFFFFF
border-radius: 16px
padding: 24px
balance: 40px 700 white center
available-credit: 14px 400 off-white below
```

**Payment Summary Card**
```
background: #F5F7FA
border-radius: 12px
padding: 20px
border: 1px solid #E4E7E9
line items: merchant name left, amounts right
security-badge: SSL icon + "PayPal Protection" text bottom
```

**Debit Card Visual**
```
background: linear-gradient(135deg, #003087, #0070BA)
color: #FFFFFF
border-radius: 12px
aspect-ratio: 1.586/1
card-number: 18px light tracked
PayPal logo + Mastercard logo bottom row
```

## 5. Layout Principles

### Spacing System
- Base: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Page margins: 20px mobile, 40px tablet
- Card padding: 20px standard, 24px summary cards
- Section spacing: 32px between sections
- Touch targets: 48px minimum for all interactive elements

### Border Radius Scale
- `4px` — Status badges, small pills
- `8px` — Input fields, section containers
- `12px` — Large cards, modals, card visuals
- `16px` — Balance card, primary dashboard card
- `25px` — All buttons (pill — PayPal signature)

### Grid
- Mobile: 1-column, 20px margins
- Tablet: 2-column (action + summary)
- Desktop: 3-column or 2-column split, max-width 1200px

## 6. Depth & Elevation

```
Level 0 - Page:    #F5F7FA section backgrounds
Level 1 - Card:    0 2px 8px rgba(0,0,0,0.08)
Level 2 - Modal:   0 8px 32px rgba(0,0,0,0.16)
Level 3 - Pay CTA: 0 4px 14px rgba(0,48,135,0.35)
Level 4 - Drawer:  0 -4px 24px rgba(0,0,0,0.20)
Nav bar:           0 2px 4px rgba(0,0,0,0.10)
```

## 7. Do's and Don'ts

### Do
- Use pill buttons (`border-radius: 25px`) for all primary CTAs — it's the PayPal signature
- Display merchant logos in transaction rows — visual recognition builds trust
- Use `#00CF9D` green for completed transactions, `#FF9600` amber for pending
- Show PayPal protection/security language at all payment confirmation points
- Right-align transaction amounts for easy financial scanning
- Bold incoming amounts (+) and use lighter weight for outgoing (-)

### Don't
- Don't use colors beyond the defined status palette for transaction states
- Don't use border-radius below 8px — the rounded aesthetic is brand identity
- Don't omit security badges on checkout flows — trust signals are mandatory
- Don't show payment amounts in red on non-error states — red signals failure

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — Mobile: single column, pill buttons full-width
- `640px` — Large mobile: compact desktop nav visible
- `768px` — Tablet: 2-column checkout (form + summary)
- `1024px` — Desktop: full layout with persistent left nav
- `1280px` — Wide: max-width 1200px centered, generous white space

**Adaptive Patterns:**
- Balance: 40px mobile → 48px desktop
- Buttons: full-width mobile → auto-width desktop
- Checkout: stacked mobile → split 60/40 desktop
- Transaction list: compact mobile → expanded row with more detail desktop

## 9. Agent Prompt Guide

### Quick Color Reference
```
Primary Navy:    #003087   — app bar, primary buttons
Sky Blue:        #009CDE   — secondary actions, links
Success Green:   #00CF9D   — completed transactions
Warning Amber:   #FF9600   — pending/processing
Error Red:       #D20000   — failed, declined
Text Dark:       #2C2E2F   — body text
```

### Example Component Prompts
- "A PayPal transaction row: white background, 40px circular merchant logo left with border, merchant name 15px bold + date 13px gray, amount 18px 700 green '+$125.00' right, 1px bottom divider"
- "A PayPal primary CTA: navy `#003087` background 25px radius, white Roboto 16px bold, full-width on mobile, shadow 0 2px 8px navy"
- "A PayPal balance card: dark navy `#003087` background 16px radius, 40px bold white balance center, available credit 14px off-white below, PP wordmark top"
- "A payment summary card: light gray `#F5F7FA` background 12px radius, line items with amounts right-aligned, SSL security badge with lock icon bottom, 'PayPal Buyer Protection' text"
