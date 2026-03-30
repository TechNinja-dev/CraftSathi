import React from 'react';
import { motion } from 'framer-motion';

const TimelineStep = ({ stepNumber, title, description, icon, isLast }) => {
  return (
    <div className="relative flex flex-col md:flex-row items-center md:items-start group w-full md:w-1/4">
      {/* Desktop connector line */}
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-[50%] right-[-50%] h-[2px] bg-gradient-to-r from-purple-500/50 to-pink-500/50 -z-10">
          <motion.div 
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: stepNumber * 0.2 }}
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          />
        </div>
      )}
      
      {/* Mobile connector line */}
      {!isLast && (
        <div className="md:hidden absolute top-[4rem] bottom-[-2rem] left-8 w-[2px] bg-purple-500/30 -z-10"></div>
      )}

      {/* Node & Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: stepNumber * 0.15 }}
        className="flex md:flex-col items-start md:items-center w-full relative z-10"
      >
        {/* Node Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:border-pink-500/50 group-hover:text-purple-300 group-hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all duration-300 flex-shrink-0 z-20">
          {icon}
        </div>
        
        {/* Content */}
        <div className="ml-6 md:ml-0 md:mt-6 text-left md:text-center mt-2 flex-grow">
          <div className="text-xs font-bold text-pink-500 tracking-wider uppercase mb-1">Step {stepNumber}</div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 max-w-[200px] mx-auto leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineStep;
