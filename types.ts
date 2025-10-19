
export interface AppSettings {
  duration: number;
  theme: 'dark' | 'light';
  ratio: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
}

export interface StoredState {
  openrouterApiKey: string;
  preferredTextModel: string;
  preferredImageModel: string;
  history: GeneratedPrompt[];
  settings: AppSettings;
}

export interface GeneratedPrompt {
  model: string;
  duration: number;
  aspect_ratio: string;
  prompt: string;
  sound: string;
  style: string;
  twist: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'google' | 'openrouter';
}

export type Theme = 'light' | 'dark';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';