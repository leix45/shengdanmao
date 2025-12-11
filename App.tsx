import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultViewer from './components/ResultViewer';
import { AppStatus, ProcessingError, HatColor } from './types';
import { addChristmasHatToImage } from './services/geminiService';
import { MagicWandIcon } from './components/Icons';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [hatColor, setHatColor] = useState<HatColor>('Red');

  const handleImageSelected = useCallback((base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setGeneratedImage(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage || !mimeType) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const resultBase64 = await addChristmasHatToImage(originalImage, mimeType, hatColor);
      setGeneratedImage(resultBase64);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(AppStatus.ERROR);
      setError({
        message: 'Oops! The elves dropped their tools.',
        details: err.message || 'Failed to generate image. Please try again.'
      });
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setMimeType('');
    setStatus(AppStatus.IDLE);
    setError(null);
    setHatColor('Red');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        {/* Intro Section - Only show when no image selected */}
        {!originalImage && (
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-holiday-red text-sm font-semibold mb-4 border border-red-100">
               <span className="text-lg">🎅</span> Season's Greetings
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
              Add a Christmas Hat to <span className="text-holiday-green">Anyone</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upload a photo and let our AI seamlessly blend a festive hat onto the subject, matching the original style and lighting perfectly.
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-lg mb-6 p-4 bg-red-50 border-l-4 border-holiday-red rounded-r-lg shadow-sm">
            <h3 className="text-holiday-red font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error.message}
            </h3>
            <p className="text-sm text-red-700 mt-1">{error.details}</p>
          </div>
        )}

        {/* Main Interaction Area */}
        <div className="w-full max-w-4xl transition-all duration-500 ease-in-out">
          {!originalImage ? (
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              isLoading={status === AppStatus.PROCESSING} 
            />
          ) : (
            <ResultViewer 
              originalImage={originalImage}
              generatedImage={generatedImage}
              mimeType={mimeType}
              onReset={handleReset}
              onGenerate={handleGenerate}
              status={status}
              selectedColor={hatColor}
              onColorChange={setHatColor}
            />
          )}
        </div>

        {/* Features Grid */}
        {!originalImage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                        <MagicWandIcon />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Style Matching</h3>
                    <p className="text-gray-500 text-sm">Whether it's a cartoon, oil painting, or photo, the hat will match the art style.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Smart Detection</h3>
                    <p className="text-gray-500 text-sm">Automatically identifies people and characters to place hats correctly.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Instant Download</h3>
                    <p className="text-gray-500 text-sm">Save your festive creations instantly and share them with friends.</p>
                </div>
            </div>
        )}

      </main>

      <footer className="bg-white py-6 border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} FestiveLens. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;