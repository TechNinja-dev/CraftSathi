// src/components/auth/CreatePassword.jsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const CreatePassword = ({ email, onPasswordSet, onBack, loading, isVisible }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (isVisible) {
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isVisible]);

  const checkPasswordStrength = (pwd) => {
    setPasswordStrength({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password strength (at least 3 criteria met)
    const strengthCount = Object.values(passwordStrength).filter(Boolean).length;
    if (strengthCount < 3) {
      setError('Password is too weak. Please include uppercase, lowercase, numbers, or special characters.');
      return;
    }

    try {
      await onPasswordSet(password);
    } catch (err) {
      setError(err.message || 'Failed to set password');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-sm animate-slide-in-right">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold text-brand-text font-display">
          Create Your Password
        </h2>
        <p className="text-gray-500 mt-2">
          Set a password for {email}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          This will allow you to login with email/password in the future
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      {/* Password Field */}
      <div className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          placeholder="Create a strong password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-10 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Password strength:</p>
          <div className="flex gap-1 mb-2">
            {Object.values(passwordStrength).map((valid, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full ${valid ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordStrength.length ? <CheckCircle size={12} /> : <XCircle size={12} />}
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordStrength.uppercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
              <span>Uppercase letter</span>
            </div>
            <div className={`flex items-center gap-1 ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordStrength.lowercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
              <span>Lowercase letter</span>
            </div>
            <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordStrength.number ? <CheckCircle size={12} /> : <XCircle size={12} />}
              <span>Number</span>
            </div>
            <div className={`flex items-center gap-1 ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
              {passwordStrength.special ? <CheckCircle size={12} /> : <XCircle size={12} />}
              <span>Special character</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Password Field */}
      <div className="relative mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError('');
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          placeholder="Confirm your password"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-10 text-gray-500"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Set Password Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Setting Password...
          </div>
        ) : (
          'Set Password & Continue'
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        This password will be used for future email/password logins
      </p>
    </div>
  );
};

export default CreatePassword;