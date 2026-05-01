// ─── Election Data for Cloud Functions ────────────────────────────────────────
// Mirrored from src/data/electionData.js for use in Cloud Functions (CommonJS)

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
];

const DEFAULT_STAGES = [
  {
    title: 'Voter Registration',
    description: 'Citizens register to be included on the electoral roll.',
    details: ['Check eligibility', 'Complete registration form', 'Submit required documents', 'Confirm registration'],
    status: 'completed',
  },
  {
    title: 'Nomination of Candidates',
    description: 'Political parties and independent candidates file nomination papers.',
    details: ['File nomination papers', 'Pay nomination deposit', 'Scrutiny of nominations', 'Withdrawal of candidature'],
    status: 'completed',
  },
  {
    title: 'Campaigning',
    description: 'Candidates campaign to win voter support within election rules.',
    details: ['Public rallies and speeches', 'Door-to-door canvassing', 'Media campaigns', 'Campaign finance reporting'],
    status: 'active',
  },
  {
    title: 'Polling Day',
    description: 'Voters cast their ballots at designated polling stations.',
    details: ['Bring valid ID', 'Visit your assigned polling station', 'Receive ballot paper', 'Mark your choice', 'Submit ballot'],
    status: 'upcoming',
  },
  {
    title: 'Counting & Results',
    description: 'Votes are counted and results declared.',
    details: ['Ballot boxes sealed and transported', 'Counting begins under supervision', 'Results announced', 'Winner declared'],
    status: 'upcoming',
  },
];

const ELECTION_STAGES = {
  IN: [
    {
      title: 'Voter Registration (Form 6)',
      description: 'Indian citizens aged 18+ register using Form 6 at their local ERO or online via voters.eci.gov.in.',
      details: ['Visit voters.eci.gov.in or your local ERO office', 'Fill Form 6 with personal details', 'Attach Aadhaar, passport photo, and address proof', 'Track status online within 30 days'],
      status: 'completed',
    },
    {
      title: 'Model Code of Conduct (MCC)',
      description: 'The ECI issues the MCC when elections are announced, restricting government actions.',
      details: ['No new government schemes announced', 'No use of government resources for campaigning', '48-hour campaign silence before polling', 'Violations reported to ECI'],
      status: 'completed',
    },
    {
      title: 'Campaigning Period',
      description: 'Candidates and parties campaign across constituencies.',
      details: ['Public rallies with police permission', 'TV, radio, and social media ads', 'Paid news monitoring by ECI', 'Campaign silence 48 hours before polling'],
      status: 'active',
    },
    {
      title: 'Polling Day',
      description: 'Voters cast ballots using Electronic Voting Machines (EVMs) at polling booths.',
      details: ['Carry your Voter ID or any of 12 approved photo IDs', 'Go to your assigned polling booth (check on Voter Helpline App)', 'Give your name to the presiding officer', 'Press the blue button on EVM next to your candidate', 'Check VVPAT slip (visible 7 seconds)'],
      status: 'upcoming',
    },
    {
      title: 'Counting & Results',
      description: 'EVMs are transported to counting centres and results declared by ECI.',
      details: ['Counting begins at 8 AM on counting day', 'Party agents present for transparency', 'Results updated live on results.eci.gov.in', 'Winning candidate declared by Returning Officer'],
      status: 'upcoming',
    },
  ],
};

const DEFAULT_CHECKLIST = {
  documents: [
    { id: 'doc1', label: 'Government Photo ID', sublabel: 'Passport, driving licence, or national ID card' },
    { id: 'doc2', label: 'Proof of Address', sublabel: 'Utility bill, bank statement, or official letter' },
    { id: 'doc3', label: 'Voter Registration Card', sublabel: 'If applicable in your country' },
  ],
  steps: [
    { id: 'step1', label: 'Check registration status', sublabel: 'Confirm you are on the electoral roll' },
    { id: 'step2', label: 'Find your polling station', sublabel: 'Use your election authority\'s website' },
    { id: 'step3', label: 'Know the election date', sublabel: 'Mark it in your calendar' },
    { id: 'step4', label: 'Prepare your documents', sublabel: 'Gather all required IDs the night before' },
    { id: 'step5', label: 'Go vote!', sublabel: 'Cast your ballot on election day' },
  ],
  tips: [
    'Arrive early to avoid long queues.',
    'Your vote is completely secret.',
    'If you need assistance, polling staff are required to help you.',
    'Take your time — there is no rush in the voting booth.',
  ],
};

