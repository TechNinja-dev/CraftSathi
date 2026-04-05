import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExploreSidebar from './ExploreSidebar';
import ExploreFeed from './ExploreFeed';
import CreatePostPanel from './CreatePostPanel';
import FloatingCreateButton from './FloatingCreateButton';
import Header from '../../../component/header/Header';

export default function ExploreLayout() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080211] font-sans text-white">
      {/* Background Gradient System */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#080211] via-[#140421] to-[#05010b]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 blur-3xl rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800/40 via-transparent to-transparent mix-blend-screen scale-150 transform -translate-y-1/2" />
      
      <Header />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-8">
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[260px_1fr_360px] gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {/* Left Sidebar */}
            <div className="hidden md:block">
              <ExploreSidebar />
            </div>

            {/* Center Feed */}
            <div className="w-full">
              <ExploreFeed />
            </div>

            {/* Right Create Panel */}
            <div className="hidden lg:block relative">
              <div className="sticky top-24">
                <CreatePostPanel />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Floating action button for mobile/tablet */}
        <div className="lg:hidden">
          <FloatingCreateButton />
        </div>
      </div>
    </div>
  );
}
