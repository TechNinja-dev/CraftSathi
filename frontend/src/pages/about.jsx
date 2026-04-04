import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PenTool, Scissors, Brush, Frame, Palette, Globe, FileText, 
  Brain, Fingerprint, Sparkles, Archive, UserPlus, Map, 
  CheckCircle, Rocket, Link2, Users, Cpu, ShieldCheck, 
  Truck, Monitor, ArrowRight, Guitar, Music, Wand2, Tent, ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import CountUp from 'react-countup';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import Navbar from '../components/layout/Navbar.jsx'; 
import Footer from '../components/layout/Footer.jsx'; 

/* --- Global Animation Constraints --- */
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

/* --- Data Definitions --- */
const chartData = [
  { year: '2021', income: 15 },
  { year: '2022', income: 28 },
  { year: '2023', income: 45 },
  { year: '2024', income: 72 },
  { year: '2025', income: 120 }
];

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

const markers = [
  { name: "Jaipur", coordinates: [75.7873, 26.9124] },
  { name: "Kutch", coordinates: [69.8597, 23.7337] },
  { name: "Banaras", coordinates: [82.9902, 25.3176] }
];

const timelineSteps = [
  { icon: UserPlus, label: "Onboarding" },
  { icon: Map, label: "Story Mapping" },
  { icon: CheckCircle, label: "Quality Check" },
  { icon: Rocket, label: "Global Launch" },
  { icon: Link2, label: "Marketplace Connection" }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />
      <div className="relative flex-1 bg-[#05010b] text-white overflow-hidden pb-24">
        
        {/* Core Global Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none fixed">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-700/10 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[20%] left-[-10%] w-[800px] h-[800px] bg-pink-700/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-8">
          
          {/* =========================================
              1. HERO SECTION
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
            className="pt-32 pb-20 relative flex flex-col items-center text-center w-full"
          >
            {/* Floating Glass Tile Icons */}
            {[
              { Icon: Tent, x: -380, y: -80, delay: 0, color: "text-purple-400 drop-shadow-[0_0_15px_#a855f7]" }, // Top Left (Pot/Vase alternative)
              { Icon: Wand2, x: 0, y: -140, delay: 2, color: "text-pink-400 drop-shadow-[0_0_15px_#ec4899]" },    // Top Mid
              { Icon: Frame, x: 380, y: -60, delay: 1.5, color: "text-purple-400 drop-shadow-[0_0_15px_#a855f7]" }, // Top Right (Loom)
              { Icon: Brush, x: -420, y: 100, delay: 3, color: "text-pink-400 drop-shadow-[0_0_15px_#ec4899]" },   // Mid Left
              { Icon: Guitar, x: 420, y: 120, delay: 4.5, color: "text-pink-400 drop-shadow-[0_0_15px_#ec4899]" },  // Mid Right
              { Icon: Palette, x: -250, y: 220, delay: 1, color: "text-purple-400 drop-shadow-[0_0_15px_#a855f7]" },// Bottom Left
              { Icon: Scissors, x: 0, y: 280, delay: 3.5, color: "text-pink-400 drop-shadow-[0_0_15px_#ec4899]" },  // Bottom Mid
              { Icon: Music, x: 250, y: 200, delay: 2.5, color: "text-purple-400 drop-shadow-[0_0_15px_#a855f7]" }  // Bottom Right
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ x: node.x, y: node.y, opacity: 0 }}
                animate={{ 
                  y: [node.y - 20, node.y + 20, node.y - 20],
                  rotate: [0, 360], // Continuous rounding animation
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  y: { repeat: Infinity, repeatType: "mirror", duration: 7, ease: "easeInOut", delay: node.delay },
                  rotate: { repeat: Infinity, duration: 25, ease: "linear" }, // Slow continuous 360 spin
                  opacity: { repeat: Infinity, repeatType: "mirror", duration: 5, ease: "easeInOut", delay: node.delay }
                }}
                className="absolute hidden md:flex items-center justify-center w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.2)] z-0"
              >
                <node.Icon size={48} strokeWidth={1.5} className={node.color} />
              </motion.div>
            ))}

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl z-10 leading-tight mt-10">
              Preserving Heritage <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Through Intelligence</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl z-10">
              We bridge centuries-old artisan traditions with digital storytelling and global marketplaces. Enabling local crafts to reach the world.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4 z-10">
              <motion.button whileTap={{ scale: 0.96 }} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-shadow">
                Our Mission
              </motion.button>
              <motion.button whileTap={{ scale: 0.96 }} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-medium transition-colors">
                Watch Story
              </motion.button>
            </motion.div>
          </motion.section>

          {/* =========================================
              2. CHALLENGES SECTION
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full"
          >
            <h2 className="text-3xl font-semibold mb-8 text-center text-white">The Challenges</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { title: "Global Exposure Gap", desc: "Artisans struggle to reach global buyers due to language barriers and digital isolation.", icon: Globe },
                { title: "Documentation Gap", desc: "Centuries of generational craft techniques are being lost without digital lineage.", icon: FileText }
              ].map((card, i) => (
                <motion.div 
                  key={i} variants={itemVariants} whileHover={{ scale: 1.05 }}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] transition-all cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                    <card.icon size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-400">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* =========================================
              3. SOLUTIONS SECTION
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full"
          >
            <h2 className="text-3xl font-semibold mb-8 text-center text-white">Our Solution</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { title: "AI Story Engine", desc: "Generates Immersive\nnarratives.", icon: Brain, color: "text-pink-400" },
                { title: "Identity Builder", desc: "Creates digital craft\npassports.", icon: Fingerprint, color: "text-purple-400" }
              ].map((card, i) => (
                <motion.div 
                  key={i} variants={itemVariants} whileHover={{ scale: 1.03 }}
                  className="relative overflow-hidden bg-[#080211] border border-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col justify-start shadow-[0_0_40px_rgba(236,72,153,0.05)] hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] transition-all min-h-[180px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/5 blur-3xl -z-10" />
                  
                  <div className="relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                      <card.icon size={14} className={card.color} />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{card.desc}</p>
                  </div>
                  
                  {/* Huge illustrative graphic bleeding off the right */}
                  <div className="absolute right-[-20px] bottom-[-10px] opacity-50 z-0">
                    <card.icon size={130} strokeWidth={1} className={`drop-shadow-[0_0_30px_#ec4899] ${card.color}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* =========================================
              4. CORE INFRASTRUCTURE
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-10 text-center text-white">Core Infrastructure</h2>
            <div className="flex flex-col gap-4">
              
              {/* Giant Top Card */}
              <motion.div 
                variants={itemVariants}
                className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 h-[200px] flex flex-col justify-start"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[80px]" />
                 <h3 className="text-lg font-semibold text-white mb-1">Neural Craft Storyteller</h3>
                 <p className="text-sm text-gray-400 mb-6">Optimizing immersive auto-visualizing any handwoven piece.</p>
                 
                 {/* Glowing Audio Waveform Mockup */}
                 <div className="absolute bottom-6 left-0 right-0 h-[60px] flex items-center justify-center opacity-70">
                    <svg className="w-full h-full" viewBox="0 0 800 60" preserveAspectRatio="none">
                      <path d="M 0 30 C 50 -10, 150 70, 200 30 C 250 -10, 350 70, 400 30 C 450 -10, 550 70, 600 30 C 650 -10, 750 70, 800 30" fill="none" stroke="rgba(236,72,153,0.5)" strokeWidth="2" />
                      <path d="M 0 30 C 50 10, 150 50, 200 30 C 250 10, 350 50, 400 30 C 450 10, 550 50, 600 30 C 650 10, 750 50, 800 30" fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="1" />
                    </svg>
                 </div>
              </motion.div>

              {/* Two stacked bottom cards */}
              <div className="flex flex-col gap-4">
                {[
                  { title: "Heritage Repository", desc: "Digitizing 10,000+ weaving patterns to prevent cultural erasure.", icon: Archive },
                  { title: "Global Marketplace", desc: "Serving 50k countries with carbon neutral trading chains.", icon: Globe }
                ].map((card, i) => (
                  <motion.div 
                    key={i} variants={itemVariants}
                    className="flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-semibold text-white mb-1">{card.title}</h3>
                      <p className="text-sm text-gray-400">{card.desc}</p>
                    </div>
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <card.icon size={20} className="text-pink-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* =========================================
              5. MEASURABLE IMPACT
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full"
          >
            <h2 className="text-3xl font-semibold mb-10 text-center text-white">Measurable Impact</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* Radial Progress Metric */}
              <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute bg-purple-500/10 blur-[80px] w-full h-full inset-0 z-0"/>
                <div className="relative w-40 h-40 mb-4 z-10 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0 300" }}
                      whileInView={{ strokeDasharray: "250 300" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      cx="50" cy="50" r="45" fill="none" stroke="url(#pinkGradient)" strokeWidth="8" strokeLinecap="round" 
                    />
                    <defs>
                      <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-3xl font-bold font-mono text-white">
                    <CountUp end={89} duration={2.5} enableScrollSpy scrollSpyOnce />%
                  </div>
                </div>
                <h3 className="text-sm font-medium tracking-wide text-gray-300 uppercase z-10">Female Artisan Retention</h3>
              </motion.div>

              {/* Bar Graph Recharts */}
              <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col pt-10">
                <h3 className="text-sm font-medium tracking-wide text-gray-300 uppercase z-10 text-center mb-6">Average Income Increase</h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{background:'#05010b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color: 'white'}} itemStyle={{color: 'white'}} />
                      <Bar dataKey="income" fill="#a855f7" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={`url(#barGrad)`} />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e879f9" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

            </div>
          </motion.section>

          {/* =========================================
              6. ARTISAN JOURNEY TIMELINE
             ========================================= */}
           <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
            className="py-16 w-full max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-12 text-center text-white">The Artisan Journey</h2>
            <div className="relative flex justify-between items-center w-full px-4 overflow-x-auto pb-6 custom-scrollbar">
              
              {/* Connecting Line */}
              <div className="absolute left-[5%] right-[5%] top-6 h-0.5 bg-white/10 z-0">
                <motion.div 
                  initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                />
              </div>

              {timelineSteps.map((step, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col items-center relative z-10 shrink-0 min-w-[120px]">
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    className="w-12 h-12 rounded-full bg-[#080211] border-2 border-pink-500/50 flex items-center justify-center text-pink-400 mb-3 shadow-[0_0_20px_rgba(236,72,153,0.2)] bg-gradient-to-br hover:from-purple-900/40 hover:to-pink-900/40 transition-colors"
                  >
                    <step.icon size={20} />
                  </motion.div>
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest text-center">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* =========================================
              7. EXPLORE CRAFT ROOTS (MAP)
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full"
          >
            <div className="grid lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-semibold mb-4 text-white">Explore Our Craft Roots</h2>
                <p className="text-gray-400 text-sm mb-6">Filter the rich heritage of India. Click on a region to explore the specific stories, crafts, and the artisan families preserving these local traditions.</p>
                
                <div className="space-y-4">
                   <input type="text" placeholder="Search craft (e.g., Blue Pottery)..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
                   <div className="flex gap-2">
                     <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">Jaipur Blue Pottery</span>
                     <span className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full border border-white/10 hover:text-white cursor-pointer transition-colors">Banarasi Silk</span>
                   </div>
                </div>
              </div>
              
              <div className="relative w-full h-[350px] bg-black/20 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
                <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
                <ComposableMap projectionConfig={{ scale: 800, center: [80, 22] }} style={{ width: "100%", height: "100%" }}>
                   <Geographies geography={INDIA_TOPO_JSON}>
                     {({ geographies }) => geographies.map(geo => (
                       <Geography 
                          key={geo.rsmKey} geography={geo} 
                          fill="#140421" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} 
                          style={{ hover: { fill: "#1e0b35", outline: "none" }, default: { outline: "none" }, pressed: { outline: "none" } }} 
                       />
                     ))}
                   </Geographies>
                   {markers.map(({ name, coordinates }) => (
                     <Marker key={name} coordinates={coordinates}>
                       <g className="animate-pulse">
                         <circle r={6} fill="#ec4899" />
                         <circle r={12} fill="#ec4899" opacity={0.3} />
                       </g>
                       <text textAnchor="middle" y={-16} style={{ fontFamily: "Inter", fill: "#ffffff", fontSize: "10px", fontWeight: "600" }}>{name}</text>
                     </Marker>
                   ))}
                </ComposableMap>
              </div>
            </div>
          </motion.section>

          {/* =========================================
              8. TECH STACK & 9. HUMAN VALUES NETWORK
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full flex flex-col gap-16 items-center"
          >
            {/* TECH STACK */}
            <div className="flex flex-col items-center z-0 w-full max-w-lg mb-8">
               <h3 className="text-2xl font-semibold text-white mb-8">The Tech Stack</h3>
               <div className="flex flex-col items-center gap-0 w-full max-w-sm relative pointer-events-auto">
                 {[
                   { title: "Community & Ecosystem" },
                   { title: "AI Core & Language Models" },
                   { title: "Identity & Blockchain" }
                 ].map((stack, i) => (
                   <React.Fragment key={i}>
                     <motion.div 
                       whileHover={{ scale: 1.02 }}
                       className="w-full bg-[#191124] border border-white/10 backdrop-blur-xl rounded-xl p-5 flex items-center justify-center shadow-lg relative z-10 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all cursor-pointer"
                     >
                       <span className="text-sm font-medium text-gray-300">{stack.title}</span>
                     </motion.div>
                     {i < 2 && <div className="h-4 w-[2px] bg-white/10 z-0 my-1" />}
                   </React.Fragment>
                 ))}
                 
                 {/* Fake 3D Layering Drop Shadow effect */}
                 <div className="absolute bottom-[-10px] w-[94%] h-[100px] bg-[#191124]/60 border border-white/5 rounded-xl z-[-1]" />
                 <div className="absolute bottom-[-20px] w-[88%] h-[100px] bg-[#191124]/30 border border-white/5 rounded-xl z-[-2]" />
               </div>
            </div>

            {/* HUMAN NETWORK */}
            <div className="w-full flex flex-col items-center justify-center relative overflow-visible mt-16">
                <h3 className="text-xl font-semibold tracking-wide text-white mb-20 text-center">Guided by Human Values</h3>
                
                <div className="relative w-full max-w-4xl h-[150px] flex items-center justify-between px-10">
                  {/* Highly intricate SVG Constellation Web */}
                  <svg className="absolute inset-0 w-full h-[300px] -top-20 z-0 pointer-events-none" viewBox="0 0 1000 300">
                     {/* Web Lines */}
                     <g stroke="rgba(236,72,153,0.2)" strokeWidth="1.5">
                       <line x1="120" y1="150" x2="300" y2="40" stroke="rgba(168,85,247,0.3)" />
                       <line x1="120" y1="150" x2="250" y2="220" />
                       <line x1="300" y1="40" x2="380" y2="150" />
                       <line x1="250" y1="220" x2="380" y2="150" />
                       <line x1="380" y1="150" x2="550" y2="60" stroke="rgba(168,85,247,0.3)" />
                       <line x1="380" y1="150" x2="520" y2="250" stroke="rgba(236,72,153,0.4)" />
                       <line x1="550" y1="60" x2="650" y2="150" />
                       <line x1="520" y1="250" x2="650" y2="150" />
                       <line x1="650" y1="150" x2="780" y2="80" stroke="rgba(168,85,247,0.3)" />
                       <line x1="650" y1="150" x2="720" y2="280" />
                       <line x1="780" y1="80" x2="880" y2="150" />
                       <line x1="720" y1="280" x2="880" y2="150" stroke="rgba(236,72,153,0.4)" />
                     </g>
                     {/* Glowing Nodes */}
                     <g fill="#ec4899">
                       <circle cx="300" cy="40" r="4" className="drop-shadow-[0_0_10px_#ec4899]" />
                       <circle cx="250" cy="220" r="5" fill="#a855f7" className="drop-shadow-[0_0_15px_#a855f7]" />
                       <circle cx="550" cy="60" r="6" fill="#f472b6" className="drop-shadow-[0_0_20px_#ec4899]" />
                       <circle cx="520" cy="250" r="4" className="drop-shadow-[0_0_12px_#ec4899]" />
                       <circle cx="780" cy="80" r="4" fill="#a855f7" className="drop-shadow-[0_0_10px_#a855f7]" />
                       <circle cx="720" cy="280" r="7" className="drop-shadow-[0_0_25px_#ec4899]" />
                     </g>
                  </svg>
                  
                  {['Rahul Varma', 'Priya Sharma', 'Asad Ali', 'Sara Bhan'].map((name, i) => (
                     <motion.div 
                        key={i} variants={itemVariants} 
                        className="relative z-10 flex flex-col items-center gap-3"
                     >
                        <div className="w-20 h-20 rounded-full border-2 border-purple-500 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)] relative">
                           <div className="absolute inset-0 bg-pink-500/20 mix-blend-color z-10" />
                           <img src={`https://i.pravatar.cc/150?img=${i+11}`} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col items-center">
                           <span className="text-xs font-semibold text-white whitespace-nowrap">{name}</span>
                           <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-tight">{['CEO & Founder', 'CTO', 'Research Chief', 'Market Director'][i]}</span>
                        </div>
                     </motion.div>
                  ))}
                </div>
            </div>
          </motion.section>

          {/* =========================================
              10. ROADMAP SECTION
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-16 w-full max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-12 text-center text-white">Roadmap</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { q: "Q3", title: "AI Verification", desc: "Automated authenticity metadata generation.", icon: ShieldCheck, color: "from-purple-500/30 to-transparent" },
                { q: "Q4", title: "Global Logistics Integration", desc: "One-click export documentation API.", icon: Truck, color: "from-pink-500/30 to-transparent" },
                { q: "Q1", title: "Virtual Showroom", desc: "3D AR view for premium generational artifacts.", icon: Monitor, color: "from-purple-500/30 to-transparent" }
              ].map((card, i) => (
                <motion.div 
                  key={i} variants={itemVariants} whileHover={{ y: -6 }}
                  className="relative overflow-hidden bg-[#0a0512] border border-white/10 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all cursor-default flex flex-col items-start min-h-[200px]"
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${card.color} blur-[50px] -z-10`} />
                  
                  <ArrowUpRight size={20} className="stroke-[1.5px] text-gray-400 hover:text-white absolute top-6 right-6 transition-colors" />

                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-pink-400 flex items-center justify-center mb-6">
                    <card.icon size={18} strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex gap-2 items-center mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded-md text-gray-300 tracking-wider mix-blend-screen">{card.q}: {card.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* =========================================
              11. CALL TO ACTION
             ========================================= */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionVariants}
            className="py-24 w-full"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="max-w-4xl mx-auto rounded-3xl p-10 md:p-16 text-center border border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.1)] relative overflow-hidden bg-[#080211]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 z-0" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join us in preserving cultural heritage</h2>
                <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">Be part of the digital renaissance. Whether you're an artisan, a partner, or a lover of craft, there's a place for you in the network.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-shadow">
                    Become Partner
                  </button>
                  <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-medium transition-colors flex items-center justify-center">
                    Explore Collection <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.section>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;