/* =============================================================================
   critic.js — DIRNSA CRITIC 1-2001.

   A CRITIC (Critical Intelligence Communication) is the channel established
   under NSCID No. 7 to put information of the highest urgency in front of the
   President and the national command structure within minutes. On 11 September
   2001 NORAD originated one, and NSA's National Security Operations Center
   retransmitted and twice followed it up.

   NSA has acknowledged these messages, released them under FOIA, and redacted
   the substance — withholding the NORAD-originated content on the stated
   ground that NORAD, as a bi-national command, is not subject to FOIA.

   So this module is unlike every other data file here. Everywhere else the
   problem is sources that disagree. Here the record is not disputed at all:
   the messages are identified, dated, numbered and acknowledged. What is
   missing is what they SAID. That is a hole with a known shape, and the app
   draws it as one rather than leaving the timeline looking complete.

   Times are EDT (Zulu minus four). DTGs are NSA's own.
   ========================================================================== */

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

/* Nodes on the alert network. NSA and NORAD are surveyed; the distribution
   endpoints are where a CRITIC is *designed* to land, not a disclosed
   addressee list — see DISTRIBUTION below. */
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
    note: 'The National Security Operations Center — the watch floor that received the CRITIC and retransmitted it laterally.',
    src: 'geo',
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
    note: 'The sector actually fighting the air battle. Callsign HUNTRESS.',
    src: 'geo',
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
    from: 'NORAD', to: 'NSAF',
    kind: 'origination',
    body: 'NORAD places the hijackings into the national warning channel — the mechanism designed to reach the President within minutes.',
    gap: 'The entire NORAD-originated substance is withheld as "OGA" material.',
    context: 'Twelve minutes after the Pentagon is struck. Fourteen minutes before United 93 goes into the ground. NEADS will not be told United 93 exists for another eighteen minutes.',
    src: 'foia',
  },
  {
    id: 'C2',
    t: at(9, 52, 0),
    dtg: '111352ZSEP01',
    title: 'NSA NSOC retransmits — LATERAL CRITIC',
    from: 'NSAF', to: null,
    kind: 'lateral',
    body: 'NSOC pushes the CRITIC laterally across the interagency watch community. Designated DIRNSA CRITIC 1-2001 — the first of the year.',
    gap: 'Content withheld. TO and INFO addressee lists withheld. Delivery and acknowledgment times withheld.',
    context: 'Five minutes after the passengers of United 93 begin their assault on the cockpit; six minutes before the moment the shootdown claim alleges.',
    src: 'foia',
  },
  {
    id: 'C3',
    t: at(10, 14, 0),
    dtg: '111414ZSEP01',
    title: 'FOLLOW-UP-1',
    from: 'NSAF', to: null,
    kind: 'followup',
    body: 'First follow-up to DIRNSA CRITIC 1-2001.',
    gap: 'Content withheld.',
    context: 'United 93 has been down for eleven minutes. The Vice President has conveyed shootdown authorisation within the last few minutes. What national leadership was told at this moment is not public.',
    src: 'foia',
  },
  {
    id: 'C4',
    t: at(10, 48, 0),
    dtg: '111448ZSEP01',
    title: 'FOLLOW-UP-2 AND FINAL',
    from: 'NSAF', to: null,
    kind: 'followup',
    body: 'Second and final follow-up. The CRITIC sequence closes.',
    gap: 'Content withheld.',
    context: 'Six minutes after the first armed DC Air National Guard fighter leaves Andrews.',
    src: 'foia',
  },
];

/* Issued two days later, so it sits outside the app's clock. */
export const CRITIC_SUMMARY = {
  dtg: '131303ZSEP01',
  when: '13 September 2001, 09:03 EDT',
  title: 'CRITIC SUMMARY FOR DIRNSA CRITIC 1-2001',
  body: 'The retrospective summary of the sequence. Because the real-time messages contained at least one report of an aircraft that did not exist, the summary is where any correction of the record would have been made.',
  gap: 'Content withheld, along with any drafts, amendments, corrections or cancellations.',
  src: 'foia',
};

/* What the redacted release does show. This is the only glimpse of content
   that exists publicly, and it is the reason the rest matters. */
export const CRITIC_GLIMPSE = {
  title: 'What survived the redaction',
  items: [
    {
      text: 'A report of a "Boeing 767 aircraft originating from JFK" heading for Washington.',
      note: 'No such flight existed. At the moment the nation\'s highest-priority warning channel was carrying this, it was carrying a phantom.',
      src: 'foia',
    },
    {
      text: 'Confusion over the location of American Airlines Flight 77.',
      note: 'Flight 77 had struck the Pentagon at 09:37:45 — twelve minutes before the CRITIC was originated.',
      src: 'foia',
    },
  ],
  reading: 'Two fragments escaped the redaction, and both are errors. That is not evidence the rest is wrong, but it is the reason the rest is worth having: the CRITIC is the record of what leadership was actually told, as against what was actually happening, and the app can already draw the second half of that comparison minute by minute.',
  src: 'derived',
};

/* The onward distribution is drawn on the map, but it is an inference from
   how the CRITIC system is designed, not from anything NSA has disclosed.
   The map marks these links as unconfirmed and the panel says why. */
export const DISTRIBUTION = {
  to: ['WHSR', 'NMCC', 'NEADS'],
  status: 'requested',
  note: 'Addressee lists, routing indicators, and delivery and acknowledgment time-stamps are withheld. These links show where a CRITIC is designed to land, not where these messages are documented to have gone. They are drawn dashed for that reason.',
  src: 'derived',
};

export const CRITIC_BACKGROUND = {
  title: 'What a CRITIC is',
  paras: [
    'A Critical Intelligence Communication is the highest-precedence alert in the US system, established under National Security Council Intelligence Directive No. 7. Its design goal is to place information before the President within minutes of origination. It is not routine reporting; issuing one is a deliberate act that asserts the information cannot wait.',
    'That is what makes DIRNSA CRITIC 1-2001 the sharpest available instrument for a question this app already asks in other ways: what did the national command structure actually believe was happening, and when? Every other source here — radar files, recorder data, ATC tapes, the NEADS recordings — describes events. The CRITIC describes the government\'s own real-time understanding of those events, which is a different thing and, on this morning, demonstrably not the same thing.',
    'NSA withheld the NORAD-originated substance on the ground that NORAD, as a bi-national command, is not subject to FOIA. Whether that is a sound basis for withholding a record held in NSA\'s own files is the question a pending request puts back to the agency.',
  ],
  src: 'press',
};

export const FOIA = {
  status: 'Request pending',
  requester: 'Mark Daniel Ciubal',
  filedVia: 'MuckRock',
  publishAt: 'critic.markciubal.com',
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
