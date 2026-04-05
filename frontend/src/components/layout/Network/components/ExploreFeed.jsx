import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Lock } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import PostCard from './PostCard';
import CategoryTabs from './CategoryTabs';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export default function ExploreFeed() {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (!isAuthenticated) return;
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const userId = userData?.u_Id || '';
      const res = await fetch(
        `${API_URL}/explore_posts?userId=${userId}&limit=10&page=${pageNum}`
      );
      const data = await res.json();
      const newPosts = data?.data?.posts || [];
      // Map backend fields to PostCard expected shape
      const mapped = newPosts.map(p => ({
        id: p.id,
        artisanName: p.user_name || 'Artisan',
        profileImage: p.user_avatar || '',
        location: p.location || '',
        category: p.category || 'All Crafts',
        hasAIAudio: !!p.ai_story,
        aiStory: p.ai_story || '',
        craftImage: p.image_url || '',
        caption: p.prompt || '',
        likes: p.likes || 0,
        comments: p.comments || 0,
      }));
      append ? setPosts(prev => [...prev, ...mapped]) : setPosts(mapped);
      setHasMore(data?.data?.has_more ?? false);
    } catch (err) {
      console.error('Failed to fetch explore posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [isAuthenticated, userData]);

  useEffect(() => {
    if (isAuthenticated) fetchPosts(1, false);
  }, [isAuthenticated, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 600) {
        setPage(prev => {
          const next = prev + 1;
          fetchPosts(next, true);
          return next;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, fetchPosts]);

  const filteredPosts = selectedCategory === 'All Crafts'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  // ── Not logged in: show sign-in modal overlay ──────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto relative">
        {/* Blurred placeholder feed behind modal */}
        <div className="flex flex-col gap-6 mt-6 blur-sm pointer-events-none select-none opacity-40">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-64 w-full animate-pulse" />
          ))}
        </div>

        {/* Sign-in modal */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-30"
          >
            <div className="bg-[#130826]/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-[0_0_80px_rgba(168,85,247,0.25)] max-w-sm w-full mx-4">
              {/* Glow ring */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.4)]">
                <Lock size={32} className="text-white" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Join the Artisan Network
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Sign in to discover crafts from artisans across India and share your own creations with the world.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full">
                <Sparkles size={13} />
                <span>AI-powered craft stories await you</span>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/auth')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/auth')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white font-semibold text-sm transition-all"
                >
                  Create Account
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Logged in: loading state ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={36} className="animate-spin text-pink-500" />
      </div>
    );
  }

  // ── Logged in: empty feed ──────────────────────────────────────────────────
  if (!loading && posts.length === 0) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto">
        <div className="sticky top-0 z-20 bg-[#080211]/80 backdrop-blur-xl pb-2 pt-1">
          <CategoryTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles size={28} className="text-purple-400" />
          </div>
          <p className="text-gray-400 text-center font-medium">No posts yet. Be the first to share your craft!</p>
        </div>
      </div>
    );
  }

  // ── Logged in: real feed ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="sticky top-0 z-20 bg-[#080211]/80 backdrop-blur-xl pb-2 pt-1 border-b border-transparent">
        <CategoryTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>

      <div className="flex flex-col gap-6 mt-6 pb-24 lg:pb-8">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 size={28} className="animate-spin text-pink-500" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="flex flex-col items-center py-10 gap-3">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Sparkles className="text-purple-400" size={20} />
          </div>
          <p className="text-gray-500 text-sm font-semibold tracking-wider uppercase">You've seen it all</p>
        </div>
      )}
    </div>
  );
}
