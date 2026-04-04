import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Package, MessageSquare, Copy, CheckCircle2, Info, Target, ArrowRight } from 'lucide-react';

const steps = [
  { id: 1, title: 'Choose Your Brand Name', icon: Sparkles },
  { id: 2, title: 'Packaging Style', icon: Package },
  { id: 3, title: 'Storytelling Identity', icon: MessageSquare },
  { id: 4, title: 'Target Market', icon: Target },
];

const brandNames = ['Heritage Clay Studio', 'Jaipur Blue Pottery Works', 'Indigo Earth Crafts'];

const packagingOptions = [
  { id: 'eco', label: 'Eco packaging', recommended: true, icon: '🌿', hint: 'Best for sustainable buyers' },
  { id: 'luxury', label: 'Luxury packaging', recommended: false, icon: '✨', hint: 'Best for premium gifting' },
  { id: 'export', label: 'Export-safe packaging', recommended: false, icon: '✈️', hint: 'Improves global delivery success rate.' },
  { id: 'gift', label: 'Gift packaging', recommended: false, icon: '🎁', hint: 'Best for holiday seasons' },
];

const storyOptions = [
  { id: 'cultural', label: 'Cultural Heritage', preview: 'Inspired by centuries-old pottery traditions from Rajasthan.' },
  { id: 'minimalist', label: 'Minimalist Modern', preview: 'Clean lines and conscious design for the modern home.' },
  { id: 'luxury', label: 'Luxury Artisan', preview: 'Exquisite handcrafted pieces crafted with uncompromising quality.' },
  { id: 'legacy', label: 'Legacy Tradition', preview: 'Handed down through generations, keeping ancient crafts alive.' },
];

const marketOptions = [
  { id: 'local', label: 'Local Handmade Market', price: '₹800 – ₹1,500', buyer: 'Local craft enthusiasts' },
  { id: 'insta', label: 'Instagram Craft Buyers', price: '₹1,500 – ₹3,500', buyer: 'Millennial aesthetic shoppers' },
  { id: 'export', label: 'Export Marketplace Buyers', price: '₹4,500 – ₹8,000', buyer: 'Etsy USA & Global buyers' },
  { id: 'premium', label: 'Premium Collectors', price: '₹8,500+', buyer: 'Boutique art collectors' },
];

