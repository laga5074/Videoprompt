import { ModelOption, AppSettings } from './types';

export const TEXT_MODELS: ModelOption[] = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
];

export const IMAGE_MODELS: ModelOption[] = [
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image' },
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
