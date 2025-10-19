import { GoogleGenAI, Type, Modality } from '@google/genai';
import { AppSettings, GeneratedPrompt } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data url prefix, e.g. "data:image/png;base64,"
      resolve(result.split(',')[1]); 
    };
    reader.onerror = error => reject(error);
  });
};

const getFileMimeType = (file: File): string => {
    return file.type;
}

export const generateViralPrompt = async (
  model: string,
  settings: AppSettings,
  topic: string,
  imageFile?: File | null
): Promise<GeneratedPrompt> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const promptSegments = [
    `You are an expert director and viral content creator, specialized in generating prompts for advanced text-to-video models like Sora 2 Pro and Veo 3.`,
    `Your task is to create a detailed, cinematic, and viral-optimized video prompt based on the user's input.`,
    `The final output MUST be a single JSON object.`,
    `--- Core Directives ---`,
    `1.  **Story Formula:** Strictly follow the 'Hook + Scene + Twist' storytelling formula to maximize engagement.`,
    `2.  **Viral Drivers:** Incorporate psychological drivers for virality: strong emotion (joy, awe, surprise, nostalgia), absurdity to stop scrolling, and relatable or familiar concepts.`,
    `3.  **Cinematic Language:** Use precise, professional directorial language. Specify camera shots (e.g., 'extreme close-up', 'dynamic orbiting shot'), movement (e.g., 'slow-motion', 'whip pan'), lighting (e.g., 'warm sunset light', 'neon glow', 'soft lens flare'), and sound design.`,
    `4.  **Realism:** Embed principles of physical realism. Mention gravity, inertia, material properties (e.g., 'physics-accurate fur motion'), and synchronized audio cues (e.g., 'crowd laughter and bass beat sync perfectly').`,
    `5.  **Target Video Parameters:** The video will be ${settings.duration} seconds long with a ${settings.ratio} aspect ratio. Tailor the prompt complexity to be achievable within this duration.`,
  ];
  const systemInstruction = promptSegments.join('\n');
  
  const userPromptText = imageFile 
    ? `Use the following image as the primary visual and thematic inspiration for the topic: "${topic}"`
    : `Generate a prompt for the topic: "${topic}"`;

  const parts: any[] = [];
  if (imageFile) {
    const base64Image = await fileToBase64(imageFile);
    const mimeType = getFileMimeType(imageFile);
    parts.push({
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    });
  }
  parts.push({ text: userPromptText });
  
  const promptSchema = {
    type: Type.OBJECT,
    properties: {
        model: { type: Type.STRING, description: "The target video model, e.g., 'sora-2-pro' or 'veo-3'" },
        duration: { type: Type.NUMBER, description: "Video duration in seconds." },
        aspect_ratio: { type: Type.STRING, description: "Video aspect ratio." },
        prompt: { type: Type.STRING, description: "The full, detailed cinematic prompt." },
        sound: { type: Type.STRING, description: "Description of the sound design, music, and audio cues." },
        style: { type: Type.STRING, description: "The visual style of the video (e.g., 'Cinematic, hyper-realistic, 8k')." },
        twist: { type: Type.STRING, description: "The surprising twist in the story." }
    },
    required: ["model", "duration", "aspect_ratio", "prompt", "sound", "style", "twist"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: promptSchema
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    return result as GeneratedPrompt;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes('API key not valid')) {
       throw new Error(`Invalid Google AI API Key. Please ensure your key is correctly configured.`);
    }
    throw new Error(`Failed to generate prompt with Gemini. ${error.message}`);
  }
};

export const generateThumbnail = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePrompt = `Create a visually stunning, ultra-realistic, cinematic thumbnail for a viral video. The scene is: ${prompt}. Emphasize the hook of the story.`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [{ text: imagePrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("No image was generated by Gemini.");
  } catch (error: any) {
    console.error("Gemini Image API Error:", error);
    if (error.message.includes('API key not valid')) {
       throw new Error(`Invalid Google AI API Key. Please ensure your key is correctly configured.`);
    }
    throw new Error(`Failed to generate thumbnail with Gemini. ${error.message}`);
  }
};
