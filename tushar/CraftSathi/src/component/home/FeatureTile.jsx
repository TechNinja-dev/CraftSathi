import React from 'react';
import { motion } from 'framer-motion';

const FeatureTile = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="flex flex-col md:flex-row items-center md:items-start p-6 bg-[#1a1025]/50 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-lg hover:shadow-purple-500/20 hover:border-purple-400/50 transition-all duration-300 gap-4"
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 border border-white/5 flex items-center justify-center text-pink-400 drop-shadow-md">
        {icon}
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-lg font-bold text-gray-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureTile;
