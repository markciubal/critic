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

   Counter-arguments are inside the sections rather than collected in a rebuttal
   page at the end, so each objection is read alongside the claim it undercuts.

   Tokens of the form [[key]] in the string values are glossary references;
   main.js expands them into (i) icons. Each walkthrough section also carries
   `src` (a badge key), `refs` (links.js REFS keys) and `show` ({ t, view,
   layers }), copied from the matching tour step so the two tellings point at
   the same evidence and the same map state.
   ========================================================================== */

export const BOTTOM_LINE = {
  kicker: 'Bottom line',
  headline: 'The flight was feasible. The knowledge, guidance, order and witness it needs are not documented.',
  paras: [
    'There is a story that a US fighter pilot shot down United 93 over Pennsylvania on 11 September 2001. This app builds the strongest possible version of that story [[steelman]], granting it every favourable assumption at once, and then tests it.',
    'The aircraft could have made the trip. Speed and fuel do not rule it out; the common objection that an F-16 was too slow or too short-ranged is wrong.',
    'The remaining problems are not about flying. The pilot would have had to know about the hijacking forty-two minutes before it happened. The military was not tracking the airliner, so nobody in a position to guide him could: the air defence sector [[neads]] first heard the words "United 93" at 10:07, four minutes after impact. Shootdown authority did not reach the sector until 10:31. His documented flight that day began at Fargo and went west to Montana, and the fuel tanks are inferred from the eastbound leg, which was refuelled in the air roughly over Fargo.',
  ],
  verdictNote: 'The result does not depend on speed or fuel figures that could be revised. It depends on the time of the hijacking, the absence of any order, and an eyewitness.',
  src: 'derived',
};

export const WHY_CRITIC = {
  kicker: 'Why this app is called CRITIC',
  headline: 'It is named after four withheld messages.',
  paras: [
    'A CRITIC [[critic]] is the most urgent message the US intelligence system has: a Critical Intelligence Communication, meant to be in front of the President within ten minutes of being sent. Sending one asserts that the information cannot wait.',
    'Four went out on the morning of 11 September. The first was originated by NORAD [[norad]] at 09:49 and became DIRNSA CRITIC 1-2001 [[dirnsa]]. Their contents are still withheld.',
    'They matter here because every other source describes what happened: recorders, radar, control tapes. The CRITIC describes what the national command structure believed was happening, timestamped to the minute. Two of the four were sent before the alleged shot and two after.',
  ],
  hook: 'This app is a companion to a public-records request for their text. If the records are released they will be placed here, against the minute of the morning they were sent.',
  src: 'foia',
};

/* The walkthrough. Each section is a headline plus a body; `counter` is the
   strongest objection to that section, carried inside it. `show` is the tour
   step's clock time (seconds from midnight), camera and layer set. */
export const WALKTHROUGH = [
  {
    id: 'w-claim',
    kicker: 'The claim',
    headline: 'What the story actually says',
    body: [
      'Rick Gibney was an Air National Guard [[ang]] pilot in Fargo, North Dakota. On 11 September he flew a state official, Ed Jacoby Jr., from Montana to Albany, New York. Jacoby has described the flight. That part is not in dispute.',
      'The accusation, made in 2004 by a retired Army colonel on a radio show, is that in between he was scrambled [[scramble]] from Fargo, intercepted United 93 over Somerset County, and shot it down with two Sidewinder [[sidewinder]] missiles.',
      'The claim names Gibney, and Gibney was at Fargo. The wing\'s other F-16s that morning were at Langley, and their morning is on the NEADS [[neads]] tapes (see What was airborne).',
    ],
    counter: {
      point: 'Is it worth testing at all?',
      text: 'It is an assertion by one retired officer, made three years after the fact without any document. The reason to test it is that the checkable parts (a real pilot, a real unit, a real flight that day) are accurate, which is why it has continued to circulate.',
    },
    src: 'press',
    refs: ['GIBNEY', 'CLAIMANT', 'GIBNEY_UNIT'],
    show: { t: 8 * 3600 + 42 * 60, view: 'reset', layers: { routeDoc: true, routeClaim: true, hypo: false } },
  },

  {
    id: 'w-steelman',
    kicker: 'The method',
    headline: 'Build the strongest version of the claim, then test it',
    body: [
      'Testing only the weakest form of a claim does not show which objections actually matter.',
      'So the app grants the story everything it could reasonably want at once (the aircraft, the weapons, the earliest possible takeoff, a perfect route, no air-traffic delays, no weather) and draws the result on the map as a white dashed track called STEELMAN [[steelman]]. No such aircraft existed. It is drawn to show what the story would require, not to suggest any of it happened.',
      'The walkthrough below is the argument in text; the tour is the same argument on the map; the claim tab shows the working.',
    ],
    counter: {
      point: 'Does granting all that not just help the conspiracy theory?',
      text: 'It concedes only the parts that are supported. Granting the fuel and the speed and showing the claim still fails means the remaining failures cannot be attributed to hostile assumptions.',
    },
    src: 'derived',
    refs: [],
    show: { t: 7 * 3600 + 59 * 60, view: 'reset', layers: { hypo: false, envelope: false, wez: false } },
  },

  {
    id: 'w-fuel',
    kicker: 'What survives',
    headline: 'He had the fuel, and the jet could make the trip',
    body: [
      'This follows from the documented flight. The Montana-to-Albany leg, refuelled in the air roughly over Fargo, is 1,843 miles; its Fargo-to-Albany piece is 1,159 miles in one hop, which no two-seat F-16 flies without external fuel tanks [[dropTanks]]. So the tanks are inferred from the trip he made, on the assumption that he refuelled only once.',
      'With those tanks, Fargo to Pennsylvania is about 990 miles, roughly 40% of the jet\'s one-way range, needing about 830 mph. That is inside what a tanked F-16 is permitted to fly [[placard]]. The speed is within the placard limit; fuel burn at that speed is not modelled here.',
    ],
    counter: {
      point: 'So the story is possible?',
      text: 'The flying is possible; that is all this establishes, and the fuel rings on the map show it. Establishing the tanks also limits the speed: Mach 2.0 [[mach]] is a clean-configuration figure, and a jet carrying tanks is limited to Mach 1.6.',
    },
    src: 'derived',
    refs: ['F16', 'GIBNEY'],
    show: { t: 8 * 3600 + 46 * 60 + 40, view: 'place:KFAR', layers: { envelope: true, wez: false, hypo: false, routeDoc: false, routeClaim: true } },
  },

  {
    id: 'w-attitude',
    kicker: 'What survives',
    headline: 'The impact attitude is what an external event would produce',
    body: [
      'United 93 struck the ground inverted, rolled past ninety degrees, about 40 degrees nose-down, at roughly 490 knots [[knots]].',
      'An uncommanded roll is the textbook signature of asymmetric damage: a wing hit, a lost engine, a jammed or departed control surface, spoiler asymmetry. Any of those rolls the aircraft, and left alone rolls it all the way over. It needs nobody at the controls. Alaska Airlines 261 ended up inverted after a jackscrew failure and no one touched a thing to make that happen.',
      'So the attitude at impact is precisely what an external event would produce. It is the strongest card the shootdown reading holds anywhere in the physical record, and it is set out here rather than waved off.',
      'The shape of the final dive points the same way. The descent did not steepen evenly. It held about 2,700 feet per minute for some forty seconds and then broke, reaching roughly 31,900 feet per minute at impact, with eighty per cent of the ten thousand feet lost in the last twenty-eight seconds. That is a rapid loss of control rather than a gradual one. Those rates are computed here from the two published altitude anchors and the published impact attitude, not read off any released trace.',
    ],
    counter: {
      point: 'So does that not support the claim?',
      text: 'It does, and then four things hold it back. The NTSB attributes the roll to flight control inputs, meaning the control wheel moved first. The 757 has irreversible hydraulic controls, so damage cannot back-drive that channel from outside the cockpit. A weapon leaves other marks on a recorder as well, such as asymmetric engine parameters, a hydraulic pressure loss, a sideslip excursion or a break in the data. And the recorder ran coherently to impact, which on its own settles nothing, because most recorders in real missile cases keep running too: twenty-five minutes and a landing after a MANPADS hit a DHL wing at Baghdad, seventy-five minutes after two detonations near the tail of an Embraer at Aktau. What those cases show instead is a systems cascade in the seconds after the burst, and that is the test United 93 has to fail. Those channels were in fact published, in the NTSB flight data recorder factual report for DCA01MA065, and they are undisturbed: the hydraulic low-pressure discrete reads normal on all 2,525 samples to 10:03:08, a threshold indication rather than a pressure reading, both engines run to 10:03:06, engine fire and overheat read normal throughout, and the two engines track each other to the last sample. The roll itself is a recorded parameter rather than an inference, peaking at 161 degrees with pitch at minus 41. So the attitude is real, it is what an external event would produce, and every other channel that an external event would also disturb is clean. The one genuine gap is that there is no cabin pressure channel below 10,000 ft, and the aircraft was below 10,000 ft from 09:58 onward. The auxiliary power unit was off and cold for the whole recorded flight, and the tail channels show nothing: the stabiliser held steady, and the unscheduled stabiliser movement and yaw damper channels read normal to the end. The loud air noise on the voice recorder begins at 10:02:43, four seconds after the overspeed warning trips, as airspeed passes 360 knots, and grows with airspeed; it first appears 4 minutes 43 seconds after the claimed 09:58 intercept.',
    },
    src: 'derived',
    refs: [],
    show: { t: 10 * 3600 + 3 * 60 + 11, view: 'place:SHKV', layers: { hypo: false, envelope: false, wez: false, routeDoc: true } },
  },
  {
    id: 'w-knowledge',
    kicker: 'Problem 1',
    headline: 'The earliest usable takeoff is 42 minutes before the hijacking',
    body: [
      'To be over Somerset County at 09:58, the earliest usable takeoff is 08:46: the moment the first aircraft hit the World Trade Center, and the first point at which anyone had a reason to act.',
      'At 08:46, United 93 had been airborne four minutes and was climbing normally out of Newark. It would not be hijacked for another 42 minutes. So launching towards it means already knowing that this particular flight was going to be seized at 09:28, and where it would be an hour and a quarter later.',
    ],
    counter: {
      point: 'What if he launched later and flew faster?',
      text: 'Then the speed required climbs past what a tanked F-16 can fly [[placard]]. The departure dial in the claim tab moves the takeoff time and shows the required speed against that limit. Every achievable speed still requires leaving before the hijacking. If a different North Dakota jet is proposed: the wing\'s F-16s that were airborne (QUIT) launched from Langley at 09:30 and were over Washington, about 130 miles from Shanksville, at 09:58; their morning is on the NEADS [[neads]] tapes.',
    },
    src: 'commission',
    refs: ['COMMISSION', 'NEADS'],
    show: { t: 8 * 3600 + 46 * 60 + 40, view: 'ua93', layers: { hypo: true, UA93: true } },
  },

  {
    id: 'w-tracking',
    kicker: 'Problem 2',
    headline: 'Nobody could have guided him to it',
    body: [
      'A pilot cannot find an airliner crossing Pennsylvania at about 370 mph (the speed of its recorded track after 09:46) on his own. He has to be vectored [[vector]], and the organisation that scrambles [[scramble]] and vectors fighters is the air defence sector [[neads]].',
      'That sector heard the words "United 93" for the first time at 10:07, four minutes after the aircraft crashed.',
    ],
    counter: {
      point: 'But there were backchannels. The Secret Service put fighters up without NORAD.',
      text: 'This is the strongest form of the objection and it is correct that the channel existed. The Secret Service reached the DC Air National Guard directly and fighters launched on authority relayed from the White House, outside the air defence chain entirely. So the sector not knowing is not on its own enough. What settles it is the clock: that backchannel produced its first fighter at 10:38 and its second at 10:42, thirty-five and thirty-nine minutes after United 93 was already in the ground, and neither of the first two carried live ammunition. The channel worked, and it was slower than the chain it went around. Two further things it cannot supply. It was an arrangement between the executive and a unit guarding the capital, about an aircraft inbound to the capital; nothing like it connects to a transport tasking in North Dakota. And no civil or executive body can vector an intercept: that needs a weapons controller holding a track, which is the thing nobody had until 10:07. Cleveland Center [[faa]] meanwhile heard the hijacking live at 09:28 and never lost the aircraft, and the request to the military was discussed at 09:36, again at 09:49, and still being discussed at 09:53. It was never made. One channel is left, and it is the one this app is named after: a CRITIC [[critic]] is itself a backchannel, the fastest the system has, and one went out at 09:49. Its content is withheld. That is the strongest ground the claim has, and it is why the four messages matter.',
      more: 'awareness',
    },
    src: 'commission',
    refs: ['COMMISSION', 'NEADS'],
    show: { t: 10 * 3600 + 7 * 60, view: 'reset', layers: { hypo: true, aware: true } },
  },

  {
    id: 'w-order',
    kicker: 'Problem 3',
    headline: 'Nobody had permission to shoot',
    body: [
      'Destroying an airliner with forty people aboard requires an order from the chain of command. The earliest documented authorisation to engage civilian aircraft is about 10:10, and it reached the air defence sector [[neads]] at 10:31, passed down through NORAD [[norad]]; the sector then never passed it to its own pilots.',
      'The alleged shot is at 09:58. That is 33 minutes before the order reached the sector, and before the permission is documented anywhere in the chain of command.',
    ],
    counter: {
      point: 'What if he acted without orders?',
      text: 'Then the claim becomes that one pilot fired without orders and his chain of command has concealed it for twenty-five years. No record supports that.',
    },
    src: 'commission',
    refs: ['COMMISSION'],
    show: { t: 10 * 3600 + 31 * 60, view: 'reset', layers: { hypo: true, critic: true } },
  },

  {
    id: 'w-jacoby',
    kicker: 'Problem 4',
    headline: 'The shortest route leaves out the only witness',
    body: [
      'The route that keeps the flying inside the fuel available runs Fargo → intercept → Albany. About 1,320 miles, inside one tank of fuel. It does not go to Montana.',
      'Jacoby was in Montana. He was collected there, reached Albany, and has said so. He is the one first-hand witness to Gibney\'s flight that day. FAA flight records at the National Archives show an F-16 flying the Bozeman-to-Albany leg in the afternoon, arriving at Albany at 18:49; they do not name the pilot.',
      'Put Montana back and the run to the intercept grows to about 2,330 miles in the same 71 minutes: roughly Mach 2.9 [[mach]], nearly twice what that jet is permitted to fly [[placard]], and that grants zero seconds on the ground to land and pick someone up.',
    ],
    counter: {
      point: 'Could the Montana leg have happened after the shootdown?',
      text: 'Then he flies east to Pennsylvania, turns around and flies 1,600 miles back west to collect a passenger, then 1,800 miles east again to deliver him: a 4,500-mile day, with a westbound detour immediately after the alleged shot. The app draws that version too.',
    },
    src: 'press',
    refs: ['GIBNEY'],
    show: { t: 10 * 3600 + 20 * 60, view: 'fit:KBZN,KFAR,KALB', layers: { hypo: true, routeDoc: true, places: true } },
  },

  {
    id: 'w-shot',
    kicker: 'Problem 5',
    headline: 'The shot requires being inside a twenty-mile ring',
    body: [
      'A Sidewinder [[sidewinder]] is a short-range heat-seeker. It reaches about 11 miles, and will not work closer than about half a mile, so the area it can hit is a thin ring roughly twenty miles across [[wez]].',
      'Two aircraft at those altitudes are within line of sight (radio horizon) about 360 miles apart [[lineOfSight]], so line of sight is the wider constraint. The missile requires being within about eleven miles of the airliner at one instant, and no record places him there, or anywhere else, at that time.',
    ],
    counter: {
      point: 'The record is incomplete though.',
      text: 'It is, and the discrepancy register lists every gap the app knows about, including its own. His unit, his passenger and his own account all put him on the Montana trip that day; FAA records time the eastbound leg in the afternoon, but no published record times his departure from Fargo or his arrival at Bozeman.',
    },
    src: 'press',
    refs: ['AIM9'],
    show: { t: 9 * 3600 + 58 * 60, view: 'ua93', layers: { hypo: true, wez: true, envelope: true } },
  },
];

/* Where to go next, by how much time you have. */
export const PATHS = [
  { min: '2 min',  label: 'Play the guided tour',   act: 'tour',
    note: 'Fourteen steps. The map moves with the argument.' },
  { min: '5 min',  label: 'Who knew, and when',      act: 'tab:aware',
    note: 'The awareness chain, minute by minute, with the limits of each record.' },
  { min: '10 min', label: 'The CRITIC messages',     act: 'tab:critic',
    note: 'Four withheld messages, and where the best case for the claim would have been as each one went out.' },
  { min: '20 min', label: 'The full claim analysis', act: 'tab:claim',
    note: 'Every concession, the speed dials, the engagement ring, the fuel rings.' },
  { min: 'hours',  label: 'The discrepancy register', act: 'tab:conflicts',
    note: 'Every contradiction the app knows about, including the ones in the app itself.' },
];
