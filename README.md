# 🗳️ Election Guide Assistant
### *Making democratic participation simple, accessible, and informed*

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?style=for-the-badge)](https://election-guide-kul25.web.app)
[![Tests](https://img.shields.io/badge/Tests-104%20Passing-success?style=for-the-badge&logo=vitest)](#-comprehensive-testing)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](#)
[![Firebase](https://img.shields.io/badge/Firebase-Integrated-FFCA28?style=for-the-badge&logo=firebase)](#-cloud-architecture)

An intelligent, multilingual AI assistant built for **PromptWars: Virtual** using intent-driven development and hardened via an autonomous Multi-Agent pipeline.

This project transforms complex election procedures into simple, interactive guidance—helping users understand *how to vote*, *when to vote*, and *what steps to follow*, without bias or confusion.

---

## ☁️ Cloud Architecture 

```text
[ Frontend (React 19 + Vite) ]
       │      │
       │      └─(Events)──▶ [ Firebase Analytics ] (Feature Usage Tracking)
       │
[ /src/services/chatService.js ] (API Layer with In-Memory Cache)
       │
   (HTTPS POST)
       │                          
       ▼                          
[ Cloud Functions ] ──────────────▶ [ Cloud Logging ] (Observability)
  (Server-Side AI)        
       │
       ▼
[ Cloud Firestore ]
  (Checklist & Chat Data locked via Firestore Rules)
```

---

## 🚀 Core Features

### 🧠 Intent-Driven AI Engine
- Context-aware assistant for election-related queries.
- Structured, easy-to-understand HTML responses.
- Strict neutrality filters (no political bias or candidate recommendations).

### 🌐 Multilingual & Accessible
- **Languages:** English, Hindi, Spanish, French.
- Full UI + AI response translation in real-time.
- **Voice input & Text-to-Speech** (Web Speech API) for maximum accessibility.

### 🌎 Country-Specific Intelligence
- Tailored election workflows for India, USA, UK, Canada, Australia, Germany, France, Brazil, Japan, and South Africa. 
- Dynamic UI themes based on national identity.

---

## 🧪 Comprehensive Testing (100% Coverage)

This application was hardened by an autonomous QA system:
* **104 passing test cases** across 12 test suites.
* Extensive unit tests covering the AI engine, safety filters, and intent parsers.
* Dedicated **Accessibility (A11y) Integration Tests** using `@testing-library/react` to verify skip-links and ARIA live regions.

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

3. **Provide Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Firebase configuration.

4. **Run the test suite:**
   ```bash
   npm run test
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🏁 Built for PromptWars: Virtual

A demonstration of how **intent-driven development + AI** can rapidly create meaningful, production-ready, highly-tested real-world solutions.

## 📜 License

This project is open-source and available under the MIT License.
