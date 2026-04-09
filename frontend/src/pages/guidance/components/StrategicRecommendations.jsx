import React from 'react';
import { motion } from 'framer-motion';

import { useInView } from 'react-intersection-observer';
import { ShoppingBag, Package, Instagram, Sparkles } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const iconMap = {
  'Etsy Global Intelligence': <ShoppingBag size={18} className="text-white" />,
  'Amazon Karigar Insights': <Package size={18} className="text-white" />,
  'Instagram Shop Trends': <Instagram size={18} className="text-white" />,
};

export default function StrategicRecommendations({ data }) {
  const strategicRecommendations = data || [];
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Strategic Recommendations</h2>
          <p className="text-sm text-gray-400 mt-0.5">AI-powered marketplace positioning insights</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-pink-500 rounded-full" />
          <span className="text-xs font-semibold text-pink-400">Live Global Pulse</span>
        </div>
      </div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {strategicRecommendations.map((rec) => (
          <RecommendationCard key={rec.platform} rec={rec} icon={iconMap[rec.platform]} />
        ))}
      </motion.div>
    </div>
  );
}

function RecommendationCard({ rec, icon }) {
  const data = rec.trend.map((v, i) => ({ i, v }));
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ scale: 1.03, translateY: -6 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0">
          {icon || <Sparkles size={18} className="text-white" />}
        </div>
        <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold">{rec.confidence}</span>
      </div>

      <h3 className="text-base font-bold text-white mb-4 leading-snug">{rec.platform}</h3>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Profit Meter</span>
          <span className="text-white font-bold">{rec.profitScore}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rec.profitScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>

      <div className="h-16 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id={`trend-${rec.platform}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="v" stroke={`url(#trend-${rec.platform})`} strokeWidth={2.5} dot={false} animationDuration={1500} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
