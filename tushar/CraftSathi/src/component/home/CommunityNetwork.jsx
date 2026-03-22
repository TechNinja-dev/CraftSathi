import React from 'react';
import { motion } from 'framer-motion';

const CommunityNetwork = () => {
  // Generate random dots for the network visualization
  const dots = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <section className="py-20 md:py-32 relative bg-black overflow-hidden border-y border-white/5">
      
      {/* Animated Network Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
         {dots.map(dot => (
            <motion.div
              key={dot.id}
              initial={{ opacity: 0.1, scale: 0.5 }}
              animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay }}
              className="absolute bg-purple-500 rounded-full blur-[1px]"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                boxShadow: `0 0 ${dot.size * 2}px rgba(168,85,247,0.8)`
              }}
            />
         ))}
         {/* Connecting Lines Graphic Placeholder */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-3xl mx-auto bg-gray-900/60 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[2.5rem] shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Craft Network.</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Become part of a thriving ecosystem of over 5,000 artisans. Share knowledge, collaborate on cross-cultural crafts, and grow your business together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] active:scale-95 transition-all text-lg relative overflow-hidden group">
               <span className="relative z-10">Sign Up Now</span>
               <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
             </button>
             <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:bg-white/5 hover:border-gray-400 transition-all text-lg">
               Contact Support
             </button>
          </div>
        </motion.div>

      </div>
      
      {/* Shine animation css directly added */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          100% { transform: translateX(100%) }
        }
        .animate-shine { animation: shine 1s; }
      `}} />
    </section>
  );
};

export default CommunityNetwork;
