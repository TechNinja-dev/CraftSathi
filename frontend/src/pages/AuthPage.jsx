import React from 'react';
import AuthForm from '../components/auth/AuthForm.jsx';
import artisanImage from '../assets/authimg.png';

const AuthPage = () => {
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

        {/* Right Panel: Action Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
