import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppCard from './AppCard';
import { AppItem } from '../types';

interface AppSliderProps {
  apps: AppItem[];
  onAppClick: (app: AppItem) => void;
  reverse?: boolean;
  speed?: number;
}

const AppSlider: React.FC<AppSliderProps> = ({ 
  apps, 
  onAppClick, 
  reverse = false, 
  speed = 120 
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // If no apps, don't render
  if (apps.length === 0) return null;

  // Duplicate apps once for a perfect 50% loop
  const sliderApps = [...apps, ...apps];

  return (
    <div 
      className="relative w-full overflow-hidden py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Side Gradients for smooth fade out */}
      <div className="absolute top-0 left-0 w-32 md:w-48 h-full bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 md:w-48 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="flex gap-6 w-max will-change-transform"
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={{ 
          x: isPaused ? undefined : (reverse ? "0%" : "-50%") 
        }}
        transition={{
          x: {
            repeat: Infinity,
            ease: "linear",
            duration: speed,
          }
        }}
        style={{ 
          cursor: 'grab',
          transform: 'translateZ(0)', // Force GPU layer
        }}
      >
        {sliderApps.map((app, idx) => (
          <div key={`${app.id}-${idx}`} className="w-[200px] md:w-[240px] flex-shrink-0">
            <AppCard 
              app={app} 
              onClick={onAppClick} 
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AppSlider;