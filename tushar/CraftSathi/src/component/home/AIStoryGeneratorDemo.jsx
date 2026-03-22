import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Wand2, RefreshCw } from 'lucide-react';

const AIStoryGeneratorDemo = () => {
  const [step, setStep] = useState(0); 
  // 0: Upload prompt, 1: Loading/Generating, 2: Result

  const handleUploadClick = () => {
    setStep(1);
    setTimeout(() => setStep(2), 3000);
  };

  const resetDemo = () => setStep(0);

  return (
    <section className="py-20 md:py-32 relative bg-[#0a0410]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-pink-400">
              Interactive Demo
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Try the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">AI Story Generator.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            See how CraftSathi automatically weaves compelling cultural narratives from a single image of your craft.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[400px]">
          
          {/* Left Side: Upload / Image View */}
          <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/5 relative flex items-center justify-center bg-black/20">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-sm"
                >
                  <button 
                    onClick={handleUploadClick}
                    className="w-full h-64 border-2 border-dashed border-purple-500/50 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-400 hover:bg-purple-500/5 transition-all group cursor-pointer"
                  >
                    <UploadCloud size={48} className="mb-4 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-white mb-2">Click to upload craft image</span>
                    <span className="text-sm">or drag and drop</span>
                  </button>
                </motion.div>
              )}
              
              {(step === 1 || step === 2) && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full absolute inset-0 p-6 flex flex-col"
                >
                   <div className="w-full h-full rounded-xl overflow-hidden relative shadow-[0_0_30px_rgba(168,85,247,0.2)] border border-purple-500/30">
                     <img 
                       src="https://images.unsplash.com/photo-1610425516790-a7d519b7a421?q=80&w=600&auto=format&fit=crop" 
                       alt="Uploaded Craft"
                       className="w-full h-full object-cover"
                     />
                     {step === 1 && (
                       <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                         <RefreshCw size={40} className="text-white animate-spin mb-4" />
                         <span className="text-white font-bold tracking-widest text-sm uppercase">Analyzing Craft...</span>
                       </div>
                     )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Output text */}
          <div className="w-full md:w-1/2 p-8 flex flex-col relative overflow-hidden bg-black/40">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center opacity-50"
                >
                  <Wand2 size={40} className="text-gray-600 mb-4" />
                  <p className="text-gray-500">Upload an image to see the magic happen.</p>
                </motion.div>
              )}
              
              {step === 1 && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col gap-4 py-4"
                >
                  <div className="w-1/3 h-6 bg-white/5 animate-pulse rounded"></div>
                  <div className="w-full h-4 bg-white/5 animate-pulse rounded mt-4"></div>
                  <div className="w-5/6 h-4 bg-white/5 animate-pulse rounded"></div>
                  <div className="w-full h-4 bg-white/5 animate-pulse rounded"></div>
                  <div className="w-2/3 h-4 bg-white/5 animate-pulse rounded"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 font-bold bg-purple-900/50 px-4 py-2 rounded-lg backdrop-blur border border-purple-500/50 flex items-center gap-2">
                     <Wand2 size={16} className="animate-pulse" /> Weaving story...
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                      Cerulean Heritage Vase
                    </h3>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">English</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-gray-300 text-sm leading-relaxed space-y-4">
                    <p>
                      <strong className="text-white font-medium">Origin:</strong> Rooted in the rich, arid soils of Rajasthan, this exquisite Blue Pottery vase carries the legacy of Turko-Persian craftsmanship, a technique passed down through five generations of the Prajapati lineage.
                    </p>
                    <p>
                      <strong className="text-white font-medium">Process:</strong> Unlike traditional ceramics, this piece is uniquely crafted without clay. Instead, quartz stone powder, powdered glass, multani mitti, borax, and water are meticulously mixed to form the dough. It requires 15 days of intensive labor, painted freehand with vibrant cobalt blue oxides.
                    </p>
                    <p>
                      <strong className="text-white font-medium">Significance:</strong> The swirling floral motifs represent the eternal cycle of life and water—a precious oasis in the desert landscape. It stands not merely as a vessel, but as a testament to human resilience and artistry.
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                     <div>
                       <span className="text-xs text-gray-500 block">Suggested Price:</span>
                       <span className="text-lg font-bold text-green-400">$120</span>
                     </div>
                     <button 
                       onClick={resetDemo}
                       className="text-sm text-purple-400 hover:text-pink-400 flex items-center gap-1 transition-colors"
                     >
                       <RefreshCw size={14} /> Try Another
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AIStoryGeneratorDemo;
