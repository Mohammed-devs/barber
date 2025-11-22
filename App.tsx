
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<'auto' | 'moderate' | 'precise'>('moderate');

  const handleGenerate = async () => {
    if (!baseImage || !styleImage) {
      setError('Please provide both a customer photo and a style reference.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateStyledImage(baseImage, styleImage, generationMode);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An AI processing error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !baseImage || !styleImage || isLoading;

  const modes = [
    { id: 'auto', name: 'Auto', description: 'AI blends the style for a natural fit.' },
    { id: 'moderate', name: 'Moderate', description: 'Closely matches the reference style.' },
    { id: 'precise', name: 'Precise', description: 'Attempts an exact replica of the style.' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Barber AI Style Transfer
            </h1>
            <span className="hidden sm:inline-block px-2 py-1 rounded bg-indigo-600/30 border border-indigo-500/50 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                Pro
            </span>
          </div>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Upload a customer photo and a style reference. We'll transfer the hairstyle while keeping the original hair color using the high-fidelity Pro model.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex flex-col gap-6 ring-1 ring-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploader title="1. Customer Photo" onImageUpload={setBaseImage} />
              <ImageUploader title="2. Style Reference" onImageUpload={setStyleImage} />
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-200">3. Select Precision Mode</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setGenerationMode(mode.id as 'auto' | 'moderate' | 'precise')}
                    className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                      generationMode === mode.id
                        ? 'bg-indigo-600 border-indigo-500 ring-2 ring-indigo-400 text-white'
                        : 'bg-gray-700/50 border-gray-600 hover:border-indigo-500 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <p className="font-bold text-md">{mode.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{mode.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isButtonDisabled}
              className={`w-full py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center mt-auto
                ${isButtonDisabled 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing (4K)...
                </>
              ) : (
                'Generate Style'
              )}
            </button>
          </div>

          {/* Result Column */}
          <div className="min-h-[400px] lg:min-h-0">
             <ResultDisplay image={generatedImage} isLoading={isLoading} error={error} />
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Gemini 3 Pro. Built for modern barbershops.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
