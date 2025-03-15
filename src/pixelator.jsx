import React, { useState, useRef } from 'react';

/**
 * ImagePixelator - A React component that allows users to upload an image
 * and apply a pixelation effect with adjustable pixel size.
 * 
 * Features:
 * - Drag and drop or file browser upload
 * - Adjustable pixel size
 * - Download of processed images
 * - Visual feedback during processing
 */
const ImagePixelator = () => {
  // State management
  const [originalImage, setOriginalImage] = useState(null);   // Stores the original uploaded image
  const [pixelatedImage, setPixelatedImage] = useState(null); // Stores the processed image data URL
  const [isDragging, setIsDragging] = useState(false);        // Tracks drag state for UI feedback
  const [pixelSize, setPixelSize] = useState(10);             // Controls the size of pixelation blocks
  const [isProcessing, setIsProcessing] = useState(false);    // Tracks processing state for UI feedback
  
  // Refs
  const canvasRef = useRef(null);      // Reference to the canvas used for image processing
  const fileInputRef = useRef(null);   // Reference to the hidden file input element

  /**
   * Handles file selection from the file input element
   * @param {Event} e - The change event from the file input
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    }
  };

  /**
   * Prevents default behavior during drag over and updates UI state
   * @param {Event} e - The drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Updates UI state when drag leaves the drop zone
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handles file drop events
   * @param {Event} e - The drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        processImage(file);
      }
    }
  };

  /**
   * Processes the uploaded image file and stores it in state
   * @param {File} file - The image file to process
   */
  const processImage = (file) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setPixelatedImage(null); // Reset pixelated image when new image is loaded
      };
      img.src = event.target.result;
    };
    
    reader.readAsDataURL(file);
  };

  /**
   * Applies the pixelation effect to the original image
   * Creates blocks of pixels with the color of the top-left pixel of each block
   */
  const pixelateImage = () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    
    // Using setTimeout to allow the UI to update with the processing state before
    // potentially blocking the main thread with image processing
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the image
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      
      // Draw the original image
      ctx.drawImage(originalImage, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Pixelation algorithm:
      // For each block of pixels (determined by pixelSize):
      // 1. Get the color of the first pixel in the block
      // 2. Fill the entire block with that color
      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          // Get the color of the first pixel in the block
          const pixelIndex = (y * canvas.width + x) * 4;
          const red = data[pixelIndex];
          const green = data[pixelIndex + 1];
          const blue = data[pixelIndex + 2];
          
          // Fill the block with this color
          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
      
      // Convert the canvas to a data URL and update state
      setPixelatedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    }, 100);
  };

  /**
   * Creates a download link for the pixelated image
   */
  const downloadImage = () => {
    if (!pixelatedImage) return;
    
    const link = document.createElement('a');
    link.href = pixelatedImage;
    link.download = 'pixelated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Updates the pixel size state based on slider input
   * @param {Event} e - The change event from the range input
   */
  const handlePixelSizeChange = (e) => {
    setPixelSize(parseInt(e.target.value, 10));
  };

  /**
   * Triggers the hidden file input when the drop zone is clicked
   */
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Image Pixelator</h1>
      
      {/* File upload area */}
      <div 
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer mb-6 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${originalImage ? 'border-green-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        
        {originalImage ? (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 relative mb-2">
              <img 
                src={originalImage.src} 
                alt="Original" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-green-600 font-medium">Image loaded successfully</p>
            <p className="text-sm text-gray-500">Click or drop to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg 
              className="w-12 h-12 text-gray-400 mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-700 font-medium">Drop an image here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">Supports: JPG, PNG, GIF, etc.</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="w-full mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pixel Size: {pixelSize}px
            </label>
            <input
              type="range"
              min="2"
              max="50"
              value={pixelSize}
              onChange={handlePixelSizeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="w-full sm:w-1/3 flex justify-end">
            <button
              onClick={pixelateImage}
              disabled={!originalImage || isProcessing}
              className={`px-4 py-2 rounded-lg font-medium ${
                !originalImage || isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Pixelate Image'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Result */}
      <div className="w-full">
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {pixelatedImage && (
          <div className="flex flex-col items-center">
            <div className="w-full max-h-80 overflow-auto border rounded-lg mb-4">
              <img 
                src={pixelatedImage} 
                alt="Pixelated" 
                className="w-full object-contain"
              />
            </div>
            
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Download Pixelated Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePixelator;