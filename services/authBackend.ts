import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import type { AuthBackend, AuthenticatedUser } from "../types";
import { getFirebaseAuthClient } from "./firebaseClient";
import { assertRuntimeConfiguration, RUNTIME_CONFIG } from "./runtimeConfig";

interface LocalUserRecord extends AuthenticatedUser {
  password: string;
}

interface LocalAuthState {
  users: LocalUserRecord[];
  sessionUid: string | null;
}

const LOCAL_AUTH_STORAGE_KEY = "luxuryui.local-auth.v1";
const LEGACY_SESSION_STORAGE_KEY = "luxuryui.session-store.v1";
const LOCAL_AUTH_CHANGE_EVENT = "luxuryui-local-auth-change";

const isBrowser = () => typeof window !== "undefined";

const now = () => new Date().toISOString();

const generateId = (prefix: string) => `${prefix}:${crypto.randomUUID()}`;

const readJson = (storageKey: string): unknown => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const readLegacyLocalAuthState = (): LocalAuthState => {
  const legacy = readJson(LEGACY_SESSION_STORAGE_KEY) as {
    users?: Array<{
      uid?: string;
      email?: string;
      displayName?: string;
      createdAt?: string;
      password?: string;
      provider?: string;
    }>;
    sessionUid?: string | null;
  } | null;

  return {
    users:
      legacy?.users
        ?.filter(
          (
            user,
          ): user is Required<NonNullable<typeof legacy>["users"]>[number] =>
            Boolean(
              user?.uid &&
              user?.email &&
              user?.displayName &&
              user?.password &&
              user?.createdAt,
            ),
        )
        .map((user) => ({
          uid: user.uid,
          email: user.email.toLowerCase(),
          displayName: user.displayName,
          createdAt: user.createdAt,
          password: user.password,
          provider: "local",
        })) ?? [],
    sessionUid: legacy?.sessionUid ?? null,
  };
};

const readLocalAuthState = (): LocalAuthState => {
  const persisted = readJson(
    LOCAL_AUTH_STORAGE_KEY,
  ) as Partial<LocalAuthState> | null;

  if (!persisted) {
    return readLegacyLocalAuthState();
  }

  return {
    users:
      persisted.users?.map((user) => ({
        ...user,
        provider: "local",
      })) ?? [],
    sessionUid: persisted.sessionUid ?? null,
  };
};

const writeLocalAuthState = (nextState: LocalAuthState): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    LOCAL_AUTH_STORAGE_KEY,
    JSON.stringify(nextState),
  );
  window.dispatchEvent(new Event(LOCAL_AUTH_CHANGE_EVENT));
};

const toLocalUser = (
  record: LocalUserRecord | null,
): AuthenticatedUser | null =>
  record
    ? {
        uid: record.uid,
        email: record.email,
        displayName: record.displayName,
        createdAt: record.createdAt,
        provider: "local",
      }
    : null;

const getLocalCurrentUser = (): AuthenticatedUser | null => {
  const state = readLocalAuthState();
  return toLocalUser(
    state.users.find((user) => user.uid === state.sessionUid) ?? null,
  );
};

const normalizeFirebaseUser = (user: FirebaseUser): AuthenticatedUser => {
  const provider = user.providerData.some(
    (entry) => entry.providerId === "google.com",
  )
    ? "firebase-google"
    : "firebase-password";

  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName:
      user.displayName?.trim() || user.email?.split("@")[0] || "LuxuryUI user",
    createdAt: user.metadata.creationTime
      ? new Date(user.metadata.creationTime).toISOString()
      : now(),
    provider,
  };
};

const normalizeFirebaseError = (error: unknown, fallback: string): Error => {
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return new Error("An account with this email already exists.");
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return new Error("Email or password is incorrect.");
    case "auth/invalid-email":
      return new Error("Enter a valid email address.");
    case "auth/weak-password":
      return new Error("Password should be at least 6 characters long.");
    case "auth/too-many-requests":
      return new Error(
        "Too many attempts. Please wait a moment and try again.",
      );
    case "auth/network-request-failed":
      return new Error("Network error. Check your connection and try again.");
    case "auth/popup-closed-by-user":
      return new Error("Google sign-in was cancelled before completion.");
    case "auth/popup-blocked":
      return new Error(
        "The sign-in popup was blocked. Allow popups and try again.",
      );
    case "auth/cancelled-popup-request":
      return new Error("Another sign-in popup is already open.");
    case "auth/operation-not-allowed":
      return new Error(
        "Google sign-in is not enabled in your Firebase project.",
      );
    default:
      return error instanceof Error ? error : new Error(fallback);
  }
};

