// AI Engine: Dynamic election assistant with context-aware responses

import {
  COUNTRIES,
  ELECTION_STAGES,
  DEFAULT_STAGES,
  FIRST_TIME_CHECKLIST,
  DEFAULT_CHECKLIST,
  FAQ_DATA,
  DEFAULT_FAQ,
} from '../data/electionData';

// --- Dynamic Phrasing Utilities ---
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const INTROS = {
  registration: [
    (n) => `Great question! Here's how voter registration works in ${n}:`,
    (n) => `Let me walk you through the registration process for ${n}.`,
    (n) => `Registering to vote in ${n} is straightforward — here's what you need to know:`,
    (n) => `Here's a clear breakdown of voter registration in ${n}:`,
    (n) => `Good that you're asking! Voter registration in ${n} involves these steps:`,
  ],
  documents: [
    (n) => `Here are the documents you'll need for voting in ${n}:`,
    (n) => `To vote in ${n}, make sure you have these documents ready:`,
    (n) => `Great question! Here's your document checklist for ${n}:`,
    (n) => `Let me list out exactly what you need to bring for voting in ${n}:`,
  ],
  votingDay: [
    (n) => `Here's what voting day looks like in ${n}:`,
    (n) => `Let me walk you through what happens on election day in ${n}:`,
    (n) => `Voting day in ${n} follows a clear process — here's the breakdown:`,
    (n) => `Here's exactly what to expect when you go to vote in ${n}:`,
  ],
  firstTime: [
    () => `Welcome to the world of voting! 🎉 Here's everything you need:`,
    () => `Congrats on voting for the first time! Let me make this easy for you:`,
    () => `That's exciting! As a first-time voter, here's your personalized guide:`,
    () => `Great step! Here's a simplified checklist to get you voting-ready:`,
  ],
  process: [
    (n) => `Here's how the election process works in ${n}:`,
    (n) => `Let me break down the election stages in ${n} for you:`,
    (n) => `The election process in ${n} has several key phases:`,
    (n) => `Here's a step-by-step look at how elections work in ${n}:`,
  ],
  rights: [
    (n) => `As a voter in ${n}, you have important rights:`,
    (n) => `Here are your key voting rights in ${n}:`,
    (n) => `Let me outline your voter protections in ${n}:`,
  ],
  counting: [
    (n) => `Here's how votes get counted in ${n}:`,
    (n) => `The counting process in ${n} works like this:`,
    (n) => `After polls close in ${n}, here's what happens:`,
  ],
};

const FOLLOW_UPS = [
  (topics) => `<p>Want to know more about <strong>${topics[0]}</strong> or <strong>${topics[1]}</strong>?</p>`,
  (topics) => `<p>I can also help with <strong>${topics[0]}</strong> or <strong>${topics[1]}</strong> — just ask!</p>`,
  (topics) => `<p>Feel free to ask about <strong>${topics[0]}</strong> or <strong>${topics[1]}</strong> next.</p>`,
  (topics) => `<p>Shall I explain <strong>${topics[0]}</strong> or <strong>${topics[1]}</strong> too?</p>`,
];

const TIPS = [
  (tip) => `<div class="tip-box">💡 <strong>Tip:</strong> ${tip}</div>`,
  (tip) => `<div class="tip-box">📌 <strong>Remember:</strong> ${tip}</div>`,
  (tip) => `<div class="tip-box">✨ <strong>Good to know:</strong> ${tip}</div>`,
  (tip) => `<div class="tip-box">📝 <strong>Quick note:</strong> ${tip}</div>`,
];

function dynamicFollowUp(exclude = []) {
  const allTopics = ['voter registration', 'required documents', 'voting day process', 'election timeline', 'first-time voter guide', 'your voting rights', 'postal voting'];
  const available = allTopics.filter(t => !exclude.some(e => t.includes(e)));
  const chosen = available.sort(() => Math.random() - 0.5).slice(0, 2);
  return pick(FOLLOW_UPS)(chosen);
}

