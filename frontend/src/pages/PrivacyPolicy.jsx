import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx'; 
import Footer from '../components/layout/Footer.jsx'; 

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />
      <div className="relative flex-1 bg-[#05010b] text-white overflow-hidden pb-24">
        
        {/* Core Global Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none fixed">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-700/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8 mt-32">
          
          <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="text-center mb-16">
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <ShieldCheck size={32} />
              </div>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-400">
              Last updated: April 2026. Your privacy and data security are our top priorities.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants} className="space-y-8">
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <Database className="text-pink-400" />
                <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                We collect information to provide better services to our artisans and buyers. This includes:
                - Personal identification information (Name, email address, phone number).
                - Craft specialization and portfolio media for artisans.
                - Transaction and interaction history on the platform.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <Eye className="text-purple-400" />
                <h2 className="text-xl font-semibold text-white">2. How We Use Your Data</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                The information we collect is used in the following ways:
                - To personalize your experience and generate AI narratives for your crafts.
                - To process transactions securely on our marketplace.
                - To improve our platform, optimize AI models, and ensure a secure environment.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <Lock className="text-pink-400" />
                <h2 className="text-xl font-semibold text-white">3. Data Protection</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                We implement a variety of premium security measures to maintain the safety of your personal information. Our identity bridge uses decentralized tech to make sure your data is never implicitly sold or shared with external data brokers.
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
