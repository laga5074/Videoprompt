import { ModelOption, AppSettings } from './types';

export const TEXT_MODELS: ModelOption[] = [
  // Free Models
  { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick', type: 'free' },
  { id: 'google/gemini-2.5-pro-exp-03-25:free', name: 'Gemini 2.5 Pro Exp', type: 'free' },
  { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout', type: 'free' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', type: 'free' },
  { id: 'moonshot/kimi-vl-a3b-thinking:free', name: 'Kimi VL A3B Thinking', type: 'free' },
  { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek Chat V3.1', type: 'free' },
  { id: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free', name: 'Llama 3.1 Nemotron', type: 'free' },
  { id: 'qwen/qwen2.5-vl-3b-instruct:free', name: 'Qwen2.5 VL 3B Instruct', type: 'free' },
  // Paid Models
  { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', type: 'paid' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', type: 'paid' },
  { id: 'openai/o1-preview', name: 'o1 Preview', type: 'paid' },
  { id: 'microsoft/wizardlm-2-8x22b', name: 'WizardLM-2', type: 'paid' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', type: 'paid' },
  { id: 'google/gemini-2.0-flash-thinking-exp', name: 'Gemini 2.0 Flash Thinking', type: 'paid' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', type: 'paid' },
  { id: 'nousresearch/hermes-3-llama-3.1-8b', name: 'Hermes 3 8B', type: 'paid' },
  { id: 'mythomax/mythomax-l2-13b', name: 'MythoMax-L2', type: 'paid' },
  { id: 'snowflake/snowflake-arctic-instruct', name: 'Arctic 2', type: 'paid' },
];

export const IMAGE_MODELS: ModelOption[] = [
  // Free Models
  { id: 'black-forest-labs/flux-1.1-schnell', name: 'Flux 1.1 Schnell', type: 'free' },
  { id: 'stability-ai/sdxl-1.0', name: 'SDXL 1.0', type: 'free' },
  // Paid Models
  { id: 'openai/dall-e-3', name: 'DALL-E 3', type: 'paid' },
  { id: 'stability-ai/stable-diffusion-3.5', name: 'Stable Diffusion 3.5', type: 'paid' },
  { id: 'black-forest-labs/flux-1-dev', name: 'FLUX.1 Dev', type: 'paid' },
  { id: 'playground/playground-2.5', name: 'Playground 2.5', type: 'paid' },
  { id: 'ideogram/ideogram-1.0', name: 'Ideogram 1.0', type: 'paid' },
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