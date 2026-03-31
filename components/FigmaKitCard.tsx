import React from 'react';
import { ArrowRight, CheckCircle2, Layers3, Palette, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FigmaKitProduct } from '../types';
import { formatCreditCost, getFlowLabelForKit } from '../data/figmaKits';
import { useAppSession } from '../contexts/AppSessionContext';

interface FigmaKitCardProps {
  kit: FigmaKitProduct;
}

const FigmaKitCard: React.FC<FigmaKitCardProps> = ({ kit }) => {
  const flowLabel = getFlowLabelForKit(kit.primaryFlowId);
  const { isAuthenticated, wallet, hasUnlocked } = useAppSession();
  const unlocked = hasUnlocked(kit.id);
  const hasEnoughCredits = (wallet?.balance ?? 0) >= kit.creditCost;

  const action = unlocked
    ? { label: 'Open delivery', to: `/kits/${kit.slug}/delivery` }
    : !isAuthenticated
      ? { label: 'Sign in to buy', to: `/login?redirect=${encodeURIComponent(kit.previewPath)}` }
      : hasEnoughCredits
        ? { label: `Use ${kit.creditCost} credits`, to: kit.previewPath }
        : { label: 'Top up credits', to: '/pricing' };

  return (
    <article className="group rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(93,94,255,0.18),transparent_30%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-6">
        <div className="absolute inset-0 opacity-25">
          {kit.thumbnail && <img src={kit.thumbnail} alt="" aria-hidden="true" className="w-full h-full object-cover mix-blend-screen" />}
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
              {flowLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/12 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
              <CheckCircle2 size={12} />
              Figma-ready
            </span>
          </div>
          <h3 className="max-w-md text-2xl font-black tracking-tight text-white leading-tight">{kit.title}</h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
            Originalized from curated research and packaged as an editable Figma kit with reusable styles, components, and flow screens.
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-2">
              <Layers3 size={14} />
              Screens
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-white">{kit.includedScreens}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-2">
              <Palette size={14} />
              Tokens
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-white">{kit.includedTokens.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-2">
              <ShieldCheck size={14} />
              License
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-white">{kit.licenseTier}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">Credit Cost</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{formatCreditCost(kit.creditCost)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={kit.previewPath}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View what’s included
            </Link>
            <Link
              to={action.to}
              className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-5 py-2.5 text-sm font-black text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {action.label}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FigmaKitCard;
