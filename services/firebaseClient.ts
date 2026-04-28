import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';
import { assertRuntimeConfiguration, RUNTIME_CONFIG } from './runtimeConfig';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseFirestore: Firestore | null = null;
let firebaseFunctions: Functions | null = null;

const createFirebaseApp = (): FirebaseApp => {
  assertRuntimeConfiguration();

  if (firebaseApp) {
    return firebaseApp;
  }

  if (getApps().length > 0) {
    firebaseApp = getApp();
    return firebaseApp;
  }

  firebaseApp = initializeApp({
    apiKey: RUNTIME_CONFIG.firebase.apiKey,
    authDomain: RUNTIME_CONFIG.firebase.authDomain,
    projectId: RUNTIME_CONFIG.firebase.projectId,
    storageBucket: RUNTIME_CONFIG.firebase.storageBucket,
    ...(RUNTIME_CONFIG.firebase.messagingSenderId && {
      messagingSenderId: RUNTIME_CONFIG.firebase.messagingSenderId,
    }),
    appId: RUNTIME_CONFIG.firebase.appId,
  });

  return firebaseApp;
};

export const getFirebaseAuthClient = (): Auth => {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  firebaseAuth = getAuth(createFirebaseApp());
  return firebaseAuth;
};

export const getFirebaseFirestoreClient = (): Firestore => {
  if (firebaseFirestore) {
    return firebaseFirestore;
  }

  firebaseFirestore = getFirestore(createFirebaseApp());
  return firebaseFirestore;
};

export const getFirebaseFunctionsClient = (): Functions => {
  if (firebaseFunctions) {
    return firebaseFunctions;
  }

  firebaseFunctions = getFunctions(createFirebaseApp());
  return firebaseFunctions;
};
