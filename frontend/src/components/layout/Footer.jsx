import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [notification, setNotification] = useState({ show: false, message: '', isError: false });

    const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 4000); 
            return () => clearTimeout(timer); 
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
                setNotification({ show: true, message: 'Success! Your message has been sent.', isError: false });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setNotification({ show: true, message: `Error: ${result.message}`, isError: true });
            }
        } catch (error) {
            setNotification({ show: true, message: 'An error occurred. Please try again.', isError: true });
        }
    };

    return (
        <>
            {/* Notification Component */}
            <div
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-all duration-500 ease-out
                    ${notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
                    ${notification.isError ? 'bg-red-500' : 'bg-brand-primary'}`} 
            >
                {notification.isError ? <XCircle className="mr-3" /> : <CheckCircle2 className="mr-3" />}
                {notification.message}
            </div>

            {/* New Design Footer */}
            <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative overflow-hidden mt-auto">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[150px] pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                  
                  {/* Brand Col */}
                  <div className="lg:pr-4 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-3 mb-6">
  <img
    src="/images/logo1.png"
    alt="CraftSathi Logo"
    className="w-10 h-10 object-contain"
  />

  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
    CraftSathi
  </span>
</div>
                      
                    </div>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      Empowering Indian artisans by connecting their timeless craftsmanship with the global digital economy through AI.
                    </p>
                    <div className="flex items-center gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-all"><Instagram size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all"><Youtube size={18} /></a>
                    </div>
                  </div>

                  {/* Links 1 */}
                  <div className="lg:col-span-1">
                    <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Marketplace</h4>
                    <ul className="space-y-4">
                      <li><Link to="/mystuff" className="text-gray-400 hover:text-pink-400 transition-colors">All Crafts</Link></li>
                      <li><Link to="/profile" className="text-gray-400 hover:text-pink-400 transition-colors">Artisan Portfolio</Link></li>
                      <li><Link to="/guidance" className="text-gray-400 hover:text-pink-400 transition-colors">Authenticity Check</Link></li>
                    </ul>
                  </div>

                  {/* Links 2 */}
                  <div className="lg:col-span-1">
                    <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Community</h4>
                    <ul className="space-y-4">
                      <li><Link to="/network" className="text-gray-400 hover:text-pink-400 transition-colors">For Artisans</Link></li>
                      <li><Link to="/generate" className="text-gray-400 hover:text-pink-400 transition-colors">AI Studio Tools</Link></li>
                      <li><Link to="/about" className="text-gray-400 hover:text-pink-400 transition-colors">About Us</Link></li>
                      <li><a href="mailto:support@craftsathi.com" className="text-gray-400 hover:text-pink-400 transition-colors">Contact Support</a></li>
                    </ul>
                  </div>

                  {/* Query Form (Replacing Newsletter) */}
                  <div className="lg:col-span-2">
                    <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Get in Touch</h4>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input 
                              type="text" 
                              name="name" 
                              value={formData.name} 
                              onChange={handleChange} 
                              placeholder="Your Name" 
                              required 
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" 
                            />
                            <input 
                              type="email" 
                              name="email" 
                              value={formData.email} 
                              onChange={handleChange} 
                              placeholder="Your Email" 
                              required 
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" 
                            />
                        </div>
                        <textarea 
                          name="message" 
                          value={formData.message} 
                          onChange={handleChange} 
                          placeholder="Your Query..." 
                          required 
                          rows="3" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        ></textarea>
                        <button 
                          type="submit" 
                          className="bg-white text-black font-bold rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                  </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} CraftSathi Platform. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                  </div>
                </div>
              </div>
            </footer>
        </>
    );
};

export default Footer;