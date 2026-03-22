import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative p-6 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl group overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-violet-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-violet-500/10 transition-colors duration-500"></div>
      
      {/* Icon */}
      <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-shadow duration-300">
        <div className="text-white w-7 h-7 flex items-center justify-center">
            {icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </div>
      
      {/* Animated Bottom Border */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
    </motion.div>
  );
};

export default FeatureCard;
