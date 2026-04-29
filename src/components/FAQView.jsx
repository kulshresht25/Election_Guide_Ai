import React, { useState } from 'react';
import { COUNTRIES, FAQ_DATA, DEFAULT_FAQ } from '../data/electionData';
import { Plus } from 'lucide-react';

export default function FAQView({ userState, setUserState, dict }) {
  const country = userState.country || 'IN';
  const faqs = FAQ_DATA[country] || DEFAULT_FAQ;
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-content">
      <h1 className="page-title">❓ {dict?.faqTitle || 'Frequently Asked Questions'}</h1>
      <p className="page-subtitle">
        {dict?.faqSubtitle || 'Common questions and answers about the voting process.'}
      </p>

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

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button className="faq-question" onClick={() => toggle(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">
                <Plus size={20} />
              </span>
            </button>
            {openIndex === index && (
              <div
                className="faq-answer"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
