// safetyFilter.js (CommonJS) — Cloud Functions copy
// Blocks political opinion requests and harmful content.

const BLOCKED_PATTERNS = [
  /who (?:should|shall|must|to) (?:i |we )?vot(?:e|ing) for/i,
  /which (?:party|candidate|politician) is (?:better|best|worse|worst)/i,
  /(?:vote|support|elect|choose) (?:for |against )?(?:bjp|congress|aap|ncp|bsp|sp|tmc|trump|biden|labour|tory|democrat|republican)/i,
  /(?:bjp|congress|aap|ncp|bsp|sp|tmc) (?:is|are) (?:better|best|worse|worst|corrupt|good|bad)/i,
  /(?:modi|gandhi|kejriwal|trump|biden|obama|boris|sunak|macron) (?:is|are|was|were) (?:better|worse|good|bad|great|terrible|corrupt)/i,
  /(?:hate|love|support|oppose) (?:the )?(?:government|party|politician|president|pm|prime minister)/i,
  /political (?:opinion|view|stance|bias)/i,
];

const SAFETY_RESPONSE = `<p>I'm designed to be completely <strong>politically neutral</strong> and provide only educational information about election processes.</p>
<p>I cannot share opinions about:</p>
<ul>
<li>Which party or candidate to vote for</li>
<li>Whether a political party is good or bad</li>
<li>Political views or opinions</li>
</ul>
<div class="tip-box">💡 I can help you understand <strong>how elections work</strong>, <strong>how to register</strong>, <strong>what documents you need</strong>, and your <strong>voting rights</strong>. Ask me anything on those topics!</div>`;

function isSafetyViolation(message) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(message));
}

module.exports = { isSafetyViolation, SAFETY_RESPONSE };
