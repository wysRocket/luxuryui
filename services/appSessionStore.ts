import {
  CREDIT_PACK_CONFIG,
  getCommercialReview,
  getCreditQuote,
  getFigmaKitById,
  getFigmaManifest,
  getFigmaKitSpec,
} from '../data/figmaKits';
import {
  CreditTopUp,
  CreditTransaction,
  CreditWallet,
  FigmaKitProduct,
  KitDeliveryAsset,
  KitOrder,
  KitUnlock,
  UserProfile,
} from '../types';
import { assertRuntimeConfiguration } from './runtimeConfig';

interface PersistedState {
  wallets: CreditWallet[];
  transactions: CreditTransaction[];
  topUps: CreditTopUp[];
  unlocks: KitUnlock[];
  orders: KitOrder[];
}

export interface SessionSnapshot {
  user: UserProfile | null;
  wallet: CreditWallet | null;
  transactions: CreditTransaction[];
  topUps: CreditTopUp[];
  unlocks: KitUnlock[];
  orders: KitOrder[];
}

const STORAGE_KEY = 'luxuryui.session-store.v1';
const CHANGE_EVENT = 'luxuryui-session-store-change';

const defaultState: PersistedState = {
  wallets: [],
  transactions: [],
  topUps: [],
  unlocks: [],
  orders: [],
};

const isBrowser = () => typeof window !== 'undefined';

const now = () => new Date().toISOString();

const generateId = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

const readState = (): PersistedState => {
  if (!isBrowser()) {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<
      PersistedState & {
        users?: unknown[];
        sessionUid?: string | null;
      }
    >;

    return {
      wallets: parsed.wallets ?? [],
      transactions: parsed.transactions ?? [],
      topUps: parsed.topUps ?? [],
      unlocks: parsed.unlocks ?? [],
      orders: parsed.orders ?? [],
    };
  } catch {
    return defaultState;
  }
};

const writeState = (nextState: PersistedState): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const getWalletForUser = (state: PersistedState, userId: string): CreditWallet | null =>
  state.wallets.find((wallet) => wallet.userId === userId) ?? null;

const buildWallet = (userId: string): CreditWallet => ({
  userId,
  balance: 0,
  lifetimePurchased: 0,
  lifetimeSpent: 0,
  createdAt: now(),
  updatedAt: now(),
});

const assertValidTopUpCredits = (credits: number): void => {
  if (!Number.isFinite(credits) || !Number.isInteger(credits)) {
    throw new Error('Credits must be a whole number.');
  }

  if (credits < CREDIT_PACK_CONFIG.minCredits || credits > CREDIT_PACK_CONFIG.maxCredits) {
    throw new Error(
      `Credits must be between ${CREDIT_PACK_CONFIG.minCredits} and ${CREDIT_PACK_CONFIG.maxCredits}.`,
    );
  }
};

const toSnapshot = (state: PersistedState, user: UserProfile | null): SessionSnapshot => {
  if (!user) {
    return {
      user: null,
      wallet: null,
      transactions: [],
      topUps: [],
      unlocks: [],
      orders: [],
    };
  }

  return {
    user,
    wallet: getWalletForUser(state, user.uid),
    transactions: state.transactions.filter((transaction) => transaction.userId === user.uid).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    topUps: state.topUps.filter((topUp) => topUp.userId === user.uid).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    unlocks: state.unlocks.filter((unlock) => unlock.userId === user.uid).sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt)),
    orders: state.orders.filter((order) => order.userId === user.uid).sort((a, b) => (b.fulfilledAt ?? '').localeCompare(a.fulfilledAt ?? '')),
  };
};

export const getSessionSnapshot = (user: UserProfile | null): SessionSnapshot => {
  assertRuntimeConfiguration();
  return toSnapshot(readState(), user);
};

export const subscribeToSession = (callback: () => void): (() => void) => {
  if (!isBrowser()) {
    return () => undefined;
  }

  const wrapped = () => callback();
  window.addEventListener(CHANGE_EVENT, wrapped);
  return () => window.removeEventListener(CHANGE_EVENT, wrapped);
};

export const ensureWalletForUser = (userId: string): CreditWallet => {
  const currentState = readState();
  const existingWallet = getWalletForUser(currentState, userId);

  if (existingWallet) {
    return existingWallet;
  }

  const nextWallet = buildWallet(userId);

  writeState({
    ...currentState,
    wallets: [...currentState.wallets, nextWallet],
  });

  return nextWallet;
};

export const topUpWalletCredits = async (user: UserProfile | null, credits: number): Promise<CreditTopUp> => {
  assertRuntimeConfiguration();
  assertValidTopUpCredits(credits);

  if (!user) {
    throw new Error('Sign in before topping up credits.');
  }

  const currentState = readState();
  const currentWallet = getWalletForUser(currentState, user.uid) ?? ensureWalletForUser(user.uid);
  const quote = getCreditQuote(credits);
  const createdAt = now();
  const topUpId = generateId('topup');
  const orderId = generateId('credit-order');
  const stripeSessionId = `local_checkout_${topUpId}`;

  const nextTopUp: CreditTopUp = {
    id: topUpId,
    userId: user.uid,
    creditsPurchased: quote.credits,
    eurAmount: quote.eurTotal,
    gbpAmount: quote.gbpTotal,
    stripeSessionId,
    status: 'succeeded',
    createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: generateId('txn'),
    userId: user.uid,
    type: 'topup',
    creditsDelta: quote.credits,
    relatedOrderId: orderId,
    createdAt,
  };

  const nextWallet: CreditWallet = {
    ...currentWallet,
    balance: currentWallet.balance + quote.credits,
    lifetimePurchased: currentWallet.lifetimePurchased + quote.credits,
    updatedAt: createdAt,
  };

  writeState({
    ...currentState,
    wallets: currentState.wallets.some((wallet) => wallet.userId === user.uid)
      ? currentState.wallets.map((wallet) => (wallet.userId === user.uid ? nextWallet : wallet))
      : [...currentState.wallets, nextWallet],
    topUps: [...currentState.topUps, nextTopUp],
    transactions: [...currentState.transactions, nextTransaction],
  });

  return nextTopUp;
};

