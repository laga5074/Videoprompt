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
    `The final output MUST be a single JSON object that strictly follows the provided schema.`,
    
    `--- Core Directives ---`,
    `1.  **Story Formula:** Strictly follow the 'Hook + Scene + Twist' storytelling formula to maximize engagement.`,
    `2.  **Viral Drivers:** Incorporate psychological drivers for virality: strong emotion (joy, awe, surprise, nostalgia), absurdity to stop scrolling, and relatable or familiar concepts.`,
    `3.  **Cinematic Language:** Use precise, professional directorial language. Specify camera shots (e.g., 'extreme close-up', 'dynamic orbiting shot'), movement (e.g., 'slow-motion', 'whip pan'), lighting (e.g., 'warm sunset light', 'neon glow', 'soft lens flare'), and sound design.`,
    `4.  **Realism & Detail:** Embed principles of physical realism and hyper-detailed descriptions. Mention gravity, inertia, material properties (e.g., 'physics-accurate fur motion'), and synchronized audio cues. Be extremely descriptive.`,
    `5.  **Target Video Parameters:** The video will be ${settings.duration} seconds long with a ${settings.ratio} aspect ratio. Tailor the prompt complexity to be achievable within this duration.`,
    `6.  **User Keywords:** Pay close attention to any specific keywords provided by the user in their topic, such as visual styles (e.g., 'Anime'), moods (e.g., 'Suspenseful'), or camera techniques (e.g., 'Drone shots'), and incorporate them directly into your creative choices.`,

    `--- Exemplar of Excellence ---`,
    `To understand the level of quality and creativity expected, study this example of a world-class prompt. Your output should embody this level of detail, narrative structure, and viral engineering.`,
    `Topic: A Raccoon Chef`,

    `HOOK: Extreme macro probe lens push-IN through a miniature, hyper-detailed Michelin-star kitchen hidden within a mossy tree stump. The camera navigates a forest of tiny copper pots, catching the chaotic ballet of microscopic herb confetti and bubbling infused oils, all backlit by golden hour light slicing through a canopy of leaves.`,

    `SCENE: A frenetic, hyper-realistic raccoon chef, sleeves rolled up on a stained miniature jacket, moves with "Everything Everywhere All At Once" chaotic precision. Its paws are a fluid blur of action: one arm rolls fresh pasta with a miniature rolling pin, another precisely chops micro-herbs, while a third adjusts a flame under a reducing sauce. We use "The Bear"-style intense, shaky-cam close-ups mixed with dramatic, slow-motion "Salt Bae" shots that highlight every droplet of water and particle of floating flour. The lighting is a masterclass in food cinematography—a warm, dramatic overhead key light creates deep, engaging shadows.`,

    `TWIST: The raccoon executes a flawless, anime-style battle spin and hurls a single strand of spaghetti at a "wall" of polished slate. The strand freezes mid-air in a "Matrix"-style bullet-time grid. Then, with a series of satisfying "SNAP" sounds, the strand multiplies and arranges itself into a flawless, full-scale replica of Vermeer's "Girl with a Pearl Earring." The iconic pearl is a single, glistening, perfect meatball with real-time raytracing reflections. The camera captures this in a "Spider-Verse" multi-panel split-screen, showing the creation from three distinct angles: a macro shot of the pasta forming brushstrokes, a thermal vision shot showing the heat of the fresh pasta, and a wide shot of the entire masterpiece materializing. It ends on a "POV: You Are The Painting" shot, looking out from the canvas as the raccoon nods in approval.`,

    `SOUND DESIGN: A rich, 3D ASMR soundscape: the crisp "shing" of a sharp knife, the intense sizzle of food hitting a hot pan, and the sticky, elastic sound of pasta being stretched, all perfectly synced to a trending Lo-fi Hip Hop beat. The track builds to a sudden record scratch and absolute silence during the Matrix freeze, punctuated only by a high-ping "PLINK" as the meatball pearl clicks into place. It concludes with a mutated viral audio trend: the "Oh no, oh no, oh no no no" song is cut off by the raccoon's triumphant, meme-worthy "SKREEEEE-KAW!" as it throws a chef's kiss.`,

    `VISUAL STYLE: Vertical IMAX quality. The texture is "Arcane" meets hyper-realistic CGI, with next-gen subsurface scattering on the raccoon's fur so you can see the light filter through it. The color palette is a complementary clash of warm, rustic copper and earthy tones against the cool, surreal blue and yellow of the meatball pearl. We integrate a "deconstructed recipe" aesthetic with floating, minimalist UI labels identifying ingredients. Light 35mm film grain and a vibrant, social-media-optimized color grade with slightly crushed blacks for dramatic contrast.`,

    `TWIST 2.0 (The Payoff): The single painting was just the appetizer. The spaghetti strand continues, snaking across the wall to create an entire "Carb-aret Museum." We see "Starry Night" rendered in swirling, glowing squid ink pasta, "The Scream" in dripping, animated melted cheese that actually vocalizes a muted scream, and "American Gothic" with the two farmers made of different pasta types. The raccoon, now wearing a tiny art curator's blazer and holding a laser pointer, begins a deadpan TED Talk on "Carb-Based Art History," explaining the nuances of al dente brushstrokes and the emotional weight of a good marinara.`,

    `--- Thought Process on Viral Engineering (For your reference, do not include this in the output) ---`,
    `· Multi-Platform Native Editing: Pre-structured for a 7-second hook (TikTok), 22-second narrative (YouTube Shorts), and 45-second tutorial version (Instagram Reels).`,
    `· Character Archetype: "The Animal Professor" - an absurdly knowledgeable creature in a mundane role, creating immediate relatability and shareability.`,
    `· Sensory Overload & ASMR: A calculated mix of satisfying geometric patterns, crisp sounds, and chaotic energy that triggers autonomous sensory meridian response and encourages repeated viewing.`,
    `· Absurdist Humor & Intellectual Wit: The core of the viral twist, blending high-brow art history with low-brow food puns, appealing to multiple demographics simultaneously.`,
    `· Advanced Cinematic Techniques: Matrix Bullet-Time, Spider-Verse Multi-Verse Breaking, Micro-to-Macro Scale Shifting, Thermal Vision & Data Overlays.`,

    `Now, generate a new JSON object for the user's request, applying this level of detail and creativity.`
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