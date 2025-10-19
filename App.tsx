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
import { generateViralPromptWithOpenRouter, generateThumbnailWithOpenRouter } from './services/openRouterService';

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

  // Open modal on mount if an OpenRouter model is selected and key is missing
  useEffect(() => {
    const selectedModel = TEXT_MODELS.find(m => m.id === textModel);
    if (selectedModel?.provider === 'openrouter' && !openrouterApiKey) {
      setIsApiKeyModalOpen(true);
    }
  }, []); // Intentionally run only on mount

  const handleGenerate = useCallback(async (isRemix = false) => {
    const selectedTextModel = TEXT_MODELS.find(m => m.id === textModel)!;
    const selectedImageModel = IMAGE_MODELS.find(m => m.id === imageModel)!;

    if ((selectedTextModel.provider === 'openrouter' || selectedImageModel.provider === 'openrouter') && !openrouterApiKey) {
      setError('OpenRouter API Key is required for the selected models.');
      setIsApiKeyModalOpen(true);
      return;
    }

    if (!topic && !isRemix && !generatedPrompt) {
      setError('Please enter a topic or idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt(null);
    setThumbnailUrl(null);
    
    try {
      const currentTopic = isRemix && generatedPrompt ? generatedPrompt.prompt : topic;
      let promptData: GeneratedPrompt;
      let thumbUrl: string;

      // Step 1: Generate the prompt
      if (selectedTextModel.provider === 'google') {
        promptData = await generateViralPrompt(textModel, settings, currentTopic, imageFile);
      } else {
        promptData = await generateViralPromptWithOpenRouter(openrouterApiKey, textModel, settings, currentTopic, imageFile);
      }
      setGeneratedPrompt(promptData);
      
      // Step 2: Generate the thumbnail using the generated prompt
      if (selectedImageModel.provider === 'google') {
        thumbUrl = await generateThumbnail(imageModel, promptData.prompt);
      } else {
        thumbUrl = await generateThumbnailWithOpenRouter(openrouterApiKey, imageModel, promptData.prompt);
      }
      setThumbnailUrl(thumbUrl);
      setIsOutputModalOpen(true);

    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [textModel, imageModel, settings, topic, imageFile, generatedPrompt, openrouterApiKey]);
  
  const handleRemix = () => {
    if (generatedPrompt) {
      handleGenerate(true);
    }
  };

  const handleApiKeySave = (key: string) => {
    setOpenrouterApiKey(key);
    setIsApiKeyModalOpen(false);
  };
  
  const handleModalRemix = () => {
    setIsOutputModalOpen(false);
    handleRemix();
  };

  return (
    <div className={`flex h-screen font-sans bg-white dark:bg-gray-900 transition-colors duration-300 ${settings.theme}`}>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleApiKeySave}
        currentKey={openrouterApiKey}
      />
      <OutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        promptData={generatedPrompt}
        thumbnailUrl={thumbnailUrl}
        onRemix={handleModalRemix}
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