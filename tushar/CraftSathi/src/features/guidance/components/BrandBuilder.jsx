import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGuidanceStore } from '../store/guidanceStore';
import { Sparkles, Package, MessageSquare, Copy, RefreshCw, Bookmark } from 'lucide-react';

const packagingOptions = [
  { label: 'Eco packaging', badge: 'Recommended', color: 'green' },
  { label: 'Luxury packaging', badge: '', color: '' },
  { label: 'Export safe packaging', badge: '', color: '' },
  { label: 'Gift packaging', badge: '', color: '' },
];

export default function BrandBuilder() {
  const { brandSuggestions } = useGuidanceStore();
  const [selectedTone, setSelectedTone] = useState(brandSuggestions.tones[0]);
  const [selectedPack, setSelectedPack] = useState(packagingOptions[0].label);
  const [copiedName, setCopiedName] = useState(null);

  const handleCopy = (name) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
      <h2 className="text-2xl font-semibold text-white mb-6">Craft Brand Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Brand Names */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg"><Sparkles size={15} className="text-purple-400" /></div>
            <h3 className="text-sm font-medium text-gray-200">Brand Name Suggestions</h3>
          </div>
          <div className="flex flex-col gap-2">
            {brandSuggestions.names.map((name) => (
              <div key={name} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 group">
                <span className="text-sm text-gray-300">{name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleCopy(name)} className="p-1 text-gray-500 hover:text-purple-400">
                    <Copy size={12} />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-pink-400"><Bookmark size={12} /></button>
                  <button className="p-1 text-gray-500 hover:text-blue-400"><RefreshCw size={12} /></button>
                </div>
              </div>
            ))}
            {copiedName && <p className="text-xs text-green-400 text-center mt-1">Copied!</p>}
          </div>
        </div>

        {/* Packaging */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg"><Package size={15} className="text-orange-400" /></div>
            <h3 className="text-sm font-medium text-gray-200">Packaging Style</h3>
          </div>
          <div className="flex flex-col gap-2">
            {packagingOptions.map((p) => (
              <motion.button
                key={p.label}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPack(p.label)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-all ${
                  selectedPack === p.label
                    ? 'bg-gradient-to-r from-orange-600/30 to-yellow-600/30 border border-orange-500/40 text-white'
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {p.label}
                {p.badge && (
                  <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold">
                    {p.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Storytelling */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg"><MessageSquare size={15} className="text-pink-400" /></div>
            <h3 className="text-sm font-medium text-gray-200">Storytelling Identity</h3>
          </div>
          <div className="flex flex-col gap-2 relative">
            {brandSuggestions.tones.map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone)}
                className={`relative px-3 py-2.5 rounded-xl text-left text-sm transition-colors z-10 ${
                  selectedTone === tone ? 'text-white font-medium' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {selectedTone === tone && (
                  <motion.div
                    layoutId="toneHighlight"
                    className="absolute inset-0 bg-white/10 border border-white/15 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
