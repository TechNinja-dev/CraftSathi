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
    <div className="w-full max-w-sm mx-auto animate-slide-in-right">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <CheckCircle className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white font-display tracking-tight mb-2">
          Secure Your Vault
        </h2>
        <p className="text-gray-400 mt-2">
          Set a password for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold">{email}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">
          For future email/password access
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold uppercase tracking-wider">Back</span>
      </button>

      {/* Password Field */}
      <div className="relative mb-5">
        <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
          New Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          placeholder="Create a strong password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-10 text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Strength Indicator</p>
          <div className="flex gap-2 mb-4">
            {Object.values(passwordStrength).map((valid, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full bg-gradient-to-r transition-all duration-300 ${valid ? 'from-purple-500 to-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'from-gray-600 to-gray-700'}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium">
            <div className={`flex items-center gap-2 ${passwordStrength.length ? 'text-pink-400' : 'text-gray-500'}`}>
              {passwordStrength.length ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>8+ characters</span>
            </div>
            <div className={`flex items-center gap-2 ${passwordStrength.uppercase ? 'text-pink-400' : 'text-gray-500'}`}>
              {passwordStrength.uppercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>Uppercase</span>
            </div>
            <div className={`flex items-center gap-2 ${passwordStrength.lowercase ? 'text-pink-400' : 'text-gray-500'}`}>
              {passwordStrength.lowercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>Lowercase</span>
            </div>
            <div className={`flex items-center gap-2 ${passwordStrength.number ? 'text-pink-400' : 'text-gray-500'}`}>
              {passwordStrength.number ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>Number</span>
            </div>
            <div className={`flex items-center gap-2 ${passwordStrength.special ? 'text-pink-400' : 'text-gray-500'}`}>
              {passwordStrength.special ? <CheckCircle size={14} /> : <XCircle size={14} />}
              <span>Special char</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Password Field */}
      <div className="relative mb-8">
        <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError('');
          }}
          className="w-full px-4 py-3 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          placeholder="Confirm your password"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-10 text-gray-400 hover:text-white transition-colors"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Set Password Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Encrypting...</span>
          </div>
        ) : (
          'Secure Vault & Continue'
        )}
      </button>
    </div>
  );
};

export default CreatePassword;