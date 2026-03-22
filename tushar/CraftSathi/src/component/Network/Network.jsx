import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
// Import your separated components
import Toast from '../Network/common/Toast';
import NewHeader from '../Network/layout/NewHeader';
import Sidebar from '../Network/layout/Sidebar';
import Dashboard from '../Network/dashboard/Dashboard';
import ProductPage from '../Network/products/ProductPage';
import ProductFormModal from '../Network/products/ProductFormModal';
import AnalyticsPage from '../Network/analytics/AnalyticsPage';
import MyNetworkPage from '../Network/MyNetworkPage'; // <-- IMPORT THE NEW PAGE

const Network = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [activePage, setActivePage] = useState('Dashboard');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const showToast = (message, type) => setToast({ id: Date.now(), message, type });

    const fetchProducts = useCallback(() => {
        setLoading(true);
        try {
            const localProducts = JSON.parse(localStorage.getItem('products')) || [];
            const sortedProducts = localProducts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setProducts(sortedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Could not fetch products.', 'error');
        } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchProducts();
        const lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => {
            lenis.destroy();
        };
    }, [fetchProducts]);

    const renderPage = () => {
        switch(activePage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Products':
                return <ProductPage products={products} loading={loading} />;
            case 'Analytics':
                return <AnalyticsPage />;
            case 'My Network': // <-- ADD THIS CASE
                return <MyNetworkPage />;
            default:
                return <div className="text-center p-10 bg-[#1E0B38] rounded-lg border border-fuchsia-800/50">
                    <h1 className="text-2xl font-bold text-white">{activePage}</h1>
                    <p className="text-gray-400 mt-2">This page is under construction.</p>
                </div>;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2A0A4A] via-[#1A062E] to-black text-gray-300 font-sans flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <NewHeader onAddProductClick={openModal} />
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        {renderPage()}
                    </main>
                </div>
            </div>

            <ProductFormModal isOpen={isModalOpen} onClose={closeModal} onProductAdded={fetchProducts} showToast={showToast} />

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default Network;