/* =============================================================================
   calls.js — the phone calls from United 93.

   These matter twice over.

   As evidence, they are why Flight 93 is the one aircraft of the four that did
   not reach its target. The hijackers' script depended on the passengers
   believing a landing and negotiation were coming. The calls broke that, and
   the revolt followed within minutes.

   As a disputed claim, they are the subject of the "Faraday cage" argument:
   that an aluminium fuselage blocks radio, so the calls could not have
   happened and were fabricated. That argument is worth taking seriously
   enough to answer with the actual numbers, because the numbers settle it in
   a way that hand-waving about physics does not.

   THE NUMBERS

   Thirty-seven calls were placed from United 93 between the hijacking at 09:28
   and the crash at 10:03:11. Thirty-five of them were made on AIRFONE — the
   seatback air-to-ground radio-telephone fitted to the last nine rows — and
   exactly TWO were cellular. Both cell calls came after the aircraft had
   descended to about 5,000 feet.

   So the Faraday argument is aimed at 2 calls out of 37, and those two happen
   at precisely the altitude where a cell call is least surprising. The other
   35 used a system designed and certificated for making telephone calls from
   an airliner in cruise, which the argument does not touch at all.

   Call times below are approximate to the minute; sources vary by a minute or
   two on several of them, and the app says so rather than implying a precision
   the record does not carry. The Airfone/cellular split and the count are
   firm: they come from carrier records entered as evidence in the Moussaoui
   sentencing trial.
   ========================================================================== */

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

export const CALL_TOTALS = {
  total: 37,
  airfone: 35,
  cellular: 2,
  window: 'between the hijacking at 09:28 and impact at 10:03:11',
  src: 'commission',
};

/* A representative set, not the full 37 — the complete log is the carrier
   records, and many of the 37 are repeat calls by the same people. Times are
   approximate. */
