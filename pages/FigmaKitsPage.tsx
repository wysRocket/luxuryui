import React from 'react';
import { ArrowRight, PackageCheck, Sparkles, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import FigmaKitCard from '../components/FigmaKitCard';
import { FIGMA_KIT_SUMMARY, getPublishedFigmaKits } from '../data/figmaKits';
import { useAppSession } from '../contexts/AppSessionContext';

const comparisonCards = [
  {
    title: 'Research Library',
    description: 'Browse screenshots, flows, and pattern references to study how mature products solve UX problems.',
    points: ['Reference screenshots', 'Flow teardowns', 'Pattern browsing', 'Free-to-explore surfaces'],
  },
  {
    title: 'Credits-Only Kits',
    description: 'Top up credits once and spend them on transformed, original Figma kits built from the strongest references in the library.',
    points: ['Buy with credits', 'Editable Figma file', 'Componentized flow kit', 'Commercial-ready packaging'],
  },
];

const FigmaKitsPage: React.FC = () => {
  const publishedKits = getPublishedFigmaKits();
  const { isAuthenticated } = useAppSession();

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_30%),linear-gradient(180deg,rgba(17,24,39,0.95)_0%,rgba(2,6,23,1)_100%)] p-8 md:p-12 mb-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Commercial Catalog</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">Figma Kits You Unlock With Credits</h1>
          <p className="text-[16px] md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Browse original, editable Figma flow kits derived from LuxuryUI’s best reference sets. Research stays free to browse, while approved kits are unlocked with credits and delivered as clean commercial assets with components, tokens, and usage notes.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-black text-white dark:text-black">
            <PackageCheck size={15} />
            {FIGMA_KIT_SUMMARY.publishedProducts} kits ready for credits
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Sparkles size={15} />
            {FIGMA_KIT_SUMMARY.publishedFlows} flow families represented
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Store size={15} />
            Own-site delivery
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
        {comparisonCards.map((card) => (
          <article key={card.title} className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-7">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-3">{card.title}</h2>
            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mb-5">{card.description}</p>
            <div className="space-y-2">
              {card.points.map((point) => (
                <div
                  key={point}
                  className="inline-flex items-center mr-2 mb-2 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200"
                >
                  {point}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">Published Kits</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">Storefront-ready Figma products</h2>
        </div>
        <Link to={isAuthenticated ? "/account" : "/pricing"} className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400">
          {isAuthenticated ? 'Open buyer portal' : 'Top up credits'} <ArrowRight size={14} />
        </Link>
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {publishedKits.map((kit) => (
          <FigmaKitCard key={kit.id} kit={kit} />
        ))}
      </section>
    </div>
  );
};

export default FigmaKitsPage;
