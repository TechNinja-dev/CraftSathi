import React, { memo } from 'react';
import { motion } from 'framer-motion';

const iconsData = [
  { 
    id: 'brushes', 
    emoji: '🎨', 
    wrapperClass: 'absolute top-0 right-4 z-10', 
    boxClass: 'w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-[2rem]', 
    rotation: 12,
    emojiClass: 'text-6xl md:text-7xl' 
  },
  { 
    id: 'pottery', 
    emoji: '🏺', 
    wrapperClass: 'absolute top-[25%] -left-8 md:-left-12 z-20', 
    boxClass: 'w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-[2.5rem]', 
    rotation: -10,
    emojiClass: 'text-[5rem] md:text-[6rem]' 
  },
  { 
    id: 'needles', 
    emoji: '🪡', 
    wrapperClass: 'absolute bottom-2 right-0 md:right-2 z-10', 
    boxClass: 'w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-[2rem]', 
    rotation: 22,
    emojiClass: 'text-6xl md:text-7xl' 
  },
];

const HeroFloatingIcons = memo(() => {
  return (
    <div className="absolute top-[55%] -translate-y-1/2 right-10 lg:right-24 hidden md:block w-[320px] h-[360px] md:w-[400px] md:h-[400px] z-10 pointer-events-none mt-16">
      {/* Neon Glow Pulse Component */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[10%] w-[200px] h-[200px] blur-[90px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
      />

      {/* Floating Icons Stagger Container */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, staggerChildren: 0.2 }
          }
        }}
        initial="hidden"
        animate="visible"
        className="w-full h-full relative z-10 pointer-events-auto"
      >
        {iconsData.map((item, index) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            className={`${item.wrapperClass}`}
          >
            {/* Spinning Wrapper */}
            <motion.div
              animate={{ rotate: [item.rotation, item.rotation + 360] }}
              transition={{
                duration: 35 + index * 5, // very slow continuous spin
                repeat: Infinity,
                ease: "linear"
              }}
              className="origin-center"
            >
              {/* Floating Bouncing Wrapper */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
                whileHover={{ scale: 1.08 }}
                className={`${item.boxClass} bg-white/5 border-[1.5px] border-white/20 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:shadow-[0_0_80px_rgba(236,72,153,0.35)] transition-all duration-300 cursor-pointer overflow-hidden origin-center`}
              >
                {/* Glass Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                
                <span 
                  className={item.emojiClass} 
                  style={{ 
                    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.4)) drop-shadow(0px 0px 20px rgba(168,85,247,0.3))' 
                  }}
                >
                  {item.emoji}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

export default HeroFloatingIcons;
