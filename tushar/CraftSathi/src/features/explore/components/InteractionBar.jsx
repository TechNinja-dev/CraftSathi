import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useExploreStore } from '../store/exploreStore';
import * as Dialog from '@radix-ui/react-dialog';

export default function InteractionBar({ post }) {
  const { likedPosts, savedPosts, toggleLike, toggleSave } = useExploreStore();
  const isLiked = likedPosts.has(post.id);
  const isSaved = savedPosts.has(post.id);
  
  const [commentOpen, setCommentOpen] = useState(false);

  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex gap-4">
        
        {/* Like Button */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => toggleLike(post.id)}
          className="flex items-center gap-1.5 text-gray-400 group"
        >
          <motion.div animate={isLiked ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart 
              size={22} 
              className={`transition-colors ${isLiked ? 'fill-pink-500 text-pink-500 dropdown-shadow' : 'group-hover:text-pink-400'}`} 
            />
          </motion.div>
          <span className={`text-sm font-medium ${isLiked ? 'text-pink-500' : 'group-hover:text-white transition-colors'}`}>
            {post.likes}
          </span>
        </motion.button>

        {/* Comment Button via Radix Dialog */}
        <Dialog.Root open={commentOpen} onOpenChange={setCommentOpen}>
          <Dialog.Trigger asChild>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1.5 text-gray-400 group hover:text-white transition-colors"
            >
              <MessageCircle size={22} />
              <span className="text-sm font-medium">{post.comments}</span>
            </motion.button>
          </Dialog.Trigger>
          <AnimatePresence>
            {commentOpen && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto" asChild>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                </Dialog.Overlay>
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md pointer-events-auto" asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#140421] border border-white/10 shadow-2xl rounded-2xl p-6 text-white m-4"
                  >
                    <Dialog.Title className="text-lg font-semibold mb-4 text-white">Comments</Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-400 mb-6">Join the conversation with {post.artisanName}</Dialog.Description>
                    <div className="flex flex-col gap-4">
                      {/* Placeholder for comments UI */}
                      <div className="bg-white/5 rounded-xl p-4 text-sm text-center text-gray-500 border border-white/5">
                        Comments module placeholder
                      </div>
                      <button 
                        onClick={() => setCommentOpen(false)}
                        className="mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>

        {/* Share Button Placeholder */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-1.5 text-gray-400 group hover:text-white transition-colors"
        >
          <Share2 size={20} />
        </motion.button>

      </div>

      {/* Save Button */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => toggleSave(post.id)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <Bookmark size={22} className={isSaved ? 'fill-purple-400 text-purple-400' : ''} />
      </motion.button>
    </div>
  );
}
