/**
 * intentParser.js
 * Parses raw user messages into structured intent objects.
 * Provides country detection and user context extraction.
 */

// ─── Country Detection ────────────────────────────────────────────────────────

/**
 * Detects which country the user is referencing in their message.
 * @param {string} text
 * @returns {string|null} ISO country code or null if not detected
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

/**
 * Extracts contextual flags from the user message to enrich responses.
 * @param {string} msg
 * @returns {{ isQuestion: boolean, isCasual: boolean, mentionsOnline: boolean, mentionsDeadline: boolean, mentionsAge: boolean, mentionsFee: boolean }}
 */
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

/**
 * The ordered list of topic patterns that map to handler keys.
 * Handlers are resolved in responseGenerator.js.
 */
export const TOPIC_PATTERNS = [
  {
    key: 'registration',
    patterns: [
      /how (?:do i |to |can i )?register/i,
      /voter registration/i,
      /register (?:to |for )?vot/i,
      /sign up (?:to |for )?vot/i,
      /enroll (?:to |for )?vot/i,
    ],
  },
  {
    key: 'documents',
    patterns: [
      /what (?:documents?|id|identification|papers?)/i,
      /(?:need|require|bring) (?:for |to )?vot/i,
      /voter id/i,
      /photo id/i,
      /identity (?:proof|card|document)/i,
    ],
  },
  {
    key: 'votingDay',
    patterns: [
      /voting day/i,
      /election day/i,
      /polling day/i,
      /what happens (?:on|during|at) (?:the )?(?:voting|election|polling)/i,
      /how (?:do i |to |does )?vot(?:e|ing)/i,
      /cast (?:my |a )?(?:vote|ballot)/i,
    ],
  },
  {
    key: 'firstTime',
    patterns: [
      /first.?time voter/i,
      /new voter/i,
      /i(?:'m| am) (?:a )?(?:new|first)/i,
      /never voted/i,
      /voting for (?:the )?first time/i,
      /first (?:time )?(?:to |i am )?vot/i,
    ],
  },
  {
    key: 'process',
    patterns: [
      /election (?:process|system|stages?|steps?|phases?)/i,
      /how (?:do |does )?election/i,
      /explain (?:the )?election/i,
      /election (?:work|happen)/i,
      /step.?by.?step/i,
    ],
  },
  {
    key: 'timeline',
    patterns: [
      /timeline/i,
      /schedule/i,
      /when (?:is|are|does) (?:the )?election/i,
      /election (?:date|calendar)/i,
      /important dates/i,
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
    ],
  },
  {
    key: 'postal',
    patterns: [
      /postal (?:vote|ballot|voting)/i,
      /absentee (?:vote|ballot|voting)/i,
      /vote (?:by |from )?(?:mail|post|home)/i,
      /mail.?in (?:vote|ballot)/i,
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
      /right|rights/i,
      /can i/i,
      /am i (?:allowed|eligible|able)/i,
      /eligib/i,
    ],
  },
  {
    key: 'counting',
    patterns: [
      /count/i,
      /result/i,
      /who (?:won|wins)/i,
      /after (?:voting|election)/i,
    ],
  },
  {
    key: 'greeting',
    patterns: [/(?:hi|hello|hey|good (?:morning|evening|afternoon)|greetings)/i],
  },
  {
    key: 'thanks',
    patterns: [/(?:thank|thanks|thx)/i],
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

/**
 * Matches a user message against TOPIC_PATTERNS and returns the first matching key.
 * @param {string} message
 * @returns {string|null} intent key or null
 */
export function parseIntent(message) {
  for (const topic of TOPIC_PATTERNS) {
    for (const pattern of topic.patterns) {
      if (pattern.test(message)) return topic.key;
    }
  }
  return null;
}
