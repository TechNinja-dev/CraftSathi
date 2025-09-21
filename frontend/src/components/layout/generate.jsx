import React, { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import Footer from './Footer.jsx';

const Generate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResponseMessage('');
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setResponseMessage('');
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response from backend.');
      }

      const data = await response.json();
      setResponseMessage(data.message);
      
    } catch (err) {
      console.error('Error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-display text-brand-text leading-tight">
          Your Craft,
          <br />
          <span className="text-brand-primary">Powered by AI</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Upload a photo of your art to get started.
        </p>

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Upload Box and Generate Button */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white/50 backdrop-blur-sm p-4 hover:bg-white/70 transition-colors relative overflow-hidden"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Uploaded preview" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                  <ImagePlus size={48} className="mb-2" />
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs">PNG, JPG, JPEG up to 10MB</p>
                </div>
              )}
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg" 
              />
            </label>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-100 text-red-700 font-medium">
                {error}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={!selectedFile || loading}
              className="mt-4 px-8 py-4 bg-brand-primary text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" /> Processing...
                </span>
              ) : (
                'Generate Description'
              )}
            </button>
          </div>

          {/* Right Panel: Backend Response */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="w-full h-80 border-2 border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm p-4 overflow-auto text-left text-gray-700">
              {responseMessage ? (
                <p>{responseMessage}</p>
              ) : (
                <p className="text-gray-400">Your generated product description will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
    
  );
};

export default Generate;