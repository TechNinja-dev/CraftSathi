import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const stories = [
  {
    img: 'https://i.pravatar.cc/150?img=68',
    name: "Radhika's Silk Revolution",
    quote: '"CraftSathi\'s AI suggested I target the Japanese market. My income grew 420% in 11 months."',
    stat: '+420%',
    statLabel: 'Growth',
    statColor: 'text-pink-400',
    glowColor: 'from-purple-500/10',
  },
  {
    img: 'https://i.pravatar.cc/150?img=11',
    name: 'Kutch Mud Art Global',
    quote: '"I transitioned to eco-packaging and overstocked ahead of my Etsy viral moment thanks to CraftSathi."',
    stat: '12 Countries',
    statLabel: 'Target Market',
    statColor: 'text-cyan-400',
    glowColor: 'from-cyan-500/10',
  },
];

export default function SuccessStories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Artisan Success Circles</h2>
        <p className="text-sm text-gray-400">Learn from makers who scaled local businesses to global icons.</p>
      </div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {stories.map((s, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.02 }}
            className={`relative bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 overflow-hidden group hover:border-white/20 transition-all`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg z-10">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 z-10">
              <p className="font-bold text-white text-sm mb-1">{s.name}</p>
              <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-3">{s.quote}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{s.statLabel}</p>
                  <p className={`font-bold text-sm flex items-center gap-1 ${s.statColor}`}>{s.stat} <ArrowUpRight size={12} /></p>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
