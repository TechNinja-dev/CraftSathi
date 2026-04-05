import React from 'react';
import { motion } from 'framer-motion';

const categories = ['All Crafts', 'Exhibitions', 'Tutorials', 'Raw Materials'];

export default function CategoryTabs({ selectedCategory, setSelectedCategory }) {

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
