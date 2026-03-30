import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ delay, yOffset, src, alt, width, height, rotate = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay }}
    className="absolute z-10"
    style={{ ...width, ...height }}
  >
    <motion.div
      animate={{ y: [0, yOffset, 0], rotate: [rotate, rotate + 2, rotate - 2, rotate] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
      className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_20px_40px_rgba(168,85,247,0.3)] bg-gray-800"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  </motion.div>
);

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen pt-20 pb-16 md:pt-32 flex items-center justify-center overflow-hidden">
      
      {/* Background Orbs & Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0c0516]">
        {/* Top left purple */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/30 mix-blend-screen filter blur-[120px] opacity-70 animate-pulse"></div>
        {/* Bottom right pink */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/20 mix-blend-screen filter blur-[150px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Center blue/violet */}
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-blue-600/20 mix-blend-screen filter blur-[100px] opacity-50"></div>
        
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Side Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start mt-10 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md"
          >
            <span className="flex w-2 h-2 rounded-full bg-purple-500 mr-2 animate-ping max-w-none"></span>
            <span className="text-xs font-semibold tracking-wide uppercase text-purple-300">
              The AI Crafts Platform
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white"
          >
            Empowering Artisans
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 block mt-2 pb-2">
              Preserving Heritage
            </span>
            <span className="text-4xl lg:text-6xl text-gray-300 mt-2 block">
              Through AI Storytelling
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed font-light"
          >
            An AI-powered startup connecting India's timeless craftsmanship with global opportunity. 
            Build your digital identity, tell authentic stories, and scale your craft.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button className="px-8 py-4 bg-white text-black text-base font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all">
              Start Your Craft Journey
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white text-base font-bold rounded-full hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
              Explore Artisan Stories
            </button>
          </motion.div>
        </div>

        {/* Right Side Visual Grid */}
        <div className="w-full md:w-1/2 relative h-[500px] lg:h-[600px] hidden md:block">
          {/* Main Center Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[360px] lg:w-[320px] lg:h-[420px] z-20">
            <motion.div
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-black"
            >
              <img 
                src="https://images.unsplash.com/photo-1610425516790-a7d519b7a421?q=80&w=600&auto=format&fit=crop" 
                alt="Main Craft" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/90 to-transparent flex items-end p-5">
                <div>
                   <span className="bg-purple-600/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Pottery</span>
                   <p className="text-white font-medium text-sm mt-2 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse block"></span> Live Story
                   </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Card 1 - Top Left */}
          <div className="absolute top-10 left-0">
             <FloatingCard 
               delay={0.2} 
               yOffset={20} 
               src="https://images.unsplash.com/photo-1558000143-a6121b6d1656?q=80&w=400&auto=format&fit=crop" 
               alt="Textiles"
               width={{ width: '160px' }}
               height={{ height: '200px' }}
               rotate={-6}
             />
          </div>

          {/* Floating Card 2 - Bottom Left */}
          <div className="absolute bottom-10 left-10">
             <FloatingCard 
               delay={0.4} 
               yOffset={-25} 
               src="https://images.unsplash.com/photo-1627916968037-f016dcebc504?q=80&w=400&auto=format&fit=crop" 
               alt="Wood Carving"
               width={{ width: '180px' }}
               height={{ height: '140px' }}
               rotate={8}
             />
          </div>

          {/* Floating Card 3 - Top Right */}
          <div className="absolute top-20 right-0 z-30">
             <FloatingCard 
               delay={0.6} 
               yOffset={15} 
               src="https://images.unsplash.com/photo-1605814981881-432243d41e7d?q=80&w=400&auto=format&fit=crop" 
               alt="Jewelry"
               width={{ width: '150px' }}
               height={{ height: '180px' }}
               rotate={10}
             />
          </div>

          {/* Floating Card 4 - Bottom Right */}
          <div className="absolute bottom-16 right-4 z-30">
             <FloatingCard 
               delay={0.8} 
               yOffset={-15} 
               src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop" 
               alt="Painting"
               width={{ width: '170px' }}
               height={{ height: '220px' }}
               rotate={-5}
             />
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default Hero;
