import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, title: 'Upload & AI Analysis', desc: 'Photos processed, metrics generated', status: 'completed' },
  { id: 2, title: 'Set Export Pricing', desc: 'Global pricing strategy calculated', status: 'current' },
  { id: 3, title: 'Publish to Marketplaces', desc: 'Sync inventory to storefronts', status: 'pending' },
];

export default function LaunchpadProgress() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1 text-center">Your Launchpad</h2>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 text-center font-bold">1 Step Remaining</p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-white/8 z-0" />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '50%' }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute left-[19px] top-4 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 z-0"
        />

        <div className="flex flex-col gap-6 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex gap-4">
              <div className="shrink-0 mt-0.5">
                {step.status === 'completed' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                    className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}
                {step.status === 'current' && (
                  <div className="w-10 h-10 rounded-full bg-black/40 border-2 border-pink-500 flex items-center justify-center relative">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 rounded-full border border-pink-500/40 animate-ping" />
                  </div>
                )}
                {step.status === 'pending' && (
                  <div className="w-10 h-10 rounded-full bg-black/40 border-2 border-white/8 flex items-center justify-center">
                    <span className="text-white/25 text-sm font-bold">{step.id}</span>
                  </div>
                )}
              </div>
              <div className={step.status === 'pending' ? 'opacity-40' : 'opacity-100'}>
                <h3 className="font-bold text-white text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{step.desc}</p>
                {step.status === 'current' && (
                  <button className="mt-2 bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors shadow-lg">
                    Resume →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
