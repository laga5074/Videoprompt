import React, { useState } from 'react';
import { AppSettings, ModelOption, Theme, AspectRatio } from '../types';
import { TEXT_MODELS, IMAGE_MODELS, FILL_IN_BLANK_TEMPLATES, TREND_TOPICS } from '../constants';
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
  setTopic: (topic: string) => void;
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

const ModelSelector = ({ label, value, onChange, models }: { label: string, value: string, onChange: (val: string) => void, models: ModelOption[] }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-200"
      >
        {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    </div>
  );

const Sidebar: React.FC<SidebarProps> = ({
  textModel, setTextModel, imageModel, setImageModel,
  settings, setSettings, topic, setTopic, imageFile, setImageFile, onGenerate, isLoading
}) => {
    
  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings(prev => ({ ...prev, theme: newTheme }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <aside className="w-full lg:w-96 bg-gray-50 dark:bg-gray-800/50 p-6 flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center pb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🎬 Prompt Builder</h1>
        <button onClick={handleThemeToggle} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
          {settings.theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          <Accordion title="💡 Prompt Input" defaultOpen={true}>
             <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title / Trend / Idea</label>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-200" placeholder="e.g., A cat discovering gravity"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Quick Ideas</label>
                <div className="flex flex-wrap gap-2">
                    {[...TREND_TOPICS, ...FILL_IN_BLANK_TEMPLATES].map(t => (
                        <button key={t} onClick={() => setTopic(t)} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reference Image (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/50 dark:file:text-primary-300 dark:hover:file:bg-primary-900" />
              {imageFile && <p className="text-xs text-gray-500 mt-1 truncate">Selected: {imageFile.name}</p>}
            </div>
        </Accordion>

        <Accordion title="🤖 Models">
            <ModelSelector label="Text Model" value={textModel} onChange={setTextModel} models={TEXT_MODELS} />
            <ModelSelector label="Image Model (for thumbnail)" value={imageModel} onChange={setImageModel} models={IMAGE_MODELS} />
        </Accordion>

        <Accordion title="⚙️ Video Settings">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration: {settings.duration}s</label>
              <input type="range" min="4" max="12" step="4" value={settings.duration} onChange={(e) => setSettings(prev => ({ ...prev, duration: Number(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aspect Ratio</label>
              <select value={settings.ratio} onChange={(e) => setSettings(prev => ({ ...prev, ratio: e.target.value as AspectRatio }))} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-200">
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3 (Classic)</option>
                 <option value="3:4">3:4 (Vertical)</option>
              </select>
            </div>
        </Accordion>
      </div>
      
      <div className="mt-auto pt-6 flex-shrink-0">
        <button 
          onClick={onGenerate}
          disabled={isLoading || !topic}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
        >
          {isLoading ? 'Generating...' : '✨ Generate Prompt'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
