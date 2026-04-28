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
import {
  ensureFirestoreUserProfile,
  ensureFirestoreUserRole,
  getFirestoreAdminStatus,
} from "../services/firestoreAdminStore";
import { isFirestorePermissionDeniedError, isFirestoreUnauthenticatedError } from "../services/firebaseErrorUtils";
import { getRuntimeWarnings, RUNTIME_CONFIG } from "../services/runtimeConfig";
import {
  createSafepayPaymentSession,
  storePendingCheckout,
  type SafepayCustomer,
} from "../services/safepayService";
import { getCreditQuote } from "../data/figmaKits";
import type {
  AdminStatus,
  AppSessionState,
  AuthStatus,
  CreditTopUp,
  CreditTransaction,
  FigmaKitProduct,
  KitOrder,
  KitUnlock,
  UserProfile,
} from "../types";

export interface SafepayCheckoutParams {
  credits: number;
  currency: "EUR" | "GBP";
  customer: SafepayCustomer;
}

interface AppSessionContextValue extends AppSessionState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminStatus: AdminStatus;
  isBusy: boolean;
  warnings: string[];
  backendMode: "local" | "firebase";
  paymentMode: "local" | "stripe" | "safepay";
  signUp: (input: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  topUpCredits: (credits: number) => Promise<CreditTopUp>;
  initiateCheckout: (params: SafepayCheckoutParams) => Promise<void>;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("loading");
  const [sessionWarnings, setSessionWarnings] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const currentUserRef = useRef<UserProfile | null>(null);
  const unsubscribeCommerceRef = useRef<(() => void) | null>(null);

  const noteSessionWarning = useCallback((message: string) => {
    setSessionWarnings((currentWarnings) =>
      currentWarnings.includes(message)
        ? currentWarnings
        : [...currentWarnings, message],
    );
  }, []);

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
    try {
      await ensureFirestoreWalletForUser(user);
    } catch (error) {
      if (
        isFirestoreUnauthenticatedError(error) ||
        isFirestorePermissionDeniedError(error)
      ) {
        noteSessionWarning(
          "Wallet sync requires authentication. Sign out and sign back in if this persists.",
        );
        return;
      }
      console.warn("Unable to initialize Firestore wallet.", error);
      return;
    }

    const syncResults = await Promise.allSettled([
      ensureFirestoreUserProfile(user),
      ensureFirestoreUserRole(user),
    ]);

    syncResults.forEach((result) => {
      if (result.status !== "rejected") {
        return;
      }

      if (
        isFirestorePermissionDeniedError(result.reason) ||
        isFirestoreUnauthenticatedError(result.reason)
      ) {
        noteSessionWarning(
          "Backoffice sync is unavailable until the latest Firestore rules are deployed. Buyer auth and wallet flows still work.",
        );
        return;
      }

      console.warn("Unable to sync Firebase backoffice records.", result.reason);
    });

    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      authStatus: "authenticated",
      user,
      ...emptyCommerceState,
    }));

    const handleSubscriptionError = (error: Error) => {
      if (
        isFirestoreUnauthenticatedError(error) ||
        isFirestorePermissionDeniedError(error)
      ) {
        noteSessionWarning(
          "Live wallet sync lost connection. Refresh the page to reconnect.",
        );
      } else {
        console.warn("Firestore subscription error.", error);
      }
    };

    const unsubscribeWallet = subscribeToFirestoreWallet(
      user.uid,
      (wallet) => {
        setSnapshot((currentSnapshot) => ({
          ...currentSnapshot,
          authStatus: "authenticated",
          user,
          wallet,
        }));
      },
      handleSubscriptionError,
    );

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
      handleSubscriptionError,
    );

    const unsubscribeTopUps = subscribeToFirestoreTopUps(
      user.uid,
      (topUps) => {
        setSnapshot((currentSnapshot) => ({
          ...currentSnapshot,
          authStatus: "authenticated",
          user,
          topUps,
        }));
      },
      handleSubscriptionError,
    );

    const unsubscribeOrders = subscribeToFirestoreOrders(
      user.uid,
      (orders) => {
        setSnapshot((currentSnapshot) => ({
          ...currentSnapshot,
          authStatus: "authenticated",
          user,
          orders,
        }));
      },
      handleSubscriptionError,
    );

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
      handleSubscriptionError,
    );

    unsubscribeCommerceRef.current = () => {
      unsubscribeWallet();
      unsubscribeTransactions();
      unsubscribeTopUps();
      unsubscribeOrders();
      unsubscribeUnlocks();
    };
  }, [noteSessionWarning]);

  const syncAdminState = useCallback(async (user: UserProfile | null) => {
    if (!user || RUNTIME_CONFIG.backendMode === "local") {
      setIsAdmin(false);
      setAdminStatus("ready");
      return;
    }

    setAdminStatus("loading");

    try {
      const nextIsAdmin = await getFirestoreAdminStatus(user.uid);

      if (currentUserRef.current?.uid !== user.uid) {
        return;
      }

      setIsAdmin(nextIsAdmin);
    } catch {
      if (currentUserRef.current?.uid !== user.uid) {
        return;
      }

      setIsAdmin(false);
      noteSessionWarning(
        "Admin access checks are blocked until the latest Firestore rules are deployed.",
      );
    } finally {
      if (currentUserRef.current?.uid === user.uid) {
        setAdminStatus("ready");
      }
    }
  }, [noteSessionWarning]);

  const syncCommerceState = useCallback(
    async (user: UserProfile | null) => {
      stopCommerceSubscriptions();

      if (!user) {
        setSnapshot({
          authStatus: "anonymous",
          user: null,
          ...emptyCommerceState,
        });
        setIsAdmin(false);
        setAdminStatus("ready");
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
      try {
        const currentUser = await authBackend.getCurrentUser();

        if (!isMounted) {
          return;
        }

        syncAuthState(currentUser);
        await Promise.all([
          syncCommerceState(currentUser),
          syncAdminState(currentUser),
        ]);
      } catch (error) {
        console.warn("Unable to hydrate app session state.", error);
      }
    };

    void hydrate();

    const unsubscribeAuth = authBackend.onAuthStateChanged((user) => {
      if (!isMounted) {
        return;
      }

      syncAuthState(user);
      void Promise.all([syncCommerceState(user), syncAdminState(user)]).catch(
        (error) => {
          console.warn("Unable to synchronize auth session state.", error);
        },
      );
    });

    return () => {
      isMounted = false;
      stopCommerceSubscriptions();
      unsubscribeAuth();
    };
  }, [stopCommerceSubscriptions, syncAdminState, syncAuthState, syncCommerceState]);

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
      isAdmin,
      adminStatus,
      isBusy,
      warnings: [...getRuntimeWarnings(), ...sessionWarnings],
      backendMode: RUNTIME_CONFIG.backendMode,
      paymentMode: RUNTIME_CONFIG.paymentMode,
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

          if (RUNTIME_CONFIG.paymentMode !== "local") {
            return Promise.reject(
              new Error(
                "Direct top-ups are disabled. Please complete a checkout to add credits.",
              ),
            );
          }

          return RUNTIME_CONFIG.backendMode === "firebase"
            ? topUpFirestoreWalletCredits(currentUserRef.current, credits)
            : topUpWalletCredits(currentUserRef.current, credits);
        }),
      initiateCheckout: async (params) => {
        const user = currentUserRef.current;
        if (!user) {
          throw new Error("Sign in before topping up credits.");
        }

        const quote = getCreditQuote(params.credits);
        const result = await createSafepayPaymentSession({
          credits: params.credits,
          currency: params.currency,
          customer: {
            ...params.customer,
            email: params.customer.email || user.email,
          },
        });

        storePendingCheckout({
          invoice: result.invoice,
          credits: params.credits,
          eurAmount: quote.eurTotal,
          gbpAmount: quote.gbpTotal,
        });

        window.location.href = result.checkoutUrl;
      },
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
      adminStatus,
      isAdmin,
      isBusy,
      refresh,
      snapshot,
      sessionWarnings,
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