export const CALLS = [
  { t: at(9, 30), row: 24, who: 'Tom Burnett', to: 'his wife Deena', type: 'airfone', dur: '28 s', durS: 28,
    note: 'First of four. He told her the hijackers claimed a bomb, and that he believed it was a ruse.' },
  { t: at(9, 31), row: null, who: 'A flight attendant', to: 'United maintenance', type: 'airfone', dur: '2 s', durS: 2,
    note: 'Speed-dial to the maintenance desk. Two seconds — it did not take.' },
  { t: at(9, 32), row: 34, who: 'A flight attendant', to: 'United maintenance', type: 'airfone', dur: '95 s', durS: 95,
    note: 'The same speed-dial, this time connecting.' },
  { t: at(9, 35), row: 33, who: 'Sandy Bradshaw', to: 'United maintenance, San Francisco', type: 'airfone', dur: '5 min 53 s', durS: 353,
    note: 'A flight attendant reporting the hijacking to her own airline.' },
  { t: at(9, 36), row: 25, who: 'Mark Bingham', to: 'his aunt’s house in California', type: 'airfone', dur: '5 s', durS: 5,
    note: 'Did not connect.' },
  { t: at(9, 37), row: 25, who: 'Mark Bingham', to: 'his mother Alice Hoagland', type: 'airfone', dur: '2 min 46 s', durS: 166,
    note: '"I want you to know that I love you. I am on a flight from Newark to San Francisco and there are three guys who have taken over the plane."' },
  { t: at(9, 37), row: 27, who: 'Jeremy Glick', to: 'his wife Lyz', type: 'airfone', dur: '20 min', durS: 1200,
    note: 'The longest call. Lyz told him about the World Trade Center — one of the moments the hijackers’ script breaks.' },
  { t: at(9, 37), row: 24, who: 'Tom Burnett', to: 'Deena', type: 'airfone', dur: '62 s', durS: 62,
    note: 'Learns of the World Trade Center. "They are talking about crashing this plane into the ground."' },
  { t: at(9, 39), row: 23, who: 'Lauren Grandcolas', to: 'her husband Jack’s answering machine', type: 'airfone', dur: '46 s', durS: 46,
    note: '"We have a little problem with the plane. I am totally fine. I just love you more than anything."' },
  { t: at(9, 41), row: 23, who: 'Lauren Grandcolas', to: 'a residence', type: 'airfone', dur: '4 s', durS: 4,
    note: 'One of several short attempts that did not hold.' },
  { t: at(9, 41), row: 25, who: 'Mark Bingham', to: 'a wrong number', type: 'airfone', dur: '3 s', durS: 3,
    note: 'Misdialled. Three seconds.' },
  { t: at(9, 42), row: 23, who: 'Lauren Grandcolas', to: 'a residence, three times', type: 'airfone', dur: '2 s, 3 s, 2 s', durS: 7,
    note: 'Three consecutive failures, billed separately. This is what a real call log looks like.' },
  { t: at(9, 42), row: 26, who: 'Joseph DeLuca', to: 'his father', type: 'airfone', dur: '14 s', durS: 14 , note: 'Brief.' },
  { t: at(9, 43), row: 26, who: 'Joseph DeLuca', to: 'his father', type: 'airfone', dur: '2 min 10 s', durS: 130,
    note: 'Reports the hijacking.' },
  { t: at(9, 43), row: 32, who: 'Todd Beamer', to: 'GTE operator Lisa Jefferson', type: 'airfone', dur: 'remainder of the flight',
    note: 'Held open to the end. He described the hijacking, recited the Lord’s Prayer with her, and asked her to call his family.' },
  { t: at(9, 44), row: 25, who: 'Tom Burnett', to: 'Deena', type: 'airfone', dur: '54 s', durS: 54,
    note: '"A group of us are getting ready to do something." Note the row: 25, not the 24 he used earlier.' },
  { t: at(9, 45), row: 34, who: 'Waleska Martinez', to: 'a friend’s office in Manhattan', type: 'airfone', dur: 'terminated',
    note: 'Did not hold.' },
  { t: at(9, 46), row: 26, who: 'Linda Gronlund', to: 'her sister’s answering machine', type: 'airfone', dur: '71 s', durS: 71,
    note: 'Left a message giving the location of her safe deposit box.' },
  { t: at(9, 47), row: 32, who: 'CeeCee Lyles', to: 'her husband’s answering machine', type: 'airfone', dur: '56 s', durS: 56,
    note: 'A flight attendant. Her first call, on an Airfone.' },
  { t: at(9, 49), row: 33, who: 'Marion Britton', to: 'her friend Fred Fiumano', type: 'airfone', dur: '3 min 52 s', durS: 232,
    note: 'Told him the plane had been hijacked and people had been killed. The line went dead.' },
  { t: at(9, 50), row: 33, who: 'Sandy Bradshaw', to: 'her husband Phil', type: 'airfone', dur: '7 min 50 s', durS: 470,
    note: 'Described the hijackers and the plan to rush them. The crew were boiling water.' },
  { t: at(9, 53), row: 33, who: 'Honor Elizabeth Wainio', to: 'her stepmother Esther', type: 'airfone', dur: '4 min 29 s', durS: 269,
    note: '"They are getting ready to break into the cockpit. I have to go. I love you."' },
  { t: at(9, 58), row: null, who: 'Edward Felt', to: '911, Westmoreland County', type: 'cellular', dur: '70 s', durS: 70,
    note: 'From a rear lavatory. Dispatcher Glenn Cramer took the call. One of only two cellular calls — placed at about 5,000 ft.' },
  { t: at(9, 58), row: null, who: 'CeeCee Lyles', to: 'her husband Lorne', type: 'cellular', dur: 'line went dead',
    note: 'The second cellular call, also at low altitude. "The plane is going down."' },
];

/* How long the calls actually lasted, computed from the durations above
   rather than characterised. The shape of the distribution is the point. */
export function durationStats() {
  const timed = CALLS.filter((c) => typeof c.durS === 'number').map((c) => c.durS);
  const sorted = [...timed].sort((a, b) => a - b);
  const sum = timed.reduce((a, b) => a + b, 0);
  const failed = timed.filter((d) => d <= 5);
  const held = timed.filter((d) => d > 5);
  const med = (xs) => xs.length % 2
    ? xs[(xs.length - 1) / 2]
    : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2;
  return {
    n: timed.length,
    meanS: sum / timed.length,
    medianS: med(sorted),
    failedN: failed.length,
    failedPct: (failed.length / timed.length) * 100,
    heldN: held.length,
    heldMedianS: med([...held].sort((a, b) => a - b)),
    longestS: sorted[sorted.length - 1],
    shortestS: sorted[0],
  };
}

export const WHY_SHORT = {
  title: 'Why the calls were so short',
  reasons: [
    'A third of them simply failed. Nine of the timed calls lasted five seconds or less — misdials, drops, numbers that never picked up. That is Airfone and the 2001 network, not reticence.',
    'Several reached answering machines, which are short by nature. Grandcolas, Gronlund and Lyles all left messages rather than speaking to anyone.',
    'People made several short calls instead of one long one, working through numbers until something answered. Lauren Grandcolas tried a residence three times in a row and got two, three and two seconds.',
    'There was not much time to begin with. Thirty-five minutes separate the hijacking from impact, and the last calls run into the roll sequence at 09:59, when the aircraft was being thrown about.',
  ],
  reading: 'The distribution is itself an argument for authenticity. A fabricated set would not be mostly failures and voicemail. It would not contain a misdial to a wrong number lasting three seconds, or three consecutive two-second attempts to the same house. That is the texture of real telephony under stress, and it is tedious in a way inventions are not.',
  src: 'derived',
};

