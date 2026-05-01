import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Vote, Volume2 } from 'lucide-react';
import { processChat } from '../services/chatService';
import { saveChatMessage, loadChatHistory } from '../services/firestoreService';
import { trackEvent } from '../firebase';
import { translateText, translateHTML } from '../engine/translator';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const QUICK_ACTIONS = [
  { id: 'reg', icon: '📋', title: 'Voter Registration', desc: 'How to register to vote', message: 'How do I register to vote?' },
  { id: 'voting', icon: '🗳️', title: 'Voting Day Guide', desc: 'What to expect on voting day', message: 'What happens on voting day?' },
  { id: 'first', icon: '🎉', title: 'First-Time Voter', desc: 'New voter? Start here!', message: "I'm a first-time voter" },
  { id: 'timeline', icon: '📅', title: 'Election Timeline', desc: 'See the full election process', message: 'Explain the election process step by step' },
  { id: 'docs', icon: '📄', title: 'Required Documents', desc: 'What IDs do you need?', message: 'What documents do I need to vote?' },
  { id: 'country', icon: '🌍', title: 'Choose Country', desc: 'Get country-specific info', message: 'I am from India' },
];

export default function ChatView({ userState, setUserState, dict }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('election-guide-messages');
      if (!saved) return [];
      const parsed = JSON.parse(saved).slice(-20);
      return parsed.map(m => ({ ...m, time: new Date(m.time) }));
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const usedVoiceRef = useRef(false);
  const [translatedQuickActions, setTranslatedQuickActions] = useState(QUICK_ACTIONS);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    try {
      localStorage.setItem('election-guide-messages', JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

  // Translate Quick Actions when language changes
  useEffect(() => {
    const translateActions = async () => {
      if (!userState.language || userState.language.startsWith('en')) {
        setTranslatedQuickActions(QUICK_ACTIONS);
        return;
      }

      const translated = await Promise.all(QUICK_ACTIONS.map(async (action) => ({
        ...action,
        title: await translateText(action.title, userState.language),
        desc: await translateText(action.desc, userState.language)
      })));
      setTranslatedQuickActions(translated);
    };
    translateActions();
  }, [userState.language]);

  // ── Restore chat history from Firestore on mount (cross-session/device) ──
  useEffect(() => {
    if (!userState?.userId) return;
    // Only restore if local storage has no messages
    const saved = localStorage.getItem('election-guide-messages');
    if (saved && JSON.parse(saved).length > 0) return;
    loadChatHistory(userState.userId).then((history) => {
      if (history && history.length > 0) {
        const restored = history.map((m) => ({
          id: m.id || Date.now() + Math.random(),
          role: m.role,
          text: m.text,
          time: m.timestamp?.toDate ? m.timestamp.toDate() : new Date(),
        }));
        setMessages(restored.slice(-20));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState?.userId]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg = { id: Date.now(), role: 'user', text: messageText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (userState?.userId) saveChatMessage(userState.userId, userMsg);

    // ── Analytics: track every chat message sent ──────────────────────────
    trackEvent('chat_message_sent', {
      country: userState?.country || 'unknown',
      language: userState?.language || 'en-US',
      message_length: messageText.length,
    });

    setIsTyping(true);

    try {
      // Translate User Input to English for the AI Engine if not already English
      let processingMessage = messageText;
      if (userState.language && !userState.language.startsWith('en')) {
        processingMessage = await translateText(messageText, 'en-US');
      }

      // ── Cloud Function call (falls back to local if unavailable) ────────
      const result = await processChat(processingMessage, userState);
      if (result.detectedCountry) setUserState((prev) => ({ ...prev, country: result.detectedCountry }));

      // Translate Response back to user's language if needed
      let finalResponseText = result.text;
      if (userState.language && !userState.language.startsWith('en')) {
        finalResponseText = await translateHTML(result.text, userState.language);
      }

      const assistantMsg = { id: Date.now(), role: 'assistant', text: finalResponseText, time: new Date() };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
      if (userState?.userId) saveChatMessage(userState.userId, assistantMsg);
      if (usedVoiceRef.current) { speakMessage(finalResponseText); usedVoiceRef.current = false; }
    } catch {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); usedVoiceRef.current = false; }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

    // ── Analytics: track voice input usage ───────────────────────────────
    trackEvent('voice_input_used', { country: userState?.country || 'unknown' });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = userState.language || 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      usedVoiceRef.current = true;
      setTimeout(() => { handleSend(transcript); setInput(''); }, 500);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const plainText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '')
      .replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = userState?.language || 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="chat-container" role="main">
      {/* Accessible live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant'
          ? `AI: ${messages[messages.length - 1].text.replace(/<[^>]*>/g, ' ')}`
          : ''}
      </div>

      {showWelcome ? (
        <section className="welcome-screen" aria-labelledby="welcome-heading">
          <div className="welcome-icon" aria-hidden="true"><Vote size={36} /></div>
          <h2 id="welcome-heading">{dict?.welcomeTitle || 'Election Guide Assistant'}</h2>
          <p>{dict?.welcomeDesc || 'Your interactive AI guide to understanding elections. Ask me anything!'}</p>
          <div className="quick-actions" role="group" aria-label="Quick topic shortcuts">
            {translatedQuickActions.map((action, i) => (
              <button
                key={action.id}
                className="quick-action-btn"
                onClick={() => {
                  // ── Analytics: track quick action clicks ────────────────
                  trackEvent('quick_action_clicked', {
                    action_title: action.title,
                    country: userState?.country || 'unknown',
                  });
                  // Call handleSend with the original untranslated message for accurate routing
                  handleSend(QUICK_ACTIONS[i].message);
                }}
                aria-label={`Ask: ${action.title} — ${action.desc}`}
              >
                <span className="qa-icon" aria-hidden="true">{action.icon}</span>
                <span className="qa-title">{action.title}</span>
                <span className="qa-desc">{action.desc}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="messages-area" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          <div className="ai-avatar-container" aria-hidden="true">
            <div className={`ai-avatar ${isSpeaking ? 'speaking' : ''}`}>
              <div className="avatar-head">
                <div className="avatar-eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="avatar-mouth"></div>
              </div>
            </div>
            <div className="avatar-label">AI News Anchor {isSpeaking && <span className="live-dot"></span>}</div>
          </div>

          {messages.map((msg) => (
            <article key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar" aria-hidden="true">
                {msg.role === 'assistant' ? '🗳️' : '👤'}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {msg.role === 'assistant' ? (
                    <div className="rendered-html" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : msg.text}
                </div>
                <div className="message-time">
                  <time dateTime={msg.time.toISOString()}>{formatTime(msg.time)}</time>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(msg.text)}
                      aria-label="Read this message aloud"
                      title="Read aloud"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '8px', padding: '2px' }}
                    >
                      <Volume2 size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {isTyping && (
            <div className="message assistant" role="status" aria-label="AI is typing a response">
              <div className="message-avatar" aria-hidden="true">🗳️</div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="typing-indicator" aria-hidden="true">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-area">
        <div className="input-wrapper">
          <label htmlFor="chat-textarea" className="sr-only">
            {dict?.chatPlaceholder || 'Ask anything about elections'}
          </label>
          <textarea
            id="chat-textarea"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dict?.chatPlaceholder || "Ask anything about elections..."}
            aria-label={dict?.chatPlaceholder || "Ask anything about elections"}
            rows={1}
          />
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoice}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            aria-pressed={isListening}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
          </button>
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            title="Send message"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" aria-live="assertive">
          {isTyping ? 'AI is generating a response, please wait...' : ''}
        </p>
      </div>
    </div>
  );
}
