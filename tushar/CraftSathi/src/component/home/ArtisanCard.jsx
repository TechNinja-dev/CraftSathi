import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const ArtisanCard = ({ image, name, category, location, experience }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="min-w-[280px] w-[280px] snap-start bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-4 group hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
    >
      <div className="w-full h-48 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opacity-60"></div>
        <img 
          src={image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600&auto=format&fit=crop"} 
          alt={name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute bottom-3 left-3 z-20">
          <span className="px-2 py-1 text-xs font-semibold bg-white/20 backdrop-blur-md text-white rounded-md border border-white/20">
            {category}
          </span>
        </div>
      </div>
      
      <div className="px-1">
        <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <MapPin size={14} className="mr-1 text-pink-500" />
          {location}
        </div>
        
        <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-1">
          <span className="text-xs text-gray-500">Experience</span>
          <span className="text-sm font-semibold text-purple-400">{experience} Years</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtisanCard;
