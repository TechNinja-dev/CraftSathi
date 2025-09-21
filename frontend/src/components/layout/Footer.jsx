import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { Link } from 'react-router-dom';
import { Instagram, Youtube, CheckCircle2, XCircle } from 'lucide-react'; // 2. Import new icons

const Footer = () => {
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
            return () => clearTimeout(timer); // Cleanup timer
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

    return (
        <>
            {/* 6. This is the new Notification Component */}
            <div
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-all duration-500 ease-out
                    ${notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
                    ${notification.isError ? 'bg-red-500' : 'bg-brand-primary'}`} 
            >
                {notification.isError ? <XCircle className="mr-3" /> : <CheckCircle2 className="mr-3" />}
                {notification.message}
            </div>

            <footer className="bg-gray-900 text-white mt-auto pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* Left Section: About & Links */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold font-display mb-4">CraftSathi</h3>
                        <p className="text-white/70 mb-6">
                            Empowering artisans with the magic of AI. We help you create, market, and grow your craft business by turning your art into compelling social media content.
                        </p>
                        <div className="flex flex-col items-start space-y-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors">
                                <Instagram size={26} /> Instagram
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors">
                                <Youtube size={26} /> YouTube
                            </a>
                            <Link to="/about" className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors">
                                About Us
                            </Link>
                        </div>
                    </div>

                    {/* Right Section: Contact Form */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold font-display mb-4">Get in Touch</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* ... your form inputs ... */}
                            <div className="flex flex-col sm:flex-row gap-4">
                               <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg placeholder-white/50 focus:ring-white focus:border-white" />
                               <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg placeholder-white/50 focus:ring-white focus:border-white" />
                            </div>
                            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Query..." required rows="4" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg placeholder-white/50 focus:ring-white focus:border-white resize-none"></textarea>
                            <button type="submit" className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors">Send Message</button>
                            
                            {/* 7. Removed the old boring text message from here */}
                        </form>
                    </div>
                </div>
                
                <div className="text-center text-white/50 mt-12 border-t border-white/20 pt-6">
                    <p>CraftSathi | 2025</p>
                </div>
            </footer>
        </>
    );
};

export default Footer;