import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, CheckCircle, AlertTriangle } from 'lucide-react';
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

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />
      <div className="relative flex-1 bg-[#05010b] text-white overflow-hidden pb-24">
        
        {/* Core Global Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none fixed">
          <div className="absolute top-[20%] left-[-10%] w-[1000px] h-[800px] bg-pink-700/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8 mt-32">
          
          <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="text-center mb-16">
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <FileText size={32} />
              </div>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Terms of Service
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-400">
              Please read these terms carefully before using the CraftSathi Platform.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants} className="space-y-8">
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="text-purple-400" />
                <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                By accessing or using the CraftSathi platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the digital services.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <Scale className="text-pink-400" />
                <h2 className="text-xl font-semibold text-white">2. Platform Usage & AI Tools</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                The platform provides AI-driven tools to assist artisans with generating stories, tags, and digital portfolios. These features are intended for legitimate craft augmentation, and any malicious abuse or spam generation is strictly prohibited and will result in immediate termination of services.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <AlertTriangle className="text-purple-400" />
                <h2 className="text-xl font-semibold text-white">3. Intellectual Property</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                All cultural artifacts, designs, and stories submitted by artisans remain their exclusive intellectual property. CraftSathi only retains the right to display these on the marketplace for operational visibility.
              </p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsOfService;
