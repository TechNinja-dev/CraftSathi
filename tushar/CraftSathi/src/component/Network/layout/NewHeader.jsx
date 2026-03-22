import React from 'react';
// import { useAuth } from '../../context/authcontext';
import { useAuth } from '../../../../src/context/authcontext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faNetworkWired, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Plus, Bell, House } from 'lucide-react';

const NewHeader = ({ onAddProductClick }) => {
    const { currentUser } = useAuth();

    const getPhotoURL = () => {
        if (currentUser && currentUser.photoURL) {
            return currentUser.photoURL;
        }
        return null;
    };

    const getFirstLetter = () => {
        if (currentUser && currentUser.displayName) {
            return currentUser.displayName.charAt(0).toUpperCase();
        }
        return 'A';
    };

    const navItems = [
        { name: 'Home', path: '/', icon: <House size={18} /> },
        { name: 'Story', path: '/ai/story', icon: <FontAwesomeIcon icon={faBook} /> },
        { name: 'Network', path: '/network', icon: <FontAwesomeIcon icon={faNetworkWired} /> },
        { name: 'Gallary', path: '/Gallary', icon: <FontAwesomeIcon icon={faBuilding} /> }
    ];

    return (
        <header className="sticky top-0 z-40 bg-[#1A062E]/80 backdrop-blur-md border-b border-fuchsia-800/50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <nav className="hidden md:flex space-x-6">
                    {navItems.map((item) => (
                        <a key={item.name} href={item.path} className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
                            {item.icon}
                            <span>{item.name}</span>
                        </a>
                    ))}
                </nav>
                <div className="flex items-center space-x-6">
                    <button onClick={onAddProductClick} className="hidden sm:flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-900/50">
                        <Plus size={18} /> Add Product
                    </button>
                    <Bell className="text-gray-400 hover:text-pink-400 cursor-pointer" />
                    {getPhotoURL() ? (
                        <img src={getPhotoURL()} alt="User Avatar" className="h-8 w-8 rounded-full object-cover cursor-pointer" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold cursor-pointer">
                            {getFirstLetter()}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NewHeader;