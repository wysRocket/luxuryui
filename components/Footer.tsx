import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Linkedin,
  Dribbble,
  ArrowRight,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAppSession } from "../contexts/AppSessionContext";

interface FooterLink {
  label: string;
  to: string;
}

const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Browse",
    links: [
      { label: "iOS Apps", to: "/ios-apps" },
      { label: "Android Apps", to: "/android-apps" },
      { label: "Web Apps", to: "/web-apps" },
      { label: "Screens", to: "/screens" },
      { label: "Patterns", to: "/patterns" },
      { label: "User Flows", to: "/flows" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Dictionary", to: "/dictionary" },
      { label: "Design Systems", to: "/design-systems" },
      { label: "Blog", to: "/blog" },
      { label: "Documentation", to: "/documentation" },
      { label: "Figma Plugin", to: "/figma-plugin" },
      { label: "Community", to: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Top Up Credits", to: "/pricing" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAppSession();

  const socialLinks = [
    { icon: Twitter, href: "https://x.com", label: "X" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Dribbble, href: "https://dribbble.com", label: "Dribbble" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
              <BrandLogo
                className="flex items-center gap-3"
                iconClassName="h-8 w-8 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-[1.03]"
                textClassName="text-2xl tracking-[-0.07em] text-gray-950 dark:text-white"
              />
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs text-[15px] leading-relaxed mb-8">
              Browse the research library, then unlock transformed Figma kits
              with credits when you need editable assets.
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
            <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                Registered Office
              </p>
              <div className="mt-3 space-y-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Kinman Tech LTD
                </p>
                <p>HE 490695</p>
                <p>23 Boumpoulinas, Flat/Office 6</p>
                <p>2019 Strovolos, Nicosia, Cyprus</p>
                <a
                  href="tel:+447537106904"
                  className="block pt-1 text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  +44 7537 106 904
                </a>
                <a
                  href="mailto:contact@luxuryuilib.com"
                  className="block text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  contact@luxuryuilib.com
                </a>
              </div>
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">
                {section.title}
              </h4>
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
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">
              Stay Updated
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Account access and kit delivery are now handled directly inside
              LuxuryUI.
            </p>
            <Link
              to={isAuthenticated ? "/account" : "/signup"}
              className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-5 py-3 text-sm font-black text-white dark:text-black"
            >
              {isAuthenticated ? "Open account" : "Create account"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-400 dark:text-gray-600">
            <span>© {currentYear} LuxuryUI Library.</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-400 dark:text-gray-600">
            <Link
              to="/privacy"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cookies
            </Link>
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
