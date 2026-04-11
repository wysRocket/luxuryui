import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import type {
  AdminOverviewSnapshot,
  CreditTopUp,
  CreditTransaction,
  CreditWallet,
  KitOrder,
  KitUnlock,
  UserProfile,
  UserProfileRecord,
  UserRole,
  UserRoleRecord,
} from "../types";
import { isFirestorePermissionDeniedError } from "./firebaseErrorUtils";
import { getFirebaseFirestoreClient } from "./firebaseClient";
import { assertRuntimeConfiguration } from "./runtimeConfig";

const db = () => {
  assertRuntimeConfiguration();
  return getFirebaseFirestoreClient();
};

const now = () => new Date().toISOString();

const userProfileRef = (userId: string) => doc(db(), "userProfiles", userId);
const userRoleRef = (userId: string) => doc(db(), "userRoles", userId);

const sortDesc = <T,>(items: T[], selector: (item: T) => string | undefined) =>
  [...items].sort((left, right) =>
    (selector(right) ?? "").localeCompare(selector(left) ?? ""),
  );

const mapWallet = (userId: string, data: DocumentData | undefined): CreditWallet | null => {
  if (!data) {
    return null;
  }

  return {
    userId,
    balance: Number(data.balance ?? 0),
    lifetimePurchased: Number(data.lifetimePurchased ?? 0),
    lifetimeSpent: Number(data.lifetimeSpent ?? 0),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : now(),
  };
};

