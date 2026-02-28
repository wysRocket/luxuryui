import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Hexagon, 
  Video, 
  Home, 
  Check, 
  Flag, 
  Smile, 
  MessageSquare, 
  Zap,
  Music,
  ShoppingBag
} from 'lucide-react';

interface FloatingIconProps {
  icon: React.ReactNode;
  className: string;
  initialX: string;
  initialY: string;
  delay: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, className, initialX, initialY, delay }) => {
  return (
    <motion.div
      className={`absolute p-4 rounded-2xl shadow-xl flex items-center justify-center ${className}`}
      style={{ left: initialX, top: initialY }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 3, -3, 0]
      }}
      transition={{ 
        y: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay
        },
        rotate: {
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay
        },
        opacity: { duration: 0.5, delay: delay * 0.2 }
      }}
    >
      {icon}
    </motion.div>
  );
};

const StatsHero: React.FC = () => {
  return (
    <section className="relative w-full h-[650px] flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950 mb-8 rounded-3xl border border-gray-100/50 dark:border-gray-800 transition-colors duration-300">
      
      {/* Central Text */}
      <div className="z-10 text-center flex flex-col items-center gap-0 px-4">
        <motion.p 
          className="text-lg md:text-xl text-gray-900 dark:text-gray-100 font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          A growing library of
        </motion.p>
        
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          1,150 apps
        </motion.h1>
        
        <motion.h2 
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-300 dark:text-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          593,700 screens
        </motion.h2>
      </div>

      {/* Floating Icons Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Left - Zap */}
        <FloatingIcon 
          icon={<Zap size={32} fill="white" />} 
          className="bg-black text-white w-20 h-20" 
          initialX="15%" 
          initialY="15%" 
          delay={0} 
        />
        
        {/* Top Center-Right - Bot (OpenAI Style) */}
        <FloatingIcon 
          icon={<Bot size={28} />} 
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white w-16 h-16" 
          initialX="55%" 
          initialY="10%" 
          delay={1.5} 
        />
        
        {/* Blue Hexagon (Center-ish Left) */}
        <FloatingIcon 
          icon={<Hexagon size={36} fill="white" />} 
          className="bg-[#0061FF] text-white w-24 h-24" 
          initialX="30%" 
          initialY="25%" 
          delay={1} 
        />

        {/* Yellow Smile */}
        <FloatingIcon 
          icon={<Smile size={32} strokeWidth={2.5} />} 
          className="bg-[#FFE01B] text-black w-20 h-20" 
          initialX="12%" 
          initialY="48%" 
          delay={2} 
        />

        {/* Video Icon (Moved to top-right as per user arrow) */}
        <FloatingIcon 
          icon={<Video size={28} fill="white" />} 
          className="bg-black text-white w-16 h-16" 
          initialX="65%" 
          initialY="28%" 
          delay={2.5} 
        />

        {/* Airbnb Home */}
        <FloatingIcon 
          icon={<Home size={32} />} 
          className="bg-[#FF385C] text-white w-20 h-20" 
          initialX="82%" 
          initialY="45%" 
          delay={1.2} 
        />

        {/* Purple Message */}
        <FloatingIcon 
          icon={<MessageSquare size={36} fill="white" />} 
          className="bg-[#9146FF] text-white w-24 h-24" 
          initialX="28%" 
          initialY="75%" 
          delay={0.3} 
        />

        {/* Green Flag */}
        <FloatingIcon 
          icon={<Flag size={32} fill="currentColor" />} 
          className="bg-[#9FE870] text-black w-20 h-20" 
          initialX="58%" 
          initialY="80%" 
          delay={1.8} 
        />

        {/* White Check */}
        <FloatingIcon 
          icon={<Check size={28} strokeWidth={4} />} 
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white w-16 h-16" 
          initialX="78%" 
          initialY="85%" 
          delay={2.2} 
        />

        {/* Pink Music */}
        <FloatingIcon 
          icon={<Music size={24} />} 
          className="bg-pink-500 text-white w-14 h-14" 
          initialX="10%" 
          initialY="82%" 
          delay={3} 
        />

        {/* Orange Circle */}
        <FloatingIcon 
          icon={<div className="w-8 h-8 rounded-full bg-orange-500" />} 
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm w-20 h-20" 
          initialX="88%" 
          initialY="20%" 
          delay={0.5} 
        />
        
        {/* Indigo Bag */}
        <FloatingIcon 
          icon={<ShoppingBag size={24} />} 
          className="bg-indigo-500 text-white w-14 h-14" 
          initialX="92%" 
          initialY="68%" 
          delay={2.8} 
        />
      </div>

      {/* Fade overlay at bottom to blend with content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default StatsHero;