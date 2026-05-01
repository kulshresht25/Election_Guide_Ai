/**
 * cloudFunctionService.js
 *
 * Client-side wrapper for the Firebase Cloud Function `/processChat` endpoint.
 * Falls back to the local AI engine if the cloud function is unavailable,
 * ensuring the app always works — even without network or on the Spark plan.
 */

import { processMessage as localProcessMessage } from '../engine/aiEngine';

// ── Cloud Function URL ────────────────────────────────────────────────────────
// Replace this with your actual deployed URL after running `firebase deploy --only functions`
// Format: https://processchat-<hash>-uc.a.run.app
// Or for Firebase Functions v1: https://us-central1-election-guide-kul25.cloudfunctions.net/processChat
const CLOUD_FUNCTION_URL =
  import.meta.env.VITE_CLOUD_FUNCTION_URL ||
  'https://us-central1-election-guide-kul25.cloudfunctions.net/processChat';

// ── Request timeout (ms) ─────────────────────────────────────────────────────
const REQUEST_TIMEOUT_MS = 5000;

// ── In-Memory Cache ──────────────────────────────────────────────────────────
// Caches identical responses to avoid duplicate cloud function calls.
const responseCache = new Map();

/**
 * Generates a stable cache key based on the input payload.
 */
function getCacheKey(message, userState) {
  return `${message.trim().toLowerCase()}_${userState.country}_${userState.language}`;
}

/**
 * Calls the Cloud Function to process a chat message.
 * Falls back to the local AI engine on any error.
 *
 * @param {string} userMessage - Raw user input
 * @param {object} userState   - { country, language, userId, ... }
 * @returns {Promise<{ text: string, detectedCountry: string|null, source: 'cloud'|'local' }>}
 */
export async function processChat(userMessage, userState) {
  const cacheKey = getCacheKey(userMessage, userState);
  if (responseCache.has(cacheKey)) {
    return { ...responseCache.get(cacheKey), source: 'cache' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, userState }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Cloud Function responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response to save future API calls
    responseCache.set(cacheKey, data);
    
    return { ...data, source: 'cloud' };

  } catch (err) {
    // Silently fall back to local processing
    // This keeps the app working on Spark plan or when the function is cold
    const fallbackResult = localProcessMessage(userMessage, userState, []);
    return { ...fallbackResult, source: 'local' };
  }
}
