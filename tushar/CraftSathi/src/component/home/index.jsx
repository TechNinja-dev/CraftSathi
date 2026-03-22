import React, { Suspense, useEffect } from 'react';
import Lenis from 'lenis';

// Lazy loaded components for performance
const Header = React.lazy(() => import('../header/Header'));
const Hero = React.lazy(() => import('./Hero'));
const FeatureStrip = React.lazy(() => import('./FeatureStrip'));
const Mission = React.lazy(() => import('./Mission'));
const KeyFeatures = React.lazy(() => import('./KeyFeatures'));
const ArtisanShowcase = React.lazy(() => import('./ArtisanShowcase'));
const MarketplacePreview = React.lazy(() => import('./MarketplacePreview'));
const AIAssistant = React.lazy(() => import('./AIAssistant'));
const JourneyTimeline = React.lazy(() => import('./JourneyTimeline'));
const CommunityNetwork = React.lazy(() => import('./CommunityNetwork'));
const TrustSection = React.lazy(() => import('./TrustSection'));
const AIStoryGeneratorDemo = React.lazy(() => import('./AIStoryGeneratorDemo'));
const InteractiveCraftMap = React.lazy(() => import('./InteractiveCraftMap'));
const LiveArtisanProfiles = React.lazy(() => import('./LiveArtisanProfiles'));
const VirtualCraftExhibition = React.lazy(() => import('./VirtualCraftExhibition'));
const Footer = React.lazy(() => import('./Footer'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0c0516]">
    <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin"></div>
  </div>
);

const Home = () => {
    useEffect(() => {
        // Initialize Smooth Scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0c0516] text-white font-sans selection:bg-pink-500/30 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
                <Header />
                <Hero />
                <FeatureStrip />
                <Mission />
                <KeyFeatures />
                <ArtisanShowcase />
                <AIStoryGeneratorDemo />
                <MarketplacePreview />
                <AIAssistant />
                <JourneyTimeline />
                <InteractiveCraftMap />
                <LiveArtisanProfiles />
                <VirtualCraftExhibition />
                <CommunityNetwork />
                <TrustSection />
                <Footer />
            </Suspense>
        </div>
    );
};

export default Home;