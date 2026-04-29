import React, { useState, useEffect, useRef } from 'react';
import { Swords, Send } from 'lucide-react';

const DEBATE_RESPONSES = {
  CandidateA: [
    "We must prioritize progressive reforms to address this.",
    "My opponent's approach will only worsen inequality.",
    "The data clearly shows that investing in our communities is the answer here.",
    "I believe in a future where we protect the vulnerable, not corporations."
  ],
  CandidateB: [
    "That is fiscally irresponsible and will raise taxes on the working class.",
    "We need a strong, market-driven approach to solve this issue.",
    "My opponent is out of touch with what everyday citizens actually need.",
    "Deregulation and individual liberty must be our guiding principles."
  ]
};

export default function DebateView({ userState, setUserState, dict }) {
  const [topic, setTopic] = useState('');
  const [isDebating, setIsDebating] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startDebate = () => {
    if (!topic.trim()) return;
    setIsDebating(true);
    setMessages([{ speaker: 'Moderator', text: `We will now begin the debate on: "${topic}". Candidate A, you have the floor.` }]);
    
    let turn = 0;
    
    const debateInterval = setInterval(() => {
      if (turn >= 6) {
        clearInterval(debateInterval);
        setMessages(prev => [...prev, { speaker: 'Moderator', text: 'Thank you both. That concludes this segment of the debate.' }]);
        setIsDebating(false);
        return;
      }
      
      const speaker = turn % 2 === 0 ? 'CandidateA' : 'CandidateB';
      const responsePool = DEBATE_RESPONSES[speaker];
      const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
      
      setMessages(prev => [...prev, { speaker, text: randomResponse }]);
      turn++;
    }, 3000);
  };

  return (
    <div className="page-content debate-view">
      <div className="debate-header">
        <Swords size={48} className="pulse-icon" style={{color: 'var(--accent-primary)', marginBottom: '16px'}} />
        <h2 className="page-title">{dict?.debateTitle || 'AI vs. AI Debate'}</h2>
        <p className="page-subtitle">{dict?.debateSubtitle || 'Enter a controversial topic and watch two AI candidates debate it in real-time.'}</p>
      </div>

      <div className="fact-check-input-wrapper">
        <input 
          type="text" 
          placeholder={dict?.debatePlaceholder || "Enter a debate topic (e.g., 'Universal Basic Income')"} 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isDebating}
          style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem' }}
        />
        <button className="analyze-btn" onClick={startDebate} disabled={isDebating || !topic.trim()}>
          {isDebating ? <span className="spinner"></span> : <><Send size={18} /> {dict?.startDebateBtn || 'Start Debate'}</>}
        </button>
      </div>

      {messages.length > 0 && (
        <div className="debate-arena slide-up">
          {messages.map((msg, idx) => (
            <div key={idx} className={`debate-msg ${msg.speaker}`}>
              <div className="debate-speaker">{msg.speaker === 'CandidateA' ? '🔵 Candidate Alpha' : msg.speaker === 'CandidateB' ? '🔴 Candidate Beta' : '🎙️ Moderator'}</div>
              <div className="debate-text">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
