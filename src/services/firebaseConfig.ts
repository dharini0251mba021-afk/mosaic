import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { BackendStatusInfo } from '../types';

// Safely read optional AI Studio config file if present in repository;
// Vercel and external deployments can rely solely on VITE_FIREBASE_* env vars.
const configModules = import.meta.glob<{ default?: Record<string, string> }>(
  '/firebase-applet-config.json',
  { eager: true }
);
const rawConfig: Record<string, string> =
  Object.values(configModules)[0]?.default || (Object.values(configModules)[0] as Record<string, string>) || {};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let isConfigured = false;
let configuredProjectId = '';
let configuredDatabaseId = '';

try {
  // Prioritize VITE_FIREBASE_* environment variables (for Vercel & .env.local),
  // falling back to firebase-applet-config.json when running in AI Studio.
  const env = (import.meta as any).env || {};
  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY || rawConfig?.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig?.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || rawConfig?.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig?.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig?.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || rawConfig?.appId,
    firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || rawConfig?.firestoreDatabaseId
  };

  if (config.apiKey && config.projectId && config.projectId !== 'remixed-project-id') {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    // CRITICAL: Must pass firestoreDatabaseId if configured for named Firestore DB
    db = config.firestoreDatabaseId
      ? getFirestore(app, config.firestoreDatabaseId)
      : getFirestore(app);
    storage = getStorage(app);

    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    isConfigured = true;
    configuredProjectId = config.projectId;
    configuredDatabaseId = config.firestoreDatabaseId || '(default)';

    // Validate Firestore connection on boot
    if (db) {
      getDocFromServer(doc(db, 'test', 'connection')).catch(error => {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firebase client is offline. Check network and Firebase configuration.');
        }
      });
    }
  }
} catch (e) {
  console.error('Firebase initialization error:', e);
}

export const getBackendStatus = (): BackendStatusInfo => {
  return {
    mode: isConfigured ? 'firebase' : 'local_emulated',
    isFirebaseConfigured: isConfigured,
    projectId: configuredProjectId,
    databaseId: configuredDatabaseId,
    authProvider: isConfigured ? 'firebase-google-auth' : 'local-secure-auth',
    databaseProvider: isConfigured ? 'cloud-firestore' : 'local-firestore-engine',
    storageProvider: isConfigured ? 'cloud-storage' : 'local-media-pipeline',
    message: isConfigured
      ? `Connected to Firebase Cloud Services (Project: ${configuredProjectId}). Google Sign-In & Cloud Firestore active.`
      : 'Firebase environment variables are not configured. Set VITE_FIREBASE_* keys to enable Google Sign-In and Cloud Firestore.'
  };
};

export { app, auth, db, storage, googleProvider, isConfigured };
