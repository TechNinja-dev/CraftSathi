import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Globe, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6 px-4 md:px-8'}`}
    >
      <div className={`mx-auto max-w-7xl transition-all duration-300 ${isScrolled ? 'w-[95%] md:w-[90%] bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'w-full px-4'}`}>
        <div className={`flex items-center justify-between ${isScrolled ? 'px-6 py-3' : ''}`}>
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold group-hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all">
              CS
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-wide">
              CraftSathi
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Story', 'Network', 'Gallery', 'Marketplace', 'AI Studio'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition-colors px-2 py-1">
              <Globe size={16} className="mr-1.5" />
              <span>EN</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
            
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </button>
            <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-0.5">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Menu size={24} />
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm z-[70] bg-[#0c0516] border-l border-white/10 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  CraftSathi
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                 {['Home', 'Story', 'Network', 'Gallery', 'Marketplace', 'AI Studio'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-6">
                <button className="flex items-center justify-center w-full py-4 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  <User size={18} className="mr-2" /> Login
                </button>
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all">
                  Get Started
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
