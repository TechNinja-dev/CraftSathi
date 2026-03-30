import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Award, Eye } from 'lucide-react';

const TrustSection = () => {
  const trustSignals = [
    {
      icon: <Award size={32} className="text-pink-400" />,
      title: "Verified Artisans",
      desc: "Every artisan undergoes a strict Govt. ID & skill verification."
    },
    {
      icon: <CreditCard size={32} className="text-purple-400" />,
      title: "Secure Payments",
      desc: "Escrow-based payouts ensuring zero fraud for both parties."
    },
    {
      icon: <ShieldCheck size={32} className="text-blue-400" />,
      title: "Authentic Crafts",
      desc: "Blockchain-backed certification for craft origin & materials."
    },
    {
      icon: <Eye size={32} className="text-green-400" />,
      title: "100% Transparent",
      desc: "No hidden fees. Full earnings transparency for artisans."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#0c0516] relative border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all text-center flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                {signal.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{signal.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{signal.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
