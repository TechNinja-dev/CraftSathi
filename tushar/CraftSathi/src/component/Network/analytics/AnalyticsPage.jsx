import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Users, ShoppingBag, Percent, ArrowUp, ArrowDown } from 'lucide-react';

// --- Helper Functions for Mock Data ---

// Generates data for the sales chart
const generateSalesData = (timeframe) => {
    if (timeframe === 'daily') {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            name: day,
            sales: Math.floor(Math.random() * 2000) + 500,
        }));
    }
    if (timeframe === 'weekly') {
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => ({
            name: week,
            sales: Math.floor(Math.random() * 10000) + 2000,
        }));
    }
    // Monthly
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
        name: month,
        sales: Math.floor(Math.random() * 50000) + 10000,
    }));
};

// Generates data for the heatmap
const generateHeatmapData = () => {
    const data = [];
    for (let i = 0; i < 7 * 12; i++) { // 7 days, 12 columns
        data.push({
            value: Math.floor(Math.random() * 100)
        });
    }
    return data;
};

// --- Reusable Components ---

const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#1E0B38] to-[#2a0f4a] p-6 rounded-xl border border-fuchsia-800/40 shadow-lg"
    >
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                <Icon size={24} />
            </div>
        </div>
        <div className={`flex items-center text-xs mt-4 ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
            <span>{change}% vs last month</span>
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#10051e] p-3 rounded-lg border border-fuchsia-700/50 text-white shadow-xl">
                <p className="label text-sm font-bold">{`${label}`}</p>
                <p className="intro text-pink-400">{`Sales: $${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

// --- Main Analytics Page Component ---

const AnalyticsPage = () => {
    const [timeframe, setTimeframe] = useState('daily');
    const [activeIndex, setActiveIndex] = useState(null);

    const salesData = useMemo(() => generateSalesData(timeframe), [timeframe]);
    const heatmapData = useMemo(() => generateHeatmapData(), []);
    
    const topProducts = useMemo(() => [
        { name: 'Quantum Hoodie', sales: 25400 },
        { name: 'Cyberpunk Jacket', sales: 21800 },
        { name: 'Holographic Tee', sales: 18500 },
        { name: 'Gravity Boots', sales: 15200 },
        { name: 'Chrono Watch', sales: 11300 },
    ], []);

    const handleBarMouseEnter = (data, index) => setActiveIndex(index);
    const handleBarMouseLeave = () => setActiveIndex(null);

    return (
        <motion.div initial="hidden" animate="visible" variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }} className="space-y-6">

            {/* --- Header --- */}
            <motion.h1 variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-3xl font-bold text-white">
                Analytics Dashboard
            </motion.h1>

            {/* --- Stat Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} title="Total Revenue" value="$75,483" change={12.5} changeType="up" color="green" />
                <StatCard icon={Users} title="New Customers" value="1,245" change={8.2} changeType="up" color="pink" />
                <StatCard icon={ShoppingBag} title="Avg. Order Value" value="$182.50" change={2.1} changeType="down" color="yellow" />
                <StatCard icon={Percent} title="Conversion Rate" value="4.82%" change={0.5} changeType="up" color="purple" />
            </div>

            {/* --- Sales Chart --- */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="bg-gradient-to-br from-[#1E0B38] to-[#2a0f4a] p-6 rounded-xl border border-fuchsia-800/40">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Sales Overview</h2>
                    <div className="flex items-center bg-fuchsia-900/30 p-1 rounded-lg">
                        {['daily', 'weekly', 'monthly'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${timeframe === t ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-fuchsia-800/50'}`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} onMouseLeave={handleBarMouseLeave}>
                            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value/1000)}k`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217, 70, 239, 0.1)' }} />
                            <Bar dataKey="sales" radius={[4, 4, 0, 0]} onMouseEnter={handleBarMouseEnter}>
                                {salesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === activeIndex ? '#f472b6' : '#a21caf'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- Customer Activity Heatmap --- */}
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="lg:col-span-2 bg-gradient-to-br from-[#1E0B38] to-[#2a0f4a] p-6 rounded-xl border border-fuchsia-800/40">
                    <h2 className="text-xl font-semibold text-white mb-4">Customer Activity</h2>
                     <div className="flex flex-wrap gap-1">
                        {heatmapData.map((day, index) => (
                            <div
                                key={index}
                                className="w-4 h-4 rounded-sm"
                                style={{ backgroundColor: `rgba(244, 114, 182, ${day.value / 100})` }}
                                title={`Activity: ${day.value}%`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end items-center text-xs text-gray-500 mt-2 gap-2">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-sm bg-pink-900/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-pink-700/60"></div>
                        <div className="w-3 h-3 rounded-sm bg-pink-500/80"></div>
                        <div className="w-3 h-3 rounded-sm bg-pink-400"></div>
                        <span>More</span>
                    </div>
                </motion.div>

                {/* --- Top Products --- */}
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="bg-gradient-to-br from-[#1E0B38] to-[#2a0f4a] p-6 rounded-xl border border-fuchsia-800/40">
                    <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
                    <ul className="space-y-3">
                        {topProducts.map((product, i) => (
                            <motion.li
                                key={product.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex justify-between items-center text-sm"
                            >
                                <span className="text-gray-300">{product.name}</span>
                                <span className="font-bold text-pink-400">${product.sales.toLocaleString()}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
