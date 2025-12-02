import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, Mode } from '../types';
import { PROMPT_MODIFIERS } from '../constants';

const getApiKey = (manualKey?: string): string => {
  if (manualKey) return manualKey;
  if (import.meta.env && import.meta.env.VITE_API_KEY) {
    return import.meta.env.VITE_API_KEY;
  }
  return '';
};

export const generateImage = async (config: GenerationConfig): Promise<string | null> => {
  try {
    const apiKey = getApiKey(config.apiKey);
    
    if (!apiKey) {
      throw new Error("API Key não encontrada. Por favor, configure sua chave clicando no ícone de engrenagem.");
    }

    const ai = new GoogleGenAI({ apiKey });

    let finalPrompt = config.prompt.trim();
    
    if (!finalPrompt && config.mode === Mode.CREATE) {
      finalPrompt = "A creative, high-quality image.";
    }

    if (config.selectedFunction && PROMPT_MODIFIERS[config.selectedFunction]) {
      finalPrompt = `${finalPrompt}. ${PROMPT_MODIFIERS[config.selectedFunction]}`;
    }

    if (!finalPrompt.toLowerCase().includes('quality')) {
      finalPrompt += ", high quality, highly detailed, 8k resolution";
    }

    const parts: any[] = [];

    if (config.mode === Mode.EDIT && config.inputImage) {
      const base64Data = config.inputImage.split(',')[1] || config.inputImage;
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/png', 
        },
      });

      if (config.selectedFunction === 'merge-people' && config.secondaryInputImage) {
         const secBase64 = config.secondaryInputImage.split(',')[1] || config.secondaryInputImage;
         parts.push({
            inlineData: {
              data: secBase64,
              mimeType: 'image/png',
            }
         });
      }
    }

    parts.push({ text: finalPrompt });

    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
        }
      }
    });

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    console.warn("No image data found in response", response);
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};