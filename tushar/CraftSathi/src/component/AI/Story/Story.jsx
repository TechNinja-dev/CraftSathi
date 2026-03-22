import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner, FaMagic, FaVolumeUp, FaStop, FaCopy, FaDownload, FaLightbulb, FaCheck } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Story = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [story, setStory] = useState('');
  const [audio, setAudio] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showImageTips, setShowImageTips] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;
  const ELEVENLABS_API_KEY = import.meta.env.VITE_REACT_APP_ELEVENLABS_API_KEY;
  const ELEVENLABS_VOICE_ID = import.meta.env.VITE_REACT_APP_ELEVENLABS_VOICE_ID;

  // Handle drag and drop events
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files.length && files[0].type.startsWith('image/')) {
        handleFile(files[0]);
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleFile = (file) => {
    setImage({ url: URL.createObjectURL(file), base64: null });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage((prev) => ({ ...prev, base64: reader.result.split(',')[1] }));
      setCurrentStep(2); // Move to next step after image upload
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const generateStory = async () => {
    if (!image || !text) {
      alert("Please upload an image and enter some text.");
      return;
    }

    setIsGenerating(true);
    try {
      // Generate story using Gemini API
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Create a short fantasy story based on this image and the following text: ${text}`;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: image.base64, mimeType: "image/jpeg" } },
      ]);
      const response = await result.response;
      const generatedText = response.text();
      setStory(generatedText);
      setCurrentStep(3); // Move to results step

      // Convert generated text to speech using ElevenLabs API
      const elevenLabsResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: generatedText,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (elevenLabsResponse.ok) {
        const audioBlob = await elevenLabsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
      } else {
        console.error("ElevenLabs API error:", elevenLabsResponse.statusText);
      }

    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Failed to generate story. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyStory = () => {
    navigator.clipboard.writeText(story)
      .then(() => {
        alert('Story copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleDownloadAudio = () => {
    if (audio) {
      const a = document.createElement('a');
      a.href = audio;
      a.download = 'story-narration.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioProgress(0);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
     
      // Update progress while playing
      audioRef.current.ontimeupdate = () => {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setAudioProgress(progress);
      };
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-purple-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center px-4 py-8"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Create Your Magical Story
        </motion.h1>
        <p className="text-purple-200 mb-8 text-center max-w-2xl">
          Upload an image, add some text, and watch as AI transforms it into an immersive story with audio narration.
        </p>
        
        {/* Progress Stepper */}
        <div className="flex justify-center mb-10 w-full max-w-3xl">
          <div className="flex items-center w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${currentStep >= 1 ? 'bg-purple-600 border-purple-600' : 'border-gray-500'} transition-all duration-300`}>
                {currentStep > 1 ? (
                  <FaCheck className="text-white text-lg" />
                ) : (
                  <span className={`text-lg font-semibold ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`}>1</span>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= 1 ? 'text-purple-300' : 'text-gray-500'}`}>Upload Image</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${currentStep >= 2 ? 'bg-purple-600 border-purple-600' : 'border-gray-500'} transition-all duration-300`}>
                {currentStep > 2 ? (
                  <FaCheck className="text-white text-lg" />
                ) : (
                  <span className={`text-lg font-semibold ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`}>2</span>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= 2 ? 'text-purple-300' : 'text-gray-500'}`}>Add Context</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${currentStep >= 3 ? 'bg-purple-600 border-purple-600' : 'border-gray-500'} transition-all duration-300`}>
                <span className={`text-lg font-semibold ${currentStep >= 3 ? 'text-white' : 'text-gray-400'}`}>3</span>
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= 3 ? 'text-purple-300' : 'text-gray-500'}`}>Your Story</span>
            </div>
          </div>
        </div>
       
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          {/* Left Panel - Image Upload */}
          <motion.div
            className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg w-full lg:w-2/5 border border-purple-700"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-300">
              <FaUpload className="text-purple-400" />
              Step 1: Upload Your Image
            </h2>
           
            <div 
              ref={dropAreaRef}
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-300 min-h-[200px] 
                ${isDragging ? 'border-purple-400 bg-purple-900/20' : image ? 'border-green-500' : 'border-purple-600 hover:border-purple-400'}`}
              onClick={() => !image && fileInputRef.current?.click()}
            >
              {image ? (
                <div className="flex flex-col items-center">
                  <img src={image.url} alt="Preview" className="mt-2 max-h-48 object-contain rounded-lg mb-4 shadow-lg" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                    className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <FaUpload className="text-4xl text-purple-400 mb-3" />
                  <p className="text-gray-300 mb-3 text-center">Drag & drop an image or click to browse</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
                  >
                    Choose Image
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
           
            <div className="mt-2 relative">
              <button 
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => setShowImageTips(!showImageTips)}
              >
                <FaLightbulb className="text-yellow-400" />
                <h3 className="text-lg font-medium">Image Tips</h3>
              </button>
              
              {showImageTips && (
                <motion.ul 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-gray-400 list-disc pl-5 space-y-1 mt-2 overflow-hidden"
                >
                  <li>Use high-quality images for best results</li>
                  <li>Clear, well-lit photos work better</li>
                  <li>Images with people or distinct objects inspire better stories</li>
                </motion.ul>
              )}
            </div>
          </motion.div>
         
          {/* Middle Panel - Text Input */}
          <motion.div
            className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg w-full lg:w-2/5 border border-purple-700"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-300">
              <FaMagic className="text-purple-400" />
              Step 2: Add Your Story Context
            </h2>
           
            <div className="flex flex-col h-full">
              <label htmlFor="story-text" className="text-lg font-medium mb-2">What should the story be about?</label>
              <textarea
                id="story-text"
                rows="8"
                value={text}
                onChange={handleTextChange}
                placeholder="e.g., A wizard discovers a magical forest filled with glowing creatures and ancient secrets..."
                className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y shadow-inner transition-all"
              ></textarea>
             
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {text.length} characters • {text.split(/\s+/).filter(Boolean).length} words
                </div>
               
                <motion.button
                  onClick={generateStory}
                  disabled={isGenerating || !image || !text}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isGenerating && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {isGenerating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaMagic />
                        Generate Story
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
       
        {/* Results Section */}
        {(story || audio) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 p-8 bg-gray-800 rounded-2xl shadow-lg w-full max-w-4xl border border-purple-700"
          >
            <h2 className="text-2xl font-bold mb-4 border-b border-purple-700 pb-2 flex items-center gap-2 text-purple-300">
              <FaMagic className="text-purple-400" />
              Your Generated Story
            </h2>
           
            {story && (
              <div className="p-6 bg-gray-750 rounded-xl mb-6 relative shadow-inner">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleCopyStory}
                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-colors shadow-md"
                    title="Copy story"
                  >
                    <FaCopy />
                  </button>
                </div>
                <p className="text-lg text-gray-200 whitespace-pre-line">{story}</p>
              </div>
            )}
           
            {audio && (
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-purple-300">
                  <FaVolumeUp className="text-purple-400" />
                  Audio Narration
                </h3>
               
                <div className="flex items-center gap-4">
                  <audio ref={audioRef} className="hidden">
                    <source src={audio} type="audio/mpeg" />
                  </audio>
                 
                  <button
                    onClick={playAudio}
                    className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-md"
                    title="Play audio"
                  >
                    <FaVolumeUp className="text-xl" />
                  </button>
                 
                  <button
                    onClick={stopAudio}
                    className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-md"
                    title="Stop audio"
                  >
                    <FaStop className="text-xl" />
                  </button>
                 
                  <button
                    onClick={handleDownloadAudio}
                    className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-md ml-auto"
                    title="Download audio"
                  >
                    <FaDownload className="text-xl" />
                  </button>
                </div>
               
                {/* Audio progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4 shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${audioProgress}%` }}
                    transition={{ duration: 0.1 }}
                  ></motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Story;