import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import GuidanceHero from './components/GuidanceHero';
import CraftAnalyzerUploadPanel from './components/CraftAnalyzerUploadPanel';
import GlobalPriceIntelligence from './components/GlobalPriceIntelligence';
import CraftBrandBuilderAssistant from './components/CraftBrandBuilderAssistant';
import QualityRadarChart from './components/QualityRadarChart';
import ProfitForecastChart from './components/ProfitForecastChart';
import StrategicRecommendations from './components/StrategicRecommendations';
import GlobalFAQ from './components/GlobalFAQ';
import SuccessStories from './components/SuccessStories';
import Footer from '../../components/layout/Footer';


export default function GuidanceLayout() {
  const [analysisData, setAnalysisData] = useState(null);

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
            <CraftAnalyzerUploadPanel onAnalysisComplete={setAnalysisData} />

            <div className="space-y-10 transition-all duration-500">
              {analysisData ? (
                <>
                  <GlobalPriceIntelligence data={analysisData.pricing} />
                  <CraftBrandBuilderAssistant data={analysisData.brand} />
                  <QualityRadarChart data={analysisData.quality} />
                  <ProfitForecastChart data={analysisData.forecast} />
                  <StrategicRecommendations data={analysisData.recommendations} />
                </>
              ) : (
                <div className="w-full py-24 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                  <Sparkles size={36} className="text-purple-400 mb-4 opacity-70 animate-pulse" />
                  <h3 className="text-xl font-medium text-white mb-2">Awaiting Craft Analysis</h3>
                  <p className="text-sm text-gray-400 max-w-md text-center">Upload a craft image above to generate global market insights, quality assessment, and profit forecasts.</p>
                </div>
              )}
            </div>

            <GlobalFAQ />

            {/* Success Stories + Launchpad side by side on desktop */}
            <div className="w-full">
              <SuccessStories />

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