const FIRST_TIME_CHECKLIST = {
  IN: {
    documents: [
      { id: 'doc1', label: 'Voter ID Card (EPIC)', sublabel: 'Issued by Election Commission of India' },
      { id: 'doc2', label: 'Alternative Photo ID (if no EPIC)', sublabel: 'Aadhaar, Passport, Driving Licence, PAN Card, etc.' },
      { id: 'doc3', label: 'Voter Information Slip', sublabel: 'Provided by your Booth Level Officer before election day' },
    ],
    steps: [
      { id: 'step1', label: 'Check your name on the voter list', sublabel: 'Visit electoralsearch.eci.gov.in' },
      { id: 'step2', label: 'Find your polling booth', sublabel: 'Use the Voter Helpline App or 1950 helpline' },
      { id: 'step3', label: 'Know your constituency & candidates', sublabel: 'Check your voter slip or ECI website' },
      { id: 'step4', label: 'Carry valid ID on polling day', sublabel: 'EPIC or any of the 12 approved photo IDs' },
      { id: 'step5', label: 'Press the EVM button for your choice', sublabel: 'Blue button next to your candidate\'s name & symbol' },
      { id: 'step6', label: 'Verify VVPAT slip', sublabel: 'Check the slip visible for 7 seconds confirms your vote' },
    ],
    tips: [
      'Register at voters.eci.gov.in or through the Voter Helpline App.',
      'The voting process takes only 2–5 minutes once inside the booth.',
      'Voter ID is free — never pay anyone to get yours.',
      'You can check your polling booth assignment on the ECI website or Voter Helpline App.',
      'If your name is not on the list, contact your local ERO immediately.',
    ],
  },
};

const DEFAULT_FAQ = [
  { question: 'What is the minimum age to vote?', answer: '<p>The minimum voting age in most democracies is <strong>18 years</strong>.</p>' },
  { question: 'Can I vote if I am not registered?', answer: '<p>No, you must be on the electoral roll to vote. Register with your local election authority before the deadline.</p>' },
  { question: 'Is voting compulsory?', answer: '<p>Voting is compulsory in some countries (like Australia and Brazil) and voluntary in others. Check your country\'s rules.</p>' },
  { question: 'What if I make a mistake on my ballot?', answer: '<p>Ask a polling officer for a replacement ballot. Spoiled ballots are not counted.</p>' },
  { question: 'Can I vote if I am abroad?', answer: '<p>Many countries allow postal or absentee voting for citizens living abroad. Contact your embassy or election authority.</p>' },
];

const FAQ_DATA = {
  IN: [
    { question: 'What is the minimum age to vote in India?', answer: '<p>You must be at least <strong>18 years old</strong> as of January 1 of the election year to be eligible to vote in India.</p>' },
    { question: 'How do I register as a voter in India?', answer: '<p>You can register online at <strong>voters.eci.gov.in</strong> using Form 6, or visit your local Electoral Registration Officer (ERO) office with required documents.</p>' },
    { question: 'What documents can I use as ID at the polling booth?', answer: '<p>India allows 12 photo IDs: Voter ID (EPIC), Aadhaar, Passport, Driving Licence, PAN Card, MNREGA Job Card, Photo Passbook of Post Office, Smart Card by RGI, Pension Document, NPR Smart Card, MP/MLA/MLC ID, or Service Photo ID issued by Central/State Government.</p>' },
    { question: 'What is an EVM?', answer: '<p>An <strong>Electronic Voting Machine (EVM)</strong> is a standalone device used in Indian elections to cast votes electronically. It consists of a Ballot Unit and Control Unit, and is not connected to any network.</p>' },
    { question: 'What is NOTA?', answer: '<p><strong>NOTA (None of The Above)</strong> is the last option on the EVM, allowing voters to formally reject all candidates. NOTA votes are counted but even if NOTA gets the most votes, the candidate with the highest votes wins.</p>' },
  ],
};

module.exports = {
  COUNTRIES,
  ELECTION_STAGES,
  DEFAULT_STAGES,
  FIRST_TIME_CHECKLIST,
  DEFAULT_CHECKLIST,
  FAQ_DATA,
  DEFAULT_FAQ,
};
