import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, X, CheckCircle2, Loader2, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const categories = ['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Paintings', 'Sculpture'];

export default function CreatePostPanel() {
  const { userData } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userId = userData?.u_Id;
    if (!userId) return;
    fetch(`${API_URL}/users_explore?userId=${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(res => { if (res?.data) setProfile(res.data); })
      .catch(() => {});
  }, [userData]);

  const displayName = profile?.u_explore_name || profile?.u_name || userData?.u_name || 'Artisan';
  const initials = displayName.charAt(0).toUpperCase();

  // Form state
  const [caption, setCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Dropzone
  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop,
  });

  // Publish post
  const handlePublish = async () => {
    if (!userData?.u_Id) { showToast('error', 'Please sign in to post.'); return; }
    if (!imageBase64) { showToast('error', 'Please upload a craft image.'); return; }
    if (!caption.trim()) { showToast('error', 'Add a caption before publishing.'); return; }

    setIsPublishing(true);
    try {
      const res = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.u_Id,
          user_name: userData.u_name || displayName,
          explore_name: profile?.u_explore_name || displayName,
          image_url: imageBase64,
          caption: caption.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('success', 'Your craft has been shared! 🎉');
        // Reset form
        setCaption('');
        setImageBase64(null);
        setImagePreview(null);
      } else {
        showToast('error', data.detail || 'Could not publish. Try again.');
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#140421]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl sticky top-24 relative"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute top-4 left-4 right-4 z-20 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${
              toast.type === 'success'
                ? 'bg-green-500/15 border-green-500/30 text-green-300'
                : 'bg-red-500/15 border-red-500/30 text-red-300'
            }`}
          >
            <CheckCircle2 size={15} className={toast.type === 'success' ? 'text-green-400' : 'text-red-400'} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-white tracking-wide">Create Craft Post</h2>
        <Sparkles size={18} className="text-purple-400" />
      </div>
      <p className="text-xs text-gray-400 mb-5">Share your latest handmade creation with the community</p>

      {/* User Header */}
      <div className="flex items-center gap-3 mb-5 bg-white/5 p-3 rounded-xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{displayName}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Craft Explorer</p>
        </div>
      </div>

      {/* Upload Area / Preview */}
      {imagePreview ? (
        <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10">
          <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover" />
          <button
            onClick={() => { setImageBase64(null); setImagePreview(null); }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full">
            <ImageIcon size={11} className="text-purple-400" />
            <span className="text-[10px] text-gray-300">Image ready</span>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`mb-4 w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 ${
            isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-black/20 hover:border-purple-400/50 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={22} className={`mb-2 ${isDragActive ? 'text-purple-400' : 'text-gray-500'}`} />
          <p className="text-xs text-gray-500">{isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">Max 5MB · JPG, PNG, WEBP</p>
        </div>
      )}

      {/* Caption Textarea */}
      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="Describe your craft story..."
        className="w-full h-20 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/50 mb-4 resize-none transition-all"
      />

      {/* Publish Button */}
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(236,72,153,0.45)' }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePublish}
        disabled={isPublishing || !imageBase64 || !caption.trim()}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPublishing ? <Loader2 size={16} className="animate-spin" /> : null}
        {isPublishing ? 'Publishing...' : 'Publish Craft'}
      </motion.button>

      <p className="text-[10px] text-center text-gray-600 mt-4">Your craft story helps preserve cultural heritage.</p>
    </motion.div>
  );
}