export const FARADAY = {
  title: 'The Faraday cage argument',
  claim: 'An aluminium fuselage is a Faraday cage, so mobile calls from an airliner are impossible; therefore the calls were fabricated.',
  claimSrc: 'claim',
  answers: [
    {
      head: 'It is aimed at two calls out of thirty-seven',
      text: 'Thirty-five of the thirty-seven calls were Airfone — the seatback air-to-ground radio-telephone fitted to the last nine rows of the aircraft. It is a system built and certificated for making telephone calls from an airliner in cruise. No argument about mobile phone coverage touches it.',
      src: 'commission',
    },
    {
      head: 'Both cellular calls were made low',
      text: 'The two cellular calls — Edward Felt and CeeCee Lyles — were placed at about 09:58, after the flight data recorder shows the aircraft down at roughly 5,000 ft. That is the altitude at which a cell call is least surprising, not most.',
      src: 'ntsb',
    },
    {
      head: 'A fuselage is not a sealed cage',
      text: 'A Faraday cage needs a continuous conductive enclosure whose apertures are small against the wavelength. Cellular traffic in 2001 ran at 800 and 1900 MHz — wavelengths of about 37 and 16 cm. Airliner cabin windows are of the same order. They are apertures, not barriers. A fuselage attenuates signal; it does not null it.',
      src: 'derived',
    },
    {
      head: 'The record is call-by-call, not a general assertion',
      text: 'The Airfone and cellular split comes from carrier billing records — time, originating seat row, number dialled, duration — entered as evidence at the Moussaoui sentencing trial. This is the kind of claim that could have been falsified by the records and was not.',
      src: 'commission',
    },
  ],
  reading: 'The argument treats "cell phones do not work on planes" as though it were a law rather than a matter of degree, and then applies it to a set of calls that were overwhelmingly not cellular. Both halves fail independently.',
  src: 'derived',
};

/* Why the calls are load-bearing for the rest of the record. */
export const WHY_THEY_MATTER = {
  title: 'Why the calls decided the outcome',
  paras: [
    'The hijackers’ method on all four aircraft was to invoke the pre-2001 hijacking script: a bomb, a promised landing, demands to be met. Under that script the rational thing for a passenger to do is sit still. It bought roughly half an hour of compliance, which was all that was needed.',
    'United 93 pushed back twenty-five minutes late. That delay is the reason its passengers were still airborne when the World Trade Center was struck, and the reason they had time to make and receive these calls. The moment they learned the truth, the bomb stopped being a reason to wait.',
    'The revolt began at 09:57, within minutes of the last of these calls. It is the only one of the four aircraft that never reached its target.',
  ],
  src: 'commission',
};

/* =============================================================================
   Inconsistencies in the phone record

   These are small, and none of them touches the substance. They are recorded
   because an app that grades other people's sources has no business quietly
   reconciling its own, and because anyone checking this against the National
   Park Service log will hit them within a minute and deserves to know they
   were seen rather than missed.
   ========================================================================== */

export const PHONE_CONFLICTS = [
  {
    id: 'airfone-rows',
    subject: 'How many rows carried Airfones — nine, or twelve?',
    readings: [
      { v: '"The last nine rows"', who: 'National Park Service, Flight 93 Memorial', src: 'commission',
        weight: 'The summary sentence used everywhere, including in this app until now.' },
      { v: 'Rows 23 to 34 — twelve rows', who: 'The row numbers in the NPS call log itself', src: 'commission',
        weight: 'The same page. Calls are logged from rows 23, 24, 25, 26, 27, 32, 33 and 34.' },
    ],
    reading: 'A single source disagreeing with itself on the same page. The per-call rows are the harder datum — they come from billing records — so the installation evidently reached further forward than "the last nine rows" suggests. Nothing turns on it, but the summary is loose.',
  },
  {
    id: 'cell-count',
    subject: 'Two cellular calls, or three?',
    readings: [
      { v: 'Two — Edward Felt and CeeCee Lyles', who: 'FBI evidence, Moussaoui sentencing trial', src: 'commission',
        weight: 'From carrier records. The figure normally cited, and the one this app uses.' },
      { v: 'Three — the above plus Andrew "Sonny" Garcia', who: 'NPS call log', src: 'commission',
        weight: 'Listed with an unknown time and a single word before disconnect.' },
    ],
    reading: 'Most likely connected-versus-attempted: Garcia’s may never have completed, and an incomplete call would not appear in a billing total. That is a guess, and it is labelled as one. Either way the argument is unaffected — the question is whether cellular calls happened at low altitude, and two or three both answer it the same way.',
  },
  {
    id: 'cell-success-rate',
    subject: 'How often did air-to-ground cell calls actually succeed in 2001?',
    readings: [
      { v: 'No measured rate exists that is worth quoting', who: 'Searched and not found', src: 'derived',
        weight: 'NASA-era studies address avionics interference, not call completion. The 2004 Qualcomm/American test was an onboard picocell, which is the opposite mechanism.' },
      { v: 'About 1% at 20,000 ft; 0% at 7,000 ft in a twin', who: 'A. K. Dewdney, "Project Achilles"', src: 'claim',
        weight: 'The only figure in circulation. From an advocacy source, small sample, and flown in light aircraft rather than airliners.' },
    ],
    reading: 'The qualitative claim — unreliable, degrading sharply with altitude — is well founded on engineering grounds: tower antennas are downtilted, handover was built for road speeds, and at altitude a handset sees too many cells. The quantitative claim is not. This app states the first and refuses the second, including where the second would suit its own argument.',
  },
];

