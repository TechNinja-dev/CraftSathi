import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    // State and logic for the contact form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState('');

    const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('Sending...');

        const formPayload = {
            ...formData,
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `New Query from ${formData.name} via CraftSathi`,
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formPayload),
            });
            const result = await response.json();

            if (result.success) {
                setSubmissionStatus('Success! Your message has been sent.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmissionStatus(`Error: ${result.message}`);
            }
        } catch (error) {
            setSubmissionStatus('An error occurred. Please try again.');
        }
    };

    return (
        <footer className="bg-gray-900 text-white mt-auto pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Left Section: About & Links */}
                <div className="md:col-span-1">
                    <h3 className="text-2xl font-bold font-display mb-4">CraftSathi</h3>
                    <p className="text-white/70 mb-6">
                        Empowering artisans with the magic of AI. We help you create, market, and grow your craft business by turning your art into compelling social media content.
                    </p>
                    <div className="flex flex-col items-start space-y-4">
                        <a 
                            href="https://www.instagram.com/craftsathi_genai?igsh=OGd4cnRjMTdoeGh6" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors"
                        >
                            <Instagram size={26} /> 
                            Instagram
                        </a>
                        <a 
                            href="https://youtube.com/@craftsathiai?si=2TOpIpwtVD9GiF-q" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors"
                        >
                            <Youtube size={26} /> 
                            YouTube
                        </a>
                        <Link 
                            to="/about" 
                            className="flex items-center gap-3 text-white/80 hover:text-white font-medium transition-colors"
                        >
                            About Us
                        </Link>
                    </div>
                </div>

                {/* Right Section: Contact Form */}
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold font-display mb-4">Get in Touch</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg placeholder-white/50 focus:ring-white focus:border-white"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg placeholder-white/50 focus:ring-white focus:border-white"
                            />
                        </div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Query..."
                            required
                            rows="4"
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg placeholder-white/50 focus:ring-white focus:border-white resize-none"
                        ></textarea>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors"
                        >
                            Send Message
                        </button>
                        {submissionStatus && <p className="text-sm mt-2 text-white/90">{submissionStatus}</p>}
                    </form>
                </div>
            </div>
            
            <div className="text-center text-white/50 mt-12 border-t border-white/20 pt-6">
                <p>CraftSathi | 2025</p>
            </div>
        </footer>
    );
};

export default Footer;