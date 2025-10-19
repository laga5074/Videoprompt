import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ApiKeyModal from './components/ApiKeyModal';
import ErrorBanner from './components/ErrorBanner';
import OutputModal from './components/OutputModal';
import { AppSettings, GeneratedPrompt, AspectRatio } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { DEFAULT_SETTINGS, TEXT_MODELS, IMAGE_MODELS } from './constants';
import { generateViralPrompt, generateThumbnail } from './services/openRouterService';

const App: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>('prompt_builder_settings', DEFAULT_SETTINGS);
  const [textModel, setTextModel] = useLocalStorage<string>('preferred_text_model', TEXT_MODELS[0].id);
  const [imageModel, setImageModel] = useLocalStorage<string>('preferred_image_model', IMAGE_MODELS[0].id);
  const [openrouterApiKey, setOpenrouterApiKey] = useLocalStorage<string>('openrouter_api_key', '');
  
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
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
  
  // Proactively open modal if a paid model is selected without a key
  useEffect(() => {
    const isPaidTextModel = TEXT_MODELS.find(m => m.id === textModel)?.type === 'paid';
    const isPaidImageModel = IMAGE_MODELS.find(m => m.id === imageModel)?.type === 'paid';

    if ((isPaidTextModel || isPaidImageModel) && !openrouterApiKey) {
      setIsApiKeyModalOpen(true);
      setError('An API key is required for the selected paid model.');
    }
  }, [textModel, imageModel, openrouterApiKey]);

  const handleSaveApiKey = (key: string) => {
    setOpenrouterApiKey(key);
    setIsApiKeyModalOpen(false);
    setError(null); // Clear any key-related errors
  };

  const handleGenerate = useCallback(async (isRemix = false) => {
    const isPaidTextModel = TEXT_MODELS.find(m => m.id === textModel)?.type === 'paid';
    const isPaidImageModel = IMAGE_MODELS.find(m => m.id === imageModel)?.type === 'paid';
    const usesPaidModel = isPaidTextModel || isPaidImageModel;

    if (usesPaidModel && !openrouterApiKey) {
      setError('Please set your OpenRouter API key to use paid models.');
      setIsApiKeyModalOpen(true);
      return;
    }
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
      
      const promptData = await generateViralPrompt(openrouterApiKey, textModel, settings, currentTopic, imageFile);
      setGeneratedPrompt(promptData);
      setIsOutputModalOpen(true); // Open modal on success
      
      // Generate thumbnail after prompt is generated
      const thumbUrl = await generateThumbnail(openrouterApiKey, imageModel, promptData.prompt, settings.ratio as AspectRatio);
      setThumbnailUrl(thumbUrl);

    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
      // If error is about API key, re-open the modal
      if (errorMessage.toLowerCase().includes('api key')) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [openrouterApiKey, textModel, imageModel, settings, topic, imageFile, generatedPrompt]);
  
  const handleRemix = () => {
    if (generatedPrompt) {
      setIsOutputModalOpen(false);
      // Give modal time to close before starting new generation
      setTimeout(() => handleGenerate(true), 300);
    }
  };

  return (
    <div className={`flex h-screen font-sans bg-white dark:bg-gray-900 transition-colors duration-300 ${settings.theme}`}>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={openrouterApiKey}
      />
      <OutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        promptData={generatedPrompt}
        thumbnailUrl={thumbnailUrl}
        onRemix={handleRemix}
      />
      <div className="flex flex-col lg:flex-row w-full h-full">
        <Sidebar 
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          openrouterApiKey={openrouterApiKey}
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
        />
      </div>
    </div>
  );
};

export default App;
