import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Plus, Bookmark, LayoutGrid, Download } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, children, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect: move content vertically as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <motion.div 
      ref={ref}
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="bg-[#F9FAFB] dark:bg-gray-900 rounded-3xl h-[320px] md:h-[400px] w-full overflow-hidden relative border border-gray-200/50 dark:border-gray-800 flex items-center justify-center group select-none">
         <motion.div style={{ y }} className="w-full h-full">
            {children}
         </motion.div>
      </div>
      <div className="text-center px-4">
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <div className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto text-base">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

// --- High Fidelity UI Components ---

const CopyToFigmaUI: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
         <motion.div
            className="bg-[#111111] dark:bg-black border dark:border-gray-800 pl-2 pr-1.5 py-1.5 rounded-full flex items-center gap-1 shadow-2xl scale-110"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -5 }}
         >
            <button className="px-5 py-2 text-[#9CA3AF] hover:text-white font-medium text-[15px] transition-colors">
                Clear
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[#9CA3AF] hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <Download size={20} />
            </button>
            <button className="flex items-center gap-2.5 px-5 py-2 text-[#9CA3AF] hover:text-white hover:bg-white/10 rounded-full transition-colors group/copy">
                <span className="text-[15px] font-medium">Copy</span>
                <svg width="14" height="21" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 group-hover/copy:opacity-100 transition-opacity">
                    <path d="M3.5 21C1.567 21 0 19.433 0 17.5C0 15.567 1.567 14 3.5 14H7V21H3.5Z" fill="#0ACF83"/>
                    <path d="M0 10.5C0 8.567 1.567 7 3.5 7H7V14H3.5C1.567 14 0 12.433 0 10.5Z" fill="#A259FF"/>
                    <path d="M0 3.5C0 1.567 1.567 0 3.5 0H7V7H3.5C1.567 7 0 5.433 0 3.5Z" fill="#F24E1E"/>
                    <path d="M7 0H10.5C12.433 0 14 1.567 14 3.5C14 5.433 12.433 7 10.5 7H7V0Z" fill="#FF7262"/>
                    <path d="M14 10.5C14 12.433 12.433 14 10.5 14C8.567 14 7 12.433 7 10.5V7H10.5C12.433 7 14 8.567 14 10.5Z" fill="#1ABCFE"/>
                </svg>
            </button>
            <button className="px-7 py-2.5 bg-white text-black font-semibold rounded-full text-[15px] hover:bg-gray-100 transition-colors ml-1">
                Save
            </button>
         </motion.div>
    </div>
  );
};

const SaveToCollectionUI: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full p-6">
        <motion.div
            className="bg-white dark:bg-gray-900 w-full max-w-[280px] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 dark:ring-gray-800 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 12px 50px rgba(0,0,0,0.12)" }}
        >
            <div className="p-5 border-b border-gray-50 dark:border-gray-800">
                <h4 className="text-gray-500 dark:text-gray-600 text-xs font-medium mb-3">Quick save</h4>
                <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm">
                            <LayoutGrid size={18} />
                        </div>
                        <span className="font-semibold text-[15px] text-gray-900 dark:text-white">Library</span>
                    </div>
                    <Bookmark size={20} className="text-black dark:text-white fill-black dark:fill-white" />
                </div>
            </div>
            <div className="p-5 bg-[#FAFAFA] dark:bg-gray-800/50">
                <h4 className="text-gray-400 dark:text-gray-600 text-xs font-medium mb-3">Add to collection</h4>
                
                <div className="space-y-4">
                     <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
                        <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm">
                            <Plus size={18} />
                        </div>
                        <span className="font-medium text-[15px] text-gray-900 dark:text-white">Create collection</span>
                    </div>

                     <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
                        <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-black overflow-hidden relative shadow-sm">
                            <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-blue-500 to-purple-600"></div>
                        </div>
                        <span className="font-medium text-[15px] text-gray-900 dark:text-white">Dark Mode</span>
                    </div>

                    <div className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden p-1 shadow-sm">
                                <div className="w-full h-full bg-orange-50 dark:bg-orange-900/20 rounded-md"></div>
                            </div>
                            <span className="font-medium text-[15px] text-gray-900 dark:text-white">Launch Screens</span>
                        </div>
                        <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black">
                            <Check size={14} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
  );
};

const LeaveCommentsUI: React.FC = () => {
    return (
       <div className="flex items-center justify-center h-full w-full p-6">
           <motion.div
               className="bg-white dark:bg-gray-900 w-full max-w-[320px] rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 dark:ring-gray-800 p-6"
               initial={{ y: 20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               whileHover={{ y: -5, boxShadow: "0 12px 50px rgba(0,0,0,0.12)" }}
           >
               <div className="flex items-start gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 flex-shrink-0">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
                   </div>
                   <div>
                       <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-[15px] text-gray-900 dark:text-white">You</span>
                            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">8h ago</span>
                       </div>
                       <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-normal">
                           Love this checkout screen, especially the order summary section.
                       </p>
                   </div>
               </div>
               
               <div className="mt-2 bg-[#F3F4F6] dark:bg-gray-800 rounded-xl px-4 py-3.5 text-[15px] text-gray-400 dark:text-gray-500 font-medium">
                   Add a comment...
               </div>
           </motion.div>
       </div>
    );
};

const FeatureSection: React.FC = () => {
  return (
    <section className="py-24 px-4 max-w-[1600px] mx-auto">
      <motion.h2 
        className="text-4xl md:text-6xl font-bold text-center mb-20 tracking-tight text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        From inspiration to creation.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1: Copy to Figma */}
        <FeatureCard 
          title="Copy to Figma"
          description={
            <span>
              Download designs you like or copy it straight into Figma with our new <a href="#" className="underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4 hover:text-black dark:hover:text-white hover:decoration-black dark:hover:decoration-white transition-all">Figma plugin</a>.
            </span>
          }
          delay={0}
        >
          <CopyToFigmaUI />
        </FeatureCard>

        {/* Feature 2: Save to Collections */}
        <FeatureCard 
          title="Save to collections"
          description="Collect your favorite designs and upload your own screenshots into one place."
          delay={0.2}
        >
          <SaveToCollectionUI />
        </FeatureCard>

        {/* Feature 3: Leave comments */}
        <FeatureCard 
          title="Leave comments"
          description="Take notes upon saving so you'll never forget the context in the future."
          delay={0.4}
        >
          <LeaveCommentsUI />
        </FeatureCard>
      </div>
    </section>
  );
};

export default FeatureSection;