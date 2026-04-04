import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PricingCalculator() {
  const [materialCost, setMaterialCost] = useState(500);
  const [laborHours, setLaborHours] = useState(5);
  const [complexity, setComplexity] = useState(1.5); // Multiplier
  const hourlyRate = 150; // Standard artisan rate

  const [pricing, setPricing] = useState({
    base: 0,
    suggested: 0,
    premium: 0,
    margin: 0
  });

  useEffect(() => {
    const laborCost = laborHours * hourlyRate;
    const base = materialCost + laborCost;
    const suggested = base * complexity;
    const margin = suggested - base;
    const premium = suggested * 1.3;

    setPricing({ base, suggested, premium, margin });
  }, [materialCost, laborHours, complexity]);

  const chartData = [
    { name: 'Material', value: materialCost, color: '#e879f9' },
    { name: 'Labor', value: laborHours * hourlyRate, color: '#a855f7' },
    { name: 'Margin', value: pricing.margin, color: '#ec4899' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/20 bg-gray-900/90 p-3 shadow-xl backdrop-blur-md">
          <p className="text-sm font-medium text-white">{`${payload[0].payload.name} Cost`}</p>
          <p className="text-lg font-bold text-purple-400">{`₹${payload[0].value.toFixed(0)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-semibold text-white">AI Pricing Engine</h2>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 flex justify-between text-sm uppercase tracking-wide text-gray-400">
              <span>Material Cost (₹)</span>
              <span className="text-purple-300">₹{materialCost}</span>
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={materialCost}
              onChange={(e) => setMaterialCost(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-purple-500"
            />
          </div>
          <div>
            <label className="mb-2 flex justify-between text-sm uppercase tracking-wide text-gray-400">
              <span>Labor Time (Hours)</span>
              <span className="text-purple-300">{laborHours} hrs</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={laborHours}
              onChange={(e) => setLaborHours(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-purple-500"
            />
          </div>
          <div>
            <label className="mb-2 flex justify-between text-sm uppercase tracking-wide text-gray-400">
              <span>Market Complexity & Value</span>
              <span className="text-purple-300">{complexity}x</span>
            </label>
            <input
              type="range"
              min="1.1"
              max="3"
              step="0.1"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-purple-500"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-900/40 to-black/40 p-6 border border-purple-500/20">
          <p className="text-sm uppercase tracking-wider text-gray-400">Suggested Retail Price</p>
          <div className="my-2 flex items-baseline gap-1 text-5xl font-bold tracking-tight text-white">
            <span className="text-3xl text-purple-400">₹</span>
            <CountUp 
              start={0} 
              end={pricing.suggested} 
              duration={1} 
              separator="," 
              preserveValue 
            />
          </div>
          <p className="text-xs text-green-400">
            Premium capability: ₹{pricing.premium.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          
          {/* Chart Breakdown */}
          <div className="mt-8 h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
