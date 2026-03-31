import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createDeliveryDownload,
  getSessionSnapshot,
  getUnlockForProduct,
  hasUnlockedKit,
  purchaseKitWithCredits,
  signInWithEmail,
  signOutSession,
  signUpWithEmail,
  subscribeToSession,
  topUpWalletCredits,
} from '../services/appSessionStore';
import { getRuntimeWarnings, RUNTIME_CONFIG } from '../services/runtimeConfig';
import { CreditTopUp, CreditTransaction, CreditWallet, FigmaKitProduct, KitOrder, KitUnlock, UserProfile } from '../types';

interface AppSessionContextValue {
  user: UserProfile | null;
  wallet: CreditWallet | null;
  transactions: CreditTransaction[];
  topUps: CreditTopUp[];
  unlocks: KitUnlock[];
  orders: KitOrder[];
  isAuthenticated: boolean;
  isBusy: boolean;
  warnings: string[];
  signUp: (input: { displayName: string; email: string; password: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  topUpCredits: (credits: number) => Promise<CreditTopUp>;
  purchaseKit: (kit: FigmaKitProduct) => Promise<KitUnlock>;
  hasUnlocked: (productId: string) => boolean;
  getUnlock: (productId: string) => KitUnlock | undefined;
  createDownload: (productId: string) => { url: string; fileName: string };
  refresh: () => void;
}

const AppSessionContext = createContext<AppSessionContextValue | undefined>(undefined);

const buildSnapshot = () => getSessionSnapshot();

export const AppSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snapshot, setSnapshot] = useState(buildSnapshot);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    return subscribeToSession(() => setSnapshot(buildSnapshot()));
  }, []);

  const refresh = () => setSnapshot(buildSnapshot());

  const wrapAction = async <T,>(action: () => Promise<T>): Promise<T> => {
    setIsBusy(true);

    try {
      const result = await action();
      refresh();
      return result;
    } finally {
      setIsBusy(false);
    }
  };

  const value = useMemo<AppSessionContextValue>(
    () => ({
      ...snapshot,
      isAuthenticated: Boolean(snapshot.user),
      isBusy,
      warnings: getRuntimeWarnings(),
      signUp: async (input) => {
        await wrapAction(() => signUpWithEmail(input));
      },
      signIn: async (input) => {
        await wrapAction(() => signInWithEmail(input));
      },
      signOut: async () => {
        await wrapAction(() => signOutSession());
      },
      topUpCredits: async (credits) => wrapAction(() => topUpWalletCredits(credits)),
      purchaseKit: async (kit) => wrapAction(() => purchaseKitWithCredits(kit)),
      hasUnlocked: (productId) => hasUnlockedKit(productId, snapshot.user?.uid),
      getUnlock: (productId) => getUnlockForProduct(productId),
      createDownload: (productId) => createDeliveryDownload(productId),
      refresh,
    }),
    [isBusy, snapshot]
  );

  return <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>;
};

export const useAppSession = (): AppSessionContextValue => {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error('useAppSession must be used within an AppSessionProvider.');
  }

  return context;
};

export const useConciergeMode = () => ({
  hasLiveConcierge: RUNTIME_CONFIG.hasLiveConcierge,
});
