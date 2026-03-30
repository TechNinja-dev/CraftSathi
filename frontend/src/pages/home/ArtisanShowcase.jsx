import React from 'react';
import { motion } from 'framer-motion';
import ArtisanCard from './ArtisanCard';
import { ArrowRight } from 'lucide-react';

const ArtisanShowcase = () => {
  const artisans = [
    {
      id: 1,
      name: "Ramesh Prajapati",
      category: "Blue Pottery",
      location: "Jaipur, Rajasthan",
      experience: "25",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Meera Devi",
      category: "Madhubani Art",
      location: "Mithila, Bihar",
      experience: "18",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Abdul Khatri",
      category: "Ajrakh Block Print",
      location: "Kutch, Gujarat",
      experience: "32",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Saraswati",
      category: "Bamboo Craft",
      location: "Majuli, Assam",
      experience: "15",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Karan Singh",
      category: "Wood Carving",
      location: "Saharanpur, UP",
      experience: "20",
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section id="network" className="py-20 md:py-32 relative border-t border-white/5 bg-[#080211]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-pink-400">
              Network
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Meet our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">master</span> artisans.
          </h2>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="group flex items-center gap-2 text-white font-semibold hover:text-pink-400 transition-colors w-max"
        >
          View All Profiles 
          <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="w-full relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#080211] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#080211] to-transparent z-10 pointer-events-none"></div>
        
        <div className="overflow-x-auto hide-scrollbar pb-10 pt-4 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory">
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="flex gap-6 w-max"
          >
            {artisans.map((artisan, index) => (
              <ArtisanCard
                key={artisan.id}
                name={artisan.name}
                category={artisan.category}
                location={artisan.location}
                experience={artisan.experience}
                image={artisan.image}
              />
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* CSS to hide scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default ArtisanShowcase;
