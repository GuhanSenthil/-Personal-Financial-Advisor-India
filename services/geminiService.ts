import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialAdvice } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const adviceSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A friendly, one-sentence summary of the user's financial health for the period."
        },
        forecast: {
            type: Type.STRING,
            description: "A brief financial forecast for the upcoming month based on trends. Mention expected surplus or deficit."
        },
        tips: {
            type: Type.ARRAY,
            description: "A list of 3-4 actionable and personalized financial tips or recommendations, relevant for someone in India.",
            items: { type: Type.STRING }
        }
    },
    required: ["summary", "forecast", "tips"],
};

export const getFinancialAdvice = async (transactions: Transaction[], goal: string): Promise<FinancialAdvice> => {
    const prompt = `
        Based on the following financial data (in INR) for a user in India, provide a financial analysis.
        User Goal: "${goal}"
        
        Financial Data (JSON):
        ${JSON.stringify(transactions, null, 2)}

        Analyze the income vs. expenses, identify spending patterns, and generate a concise summary, a forecast for the next month, and actionable tips.
        The tone should be encouraging, clear, and helpful. The currency is Indian Rupees (₹).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: adviceSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (parsedJson.summary && parsedJson.forecast && Array.isArray(parsedJson.tips)) {
             return parsedJson as FinancialAdvice;
        } else {
            throw new Error("Invalid JSON structure received from AI.");
        }
    } catch (error) {
        console.error("Error fetching or parsing financial advice:", error);
        throw new Error("Could not get a valid response from the financial advisor.");
    }
};