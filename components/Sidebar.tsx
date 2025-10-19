import React, { useState, useRef } from 'react';
import { AppSettings, ModelOption, Theme, AspectRatio } from '../types';
import { TEXT_MODELS, IMAGE_MODELS, FILL_IN_BLANK_TEMPLATES, TREND_TOPICS, VISUAL_STYLES, MOODS, CAMERA_TECHNIQUES } from '../constants';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface SidebarProps {
  textModel: string;
  setTextModel: (model: string) => void;
  imageModel: string;
  setImageModel: (model: string) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <span>{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="pb-4 space-y-4">{children}</div>}
        </div>
    );
};

const ModelSelector = ({ label, value, onChange, models }: { label: string, value: string, onChange: (val: string) => void, models: ModelOption[] }) => {
    const googleModels = models.filter(m => m.provider === 'google');
    const openRouterModels = models.filter(m => m.provider === 'openrouter');

    return (
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <optgroup label="Google AI">
                {googleModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
            </optgroup>
            <optgroup label="OpenRouter">
                {openRouterModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
            </optgroup>
          </select>
        </div>
    );
};

const SettingsSlider = ({ label, value, onChange, min, max, step }: { label: string, value: number, onChange: (val: number) => void, min: number, max: number, step: number }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}: <span className="font-bold text-gray-800 dark:text-gray-200">{value}s</span></label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
    </div>
);

const ButtonGroup = <T extends string>({ label, value, onChange, options }: { label: string, value: T, onChange: (val: T) => void, options: { value: T; label: React.ReactNode }[] }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</label>
        <div className="flex space-x-2">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors font-semibold ${value === option.value ? 'bg-primary-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  textModel,
  setTextModel,
  imageModel,
  setImageModel,
  settings,
  setSettings,
  topic,
  setTopic,
  imageFile,
  setImageFile,
  onGenerate,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeChange = (theme: Theme) => {
    setSettings(s => ({ ...s, theme }));
  };

  const handleRatioChange = (ratio: AspectRatio) => {
    setSettings(s => ({ ...s, ratio }));
  };

  const handleDurationChange = (duration: number) => {
    setSettings(s => ({ ...s, duration }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };
  
  const addKeywordToTopic = (keyword: string) => {
    setTopic(prev => {
      // Split by comma and trim to handle existing keywords robustly.
      const existingKeywords = prev.split(',').map(k => k.trim());
      if (existingKeywords.includes(keyword)) {
        return prev; // Keyword already exists, do nothing.
      }
      // Append the new keyword.
      return prev ? `${prev}, ${keyword}` : keyword;
    });
  };

  const KeywordButtons = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item}
          onClick={() => addKeywordToTopic(item)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-full hover:bg-primary-500 hover:text-white transition-colors"
        >
          + {item}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="w-full lg:w-96 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">🚀 AI Viral Video Prompt Builder</h1>
      </header>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Your Core Idea</label>
            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., A cat discovering it can control time"
                rows={3}
                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
        </div>

        <Accordion title="Core Settings" defaultOpen>
            <ModelSelector label="Text Generation Model" value={textModel} onChange={setTextModel} models={TEXT_MODELS} />
            <ModelSelector label="Thumbnail Generation Model" value={imageModel} onChange={setImageModel} models={IMAGE_MODELS} />
            <SettingsSlider label="Video Duration" value={settings.duration} onChange={handleDurationChange} min={1} max={60} step={1} />
            <ButtonGroup label="Aspect Ratio" value={settings.ratio} onChange={handleRatioChange} options={[
                { value: '16:9', label: '16:9' },
                { value: '9:16', label: '9:16' },
                { value: '1:1', label: '1:1' },
            ]} />
            <ButtonGroup label="UI Theme" value={settings.theme} onChange={handleThemeChange} options={[
                { value: 'light', label: <SunIcon className="w-5 h-5 inline-block" /> },
                { value: 'dark', label: <MoonIcon className="w-5 h-5 inline-block" /> },
            ]} />
        </Accordion>

        <Accordion title="Topic Ideas">
           <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Fill-in-the-blank Templates</label>
              <KeywordButtons items={FILL_IN_BLANK_TEMPLATES} />
           </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Trending Concepts</label>
              <KeywordButtons items={TREND_TOPICS} />
            </div>
        </Accordion>
        
        <Accordion title="Creative Controls">
           <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Visual Styles</label>
              <KeywordButtons items={VISUAL_STYLES} />
           </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Moods</label>
              <KeywordButtons items={MOODS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Camera Techniques</label>
              <KeywordButtons items={CAMERA_TECHNIQUES} />
            </div>
        </Accordion>

        <Accordion title="Reference Image (Optional)">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition"
            >
              {imageFile ? `Selected: ${imageFile.name}` : 'Click to upload an image'}
            </button>
            {imageFile && (
              <button
                onClick={() => setImageFile(null)}
                className="w-full text-center mt-2 px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
              >
                Remove Image
              </button>
            )}
          </div>
        </Accordion>
      </div>

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </div>
          ) : '✨ Generate Prompt'}
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;