/* =============================================================================
   conflicts.js — the discrepancy register.

   Every source in this app disagrees with some other source somewhere. Burying
   that is the single easiest way to make a research tool dishonest, because a
   clean-looking record implies a settledness the evidence does not have.

   So each known conflict is recorded here with its competing readings, who
   says what, and — where it can be said — which reading deserves more weight
   and why. Where it cannot be settled, the entry says that instead of picking.

   `status` is deliberately unflattering to this app:

     'resolved'  the app follows the best-supported reading.
     'todo'      the app still carries the weaker reading. A known defect,
                 listed here rather than quietly left in the data.
     'open'      the sources conflict and nothing available settles it.
     'flagged'   not a conflict between sources but an internal oddity in one,
                 recorded so nobody has to rediscover it.
     'withheld'  a different animal entirely: the record is not disputed, it
                 is redacted. Identified, dated, acknowledged — and blank.
                 A hole with a known shape, listed so the timeline does not
                 read as complete when it is not.

   Ordering within `readings` is strongest-first.
   ========================================================================== */

export const CONFLICTS = [
  {
    id: 'gofer-distance',
    subject: 'GOFER 06 — distance from the Flight 93 crash site',
    tags: ['GOFER'],
    status: 'resolved',
    why: 'This is the number that decides whether the one aircraft near both crash sites was near enough to matter. It is load-bearing for the shootdown claim, so the spread matters.',
    readings: [
      { v: '"about 30 miles"', who: 'O’Brien’s own radio call to Cleveland Center at 10:06', src: 'commission', weight: 'Contemporaneous. Spoken while looking at it.',
    appSays: 'Corrected. The track now places GOFER 06 30 miles from the crash site at 10:06, matching his own radio call, with a closest approach to United 93 of 38 miles.',
  },
      { v: '~34 nautical miles', who: 'Miles Kara, radar reconstruction', src: 'press', weight: 'Instrument-derived, by the Commission’s own radar analyst.' },
      { v: '"about 20 miles off the left wing"', who: 'O’Brien, 9/11 Commission interview, 6 May 2004', src: 'commission', weight: 'Recollection, 32 months after the fact.' },
      { v: '~17 miles', who: 'Secondary retellings', src: 'press', weight: 'No stated basis. Weakest reading.' },
    ],
    reading: 'The figure shrinks with every retelling — which is exactly how a remembered distance behaves. The radio call and the radar independently agree on the larger number, and they should win.',
    appSays: 'The GOFER 06 track still places it ~15 miles out, traced from the weakest of these. It should be moved out to roughly 30.',
  },
  {
    id: 'gofer-takeoff',
    subject: 'GOFER 06 — time off the ground at Andrews',
    tags: ['GOFER'],
    status: 'resolved',
    why: 'O’Brien was held three minutes for wake turbulence behind a 747. Those three minutes are the reason he was where he was when Flight 77 came down, so the exact time is not trivia.',
    readings: [
      { v: '1333Z — 09:33 EDT', who: 'Andrews tower flight strips, cited in the Commission interview; O’Brien confirmed it', src: 'commission', weight: 'Documentary. A written record made at the time.',
    appSays: 'Corrected. The track begins at 09:33, the 1333Z on the Andrews tower strips.',
  },
      { v: '"about 9:30"', who: 'Secondary accounts', src: 'press', weight: 'Rounded.' },
      { v: 'Scheduled for 10:00', who: 'Original flight plan', src: 'press', weight: 'Not a conflict — context. He departed early.' },
    ],
    reading: 'The tower strip is authoritative and the pilot confirmed it. 09:33.',
    appSays: 'The track still begins at 09:30.',
  },
  {
    id: 'gofer-destination',
    subject: 'GOFER 06 — where it ended up',
    tags: ['GOFER'],
    status: 'resolved',
    why: 'A wrong endpoint puts a line on the map that no aircraft ever flew.',
    readings: [
      { v: 'Diverted and landed at Youngstown, Ohio', who: 'O’Brien, 9/11 Commission interview', src: 'commission', weight: 'First-hand, and he describes being debriefed there.',
    appSays: 'Corrected. The track diverts and lands at Youngstown, Ohio, instead of continuing west.',
  },
      { v: 'Continued to Minneapolis', who: 'Secondary accounts', src: 'press', weight: 'Describes the intent, not the outcome. The crew decided to press on for Minneapolis and were then diverted.' },
    ],
    reading: 'Both are true of different moments. He intended Minneapolis and landed at Youngstown.',
    appSays: 'The track still runs west past Youngstown as though he continued.',
  },
  {
    id: 'gofer-side',
    subject: 'GOFER 06 — which side the smoke was on',
    tags: ['GOFER'],
    status: 'flagged',
    why: 'Not a conflict between sources but within a single one, and it is the kind of detail that gets quoted as evidence of something.',
    readings: [
      { v: '"a crew member in the tail of the plane saw some smoke off the right hand side"', who: '9/11 Commission MFR, page 4', src: 'commission', weight: 'Same document.' },
      { v: '"The sight was about 20 miles off the left wing"', who: '9/11 Commission MFR, page 4', src: 'commission', weight: 'Same document, same page.' },
      { v: '"black smoke at our nine o’clock"', who: 'Radio call at 10:06', src: 'commission', weight: 'Nine o’clock is the left side.' },
    ],
    reading: 'The MFR is a staffer’s summary, not a transcript, and it contradicts itself within one page. The contemporaneous radio call says nine o’clock, i.e. left. Read the left-side account as correct and the other as a note-taking slip.',
  },
  {
    id: 'gofer-tcas',
    subject: 'GOFER 06 — how American 77 was spotted',
    tags: ['GOFER'],
    status: 'open',
    why: 'The mechanism of detection is cited in arguments about what the crew could have known.',
    readings: [
      { v: 'TCAS — "that is how he identified other traffic"', who: '9/11 Commission MFR', src: 'commission', weight: 'As summarised by the interviewer.' },
      { v: 'Visual — "He first sighted AAL 77 at 4,000 feet"', who: 'Same MFR, a few lines later', src: 'commission', weight: 'The rest of the account is visual throughout.' },
    ],
    reading: 'These sit awkwardly together: TCAS interrogates transponders, and American 77’s had been off since 08:56, so it should not have appeared. Most likely the TCAS line is a general remark about how he normally finds traffic, not a claim about Flight 77. But it is unresolved, and it is a staffer’s paraphrase rather than the pilot’s words.',
  },
  {
    id: 'falcon-altitude',
    subject: 'The Falcon 20 — how low it went over the crash site',
    tags: ['UA93'],
    status: 'open',
    why: 'The Falcon is the "mystery white jet" of Flight 93 folklore. How low it flew is what people argue about.',
    readings: [
      { v: 'Circled at 6,000–6,500 ft, 10:11–10:15', who: 'Miles Kara, radar reconstruction', src: 'press', weight: 'Instrument-derived, with times.' },
      { v: 'Descended to within ~1,500 ft of the ground', who: 'Co-pilot Yates Gladwell, via Popular Mechanics', src: 'press', weight: 'First-hand, but recollection.' },
    ],
    reading: 'Radar and memory disagree by several thousand feet. Neither is obviously wrong — a crew can descend between sweeps — but the radar timing is firm and it is the better number to quote. What neither reading changes: the Falcon arrived 8–12 minutes after impact, so it saw only the aftermath.',
  },
  {
    id: 'ua93-impact-time',
    subject: 'United 93 — time of impact',
    tags: ['UA93'],
    status: 'resolved',
    why: 'A later impact time would open a window for an intercept, so this is the single most contested timestamp of the morning.',
    readings: [
      { v: '10:03:11', who: 'NTSB, from the recovered flight data recorder', src: 'ntsb', weight: 'Physical recorder aboard the aircraft. Decisive.' },
      { v: '10:06', who: 'Extrapolation from seismic data by one researcher', src: 'claim', weight: 'The author himself agreed the seismic data was not conclusive for UA93.' },
    ],
    reading: 'An FDR beats a seismic inference, and the seismic author conceded the point. 10:03:11.',
    appSays: 'The app uses 10:03:11 throughout.',
  },
  {
    id: 'ua93-altitude',
    subject: 'United 93 — altitude profile',
    tags: ['UA93'],
    status: 'resolved',
    why: 'This app renders altitude on a vertical axis, so getting the profile wrong misrepresents the thing it exists to show.',
    readings: [
      { v: 'Climbs to 41,000 ft at 09:39; down to 5,000 ft by 09:59; back to ~10,000 before impact', who: 'NTSB Flight Path Study, Figure 2 (FDR)', src: 'ntsb', weight: 'Flight data recorder.' },
      { v: 'Level near 35,000 ft until a late descent', who: 'This app, until corrected', src: 'derived', weight: 'Guessed from narrative. Wrong.' },
    ],
    reading: 'The FDR profile is now plotted. The earlier version missed the climb to 41,000 entirely and flew the aircraft at cruise altitude through a descent that reached 5,000 ft.',
    appSays: 'Corrected. UA93 altitudes are now tagged NTSB / FDR.',
  },
  {
    id: 'gofer-callsign',
    subject: 'GOFER 06 — callsign rendering',
    tags: ['GOFER'],
    status: 'open',
    why: 'Minor, but callsigns are how you find an aircraft in a transcript.',
    readings: [
      { v: 'GOFER 06', who: 'Commission MFR, ATC transcripts, the pilot’s own account', src: 'commission', weight: 'Overwhelming majority.' },
      { v: 'Gofer 86', who: 'At least one otherwise careful callsign roster', src: 'press', weight: 'Isolated.' },
    ],
    reading: 'GOFER 06 is almost certainly right; the variant is recorded so a reader who meets it elsewhere knows it is the same aircraft.',
  },
  {
    id: 'andrews-callsign',
    subject: 'Andrews DC ANG — flight callsigns',
    tags: ['BULLY'],
    status: 'open',
    why: 'The app draws a track labelled BULLY and should not pretend that label is settled.',
    readings: [
      { v: 'BULLY / WILD / CAPS', who: 'Callsign roster of the day’s air defence response', src: 'press', weight: 'Specific to 9/11.' },
      { v: 'BULLDOG', who: 'The 121st Fighter Squadron’s historical squadron callsign', src: 'press', weight: 'Correct for the unit generally; may not be what was used that morning.' },
    ],
    reading: 'Unsettled. The app uses BULLY and says so in the callsign reference.',
  },
  {
    id: 'gibney-rank',
    subject: 'Rick Gibney — rank',
    tags: ['CLAIM'],
    status: 'resolved',
    why: 'It is the only checkable detail the claimant offers about the man he names.',
    readings: [
      { v: 'Lieutenant Colonel', who: 'North Dakota Air National Guard', src: 'press', weight: 'His own service.' },
      { v: '"Major"', who: 'Donn de Grand-Pre, 2004', src: 'claim', weight: 'Wrong.' },
    ],
    reading: 'He was a lieutenant colonel. A small error, but the claimant’s one falsifiable detail about the pilot is false.',
    appSays: 'Noted in the claim tab.',
  },
  {
    id: 'claim-time',
    subject: 'The alleged shootdown — what time is being claimed',
    tags: ['CLAIM'],
    status: 'resolved',
    why: 'The claim has drifted since it was made, and the drift is toward making it fit.',
    readings: [
      { v: '"that was hit at 10:00 hours"', who: 'Donn de Grand-Pre, as spoken, February 2004', src: 'claim', weight: 'The original wording.' },
      { v: '09:58', who: 'Later retellings', src: 'claim', weight: 'Hardened after the fact.' },
      { v: '10:03:11', who: 'What actually happened, per the FDR', src: 'ntsb', weight: 'Neither claimed time matches it.' },
    ],
    reading: 'The claimed moment moved. Notably, neither version lines up with the recorder, which puts impact at 10:03:11 — so the allegation does not even match the event it describes.',
    appSays: 'The app tests 09:58, the more favourable of the two for the claim.',
  },
  {
    id: 'rades-outage',
    subject: '84th RADES — a claimed gap in radar coverage',
    tags: ['DATA'],
    status: 'open',
    why: 'If true it would matter for every radar-based argument about the day, including the ones this app relies on second-hand.',
    readings: [
      { v: 'RADES coverage dropped out for a period on 9/11', who: 'Attributed to Charlie Kallas via Miles Kara', src: 'claim', weight: 'Second-hand attribution. Not independently confirmed here.' },
      { v: 'No such gap asserted', who: 'The NTSB and Commission studies built on RADES data', src: 'commission', weight: 'Silence, not denial.' },
    ],
    reading: 'Unverified either way. Recorded because it circulates and because this app cites RADES-derived analysis without having seen the files.',
  },
  {
    id: 'track-provenance',
    subject: 'This app’s flight tracks are not radar data',
    tags: ['DATA'],
    status: 'open',
    why: 'A smooth line on a 3D map reads as measurement. Two of these four are not.',
    readings: [
      { v: '~4.8-second sweeps, several hundred points per flight', who: 'What real 84th RADES data looks like', src: 'press', weight: 'The standard this app does not meet, and will not.' },
      { v: '9–12 hand-placed waypoints, one per ~6 minutes', who: 'AA11 and UA175 in this app', src: 'derived', weight: 'Interpolated with great circles between anchors. Neither recorder was ever recovered, so nothing better exists to use.' },
      { v: 'FDR altitudes and timings; lateral track traced by eye from a printed map', who: 'UA93 and AA77 in this app', src: 'ntsb', weight: 'Vertically sound, laterally approximate.' },
    ],
    reading: 'No RADES file is plotted anywhere in this app, and none will be until someone reads the files. What has changed is the split: AA77 was rebuilt from its own NTSB Flight Path Study, so the two flights whose recorders survived now carry recorder altitudes — the 25,000 ft level-off, the three-minute autopilot disconnect that sags to 22,000, the final 330-degree turn. AA11 and UA175 remain what they always were, and are badged accordingly. This entry stays open permanently: it is a standing caveat about the medium, not a task anyone can finish.',
    appSays: 'AA11 and UA175 are badged RECONSTRUCTED. UA93 and AA77 are badged NTSB / FDR, for the vertical profile only — both lateral tracks are still traced by eye.',
  },
];

