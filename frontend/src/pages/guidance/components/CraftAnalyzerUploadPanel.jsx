import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const analysisSteps = ['Analyzing material', 'Analyzing craftsmanship', 'Analyzing export readiness'];

export default function CraftAnalyzerUploadPanel({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const resetState = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setDone(false);
    setAnalyzing(false);
    setStepIndex(0);
  };

  const onDrop = useCallback(async (accepted) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setAnalyzing(true);
    setDone(false);
    setStepIndex(0);
    
    // Simulate analysis steps progressing visually
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      if (idx < analysisSteps.length) {
        setStepIndex(idx);
      }
    }, 1500);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(f);
      });
      const base64Image = await base64Promise;

      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_URL}/analyzecraft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: base64Image })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      // Pass the fully structured JSON data up to the GuidanceLayout
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }

    } catch (err) {
      console.error('API Error during craft analysis:', err);
    } finally {
      clearInterval(iv);
      setStepIndex(analysisSteps.length - 1);
      setTimeout(() => {
        setAnalyzing(false);
        setDone(true);
      }, 500);
    }
  }, [onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
  });

  return (
    <section className="relative w-full max-w-[1100px] mx-auto mt-12 mb-16 px-4">
      {/* Background Depth Glow */}
      <div className="absolute inset-0 blur-[140px] opacity-10 bg-gradient-to-r from-purple-600 to-pink-500 pointer-events-none" />

      {/* Main Analyzer Container */}
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl px-10 py-16 shadow-[0_0_80px_rgba(168,85,247,0.08)] hover:shadow-[0_0_120px_rgba(236,72,153,0.18)] transition-all duration-500 max-w-[1000px] mx-auto">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                animate={
                  isDragActive 
                    ? { scale: 1.02, boxShadow: "none" } 
                    : { 
                        scale: 1, 
                        boxShadow: [
                          "0 0 0 rgba(168,85,247,0)", 
                          "0 0 30px rgba(168,85,247,0.25)", 
                          "0 0 0 rgba(168,85,247,0)"
                        ] 
                      }
                }
                transition={
                  isDragActive 
                    ? { duration: 0.2 } 
                    : { repeat: Infinity, duration: 3 }
                }
                {...getRootProps()}
                aria-label="upload zone"
                role="button"
                tabIndex={0}
                className={`flex flex-col items-center text-center justify-center gap-6 py-20 rounded-2xl border-2 border-dashed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#110e1b] ${
                  isDragActive
                    ? 'border-pink-400 bg-pink-500/5 shadow-[0_0_30px_rgba(236,72,153,0.2)]'
                    : 'border-purple-500/30 hover:border-pink-400/60 w-full'
                }`}
              >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-2"
                  >
                    <UploadCloud size={28} className="text-purple-400" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-semibold text-white tracking-tight"
                  >
                    Analyze Your Craft
                  </motion.h3>
                  
                  <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                    Drag & drop high-resolution craft image for AI positioning analysis
                  </p>
                </div>

                <div className="mt-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all duration-300">
                  Browse Files
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row gap-8 items-center md:items-start text-left">
              {/* Left: Image Preview */}
              <div className="shrink-0 flex items-center justify-center">
                <div className="w-52 h-52 rounded-xl overflow-hidden border border-white/10 shadow-lg hover:scale-[1.03] transition-transform duration-300 cursor-default">
                  <img src={preview} alt="Craft preview" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Analysis State */}
              <div className="flex-1 w-full max-w-lg">
                {analyzing && (
                  <div className="flex flex-col gap-5 pt-2">
                    {analysisSteps.map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex items-center gap-4 text-base"
                      >
                        {i < stepIndex ? (
                          <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                        ) : i === stepIndex ? (
                          <Loader2 size={20} className="text-purple-400 shrink-0 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                        )}
                        <span className={i <= stepIndex ? 'text-gray-100 font-medium' : 'text-gray-500'}>{step}</span>
                      </motion.div>
                    ))}
                    <div className="mt-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${((stepIndex + 1) / analysisSteps.length) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {done && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 pt-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="text-purple-400 w-5 h-5" />
                       <h3 className="text-xl font-bold text-white tracking-tight">Intelligence Report</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                       <p className="text-sm text-gray-400">Analysis completed! Real data will populate the dashboard below shortly.</p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={resetState}
                        className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors outline-none focus-visible:text-gray-300"
                      >
                        Analyze another craft
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </section>
  );
}
