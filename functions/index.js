/**
 * Election Guide Assistant — Firebase Cloud Functions
 * 
 * Endpoint: processChat (HTTP)
 * - Receives { message, userState } via POST
 * - Runs AI engine server-side
 * - Returns { text, detectedCountry }
 * - All requests are logged to Google Cloud Logging automatically
 */

const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');

// Define the secret parameter
const aiApiKey = defineSecret('AI_API_KEY');

const { isSafetyViolation, SAFETY_RESPONSE } = require('./engine/safetyFilter');
const { detectCountry, extractUserContext, parseIntent } = require('./engine/intentParser');
const {
  COUNTRIES,
  ELECTION_STAGES,
  DEFAULT_STAGES,
  FIRST_TIME_CHECKLIST,
  DEFAULT_CHECKLIST,
  FAQ_DATA,
  DEFAULT_FAQ,
} = require('./data/electionData');

// ─── Utility ──────────────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getCountryName(code) {
  const c = COUNTRIES.find((c) => c.code === code);
  return c ? `${c.flag} ${c.name}` : 'your country';
}

function validateInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().substring(0, 5000);
}

// ─── Dynamic Phrasing ─────────────────────────────────────────────────────────

const INTROS = {
  registration: [
    (n) => `Great question! Here's how voter registration works in ${n}:`,
    (n) => `Let me walk you through the registration process for ${n}.`,
    (n) => `Registering to vote in ${n} is straightforward — here's what you need to know:`,
  ],
  documents: [
    (n) => `Here are the documents you'll need for voting in ${n}:`,
    (n) => `To vote in ${n}, make sure you have these documents ready:`,
  ],
  votingDay: [
    (n) => `Here's what voting day looks like in ${n}:`,
    (n) => `Let me walk you through what happens on election day in ${n}:`,
  ],
  firstTime: [
    () => `Welcome to the world of voting! 🎉 Here's everything you need:`,
    () => `Congrats on voting for the first time! Let me make this easy for you:`,
  ],
  process: [
    (n) => `Here's how the election process works in ${n}:`,
    (n) => `Let me break down the election stages in ${n} for you:`,
  ],
  rights: [
    (n) => `As a voter in ${n}, you have important rights:`,
    (n) => `Here are your key voting rights in ${n}:`,
  ],
  counting: [
    (n) => `Here's how votes get counted in ${n}:`,
    (n) => `The counting process in ${n} works like this:`,
  ],
};

const FOLLOW_UPS = [
  (topics) => `<p>Want to know more about <strong>${topics[0]}</strong> or <strong>${topics[1]}</strong>?</p>`,
  (topics) => `<p>I can also help with <strong>${topics[0]}</strong> or <strong>${topics[1]}</strong> — just ask!</p>`,
];

const TIPS = [
  (tip) => `<div class="tip-box">💡 <strong>Tip:</strong> ${tip}</div>`,
  (tip) => `<div class="tip-box">📌 <strong>Remember:</strong> ${tip}</div>`,
  (tip) => `<div class="tip-box">✨ <strong>Good to know:</strong> ${tip}</div>`,
];

function dynamicFollowUp(exclude = []) {
  const allTopics = ['voter registration', 'required documents', 'voting day process', 'election timeline', 'first-time voter guide', 'your voting rights', 'postal voting'];
  const available = allTopics.filter(t => !exclude.some(e => t.includes(e)));
  const chosen = available.sort(() => Math.random() - 0.5).slice(0, 2);
  return pick(FOLLOW_UPS)(chosen);
}

function dynamicTip(tip) { return pick(TIPS)(tip); }

// ─── Response Generators ──────────────────────────────────────────────────────

function generateRegistrationResponse(country, ctx) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const regStage = stages[0];
  const name = getCountryName(country);
  const intro = pick(INTROS.registration)(name);
  let extra = '';
  if (ctx?.mentionsOnline) extra = `<p>✅ Yes, you can register <strong>online</strong> in most cases — check your election commission's website.</p>`;
  if (ctx?.mentionsAge) extra = `<p>📋 You typically need to be <strong>18 years or older</strong> to register and vote.</p>`;
  const tips = ["Register as early as possible — don't wait until the deadline!", "Keep a copy of your registration confirmation safe.", "You can check your registration status online in most countries."];
  return `<h4>📋 Voter Registration in ${name}</h4><p>${intro}</p><p>${regStage.description}</p>${extra}<h5>Steps to register:</h5><ol>${regStage.details.map(d => `<li>${d}</li>`).join('\n')}</ol>${dynamicTip(pick(tips))}${dynamicFollowUp(['registration'])}`;
}

function generateDocumentsResponse(country, ctx) {
  const checklist = FIRST_TIME_CHECKLIST[country] || DEFAULT_CHECKLIST;
  const name = getCountryName(country);
  const intro = pick(INTROS.documents)(name);
  let extra = '';
  if (ctx?.mentionsFee) extra = `<p>💰 Obtaining a voter ID is usually <strong>free of charge</strong>.</p>`;
  const tips = ['Carry at least one valid photo ID on voting day.', 'Check your local election authority for the complete list of accepted IDs.'];
  return `<h4>📄 Documents Needed for Voting in ${name}</h4><p>${intro}</p>${extra}<ul>${checklist.documents.map(d => `<li><strong>${d.label}</strong> — ${d.sublabel}</li>`).join('\n')}</ul>${dynamicTip(pick(tips))}${dynamicFollowUp(['document'])}`;
}

function generateVotingDayResponse(country) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const votingStage = stages.find(s => s.title.toLowerCase().includes('voting') || s.title.toLowerCase().includes('polling') || s.title.toLowerCase().includes('election day'));
  const name = getCountryName(country);
  if (!votingStage) return generateElectionProcessResponse(country);
  const intro = pick(INTROS.votingDay)(name);
  const tips = ['Your vote is completely secret — no one can see who you voted for.', 'Arrive early to avoid long queues.', "If you're in line before polls close, you have the right to vote."];
  return `<h4>🗳️ Voting Day in ${name}</h4><p>${intro}</p><p>${votingStage.description}</p><h5>Here's what to expect:</h5><ol>${votingStage.details.map(d => `<li>${d}</li>`).join('\n')}</ol>${dynamicTip(pick(tips))}${dynamicFollowUp(['voting'])}`;
}

function generateFirstTimeResponse(country) {
  const checklist = FIRST_TIME_CHECKLIST[country] || DEFAULT_CHECKLIST;
  const name = getCountryName(country);
  const intro = pick(INTROS.firstTime)();
  const encouragements = ["You've got this!", "Your voice matters. This is an important step in your democratic journey!", "Don't hesitate to ask for help at the polling station."];
  return `<h4>🎉 Welcome, First-Time Voter!</h4><p>${intro}</p><p>Here's your personalized guide for voting in ${name}:</p><h5>📋 Your Voting Checklist:</h5><ol>${checklist.steps.slice(0, 5).map(s => `<li><strong>${s.label}</strong> — ${s.sublabel}</li>`).join('\n')}</ol><h5>💡 Helpful Tips:</h5><ul>${checklist.tips.map(t => `<li>${t}</li>`).join('\n')}</ul>${dynamicTip(pick(encouragements))}<p>Check out the <strong>Interactive Checklist</strong> in the sidebar for a step-by-step guide you can track!</p>`;
}

function generateElectionProcessResponse(country) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const name = getCountryName(country);
  const intro = pick(INTROS.process)(name);
  return `<h4>🏛️ Election Process in ${name}</h4><p>${intro}</p><ol>${stages.map(s => `<li><strong>${s.title}</strong> — ${s.description}</li>`).join('\n')}</ol>${dynamicTip('Check the Election Timeline page in the sidebar for a detailed visual breakdown!')}<p>Want to dive deeper into any specific stage? Just ask!</p>`;
}

function generateTimelineResponse(country) {
  const name = getCountryName(country);
  return `<h4>📅 Election Timeline for ${name}</h4><p>I've prepared a detailed visual timeline for you! View it on the <strong>Election Timeline</strong> page in the sidebar.</p><p>The timeline shows all 5 major election stages with their current status and key details.</p><div class="tip-box">💡 You can switch between different countries on the Timeline page to compare election processes!</div><p>Would you like me to explain any specific stage in detail?</p>`;
}

function generateRightsResponse(country) {
  const name = getCountryName(country);
  const intro = pick(INTROS.rights)(name);
  return `<h4>⚖️ Your Voting Rights in ${name}</h4><p>${intro}</p><ul><li>✅ The right to a <strong>secret ballot</strong> — no one can see your vote</li><li>✅ The right to <strong>assistance</strong> if you need help at the polling station</li><li>✅ The right to vote <strong>without intimidation</strong> or pressure</li><li>✅ The right to <strong>report violations</strong> to election authorities</li><li>✅ The right to <strong>accessible polling stations</strong></li></ul>${dynamicTip('If anyone tries to prevent you from voting, report it to election authorities immediately.')}${dynamicFollowUp(['rights'])}`;
}

function generateCountingResponse(country) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const countStage = stages[stages.length - 1];
  const name = getCountryName(country);
  const intro = pick(INTROS.counting)(name);
  return `<h4>📊 Counting & Results in ${name}</h4><p>${intro}</p><p>${countStage.description}</p><h5>The counting process:</h5><ul>${countStage.details.map(d => `<li>${d}</li>`).join('\n')}</ul>${dynamicTip('Results are usually updated live on the official election commission website.')}${dynamicFollowUp(['counting', 'result'])}`;
}

function generateGreeting() {
  return `<h4>👋 Hello there!</h4><p>Welcome to the <strong>Election Guide Assistant</strong>! I'm here to make elections easy to understand.</p><p>Here's what I can help with:</p><ul><li>🗳️ <strong>How to vote</strong> — step-by-step guidance</li><li>📋 <strong>Voter registration</strong> — how to get on the voter list</li><li>📄 <strong>Documents needed</strong> — what to bring on voting day</li><li>📅 <strong>Election timeline</strong> — stages of the election process</li><li>🎉 <strong>First-time voter guide</strong> — special help for new voters</li></ul><p>Which country are you from? This helps me give the most relevant info. 🌍</p>`;
}

function generateThanks() {
  return `<p>You're welcome! 😊 Glad I could help.</p>${dynamicTip('Every vote counts — your voice matters in democracy!')}<p>Feel free to ask if you have more questions!</p>`;
}

function generateHelp() {
  return `<h4>🤖 What I Can Help You With</h4><p>I'm your <strong>Election Guide Assistant</strong>! Here's what I can do:</p><ul><li>📋 Explain the <strong>voter registration</strong> process</li><li>📄 List the <strong>documents you need</strong> for voting</li><li>🗳️ Walk you through <strong>voting day</strong> step by step</li><li>🎉 Provide a <strong>first-time voter guide</strong></li><li>📅 Show the <strong>election timeline</strong> and stages</li><li>❓ Answer <strong>frequently asked questions</strong></li><li>🌍 Provide <strong>country-specific</strong> election information</li></ul><div class="tip-box">🚫 I stay completely <strong>neutral</strong> and will never suggest who to vote for or share political opinions.</div>`;
}

function generateEVMResponse() {
  return `<h4>🖥️ Electronic Voting Machine (EVM)</h4><p>An <strong>EVM</strong> is used in India to cast votes electronically. It consists of two units:</p><ul><li><strong>Ballot Unit:</strong> Displays candidate names, symbols, and a blue button next to each</li><li><strong>Control Unit:</strong> Operated by the polling officer to enable voting</li></ul><h5>How to use an EVM:</h5><ol><li>The polling officer presses the ballot button on the Control Unit</li><li>A light appears next to each candidate on the Ballot Unit</li><li>Press the <strong>blue button</strong> next to your preferred candidate</li><li>A beep confirms your vote has been recorded</li><li>Check the <strong>VVPAT slip</strong> (visible for 7 seconds) to verify</li></ol><div class="tip-box">🔒 EVMs are standalone devices not connected to any network, making them tamper-safe.</div>`;
}

function generateNOTAResponse() {
  return `<h4>🚫 NOTA — None of The Above</h4><p><strong>NOTA</strong> is an option available on the EVM in Indian elections since 2013.</p><ul><li>It allows you to reject all candidates without invalid-izing your vote</li><li>NOTA is the <strong>last option</strong> on the ballot unit</li><li>NOTA votes are counted and shown in the results</li><li>Even if NOTA gets the most votes, the candidate with the highest votes still wins</li></ul><div class="tip-box">⚖️ The symbol for NOTA is a ballot paper with a cross mark, designed by the National Institute of Design.</div>`;
}

function generateMCCResponse() {
  return `<h4>📜 Model Code of Conduct (MCC)</h4><p>The <strong>Model Code of Conduct</strong> is issued by the Election Commission of India when elections are announced.</p><ul><li>Government cannot announce new schemes or projects</li><li>No use of government resources for campaigning</li><li>No appeals based on religion, caste, or communal feelings</li><li>Campaign silence period: <strong>48 hours</strong> before polling</li></ul><div class="tip-box">⚠️ Violations can lead to FIRs, debarring candidates, or postponing elections.</div>`;
}

function generatePostalVoteResponse(country) {
  const name = getCountryName(country);
  if (country === 'IN') {
    return `<h4>📬 Postal Voting in ${name}</h4><p>Postal voting in India is available to specific categories:</p><ul><li><strong>Service voters</strong> (armed forces, diplomatic staff)</li><li><strong>Absentee voters:</strong> Senior citizens (80+) and Persons with Disability (PwD)</li><li><strong>Essential service personnel</strong> on election duty</li></ul><div class="tip-box">📌 General voters must vote in person. If you've moved, update registration using Form 6A.</div>`;
  }
  return `<h4>📬 Postal/Absentee Voting in ${name}</h4><p>Many democracies allow postal or absentee voting for citizens who cannot attend in person.</p><ul><li>Check eligibility with the local election authority</li><li>Apply before the deadline (usually weeks before election day)</li><li>Receive your ballot by mail, complete it, and return it</li></ul><div class="tip-box">💡 Contact your national or local election commission for specific procedures.</div>`;
}

function generateElectoralCollegeResponse() {
  return `<h4>🏛️ The Electoral College (United States)</h4><p>The <strong>Electoral College</strong> elects the U.S. President and Vice President.</p><ol><li>Each state gets electors equal to its <strong>Senators (2) + Representatives</strong></li><li>There are <strong>538 total electors</strong></li><li>A candidate needs <strong>270 electoral votes</strong> to win</li><li>Most states use <strong>winner-take-all</strong></li></ol><div class="tip-box">📊 A candidate can win the presidency without winning the national popular vote, as happened in 2000 and 2016.</div>`;
}

function generatePrimariesResponse() {
  return `<h4>🗳️ Primaries & Caucuses (United States)</h4><p>Before the general election, parties select their candidates through:</p><h5>Primaries:</h5><ul><li><strong>Open primaries:</strong> Any registered voter can participate</li><li><strong>Closed primaries:</strong> Only registered party members can vote</li></ul><h5>Caucuses:</h5><ul><li>Local meetings where voters discuss and vote openly</li><li>More time-consuming and interactive than primaries</li></ul>`;
}

const FALLBACKS = [
  `<p>That's an interesting question! I specialize in election processes. Here's what I can help you with:</p>`,
  `<p>I'd love to help! While that's outside my expertise, here are topics I know well:</p>`,
  `<p>Hmm, I'm not sure about that one, but I'm great at explaining these election topics:</p>`,
];

// ─── Core AI Processing ────────────────────────────────────────────────────────

function processMessage(userMessage, userState) {
  const sanitizedMessage = validateInput(userMessage);
  if (!sanitizedMessage) {
    return {
      text: `${pick(FALLBACKS)}<ul><li>📋 <strong>Voter Registration</strong></li><li>📄 <strong>Required Documents</strong></li><li>🗳️ <strong>Voting Day Guide</strong></li><li>🎉 <strong>First-Time Voter</strong></li><li>📅 <strong>Election Process</strong></li></ul>`,
      detectedCountry: null,
    };
  }

  const { country = 'IN' } = userState || {};
  const ctx = extractUserContext(sanitizedMessage);

  if (isSafetyViolation(sanitizedMessage)) {
    return { text: SAFETY_RESPONSE, detectedCountry: null };
  }

  const detectedCountry = detectCountry(sanitizedMessage);

  if (detectedCountry && sanitizedMessage.split(/\s+/).length <= 4) {
    const cName = getCountryName(detectedCountry);
    return {
      text: `<p>Got it! Switching to election info for <strong>${cName}</strong>.</p><p>What would you like to know?</p><ul><li>📋 How to <strong>register to vote</strong></li><li>🗳️ What happens on <strong>voting day</strong></li><li>📅 The full <strong>election process</strong></li><li>🎉 <strong>First-time voter</strong> guide</li><li>📄 <strong>Documents needed</strong></li></ul>`,
      detectedCountry,
    };
  }

  const activeCountry = detectedCountry || country;
  const intentKey = parseIntent(userMessage);

  if (intentKey) {
    const handlerMap = {
      registration:     (c) => generateRegistrationResponse(c, ctx),
      documents:        (c) => generateDocumentsResponse(c, ctx),
      votingDay:        (c) => generateVotingDayResponse(c),
      firstTime:        (c) => generateFirstTimeResponse(c),
      process:          (c) => generateElectionProcessResponse(c),
      timeline:         (c) => generateTimelineResponse(c),
      evm:              ()  => generateEVMResponse(),
      nota:             ()  => generateNOTAResponse(),
      mcc:              ()  => generateMCCResponse(),
      postal:           (c) => generatePostalVoteResponse(c),
      electoralCollege: ()  => generateElectoralCollegeResponse(),
      primaries:        ()  => generatePrimariesResponse(),
      rights:           (c) => generateRightsResponse(c),
      counting:         (c) => generateCountingResponse(c),
      greeting:         ()  => generateGreeting(),
      thanks:           ()  => generateThanks(),
      help:             ()  => generateHelp(),
    };
    const handler = handlerMap[intentKey];
    if (handler) return { text: handler(activeCountry), detectedCountry };
  }

  const lower = userMessage.toLowerCase();
  const faqList = FAQ_DATA[activeCountry] || DEFAULT_FAQ;
  const faqMatch = faqList.find(f => {
    const words = f.question.toLowerCase().split(/\s+/);
    return words.filter(w => w.length > 3 && lower.includes(w)).length >= 2;
  });
  if (faqMatch) {
    return {
      text: `<h4>💬 ${faqMatch.question}</h4><div>${faqMatch.answer}</div>${dynamicFollowUp([])}`,
      detectedCountry,
    };
  }

  return {
    text: `${pick(FALLBACKS)}<ul><li>📋 <strong>Voter Registration</strong> — "How do I register to vote?"</li><li>📄 <strong>Required Documents</strong> — "What documents do I need?"</li><li>🗳️ <strong>Voting Day Guide</strong> — "What happens on voting day?"</li><li>🎉 <strong>First-Time Voter</strong> — "I'm a first-time voter"</li><li>📅 <strong>Election Process</strong> — "Explain the election process"</li></ul>`,
    detectedCountry,
  };
}

// ─── Cloud Function Export ────────────────────────────────────────────────────

exports.processChat = onRequest(
  {
    cors: true,      // Allow cross-origin requests from the Hosting domain
    region: 'us-central1',
    maxInstances: 10,
    secrets: [aiApiKey], // Bind the secret to this function
  },
  (req, res) => {
    // Access the secret value safely during execution
    const apiKey = aiApiKey.value();
    
    // Only allow POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { message, userState } = req.body || {};
    const country = userState?.country || 'IN';
    const messageLength = (message || '').length;

    // ── Structured log → Google Cloud Logging ──────────────────────────
    logger.info('chat_request', {
      event: 'chat_request',
      country,
      messageLength,
      language: userState?.language || 'en-US',
      timestamp: new Date().toISOString(),
    });

    if (!message) {
      logger.warn('empty_message_received', { country });
      res.status(400).json({ error: 'message is required' });
      return;
    }

    try {
      const result = processMessage(message, userState);

      // ── Log successful response ─────────────────────────────────────
      logger.info('chat_response_sent', {
        event: 'chat_response_sent',
        country,
        detectedCountry: result.detectedCountry,
        responseLength: result.text.length,
      });

      res.status(200).json(result);
    } catch (error) {
      logger.error('chat_processing_error', {
        event: 'chat_processing_error',
        error: error.message,
        country,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
