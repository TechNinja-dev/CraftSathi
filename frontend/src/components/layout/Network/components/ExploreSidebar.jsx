import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bookmark, Grid, Pencil, Camera, X, Check, Loader2, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import TopCategories from './TopCategories';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const navItems = [
  { icon: Home, label: 'Home', path: '/network' },
  { icon: Bookmark, label: 'Saved', path: '/saved-posts' },
  { icon: Grid, label: 'My Posts', path: '/profile' },
];

export default function ExploreSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [exploreName, setExploreName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [avatarHover, setAvatarHover] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = () => {
    const userId = userData?.u_Id;
    if (!userId) return;
    fetch(`${API_URL}/users_explore?userId=${userId}`)
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res?.data) {
          setProfile(res.data);
          setExploreName(res.data.u_explore_name || res.data.u_name || '');
        }
      })
      .catch(() => {});
  };

  useEffect(() => { fetchProfile(); }, [userData]);

  const displayName = profile?.u_explore_name || profile?.u_name || userData?.u_name || 'Artisan';
  const avatarUrl = profile?.avatar || null;
  const initials = displayName.charAt(0).toUpperCase();
  const totalPosts = profile?.total_posts ?? '—';
  const totalFollowers = profile?.total_followers ?? '—';

  // ── Avatar: direct upload on the card ──────────────────────────────────────
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !userData?.u_Id) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await fetch(`${API_URL}/profile/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.u_Id, avatar: reader.result })
      });
      fetchProfile();
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = async () => {
    if (!userData?.u_Id) return;
    await fetch(`${API_URL}/profile/avatar?user_id=${userData.u_Id}`, { method: 'DELETE' });
    fetchProfile();
  };

  // ── Explore name save ───────────────────────────────────────────────────────
  const handleSave = async () => {
    const userId = userData?.u_Id;
    if (!userId) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await fetch(`${API_URL}/profile/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, explore_name: exploreName })
      });
      setSaveMsg('Saved!');
      fetchProfile();
      setTimeout(() => { setEditOpen(false); setSaveMsg(''); }, 700);
    } catch {
      setSaveMsg('Error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit name modal via portal ──────────────────────────────────────────────
  const modal = (
    <AnimatePresence>
      {editOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: -20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            className="z-[9999] w-full max-w-sm px-4"
          >
            <div className="bg-[#130826] border border-purple-500/30 rounded-3xl p-7 shadow-[0_0_80px_rgba(168,85,247,0.25)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight">Edit Explore Name</h2>
                <button onClick={() => setEditOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>

              {/* Explore Name Input */}
              <div className="mb-6">
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Explore Name</label>
                <input
                  type="text"
                  value={exploreName}
                  onChange={e => setExploreName(e.target.value)}
                  placeholder="Your craft identity name"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
                <p className="text-[10px] text-gray-600 mt-1.5">This is how other artisans see you on the feed</p>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-60"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {saving ? 'Saving...' : saveMsg || 'Save Changes'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-sm font-semibold transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div 
        className="sticky top-24 flex flex-col gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />

          {/* Avatar with hover overlay — upload & delete directly */}
          <div
            className="relative z-10 w-20 h-20 rounded-xl border-2 border-white/10 mb-4 overflow-hidden cursor-pointer"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
            )}

            {/* Hover controls */}
            <AnimatePresence>
              {avatarHover && userData?.u_Id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1"
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[10px] text-white font-semibold bg-purple-500/60 hover:bg-purple-500 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Camera size={11} /> Upload
                  </button>
                  {avatarUrl && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="flex items-center gap-1 text-[10px] text-white font-semibold bg-red-500/60 hover:bg-red-500 px-2 py-1 rounded-lg transition-colors"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

          <h2 className="text-lg font-semibold tracking-wide text-white">{displayName}</h2>
          <p className="text-sm text-gray-400 mb-4">Craft Explorer</p>

          {/* Edit Name Button */}
          {userData?.u_Id && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEditOpen(true)}
              className="mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-purple-500/40 transition-all"
            >
              <Pencil size={12} /> Edit Name
            </motion.button>
          )}

          <div className="flex w-full justify-between px-2 text-center">
            <div>
              <p className="text-lg font-semibold text-white">{totalPosts}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Posts</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{totalFollowers}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Followers</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/network');
            
            return (
              <motion.button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-400 shadow-[inset_0px_0px_20px_rgba(168,85,247,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-purple-400' : 'text-gray-400'} />
                {item.label}
              </motion.button>
            );
          })}
        </div>

        <TopCategories />
      </motion.div>

      {/* Portal modal — rendered at document.body to escape sticky/transform context */}
      {ReactDOM.createPortal(modal, document.body)}
    </>
  );
}
