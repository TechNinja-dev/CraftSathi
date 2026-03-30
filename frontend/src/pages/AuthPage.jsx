import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm.jsx';
import OtpSlide from '../components/auth/OtpSlide.jsx';
import CreatePassword from '../components/auth/CreatePassword.jsx';
import artisanImage from '../assets/authimg.png';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar.jsx';

const AuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [step, setStep] = useState('login'); // 'login', 'otp', 'createPassword'
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingToken, setPendingToken] = useState('');
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
    <div className="min-h-screen bg-[#0c0516] flex flex-col font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
      <Navbar />
      
      {/* Background glow effects */}
      <div className="fixed top-0 left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <main className="flex-1 w-full flex items-center justify-center p-4 pt-24 pb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row w-full max-w-5xl bg-[#130826]/70 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden min-h-[600px] lg:h-[700px]"
        >
          
          {/* Left Panel: Visual Inspiration */}
          <div className="hidden lg:flex w-1/2 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 mix-blend-overlay z-10" />
            <img 
              src={artisanImage}
              alt="Artisan at work" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0516] via-[#0c0516]/60 to-transparent z-20 flex flex-col justify-end p-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
                  <span className="text-sm font-bold tracking-wider text-purple-300">
                    Welcome to CraftSathi
                  </span>
                </div>
                <h1 className="text-white text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                  Your Craft,<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">The World's Stage.</span>
                </h1>
                <p className="text-gray-400 text-lg">Join a thriving community of artisans and showcase your masterpieces globally with the power of AI.</p>
              </motion.div>
            </div>
          </div>

          {/* Right Panel: Action Area */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative bg-[#0c0516]/40">
            <div className="relative w-full max-w-sm">
              {/* AuthForm - Login/Register */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  step !== 'login' ? 'opacity-0 -translate-x-full absolute inset-0 pointer-events-none blur-sm' : 'opacity-100 translate-x-0 relative blur-0'
                }`}
              >
                <AuthForm onOtpRequired={handleOtpRequired} />
              </div>
              
              {/* OtpSlide - OTP Verification */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  step === 'otp' ? 'opacity-100 translate-x-0 relative blur-0' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none blur-sm'
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
                className={`transition-all duration-500 ease-in-out ${
                  step === 'createPassword' ? 'opacity-100 translate-x-0 relative blur-0' : 'opacity-0 translate-x-full absolute inset-0 pointer-events-none blur-sm'
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
        </motion.div>
      </main>
    </div>
  );
};

export default AuthPage;