function dynamicTip(tip) {
  return pick(TIPS)(tip);
}

function extractUserContext(msg) {
  const lower = msg.toLowerCase();
  return {
    isQuestion: /\?|how|what|when|where|why|can i|do i|is it/.test(lower),
    isCasual: /hey|hi|yo|sup|thanks|thx|cool|okay|pls|plz/.test(lower),
    mentionsOnline: /online|website|internet|app|digital/.test(lower),
    mentionsDeadline: /deadline|last date|time limit|when.*register/.test(lower),
    mentionsAge: /age|how old|18|year/.test(lower),
    mentionsFee: /fee|cost|free|money|pay/.test(lower),
  };
}

// Safety filter: detect political opinion requests
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

function isSafetyViolation(text) {
  return POLITICAL_PATTERNS.some((pattern) => pattern.test(text));
}

const SAFETY_RESPONSE = `🚫 <strong>I can't help with that.</strong>

I'm designed to provide <strong>neutral, educational information</strong> about the election process only. I cannot:
<ul>
<li>Suggest who to vote for</li>
<li>Share political opinions</li>
<li>Compare candidates or parties</li>
<li>Recommend any political choice</li>
</ul>

<div class="tip-box">💡 <strong>Tip:</strong> I can help you understand <em>how</em> to vote, voter registration, election timelines, and your rights as a voter. Feel free to ask about those!</div>`;

// Topic patterns and response generators
const TOPIC_HANDLERS = [
  {
    patterns: [
      /how (?:do i |to |can i )?register/i,
      /voter registration/i,
      /register (?:to |for )?vot/i,
      /sign up (?:to |for )?vot/i,
      /enroll (?:to |for )?vot/i,
    ],
    handler: (country) => generateRegistrationResponse(country),
  },
  {
    patterns: [
      /what (?:documents?|id|identification|papers?)/i,
      /(?:need|require|bring) (?:for |to )?vot/i,
      /voter id/i,
      /photo id/i,
      /identity (?:proof|card|document)/i,
    ],
    handler: (country) => generateDocumentsResponse(country),
  },
  {
    patterns: [
      /voting day/i,
      /election day/i,
      /polling day/i,
      /what happens (?:on|during|at) (?:the )?(?:voting|election|polling)/i,
      /how (?:do i |to |does )?vot(?:e|ing)/i,
      /cast (?:my |a )?(?:vote|ballot)/i,
    ],
    handler: (country) => generateVotingDayResponse(country),
  },
  {
    patterns: [
      /first.?time voter/i,
      /new voter/i,
      /i(?:'m| am) (?:a )?(?:new|first)/i,
      /never voted/i,
      /voting for (?:the )?first time/i,
      /first (?:time )?(?:to |i am )?vot/i,
    ],
    handler: (country) => generateFirstTimeResponse(country),
  },
  {
    patterns: [
      /election (?:process|system|stages?|steps?|phases?)/i,
      /how (?:do |does )?election/i,
      /explain (?:the )?election/i,
      /election (?:work|happen)/i,
      /step.?by.?step/i,
    ],
    handler: (country) => generateElectionProcessResponse(country),
  },
  {
    patterns: [
      /timeline/i,
      /schedule/i,
      /when (?:is|are|does) (?:the )?election/i,
      /election (?:date|calendar)/i,
      /important dates/i,
    ],
    handler: (country) => generateTimelineResponse(country),
  },
  {
    patterns: [
      /evm/i,
      /electronic voting machine/i,
      /voting machine/i,
    ],
    handler: () => generateEVMResponse(),
  },
  {
    patterns: [
      /nota/i,
      /none of the above/i,
    ],
    handler: () => generateNOTAResponse(),
  },
  {
    patterns: [
      /model code/i,
      /code of conduct/i,
    ],
    handler: () => generateMCCResponse(),
  },
  {
    patterns: [
      /postal (?:vote|ballot|voting)/i,
      /absentee (?:vote|ballot|voting)/i,
      /vote (?:by |from )?(?:mail|post|home)/i,
      /mail.?in (?:vote|ballot)/i,
    ],
    handler: (country) => generatePostalVoteResponse(country),
  },
  {
    patterns: [
      /electoral college/i,
    ],
    handler: () => generateElectoralCollegeResponse(),
  },
  {
    patterns: [
      /primar(?:y|ies)/i,
      /caucus/i,
    ],
    handler: () => generatePrimariesResponse(),
  },
  {
    patterns: [
      /right|rights/i,
      /can i/i,
      /am i (?:allowed|eligible|able)/i,
      /eligib/i,
    ],
    handler: (country) => generateRightsResponse(country),
  },
  {
    patterns: [
      /count/i,
      /result/i,
      /who (?:won|wins)/i,
      /after (?:voting|election)/i,
    ],
    handler: (country) => generateCountingResponse(country),
  },
  {
    patterns: [
      /(?:hi|hello|hey|good (?:morning|evening|afternoon)|greetings)/i,
    ],
    handler: () => generateGreeting(),
  },
  {
    patterns: [
      /(?:thank|thanks|thx)/i,
    ],
    handler: () => generateThanks(),
  },
  {
    patterns: [
      /help/i,
      /what can you/i,
      /what do you/i,
      /who are you/i,
    ],
    handler: () => generateHelp(),
  },
];

// --- Response Generators ---

function getCountryName(code) {
  const c = COUNTRIES.find((c) => c.code === code);
  return c ? `${c.flag} ${c.name}` : 'your country';
}

function generateRegistrationResponse(country, ctx) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const regStage = stages[0];
  const name = getCountryName(country);
  const intro = pick(INTROS.registration)(name);
  let extra = '';
  if (ctx?.mentionsOnline) extra = `<p>✅ Yes, you can register <strong>online</strong> in most cases — check your election commission's website.</p>`;
  if (ctx?.mentionsDeadline) extra = `<p>⏰ <strong>Deadline alert:</strong> Registration deadlines vary — don't wait until the last minute!</p>`;
  if (ctx?.mentionsAge) extra = `<p>📋 You typically need to be <strong>18 years or older</strong> to register and vote.</p>`;

  const tips = ['Register as early as possible — don\'t wait until the deadline!', 'Keep a copy of your registration confirmation safe.', 'You can check your registration status online in most countries.', 'If you\'ve moved recently, update your voter registration address.'];

  return `<h4>📋 Voter Registration in ${name}</h4>
<p>${intro}</p>
<p>${regStage.description}</p>
${extra}
<h5>Steps to register:</h5>
<ol>
${regStage.details.map((d) => `<li>${d}</li>`).join('\n')}
</ol>
${dynamicTip(pick(tips))}
${dynamicFollowUp(['registration'])}`;
}

function generateDocumentsResponse(country, ctx) {
  const checklist = FIRST_TIME_CHECKLIST[country] || DEFAULT_CHECKLIST;
  const name = getCountryName(country);
  const intro = pick(INTROS.documents)(name);
  let extra = '';
  if (ctx?.mentionsFee) extra = `<p>💰 Obtaining a voter ID is usually <strong>free of charge</strong>.</p>`;

  const tips = ['Carry at least one valid photo ID on voting day.', 'Make photocopies of your documents as backup.', 'Check your local election authority for the complete list of accepted IDs.', 'Some countries accept multiple forms of ID — check what\'s valid in yours.'];

  return `<h4>📄 Documents Needed for Voting in ${name}</h4>
<p>${intro}</p>
${extra}
<ul>
${checklist.documents.map((d) => `<li><strong>${d.label}</strong> — ${d.sublabel}</li>`).join('\n')}
</ul>
${dynamicTip(pick(tips))}
${dynamicFollowUp(['document'])}`;
}

function generateVotingDayResponse(country, ctx) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const votingStage = stages.find(s => s.title.toLowerCase().includes('voting') || s.title.toLowerCase().includes('polling') || s.title.toLowerCase().includes('election day'));
  const name = getCountryName(country);

  if (!votingStage) return generateElectionProcessResponse(country, ctx);
  const intro = pick(INTROS.votingDay)(name);

  const tips = ['Your vote is completely secret — no one can see who you voted for.', 'Arrive early to avoid long queues, especially in busy areas.', 'If you\'re in line before polls close, you have the right to vote.', 'Take your time in the voting booth — there\'s no rush.'];

  return `<h4>🗳️ Voting Day in ${name}</h4>
<p>${intro}</p>
<p>${votingStage.description}</p>

<h5>Here's what to expect:</h5>
<ol>
${votingStage.details.map((d) => `<li>${d}</li>`).join('\n')}
</ol>
${dynamicTip(pick(tips))}
${dynamicFollowUp(['voting'])}`;
}

function generateFirstTimeResponse(country, ctx) {
  const checklist = FIRST_TIME_CHECKLIST[country] || DEFAULT_CHECKLIST;
  const name = getCountryName(country);
  const intro = pick(INTROS.firstTime)();

  const encouragements = [
    'You\'ve got this! Take it one step at a time.',
    'Every experienced voter was once a first-timer — you\'ll do great!',
    'Your voice matters. This is an important step in your democratic journey!',
    'Don\'t hesitate to ask for help at the polling station — staff are there to assist you.',
  ];

  return `<h4>🎉 Welcome, First-Time Voter!</h4>
<p>${intro}</p>
<p>Here's your personalized guide for voting in ${name}:</p>

<h5>📋 Your Voting Checklist:</h5>
<ol>
${checklist.steps.slice(0, 5).map((s) => `<li><strong>${s.label}</strong> — ${s.sublabel}</li>`).join('\n')}
</ol>

<h5>💡 Helpful Tips:</h5>
<ul>
${checklist.tips.map((t) => `<li>${t}</li>`).join('\n')}
</ul>
${dynamicTip(pick(encouragements))}
<p>Check out the <strong>Interactive Checklist</strong> in the sidebar for a step-by-step guide you can track!</p>`;
}

function generateElectionProcessResponse(country, ctx) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const name = getCountryName(country);
  const intro = pick(INTROS.process)(name);

  return `<h4>🏛️ Election Process in ${name}</h4>
<p>${intro}</p>
<ol>
${stages.map((s, i) => `<li><strong>${s.title}</strong> — ${s.description}</li>`).join('\n')}
</ol>
${dynamicTip('Check the Election Timeline page in the sidebar for a detailed visual breakdown!')}
<p>Want to dive deeper into any specific stage? Just ask!</p>`;
}

function generateTimelineResponse(country) {
  const name = getCountryName(country);

  return `<h4>📅 Election Timeline for ${name}</h4>
<p>I've prepared a detailed visual timeline for you! You can view it on the <strong>Election Timeline</strong> page — just click it in the sidebar.</p>

<p>The timeline shows all 5 major election stages with their current status and key details for each phase.</p>

<div class="tip-box">💡 You can also switch between different countries on the Timeline page to compare election processes!</div>

<p>Would you like me to explain any specific stage in detail?</p>`;
}

function generateEVMResponse() {
  return `<h4>🖥️ Electronic Voting Machine (EVM)</h4>
<p>An <strong>EVM</strong> is used in India to cast votes electronically. It consists of two units:</p>

<ul>
<li><strong>Ballot Unit:</strong> Displays candidate names, symbols, and a blue button next to each</li>
<li><strong>Control Unit:</strong> Operated by the polling officer to enable voting</li>
</ul>

<h5>How to use an EVM:</h5>
<ol>
<li>The polling officer presses the ballot button on the Control Unit</li>
<li>A light appears next to each candidate on the Ballot Unit</li>
<li>Press the <strong>blue button</strong> next to your preferred candidate</li>
<li>A beep confirms your vote has been recorded</li>
<li>Check the <strong>VVPAT slip</strong> (visible for 7 seconds) to verify</li>
</ol>

<div class="tip-box">🔒 <strong>Fun fact:</strong> EVMs are standalone devices not connected to any network, making them tamper-safe. Each EVM can record up to 2,000 votes.</div>`;
}

