import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ApiKeyModal from './components/ApiKeyModal';
import ErrorBanner from './components/ErrorBanner';
import OutputModal from './components/OutputModal';
import { AppSettings, GeneratedPrompt } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { DEFAULT_SETTINGS, TEXT_MODELS, IMAGE_MODELS } from './constants';
import { generateViralPrompt, generateThumbnail } from './services/geminiService';

const App: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>('prompt_builder_settings', DEFAULT_SETTINGS);
  const [textModel, setTextModel] = useLocalStorage<string>('preferred_text_model', TEXT_MODELS[0].id);
  const [imageModel, setImageModel] = useLocalStorage<string>('preferred_image_model', IMAGE_MODELS[0].id);
  
  const [topic, setTopic] = useState<string>('A raccoon DJ wearing neon glasses');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);
  
  // Validate stored model preferences against current model list
  useEffect(() => {
    if (!TEXT_MODELS.some(m => m.id === textModel)) {
      setTextModel(TEXT_MODELS[0].id);
    }
    if (!IMAGE_MODELS.some(m => m.id === imageModel)) {
      setImageModel(IMAGE_MODELS[0].id);
    }
  }, [textModel, imageModel, setTextModel, setImageModel]);

  const handleGenerate = useCallback(async (isRemix = false) => {
    if (!topic && !isRemix) {
      setError('Please enter a topic or idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt(null);
    setThumbnailUrl(null);
    
    try {
      const currentTopic = isRemix && generatedPrompt ? generatedPrompt.prompt : topic;
      
      const promptData = await generateViralPrompt(textModel, settings, currentTopic, imageFile);
      setGeneratedPrompt(promptData);
      
      // Generate thumbnail after prompt is generated
      const thumbUrl = await generateThumbnail(imageModel, promptData.prompt);
      setThumbnailUrl(thumbUrl);

    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [textModel, imageModel, settings, topic, imageFile, generatedPrompt]);
  
  const handleRemix = () => {
    if (generatedPrompt) {
      handleGenerate(true);
    }
  };

  return (
    <div className={`flex h-screen font-sans bg-white dark:bg-gray-900 transition-colors duration-300 ${settings.theme}`}>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      {/* The modals below are no longer used but kept to satisfy no-delete constraint */}
      <ApiKeyModal
        isOpen={false}
        onClose={() => {}}
        onSave={() => {}}
        currentKey=""
      />
      <OutputModal
        isOpen={false}
        onClose={() => {}}
        promptData={null}
        thumbnailUrl={null}
        onRemix={() => {}}
      />
      <div className="flex flex-col lg:flex-row w-full h-full">
        <Sidebar 
          textModel={textModel}
          setTextModel={setTextModel}
          imageModel={imageModel}
          setImageModel={setImageModel}
          settings={settings}
          setSettings={setSettings}
          topic={topic}
          setTopic={setTopic}
          imageFile={imageFile}
          setImageFile={setImageFile}
          onGenerate={() => handleGenerate(false)}
          isLoading={isLoading}
        />
        <MainContent 
          isLoading={isLoading}
          generatedPrompt={generatedPrompt}
          thumbnailUrl={thumbnailUrl}
          onRemix={handleRemix}
        />
      </div>
    </div>
  );
};

export default App;
