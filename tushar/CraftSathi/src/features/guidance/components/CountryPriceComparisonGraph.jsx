import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrendingUp, Star } from "lucide-react";

const data = [
  { country: "India",     flag: "🇮🇳", price: 1800, confidence: 86, color: "#a855f7" },
  { country: "USA",       flag: "🇺🇸", price: 6200, confidence: 95, color: "#ec4899" },
  { country: "Germany",   flag: "🇩🇪", price: 5200, confidence: 81, color: "#60a5fa" },
  { country: "Japan",     flag: "🇯🇵", price: 3100, confidence: 78, color: "#34d399" },
  { country: "UAE",       flag: "🇦🇪", price: 2400, confidence: 71, color: "#f97316" },
  { country: "Australia", flag: "🇦🇺", price: 4100, confidence: 72, color: "#facc15" },
];

/* ── Custom Tooltip ─────────────────────────────── */
const GlassTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "rgba(8,2,17,0.97)",
        border: `1px solid ${d.color}40`,
        borderRadius: 14,
        padding: "12px 16px",
        boxShadow: `0 0 24px ${d.color}30`,
        fontFamily: "Inter, sans-serif",
        minWidth: 160,
      }}
    >
      <p style={{ color: "#fff", fontWeight: 600, marginBottom: 6, fontSize: 15 }}>
        {d.flag} {d.country}
      </p>
      <p style={{ color: d.color, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        ₹{d.price.toLocaleString("en-IN")}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          backgroundColor: `${d.color}18`,
          borderRadius: 8,
          padding: "4px 8px",
          marginTop: 4,
        }}
      >
        <span style={{ color: d.color, fontSize: 11, fontWeight: 600 }}>
          {d.confidence}% AI Confidence
        </span>
      </div>
    </div>
  );
};

/* ── Custom Y-Axis tick with flag + name ─────────── */
const CustomYTick = ({ x, y, payload }) => {
  const entry = data.find((d) => d.country === payload.value);
  if (!entry) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-8} y={0} dy={5} textAnchor="end" fontSize={13} fill="rgba(255,255,255,0.55)">
        {entry.flag} {entry.country}
      </text>
    </g>
  );
};

/* ── Custom bar shape with glow + rounded right ────  */
const GlowBar = (props) => {
  const { x, y, width, height, fill, color } = props;
  return (
    <g>
      {/* glow layer */}
      <rect
        x={x}
        y={y + height * 0.15}
        width={width}
        height={height * 0.7}
        rx={6}
        fill={color}
        opacity={0.18}
        filter="blur(6px)"
      />
      {/* main bar */}
      <rect x={x} y={y + 4} width={width} height={height - 8} rx={6} fill={fill} />
    </g>
  );
};

/* ── Main Component ─────────────────────────────── */
export default function CountryPriceComparisonGraph() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const bestCountry = data.reduce((a, b) => (a.price > b.price ? a : b));
  const maxPrice = bestCountry.price;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65 }}
      className="relative rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.07)] p-8 hover:shadow-[0_0_120px_rgba(236,72,153,0.14)] transition-all duration-500 w-full overflow-hidden"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-600/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-pink-600/10 blur-[60px]" />

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Global Price Intelligence
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            AI-predicted optimal pricing across global marketplaces
          </p>
        </div>
        <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-xl px-4 py-2">
          <Star size={14} className="text-pink-400" />
          <span className="text-xs font-semibold text-pink-300 whitespace-nowrap">
            Best: {bestCountry.flag} {bestCountry.country}
          </span>
        </div>
      </div>

      {/* ── Chart + Confidence side-by-side ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-8 items-center">

        {/* BAR CHART */}
        <div
          className="h-[300px] w-full"
          aria-label="Horizontal bar chart showing predicted selling prices by country"
          role="img"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 100, right: 20, top: 8, bottom: 8 }}
              barCategoryGap="28%"
            >
              <defs>
                {data.map((d) => (
                  <linearGradient
                    key={d.country}
                    id={`grad-${d.country}`}
                    x1="0" y1="0" x2="1" y2="0"
                  >
                    <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={d.color} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>

              <XAxis
                type="number"
                domain={[0, maxPrice * 1.1]}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="country"
                tick={<CustomYTick />}
                axisLine={false}
                tickLine={false}
                width={95}
              />

              <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

              <Bar
                dataKey="price"
                radius={[0, 8, 8, 0]}
                shape={(props) => {
                  const entry = data.find((d) => d.country === props.country);
                  return <GlowBar {...props} color={entry?.color || "#fff"} fill={`url(#grad-${props.country})`} />;
                }}
                isAnimationActive={inView}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell key={entry.country} fill={`url(#grad-${entry.country})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CONFIDENCE LEGEND COLUMN */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
            AI Confidence Ranking
          </p>
          {[...data]
            .sort((a, b) => b.confidence - a.confidence)
            .map((d, i) => (
              <motion.div
                key={d.country}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3"
              >
                <span className="text-base">{d.flag}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-300">{d.country}</span>
                    <span className="text-xs font-semibold" style={{ color: d.color }}>
                      {d.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-white/8 rounded-full h-[3px] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${d.confidence}%` } : {}}
                      transition={{ duration: 1.1, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${d.color}cc, ${d.color})` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* ── Best Region Footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/8"
      >
        <TrendingUp size={16} className="text-pink-400" />
        <span className="text-sm text-gray-400">Best region to sell your craft:</span>
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            background: `${bestCountry.color}18`,
            border: `1px solid ${bestCountry.color}50`,
            color: bestCountry.color,
          }}
        >
          {bestCountry.flag} {bestCountry.country} — ₹{bestCountry.price.toLocaleString("en-IN")}
        </span>
        <span className="text-xs text-gray-500">
          ({bestCountry.confidence}% AI confidence)
        </span>
      </motion.div>
    </motion.div>
  );
}
