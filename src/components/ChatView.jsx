import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Vote, Volume2 } from 'lucide-react';
import { processMessage } from '../engine/aiEngine';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const QUICK_ACTIONS = [
  {
    icon: '📋',
    title: 'Voter Registration',
    desc: 'How to register to vote',
    message: 'How do I register to vote?',
  },
  {
    icon: '🗳️',
    title: 'Voting Day Guide',
    desc: 'What to expect on voting day',
    message: 'What happens on voting day?',
  },
  {
    icon: '🎉',
    title: 'First-Time Voter',
    desc: 'New voter? Start here!',
    message: "I'm a first-time voter",
  },
  {
    icon: '📅',
    title: 'Election Timeline',
    desc: 'See the full election process',
    message: 'Explain the election process step by step',
  },
  {
    icon: '📄',
    title: 'Required Documents',
    desc: 'What IDs do you need?',
    message: 'What documents do I need to vote?',
  },
  {
    icon: '🌍',
    title: 'Choose Country',
    desc: 'Get country-specific info',
    message: 'I am from India',
  },
];

export default function ChatView({ userState, setUserState, dict }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const usedVoiceRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: messageText,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(async () => {
      const result = processMessage(messageText, userState, messages);

      if (result.detectedCountry) {
        setUserState((prev) => ({ ...prev, country: result.detectedCountry }));
      }

      let finalResponseText = result.text;
      
      // Translate if language is not English
      const targetLang = userState?.language?.split('-')[0] || 'en';
      if (targetLang !== 'en') {
        try {
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(result.text)}`);
          const data = await res.json();
          finalResponseText = data[0].map(item => item[0]).join('');
        } catch (err) {
          console.error("Translation failed", err);
        }
      }

      const assistantMsg = {
        id: messages.length + 2,
        role: 'assistant',
        text: finalResponseText,
        time: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
      
      if (usedVoiceRef.current) {
        speakMessage(finalResponseText);
        usedVoiceRef.current = false; // reset
      }
    }, 600 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      usedVoiceRef.current = false;
    }
  };

  // Voice input
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      usedVoiceRef.current = true;
      
      // Auto-send after a short delay so the user doesn't have to click send
      setTimeout(() => {
        handleSend(transcript);
        setInput('');
      }, 500);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // Text-to-speech for assistant messages
  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Strip HTML tags and emojis for speech
    const plainText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
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
    <div className="chat-container">
      {showWelcome ? (
        <div className="welcome-screen">
          <div className="welcome-icon">
            <Vote size={36} />
          </div>
          <h2>{dict?.welcomeTitle || 'Election Guide Assistant'}</h2>
          <p>
            {dict?.welcomeDesc || 'Your interactive AI guide to understanding elections. Ask me anything!'}
          </p>
          <div className="quick-actions">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                className="quick-action-btn"
                onClick={() => handleSend(action.message)}
              >
                <span className="qa-icon">{action.icon}</span>
                <span className="qa-title">{action.title}</span>
                <span className="qa-desc">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="messages-area">
          <div className="ai-avatar-container">
            <div className={`ai-avatar ${isSpeaking ? 'speaking' : ''}`}>
              <div className="avatar-head">
                <div className="avatar-eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="avatar-mouth"></div>
              </div>
            </div>
            <div className="avatar-label">
              AI News Anchor {isSpeaking && <span className="live-dot"></span>}
            </div>
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? '🗳️' : '👤'}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {msg.role === 'assistant' ? (
                    <div
                      className="rendered-html"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
                <div className="message-time">
                  {formatTime(msg.time)}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(msg.text)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        marginLeft: '8px',
                        padding: '2px',
                      }}
                      title="Read aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">🗳️</div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
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
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dict?.chatPlaceholder || "Ask anything about elections..."}
            rows={1}
          />
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoice}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
