import React from 'react';
import { SparklesIcon } from './Icons';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-6 px-4 md:px-8 shadow-sm relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-holiday-red via-holiday-green to-holiday-gold"></div>
      
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-holiday-red text-white p-2 rounded-lg shadow-md">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-gray-800 font-bold tracking-wide">
              Festive<span className="text-holiday-red">Lens</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wider uppercase">
              AI Christmas Hat Creator
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-holiday-snow px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-holiday-green animate-pulse"></span>
          Ready to jingle
        </div>
      </div>
    </header>
  );
};

export default Header;