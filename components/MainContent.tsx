import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';

interface MainContentProps {
  isLoading: boolean;
  generatedPrompt: GeneratedPrompt | null;
  thumbnailUrl: string | null;
  onRemix: () => void;
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-t-transparent border-primary-500 rounded-full animate-spin"></div>
    </div>
);

const Placeholder = () => (
    <div className="text-center text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Your Viral Video Awaits</h2>
        <p className="mt-2">Use the sidebar to configure your settings and generate your first prompt.</p>
    </div>
);

const GeneratedResult: React.FC<{promptData: GeneratedPrompt, thumbnailUrl: string | null, onRemix: () => void}> = ({ promptData, thumbnailUrl, onRemix }) => {
    const [copied, setCopied] = useState('');

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-w-7xl mx-auto">
                {/* Left Side: Thumbnail and actions */}
                <div className="space-y-4 flex flex-col">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                        {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt="Generated Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 p-4 text-center animate-pulse">
                                <div className="text-4xl mb-2">🖼️</div>
                                Thumbnail is generating...
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleCopy(promptData.prompt, 'sora')}
                            className="flex-1 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
                        >
                            {copied === 'sora' ? 'Copied!' : 'Copy for Sora'}
                        </button>
                        <button
                            onClick={() => handleCopy(promptData.prompt, 'veo')}
                            className="flex-1 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
                        >
                            {copied === 'veo' ? 'Copied!' : 'Copy for Veo'}
                        </button>
                    </div>
                     <button
                        onClick={onRemix}
                        className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-transform transform hover:scale-105"
                    >
                        Remix This Prompt
                    </button>
                </div>

                {/* Right Side: Prompt details */}
                <div className="space-y-4 text-gray-800 dark:text-gray-200 flex flex-col overflow-hidden">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Prompt</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-y-auto flex-grow">
                        <p className="text-base leading-relaxed">{promptData.prompt}</p>
                    </div>
                    
                    <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Director's JSON Brief</h3>
                    <div className="relative p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto max-h-64">
                        <button
                            onClick={() => handleCopy(JSON.stringify(promptData, null, 2), 'json')}
                            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                        >
                            {copied === 'json' ? 'Copied!' : 'Copy'}
                        </button>
                        <pre><code>{JSON.stringify(promptData, null, 2)}</code></pre>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MainContent: React.FC<MainContentProps> = ({ isLoading, generatedPrompt, thumbnailUrl, onRemix }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (generatedPrompt) {
        return <GeneratedResult promptData={generatedPrompt} thumbnailUrl={thumbnailUrl} onRemix={onRemix} />
    }
    return <Placeholder />;
  };
  
  return (
    <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="h-full flex flex-col justify-center items-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;
