import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function explainHardWord(word: string, context: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Explain the following word or concept in the context of Linux: "${word}". Context: "${context}". Make it easy for beginners to understand. Respond in simple JSON format with properties "explanation" and "example".`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return { explanation: "Failed to load explanation.", example: "" };
  }
}

export async function getRecommendedBooks(preferences: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Based on the user preferences: "${preferences}", recommend 3 Linux or technical books. Return a JSON array of objects with title, author, and description.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}
