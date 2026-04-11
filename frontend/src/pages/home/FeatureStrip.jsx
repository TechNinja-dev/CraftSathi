import React from 'react';
import FeatureCard from './FeatureCard';
import { Globe, Compass, Users, Lightbulb } from 'lucide-react';

const FeatureStrip = () => {
  const features = [
    {
      icon: <Globe size={28} />,
      title: "Digital Presence Builder",
      description: "Establish a verifiable digital identity with a stunning artisanal portfolio out of the box."
    },
    {
      icon: <Compass size={28} />,
      title: "Strategic Craft Guidance",
      description: "Analyze your craft's actual market worth, receive tailored improvement insights, and discover the best marketplaces to sell."
    },
    {
      icon: <Users size={28} />,
      title: "Artisan Social Network",
      description: "Connect with fellow artisans, share your latest creations, and build relationships in our interactive community."
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Tradition + Innovation",
      description: "A modern ecosystem leveraging intelligent tools to directly enhance artisans' creativity and daily productivity."
    }
  ];

  return (
    <section className="relative z-20 py-16 -mt-2 md:-mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {features.map((feature, index) => (
            <div key={index} className="pt-2 md:pt-0 h-full"> 
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
