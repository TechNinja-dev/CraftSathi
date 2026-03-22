import React from 'react';
import { motion } from 'framer-motion';
import { Users, PackageCheck, BarChart2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';

const Dashboard = () => {
    const stats = [
        { title: 'Total User', value: '40,689', change: '8.5%', changeType: 'up', icon: Users, color: 'fuchsia' },
        { title: 'Total Order', value: '10,293', change: '1.3%', changeType: 'up', icon: PackageCheck, color: 'pink' },
        { title: 'Total Sales', value: '$89,000', change: '4.3%', changeType: 'down', icon: BarChart2, color: 'purple' },
        { title: 'Total Pending', value: '2,040', change: '1.8%', changeType: 'up', icon: Clock, color: 'rose' },
    ];

    const salesData = [
        { name: '5k', sales: 4000 }, { name: '10k', sales: 3000 }, { name: '15k', sales: 2000 },
        { name: '20k', sales: 6400 }, { name: '25k', sales: 1890 }, { name: '30k', sales: 2390 },
        { name: '35k', sales: 3490 }, { name: '40k', sales: 4300 }, { name: '45k', sales: 3100 },
        { name: '50k', sales: 2500 }, { name: '55k', sales: 3800 }, { name: '60k', sales: 3400 },
    ];

    return (
        <>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-6">Dashboard</motion.h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(item => <StatCard key={item.title} item={item} />)}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className="bg-[#1E0B38] p-6 rounded-xl border border-fuchsia-800/30 shadow-lg shadow-black/20">
                <h2 className="text-xl font-semibold text-white mb-4">Sales Details</h2>
                <div style={{width: '100%', height: 300}}>
                    <ResponsiveContainer>
                        <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a044e" />
                            <XAxis dataKey="name" stroke="#a1a1aa" />
                            <YAxis stroke="#a1a1aa"/>
                            <Tooltip contentStyle={{ backgroundColor: '#1E0B38', border: '1px solid #701a75', color: 'white' }} itemStyle={{ color: 'white' }} labelStyle={{color: '#d4d4d8'}}/>
                            <Line type="monotone" dataKey="sales" stroke="#f472b6" strokeWidth={2} dot={{ r: 4, fill: '#f472b6' }} activeDot={{ r: 6, fill: '#fff', stroke: '#f472b6' }}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </>
    )
}

export default Dashboard;