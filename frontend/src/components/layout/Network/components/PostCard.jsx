import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Sparkles, MoreVertical } from 'lucide-react';
import InteractionBar from './InteractionBar';

export default function PostCard({ post }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)] transition-all duration-300 group"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
            <img src={post.profileImage} alt={post.artisanName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white leading-tight">{post.artisanName}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin size={12} className="text-purple-400" />
              {post.location}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* AI Narrative Badge */}
      {post.hasAIAudio && post.aiStory && (
        <div className="px-4 pb-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl relative overflow-hidden group-hover:border-purple-500/40 transition-colors duration-300">
            <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={14} className="text-pink-400 animate-pulse" />
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">AI Narrative</span>
            </div>
            <p className="text-sm text-purple-100/80 italic leading-relaxed">
              "{post.aiStory}"
            </p>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="px-4">
        <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-white/5 bg-black/20">
          <motion.img 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            src={post.craftImage} 
            alt="Craft Piece" 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        </div>
      </div>

      {/* Action Bar */}
      <InteractionBar post={post} />

      {/* Caption */}
      <div className="px-4 pb-5 pt-1 text-sm text-gray-300 leading-relaxed">
        <p>{post.caption}</p>
      </div>
    </motion.div>
  );
}
