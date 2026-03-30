import React, { useState, useEffect, Suspense } from 'react'; // 1. Imported useEffect
import Lenis from 'lenis';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
// 2. Imported new icons for the notification
import { Sparkles, Image, Globe, Users, Instagram, Youtube, CheckCircle2, XCircle } from 'lucide-react'; 
import welcomeImg from '../assets/welcomepageimg.png';
import Footer from '../components/layout/Footer.jsx';

// Lazy loaded components from local home folder
const Hero = React.lazy(() => import('./home/Hero'));
const FeatureStrip = React.lazy(() => import('./home/FeatureStrip'));
const Mission = React.lazy(() => import('./home/Mission'));
const KeyFeatures = React.lazy(() => import('./home/KeyFeatures'));
const ArtisanShowcase = React.lazy(() => import('./home/ArtisanShowcase'));
const MarketplacePreview = React.lazy(() => import('./home/MarketplacePreview'));
const AIAssistant = React.lazy(() => import('./home/AIAssistant'));
const JourneyTimeline = React.lazy(() => import('./home/JourneyTimeline'));
const CommunityNetwork = React.lazy(() => import('./home/CommunityNetwork'));
const TrustSection = React.lazy(() => import('./home/TrustSection'));
const InteractiveCraftMap = React.lazy(() => import('./home/InteractiveCraftMap'));
const LiveArtisanProfiles = React.lazy(() => import('./home/LiveArtisanProfiles'));
const VirtualCraftExhibition = React.lazy(() => import('./home/VirtualCraftExhibition'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0c0516]">
    <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin"></div>
  </div>
);


const WelcomePage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    // 3. Replaced submissionStatus with a more capable notification state
    const [notification, setNotification] = useState({ show: false, message: '', isError: false });

    const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;

    // 4. This useEffect hook will automatically hide the notification after 4 seconds
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 4000); // Notification will be visible for 4 seconds
            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [notification]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formPayload = {
            ...formData,
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `New Query from ${formData.name} via CraftSathi`,
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(formPayload),
            });
            const result = await response.json();

            if (result.success) {
                // 5. Trigger the SUCCESS notification
                setNotification({ show: true, message: 'Success! Your message has been sent.', isError: false });
                setFormData({ name: '', email: '', message: '' });
            } else {
                // 5. Trigger the ERROR notification
                setNotification({ show: true, message: `Error: ${result.message}`, isError: true });
            }
        } catch (error) {
            setNotification({ show: true, message: 'An error occurred. Please try again.', isError: true });
        }
    };
    
    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

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
        <div className="min-h-screen bg-[#0c0516] text-white font-sans selection:bg-pink-500/30 overflow-hidden relative">
            <Navbar />
            
            {/* 6. This is the new Notification Component */}
            <div
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-all duration-500 ease-out
                    ${notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
                    ${notification.isError ? 'bg-red-500' : 'bg-green-500'}`}
            >
                {notification.isError ? <XCircle className="mr-3" /> : <CheckCircle2 className="mr-3" />}
                {notification.message}
            </div>

            <Suspense fallback={<LoadingFallback />}>
                {/* <Header /> */}
                <Hero />
                <FeatureStrip />
                <Mission />
                <KeyFeatures />
                {/* <ArtisanShowcase /> */}
                {/* <MarketplacePreview /> */}
                <AIAssistant />
                <JourneyTimeline />
                {/* <InteractiveCraftMap /> */}
                {/* <LiveArtisanProfiles /> */}
                <VirtualCraftExhibition />
                {/* <CommunityNetwork /> */}
                {/* <TrustSection /> */}
            </Suspense>
            <Footer />
        </div>
    );
};

export default WelcomePage;