/**
 * firestoreService.js
 * Higher-level service layer for all Firestore operations.
 * Abstracts raw Firestore calls so components stay clean.
 */
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Checklist ────────────────────────────────────────────────────────────────

/**
 * Persists the user's checklist progress for a given country.
 * @param {string} userId - Firebase auth UID
 * @param {string} country - ISO country code
 * @param {object} checklistState - Map of item IDs → boolean
 */
export async function saveChecklistProgress(userId, country, checklistState) {
  if (!userId) return;
  try {
    const ref = doc(db, 'users', userId, 'checklists', country);
    await setDoc(ref, { items: checklistState, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Failed to save checklist:', err);
  }
}

/**
 * Loads the user's checklist progress for a given country.
 * @param {string} userId
 * @param {string} country
 * @returns {object} Map of item IDs → boolean, or {} if not found
 */
export async function loadChecklistProgress(userId, country) {
  if (!userId) return {};
  try {
    const ref = doc(db, 'users', userId, 'checklists', country);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().items || {}) : {};
  } catch (err) {
    console.error('Failed to load checklist:', err);
    return {};
  }
}

// ─── Chat History ─────────────────────────────────────────────────────────────

/**
 * Saves a single chat message to Firestore.
 * @param {string} userId
 * @param {{ role: string, text: string, time: Date }} message
 */
export async function saveChatMessage(userId, message) {
  if (!userId) return;
  try {
    const col = collection(db, 'users', userId, 'chatHistory');
    await addDoc(col, {
      role: message.role,
      text: message.text,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to save chat message:', err);
  }
}

/**
 * Loads recent chat history for a user (max 50 messages).
 * @param {string} userId
 * @returns {array} Array of chat messages
 */
export async function loadChatHistory(userId) {
  if (!userId) return [];
  try {
    const col = collection(db, 'users', userId, 'chatHistory');
    const q = query(col, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse();
  } catch (err) {
    console.error('Failed to load chat history:', err);
    return [];
  }
}

// ─── User Profile ─────────────────────────────────────────────────────────────

/**
 * Saves or updates the user's profile document.
 * @param {string} userId
 * @param {{ country: string, language: string, isFirstTime: boolean }} profile
 */
export async function saveUserProfile(userId, profile) {
  if (!userId) return;
  try {
    const ref = doc(db, 'users', userId);
    await setDoc(ref, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}

/**
 * Loads the user's profile document.
 * @param {string} userId
 * @returns {object|null}
 */
export async function loadUserProfile(userId) {
  if (!userId) return null;
  try {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error('Failed to load user profile:', err);
    return null;
  }
}
