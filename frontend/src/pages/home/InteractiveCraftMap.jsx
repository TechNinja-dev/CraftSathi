import React from 'react';
import { motion } from 'framer-motion';

const InteractiveCraftMap = () => {
  // Abstract coordinates matching Indian regions roughly
  const regions = [
    { id: 'rj', top: '35%', left: '25%', name: 'Rajasthan', craft: 'Blue Pottery' },
    { id: 'gj', top: '50%', left: '15%', name: 'Gujarat', craft: 'Ajrakh Print' },
    { id: 'up', top: '40%', left: '45%', name: 'Uttar Pradesh', craft: 'Chikankari' },
    { id: 'br', top: '45%', left: '65%', name: 'Bihar', craft: 'Madhubani' },
    { id: 'as', top: '40%', left: '85%', name: 'Assam', craft: 'Bamboo Craft' },
    { id: 'tn', top: '80%', left: '40%', name: 'Tamil Nadu', craft: 'Kanjeevaram Silk' },
  ];

  return (
    <section className="py-20 md:py-32 relative bg-[#0c0516] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left text */}
        <div className="w-full lg:w-1/3">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-purple-400">
              Pan-India Reach
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            A journey through <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">colors and cultures.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Every pin drop is a story. From the deserts of Kutch to the valleys of Assam, we're digitizing the entire subcontinent's artisanal heritage.
          </p>
          <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-white/10 text-white rounded-full transition-all font-semibold shadow-lg">
            Explore Map
          </button>
        </div>

        {/* Right abstract map visual */}
        <div className="w-full lg:w-2/3 relative h-[400px] md:h-[600px] bg-gray-900/30 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Subtle grid base */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          
          {/* Faux generic map shape made with blur / svgs (Simulated with gradients) */}
          <div className="absolute inset-x-10 inset-y-10 border border-purple-500/10 rounded-[4rem] flex items-center justify-center">
            
            <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 20 20 Q 40 10 60 20 T 90 40 Q 80 80 50 90 T 20 60 Z" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
            </svg>

            {/* Region Ping Markers */}
            {regions.map((region, idx) => (
              <div key={region.id} className="absolute group" style={{ top: region.top, left: region.left }}>
                {/* Ping rings */}
                <div className="absolute -inset-4 bg-pink-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute -inset-2 bg-purple-500 rounded-full animate-ping opacity-40 delay-75"></div>
                
                {/* Core dot */}
                <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff] border-2 border-pink-500 cursor-pointer group-hover:scale-150 transition-transform"></div>
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-2 rounded-lg opacity-0 min-w-max group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl transform group-hover:-translate-y-2">
                  <span className="block font-bold text-pink-400 mb-0.5">{region.name}</span>
                  <span className="text-gray-300">{region.craft}</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-opacity-0 mx-auto w-0 h-0 border-solid border-4 border-t-black/90 border-transparent"></div>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractiveCraftMap;
