import { ModelOption, AppSettings } from './types';

export const TEXT_MODELS: ModelOption[] = [
  // Google Gemini Models
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'google' },
  // OpenRouter Models
  { id: 'openai/gpt-4o', name: 'GPT-4o (OpenRouter)', provider: 'openrouter' },
  { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku (OpenRouter)', provider: 'openrouter' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B (OpenRouter)', provider: 'openrouter' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct (Free)', provider: 'openrouter' },
  { id: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', name: 'Nous Hermes 2 Mixtral (Free)', provider: 'openrouter' },
];

export const IMAGE_MODELS: ModelOption[] = [
  // Google Gemini Model
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', provider: 'google' },
  // OpenRouter Models
  { id: 'stability-ai/stable-diffusion-xl', name: 'Stable Diffusion XL (Free)', provider: 'openrouter' },
  { id: 'playgroundai/playground-v2.5', name: 'Playground v2.5 (OpenRouter)', provider: 'openrouter' },
];


export const FILL_IN_BLANK_TEMPLATES = [
  '[Animal] doing [Human Task] in [Weird Setting]',
  '[Celebrity] reacting to [Funny Event]',
  '[Occupation] in [Wrong Context]',
  '[Object] behaving like [Human Emotion]',
];

export const TREND_TOPICS = [
    "Retro futurism",
    "Cottagecore aesthetic",
    "ASMR visuals",
    "Satisfying loops",
    "Miniature worlds",
    "Surreal animations",
    "Vintage tech revival",
];

export const VISUAL_STYLES = [
    "Cinematic", "Hyper-realistic", "Anime", "Pixar Style", "Claymation", "Vaporwave", "Documentary", "Found Footage"
];

export const MOODS = [
    "Humorous", "Epic", "Wholesome", "Suspenseful", "Mysterious", "Uplifting", "Chaotic", "Serene"
];

export const CAMERA_TECHNIQUES = [
    "Drone Shots", "First-Person POV", "Macro Shots", "Time-lapse", "Slow Motion", "Whip Pans", "Tracking Shot", "Dutch Angle"
];

export const DEFAULT_SETTINGS: AppSettings = {
  duration: 8,
  theme: 'dark',
  ratio: '16:9',
};