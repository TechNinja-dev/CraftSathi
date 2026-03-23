import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Loader2, Camera, Mail, Calendar, Image as ImageIcon, 
  Sparkles, LogOut, Home, Captions, FolderOpen, 
  Info, TrendingUp, Heart, Eye, User, LayoutDashboard,
  AlertCircle
} from 'lucide-react';
import Footer from './Footer.jsx';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    memberSince: '',
    totalCaptions: 0,
    totalImages: 0,
    engagement: 0
  });
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  console.log("Profile - isAuthenticated:", isAuthenticated);
  console.log("Profile - userData:", userData);

  const fetchUserData = async () => {
    console.log("fetchUserData called");
    
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping fetch");
      setLoading(false);
      return;
    }
    
    if (!userData) {
      console.log("No userData available");
      setError("Session data not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Try multiple possible field names for user ID
    const userId = userData.u_Id || userData.uid || userData.id || userData.userId;
    console.log("Extracted userId:", userId);
    
    if (!userId) {
      console.error("No user ID found in userData:", userData);
      setError("User session expired. Please log in again.");
      setLoading(false);
      setTimeout(() => navigate('/auth'), 2000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}/api/profile?userId=${userId}`;
      console.log("Fetching profile from URL:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.detail || 'Failed to fetch profile data');
      }

      const data = await response.json();
      console.log("Profile data received:", data);
      
      setUserStats({
        totalPosts: data.posts?.length || 0,
        memberSince: data.memberSince || new Date().toISOString(),
        totalCaptions: data.totalCaptions || 0,
        totalImages: data.totalImages || 0,
        engagement: Math.floor(Math.random() * 100)
      });
      
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

  // If not authenticated, show login prompt
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-bg to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={fetchUserData}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/auth"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign In Again
            </Link>
          </div>
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
        {/* Profile Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-28 h-28 bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera size={48} />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold font-display text-brand-text">
                  {userData?.u_name || userData?.name || 'Artisan'}
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 text-gray-500">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail size={16} />
                    <span className="text-sm">{userData?.u_mail || userData?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar size={16} />
                    <span className="text-sm">Joined {formatDate(userStats.memberSince)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    </div>
  );
};

export default Profile;