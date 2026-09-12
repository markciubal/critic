/* =============================================================================
   awareness.js — who knew United 93 was hijacked, and when.

   This app said, for a long time, that "NEADS did not know United 93 existed
   until 10:07". True, and on its own it invites a reasonable objection: the
   FAA knew for thirty-five minutes, so somebody in the federal government
   plainly did — and if somebody did, why could nobody have vectored a fighter?

   That objection deserves an answer rather than a silence, so here is the whole
   chain, with what each step does and does not establish.

   THE SHAPE OF IT

   The crash was not a surprise to the federal government. It was a surprise to
   the United States military. Those are different sentences and the distance
   between them is the most important fact about Flight 93.

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

   It removes the last mechanism. Granting foreknowledge, granting fuel and
   missiles, granting a perfect launch — a pilot still has to be pointed at a
   target moving at four hundred knots, and the only organisation holding that
   track had no way to point him and no authority to try. The FAA does not
   control fighters. The military, which does, was not told.

   `bearing` on each entry is the point of the register: what this step proves,
   and what it does not. An entry that only proves somebody knew something is
   marked as such, because "the government knew" is doing a lot of work in the
   claim and very little of it survives contact with who specifically knew what.
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

   The CRITIC chain gets drawn on the map because a message is a thing that
   travels between places. So is this, and drawing it makes the argument visible
   in a way the prose cannot: the civil network lights up across four states in
   the space of six minutes, and the one node that could have launched a fighter
   stays dark until after the aircraft is already in the ground.
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
           note: 'Originated the CRITIC at 09:49. Alarmed, reporting upward, and not holding a track on United 93.' },
  PEOC:  { name: 'White House / PEOC, Washington DC', short: 'White House',
           lat: 38.8977, lon: -77.0365, actor: 'exec',
           note: 'Where shootdown authority was given at about 10:18, against a picture relayed from FAA data that was already out of date.' },
  WCO:   { name: 'Westmoreland County 911, Greensburg, Pennsylvania', short: 'Westmoreland 911',
           lat: 40.3015, lon: -79.5389, actor: 'public',
           note: 'Took Edward Felt\'s call at 09:58. A county dispatcher, not a federal agency.' },
};

export const AWARENESS = [
  {
    t: at(9, 24, 0), actor: 'civil',
    who: 'United Airlines dispatcher Ed Ballinger',
    what: 'Sends United 93 a warning: "Beware any cockpit intrusion — two a/c hit World Trade Center."',
    bearing: 'An airline, not the government, and a general warning rather than a track. It establishes that the morning was already understood as an attack, four minutes before the takeover.',
    src: 'commission',
  },
  {
    t: at(9, 28, 0), actor: 'civil',
    who: 'Cleveland Center',
    node: 'ZOB',
    what: 'Hears the takeover live — a "Mayday" and the sounds of a struggle over the open radio.',
    bearing: 'The single most important entry. From this second the civil side has the aircraft, and it never loses it.',
    src: 'commission',
  },
  {
    t: at(9, 32, 0), actor: 'civil',
    who: 'Cleveland Center',
    node: 'ZOB',
    what: 'Hears Jarrah keying the wrong switch: "Ladies and Gentlemen: Here the captain, please sit down keep remaining sitting. We have a bomb on board." The controller understands it as a hijacking.',
    bearing: 'Not an inference from radar. A hijacker announcing the hijacking, on tape, to a federal controller.',
    src: 'commission',
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
    what: 'Asks whether anyone has requested that the military launch fighters. Headquarters answers that it has to "run it up the chain of command."',
    bearing: 'The first of several moments where the handoff could have been made and was not. Note who is asking: the controller watching the aircraft. See the note below — this exchange is regularly read as evidence of foreknowledge, and it is closer to the reverse.',
    src: 'commission',
    weigh: 'fighters-question',
  },
  {
    t: at(9, 41, 0), actor: 'civil',
    who: 'Cleveland Center',
    node: 'ZOB',
    what: 'Transponder goes off. The Center holds the aircraft on primary radar and by asking nearby aircraft to look.',
    bearing: 'Losing the transponder did not lose the aircraft. Any claim that United 93 "disappeared" after 09:41 is wrong about the civil picture.',
    src: 'commission',
  },
  {
    t: at(9, 46, 0), actor: 'civil',
    who: 'FAA Command Center → FAA headquarters',
    from: 'ATCSCC', to: 'FAAHQ',
    what: 'Reports United 93 "twenty-nine minutes out of Washington, D.C."',
    bearing: 'Not merely a track — a projection. The civil side knew where it was going and how long it had.',
    src: 'commission',
  },
  {
    t: at(9, 49, 0), actor: 'military',
    who: 'NORAD',
    node: 'NORADN',
    what: 'Originates the CRITIC, putting the hijackings into the national warning channel.',
    bearing: 'The military is alarmed and reporting upward. It is not tracking United 93: the one fragment that survived redaction describes a Boeing 767 from JFK, an aircraft that did not exist.',
    src: 'foia',
  },
  {
    t: at(9, 49, 0), actor: 'civil',
    who: 'FAA Command Center → FAA headquarters',
    from: 'ATCSCC', to: 'FAAHQ',
    what: '"Do we want to think about, uh, scrambling aircraft?" — "Oh, God, I don\'t know." — "That\'s a decision somebody\'s gonna have to make probably in the next ten minutes."',
    bearing: 'The clearest single exchange in the record. Recorded, quoted in the Commission report, and it ends without a decision.',
    src: 'commission',
  },
  {
    t: at(9, 53, 0), actor: 'civil',
    who: 'FAA headquarters',
    node: 'FAAHQ',
    what: 'Tells the Command Center that the deputy director for air traffic services is discussing scrambling aircraft with Monte Belger.',
    bearing: 'Still a discussion. No request reaches the military from this conversation, then or later.',
    src: 'commission',
  },
  {
    t: at(9, 58, 0), actor: 'public',
    who: 'Westmoreland County 911',
    node: 'WCO',
    what: 'Dispatcher Glenn Cramer takes Edward Felt\'s call from a rear lavatory.',
    bearing: 'A county dispatcher, not a federal agency. Included because it is often cited as the government knowing, and it is not that.',
    src: 'commission',
  },
  {
    t: at(10, 3, 11), actor: 'civil',
    who: 'Cleveland Center and the Command Center',
    what: 'United 93 goes into the ground near Shanksville. The civil side knows within moments.',
    bearing: 'The crash was not discovered later by witnesses. The agency watching the aircraft saw it stop.',
    src: 'ntsb',
  },
  {
    t: at(10, 7, 0), actor: 'military',
    who: 'Cleveland Center → NEADS',
    from: 'ZOB', to: 'NEADSN',
    what: 'The military is told, for the first time, that United 93 was hijacked.',
    bearing: 'Four minutes after it crashed. This is the entry the shootdown claim cannot survive: there was no military track to vector anyone onto, at any point, ever.',
    src: 'commission',
    pivotal: true,
  },
  {
    t: at(10, 15, 0), actor: 'military',
    who: 'Washington Center → NEADS',
    from: 'FAAHQ', to: 'NEADSN',
    what: 'NEADS is told United 93 has crashed.',
    bearing: 'The military learns of the aircraft\'s existence and its destruction eight minutes apart, both after the fact.',
    src: 'commission',
  },
  {
    t: at(10, 18, 0), actor: 'exec',
    who: 'The Vice President, in the PEOC',
    node: 'PEOC',
    what: 'Authorises engagement of an inbound aircraft reported at eighty, then sixty, then thirty miles out.',
    bearing: 'The Commission concluded these reports probably concerned United 93, relayed from FAA data by the Secret Service — but the aircraft had already crashed, and the military never held that track. Authority was granted against a picture that was out of date.',
    src: 'commission',
  },
  {
    t: at(10, 31, 0), actor: 'military',
    who: 'NEADS',
    from: 'PEOC', to: 'NEADSN',
    what: 'Receives the shootdown authorisation over the Air Threat Conference Call, and does not pass it to its pilots.',
    bearing: 'Twenty-eight minutes after United 93 was already down, and the order stops at the sector.',
    src: 'commission',
  },
];

/* =============================================================================
   THE 09:36 QUESTION

   "Has anyone requested that the military launch fighters?" It is a striking
   thing for a controller to ask, and it gets read two ways.

   The suspicious reading is that the question presumes fighters were already a
   live possibility — that somebody, somewhere, was expected to have asked — and
   that this is a trace of an intercept already under way.

   The ordinary reading is that by 09:36 two aircraft had hit the World Trade
   Center, the Pentagon was one minute from being struck, every civil departure
   in the country had been stopped, and fighters HAD been scrambled twice
   already — Otis at 08:46, Langley at 09:24. A controller holding a hijacked
   airliner pointed at Washington, on a morning when fighters were already up,
   asking whether anyone had asked for fighters, is not a man who knows
   something. He is a man doing the obvious thing.

   And on the specific question of foreknowledge it runs the wrong way for the
   claim, for three reasons.

   The question is evidence of ABSENCE. The person with the radar track is
   asking whether anything is being done, which establishes that as of 09:36 the
   civil side had no indication that anything was. The answer — that it must be
   run up the chain — establishes that there was no standing mechanism either.

   The timing is worse still. The best case this app can build for the claim
   launches from Fargo at 08:46. At 09:36, fifty minutes into that flight, the
   jet is most of the way to Pennsylvania — while the agency watching the target
   is asking whether anyone has requested fighters at all. The claim therefore
   needs an intercept that is fifty minutes old and that the controller holding
   the track has never heard of.

   And every real scramble that morning left a trace. Otis and Langley have
   tail numbers, tapes, times and pilots' names. The one alleged intercept has
   none of that.

   The honest limit: a covert tasking would not route through FAA headquarters,
   so this exchange cannot disprove one. What it does is raise the price. The
   claim now needs a parallel command channel that left no trace, ran alongside
   a documented chain that was visibly failing to function, and was invisible to
   the controller holding the only track.
   ========================================================================== */