function generateNOTAResponse() {
  return `<h4>🚫 NOTA — None of The Above</h4>
<p><strong>NOTA</strong> is an option available on the EVM in Indian elections since 2013 following a Supreme Court ruling.</p>

<h5>Key facts about NOTA:</h5>
<ul>
<li>It allows you to reject all candidates without invalid-izing your vote</li>
<li>NOTA is the <strong>last option</strong> on the ballot unit</li>
<li>NOTA votes are counted and shown in the results</li>
<li>However, even if NOTA gets the most votes, the candidate with the highest votes still wins</li>
<li>It's a way to formally express dissatisfaction with all candidates</li>
</ul>

<div class="tip-box">⚖️ The symbol for NOTA is a <strong>ballot paper with a cross mark</strong>, designed by the National Institute of Design.</div>`;
}

function generateMCCResponse() {
  return `<h4>📜 Model Code of Conduct (MCC)</h4>
<p>The <strong>Model Code of Conduct</strong> is a set of guidelines issued by the Election Commission of India that comes into effect as soon as elections are announced.</p>

<h5>Key rules under MCC:</h5>
<ul>
<li>Government cannot announce new schemes or projects</li>
<li>No use of government resources for campaigning</li>
<li>No appeals based on religion, caste, or communal feelings</li>
<li>No personal attacks or character assassination</li>
<li>Polling booths must not be used for campaigning</li>
<li>Campaign silence period: <strong>48 hours</strong> before polling</li>
</ul>

<div class="tip-box">⚠️ Violations can lead to FIRs, debarring candidates, or postponing elections in that constituency.</div>`;
}

function generatePostalVoteResponse(country) {
  const name = getCountryName(country);
  if (country === 'IN') {
    return `<h4>📬 Postal Voting in ${name}</h4>
<p>Postal voting (voting by mail) in India is available to specific categories of voters:</p>
<ul>
<li><strong>Service voters</strong> (armed forces, diplomatic staff)</li>
<li><strong>Absentee voters:</strong> Senior citizens (80+) and Persons with Disability (PwD)</li>
<li><strong>Essential service personnel</strong> on election duty</li>
<li><strong>Preventive detention</strong> detainees</li>
</ul>
<div class="tip-box">📌 General voters must vote in person at their assigned polling station. If you've moved, update your registration using Form 6A.</div>`;
  }
  return `<h4>📬 Postal/Absentee Voting in ${name}</h4>
<p>Many democracies allow postal or absentee voting for citizens who cannot attend the polling station in person.</p>
<ul>
<li>Check your eligibility with the local election authority</li>
<li>Apply before the deadline (usually weeks before election day)</li>
<li>Receive your ballot by mail, complete it, and return it</li>
<li>Some countries also allow proxy voting</li>
</ul>
<div class="tip-box">💡 Contact your national or local election commission for specific postal voting procedures.</div>`;
}

function generateElectoralCollegeResponse() {
  return `<h4>🏛️ The Electoral College (United States)</h4>
<p>The <strong>Electoral College</strong> is the system used to elect the U.S. President and Vice President.</p>

<h5>How it works:</h5>
<ol>
<li>Each state gets electors equal to its <strong>Senators (2) + Representatives</strong></li>
<li>There are <strong>538 total electors</strong></li>
<li>A candidate needs <strong>270 electoral votes</strong> to win</li>
<li>Most states use <strong>winner-take-all</strong>: the candidate with the most popular votes gets all electors</li>
<li>Maine and Nebraska use the <strong>congressional district method</strong></li>
</ol>

<div class="tip-box">📊 This means a candidate can win the presidency without winning the national popular vote, as happened in 2000 and 2016.</div>`;
}

