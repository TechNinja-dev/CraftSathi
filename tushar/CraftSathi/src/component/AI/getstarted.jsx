// components/Ai/GetStarted.jsx
import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Description from './Description';
import Img from './Img';
import Video from './Video';
import { motion } from 'framer-motion';
const GetStarted = () => {
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const initSmoothScrolling = async () => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54x4u2o
        direction: 'vertical', // vertical, horizontal
        gestureDirection: 'vertical', // vertical, horizontal, both
        smooth: true,
        mouseMultiplier: 1, // affects scroll speed
        smoothTouch: false, // smooth touch for mobile
        touchMultiplier: 2, // affects scroll speed on mobile
        infinite: false, // infinite scroll
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initSmoothScrolling();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">AI Content Generation Suite</h1>
          <p className="text-gray-300 text-lg mb-8 text-center max-w-2xl mx-auto">
            Harness the power of Google Gemini AI to generate descriptions, images, and videos from your prompts.
          </p>
        </motion.div>

        <div className="space-y-8">
          <Description />
          <Img />
          <Video />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Powered by Google Gemini AI • CraftSathi</p>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStarted;