/**
 * safetyFilter.js
 * Detects politically biased or opinion-seeking messages that the assistant
 * must refuse to answer. Keeps the assistant neutral and educational.
 */

/** Regex patterns that indicate a political opinion request. */
const POLITICAL_PATTERNS = [
  /who (?:should|to|do you) (?:i |we )?vote/i,
  /best (?:candidate|party|politician)/i,
  /which party/i,
  /your (?:opinion|view|thought) on/i,
  /do you (?:support|like|prefer)/i,
  /is .+ (?:good|bad|better|worse) (?:candidate|party|leader|pm|president)/i,
  /should .+ (?:win|lose)/i,
  /favorite (?:candidate|party|leader)/i,
];

export const SAFETY_RESPONSE = `🚫 <strong>I can't help with that.</strong>

I'm designed to provide <strong>neutral, educational information</strong> about the election process only. I cannot:
<ul>
<li>Suggest who to vote for</li>
<li>Share political opinions</li>
<li>Compare candidates or parties</li>
<li>Recommend any political choice</li>
</ul>

<div class="tip-box">💡 <strong>Tip:</strong> I can help you understand <em>how</em> to vote, voter registration, election timelines, and your rights as a voter. Feel free to ask about those!</div>`;

/**
 * Returns true if the given user message triggers the safety filter.
 * Handles edge cases: null, undefined, non-string inputs.
 * @param {string|any} text - Raw user message text.
 * @returns {boolean}
 */
export function isSafetyViolation(text) {
  // Defensive check: handle null, undefined, non-string inputs
  if (!text || typeof text !== 'string') {
    return false;
  }
  return POLITICAL_PATTERNS.some((pattern) => pattern.test(text));
}
