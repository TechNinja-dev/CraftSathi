import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatItem = ({ end, suffix, label }) => (
  <div className="flex flex-col items-center sm:items-start p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-colors">
    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
      <CountUp end={end} duration={2.5} suffix={suffix} enableScrollSpy scrollSpyDelay={200} />
    </div>
    <div className="text-xs md:text-sm font-semibold text-gray-400 mt-2 tracking-wide uppercase">
      {label}
    </div>
  </div>
);

const Mission = () => {
  return (
    <section id="story" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Illustration / Video */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Glow backing */}
            <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group h-[400px] md:h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1584857946252-4752bafbb2df?q=80&w=800&auto=format&fit=crop" 
                alt="Artisan working" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-serif italic text-lg leading-tight">
                      "Crafting is not just a skill; it's the soul of our heritage passed down through generations."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-pink-500/30 bg-pink-500/10">
              <span className="text-xs font-bold tracking-wider uppercase text-pink-400">
                Our Mission
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Empowering global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">identity</span> for local artisans.
            </h2>
            
            <p className="text-lg text-gray-400 leading-relaxed mb-10">
              We empower Indian artisans by providing global exposure, storytelling tools, and digital identity infrastructure. CraftSathi bridges the gap between ancient techniques and modern e-commerce.
            </p>

            {/* Counters */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatItem end={5000} suffix="+" label="Artisans" />
              <StatItem end={120} suffix="+" label="Craft Styles" />
              <StatItem end={35} suffix="+" label="Countries" />
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
