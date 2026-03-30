import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, Feather, PenTool, Image as ImageIcon, Network, Folder, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname === '/profile') {
    return null;
  }

  const navLinks = [
    { name: 'Caption', path: '/generate', icon: <PenTool size={16} /> },
    { name: 'Posts', path: '/photo', icon: <ImageIcon size={16} /> },
    { name: 'Network', path: '/network', icon: <Network size={16} /> },
    { name: 'MyStuff', path: '/mystuff', icon: <Folder size={16} /> }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'pt-3 pb-3 bg-[#0c0516]/80 backdrop-blur-lg border-b border-white/10 shadow-xl' : 'pt-5 pb-5 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-center items-center">
        {/* Glassmorphism Navigation Container */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg p-1.5 transition-all duration-300 ${scrolled ? 'w-full max-w-5xl' : 'w-full max-w-6xl'}`}
        >
          <div className="flex items-center justify-between px-2">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 mr-6 group">
              <div className="flex items-center">
                <Feather className="text-purple-400 mr-2 group-hover:text-pink-400 transition-colors" size={24} />
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white">
                  CraftSathi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-end mr-6 items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${location.pathname === link.path ? 'bg-white/10 text-white' : ''}`}
                >
                  <span className="mr-2 text-purple-400">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2 relative">
              {isAuthenticated ? (
                <Link to="/profile">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center gap-2 transform hover:-translate-y-0.5 border border-purple-500/50">
                    <User size={16} />
                    Profile
                  </button>
                </Link>
              ) : (
                <Link to="/auth">
                  <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold border border-purple-400/30 transition-all duration-300 hover:shadow-lg flex items-center gap-2">
                    <LogIn size={16} />
                    Sign In / Register
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center mr-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl bg-[#130826]/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl overflow-hidden z-40"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${location.pathname === link.path ? 'bg-purple-500/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  <span className="mr-3 text-purple-400">{link.icon}</span>
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl text-base font-bold shadow-lg"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 w-full mt-2 bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-xl text-base font-bold"
                  >
                    <LogIn size={18} />
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;