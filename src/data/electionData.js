// Election data and AI knowledge base for various countries

export const COUNTRIES = [
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

export const ELECTION_STAGES = {
  IN: [
    {
      title: 'Voter Registration',
      period: 'Ongoing (Form 6 & 6A)',
      description: 'Citizens aged 18+ register on the Electoral Roll via the Election Commission of India website or Voter Helpline App.',
      details: [
        'Fill Form 6 online or offline at the local ERO office',
        'Attach identity proof (Aadhaar, PAN, etc.) and address proof',
        'The Electoral Registration Officer (ERO) verifies your details',
        'You receive an EPIC (Voter ID) card upon approval',
      ],
      status: 'completed',
    },
    {
      title: 'Election Announcement',
      period: 'Model Code of Conduct enforced',
      description: 'The Election Commission announces election dates and the Model Code of Conduct comes into effect immediately.',
      details: [
        'No new government schemes can be announced',
        'Political parties cannot use government resources for campaigning',
        'Dates for nominations, scrutiny, and withdrawal are published',
        'Polling stations and booth-level officers are finalized',
      ],
      status: 'completed',
    },
    {
      title: 'Nomination & Campaigning',
      period: '2-3 weeks before voting',
      description: 'Candidates file nominations. Parties and candidates campaign through rallies, door-to-door visits, and media.',
      details: [
        'Candidates file nomination papers with returning officers',
        'Scrutiny of nominations takes place within 2 days',
        'Candidates can withdraw up to 2 days after scrutiny',
        'Campaign silence period: 48 hours before polling day',
      ],
      status: 'active',
    },
    {
      title: 'Voting Day',
      period: 'Typically 7 AM - 6 PM',
      description: 'Voters cast their ballot using Electronic Voting Machines (EVMs) at designated polling booths.',
      details: [
        'Carry your Voter ID (EPIC) or any approved photo ID',
        'Your name must be on the voter list at that booth',
        'Mark your vote using the EVM button next to your candidate',
        'Collect the VVPAT slip to verify your vote',
        'Indelible ink is applied to your left index finger',
      ],
      status: 'upcoming',
    },
    {
      title: 'Counting & Results',
      period: 'Usually a few days after last phase',
      description: 'Votes are counted under strict supervision. Results are declared constituency-wise.',
      details: [
        'EVMs are stored securely until counting day',
        'Counting happens at designated centers with observers',
        'Postal ballots are counted first, followed by EVM votes',
        'Results are updated live on the ECI website',
        'VVPAT verification of randomly selected booths',
      ],
      status: 'upcoming',
    },
  ],
  US: [
    {
      title: 'Voter Registration',
      period: 'Deadline varies by state (15-30 days before election)',
      description: 'Eligible U.S. citizens register to vote through their state\'s election office, online, by mail, or in person.',
      details: [
        'Must be a U.S. citizen, 18+ on Election Day',
        'Register at vote.gov or your state election website',
        'Some states offer same-day registration',
        'You may need a driver\'s license or SSN last 4 digits',
      ],
      status: 'completed',
    },
    {
      title: 'Primaries & Caucuses',
      period: 'February - June (presidential election years)',
      description: 'Parties select their candidates through primary elections or caucuses in each state.',
      details: [
        'Open primaries allow any registered voter; closed require party registration',
        'Caucuses involve local meetings and discussions',
        'Delegates are awarded based on results',
        'National conventions formally nominate candidates',
      ],
      status: 'completed',
    },
    {
      title: 'General Campaign',
      period: 'Summer through early November',
      description: 'Nominated candidates campaign nationally through debates, rallies, advertising, and media appearances.',
      details: [
        'Presidential debates are typically held in September-October',
        'Campaign finance is regulated by the FEC',
        'Early voting and absentee/mail ballots become available',
        'Voter registration drives intensify',
      ],
      status: 'active',
    },
    {
      title: 'Election Day',
      period: 'First Tuesday after first Monday in November',
      description: 'Voters cast ballots at their designated polling places or via mail/absentee ballots.',
      details: [
        'Bring valid photo ID (requirements vary by state)',
        'Polls are open approximately 12 hours (varies)',
        'You can vote for federal, state, and local offices',
        'Provisional ballots available if eligibility is questioned',
      ],
      status: 'upcoming',
    },
    {
      title: 'Counting & Certification',
      period: 'November - January',
      description: 'Votes are counted, results certified by states, and the Electoral College formally votes.',
      details: [
        'Each state certifies its results (usually within 30 days)',
        'Electoral College electors cast votes in December',
        'Congress counts electoral votes in January',
        'Inauguration Day is January 20th',
      ],
      status: 'upcoming',
    },
  ],
  UK: [
    {
      title: 'Voter Registration',
      period: 'Register by deadline (12 working days before election)',
      description: 'Citizens and eligible residents register to vote online at gov.uk or via paper form.',
      details: [
        'Must be 18+ (16+ in Scotland and Wales for devolved elections)',
        'British, Irish, or qualifying Commonwealth citizens can vote',
        'Register online with your National Insurance number',
        'Electoral register is updated annually',
      ],
      status: 'completed',
    },
    {
      title: 'Dissolution of Parliament',
      period: 'Up to 5 years after the last election',
      description: 'Parliament is dissolved, triggering a general election. A minimum of 25 working days before polling day.',
      details: [
        'The Prime Minister requests dissolution from the monarch',
        'All MPs cease to hold their seats',
        'Parliament cannot pass new laws during this period',
        'Caretaker conventions apply to the government',
      ],
      status: 'completed',
    },
    {
      title: 'Nominations & Campaigning',
      period: '~5 weeks before polling day',
      description: 'Candidates submit nominations. Campaign is conducted via canvassing, party broadcasts, and debates.',
      details: [
        'Candidates need 10 electors as subscribers and a £500 deposit',
        'Parties publish manifestos outlining their policies',
        'Broadcast media must give balanced coverage',
        'Spending limits apply to each constituency',
      ],
      status: 'active',
    },
    {
      title: 'Polling Day',
      period: 'Thursday, 7 AM - 10 PM',
      description: 'Voters visit their polling station and mark an X on the ballot paper next to their chosen candidate.',
      details: [
        'Bring your poll card (not required but helpful)',
        'Photo ID is now required in England (2023 onwards)',
        'Vote by marking X on the paper ballot',
        'Postal voting is available if applied in advance',
      ],
      status: 'upcoming',
    },
    {
      title: 'Count & Results',
      period: 'Overnight after polls close',
      description: 'Votes are counted at local counting centres. First results often arrive within hours.',
      details: [
        'First-past-the-post: candidate with most votes wins the seat',
        'Results announced by the returning officer at each count',
        'The party with a majority (326+ seats) forms the government',
        'If no majority, a hung parliament may lead to coalition talks',
      ],
      status: 'upcoming',
    },
  ],
};

// Default to India-like stages for unrecognized countries
export const DEFAULT_STAGES = [
  {
    title: 'Voter Registration',
    period: 'Before the election deadline',
    description: 'Register to vote through your country\'s official electoral body or election commission.',
    details: [
      'Check your eligibility (age, citizenship requirements)',
      'Register online, by mail, or at a registration center',
      'Provide identification documents as required',
      'Verify your registration before the deadline',
    ],
    status: 'completed',
  },
  {
    title: 'Election Announcement',
    period: 'Weeks to months before voting',
    description: 'The election authority announces election dates and sets rules for the campaign period.',
    details: [
      'Official dates for nominations and voting are published',
      'Campaign rules and spending limits are enforced',
      'Electoral boundaries and polling station locations are confirmed',
    ],
    status: 'completed',
  },
  {
    title: 'Campaigning Period',
    period: 'Several weeks before election day',
    description: 'Candidates and parties campaign to win voter support through rallies, media, and outreach.',
    details: [
      'Candidates present their platforms and policies',
      'Debates may be organized by media or electoral bodies',
      'A campaign silence period may apply before voting day',
    ],
    status: 'active',
  },
  {
    title: 'Voting Day',
    period: 'The designated election day',
    description: 'Voters head to their designated polling station to cast their ballot.',
    details: [
      'Bring your voter ID or required identification',
      'Find your designated polling station',
      'Cast your vote in the prescribed manner (paper/electronic)',
      'Your vote is secret - no one can see who you voted for',
    ],
    status: 'upcoming',
  },
  {
    title: 'Counting & Results',
    period: 'After polls close',
    description: 'Ballots are counted and results are officially declared.',
    details: [
      'Counting is done by trained officials with observers present',
      'Results are announced as they come in',
      'The winning candidate/party is declared',
      'Legal challenges can be filed if there are disputes',
    ],
    status: 'upcoming',
  },
];

export const FIRST_TIME_CHECKLIST = {
  IN: {
    documents: [
      { id: 'd1', label: 'Aadhaar Card', sublabel: 'Primary ID proof' },
      { id: 'd2', label: 'Voter ID (EPIC) Card', sublabel: 'Apply via Form 6' },
      { id: 'd3', label: 'Passport-size photograph', sublabel: '2 recent photos' },
      { id: 'd4', label: 'Address proof document', sublabel: 'Utility bill, bank statement, etc.' },
      { id: 'd5', label: 'Age proof document', sublabel: 'Birth certificate, school certificate' },
    ],
    steps: [
      { id: 's1', label: 'Check eligibility (18+ on Jan 1 of qualifying year)', sublabel: 'Mandatory' },
      { id: 's2', label: 'Register on the Electoral Roll (Form 6)', sublabel: 'Online or at ERO office' },
      { id: 's3', label: 'Verify your name on the voter list', sublabel: 'electoralsearch.eci.gov.in' },
      { id: 's4', label: 'Find your polling booth', sublabel: 'Check poll card or ECI website' },
      { id: 's5', label: 'Know your candidates', sublabel: 'Read about their backgrounds and plans' },
      { id: 's6', label: 'Visit your polling booth on Voting Day', sublabel: 'Bring Voter ID + alt photo ID' },
      { id: 's7', label: 'Cast your vote using the EVM', sublabel: 'Press the button next to your candidate' },
      { id: 's8', label: 'Verify on the VVPAT slip', sublabel: 'Check the printed slip behind the glass' },
    ],
    tips: [
      'Download the Voter Helpline App for easy access',
      'Special queues may be available for differently-abled voters, senior citizens, and women',
      'You can use NOTA (None of the Above) if you don\'t prefer any candidate',
      'Voting is a right protected by Article 326 of the Indian Constitution',
    ],
  },
  US: {
    documents: [
      { id: 'd1', label: 'Government-issued photo ID', sublabel: 'Driver\'s license or state ID (varies by state)' },
      { id: 'd2', label: 'Social Security Number', sublabel: 'Last 4 digits for registration' },
      { id: 'd3', label: 'Proof of address', sublabel: 'Utility bill or bank statement' },
      { id: 'd4', label: 'Proof of citizenship', sublabel: 'Birth certificate or passport' },
    ],
    steps: [
      { id: 's1', label: 'Check your eligibility (18+, U.S. citizen)', sublabel: 'Mandatory requirement' },
      { id: 's2', label: 'Register to vote at vote.gov', sublabel: 'Online, by mail, or in person' },
      { id: 's3', label: 'Know your registration deadline', sublabel: 'Varies by state (15-30 days before)' },
      { id: 's4', label: 'Find your polling place', sublabel: 'Use your state election website' },
      { id: 's5', label: 'Review the sample ballot', sublabel: 'Know who and what is on the ballot' },
      { id: 's6', label: 'Consider early or absentee voting', sublabel: 'If available in your state' },
      { id: 's7', label: 'Go to your polling place on Election Day', sublabel: 'Bring required ID' },
      { id: 's8', label: 'Cast and confirm your ballot', sublabel: 'Follow the poll worker\'s instructions' },
    ],
    tips: [
      'Many employers are required to give you time off to vote',
      'You can bring a cheat sheet to the poll with your choices',
      'If you\'re in line before polls close, you\'re entitled to vote',
      'Check if your state allows online voter registration',
    ],
  },
  UK: {
    documents: [
      { id: 'd1', label: 'Photo ID (passport, driving licence)', sublabel: 'Required in England since 2023' },
      { id: 'd2', label: 'National Insurance number', sublabel: 'For online registration' },
      { id: 'd3', label: 'Poll card', sublabel: 'Sent to your address before election' },
    ],
    steps: [
      { id: 's1', label: 'Check eligibility (18+, British/Irish/Commonwealth citizen)', sublabel: 'Mandatory' },
      { id: 's2', label: 'Register at gov.uk/register-to-vote', sublabel: '12 working days before election' },
      { id: 's3', label: 'Receive and keep your poll card', sublabel: 'Tells you where to vote' },
      { id: 's4', label: 'Research candidates in your constituency', sublabel: 'Check party manifestos' },
      { id: 's5', label: 'Apply for a postal vote if needed', sublabel: 'Deadline is 11 working days before' },
      { id: 's6', label: 'Bring photo ID to the polling station', sublabel: 'Required in England' },
      { id: 's7', label: 'Mark X next to your chosen candidate', sublabel: 'Use the pencil provided' },
      { id: 's8', label: 'Place your ballot in the ballot box', sublabel: 'Fold it once before inserting' },
    ],
    tips: [
      'You can vote by proxy if you can\'t attend in person',
      'Use whocanivotefor.co.uk to find your candidates',
      'Polling stations are staffed by council employees, not politicians',
      'You don\'t need your poll card to vote, but ID is required',
    ],
  },
};

export const DEFAULT_CHECKLIST = {
  documents: [
    { id: 'd1', label: 'Government-issued photo ID', sublabel: 'Passport, national ID, or driving license' },
    { id: 'd2', label: 'Proof of address', sublabel: 'Utility bill, bank statement, or official letter' },
    { id: 'd3', label: 'Voter registration confirmation', sublabel: 'Proof you are registered to vote' },
  ],
  steps: [
    { id: 's1', label: 'Verify your eligibility to vote', sublabel: 'Check age and citizenship requirements' },
    { id: 's2', label: 'Register with your electoral body', sublabel: 'Before the registration deadline' },
    { id: 's3', label: 'Confirm your registration status', sublabel: 'Check the voter roll/list' },
    { id: 's4', label: 'Find your polling station', sublabel: 'Usually near your registered address' },
    { id: 's5', label: 'Research the candidates', sublabel: 'Know who is running and their platforms' },
    { id: 's6', label: 'Go to your polling station on voting day', sublabel: 'Bring required ID documents' },
    { id: 's7', label: 'Cast your vote', sublabel: 'Follow instructions at the polling station' },
  ],
  tips: [
    'Check your country\'s official election commission website for specific details',
    'Register early to avoid last-minute issues',
    'Your vote is always secret and protected by law',
    'If you have questions, contact your local election office',
  ],
};

export const FAQ_DATA = {
  IN: [
    {
      question: 'How do I register to vote in India?',
      answer: `You can register online via the National Voter Service Portal (nvsp.in) or through the Voter Helpline App. Fill <strong>Form 6</strong> with your details, upload photo ID and address proof, and submit. You can also visit your local <strong>Electoral Registration Officer (ERO)</strong> office to register in person. The process is free.`,
    },
    {
      question: 'What documents do I need on voting day?',
      answer: `Your primary document is the <strong>EPIC (Voter ID) card</strong>. If you don't have it, the Election Commission accepts 12 alternative photo IDs including Aadhaar, Passport, Driving License, PAN Card, and others. Carry at least one valid photo identification.`,
    },
    {
      question: 'What is an EVM and how does it work?',
      answer: `An <strong>Electronic Voting Machine (EVM)</strong> is used to cast votes in India. It has a <strong>Ballot Unit</strong> (with candidate names and symbols) and a <strong>Control Unit</strong> (operated by the polling officer). You press the blue button next to your candidate. A <strong>VVPAT</strong> (Voter Verifiable Paper Audit Trail) machine prints a slip so you can verify your vote.`,
    },
    {
      question: 'What is NOTA?',
      answer: `<strong>NOTA</strong> stands for "None of The Above". It allows you to officially register that you do not wish to vote for any of the contesting candidates. It was introduced after a Supreme Court ruling in 2013. NOTA votes are counted but do not affect the result — the candidate with the most votes still wins.`,
    },
    {
      question: 'Can I vote if my name is not on the voter list?',
      answer: `Unfortunately, <strong>no</strong>. Your name must be on the electoral roll for your constituency. You can check your name at <strong>electoralsearch.eci.gov.in</strong>. If missing, file Form 6 to register, but this must be done before the deadline for the current election.`,
    },
    {
      question: 'What happens on voting day?',
      answer: `<ul>
        <li>Go to your designated polling booth (check your poll card)</li>
        <li>Stand in the queue; your identity is verified by the polling officer</li>
        <li>Indelible ink is applied to your left index finger</li>
        <li>Enter the voting compartment and press the button next to your candidate on the EVM</li>
        <li>Verify the VVPAT slip matches your choice</li>
        <li>Exit the booth — you're done!</li>
      </ul>`,
    },
    {
      question: 'What is the Model Code of Conduct?',
      answer: `The <strong>Model Code of Conduct (MCC)</strong> is a set of guidelines issued by the Election Commission that kicks in when elections are announced. It ensures free and fair elections by restricting the ruling government from announcing new policies, using state machinery for campaigns, or making appeals based on religion or caste.`,
    },
    {
      question: 'Can I vote from another city?',
      answer: `Currently, you must vote at the <strong>polling station assigned to your registered address</strong>. If you've moved, update your voter registration to your new address using <strong>Form 6A</strong>. Postal ballot is available for service voters, absentee voters (senior citizens 80+, PwD), and essential service personnel.`,
    },
  ],
  US: [
    {
      question: 'How do I register to vote in the United States?',
      answer: `Visit <strong>vote.gov</strong> to register online, by mail, or in person. You'll need your <strong>driver's license number</strong> or the last 4 digits of your <strong>Social Security Number</strong>. Registration deadlines vary by state — some allow same-day registration. Check your state's specific requirements.`,
    },
    {
      question: 'What documents do I need to vote?',
      answer: `Requirements vary by state. Many states require a <strong>government-issued photo ID</strong> (driver's license, passport, etc.). Some accept non-photo IDs like utility bills. A few states have no ID requirement. Check <strong>vote.org/voter-id-laws</strong> for your state's rules.`,
    },
    {
      question: 'What is the Electoral College?',
      answer: `The <strong>Electoral College</strong> is the system used to elect the President. Each state has a number of electors equal to its Congressional delegation (Senators + Representatives). When you vote, you're technically voting for electors pledged to your candidate. A candidate needs <strong>270 out of 538</strong> electoral votes to win.`,
    },
    {
      question: 'Can I vote early or by mail?',
      answer: `<strong>Most states</strong> offer early voting, allowing you to vote in person before Election Day. Many states also allow <strong>absentee/mail-in voting</strong> — some require an excuse, others don't. Check your state election office for deadlines and procedures.`,
    },
    {
      question: 'What happens on Election Day?',
      answer: `<ul>
        <li>Polls open early (usually 6-7 AM) and close in the evening (7-8 PM)</li>
        <li>Go to your assigned polling place with required ID</li>
        <li>Check in with the poll workers who verify your registration</li>
        <li>Receive your ballot (paper or electronic, depending on your jurisdiction)</li>
        <li>Vote for all races on the ballot (federal, state, local)</li>
        <li>Submit your completed ballot</li>
      </ul>`,
    },
    {
      question: 'What are primaries and caucuses?',
      answer: `<strong>Primaries</strong> are elections held by parties to select their candidates. <strong>Caucuses</strong> are local party meetings where voters discuss and choose candidates. Both award delegates who formally nominate the party's candidate at the national convention. Rules vary significantly by state and party.`,
    },
  ],
  UK: [
    {
      question: 'How do I register to vote in the UK?',
      answer: `Register online at <strong>gov.uk/register-to-vote</strong>. You'll need your <strong>National Insurance number</strong>. The deadline is 12 working days before the election. You can also register by post by contacting your local Electoral Registration Office.`,
    },
    {
      question: 'Do I need ID to vote?',
      answer: `In <strong>England</strong>, you now need <strong>photo ID</strong> to vote at a polling station (since 2023). Accepted IDs include passports, driving licences, and certain other documents. If you don't have one, you can apply for a free <strong>Voter Authority Certificate</strong>. In Scotland, Wales, and Northern Ireland, rules differ.`,
    },
    {
      question: 'How does the UK voting system work?',
      answer: `The UK uses <strong>First-Past-The-Post (FPTP)</strong> for general elections. The country is divided into 650 constituencies. Each constituency elects one MP. The candidate with the most votes wins that seat. The party with 326+ seats forms the government, and their leader becomes Prime Minister.`,
    },
    {
      question: 'What happens on polling day?',
      answer: `<ul>
        <li>Polling stations are open from <strong>7 AM to 10 PM</strong></li>
        <li>Go to your assigned polling station (on your poll card)</li>
        <li>Give your name and address to the staff</li>
        <li>Show your photo ID (in England)</li>
        <li>Receive your ballot paper</li>
        <li>Mark an <strong>X</strong> next to one candidate using the pencil provided</li>
        <li>Fold the ballot and put it in the ballot box</li>
      </ul>`,
    },
    {
      question: 'Can I vote by post or proxy?',
      answer: `Yes. Apply for a <strong>postal vote</strong> at least 11 working days before the election. For a <strong>proxy vote</strong> (someone votes on your behalf), apply at least 6 working days before. Emergency proxy voting is available in certain circumstances.`,
    },
  ],
};

export const DEFAULT_FAQ = [
  {
    question: 'How do I register to vote?',
    answer: `Visit your country's official <strong>election commission website</strong> to register. You typically need proof of identity, proof of address, and proof of citizenship. Registration can usually be done online, by mail, or in person at a government office.`,
  },
  {
    question: 'What documents are needed for voting?',
    answer: `Most countries require at least one <strong>government-issued photo ID</strong> such as a passport, national ID card, or driver's license. Some may accept additional forms of identification. Check your local election authority for the exact requirements.`,
  },
  {
    question: 'What happens on voting day?',
    answer: `<ul>
      <li>Go to your designated polling station</li>
      <li>Present your identification to the polling officials</li>
      <li>Receive your ballot (paper or electronic)</li>
      <li>Cast your vote in the private voting compartment</li>
      <li>Submit your completed ballot</li>
      <li>Your vote is completely secret</li>
    </ul>`,
  },
  {
    question: 'Is my vote secret?',
    answer: `Yes. In virtually all democracies, voting is done by <strong>secret ballot</strong>. No one can see who you voted for, and it is illegal for anyone to try to find out or force you to reveal your choice.`,
  },
  {
    question: 'What if I cannot go to the polling station?',
    answer: `Many countries offer <strong>postal voting</strong> (voting by mail), <strong>proxy voting</strong> (appointing someone to vote on your behalf), or <strong>early voting</strong>. Contact your local election office to learn about the options available to you.`,
  },
  {
    question: 'What is a general election vs. a local election?',
    answer: `A <strong>general election</strong> is an election to choose the national government (parliament, president, etc.). A <strong>local election</strong> is for choosing representatives at the city, county, or regional level. Both are important as they affect policies that impact your daily life.`,
  },
];
