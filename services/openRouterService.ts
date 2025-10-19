import { AppSettings, GeneratedPrompt } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Return the full data URL for OpenRouter multimodal support
        resolve(reader.result as string);
      };
      reader.onerror = error => reject(error);
    });
};

const getSystemPrompt = (settings: AppSettings): string => {
    const promptSegments = [
        `You are an expert director and viral content creator, specialized in generating prompts for advanced text-to-video models like Sora 2 Pro and Veo 3.`,
        `Your task is to create a detailed, cinematic, and viral-optimized video prompt based on the user's input.`,
        `The final output MUST be a single JSON object that strictly follows this schema: {"model": "string", "duration": number, "aspect_ratio": "string", "prompt": "string", "sound": "string", "style": "string", "twist": "string"}. Do not add any other text or explanations outside of the JSON object.`,
        
        `--- Core Directives ---`,
        `1.  **Story Formula:** Strictly follow the 'Hook + Scene + Twist' storytelling formula to maximize engagement.`,
        `2.  **Viral Drivers:** Incorporate psychological drivers for virality: strong emotion (joy, awe, surprise, nostalgia), absurdity to stop scrolling, and relatable or familiar concepts.`,
        `3.  **Cinematic Language:** Use precise, professional directorial language. Specify camera shots (e.g., 'extreme close-up', 'dynamic orbiting shot'), movement (e.g., 'slow-motion', 'whip pan'), lighting (e.g., 'warm sunset light', 'neon glow', 'soft lens flare'), and sound design.`,
        `4.  **Realism & Detail:** Embed principles of physical realism and hyper-detailed descriptions. Mention gravity, inertia, material properties (e.g., 'physics-accurate fur motion'), and synchronized audio cues. Be extremely descriptive.`,
        `5.  **Target Video Parameters:** The video will be ${settings.duration} seconds long with a ${settings.ratio} aspect ratio. Tailor the prompt complexity to be achievable within this duration.`,
        `6.  **User Keywords:** Pay close attention to any specific keywords provided by the user in their topic, such as visual styles (e.g., 'Anime'), moods (e.g., 'Suspenseful'), or camera techniques (e.g., 'Drone shots'), and incorporate them directly into your creative choices.`,

        `--- Exemplar of Excellence (for your reference) ---`,
        `Topic: A Raccoon Chef`,
        `Example Result JSON: { "model": "veo-3", "duration": 12, "aspect_ratio": "9:16", "prompt": "Extreme macro probe lens push-IN through a miniature, hyper-detailed Michelin-star kitchen hidden within a mossy tree stump... (and so on, following the full detailed example)", "sound": "A rich, 3D ASMR soundscape: the crisp 'shing' of a sharp knife...", "style": "Vertical IMAX quality. The texture is 'Arcane' meets hyper-realistic CGI...", "twist": "The raccoon executes a flawless, anime-style battle spin and hurls a single strand of spaghetti at a 'wall' of polished slate... It arranges itself into a flawless, full-scale replica of Vermeer's 'Girl with a Pearl Earring.'" }`,

        `Now, generate a new JSON object for the user's request, applying this level of detail and creativity.`
    ];
    return promptSegments.join('\n');
};

export const generateViralPromptWithOpenRouter = async (
  apiKey: string,
  model: string,
  settings: AppSettings,
  topic: string,
  imageFile?: File | null
): Promise<GeneratedPrompt> => {
  const systemPrompt = getSystemPrompt(settings);

  const messages: any[] = [{ role: 'system', content: systemPrompt }];
  
  const userContent: any[] = [];
  const userPromptText = imageFile 
    ? `Use the following image as the primary visual and thematic inspiration for the topic: "${topic}"`
    : `Generate a prompt for the topic: "${topic}"`;

  userContent.push({ type: 'text', text: userPromptText });

  if (imageFile) {
    const supportedMultimodal = ['openai/gpt-4o', 'anthropic/claude-3-haiku-20240307'];
    if (supportedMultimodal.includes(model)) {
        const base64Image = await fileToBase64(imageFile);
        userContent.push({
            type: 'image_url',
            image_url: { url: base64Image },
        });
    } else {
        console.warn(`Image provided for model ${model} which may not support it. Ignoring image.`);
    }
  }
  
  messages.push({ role: 'user', content: userContent });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      response_format: { type: "json_object" },
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const jsonText = data.choices[0].message.content;
  const result = JSON.parse(jsonText);
  return result as GeneratedPrompt;
};

export const generateThumbnailWithOpenRouter = async (
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> => {
    const imagePrompt = `Create a visually stunning, ultra-realistic, cinematic thumbnail for a viral video. The scene is: ${prompt}. Emphasize the hook of the story. Use a 16:9 aspect ratio.`;

    const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          prompt: imagePrompt,
          n: 1,
          size: "1024x576", // a 16:9 friendly size
          response_format: "b64_json",
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter Image API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const base64Json = data.data[0].b64_json;
    return `data:image/png;base64,${base64Json}`;
};