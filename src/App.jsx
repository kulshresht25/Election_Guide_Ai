import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Menu } from 'lucide-react';
import { auth } from './firebase';
import { signInAnonymously } from 'firebase/auth';

const Sidebar = lazy(() => import('./components/Sidebar'));
const ChatView = lazy(() => import('./components/ChatView'));
const TimelineView = lazy(() => import('./components/TimelineView'));
const FAQView = lazy(() => import('./components/FAQView'));
const CountrySelectionView = lazy(() => import('./components/CountrySelectionView'));
const DashboardView = lazy(() => import('./components/DashboardView'));
const VoterProfileView = lazy(() => import('./components/VoterProfileView'));
const FactCheckerView = lazy(() => import('./components/FactCheckerView'));
const SelfieBoothView = lazy(() => import('./components/SelfieBoothView'));
const MiniGameView = lazy(() => import('./components/MiniGameView'));
const ChecklistView = lazy(() => import('./components/ChecklistView'));
const DebateView = lazy(() => import('./components/DebateView'));

import { trackEvent } from './firebase';

const DICTIONARY = {
  'en-US': {
    chat: 'Chat Assistant',
    dashboard: 'Live Dashboard',
    profile: 'Voter Profile Builder',
    factchecker: 'AI Fact Checker',
    timeline: 'Election Timeline',
    faq: 'Frequently Asked Questions',
    checklist: 'Voter Checklist',
    selfie: 'AR Selfie Booth',
    minigame: 'Run for Office',
    debate: 'AI Debate Mode',
    // ChatView
    welcomeTitle: 'Election Guide Assistant',
    welcomeDesc: 'Your interactive AI guide to understanding elections. Ask me anything!',
    chatPlaceholder: 'Ask anything about elections...',
    // FactCheckerView
    factTitle: 'AI Fact Checker',
    factSubtitle: 'Paste a headline or quote to analyze its validity and detect potential bias.',
    factPlaceholder: 'Paste quote or headline here...',
    analyzeBtn: 'Analyze',
    // SelfieBoothView
    selfieTitle: 'AR Selfie Booth',
    selfieSubtitle: "Snap a picture with your digital 'I Voted' badge to share on social media.",
    retryBtn: 'Retry',
    retakeBtn: 'Retake',
    downloadBtn: 'Download',
    // MiniGameView
    gameTitle: 'Run for Office',
    gameSubtitle: 'Make tough decisions. Balance your Approval Rating and Campaign Funds to win.',
    playAgainBtn: 'Play Again',
    // DebateView
    debateTitle: 'AI vs. AI Debate',
    debateSubtitle: 'Enter a controversial topic and watch two AI candidates debate it in real-time.',
    debatePlaceholder: "Enter a debate topic (e.g., 'Universal Basic Income')",
    startDebateBtn: 'Start Debate',
    // Timeline, FAQ, Checklist
    timelineTitle: 'Election Timeline',
    timelineSubtitle: 'Important dates and deadlines for the upcoming election cycle.',
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Common questions and answers about the voting process.',
    checklistTitle: '✅ Voter Checklist',
    checklistSubtitle: 'Interactive checklist to prepare for voting day — track your progress!'
  },
  'es-ES': {
    chat: 'Asistente de Chat',
    dashboard: 'Panel en Vivo',
    profile: 'Perfil de Votante',
    factchecker: 'Verificador de IA',
    timeline: 'Cronología Electoral',
    faq: 'Preguntas Frecuentes',
    checklist: 'Lista de Votantes',
    selfie: 'Cabina de Selfies AR',
    minigame: 'Postularse',
    debate: 'Modo Debate IA',
    welcomeTitle: 'Asistente de Guía Electoral',
    welcomeDesc: 'Tu guía interactiva de IA. ¡Pregúntame cualquier cosa!',
    chatPlaceholder: 'Pregunta cualquier cosa sobre las elecciones...',
    factTitle: 'Verificador de IA',
    factSubtitle: 'Pega un titular para analizar su validez.',
    factPlaceholder: 'Pega la cita o el titular aquí...',
    analyzeBtn: 'Analizar',
    selfieTitle: 'Cabina de Selfies AR',
    selfieSubtitle: "Tómate una foto con tu insignia digital de 'Voté'.",
    retryBtn: 'Reintentar',
    retakeBtn: 'Volver a Tomar',
    downloadBtn: 'Descargar',
    gameTitle: 'Postularse',
    gameSubtitle: 'Toma decisiones difíciles para ganar.',
    playAgainBtn: 'Jugar de Nuevo',
    debateTitle: 'Debate de IA vs. IA',
    debateSubtitle: 'Ingresa un tema polémico y observa a la IA debatir.',
    debatePlaceholder: "Ingresa un tema de debate (ej., 'Renta Básica Universal')",
    startDebateBtn: 'Iniciar Debate',
    timelineTitle: 'Cronología Electoral',
    timelineSubtitle: 'Fechas y plazos importantes.',
    faqTitle: 'Preguntas Frecuentes',
    faqSubtitle: 'Preguntas y respuestas comunes.',
    checklistTitle: '✅ Lista de Votantes',
    checklistSubtitle: '¡Lista interactiva para prepararte para el día de la votación!'
  },
  'fr-FR': {
    chat: 'Assistant Chat',
    dashboard: 'Tableau de Bord',
    profile: 'Profil Électeur',
    factchecker: 'Vérificateur IA',
    timeline: 'Chronologie',
    faq: 'FAQ',
    checklist: 'Liste de Contrôle',
    selfie: 'Cabine Selfie AR',
    minigame: 'Se Présenter',
    debate: 'Débat IA',
    welcomeTitle: 'Assistant Guide Électoral',
    welcomeDesc: 'Votre guide interactif IA. Demandez-moi n\'importe quoi !',
    chatPlaceholder: 'Demandez n\'importe quoi sur les élections...',
    factTitle: 'Vérificateur IA',
    factSubtitle: 'Collez un titre pour analyser sa validité.',
    factPlaceholder: 'Collez la citation ou le titre ici...',
    analyzeBtn: 'Analyser',
    selfieTitle: 'Cabine Selfie AR',
    selfieSubtitle: "Prenez une photo avec votre badge numérique 'J'ai Voté'.",
    retryBtn: 'Réessayer',
    retakeBtn: 'Reprendre',
    downloadBtn: 'Télécharger',
    gameTitle: 'Se Présenter',
    gameSubtitle: 'Prenez des décisions difficiles pour gagner.',
    playAgainBtn: 'Rejouer',
    debateTitle: 'Débat IA vs. IA',
    debateSubtitle: 'Entrez un sujet controversé et regardez l\'IA débattre.',
    debatePlaceholder: "Entrez un sujet de débat (ex: 'Revenu Universel')",
    startDebateBtn: 'Démarrer le Débat',
    timelineTitle: 'Chronologie',
    timelineSubtitle: 'Dates et échéances importantes.',
    faqTitle: 'FAQ',
    faqSubtitle: 'Questions et réponses courantes.',
    checklistTitle: '✅ Liste de Contrôle',
    checklistSubtitle: 'Liste interactive pour vous préparer au jour du vote !'
  },
  'hi-IN': {
    chat: 'चैट सहायक',
    dashboard: 'लाइव डैशबोर्ड',
    profile: 'मतदाता प्रोफ़ाइल',
    factchecker: 'AI तथ्य जांच',
    timeline: 'चुनाव समयरेखा',
    faq: 'सामान्य प्रश्न',
    checklist: 'मतदाता सूची',
    selfie: 'AR सेल्फी बूथ',
    minigame: 'चुनाव लड़ें',
    debate: 'AI बहस मोड',
    welcomeTitle: 'चुनाव गाइड सहायक',
    welcomeDesc: 'आपका संवादात्मक AI गाइड। मुझसे कुछ भी पूछें!',
    chatPlaceholder: 'चुनावों के बारे में कुछ भी पूछें...',
    factTitle: 'AI तथ्य जांच',
    factSubtitle: 'इसकी वैधता का विश्लेषण करने के लिए शीर्षक पेस्ट करें।',
    factPlaceholder: 'उद्धरण या शीर्षक यहां पेस्ट करें...',
    analyzeBtn: 'विश्लेषण करें',
    selfieTitle: 'AR सेल्फी बूथ',
    selfieSubtitle: "अपने डिजिटल 'मैंने वोट किया' बैज के साथ तस्वीर लें।",
    retryBtn: 'पुनः प्रयास करें',
    retakeBtn: 'फिर से लें',
    downloadBtn: 'डाउनलोड करें',
    gameTitle: 'चुनाव लड़ें',
    gameSubtitle: 'जीतने के लिए कठिन निर्णय लें।',
    playAgainBtn: 'फिर से खेलें',
    debateTitle: 'AI बनाम AI बहस',
    debateSubtitle: 'विवादास्पद विषय दर्ज करें और AI को बहस करते देखें।',
    debatePlaceholder: "विवाद का विषय दर्ज करें",
    startDebateBtn: 'बहस शुरू करें',
    timelineTitle: 'चुनाव समयरेखा',
    timelineSubtitle: 'आगामी चुनाव के लिए महत्वपूर्ण तिथियां।',
    faqTitle: 'सामान्य प्रश्न',
    faqSubtitle: 'मतदान प्रक्रिया के बारे में सामान्य प्रश्न।',
    checklistTitle: '✅ मतदाता सूची',
    checklistSubtitle: 'मतदान के दिन की तैयारी के लिए सूची!'
  }
};

