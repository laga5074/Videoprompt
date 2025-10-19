import React from 'react';

interface ErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      className="fixed top-5 right-5 z-[100] w-full max-w-sm p-4 bg-red-500 text-white rounded-lg shadow-lg flex items-center justify-between animate-slide-in"
      role="alert"
    >
      <span className="font-medium">{message}</span>
      <button 
        onClick={onDismiss}
        className="ml-4 p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss"
      >
        <XIcon />
      </button>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ErrorBanner;
