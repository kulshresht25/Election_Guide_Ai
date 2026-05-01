# Priority Execution Plan

Here is the execution-ready implementation plan optimized for maximum hackathon scoring impact.

### Section 1: Priority Execution Plan

**Phase 1: Firebase & Cloud Initialization [HIGH IMPACT | < 1hr]**
1. Initialize Firebase in the project root: `npx firebase-tools init` (select Hosting, Functions, Firestore).
2. Create `src/firebase.js` to centralize initialization for Auth, Firestore, and Analytics.
3. Replace local `localStorage` syncing with a new `src/services/firestoreService.js`.

**Phase 2: Code Refactoring [HIGH IMPACT | 1hr]**
1. Break down the monolithic `aiEngine.js` into three modular files: `intentParser.js`, `responseGenerator.js`, and `safetyFilter.js`.
2. Create `src/services/chatService.js` to handle message formatting and sending.

**Phase 3: Cloud Functions Migration [HIGH IMPACT | 1hr]**
1. Move the modularized AI engine logic into the `functions/` directory.
2. Create an `https.onCall` endpoint in `functions/index.js` to process chat requests.
3. Update `chatService.js` to invoke the Cloud Function instead of processing locally.

**Phase 4: Analytics Integration [MEDIUM IMPACT | < 30m]**
1. Wrap key user actions (e.g., sending a chat, clicking a checklist item) with `logEvent` from Firebase Analytics.

---

### Section 2: Code & File Structure

**BEFORE:**
```text
/src
 ├── engine/aiEngine.js (Monolithic AI Logic)
 ├── components/ChatView.jsx (Local AI calls & localStorage)
 └── components/ChecklistView.jsx (localStorage)
```

**AFTER:**
```text
/functions
 └── index.js                 <-- Cloud Function entry
/src
 ├── firebase.js              <-- Firebase config & Analytics
 ├── services/
 │   ├── chatService.js       <-- Calls Cloud Function
 │   └── firestoreService.js  <-- Firestore CRUD operations
 ├── engine/
 │   ├── intentParser.js      <-- Regex intent logic
 │   ├── responseGenerator.js <-- Response formulation
 │   └── safetyFilter.js      <-- Ethical constraints
```

**Firebase Initialization (`src/firebase.js`)**
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

const app = initializeApp({ /* config */ });
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export const trackEvent = (event, params) => {
  try { logEvent(analytics, event, params); } catch (e) {}
};
```

**Firestore Persistence (`src/services/firestoreService.js`)**
```javascript
import { db } from '../firebase';
import { doc, setDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const saveChecklist = (userId, state) => setDoc(doc(db, 'users', userId), { state });
export const loadChecklist = async (userId) => (await getDoc(doc(db, 'users', userId))).data()?.state;

export const saveChat = (userId, msg) => addDoc(collection(db, 'users', userId, 'chats'), { ...msg, ts: new Date() });
export const loadChats = async (userId) => {
  const q = query(collection(db, 'users', userId, 'chats'), orderBy('ts', 'desc'), limit(10));
  return (await getDocs(q)).docs.map(d => d.data()).reverse();
};
```

**Cloud Function Endpoint (`functions/index.js`)**
```javascript
const functions = require('firebase-functions');
const { parseIntent } = require('./engine/intentParser');
const { generateResponse } = require('./engine/responseGenerator');

exports.processChat = functions.https.onCall((data) => {
  const { message, context } = data;
  const intent = parseIntent(message);
  return { text: generateResponse(intent, context) };
});
```

---

### Section 3: Architecture Diagram

```text
[ React Frontend (Vite) ]
       │      │
       │      └─(Events)──▶ [ Firebase Analytics ] (Feature Usage Tracking)
       │
   (HTTPS Call)               (Read/Write)
       │                          │
       ▼                          ▼
[ Cloud Functions ]       [ Cloud Firestore ]
  (Server-Side AI)        (Chat & Checklist Data)
       │
       └─▶ [ Cloud Logging ] (Observability)
```

---

### Section 4: Score Impact Justification

1. **Cloud Functions Integration**
   * **Justification:** Demonstrates mastery of serverless architecture and API security. Moving AI off the client prevents reverse engineering of proprietary prompt logic, satisfying the "Security & Architecture" criteria.
2. **Firestore Implementation**
   * **Justification:** Upgrades the app from a static tool to a personalized, cross-device application. Satisfies "User Experience" and "Scalability" criteria by proving the app can handle real-world database synchronization.
3. **Modular Code Refactoring**
   * **Justification:** Shows senior-level engineering practices. Splitting the monolith satisfies "Code Quality & Maintainability" criteria, proving the codebase is ready for team collaboration.
4. **Firebase Analytics & Logging**
   * **Justification:** Adds "Observability," a key differentiator in top-tier hackathon projects. Proves you are building a product intended to be measured, iterated upon, and maintained in production.
