import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Download, PackageCheck, Wallet } from 'lucide-react';
import { useAppSession } from '../contexts/AppSessionContext';
import { formatCreditCost, formatCurrencyAmount, FIGMA_KIT_PRODUCTS } from '../data/figmaKits';

const AccountPage: React.FC = () => {
  const { user, wallet, transactions, unlocks, orders, topUps, warnings } = useAppSession();

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto w-full">
      <section className="rounded-[32px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-10 mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500 mb-4">Account</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
          {user?.displayName ?? 'Workspace'}
        </h1>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-8">
          {user?.email}
        </p>

        {warnings.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            {warnings.join(' ')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">
              <Wallet size={14} />
              Balance
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{wallet?.balance ?? 0} credits</p>
          </div>
          <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">
              <CreditCard size={14} />
              Purchased
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{wallet?.lifetimePurchased ?? 0} credits</p>
          </div>
          <div className="rounded-[24px] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-3">
              <PackageCheck size={14} />
              Unlocked
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{unlocks.length} kits</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-8">
        <div className="space-y-8">
          <article className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">Unlocked Kits</p>
                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Your delivery library</h2>
              </div>
              <Link to="/kits" className="text-sm font-black text-blue-600 dark:text-blue-400">
                Browse kits
              </Link>
            </div>

            {unlocks.length > 0 ? (
              <div className="space-y-3">
                {unlocks.map((unlock) => {
                  const kit = FIGMA_KIT_PRODUCTS.find((product) => product.id === unlock.productId);
                  if (!kit) return null;

                  return (
                    <Link
                      key={unlock.id}
                      to={`/kits/${kit.slug}/delivery`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{kit.title}</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Unlocked {new Date(unlock.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400">
                        Open delivery <ArrowRight size={14} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                No unlocked kits yet. Top up credits and buy your first Figma kit.
              </div>
            )}
          </article>

          <article className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">Transactions</p>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-5">Wallet history</h2>

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 8).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4">
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white capitalize">{transaction.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={`text-sm font-black ${transaction.creditsDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                      {transaction.creditsDelta >= 0 ? '+' : ''}
                      {transaction.creditsDelta} credits
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                No wallet activity yet.
              </div>
            )}
          </article>
        </div>

        <div className="space-y-8">
          <article className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">Top-Ups</p>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-5">Recent credit purchases</h2>

            {topUps.length > 0 ? (
              <div className="space-y-3">
                {topUps.slice(0, 6).map((topUp) => (
                  <div key={topUp.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4">
                    <p className="text-sm font-black text-gray-900 dark:text-white">{topUp.creditsPurchased} credits</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrencyAmount('EUR', topUp.eurAmount)} / {formatCurrencyAmount('GBP', topUp.gbpAmount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                No credit purchases yet.
              </div>
            )}
          </article>

          <article className="rounded-[28px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">Orders</p>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-5">Unlocked kit orders</h2>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <div key={order.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 px-4 py-4">
                    <p className="text-sm font-black text-gray-900 dark:text-white">
                      {FIGMA_KIT_PRODUCTS.find((product) => product.id === order.productId)?.title ?? order.productId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCreditCost(order.creditCost)} • {order.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-5 text-sm text-gray-500 dark:text-gray-400">
                No unlocked kit orders yet.
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
