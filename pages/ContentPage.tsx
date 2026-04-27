import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { submitContactForm } from '../services/contactService';

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

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const ContactFormSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');
    try {
      await submitContactForm({ name, email, subject, message });
      setState('success');
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setState('error');
      setErrorMsg('Something went wrong. Please email us directly at contact@luxuryuilib.com');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.14 }}
      className="mt-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8"
    >
      <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 mb-1">Send a Message</p>
      <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-6">Get in touch</h2>

      {state === 'success' ? (
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
          Message sent — we'll get back to you shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="General inquiry, billing, support…"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
              placeholder="Tell us how we can help…"
            />
          </div>
          {state === 'error' && (
            <p className="md:col-span-2 text-sm text-red-500">{errorMsg}</p>
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {state === 'submitting' ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </motion.section>
  );
};

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

      {contactDetails?.length ? <ContactFormSection /> : null}

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
