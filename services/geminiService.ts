import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Sends an image to Gemini to add a Christmas hat while maintaining style.
 */
export const addChristmasHatToImage = async (
  base64Data: string, 
  mimeType: string,
  color: string = 'Red'
): Promise<string> => {
  const ai = getGeminiClient();
  
  // Using gemini-2.5-flash-image for fast and accurate image editing capabilities
  const modelId = 'gemini-2.5-flash-image';

  // Construct the prompt to ensure style consistency
  const prompt = `
    Edit this image to add a festive ${color} Christmas hat (Santa hat) to the head of the main person or character in the image.
    
    CRITICAL INSTRUCTIONS:
    1. The hat MUST be primarily ${color} in color.
    2. DO NOT CHANGE THE PERSON'S FACE. Preserve the identity, facial features, and expression exactly as they are.
    3. The hat MUST match the artistic style, lighting, texture, and resolution of the original image perfectly.
    4. If it's a cartoon, make the hat a cartoon. If it's a photo, make the hat photorealistic.
    5. Ensure the hat fits naturally on the head, respecting perspective and gravity.
    6. Return the image as the output.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }
    });

    // Extract the image from the response
    // The API might return text (if it refuses) or inlineData (the image)
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content returned from Gemini.");
    }

    // Look for the image part
    const imagePart = parts.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    }

    // If no image part, check for text (usually a refusal or error explanation)
    const textPart = parts.find(part => part.text);
    if (textPart && textPart.text) {
      throw new Error(`Gemini could not generate the image: ${textPart.text}`);
    }

    throw new Error("Gemini returned an empty response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process image with Gemini.");
  }
};