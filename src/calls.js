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
  { t: at(9, 30), who: 'Tom Burnett', to: 'his wife Deena', type: 'airfone',
    note: 'First of four. He told her the hijackers claimed a bomb, and that he believed it was a ruse.' },
  { t: at(9, 32), who: 'Mark Bingham', to: 'his mother Alice Hoagland', type: 'airfone',
    note: '"I want you to know that I love you. I am on a flight from Newark to San Francisco and there are three guys who have taken over the plane."' },
  { t: at(9, 35), who: 'Jeremy Glick', to: 'his wife Lyz', type: 'airfone',
    note: 'A long call. Lyz told him about the World Trade Center. This is one of the moments the script breaks.' },
  { t: at(9, 37), who: 'Tom Burnett', to: 'Deena', type: 'airfone',
    note: 'Learns of the World Trade Center. "They are talking about crashing this plane into the ground."' },
  { t: at(9, 39), who: 'Sandy Bradshaw', to: 'her husband Phil', type: 'airfone',
    note: 'A flight attendant. She told him the crew were boiling water to throw at the hijackers.' },
  { t: at(9, 42), who: 'Lauren Grandcolas', to: 'her husband Jack', type: 'airfone',
    note: 'Reached his voicemail. "We have a little problem with the plane. I am totally fine. I just love you more than anything."' },
  { t: at(9, 44), who: 'Todd Beamer', to: 'GTE operator Lisa Jefferson', type: 'airfone',
    note: 'About thirteen minutes. He described the hijacking, recited the Lord’s Prayer with her, and asked her to call his family.' },
  { t: at(9, 45), who: 'Tom Burnett', to: 'Deena', type: 'airfone',
    note: '"A group of us are going to do something."' },
  { t: at(9, 47), who: 'Linda Gronlund', to: 'her sister Elsa', type: 'airfone',
    note: 'Left a message giving the location of her safe deposit box.' },
  { t: at(9, 49), who: 'Marion Britton', to: 'her friend Fred Fiumano', type: 'airfone',
    note: 'Told him the plane had been hijacked and two people had been killed.' },
  { t: at(9, 53), who: 'Elizabeth Wainio', to: 'her stepmother Esther', type: 'airfone',
    note: '"They are getting ready to break into the cockpit. I have to go. I love you."' },
  { t: at(9, 54), who: 'Tom Burnett', to: 'Deena', type: 'airfone',
    note: 'The last of his four. "We are going to do something."' },
  { t: at(9, 57), who: 'Todd Beamer', to: 'Lisa Jefferson (same call)', type: 'airfone',
    note: '"Are you guys ready? Okay. Let’s roll." The revolt begins.' },
  { t: at(9, 58), who: 'Edward Felt', to: '911, Westmoreland County', type: 'cellular',
    note: 'From a lavatory. Dispatcher Glenn Cramer took the call. One of only two cellular calls from the aircraft — placed at about 5,000 ft.' },
  { t: at(9, 58), who: 'CeeCee Lyles', to: 'her husband Lorne', type: 'cellular',
    note: 'A flight attendant. The second and last cellular call, also at low altitude. She had reached him earlier on an Airfone.' },
];

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
