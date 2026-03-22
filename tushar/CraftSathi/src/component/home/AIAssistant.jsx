import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Languages, TrendingUp } from 'lucide-react';

const AIAssistant = () => {
  return (
    <section id="ai-studio" className="py-20 md:py-32 relative overflow-hidden flex justify-center items-center">
      
      {/* Background Starfield/Grid */}
      <div className="absolute inset-0 bg-[#080211] z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 z-10 w-full relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden"
        >
          {/* Animated Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <motion.div
               animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-violet-500/20 rounded-full blur-[80px]"
             />
          </div>

          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-8 relative z-10">
            <span className="flex w-2 h-2 rounded-full bg-pink-500 mr-2 animate-pulse max-w-none"></span>
            <span className="text-xs font-bold tracking-wider uppercase text-pink-300">
              CraftSathi AI Brain
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-6 relative z-10 leading-tight">
            Your personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Creative Assistant.</span>
          </h2>
          
          <p className="text-gray-400 text-lg text-center max-w-xl mx-auto mb-16 relative z-10">
            Automate the heavy lifting. Generate poetic craft descriptions, translate to multiple languages, and get data-driven pricing suggestions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
            {/* Feature 1 */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-purple-500/50 transition-colors"
            >
               <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500/40 transition-colors border border-purple-500/30">
                 <Wand2 size={24} />
               </div>
               <h3 className="text-white font-bold text-lg mb-2">Auto Descriptions</h3>
               <p className="text-gray-400 text-sm">Upload an image, and our AI writes compelling product narratives instantly.</p>
            </motion.div>

            {/* Feature 2 */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-pink-500/50 transition-colors"
            >
               <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 mb-4 group-hover:bg-pink-500/40 transition-colors border border-pink-500/30">
                 <TrendingUp size={24} />
               </div>
               <h3 className="text-white font-bold text-lg mb-2">Smart Pricing</h3>
               <p className="text-gray-400 text-sm">Get real-time market value suggestions based on material and global trends.</p>
            </motion.div>

            {/* Feature 3 */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-black/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-violet-500/50 transition-colors"
            >
               <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-500/40 transition-colors border border-violet-500/30">
                 <Languages size={24} />
               </div>
               <h3 className="text-white font-bold text-lg mb-2">Auto Translation</h3>
               <p className="text-gray-400 text-sm">Sell globally with auto-translation to 20+ languages for seamless communication.</p>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default AIAssistant;
