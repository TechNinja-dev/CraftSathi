import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm.jsx';
import OtpSlide from '../components/auth/OtpSlide.jsx';
import CreatePassword from '../components/auth/CreatePassword.jsx';
import artisanImage from '../assets/authimg.png';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../api/firebase.js';

const AuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [step, setStep] = useState('login'); // 'login', 'otp', 'createPassword'
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingToken, setPendingToken] = useState('');
  const [pendingUserData, setPendingUserData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleOtpRequired = (email, token) => {
    console.log("🔐 OTP Required - Email:", email);
    setPendingEmail(email);
    setPendingToken(token);
    setStep('otp');
  };

  const handleBackToLogin = () => {
    setStep('login');
    setPendingEmail('');
    setPendingToken('');
    setPendingUserData(null);
  };

  const handleBackToOtp = () => {
    setStep('otp');
  };

  const handleVerifyOtp = async (otpCode) => {
    setIsVerifying(true);
    console.log("📧 Verifying OTP for email:", pendingEmail);
    console.log("🔢 OTP Code entered:", otpCode);
    
    try {
      // Call verify OTP endpoint
      const verifyResponse = await fetch(`${API_URL}/auth/google/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingEmail,
          otp: otpCode
        }),
      });

      const verifyData = await verifyResponse.json();
      console.log("📡 Verify OTP Response:", verifyData);

      if (!verifyResponse.ok) {
        throw new Error(verifyData.detail || 'Invalid OTP');
      }

      console.log("✅ OTP Verified Successfully!");

      // Now complete the login with verified OTP
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
      console.log("📡 Login Response:", loginData);

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Login failed');
      }

      // Check if this is a new user (no password set)
      if (loginData.is_new_user || !loginData.user?.has_password) {
        console.log("🆕 New user detected, need to create password");
        setPendingUserData(loginData.user);
        setStep('createPassword');
        setIsVerifying(false);
        return;
      }

      // Existing user - complete login
      login(loginData.token, loginData.user);
      showToast('Successfully logged in!', 'success');
      navigate('/');

    } catch (err) {
      console.error("❌ OTP verification error:", err);
      showToast(err.message, 'error');
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSetPassword = async (password) => {
  setIsSettingPassword(true);
  try {
    console.log("🔐 Setting password for new user:", pendingEmail);
    console.log("🔐 Using stored token:", pendingToken.substring(0, 20) + "...");
    
    const response = await fetch(`${API_URL}/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: pendingEmail,
        password: password,
        token: pendingToken  // Use the stored token from initial Google sign-in
      }),
    });

    const data = await response.json();
    console.log("📡 Set password response:", data);

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to set password');
    }

    login(data.token, data.user);
    showToast('Password created successfully! Welcome to CraftSathi!', 'success');
    navigate('/');

  } catch (err) {
    console.error("❌ Set password error:", err);
    showToast(err.message, 'error');
    throw err;
  } finally {
    setIsSettingPassword(false);
  }
};

  const handleResendOtp = async () => {
    try {
      console.log("📧 Resending OTP for:", pendingEmail);
      
      const response = await fetch(`${API_URL}/auth/google/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingEmail,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(data.detail || 'Please wait before requesting another OTP');
        }
        throw new Error(data.detail || 'Failed to resend OTP');
      }
      
      showToast('New OTP sent to your email!', 'success');
      
    } catch (err) {
      console.error("❌ Resend OTP error:", err);
      showToast(err.message, 'error');
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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto relative">
          <div className="relative w-full max-w-sm">
            {/* AuthForm - Login/Register */}
            <div 
              className={`transition-all duration-300 ${
                step !== 'login' ? 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none' : 'opacity-100 translate-x-0 relative'
              }`}
            >
              <AuthForm onOtpRequired={handleOtpRequired} />
            </div>
            
            {/* OtpSlide - OTP Verification */}
            <div 
              className={`transition-all duration-300 ${
                step === 'otp' ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
              }`}
            >
              <OtpSlide
                email={pendingEmail}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onBack={handleBackToLogin}
                loading={isVerifying}
                isVisible={step === 'otp'}
              />
            </div>

            {/* CreatePassword - Password Creation for New Users */}
            <div 
              className={`transition-all duration-300 ${
                step === 'createPassword' ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none'
              }`}
            >
              <CreatePassword
                email={pendingEmail}
                onPasswordSet={handleSetPassword}
                onBack={handleBackToOtp}
                loading={isSettingPassword}
                isVisible={step === 'createPassword'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;