const mapUserProfile = (userId: string, data: DocumentData | undefined): UserProfileRecord | null => {
  if (!data) {
    return null;
  }

  return {
    uid: userId,
    email: typeof data.email === "string" ? data.email : "",
    displayName:
      typeof data.displayName === "string" && data.displayName.trim()
        ? data.displayName
        : "LuxuryUI user",
    provider:
      data.provider === "firebase-google"
        ? "firebase-google"
        : data.provider === "firebase-password"
          ? "firebase-password"
          : "local",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : now(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : now(),
  };
};

const mapUserRole = (userId: string, data: DocumentData | undefined): UserRoleRecord | null => {
  if (!data) {
    return null;
  }

  const roles = Array.isArray(data.roles)
    ? data.roles.filter((role): role is UserRole => role === "user" || role === "admin")
    : [];

  return {
    userId,
    roles: roles.length > 0 ? roles : ["user"],
    createdAt: typeof data.createdAt === "string" ? data.createdAt : now(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : now(),
  };
};

const mapTransaction = (id: string, data: DocumentData): CreditTransaction => ({
  id: typeof data.id === "string" ? data.id : id,
  userId: String(data.userId ?? ""),
  type:
    data.type === "refund"
      ? "refund"
      : data.type === "purchase"
        ? "purchase"
        : "topup",
  creditsDelta: Number(data.creditsDelta ?? 0),
  relatedKitId:
    typeof data.relatedKitId === "string" ? data.relatedKitId : undefined,
  relatedOrderId:
    typeof data.relatedOrderId === "string" ? data.relatedOrderId : undefined,
  createdAt: typeof data.createdAt === "string" ? data.createdAt : now(),
});

const mapTopUp = (id: string, data: DocumentData): CreditTopUp => ({
  id: typeof data.id === "string" ? data.id : id,
  userId: String(data.userId ?? ""),
  creditsPurchased: Number(data.creditsPurchased ?? 0),
  eurAmount: Number(data.eurAmount ?? 0),
  gbpAmount: Number(data.gbpAmount ?? 0),
  stripeSessionId: String(data.stripeSessionId ?? ""),
  status:
    data.status === "failed"
      ? "failed"
      : data.status === "pending"
        ? "pending"
        : "succeeded",
  createdAt: typeof data.createdAt === "string" ? data.createdAt : now(),
});

const mapUnlock = (id: string, data: DocumentData): KitUnlock => ({
  id: typeof data.id === "string" ? data.id : id,
  userId: String(data.userId ?? ""),
  productId: String(data.productId ?? ""),
  creditsSpent: Number(data.creditsSpent ?? 0),
  unlockedAt: typeof data.unlockedAt === "string" ? data.unlockedAt : now(),
  downloadStatus: data.downloadStatus === "downloaded" ? "downloaded" : "available",
});

const mapOrder = (id: string, data: DocumentData): KitOrder => ({
  id: typeof data.id === "string" ? data.id : id,
  userId: String(data.userId ?? ""),
  productId: String(data.productId ?? ""),
  creditCost: Number(data.creditCost ?? 0),
  status: data.status === "fulfilled" ? "fulfilled" : "unlocked",
  fulfilledAt: typeof data.fulfilledAt === "string" ? data.fulfilledAt : null,
});

const buildUserProfileRecord = (user: UserProfile): UserProfileRecord => {
  const timestamp = now();

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    provider: user.provider,
    createdAt: user.createdAt,
    updatedAt: timestamp,
  };
};

const buildDefaultRoleRecord = (userId: string): UserRoleRecord => {
  const timestamp = now();

  return {
    userId,
    roles: ["user"],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const ensureFirestoreUserProfile = async (user: UserProfile): Promise<void> => {
  const record = buildUserProfileRecord(user);

  await setDoc(userProfileRef(user.uid), record, { merge: true });
};

export const ensureFirestoreUserRole = async (user: UserProfile): Promise<UserRoleRecord> => {
  const ref = userRoleRef(user.uid);

  await runTransaction(db(), async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists()) {
      transaction.set(ref, buildDefaultRoleRecord(user.uid));
    }
  });

  const snapshot = await getDoc(ref);
  return mapUserRole(user.uid, snapshot.data()) ?? buildDefaultRoleRecord(user.uid);
};

export const getFirestoreAdminStatus = async (userId: string): Promise<boolean> => {
  const snapshot = await getDoc(userRoleRef(userId));
  const roleRecord = mapUserRole(userId, snapshot.data());
  return Boolean(roleRecord?.roles.includes("admin"));
};

export const getFirestoreAdminOverview = async (): Promise<AdminOverviewSnapshot> => {
  const loadDocs = async <T,>(
    label: string,
    loader: () => Promise<T>,
    fallback: T,
  ): Promise<T> => {
    try {
      return await loader();
    } catch (error) {
      if (isFirestorePermissionDeniedError(error)) {
        console.warn(`Firestore admin overview skipped ${label} due to permissions.`, error);
        return fallback;
      }

      throw error;
    }
  };

  const [
    profilesSnapshot,
    rolesSnapshot,
    walletsSnapshot,
    transactionsSnapshot,
    topUpsSnapshot,
    unlocksSnapshot,
    ordersSnapshot,
  ] = await Promise.all([
    loadDocs("userProfiles", () => getDocs(collection(db(), "userProfiles")), null),
    loadDocs("userRoles", () => getDocs(collection(db(), "userRoles")), null),
    loadDocs("wallets", () => getDocs(collection(db(), "wallets")), null),
    loadDocs(
      "transactions",
      () =>
        getDocs(
          query(
            collectionGroup(db(), "transactions"),
            orderBy("createdAt", "desc"),
            limit(200),
          ),
        ),
      null,
    ),
    loadDocs(
      "topUps",
      () =>
        getDocs(
          query(
            collectionGroup(db(), "topUps"),
            orderBy("createdAt", "desc"),
            limit(200),
          ),
        ),
      null,
    ),
    loadDocs(
      "unlocks",
      () =>
        getDocs(
          query(
            collectionGroup(db(), "unlocks"),
            orderBy("unlockedAt", "desc"),
            limit(200),
          ),
        ),
      null,
    ),
    loadDocs(
      "orders",
      () =>
        getDocs(
          query(
            collectionGroup(db(), "orders"),
            orderBy("fulfilledAt", "desc"),
            limit(200),
          ),
        ),
      null,
    ),
  ]);

  return {
    profiles: sortDesc(
      (profilesSnapshot?.docs ?? [])
        .map((snapshot) => mapUserProfile(snapshot.id, snapshot.data()))
        .filter((entry): entry is UserProfileRecord => Boolean(entry)),
      (entry) => entry.createdAt,
    ),
    roles: sortDesc(
      (rolesSnapshot?.docs ?? [])
        .map((snapshot) => mapUserRole(snapshot.id, snapshot.data()))
        .filter((entry): entry is UserRoleRecord => Boolean(entry)),
      (entry) => entry.createdAt,
    ),
    wallets: sortDesc(
      (walletsSnapshot?.docs ?? [])
        .map((snapshot) => mapWallet(snapshot.id, snapshot.data()))
        .filter((entry): entry is CreditWallet => Boolean(entry)),
      (entry) => entry.updatedAt,
    ),
    transactions: (transactionsSnapshot?.docs ?? []).map((snapshot) =>
      mapTransaction(snapshot.id, snapshot.data()),
    ),
    topUps: (topUpsSnapshot?.docs ?? []).map((snapshot) =>
      mapTopUp(snapshot.id, snapshot.data()),
    ),
    unlocks: (unlocksSnapshot?.docs ?? []).map((snapshot) =>
      mapUnlock(snapshot.id, snapshot.data()),
    ),
    orders: (ordersSnapshot?.docs ?? []).map((snapshot) =>
      mapOrder(snapshot.id, snapshot.data()),
    ),
  };
};
