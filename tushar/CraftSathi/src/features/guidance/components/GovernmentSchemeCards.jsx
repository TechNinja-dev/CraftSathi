import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function GovernmentSchemeCards() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const schemes = [
    {
      name: 'PM Vishwakarma',
      benefits: 'Toolkit ₹15,000 + Skill Training',
      eligibility: 'Artisans & Craftspeople',
      theme: 'purple',
    },
    {
      name: 'MSME Registration',
      benefits: 'Collateral Free Loans, Subsidies',
      eligibility: 'All business sizes',
      theme: 'blue',
    },
    {
      name: 'ODOP Scheme',
      benefits: 'Global Marketing Support',
      eligibility: 'District specific crafts',
      theme: 'pink',
    },
    {
      name: 'GeM Portal',
      benefits: 'Direct Govt Procurement',
      eligibility: 'Registered Sellers',
      theme: 'emerald',
    }
  ];

  const getThemeColors = (theme) => {
    switch (theme) {
      case 'purple': return 'from-purple-500/20 to-purple-900/20 text-purple-400 hover:border-purple-500/30';
      case 'blue': return 'from-blue-500/20 to-blue-900/20 text-blue-400 hover:border-blue-500/30';
      case 'pink': return 'from-pink-500/20 to-pink-900/20 text-pink-400 hover:border-pink-500/30';
      case 'emerald': return 'from-emerald-500/20 to-emerald-900/20 text-emerald-400 hover:border-emerald-500/30';
      default: return 'from-gray-500/20 to-gray-900/20 text-gray-400 hover:border-gray-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-purple-500/20 p-2">
          <Award size={20} className="text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Govt. Schemes</h2>
      </div>

      <div ref={ref} className="space-y-4">
        {schemes.map((scheme, i) => (
          <motion.div
            key={scheme.name}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br transition-all duration-300 p-4 ${getThemeColors(scheme.theme)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{scheme.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{scheme.benefits}</p>
                <div className="mt-3 inline-block rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-gray-400">
                  {scheme.eligibility}
                </div>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                <ArrowRight size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
