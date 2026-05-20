import { GoogleGenAI } from "@google/genai";
import type { Route } from "./+types/generate";

export const action = async ({ request }: Route.ActionArgs) => {
  try {
    const { LANGUAGE, TOPIC, DIFFICULTY } = await request.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a ${DIFFICULTY} ${TOPIC} problem solution in ${LANGUAGE}. Return only code, no markdown fences.`,
    });
    return { code: result.text };
  } catch (err) {
    console.error(err);
    return {
      code: null,
      error: "Failed to generate code. Please try again.",
    };
  }
};
