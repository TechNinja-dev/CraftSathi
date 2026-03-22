import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Check, Clock, Users, Mail } from 'lucide-react';

// Mock data with connection status
const initialUsers = [
    { id: 1, name: 'Shruti Pandey', title: 'HR Team Leader', imageUrl: 'https://placehold.co/100x100/f472b6/FFFFFF?text=S', status: 'not_connected' },
    { id: 2, name: 'Hossam Adel', title: 'Customer Delivery Manager', imageUrl: 'https://placehold.co/100x100/60a5fa/FFFFFF?text=H', status: 'connected' },
    { id: 3, name: 'Muhammed Ajsal K', title: 'Mern Stack Developer', imageUrl: 'https://placehold.co/100x100/facc15/000000?text=M', status: 'not_connected' },
    { id: 4, name: 'Mohammed Junaid', title: 'Assistant Operating', imageUrl: 'https://placehold.co/100x100/4ade80/FFFFFF?text=M', status: 'not_connected' },
    { id: 5, name: 'Anjali Sharma', title: 'UX Designer', imageUrl: 'https://placehold.co/100x100/c084fc/FFFFFF?text=A', status: 'connected' },
    { id: 6, name: 'Rohan Verma', title: 'Data Scientist', imageUrl: 'https://placehold.co/100x100/fb923c/FFFFFF?text=R', status: 'not_connected' },
    { id: 7, name: 'Priya Singh', title: 'Marketing Head', imageUrl: 'https://placehold.co/100x100/f87171/FFFFFF?text=P', status: 'pending' },
    { id: 8, name: 'Vikram Rathod', title: 'Backend Engineer', imageUrl: 'https://placehold.co/100x100/34d399/FFFFFF?text=V', status: 'not_connected' },
];

// Reusable button component for different connection states
const ConnectionButton = ({ status, onClick }) => {
    if (status === 'connected') {
        return (
            <button disabled className="w-full flex items-center justify-center gap-2 text-gray-500 font-semibold py-2 px-4 border border-gray-700 rounded-lg cursor-not-allowed">
                <Check size={16} /> Connected
            </button>
        );
    }

    if (status === 'pending') {
        return (
            <button disabled className="w-full flex items-center justify-center gap-2 text-yellow-400 font-semibold py-2 px-4 border border-yellow-500/50 rounded-lg cursor-wait">
                <Clock size={16} /> Pending
            </button>
        );
    }

    return (
         <button onClick={onClick} className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-pink-600/20 text-pink-400 font-semibold py-2 px-4 border border-pink-500/50 rounded-lg transition-all duration-300 transform hover:scale-105">
            <UserPlus size={16} /> Connect
        </button>
    );
};


// Optimized, reusable card component for each user
const NetworkUserCard = React.memo(({ user, onDismiss, onConnect }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-[#1E0B38] to-[#2a0f4a] rounded-xl border border-fuchsia-800/40 text-center p-4 flex flex-col items-center relative transition-all duration-300 hover:border-fuchsia-600/80 hover:shadow-lg hover:shadow-pink-900/20"
    >
        <button onClick={() => onDismiss(user.id)} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors bg-black/20 rounded-full p-1">
            <X size={16} />
        </button>
        <img src={user.imageUrl} alt={user.name} className="w-20 h-20 rounded-full mb-3 border-2 border-fuchsia-600/50" />
        <h3 className="font-bold text-white text-md">{user.name}</h3>
        <p className="text-gray-400 text-xs mb-3 truncate w-full h-4">{user.title}</p>
        <p className="text-gray-500 text-xs mb-4">Based on your profile</p>
        <ConnectionButton status={user.status} onClick={() => onConnect(user.id)} />
    </motion.div>
));

const FilterTab = ({ children, count, isActive, onClick, icon: Icon }) => (
     <button onClick={onClick} className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-300 rounded-lg ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
        <Icon size={18} />
        <span>{children}</span>
        {count > 0 && <span className="ml-1 text-xs font-bold bg-pink-600/50 text-pink-200 px-2 py-0.5 rounded-full">{count}</span>}
        {isActive && (
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full"
                layoutId="active-tab-underline"
            />
        )}
    </button>
)

const MyNetworkPage = () => {
    const [users, setUsers] = useState(initialUsers);
    const [filter, setFilter] = useState('suggestions'); // suggestions, connected, invitations

    const handleDismiss = useCallback((id) => {
        setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
    }, []);

    const handleConnect = useCallback((id) => {
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === id ? { ...user, status: 'pending' } : user
            )
        );
    }, []);
    
    const filteredUsers = useMemo(() => {
        if (filter === 'connected') return users.filter(u => u.status === 'connected');
        if (filter === 'invitations') return users.filter(u => u.status === 'pending');
        return users.filter(u => u.status === 'not_connected');
    }, [users, filter]);

    const connectionCount = useMemo(() => users.filter(u => u.status === 'connected').length, [users]);
    const invitationCount = useMemo(() => users.filter(u => u.status === 'pending').length, [users]);

    const pageConfig = {
        suggestions: { title: "People you may know", empty: "No new suggestions right now." },
        connected: { title: "Your Connections", empty: "You haven't connected with anyone yet." },
        invitations: { title: "Pending Invitations", empty: "You have no pending invitations." },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-[#1E0B38]/80 backdrop-blur-sm p-2 rounded-xl border border-fuchsia-800/30">
                 <div className="flex items-center space-x-1">
                     <FilterTab icon={UserPlus} isActive={filter === 'suggestions'} onClick={() => setFilter('suggestions')}>Suggestions</FilterTab>
                     <FilterTab icon={Mail} count={invitationCount} isActive={filter === 'invitations'} onClick={() => setFilter('invitations')}>Invitations</FilterTab>
                     <FilterTab icon={Users} count={connectionCount} isActive={filter === 'connected'} onClick={() => setFilter('connected')}>My Network</FilterTab>
                 </div>
            </div>

            <div className="bg-[#1E0B38]/80 backdrop-blur-sm p-6 rounded-xl border border-fuchsia-800/30">
                <h2 className="text-xl font-bold text-white mb-4">{pageConfig[filter].title}</h2>
                <AnimatePresence>
                     {filteredUsers.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {filteredUsers.map(user => (
                                <NetworkUserCard key={user.id} user={user} onDismiss={handleDismiss} onConnect={handleConnect} />
                            ))}
                        </motion.div>
                    ) : (
                         <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 text-gray-500"
                        >
                            <p>{pageConfig[filter].empty}</p>
                            <p className="text-sm">Check back later!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                {filteredUsers.length > 0 && (
                     <div className="text-center">
                        <button className="text-pink-400 hover:text-white font-semibold transition-colors">
                            Show all
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MyNetworkPage;

