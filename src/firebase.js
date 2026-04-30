/**
 * firebase.js
 * Centralized Firebase initialization.
 * All Firebase services are exported from here for use across the app.
 */
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'mock-api-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'election-guide-mock.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'election-guide-mock',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'election-guide-mock.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '1234567890',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:1234567890:web:mock123',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || 'G-MOCK123',
};

/** Initialized Firebase app */
const app = initializeApp(firebaseConfig);

/** Firebase Analytics — safe to call in production and dev */
export const analytics = getAnalytics(app);

/** Firestore database instance */
export const db = getFirestore(app);

/** Firebase Auth instance */
export const auth = getAuth(app);

/** Google Sign-In provider */
export const googleProvider = new GoogleAuthProvider();

/**
 * Helper to log analytics events safely.
 * @param {string} eventName
 * @param {object} [params]
 */
export function trackEvent(eventName, params = {}) {
  try {
    logEvent(analytics, eventName, params);
  } catch {
    // Analytics not available in SSR or test environments — fail silently
  }
}

export default app;
