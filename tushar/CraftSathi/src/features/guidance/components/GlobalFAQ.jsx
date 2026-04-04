import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuidanceStore } from '../store/guidanceStore';
import { Search, ChevronDown, BookOpen } from 'lucide-react';

const chips = ['Beginner', 'Expert', 'Export', 'Packaging'];

export default function GlobalFAQ() {
  const { faqData } = useGuidanceStore();
  const [openIndex, setOpenIndex] = useState(0);
  const [activeChip, setActiveChip] = useState('Beginner');
  const [query, setQuery] = useState('');

  const filtered = faqData.filter(f => f.question.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={22} className="text-purple-400" />
        <h2 className="text-2xl font-semibold text-white">Global Craft FAQ</h2>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search export regulations, packaging standards..."
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/40 transition-all"
        />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {chips.map(c => (
          <button
            key={c}
            onClick={() => setActiveChip(c)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeChip === c
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-transparent hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 overflow-hidden bg-black/20">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-medium text-gray-200 pr-8">{faq.question}</span>
              <motion.div animate={{ rotate: openIndex === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} className="text-gray-500 shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pb-4 text-sm text-gray-400 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-6">No FAQs match your search.</p>
        )}
      </div>
    </div>
  );
}
