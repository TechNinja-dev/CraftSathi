import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Globe } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

function RecommendationCard({ title, icon, difficulty, score, roi, details, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(168,85,247,0.05)] backdrop-blur-md transition-all sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
            difficulty === 'Easy'
              ? 'bg-green-500/20 text-green-400'
              : difficulty === 'Medium'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {difficulty}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Confidence Score</span>
          <span className="font-medium text-white">{score}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: '0%' }}
            animate={inView ? { width: `${score}%` } : { width: '0%' }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-400">
        <div>
          <span className="block text-xs uppercase text-gray-500">Expected ROI</span>
          <span className="font-semibold text-white">{roi}</span>
        </div>
        <div>
          <span className="block text-xs uppercase text-gray-500">Best For</span>
          <span className="font-medium text-white">{details}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function MarketRecommendationCards() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-semibold text-white">Market Recommendations</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        <RecommendationCard
          title="Etsy Global"
          icon={<Globe size={20} />}
          difficulty="Medium"
          score={82}
          roi="High"
          details="Unique handmade"
          delay={0.1}
        />
        <RecommendationCard
          title="Amazon Handmade"
          icon={<ShoppingBag size={20} />}
          difficulty="Hard"
          score={68}
          roi="Very High"
          details="High-volume crafts"
          delay={0.2}
        />
        <RecommendationCard
          title="Local Exhibitions"
          icon={<TrendingUp size={20} />}
          difficulty="Easy"
          score={95}
          roi="Medium"
          details="Community sales"
          delay={0.3}
        />
      </div>
    </div>
  );
}
