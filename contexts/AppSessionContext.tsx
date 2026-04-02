import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createDeliveryDownload,
  ensureWalletForUser,
  getSessionSnapshot,
  purchaseKitWithCredits,
  markKitDownloaded,
  subscribeToSession,
  topUpWalletCredits,
} from "../services/appSessionStore";
import { getAuthBackend } from "../services/authBackend";
import {
  ensureFirestoreWalletForUser,
  markFirestoreDownloadStatus,
  purchaseFirestoreKitWithCredits,
  subscribeToFirestoreOrders,
  subscribeToFirestoreTopUps,
  subscribeToFirestoreTransactions,
  subscribeToFirestoreUnlocks,
  subscribeToFirestoreWallet,
  topUpFirestoreWalletCredits,
} from "../services/firestoreCommerceStore";
import { getRuntimeWarnings, RUNTIME_CONFIG } from "../services/runtimeConfig";
import type {
  AppSessionState,
  AuthStatus,
  CreditTopUp,
  CreditTransaction,
  FigmaKitProduct,
  KitOrder,
  KitUnlock,
  UserProfile,
} from "../types";

interface AppSessionContextValue extends AppSessionState {
  isAuthenticated: boolean;
  isBusy: boolean;
  warnings: string[];
  backendMode: "local" | "firebase";
  signUp: (input: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  topUpCredits: (credits: number) => Promise<CreditTopUp>;
  purchaseKit: (kit: FigmaKitProduct) => Promise<KitUnlock>;
  hasUnlocked: (productId: string) => boolean;
  getUnlock: (productId: string) => KitUnlock | undefined;
  createDownload: (productId: string) => { url: string; fileName: string };
  markDownloadStatus: (
    unlockId: string,
    status: KitUnlock["downloadStatus"],
  ) => Promise<void>;
  refresh: () => void;
}

const AppSessionContext = createContext<AppSessionContextValue | undefined>(
  undefined,
);

const authBackend = getAuthBackend();
const emptyCommerceState = {
  wallet: null,
  transactions: [] as CreditTransaction[],
  topUps: [] as CreditTopUp[],
  unlocks: [] as KitUnlock[],
  orders: [] as KitOrder[],
};

export const AppSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [snapshot, setSnapshot] = useState<AppSessionState>(() => ({
    authStatus: "loading",
    user: null,
    ...emptyCommerceState,
  }));
  const [isBusy, setIsBusy] = useState(false);
  const currentUserRef = useRef<UserProfile | null>(null);
  const unsubscribeCommerceRef = useRef<(() => void) | null>(null);

  const stopCommerceSubscriptions = useCallback(() => {
    unsubscribeCommerceRef.current?.();
    unsubscribeCommerceRef.current = null;
  }, []);

  const syncAuthState = useCallback((user: UserProfile | null) => {
    currentUserRef.current = user;
    const nextStatus: AuthStatus = user ? "authenticated" : "anonymous";
    setAuthStatus(nextStatus);
    setSnapshot((currentSnapshot) => ({
      authStatus: nextStatus,
      user,
      ...(user ? currentSnapshot : emptyCommerceState),
    }));
  }, []);

  const bindLocalCommerceState = useCallback((user: UserProfile) => {
    ensureWalletForUser(user.uid);
    setSnapshot({
      authStatus: "authenticated",
      ...getSessionSnapshot(user),
    });

    unsubscribeCommerceRef.current = subscribeToSession(() => {
      if (!currentUserRef.current) {
        return;
      }

      setSnapshot({
        authStatus: "authenticated",
        ...getSessionSnapshot(currentUserRef.current),
      });
    });
  }, []);

