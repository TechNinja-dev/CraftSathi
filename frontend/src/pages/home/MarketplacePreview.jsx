import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

const MarketplacePreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock data in case API fails
  const mockProducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1610425516790-a7d519b7a421?q=80&w=600&auto=format&fit=crop",
      title: "Hand-painted Blue Pottery Vase",
      location: "Jaipur, Rajasthan",
      price: "120",
      isAuthentic: true
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1605814981881-432243d41e7d?q=80&w=600&auto=format&fit=crop",
      title: "Oxidized Silver Tribal Necklace",
      location: "Kutch, Gujarat",
      price: "85",
      isAuthentic: true
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1558000143-a6121b6d1656?q=80&w=600&auto=format&fit=crop",
      title: "Handloom Silk Saree",
      location: "Varanasi, UP",
      price: "250",
      isAuthentic: true
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1627916968037-f016dcebc504?q=80&w=600&auto=format&fit=crop",
      title: "Intricate Wood Carved Panel",
      location: "Saharanpur, UP",
      price: "190",
      isAuthentic: false
    }
  ];

  useEffect(() => {
    // In a real scenario, we would use axios.get('/api/products')
    // We emulate the fetch for visual purposes
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <section id="marketplace" className="py-20 md:py-32 relative bg-[#0c0516]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Masterpieces.</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Discover unique, handcrafted creations directly from the artisans' studios.
            </p>
          </motion.div>
          
          <motion.button 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="px-6 py-3 bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 text-white rounded-full transition-all font-semibold flex items-center gap-2 w-max"
          >
            Explore Marketplace <ArrowRight size={18} />
          </motion.button>
        </div>

        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-96 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
                ))}
             </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard 
                  image={product.image}
                  title={product.title}
                  location={product.location}
                  price={product.price}
                  isAuthentic={product.isAuthentic}
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default MarketplacePreview;
