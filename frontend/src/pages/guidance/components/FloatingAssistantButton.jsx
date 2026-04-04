import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare } from 'lucide-react';

export default function FloatingAssistantButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-[#140421] border border-white/10 rounded-2xl p-5 w-72 shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white">CraftSathi AI</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Hi! I'm your AI craft advisor. Ask me about pricing, packaging, or export strategies for your craft.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['Pricing tips', 'Best markets', 'Export help'].map((q) => (
                <button key={q} className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 hover:bg-purple-500/20 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all"
        aria-label="Open CraftSathi AI Assistant"
      >
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-30 blur-md"
        />
        <Sparkles size={16} className="relative z-10" />
        <span className="relative z-10">Ask CraftSathi AI</span>
      </motion.button>
    </div>
  );
}