export default function CraftBrandBuilderAssistant() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    name: null,
    packaging: null,
    story: null,
    market: null,
  });

  const [copiedName, setCopiedName] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    if (currentStep < 4) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 600);
    } else {
      setTimeout(() => setShowSummary(true), 600);
    }
  };

  const handleCopy = (e, name) => {
    e.stopPropagation();
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  const generateAIDescription = () => {
    setIsGenerating(true);
    setAiDescription('');
    const fullText = `${selections.name} represents timeless handcrafted ceramic artistry inspired by traditional ${selections.story.split(' ')[0]} heritage and designed for ${selections.market.split(' ')[0]} collectors who value authenticity and craftsmanship.`;
    
    let i = 0;
    const interval = setInterval(() => {
      setAiDescription(prev => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 25);
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 w-full shadow-[0_0_80px_rgba(168,85,247,0.05)] text-white">
      {/* Header & Progress */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold tracking-tight mb-2">Craft Brand Builder</h2>
        <p className="text-sm text-gray-400 mb-6">Create your handmade product's brand identity step-by-step.</p>
        
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs font-semibold text-purple-400 tracking-widest uppercase">
            {showSummary ? 'Complete' : `Step ${currentStep} / 4`}
          </span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: showSummary ? '100%' : `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-purple-500/20 rounded-xl">
                  {React.createElement(steps[currentStep-1].icon, { size: 20, className: "text-purple-400" })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Step {currentStep} — {steps[currentStep-1].title}</h3>
                </div>
              </div>

              {/* STEP 1: BRAND NAME */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400">Your brand name helps customers remember your craft identity.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {brandNames.map(name => {
                      const isSelected = selections.name === name;
                      return (
                        <motion.div
                          key={name}
                          whileHover={{ y: -4 }}
                          onClick={() => handleSelect('name', name)}
                          className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isSelected ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                          style={{ borderWidth: '1px' }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-lg text-gray-200">{name}</h4>
                            <button onClick={(e) => handleCopy(e, name)} aria-label="Copy name" className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-white/5 rounded-md transition-colors">
                              {copiedName === name ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                            </button>
                          </div>
                          {isSelected && (
                            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-medium bg-purple-500/20 px-2.5 py-1 rounded-md">
                              <CheckCircle2 size={12} /> Selected Brand Name
                            </motion.span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl">
                    <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200">Tip: Simple names are easier for customers to remember and search for globally.</p>
                  </div>
                </div>
              )}

              {/* STEP 2: PACKAGING */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400">Packaging protects your craft and improves customer experience.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {packagingOptions.map(pack => {
                      const isSelected = selections.packaging === pack.label;
                      return (
                        <motion.div
                          key={pack.id}
                          whileHover={{ y: -4 }}
                          onClick={() => handleSelect('packaging', pack.label)}
                          className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between h-full ${isSelected ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : pack.recommended ? 'bg-black/20 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                          style={{ borderWidth: '1px' }}
                        >
                          <div>
                            <div className="text-3xl mb-3">{pack.icon}</div>
                            <h4 className="font-medium text-white mb-1.5">{pack.label}</h4>
                            <p className="text-xs text-gray-400 line-clamp-2">{pack.hint}</p>
                          </div>
                          {pack.recommended && !isSelected && (
                            <div className="mt-4 inline-flex self-start px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-green-500/20 text-green-400 border border-green-500/20">
                              Recommended
                            </div>
                          )}
                          {isSelected && (
                            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-pink-300 font-medium">
                              <CheckCircle2 size={14} /> Selected
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl">
                    <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200">Tip: Eco packaging improves export acceptance across European and North American borders.</p>
                  </div>
                </div>
              )}

              {/* STEP 3: STORYTELLING */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400">Your story helps customers connect emotionally with your craft.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storyOptions.map(tone => {
                      const isSelected = selections.story === tone.label;
                      return (
                        <motion.div
                          key={tone.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          onClick={() => handleSelect('story', tone.label)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                          style={{ borderWidth: '1px' }}
                        >
                          <h4 className={`font-medium mb-2 ${isSelected ? 'text-purple-300' : 'text-gray-200'}`}>{tone.label}</h4>
                          <p className="text-sm text-gray-400 italic">"{tone.preview}"</p>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl">
                    <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200">Tip: Authentic storytelling increases product trust and justifies premium pricing.</p>
                  </div>
                </div>
              )}

              {/* STEP 4: MARKET POSITIONING */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-400">Where you sell dictates your price ceiling and buyer expectations.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketOptions.map(market => {
                       const isSelected = selections.market === market.label;
                       return (
                        <motion.div
                          key={market.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          onClick={() => handleSelect('market', market.label)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-start justify-between ${isSelected ? 'bg-gradient-to-br from-pink-500/20 to-orange-500/10 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                          style={{ borderWidth: '1px' }}
                        >
                          <div>
                            <h4 className="font-medium text-white mb-1">{market.label}</h4>
                            <p className="text-xs text-gray-400 mb-2">{market.buyer}</p>
                            <span className="inline-flex px-2 py-1 rounded bg-black/40 text-green-300 font-mono text-xs border border-white/5">Expected: {market.price}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="text-pink-400" size={24} />}
                        </motion.div>
                       );
                    })}
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl">
                    <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200">Tip: Export marketplaces offer exactly 2x-3x higher price tolerance than local markets.</p>
                  </div>
                </div>
              )}

            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center text-center pt-4 pb-8"
            >
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-4 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                <Sparkles size={32} className="text-pink-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Your Craft Brand Blueprint</h3>
              <p className="text-gray-400 text-sm max-w-md mb-8">You have successfully laid the foundation for your brand. Here is your actionable identity blueprint.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl text-left mb-8">
                <div className="bg-black/20 border border-white/10 rounded-xl p-5">
                  <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-1 block">Brand Name</span>
                  <p className="text-lg text-white font-medium">{selections.name}</p>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-xl p-5">
                  <span className="text-xs text-green-400 uppercase tracking-widest font-semibold mb-1 block">Packaging Type</span>
                  <p className="text-lg text-white font-medium">{selections.packaging}</p>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-xl p-5">
                  <span className="text-xs text-pink-400 uppercase tracking-widest font-semibold mb-1 block">Story Identity</span>
                  <p className="text-lg text-white font-medium">{selections.story}</p>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-xl p-5">
                  <span className="text-xs text-orange-400 uppercase tracking-widest font-semibold mb-1 block">Target Market</span>
                  <p className="text-lg text-white font-medium">{selections.market}</p>
                  <p className="text-xs text-gray-500 mt-1">Expected margin increase automatically predicted</p>
                </div>
              </div>

              <div className="w-full max-w-3xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6 text-left">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" /> AI Brand Description Generator
                  </h4>
                  {!aiDescription && !isGenerating && (
                    <button 
                      onClick={generateAIDescription}
                      className="text-xs font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                    >
                      Generate Description <ArrowRight size={14} />
                    </button>
                  )}
                </div>
                
                <div className="min-h-[80px]">
                  {isGenerating || aiDescription ? (
                    <p className="text-base text-purple-100/90 leading-relaxed italic border-l-2 border-pink-500/50 pl-4 py-1">
                      "{aiDescription}"
                      {isGenerating && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2.5 h-4 ml-1 bg-purple-400 align-middle" />}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Click generate to automatically create an AI-optimized brand bio instantly ready for Etsy or Instagram.</p>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
