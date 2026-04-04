import React from 'react';
import { motion } from 'framer-motion';
import HeroFloatingIcons from './HeroFloatingIcons';

const pills = [
  { label: 'Pottery Wholesale', icon: '🏺' },
  { label: 'Fine Brushes', icon: '🎨' },
  { label: 'Artisan Needles', icon: '🧵' },
];

export default function GuidanceHero() {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 pb-10 pt-4">
      {/* Left: Text */}
      <div className="flex-1 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-semibold leading-tight mb-4"
        >
          <span className="text-white">Where Should I</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Sell My Craft?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-gray-400 text-base max-w-lg mb-8 leading-relaxed"
        >
          Upload your creations and let CraftSathi's AI analyze global demand,
          calculate profit margins, and find your perfect digital storefront.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-wrap gap-3"
        >
          {pills.map((pill) => (
            <motion.button
              key={pill.label}
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-gray-300 hover:border-purple-500/40 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
            >
              <span>{pill.icon}</span>
              {pill.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Right: Floating Craft Icons Module */}
      <HeroFloatingIcons />
    </div>
  );
}
