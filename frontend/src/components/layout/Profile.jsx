import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Loader2, Camera, Mail, Calendar, Image as ImageIcon, Video,
  Sparkles, LogOut, Home, Captions, FolderOpen, 
  Info, TrendingUp, Heart, Eye, User, LayoutDashboard,
  AlertCircle, Edit3, X, Globe, Briefcase, Link as LinkIcon,
  Award, MapPin, Instagram, Youtube, ChevronRight, Upload, Trash2, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    avatar: null,
    name: '',
    country: '',
    bio: '',
    specialties: [],
    instagram: '',
    youtube: '',
    website: '',
    experience: '',
    favoriteMaterials: []
  });
  const [formData, setFormData] = useState({});
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    memberSince: '',
    totalCaptions: 0,
    totalImages: 0,
    totalVideos: 0,
    engagement: 0
  });
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const base64Image = await fileToBase64(file);
      
      // Save to database
      const userId = userData.u_Id || userData.uid;
      const response = await fetch(`${API_URL}/api/profile/update-avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          avatar: base64Image
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setProfileData(prev => ({ ...prev, avatar: data.avatar }));
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Remove avatar
const handleRemoveAvatar = async () => {
  setShowRemoveConfirm(false);
  setUploading(true);
  try {
    const userId = userData.u_Id || userData.uid;
    const response = await fetch(`${API_URL}/api/profile/remove-avatar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId })
    });

    if (!response.ok) {
      throw new Error('Failed to remove avatar');
    }

    setProfileData(prev => ({ ...prev, avatar: null }));
    
  } catch (err) {
    console.error('Error removing avatar:', err);
    setError(err.message);
  } finally {
    setUploading(false);
  }
};

  const fetchUserData = async () => {
    if (!isAuthenticated || !userData) {
      setLoading(false);
      return;
    }

    const userId = userData.u_Id || userData.uid;
    if (!userId) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/profile?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      console.log("Captions "+data.totalCaptions )
      console.log(data.total_images)
      
      setUserStats({
        totalPosts: data.posts || 0,
        memberSince: data.memberSince || new Date().toISOString(),
        totalCaptions: data.totalCaptions || 0,
        totalImages: data.totalImages || 0,
        totalVideos: data.totalVideos || 0,
        engagement: Math.floor(Math.random() * 100)
      });

      if (data.profile) {
        setProfileData(data.profile);
        setFormData(data.profile);
      }
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated, userData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    setFormData({ ...profileData });
    setShowEditModal(true);
  };

// Add this helper function
const prepareUpdatedProfile = () => {
  const updated = {};
  
  // Define all fields and their default values
  const fields = [
    { key: 'name', default: profileData.name || '' },
    { key: 'avatar', default: profileData.avatar || null },
    { key: 'country', default: profileData.country || '' },
    { key: 'bio', default: profileData.bio || '' },
    { key: 'specialties', default: profileData.specialties || [] },
    { key: 'instagram', default: profileData.instagram || '' },
    { key: 'youtube', default: profileData.youtube || '' },
    { key: 'website', default: profileData.website || '' },
    { key: 'experience', default: profileData.experience || '' },
    { key: 'favoriteMaterials', default: profileData.favoriteMaterials || [] }
  ];
  
  fields.forEach(field => {
    // If formData has a value (including empty string), use it, otherwise use existing
    if (formData[field.key] !== undefined) {
      updated[field.key] = formData[field.key];
    } else if (field.default !== undefined) {
      updated[field.key] = field.default;
    }
  });
  
  return updated;
};

