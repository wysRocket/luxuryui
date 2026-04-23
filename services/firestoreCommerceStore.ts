import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
} from 'firebase/firestore';
import { CREDIT_PACK_CONFIG, getCommercialReview, getCreditQuote } from '../data/figmaKits';
import { CreditTopUp, CreditTransaction, CreditWallet, FigmaKitProduct, KitOrder, KitUnlock, UserProfile } from '../types';
import { getFirebaseFirestoreClient } from './firebaseClient';
import { assertRuntimeConfiguration } from './runtimeConfig';

const db = () => {
  assertRuntimeConfiguration();
  return getFirebaseFirestoreClient();
};

const now = () => new Date().toISOString();

const generateId = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '_');

const walletRef = (userId: string) => doc(db(), 'wallets', userId);
const transactionsCollection = (userId: string) => collection(db(), 'wallets', userId, 'transactions');
const topUpsCollection = (userId: string) => collection(db(), 'wallets', userId, 'topUps');
const ordersCollection = (userId: string) => collection(db(), 'wallets', userId, 'orders');
const unlocksCollection = (userId: string) => collection(db(), 'wallets', userId, 'unlocks');
const unlockRef = (userId: string, unlockId: string) => doc(db(), 'wallets', userId, 'unlocks', unlockId);
const orderRef = (userId: string, orderId: string) => doc(db(), 'wallets', userId, 'orders', orderId);
const transactionRef = (userId: string, transactionId: string) => doc(db(), 'wallets', userId, 'transactions', transactionId);
const topUpRef = (userId: string, topUpId: string) => doc(db(), 'wallets', userId, 'topUps', topUpId);

