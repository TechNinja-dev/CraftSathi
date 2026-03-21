import React, { useState, useEffect, useRef } from 'react';
import { X, Mail } from 'lucide-react';

const OtpVerify = ({ isOpen, onClose, email, onVerify, onResend, loading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setTimer(300);
      setCanResend(false);
      setIsVerifying(false);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    // Clear error when user starts typing
    if (error) setError('');
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    try {
      await onVerify(otpCode);
      // If successful, onVerify will close the modal
    } catch (err) {
      // Display error message from backend
      const errorMessage = err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsVerifying(false);
    }
  };

const handleResend = async () => {
  if (!canResend) return;
  
  setError('');
  setCanResend(false);
  setTimer(300);
  // Clear OTP inputs
  setOtp(['', '', '', '', '', '']);
  // Focus first input
  setTimeout(() => inputRefs.current[0]?.focus(), 100);
  
  if (onResend) {
    try {
      await onResend();
      // Success - show success message briefly
      setError('');
    } catch (err) {
      // If resend fails (cooldown, etc.), re-enable the button
      setCanResend(true);
      setError(err.message || 'Failed to resend OTP');
    }
  }
};

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      // Focus last filled input
      const lastIndex = Math.min(newOtp.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Slide-in panel from right */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-in-right">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text font-display">
              Verify Your Email
            </h2>
            <p className="text-gray-500 mt-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-brand-primary font-medium mt-1">{email}</p>
          </div>
          
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none transition-colors ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-brand-primary'
                }`}
              />
            ))}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          {/* Timer & Resend */}
          <div className="text-center mb-6">
            {!canResend ? (
              <p className="text-sm text-gray-500">
                Code expires in <span className="font-mono font-semibold">{formatTime(timer)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-brand-primary hover:underline font-medium"
              >
                Resend verification code
              </button>
            )}
          </div>
          
          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || isVerifying}
            className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {loading || isVerifying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              'Verify & Continue'
            )}
          </button>
          
          {/* Back to sign in */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Didn't receive the code? Check your spam folder
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;