export default function App() {
  const [activePage, setActivePage] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('election-guide-theme');
    return saved ? saved === 'dark' : true;
  });
  const [userState, setUserState] = useState(() => {
    const saved = localStorage.getItem('election-guide-user');
    const parsed = saved
      ? JSON.parse(saved)
      : { country: null, language: 'en-US', isFirstTime: true };
    if (!parsed.userId) {
      parsed.userId = 'user_' + Math.random().toString(36).substring(2, 10);
    }
    return parsed;
  });
  const [showCountrySelection, setShowCountrySelection] = useState(!userState.country);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
    if (userState.country) {
       document.documentElement.setAttribute('data-country', userState.country);
    } else {
       document.documentElement.removeAttribute('data-country');
    }
    localStorage.setItem('election-guide-theme', darkMode ? 'dark' : 'light');
  }, [darkMode, userState.country]);

  useEffect(() => {
    localStorage.setItem('election-guide-user', JSON.stringify(userState));
  }, [userState]);

  // ── Analytics: track every page navigation ─────────────────────────────
  useEffect(() => {
    trackEvent('page_view', {
      page_name: activePage,
      country: userState.country || 'none',
      language: userState.language || 'en-US',
    });
  }, [activePage]);

  // ── Security: Anonymous Auth for Firestore ──────────────────────────────
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
  }, []);

  // ── Accessibility: Dynamic lang attribute ───────────────────────────────
  useEffect(() => {
    document.documentElement.lang = (userState.language || 'en-US').substring(0, 2);
  }, [userState.language]);

  const toggleDark = () => setDarkMode((d) => !d);

  const handleSelectCountry = (countryId) => {
    setUserState(prev => ({ ...prev, country: countryId }));
    setShowCountrySelection(false);
    // ── Analytics: track country selection ─────────────────────────────────
    trackEvent('country_selected', {
      country: countryId,
      language: userState.language || 'en-US',
    });
  };

  const renderPage = () => {
    const dict = DICTIONARY[userState.language || 'en-US'];
    switch (activePage) {
      case 'chat':
        return <ChatView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'dashboard':
        return <DashboardView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'profile':
        return <VoterProfileView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'factchecker':
        return <FactCheckerView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'timeline':
        return <TimelineView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'faq':
        return <FAQView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'checklist':
        return <ChecklistView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'selfie':
        return <SelfieBoothView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'minigame':
        return <MiniGameView userState={userState} setUserState={setUserState} dict={dict} />;
      case 'debate':
        return <DebateView userState={userState} setUserState={setUserState} dict={dict} />;
      default:
        return <ChatView userState={userState} setUserState={setUserState} dict={dict} />;
    }
  };

  if (showCountrySelection || !userState.country) {
    return (
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <CountrySelectionView 
          onSelectCountry={handleSelectCountry} 
          onCancel={userState.country ? () => setShowCountrySelection(false) : undefined}
        />
      </Suspense>
    );
  }

  return (
    <div className="app-layout">
      <Suspense fallback={null}>
        <Sidebar
          activePage={activePage}
          onPageChange={setActivePage}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          language={userState.language || 'en-US'}
          onLanguageChange={(lang) => setUserState(prev => ({...prev, language: lang}))}
          dictionary={DICTIONARY[userState.language || 'en-US']}
        />
      </Suspense>

      <main id="main-content" className="main-content">
        <header className="top-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <h2 className="header-title">{DICTIONARY[userState.language || 'en-US'][activePage]}</h2>
          <div className="header-actions">
            <span
              className="badge info interactive-badge"
              onClick={() => setShowCountrySelection(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowCountrySelection(true); }}
              title="Change Country"
              role="button"
              tabIndex={0}
              aria-label="Change Country"
            >
              {
                (() => {
                  const countries = {
                    IN: '🇮🇳 India',
                    US: '🇺🇸 USA',
                    UK: '🇬🇧 UK',
                    CA: '🇨🇦 Canada',
                    AU: '🇦🇺 Australia',
                    DE: '🇩🇪 Germany',
                    FR: '🇫🇷 France',
                    BR: '🇧🇷 Brazil',
                    JP: '🇯🇵 Japan',
                    ZA: '🇿🇦 S. Africa',
                  };
                  return countries[userState.country] || '🌍 Other';
                })()
              }
            </span>
          </div>
        </header>

        <Suspense fallback={<div className="loading-spinner" style={{padding: '2rem'}}>Loading...</div>}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}
