import React, { useState, useEffect } from 'react';
import {
  COUNTRIES,
  FIRST_TIME_CHECKLIST,
  DEFAULT_CHECKLIST,
} from '../data/electionData';
import { Check, FileText, ListChecks, Lightbulb } from 'lucide-react';
import { saveChecklistProgress, loadChecklistProgress } from '../firestoreService';
import { translateText } from '../engine/translator';

export default function ChecklistView({ userState, setUserState, dict }) {
  const country = userState.country || 'IN';
  const originalChecklist = FIRST_TIME_CHECKLIST[country] || DEFAULT_CHECKLIST;
  const [checklist, setChecklist] = useState(originalChecklist);
  const [isTranslating, setIsTranslating] = useState(false);

  const isFirstTime = userState.isFirstTime ?? true;
  const checkedItems = userState.checklistState?.[country] || {};

  useEffect(() => {
    const translateChecklist = async () => {
      if (!userState.language || userState.language.startsWith('en')) {
        setChecklist(originalChecklist);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = {
          documents: await Promise.all(originalChecklist.documents.map(async (doc) => ({
            ...doc,
            label: await translateText(doc.label, userState.language),
            sublabel: await translateText(doc.sublabel, userState.language)
          }))),
          steps: await Promise.all(originalChecklist.steps.map(async (step) => ({
            ...step,
            label: await translateText(step.label, userState.language),
            sublabel: await translateText(step.sublabel, userState.language)
          }))),
          tips: originalChecklist.tips ? await Promise.all(originalChecklist.tips.map(tip => translateText(tip, userState.language))) : []
        };
        setChecklist(translated);
      } catch (error) {
        console.error("Failed to translate checklist", error);
        setChecklist(originalChecklist);
      } finally {
        setIsTranslating(false);
      }
    };

    translateChecklist();
  }, [userState.language, country]);

  const toggleCheck = (id) => {
    const newState = { ...checkedItems, [id]: !checkedItems[id] };
    setUserState(prev => ({
      ...prev,
      checklistState: {
        ...(prev.checklistState || {}),
        [country]: newState
      }
    }));

    if (userState.userId) {
      saveChecklistProgress(userState.userId, country, newState);
    }
  };

  useEffect(() => {
    if (userState.userId && Object.keys(checkedItems).length === 0) {
      loadChecklistProgress(userState.userId, country).then(dbState => {
        if (dbState && Object.keys(dbState).length > 0) {
          setUserState(prev => ({
            ...prev,
            checklistState: {
              ...(prev.checklistState || {}),
              [country]: dbState
            }
          }));
        }
      });
    }
  }, [userState.userId, country]);

  const allItems = [...checklist.documents, ...checklist.steps];
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = allItems.length;
  const progress = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="page-content">
      <h1 className="page-title">{dict?.checklistTitle || '✅ Voter Checklist'}</h1>
      <p className="page-subtitle">
        {dict?.checklistSubtitle || 'Interactive checklist to prepare for voting day — track your progress!'}
      </p>

      <div className="checklist-header">
        <div className="country-selector" style={{ marginBottom: 0 }}>
          <label>🌍 Country:</label>
          <select
            className="country-select"
            value={country}
            aria-label="Select your country"
            onChange={(e) => {
              setUserState((prev) => ({ ...prev, country: e.target.value }));
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="voter-type-toggle">
          <button
            className={`voter-type-btn ${isFirstTime ? 'active' : ''}`}
            onClick={() => {
              setUserState((prev) => ({ ...prev, isFirstTime: true }));
            }}
          >
            🎉 First-Time Voter
          </button>
          <button
            className={`voter-type-btn ${!isFirstTime ? 'active' : ''}`}
            onClick={() => {
              setUserState((prev) => ({ ...prev, isFirstTime: false }));
            }}
          >
            🗳️ Returning Voter
          </button>
        </div>
      </div>

      {isTranslating ? (
        <div className="loading-spinner">Translating...</div>
      ) : (
        <>
          {/* Progress */}
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-label">Your Progress</span>
              <span className="progress-value">
                {checkedCount}/{totalCount} completed ({progress}%)
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Documents section */}
          <div className="checklist-section">
            <div className="checklist-section-title">
              <FileText size={16} /> Required Documents
            </div>
          <div className="checklist-items" role="group" aria-label="Required documents checklist">
              {checklist.documents.map((item) => (
                <div
                  key={item.id}
                  className={`checklist-item ${checkedItems[item.id] ? 'checked' : ''}`}
                  onClick={() => toggleCheck(item.id)}
                  role="checkbox"
                  aria-checked={!!checkedItems[item.id]}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCheck(item.id); } }}
                  aria-label={`${item.label}: ${item.sublabel}`}
                >
                  <div className="check-box" aria-hidden="true">
                    {checkedItems[item.id] && <Check size={14} />}
                  </div>
                  <span className="check-label">{item.label}</span>
                  <span className="check-sublabel">{item.sublabel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps section */}
          <div className="checklist-section">
            <div className="checklist-section-title">
              <ListChecks size={16} /> Steps to Follow
            </div>
            <div className="checklist-items" role="group" aria-label="Steps to follow checklist">
              {checklist.steps.map((item, index) => (
                <div
                  key={item.id}
                  className={`checklist-item ${checkedItems[item.id] ? 'checked' : ''}`}
                  onClick={() => toggleCheck(item.id)}
                  role="checkbox"
                  aria-checked={!!checkedItems[item.id]}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCheck(item.id); } }}
                  aria-label={`Step ${index + 1}: ${item.label}`}
                >
                  <div className="check-box" aria-hidden="true">
                    {checkedItems[item.id] ? (
                      <Check size={14} />
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span className="check-label">{item.label}</span>
                  <span className="check-sublabel">{item.sublabel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips section */}
          {isFirstTime && checklist.tips && (
            <div className="checklist-section">
              <div className="checklist-section-title">
                <Lightbulb size={16} /> Tips for First-Time Voters
              </div>
              <div className="info-cards-grid">
                {checklist.tips.map((tip, i) => (
                  <div key={i} className="info-card">
                    <div className="info-card-body">💡 {tip}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {progress === 100 && (
            <div
              className="info-card"
              style={{
                marginTop: '24px',
                textAlign: 'center',
                borderColor: 'var(--success)',
              }}
            >
              <div className="info-card-title" style={{ justifyContent: 'center', color: 'var(--success)' }}>
                🎊 You're all set to vote!
              </div>
              <div className="info-card-body">
                You've completed all the steps. You're ready for voting day! Remember, your vote is your voice in democracy. 🗳️
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
