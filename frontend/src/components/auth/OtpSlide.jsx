import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

const OtpSlide = ({ email, onVerify, onResend, onBack, loading, isVisible }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isVisible) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setTimer(300);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isVisible]);

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
    if (error) setError('');
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
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
    
    try {
      await onVerify(otpCode);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setCanResend(false);
    setTimer(300);
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    
    if (onResend) {
      try {
        await onResend();
      } catch (err) {
        setError(err.message || 'Failed to resend OTP');
        setCanResend(true);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      const lastIndex = Math.min(newOtp.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-sm animate-slide-in-right">
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
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back to sign in</span>
      </button>
      
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
        disabled={loading}
        className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </div>
        ) : (
          'Verify & Continue'
        )}
      </button>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Didn't receive the code? Check your spam folder
      </p>
    </div>
  );
};

export default OtpSlide;