import React, { Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lazy load react-echarts to optimize initial bundle size
const ReactECharts = React.lazy(() => import('echarts-for-react'));

const chartData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  India: [1500, 1600, 1550, 1700, 1750, 1720, 1800],
  USA: [5600, 5900, 5800, 6100, 6200, 6150, 6400],
  Germany: [4800, 4900, 4850, 5000, 5100, 5050, 5200],
  Japan: [3000, 3100, 3050, 2980, 3050, 3100, 3120],
  UAE: [2200, 2300, 2250, 2400, 2420, 2450, 2500],
  Australia: [3800, 3900, 3850, 4000, 4050, 3980, 4100]
};

const colorSystem = {
  India: '#a855f7',
  USA: '#ec4899',
  Germany: '#60a5fa',
  Japan: '#34d399',
  UAE: '#f97316',
  Australia: '#facc15'
};

export default function GlobalPriceTrendChart() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const chartOptions = useMemo(() => {
    // Detect best region (highest final value)
    let bestRegion = '';
    let maxFinalVal = -1;
    
    const regions = Object.keys(chartData).filter(k => k !== 'months');
    
    regions.forEach(region => {
      const finalVal = chartData[region][chartData[region].length - 1];
      if (finalVal > maxFinalVal) {
        maxFinalVal = finalVal;
        bestRegion = region;
      }
    });

    const series = regions.map((country, index) => {
      const isBest = country === bestRegion;
      const themeColor = colorSystem[country];

      return {
        name: country,
        type: 'line',
        data: chartData[country],
        smooth: true,
        symbol: 'circle',
        symbolSize: isBest ? 18 : 8,
        showSymbol: true,
        itemStyle: {
          color: themeColor,
          shadowBlur: isBest ? 25 : 10,
          shadowColor: themeColor,
        },
        lineStyle: {
          width: 3,
          color: themeColor,
          shadowBlur: 15,
          shadowColor: themeColor,
        },
        animationDuration: 1400,
        animationEasing: 'cubicOut',
        animationDelay: index * 200,
        z: isBest ? 10 : 1, // bring best line forward
        markPoint: isBest ? {
          data: [{
            type: 'max',
            name: 'Best Region highlight node',
            symbol: 'pin',
            symbolSize: 50,
            itemStyle: { color: 'rgba(236,72,153,0.3)', borderColor: '#ec4899', borderWidth: 1 },
            label: {
              show: true,
              formatter: 'Best Region',
              color: '#f472b6',
              fontSize: 10,
              offset: [0, -32]
            }
          }]
        } : null
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(8,2,17,0.95)',
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: 12,
        textStyle: { color: '#ffffff', fontFamily: 'Inter' },
        axisPointer: { type: 'line', lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      legend: {
        data: regions.map(r => ({ name: r, icon: 'circle' })),
        bottom: 0,
        textStyle: { color: '#ffffff', fontSize: 13 },
        itemGap: 24,
      },
      grid: {
        top: 40,
        left: 20,
        right: 30,
        bottom: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 12 }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: { color: 'rgba(255,255,255,0.05)' }
        },
        axisLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 12, formatter: (val) => `₹${val/1000}k` }
      },
      series: series
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.06)] p-6 w-full"
    >
      <div className="h-[220px] md:h-[280px] lg:h-[340px] w-full" aria-label="Global marketplace wave predictions chart">
        <Suspense fallback={<div className="w-full h-full animate-pulse bg-white/5 rounded-2xl" />}>
          {inView && (
            <ReactECharts 
              option={chartOptions} 
              style={{ height: '100%', width: '100%' }} 
              opts={{ renderer: 'svg' }}
            />
          )}
        </Suspense>
      </div>
    </motion.div>
  );
}
