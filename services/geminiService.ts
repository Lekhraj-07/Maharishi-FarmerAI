
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import type { CropRecommendation } from '../types';

// IMPORTANT: Do not expose this key publicly.
// It's assumed to be set in the environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, perhaps disabling AI features.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = ai.models;

/**
 * Generates crop recommendations based on user input.
 * @param pincode - The postal code of the farm.
 * @param soilType - The type of soil.
 * @param season - The current farming season.
 * @returns A promise that resolves to an array of CropRecommendation objects.
 */
export const recommendCrops = async (
  pincode: string,
  soilType: string,
  season: string
): Promise<CropRecommendation[]> => {
    const prompt = `
        As an agricultural expert for Indian farmers, recommend 3 profitable and suitable crops for the following conditions.
        Pincode: ${pincode} (India)
        Soil Type: ${soilType}
        Farming Season: ${season}

        For each crop, provide a concise reason for the recommendation, the expected yield in 'kg per acre', and the expected profit in INR.
        The reason should be practical and easy for a farmer to understand.
    `;

    try {
        const response: GenerateContentResponse = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    crop: {
                                        type: Type.STRING,
                                        description: 'Name of the recommended crop (e.g., "Wheat", "Tomato").'
                                    },
                                    reason: {
                                        type: Type.STRING,
                                        description: 'A brief, practical reason why this crop is suitable.'
                                    },
                                    expectedYieldKgPerAcre: {
                                        type: Type.STRING,
                                        description: 'Estimated yield in kilograms per acre (e.g., "2000-2500 kg").'
                                    },
                                    expectedProfitInr: {
                                        type: Type.STRING,
                                        description: 'Estimated profit in Indian Rupees per acre (e.g., "₹50,000 - ₹70,000").'
                                    }
                                },
                                required: ["crop", "reason", "expectedYieldKgPerAcre", "expectedProfitInr"]
                            }
                        }
                    },
                    required: ["recommendations"]
                },
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson.recommendations || [];
    } catch (error) {
        console.error("Error fetching crop recommendations:", error);
        throw new Error("Failed to get recommendations from AI. Please check your API key and try again.");
    }
};

/**
 * Manages a chat session with the Agri Q&A bot.
 */
export class AgriChat {
  private chat: Chat;

  constructor() {
    this.chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are 'Maharishi', an AI agricultural assistant for Indian farmers.
- Provide safe, practical, and concise advice.
- Answer in simple, easy-to-understand language.
- Do not recommend harmful chemical practices or unsafe techniques.
- If asked about topics outside of farming, agriculture, or rural life, politely decline to answer.
- Start every conversation with a friendly greeting in a mix of English and Hindi, like "Namaste! I am Maharishi, your AI farming assistant. How can I help you today?". But after the first message, answer only in the language of the user's question.
- Your advice is for informational purposes only. Always end your responses with a disclaimer: "Disclaimer: Please consult a local agricultural expert before making farming decisions."`,
        temperature: 0.5,
      },
    });
  }

  /**
   * Sends a message to the chat model and gets a streaming response.
   * @param message - The user's message.
   * @returns An async iterator that yields response chunks.
   */
  async sendMessageStream(message: string) {
    if (!API_KEY) {
      async function* disabledStream() {
        yield { text: "AI features are disabled. Please configure the API key." };
      }
      return disabledStream();
    }
    
    try {
      return this.chat.sendMessageStream({ message });
    } catch (error) {
      console.error("Error sending chat message:", error);
      async function* errorStream() {
        yield { text: "Sorry, I encountered an error. Please try again." };
      }
      return errorStream();
    }
  }
}
