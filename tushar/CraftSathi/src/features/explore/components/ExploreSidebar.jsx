import React from 'react';
import { motion } from 'framer-motion';
import { Home, Bookmark, Grid, TrendingUp, Layers } from 'lucide-react';
import { useAuth } from '../../../context/authcontext';
import TopCategories from './TopCategories';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Bookmark, label: 'Saved', active: false },
  { icon: Grid, label: 'My Posts', active: false },
  { icon: TrendingUp, label: 'Trending', active: false },
  { icon: Layers, label: 'Categories', active: false },
];

export default function ExploreSidebar() {
  const { currentUser } = useAuth();
  
  // Create fallback mock user data for presentation if not authenticated
  const user = currentUser || {
    displayName: 'Artisan Name',
    photoURL: 'https://i.pravatar.cc/150?img=68',
    email: 'artisan@craftsathi.com'
  };

  return (
    <motion.div 
      className="sticky top-24 flex flex-col gap-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Profile Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center flex-shrink-0 relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
        
        <div className="relative z-10 w-20 h-20 rounded-xl overflow-hidden border-2 border-white/10 mb-4 group-hover:border-purple-400 transition-colors duration-300">
          <img 
            src={user.photoURL || 'https://i.pravatar.cc/150?img=68'} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <h2 className="text-lg font-semibold tracking-wide text-white">{user.displayName || 'Guest User'}</h2>
        <p className="text-sm text-gray-400 mb-6">Master Weaver</p>
        
        <div className="flex w-full justify-between px-2 text-center">
          <div>
            <p className="text-lg font-semibold text-white">1.2k</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Posts</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">8.4k</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Followers</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col gap-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                item.active 
                  ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-400 shadow-[inset_0px_0px_20px_rgba(168,85,247,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <Icon size={18} className={item.active ? 'text-purple-400' : 'text-gray-400'} />
              {item.label}
            </motion.button>
          )
        })}
      </div>

      {/* Categories Filter Component */}
      <TopCategories />

    </motion.div>
  );
}
