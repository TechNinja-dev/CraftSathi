import React from 'react';
import { motion } from 'framer-motion';

import GuidanceHero from './components/GuidanceHero';
import CraftAnalyzerUploadPanel from './components/CraftAnalyzerUploadPanel';
import GlobalPriceIntelligence from './components/GlobalPriceIntelligence';
import CraftBrandBuilderAssistant from './components/CraftBrandBuilderAssistant';
import QualityRadarChart from './components/QualityRadarChart';
import ProfitForecastChart from './components/ProfitForecastChart';
import StrategicRecommendations from './components/StrategicRecommendations';
import GlobalFAQ from './components/GlobalFAQ';
import SuccessStories from './components/SuccessStories';
import LaunchpadProgress from './components/LaunchpadProgress';
import FloatingAssistantButton from './components/FloatingAssistantButton';

export default function GuidanceLayout() {
  return (
    <>

      <div className="relative min-h-screen bg-[#080211] text-white overflow-x-hidden pb-24">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080211] via-[#140421] to-[#05010b] pointer-events-none" />
        {/* Purple glow overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-700/20 blur-[120px] opacity-40 rounded-full" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-32">
          {/* Hero */}
          <GuidanceHero />

          {/* Main Scrollable Content */}
          <div className="space-y-10">
            <CraftAnalyzerUploadPanel />
            <GlobalPriceIntelligence />
            <CraftBrandBuilderAssistant />
            <QualityRadarChart />
            <ProfitForecastChart />
            <StrategicRecommendations />
            <GlobalFAQ />

            {/* Success Stories + Launchpad side by side on desktop */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
              <SuccessStories />
              <LaunchpadProgress />
            </div>
          </div>
        </div>

        <FloatingAssistantButton />
      </div>
    </>
  );
}
