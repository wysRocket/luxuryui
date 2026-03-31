import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FIGMA_KIT_SUMMARY, getPublishedFigmaKits } from '../data/figmaKits';
import { RUNTIME_CONFIG } from './runtimeConfig';

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!RUNTIME_CONFIG.hasLiveConcierge) {
    throw new Error('Live concierge is not configured.');
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY });
  }
  return aiClient;
};

const buildCatalogContext = () => {
  const featuredKits = getPublishedFigmaKits()
    .slice(0, 8)
    .map((kit) => `${kit.sourceAppName}: ${kit.title} (${kit.creditCost} credits, ${kit.licenseTier}, flow=${kit.primaryFlowId})`)
    .join('\n');

  return `LuxuryUI Catalog Context
- Published Figma kits: ${FIGMA_KIT_SUMMARY.publishedProducts}
- Blocked / research-only kits: ${FIGMA_KIT_SUMMARY.blockedProducts}
- Published flow families: ${FIGMA_KIT_SUMMARY.publishedFlows}
- Featured kits:
${featuredKits}

Policy:
- Source screenshots are research evidence, not the commercial deliverable.
- Sellable products are transformed Figma kits with editable files, tokens, components, and delivery notes.
- If a user asks for a kit and it is not approved, recommend research browsing instead of pretending it is purchasable.`;
};

const buildFallbackConciergeReply = (message: string): string => {
  const normalized = message.toLowerCase();
  const publishedKits = getPublishedFigmaKits();
  const matchingKits = publishedKits.filter((kit) => {
    const haystack = `${kit.title} ${kit.sourceAppName} ${kit.primaryFlowId}`.toLowerCase();
    return normalized.split(/\s+/).some((token) => token.length > 3 && haystack.includes(token));
  });

  const offlinePrefix = RUNTIME_CONFIG.hasLiveConcierge ? '' : 'Live concierge is offline, so I’m answering from the local catalog. ';

  if (normalized.includes('license')) {
    return `${offlinePrefix}LuxuryUI sells transformed Figma kits, not raw screenshots. Each approved kit is packaged for commercial use with editable frames, components, token styles, and license guidance on the product page.`;
  }

  if (normalized.includes('price') || normalized.includes('pricing') || normalized.includes('credits')) {
    return `${offlinePrefix}LuxuryUI uses a credits-only purchase flow. Top up credits once on the pricing page, then spend those credits on approved Figma kits. The pricing UI shows live EUR and GBP totals while you adjust your credits.`;
  }

  if (normalized.includes('figma') || normalized.includes('kit') || normalized.includes('buy')) {
    if (matchingKits.length > 0) {
      const topMatches = matchingKits
        .slice(0, 3)
        .map((kit) => `${kit.title} for ${kit.creditCost} credits`)
        .join('; ');
      return `${offlinePrefix}I found approved kits that match your request: ${topMatches}. Open the Figma Kits catalog to preview what’s included, compare flow types, and top up credits when you are ready to buy.`;
    }

    return `${offlinePrefix}LuxuryUI currently has ${FIGMA_KIT_SUMMARY.publishedProducts} approved Figma kits across ${FIGMA_KIT_SUMMARY.publishedFlows} flow families. If you tell me the app name or flow type, I can steer you to the closest sellable kit or the right research-only library section.`;
  }

  if (normalized.includes('flow') || normalized.includes('onboarding') || normalized.includes('checkout')) {
    return `${offlinePrefix}Use the flow library to compare product patterns first, then open the matching Figma Kit if you need an editable transformed version. LuxuryUI separates research references from commercial file delivery on purpose.`;
  }

  return `${offlinePrefix}I can help with three things: finding an approved Figma kit, explaining what a kit includes, or steering you to the best research flow when a kit is not ready yet.`;
};

export const chatWithDesignExpert = async (
  message: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  if (!RUNTIME_CONFIG.hasLiveConcierge) {
    return buildFallbackConciergeReply(message);
  }

  try {
    const client = getClient();
    
    // Construct a simple prompt with history for context
    const context = history.map(h => `${h.role === 'user' ? 'User' : 'Expert'}: ${h.text}`).join('\n');
    const catalogContext = buildCatalogContext();
    const content = `
${catalogContext}

Previous conversation:
${context}

User: ${message}

Expert:`;

    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
      config: {
        systemInstruction: `You are LuxuryUI's concierge for premium UI research and sellable Figma kits.
You answer with product truth, not generic design hype.
Your priorities are:
1. Recommend approved Figma kits when they exist.
2. Explain what is included, how transformation works, and how credits are used to unlock kits.
3. Route users to research-only library sections when a kit is not commercially ready.
4. Never imply that raw screenshots are the commercial deliverable.
5. Never mention subscription plans or plan upgrades because LuxuryUI sells kits with credits only.`,
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for chat
      }
    });

    return response.text || buildFallbackConciergeReply(message);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return buildFallbackConciergeReply(message);
  }
};
