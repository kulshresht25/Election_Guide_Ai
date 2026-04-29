# Election Guide Assistant 🗳️

**An interactive, multilingual AI assistant designed to educate and guide voters through the election process.**

## Features 🚀

- **Multilingual Support**: Supports English, Spanish, French, and Hindi. The entire UI changes automatically based on language selection, and AI responses are dynamically translated in real time.
- **Country Context**: Tailored content for 10 countries (India, USA, UK, Canada, Australia, Germany, France, Brazil, Japan, and South Africa). The app's theme (`accent gradients` and `glow effects`) dynamically adjusts based on the selected country's flag colors.
- **AI Chat Assistant**: Ask any election-related question. The AI understands context and provides structured, neutral, and educational responses. Uses Text-to-Speech (with country/language voices) to read out responses. Features Voice Input via Web Speech API.
- **Persistent Voter Checklist**: An interactive to-do list that saves your progress globally, categorized by country, so you don't lose your checked items when navigating the app.
- **Premium Dark/Light Mode**: Polished glassmorphism design with a fully functional custom animated toggle switch.
- **Interactive Globe**: 3D globe visualization to select your region.

## Technology Stack 💻

- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS with comprehensive CSS custom variables (Design Tokens) and Glassmorphism effects.
- **Icons**: `lucide-react`
- **APIs**: Google Translate API (for AI responses) and Web Speech API (Voice recognition/Synthesis)
- **Deployment**: Firebase Hosting
- **3D**: `react-globe.gl`

## Setup & Local Development 🛠️

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/election-guide.git
   cd election-guide
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Folder Structure 📁

- `/src/components`: React UI components (`ChatView`, `ChecklistView`, `Sidebar`, etc.)
- `/src/data`: Structured JSON-like data for FAQ, Timelines, Checklists, and Country details.
- `/src/engine`: Contains the `aiEngine.js` which houses the regex-based intent matching, safety filters, and dynamic AI response generators.
- `/src/App.jsx`: Main application hub, contains global state (`userState`) and the localization dictionary.
- `/src/index.css`: Comprehensive design system with country-specific theme tokens.

## Contribution & Safety 🛡️

This application is designed specifically as an **educational tool**. The AI Engine includes strict safety filters (`POLITICAL_PATTERNS` in `aiEngine.js`) to block any requests asking for political opinions, candidate recommendations, or biased information.

## License 📜
MIT License
