import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, ShieldCheck, GraduationCap } from 'lucide-react';
import FeatureTile from './FeatureTile';

const KeyFeatures = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const features = [
    {
      icon: <Sparkles size={32} />,
      title: "AI Storytelling",
      description: "Auto-generate beautiful narratives about your craft's origin, materials, and cultural significance.",
      delay: 0.1
    },
    {
      icon: <Globe2 size={32} />,
      title: "Global Marketplace Access",
      description: "Connect instantly with verified buyers across 35+ countries looking for authentic crafts.",
      delay: 0.2
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Secure Payments",
      description: "Direct-to-bank international payouts with transparent pricing and fraud protection.",
      delay: 0.3
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Skill Development",
      description: "Access resources on modern design trends, packaging, and digital business management.",
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-16 md:mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-purple-300">
              Why CraftSathi?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">thrive.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A complete ecosystem designed specifically for the unique needs of traditional artisans entering the digital economy.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
        >
          {features.map((feature, idx) => (
             <FeatureTile 
               key={idx}
               icon={feature.icon}
               title={feature.title}
               description={feature.description}
               delay={feature.delay}
             />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default KeyFeatures;
