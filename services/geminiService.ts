
import { GoogleGenAI, Type } from "@google/genai";
import { ContactInfo } from "../types";

export const extractContactFromImages = async (base64Images: string[]): Promise<ContactInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const imageParts = base64Images.map(base64 => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64.split(',')[1],
    },
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...imageParts,
        {
          text: "You are provided with one or more images of a business card (e.g., front and back). Extract all contact details and synthesize them into a single comprehensive JSON object. Be thorough and merge information if it spans multiple sides. Format as a single JSON object. If a field is not found, leave it as an empty string.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          firstName: { type: Type.STRING },
          lastName: { type: Type.STRING },
          fullName: { type: Type.STRING },
          organization: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          mobile: { type: Type.STRING },
          website: { type: Type.STRING },
          address: { type: Type.STRING },
          city: { type: Type.STRING },
          state: { type: Type.STRING },
          zipCode: { type: Type.STRING },
          country: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["fullName"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No data extracted");
    return JSON.parse(text) as ContactInfo;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not interpret business card data.");
  }
};