  const bindFirestoreCommerceState = useCallback(async (user: UserProfile) => {
    await ensureFirestoreWalletForUser(user);
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      authStatus: "authenticated",
      user,
      ...emptyCommerceState,
    }));

    const unsubscribeWallet = subscribeToFirestoreWallet(user.uid, (wallet) => {
      setSnapshot((currentSnapshot) => ({
        ...currentSnapshot,
        authStatus: "authenticated",
        user,
        wallet,
      }));
    });

    const unsubscribeTransactions = subscribeToFirestoreTransactions(
      user.uid,
      (transactions) => {
        setSnapshot((currentSnapshot) => ({
          ...currentSnapshot,
          authStatus: "authenticated",
          user,
          transactions,
        }));
      },
    );

    const unsubscribeTopUps = subscribeToFirestoreTopUps(user.uid, (topUps) => {
      setSnapshot((currentSnapshot) => ({
        ...currentSnapshot,
        authStatus: "authenticated",
        user,
        topUps,
      }));
    });

    const unsubscribeOrders = subscribeToFirestoreOrders(user.uid, (orders) => {
      setSnapshot((currentSnapshot) => ({
        ...currentSnapshot,
        authStatus: "authenticated",
        user,
        orders,
      }));
    });

    const unsubscribeUnlocks = subscribeToFirestoreUnlocks(
      user.uid,
      (unlocks) => {
        setSnapshot((currentSnapshot) => ({
          ...currentSnapshot,
          authStatus: "authenticated",
          user,
          unlocks,
        }));
      },
    );

    unsubscribeCommerceRef.current = () => {
      unsubscribeWallet();
      unsubscribeTransactions();
      unsubscribeTopUps();
      unsubscribeOrders();
      unsubscribeUnlocks();
    };
  }, []);

  const syncCommerceState = useCallback(
    async (user: UserProfile | null) => {
      stopCommerceSubscriptions();

      if (!user) {
        setSnapshot({
          authStatus: "anonymous",
          user: null,
          ...emptyCommerceState,
        });
        return;
      }

      if (RUNTIME_CONFIG.backendMode === "firebase") {
        await bindFirestoreCommerceState(user);
        return;
      }

      bindLocalCommerceState(user);
    },
    [
      bindFirestoreCommerceState,
      bindLocalCommerceState,
      stopCommerceSubscriptions,
    ],
  );

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const currentUser = await authBackend.getCurrentUser();

      if (!isMounted) {
        return;
      }

      syncAuthState(currentUser);
      await syncCommerceState(currentUser);
    };

    void hydrate();

    const unsubscribeAuth = authBackend.onAuthStateChanged((user) => {
      if (!isMounted) {
        return;
      }

      syncAuthState(user);
      void syncCommerceState(user);
    });

    return () => {
      isMounted = false;
      stopCommerceSubscriptions();
      unsubscribeAuth();
    };
  }, [stopCommerceSubscriptions, syncAuthState, syncCommerceState]);

  const refresh = useCallback(() => {
    if (!currentUserRef.current) {
      setSnapshot({
        authStatus,
        user: null,
        ...emptyCommerceState,
      });
      return;
    }

    if (RUNTIME_CONFIG.backendMode === "local") {
      setSnapshot({
        authStatus,
        ...getSessionSnapshot(currentUserRef.current),
      });
    }
  }, [authStatus]);

  const wrapAction = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T> => {
      setIsBusy(true);

      try {
        const result = await action();
        refresh();
        return result;
      } finally {
        setIsBusy(false);
      }
    },
    [refresh],
  );

  const value = useMemo<AppSessionContextValue>(
    () => ({
      ...snapshot,
      authStatus,
      isAuthenticated: authStatus === "authenticated",
      isBusy,
      warnings: getRuntimeWarnings(),
      backendMode: RUNTIME_CONFIG.backendMode,
      signUp: async (input) => {
        await wrapAction(async () => {
          const nextUser = await authBackend.signUp(input);
          syncAuthState(nextUser);
          await syncCommerceState(nextUser);
        });
      },
      signIn: async (input) => {
        await wrapAction(async () => {
          const nextUser = await authBackend.signIn(input);
          syncAuthState(nextUser);
          await syncCommerceState(nextUser);
        });
      },
      signInWithGoogle: async () => {
        await wrapAction(async () => {
          const nextUser = await authBackend.signInWithGoogle();
          syncAuthState(nextUser);
          await syncCommerceState(nextUser);
        });
      },
      signOut: async () => {
        await wrapAction(async () => {
          await authBackend.signOut();
          syncAuthState(null);
          await syncCommerceState(null);
        });
      },
      topUpCredits: async (credits) =>
        wrapAction(() => {
          if (!currentUserRef.current) {
            return Promise.reject(
              new Error("Sign in before topping up credits."),
            );
          }

          return RUNTIME_CONFIG.backendMode === "firebase"
            ? topUpFirestoreWalletCredits(currentUserRef.current, credits)
            : topUpWalletCredits(currentUserRef.current, credits);
        }),
      purchaseKit: async (kit) =>
        wrapAction(() => {
          if (!currentUserRef.current) {
            return Promise.reject(
              new Error("Sign in before buying with credits."),
            );
          }

          return RUNTIME_CONFIG.backendMode === "firebase"
            ? purchaseFirestoreKitWithCredits(currentUserRef.current, kit)
            : purchaseKitWithCredits(currentUserRef.current, kit);
        }),
      hasUnlocked: (productId) =>
        snapshot.unlocks.some((unlock) => unlock.productId === productId),
      getUnlock: (productId) =>
        snapshot.unlocks.find((unlock) => unlock.productId === productId),
      createDownload: (productId) =>
        createDeliveryDownload(
          currentUserRef.current,
          snapshot.unlocks.find((unlock) => unlock.productId === productId),
          productId,
        ),
      markDownloadStatus: async (unlockId, status) => {
        if (!currentUserRef.current) {
          throw new Error("Sign in before updating delivery status.");
        }

        const userId = currentUserRef.current.uid;

        await wrapAction(async () => {
          if (RUNTIME_CONFIG.backendMode === "firebase") {
            await markFirestoreDownloadStatus(userId, unlockId, status);
            return;
          }

          if (status === "downloaded") {
            markKitDownloaded(unlockId);
          }
        });
      },
      refresh,
    }),
    [
      authStatus,
      isBusy,
      refresh,
      snapshot,
      syncAuthState,
      syncCommerceState,
      wrapAction,
    ],
  );

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
};

export const useAppSession = (): AppSessionContextValue => {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error("useAppSession must be used within an AppSessionProvider.");
  }

  return context;
};

export const useConciergeMode = () => ({
  hasLiveConcierge: RUNTIME_CONFIG.hasLiveConcierge,
});
