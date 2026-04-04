import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Globe2, ShieldCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function ExportLogisticsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const logisticsData = [
    {
      title: 'Eco Smart Packaging',
      icon: <Package size={24} />,
      speed: 'Standard',
      safety: 'Medium',
      exportReady: 'Yes',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Domestic Tier Shipping',
      icon: <Truck size={24} />,
      speed: 'Fast',
      safety: 'High',
      exportReady: 'No',
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Global Express',
      icon: <Globe2 size={24} />,
      speed: 'Very Fast',
      safety: 'High',
      exportReady: 'Yes',
      color: 'from-purple-500/20 to-fuchsia-500/20',
      iconColor: 'text-fuchsia-400',
    },
    {
      title: 'Fragile Protection',
      icon: <ShieldCheck size={24} />,
      speed: 'Custom',
      safety: 'Maximum',
      exportReady: 'Yes',
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-semibold text-white">Logistics & Shipping</h2>
      <div 
        ref={ref}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {logisticsData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0`} />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-lg bg-black/40 p-2 ${item.iconColor}`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>
                  <span className="block text-xs uppercase text-gray-500">Speed</span>
                  <span className="font-medium text-gray-200">{item.speed}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500">Safety</span>
                  <span className="font-medium text-gray-200">{item.safety}</span>
                </div>
                <div className="col-span-2 pt-1">
                  <span className="block text-xs uppercase text-gray-500">Export Ready</span>
                  <span className={`font-medium ${item.exportReady === 'Yes' ? 'text-green-400' : 'text-gray-300'}`}>
                    {item.exportReady}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
