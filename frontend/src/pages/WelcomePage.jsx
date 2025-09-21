import React, { useState, useEffect } from 'react'; // 1. Imported useEffect
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
// 2. Imported new icons for the notification
import { Sparkles, Image, Globe, Users, Instagram, Youtube, CheckCircle2, XCircle } from 'lucide-react'; 
import welcomeImg from '../assets/welcomepageimg.png';
import Footer from '../components/layout/Footer.jsx';


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

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col relative">
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

            {/* Hero Section */}
            <div 
                className="relative h-[84vh] flex items-center justify-center text-center p-4"
                style={{ backgroundImage: `url(${welcomeImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-65"></div>
                <div className="relative z-10 text-white">
                    <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight animate-fade-in-up">
                        Bring Your Craft to the World<br /><span className="text-brand-primary">Powered by AI</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl font-light animate-fade-in-up-delay">
                        CraftSathi is your AI companion, helping artisans like you create professional marketing content from your creations.
                    </p>
                    <button 
                        onClick={scrollToFeatures}
                        className="mt-8 inline-block px-10 py-4 bg-brand-primary text-white text-lg font-semibold rounded-full shadow-lg hover:bg-brand-primary-hover transition-transform transform hover:scale-105 animate-fade-in-up-delay-2"
                    >
                        Get Started Now
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <main id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4">
               <h2 className="text-4xl font-bold font-display text-brand-text text-center mb-12">
        How It Works
    </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Feature 1: Generate Captions */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center transition-transform transform hover:scale-105">
                    <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center">
                        <Sparkles size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-text mb-2">Create Captions</h3>
                    <p className="text-gray-600 mb-4">
                        Upload a picture of your craft and our AI will write a perfect, heartwarming product description for you.
                    </p>
                    <Link to="/generate" className="text-brand-primary font-semibold hover:underline">
                        Learn More
                    </Link>
                </div>

    {/* Feature 2: Generate Posts */}
    <div className="bg-white rounded-xl shadow-lg p-8 text-center transition-transform transform hover:scale-105">
        <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center">
            <Image size={48} />
        </div>
        <h3 className="text-2xl font-bold text-brand-text mb-2">Generate Posts</h3>
        <p className="text-gray-600 mb-4">
            Turn your imagination into stunning visuals. Just describe what you want, and the AI will create beautiful images for your social media.
        </p>
        <Link to="/photo" className="text-brand-primary font-semibold hover:underline">
            Learn More
        </Link>
    </div>

    {/* Feature 3: Grow Your Business */}
    <div className="bg-white rounded-xl shadow-lg p-8 text-center transition-transform transform hover:scale-105">
        <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center">
            <Globe size={48} />
        </div>
        <h3 className="text-2xl font-bold text-brand-text mb-2">Reach the World</h3>
        <p className="text-gray-600 mb-4">
            Save your creations and build a professional portfolio to show off your work to the world and attract more customers.
        </p>
        <Link to="/mystuff" className="text-brand-primary font-semibold hover:underline">
            View Portfolio
        </Link>
    </div>

    {/* Feature 4: Build a Network */}
    <div className="bg-white rounded-xl shadow-lg p-8 text-center transition-transform transform hover:scale-105">
        <div className="text-brand-primary text-5xl mx-auto mb-4 flex items-center justify-center">
            <Users size={48} />
        </div>
        <h3 className="text-2xl font-bold text-brand-text mb-2">Build Your Network</h3>
        <p className="text-gray-600 mb-4">
            Join a vibrant community of fellow artisans. Share your work, get feedback, and collaborate on new ideas.
        </p>
        <Link to="/" className="text-brand-primary font-semibold hover:underline">
            Join the Community
        </Link>
    </div>
</div>
            </main>

            {/* Footer Section */}
{/* --- NEW FOOTER DESIGN --- */}
<Footer/>
</div>
    );
};

export default WelcomePage;