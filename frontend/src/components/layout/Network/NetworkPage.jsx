import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Loader2, User, Camera, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Footer from '../Footer';

const NetworkPage = () => {
  const { isAuthenticated, userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchPosts(1, false)}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display text-brand-text">Explore</h1>
          <p className="text-gray-500 mt-2">Discover amazing crafts from artisans around the world</p>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-hover flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.user_name}</h3>
                    <p className="text-xs text-gray-400">{post.time_ago || 'Recently'}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">•••</button>
              </div>

              {/* Post Image */}
              <div className="relative aspect-square bg-gray-100">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.prompt} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={48} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="transition-transform hover:scale-110"
                    >
                      <Heart 
                        size={24} 
                        className={likedPosts[post.id] ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} 
                      />
                    </button>
                    <button className="transition-transform hover:scale-110">
                      <MessageCircle size={24} className="text-gray-600 hover:text-brand-primary" />
                    </button>
                    <button className="transition-transform hover:scale-110">
                      <Share2 size={24} className="text-gray-600 hover:text-brand-primary" />
                    </button>
                  </div>
                  <button className="transition-transform hover:scale-110">
                    <Bookmark size={24} className="text-gray-600 hover:text-brand-primary" />
                  </button>
                </div>

                {/* Likes Count */}
                <p className="font-semibold text-sm mb-2">{post.likes || 0} likes</p>

                {/* Caption */}
                <div className="mb-2">
                  <span className="font-semibold mr-2">{post.user_name}</span>
                  <span className="text-gray-700 text-sm">{post.prompt}</span>
                </div>

                {/* Comments Preview */}
                {post.comments > 0 && (
                  <button className="text-gray-400 text-sm hover:text-gray-600 mt-1">
                    View all {post.comments} comments
                  </button>
                )}

                {/* Add Comment */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="w-full text-sm bg-transparent focus:outline-none placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
          </div>
        )}

        {/* No More Posts */}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-400 py-8">
            You've seen all posts! 🎉
          </p>
        )}

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-brand-text mb-2">No posts yet</h3>
            <p className="text-gray-500">Check back later for new crafts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkPage;