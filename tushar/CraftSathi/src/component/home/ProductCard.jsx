import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';

const ProductCard = ({ image, title, location, price, isAuthentic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-[#120a1f] border border-white/5 rounded-2xl overflow-hidden group hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isAuthentic && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-md border border-green-500/30 text-green-400 text-xs font-medium rounded-full">
              <ShieldCheck size={12} /> Authentic
            </div>
          )}
        </div>
        <button className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-pink-500 hover:bg-black/60 transition-colors">
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <MapPin size={12} className="mr-1 text-pink-500" />
          {location}
        </div>
        <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-purple-400 transition-colors">{title}</h3>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            <span className="text-xs text-gray-500 block mb-0.5">Starting from</span>
            <span className="text-lg font-bold text-white">${price}</span>
          </div>
          <button className="px-4 py-1.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-purple-600 hover:border-purple-500 transition-colors">
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
