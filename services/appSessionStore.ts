import { getCommercialReview, getCreditQuote, getFigmaKitById, getFigmaManifest, getFigmaKitSpec } from '../data/figmaKits';
import {
  CreditTopUp,
  CreditTransaction,
  CreditWallet,
  FigmaKitProduct,
  KitOrder,
  KitUnlock,
  UserProfile,
} from '../types';
import { assertRuntimeConfiguration } from './runtimeConfig';

interface LocalUserRecord extends UserProfile {
  password: string;
}

interface PersistedState {
  users: LocalUserRecord[];
  sessionUid: string | null;
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
  users: [],
  sessionUid: null,
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

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      users: parsed.users ?? [],
      sessionUid: parsed.sessionUid ?? null,
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

const toSnapshot = (state: PersistedState): SessionSnapshot => {
  const activeUserRecord = state.users.find((user) => user.uid === state.sessionUid) ?? null;
  const user = activeUserRecord
    ? {
        uid: activeUserRecord.uid,
        email: activeUserRecord.email,
        displayName: activeUserRecord.displayName,
        createdAt: activeUserRecord.createdAt,
      }
    : null;

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

export const getSessionSnapshot = (): SessionSnapshot => {
  assertRuntimeConfiguration();
  return toSnapshot(readState());
};

export const subscribeToSession = (callback: () => void): (() => void) => {
  if (!isBrowser()) {
    return () => undefined;
  }

  const wrapped = () => callback();
  window.addEventListener(CHANGE_EVENT, wrapped);
  return () => window.removeEventListener(CHANGE_EVENT, wrapped);
};

export const signUpWithEmail = async ({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}): Promise<UserProfile> => {
  assertRuntimeConfiguration();

  const normalizedEmail = email.trim().toLowerCase();
  const currentState = readState();

  if (currentState.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const createdAt = now();
  const nextUser: LocalUserRecord = {
    uid: generateId('user'),
    displayName: displayName.trim(),
    email: normalizedEmail,
    password,
    createdAt,
  };

  const nextWallet: CreditWallet = {
    userId: nextUser.uid,
    balance: 0,
    lifetimePurchased: 0,
    lifetimeSpent: 0,
    updatedAt: createdAt,
  };

  writeState({
    ...currentState,
    users: [...currentState.users, nextUser],
    wallets: [...currentState.wallets, nextWallet],
    sessionUid: nextUser.uid,
  });

  return {
    uid: nextUser.uid,
    displayName: nextUser.displayName,
    email: nextUser.email,
    createdAt: nextUser.createdAt,
  };
};

export const signInWithEmail = async ({ email, password }: { email: string; password: string }): Promise<UserProfile> => {
  assertRuntimeConfiguration();

  const normalizedEmail = email.trim().toLowerCase();
  const currentState = readState();
  const existingUser = currentState.users.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (!existingUser || existingUser.password !== password) {
    throw new Error('Email or password is incorrect.');
  }

  writeState({
    ...currentState,
    sessionUid: existingUser.uid,
  });

  return {
    uid: existingUser.uid,
    displayName: existingUser.displayName,
    email: existingUser.email,
    createdAt: existingUser.createdAt,
  };
};

export const signOutSession = async (): Promise<void> => {
  const currentState = readState();
  writeState({
    ...currentState,
    sessionUid: null,
  });
};

export const topUpWalletCredits = async (credits: number): Promise<CreditTopUp> => {
  assertRuntimeConfiguration();

  const currentState = readState();
  const snapshot = toSnapshot(currentState);

  if (!snapshot.user || !snapshot.wallet) {
    throw new Error('Sign in before topping up credits.');
  }

  const quote = getCreditQuote(credits);
  const createdAt = now();
  const topUpId = generateId('topup');
  const orderId = generateId('credit-order');
  const stripeSessionId = `local_checkout_${topUpId}`;

  const nextTopUp: CreditTopUp = {
    id: topUpId,
    userId: snapshot.user.uid,
    creditsPurchased: quote.credits,
    eurAmount: quote.eurTotal,
    gbpAmount: quote.gbpTotal,
    stripeSessionId,
    status: 'succeeded',
    createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: generateId('txn'),
    userId: snapshot.user.uid,
    type: 'topup',
    creditsDelta: quote.credits,
    relatedOrderId: orderId,
    createdAt,
  };

  const nextWallet: CreditWallet = {
    ...snapshot.wallet,
    balance: snapshot.wallet.balance + quote.credits,
    lifetimePurchased: snapshot.wallet.lifetimePurchased + quote.credits,
    updatedAt: createdAt,
  };

  writeState({
    ...currentState,
    wallets: currentState.wallets.map((wallet) => (wallet.userId === snapshot.user?.uid ? nextWallet : wallet)),
    topUps: [...currentState.topUps, nextTopUp],
    transactions: [...currentState.transactions, nextTransaction],
  });

  return nextTopUp;
};

export const purchaseKitWithCredits = async (kit: FigmaKitProduct): Promise<KitUnlock> => {
  assertRuntimeConfiguration();

  const review = getCommercialReview(kit.id);
  if (!review?.readyForSale || kit.status !== 'published') {
    throw new Error('This kit is still research-only and cannot be unlocked yet.');
  }

  const currentState = readState();
  const snapshot = toSnapshot(currentState);

  if (!snapshot.user || !snapshot.wallet) {
    throw new Error('Sign in before buying with credits.');
  }

  const existingUnlock = currentState.unlocks.find(
    (unlock) => unlock.userId === snapshot.user?.uid && unlock.productId === kit.id
  );

  if (existingUnlock) {
    return existingUnlock;
  }

  if (snapshot.wallet.balance < kit.creditCost) {
    throw new Error('Not enough credits. Top up your wallet first.');
  }

  const createdAt = now();
  const orderId = generateId('order');
  const unlockId = generateId('unlock');

  const nextUnlock: KitUnlock = {
    id: unlockId,
    userId: snapshot.user.uid,
    productId: kit.id,
    creditsSpent: kit.creditCost,
    unlockedAt: createdAt,
    downloadStatus: 'available',
  };

  const nextOrder: KitOrder = {
    id: orderId,
    userId: snapshot.user.uid,
    productId: kit.id,
    creditCost: kit.creditCost,
    status: 'unlocked',
    fulfilledAt: createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: generateId('txn'),
    userId: snapshot.user.uid,
    type: 'purchase',
    creditsDelta: -kit.creditCost,
    relatedKitId: kit.id,
    relatedOrderId: orderId,
    createdAt,
  };

  const nextWallet: CreditWallet = {
    ...snapshot.wallet,
    balance: snapshot.wallet.balance - kit.creditCost,
    lifetimeSpent: snapshot.wallet.lifetimeSpent + kit.creditCost,
    updatedAt: createdAt,
  };

  writeState({
    ...currentState,
    wallets: currentState.wallets.map((wallet) => (wallet.userId === snapshot.user?.uid ? nextWallet : wallet)),
    transactions: [...currentState.transactions, nextTransaction],
    unlocks: [...currentState.unlocks, nextUnlock],
    orders: [...currentState.orders, nextOrder],
  });

  return nextUnlock;
};

export const hasUnlockedKit = (productId: string, userId?: string | null): boolean => {
  const state = readState();
  const activeUserId = userId ?? state.sessionUid;
  if (!activeUserId) {
    return false;
  }

  return state.unlocks.some((unlock) => unlock.userId === activeUserId && unlock.productId === productId);
};

export const markKitDownloaded = (unlockId: string): void => {
  const currentState = readState();
  writeState({
    ...currentState,
    unlocks: currentState.unlocks.map((unlock) =>
      unlock.id === unlockId ? { ...unlock, downloadStatus: 'downloaded' } : unlock
    ),
    orders: currentState.orders.map((order) =>
      currentState.unlocks.find((unlock) => unlock.id === unlockId && unlock.productId === order.productId)
        ? { ...order, status: 'fulfilled', fulfilledAt: now() }
        : order
    ),
  });
};

export const getUnlockForProduct = (productId: string): KitUnlock | undefined => {
  const state = readState();
  if (!state.sessionUid) {
    return undefined;
  }

  return state.unlocks.find((unlock) => unlock.userId === state.sessionUid && unlock.productId === productId);
};

export const createDeliveryDownload = (productId: string): { url: string; fileName: string } => {
  const unlock = getUnlockForProduct(productId);
  if (!unlock) {
    throw new Error('Unlock required before downloading this package.');
  }

  const currentState = readState();
  const activeUser = currentState.users.find((user) => user.uid === unlock.userId);
  const kit = getFigmaKitById(productId) ?? null;
  const spec = getFigmaKitSpec(productId);
  const review = getCommercialReview(productId);
  const manifest = getFigmaManifest(productId);

  const payload = {
    exportedAt: now(),
    unlockedBy: activeUser
      ? {
          uid: activeUser.uid,
          email: activeUser.email,
          displayName: activeUser.displayName,
        }
      : null,
    unlock,
    kit,
    spec,
    review,
    manifest,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const fileName = `${productId.replace(':', '-')}-delivery-pack.json`;

  return { url, fileName };
};
