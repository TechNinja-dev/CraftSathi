// components/Ai/Description.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner, FaCheckCircle, FaCopy, FaVolumeUp, FaStop } from 'react-icons/fa';

const Description = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDescription = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    setIsComplete(false);
    
    try {
      // Use environment variables for API keys
      const API_KEY = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;
      const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

      const mimeType = selectedImage.split(';')[0].split(':')[1];
      const base64Data = selectedImage.split(',')[1];

      const requestBody = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
              {
                text: 'Describe this image in detail.',
              },
            ],
          },
        ],
      };

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      setDescription(generatedText);
      setIsComplete(true);
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(description)
      .then(() => {
        alert('Description copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleAudio = async () => {
    if (!description) return;

    // Stop audio if already playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsAudioLoading(true);
    setAudioUrl(null);
    setAudioProgress(0);

    try {
      // Use environment variables for API keys
      const ELEVENLABS_API_KEY = import.meta.env.VITE_REACT_APP_ELEVENLABS_API_KEY;
      const VOICE_ID = import.meta.env.VITE_REACT_APP_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
      const ELEVENLABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

      const response = await fetch(ELEVENLABS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: description,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.0,
            similarity_boost: 1.0,
            style: 0.0,
            use_speaker_boost: true,
            speed: 1.0,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Create audio element and play
      const audio = new Audio(url);
      audioRef.current = audio;
      
      // Update progress while loading
      audio.addEventListener('loadeddata', () => {
        setIsAudioLoading(false);
      });
      
      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(progress);
      });
      
      audio.addEventListener('ended', () => {
        setAudioProgress(0);
        audioRef.current = null;
      });
      
      audio.play().catch(error => {
        console.error('Audio playback failed:', error);
        setIsAudioLoading(false);
      });

    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed  generate audio. Please check your API key and try again.');
      setIsAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setAudioProgress(0);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Image Description Generator</h2>
      <p className="text-gray-400 mb-6">Upload an image and let Google Gemini AI generate a detailed description for you.</p>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center h-64 flex items-center justify-center">
            {selectedImage ? (
              <div className="relative h-full w-full">
                <img 
                  src={selectedImage} 
                  alt="Uploaded preview" 
                  className="h-full w-full object-contain rounded-lg"
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <FaUpload className="text-4xl text-purple-500 mb-2" />
                <span className="text-purple-600 font-medium">Click to upload image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
          
          <button
            onClick={generateDescription}
            disabled={!selectedImage || isLoading}
            className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
              !selectedImage || isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Generating Description...
              </>
            ) : isComplete ? (
              <>
                <FaCheckCircle />
                Description Generated
              </>
            ) : (
              'Generate Description'
            )}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-700 rounded-2xl p-5 shadow-md h-64 overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">AI Description</h3>
              {description && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                  {audioUrl && audioRef.current ? (
                    <button
                      onClick={stopAudio}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white"
                      title="Stop audio"
                    >
                      <FaStop />
                    </button>
                  ) : (
                    <button
                      onClick={handleAudio}
                      className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                      title="Listen to description"
                      disabled={isAudioLoading}
                    >
                      {isAudioLoading ? <FaSpinner className="animate-spin" /> : <FaVolumeUp />}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {description ? (
              <>
                <p className="text-white mb-2">{description}</p>
                
                {/* Audio progress indicator */}
                {isAudioLoading && (
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${audioProgress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Audio status message */}
                {isAudioLoading && (
                  <p className="text-sm text-purple-400 mt-1">
                    {audioProgress > 0 ? 'Playing...' : 'Generating audio...'}
                  </p>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Your image description will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Description;