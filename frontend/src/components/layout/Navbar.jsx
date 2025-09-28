// import React from 'react';
// import { Link } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { useAuth } from '../../App.jsx';
// import { auth } from '../../api/firebase.js';

// const Navbar = () => {
//   const { user } = useAuth();
  
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   return (
//     <header className="absolute top-0 left-0 w-full z-10 p-4">
//       <nav className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 p-3 rounded-xl shadow-md sticky top-0 z-50">
//         <Link to="/" className="text-2xl font-bold font-display text-brand-text">
//           CraftSathi
//         </Link>
        
//         <div className="flex items-center gap-8">
//           <Link 
//             to="/generate" 
//             className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors"
//           >
//             Caption
//           </Link>
//           <Link 
//             to="/photo" 
//             className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors"
//           >
//             Posts
//           </Link>
// <Link 
//   to="/network" 
//   className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors"
// >
//   Network
// </Link>
//           <Link 
//             to="/mystuff" 
//             className="text-lg font-semibold text-gray-700 hover:text-brand-primary transition-colors"
//           >
//             MyStuff
//           </Link>

//           {user ? (
//             <button 
//               onClick={handleLogout}
//               className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link 
//               to="/auth" 
//               className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
//             >
//               Sign In / Register
//             </Link>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../App.jsx';
import { auth } from '../../api/firebase.js';
import { Menu, X } from 'lucide-react'; // hamburger and close icons

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-10 p-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 p-3 rounded-xl shadow-md sticky top-0 z-50">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-display text-brand-text">
          CraftSathi
        </Link>

        {/* Desktop Links */}
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

          {user ? (
            <button 
              onClick={handleLogout}
              className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              Sign In / Register
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden text-gray-700" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>
      </nav>

      {/* Mobile Dropdown */}
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

          {user ? (
            <button 
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              Logout
            </button>
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

