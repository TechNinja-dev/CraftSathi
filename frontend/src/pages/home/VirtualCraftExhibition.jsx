import React from 'react';
import { motion } from 'framer-motion';

const VirtualCraftExhibition = () => {
  // Mock image gallery grid mapping
  const images = [
    "https://images.unsplash.com/photo-1610425516790-a7d519b7a421?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627916968037-f016dcebc504?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558000143-a6121b6d1656?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605814981881-432243d41e7d?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
  ];

  return (
    <section className="py-20 md:py-32 bg-[#0c0516] relative overflow-hidden flex flex-col items-center">
      
      <div className="text-center z-10 mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Virtual Space. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Real Art.</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Immersive digital exhibition technology bringing physical crafts to global screens.
        </p>
      </div>

      <div className="w-full h-[500px] md:h-[700px] perspective-1000 flex justify-center items-center relative z-0 mt-10">
        
        {/* 3D Grid Cylinder/Wall layout simulation */}
        <motion.div 
          initial={{ rotateX: 20, rotateY: 0, scale: 0.8 }}
          whileInView={{ rotateX: 10, rotateY: 10, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full max-w-5xl h-[400px] md:h-[600px] flex justify-center items-center transform-style-3d shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
           {/* Center Piece */}
           <div className="absolute w-[300px] md:w-[400px] h-[400px] md:h-[500px] bg-black border-2 border-purple-500/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.4)] z-30 transform translate-z-[100px]">
             <img src={images[0]} className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-700" alt="Centerpiece" />
             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-32 flex items-end p-6">
                <span className="text-white font-bold text-xl uppercase tracking-widest backdrop-blur-sm px-4 py-2 border border-white/20 rounded-lg">Featured</span>
             </div>
           </div>
           
           {/* Left Piece 1 */}
           <div className="absolute w-[200px] md:w-[250px] h-[300px] md:h-[350px] bg-black border border-white/10 rounded-xl overflow-hidden z-20 transform -translate-x-[200px] md:-translate-x-[300px] -translate-z-[50px] rotate-y-15 opacity-80 backdrop-blur-sm">
             <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay z-10 block pointer-events-none"></div>
             <img src={images[1]} className="w-full h-full object-cover" alt="Gallery" />
           </div>

           {/* Right Piece 1 */}
           <div className="absolute w-[200px] md:w-[250px] h-[300px] md:h-[350px] bg-black border border-white/10 rounded-xl overflow-hidden z-20 transform translate-x-[200px] md:translate-x-[300px] -translate-z-[50px] -rotate-y-15 opacity-80 backdrop-blur-sm">
             <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 block pointer-events-none"></div>
             <img src={images[2]} className="w-full h-full object-cover" alt="Gallery" />
           </div>

           {/* Left Far Piece */}
           <div className="absolute w-[150px] md:w-[200px] h-[200px] md:h-[250px] bg-black border border-white/5 rounded-xl overflow-hidden z-10 transform -translate-x-[350px] md:-translate-x-[550px] -translate-z-[150px] rotate-y-30 opacity-50 block hidden md:block">
             <img src={images[3]} className="w-full h-full object-cover grayscale opacity-50" alt="Gallery" />
           </div>

           {/* Right Far Piece */}
           <div className="absolute w-[150px] md:w-[200px] h-[200px] md:h-[250px] bg-black border border-white/5 rounded-xl overflow-hidden z-10 transform translate-x-[350px] md:translate-x-[550px] -translate-z-[150px] -rotate-y-30 opacity-50 block hidden md:block">
             <img src={images[4]} className="w-full h-full object-cover grayscale opacity-50" alt="Gallery" />
           </div>
        </motion.div>

        {/* Floor fade reflection */}
        <div className="absolute bottom-[-100px] w-[80vw] h-[200px] rounded-[100%] bg-purple-900/40 blur-[80px] z-0 pointer-events-none mix-blend-screen scale-y-50"></div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-15 {
          transform: translateX(-300px) translateZ(-50px) rotateY(15deg);
        }
        .-rotate-y-15 {
          transform: translateX(300px) translateZ(-50px) rotateY(-15deg);
        }
        .rotate-y-30 {
          transform: translateX(-550px) translateZ(-150px) rotateY(30deg);
        }
        .-rotate-y-30 {
          transform: translateX(550px) translateZ(-150px) rotateY(-30deg);
        }
        @media (max-width: 768px) {
           .rotate-y-15 { transform: translateX(-200px) translateZ(-50px) rotateY(15deg); }
           .-rotate-y-15 { transform: translateX(200px) translateZ(-50px) rotateY(-15deg); }
        }
      `}} />

    </section>
  );
};

export default VirtualCraftExhibition;