function generatePrimariesResponse() {
  return `<h4>🗳️ Primaries & Caucuses (United States)</h4>
<p>Before the general election, parties select their candidates through:</p>

<h5>Primaries:</h5>
<ul>
<li><strong>Open primaries:</strong> Any registered voter can participate</li>
<li><strong>Closed primaries:</strong> Only registered party members can vote</li>
<li>Conducted like regular elections at polling places</li>
</ul>

<h5>Caucuses:</h5>
<ul>
<li>Local meetings where voters discuss and vote openly</li>
<li>More time-consuming and interactive than primaries</li>
<li>Fewer states use caucuses today</li>
</ul>

<div class="tip-box">📅 Primaries typically run from <strong>February to June</strong> in presidential election years, starting with the Iowa Caucus and New Hampshire Primary.</div>`;
}

function generateRightsResponse(country) {
  const name = getCountryName(country);
  const intro = pick(INTROS.rights)(name);
  return `<h4>⚖️ Your Voting Rights in ${name}</h4>
<p>${intro}</p>
<ul>
<li>✅ The right to a <strong>secret ballot</strong> — no one can see your vote</li>
<li>✅ The right to <strong>assistance</strong> if you need help at the polling station</li>
<li>✅ The right to vote <strong>without intimidation</strong> or pressure</li>
<li>✅ The right to <strong>report violations</strong> to election authorities</li>
<li>✅ The right to <strong>accessible polling stations</strong></li>
</ul>
${dynamicTip('If anyone tries to prevent you from voting or intimidate you, report it to election authorities or police immediately.')}
${dynamicFollowUp(['rights'])}`;
}

function generateCountingResponse(country) {
  const stages = ELECTION_STAGES[country] || DEFAULT_STAGES;
  const countStage = stages[stages.length - 1];
  const name = getCountryName(country);
  const intro = pick(INTROS.counting)(name);

  return `<h4>📊 Counting & Results in ${name}</h4>
<p>${intro}</p>
<p>${countStage.description}</p>
<h5>The counting process:</h5>
<ul>
${countStage.details.map((d) => `<li>${d}</li>`).join('\n')}
</ul>
${dynamicTip('Results are usually updated live on the official election commission website.')}
${dynamicFollowUp(['counting', 'result'])}`;
}

function generateGreeting() {
  const greetings = [
    `<h4>👋 Hello there!</h4><p>Welcome to the <strong>Election Guide Assistant</strong>! I'm here to make elections easy to understand.</p>`,
    `<h4>👋 Hi! Great to see you here.</h4><p>I'm your <strong>Election Guide Assistant</strong> — ready to help you navigate the democratic process.</p>`,
    `<h4>👋 Hey! Welcome!</h4><p>I'm the <strong>Election Guide Assistant</strong>, here to walk you through everything about voting.</p>`,
  ];
  return `${pick(greetings)}
<p>Here's what I can help with:</p>
<ul>
<li>🗳️ <strong>How to vote</strong> — step-by-step guidance</li>
<li>📋 <strong>Voter registration</strong> — how to get on the voter list</li>
<li>📄 <strong>Documents needed</strong> — what to bring on voting day</li>
<li>📅 <strong>Election timeline</strong> — stages of the election process</li>
<li>🎉 <strong>First-time voter guide</strong> — special help for new voters</li>
</ul>
<p>Which country are you from? This helps me give the most relevant info. 🌍</p>`;
}

function generateThanks() {
  const responses = [
    `<p>You're welcome! 😊 Glad I could help.</p>`,
    `<p>Happy to help! 🙏</p>`,
    `<p>Anytime! 😊 That's what I'm here for.</p>`,
    `<p>No problem at all! 🌟</p>`,
  ];
  const reminders = [
    'Every vote counts — your voice matters in democracy!',
    'Prepare your documents early to avoid last-minute stress.',
    'Voting is your fundamental right — exercise it proudly!',
    'Encourage friends and family to vote too!',
  ];
  return `${pick(responses)}
${dynamicTip(pick(reminders))}
<p>Feel free to ask if you have more questions!</p>`;
}