export const FIGHTERS_QUESTION = {
  id: 'fighters-question',
  title: 'Does the 09:36 question show foreknowledge?',
  short: 'No — and it costs the claim rather than helping it.',
  readings: [
    { v: 'It presumes fighters were already expected, so something was under way.',
      who: 'The suspicious reading', src: 'claim',
      weight: 'Reasonable on its face. It is the reason this entry is weighed rather than listed.' },
    { v: 'Fighters had already been scrambled twice that morning — Otis at 08:46, Langley at 09:24 — and the Pentagon was one minute from being hit. The question is the obvious one.',
      who: 'The ordinary reading', src: 'commission',
      weight: 'Fits every other fact about the morning without requiring anything unseen.' },
  ],
  points: [
    'It is evidence of absence. The man holding the radar track is asking whether anything is being done, which establishes that nothing visibly was — and the answer, that it has to go up the chain, establishes there was no standing mechanism either.',
    'The timing runs against the claim. The best case this app can build launches from Fargo at 08:46. At 09:36 that jet is fifty minutes into its run — while the controller watching the target asks whether anyone has requested fighters at all.',
    'Every real scramble that morning left a trace: tail numbers, tapes, times, pilots. The one alleged intercept left none.',
  ],
  limit: 'A covert tasking would not route through FAA headquarters, so this exchange cannot disprove one. What it does is raise the price — the claim now needs a parallel channel that left no trace, ran alongside a documented chain that was visibly failing, and was invisible to the only people holding a track.',
  src: 'derived',
};

