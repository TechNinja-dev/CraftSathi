import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const LiveArtisanProfiles = () => {
  const testimonials = [
    {
       name: "Karan Singh",
       craft: "Woodworker",
       text: "CraftSathi doubled my sales in 3 months. The AI translated my product lore into French, and I got huge orders from Paris.",
       image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=150&auto=format&fit=crop"
    },
    {
       name: "Meera Devi",
       craft: "Madhubani Painter",
       text: "I used to depend on middlemen taking 60% margins. Now, my digital identity here lets me sell direct to buyers globally.",
       image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
    },
    {
       name: "Ramesh Prajapati",
       craft: "Potter",
       text: "Setting up a shop was so hard. With CraftSathi, I just took photos. The AI wrote the stories and set the pricing automatically.",
       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
  ];

  return (
    <section className="py-20 bg-black relative border-y border-white/5 overflow-hidden">
      
      {/* Absolute Gradient overlays for soft fade edges */}
      <div className="absolute top-0 bottom-0 left-0 w-1/6 md:w-1/4 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-1/6 md:w-1/4 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

      <div className="text-center mb-12 relative z-20">
         <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500">thousands.</span>
         </h2>
      </div>

      <div className="w-full flex">
         {/* Marquee Animation logic (CSS based for performance) */}
         <div className="flex w-[200%] animate-marquee">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div 
                key={idx} 
                className="w-80 md:w-96 mx-4 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 mb-4 text-pink-500">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                   <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border border-gray-600 object-cover" />
                   <div>
                     <h4 className="text-white font-bold">{t.name}</h4>
                     <span className="text-pink-400 text-xs tracking-wider uppercase">{t.craft}</span>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

    </section>
  );
};

export default LiveArtisanProfiles;
