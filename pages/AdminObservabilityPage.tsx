import { useEffect, useMemo, useState, type FC } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Coins,
  CreditCard,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import type { AdminOverviewSnapshot } from "../types";
import { useAppSession } from "../contexts/AppSessionContext";
import { getFirestoreAdminOverview } from "../services/firestoreAdminStore";
import { formatCurrencyAmount } from "../data/figmaKits";

const EMPTY_OVERVIEW: AdminOverviewSnapshot = {
  profiles: [],
  roles: [],
  wallets: [],
  transactions: [],
  topUps: [],
  unlocks: [],
  orders: [],
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString();
};

const AdminObservabilityPage: FC = () => {
  const { backendMode } = useAppSession();
  const [overview, setOverview] = useState<AdminOverviewSnapshot>(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      if (backendMode !== "firebase") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const snapshot = await getFirestoreAdminOverview();

        if (!isMounted) {
          return;
        }

        setOverview(snapshot);
      } catch (nextError) {
        if (!isMounted) {
          return;
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : "Unable to load backoffice observability data.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadOverview();

    return () => {
      isMounted = false;
    };
  }, [backendMode]);

  const roleMap = useMemo(() => {
    const map = new Map<string, Set<string>>();

    overview.roles.forEach((entry) => {
      map.set(entry.userId, new Set(entry.roles));
    });

    return map;
  }, [overview.roles]);

  const metrics = useMemo(() => {
    const totalUsers = overview.profiles.length;
    const adminUsers = overview.roles.filter((entry) =>
      entry.roles.includes("admin"),
    ).length;
    const activeWallets = overview.wallets.filter(
      (wallet) => wallet.balance > 0 || wallet.lifetimePurchased > 0,
    ).length;
    const walletBalance = overview.wallets.reduce(
      (total, wallet) => total + wallet.balance,
      0,
    );
    const lifetimePurchased = overview.wallets.reduce(
      (total, wallet) => total + wallet.lifetimePurchased,
      0,
    );
    const completedTopUps = overview.topUps.filter(
      (topUp) => topUp.status === "succeeded",
    );
    const eurRevenue = completedTopUps.reduce(
      (total, topUp) => total + topUp.eurAmount,
      0,
    );

    return {
      totalUsers,
      adminUsers,
      activeWallets,
      walletBalance,
      lifetimePurchased,
      eurRevenue,
    };
  }, [overview]);

  const recentTopUps = overview.topUps.slice(0, 8);
  const recentUnlocks = overview.unlocks.slice(0, 8);
  const recentProfiles = overview.profiles.slice(0, 10);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1500px] p-4 md:p-8">
        <div className="rounded-[32px] border border-gray-100 bg-white p-8 text-sm font-bold text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading backoffice observability…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 md:p-8">
      <section className="mb-8 rounded-[32px] border border-gray-100 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-8 dark:border-gray-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(2,6,23,1)_100%)] md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">
              Backoffice
            </p>
            <h1 className="mb-3 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
              Admin Observability
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              Read-only visibility across buyer accounts, wallet balances, top-ups,
              and unlock activity. This mirrors the same oversight pattern used in
              Cloudbase, adapted for Firebase collections in LuxuryUI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
              <ShieldCheck size={14} />
              Firebase admin access
            </div>
            <Link
              to="/account"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              Return to account
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
            <UserRound size={14} />
            Total users
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {metrics.totalUsers}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {metrics.adminUsers} admins with backoffice access
          </p>
        </article>

        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
            <Wallet size={14} />
            Active wallets
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {metrics.activeWallets}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {metrics.walletBalance.toLocaleString()} credits currently held
          </p>
        </article>

        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
            <Coins size={14} />
            Lifetime credits sold
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {metrics.lifetimePurchased.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Across all buyer wallets
          </p>
        </article>

        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
            <CreditCard size={14} />
            EUR top-up volume
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {formatCurrencyAmount("EUR", metrics.eurRevenue)}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Successful top-ups recorded in Firestore
          </p>
        </article>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                Recent top-ups
              </p>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Credit cashflow
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <Activity size={12} />
              {overview.topUps.length} records
            </div>
          </div>

          {recentTopUps.length > 0 ? (
            <div className="space-y-3">
              {recentTopUps.map((topUp) => (
                <div
                  key={topUp.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {topUp.userId}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {formatDate(topUp.createdAt)}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {topUp.creditsPurchased.toLocaleString()} credits
                      </p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {formatCurrencyAmount("EUR", topUp.eurAmount)} /{" "}
                        {formatCurrencyAmount("GBP", topUp.gbpAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No top-ups recorded yet.
            </p>
          )}
        </article>

        <article className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Recent unlocks
            </p>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Commercial activity
            </h2>
          </div>

          {recentUnlocks.length > 0 ? (
            <div className="space-y-3">
              {recentUnlocks.map((unlock) => (
                <div
                  key={unlock.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    {unlock.productId}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Buyer {unlock.userId}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                    <span>{unlock.creditsSpent} credits</span>
                    <span>{formatDate(unlock.unlockedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No unlock activity yet.
            </p>
          )}
        </article>
      </section>

      <section className="rounded-[28px] border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            User roster
          </p>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Profiles and role posture
          </h2>
        </div>

        {recentProfiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left dark:divide-gray-800">
              <thead>
                <tr className="text-xs font-black uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                  <th className="px-0 py-3 pr-4">User</th>
                  <th className="px-0 py-3 pr-4">Provider</th>
                  <th className="px-0 py-3 pr-4">Roles</th>
                  <th className="px-0 py-3 pr-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentProfiles.map((profile) => {
                  const roles = Array.from(roleMap.get(profile.uid) ?? new Set(["user"]));

                  return (
                    <tr key={profile.uid}>
                      <td className="py-4 pr-4">
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">
                            {profile.displayName}
                          </p>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {profile.email || profile.uid}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {profile.provider}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {roles.map((role) => (
                            <span
                              key={`${profile.uid}:${role}`}
                              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                                role === "admin"
                                  ? "border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-200"
                                  : "border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-950/30 dark:text-gray-300"
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {formatDate(profile.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No Firebase user profiles have been synchronized yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminObservabilityPage;
