import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useInView } from 'react-intersection-observer';
import { TrendingUp, Instagram, ShoppingBag, Globe } from 'lucide-react';

const scenarios = [
  { icon: <Instagram size={18} className="text-white" />, label: 'Instagram Shop', range: '₹1.25L – ₹1.80L', risk: 'Low', riskColor: 'green' },
  { icon: <ShoppingBag size={18} className="text-white" />, label: 'Etsy Global', range: '₹2.50L – ₹3.00L', risk: 'Medium', riskColor: 'yellow' },
  { icon: <Globe size={18} className="text-white" />, label: 'Local Exhibition', range: '₹30K – ₹60K', risk: 'High', riskColor: 'red' },
];

export default function ProfitForecastChart() {
  const profitForecast = [
    { month: 'Jan', profit: 4000 },
    { month: 'Feb', profit: 5500 },
    { month: 'Mar', profit: 4800 },
    { month: 'Apr', profit: 7200 },
    { month: 'May', profit: 8500 },
    { month: 'Jun', profit: 9800 },
  ];
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Future Profit Forecast</h2>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">
          <TrendingUp size={13} /> Projected Growth +50%
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="bg-black/20 rounded-xl border border-white/5 p-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(8,2,17,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(12px)' }}
                itemStyle={{ color: '#fff', fontWeight: 700 }}
                cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="profit" stroke="url(#profitStroke)" strokeWidth={3} fill="url(#profitFill)" fillOpacity={1} animationDuration={1800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3">
          {scenarios.map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${i === 0 ? 'from-purple-500 to-pink-500' : i === 1 ? 'from-orange-400 to-red-500' : 'from-blue-500 to-cyan-500'} shadow-lg shrink-0`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-200">{s.label}</p>
                <p className="text-xs text-white font-bold mt-0.5">{s.range}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-${s.riskColor}-500/20 bg-${s.riskColor}-500/10 text-${s.riskColor}-400 shrink-0`}>
                {s.risk}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
