import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

const SCENARIOS = [
  {
    text: "A major news outlet just leaked your private text messages complaining about campaign food.",
    choices: [
      { text: "Apologize publicly and promise to do better.", approval: 5, funds: -10 },
      { text: "Call it 'Fake News' and double down.", approval: -10, funds: 20 }
    ]
  },
  {
    text: "Your opponent proposes a massive tax cut for the wealthy.",
    choices: [
      { text: "Attack the policy as favoring the elite.", approval: 15, funds: -15 },
      { text: "Agree, but propose cuts for the middle class too.", approval: 5, funds: 10 }
    ]
  },
  {
    text: "A grassroots movement is demanding immediate action on climate change.",
    choices: [
      { text: "Pledge billions in green energy funding.", approval: 20, funds: -30 },
      { text: "Acknowledge the issue but prioritize economic stability.", approval: -5, funds: 15 }
    ]
  },
  {
    text: "You are invited to a high-profile but highly partisan debate.",
    choices: [
      { text: "Attend and risk looking extreme.", approval: 10, funds: 25 },
      { text: "Decline and host a town hall with undecided voters.", approval: 15, funds: -5 }
    ]
  },
  {
    text: "It's the night before the election. How do you spend your remaining funds?",
    choices: [
      { text: "Massive TV ad blitz in swing states.", approval: 15, funds: -40 },
      { text: "Ground game: pay canvassers to knock on doors.", approval: 25, funds: -20 }
    ]
  }
];

export default function MiniGameView({ userState, setUserState, dict }) {
  const [step, setStep] = useState(0);
  const [approval, setApproval] = useState(50);
  const [funds, setFunds] = useState(50);
  const [gameOver, setGameOver] = useState(false);

  const handleChoice = (choice) => {
    setApproval(prev => Math.min(100, Math.max(0, prev + choice.approval)));
    setFunds(prev => Math.min(100, Math.max(0, prev + choice.funds)));

    if (step + 1 >= SCENARIOS.length) {
      setGameOver(true);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setApproval(50);
    setFunds(50);
    setGameOver(false);
  };

  return (
    <div className="page-content minigame-view">
      <h2 className="page-title">{dict?.gameTitle || 'Run for Office'}</h2>
      <p className="page-subtitle">{dict?.gameSubtitle || 'Make tough decisions. Balance your Approval Rating and Campaign Funds to win.'}</p>

      <div className="game-hud">
        <div className="hud-bar">
          <div className="hud-label"><Target size={16}/> Approval Rating: {approval}%</div>
          <div className="progress-bar-bg"><div className="progress-bar-fill success" style={{width: `${approval}%`}}></div></div>
        </div>
        <div className="hud-bar">
          <div className="hud-label"><TrendingUp size={16}/> Campaign Funds: ${funds}M</div>
          <div className="progress-bar-bg"><div className="progress-bar-fill info" style={{width: `${funds}%`}}></div></div>
        </div>
      </div>

      {!gameOver ? (
        <div className="game-scenario slide-up" key={step}>
          <div className="scenario-header">Scenario {step + 1} of {SCENARIOS.length}</div>
          <p className="scenario-text">{SCENARIOS[step].text}</p>
          <div className="scenario-choices">
            {SCENARIOS[step].choices.map((choice, i) => (
              <button key={i} className="game-choice-btn" onClick={() => handleChoice(choice)}>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="game-result slide-up">
          {approval >= 60 ? (
            <div className="win-screen">
              <CheckCircle size={64} className="success-icon" />
              <h3>You Won the Election!</h3>
              <p>With an approval rating of {approval}%, you secured a historic mandate.</p>
            </div>
          ) : (
            <div className="loss-screen">
              <AlertTriangle size={64} className="error-icon" />
              <h3>Campaign Failed</h3>
              <p>Your approval rating of {approval}% wasn't enough to secure the victory. Better luck next cycle!</p>
            </div>
          )}
          <button className="analyze-btn" onClick={restart} style={{marginTop: '24px'}}>
            <RefreshCcw size={18}/> {dict?.playAgainBtn || 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
}
