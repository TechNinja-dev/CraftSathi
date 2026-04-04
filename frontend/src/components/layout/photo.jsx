import React, { useState } from 'react';
import { Loader2, Download, X, Maximize2, Image as ImageIcon, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer.jsx';

const Photo = () => {
  const { isAuthenticated, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const [prompt, setPrompt] = useState(() => {
  return sessionStorage.getItem('lastPrompt') || '';
});

const [generatedImageUrl, setGeneratedImageUrl] = useState(() => {
  return sessionStorage.getItem('lastGeneratedImage') || '';
});

  const [activeTab, setActiveTab] = useState('photo');

  const [videoPrompt, setVideoPrompt] = useState(() => {
    return sessionStorage.getItem('lastVideoPrompt') || '';
  });

  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(() => {
    return sessionStorage.getItem('lastGeneratedVideo') || '';
  });

  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

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
          sessionStorage.setItem('lastGeneratedImage', data.image_url); // Add this
          localStorage.setItem('lastPrompt', prompt);
          sessionStorage.setItem('lastPrompt', prompt); 
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

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      setVideoError('Please enter a description for the video advertisement.');
      return;
    }

    setLoadingVideo(true);
    setVideoError('');
    setGeneratedVideoUrl('');

    const userId = isAuthenticated && userData ? userData.u_Id : null;
    
    const payload = {
      prompt: videoPrompt,
      userId: userId,
    };

    try {
      const response = await fetch(`${API_URL}/api/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate video.');
      }

      const data = await response.json();
      if (data.video_url){
        setGeneratedVideoUrl(data.video_url);
        localStorage.setItem('lastGeneratedVideo', data.video_url);
        sessionStorage.setItem('lastGeneratedVideo', data.video_url);
        localStorage.setItem('lastVideoPrompt', videoPrompt);
        sessionStorage.setItem('lastVideoPrompt', videoPrompt); 
      } else if (data.message) {
        setVideoError(data.message);
      } else {
        setVideoError("Failed to generate video");
      }
      
    } catch (err) {
      console.error('Error generating video:', err);
      setVideoError(`Error: ${err.message}`);
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!generatedVideoUrl) return;
    
    try {
      if (generatedVideoUrl.startsWith('data:video')) {
        const link = document.createElement('a');
        link.download = `craft-video-${Date.now()}.mp4`;
        link.href = generatedVideoUrl;
        link.click();
      } else {
        const response = await fetch(generatedVideoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `craft-video-${Date.now()}.mp4`;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error downloading video:', err);
      setVideoError('Failed to download video');
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
              Your Imagination,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Made Visual</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
              Choose your format and bring your ideas to life instantly.
            </p>
          </motion.div>
          
          {/* Tabs */}
          <div className="flex justify-center mt-12 mb-4 relative z-20">
            <div className="bg-[#130826]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-1.5 flex gap-2 shadow-xl">
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'photo'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ImageIcon size={20} />
                <span>Posts</span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video size={20} />
                <span>Video Ads</span>
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'photo' && (
              <motion.div 
                key="photo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mt-4 flex flex-col lg:flex-row gap-8 text-left lg:h-[500px]"
              >
                {/* Left Panel: Prompt Input */}
                <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-5/12 flex flex-col h-full"
            >
              <div className="relative flex-1 flex flex-col w-full h-full bg-[#130826]/50 backdrop-blur-md border border-purple-500/30 rounded-2xl p-1 shadow-lg overflow-hidden group min-h-[250px]">
                <div className="absolute top-5 left-6 text-purple-400/80 pointer-events-none transition-colors group-focus-within:text-pink-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Prompt Interface</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    localStorage.setItem('lastPrompt', e.target.value);
                  }}
                  placeholder="A vibrant, watercolor painting of a bustling craft market..."
                  className="w-full h-full flex-1 p-6 pt-12 text-white bg-transparent border-none rounded-xl focus:ring-0 focus:outline-none resize-none custom-scrollbar placeholder-gray-600/70 text-lg leading-relaxed"
                />
                
                {/* Visual decorative element inside textarea */}
                <div className="absolute bottom-4 right-4 text-purple-500/20 group-focus-within:text-purple-400/40 transition-colors pointer-events-none origin-bottom-right group-focus-within:scale-110">
                  <ImageIcon size={48} strokeWidth={1.5} />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm flex-shrink-0">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] w-full flex-shrink-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-3" size={24} /> Generating Magic...
                  </span>
                ) : (
                  'Generate Image ✨'
                )}
              </button>
            </motion.div>

            {/* Right Panel: Image Display */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full lg:w-7/12 flex items-start flex-col sm:flex-row gap-4 h-full"
            >
              {/* Image Container */}
              <div 
                className={`flex-1 h-full w-full border-2 ${generatedImageUrl ? 'border-purple-500/30 bg-[#130826]/80' : 'border-purple-500/20 border-dashed bg-[#130826]/30'} rounded-2xl overflow-hidden backdrop-blur-xl flex items-center justify-center group cursor-pointer shadow-2xl transition-all min-h-[300px]`}
                onClick={() => generatedImageUrl && setShowModal(true)}
              >
                {loading && !generatedImageUrl ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
                    <p className="text-purple-300 font-medium tracking-wide">Painting your vision...</p>
                  </div>
                ) : generatedImageUrl ? (
                  <div className="relative w-full h-full p-3 sm:p-2 bg-black/20">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated Art" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
                        <div className="flex items-center justify-center text-white gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Maximize2 size={24} className="text-pink-400" />
                          <span className="font-semibold text-lg tracking-wide">Click to expand</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                      <ImageIcon size={32} className="text-gray-500" />
                    </div>
                    <span className="text-gray-300 font-medium">Describe the image and click Generate.</span>
                    <span className="text-gray-500 text-sm mt-2">Your beautiful creation will appear right here.</span>
                  </div>
                )}
              </div>

              {/* Download Button Component */}
              <AnimatePresence>
                {generatedImageUrl && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleDownload}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.2)] flex flex-shrink-0 items-center justify-center hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-105 active:scale-[0.98] transition-all text-white border border-teal-300/50 group self-center sm:self-start mt-0 sm:mt-4"
                    title="Download image"
                  >
                    <Download size={28} strokeWidth={2.5} className="transition-all" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
          )}

          {activeTab === 'video' && (
            <motion.div 
              key="video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-4 flex flex-col lg:flex-row gap-8 text-left lg:h-[500px]"
            >
              {/* Left Panel: Video Prompt Input */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full lg:w-5/12 flex flex-col h-full"
              >
                <div className="relative flex-1 flex flex-col w-full h-full bg-[#130826]/50 backdrop-blur-md border border-purple-500/30 rounded-2xl p-1 shadow-lg overflow-hidden group min-h-[250px]">
                  <div className="absolute top-5 left-6 text-purple-400/80 pointer-events-none transition-colors group-focus-within:text-pink-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Video Ad Prompt Interface</span>
                  </div>
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => {
                      setVideoPrompt(e.target.value);
                      localStorage.setItem('lastVideoPrompt', e.target.value);
                    }}
                    placeholder="Describe your video advertisement idea in detail..."
                    className="w-full h-full flex-1 p-6 pt-12 text-white bg-transparent border-none rounded-xl focus:ring-0 focus:outline-none resize-none custom-scrollbar placeholder-gray-600/70 text-lg leading-relaxed"
                  />
                  
                  {/* Visual decorative element inside textarea */}
                  <div className="absolute bottom-4 right-4 text-purple-500/20 group-focus-within:text-purple-400/40 transition-colors pointer-events-none origin-bottom-right group-focus-within:scale-110">
                    <Video size={48} strokeWidth={1.5} />
                  </div>
                </div>

                {videoError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm flex-shrink-0">
                    {videoError}
                  </div>
                )}

                <button
                  onClick={handleGenerateVideo}
                  disabled={!videoPrompt.trim() || loadingVideo}
                  className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] w-full flex-shrink-0"
                >
                  {loadingVideo ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-3" size={24} /> Generating Video...
                    </span>
                  ) : (
                    'Generate Video ✨'
                  )}
                </button>
              </motion.div>

              {/* Right Panel: Video Display */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full lg:w-7/12 flex items-start flex-col sm:flex-row gap-4 h-full"
              >
                {/* Video Container */}
                <div 
                  className={`flex-1 h-full w-full border-2 ${generatedVideoUrl ? 'border-purple-500/30 bg-[#130826]/80' : 'border-purple-500/20 border-dashed bg-[#130826]/30'} rounded-2xl overflow-hidden backdrop-blur-xl flex items-center justify-center group cursor-pointer shadow-2xl transition-all min-h-[300px]`}
                  onClick={() => generatedVideoUrl && setShowVideoModal(true)}
                >
                  {loadingVideo && !generatedVideoUrl ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
                      <p className="text-purple-300 font-medium tracking-wide">Rendering your advertisement...</p>
                    </div>
                  ) : generatedVideoUrl ? (
                    <div className="relative w-full h-full p-3 sm:p-2 bg-black/20">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <video 
                          src={generatedVideoUrl} 
                          controls
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                          <Maximize2 size={24} className="text-pink-400" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                        <Video size={32} className="text-gray-500" />
                      </div>
                      <span className="text-gray-300 font-medium">Describe your video and click Generate.</span>
                      <span className="text-gray-500 text-sm mt-2">Your resulting video ad will appear here.</span>
                    </div>
                  )}
                </div>

                {/* Download Button Component */}
                <AnimatePresence>
                  {generatedVideoUrl && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleDownloadVideo}
                      className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.2)] flex flex-shrink-0 items-center justify-center hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-105 active:scale-[0.98] transition-all text-white border border-teal-300/50 group self-center sm:self-start mt-0 sm:mt-4"
                      title="Download video"
                    >
                      <Download size={28} strokeWidth={2.5} className="transition-all" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Video Modal Popup */}
      <AnimatePresence>
        {showVideoModal && generatedVideoUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-12 overflow-y-auto"
            onClick={() => setShowVideoModal(false)}
          >
            <div className="relative max-w-6xl w-full flex flex-col items-center justify-center min-h-screen py-16">
              <button
                onClick={() => setShowVideoModal(false)}
                className="fixed top-6 right-6 lg:top-10 lg:right-10 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all backdrop-blur-md border border-white/10 z-10 shadow-2xl hover:scale-110 active:scale-95"
              >
                <X size={28} />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-black/50 p-2 sm:p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <video 
                  src={generatedVideoUrl} 
                  controls
                  className="w-full h-auto max-h-[80vh] rounded-2xl"
                />
              </motion.div>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadVideo();
                }}
                className="fixed bottom-8 px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-10 text-white font-bold text-lg border border-teal-300/50"
              >
                <Download size={22} strokeWidth={3} />
                Download Video
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal Popup */}
      <AnimatePresence>
        {showModal && generatedImageUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-12 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <div className="relative max-w-6xl w-full flex flex-col items-center justify-center min-h-screen py-16">
              <button
                onClick={() => setShowModal(false)}
                className="fixed top-6 right-6 lg:top-10 lg:right-10 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all backdrop-blur-md border border-white/10 z-10 shadow-2xl hover:scale-110 active:scale-95"
              >
                <X size={28} />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-black/50 p-2 sm:p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={generatedImageUrl} 
                  alt="Full size view" 
                  className="max-w-full max-h-[80vh] w-auto object-contain rounded-2xl"
                />
              </motion.div>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="fixed bottom-8 px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-10 text-white font-bold text-lg border border-teal-300/50"
              >
                <Download size={22} strokeWidth={3} />
                Download Masterpiece
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photo;