function generateHelp() {
  return `<h4>🤖 What I Can Help You With</h4>
<p>I'm your <strong>Election Guide Assistant</strong>! Here's what I can do:</p>

<ul>
<li>📋 Explain the <strong>voter registration</strong> process</li>
<li>📄 List the <strong>documents you need</strong> for voting</li>
<li>🗳️ Walk you through <strong>voting day</strong> step by step</li>
<li>🎉 Provide a <strong>first-time voter guide</strong></li>
<li>📅 Show the <strong>election timeline</strong> and stages</li>
<li>❓ Answer <strong>frequently asked questions</strong></li>
<li>🌍 Provide <strong>country-specific</strong> election information</li>
</ul>

<p>I currently have detailed info for 🇮🇳 India, 🇺🇸 United States, and 🇬🇧 United Kingdom, with general guidance for other countries.</p>

<div class="tip-box">🚫 I stay completely <strong>neutral</strong> and will never suggest who to vote for or share political opinions. I only provide educational information.</div>`;
}

// Country detection from message
function detectCountry(text) {
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

// Main AI processing function
export function processMessage(userMessage, userState, messageHistory = []) {
  const { country = 'IN' } = userState;
  const ctx = extractUserContext(userMessage);

  // 1. Safety check
  if (isSafetyViolation(userMessage)) {
    return { text: SAFETY_RESPONSE, detectedCountry: null };
  }

  // 2. Country detection
  const detectedCountry = detectCountry(userMessage);

  // 3. Country-only message
  if (detectedCountry && userMessage.trim().split(/\s+/).length <= 4) {
    const cName = getCountryName(detectedCountry);
    const greetings = [
      `Great! I'll now tailor my answers for <strong>${cName}</strong>.`,
      `Got it! Switching to election info for <strong>${cName}</strong>.`,
      `Perfect — I'll focus on <strong>${cName}</strong> election details.`,
      `Noted! Here's what I can help you with for <strong>${cName}</strong>:`,
    ];
    return {
      text: `<p>${pick(greetings)}</p>
<p>What would you like to know?</p>
<ul>
<li>📋 How to <strong>register to vote</strong></li>
<li>🗳️ What happens on <strong>voting day</strong></li>
<li>📅 The full <strong>election process</strong></li>
<li>🎉 <strong>First-time voter</strong> guide</li>
<li>📄 <strong>Documents needed</strong></li>
</ul>`,
      detectedCountry,
    };
  }

  // 4. Topic matching with context
  const activeCountry = detectedCountry || country;
  for (const topic of TOPIC_HANDLERS) {
    for (const pattern of topic.patterns) {
      if (pattern.test(userMessage)) {
        return {
          text: topic.handler(activeCountry, ctx),
          detectedCountry,
        };
      }
    }
  }

  // 5. Smart fallback — try to find partial matches in FAQ data
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

  // 6. Conversational fallback
  const fallbacks = [
    `<p>That's an interesting question! I specialize in election processes. Here's what I can help you with:</p>`,
    `<p>I'd love to help! While that's outside my expertise, here are topics I know well:</p>`,
    `<p>Hmm, I'm not sure about that one, but I'm great at explaining these election topics:</p>`,
    `<p>Good question! Let me point you to what I can help with:</p>`,
  ];
  return {
    text: `${pick(fallbacks)}
<ul>
<li>📋 <strong>Voter Registration</strong> — "How do I register to vote?"</li>
<li>📄 <strong>Required Documents</strong> — "What documents do I need?"</li>
<li>🗳️ <strong>Voting Day Guide</strong> — "What happens on voting day?"</li>
<li>🎉 <strong>First-Time Voter</strong> — "I'm a first-time voter"</li>
<li>📅 <strong>Election Process</strong> — "Explain the election process"</li>
</ul>
${dynamicTip('Try asking one of the questions above, or check the FAQ section in the sidebar!')}`,
    detectedCountry,
  };
}
