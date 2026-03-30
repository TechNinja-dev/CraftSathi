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
    <div className="w-full max-w-sm mx-auto animate-slide-in-right">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Mail className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white font-display tracking-tight mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-400 mt-2">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold mt-1">{email}</p>
      </div>
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold uppercase tracking-wider">Back to Sign In</span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center backdrop-blur-sm">
          {error}
        </div>
      )}
      
      {/* OTP Input Fields */}
      <div className="flex justify-between gap-2 mb-8" onPaste={handlePaste}>
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
            className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl focus:outline-none transition-all duration-300 ${
              error 
                ? 'border border-red-500 focus:border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                : 'border border-white/10 focus:border-transparent focus:ring-2 focus:ring-purple-500 bg-black/30 text-white shadow-inner'
            }`}
          />
        ))}
      </div>
      
      {/* Timer & Resend */}
      <div className="text-center mb-8">
        {!canResend ? (
          <p className="text-sm text-gray-400">
            Code expires in <span className="font-mono font-bold text-pink-400">{formatTime(timer)}</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 hover:opacity-80 transition-opacity"
          >
            Resend verification code
          </button>
        )}
      </div>
      
      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full py-4 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Verifying...</span>
          </div>
        ) : (
          'Verify & Continue'
        )}
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-8 uppercase tracking-widest font-semibold">
        Didn't receive the code? Check spam folder
      </p>
    </div>
  );
};

export default OtpSlide;