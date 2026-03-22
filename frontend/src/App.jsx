import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Generate from './components/layout/generate.jsx';
import Photo from './components/layout/photo.jsx';
import MyStuff from './components/layout/mystuff.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Navbar from './components/layout/Navbar.jsx';
import AboutPage from './pages/about.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import  Profile  from './components/layout/Profile.jsx';

function App() {
  return (
    <ToastProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/mystuff" element={<MyStuff />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;