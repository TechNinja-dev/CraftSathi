import React, { useState } from 'react';
import { Loader2, Download, X, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Photo = () => {
  const { isAuthenticated, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem('lastPrompt') || '';
  });

  const [generatedImageUrl, setGeneratedImageUrl] = useState(() => {
    return localStorage.getItem('lastGeneratedImage') || '';
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImageUrl('');

    const userId = isAuthenticated && userData ? userData.u_Id : null;
    
    const payload = {
      prompt: prompt,
      userId: userId,
    };

    try {
      const response = await fetch(`${API_URL}/api/generate-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate image.');
      }

      const data = await response.json();
      if (data.image_url){
        setGeneratedImageUrl(data.image_url);
        localStorage.setItem('lastGeneratedImage', data.image_url);
        localStorage.setItem('lastPrompt', prompt);
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Failed to generate image");
      }
      
    } catch (err) {
      console.error('Error generating image:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download image function
  const handleDownload = async () => {
    if (!generatedImageUrl) return;
    
    try {
      if (generatedImageUrl.startsWith('data:image')) {
        const link = document.createElement('a');
        link.download = `craft-image-${Date.now()}.png`;
        link.href = generatedImageUrl;
        link.click();
      } else {
        const response = await fetch(generatedImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `craft-image-${Date.now()}.png`;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-display text-brand-text leading-tight">
          Your Imagination,
          <br />
          <span className="text-brand-primary">Made Visual</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Describe the image you want to create and watch the magic happen.
        </p>
        
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Prompt Input */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                localStorage.setItem('lastPrompt', e.target.value);
              }}
              placeholder="A vibrant, watercolor painting of a bustling craft market..."
              rows="10"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-brand-primary focus:border-brand-primary resize-none"
            />
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-100 text-red-700 font-medium">
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="mt-4 px-8 py-4 bg-brand-primary text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" /> Generating...
                </span>
              ) : (
                'Generate Image'
              )}
            </button>
          </div>

          {/* Right Panel: Image Display with Green Download Button on the right */}
          <div className="w-full lg:w-1/2 flex items-start gap-4">
            {/* Image Container */}
            <div 
              className="flex-1 h-96 border-2 border-gray-300 border-dashed rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm flex items-center justify-center group cursor-pointer"
              onClick={() => generatedImageUrl && setShowModal(true)}
            >
              {loading && !generatedImageUrl ? (
                <Loader2 className="animate-spin text-brand-primary" size={48} />
              ) : generatedImageUrl ? (
                <>
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated Art" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <Maximize2 size={32} className="text-white" />
                  </div>
                </>
              ) : (
                <span className="text-gray-400">Your generated image will appear here.</span>
              )}
            </div>

            {/* Green Round Download Button - Positioned to the right of image container */}
            {generatedImageUrl && (
              <button
                onClick={handleDownload}
                className="w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors flex-shrink-0"
                title="Download image"
              >
                <Download size={22} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal Popup */}
      {showModal && generatedImageUrl && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            
            <img 
              src={generatedImageUrl} 
              alt="Full size view" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <Download size={22} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photo;