import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, User, CheckCircle } from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: "The government should increase funding for renewable energy.", topic: "Environment" },
  { id: 2, text: "Healthcare should be free and accessible to all citizens.", topic: "Healthcare" },
  { id: 3, text: "Taxes should be lowered for corporations to stimulate growth.", topic: "Economy" },
  { id: 4, text: "Higher education should be heavily subsidized by the state.", topic: "Education" },
  { id: 5, text: "National security spending should be increased.", topic: "Defense" }
];

export default function VoterProfileView({ userState, setUserState, dict }) {
  const [cards, setCards] = useState(QUESTIONS);
  const [results, setResults] = useState([]);

  const handleSwipe = (direction, card) => {
    setResults(prev => [...prev, { ...card, agreed: direction === 'right' }]);
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const activeCard = cards[0];

  return (
    <div className="page-content profile-builder">
      <h2 className="page-title">{dict?.profile || 'Voter Profile Builder'}</h2>
      <p className="page-subtitle">Swipe right if you agree with the statement, left if you disagree. We'll build your profile!</p>

      {cards.length > 0 ? (
        <div className="swipe-container">
          <AnimatePresence>
            {activeCard && (
              <motion.div
                key={activeCard.id}
                className="swipe-card"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe > 100) {
                    handleSwipe('right', activeCard);
                  } else if (swipe < -100) {
                    handleSwipe('left', activeCard);
                  }
                }}
              >
                <div className="card-topic">{activeCard.topic}</div>
                <div className="card-text">{activeCard.text}</div>
                
                <div className="card-instructions">
                  <span className="swipe-left"><ThumbsDown size={16}/> Disagree</span>
                  <span className="swipe-right">Agree <ThumbsUp size={16}/></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="profile-results slide-up">
          <div className="profile-header">
            <User size={48} className="profile-icon" />
            <h3>Your Political Compass</h3>
            <p>Based on your swipes, here is your priority breakdown:</p>
          </div>
          
          <div className="profile-breakdown">
            {results.map((res, i) => (
              <div key={i} className="profile-item">
                <span className="topic-name">{res.topic}</span>
                <span className={`topic-stance ${res.agreed ? 'agree' : 'disagree'}`}>
                  {res.agreed ? <><ThumbsUp size={14}/> Support</> : <><ThumbsDown size={14}/> Oppose</>}
                </span>
              </div>
            ))}
          </div>

          <div className="profile-conclusion">
            <CheckCircle size={24} className="success-icon" />
            <p>You lean towards policies supporting <strong>{results.filter(r => r.agreed).map(r => r.topic).join(', ')}</strong>.</p>
          </div>
        </div>
      )}
    </div>
  );
}
