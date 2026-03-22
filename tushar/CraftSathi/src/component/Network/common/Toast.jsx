import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = { success: 'bg-pink-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const icons = {
        success: <CheckCircle2 className="w-6 h-6 mr-3" />,
        error: <AlertTriangle className="w-6 h-6 mr-3" />,
        info: <Info className="w-6 h-6 mr-3" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-5 right-5 text-white px-6 py-4 rounded-lg shadow-xl flex items-center z-[100] ${colors[type] || 'bg-gray-800'}`}>
            {icons[type]} {message}
        </motion.div>
    );
};

export default Toast;