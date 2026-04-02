import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Download, FileArchive, ShieldCheck } from 'lucide-react';
import { useAppSession } from '../contexts/AppSessionContext';
import { getFigmaKitBySlug, getFigmaManifest } from '../data/figmaKits';

const KitDeliveryPage: React.FC = () => {
  const { kitSlug } = useParams<{ kitSlug: string }>();
  const { backendMode, hasUnlocked, getUnlock, createDownload, markDownloadStatus } = useAppSession();
  const [downloadError, setDownloadError] = useState('');
  const [downloadedAt, setDownloadedAt] = useState('');

  const kit = useMemo(() => (kitSlug ? getFigmaKitBySlug(kitSlug) : undefined), [kitSlug]);

  if (!kit) {
    return <Navigate to="/kits" replace />;
  }

  if (!hasUnlocked(kit.id)) {
    return <Navigate to={kit.previewPath} replace />;
  }

  const unlock = getUnlock(kit.id);
  const manifest = getFigmaManifest(kit.id);

  const handleDownload = async () => {
    setDownloadError('');

    try {
      const { url, fileName } = createDownload(kit.id);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(url), 0);

      if (unlock) {
        await markDownloadStatus(unlock.id, 'downloaded');
      }
      setDownloadedAt(new Date().toLocaleTimeString());
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Could not generate the delivery package.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto w-full">
      <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-10 mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Delivery</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">{kit.title}</h1>
        <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
          {backendMode === 'firebase'
            ? 'Your kit is unlocked and attached to your Firebase-backed account. Download the delivery package, review the file blueprint, and return here from any signed-in session.'
            : 'Your kit is unlocked. Download the delivery package, review the file blueprint, and return here any time from your account library.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">Status</div>
            <div className="inline-flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={15} />
              Unlocked
            </div>
          </div>
          <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">Credits spent</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{unlock?.creditsSpent ?? kit.creditCost}</div>
          </div>
          <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">Download</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{unlock?.downloadStatus ?? 'available'}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black"
          >
            <Download size={16} />
            Download delivery pack
          </button>
          <Link
            to="/account"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Back to account
          </Link>
        </div>

        {(downloadError || downloadedAt) && (
          <div className="mt-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
            {downloadError || `Delivery package downloaded at ${downloadedAt}.`}
          </div>
        )}
      </section>

      {manifest && (
        <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-5">
            <FileArchive size={14} />
            Delivery blueprint
          </div>
          <div className="space-y-4">
            {manifest.pageBlueprints.map((page) => (
              <div key={page.name} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4">
                <p className="text-sm font-black text-gray-900 dark:text-white mb-2">{page.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{page.contents.join(' • ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default KitDeliveryPage;
