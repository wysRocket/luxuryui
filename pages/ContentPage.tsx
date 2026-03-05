import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ContentSection {
  title: string;
  description: string;
}

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContentSection[];
  primaryCtaLabel: string;
  primaryCtaPath: string;
  secondaryCtaLabel: string;
  secondaryCtaPath: string;
}

const ContentPage: React.FC<ContentPageProps> = ({
  eyebrow,
  title,
  description,
  sections,
  primaryCtaLabel,
  primaryCtaPath,
  secondaryCtaLabel,
  secondaryCtaPath,
}) => {
  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-12"
      >
        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">{description}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to={primaryCtaPath}
            className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            {primaryCtaLabel}
          </Link>
          <Link
            to={secondaryCtaPath}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {secondaryCtaLabel}
          </Link>
        </div>
      </motion.section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.article
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 p-6"
          >
            <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-3">{section.title}</h2>
            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">{section.description}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default ContentPage;
