import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Loader2, Camera, Mail, Calendar, Image as ImageIcon, 
  Sparkles, LogOut, Home, Captions, FolderOpen, 
  Info, TrendingUp, Heart, Eye, User, LayoutDashboard,
  AlertCircle, Edit3, X, Globe, Briefcase, Link as LinkIcon,
  Award, MapPin, Instagram, Youtube, ChevronRight, Upload, Trash2
} from 'lucide-react';
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
      
      setUserStats({
        totalPosts: data.posts?.length || 0,
        memberSince: data.memberSince || new Date().toISOString(),
        totalCaptions: data.totalCaptions || 0,
        totalImages: data.totalImages || 0,
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-bg">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text mb-4">You need to be logged in</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile and dashboard.
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-bg to-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-primary mx-auto mb-4" size={48} />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg to-gray-100 flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col z-30">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="text-2xl font-bold font-display text-brand-text">
            CraftSathi
          </Link>
          <p className="text-xs text-gray-400 mt-1">Artisan Dashboard</p>
        </div>

        <nav className="flex-1 py-6">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors group ${
                  isActive 
                    ? 'bg-brand-primary/10 text-brand-primary border-r-4 border-brand-primary' 
                    : 'text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary'
                }`}
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Profile Header with Camera Upload */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar with Upload Overlay */}
              <div className="relative group">
                <div className="w-28 h-28 bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={48} />
                  )}
                </div>
                
                {/* Camera Overlay - Shows on hover */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Upload photo"
                      disabled={uploading}
                    >
                      <Upload size={16} className="text-gray-700" />
                    </button>
                    {profileData.avatar && (
                      <button
                        onClick={() => setShowRemoveConfirm(true)}
                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                        title="Remove photo"
                        disabled={uploading}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Uploading indicator */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold font-display text-brand-text">
                    {profileData.name || userData?.u_name || userData?.name || 'Artisan'}
                  </h1>
                  <button
                    onClick={handleEditProfile}
                    className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
                
                {/* Location */}
                {profileData.country && (
                  <div className="flex items-center gap-1 justify-center md:justify-start text-gray-500 text-sm mt-1">
                    <MapPin size={14} />
                    <span>{profileData.country}</span>
                  </div>
                )}
                
                {/* Bio */}
                {profileData.bio && (
                  <p className="text-gray-600 text-sm mt-2 max-w-md">{profileData.bio}</p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 mt-3 text-gray-500">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail size={16} />
                    <span className="text-sm">{userData?.u_mail || userData?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar size={16} />
                    <span className="text-sm">Joined {formatDate(userStats.memberSince)}</span>
                  </div>
                  {profileData.experience && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Briefcase size={16} />
                      <span className="text-sm">{profileData.experience} years experience</span>
                    </div>
                  )}
                </div>

                {/* Specialties Tags */}
                {profileData.specialties && profileData.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {profileData.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {profileData.instagram && (
                    <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition-colors">
                      <Instagram size={18} />
                    </a>
                  )}
                  {profileData.youtube && (
                    <a href={profileData.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
                      <Youtube size={18} />
                    </a>
                  )}
                  {profileData.website && (
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-primary transition-colors">
                      <LinkIcon size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* ... stats cards (same as before) ... */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-brand-primary" />
                </div>
                <span className="text-2xl font-bold text-brand-text">{userStats.totalPosts}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Total Creations</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-brand-text">{userStats.totalCaptions}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Captions Generated</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <ImageIcon size={20} className="text-green-600" />
                </div>
                <span className="text-2xl font-bold text-brand-text">{userStats.totalImages}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Images Generated</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Heart size={20} className="text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-brand-text">{userStats.engagement}%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Engagement Score</p>
            </div>
          </div>
        </div>

        {/* Welcome Message Section */}
        <div className="max-w-5xl mx-auto px-6 py-8 flex-grow">
          <div className="bg-gradient-to-r from-brand-primary/5 to-transparent rounded-2xl p-8 border border-brand-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <LayoutDashboard size={28} className="text-brand-primary" />
              <h2 className="text-2xl font-bold text-brand-text">Welcome to Your Dashboard</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Empowering artisans with the magic of AI. We help you create, market, and grow your craft business 
              by turning your art into compelling social media content. Start by creating captions or generating 
              stunning visuals for your products!
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link 
                to="/generate"
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                <Sparkles size={18} />
                Create Captions
              </Link>
              <Link 
                to="/photo"
                className="flex items-center gap-2 px-4 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/10 transition-colors"
              >
                <ImageIcon size={18} />
                Generate Images
              </Link>
              <Link 
                to="/mystuff"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderOpen size={18} />
                View My Creations
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Edit Profile Modal (same as before) */}
      {/* Edit Profile Modal */}
{showEditModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-text">Edit Profile</h2>
        <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            value={formData.name !== undefined ? formData.name : (userData?.u_name || '')}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
          <p className="text-xs text-gray-400 mt-1">This name will be displayed on your profile</p>
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
          <input
            type="text"
            value={formData.avatar || ''}
            onChange={(e) => handleInputChange('avatar', e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country / Region</label>
          <input
            type="text"
            value={formData.country || ''}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="e.g., India, USA, UK"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about your craft journey..."
            rows="3"
            maxLength="150"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Max 150 characters</p>
        </div>

        {/* Craft Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Craft Specialties</label>
          <input
            type="text"
            value={formData.specialties?.join(', ') || ''}
            onChange={handleSpecialtyChange}
            placeholder="e.g., Pottery, Woodworking, Textile Art"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Separate specialties with commas</p>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            value={formData.experience || ''}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        {/* Favorite Materials */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Materials</label>
          <input
            type="text"
            value={formData.favoriteMaterials?.join(', ') || ''}
            onChange={handleMaterialsChange}
            placeholder="e.g., Clay, Wood, Cotton"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
          <p className="text-xs text-gray-400 mt-1">Separate materials with commas</p>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Social Links</h3>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Instagram</label>
            <input
              type="url"
              value={formData.instagram || ''}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">YouTube</label>
            <input
              type="url"
              value={formData.youtube || ''}
              onChange={(e) => handleInputChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Website / Portfolio</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end gap-3">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-brand-text mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your profile.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Remove Avatar Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-brand-text mb-3">Remove Profile Picture</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove your profile picture?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveAvatar}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;