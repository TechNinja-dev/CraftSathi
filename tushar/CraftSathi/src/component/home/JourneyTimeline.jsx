import React from 'react';
import { motion } from 'framer-motion';
import TimelineStep from './TimelineStep';
import { UserPlus, ImagePlus, Sparkles, Globe } from 'lucide-react';

const JourneyTimeline = () => {
  const steps = [
    {
      stepNumber: 1,
      title: "Create Profile",
      description: "Sign up and build your verifiable artisan identity on the blockchain.",
      icon: <UserPlus size={28} />
    },
    {
      stepNumber: 2,
      title: "Upload Craft",
      description: "Take simple photos of your handmade products. We handle the rest.",
      icon: <ImagePlus size={28} />
    },
    {
      stepNumber: 3,
      title: "AI Optimization",
      description: "Our AI generates rich stories, translations, and global pricing.",
      icon: <Sparkles size={28} />
    },
    {
      stepNumber: 4,
      title: "Reach Customers",
      description: "Connect instantly with global buyers and receive international payouts.",
      icon: <Globe size={28} />
    }
  ];

  return (
    <section className="py-20 md:py-32 relative bg-[#0c0516]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-16 md:mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-purple-300">
              Simple Onboarding
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Global Sales.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We've removed all technical barriers. Going from a local workshop to an international storefront takes just four simple steps.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch md:items-start justify-between gap-12 md:gap-0 relative max-w-5xl mx-auto pl-8 md:pl-0">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              icon={step.icon}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default JourneyTimeline;
