# 🗳️ Election Guide AI — Architecture & Implementation Plan

## Final Architecture (Deployed)

```text
[ React 19 Frontend (Vite 8) ]
       │      │
       │      └─(logEvent)──▶ [ Firebase Analytics ]
       │                         chat_message_sent
       │                         checklist_item_toggled
       │                         country_selected
       │                         voice_input_used
       │                         page_view
       │
[ /src/services/chatService.js ]
  (API Layer + In-Memory Map Cache)
       │
   (HTTPS POST)
       │
       ▼
[ Firebase Cloud Functions ]  ──▶ [ Cloud Logging ]
  /functions/index.js                (Structured JSON logs)
  ├── engine/intentParser.js
  ├── engine/safetyFilter.js
  └── data/electionData.js
       │
       ▼
[ Cloud Firestore ]
  /users/{uid}/chats      (Chat persistence)
  /users/{uid}/checklist   (Progress sync)
  🔒 Locked via firestore.rules (auth.uid == userId)

[ Firebase Hosting ]
  ├── CSP Headers
  ├── X-Frame-Options: DENY
  └── X-Content-Type-Options: nosniff
```

---

## Security Hardening

| Layer | Implementation |
|---|---|
| **Auth** | `signInAnonymously()` on mount — every user gets verified `uid` |
| **Firestore Rules** | `request.auth.uid == userId` — no cross-user access |
| **Headers** | CSP, X-Frame-Options, X-Content-Type via `firebase.json` |
| **Secrets** | `defineSecret('AI_API_KEY')` in Cloud Function via Secret Manager |
| **Env Vars** | Firebase config in `import.meta.env.VITE_*` with `.env.example` |

## Accessibility Compliance

| Feature | Implementation |
|---|---|
| **Skip Link** | `<a class="skip-to-content">` as first focusable element in `index.html` |
| **Lang Tag** | `document.documentElement.lang` updates dynamically on language change |
| **Focus Rings** | `*:focus-visible` with accent-colored outline globally |
| **ARIA** | `aria-label`, `aria-live="polite"`, `role="log"`, `role="checkbox"` throughout |
| **Keyboard Nav** | `tabIndex={0}`, `onKeyDown` handlers on all custom interactive elements |

## Efficiency Optimizations

| Technique | Impact |
|---|---|
| **React.lazy + Suspense** | 12 views code-split into separate chunks |
| **vite-plugin-compression** | All assets served with gzip |
| **In-Memory Cache** | `Map` keyed by `message_country_language` deduplicates API calls |

## Code Quality

| Practice | Detail |
|---|---|
| **ESLint** | `.eslintrc.cjs` with `react`, `react-hooks`, `jsx-a11y` plugins |
| **Service Layer** | `chatService.js`, `firestoreService.js` — no API/DB calls in components |
| **Engine Modules** | `intentParser.js`, `responseGenerator.js`, `safetyFilter.js` |
| **Package** | Named `election-guide-ai` v1.0.0 |

## Testing

- **104 tests** across **12 suites** — 100% pass rate
- Dedicated `a11y.test.jsx` for accessibility assertions
- Unit + Integration + Edge-case coverage
