import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Search, ChevronDown, BookOpen } from 'lucide-react';

const chips = ['Beginner', 'Expert', 'Export', 'Packaging'];

export default function GlobalFAQ() {
  const allFaqData = {
    Beginner: [
      { question: "How do I create my first digital storefront?", answer: "Start by registering an account, uploading clear photos of your crafts, and writing a short authentic story about your heritage." },
      { question: "Do I need a registered business to sell?", answer: "No, you can start as an individual artisan. However, as your sales grow, registering a sole proprietorship is recommended for tax purposes." },
      { question: "How do I price my handmade items?", answer: "Calculate your material costs, add an hourly wage for your labor, and include a 15-20% profit margin to determine your baseline price." },
      { question: "What should I write in my craft descriptions?", answer: "Focus on the materials used, the time it takes to make, and the cultural history behind the technique. Buyers love authentic stories." }
    ],
    Expert: [
      { question: "How can I scale production without losing quality?", answer: "Consider training apprentices or standardizing your raw material supply chain. Introduce minor mechanical assistance for non-artistic repetitive tasks." },
      { question: "Do I need a trademark for my craft brand?", answer: "While not strictly required, a trademark protects your brand identity from counterfeits, which is crucial as you scale internationally." },
      { question: "How do I negotiate B2B wholesale contracts?", answer: "Always establish a Minimum Order Quantity (MOQ), require a 30-50% upfront deposit, and clearly define lead times before signing any B2B agreement." },
      { question: "Should I diversify my product line?", answer: "Yes, offering a mix of high-ticket statement pieces and lower-cost accessible items helps stabilize your monthly revenue stream." }
    ],
    Export: [
      { question: "How do I start exporting my crafts?", answer: "Begin by registering for an IEC (Import Export Code) and connect with regional export promotion councils. Ensure your packaging meets international standards." },
      { question: "What are the customs duties for handmade goods?", answer: "Many countries offer duty-free or reduced tariffs for certified handmade artisan goods under specific GSP (Generalized System of Preferences) quotas." },
      { question: "Which shipping carrier is best for international orders?", answer: "DHL and FedEx offer reliable tracking for high-ticket items, though local postal EMS is more cost-effective for smaller goods." },
      { question: "How do I handle international currency conversions?", answer: "Use integrated FinTech payment gateways like Stripe or Razorpay which automatically convert foreign currencies into INR at the daily exchange rate." }
    ],
    Packaging: [
      { question: "What are the best packaging practices for fragile items?", answer: "Use double-walled corrugated boxes, eco-friendly bubble wrap alternatives, and clearly label 'Fragile'. Biodegradable packing peanuts are highly recommended." },
      { question: "How can I make my packaging sustainable?", answer: "Switch to recycled kraft paper, water-activated paper tape, and avoid single-use plastics to appeal to eco-conscious global buyers." },
      { question: "What is volumetric weight?", answer: "Shipping carriers charge based on the box's physical size, not just its actual weight. Always use the smallest safe box possible to reduce shipping costs." },
      { question: "Should I include a thank you note?", answer: "Yes! A handwritten thank you note or a printed card detailing the story of the craft drastically increases repeat purchases and positive reviews." }
    ]
  };
  const [openIndex, setOpenIndex] = useState(0);
  const [activeChip, setActiveChip] = useState('Beginner');
  const [query, setQuery] = useState('');

  const currentFaqs = allFaqData[activeChip] || allFaqData['Beginner'];
  const filtered = currentFaqs.filter(f => f.question.toLowerCase().includes(query.toLowerCase()));

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