const buildWallet = (userId: string): CreditWallet => {
  const timestamp = now();

  return {
    userId,
    balance: 0,
    lifetimePurchased: 0,
    lifetimeSpent: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const sortDesc = <T extends { createdAt?: string; unlockedAt?: string; fulfilledAt?: string | null }>(
  items: T[],
  key: 'createdAt' | 'unlockedAt' | 'fulfilledAt'
) =>
  [...items].sort((a, b) => (b[key] ?? '').localeCompare(a[key] ?? ''));

const mapWallet = (data: DocumentData | undefined, userId: string): CreditWallet | null => {
  if (!data) {
    return null;
  }

  return {
    userId,
    balance: Number(data.balance ?? 0),
    lifetimePurchased: Number(data.lifetimePurchased ?? 0),
    lifetimeSpent: Number(data.lifetimeSpent ?? 0),
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : now(),
  };
};

const mapTransaction = (id: string, data: DocumentData): CreditTransaction => ({
  id: typeof data.id === 'string' ? data.id : id,
  userId: String(data.userId ?? ''),
  type: data.type === 'refund' ? 'refund' : data.type === 'purchase' ? 'purchase' : 'topup',
  creditsDelta: Number(data.creditsDelta ?? 0),
  relatedKitId: typeof data.relatedKitId === 'string' ? data.relatedKitId : undefined,
  relatedOrderId: typeof data.relatedOrderId === 'string' ? data.relatedOrderId : undefined,
  createdAt: typeof data.createdAt === 'string' ? data.createdAt : now(),
});

const mapTopUp = (id: string, data: DocumentData): CreditTopUp => ({
  id: typeof data.id === 'string' ? data.id : id,
  userId: String(data.userId ?? ''),
  creditsPurchased: Number(data.creditsPurchased ?? 0),
  eurAmount: Number(data.eurAmount ?? 0),
  gbpAmount: Number(data.gbpAmount ?? 0),
  stripeSessionId: String(data.stripeSessionId ?? ''),
  status: data.status === 'failed' ? 'failed' : data.status === 'pending' ? 'pending' : 'succeeded',
  createdAt: typeof data.createdAt === 'string' ? data.createdAt : now(),
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

const mapOrder = (id: string, data: DocumentData): KitOrder => ({
  id: typeof data.id === 'string' ? data.id : id,
  userId: String(data.userId ?? ''),
  productId: String(data.productId ?? ''),
  creditCost: Number(data.creditCost ?? 0),
  status: data.status === 'fulfilled' ? 'fulfilled' : 'unlocked',
  fulfilledAt: typeof data.fulfilledAt === 'string' ? data.fulfilledAt : null,
});

const mapUnlock = (id: string, data: DocumentData): KitUnlock => ({
  id: typeof data.id === 'string' ? data.id : id,
  userId: String(data.userId ?? ''),
  productId: String(data.productId ?? ''),
  creditsSpent: Number(data.creditsSpent ?? 0),
  unlockedAt: typeof data.unlockedAt === 'string' ? data.unlockedAt : now(),
  downloadStatus: data.downloadStatus === 'downloaded' ? 'downloaded' : 'available',
});

export const ensureFirestoreWalletForUser = async (user: UserProfile): Promise<CreditWallet> => {
  const ref = walletRef(user.uid);

  await runTransaction(db(), async (transaction) => {
    const walletSnapshot = await transaction.get(ref);

    if (!walletSnapshot.exists()) {
      transaction.set(ref, buildWallet(user.uid));
    }
  });

  const snapshot = await new Promise<CreditWallet | null>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      ref,
      (walletSnapshot) => {
        unsubscribe();
        resolve(mapWallet(walletSnapshot.data(), user.uid));
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });

  return snapshot ?? buildWallet(user.uid);
};

export const subscribeToFirestoreWallet = (
  userId: string,
  listener: (wallet: CreditWallet | null) => void
): (() => void) =>
  onSnapshot(walletRef(userId), (snapshot) => {
    listener(mapWallet(snapshot.data(), userId));
  });

const subscribeToCollection = <T,>(
  collectionQuery: ReturnType<typeof query>,
  mapper: (id: string, data: DocumentData) => T,
  sorter: (items: T[]) => T[],
  listener: (items: T[]) => void
): (() => void) =>
  onSnapshot(collectionQuery, (snapshot) => {
    const items = snapshot.docs.map((docSnapshot) => mapper(docSnapshot.id, docSnapshot.data()));
    listener(sorter(items));
  });

export const subscribeToFirestoreTransactions = (
  userId: string,
  listener: (transactions: CreditTransaction[]) => void
): (() => void) =>
  subscribeToCollection(
    query(transactionsCollection(userId), orderBy('createdAt', 'desc')),
    mapTransaction,
    (items) => items,
    listener
  );

export const subscribeToFirestoreTopUps = (
  userId: string,
  listener: (topUps: CreditTopUp[]) => void
): (() => void) =>
  subscribeToCollection(
    query(topUpsCollection(userId), orderBy('createdAt', 'desc')),
    mapTopUp,
    (items) => items,
    listener
  );

export const subscribeToFirestoreOrders = (
  userId: string,
  listener: (orders: KitOrder[]) => void
): (() => void) =>
  subscribeToCollection(
    query(ordersCollection(userId), orderBy('fulfilledAt', 'desc')),
    mapOrder,
    (items) => sortDesc(items, 'fulfilledAt'),
    listener
  );

export const subscribeToFirestoreUnlocks = (
  userId: string,
  listener: (unlocks: KitUnlock[]) => void
): (() => void) =>
  subscribeToCollection(
    query(unlocksCollection(userId), orderBy('unlockedAt', 'desc')),
    mapUnlock,
    (items) => items,
    listener
  );

export const topUpFirestoreWalletCredits = async (user: UserProfile, credits: number): Promise<CreditTopUp> => {
  assertValidTopUpCredits(credits);
  const quote = getCreditQuote(credits);
  const createdAt = now();
  const topUpId = generateId('topup');
  const checkoutId = `local_checkout_${topUpId}`;
  const transactionId = generateId('txn');
  const orderId = generateId('credit-order');
  const ref = walletRef(user.uid);

  const nextTopUp: CreditTopUp = {
    id: topUpId,
    userId: user.uid,
    creditsPurchased: quote.credits,
    eurAmount: quote.eurTotal,
    gbpAmount: quote.gbpTotal,
    stripeSessionId: checkoutId,
    status: 'succeeded',
    createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: transactionId,
    userId: user.uid,
    type: 'topup',
    creditsDelta: quote.credits,
    relatedOrderId: orderId,
    createdAt,
  };

  await runTransaction(db(), async (transaction) => {
    const walletSnapshot = await transaction.get(ref);
    const currentWallet = mapWallet(walletSnapshot.data(), user.uid) ?? buildWallet(user.uid);
    const nextWallet: CreditWallet = {
      ...currentWallet,
      balance: currentWallet.balance + quote.credits,
      lifetimePurchased: currentWallet.lifetimePurchased + quote.credits,
      updatedAt: createdAt,
    };

    transaction.set(ref, nextWallet);
    transaction.set(topUpRef(user.uid, topUpId), nextTopUp);
    transaction.set(transactionRef(user.uid, transactionId), nextTransaction);
  });

  return nextTopUp;
};

export const applyFirestoreSafepayCredits = async (
  user: UserProfile,
  params: {
    credits: number;
    invoiceId: string;
    eurAmount: number;
    gbpAmount: number;
  }
): Promise<CreditTopUp> => {
  const { credits, invoiceId, eurAmount, gbpAmount } = params;
  const createdAt = now();
  const topUpId = sanitizeId(invoiceId);
  const transactionId = `safepay_txn_${topUpId}`;
  const ref = walletRef(user.uid);

  const nextTopUp: CreditTopUp = {
    id: topUpId,
    userId: user.uid,
    creditsPurchased: credits,
    eurAmount,
    gbpAmount,
    stripeSessionId: invoiceId,
    status: 'succeeded',
    createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: transactionId,
    userId: user.uid,
    type: 'topup',
    creditsDelta: credits,
    relatedOrderId: topUpId,
    createdAt,
  };

  await runTransaction(db(), async (transaction) => {
    const [walletSnapshot, topUpSnapshot] = await Promise.all([
      transaction.get(ref),
      transaction.get(topUpRef(user.uid, topUpId)),
    ]);

    // Idempotency guard: if we already recorded this top-up, skip
    if (topUpSnapshot.exists()) {
      return;
    }

    const currentWallet = mapWallet(walletSnapshot.data(), user.uid) ?? buildWallet(user.uid);
    const nextWallet: CreditWallet = {
      ...currentWallet,
      balance: currentWallet.balance + credits,
      lifetimePurchased: currentWallet.lifetimePurchased + credits,
      updatedAt: createdAt,
    };

    transaction.set(ref, nextWallet);
    transaction.set(topUpRef(user.uid, topUpId), nextTopUp);
    transaction.set(transactionRef(user.uid, transactionId), nextTransaction);
  });

  return nextTopUp;
};

export const purchaseFirestoreKitWithCredits = async (
  user: UserProfile,
  kit: FigmaKitProduct
): Promise<KitUnlock> => {
  const review = getCommercialReview(kit.id);
  if (!review?.readyForSale || kit.status !== 'published') {
    throw new Error('This kit is still research-only and cannot be unlocked yet.');
  }

  const walletDocument = walletRef(user.uid);
  const unlockId = sanitizeId(kit.id);
  const createdAt = now();
  const unlockDocument = unlockRef(user.uid, unlockId);
  const orderDocument = orderRef(user.uid, unlockId);
  const transactionId = `purchase_${unlockId}`;
  const transactionDocument = transactionRef(user.uid, transactionId);
  let existingUnlock: KitUnlock | null = null;

  const nextUnlock: KitUnlock = {
    id: unlockId,
    userId: user.uid,
    productId: kit.id,
    creditsSpent: kit.creditCost,
    unlockedAt: createdAt,
    downloadStatus: 'available',
  };

  const nextOrder: KitOrder = {
    id: unlockId,
    userId: user.uid,
    productId: kit.id,
    creditCost: kit.creditCost,
    status: 'unlocked',
    fulfilledAt: createdAt,
  };

  const nextTransaction: CreditTransaction = {
    id: transactionId,
    userId: user.uid,
    type: 'purchase',
    creditsDelta: -kit.creditCost,
    relatedKitId: kit.id,
    relatedOrderId: unlockId,
    createdAt,
  };

  await runTransaction(db(), async (transaction) => {
    const [walletSnapshot, unlockSnapshot] = await Promise.all([
      transaction.get(walletDocument),
      transaction.get(unlockDocument),
    ]);

    if (unlockSnapshot.exists()) {
      existingUnlock = mapUnlock(unlockSnapshot.id, unlockSnapshot.data());
      return;
    }

    const currentWallet = mapWallet(walletSnapshot.data(), user.uid) ?? buildWallet(user.uid);

    if (currentWallet.balance < kit.creditCost) {
      throw new Error('Not enough credits. Top up your wallet first.');
    }

    const nextWallet: CreditWallet = {
      ...currentWallet,
      balance: currentWallet.balance - kit.creditCost,
      lifetimeSpent: currentWallet.lifetimeSpent + kit.creditCost,
      updatedAt: createdAt,
    };

    transaction.set(walletDocument, nextWallet);
    transaction.set(unlockDocument, nextUnlock);
    transaction.set(orderDocument, nextOrder);
    transaction.set(transactionDocument, nextTransaction);
  });

  return existingUnlock ?? nextUnlock;
};

export const markFirestoreDownloadStatus = async (
  userId: string,
  unlockId: string,
  status: KitUnlock['downloadStatus']
): Promise<void> => {
  const unlockDocument = unlockRef(userId, unlockId);
  const orderDocument = orderRef(userId, unlockId);

  await runTransaction(db(), async (transaction) => {
    const unlockSnapshot = await transaction.get(unlockDocument);

    if (!unlockSnapshot.exists()) {
      return;
    }

    transaction.set(
      unlockDocument,
      {
        ...unlockSnapshot.data(),
        downloadStatus: status,
      },
      { merge: true }
    );

    if (status === 'downloaded') {
      transaction.set(
        orderDocument,
        {
          status: 'fulfilled',
          fulfilledAt: now(),
        },
        { merge: true }
      );
    }
  });
};
