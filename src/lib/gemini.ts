import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const MODELS = [
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash", description: "Fast & Efficient" },
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", description: "Advanced Reasoning" },
  { id: "gemini-3.1-flash-lite-preview", name: "Gemini 3.1 Flash Lite", description: "Ultra-low Latency" },
];

export async function getModelResponse(modelId: string, prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "No response received.";
  } catch (error) {
    console.error(`Error with model ${modelId}:`, error);
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

export async function getJudgeAnalysis(prompt: string, responseA: string, responseB: string, modelAName: string, modelBName: string) {
  const judgePrompt = `
    You are an expert AI evaluator. Your task is to compare two responses from different LLM models to the same user prompt.
    
    USER PROMPT:
    "${prompt}"
    
    RESPONSE FROM ${modelAName}:
    "${responseA}"
    
    RESPONSE FROM ${modelBName}:
    "${responseB}"
    
    Please provide a fair, objective, and detailed analysis. Your output should be in JSON format with the following structure:
    {
      "summary": "A brief overview of how both models handled the prompt.",
      "comparison": [
        { "aspect": "Accuracy", "winner": "Model A/Model B/Tie", "reason": "..." },
        { "aspect": "Creativity", "winner": "...", "reason": "..." },
        { "aspect": "Clarity", "winner": "...", "reason": "..." }
      ],
      "scoring": {
        "modelA": { "score": 0-10, "pros": ["...", "..."], "cons": ["...", "..."] },
        "modelB": { "score": 0-10, "pros": ["...", "..."], "cons": ["...", "..."] }
      },
      "finalVerdict": "Which model performed better overall and why?"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: judgePrompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error with Judge analysis:", error);
    return null;
  }
}
