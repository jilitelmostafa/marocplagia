import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PlagiarismAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Schema for the structured part of the response
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: {
        type: Type.INTEGER,
        description: "The overall maximum risk score (max of aiScore and plagiarismScore).",
      },
      aiScore: {
        type: Type.INTEGER,
        description: "Probability (0-100) that the text is AI-generated (e.g. by ChatGPT, Gemini, etc).",
      },
      plagiarismScore: {
        type: Type.INTEGER,
        description: "Probability (0-100) that the text is directly copied from the web.",
      },
      riskLevel: {
        type: Type.STRING,
        enum: ["Low", "Medium", "High"],
        description: "The overall risk level classification.",
      },
      summary: {
        type: Type.STRING,
        description: "A detailed analysis explaining the findings. If AI-generated, explain HOW it was generated (style, structure, lack of perplexity). If plagiarized, mention the nature of copying.",
      },
      flaggedSegments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            segment: { type: Type.STRING, description: "The specific text segment." },
            reason: { type: Type.STRING, description: "Why this is flagged (e.g., 'Typical AI phrasing', 'Direct match with source')." },
          },
        },
        description: "List of suspicious segments found in the text.",
      },
    },
    required: ["score", "aiScore", "plagiarismScore", "riskLevel", "summary", "flaggedSegments"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert forensic text analyst. Analyze the following text for two distinct issues:
      1. **AI Generation**: Detect if the text was likely written by an LLM (like ChatGPT, Claude, Gemini). Look for: repetitive sentence structure, lack of personal nuance, overly neutral tone, 'hallucinated' facts, or specific transition words typical of AI.
      2. **Web Plagiarism**: Use Google Search to find if this text exists elsewhere on the internet.
      
      Text to analyze:
      """
      ${text}
      """
      
      Return the analysis in JSON format.
      - 'aiScore': 0-100 likelihood of AI generation.
      - 'plagiarismScore': 0-100 likelihood of web copying.
      - 'score': The highest of the two scores.
      - 'summary': Explain **how** the text was generated or where it was copied from. If AI, specifically mention the stylistic markers (e.g. "The text uses formulaic structure typical of AI models...").
      - Ensure the summary language matches the input text language (Arabic or English).
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // 1. Parse JSON content
    const analysisText = response.text;
    if (!analysisText) {
      throw new Error("No response from AI");
    }
    
    let analysis: PlagiarismAnalysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error("Failed to parse JSON", e);
      // Fallback if JSON is malformed
      analysis = {
        score: 0,
        aiScore: 0,
        plagiarismScore: 0,
        riskLevel: 'Low',
        summary: "Could not parse detailed analysis.",
        flaggedSegments: []
      };
    }

    // 2. Extract Grounding Chunks (Sources)
    // The grounding chunks are located in the candidate's groundingMetadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Filter chunks that actually have web URIs
    const validSources = groundingChunks.filter(chunk => chunk.web?.uri);

    return {
      analysis,
      sources: validSources
    };

  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};