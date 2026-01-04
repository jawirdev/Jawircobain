// Fixed: Followed Google GenAI SDK guidelines for initialization and API key usage.
import { GoogleGenAI } from "@google/genai";

export const getAIResponse = async (prompt: string) => {
  // Create a new instance right before use to ensure it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Kamu adalah Jawir Assistant, asisten digital yang gaul, keren, dan informatif untuk komunitas Jawir Designer. Selalu akhiri jawabanmu dengan 'Wir!'. Gunakan bahasa yang santai tapi sopan.",
      },
    });
    // Extract text from response using the .text property as per guidelines.
    return response.text || "Maaf Wir, ada gangguan koneksi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf Wir, otak AI-ku lagi konslet. Coba lagi nanti ya!";
  }
};