# Design System Inspired by WhatsApp

## 1. Visual Theme & Atmosphere

WhatsApp's design system is defined by intimacy and reliability. The interface is the visual equivalent of a trusted neighbor — warm, unassuming, and immediately familiar across dozens of cultures and contexts. Its signature greens are among the most recognized brand colors on the planet: the vibrant `#25D366` for brand identity and light-mode accents, with the deeper `#128C7E` providing the dark teal used in headers and active states. This dual-green palette communicates both freshness and depth — the surface-level green is social and approachable; the darker teal carries the weight of a communication service you can depend on.

The chat bubble system is WhatsApp's most iconic design contribution. Sent messages appear in a light teal/green (`#DCF8C6` in light mode) aligned right, creating a visual "conversation river" where the two participants occupy opposite banks. Received messages are white bubbles on the left. This spatial coding — combined with subtle timestamp and delivery status icons — encodes an enormous amount of information (author, direction, timing, read status) into a compact, scannable format that users decode instinctively after minutes of use.

Typography is handled through the device's system font — a deliberate choice that maximizes legibility across the enormous diversity of WhatsApp's user base (over 180 countries, dozens of scripts, screen sizes from 4" budget Android to Pro Max iPhone). This system-font approach grounds WhatsApp in accessibility and universality, but it means the system must compensate through spacing, color, and structural clarity rather than typographic personality. The result is an interface that is genuinely global in its design assumptions.

**Key Characteristics:**
- WhatsApp Green (`#25D366`) for primary brand moments and light-mode accents
- Dark Teal (`#128C7E`) for header bar, dark-mode surfaces, and active states
- System font (`-apple-system`, `Roboto`) for all text — maximum legibility
- Sent bubble: `#DCF8C6` (light) / `#005C4B` (dark) — right-aligned
- Received bubble: `#FFFFFF` (light) / `#202C33` (dark) — left-aligned
- Double checkmark: grey (sent) → blue (`#34B7F1`) (read)
- Wallpaper background in chat view — tiled pattern or photo, never solid
- Voice message waveform in chat bubbles; 40px height, green bars

## 2. Color Palette & Roles

### Primary
- **WhatsApp Green** (`#25D366`): Header icon highlights, new message FAB, primary brand
- **Dark Teal** (`#128C7E`): Header bar background (light mode), active states
- **White** (`#FFFFFF`): Light mode background, received bubbles

### Dark Mode Primary
- **Background Dark** (`#111B21`): Chat list background in dark mode
- **Chat Background Dark** (`#0B141A`): Chat view background in dark mode
- **Surface Dark** (`#202C33`): Received bubble dark, elevated panels

### Interactive
- **Action Green** (`#25D366`): FAB, typing indicator, active microphone
- **Read Receipt Blue** (`#34B7F1`): Double blue checkmark (read status)
- **Link Preview Blue** (`#0070CC`): Hyperlinks in messages
- **Danger Red** (`#FF3B30`): Delete message, block contact

### Bubble Colors
- **Sent Bubble Light** (`#DCF8C6`): Outgoing message, light mode
- **Sent Bubble Dark** (`#005C4B`): Outgoing message, dark mode
- **Received Bubble Light** (`#FFFFFF`): Incoming message, light mode
- **Received Bubble Dark** (`#202C33`): Incoming message, dark mode

### Text
- **Primary Light** (`#111B21`): Main text, light mode
- **Primary Dark** (`#E9EDEF`): Main text, dark mode
- **Secondary** (`#667781`): Timestamps, metadata, secondary labels (light)
- **Secondary Dark** (`#8696A0`): Timestamps in dark mode

## 3. Typography Rules

### Font Families
- **iOS**: `-apple-system, "SF Pro Text", "Helvetica Neue"` — system default
- **Android**: `"Roboto", "Noto Sans"` — system default
- **Web/Desktop**: `"Segoe UI", "Helvetica Neue", Arial, sans-serif`
- **Emoji**: `"Apple Color Emoji", "Segoe UI Emoji"` — full native emoji support

### Hierarchy
| Role | Font | Size | Weight | Line Height | Notes |
|------|------|------|--------|-------------|-------|
| Chat Name (list) | System | 17px | 600 | 22px | Contact/group name in list |
| Last Message | System | 15px | 400 | 20px | Preview in conversation list |
| Message Bubble | System | 15px | 400 | 20px | Core chat message text |
| Timestamp (bubble) | System | 11px | 400 | 14px | Time inside bubble, right-aligned |
| Chat Header Name | System | 17px | 600 | 22px | Active chat contact name |
| Header Subtitle | System | 13px | 400 | 18px | "Online", "Last seen", typing... |
| Section Label | System | 14px | 500 | 20px | "Today", "Yesterday", date dividers |
| Unread Badge | System | 12px | 700 | 16px | Green badge, message count |
| Search Placeholder | System | 15px | 400 | 20px | "Search..." in grey |
| Voice Note Duration | System | 13px | 400 | 16px | "0:34" playback time |
| Notification Count | System | 12px | 700 | 16px | App badge, list badge |

## 4. Component Stylings

### Buttons

**FAB (New Chat)**
- Background: `#25D366`
- Icon: chat bubble, `#FFFFFF`, 24px
- Shape: `56px × 56px` circle
- Shadow: `0 4px 12px rgba(0,0,0,0.20)`
- Position: bottom-right, `16px` from edges
- Hover: background `#1EB85A`, scale `1.05`

**Reply / Action Button (in chat)**
- Background: `transparent`
- Icon: `#8696A0`, 20px
- Shape: `40px × 40px` circle
- Hover: background `rgba(0,0,0,0.06)`

**Voice Message Record**
- Background: `#25D366` (recording active)
- Icon: microphone, `#FFFFFF`
- Shape: `44px × 44px` circle
- Animation: pulse ring while recording

### Cards & Containers

**Chat Bubble (sent, light mode)**
- Background: `#DCF8C6`
- Border radius: `8px 0px 8px 8px` (tail at top-right)
- Padding: `8px 12px`
- Max width: `65vw`
- Font: system 15px, `#111B21`
- Timestamp: 11px grey, right-aligned within bubble
- Checkmarks: `#667781` (sent) / `#34B7F1` (read)

**Chat Bubble (received, light mode)**
- Background: `#FFFFFF`
- Border radius: `0px 8px 8px 8px` (tail at top-left)
- Padding: `8px 12px`
- Max width: `65vw`
- Font: system 15px, `#111B21`

**Chat List Row**
- Height: `72px`
- Padding: `0 16px`
- Avatar: 50px circle, left-aligned
- Name: 17px 600, right of avatar
- Last message: 15px normal, grey
- Timestamp: 12px grey, top-right
- Unread badge: `#25D366` circle, white count text
- Hover: light grey background

**Voice Message Bubble**
- Background: inherits bubble color
- Waveform: 40px height, variable-width bars in `#25D366` fill
- Play button: 36px circle, dark grey icon
- Duration: 13px grey, right of waveform

## 5. Layout Principles

### Spacing System
- Base: `8px`
- Scale: `4, 8, 12, 16, 20, 24px`
- Bubble horizontal padding: `12px`
- Bubble vertical padding: `8px`
- Gap between bubbles from same sender: `4px`
- Gap between bubbles from different senders: `12px`
- Chat input bar height: `56px`

### Chat Layout
- Chat list: full-width, header `56px`, search `48px`, list below
- Chat view: full-screen with wallpaper background, bubbles over wallpaper
- Input bar: sticky bottom, `56px`, contains mic/attach/send
- Bubble max-width: `65vw` (mobile), `50%` (desktop sidebar)

### Border Radius Scale
- `0px` + tail — message bubbles (unique directional radius)
- `8px` — standard bubble radius (non-tail corners)
- `12px` — audio/video message containers
- `16px` — modals, bottom sheets
- `100px` — input field in chat bar
- `50%` — avatars, FAB

## 6. Depth & Elevation

### Shadow Scale
- **Chat List Row Hover** — `none` (background color change only)
- **FAB** — `0 4px 12px rgba(0,0,0,0.20)`
- **Header Bar** — `0 1px 3px rgba(0,0,0,0.12)`
- **Context Menu** — `0 4px 24px rgba(0,0,0,0.20)`
- **Modal** — `0 8px 40px rgba(0,0,0,0.24)`

### Wallpaper Treatment
- Chat background: repeating decorative pattern or user photo
- Bubbles float above wallpaper — no additional blur or overlay on wallpaper itself

## 7. Do's and Don'ts

### Do
- Maintain sent/received bubble distinction absolutely — it's the foundation of chat readability
- Use the system font for all message text — never override with a web font in messages
- Show read receipts (blue ticks) accurately — it's a trust-critical feature
- Apply the teal header consistently across all chat screens
- Support dark/light mode seamlessly — WhatsApp users frequently switch

### Don't
- Don't add shadows to individual chat bubbles — they float on the wallpaper without depth
- Don't break the left/right bubble alignment — sent is always right, received always left
- Don't use custom colors in message text — maintain black/dark on all bubbles
- Don't change the green FAB for new chats — it's a global navigation anchor

## 8. Responsive Behavior

**Breakpoints:**
- `375px` — primary mobile; full-screen chat, bottom tab navigation
- `768px` — tablet; split-view: chat list (320px) + active chat
- `1024px` — desktop; 3-panel: sidebar | chat list | active chat + info panel
- `1440px` — wide desktop; info panel always visible (320px)

**Platform Adaptations:**
- Mobile: single active chat view, swipe back to list
- Desktop: multi-panel layout always visible, keyboard shortcuts active
- Voice/video call: full-screen overlay on mobile, floating pip on desktop
- Status: stories-style full-screen on mobile, grid view on desktop

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand Green: `#25D366`
- Header Teal: `#128C7E`
- Sent Bubble: `#DCF8C6`
- Read Receipt Blue: `#34B7F1`
- Text Primary: `#111B21`
- Text Secondary: `#667781`

### Example Component Prompts
- "Design a WhatsApp chat screen: wallpaper background, green sent bubbles right (#DCF8C6) with timestamp + blue ticks, white received bubbles left, system font 15px, green FAB bottom-right, teal header with contact name and online status"
- "Create a WhatsApp chat list item: 50px circular avatar, contact name in system font 17px 600, last message preview in grey 15px, timestamp top-right, green unread count badge"
- "Build a WhatsApp voice message bubble: inherits sent bubble color, waveform bars in green, circular play button, duration timestamp, similar padding to text bubble"
- "Design a WhatsApp dark mode chat: #0B141A wallpaper background, #005C4B sent bubbles, #202C33 received bubbles, same layout as light mode with adjusted colors"
