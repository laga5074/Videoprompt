import React from 'react';

interface MainContentProps {
  isLoading: boolean;
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

const MainContent: React.FC<MainContentProps> = ({ isLoading }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    return <Placeholder />;
  };
  
  return (
    <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;