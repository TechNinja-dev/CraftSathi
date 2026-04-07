import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VirtualCraftExhibition = () => {
  // State to track which image is currently in the center
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    "/images/image.png",
    "/images/image copy 2.png",
    "/images/image copy 3.png",
    "/images/image copy 4.png",
    "/images/image copy 5.png",
    // "/images/img1.png",
    // "/images/img2.png",
    // "/images/img3.png",
    // "/images/img4.png",
    
    
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  // Logic to calculate the relative position (offset) of each card
  const getOffset = (index) => {
    const total = images.length;
    let diff = index - activeIndex;
    
    // Wrap-around math for a continuous infinite circle
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor((total - 1) / 2)) diff += total;
    
    return diff;
  };

  return (
    <section className="py-20 md:py-32 bg-[#0c0516] relative overflow-hidden flex flex-col items-center">
      
      <div className="text-center z-10 mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Virtual Space. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Real Art.</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Immersive digital exhibition technology bringing physical crafts to global screens. Click any artwork to bring it forward.
        </p>
      </div>

      <div className="w-full h-[500px] md:h-[700px] perspective-1000 flex justify-center items-center relative z-0 mt-10">
        
        {/* Main 3D Wrapper */}
        <motion.div 
          initial={{ rotateX: 20, rotateY: 0, scale: 0.8 }}
          whileInView={{ rotateX: 5, rotateY: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full max-w-5xl h-[400px] md:h-[600px] flex justify-center items-center transform-style-3d shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
           {/* Map through all images dynamically */}
           {images.map((img, index) => {
             const offset = getOffset(index);
             const isCenter = offset === 0;

             // Define the 3D position based on the calculated offset
             // FIXED: Added pointerEvents to explicitly control clickability
             let animationState = { x: "0%", z: -300, rotateY: 0, scale: 0.4, opacity: 0, zIndex: 0, pointerEvents: "none" }; 

             if (offset === 0) {
               // Center Front
               animationState = { x: "0%", z: 100, rotateY: 0, scale: 1, opacity: 1, zIndex: 30, pointerEvents: "auto" }; 
             } else if (offset === -1) {
               // Immediate Left
               animationState = { x: "-110%", z: -50, rotateY: 15, scale: 0.8, opacity: 0.8, zIndex: 20, pointerEvents: "auto" }; 
             } else if (offset === 1) {
               // Immediate Right
               animationState = { x: "110%", z: -50, rotateY: -15, scale: 0.8, opacity: 0.8, zIndex: 20, pointerEvents: "auto" }; 
             } else if (offset === -2) {
               // Far Left
               animationState = { x: "-180%", z: -150, rotateY: 30, scale: 0.6, opacity: 0.5, zIndex: 10, pointerEvents: "auto" }; 
             } else if (offset === 2) {
               // Far Right
               animationState = { x: "180%", z: -150, rotateY: -30, scale: 0.6, opacity: 0.5, zIndex: 10, pointerEvents: "auto" }; 
             } else {
               // Hidden/Back - Explicitly disable pointer events so it doesn't block clicks!
               animationState = { x: "0%", z: -250, rotateY: 0, scale: 0.5, opacity: 0, zIndex: 0, pointerEvents: "none" }; 
             }

             return (
               <motion.div
                 key={index}
                 onClick={() => {
                   setActiveIndex(index);
                   setIsAutoPlaying(false);
                 }}
                 initial={false}
                 animate={animationState}
                 transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} 
                 className={`absolute w-[200px] md:w-[300px] h-[300px] md:h-[450px] bg-black border rounded-2xl overflow-hidden cursor-pointer transition-colors duration-500
                   ${isCenter 
                     ? 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)] grayscale-0' 
                     : 'border-white/10 grayscale-[60%] hover:grayscale-[20%]'
                   }`}
                 style={{ transformStyle: 'preserve-3d' }}
               >
                 {/* Color overlays to give depth to side items */}
                 {!isCenter && offset < 0 && <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay z-10 pointer-events-none transition-opacity duration-300"></div>}
                 {!isCenter && offset > 0 && <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 pointer-events-none transition-opacity duration-300"></div>}

                 <img 
                   src={img} 
                   className={`w-full h-full object-cover transition-transform duration-700 ${isCenter ? 'hover:scale-110' : ''}`} 
                   alt={`Gallery item ${index + 1}`} 
                 />
                 
                 {/* Featured Label - fades in only for the center item */}
                 <motion.div 
                   animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                   className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-32 flex items-end p-6 z-20 pointer-events-none"
                 >
                    <span className="text-white font-bold text-xl uppercase tracking-widest backdrop-blur-sm px-4 py-2 border border-white/20 rounded-lg shadow-lg">
                      Featured
                    </span>
                 </motion.div>
               </motion.div>
             );
           })}
        </motion.div>

        {/* Floor reflection glow */}
        <div className="absolute bottom-[-100px] w-[80vw] h-[200px] rounded-[100%] bg-purple-900/40 blur-[80px] z-0 pointer-events-none mix-blend-screen scale-y-50"></div>

      </div>

      {/* Global CSS required to render 3D perspective in the browser */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />

    </section>
  );
};

export default VirtualCraftExhibition;