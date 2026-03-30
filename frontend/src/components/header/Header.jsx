import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';
import { doSignOut } from '../../firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFeatherPointed, 
  faBars, 
  faTimes, 
  faUserCircle, 
  faCog, 
  faSignOutAlt,
  faBook,
  faNetworkWired,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { House } from 'lucide-react';

/**
 * Header Component
 * 
 * A responsive navigation header with authentication state management,
 * profile dropdown, and smooth animations.
 * 
 * Features:
 * - Responsive design (desktop & mobile)
 * - User authentication state handling
 * - Profile dropdown with user info and settings
 * - Smooth animations using react-spring
 * - Scroll effects with glassmorphism styling
 * 
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const profileCardRef = useRef(null);

  // Navigation menu items with icons
  const menuItems = [
    { name: 'Home', path: '/', icon: <House size={18} /> },
    { name: 'Story', path: '/ai/story', icon: <FontAwesomeIcon icon={faBook} /> },
    { name: 'Network', path: '/network', icon: <FontAwesomeIcon icon={faNetworkWired} /> },
    { name: 'Gallary', path: '/Gallary', icon: <FontAwesomeIcon icon={faBuilding} /> }
  ];

  // Profile card animation
  const profileCardSpring = useSpring({
    opacity: showProfileCard ? 1 : 0,
    transform: showProfileCard ? 'translateY(0)' : 'translateY(-10px)',
    config: config.wobbly
  });

  // Handle click outside to close profile card
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileCardRef]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Navigation animation
  const navSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle
  });

  // Logo animation
  const logoSpring = useSpring({
    from: { transform: 'scale(0.9)' },
    to: { transform: 'scale(1)' },
    config: config.wobbly
  });

  // Text animation for CraftSathi
  const textSpring = useSpring({
    from: { opacity: 0, transform: 'translateX(-10px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    delay: 300,
    config: config.molasses
  });

  // Mobile menu animation
  const mobileMenuSpring = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? 'translateY(0px) scale(1)' : 'translateY(-20px) scale(0.95)',
    config: config.stiff
  });

  /**
   * Handles user logout
   * Signs out user and redirects to login page
   */
  const handleLogout = () => {
    doSignOut().then(() => {
      navigate('/login');
      setIsMenuOpen(false);
      setShowProfileCard(false);
    });
  };

  /**
   * Gets the first letter of user's name or email for avatar fallback
   * @returns {string} First letter of user's name or email
   */
  const getFirstLetter = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    } else if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  /**
   * Safely gets the user's photo URL
   * @returns {string|null} User's photo URL or null if not available
   */
  const getPhotoURL = () => {
    return currentUser?.photoURL || null;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gradient-to-b from-purple-900/95 via-black/95 to-black/95 backdrop-blur-md py-3 shadow-xl' : 'bg-gradient-to-b from-purple-900 via-black to-black py-5'}`}>
      <div className="container mx-auto px-4 flex justify-center items-center">
        {/* 3D Glassmorphism Navigation */}
        <animated.nav 
          style={navSpring}
          className={`rounded-full bg-gradient-to-r from-purple-900/70 to-purple-800/50 backdrop-blur-md border border-purple-600/30 shadow-lg shadow-purple-900/40 p-1.5 transition-all duration-300 ${scrolled ? 'w-full max-w-4xl' : 'w-full max-w-5xl'}`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 mr-6">
              <animated.div style={logoSpring} className="flex items-center">
                <FontAwesomeIcon icon={faFeatherPointed} className="text-purple-400 text-2xl mr-2" />
                <animated.span style={textSpring} className="text-xl font-bold text-white bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
                  CraftSathi
                </animated.span>
              </animated.div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-purple-200 hover:text-white hover:bg-purple-700/30 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
                >
                  {item.icon && <span className="mr-2 text-purple-400">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-2 relative">
              {userLoggedIn ? (
                <>
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => setShowProfileCard(!showProfileCard)}
                    aria-expanded={showProfileCard}
                    aria-label="User profile menu"
                  >
                    {getPhotoURL() && !profileImageError ? (
                      <img 
                        src={getPhotoURL()}
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                        onError={() => setProfileImageError(true)}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-purple-500 bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {getFirstLetter()}
                      </div>
                    )}
                    <span className="ml-2 text-white text-sm font-medium hidden lg:block">
                      {currentUser?.displayName || currentUser?.email || 'User'}
                    </span>
                  </div>
                  {showProfileCard && (
                    <animated.div 
                      style={profileCardSpring}
                      ref={profileCardRef}
                      className="absolute top-full right-0 mt-3 w-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-20"
                      role="menu"
                    >
                      <div className="p-4 flex flex-col items-center border-b border-gray-700">
                        {getPhotoURL() && !profileImageError ? (
                          <img 
                            src={getPhotoURL()}
                            alt="Profile" 
                            className="w-20 h-20 rounded-full border-2 border-purple-500 object-cover mb-3"
                            onError={() => setProfileImageError(true)}
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full border-2 border-purple-500 bg-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
                            {getFirstLetter()}
                          </div>
                        )}
                        <p className="text-white font-bold text-lg">{currentUser?.displayName || 'User'}</p>
                        <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          onClick={() => setShowProfileCard(false)} 
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          <FontAwesomeIcon icon={faUserCircle} className="mr-3" /> Profile
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setShowProfileCard(false)} 
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          <FontAwesomeIcon icon={faCog} className="mr-3" /> Settings
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Logout
                        </button>
                      </div>
                    </animated.div>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="text-purple-200 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-purple-700/30">
                      Log in
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-purple-400/30 transition-all duration-200 hover:shadow-lg">
                      Sign up
                    </button>
                  </Link>
                </>
              )}
              
              {/* Get Started Button */}
              <Link to="/ai/getstarted">
                <button className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center transform hover:-translate-y-0.5">
                  Get Started <span className="ml-2">→</span>
                </button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-700/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
              >
                <FontAwesomeIcon 
                  icon={isMenuOpen ? faTimes : faBars} 
                  className="h-5 w-5" 
                />
              </button>
            </div>
          </div>
        </animated.nav>
      </div>
      
      {/* Mobile menu with React Spring animation */}
      <animated.div 
        style={mobileMenuSpring}
        className="md:hidden absolute left-0 right-0 mt-2 mx-4 rounded-2xl bg-gradient-to-b from-purple-900/95 to-purple-800/90 backdrop-blur-lg border border-purple-600/30 shadow-xl shadow-purple-900/40 overflow-hidden z-10"
        role="menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-purple-200 hover:text-white hover:bg-purple-700/30 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 flex items-center"
              role="menuitem"
            >
              {item.icon && <span className="mr-3 text-purple-400">{item.icon}</span>}
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-purple-600/30 space-y-3">
            {userLoggedIn ? (
              <>
                <div className="flex items-center px-4 py-3">
                  {getPhotoURL() && !profileImageError ? (
                    <img 
                      src={getPhotoURL()}
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                      onError={() => setProfileImageError(true)}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-purple-500 bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {getFirstLetter()}
                    </div>
                  )}
                  <span className="ml-3 text-white font-medium">
                    {currentUser?.displayName || currentUser?.email || 'User'}
                  </span>
                </div>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200" role="menuitem">
                  <FontAwesomeIcon icon={faUserCircle} className="mr-3" /> Profile
                </Link>
                <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200" role="menuitem">
                  <FontAwesomeIcon icon={faCog} className="mr-3" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full text-left text-purple-200 hover:text-white hover:bg-purple-700/30 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200" role="menuitem">
                    Log in
                  </button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-3 rounded-xl text-base font-medium text-center border border-purple-400/30 transition-all duration-200" role="menuitem">
                    Sign up
                  </button>
                </Link>
              </>
            )}
            
            <Link to="/ai/getstarted" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl" role="menuitem">
                Get Started <span className="ml-2">→</span>
              </button>
            </Link>
          </div>
        </div>
      </animated.div>
    </header>
  );
};

export default Header;