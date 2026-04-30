# 🗳️ Election Guide Assistant  
### *Making democratic participation simple, accessible, and informed*

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?style=for-the-badge)](https://election-guide-kul25.web.app)
[![Tests](https://img.shields.io/badge/Tests-100%25_Passing-success?style=for-the-badge&logo=vitest)](#-comprehensive-testing)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](#)
[![Firebase](https://img.shields.io/badge/Firebase-Integrated-FFCA28?style=for-the-badge&logo=firebase)](#-cloud-sync)
[![A11y](https://img.shields.io/badge/A11Y-Optimized-purple?style=for-the-badge)](#-accessibility-first)

An intelligent, multilingual AI assistant built for **PromptWars: Virtual** using intent-driven development and hardened via an autonomous Multi-Agent pipeline.

This project transforms complex election procedures into simple, interactive guidance—helping users understand *how to vote*, *when to vote*, and *what steps to follow*, without bias or confusion.

---

## 🌍 The Problem

Millions of eligible voters—especially first-time voters—struggle with:
- Understanding confusing registration and voting procedures.
- Language barriers that prevent access to vital information.
- Country-specific election rules that change frequently.
- Misinformation, deepfakes, and heavily biased sources.

---

## 💡 The Solution

The **Election Guide Assistant** provides a **neutral, structured, and interactive experience** that guides users through the election process step-by-step. Instead of searching through scattered sources, users can simply *ask*.

---

## 🚀 Core Features

### 🧠 AI-Powered Election Guidance
- Context-aware assistant for election-related queries.
- Structured, easy-to-understand HTML responses.
- Strict neutrality filters (no political bias or candidate recommendations).

### 🌐 Multilingual & Accessible
- **Languages:** English, Hindi, Spanish, French.
- Full UI + AI response translation in real-time.
- **Voice input & Text-to-Speech** (Web Speech API) for maximum accessibility.
- **Screen-Reader Ready:** ARIA labels and semantic HTML strictly enforced.

### 🌎 Country-Specific Intelligence
- Tailored election workflows for:
  - India, USA, UK, Canada, Australia  
  - Germany, France, Brazil, Japan, South Africa  
- Dynamic UI themes based on national identity.

### 📋 Persistent Voter Checklist (Firebase)
- Step-by-step election preparation tracker.
- **Cloud Sync:** Progress automatically saves to Firebase Firestore so you never lose your place.
- **Chat History:** Seamlessly backup your conversations to the cloud.

### 🌌 Interactive Globe Navigation
- Explore and select regions visually using `react-globe.gl`.
- Enhances engagement and usability.

### 🎨 Premium UI/UX
- Custom Glassmorphism design system built from scratch (Vanilla CSS).
- Dynamic Dark/Light mode with smooth micro-animations.
- Fully responsive and immersive layout.

---

## ⚙️ Tech Stack & Architecture

- **Frontend:** React.js (Vite)  
- **Styling:** CSS Design Tokens + Glassmorphism  
- **3D Visualization:** `react-globe.gl`  
- **AI Core:** Custom intent engine (`aiEngine.js`)  
- **Testing:** `vitest` + `@testing-library/react` (100% Coverage)
- **Backend & Deployment:** Firebase (Firestore, Hosting, Analytics)
- **APIs:** Google Translate API, Web Speech API

### 🧠 Intent-Driven Engine
Built using **intent-based parsing instead of traditional hardcoded flows**:
- Regex-based intent detection.
- Dynamic response generation.
- Context-aware interaction handling with memory.

---

## 🧪 Comprehensive Testing (100% Coverage)

This application was hardened by an autonomous Multi-Agent QA system, ensuring rock-solid stability:
* **97 passing test cases** across 10 test suites.
* Extensive unit tests covering the AI engine, safety filters, and intent parsers.
* Deep integration tests verifying the full UI-to-Engine chat cycle.
* Edge-case resilience handling corrupted localStorage and network failures.

---

## 🛡️ Ethical AI & Safety

To ensure responsible usage, the assistant is wrapped in a strict `safetyFilter`:
- Blocks political opinions and candidate recommendations.
- Prevents biased or persuasive responses.
- Focuses strictly on **education, dates, and process guidance**.

---

## 🛠️ Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kulshresht25/Election_Guide_Ai.git
   cd Election_Guide_Ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the test suite:**
   ```bash
   npm run test
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📁 Folder Structure

```
/src
 ├── /components   → Modular UI components (ChatView, ChecklistView, Sidebar, etc.)
 ├── /data         → Structured knowledge base (FAQ, timelines, checklists, countries)
 ├── /engine       → AI core (intent matching, safety filters, parsers)
 ├── firestoreService.js → Firebase database abstraction layer
 ├── firebase.js   → Firebase initialization
 ├── App.jsx       → Global state routing and localization
 └── index.css     → Global design tokens and animations
```

---

## 🌟 Why This Matters

Democracy works best when participation is informed and accessible.

This project bridges the gap between **complex government systems** and **everyday users**, making elections easier to understand—especially for first-time voters, multilingual populations, and users with limited access to reliable information.

---

## 🏁 Built for PromptWars: Virtual

A demonstration of how **intent-driven development + AI** can rapidly create meaningful, production-ready, highly-tested real-world solutions.

---

## 📜 License

This project is open-source and available under the MIT License.
