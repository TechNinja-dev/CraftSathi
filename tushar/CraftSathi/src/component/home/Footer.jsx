import React from 'react';
import { Twitter, Instagram, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
                CS
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                CraftSathi
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering Indian artisans by connecting their timeless craftsmanship with the global digital economy through AI.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-800 transition-all"><Facebook size={18} /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Marketplace</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">All Crafts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Artisan Directory</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Authenticity Check</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Buyer Protection</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Community</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">For Artisans</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">AI Studio Tools</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Pricing Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Stay Updated</h4>
            <p className="text-gray-400 mb-4 text-sm">Join 10,000+ subscribers and get the latest artisan stories weekly.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                type="submit" 
                className="bg-white text-black font-bold rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CraftSathi Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
