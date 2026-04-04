import React, { useState } from 'react';
import { useAuth } from '../../../context/authcontext';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const categories = ['Pottery', 'Textiles', 'Jewelry', 'Woodwork'];

export default function CreatePostPanel() {
  const { currentUser } = useAuth();
  
  const user = currentUser || {
    displayName: 'Artisan Name',
    photoURL: 'https://i.pravatar.cc/150?img=68',
  };

  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [isGenerating, setIsGenerating] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: () => { console.log('File dropped') }
  });

  const handleGenerateStory = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDescription((prev) => prev ? prev + '\n\n' : '' + 'Generated AI Story: The texture of this piece tells a tale of ancient techniques reinvented for the modern era. Carefully crafted with precision and passion.');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#140421]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl sticky top-24"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-bold text-white tracking-wide">Create Craft Post</h2>
        <Sparkles size={18} className="text-purple-400" />
      </div>
      <p className="text-xs text-gray-400 mb-6">Share your latest handmade creation with the community</p>

      {/* User Header */}
      <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
        <div>
          <p className="text-sm font-semibold text-white">{user.displayName}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Digital Craft Explorer</p>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`mb-4 w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-black/20 hover:border-purple-400/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={24} className="text-gray-400 mb-2" />
        <p className="text-xs text-gray-400">Upload your craft image</p>
      </div>

      {/* Description Textarea */}
      <textarea 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your craft story"
        className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/50 mb-4 resize-none transition-all"
      />

      {/* Category Dropdown (Radix) */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="w-full mb-4 bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-gray-300 transition-colors">
          <span>{selectedCategory}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="z-50 min-w-[300px] bg-[#1a0b2e] border border-white/10 rounded-xl p-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
            {categories.map((cat) => (
              <DropdownMenu.Item 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-2 text-sm text-gray-200 cursor-pointer outline-none hover:bg-purple-500/20 rounded-lg hover:text-white transition-colors"
              >
                {cat}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Location Input */}
      <div className="relative mb-6">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          placeholder="Add craft location"
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />
      </div>

      {/* AI Generate Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateStory}
        disabled={isGenerating}
        className="w-full mb-6 relative group overflow-hidden rounded-xl p-[2px]"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 opacity-70 group-hover:opacity-100 animate-gradient bg-[length:200%_auto] transition-opacity duration-300" />
        <div className="relative bg-[#140421] rounded-[10px] px-4 py-3 flex items-center justify-center gap-2 group-hover:bg-transparent transition-colors duration-300">
          {isGenerating ? (
             <Sparkles size={16} className="text-white animate-spin" />
          ) : (
             <Sparkles size={16} className="text-pink-400 group-hover:text-white" />
          )}
          <span className="text-sm font-semibold text-white">
            {isGenerating ? 'Generating...' : 'Generate AI Craft Story'}
          </span>
        </div>
      </motion.button>

      {/* Privacy Segments */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-gray-400">Visibility</span>
        <div className="flex bg-black/40 rounded-full p-1 border border-white/5">
          <button className="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Public</button>
          <button className="px-3 py-1 text-gray-400 hover:text-white text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors">Followers</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(236,72,153,0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
        >
          Publish Craft
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-sm font-semibold transition-all"
        >
          Save Draft
        </motion.button>
      </div>
      
      <p className="text-[10px] text-center text-gray-500 mt-6 mt-auto">Your craft story helps preserve cultural heritage.</p>

    </motion.div>
  );
}
