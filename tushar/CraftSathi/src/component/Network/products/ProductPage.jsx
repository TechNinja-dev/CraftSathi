import React from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, ShoppingCart, MoreVertical } from 'lucide-react';

const ProductPage = ({ products, loading }) => (
    <>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-3xl font-bold text-white">Products</h2>
            <p className="text-gray-400">Manage your products here.</p>
        </motion.div>

        {loading ? (
            <div className="text-center py-16"><LoaderCircle className="animate-spin h-12 w-12 text-pink-500 mx-auto" /><p className="text-gray-400 mt-4">Loading products...</p></div>
        ) : products.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 text-gray-500 bg-[#1E0B38] rounded-lg border border-dashed border-fuchsia-800/50">
                <ShoppingCart size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No products found</h3>
                <p>Click "Add Product" to get started.</p>
            </motion.div>
        ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                initial="hidden" animate="show">
                {products.map((product) => (
                <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    className="bg-[#1E0B38] rounded-lg overflow-hidden border border-fuchsia-800/30 group transition-all duration-300 hover:shadow-2xl hover:shadow-pink-900/30 hover:border-pink-500 transform hover:-translate-y-1">
                    <div className="h-48 bg-black/30 overflow-hidden relative">
                        <img src={product.imageBase64} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        <div className="absolute top-2 right-2"><span className="text-white text-sm bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">{product.category}</span></div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-white mb-2 truncate pr-2">{product.name}</h3>
                            <button className="text-gray-500 hover:text-pink-400"><MoreVertical size={20}/></button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-pink-400 font-bold text-xl">${product.price}</span>
                            <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                        </div>
                    </div>
                </motion.div>
                ))}
            </motion.div>
        )}
    </>
);

export default ProductPage;