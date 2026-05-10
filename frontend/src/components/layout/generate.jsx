import React, { useState } from 'react';
import { ImagePlus, Loader2, Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from './Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const Generate = () => {
  const { isAuthenticated, userData } = useAuth();
  const { showToast } = useToast();
  
  // Load from sessionStorage on mount
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(() => {
    return sessionStorage.getItem('lastPreviewUrl') || null;
  });
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState(() => {
    const savedCaptions = sessionStorage.getItem('lastCaptions');
    return savedCaptions ? JSON.parse(savedCaptions) : [];
  });
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedIndex, setSavedIndex] = useState(null);
  const [savingIndex, setSavingIndex] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      sessionStorage.setItem('lastPreviewUrl', url);
      setCaptions([]);
      sessionStorage.removeItem('lastCaptions');
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
    const userId = isAuthenticated && userData ? userData.u_Id : null;
    formData.append('file', selectedFile);
    formData.append('userId', userId); 

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
      let captionsArray = [];
      
      if (Array.isArray(data.message)) {
        captionsArray = data.message;
      } else if (typeof data.message === 'string') {
        try {
          const parsed = JSON.parse(data.message);
          captionsArray = Array.isArray(parsed) ? parsed : [data.message];
        } catch {
          captionsArray = [data.message];
        }
      }
      
      setCaptions(captionsArray);
      // Save to sessionStorage
      sessionStorage.setItem('lastCaptions', JSON.stringify(captionsArray));
      
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

  const saveCaption = async (caption, index) => {
    if (!isAuthenticated) {
      const confirmRedirect = window.confirm('Please sign in to save captions. Would you like to sign in now?');
      if (confirmRedirect) {
        sessionStorage.setItem('pendingSaveCaption', caption);
        window.location.href = '/auth';
      }
      return;
    }

    setSavingIndex(index);
    try {
      const userId = userData.u_Id || userData.uid;
      
      let base64Data = null;
      if (selectedFile) {
        base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      const payload = {
        userId: userId,
        caption: caption,
        image_url: previewUrl,
        image_data: base64Data
      };

      const response = await fetch(`${API_URL}/api/save-caption`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save caption');
      }

      const data = await response.json();
      if (data.success) {
        setSavedIndex(index);
        showToast('Caption saved successfully!', 'success');
        setTimeout(() => setSavedIndex(null), 2000);
      }
    } catch (err) {
      console.error('Error saving caption:', err);
      showToast(err.message, 'error');
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0516] flex flex-col font-sans selection:bg-pink-500/30">
      <div className="flex-grow flex items-center justify-center p-4 pt-28 pb-20 relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Your Craft,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Powered by AI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
              Upload a photo of your art to get 5 ready-to-post social media captions perfectly tailored to your craft.
            </p>
          </motion.div>

          <div className="mt-12 flex flex-col lg:flex-row gap-8 text-left lg:h-[500px]">
            {/* Left Panel: Upload Box and Generate Button */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-5/12 flex flex-col h-full"
            >
              <label 
                htmlFor="image-upload" 
                className="flex flex-col items-center justify-center w-full flex-1 border-2 border-purple-500/30 border-dashed rounded-2xl cursor-pointer bg-[#130826]/50 backdrop-blur-md p-4 hover:bg-purple-900/20 hover:border-purple-400/50 transition-all group overflow-hidden relative shadow-lg min-h-[250px]"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Uploaded preview" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-purple-300 transition-colors">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ImagePlus size={32} className="text-purple-400" />
                    </div>
                    <p className="mb-2 text-sm text-center">
                      <span className="font-semibold text-white">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
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
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm flex-shrink-0">
                  {error}
                </div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={!selectedFile || loading}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] w-full flex-shrink-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-3" size={24} /> Generating Magic...
                  </span>
                ) : (
                  'Generate Captions ✨'
                )}
              </button>
            </motion.div>

            {/* Right Panel: Captions Display */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full lg:w-7/12 flex flex-col h-full"
            >
              <div className="w-full h-full bg-[#130826]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col overflow-hidden">
                {captions.length > 0 ? (
                  <div className="flex flex-col h-full min-h-0">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center flex-shrink-0">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">✨ Ready-to-Post</span>
                    </h3>
                    <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar flex-1 min-h-0 pb-2">
                      {captions.map((caption, index) => (
                        <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-purple-500/30 transition-all group lg:min-h-[100px]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-gray-300 text-sm leading-relaxed inline">{caption}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            {/* Save Button */}
                            {isAuthenticated && (
                              <button
                                onClick={() => saveCaption(caption, index)}
                                disabled={savingIndex === index}
                                className="p-2 text-gray-400 hover:text-pink-400 transition-colors rounded-lg hover:bg-white/5"
                                title="Save caption"
                              >
                                {savingIndex === index ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : savedIndex === index ? (
                                  <BookmarkCheck size={18} className="text-pink-400" />
                                ) : (
                                  <Bookmark size={18} />
                                )}
                              </button>
                            )}
                            {/* Copy Button */}
                            <button
                              onClick={() => copyToClipboard(caption, index)}
                              className="p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
                              title="Copy caption"
                            >
                              {copiedIndex === index ? (
                                <Check size={18} className="text-purple-400" />
                              ) : (
                                <Copy size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    </div>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center h-full flex-grow">
                    <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
                    <p className="text-purple-300 font-medium">Analyzing your image...</p>
                    <p className="text-gray-500 text-sm mt-2">Crafting the perfect story for your art</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full flex-grow text-center px-4">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                      <ImagePlus size={32} className="text-gray-600" />
                    </div>
                    <p className="text-gray-400 mb-2">
                      Upload an image and click "Generate Captions"
                    </p>
                    <p className="text-gray-500 text-sm">
                      Get 5 unique, heartwarming social media stories
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Generate;