import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sebastian Speier',
    role: 'Designer',
    company: 'Shop',
    avatar: 'https://i.pravatar.cc/150?u=Sebastian',
    text: "LuxuryUI is a great resource and it always comes in handy to see what the best practices or standards are for mobile patterns in our current landscape."
  },
  {
    id: '2',
    name: 'Meng To',
    role: 'Founder',
    company: 'DesignCode',
    avatar: 'https://i.pravatar.cc/150?u=Meng',
    text: "LuxuryUI is a game-changer for designers looking to step up their understanding of UX and UI design patterns. It’s so massive, meticulously organized, has deep user flows and even a figma plugin! It’s indispensable in the modern designer’s toolbox."
  },
  {
    id: '3',
    name: 'Marco Cornacchia',
    role: 'Designer',
    company: 'Figma',
    avatar: 'https://i.pravatar.cc/150?u=Marco',
    text: "LuxuryUI is one of my favorite resources for product design and ui inspo. I love having access to a ton of “real world examples” to see how different apps and companies handle specific UI patterns and flows."
  },
  {
    id: '4',
    name: 'Daryl Ginn',
    role: 'Founder',
    company: 'Endless',
    avatar: 'https://i.pravatar.cc/150?u=Daryl',
    text: "LuxuryUI has quickly become our favourite inspiration resource for designing mobile apps at endless.design, their advanced filtering is unmatched in the inspiration space."
  },
  {
    id: '5',
    name: 'Taha Hossain',
    role: 'Designer',
    company: 'Daybreak',
    avatar: 'https://i.pravatar.cc/150?u=Taha',
    text: "We can’t imagine a product design process without LuxuryUI. The quality, clarity and precision it provides make it just as valuable as it is intuitive."
  },
  {
    id: '6',
    name: 'Haerin Song',
    role: 'Designer',
    company: 'Visa',
    avatar: 'https://i.pravatar.cc/150?u=Haerin',
    text: "By using the LuxuryUI app, I save both my research time and space in my photo galleries filled with random screenshots. I love how easy it is to search for different patterns and copy and paste flows into Figma. It is a wonderful design tool you cannot live without."
  },
  {
    id: '7',
    name: 'John Bai',
    role: 'Designer',
    company: 'Plaid',
    avatar: 'https://i.pravatar.cc/150?u=John',
    text: "All my homies love LuxuryUI. I mean that. I finally deleted that folder of 1,866 unorganized screenshots and haven’t looked back since. Shoutout to Jiho and the team for doing God’s work."
  },
  {
    id: '8',
    name: 'Axel Lindmarker',
    role: 'Designer',
    company: 'Light',
    avatar: 'https://i.pravatar.cc/150?u=Axel',
    text: "LuxuryUI is one of my main tools for finding flows to gain UX and UI insights from. Going there saves me a lot of time from having to do it myself."
  },
  {
    id: '9',
    name: 'Josiah Gulden',
    role: 'Designer',
    company: 'Compound Labs',
    avatar: 'https://i.pravatar.cc/150?u=Josiah',
    text: "LuxuryUI has been an essential part of my workflow for years. It's the first place I look when I need inspiration for a specific flow or interaction."
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => (
  <motion.div
    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6 break-inside-avoid hover:shadow-md dark:hover:shadow-none dark:hover:border-gray-700 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-800"
        />
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{testimonial.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.company}</p>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
      {testimonial.text}
    </p>
  </motion.div>
);

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gray-50/50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What our users are saying.
        </motion.h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;