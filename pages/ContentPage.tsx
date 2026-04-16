import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ContentSection {
  title: string;
  description: string;
}

interface ContactDetail {
  label: string;
  value?: string;
  lines?: string[];
  href?: string;
}

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContentSection[];
  contactDetails?: ContactDetail[];
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
  contactDetails,
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

      {contactDetails?.length ? (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 p-6 md:p-8"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                Company Details
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Registered contact information
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:max-w-md">
              Use these details for legal, billing, and direct support inquiries.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {contactDetails.map((detail, index) => {
              const content = detail.href ? (
                <a
                  href={detail.href}
                  className="transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                  {detail.value}
                </a>
              ) : (
                detail.value
              );

              return (
                <motion.article
                  key={detail.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                  className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-950/70 p-5"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                    {detail.label}
                  </p>
                  {detail.value ? (
                    <p className="mt-3 text-[15px] font-semibold leading-relaxed text-gray-900 dark:text-white">
                      {content}
                    </p>
                  ) : null}
                  {detail.lines?.length ? (
                    <div className="mt-3 space-y-1 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                      {detail.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </motion.section>
      ) : null}

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
