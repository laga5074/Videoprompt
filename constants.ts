import { ModelOption, AppSettings } from './types';

export const TEXT_MODELS: ModelOption[] = [
  { id: 'gemini/gemini-2.5-pro', name: 'Gemini 2.5 Pro (Native)', type: 'free' },
  { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick', type: 'free' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', type: 'free' },
  { id: 'deepseek/deepseek-v3-base:free', name: 'DeepSeek v3', type: 'free' },
  { id: 'moonshotai/kimi-vl-a3b-thinking:free', name: 'Kimi VL (Vision)', type: 'free' },
  { id: 'qwen/qwen2.5-vl-3b-instruct:free', name: 'Qwen 2.5 VL (Vision)', type: 'free' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', type: 'paid' },
  { id: 'openrouter/optimus-alpha', name: 'Optimus Alpha', type: 'paid' },
  { id: 'openrouter/quasar-alpha', name: 'Quasar Alpha', type: 'paid' },
];

export const IMAGE_MODELS: ModelOption[] = [
  { id: 'gemini/gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', type: 'free' },
  { id: 'playground-v2', name: 'Playground v2', type: 'free' },
  { id: 'stability-sdxl', name: 'Stability SDXL', type: 'free' },
  { id: 'openai/gpt-5-image-mini', name: 'GPT-5 Image Mini', type: 'paid' },
  { id: 'stability-ultra', name: 'Stability Ultra', type: 'paid' },
  { id: 'fal-ai/flux-1', name: 'FAL AI Flux 1', type: 'paid' },
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

export const DEFAULT_SETTINGS: AppSettings = {
  duration: 8,
  theme: 'dark',
  ratio: '16:9',
};
