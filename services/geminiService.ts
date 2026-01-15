import { GoogleGenAI, Type } from "@google/genai";
import { PlantData, SearchResult, DiagnosisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize without creating the client immediately to handle potential key issues gracefully in UI if needed,
// though strict guidelines say assume process.env.API_KEY is valid.
const getAI = () => new GoogleGenAI({ apiKey });

export const searchPlants = async (query: string): Promise<SearchResult[]> => {
  const ai = getAI();
  const prompt = `Find 5 indoor plants matching the query: "${query}". Return a JSON array.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Common name in Chinese (if query is Chinese) or English" },
              scientificName: { type: Type.STRING },
              shortDescription: { type: Type.STRING, description: "One sentence summary" },
            },
            required: ["name", "scientificName", "shortDescription"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SearchResult[];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const getPlantDetails = async (plantName: string): Promise<PlantData | null> => {
  const ai = getAI();
  const prompt = `Provide detailed encyclopedia data for the indoor plant: "${plantName}". Return in Chinese.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            description: { type: Type.STRING, description: "2-3 paragraphs about the plant history and appearance" },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            care: {
              type: Type.OBJECT,
              properties: {
                light: { type: Type.STRING, description: "Detailed light requirements" },
                water: { type: Type.STRING, description: "Watering frequency and method" },
                soil: { type: Type.STRING, description: "Soil type preferences" },
                temperature: { type: Type.STRING, description: "Ideal temp range" },
                humidity: { type: Type.STRING, description: "Humidity requirements" },
                fertilizer: { type: Type.STRING, description: "Feeding guide" },
              },
              required: ["light", "water", "soil", "temperature", "humidity", "fertilizer"]
            },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "scientificName", "description", "care", "difficulty", "tags"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as PlantData;
  } catch (error) {
    console.error("Get details failed:", error);
    return null;
  }
};

export const diagnosePlantIssue = async (description: string, imageBase64?: string): Promise<DiagnosisResult | null> => {
  const ai = getAI();
  
  const parts: any[] = [];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    });
  }
  parts.push({
    text: `You are an expert botanist. Diagnose the plant issue based on this description${imageBase64 ? ' and image' : ''}: "${description}". Provide the output in Chinese JSON format.`
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Capable of multimodal understanding
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING, description: "Name of the disease or issue" },
            solution: { type: Type.STRING, description: "Step by step fix" },
            prevention: { type: Type.STRING, description: "How to prevent in future" },
          },
          required: ["diagnosis", "solution", "prevention"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as DiagnosisResult;
  } catch (error) {
    console.error("Diagnosis failed:", error);
    return null;
  }
};

export const identifyPlant = async (imageBase64: string): Promise<SearchResult | null> => {
  const ai = getAI();
  
  const parts = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
    {
      text: "Identify this plant. Provide the common name (in Chinese), scientific name, and a short one-sentence description in Chinese. Return in JSON."
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Common name in Chinese" },
            scientificName: { type: Type.STRING },
            shortDescription: { type: Type.STRING, description: "One sentence summary" },
          },
          required: ["name", "scientificName", "shortDescription"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as SearchResult;
  } catch (error) {
    console.error("Identification failed:", error);
    return null;
  }
};
