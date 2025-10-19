import { AppSettings, GeneratedPrompt, AspectRatio } from '../types';

// As required by OpenRouter API, you should set this to your site's URL.
const SITE_URL = window.location.href; 
const SITE_NAME = "AI Viral Video Prompt Builder";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const extractErrorMessage = (errorData: any): string => {
    if (typeof errorData === 'string') return errorData;
    if (typeof errorData !== 'object' || errorData === null) return 'Unknown error format';
    
    // Standard OpenAI / OpenRouter format
    if (errorData.error?.message) {
        let msg = errorData.error.message;
        if (errorData.error.code) msg += ` (Code: ${errorData.error.code})`;
        return msg;
    }

    // Other common formats
    if (errorData.message) return errorData.message;
    if (errorData.detail) {
        if (typeof errorData.detail === 'string') return errorData.detail;
        if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
             return errorData.detail.map((d: any) => d.msg).join(', ');
        }
    }
    
    // Fallback to stringifying the whole object for debugging
    try {
        const fullError = JSON.stringify(errorData, null, 2);
        // Avoid returning just "{}" for empty objects
        if (fullError === '{}') return 'An unknown error occurred.';
        return `Full error response: ${fullError}`;
    } catch {
        return 'Could not stringify the error object.';
    }
};

export const generateViralPrompt = async (
  apiKey: string,
  model: string,
  settings: AppSettings,
  topic: string,
  imageFile?: File | null
): Promise<GeneratedPrompt> => {
  if (!apiKey) throw new Error("OpenRouter API Key is required.");

  const promptSegments = [
    `You are an expert director and viral content creator, specialized in generating prompts for advanced text-to-video models like Sora 2 Pro and Veo 3.`,
    `Your task is to create a detailed, cinematic, and viral-optimized video prompt based on the user's input.`,
    `The final output MUST be a single JSON object. Do not add any markdown formatting like \`\`\`json or any other text outside the JSON object.`,
    `--- Core Directives ---`,
    `1.  **Story Formula:** Strictly follow the 'Hook + Scene + Twist' storytelling formula to maximize engagement.`,
    `2.  **Viral Drivers:** Incorporate psychological drivers for virality: strong emotion (joy, awe, surprise, nostalgia), absurdity to stop scrolling, and relatable or familiar concepts.`,
    `3.  **Cinematic Language:** Use precise, professional directorial language. Specify camera shots (e.g., 'extreme close-up', 'dynamic orbiting shot'), movement (e.g., 'slow-motion', 'whip pan'), lighting (e.g., 'warm sunset light', 'neon glow', 'soft lens flare'), and sound design.`,
    `4.  **Realism:** Embed principles of physical realism. Mention gravity, inertia, material properties (e.g., 'physics-accurate fur motion'), and synchronized audio cues (e.g., 'crowd laughter and bass beat sync perfectly').`,
    `5.  **Target Video Parameters:** The video will be ${settings.duration} seconds long with a ${settings.ratio} aspect ratio. Tailor the prompt complexity to be achievable within this duration.`,
     `The JSON object must have the following structure: { "model": "sora-2-pro", "duration": ${settings.duration}, "aspect_ratio": "${settings.ratio}", "prompt": string, "sound": string, "style": string, "twist": string }.`
  ];

  const systemPrompt = promptSegments.join('\n');
  
  let userMessageContent: any;

  if (imageFile) {
    const base64Image = await fileToBase64(imageFile);
    userMessageContent = [
      {
        type: "text",
        text: `Use the following image as the primary visual and thematic inspiration for the topic: "${topic}"`
      },
      {
        type: "image_url",
        image_url: { url: base64Image },
      }
    ];
  } else {
    userMessageContent = `Generate a prompt for the topic: "${topic}"`;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessageContent }
      ],
      response_format: { type: "json_object" }
    }),
  });
  
  const responseText = await response.text();

  if (!response.ok) {
    let errorMessage = `Failed to generate prompt. Status: ${response.status}`;
    try {
      const errorData = JSON.parse(responseText);
      console.error("OpenRouter API Error (JSON):", errorData);
      errorMessage = `${errorMessage}: ${extractErrorMessage(errorData)}`;
    } catch (e) {
      console.error("OpenRouter API Error (Text):", responseText);
      errorMessage = `${errorMessage}. Server response: ${responseText || 'Empty response'}`;
    }
    throw new Error(errorMessage);
  }

  try {
    const data = JSON.parse(responseText);
    const jsonContent = data.choices[0]?.message?.content;
     if (!jsonContent) {
        throw new Error("API response is missing the message content.");
    }
    const cleanedJson = jsonContent.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (e: any) {
    console.error("Failed to parse successful response:", responseText, e);
    throw new Error(`The AI model returned an invalid format. ${e.message}`);
  }
};

export const generateThumbnail = async (
  apiKey: string,
  model: string,
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  if (!apiKey) throw new Error("OpenRouter API Key is required.");
  
  const imagePrompt = `Create a visually stunning, ultra-realistic, cinematic thumbnail for a viral video. The scene is: ${prompt}. Emphasize the hook of the story.`;

  const payload: any = {
    model: model,
    prompt: imagePrompt,
  };

  // Model-specific parameter handling
  if (model.startsWith('openai/')) {
    payload.n = 1;
    payload.response_format = 'b64_json';
    switch (aspectRatio) {
      case '16:9': payload.size = '1792x1024'; break;
      case '9:16': payload.size = '1024x1792'; break;
      default: payload.size = '1024x1024'; break;
    }
  } else if (model === 'stability-ultra') {
    payload.n = 1;
    payload.response_format = 'b64_json';
    payload.aspect_ratio = aspectRatio;
  } else {
    // Default to width/height for other models (SDXL, Playground, etc.) which is more standard.
    let width = 1024, height = 1024;
    switch (aspectRatio) {
        case '16:9': [width, height] = [1344, 768]; break;
        case '9:16': [width, height] = [768, 1344]; break;
        case '1:1':  [width, height] = [1024, 1024]; break;
        case '4:3':  [width, height] = [1152, 896]; break;
        case '3:4':  [width, height] = [896, 1152]; break;
    }
    payload.width = width;
    payload.height = height;
    // By not specifying `response_format` or `n`, we increase compatibility with various models
    // that might not support these OpenAI-specific parameters. Most will default to returning a URL.
  }


  const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let errorMessage = `Failed to generate thumbnail. Status: ${response.status}`;
    try {
      const errorData = JSON.parse(responseText);
      console.error("OpenRouter Image API Error (JSON):", errorData);
      errorMessage = `${errorMessage}: ${extractErrorMessage(errorData)}`;
    } catch (e) {
      console.error("OpenRouter Image API Error (Text):", responseText);
      errorMessage = `${errorMessage}. Server response: ${responseText || 'Empty response'}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const result = data.data?.[0];

  // Handle both b64_json (from OpenAI/Stability) and url (from others) responses
  if (result?.b64_json) {
    return `data:image/png;base64,${result.b64_json}`;
  }
  if (result?.url) {
    return result.url;
  }

  throw new Error("No image was generated or the response format was unexpected.");
};
