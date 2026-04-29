import React from 'react';
import { COUNTRIES, ELECTION_STAGES, DEFAULT_STAGES } from '../data/electionData';
import { Check, Clock, Circle } from 'lucide-react';

export default function TimelineView({ userState, setUserState, dict }) {
  const country = userState.country || 'IN';
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;

  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check size={14} />;
      case 'active':
        return <Clock size={14} />;
      default:
        return <Circle size={10} />;
    }
  };

  return (
    <div className="page-content timeline-view">
      <h1 className="page-title">📅 {dict?.timelineTitle || 'Election Timeline'}</h1>
      <p className="page-subtitle">{dict?.timelineSubtitle || 'Important dates and deadlines for the upcoming election cycle.'}</p>

      <div className="country-selector">
        <label>🌍 Select country:</label>
        <select
          className="country-select"
          value={country}
          onChange={(e) =>
            setUserState((prev) => ({ ...prev, country: e.target.value }))
          }
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-header">
          <span className="progress-label">Overall Election Progress</span>
          <span className="progress-value">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        {stages.map((stage, index) => (
          <div key={index} className="timeline-item">
            <div className={`timeline-dot ${stage.status}`}>
              {getStatusIcon(stage.status)}
            </div>
            <div className="timeline-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3>{stage.title}</h3>
                <span className={`badge ${stage.status === 'completed' ? 'success' : stage.status === 'active' ? 'info' : 'warning'}`}>
                  {stage.status === 'completed' ? '✓ Completed' : stage.status === 'active' ? '● In Progress' : '○ Upcoming'}
                </span>
              </div>
              <div className="timeline-period">{stage.period}</div>
              <p>{stage.description}</p>
              {stage.details && (
                <ul>
                  {stage.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
