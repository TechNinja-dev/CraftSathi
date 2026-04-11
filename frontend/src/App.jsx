import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Generate from './components/layout/generate.jsx';
import Photo from './components/layout/photo.jsx';
import MyStuff from './components/layout/mystuff.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Navbar from './components/layout/Navbar.jsx';
import AboutPage from './pages/about.jsx';
import GuidanceLayout from './pages/guidance/GuidanceLayout.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import  Profile  from './components/layout/Profile.jsx';
import NetworkPage from './components/layout/Network/NetworkPage';
import SavedPosts from './components/layout/Network/components/SavedPosts';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/mystuff" element={<MyStuff />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidance" element={<GuidanceLayout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;