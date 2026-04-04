/**
 * Stitch Prompt Builder — commercial kit generation.
 *
 * Follows the Stitch Prompt Guide (discuss.ai.google.dev/t/stitch-prompt-guide/83844):
 * - Lead with aesthetic adjectives and visual identity, not a spec document.
 * - Be explicit about what screens to show and what UI patterns to include.
 * - Use natural language that Stitch responds to, not structured headings.
 * - Drive uniqueness through per-category colour direction and per-flow UI vocabulary.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Category → visual identity
// Each entry gives Stitch a strong, distinct aesthetic direction so kits
// in different categories never look like the same blue/dark template.
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_AESTHETICS = {
  Finance: {
    mood: 'clean, trustworthy, and data-confident',
    palette: 'muted slate blues and deep navy with warm white surfaces and precise green accents for positive states',
    typographyHint: 'a geometric sans-serif with tight letter-spacing for figures and a comfortable reading weight for body text',
    feel: 'Bloomberg-meets-banking — authoritative but approachable, with data density that never feels cluttered',
  },
  Crypto: {
    mood: 'bold, high-contrast, and technically precise',
    palette: 'near-black backgrounds with electric teal or vivid violet accents, deliberately avoiding the blues that feel like traditional banking',
    typographyHint: 'a monospaced or condensed display font for numbers, clean sans for UI labels',
    feel: 'a pro trading terminal that is also beautiful — dark, immersive, with glowing metric highlights',
  },
  Shopping: {
    mood: 'warm, inviting, and merchandise-forward',
    palette: 'warm off-whites and terracotta or amber accents with rich product image frames and minimal chrome',
    typographyHint: 'a friendly rounded sans for labels, generous line-height, and oversized price typography',
    feel: 'a premium editorial catalogue — products are the hero, UI recedes to white space and subtle shadows',
  },
  Social: {
    mood: 'expressive, vibrant, and community-driven',
    palette: 'a lively accent hue (coral, lime, or indigo) over light surfaces with generous avatar presence and full-bleed cards',
    typographyHint: 'a slightly playful humanist sans with bold weights for engagement counts and reaction labels',
    feel: 'fun and social without being childish — alive with user content, reactions, and motion cues',
  },
  Travel: {
    mood: 'editorial, aspirational, and destination-obsessed',
    palette: 'cinematic deep sky blues and golden-hour ambers over light parchment surfaces, with full-bleed imagery slots',
    typographyHint: 'a confident serif for headlines and a clean sans for utility labels — editorial contrast',
    feel: 'a luxury travel magazine brought to mobile — every screen should feel like a destination',
  },
  Business: {
    mood: 'focused, productive, and enterprise-grade',
    palette: 'cool grays with a single controlled accent (cobalt or forest green), minimal colour, maximum clarity',
    typographyHint: 'an efficient, legible sans at comfortable sizes — information density without fatigue',
    feel: 'calm and operational — a tool professionals trust, with structure and efficiency as the aesthetic',
  },
  Health: {
    mood: 'calm, nurturing, and progress-positive',
    palette: 'soft sage greens, warm whites, and gentle lavender accents with plenty of breathing room between elements',
    typographyHint: 'a rounded, friendly sans with soft weight contrast — approachable and reassuring',
    feel: 'a mindful wellness space — never clinical or alarming, always encouraging and clear',
  },
  Music: {
    mood: 'immersive, media-rich, and dark-first',
    palette: 'deep charcoals and blacks with album-art-reactive accents — vivid pinks, electric yellows — over dark backgrounds',
    typographyHint: 'a bold display font for track names, a clean sans for metadata — dramatic size contrast',
    feel: 'a premium listening experience — album art dominates, controls feel tactile, everything recedes into the dark',
  },
  Education: {
    mood: 'structured, encouraging, and progress-driven',
    palette: 'friendly blues and yellows over clean white surfaces with progress fills in vibrant coral or green',
    typographyHint: 'a clear, legible sans with strong heading hierarchy — lesson titles large, metadata compact',
    feel: 'celebratory streaks, clear progress bars, and a tone that is never intimidating',
  },
  News: {
    mood: 'editorial, typographically rich, and scanning-optimised',
    palette: 'classic near-black on white with a single strong accent (red or deep amber) for breaking items and section markers',
    typographyHint: 'a strong serif for headlines, a readable text sans for body — pure editorial contrast',
    feel: 'a premium digital newspaper — typography is the design, imagery is curated, information hierarchy is everything',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Flow → specific screen-by-screen blueprint
// Tells Stitch exactly what to render on each screen, preventing generic output.
// ─────────────────────────────────────────────────────────────────────────────
const FLOW_SCREEN_BLUEPRINTS = {
  onboarding: [
    'a welcoming hero screen with a bold value-proposition headline, a supporting illustration or full-bleed background, and a prominent Get Started CTA button',
    'a personalisation or interest-selection screen with 6 tappable category chips or illustrated interest tiles arranged in a 2-column grid',
    'a trust-building permissions screen (push notifications or location access) with a clear benefit statement above the Allow button',
    'an account-creation screen with name, email, and password input fields, a social sign-in option, and a step progress indicator at the top',
    'a profile or goal-setup screen with a numeric stepper or segmented control for the user\'s primary goal',
    'a congratulations or "you\'re all set" screen with a celebratory spot illustration, a summary of what the user unlocked, and a Go to Dashboard CTA',
  ],
  checkout: [
    'a cart summary screen with itemised product rows, quantity steppers, a subtotal breakdown section, and a Proceed to Checkout CTA',
    'a delivery address screen with a form and a saved-address chip row at the top for quick re-use',
    'a shipping-method selection screen showing 3 speed options as selectable cards with price and estimated date',
    'a payment method screen with a card-details form, saved card thumbnails, and an Apple Pay / Google Pay quick-pay option',
    'an order review screen with a full summary list, final price total, and a large place-order CTA with a security badge',
    'an order confirmation screen with an illustrated success state, order number, estimated delivery date, and a Track My Order link',
  ],
  'search-discovery': [
    'a search home screen with a prominent search bar, a row of trending topic chips, and a curated "Top Picks" card section below',
    'a search-results screen with filter chips at the top and a vertical list of result cards each with a thumbnail, title, and metadata',
    'a filter and sort bottom sheet with toggle rows, price-range slider, and a large Apply Filters button',
    'a category browse screen with a 2-column grid of illustrated category cards',
    'a detail or preview screen with a full-bleed hero image, title, metadata row, and a primary action button pinned at the bottom',
    'an empty-state or no-results screen with a friendly illustration and a "Try a different search" suggestion',
  ],
  'social-engagement': [
    'a main feed screen with full-width post cards showing a user avatar, post content area, and a reaction rail with like, comment, and share counts',
    'a post detail screen with a large media frame at the top, a scrollable comment thread below, and a sticky comment composer at the bottom',
    'a reactions or emoji-picker bottom sheet with a row of large animated reaction options and per-reaction count labels',
    'a story or reel viewer with a segmented progress bar strip at the top, a full-screen media frame, and a reply bar at the bottom',
    'a new-post composer screen with a media attachment picker, a caption input, a location tag option, and an audience selector',
    'a notification centre screen with grouped activity rows (Likes, Comments, New Followers) each with a timestamp and avatar stack',
  ],
  'account-settings': [
    'a profile overview screen with a large avatar, display name, a 3-stat row (posts, followers, following), and an Edit Profile button',
    'a settings home screen with clearly grouped list rows: Account, Privacy, Notifications, Appearance, Support, and Sign Out',
    'a personal-details edit screen with inline editable fields for name, username, bio, and website, plus a Save button',
    'a notification preferences screen with grouped toggle rows for push alerts, email digests, and in-app badges',
    'a security screen with a 2FA toggle, biometric authentication option, active sessions list, and a Change Password row',
    'an account management or danger-zone screen with Delete Account and Deactivate options styled in muted red',
  ],
  'subscription-upgrade': [
    'a plan comparison screen with 3 plan cards (Monthly, Annual, Lifetime) each with a price, a feature checklist, and a highlighted Best Value badge on the recommended plan',
    'a feature highlight screen with 3 premium benefit rows each showing an icon, a bold benefit headline, and a one-line description',
    'a billing details screen with a card payment form, a PayPal option, and a clear price summary with tax breakdown',
    'a free-trial activation screen with a shield badge showing trial length, a benefit bullet list, and a Start Free Trial CTA',
    'an upgrade confirmation or receipt screen showing the plan name, next billing date, and a Manage Subscription link',
    'an inline paywall or locked-feature prompt card with a brief pitch, a feature preview blurred behind, and an Unlock Now CTA',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Derive category from bundleIds or token names
// ─────────────────────────────────────────────────────────────────────────────
const inferCategory = ({ bundleIds = [], tokens = [] }) => {
  const bundleCategory = bundleIds
    .find((id) => id.startsWith('category-'))
    ?.replace('category-', '');

  if (bundleCategory) {
    const slug = bundleCategory.replace(/-/g, ' ');
    const match = Object.keys(CATEGORY_AESTHETICS).find(
      (k) => k.toLowerCase() === slug.toLowerCase()
    );
    if (match) return match;
  }

  for (const token of tokens) {
    if (/finance|banking/i.test(token)) return 'Finance';
    if (/crypto|market/i.test(token)) return 'Crypto';
    if (/commerce|shopping|merch/i.test(token)) return 'Shopping';
    if (/social|feed/i.test(token)) return 'Social';
    if (/travel|booking/i.test(token)) return 'Travel';
    if (/productivity|enterprise/i.test(token)) return 'Business';
    if (/wellness|health|calm/i.test(token)) return 'Health';
    if (/music|media|listening/i.test(token)) return 'Music';
    if (/learning|lesson|education/i.test(token)) return 'Education';
    if (/editorial|news|scanning/i.test(token)) return 'News';
  }

  return 'Business';
};

// ─────────────────────────────────────────────────────────────────────────────
// Main prompt builder — natural-language, aesthetic-first, Stitch-optimised
// ─────────────────────────────────────────────────────────────────────────────
export const buildCommercialKitPrompt = ({
  appName,
  flow,
  components = [],
  tokens = [],
  bundleIds = [],
  category: explicitCategory,
}) => {
  const category = explicitCategory ?? inferCategory({ bundleIds, tokens });
  const aesthetic = CATEGORY_AESTHETICS[category] ?? CATEGORY_AESTHETICS.Business;
  const flowId = flow?.id ?? 'onboarding';
  const screenBlueprints = FLOW_SCREEN_BLUEPRINTS[flowId] ?? FLOW_SCREEN_BLUEPRINTS.onboarding;
  const screenCount = Math.min(screenBlueprints.length, 8);

  return [
    `Design an original, commercially releasable ${aesthetic.mood} mobile app for a ${category.toLowerCase()} product.`,
    '',
    `Visual identity: ${aesthetic.feel}.`,
    `Colour palette: ${aesthetic.palette}.`,
    `Typography: ${aesthetic.typographyHint}.`,
    '',
    `This design is inspired by ${appName}-style UX patterns but must be fully transformed into something original — ` +
      `use generic product copy, replace any brand-specific icons with neutral system metaphors, ` +
      `and ensure no individual screen mirrors an existing app one-for-one.`,
    '',
    `Generate ${screenCount} distinct mobile screens showing the ${flow?.title ?? 'Onboarding'} flow in this exact order:`,
    ...screenBlueprints.slice(0, screenCount).map((s, i) => `${i + 1}. ${s}`),
    '',
    `Across the screens, include these UI components: ${components.join(', ')}.`,
    '',
    `Every screen must share a coherent visual system — consistent colour usage, type scale, spacing rhythm, and component style.`,
    `The final result should feel like a premium, original product a designer could sell as an editable Figma kit.`,
  ].join('\n');
};

export const buildStitchPrompt = buildCommercialKitPrompt;
