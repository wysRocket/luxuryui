import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Dribbble, ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterLink {
  label: string;
  to: string;
}

const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Browse',
    links: [
      { label: 'iOS Apps', to: '/ios-apps' },
      { label: 'Android Apps', to: '/android-apps' },
      { label: 'Web Apps', to: '/web-apps' },
      { label: 'Screens', to: '/screens' },
      { label: 'Patterns', to: '/patterns' },
      { label: 'User Flows', to: '/flows' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Dictionary', to: '/dictionary' },
      { label: 'Design Systems', to: '/design-systems' },
      { label: 'Blog', to: '/blog' },
      { label: 'Documentation', to: '/documentation' },
      { label: 'Figma Plugin', to: '/figma-plugin' },
      { label: 'Community', to: '/community' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com', label: 'X' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Dribbble, href: 'https://dribbble.com', label: 'Dribbble' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg transition-transform group-hover:rotate-12" />
              <span className="text-2xl font-black tracking-tighter dark:text-white">LuxuryUI</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs text-[15px] leading-relaxed mb-8">
              The world's largest mobile and web design library.
              Join 500,000+ designers and product managers using LuxuryUI to build better products.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-[15px] transition-colors relative group inline-block"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Stay Updated</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Get the latest design trends and patterns in your inbox.</p>
            <form className="relative group" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all pr-12 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-400 dark:text-gray-600">
            <span>© {currentYear} LuxuryUI Library.</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Systems Operational</span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-400 dark:text-gray-600">
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</Link>
            <div className="flex items-center gap-1 cursor-default">
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
