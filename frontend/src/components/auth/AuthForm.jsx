import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../../api/firebase.js';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';

const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.318 2.5 1.144 12.062 1.144 24.5C1.144 36.937 11.318 46.5 24 46.5c12.682 0 22.856-9.563 22.856-22C46.856 22.66 45.547 21.25 43.611 20.083z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.841 7.187 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 46.5c5.986 0 11.237-2.138 15.215-5.915l-6.388-4.945c-2.112 1.425-4.747 2.26-7.827 2.26c-5.22 0-9.657-3.467-11.297-8.169l-6.571 4.82C9.841 39.313 16.318 46.5 24 46.5z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.388 4.945c3.877-3.605 6.201-8.81 6.201-14.945c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const AuthForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleBackendAuth = async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      localStorage.setItem('authToken', data.token);
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      return data;
    } catch (err) {
      console.error('Backend auth error:', err);
      throw err;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // LOGIN
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          const result = await handleBackendAuth('/auth/login', { email, password });
          
          // Get user name from response
          const userName = result.user?.u_name || email.split('@')[0];
          
          // Navigate first
          navigate('/');
          
          // Show notification after navigation
          setTimeout(() => {
            showToast(`Welcome back, ${userName}!`, 'success');
          }, 100);
          
        } catch (firebaseError) {
          if (firebaseError.code === 'auth/user-not-found') {
            throw new Error('User not found. Please register first.');
          } else if (firebaseError.code === 'auth/wrong-password') {
            throw new Error('Invalid password. Please try again.');
          } else if (firebaseError.code === 'auth/invalid-email') {
            throw new Error('Invalid email format.');
          } else {
            throw new Error(firebaseError.message);
          }
        }
        
      } else {
        // REGISTER
        const result = await handleBackendAuth('/auth/register', { 
          email, 
          password,
          name 
        });
        
        // Get the registered user's name
        const userName = name;
        
        // Navigate first
        navigate('/');
        
        // Show notification after navigation
        setTimeout(() => {
          showToast(`Successfully registered! Welcome to CraftSathi, ${userName}!`, 'success');
        }, 100);
      }

    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const displayName = result.user.displayName;
      const userEmail = result.user.email;

      const result_data = await handleBackendAuth('/auth/google', { 
        token: idToken,
        name: displayName 
      });
      
      // Get user name from response
      const userName = result_data.user?.u_name || displayName || userEmail.split('@')[0];
      
      // Navigate first
      navigate('/');
      
      // Show notification after navigation
      setTimeout(() => {
        showToast(`Welcome${userName ? ` ${userName}` : ''}! Successfully signed in with Google.`, 'success');
      }, 100);

    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        const errorMsg = 'Sign-in cancelled. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else if (err.code === 'auth/popup-blocked') {
        const errorMsg = 'Popup was blocked. Please allow popups for this site.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } else {
        setError(err.message);
        showToast(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-text font-display">
          {isLoginMode ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p className="text-gray-500 mt-2">
          {isLoginMode ? 'Sign in to continue to CraftSathi' : 'Get started with your craft journey'}
        </p>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleLogo />
        <span className="font-semibold text-gray-700">Continue with Google</span>
      </button>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLoginMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              placeholder="Your Name"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
            placeholder="you@example.com"
          />
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            isLoginMode ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
          <button 
            onClick={switchModeHandler} 
            className="font-semibold text-brand-primary hover:underline ml-1"
          >
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;