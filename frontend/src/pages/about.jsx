import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx'; 
import Footer from '../components/layout/Footer.jsx'; 
import { Sparkles, Image, Archive, Users, Heart } from 'lucide-react';

// 1. Import a suitable image for the background
// import missionBg from '../assets/welcomepageimg.png'; // You'll need to create this file

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white py-20 md:py-28 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl md:text-7xl font-bold font-display text-brand-text leading-tight">
                            The Heart of the Artisan,
                            <br />
                            <span className="text-brand-primary">Amplified by AI</span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            We believe that every handcrafted item has a story. CraftSathi was born from a passion to help artisans like you share that story with the world, bridging the gap between timeless tradition and modern technology.
                        </p>
                    </div>
                </section>

                {/* Our Mission Section - 2. Added background image and overlay */}
                <section 
                    className="relative py-16 md:py-24"
                    style={{
                        // backgroundImage: `url(${missionBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Background Overlay for better text readability */}
                    <div className="absolute inset-0 bg-white opacity-70"></div> 
                    
                    <div className="relative z-10 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-bold font-display text-brand-text mb-4">Our Mission</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                In a fast-paced digital world, standing out is a challenge. Many talented artisans, the keepers of our rich cultural heritage, are masters of their craft but find digital marketing daunting.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Our mission is simple: to be your <span className="font-semibold text-brand-primary">'Sathi'</span>—your companion—in this journey. We provide intuitive AI tools that handle the complexities of content creation, so you can focus on what you do best: creating beautiful things.
                            </p>
                        </div>
                        <div className="flex justify-center">
                             <Heart className="text-brand-primary/20" size={200} strokeWidth={1} />
                        </div>
                    </div>
                </section>
                
                {/* How We Help (Features) Section */}
                <section className="bg-white py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-4xl font-bold font-display text-brand-text text-center mb-12">How We Help You Grow</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1: AI Captions */}
                            <div className="bg-brand-bg/50 p-8 rounded-xl text-center">
                                <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center"><Sparkles size={48} /></div>
                                <h3 className="text-2xl font-bold text-brand-text mb-2">From Photo to Prose</h3>
                                <p className="text-gray-600">Our AI analyzes an image of your craft and writes heartwarming, persuasive descriptions. It turns a simple photo into a captivating story that connects with customers on an emotional level.</p>
                            </div>
                            {/* Feature 2: AI Posts */}
                            <div className="bg-brand-bg/50 p-8 rounded-xl text-center">
                                <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center"><Image size={48} /></div>
                                <h3 className="text-2xl font-bold text-brand-text mb-2">From Idea to Image</h3>
                                <p className="text-gray-600">Need stunning visuals for your social media? Just describe your vision, and our AI will generate beautiful, high-quality images that showcase your products in the best possible light.</p>
                            </div>
                            {/* Feature 3: Your Portfolio */}
                            <div className="bg-brand-bg/50 p-8 rounded-xl text-center">
                                <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center"><Archive size={48} /></div>
                                <h3 className="text-2xl font-bold text-brand-text mb-2">Your Digital Workshop</h3>
                                <p className="text-gray-600">Every piece of content you generate is saved to your personal space. Build a professional portfolio effortlessly and have your marketing assets ready to go, anytime you need them.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Future Scope Section */}
                <section className="py-16 md:py-24">
                    <div className="max-w-5xl mx-auto px-4 text-center">
                        <div className="text-brand-primary text-6xl mx-auto mb-6 flex items-center justify-center"><Users size={64} /></div>
                        <h2 className="text-4xl font-bold font-display text-brand-text mb-4">Our Vision for the Future: The Artisan's Network</h2>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                            Technology is not just a tool; it's a bridge. Our next step is to build that bridge between you and a vibrant community of fellow creators. The CraftSathi Network will be a dedicated space where you can share your work, get feedback, find inspiration, and collaborate with other artisans. It's more than a feature—it's the beating heart of our community, a place for shared creativity and collective growth.
                        </p>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="bg-white py-16 md:py-24">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold font-display text-brand-text mb-6">Ready to share your craft with the world?</h2>
                        <Link 
                            to="/auth" 
                            className="inline-block px-10 py-4 bg-brand-primary text-white text-lg font-semibold rounded-full shadow-lg hover:bg-brand-primary-hover transition-transform transform hover:scale-105"
                        >
                            Join CraftSathi Today
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;