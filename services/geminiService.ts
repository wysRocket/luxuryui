import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const chatWithDesignExpert = async (
  message: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    const client = getClient();
    
    // Construct a simple prompt with history for context
    const context = history.map(h => `${h.role === 'user' ? 'User' : 'Expert'}: ${h.text}`).join('\n');
    const content = `
Previous conversation:
${context}

User: ${message}

Expert:`;

    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
      config: {
        systemInstruction: `You are a world-class UI/UX Design Expert and Product Designer. 
You are helpful, concise, and provide actionable design advice.
You are integrated into LuxuryUI (a premium UI design library).`,
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for chat
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the design brain right now. Please check your API key configuration.";
  }
};