let firebasePersistencePromise: Promise<void> | null = null;

const ensureFirebasePersistence = async (): Promise<void> => {
  assertRuntimeConfiguration();

  if (!firebasePersistencePromise) {
    const auth = getFirebaseAuthClient();
    firebasePersistencePromise = setPersistence(auth, browserLocalPersistence);
  }

  return firebasePersistencePromise;
};

const localAuthBackend: AuthBackend = {
  async signUp({ displayName, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const currentState = readLocalAuthState();

    if (
      currentState.users.some(
        (user) => user.email.toLowerCase() === normalizedEmail,
      )
    ) {
      throw new Error("An account with this email already exists.");
    }

    const nextUser: LocalUserRecord = {
      uid: generateId("user"),
      email: normalizedEmail,
      displayName: displayName.trim(),
      createdAt: now(),
      password,
      provider: "local",
    };

    writeLocalAuthState({
      users: [...currentState.users, nextUser],
      sessionUid: nextUser.uid,
    });

    return {
      uid: nextUser.uid,
      email: nextUser.email,
      displayName: nextUser.displayName,
      createdAt: nextUser.createdAt,
      provider: "local",
    };
  },
  async signIn({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const currentState = readLocalAuthState();
    const existingUser = currentState.users.find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (!existingUser || existingUser.password !== password) {
      throw new Error("Email or password is incorrect.");
    }

    writeLocalAuthState({
      ...currentState,
      sessionUid: existingUser.uid,
    });

    return {
      uid: existingUser.uid,
      email: existingUser.email,
      displayName: existingUser.displayName,
      createdAt: existingUser.createdAt,
      provider: "local",
    };
  },
  async signInWithGoogle() {
    throw new Error(
      "Google sign-in is only available when Firebase auth is enabled.",
    );
  },
  async signOut() {
    const currentState = readLocalAuthState();
    writeLocalAuthState({
      ...currentState,
      sessionUid: null,
    });
  },
  onAuthStateChanged(listener) {
    if (!isBrowser()) {
      listener(null);
      return () => undefined;
    }

    const wrapped = () => listener(getLocalCurrentUser());
    window.addEventListener(LOCAL_AUTH_CHANGE_EVENT, wrapped);
    window.addEventListener("storage", wrapped);

    return () => {
      window.removeEventListener(LOCAL_AUTH_CHANGE_EVENT, wrapped);
      window.removeEventListener("storage", wrapped);
    };
  },
  async getCurrentUser() {
    return getLocalCurrentUser();
  },
};

const firebaseAuthBackend: AuthBackend = {
  async signUp({ displayName, email, password }) {
    try {
      await ensureFirebasePersistence();
      const auth = getFirebaseAuthClient();
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const trimmedDisplayName = displayName.trim();

      if (trimmedDisplayName) {
        await updateProfile(credential.user, {
          displayName: trimmedDisplayName,
        });
      }

      const nextUser = normalizeFirebaseUser(credential.user);
      return {
        ...nextUser,
        displayName: trimmedDisplayName || nextUser.displayName,
      };
    } catch (error) {
      throw normalizeFirebaseError(error, "Could not create your account.");
    }
  },
  async signIn({ email, password }) {
    try {
      await ensureFirebasePersistence();
      const auth = getFirebaseAuthClient();
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      return normalizeFirebaseUser(credential.user);
    } catch (error) {
      throw normalizeFirebaseError(error, "Could not sign you in.");
    }
  },
  async signInWithGoogle() {
    try {
      await ensureFirebasePersistence();
      const auth = getFirebaseAuthClient();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      return normalizeFirebaseUser(credential.user);
    } catch (error) {
      throw normalizeFirebaseError(error, "Could not sign you in with Google.");
    }
  },
  async signOut() {
    try {
      await ensureFirebasePersistence();
      await firebaseSignOut(getFirebaseAuthClient());
    } catch (error) {
      throw normalizeFirebaseError(error, "Could not sign you out.");
    }
  },
  onAuthStateChanged(listener) {
    void ensureFirebasePersistence();
    return onAuthStateChanged(getFirebaseAuthClient(), (user) => {
      listener(user ? normalizeFirebaseUser(user) : null);
    });
  },
  async getCurrentUser() {
    await ensureFirebasePersistence();
    const user = getFirebaseAuthClient().currentUser;
    return user ? normalizeFirebaseUser(user) : null;
  },
};

export const getAuthBackend = (): AuthBackend => {
  if (RUNTIME_CONFIG.backendMode === "firebase") {
    assertRuntimeConfiguration();
    return firebaseAuthBackend;
  }

  return localAuthBackend;
};
