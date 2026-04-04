import { create } from 'zustand';

export const useGuidanceStore = create(() => ({
  pricePredictions: [
    { country: 'India', price: 1800, confidence: 86, code: 'IN', flag: '🇮🇳' },
    { country: 'USA', price: 6200, confidence: 95, code: 'US', flag: '🇺🇸' },
    { country: 'Germany', price: 5200, confidence: 81, code: 'DE', flag: '🇩🇪' },
    { country: 'Japan', price: 3100, confidence: 78, code: 'JP', flag: '🇯🇵' },
    { country: 'UAE', price: 2400, confidence: 71, code: 'AE', flag: '🇦🇪' },
    { country: 'Australia', price: 4100, confidence: 72, code: 'AU', flag: '🇦🇺' },
  ],
  bestRegion: 'USA',
  qualityScores: [
    { metric: 'Authenticity', score: 85 },
    { metric: 'Material', score: 78 },
    { metric: 'Visual Appeal', score: 92 },
    { metric: 'Durability', score: 80 },
    { metric: 'Market Demand', score: 74 },
    { metric: 'Export Readiness', score: 82 },
  ],
  profitForecast: [
    { month: 'Jan', profit: 2000 },
    { month: 'Feb', profit: 2600 },
    { month: 'Mar', profit: 3200 },
    { month: 'Apr', profit: 4200 },
    { month: 'May', profit: 5100 },
    { month: 'Jun', profit: 6200 },
  ],
  strategicRecommendations: [
    { platform: 'Etsy Global Intelligence', profitScore: 82, confidence: 'High', trend: [12, 22, 18, 30, 42, 55] },
    { platform: 'Amazon Karigar Insights', profitScore: 65, confidence: 'Medium', trend: [10, 15, 20, 18, 24, 32] },
    { platform: 'Instagram Shop Trends', profitScore: 78, confidence: 'Growing', trend: [8, 12, 20, 35, 50, 62] },
  ],
  faqData: [
    { question: 'How to price for Etsy?', answer: 'Use a global markup multiplier between 2.2x–3.1x. Factor in international shipping buffers and platform fees.' },
    { question: 'What export documentation is required?', answer: 'You will need a Commercial Invoice, IEC (Import Export Code), and a Certificate of Origin depending on the destination country.' },
    { question: 'Which sustainable packaging works best?', answer: 'Honeycomb paper wrap combined with biodegradable cornstarch peanuts prevents ceramic breakage during international shipping.' },
    { question: 'How to select the right marketplace?', answer: 'Consider your product category, target demographic, and commission rates. Etsy suits handmade, Amazon for scale, Instagram for storytelling brands.' },
    { question: 'What are standard international shipping timelines?', answer: 'Standard economy shipping takes 7–21 days. Express DHL/FedEx takes 3–5 days depending on destination and declared value.' },
  ],
  brandSuggestions: {
    names: ['Heritage Clay Studio', 'Jaipur Blue Pottery Works', 'Indigo Earth Crafts'],
    packaging: ['Eco packaging', 'Luxury packaging', 'Export safe packaging', 'Gift packaging'],
    tones: ['Cultural Heritage', 'Minimalist', 'Luxury', 'Legacy'],
  },
}));
