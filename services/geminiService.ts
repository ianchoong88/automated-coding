
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
          text: "You are provided with one or more images of a business card. Extract all contact details. Additionally, detect the bounding box of the main company logo and the person's portrait photo if they are visible. Use normalized coordinates [0-1000] for ymin, xmin, ymax, xmax. Specify the 'imageIndex' (0 for the first image, 1 for the second, etc.) where each graphic is located. Synthesize all information into a single JSON object.",
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
          logoBox: {
            type: Type.OBJECT,
            properties: {
              ymin: { type: Type.NUMBER },
              xmin: { type: Type.NUMBER },
              ymax: { type: Type.NUMBER },
              xmax: { type: Type.NUMBER },
              imageIndex: { type: Type.NUMBER }
            }
          },
          photoBox: {
            type: Type.OBJECT,
            properties: {
              ymin: { type: Type.NUMBER },
              xmin: { type: Type.NUMBER },
              ymax: { type: Type.NUMBER },
              xmax: { type: Type.NUMBER },
              imageIndex: { type: Type.NUMBER }
            }
          }
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
