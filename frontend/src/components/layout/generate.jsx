import React, { useState } from 'react';
import { ImagePlus, Loader2, Copy, Check } from 'lucide-react';
import Footer from './Footer.jsx';

const Generate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCaptions([]);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setCaptions([]);
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
      if (Array.isArray(data.message)) {
        setCaptions(data.message);
      } else if (typeof data.message === 'string') {
        try {
          const parsed = JSON.parse(data.message);
          setCaptions(Array.isArray(parsed) ? parsed : [data.message]);
        } catch {
          setCaptions([data.message]);
        }
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-display text-brand-text leading-tight">
            Your Craft,
            <br />
            <span className="text-brand-primary">Powered by AI</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload a photo of your art to get 5 ready-to-post social media captions.
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
                    <Loader2 className="animate-spin mr-2" /> Generating Captions...
                  </span>
                ) : (
                  'Generate Captions ✨'
                )}
              </button>
            </div>

            {/* Right Panel: Captions Display */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="w-full min-h-80 bg-white/50 backdrop-blur-sm rounded-xl p-6 text-left">
                {captions.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-brand-text mb-4">✨ Ready-to-Post Captions</h3>
                    {captions.map((caption, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="inline-block w-6 h-6 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold text-center leading-6 mr-2">
                              {index + 1}
                            </span>
                            <p className="text-gray-700 inline">{caption}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(caption, index)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-brand-primary transition-colors"
                            title="Copy caption"
                          >
                            {copiedIndex === index ? (
                              <Check size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center h-80">
                    <Loader2 className="animate-spin text-brand-primary mb-4" size={32} />
                    <p className="text-gray-400">Analyzing your image and generating captions...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80">
                    <p className="text-gray-400 text-center">
                      Upload an image and click "Generate Captions"<br />
                      to get 5 unique social media captions ✨
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Place it here, outside the flex-grow div but inside the main flex column */}
      <Footer />
    </div>
  );
};

export default Generate;