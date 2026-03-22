import React from 'react';
import FeatureCard from './FeatureCard';
import { Globe, BookOpen, Store, Lightbulb } from 'lucide-react';

const FeatureStrip = () => {
  const features = [
    {
      icon: <Globe size={28} />,
      title: "Digital Presence Builder",
      description: "Establish a verifiable digital identity with a stunning artisanal portfolio out of the box."
    },
    {
      icon: <BookOpen size={28} />,
      title: "Storytelling Engine",
      description: "Use AI to weave compelling narratives around your traditional origin and unique craft processes."
    },
    {
      icon: <Store size={28} />,
      title: "Global Marketplace",
      description: "Instant access to a global buyer network demanding authentic, high-quality, handcrafted goods."
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Tradition + Innovation",
      description: "A modern design studio combining timeless heritage techniques with future-forward tools."
    }
  ];

  return (
    <section className="relative z-20 py-16 -mt-20 md:-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {features.map((feature, index) => (
            <div key={index} className="pt-[50px] first:pt-0 md:pt-0"> {/* Mobile offset correction */}
               <FeatureCard 
                 icon={feature.icon}
                 title={feature.title}
                 description={feature.description}
               />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
