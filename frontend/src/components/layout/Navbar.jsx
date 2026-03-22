import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
    if (location.pathname === '/profile') {
    return null;
  }

  return (
    <header className="absolute top-0 left-0 w-full z-10 p-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 p-3 rounded-xl shadow-md sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold font-display text-brand-text">
          CraftSathi
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/generate" className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            Caption
          </Link>
          <Link to="/photo" className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            Posts
          </Link>
          <Link to="/network" className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            Network
          </Link>
          <Link to="/mystuff" className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            MyStuff
          </Link>

          {isAuthenticated ? (
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              <User size={18} />
              Profile
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              Sign In / Register
            </Link>
          )}
        </div>

        <button 
          className="md:hidden text-gray-700" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white rounded-lg shadow-md mt-2 p-4 flex flex-col gap-4">
          <Link to="/generate" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            Caption
          </Link>
          <Link to="/photo" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            Posts
          </Link>
          <Link to="/network" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            Network
          </Link>
          <Link to="/mystuff" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors">
            MyStuff
          </Link>

          {isAuthenticated ? (
            <Link 
              to="/profile" 
              onClick={() =>{ console.log("Navigating to /profile");
                setIsOpen(false)}}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              <User size={18} />
              Profile
            </Link>
          ) : (
            <Link 
              to="/auth" 
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;