export const purchaseKitWithCredits = async (user: UserProfile | null, kit: FigmaKitProduct): Promise<KitUnlock> => {
  assertRuntimeConfiguration();

  const review = getCommercialReview(kit.id);
  if (!review?.readyForSale || kit.status !== 'published') {
    throw new Error('This kit is still research-only and cannot be unlocked yet.');
  }

  if (!user) {
    throw new Error('Sign in before buying with credits.');
  }

  const currentState = readState();
  const currentWallet = getWalletForUser(currentState, user.uid) ?? ensureWalletForUser(user.uid);
  const existingUnlock = currentState.unlocks.find((unlock) => unlock.userId === user.uid && unlock.productId === kit.id);

  if (existingUnlock) {
    return existingUnlock;
  }

  if (currentWallet.balance < kit.creditCost) {
    throw new Error('Not enough credits. Top up your wallet first.');
  }

  const createdAt = now();
  const orderId = generateId('order');
  const unlockId = generateId('unlock');

  const nextUnlock: KitUnlock = {
    id: unlockId,
    userId: user.uid,
    productId: kit.id,
    creditsSpent: kit.creditCost,
    unlockedAt: createdAt,
    downloadStatus: 'available',
  };

  const nextOrder: KitOrder = {
    id: orderId,
    userId: user.uid,
    productId: kit.id,
    creditCost: kit.creditCost,
    status: 'unlocked',
    fulfilledAt: createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: generateId('txn'),
    userId: user.uid,
    type: 'purchase',
    creditsDelta: -kit.creditCost,
    relatedKitId: kit.id,
    relatedOrderId: orderId,
    createdAt,
  };

  const nextWallet: CreditWallet = {
    ...currentWallet,
    balance: currentWallet.balance - kit.creditCost,
    lifetimeSpent: currentWallet.lifetimeSpent + kit.creditCost,
    updatedAt: createdAt,
  };

  writeState({
    ...currentState,
    wallets: currentState.wallets.some((wallet) => wallet.userId === user.uid)
      ? currentState.wallets.map((wallet) => (wallet.userId === user.uid ? nextWallet : wallet))
      : [...currentState.wallets, nextWallet],
    transactions: [...currentState.transactions, nextTransaction],
    unlocks: [...currentState.unlocks, nextUnlock],
    orders: [...currentState.orders, nextOrder],
  });

  return nextUnlock;
};

export const hasUnlockedKit = (productId: string, userId?: string | null): boolean => {
  if (!userId) {
    return false;
  }

  const state = readState();
  return state.unlocks.some((unlock) => unlock.userId === userId && unlock.productId === productId);
};

export const markKitDownloaded = (unlockId: string): void => {
  const currentState = readState();
  const targetUnlock = currentState.unlocks.find((unlock) => unlock.id === unlockId);

  writeState({
    ...currentState,
    unlocks: currentState.unlocks.map((unlock) =>
      unlock.id === unlockId ? { ...unlock, downloadStatus: 'downloaded' } : unlock
    ),
    orders: currentState.orders.map((order) =>
      targetUnlock && order.userId === targetUnlock.userId && order.productId === targetUnlock.productId
        ? { ...order, status: 'fulfilled', fulfilledAt: now() }
        : order
    ),
  });
};

export const getUnlockForProduct = (productId: string, userId?: string | null): KitUnlock | undefined => {
  if (!userId) {
    return undefined;
  }

  const state = readState();
  return state.unlocks.find((unlock) => unlock.userId === userId && unlock.productId === productId);
};

export const createDeliveryDownload = (
  user: UserProfile | null,
  unlock: KitUnlock | undefined,
  productId: string
): KitDeliveryAsset => {
  if (!user) {
    throw new Error('Sign in before downloading this package.');
  }

  if (!unlock) {
    throw new Error('Unlock required before downloading this package.');
  }

  const kit = getFigmaKitById(productId) ?? null;
  const spec = getFigmaKitSpec(productId);
  const review = getCommercialReview(productId);
  const manifest = getFigmaManifest(productId);
  const finalAssetUrl = manifest?.generatedArtifacts.finalAssetUrl ?? null;
  const finalAssetId = manifest?.generatedArtifacts.finalAssetId ?? kit?.figmaFileKey ?? null;
  const isFinalized = manifest?.generatedArtifacts.finalizationStatus === 'finalized';

  if (!kit || !manifest || !isFinalized || !finalAssetUrl) {
    throw new Error('This kit is not finalized for delivery yet.');
  }

  const supportPayload = {
    exportedAt: now(),
    unlockedBy: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      provider: user.provider,
    },
    unlock,
    kit,
    spec,
    review,
    manifest,
  };

  const blob = new Blob([JSON.stringify(supportPayload, null, 2)], { type: 'application/json' });
  const metadataUrl = URL.createObjectURL(blob);
  const fileName = `${kit.slug}.figma-url`;

  return {
    kind: 'figma-final-asset',
    url: finalAssetUrl,
    fileName,
    assetId: finalAssetId,
    metadataUrl,
  };
};
