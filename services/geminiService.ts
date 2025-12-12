import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLuxuryGreeting = async (): Promise<{ title: string; message: string }> => {
  try {
    const modelId = "gemini-2.5-flash"; // Using flash for fast text generation
    const prompt = `
      You are the creative director for a high-end ultra-luxury brand named "Arix".
      Write a Christmas greeting card message.
      
      Tone: Cinematic, mysterious, golden, opulent, warm but sophisticated.
      Style: Short, poetic, punchy.
      
      Return JSON with:
      - title: A short header (e.g., "Golden Whisper", "Emerald Night").
      - message: The greeting body (max 2 sentences).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING },
          },
          required: ["title", "message"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini Greeting Error:", error);
    // Fallback in case of API issues
    return {
      title: "The Arix Legacy",
      message: "May your holidays shimmer with the timeless elegance of gold and the deep serenity of emerald nights."
    };
  }
};
