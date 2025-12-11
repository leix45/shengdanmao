import React, { useState } from 'react';
import { DownloadIcon, RefreshIcon, MagicWandIcon } from './Icons';
import { HatColor } from '../types';

interface ResultViewerProps {
  originalImage: string | null;
  generatedImage: string | null;
  mimeType: string;
  onReset: () => void;
  onGenerate: () => void;
  status: string;
  selectedColor: HatColor;
  onColorChange: (color: HatColor) => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ 
  originalImage, 
  generatedImage, 
  mimeType,
  onReset, 
  onGenerate,
  status,
  selectedColor,
  onColorChange
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'generated'>('generated');
  const isProcessing = status === 'PROCESSING';

  if (!originalImage) return null;

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${generatedImage}`;
    link.download = `festive-lens-${selectedColor.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Color map for UI display
  const colorMap: Record<HatColor, string> = {
    Red: 'bg-red-600',
    Green: 'bg-green-600',
    Blue: 'bg-blue-600',
    Gold: 'bg-yellow-500',
    Pink: 'bg-pink-500',
    Silver: 'bg-slate-300',
    Black: 'bg-gray-900',
  };

  const colors: HatColor[] = ['Red', 'Green', 'Gold', 'Blue', 'Pink', 'Silver', 'Black'];

  // Construct src strings
  const originalSrc = `data:${mimeType};base64,${originalImage}`;
  const generatedSrc = generatedImage ? `data:image/png;base64,${generatedImage}` : null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 p-4 bg-gray-50 border-b border-gray-100">
        
        {/* Top Row: View Toggles & Main Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm order-2 md:order-1">
             <button
               onClick={() => setActiveTab('original')}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'original' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
             >
               Original
             </button>
             <button
               onClick={() => setActiveTab('generated')}
               // Only disable if we haven't generated anything yet and aren't processing
               disabled={!generatedImage && !isProcessing}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'generated' ? 'bg-holiday-red text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 disabled:opacity-50'}`}
             >
               Result
             </button>
          </div>

          <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto justify-end">
             <button
                onClick={onReset}
                disabled={isProcessing}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                title="Upload New Photo"
            >
                <RefreshIcon />
            </button>
          </div>
        </div>

        {/* Bottom Row: Color Selection & Generate Action */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-200">
             <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Hat Color:</span>
                <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => onColorChange(c)}
                            disabled={isProcessing}
                            className={`w-8 h-8 rounded-full shadow-sm border-2 transition-all transform hover:scale-110 focus:outline-none ${colorMap[c]} ${selectedColor === c ? 'border-gray-800 ring-2 ring-gray-200 scale-110' : 'border-transparent opacity-80 hover:opacity-100'}`}
                            title={c}
                        />
                    ))}
                </div>
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                    onClick={onGenerate}
                    disabled={isProcessing}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-holiday-red to-red-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                    <MagicWandIcon className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>{generatedImage ? 'Regenerate Hat' : 'Generate Hat'}</span>
                </button>

                {generatedImage && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-5 py-2.5 bg-holiday-green text-white rounded-full font-semibold shadow-md hover:bg-green-800 hover:shadow-lg transition-all"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden md:inline">Download</span>
                    </button>
                )}
             </div>
        </div>

      </div>

      {/* Image Area */}
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-holiday-snow flex items-center justify-center p-4 md:p-8">
        
        {/* Loading Overlay */}
        {isProcessing && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-holiday-red border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🎄</span>
                </div>
             </div>
             <p className="mt-4 text-holiday-red font-semibold animate-pulse">Designing {selectedColor} hat...</p>
             <p className="text-xs text-gray-500 mt-1">This uses Generative AI and may take a few seconds.</p>
           </div>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
            {activeTab === 'original' && (
                <img 
                    src={originalSrc} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                />
            )}

            {activeTab === 'generated' && (
                generatedImage ? (
                    <img 
                        src={generatedSrc!} 
                        alt="Generated Holiday Version" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg ring-4 ring-white"
                    />
                ) : (
                    <div className="text-center text-gray-400">
                        {isProcessing ? '' : 'Select a color and click "Generate Hat" to start magic!'}
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default ResultViewer;