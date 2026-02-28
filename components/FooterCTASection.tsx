import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  Flag, 
  Hexagon, 
  Home, 
  LayoutGrid, 
  MessageSquare, 
  Music, 
  ShoppingBag, 
  Smile, 
  Star, 
  Tv, 
  Box, 
  Disc,
} from 'lucide-react';

// Brand Data Definition
const LOGO_SIZE = 20;

interface Brand {
  name: string;
  icon: React.ReactNode;
  color: string;
  isTextOnly?: boolean;
}

const BRANDS_ROW_1: Brand[] = [
  { name: 'Wise', icon: <Flag size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#9FE870] text-black' },
  { name: 'Headspace', icon: <div className="w-3 h-3 rounded-full bg-white" />, color: 'bg-orange-500 text-white' },
  { name: 'Airbnb', icon: <Home size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#FF385C] text-white' },
  { name: 'Uber', icon: <span className="font-bold text-xs tracking-tighter">Uber</span>, color: 'bg-black text-white dark:bg-white dark:text-black' },
  { name: 'Nike', icon: <Check size={LOGO_SIZE} strokeWidth={4} />, color: 'bg-white text-black border border-gray-200 dark:border-gray-800' },
  { name: 'Pinterest', icon: <span className="font-serif font-bold text-lg italic leading-none">P</span>, color: 'bg-[#E60023] text-white' },
  { name: 'Coinbase', icon: <span className="font-sans font-bold text-lg leading-none">C</span>, color: 'bg-[#0052FF] text-white' },
];

const BRANDS_ROW_2: Brand[] = [
  { name: 'Twitch', icon: <MessageSquare size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#9146FF] text-white' },
  { name: 'ChatGPT', icon: <Hexagon size={LOGO_SIZE} />, color: 'bg-transparent text-black dark:text-white border border-gray-900 dark:border-gray-100' },
  { name: 'Shopify', icon: <ShoppingBag size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#95BF47] text-white' },
  { name: 'Loom', icon: <Star size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#625DF5] text-white' },
  { name: 'Creme', icon: <span className="font-bold font-serif text-sm">Cr</span>, color: 'bg-black text-white dark:bg-white dark:text-black' },
  { name: 'Mailchimp', icon: <Smile size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#FFE01B] text-black' },
];

const BRANDS_ROW_3: Brand[] = [
  { name: 'Apple TV', icon: <Tv size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#1c1c1c] text-white' },
  { name: 'Shop', icon: <ShoppingBag size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#5A31F4] text-white' },
  { name: 'Cosmos', icon: <LayoutGrid size={LOGO_SIZE} />, color: 'bg-[#F5F5F5] dark:bg-gray-800 text-black dark:text-white' },
  { name: 'Retro', icon: <Disc size={LOGO_SIZE} />, color: 'bg-gradient-to-tr from-orange-400 to-purple-600 text-white' },
  { name: 'Notion', icon: <span className="font-serif font-bold text-lg leading-none">N</span>, color: 'bg-transparent border border-gray-900 dark:border-gray-100 text-black dark:text-white' },
  { name: 'Dropbox', icon: <Box size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#0061FF] text-white' },
  { name: 'Spotify', icon: <Music size={LOGO_SIZE} fill="currentColor" />, color: 'bg-[#1ED760] text-black' },
];

const LogoItem: React.FC<{ brand: Brand }> = ({ brand }) => (
  <motion.div 
    className="flex items-center gap-3 mr-12 md:mr-16 flex-shrink-0 group cursor-default"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:rotate-3 ${brand.color}`}>
      {brand.icon}
    </div>
    <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">{brand.name}</span>
  </motion.div>
);

const InfiniteMarquee: React.FC<{ brands: Brand[]; reverse?: boolean; speed?: number }> = ({ brands, reverse = false, speed = 40 }) => {
  return (
    <div className="flex overflow-hidden w-full relative group">
      <motion.div
        className="flex py-4"
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={{ x: reverse ? "0%" : "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {/* Duplicated 8x to ensure seamless loop even on ultra-wide monitors */}
        {[...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands, ...brands].map((brand, idx) => (
          <LogoItem key={`${brand.name}-${idx}`} brand={brand} />
        ))}
      </motion.div>
      
      {/* Side Gradients */}
      <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

// Interface for FooterCTASection props
interface FooterCTASectionProps {
  isDarkMode: boolean;
}

// Adding isDarkMode to the component to fix 'Cannot find name isDarkMode'
const FooterCTASection: React.FC<FooterCTASectionProps> = ({ isDarkMode }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1.0] as [number, number, number, number] // smooth bezier
      }
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
      <motion.div 
        className="max-w-4xl mx-auto text-center px-4 mb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-4xl md:text-6xl md:leading-[1.1] font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          variants={itemVariants}
        >
          Never run out of <br className="hidden md:block" />
          inspiration again.
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Use LuxuryUI for free as long as you like or get full access with any of our paid plans.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={itemVariants}
        >
          <motion.button 
            className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-base font-bold rounded-full shadow-xl w-full sm:w-auto"
            // fix: using isDarkMode prop
            whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? '#f3f4f6' : '#1a1a1a' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Join for free
          </motion.button>
          
          <motion.button 
            className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 text-base font-bold rounded-full flex items-center justify-center gap-2 group w-full sm:w-auto"
            // fix: using isDarkMode prop
            whileHover={{ scale: 1.05, borderColor: isDarkMode ? '#4b5563' : '#d1d5db', backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            See our plans
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="space-y-8 md:space-y-12 opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn { to { opacity: 1; } }
        `}} />
        <InfiniteMarquee brands={BRANDS_ROW_1} speed={60} />
        <InfiniteMarquee brands={BRANDS_ROW_2} reverse speed={70} />
        <InfiniteMarquee brands={BRANDS_ROW_3} speed={65} />
      </div>
    </section>
  );
};

export default FooterCTASection;