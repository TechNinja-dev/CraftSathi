import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm.jsx';
import OtpSlide from '../components/auth/OtpSlide.jsx';
import artisanImage from '../assets/authimg.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate(); 
  const [showOtp, setShowOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingToken, setPendingToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { login } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleOtpRequired = (email, token) => {
    console.log("🔐 OTP Required - Email:", email);
    console.log("🔐 OTP Required - Token:", token.substring(0, 20) + "...");
    setPendingEmail(email);
    setPendingToken(token);
    setShowOtp(true);
  };

  const handleBackToLogin = () => {
    console.log("🔙 Back to login clicked");
    setShowOtp(false);
    setPendingEmail('');
    setPendingToken('');
  };

  const handleVerifyOtp = async (otpCode) => {
    setIsVerifying(true);
    console.log("📧 Verifying OTP for email:", pendingEmail);
    console.log("🔢 OTP Code entered:", otpCode);
    
    try {
      const verifyResponse = await fetch(`${API_URL}/auth/google/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingEmail,
          otp: otpCode
        }),
      });

      const verifyData = await verifyResponse.json();
      console.log("📡 Verify OTP Response Status:", verifyResponse.status);
      console.log("📡 Verify OTP Response Data:", verifyData);

      if (!verifyResponse.ok) {
        throw new Error(verifyData.detail || 'Invalid OTP');
      }

      console.log("✅ OTP Verified Successfully!");

      // OTP verified! Now complete login with backend
      const loginResponse = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: pendingToken,
          name: '',
          otp_verified: true
        }),
      });

      const loginData = await loginResponse.json();
      console.log("📡 Final Login Response:", loginData);

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Login failed');
      }

      // Set login state
      login(loginData.token, loginData.user);
      console.log("🎉 User logged in successfully!");
      navigate('/');

    } catch (err) {
      console.error("❌ OTP verification error:", err);
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    console.log("📧 Resending OTP for email:", pendingEmail);
    
    try {
      const response = await fetch(`${API_URL}/auth/google/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingEmail,
        }),
      });

      const data = await response.json();
      console.log("📡 Resend OTP Response Status:", response.status);
      console.log("📡 Resend OTP Response Data:", data);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(data.detail || 'Please wait before requesting another OTP');
        }
        throw new Error(data.detail || 'Failed to resend OTP');
      }
      
      console.log("✅ OTP resent successfully!");
      
    } catch (err) {
      console.error("❌ Resend OTP error:", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg font-sans p-4 mt-20">
      <div className="flex w-full max-w-6xl h-[85vh] min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Panel: Visual Inspiration */}
        <div className="hidden lg:flex w-1/2 relative">
          <img 
            src={artisanImage}
            alt="Artisan at work" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-12">
            <h1 className="text-white text-5xl font-display font-bold leading-tight">
              Your Craft,
              <br />
              The World's Stage.
            </h1>
          </div>
        </div>

        {/* Right Panel: Action Area with Slide Animation */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
          <div className="relative w-full max-w-sm">
            {/* AuthForm - slides out left when OTP shows */}
            <div 
              className={`transition-all duration-300 ${
                showOtp ? 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none' : 'opacity-100 translate-x-0 relative'
              }`}
            >
              <AuthForm onOtpRequired={handleOtpRequired} />
            </div>
            
            {/* OtpSlide - slides in from right when OTP is required */}
            <div 
              className={`transition-all duration-300 ${
                showOtp ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
              }`}
            >
              <OtpSlide
                email={pendingEmail}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onBack={handleBackToLogin}
                loading={isVerifying}
                isVisible={showOtp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;