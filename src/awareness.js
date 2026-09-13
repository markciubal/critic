/* =============================================================================
   awareness.js — who knew United 93 was hijacked, and when.

   This app said, for a long time, that "NEADS did not know United 93 existed
   until 10:07". That is true, and on its own it invites an objection: the FAA
   knew for thirty-five minutes, so part of the federal government did know,
   and the question is why that knowledge could not be handed to a fighter.

   This file sets out the whole chain, with what each step does and does not
   establish.

   THE SHAPE OF IT

   The crash was not a surprise to the federal government. It was a surprise to
   the United States military. The civil side held the aircraft throughout; the
   military side was not told until after it was down.

   The civil side — Cleveland Center, the Command Center at Herndon, FAA
   headquarters — had the aircraft continuously from 09:28. They heard the
   takeover live. They tracked it on primary radar after the transponder went
   off. They computed how many minutes it was from Washington. And for
   twenty-five minutes they discussed, on recorded lines, whether to ask the
   military for help.

   They never completed the request. The air defence sector heard the words
   "United 93" for the first time at 10:07, four minutes after the aircraft was
   already in the ground.

   WHAT THAT DOES TO THE SHOOTDOWN CLAIM

   It removes the mechanism. Even granting foreknowledge, fuel, missiles and a
   perfect launch, a pilot still has to be pointed at a target moving at about
   370 mph (this app's NTSB-traced track after 09:46; earlier versions said
   "400 knots", which no source supports). The only organisation holding that
   track was the FAA, which does not task or vector fighters. The military,
   which does, was not told until 10:07.

   `bearing` on each entry states what that step establishes and what it does
   not. An entry that only establishes that somebody knew something is marked
   as such, because the claim rests on "the government knew" without saying
   which part of the government knew what.
   ========================================================================== */

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

/* Who is doing the knowing. The split is the whole argument, so it is a field
   rather than a matter of reading the prose carefully. */
export const ACTORS = {
  civil:    { label: 'FAA — civil',      color: '#35d6a4', note: 'Air traffic control. Has radar. Cannot launch or direct fighters.' },
  military: { label: 'Military',         color: '#ff1f3d', note: 'NEADS and NORAD. Can launch and direct fighters. Needs to be told.' },
  exec:     { label: 'Executive',        color: '#ffd447', note: 'The White House, the Secret Service, the national command structure.' },
  public:   { label: 'Outside government', color: '#9fb6cc', note: 'Passengers, families, a county dispatcher, people on the ground.' },
};


/* =============================================================================
   WHERE THE KNOWLEDGE WAS

   The CRITIC chain is drawn on the map because a message travels between
   places. So does this. On the map the civil network lights up across four
   states in six minutes, and the one node that could have launched a fighter
   stays dark until after the aircraft is in the ground.
   ========================================================================== */

export const AWARE_NODES = {
  ZOB:   { name: 'Cleveland Center (Oberlin, Ohio)', short: 'Cleveland Center',
           lat: 41.2939, lon: -82.2182, actor: 'civil',
           note: 'The air route traffic control centre holding United 93. Heard the hijacking live and never lost the aircraft.' },
  ATCSCC:{ name: 'FAA Command Center, Herndon, Virginia', short: 'Herndon Command Center',
           lat: 38.9696, lon: -77.3861, actor: 'civil',
           note: 'The national flow-control hub. Told at 09:34, and the source of the 09:49 "do we want to think about scrambling aircraft?" exchange.' },
  FAAHQ: { name: 'FAA headquarters, Washington DC', short: 'FAA HQ',
           lat: 38.8870, lon: -77.0220, actor: 'civil',
           note: 'Where the request for military help would have had to be authorised. It was discussed three times and never made.' },
  NEADSN:{ name: 'Northeast Air Defense Sector, Rome, New York', short: 'NEADS',
           lat: 43.2338, lon: -75.4071, actor: 'military',
           note: 'The only node on this map that could have launched or vectored a fighter. Not told until 10:07.' },
  NORADN:{ name: 'NORAD, Colorado Springs', short: 'NORAD',
           lat: 38.7440, lon: -104.8460, actor: 'military',
           note: 'Originated the CRITIC at 09:49, reporting upward through the national warning channel. Nothing visible in the released fragments mentions United 93; the one aircraft named is a 767 from JFK that did not exist. NEADS, the NORAD sector responsible for that airspace, had no track on United 93 until 10:07 (9/11 Commission Report, ch. 1).' },
  ZDC:   { name: 'Washington Center (Leesburg, Virginia)', short: 'Washington Center',
           lat: 39.10, lon: -77.55, actor: 'civil',
           note: 'The air route traffic control centre for the Washington area. Told NEADS at 10:15 that United 93 had crashed.' },
  PEOC:  { name: 'White House / PEOC, Washington DC', short: 'White House',
           lat: 38.8977, lon: -77.0365, actor: 'exec',
           note: 'Where shootdown authority was given. The Commission places the Vice President\'s authorisation between about 10:10 and 10:18; there is no documentary record of the call, and NEADS received the order at 10:31. The picture it was given, relayed from FAA data, was already out of date.' },
  WCO:   { name: 'Westmoreland County 911, Greensburg, Pennsylvania', short: 'Westmoreland 911',
           lat: 40.3015, lon: -79.5389, actor: 'public',
           note: 'Took Edward Felt\'s call at 09:58. A county dispatcher, not a federal agency.' },
};

export const AWARENESS = [
  {
    t: at(9, 24, 0), actor: 'civil',
    who: 'United Airlines dispatcher Ed Ballinger',
    what: 'Sends United 93 a warning: "Beware any cockpit intrusion — two a/c hit World Trade Center." (Commission Report, ch. 1.)',
    bearing: 'An airline, not the government, and a general warning rather than a track. It establishes that the morning was already understood as an attack, four minutes before the takeover.',
    src: 'commission',
    refs: ['COMMISSION'],
  },
  {
    t: at(9, 28, 0), actor: 'civil',
    who: 'Cleveland Center',
    node: 'ZOB',
    what: 'Hears the takeover live: a "Mayday" and the sounds of a struggle over the open radio. (Commission Report, ch. 1.)',
    bearing: 'From this moment the civil side [[faa]] has the aircraft and does not lose it.',
    src: 'commission',
    refs: ['COMMISSION'],
  },
  {
    t: at(9, 32, 0), actor: 'civil',
    who: 'Cleveland Center',
    node: 'ZOB',
    what: 'Hears Jarrah keying the wrong switch: "Ladies and Gentlemen: Here the captain, please sit down keep remaining sitting. We have a bomb on board." The controller understands it as a hijacking. (Commission Report, ch. 1.)',
    bearing: 'A hijacker announcing the hijacking on tape to a federal controller, not an inference from radar.',
    src: 'commission',
    refs: ['COMMISSION'],
  },
  {
    t: at(9, 34, 0), actor: 'civil',
    who: 'Cleveland Center → FAA Command Center, Herndon',
    from: 'ZOB', to: 'ATCSCC',
    what: 'Reports United 93 hijacked.',
    bearing: 'The knowledge is now national, not one facility. Twenty-nine minutes before the crash.',
    src: 'commission',
  },
  {
    t: at(9, 36, 0), actor: 'civil',
    who: 'Cleveland Center → FAA headquarters',
    from: 'ZOB', to: 'FAAHQ',
    what: 'Asks whether anyone has requested that the military launch fighters [[scramble]]. Headquarters answers that it has to "run it up the chain of command." (Commission Report, ch. 1, the 09:36-09:53 FAA exchanges.)',
    bearing: 'The first of several points at which the request could have been made and was not. The person asking is the controller watching the aircraft. This exchange is often read as evidence of foreknowledge; see the note below.',
    src: 'commission',
    refs: ['COMMISSION'],
    weigh: 'fighters-question',
  },
  {
    t: at(9, 41, 0), actor: 'civil',
    who: 'Cleveland Center',
    node: 'ZOB',
    what: 'Transponder [[transponder]] goes off. The Center holds the aircraft on primary radar [[primaryRadar]] and by asking nearby aircraft to look.',
    bearing: 'Losing the transponder did not lose the aircraft. Any claim that United 93 "disappeared" after 09:41 is wrong about the civil picture.',
    src: 'commission',
  },
  {
    t: at(9, 46, 0), actor: 'civil',
    who: 'FAA Command Center → FAA headquarters',
    from: 'ATCSCC', to: 'FAAHQ',
    what: 'Reports United 93 "twenty-nine minutes out of Washington, D.C." (Commission Report, ch. 1.)',
    bearing: 'A projection as well as a track: the civil side had the heading and the time remaining.',
    src: 'commission',
    refs: ['COMMISSION'],
  },
  {
    t: at(9, 49, 0), actor: 'military',
    who: 'NORAD',
    node: 'NORADN',
    what: 'Originates the CRITIC, putting the hijackings into the national warning channel.',
    bearing: 'NORAD [[norad]] is reporting upward through the national warning channel. Nothing visible in the released fragments mentions United 93; the one aircraft named is a 767 from JFK that did not exist. NEADS, the sector responsible, had no track on United 93 until 10:07.',
    src: 'foia',
    refs: ['NSA_RELEASE', 'KARA_CRITIC'],
  },
  {
    t: at(9, 49, 0), actor: 'civil',
    who: 'FAA Command Center → FAA headquarters',
    from: 'ATCSCC', to: 'FAAHQ',
    what: '"Do we want to think about, uh, scrambling aircraft?" — "Oh, God, I don\'t know." — "That\'s a decision somebody\'s gonna have to make probably in the next ten minutes." (Commission Report, ch. 1, the 09:36-09:53 FAA exchanges.)',
    bearing: 'Recorded at the time and quoted in the Commission report. The exchange ends without a decision.',
    src: 'commission',
    refs: ['COMMISSION'],
  },
  {
    t: at(9, 53, 0), actor: 'civil',
    who: 'FAA headquarters',
    node: 'FAAHQ',
    what: 'Tells the Command Center that the deputy director for air traffic services is discussing scrambling aircraft with Monte Belger. (Commission Report, ch. 1, the 09:36-09:53 FAA exchanges.)',
    bearing: 'Still a discussion. No request reaches the military from this conversation, then or later.',
    src: 'commission',
    refs: ['COMMISSION'],
  },
  {
    t: at(9, 58, 0), actor: 'public',
    who: 'Westmoreland County 911',
    node: 'WCO',
    what: 'Dispatcher Glenn Cramer takes Edward Felt\'s call from a rear lavatory.',
    bearing: 'A county dispatcher, not a federal agency. Included because it is often cited as the government knowing, and it is not that. What Felt said on the call is read more than one way; the readings are set out in the discrepancy register.',
    src: 'commission',
    conflict: 'felt-call',
  },
  {
    t: at(10, 3, 11), actor: 'civil',
    who: 'Cleveland Center and the Command Center',
    what: 'United 93 goes into the ground near Shanksville. The civil side knows within moments.',
    bearing: 'The agency watching the aircraft saw it stop; the crash was known immediately.',
    src: 'ntsb',
  },
  {
    t: at(10, 7, 0), actor: 'military',
    who: 'Cleveland Center → NEADS',
    from: 'ZOB', to: 'NEADSN',
    what: 'The military [[neads]] is told, for the first time, that United 93 was hijacked. (Commission Report, ch. 1; NEADS tapes.)',
    bearing: 'Four minutes after it crashed. There was never a military track on United 93 to vector [[vector]] anyone onto.',
    src: 'commission',
    refs: ['COMMISSION', 'NEADS'],
    conflict: 'neads-first-notice',
    pivotal: true,
  },
  {
    t: at(10, 15, 0), actor: 'military',
    who: 'Washington Center → NEADS',
    from: 'ZDC', to: 'NEADSN',
    what: 'NEADS is told United 93 has crashed.',
    bearing: 'The military learns of the aircraft\'s existence and its destruction eight minutes apart, both after the fact.',
    src: 'commission',
  },
  {
    t: at(10, 18, 0), actor: 'exec',
    who: 'The Vice President, in the PEOC',
    node: 'PEOC',
    what: 'Authorises engagement of an inbound aircraft reported at eighty, then sixty, then thirty miles out. (Commission Report, ch. 1.)',
    bearing: 'The Commission places the Vice President\'s authorisation between about 10:10 and 10:18; there is no documentary record of the call, and NEADS received the order at 10:31. The Commission concluded the range reports probably concerned United 93, relayed from FAA data by the Secret Service. The aircraft had already crashed, and the military never held that track.',
    src: 'commission',
    refs: ['COMMISSION'],
    conflict: 'shootdown-authority-time',
  },
  {
    t: at(10, 31, 0), actor: 'military',
    who: 'NEADS',
    from: 'PEOC', to: 'NEADSN',
    what: 'Receives the shootdown authorisation over the Air Threat Conference Call, and does not pass it to its pilots. (Commission Report, ch. 1; NEADS tapes.)',
    bearing: 'Twenty-eight minutes after United 93 was already down, and the order stops at the sector. The Commission places the Vice President\'s authorisation between about 10:10 and 10:18; there is no documentary record of the call, and NEADS received the order at 10:31.',
    src: 'commission',
    refs: ['COMMISSION', 'NEADS'],
    conflict: 'shootdown-authority-time',
  },
];

/* =============================================================================
   THE 09:36 QUESTION

   "Has anyone requested that the military launch fighters?" The question gets
   read two ways.

   The suspicious reading is that it presumes fighters were already a live
   possibility, and is therefore a trace of an intercept already under way.

   The ordinary reading is that by 09:36 two aircraft had hit the World Trade
   Center, the Pentagon was less than two minutes from being struck, the
   nationwide ground stop had been in force since 09:26, and fighters had been
   scrambled twice already: Otis at 08:46 and Langley at 09:24. Asking whether
   anyone had requested fighters was the obvious step.

   On the specific question of foreknowledge the exchange runs against the
   claim, for three reasons.

   It is evidence of absence. The controller with the radar track is asking
   whether anything is being done, which establishes that as of 09:36 the civil
   side had no indication that anything was. The answer, that it must be run up
   the chain, establishes that there was no standing mechanism either.

   The timing. The best case this app can build for the claim launches from
   Fargo at 08:46. At 09:36, fifty minutes into that flight, the jet is most of
   the way to Pennsylvania, while the agency watching the target is asking
   whether anyone has requested fighters at all. The claim needs an intercept
   fifty minutes old that the controller holding the track has not heard of.

   Every real scramble that morning left a trace. Otis and Langley have tail
   numbers, tapes, times and pilots' names. None of those has been produced for
   the alleged intercept.

   The limit: a covert tasking would not route through FAA headquarters, so
   this exchange cannot disprove one. It does raise the price. The claim needs
   a parallel command channel that left no trace, ran alongside a documented
   chain that was visibly failing to function, and was invisible to the
   controller holding the only track.
   ========================================================================== */

export const FIGHTERS_QUESTION = {
  id: 'fighters-question',
  title: 'Does the 09:36 question show foreknowledge?',
  short: 'No. The exchange establishes that as of 09:36 nothing was under way.',
  readings: [
    { v: 'It presumes fighters were already expected, so something was under way.',
      who: 'The suspicious reading', src: 'claim',
      weight: 'A reading the wording permits.' },
    { v: 'Fighters had already been scrambled [[scramble]] twice that morning, Otis at 08:46 and Langley at 09:24, the nationwide ground stop had been in force since 09:26, and the Pentagon was less than two minutes from being hit. The question is the obvious one.',
      who: 'The ordinary reading', src: 'commission',
      weight: 'Fits every other fact about the morning without requiring anything unseen.' },
  ],
  points: [
    'It is evidence of absence. The controller holding the radar track is asking whether anything is being done, which establishes that nothing visibly was. The answer, that it has to go up the chain, establishes there was no standing mechanism either.',
    'The timing runs against the claim. The best case this app can build launches from Fargo at 08:46. At 09:36 that jet is fifty minutes into its run, while the controller watching the target asks whether anyone has requested fighters at all.',
    'Every real scramble that morning left a trace. Otis and Langley have tail numbers, tapes, times and pilots\' names. None of those has been produced for the alleged intercept.',
  ],
  limit: 'A covert tasking would not route through FAA headquarters [[faa]], so this exchange cannot disprove one. It does make the claim more demanding: it now needs a parallel channel that left no trace, ran alongside a documented chain that was visibly failing, and was invisible to the only people holding a track.',
  src: 'derived',
};

/* The objection this register exists to answer, stated in its strongest form
   and then answered. That is the method the steelman uses on the claim as a
   whole. */
export const AWARENESS_COUNTER = {
  objection: 'The FAA tracked United 93 for thirty-five minutes. So the federal government did know. Why could that not have been passed to a fighter?',
  answers: [
    {
      point: 'The FAA cannot direct fighters.',
      detail: 'Air traffic control [[atc]] separates aircraft; it does not task or vector [[vector]] interceptors. The route from a controller\'s scope to a pilot\'s radio runs through a military sector [[neads]] that has to be asked.',
      src: 'commission',
    },
    {
      point: 'The request was discussed and never made.',
      detail: 'Cleveland Center asked at 09:36. The Command Center raised it again at 09:49. Headquarters was still discussing it at 09:53. No request for military assistance against United 93 reached NEADS before the crash; the first NEADS heard of the flight was at 10:07.',
      src: 'commission',
    },
    {
      point: 'Gibney was not on that net in any case.',
      detail: 'The claim needs a specific pilot, on a transport tasking, to be handed a target by an organisation he was not talking to, using a track it had no channel to give him. Even with every other assumption granted, there is no mechanism by which he could have been given the target.',
      src: 'derived',
    },
    {
      point: 'The FAA\'s failure does not help the claim.',
      detail: 'The register shows a civil agency watching a hijacked airliner approach Washington for half an hour while its headquarters failed to make the request. That is a failure of the civil chain. It does not establish a shootdown. A second channel did exist that morning, from the Secret Service to Andrews, and it is documented: its first fighters left Andrews at 10:38 and 10:42, 35 and 39 minutes after the crash, and neither carried live ammunition. The coordination a shootdown needs is documented only after the crash.',
      src: 'derived',
    },
  ],
  src: 'derived',
};

/* Minutes each side held the aircraft, computed rather than asserted. */
export function awarenessGap() {
  const first = AWARENESS.find((a) => a.actor === 'civil' && a.t >= at(9, 28, 0));
  const mil = AWARENESS.find((a) => a.actor === 'military' && a.pivotal);
  const impact = at(10, 3, 11);
  return {
    civilFrom: first.t,
    militaryFrom: mil.t,
    impact,
    civilMinutes: (impact - first.t) / 60,
    militaryLateMinutes: (mil.t - impact) / 60,
    gapMinutes: (mil.t - first.t) / 60,
  };
}
