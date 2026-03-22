import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, UploadCloud, Wand2, LoaderCircle, Package, DollarSign, Archive, Plus
} from 'lucide-react';

const ProductFormModal = ({ isOpen, onClose, onProductAdded, showToast }) => {
    const [imageBase64, setImageBase64] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', tags: [] });

    const resetForm = useCallback(() => {
        setFormData({ name: '', description: '', price: '', stock: '', category: '', tags: [] });
        setImageBase64('');
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageBase64(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAiAnalyze = async () => {
        if (!imageBase64) { showToast('Please upload an image first', 'error'); return; }
        setAiLoading(true);
        const apiKey = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;
        try {
            const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
            const mimeType = imageBase64.split(';')[0].split(':')[1];
            const base64Data = imageBase64.split(',')[1];
            const prompt = `Analyze this product image and return ONLY a valid JSON object with the following structure: {"name": "product title","description": "A concise, user-friendly description.","category": "A relevant category","price": a numeric suggestion,"tags": ["relevant", "keywords"]}. Do not include markdown or explanations.`;

            const response = await fetch(`${API_URL}?key=${apiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType, data: base64Data } }] }] })
            });
            if (!response.ok) throw new Error(`AI analysis failed: ${response.status}`);
            const data = await response.json();
            const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!responseText) throw new Error("Malformed AI response.");

            // Extract JSON string from markdown if present
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            const rawJsonString = jsonMatch ? jsonMatch[1] : responseText;

            const aiResponse = JSON.parse(rawJsonString);
            setFormData({
                name: aiResponse.name || '', description: aiResponse.description || '', price: aiResponse.price || '',
                stock: '25', category: aiResponse.category || '', tags: aiResponse.tags || []
            });
            showToast('AI analysis complete!', 'success');
        } catch (error) {
            console.error('AI Analysis Error:', error);
            showToast('AI analysis failed. Please try again.', 'error');
        } finally { setAiLoading(false); }
    };

    const handleAddProduct = () => {
        if (!formData.name || !formData.price || !imageBase64) {
            showToast('Please add an image and fill name & price fields', 'error'); return;
        }
        const newProduct = {
            id: Date.now().toString(), ...formData,
            price: parseFloat(formData.price), stock: parseInt(formData.stock) || 25,
            imageBase64, timestamp: new Date().toISOString()
        };
        const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
        localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
        showToast('Product added successfully!', 'success');
        onProductAdded(); onClose(); resetForm();
    };

    const handleClose = () => { onClose(); resetForm(); };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#1E0B38] rounded-2xl p-8 w-full max-w-4xl border border-fuchsia-700/60 shadow-2xl shadow-black/50 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 transition-colors"> <X size={24} /> </button>
                        <h2 className="text-3xl font-bold mb-6 text-white text-center">Add New Product</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Image Upload and AI Analyze Section */}
                            <div className="flex flex-col space-y-4">
                                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.1}}}>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Product Image</label>
                                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-fuchsia-800/50 rounded-lg p-6 hover:border-pink-500 transition-colors h-64 group">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="modal-image-upload" />
                                        {imageBase64 ? (
                                            <img src={imageBase64} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                        ) : (
                                            <div className="text-center">
                                                <UploadCloud className="mx-auto h-12 w-12 text-gray-500 group-hover:text-pink-500 transition-colors" />
                                                <p className="mt-2 text-gray-500">Click or drag to upload</p>
                                                <p className="text-xs text-gray-600">PNG, JPG, WEBP</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.button initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.2}}} onClick={handleAiAnalyze} disabled={!imageBase64 || aiLoading} className="w-full flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                                    {aiLoading ? <><LoaderCircle className="animate-spin h-5 w-5" /> Analyzing...</> : <><Wand2 size={20}/> AI Analyze Details</>}
                                </motion.button>
                            </div>
                            {/* Form Fields Section */}
                            <div className="space-y-4">
                                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.3}}}>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-fuchsia-800/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Product name"/>
                                    </div>
                                </motion.div>
                                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.4}}}>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-fuchsia-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" rows="3" placeholder="Product description"/>
                                </motion.div>
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.5}}}>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-black/40 border border-fuchsia-800/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="0.00" step="0.01"/>
                                        </div>
                                    </motion.div>
                                    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.6}}}>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                                        <div className="relative">
                                            <Archive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                            <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-black/40 border border-fuchsia-800/50 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Quantity"/>
                                        </div>
                                    </motion.div>
                                </div>
                                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.7}}}>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-fuchsia-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Product category"/>
                                </motion.div>
                            </div>
                        </div>
                        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: 0.8}}} className="mt-8 flex justify-end gap-4">
                            <button onClick={handleClose} className="bg-gray-800/80 hover:bg-gray-800 text-gray-300 font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleAddProduct} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-pink-900/50"><Plus size={20}/> Add Product</button>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductFormModal;