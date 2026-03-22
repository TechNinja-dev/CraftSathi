import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- SVG Icon Components (replaces react-icons) ---
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
);

const VideoIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z"></path></svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const ExclamationTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>
);
// --- End of SVG Icon Components ---


const Video = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [videoStatus, setVideoStatus] = useState('idle'); // 'idle', 'generating', 'completed', 'error'

    // --- Video Search Logic using Pexels API ---
    const generateVideo = async () => {
        if (!prompt.trim()) {
             setError("Please enter a prompt to search for a video.");
             return;
        }

        // IMPORTANT: Replace with your actual Pexels API Key
        const API_KEY = "jEeO0xp4ZzXvHGjz52meREYBRaMrjmO3epEANymVKgh9MO42FIdRYiVS"; 

        if (API_KEY === "YOUR_PEXELS_API_KEY") {
            setError("API key not configured. Please add your Pexels API key.");
            setVideoStatus('error');
            return;
        }
        
        setIsLoading(true);
        setVideoStatus('generating');
        setGeneratedVideo(null);
        setError('');

        try {
            const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(prompt)}&per_page=1`, {
                headers: {
                    Authorization: API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.videos && data.videos.length > 0) {
                // Find the highest quality video link available
                const videoFile = data.videos[0].video_files.find(f => f.quality === "hd") || data.videos[0].video_files[0];
                setGeneratedVideo(videoFile.link);
                setVideoStatus('completed');
            } else {
                setError(`No videos found for "${prompt}". Please try a different search term.`);
                setVideoStatus('error');
            }

        } catch (err) {
            console.error('Error fetching video from Pexels:', err);
            setError(`Failed to fetch video: ${err.message}. Please check your API key and network.`);
            setVideoStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadVideo = async () => {
        if (!generatedVideo) return;
        
        try {
            // Fetch the video as a blob to allow cross-origin download
            const response = await fetch(generatedVideo);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `pexels-video-${prompt.replace(/\s+/g, '-')}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error downloading video:", err);
            setError("Could not download the video. Please try again.");
        }
    };

    // --- UI (Unchanged) ---
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mt-8"
        >
            <h2 className="text-2xl font-bold text-white mb-4">AI Video Generation</h2>
            <p className="text-gray-400 mb-6">Create engaging videos from text prompts using AI video generation capabilities.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to generate..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateVideo()}
                    disabled={isLoading}
                />
                <button
                    onClick={generateVideo}
                    disabled={!prompt.trim() || isLoading}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        !prompt.trim() || isLoading 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <SpinnerIcon />
                            Searching...
                        </>
                    ) : (
                        <>
                            <VideoIcon />
                            Get Video
                        </>
                    )}
                </button>
            </div>
        
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-200 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-2">
                        <ExclamationTriangleIcon />
                        {error}
                    </div>
                    <button 
                        onClick={() => setError('')}
                        className="text-red-200 hover:text-white px-3 py-1 rounded-lg border border-red-700 hover:bg-red-800/30 transition-colors"
                    >
                        Dismiss
                    </button>
                </motion.div>
            )}

            {generatedVideo && videoStatus === 'completed' && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Video Result</h3>
                        <button
                            onClick={downloadVideo}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            <DownloadIcon />
                            Download
                        </button>
                    </div>
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
                        <video 
                            src={generatedVideo}
                            className="w-full h-full"
                            controls
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </motion.div>
            )}
            
            {!generatedVideo && !isLoading && videoStatus !== 'error' && (
                <div className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                    <div className="text-center text-gray-500">
                        <VideoIcon className="text-5xl mx-auto mb-4 opacity-50" />
                        <p>Your generated video will appear here</p>
                        <p className="text-sm mt-2">Enter a prompt and click "Get Video"</p>
                    </div>
                </div>
            )}

            {isLoading && !generatedVideo && (
                <div className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                    <div className="text-center text-purple-400">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <SpinnerIcon />
                        </motion.div>
                        <p className="mt-4">Searching for your video...</p>
                        <p className="text-sm mt-2">This may take a few moments</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Video;