const handleSaveProfile = async () => {
  setSaving(true);
  try {
    const userId = userData.u_Id || userData.uid;
    
    const updatedProfile = prepareUpdatedProfile();
    
    const response = await fetch(`${API_URL}/api/profile/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        profile: updatedProfile
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    setProfileData(data.profile);
    setShowEditModal(false);
  } catch (err) {
    console.error('Error updating profile:', err);
    setError(err.message);
  } finally {
    setSaving(false);
  }
};

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyChange = (e) => {
    const values = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    handleInputChange('specialties', values);
  };

  const handleMaterialsChange = (e) => {
    const values = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    handleInputChange('favoriteMaterials', values);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const sidebarLinks = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/generate', icon: Captions, label: 'Caption' },
    { path: '/photo', icon: ImageIcon, label: 'Posts' },
    { path: '/mystuff', icon: FolderOpen, label: 'MyStuff' },
    { path: '/about', icon: Info, label: 'About Us' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#0c0516] font-sans">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#130826]/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden mt-20"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <User size={40} className="text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Please sign in to view and edit your professional creator profile.
          </p>
          <Link 
            to="/auth" 
            className="inline-block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:-translate-y-1 transition-all"
          >
            Sign In To Proceed
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0516]">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
        <p className="text-gray-400 animate-pulse">Loading your artisan portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0516] flex flex-col font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
      <Navbar />
      
      {/* Background glow effects */}
      <div className="fixed top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <main className="flex-1 w-full relative z-10">
        
        {/* Hero Section */}
        <div className="w-full h-64 md:h-80 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#130826] via-purple-900/40 to-pink-900/40 z-0"/>
          <img 
            src={profileData.avatar || "/api/placeholder/1200/400"} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20 blur-sm group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0516] via-transparent to-transparent z-10" />
        </div>

        {/* Profile Info Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#130826]/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              {/* Avatar Frame */}
              <div className="relative group/avatar shrink-0 z-30 -mt-20">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-[#0c0516] p-2 rounded-3xl border border-white/10 shadow-2xl relative">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                    ) : (
                      <Camera size={64} className="text-white opacity-50" />
                    )}
                  </div>

                  {/* Camera Overlay */}
                  <div className="absolute inset-2 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white/20 hover:bg-white/40 border border-white/30 rounded-xl transition-all"
                        title="Upload photo"
                        disabled={uploading}
                      >
                        <Upload size={20} className="text-white" />
                      </button>
                      {profileData.avatar && (
                        <button
                          onClick={() => setShowRemoveConfirm(true)}
                          className="p-3 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-xl transition-all"
                          title="Remove photo"
                          disabled={uploading}
                        >
                          <Trash2 size={20} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {uploading && (
                    <div className="absolute inset-2 bg-black/70 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="animate-spin text-purple-500" size={32} />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center md:text-left w-full mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                      {profileData.name || userData?.u_name || userData?.name || 'Artisan'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm font-medium text-purple-300">
                      {profileData.country && (
                        <span className="flex items-center gap-1.5 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                          <MapPin size={16} /> {profileData.country}
                        </span>
                      )}
                      {profileData.experience && (
                        <span className="flex items-center gap-1.5 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                          <Briefcase size={16} /> {profileData.experience} Years Pro
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 text-emerald-300 rounded-full border border-emerald-500/20">
                        <Shield size={16} /> Verified Creator
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="flex flex-shrink-0 items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] font-semibold"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                </div>

                {profileData.bio && (
                  <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mb-6">
                    "{profileData.bio}"
                  </p>
                )}

                {/* Specialties and Socials row */}
                <div className="flex flex-col xl:flex-row justify-between items-center md:items-start gap-6 pt-6 border-t border-white/10">
                  <div className="flex-1">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3 text-center md:text-left">Mastery & Focus</h3>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {profileData.specialties && profileData.specialties.length > 0 ? (
                        profileData.specialties.map((specialty, idx) => (
                          <span key={idx} className="px-4 py-1.5 bg-[#0c0516] text-gray-300 text-sm font-medium rounded-lg border border-white/10 shadow-inner">
                            {specialty}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-600 text-sm italic">No specialties listed yet</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-[#0c0516] p-2 rounded-2xl border border-white/10">
                    {profileData.instagram ? (
                      <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-400 hover:text-pink-500 hover:bg-pink-500/10 rounded-xl transition-all">
                        <Instagram size={22} />
                      </a>
                    ) : (
                      <div className="p-3 text-gray-700 rounded-xl cursor-not-allowed"><Instagram size={22} /></div>
                    )}
                    {profileData.youtube ? (
                      <a href={profileData.youtube} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <Youtube size={22} />
                      </a>
                    ) : (
                      <div className="p-3 text-gray-700 rounded-xl cursor-not-allowed"><Youtube size={22} /></div>
                    )}
                    {profileData.website ? (
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all">
                        <LinkIcon size={22} />
                      </a>
                    ) : (
                      <div className="p-3 text-gray-700 rounded-xl cursor-not-allowed"><LinkIcon size={22} /></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Stats & Actions Sub-grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-[#130826]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="text-purple-400" /> Career Analytics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0c0516] rounded-2xl p-5 border border-white/5 text-center group hover:border-purple-500/30 transition-colors">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <LayoutDashboard size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-1"><CountUp end={userStats.totalPosts} /></h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Assets</p>
                </div>
                <div className="bg-[#0c0516] rounded-2xl p-5 border border-white/5 text-center group hover:border-pink-500/30 transition-colors">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles size={24} className="text-pink-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-1"><CountUp end={userStats.totalCaptions} /></h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Captions</p>
                </div>
                <div className="bg-[#0c0516] rounded-2xl p-5 border border-white/5 text-center group hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-1"><CountUp end={userStats.totalImages} /></h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Posts</p>
                </div>
                <div className="bg-[#0c0516] rounded-2xl p-5 border border-white/5 text-center group hover:border-blue-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Video size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-1"><CountUp end={userStats.totalVideos} /></h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Video Ads</p>
                </div>
              </div>
              
              <Link to="/mystuff" className="w-full flex items-center justify-center p-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all font-bold group mt-2">
                <FolderOpen size={18} className="mr-2" /> 
                Open My Vault
                <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#130826]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="text-pink-400" /> Quick Actions
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Ready to craft your next masterpiece? Elevate your portfolio and reach your audience faster.
                </p>
                <div className="space-y-3">
                  <Link to="/photo" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all group">
                    <div className="flex items-center gap-3"><Sparkles className="text-purple-400" size={20} /><span className="text-gray-200 font-semibold">AI Creator Studio</span></div>
                    <ChevronRight className="text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" size={18} />
                  </Link>
                  <Link to="/generate" className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-xl transition-all group">
                    <div className="flex items-center gap-3"><Captions className="text-pink-400" size={20} /><span className="text-gray-200 font-semibold">Caption Studio</span></div>
                    <ChevronRight className="text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" size={18} />
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all font-bold"
              >
                <LogOut size={18} /> Disconnect Vault
              </button>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#130826] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="bg-[#0c0516] border-b border-white/5 p-5 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Edit3 className="text-purple-400" /> Edit Profile
                </h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Display Name</label>
                    <input
                      type="text"
                      value={formData.name !== undefined ? formData.name : (userData?.u_name || '')}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="e.g., India, USA, UK"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Profile Picture URL</label>
                  <input
                    type="text"
                    value={formData.avatar || ''}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Leave blank to use uploaded image</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Biography</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about your craft journey..."
                    rows="3"
                    maxLength="150"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">{formData.bio?.length || 0}/150</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Craft Specialties */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Specialties</label>
                    <input
                      type="text"
                      value={formData.specialties?.join(', ') || ''}
                      onChange={handleSpecialtyChange}
                      placeholder="e.g., Pottery, 3D Art"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    />
                     <p className="text-xs text-gray-500 mt-2">Comma separated</p>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Years Active</label>
                    <input
                      type="number"
                      value={formData.experience || ''}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-white/5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe className="text-pink-400"/> Digital Footprint</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="url"
                        value={formData.instagram || ''}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="Instagram URL"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="url"
                        value={formData.youtube || ''}
                        onChange={(e) => handleInputChange('youtube', e.target.value)}
                        placeholder="YouTube URL"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="Portfolio Website URL"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0c0516] border-t border-white/5 p-5 flex justify-end gap-4 shrink-0">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-white/10 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> Save Profile</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
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
                <LogOut size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Disconnect Vault</h3>
              <p className="text-gray-400 mb-8 text-center leading-relaxed">
                Are you sure you want to log out? You'll need to sign in again to access and manage your portfolio.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-semibold"
                >
                  Stay
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all font-semibold"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Avatar Confirmation Modal */}
      <AnimatePresence>
        {showRemoveConfirm && (
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
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Remove Picture</h3>
              <p className="text-gray-400 mb-8 text-center leading-relaxed">
                Are you sure you want to remove your profile picture? This action is immediate.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowRemoveConfirm(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all font-semibold disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;