import React, { useState } from 'react';
import { motion } from 'framer-motion';

// SVG Icon Components to replace react-icons
const Image_Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const Spinner_Icon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Download_Icon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


// Main component for the Image Generation App
const Img = () => {
  // State variables to manage the component's data and UI
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // IMPORTANT: Replace 'YOUR_PEXELS_API_KEY' with your actual Pexels API key
  const PEXELS_API_KEY = 'XRFwpmg6aY9bCb32tCpGYf3fsTVvLdOrxhpA1yRDnPkaRBfTwf9jSWHl';

  /**
   * Fetches images from the Pexels API based on the user's prompt.
   */
  const generateImages = async () => {
    // Prevent API call if the prompt is empty
    if (!prompt.trim()) {
        setError('Please enter a prompt to search for images.');
        return;
    }
     if (PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') {
        setError('Please replace "YOUR_PEXELS_API_KEY" with your actual Pexels API key.');
        return;
    }


    // Reset state before making a new API call
    setIsLoading(true);
    setGeneratedImages([]);
    setError('');

    try {
      // Fetch data from Pexels API, requesting 2 images
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}&per_page=2`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      // Handle non-successful responses
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if any photos were returned
      if (data.photos && data.photos.length > 0) {
        // We use the 'large' version of the image for better quality
        setGeneratedImages(data.photos.map(photo => photo.src.large));
      } else {
        setError(`No images found for "${prompt}". Please try a different prompt.`);
      }
    } catch (err) {
      console.error("Error fetching images from Pexels:", err);
      setError('Failed to fetch images. Please check your API key or network connection.');
    } finally {
      // Stop the loading indicator
      setIsLoading(false);
    }
  };

  /**
   * Downloads an image from a given URL.
   * This function fetches the image as a blob to bypass potential cross-origin issues.
   * @param {string} imageUrl - The URL of the image to download.
   * @param {number} index - The index of the image (used for naming the file).
   */
  const downloadImage = async (imageUrl, index) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = `craftsathi-image-${prompt.replace(/\s+/g, '-')}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl); // Clean up the created object URL
    } catch (err) {
        console.error("Error downloading image:", err);
        setError("Could not download the image. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mt-8 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-4">CraftSathi Image Finder</h2>
      <p className="text-gray-400 mb-6">Find stunning images from text prompts using CraftSathi</p>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyPress={(e) => e.key === 'Enter' && generateImages()}
        />
        <button
          onClick={generateImages}
          disabled={isLoading}
          className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
            isLoading 
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Spinner_Icon />
              Searching...
            </>
          ) : (
            <>
              <Image_Icon />
              Get Images
            </>
          )}
        </button>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-200 flex items-center justify-between gap-4"
        >
          <div>{error}</div>
        </motion.div>
      )}
      
      {isLoading && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Fetching Images...</h3>
          <div className="flex justify-center gap-4">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="relative group overflow-hidden rounded-2xl shadow-md bg-gray-700 h-64 w-64 flex items-center justify-center">
                    <Spinner_Icon />
                </div>
            ))}
          </div>
        </div>
      )}
      
      {generatedImages.length > 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Image Results
          </h3>
          <div className="flex justify-center flex-wrap gap-4">
            {generatedImages.map((imageUrl, index) => (
                 <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group overflow-hidden rounded-2xl shadow-md bg-gray-800"
                 >
                    <img 
                        src={imageUrl} 
                        alt={`${prompt}-${index + 1}`}
                        className="w-full max-w-xs object-contain max-h-80"
                    />
                    <div className="absolute inset-0 group-hover:bg-black/40 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                        onClick={() => downloadImage(imageUrl, index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-purple-600 p-3 rounded-full hover:bg-purple-500 shadow-lg transform scale-90 group-hover:scale-100"
                        >
                        <Download_Icon size={20} />
                        </button>
                    </div>
                 </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Img;

