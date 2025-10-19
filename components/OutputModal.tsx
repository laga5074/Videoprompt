import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';

interface OutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemix: () => void;
  promptData: GeneratedPrompt | null;
  thumbnailUrl: string | null;
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const OutputModal: React.FC<OutputModalProps> = ({ isOpen, onClose, onRemix, promptData, thumbnailUrl }) => {
  const [copied, setCopied] = useState('');

  if (!isOpen || !promptData) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col transform transition-all duration-300 scale-95 animate-fade-in">
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generation Complete</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <XIcon />
          </button>
        </header>

        <div className="p-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Thumbnail and actions */}
            <div className="space-y-4">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Generated Thumbnail" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-400 dark:text-gray-500 p-4 text-center">
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
            </div>

            {/* Right Side: Prompt details */}
            <div className="space-y-4 text-gray-800 dark:text-gray-200">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Generated Prompt</h3>
                <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-base leading-relaxed">{promptData.prompt}</p>
                </div>
                
                <div className="pt-4">
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
        
        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-4 flex-shrink-0">
            <button
              onClick={onRemix}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-transform transform hover:scale-105"
            >
              Remix
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
              Close
            </button>
        </footer>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OutputModal;