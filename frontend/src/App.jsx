import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import { auth } from './api/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import Generate from './components/layout/generate.jsx';
import Photo from './components/layout/photo.jsx';
import MyStuff from './components/layout/mystuff.jsx';
// Your page components
import WelcomePage from './pages/WelcomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Navbar from './components/layout/Navbar.jsx';
// import NetworkPage from './components/layout/Network/NetworkPage.jsx'; // 
import AboutPage from './pages/about.jsx';



// Create the Auth Context and Hook
const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This hook is at the top, called unconditionally
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-brand-bg">Loading...</div>;
  }

return (
  <AuthContext.Provider value={{ user }}>
    <Navbar />
    <Routes>
      {/* Route 1: The Welcome Page at the root URL "/" */}
      <Route path="/" element={<WelcomePage />} />

      {/* Route 2: The Authentication Page at "/auth" */}
      {/* It should NOT redirect if the user is logged in, as this is the only way to log in. */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Route 3: The Generate Page (Protected) at "/generate" */}
      {/* If the user is NOT logged in, they will be redirected to the auth page */}
      <Route path="/generate" element={<Generate />} />


      <Route path="/photo" element={<Photo />} />

      {/* <Route path="/network" element={<NetworkPage />} /> */}

      <Route path="/mystuff" element={ <MyStuff />} />

      <Route path="/about" element={<AboutPage />} />

      {/* A catch-all that redirects any unknown URL to the welcome page */}
      <Route path="*" element={<Navigate to="/" />} />


    </Routes>
  </AuthContext.Provider>
);
}

export default App;