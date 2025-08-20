import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  onImageSelect, 
  currentImage = null, 
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Please select a valid image file (${acceptedTypes.map(type => type.split('/')[1]).join(', ')})`);
      return false;
    }

    if (file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onImageSelect(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                onClick={openFileDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Change
              </button>
              <button
                onClick={removeImage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-1"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }
            bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700
          `}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <div className="text-gray-600 dark:text-gray-400">
            <p className="text-lg font-medium mb-2">
              {isDragging ? 'Drop image here' : 'Upload an image'}
            </p>
            <p className="text-sm">
              Drag and drop or click to select
            </p>
            <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
              Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
              <br />
              Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;