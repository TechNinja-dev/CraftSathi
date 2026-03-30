import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Loader2, User, Camera, Sparkles, ImagePlus, Send, Globe, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../../components/layout/Footer';
import Navbar from '../../../components/layout/Navbar';

const NetworkPage = () => {
  const { isAuthenticated, userData } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  
  // Create Post States
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const userId = isAuthenticated && userData ? userData.u_Id : null;
      const url = `${API_URL}/explore_posts?${userId ? `userId=${userId}&` : ''}limit=10&page=${pageNum}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const result = await response.json();
      const newPosts = result.data.posts;
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(result.data.has_more);
      
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    // TODO: Call API to like/unlike post
  };

  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchPosts(nextPage, true);
        return nextPage;
      });
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !selectedImage) return;
    
    setIsPosting(true);
    // Simulate API call for creating a post
    setTimeout(() => {
      setIsPosting(false);
      setPostText('');
      setSelectedImage(null);
      showToast('Your masterpiece has been shared!', 'success');
      // In a real app, we would prepend the new post to the posts array here
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0516] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0516] flex items-center justify-center">
        <div className="text-center bg-[#130826] p-8 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-red-400 mb-6 font-semibold">{error}</p>
          <button 
            onClick={() => fetchPosts(1, false)}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0516] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
      <Navbar />
      
      {/* Background glow effects */}
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-28 pb-20 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Posts Feed */}
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight">The Artisan Network</h1>
            <p className="text-gray-400 mt-3 text-lg">Discover, connect, and be inspired by global creators.</p>
          </motion.div>

          <div className="space-y-8">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  key={post.id} 
                  className="bg-[#130826]/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        {post.user_name ? post.user_name.charAt(0).toUpperCase() : <User />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg tracking-wide">{post.user_name}</h3>
                        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">{post.time_ago || 'Recently'}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">•••</button>
                  </div>

                  {/* Post Image */}
                  <div className="relative w-full bg-black/50 overflow-hidden group">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.prompt} 
                        className="w-full max-h-[600px] object-contain transform transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center bg-white/5">
                        <Camera size={48} className="text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Post Actions & Content */}
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="transition-transform hover:scale-110 group"
                        >
                          <Heart 
                            size={28} 
                            className={`transition-colors duration-300 ${likedPosts[post.id] ? 'fill-pink-500 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-gray-400 group-hover:text-pink-400'}`} 
                          />
                        </button>
                        <button className="transition-transform hover:scale-110 text-gray-400 hover:text-white">
                          <MessageCircle size={28} />
                        </button>
                        <button className="transition-transform hover:scale-110 text-gray-400 hover:text-indigo-400">
                          <Share2 size={28} />
                        </button>
                      </div>
                      <button className="transition-transform hover:scale-110 text-gray-400 hover:text-yellow-400">
                        <Bookmark size={28} />
                      </button>
                    </div>

                    <p className="font-bold text-sm mb-3 tracking-wide">{post.likes || Math.floor(Math.random() * 100) + 12} <span className="text-gray-400">impressions</span></p>

                    <div className="mb-4 leading-relaxed">
                      <span className="font-bold mr-3">{post.user_name}</span>
                      <span className="text-gray-300">{post.prompt}</span>
                    </div>

                    {post.comments > 0 && (
                      <button className="text-gray-500 text-sm hover:text-gray-300 transition-colors mb-3 font-semibold tracking-wide">
                        View all {post.comments} insights
                      </button>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Share your thoughts..." 
                        className="w-full bg-transparent focus:outline-none placeholder-gray-500 text-sm text-white"
                      />
                      <button className="text-pink-500 font-bold text-sm tracking-wider uppercase hover:text-pink-400 transition-colors">Post</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {loadingMore && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-pink-500" size={32} />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Sparkles className="text-purple-400" />
              </div>
              <p className="text-gray-400 font-semibold tracking-wider uppercase">You've seen it all</p>
            </div>
          )}

          {posts.length === 0 && !loading && (
            <div className="text-center py-20 bg-[#130826]/50 rounded-3xl border border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">The canvas is empty</h3>
              <p className="text-gray-400">Be the first to share your craft with the world.</p>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Create Post Widget */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-[120px]">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#130826]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-purple-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Share Your Craft</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1 mt-1">
                    <Globe size={12} /> Public
                  </p>
                </div>
              </div>

              <textarea 
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What masterpiece are you working on today?"
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none min-h-[120px] transition-all custom-scrollbar"
              />

              {/* Image Preview */}
              <AnimatePresence>
                {selectedImage && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-4 rounded-xl overflow-hidden border border-white/10"
                  >
                    <img src={selectedImage} alt="Preview" className="w-full h-auto max-h-[200px] object-cover" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors backdrop-blur-md"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-pink-400 hover:bg-white/10 transition-all group relative"
                  >
                    <ImagePlus size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                
                <button 
                  onClick={handleCreatePost}
                  disabled={isPosting || (!postText.trim() && !selectedImage)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isPosting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Broadcast</span>
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Trending/Suggested Widget underneath */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-[#130826]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Trending Styles</h3>
              <div className="flex flex-wrap gap-2">
                {['#PotteryArt', '#Woodworking', '#DigitalCraft', '#Textiles', '#ResinArt'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300 hover:border-pink-500/50 hover:text-pink-400 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NetworkPage;