import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    // Limit size to ~4MB to be safe for base64 browser handling
    if (file.size > 4 * 1024 * 1024) {
      alert('File size is too large. Please use an image under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract just the base64 part, removing "data:image/xyz;base64,"
      const base64Data = base64String.split(',')[1];
      onImageSelected(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="group w-full border-2 border-dashed border-gray-300 hover:border-holiday-red hover:bg-red-50 transition-all duration-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="mb-4 text-gray-400 group-hover:text-holiday-red transition-colors duration-300">
            <UploadIcon />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Upload a Photo
        </h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          Click to browse your device. We support PNG and JPG.
        </p>
      </button>
    </div>
  );
};

export default ImageUploader;