import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

import { useInView } from 'react-intersection-observer';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function QualityRadarChart({ data }) {
  const qualityScores = data?.scores || [];
  const strengths = data?.strengths || [];
  const improvements = data?.improvements || [];
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">AI Product Quality Assessment</h2>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        {/* Radar */}
        <div className="relative bg-black/20 rounded-xl border border-white/5 h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-52 h-52 bg-purple-600/15 rounded-full blur-3xl" />
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={qualityScores}>
              <PolarGrid stroke="#ffffff15" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(8,2,17,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#e879f9' }} />
              <Radar name="Score" dataKey="score" stroke="#ec4899" strokeWidth={2.5} fill="#a855f7" fillOpacity={0.35} animationDuration={1800} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Checklists */}
        <div className="flex flex-col gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Quality Insight Checklist</h3>
            <div className="flex flex-col gap-2">
              {strengths.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-300">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border border-dashed border-white/15 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Recommended Improvements</h3>
            <div className="flex flex-col gap-2">
              {improvements.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6 + i * 0.1 }} className="flex items-start gap-2">
                  <AlertTriangle size={15} className="text-pink-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-300">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
