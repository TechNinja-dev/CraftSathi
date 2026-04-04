import React from 'react';
import { motion } from 'framer-motion';

const topCategories = ['Pottery', 'Textiles', 'Jewelry', 'Woodwork'];

export default function TopCategories() {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-2">Top Categories</h3>
      
      <div className="flex flex-wrap gap-2 px-2">
        {topCategories.map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] cursor-pointer transition-all duration-300"
          >
            {category}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
