import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function FactCheckerView({ userState, setUserState, dict }) {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis delay
    setTimeout(() => {
      // Dummy logic to generate random-looking but deterministic results based on length
      const truthScore = Math.floor(Math.random() * 60) + 20; // 20 to 80
      
      setResult({
        score: truthScore,
        status: truthScore > 50 ? 'Plausible' : 'Misleading',
        icon: truthScore > 50 ? <CheckCircle className="success-icon" size={24} /> : <AlertTriangle className="error-icon" size={24} />,
        details: [
          "Cross-referenced with 14 major news outlets.",
          "Sentiment analysis detected highly sensationalist language.",
          "Core premise is partially true but lacks crucial context."
        ]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="page-content fact-checker">
      <h2 className="page-title">{dict?.factTitle || 'AI Fact Checker'}</h2>
      <p className="page-subtitle">{dict?.factSubtitle || 'Paste a headline or quote to analyze its validity and detect potential bias.'}</p>

      <div className="fact-check-input-wrapper">
        <textarea
          placeholder={dict?.factPlaceholder || "Paste quote or headline here..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
        />
        <button 
          className="analyze-btn" 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !query.trim()}
        >
          {isAnalyzing ? <span className="spinner"></span> : <><Search size={18} /> {dict?.analyzeBtn || 'Analyze'}</>}
        </button>
      </div>

      {result && (
        <div className="fact-check-result slide-up">
          <div className="result-header">
            <div className="score-ring">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className={`circle ${result.score > 50 ? 'success' : 'error'}`}
                  strokeDasharray={`${result.score}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{result.score}%</text>
              </svg>
            </div>
            <div className="result-summary">
              <h3>{result.status} {result.icon}</h3>
              <p>Truth Score Confidence</p>
            </div>
          </div>

          <div className="result-details">
            <h4><Info size={16}/> Analysis Breakdown</h4>
            <ul>
              {result.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
