import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader2, Trash2, Download, Bookmark, Image as ImageIcon, ChevronRight, Calendar, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-bg pt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={40} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text mb-4">You need to be logged in</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your saved images and captions.
          </p>
          <Link 
            to="/auth" 
            className="inline-block px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading && activeTab === 'images') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg pt-20">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg to-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-brand-text">
            My Stuff
          </h1>
          <p className="text-gray-500 mt-2">Your generated images and saved captions</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'images'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={18} />
                Images
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {generatedImages.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('captions')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'captions'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={18} />
                Saved Captions
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  {totalCaptionsCount}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Images Tab */}
        {activeTab === 'images' && (
          <>
            {generatedImages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No generated images yet.</p>
                <Link 
                  to="/photo"
                  className="inline-block mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
                >
                  Generate Your First Image
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {generatedImages.map((image, idx) => (
                  <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group">
                    <div className="relative aspect-square bg-gray-100">
                      <img 
                        src={image.image_url} 
                        alt={image.prompt} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => downloadImage(image.image_url, idx)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                          title="Download"
                        >
                          <Download size={18} className="text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(image, 'image')}
                          className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm line-clamp-2">{image.prompt || 'Generated Image'}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>{formatDate(image.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Saved Captions Tab - Grouped View */}
        {activeTab === 'captions' && (
          <>
            {loadingCaptions ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
              </div>
            ) : savedCaptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <Bookmark size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No saved captions yet.</p>
                <Link 
                  to="/generate"
                  className="inline-block mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
                >
                  Generate & Save Captions
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {savedCaptions.map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                    {/* Header with image thumbnail and expand/collapse */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {group.image_url ? (
                            <img 
                              src={group.image_url} 
                              alt="Reference" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-text">
                            {group.caption_count} {group.caption_count === 1 ? 'Caption' : 'Captions'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Saved on {formatDate(group.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(group, 'captionGroup')}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete all captions"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => toggleExpand(groupIndex)}
                          className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                          title={expandedGroups[groupIndex] ? 'Collapse' : 'Expand'}
                        >
                          {expandedGroups[groupIndex] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Captions List (expanded) */}
                    {expandedGroups[groupIndex] && (
                      <div className="p-4 space-y-3">
                        {group.captions.map((caption, captionIdx) => (
                          <div key={captionIdx} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-gray-700 flex-1">{caption}</p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyCaption(caption, groupIndex, captionIdx)}
                                  className="flex-shrink-0 p-1 text-gray-400 hover:text-brand-primary transition-colors"
                                  title="Copy caption"
                                >
                                  {copiedCaptionIndex === `${groupIndex}-${captionIdx}` ? (
                                    <Check size={16} className="text-green-500" />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(group, 'caption', captionIdx)}
                                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete this caption"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Preview of first caption when collapsed */}
                    {!expandedGroups[groupIndex] && group.captions.length > 0 && (
                      <div className="p-4 pt-0">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-500 text-sm line-clamp-2">
                            "{group.captions[0]}"
                          </p>
                          {group.captions.length > 1 && (
                            <p className="text-xs text-brand-primary mt-1">
                              +{group.captions.length - 1} more {group.captions.length - 1 === 1 ? 'caption' : 'captions'}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-brand-text mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              {deleteType === 'caption' 
                ? 'Are you sure you want to delete this caption? This action cannot be undone.'
                : deleteType === 'captionGroup'
                ? 'Are you sure you want to delete all captions for this image? This action cannot be undone.'
                : 'Are you sure you want to delete this image? This action cannot be undone.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyStuff;