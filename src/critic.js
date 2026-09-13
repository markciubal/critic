/* =============================================================================
   critic.js — DIRNSA CRITIC 1-2001.

   A CRITIC (Critical Intelligence Communication) is the channel established
   under NSCID No. 7 to put information of the highest urgency in front of the
   President and the national command structure within minutes. On 11 September
   2001 NORAD originated one, and NSA's National Security Operations Center
   retransmitted and twice followed it up.

   NSA has acknowledged these messages, released them under FOIA, and withheld
   the substance. The stated ground for withholding the NORAD-originated
   content is that NORAD, as a bi-national command, is not subject to FOIA.

   The record here is not disputed. The messages are identified, dated,
   numbered and acknowledged; the content is redacted. The app draws the gap
   rather than leaving the timeline looking complete.

   BADGING RULE FOR THIS FILE

     'foia'     the NSA release shows it: existence, date-time group,
                originator, sender, what was withheld and the stated ground.
     'derived'  reasoning or arithmetic done here. Everything about
                addressees, routing, delivery and subject matter falls here,
                because the release discloses none of it.

   Facts taken from other sources (the Commission report, the NTSB study) are
   attributed inline in the sentence that uses them.

   Times are EDT (Zulu minus four). DTGs are NSA's own.
   ========================================================================== */

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

/* Nodes on the alert network. NORAD and NSA are the two ends of the one
   documented hop. The distribution endpoints are where a CRITIC is designed to
   land, not a disclosed addressee list; see DISTRIBUTION below. */
export const CRITIC_NODES = {
  NORAD: {
    name: 'NORAD, Colorado',
    short: 'NORAD',
    lat: 38.8156, lon: -104.7003,
    note: 'Peterson AFB. The release names NORAD as originator but not which node within it, so the exact originating position is an assumption of this map.',
    src: 'derived',
  },
  NSAF: {
    name: 'NSA / NSOC, Fort Meade MD',
    short: 'NSA NSOC',
    lat: 39.1084, lon: -76.7713,
    note: 'The National Security Operations Center, the NSA watch floor. The release identifies NSA as the sender of the lateral CRITIC and both follow-ups; it holds the NORAD-originated message, which is why it was asked for it. Which desk within NSOC handled it is not disclosed.',
    src: 'foia',
  },
  WHSR: {
    name: 'White House Situation Room',
    short: 'White House',
    lat: 38.8977, lon: -77.0365,
    note: 'A CRITIC addressee by design. Whether and when it received these specific messages is among the records requested, not among the records released.',
    src: 'derived',
  },
  NMCC: {
    name: 'National Military Command Center, the Pentagon',
    short: 'NMCC',
    lat: 38.8719, lon: -77.0563,
    note: 'Likewise an addressee by design, not by disclosure.',
    src: 'derived',
  },
  NEADS: {
    name: 'NEADS, Rome NY',
    short: 'NEADS',
    lat: 43.2338, lon: -75.4073,
    note: 'The sector fighting the air battle that morning, callsign HUNTRESS (9/11 Commission Report, ch. 1). It is drawn here as a distribution endpoint by design; no released record places these messages at NEADS.',
    src: 'derived',
  },
};

/* The chain itself. `body` is what is publicly known of the content; `gap`
   is what the redaction removes. */
export const CRITIC_CHAIN = [
  {
    id: 'C1',
    t: at(9, 49, 0),
    dtg: '111349ZSEP01',
    title: 'NORAD originates the CRITIC',
    mapLabel: 'CRITIC ORIGINATED',
    from: 'NORAD', to: 'NSAF',
    kind: 'origination',
    body: 'NORAD originates a CRITIC, the channel designed to reach the President within minutes. The release establishes the originator, the date-time group and the fact of origination. What the message said is withheld.',
    gap: 'The entire NORAD-originated substance is withheld as "OGA" material.',
    context: 'Eleven minutes after American 77 struck the Pentagon at 09:37:45 (NTSB Flight Path Study). Fourteen minutes before United 93 goes into the ground. NEADS will not be told United 93 exists for another eighteen minutes (9/11 Commission Report, ch. 1).',
    src: 'foia',
    refs: ['NSA_RELEASE', 'KARA_CRITIC'],
  },
  {
    id: 'C2',
    t: at(9, 52, 0),
    dtg: '111352ZSEP01',
    title: 'NSA NSOC retransmits: LATERAL CRITIC',
    mapLabel: 'DIRNSA CRITIC 1-2001',
    from: 'NSAF', to: null,
    kind: 'lateral',
    body: 'NSA NSOC retransmits laterally, as DIRNSA CRITIC 1-2001. The serial is the first NSA CRITIC of 2001. Who it went to is withheld, so the release does not establish which agencies received it.',
    gap: 'Content withheld. TO and INFO addressee lists withheld. Delivery and acknowledgment times withheld.',
    context: 'Five minutes before the passengers of United 93 begin their assault on the cockpit at 09:57 (9/11 Commission Report, ch. 1). Six minutes before the moment the shootdown claim alleges.',
    src: 'foia',
    refs: ['NSA_RELEASE'],
  },
  {
    id: 'C3',
    t: at(10, 14, 0),
    dtg: '111414ZSEP01',
    title: 'FOLLOW-UP-1',
    mapLabel: 'CRITIC FOLLOW-UP 1',
    from: 'NSAF', to: null,
    kind: 'followup',
    body: 'First follow-up to DIRNSA CRITIC 1-2001.',
    gap: 'Content withheld.',
    context: 'United 93 has been down for eleven minutes. The earliest documented shootdown authorisation is about 10:10, four minutes earlier (9/11 Commission Report, ch. 1). What national leadership was told at this moment is not public.',
    src: 'foia',
    refs: ['NSA_RELEASE'],
  },
  {
    id: 'C4',
    t: at(10, 48, 0),
    dtg: '111448ZSEP01',
    title: 'FOLLOW-UP-2 AND FINAL',
    mapLabel: 'CRITIC FOLLOW-UP 2 — FINAL',
    from: 'NSAF', to: null,
    kind: 'followup',
    body: 'Second and final follow-up. The CRITIC sequence closes.',
    gap: 'Content withheld.',
    context: 'Six minutes after the second DC Air National Guard F-16 leaves Andrews at 10:42. Neither of the first two Andrews fighters carried live ammunition.',
    src: 'foia',
    refs: ['NSA_RELEASE'],
  },
];

/* Issued two days later, so it sits outside the app's clock. */
export const CRITIC_SUMMARY = {
  dtg: '131303ZSEP01',
  when: '13 September 2001, 09:03 EDT',
  title: 'CRITIC SUMMARY FOR DIRNSA CRITIC 1-2001',
  body: 'The retrospective summary of the sequence, issued two days later. The release confirms its existence, its date-time group and its title. One of the real-time messages reported an aircraft that did not exist, so a correction of the record would belong in a document of this kind; whether one was made is withheld with the rest.',
  gap: 'Content withheld, along with any drafts, amendments, corrections or cancellations.',
  src: 'foia',
  refs: ['NSA_RELEASE'],
};

/* What the redacted release does show. The two fragments below are the only
   content visible publicly. */
export const CRITIC_GLIMPSE = {
  title: 'What survived the redaction',
  items: [
    {
      text: 'A report of a "Boeing 767 aircraft originating from JFK" heading for Washington.',
      note: 'No flight matching that description existed. The four hijacked aircraft are accounted for: American 11 and United 175 were 767s out of Boston, American 77 a 757 out of Dulles, United 93 a 757 out of Newark (9/11 Commission Report, ch. 1). None departed JFK.',
      src: 'foia',
    },
    {
      text: 'Confusion over the location of American Airlines Flight 77.',
      note: 'Flight 77 had struck the Pentagon at 09:37:45 (NTSB Flight Path Study), eleven minutes before the CRITIC was originated.',
      src: 'foia',
    },
  ],
  reading: 'Two fragments escaped the redaction and both are errors. That does not establish that the rest of the text is wrong. The CRITIC [[critic]] is the record of what leadership was told, as against what was happening, and the app can draw the second half of that comparison minute by minute.',
  src: 'derived',
  refs: ['NSA_RELEASE', 'KARA_CRITIC'],
};

/* The onward distribution is drawn on the map, but it is an inference from
   how the CRITIC system is designed, not from anything NSA has disclosed.
   The map marks these links as unconfirmed and the panel says why. */
export const DISTRIBUTION = {
  to: ['WHSR', 'NMCC', 'NEADS'],
  status: 'requested',
  note: 'Addressee lists, routing indicators, and delivery and acknowledgment time-stamps are withheld. These links show where a CRITIC is designed to land, not where these messages are documented to have gone. They are drawn dashed for that reason.',
  src: 'derived',
  refs: ['NSA_RELEASE', 'MANEKI'],
};

export const CRITIC_BACKGROUND = {
  title: 'What a CRITIC is',
  paras: [
    'A Critical Intelligence Communication [[critic]] is the highest-precedence alert in the US system, established under National Security Council Intelligence Directive No. 7. Its design goal is to place information before the President within minutes of origination. Issuing one asserts that the information cannot wait.',
    'DIRNSA CRITIC 1-2001 [[dirnsa]] records what was reported upward through that channel, and when. The other sources here (radar files, recorder data, ATC [[atc]] tapes, the NEADS [[neads]] recordings) describe events. The CRITIC describes the government\'s real-time understanding of those events, which on the evidence of the two surviving fragments differed from the events themselves.',
    'In its FOIA [[foia]] response NSA withheld the NORAD-originated [[norad]] substance as "OGA" material [[oga]], on the ground that NORAD, as a bi-national command, is not subject to FOIA. Whether that is a sound basis for withholding a record held in NSA\'s own files is the question a pending request puts back to the agency.',
  ],
  src: 'press',
  refs: ['MANEKI', 'KARA_CRITIC', 'NSA_RELEASE'],
};

export const FOIA = {
  status: 'Request pending',
  requester: 'Mark Daniel Ciubal',
  filedVia: 'MuckRock',
  filed: '11 September 2026',
  requestTitle: 'Release of 9/11 CRITIC',
  requestUrl: 'https://www.muckrock.com/foi/united-states-of-america-10/release-of-911-critic-national-security-agency-220673/',
  publishAt: 'critic.markciubal.com',
  publishUrl: 'https://critic.markciubal.com/',
  autoDeclass: '31 December 2026',
  autoDeclassNote: 'Records of 2001 reach the 25-year automatic-declassification date under E.O. 13526 § 3.3(a) at the end of this year.',
  scope: [
    'The NORAD-originated CRITIC as held by NSA, in every copy.',
    'The LATERAL CRITIC and both follow-ups.',
    'The 13 September CRITIC SUMMARY, with drafts, amendments and cancellations.',
    'Every other CRITIC NSA logged between 11 and 14 September 2001.',
    'Full headers: precedence, addressees, routing indicators, delivery and acknowledgment time-stamps.',
    'NSOC watch logs, SOO logs, CRITIC checklists, NOIWON record sheets, and the "TRAN" desk e-mail traffic.',
    'Any internal history or after-action review discussing the CRITIC\'s accuracy.',
  ],
  src: 'derived',
  refs: ['MUCKROCK', 'NSA_RELEASE', 'KARA_CRITIC'],
};

export function criticEvents() {
  const out = CRITIC_CHAIN.map((c) => ({
    t: c.t,
    text: `${c.title} — DTG ${c.dtg}. ${c.gap}`,
    src: c.src,
    kind: 'critic',
    label: 'CRITIC',
    color: 0xff1f3d,
    criticId: c.id,
  }));
  return out;
}
