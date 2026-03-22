import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ item }) => {
    const colors = {
        fuchsia: { bg: 'bg-fuchsia-900/50', text: 'text-fuchsia-400' },
        pink: { bg: 'bg-pink-900/50', text: 'text-pink-400' },
        purple: { bg: 'bg-purple-900/50', text: 'text-purple-400' },
        rose: { bg: 'bg-rose-900/50', text: 'text-rose-400' },
    };
    const selectedColor = colors[item.color] || colors.purple;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E0B38] p-6 rounded-xl border border-fuchsia-800/30 shadow-lg shadow-black/20 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">{item.title}</span>
                    <span className="text-2xl font-bold text-white mt-1">{item.value}</span>
                </div>
                <div className={`${selectedColor.bg} ${selectedColor.text} rounded-full h-10 w-10 flex items-center justify-center`}>
                    <item.icon size={20}/>
                </div>
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-4">
                {item.changeType === 'up' ? <ArrowUp size={14} className="text-green-500 mr-1"/> : <ArrowDown size={14} className="text-red-500 mr-1"/>}
                <span className={item.changeType === 'up' ? 'text-green-400' : 'text-red-400'}>{item.change}</span>
                <span className="ml-1">from yesterday</span>
            </div>
        </motion.div>
    );
};

export default StatCard;