CONFLICTS.push(
  {
    id: 'bozeman-albany-nonstop',
    subject: 'Was Bozeman to Albany flown without a fuel stop?',
    tags: ['GIBNEY'],
    status: 'open',
    why: 'The whole fuel finding rests on that leg being one leg. If he stopped, the leg length proves nothing about the tanks \u2014 though the tanks would still be needed, and the Bozeman kinematics would be unchanged.',
    readings: [
      { v: 'Two landings: Bozeman to collect Jacoby, Albany to deliver him', who: 'Press accounts of the mission', src: 'press', weight: 'No intermediate stop is mentioned. This app models it as a single leg.' },
      { v: 'A fuel stop is plausible', who: 'Arithmetic done here', src: 'derived', weight: '1,843 miles is about 82% of a tanked two-seater\u2019s ferry range, and Gibney reportedly flew lower than normal for his passenger\u2019s comfort \u2014 which burns more, not less.' },
    ],
    reading: 'Unresolved, and the app should say so rather than lean on a leg length it cannot confirm. Note which way the uncertainty runs: a fuel stop would weaken the inference that the tanks are proven, but it would not help the claim at all. It adds time to a day the claim already cannot fit, and the Bozeman detour still pushes the intercept to roughly Mach 2.9.',
    appSays: 'The app models two legs and computes the fuel finding from the longer one. The finding is badged as derived.',
  },
  {
    id: 'pentagon-second',
    subject: 'The Pentagon impact — 09:37:45 or 09:37:46?',
    tags: ['DATA'],
    status: 'resolved',
    why: 'It changes nothing. It is here because an app that grades other people to the second should be willing to be graded to the second itself.',
    readings: [
      { v: '09:37:46', who: '9/11 Commission Report', src: 'commission', weight: 'The figure this app used until now, and the one most often quoted.' },
      { v: '09:37:45', who: 'NTSB Flight Path Study, American 77', src: 'ntsb', weight: 'From the recorder. The last FDR subframe.' },
    ],
    reading: 'One second, between two primary sources that agree on everything else. The recorder is the closer instrument, so the app now uses 09:37:45 everywhere — including in GOFER 06’s track, where the C-130 crew watched it happen. Recorded rather than quietly harmonised, because harmonising small disagreements without saying so is how a record stops being checkable.',
    appSays: 'The app uses 09:37:45. The Commission’s 09:37:46 is not wrong, merely coarser.',
  },
  {
    id: 'gofer-track-fixed',
    subject: 'GOFER 06 — the track that manufactured a contact',
    tags: ['GOFER'],
    status: 'resolved',
    why: 'The app drew an unarmed C-130 passing within three miles of United 93. That is inside the ring it draws for an AIM-9, so the app was generating the exact false signal it exists to test for.',
    readings: [
      { v: '"About 30 miles" — his own radio call at 10:06', who: 'ATC transcript', src: 'commission', weight: 'Contemporaneous. The figure now plotted.' },
      { v: '~34 nautical miles southeast', who: 'Miles Kara, radar reconstruction', src: 'press', weight: 'Instrument-derived, and consistent with the radio call.' },
      { v: '~3 miles', who: 'This app, until corrected', src: 'derived', weight: 'Traced from secondary retellings. Wrong, and wrong in the direction that creates a story.' },
    ],
    reading: 'Three errors in one track: a 09:30 departure against the 1333Z on the Andrews tower strips, a westward continuation as though he reached Minnesota, and a closest approach of three miles.',
    appSays: 'Corrected. Departure 09:33, diversion and landing at Youngstown, Ohio, and a closest approach to United 93 of 38 miles — 3.4x outside the AIM-9 ring. The false contact is gone.',
  },
  {
    id: 'airfone-rows',
    subject: 'Airfone installation — nine rows, or twelve?',
    tags: ['CALLS'],
    status: 'open',
    why: 'It bears on how many separate handsets the 37 calls came from, which is what makes the call log hard to fabricate.',
    readings: [
      { v: 'Rows 23 to 34 — twelve rows', who: 'The per-call row numbers in the NPS log', src: 'commission', weight: 'From billing records. The harder datum.' },
      { v: '"The last nine rows"', who: 'National Park Service summary, same page', src: 'commission', weight: 'A single source disagreeing with itself.' },
    ],
    reading: 'Nothing turns on it, but the summary sentence is looser than the data underneath it. The app follows the row numbers.',
  },
  {
    id: 'cell-count',
    subject: 'Cellular calls from United 93 — two, or three?',
    tags: ['CALLS'],
    status: 'open',
    why: 'The cellular count is the whole target of the Faraday-cage argument.',
    readings: [
      { v: 'Two — Edward Felt and CeeCee Lyles', who: 'FBI evidence, Moussaoui sentencing trial', src: 'commission', weight: 'Carrier records. The figure the app uses.' },
      { v: 'Three — plus Andrew "Sonny" Garcia', who: 'NPS call log', src: 'commission', weight: 'Unknown time, a single word before disconnect.' },
    ],
    reading: 'Probably connected-versus-attempted, since an incomplete call would not reach a billing total. That is a guess and is labelled as one. The argument is unaffected either way.',
  },
  {
    id: 'cell-success-rate',
    subject: 'Air-to-ground cell call success rate in 2001',
    tags: ['CALLS', 'DATA'],
    status: 'open',
    why: 'A percentage here would be the most quotable number in the whole dispute, which is exactly why it should not be invented.',
    readings: [
      { v: 'No measured rate worth quoting exists', who: 'Searched and not found', src: 'derived', weight: 'NASA-era work covers avionics interference, not call completion. The 2004 Qualcomm test used an onboard picocell — the opposite mechanism.' },
      { v: '~1% at 20,000 ft, 0% at 7,000 ft in a twin', who: 'A. K. Dewdney, Project Achilles', src: 'claim', weight: 'The only figure in circulation. Advocacy source, small sample, light aircraft rather than airliners.' },
    ],
    reading: 'The qualitative claim stands on engineering grounds — downtilted antennas, handover built for road speeds, too many cells visible at altitude. The quantitative one does not. The app refuses the number even though quoting it would suit its own argument.',
  },
  {
    id: 'fuel-yardstick',
    subject: 'Fuel as a constraint on the Pennsylvania leg — this app overstated it',
    tags: ['CLAIM', 'DATA'],
    status: 'resolved',
    why: 'Fuel was presented as the constraint that closed the claim. It is not, and the error ran in the app\'s favour, which is the direction an error here is least excusable.',
    readings: [
      { v: 'Ferry range with external tanks is about 2,450 miles, one way. Fargo to Somerset County is 1,012 — roughly 41% of it.', who: 'Published F-16 figures with 2 x 370 gal wing tanks and a 300 gal centreline', src: 'press', weight: 'The right yardstick for a one-way transit. An ordinary leg for a tanked fighter.' },
      { v: 'Unrefuelled combat radius is about 340 miles, so Somerset County is 3.0x it and "never enters it, however long you wait".', who: 'This app, until corrected', src: 'derived', weight: 'True of a combat radius — out, fight, and back — and the wrong measure for the leg actually claimed.' },
      { v: 'The full itinerary is 4,522 miles, about 1.85x maximum ferry range.', who: 'Computed here', src: 'derived', weight: 'This part survives: the whole day needs at least one refuelling stop.' },
    ],
    reading: 'Fuel does not rule out the flight to Pennsylvania. It only rules out doing the entire claimed itinerary without refuelling — and refuelling is possible, though a tanker rendezvous leaves scheduling and crew records. The load-bearing arguments are the geometric and evidentiary ones: a 22-mile engagement zone at one instant, NEADS not knowing United 93 existed until 10:07, no order having reached any pilot, and the unit and passenger placing him over Montana.',
    appSays: 'Corrected twice. First the map drew both rings instead of only the restrictive one. Then the combat-radius ring was removed altogether, because a combat radius presumes no external tanks and the documented Montana-to-Albany leg proves the tanks were fitted — so it was a limit for a configuration the record rules out. What remains is ferry range with tanks and its half-radius. The fastest speed band also dropped from Mach 2.0 (a clean-configuration number, now marked unavailable for the same reason) to Mach 1.6, the placarded limit with tanks. A related overclaim, that tanks would preclude carrying Sidewinders, was never made and would have been wrong: tanks sit on the wing and centreline stations, Sidewinders on the wingtip rails.',
  },
  {
    id: 'critic-substance',
    subject: 'DIRNSA CRITIC 1-2001 — the substance of all four messages',
    tags: ['CRITIC'],
    status: 'withheld',
    why: 'The CRITIC is the record of what national leadership was actually told, as against what was actually happening. This app can already draw the second half of that comparison minute by minute. The first half is redacted.',
    readings: [
      { v: 'Four messages, identified by DTG, acknowledged by NSA, released with the substance removed', who: 'NSA FOIA release', src: 'foia', weight: 'The existence, timing and numbering are not in dispute. Only the content is missing.' },
      { v: 'Withheld as "OGA" material because NORAD, as a bi-national command, is not subject to FOIA', who: 'NSA\'s stated ground for withholding', src: 'foia', weight: 'A basis contested by the pending request, which argues a record in NSA\'s own files is an agency record regardless of who wrote it.' },
      { v: 'A phantom "Boeing 767 originating from JFK" and confusion over Flight 77', who: 'The fragments that survived redaction', src: 'foia', weight: 'The only content visible. Both fragments are errors.' },
    ],
    reading: 'Not a contradiction between sources — a hole. Two fragments escaped the redaction and both are wrong, which is precisely why the rest is worth having.',
    appSays: 'The four DTGs are on the timeline as first-class events with their content marked withheld. Nothing is invented to fill them.',
  },
  {
    id: 'critic-addressees',
    subject: 'CRITIC distribution — who was told, and when',
    tags: ['CRITIC'],
    status: 'withheld',
    why: 'A CRITIC exists to reach the President within minutes. Whether it did, and when, is the whole question.',
    readings: [
      { v: 'TO and INFO addressees, routing indicators, delivery and acknowledgment time-stamps — all withheld', who: 'NSA FOIA release', src: 'foia', weight: 'Requested under item (f) of the pending request.' },
      { v: 'The White House Situation Room, NMCC and the NOIWON community are where a CRITIC is designed to land', who: 'CRITIC system design under NSCID No. 7', src: 'press', weight: 'Inference from design, not disclosure.' },
    ],
    reading: 'The app draws the onward links because they are the point, but draws them dashed. Solid lines would assert exactly what the request is trying to establish.',
    appSays: 'NORAD to NSA is solid — that hop is documented. Everything past NSA is dashed and labelled as inferred.',
  },
  {
    id: 'critic-phantom-767',
    subject: 'The "Boeing 767 originating from JFK"',
    tags: ['CRITIC', 'DATA'],
    status: 'open',
    why: 'At the moment the highest-priority warning channel in the US government was carrying this report, it was carrying an aircraft that did not exist.',
    readings: [
      { v: 'A report of a Boeing 767 from JFK heading for Washington', who: 'Visible in the redacted CRITIC release', src: 'foia', weight: 'Fragment. No surrounding context survives.' },
      { v: 'No such flight existed', who: 'The four hijacked aircraft are fully accounted for', src: 'commission', weight: 'Certain.' },
    ],
    reading: 'Where the phantom came from — a garbled relay of American 11, which had been reported still airborne and heading for Washington long after it had struck the North Tower, or something else entirely — cannot be determined from a fragment. The full text would settle it.',
  },
);

export const STATUS_META = {
  resolved: { label: 'Resolved', tone: 'ok', blurb: 'The app follows the best-supported reading.' },
  todo:     { label: 'Known defect', tone: 'bad', blurb: 'The app still carries the weaker reading.' },
  open:     { label: 'Unsettled', tone: 'warn', blurb: 'Sources conflict; nothing available settles it.' },
  flagged:  { label: 'Internal oddity', tone: 'warn', blurb: 'A single source contradicts itself.' },
  withheld: { label: 'Withheld', tone: 'bad', blurb: 'Record acknowledged; substance redacted.' },
};

export const conflictsFor = (tag) => CONFLICTS.filter((c) => c.tags.includes(tag));
export const openCount = () => CONFLICTS.filter((c) => c.status !== 'resolved').length;
