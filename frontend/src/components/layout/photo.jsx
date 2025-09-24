import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../App.jsx';

const Photo = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImageUrl('');

    // Prepare the payload, including the userId
    const payload = {
      prompt: prompt,
      userId: user ? user.uid : null,
    };
    console.log('Sending payload:', payload);

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
      // The image is returned as a data URL, so we set it directly
      setGeneratedImageUrl(data.image_url);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
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
              onChange={(e) => setPrompt(e.target.value)}
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

          {/* Right Panel: Image Display */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full h-96 border-2 border-gray-300 border-dashed rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm flex items-center justify-center">
              {loading && !generatedImageUrl ? (
                <Loader2 className="animate-spin text-brand-primary" size={48} />
              ) : generatedImageUrl ? (
                <img src={generatedImageUrl} alt="Generated Art" className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-400">Your generated image will appear here.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
