import React from 'react';

interface ResultDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4 text-center">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
    <p className="text-lg font-semibold text-gray-300">Styling in progress...</p>
    <p className="text-sm text-gray-500 max-w-xs">This can take a moment. The AI is working its magic on the hairstyle!</p>
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, isLoading, error }) => {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'barber-ai-styled-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-gray-800/50 border-2 border-gray-700/50 rounded-2xl flex items-center justify-center p-4 relative">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-400 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 font-semibold">An error occurred</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : image ? (
        <div className="relative w-full h-full">
          <img src={image} alt="Generated result" className="w-full h-full max-h-[70vh] object-contain rounded-lg" />
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="mt-2 font-semibold">Your styled image will appear here</p>
          <p className="text-sm mt-1 max-w-xs mx-auto">
            AI results can vary. For best results, use clear, well-lit photos. You can always try generating again!
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
