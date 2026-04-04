import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ExportReadinessScore() {
  const [checklist, setChecklist] = useState({
    msme: true,
    odop: false,
    iec: false
  });

  const [score, setScore] = useState(0);
  
  useEffect(() => {
    let newScore = 0;
    if (checklist.msme) newScore += 30;
    if (checklist.odop) newScore += 20;
    if (checklist.iec) newScore += 50;
    setScore(newScore);
  }, [checklist]);

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
      <h2 className="mb-4 text-xl font-semibold text-white">Export Readiness</h2>
      
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          {/* Background Circle */}
          <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{score}%</span>
            <span className="text-xs uppercase text-gray-400 tracking-widest">Score</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { key: 'msme', label: 'MSME Registered', value: 30 },
          { key: 'odop', label: 'ODOP Certified', value: 20 },
          { key: 'iec', label: 'IEC Code Acquired', value: 50 },
        ].map((item) => (
          <div 
            key={item.key}
            onClick={() => toggleCheck(item.key)}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
          >
            <span className="text-sm font-medium text-gray-200">{item.label}</span>
            <motion.div
              initial={false}
              animate={{
                backgroundColor: checklist[item.key] ? '#a855f7' : 'rgba(255, 255, 255, 0.1)',
                borderColor: checklist[item.key] ? '#a855f7' : 'rgba(255, 255, 255, 0.2)'
              }}
              className="flex h-5 w-5 items-center justify-center rounded border transition-colors"
            >
              {checklist[item.key] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
