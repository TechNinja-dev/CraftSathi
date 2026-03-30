import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader2, Trash2, Download, Bookmark, Image as ImageIcon, ChevronRight, Calendar, ChevronDown, ChevronUp, Copy, Check, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const MyStuff = () => {
  const { isAuthenticated, userData } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('images');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [savedCaptions, setSavedCaptions] = useState([]);
  const [totalCaptionsCount, setTotalCaptionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [copiedCaptionIndex, setCopiedCaptionIndex] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const fetchImages = async () => {
    if (!isAuthenticated || !userData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = userData.u_Id || userData.uid;
      const response = await fetch(`${API_URL}/api/mystuff?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch images from backend.');
      }
      
      const data = await response.json();
      setGeneratedImages(data.images || []);
      
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCaptions = async () => {
    if (!isAuthenticated || !userData) return;

    setLoadingCaptions(true);
    try {
      const userId = userData.u_Id || userData.uid;
      const response = await fetch(`${API_URL}/api/get-captions?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved captions');
      }
      
      const data = await response.json();
      setSavedCaptions(data.caption_groups || []);
      setTotalCaptionsCount(data.total || 0); 
      
    } catch (err) {
      console.error('Error fetching captions:', err);
      showToast(err.message, 'error');
    } finally {
      setLoadingCaptions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userData) {
      fetchImages();
      fetchSavedCaptions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userData]);

  const handleDeleteClick = (item, type, captionIndex = null) => {
    setItemToDelete({ item, captionIndex });
    setDeleteType(type);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !userData) return;

    setShowModal(false);
    
    try {
      const userId = userData.u_Id || userData.uid;
      
      if (deleteType === 'image') {
        const response = await fetch(`${API_URL}/api/delete-image?imageId=${itemToDelete.item.id}&userId=${userId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to delete image.');
        }
        
        await fetchImages();
        showToast('Image deleted successfully!', 'success');
        
      } else if (deleteType === 'caption') {
        // Delete individual caption
        const response = await fetch(
          `${API_URL}/api/delete-caption?userId=${userId}&image_url=${encodeURIComponent(itemToDelete.item.image_url)}&captionIndex=${itemToDelete.captionIndex}`,
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to delete caption.');
        }
        
        await fetchSavedCaptions();
        showToast('Caption deleted successfully!', 'success');
        
      } else if (deleteType === 'captionGroup') {
        // Delete entire caption group
        const response = await fetch(
          `${API_URL}/api/delete-caption-group?userId=${userId}&image_url=${encodeURIComponent(itemToDelete.item.image_url)}`,
          { method: 'DELETE' }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to delete caption group.');
        }
        
        await fetchSavedCaptions();
        showToast('Caption group deleted successfully!', 'success');
      }
      
    } catch (err) {
      console.error('Error deleting:', err);
      showToast(err.message, 'error');
    } finally {
      setItemToDelete(null);
      setDeleteType(null);
    }
  };

  const copyCaption = async (text, groupIndex, captionIdx) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionIndex(`${groupIndex}-${captionIdx}`);
    showToast('Caption copied to clipboard!', 'success');
    setTimeout(() => setCopiedCaptionIndex(null), 2000);
  };

  const downloadImage = async (imageUrl, index) => {
    try {
      if (imageUrl.startsWith('data:image')) {
        const link = document.createElement('a');
        link.download = `craft-image-${Date.now()}-${index}.png`;
        link.href = imageUrl;
        link.click();
      } else {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `craft-image-${Date.now()}-${index}.png`;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
      }
      showToast('Image downloaded!', 'success');
    } catch (err) {
      console.error('Error downloading image:', err);
      showToast('Failed to download image', 'error');
    }
  };

  const toggleExpand = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#0c0516] pt-20 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#130826]/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <Bookmark size={40} className="text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Your Vault</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Please sign in to view your magnificent generated artworks and carefully crafted stories.
          </p>
          <Link 
            to="/auth" 
            className="inline-block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:-translate-y-1 transition-all"
          >
            Sign In Now ✨
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading && activeTab === 'images') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0516] pt-20">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
        <p className="text-gray-400 animate-pulse">Unlocking your creative vault...</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0c0516] font-sans selection:bg-pink-500/30 flex flex-col relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
        
        {/* Header & Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Creative Vault</span>
            </h1>
            <p className="text-gray-400 mt-4 text-lg">Your personal archive of AI-generated masterpieces and stories.</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#130826]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-1.5 flex gap-2 shadow-xl">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'images'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon size={20} />
              <span>Posts</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'images' ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
                {generatedImages.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('captions')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'captions'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark size={20} />
              <span>Captions</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'captions' ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
                {totalCaptionsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Images Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'images' && (
            <motion.div 
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {generatedImages.length === 0 ? (
                <div className="text-center py-20 bg-[#130826]/40 backdrop-blur-sm border border-white/5 rounded-3xl shadow-xl max-w-3xl mx-auto">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <ImageIcon size={40} className="text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Blank Canvas</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">You haven't generated any artworks yet. The infinite gallery awaits your prompts.</p>
                  <Link 
                    to="/photo"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  >
                    <Sparkles size={20} className="text-purple-400" />
                    Generate Masterpiece
                  </Link>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {generatedImages.map((image, idx) => (
                    <motion.div variants={itemVariants} key={image.id} className="bg-[#130826]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:border-purple-500/30 transition-all duration-300 group flex flex-col">
                      <div className="relative aspect-square bg-black/40 overflow-hidden">
                        <img 
                          src={image.image_url} 
                          alt={image.prompt} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0516]/90 via-[#0c0516]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <button
                            onClick={() => downloadImage(image.image_url, idx)}
                            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-400 hover:scale-110 transition-all text-white shadow-lg"
                            title="Download"
                          >
                            <Download size={20} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(image, 'image')}
                            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-red-500 hover:border-red-400 hover:scale-110 transition-all text-white shadow-lg"
                            title="Delete"
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed font-medium mb-4">
                          "{image.prompt || 'Untitled Creation'}"
                        </p>
                        <div className="flex items-center gap-2 mt-auto text-xs text-gray-500 font-semibold uppercase tracking-wider">
                          <Calendar size={14} className="text-purple-400/70" />
                          <span>{formatDate(image.created_at)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Saved Captions Tab */}
          {activeTab === 'captions' && (
            <motion.div 
              key="captions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {loadingCaptions ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
                  <p className="text-gray-400 animate-pulse">Retrieving your stories...</p>
                </div>
              ) : savedCaptions.length === 0 ? (
                <div className="text-center py-20 bg-[#130826]/40 backdrop-blur-sm border border-white/5 rounded-3xl shadow-xl max-w-3xl mx-auto">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Bookmark size={40} className="text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">The Book is Empty</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">You haven't curated any captions yet. Start writing stories for your craft.</p>
                  <Link 
                    to="/generate"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                  >
                    <Sparkles size={20} className="text-pink-400" />
                    Weave New Stories
                  </Link>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-6 max-w-5xl mx-auto"
                >
                  {savedCaptions.map((group, groupIndex) => {
                    const isExpanded = expandedGroups[groupIndex];
                    return (
                      <motion.div variants={itemVariants} key={groupIndex} className={`bg-[#130826]/60 backdrop-blur-xl border ${isExpanded ? 'border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'border-white/5 shadow-lg'} rounded-2xl overflow-hidden transition-all duration-300`}>
                        {/* Header with image thumbnail and expand/collapse */}
                        <div 
                          className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => toggleExpand(groupIndex)}
                        >
                          <div className="flex items-center gap-5">
                            {/* Thumbnail */}
                            <div className="w-20 h-20 bg-black/40 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
                              {group.image_url ? (
                                <img 
                                  src={group.image_url} 
                                  alt="Reference" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={28} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="px-3 py-1 bg-pink-500/10 text-pink-300 text-xs font-bold rounded-full uppercase tracking-wider border border-pink-500/20">
                                  {group.caption_count} {group.caption_count === 1 ? 'Entry' : 'Entries'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 font-medium">
                                Curated on {formatDate(group.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(group, 'captionGroup'); }}
                              className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                              title="Delete all entries for this image"
                            >
                              <Trash2 size={20} />
                            </button>
                            <div
                              className={`p-3 rounded-xl transition-all ${isExpanded ? 'bg-pink-500/20 text-pink-300' : 'bg-white/5 text-gray-400'}`}
                            >
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                        </div>

                        {/* Captions List (expanded) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden bg-black/20"
                            >
                              <div className="p-5 sm:p-6 space-y-4 border-t border-white/5">
                                {group.captions.map((caption, captionIdx) => (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: captionIdx * 0.05 }}
                                    key={captionIdx} 
                                    className="bg-white/5 border border-white/5 rounded-xl p-4 sm:p-5 hover:bg-white/10 hover:border-pink-500/30 transition-all group/item"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed flex-1">{caption}</p>
                                      <div className="flex items-center gap-2 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); copyCaption(caption, groupIndex, captionIdx); }}
                                          className="flex-shrink-0 p-2 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all"
                                          title="Copy caption"
                                        >
                                          {copiedCaptionIndex === `${groupIndex}-${captionIdx}` ? (
                                            <Check size={18} className="text-pink-400" />
                                          ) : (
                                            <Copy size={18} />
                                          )}
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(group, 'caption', captionIdx); }}
                                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                          title="Remove entry"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Preview of first caption when collapsed */}
                        {!isExpanded && group.captions.length > 0 && (
                          <div className="px-6 pb-6 pt-0">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                              <p className="text-gray-400 text-sm line-clamp-2 italic">
                                "{group.captions[0]}"
                              </p>
                              {group.captions.length > 1 && (
                                <p className="text-xs font-bold text-pink-500/80 mt-2 tracking-wider">
                                  + {group.captions.length - 1} MORE {group.captions.length - 1 === 1 ? 'STORY' : 'STORIES'} HIDDEN
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#130826] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Confirm Deletion</h3>
              <p className="text-gray-400 mb-8 text-center leading-relaxed">
                {deleteType === 'caption' 
                  ? 'Are you sure you want to delete this caption? This action cannot be undone.'
                  : deleteType === 'captionGroup'
                  ? 'Are you sure you want to delete all captions for this image? This action cannot be undone.'
                  : 'Are you sure you want to delete this generated artwork? This action cannot be undone.'}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all font-semibold hover:-translate-y-0.5"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MyStuff;