/* The objection this register exists to answer, stated in its strongest form
   and then answered — which is the same method the steelman uses on the claim
   as a whole. */
export const AWARENESS_COUNTER = {
  objection: 'The FAA tracked United 93 for thirty-five minutes. So the federal government did know. Why could that not have been passed to a fighter?',
  answers: [
    {
      point: 'The FAA cannot direct fighters.',
      detail: 'Air traffic control separates aircraft; it does not task or vector interceptors. The route from a controller\'s scope to a pilot\'s radio runs through a military sector that has to be asked. The asking is the step that did not happen.',
      src: 'commission',
    },
    {
      point: 'The request was discussed and never made.',
      detail: 'Cleveland Center asked at 09:36. The Command Center raised it again at 09:49. Headquarters was still discussing it at 09:53. No request for military assistance against United 93 reached NEADS before the crash — the first NEADS heard of the flight was at 10:07.',
      src: 'commission',
    },
    {
      point: 'Gibney was not on that net in any case.',
      detail: 'The claim needs a specific pilot, on a transport tasking, to be handed a target by an organisation he was not talking to, using a track it had no channel to give him. Even granting every other assumption, there is no mechanism here to grant.',
      src: 'derived',
    },
    {
      point: 'And the thing that does cut against the official account cuts the other way.',
      detail: 'This register is not flattering to the government. It shows a civil agency watching a hijacked airliner approach Washington for half an hour while its own headquarters failed to make a phone call. That is a real and serious failure. It is not evidence of a shootdown — it is close to the opposite, because a shootdown requires a coordination that demonstrably did not exist that morning.',
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
