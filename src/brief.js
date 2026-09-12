/* =============================================================================
   brief.js — the bottom line, first.

   Everything else in this app is a reference work. You can spend hours in the
   discrepancy register or the phone log, and some people will. Most people will
   not, and the old front door — a timeline scrubber and seven tabs — asked them
   to assemble the argument themselves from parts.

   So this is the argument, stated in the order an argument should be stated:
   the conclusion, then the reasoning, then the evidence, then the objections.
   Each section is a headline you can read in five seconds and a body you can
   open if you want the detail. Skim the headlines and you have the whole case
   in about ninety seconds. Open everything and you are reading for an hour.

   Counter-arguments are inside the sections rather than quarantined in a
   rebuttal page at the end. A counter-argument that only appears after the
   reader has been convinced is decoration; one that appears inside the claim it
   undercuts is an argument.
   ========================================================================== */

export const BOTTOM_LINE = {
  kicker: 'Bottom line',
  headline: 'The flying works. Nothing else does.',
  paras: [
    'There is a story that a US fighter pilot shot down United 93 over Pennsylvania on 11 September 2001. This app builds the strongest possible version of that story — granting it every favourable assumption at once — and then tests it.',
    'The result is worth stating plainly, because most people arguing against this story get it wrong: <strong>the aircraft could have made the trip.</strong> Speed and fuel do not sink it. Anyone who tells you an F-16 was too slow or too short-legged has not checked.',
    'What sinks it is everything that is not flying. The pilot would have to know about a hijacking forty-two minutes before it happened. Nobody was tracking the airliner to guide him — the military first heard the words "United 93" four minutes <em>after</em> it was already in the ground. Permission to shoot did not exist for another half hour. And the one trip that proves he had the fuel also proves he was somewhere else.',
  ],
  verdictNote: 'That is a more useful answer than "impossible". A claim beaten on arithmetic invites better arithmetic. A claim beaten on knowledge, permission and an eyewitness has nowhere left to go.',
  src: 'derived',
};

export const WHY_CRITIC = {
  kicker: 'Why this app is called CRITIC',
  headline: 'It is named after four messages nobody is allowed to read.',
  paras: [
    'A <strong>CRITIC</strong> is the most urgent message the US intelligence system has — a Critical Intelligence Communication, meant to be in front of the President within ten minutes of being sent. It is not routine reporting. Sending one is a deliberate act asserting that the information cannot wait.',
    'Four went out on the morning of 11 September. The first was originated by NORAD at 09:49 and became <strong>DIRNSA CRITIC 1-2001</strong>. Their contents are still withheld.',
    'They matter here because every other source describes what <em>happened</em> — recorders, radar, control tapes. The CRITIC describes what the national command structure <em>believed was happening</em>, timestamped to the minute. And the sequence lands on both sides of the moment this story needs: two messages before the alleged shot, two after.',
  ],
  hook: 'This app is a companion to a public-records request for their text. If the records are released they land here, against the minute of the morning they were sent.',
  src: 'foia',
};

/* The walkthrough. Each section is a headline plus a body; `counter` is the
   strongest objection to that section, carried inside it. */
export const WALKTHROUGH = [
  {
    id: 'w-claim',
    kicker: 'The claim',
    headline: 'What the story actually says',
    body: [
      'Rick Gibney was a real Air National Guard pilot in Fargo, North Dakota. On 11 September he really did fly a state official, Ed Jacoby Jr., from Montana back to Albany, New York. Jacoby has described the flight. That part is not in dispute.',
      'The accusation, made in 2004 by a retired Army colonel on a radio show, is that in between he was scrambled from Fargo, intercepted United 93 over Somerset County, and shot it down with two Sidewinder missiles.',
    ],
    counter: {
      point: 'Is it worth testing at all?',
      text: 'It is a single unsourced assertion by one man, three years after the fact, with no document behind it. The reason to test it anyway is that the checkable parts — a real pilot, a real unit, a real flight that day — are what make it stick. An allegation that gets its details right deserves to be measured rather than dismissed.',
    },
  },

  {
    id: 'w-steelman',
    kicker: 'The method',
    headline: 'Build the best version, then break it',
    body: [
      'Arguing against the weakest form of a claim teaches you nothing: you never find out which of your objections were load-bearing and which were decoration.',
      'So the app grants the story everything it could reasonably want at once — the aircraft, the weapons, the earliest possible takeoff, a perfect route, no air-traffic delays, no weather — and draws the result on the map as a white dashed track called STEELMAN. <strong>No such aircraft existed.</strong> It is drawn to show what the story would require, not to suggest any of it happened.',
    ],
    counter: {
      point: 'Does granting all that not just help the conspiracy theory?',
      text: 'It helps the parts that are true, which is the point. Granting the fuel and the speed and then watching the claim fail anyway is a far stronger result than refusing to grant them. It also means the failures that remain cannot be waved away as hostile assumptions.',
    },
  },

  {
    id: 'w-fuel',
    kicker: 'What survives',
    headline: 'He had the fuel, and the jet could make the trip',
    body: [
      'This is not a concession — it is a finding. The undisputed Montana-to-Albany leg is 1,843 miles in one hop, which no F-16 flies without external fuel tanks bolted on. So the tanks are established by the trip he actually made.',
      'With those tanks, Fargo to Pennsylvania is about 990 miles, roughly 40% of the jet\'s one-way range, needing about 830 mph. That is inside what a tanked F-16 is permitted to fly. <strong>The kinematics work.</strong>',
    ],
    counter: {
      point: 'So the story is possible?',
      text: 'The flying is possible. That is all this establishes, and the app draws the rings to prove it rather than hiding them. Proving the tanks also costs the story something: Mach 2.0 is a clean-configuration number, and a jet carrying tanks cannot reach it. Establishing the fuel caps the speed.',
    },
  },

  {
    id: 'w-knowledge',
    kicker: 'Problem 1',
    headline: 'He would have to know the future',
    body: [
      'To be over Somerset County at 09:58, the earliest usable takeoff is 08:46 — the moment the first aircraft hit the World Trade Center, and the first instant anyone had a reason to act.',
      'At 08:46, United 93 had been airborne four minutes and was climbing normally out of Newark. It would not be hijacked for another <strong>42 minutes</strong>. So launching towards it means already knowing that this particular ordinary flight was going to be seized at 09:28, and where it would be an hour and a quarter later.',
    ],
    counter: {
      point: 'What if he launched later and flew faster?',
      text: 'Then the speed required climbs past what a tanked F-16 can fly. The app lets you move the departure dial and watch the two constraints close on each other. Every achievable speed still requires leaving before the hijacking.',
    },
  },

  {
    id: 'w-tracking',
    kicker: 'Problem 2',
    headline: 'Nobody could have guided him to it',
    body: [
      'A pilot cannot find an airliner crossing Pennsylvania at 400 knots on his own. He has to be vectored, and the organisation that vectors fighters is the air defence sector.',
      'That sector heard the words "United 93" for the first time at <strong>10:07</strong> — four minutes after the aircraft was already in the ground.',
    ],
    counter: {
      point: 'But the FAA knew for thirty-five minutes. Somebody in the government could have told him.',
      text: 'This is the strongest objection in the whole set, and it is right about the facts. Cleveland Center heard the hijacking live at 09:28 and never lost the aircraft. What it gets wrong is the mechanism: air traffic control does not task fighters, the request to the military was discussed at 09:36, again at 09:49, still being discussed at 09:53, and never made. The app now documents that whole chain, minute by minute, in its own section — including how badly it reflects on the FAA.',
      more: 'awareness',
    },
  },

  {
    id: 'w-order',
    kicker: 'Problem 3',
    headline: 'Nobody had permission to shoot',
    body: [
      'No pilot destroys an airliner with forty people aboard on his own judgement. Authorisation to engage civilian aircraft was conveyed at about 10:10 and reached the air defence sector at 10:31 — which then never passed it to its own pilots.',
      'The alleged shot is at 09:58. That is <strong>33 minutes before</strong> the permission existed anywhere in the chain of command.',
    ],
    counter: {
      point: 'What if he acted without orders?',
      text: 'Then the claim changes from "the government shot down Flight 93" to "one pilot committed an unauthorised act of mass killing and every person in his chain covered it for twenty-five years." That is a much larger allegation, and nothing in the record supports it.',
    },
  },

  {
    id: 'w-jacoby',
    kicker: 'Problem 4',
    headline: 'The easy version erases the only witness',
    body: [
      'The route that makes the flying comfortable runs Fargo → intercept → Albany. About 1,320 miles, inside one tank of fuel — and it never goes to Montana.',
      'But Montana is where Ed Jacoby was standing. He was collected, he reached Albany, and he has said so. He is the one first-hand witness to the entire day.',
      'Put Montana back and the run to the intercept grows to about 2,330 miles in the same 72 minutes — roughly <strong>Mach 2.9</strong>, nearly twice what that jet is permitted to fly, and that grants zero seconds on the ground to land and pick someone up.',
    ],
    counter: {
      point: 'Could the Montana leg have happened after the shootdown?',
      text: 'Then he flies east to Pennsylvania, turns around and flies 1,600 miles back west to collect a passenger, then 1,800 miles east again to deliver him. A 4,500-mile day, with a westbound detour immediately after the alleged shot. The app draws that version too.',
    },
  },

  {
    id: 'w-shot',
    kicker: 'Problem 5',
    headline: 'And the shot itself needs a twenty-mile coincidence',
    body: [
      'A Sidewinder is a short-range heat-seeker. It reaches about 11 miles, and will not work closer than about half a mile, so the area it can actually hit is a thin ring roughly twenty miles across.',
      'Two aircraft at those altitudes can <em>see</em> each other about 360 miles apart. Seeing was never the hard part. Being inside a twenty-mile circle around one specific airliner at one specific instant is — and nothing in the record puts him there, or anywhere else.',
    ],
    counter: {
      point: 'The record is incomplete though.',
      text: 'It is, and the app keeps a register of every gap it knows about, including its own. But "no record places him there" is not the same as "the record is silent" — his unit, his passenger and his own account all place him over Montana. The absence has to be argued against positive evidence, not into a vacuum.',
    },
  },
];

/* Where to go next, by how much time you have. The app is both a ninety-second
   read and an afternoon, and it should say so rather than leaving the reader to
   discover which by accident. */
export const PATHS = [
  { min: '2 min',  label: 'Play the guided tour',   act: 'tour',
    note: 'Fourteen steps. The map moves with the argument.' },
  { min: '5 min',  label: 'Who knew, and when',      act: 'tab:aware',
    note: 'The awareness chain, minute by minute, and what it does and does not prove.' },
  { min: '10 min', label: 'The CRITIC messages',     act: 'tab:critic',
    note: 'Four withheld messages, and where the best case for the claim would have been as each one went out.' },
  { min: '20 min', label: 'The full claim analysis', act: 'tab:claim',
    note: 'Every concession, the speed dials, the engagement ring, the fuel rings.' },
  { min: 'hours',  label: 'The discrepancy register', act: 'tab:conflicts',
    note: 'Every contradiction the app knows about, including the ones in the app itself.' },
];
