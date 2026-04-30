/**
 * intentParser.js
 * Parses raw user messages into structured intent objects.
 * Provides country detection and user context extraction.
 */

// ─── Country Detection ────────────────────────────────────────────────────────

/**
 * Detects which country the user is referencing in their message.
 */
export function detectCountry(text) {
  const lower = text.toLowerCase();
  if (/\bindia\b|\bhindi\b|\bbharat\b/i.test(lower)) return 'IN';
  if (/\busa?\b|\bunited states\b|\bamerica\b/i.test(lower)) return 'US';
  if (/\buk\b|\bunited kingdom\b|\bbritain\b|\bengland\b/i.test(lower)) return 'UK';
  if (/\bcanada\b|\bcanadian\b/i.test(lower)) return 'CA';
  if (/\baustralia\b|\baussie\b/i.test(lower)) return 'AU';
  if (/\bgermany\b|\bgerman\b/i.test(lower)) return 'DE';
  if (/\bfrance\b|\bfrench\b/i.test(lower)) return 'FR';
  if (/\bbrazil\b|\bbrazilian\b/i.test(lower)) return 'BR';
  if (/\bjapan\b|\bjapanese\b/i.test(lower)) return 'JP';
  if (/\bsouth africa\b/i.test(lower)) return 'ZA';
  return null;
}

// ─── Context Extraction ───────────────────────────────────────────────────────

export function extractUserContext(msg) {
  const lower = msg.toLowerCase();
  return {
    isQuestion:       /\?|how|what|when|where|why|can i|do i|is it/.test(lower),
    isCasual:         /hey|hi|yo|sup|thanks|thx|cool|okay|pls|plz/.test(lower),
    mentionsOnline:   /online|website|internet|app|digital/.test(lower),
    mentionsDeadline: /deadline|last date|time limit|when.*register/.test(lower),
    mentionsAge:      /age|how old|18|year/.test(lower),
    mentionsFee:      /fee|cost|free|money|pay/.test(lower),
  };
}

// ─── Intent Matching ──────────────────────────────────────────────────────────

export const TOPIC_PATTERNS = [
  {
    key: 'registration',
    patterns: [
      /register/i,
      /registration/i,
      /enroll/i,
      /sign up/i,
    ],
  },
  {
    key: 'documents',
    patterns: [
      /documents?/i,
      /id\b/i,
      /identification/i,
      /papers?/i,
      /proof/i,
    ],
  },
  {
    key: 'votingDay',
    patterns: [
      /voting/i,
      /vote/i,
      /poll/i,
      /ballot/i,
      /how (?:do i |to |can i |does one )?vot/i,
    ],
  },
  {
    key: 'firstTime',
    patterns: [
      /first.?time/i,
      /new voter/i,
      /never voted/i,
    ],
  },
  {
    key: 'process',
    patterns: [
      /process/i,
      /system/i,
      /stages?/i,
      /steps?/i,
      /phases?/i,
      /how (?:do |does )?election/i,
    ],
  },
  {
    key: 'timeline',
    patterns: [
      /timeline/i,
      /schedule/i,
      /dates?/i,
      /calendar/i,
    ],
  },
  {
    key: 'evm',
    patterns: [
      /evm/i,
      /electronic voting machine/i,
      /voting machine/i,
    ],
  },
  {
    key: 'nota',
    patterns: [
      /nota/i,
      /none of the above/i,
    ],
  },
  {
    key: 'mcc',
    patterns: [
      /model code/i,
      /code of conduct/i,
      /mcc\b/i,
    ],
  },
  {
    key: 'postal',
    patterns: [
      /postal/i,
      /absentee/i,
      /mail/i,
    ],
  },
  {
    key: 'electoralCollege',
    patterns: [/electoral college/i],
  },
  {
    key: 'primaries',
    patterns: [
      /primar(?:y|ies)/i,
      /caucus/i,
    ],
  },
  {
    key: 'rights',
    patterns: [
      /rights?/i,
      /can i/i,
      /allowed/i,
      /eligible/i,
      /eligibility/i,
    ],
  },
  {
    key: 'counting',
    patterns: [
      /count/i,
      /results?/i,
      /winner/i,
      /who won/i,
    ],
  },
  {
    key: 'greeting',
    patterns: [/hi\b/i, /hello/i, /hey/i, /good (?:morning|evening|afternoon)/i, /greetings/i],
  },
  {
    key: 'thanks',
    patterns: [/thank/i, /thx/i],
  },
  {
    key: 'help',
    patterns: [
      /help/i,
      /what can you/i,
      /what do you/i,
      /who are you/i,
    ],
  },
];

export function parseIntent(message) {
  const lower = message.toLowerCase();
  for (const topic of TOPIC_PATTERNS) {
    for (const pattern of topic.patterns) {
      if (pattern.test(lower)) return topic.key;
    }
  }
  return null;
}
