import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import PostCard from './PostCard';
import { useAuth } from '../../../../context/AuthContext';

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData } = useAuth();
  const userId = userData?.u_Id;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        // Assuming API base URL is available or proxied
        const res = await fetch(`http://localhost:8000/posts/saved?userId=${userId}`);
        const data = await res.json();
        
        if (data.status === 'success') {
          setPosts(data.data.posts);
        } else {
          setError(data.message || 'Failed to fetch saved posts');
        }
      } catch (err) {
        setError(err.message || 'Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSavedPosts();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 inline-block"
            >
              Saved Posts
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mt-2"
            >
              Your personal collection of crafted inspirations.
            </motion.p>
          </div>
          
          {/* Content States */}
          {loading ? (
            <div className="flex justify-center items-center py-20 min-h-[40vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-r-2 border-purple-500/20 border-t-purple-500"></div>
            </div>
          ) : error ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 backdrop-blur-md"
            >
              <span className="block text-lg font-medium">{error}</span>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/20"
              >
                Try Again
              </button>
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
              
              <svg className="w-16 h-16 mx-auto text-purple-400/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h2 className="text-2xl text-white font-semibold">No saved posts yet</h2>
              <p className="text-gray-400 mt-3 max-w-sm mx-auto">
                Explore the network feed and save your favorite posts to view them here.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedPosts;