/* =============================================================================
   Which calls have audio, and why that answers a question worth asking

   A reasonable objection: if recordings of these calls exist, does that not
   imply somebody was already collecting them?

   No — and the pattern of what exists is the reason. Audio survives from
   exactly those endpoints where recording was already routine for an ordinary
   institutional reason, and from nowhere else:

     - domestic answering machines, which record by design;
     - 911 dispatch centres, which record by law;
     - airline reservations and operations lines, recorded for training;
     - air traffic control and the cockpit voice recorder, recorded by
       regulation.

   And the inverse is the stronger half. Person-to-person calls answered by a
   human at home have NO audio. Tom Burnett to Deena, Jeremy Glick to Lyz,
   Mark Bingham to his mother — all known only from the recipients' accounts.

   If there had been pre-existing blanket collection, there would be audio of
   all of them. There is not. The gaps fall precisely where an absence of
   collection predicts they should.

   The sharpest case is the most famous line of the day. "Let's roll" is not on
   any tape. It comes from GTE operator Lisa Jefferson's recollection of a call
   that was not recorded. A fabrication with collection behind it is the one
   scenario in which that line would certainly exist as audio.
   ========================================================================== */

export const AUDIO = {
  title: 'Which calls have audio',
  exists: [
    { what: 'Betty Ong, American 11', why: 'Called American Airlines reservations, a line recorded as a matter of business practice. About four minutes were played at the 9/11 Commission hearing on 27 January 2004.', src: 'commission' },
    { what: 'CeeCee Lyles’ voicemail', why: 'Left on her husband’s home answering machine. Lorne Lyles has played it publicly.', src: 'press' },
    { what: 'Lauren Grandcolas, Linda Gronlund', why: 'Also answering machines. Recording is what the device is for.', src: 'press' },
    { what: 'Edward Felt’s 911 call', why: 'Emergency dispatch centres record every call by law. Taken by Westmoreland County dispatcher Glenn Cramer.', src: 'press' },
    { what: 'Cockpit voice recorder, United 93', why: 'Required equipment. Recovered at the crash site, played to families and at the Moussaoui trial.', src: 'ntsb' },
  ],
  absent: [
    { what: 'Tom Burnett to his wife Deena — four calls', why: 'Answered by a person. Known from her account.' },
    { what: 'Jeremy Glick to his wife Lyz — twenty minutes', why: 'Answered by a person. The longest call of the morning, and there is no tape of it.' },
    { what: 'Mark Bingham to his mother', why: 'Answered by a person.' },
    { what: 'Todd Beamer to GTE operator Lisa Jefferson', why: 'Airfone operator calls were not routinely recorded. "Let’s roll" is her recollection, not a recording.' },
  ],
  reading: 'Audio exists where recording was already ordinary, and is missing everywhere else. That is the signature of no collection, not of collection. Blanket interception would have produced a complete set; what survives is a partial set shaped exactly by which endpoint happened to have a tape running.',
  src: 'derived',
};

export function callEvents() {
  return CALLS.map((c) => ({
    t: c.t,
    text: `${c.who} calls ${c.to} — ${c.type === 'cellular' ? 'CELLULAR' : 'Airfone'}. ${c.note}`,
    src: 'commission',
    kind: 'call',
    label: 'Phone call',
    color: c.type === 'cellular' ? 0xffd447 : 0x74c7ff,
  }));
}
