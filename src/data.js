/* =============================================================================
   data.js — 9/11 timeline, flight tracks, debris field, and the Gibney claim.

   SOURCING DISCIPLINE
   Every record carries a `src` tag. The UI renders these as colour-coded
   provenance badges so a user can always tell established record from
   allegation from my own arithmetic:

     'commission'  9/11 Commission Report (2004), incl. Staff Monograph on
                   the Four Flights; NTSB flight path studies.
     'press'       Contemporary reporting / on-the-record interviews.
     'claim'       An allegation, reproduced so it can be tested. NOT a fact.
     'recon'       Path reconstruction: real documented waypoints, with the
                   segments between them interpolated. Shape is indicative.
     'ntsb'        NTSB Flight Path Study, 19 Feb 2002 — altitudes read off
                   the recovered flight data recorder. The strongest source
                   in this file.
     'geo'         Surveyed coordinates (airports, landmarks).
     'derived'     Computed by this app from the above. Shown with its inputs.
     'foia'        Acknowledged by NSA in a FOIA release whose substance is
                   redacted. The message exists; the content does not, yet.

   Times are seconds after local midnight, US Eastern Daylight Time.
   ========================================================================== */

import { MIL_FLIGHTS } from './military.js';
import { criticEvents } from './critic.js';
import { callEvents } from './calls.js';
export { MIL_FLIGHTS, CALLSIGNS, KERNEL } from './military.js';
export {
  CRITIC_NODES, CRITIC_CHAIN, CRITIC_SUMMARY, CRITIC_GLIMPSE,
  DISTRIBUTION, CRITIC_BACKGROUND, FOIA,
} from './critic.js';
export {
  CALLS, CALL_TOTALS, FARADAY, WHY_THEY_MATTER, PHONE_CONFLICTS, AUDIO,
  durationStats, WHY_SHORT,
} from './calls.js';

export const T0 = 7 * 3600 + 55 * 60; // 07:55 EDT — timeline start
export const T1 = 11 * 3600; // 11:00 EDT — must clear FOLLOW-UP-2 AND FINAL at 10:48

export const hms = (t) => {
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

/* --- Places -------------------------------------------------------------- */

export const PLACES = {
  KBOS: { name: 'Boston Logan', short: 'Logan',        lat: 42.3656, lon: -71.0096, src: 'geo' },
  KEWR: { name: 'Newark Liberty', short: 'Newark',      lat: 40.6925, lon: -74.1687, src: 'geo' },
  KIAD: { name: 'Washington Dulles', short: 'Dulles',   lat: 38.9531, lon: -77.4565, src: 'geo' },
  KLAX: { name: 'Los Angeles Intl', short: 'LAX',    lat: 33.9425, lon: -118.4081, src: 'geo' },
  KSFO: { name: 'San Francisco Intl', short: 'SFO',  lat: 37.6189, lon: -122.3750, src: 'geo' },
  WTC1: { name: 'WTC North Tower', short: 'WTC North',     lat: 40.7127, lon: -74.0134, src: 'geo' },
  WTC2: { name: 'WTC South Tower', short: 'WTC South',     lat: 40.7115, lon: -74.0125, src: 'geo' },
  PENT: { name: 'The Pentagon', short: 'Pentagon',        lat: 38.8719, lon: -77.0563, src: 'geo' },
  SHKV: { name: 'Flight 93 impact crater, Stonycreek Twp, PA', short: 'Flight 93 site', lat: 40.0511, lon: -78.9061, src: 'geo' },
  KFAR: { name: 'Hector Field, Fargo ND', short: 'Fargo',      lat: 46.9207, lon: -96.8158, src: 'geo' },
  KBZN: { name: 'Gallatin Field, Bozeman MT', short: 'Bozeman',  lat: 45.7776, lon: -111.1530, src: 'geo' },
  KALB: { name: 'Albany International, NY', short: 'Albany',    lat: 42.7483, lon: -73.8017, src: 'geo' },
  OTIS: { name: 'Otis ANGB, MA', short: 'Otis ANGB',       lat: 41.6584, lon: -70.5214, src: 'geo' },
  LFI:  { name: 'Langley AFB, VA', short: 'Langley AFB', lat: 37.0829, lon: -76.3605, src: 'geo' },
  ADW:  { name: 'Andrews AFB, MD', short: 'Andrews AFB', lat: 38.8108, lon: -76.8670, src: 'geo' },
  KYNG: { name: 'Youngstown-Warren Regional, OH', short: 'Youngstown', lat: 41.2607, lon: -80.6791, src: 'geo' },
};

/* --- The four hijacked aircraft ------------------------------------------
   `path` waypoints are [timeEDT, lat, lon, altitudeFt]. Waypoints marked in
   `anchors` are documented positions/times; everything between them is
   interpolated, so treat the drawn line as indicative, not as radar data.   */

export const FLIGHTS = [
  {
    id: 'AA11',
    label: 'American 11',
    type: 'Boeing 767-223ER',
    reg: 'N334AA',
    from: 'KBOS', to: 'KLAX',
    souls: 92,
    color: 0xff8c7a,
    src: 'recon',
    path: [
      [at(7, 59, 0), 42.3656, -71.0096, 0],
      [at(8, 9, 0), 42.52, -71.75, 19000],
      [at(8, 14, 0), 42.60, -72.10, 26000],
      [at(8, 21, 0), 42.68, -72.90, 29000],
      [at(8, 26, 0), 42.60, -73.60, 29000],
      [at(8, 32, 0), 42.10, -73.75, 28000],
      [at(8, 39, 0), 41.60, -73.85, 21000],
      [at(8, 44, 0), 41.10, -73.90, 9000],
      [at(8, 46, 40), 40.7127, -74.0134, 1100],
    ],
    events: [
      [at(7, 59, 0), 'Departs Logan for Los Angeles.', 'commission'],
      [at(8, 14, 0), 'Last routine radio contact. Hijacking begins within seconds.', 'commission'],
      [at(8, 19, 0), 'Flight attendant Betty Ong reaches American Airlines by phone.', 'commission'],
      [at(8, 21, 0), 'Transponder switched off.', 'commission'],
      [at(8, 24, 38), 'Hijacker transmits "We have some planes" to ATC by mistake.', 'commission'],
      [at(8, 37, 52), 'Boston Center notifies NEADS — first military warning of the day.', 'commission'],
      [at(8, 46, 40), 'Impact, North Tower, World Trade Center.', 'commission'],
    ],
  },
  {
    id: 'UA175',
    label: 'United 175',
    type: 'Boeing 767-222',
    reg: 'N612UA',
    from: 'KBOS', to: 'KLAX',
    souls: 65,
    color: 0xffa23e,
    src: 'recon',
    path: [
      [at(8, 14, 0), 42.3656, -71.0096, 0],
      [at(8, 24, 0), 42.10, -71.90, 24000],
      [at(8, 33, 0), 41.70, -73.40, 31000],
      [at(8, 42, 0), 41.20, -74.60, 31000],
      [at(8, 47, 0), 40.80, -75.10, 30000],
      [at(8, 51, 0), 40.55, -75.40, 28000],
      [at(8, 55, 0), 40.30, -75.10, 24000],
      [at(8, 58, 0), 40.20, -74.90, 19000],
      [at(9, 1, 0), 40.40, -74.40, 9000],
      [at(9, 3, 2), 40.7115, -74.0125, 900],
    ],
    events: [
      [at(8, 14, 0), 'Departs Logan for Los Angeles.', 'commission'],
      [at(8, 42, 0), 'Last routine radio contact.', 'commission'],
      [at(8, 47, 0), 'Transponder code changes twice — hijacking under way.', 'commission'],
      [at(8, 51, 0), 'New York Center notices the deviation.', 'commission'],
      [at(8, 52, 0), 'Flight attendant and passenger calls report the cockpit seized.', 'commission'],
      [at(9, 3, 2), 'Impact, South Tower, World Trade Center.', 'commission'],
    ],
  },
  {
    id: 'AA77',
    label: 'American 77',
    type: 'Boeing 757-223',
    reg: 'N644AA',
    from: 'KIAD', to: 'KLAX',
    souls: 64,
    color: 0x6fd3ff,
    src: 'ntsb',
    pathNote: 'Altitudes and timings are FDR values from the NTSB Flight Path Study for American 77 (19 Feb 2002). The lateral track is not: the study publishes its ground track as a printed map, so the positions here are anchors traced from it — Dulles, the turn south, 35 mi west of the Pentagon, 3.5 mi west-southwest at 09:34 — joined by a track chosen so that every derived ground speed lands where a 757 can actually fly. The 330-degree turn is drawn as a 3.3-mile arc spiralling to the rollout point; the study gives its start, its end and its total heading change, not its shape. The study places rollout “about 4 miles southwest”, which is rendered here on bearing 250 so the final heading comes out near 070 — the heading the ground damage path shows.',

    path: [
      [at(8, 20, 0), 38.9531, -77.4565, 0],       // A — departs Dulles
      [at(8, 26, 0), 38.9900, -77.9000, 14000],
      [at(8, 34, 0), 39.0500, -79.0500, 29000],
      [at(8, 46, 0), 38.9900, -80.7500, 35000],   // B — reaches 35,000
      [at(8, 51, 0), 38.9700, -81.5000, 35000],   // last routine radio contact
      [at(8, 55, 0), 38.9400, -82.0500, 35000],   // C — deviates, turns south
      [at(8, 56, 0), 38.8500, -82.0200, 35000],   // transponder returns cease
      [at(9, 0, 0), 38.5500, -81.7000, 35000],    // D — heading east, descent begins
      [at(9, 7, 0), 38.5000, -80.7300, 25000],    // E — levels at 25,000
      [at(9, 9, 30), 38.5200, -80.4200, 22000],   // autopilot off, sags to 22,000
      [at(9, 12, 0), 38.5500, -80.1000, 25250],   // re-engaged at 25,250
      [at(9, 22, 0), 38.7000, -78.7000, 25250],   // descent resumes
      [at(9, 29, 0), 38.8700, -77.7100, 7000],    // F — 35 mi west, levels near 7,000
      [at(9, 32, 0), 38.8700, -77.3600, 7200],
      [at(9, 34, 0), 38.8546, -77.1174, 6800],    // 330-degree descending right turn begins
      [at(9, 34, 16), 38.8474, -77.0879, 6400],
      [at(9, 34, 32), 38.8312, -77.0659, 6000],
      [at(9, 34, 49), 38.8095, -77.0559, 5600],
      [at(9, 35, 5), 38.7874, -77.0597, 5200],
      [at(9, 35, 21), 38.7698, -77.0760, 4800],
      [at(9, 35, 38), 38.7608, -77.1008, 4400],
      [at(9, 35, 54), 38.7625, -77.1280, 4000],
      [at(9, 36, 10), 38.7744, -77.1510, 3600],
      [at(9, 36, 26), 38.7940, -77.1643, 3200],
      [at(9, 36, 42), 38.8168, -77.1643, 2800],
      [at(9, 36, 59), 38.8377, -77.1507, 2400],
      [at(9, 37, 15), 38.8521, -77.1261, 2000],   // rollout, ~2,000 ft, ~4 mi out
      [at(9, 37, 45), 38.8719, -77.0563, 0],      // impact, ~460 kt
    ],
    /* Where the record speaks, as against where the line is drawn between. */
    dataPoints: [
      { t: at(8, 20, 0), mark: 'A', label: 'Departs Dulles', src: 'ntsb' },
      { t: at(8, 46, 0), mark: 'B', label: 'Reaches 35,000 ft', src: 'ntsb' },
      { t: at(8, 55, 0), mark: 'C', label: 'Deviates, turns south', src: 'ntsb' },
      { t: at(8, 56, 0), mark: '\u2022', label: 'Transponder returns cease', src: 'ntsb' },
      { t: at(9, 0, 0), mark: 'D', label: 'Heading east, descent begins', src: 'ntsb' },
      { t: at(9, 7, 0), mark: 'E', label: 'Levels at 25,000 ft', src: 'ntsb' },
      { t: at(9, 9, 30), mark: '\u2022', label: 'Autopilot off 3 min — altitude sags to 22,000', src: 'ntsb' },
      { t: at(9, 29, 0), mark: 'F', label: '35 mi west of the Pentagon, levels near 7,000 ft', src: 'ntsb' },
      { t: at(9, 34, 0), mark: '\u2022', label: '330-degree descending right turn begins', src: 'ntsb' },
      { t: at(9, 37, 15), mark: '\u2022', label: 'Rollout at ~2,000 ft; power to near maximum', src: 'ntsb' },
      { t: at(9, 37, 45), mark: 'I', label: 'Impact, 460 kt (530 mph)', src: 'ntsb' },
    ],
    events: [
      [at(8, 20, 0), 'Departs Dulles for Los Angeles.', 'commission'],
      [at(8, 46, 0), 'Reaches its assigned cruising altitude of 35,000 ft.', 'ntsb'],
      [at(8, 51, 0), 'Last routine radio contact.', 'commission'],
      [at(8, 55, 0), 'Deviates from the assigned course and turns south. The autopilot stays engaged through the turn.', 'ntsb'],
      [at(8, 56, 0), 'Transponder returns cease; the flight is lost to controllers.', 'ntsb'],
      [at(9, 7, 0), 'Levels at 25,000 ft. A minute later the autopilot is disconnected for about three minutes and the altitude sags to 22,000 before it is re-engaged.', 'ntsb'],
      [at(9, 29, 0), 'Thirty-five miles west of the Pentagon, the autopilot is disconnected for the last time and the aircraft levels near 7,000 ft.', 'ntsb'],
      [at(9, 32, 0), 'Dulles controllers spot a fast primary target tracking east.', 'commission'],
      [at(9, 34, 0), 'Three and a half miles west-southwest of the Pentagon, begins a 330-degree descending right turn, rolling out at about 2,000 ft.', 'ntsb'],
      [at(9, 37, 45), 'Impact, west face of the Pentagon, at about 460 knots — 530 mph — with power near maximum.', 'ntsb'],
    ],
  },
  {
    id: 'UA93',
    label: 'United 93',
    type: 'Boeing 757-222',
    reg: 'N591UA',
    from: 'KEWR', to: 'KSFO',
    souls: 44,
    color: 0x8cf27a,
    src: 'ntsb',
    pathNote: 'Altitudes are FDR values from the NTSB Flight Path Study (Figure 2). The lateral track is traced from the study\'s radar ground track (Figure 1), which is a printed map, so the ground path remains an approximation while the vertical profile does not.',
    /* Points where the record actually says something, as against the
       interpolation between them. Dropped on the map as a trail so it is
       visible which parts of this track are measured and which are drawn. */
    dataPoints: [
      { t: at(8, 42, 0), mark: 'A', label: 'Departs Newark', src: 'ntsb' },
      { t: at(9, 2, 0), mark: 'B', label: 'Levels at 35,000 ft', src: 'ntsb' },
      { t: at(9, 28, 8), mark: 'C', label: '600 ft deviation — the takeover', src: 'ntsb' },
      { t: at(9, 31, 58), mark: '•', label: 'Cockpit voice recorder begins', src: 'ntsb' },
      { t: at(9, 34, 0), mark: 'D', label: 'Climb begins, turns southeast', src: 'ntsb' },
      { t: at(9, 39, 0), mark: 'E', label: 'Tops out at 41,000 ft', src: 'ntsb' },
      { t: at(9, 41, 0), mark: '•', label: 'Transponder returns cease', src: 'ntsb' },
      { t: at(9, 46, 0), mark: 'F', label: 'Descent interrupted, 19,000 to 20,500 ft', src: 'ntsb' },
      { t: at(9, 57, 0), mark: '•', label: 'Revolt begins', src: 'commission' },
      { t: at(9, 59, 0), mark: 'G', label: '5,000 ft — full-deflection rolls', src: 'ntsb' },
      { t: at(10, 2, 0), mark: 'H', label: '10,000 ft — noses down', src: 'ntsb' },
      { t: at(10, 3, 11), mark: 'I', label: 'Impact, 490 kt, inverted', src: 'ntsb' },
    ],
    path: [
      [at(8, 42, 0), 40.6925, -74.1687, 0],          // A — departs Newark
      [at(8, 50, 0), 40.78, -75.30, 17000],
      [at(8, 55, 0), 40.85, -76.20, 28000],
      [at(9, 2, 0), 40.92, -77.10, 35000],           // B — levels at 35,000
      [at(9, 20, 0), 41.05, -79.10, 35000],
      [at(9, 28, 8), 41.12, -79.75, 35000],          // C — 600 ft deviation
      [at(9, 29, 0), 41.14, -79.90, 34400],
      [at(9, 29, 39), 41.15, -80.00, 35000],
      [at(9, 34, 0), 41.22, -80.60, 35000],          // D — starts climb
      [at(9, 37, 0), 41.34, -81.20, 41000],
      [at(9, 39, 0), 41.38, -81.42, 41000],          // E — max 41,000, turn
      [at(9, 43, 0), 41.15, -80.75, 29000],
      [at(9, 45, 30), 40.99, -80.32, 19000],
      [at(9, 46, 30), 40.94, -80.18, 20500],         // F — descent interrupted
      [at(9, 52, 0), 40.62, -79.72, 13500],
      [at(9, 57, 0), 40.32, -79.32, 7200],
      [at(9, 59, 0), 40.20, -79.16, 5000],           // G — 5,000 ft, rolls begin
      [at(10, 0, 30), 40.13, -79.05, 6100],
      [at(10, 1, 15), 40.10, -78.99, 8300],
      [at(10, 2, 0), 40.07, -78.95, 10000],          // H — noses down
      [at(10, 2, 40), 40.06, -78.92, 6000],
      [at(10, 3, 11), 40.0511, -78.9061, 0],         // I — impact
    ],
    events: [
      [at(8, 42, 0), 'Departs Newark for San Francisco, 25 minutes behind schedule.', 'commission'],
      [at(9, 24, 0), 'Dispatcher warns: "Beware any cockpit intrusion."', 'commission'],
      [at(9, 28, 0), 'Hijacking begins. Sounds of a struggle reach Cleveland Center.', 'commission'],
      [at(9, 32, 0), 'Jarrah keys the wrong switch. An announcement meant for the cabin goes out over the radio to Cleveland Center instead: "Ladies and Gentlemen: Here the captain, please sit down keep remaining sitting. We have a bomb on board." Atta made the identical error on American 11.', 'commission'],
      [at(9, 39, 0), 'A second cabin announcement reaches the controllers: "Uh, this is the captain. I would like you all to remain seated. There is a bomb aboard, and we are going back to the airport, and to have our demands met." The bomb and the promised landing are crowd control, used on all four flights.', 'commission'],
      [at(9, 34, 0), 'Climbs away from 35,000 ft and turns southeast onto heading 120, autopilot in heading select.', 'ntsb'],
      [at(9, 39, 0), 'Tops out at 41,000 ft, holds it about two minutes, then descends at 4,000 ft per minute.', 'ntsb'],
      [at(9, 41, 0), 'Radar stations stop receiving transponder returns.', 'ntsb'],
      [at(9, 46, 0), 'Descent briefly interrupted — climbs from 19,000 to 20,500 ft, then resumes at 1,300 ft per minute.', 'ntsb'],
      [at(9, 57, 0), 'Passengers and crew begin their assault on the cockpit.', 'commission'],
      [at(9, 59, 0), 'At 5,000 ft. Two minutes of full left and right control wheel inputs roll the aircraft 30 degrees each way.', 'ntsb'],
      [at(10, 2, 0), 'Four control column inputs pitch it up and down; it climbs back to about 10,000 ft while turning right.', 'ntsb'],
      [at(10, 3, 11), 'Impacts Stonycreek Township at about 490 knots (563 mph), 40 degrees nose-down and inverted.', 'ntsb'],
    ],
  },
];

/* --- Military response ---------------------------------------------------
   Included because the claim under test is a military one: it asserts an
   intercept that the command timeline has no room for.                      */

/* Command-level events only. The scramble and takeoff moments now live with
   the aircraft that flew them, in military.js, so they are not repeated here. */
export const MILITARY = [
  { t: at(8, 37, 52), place: 'OTIS', text: 'NEADS receives its first warning, on AA11, from Boston Center. Callsign HUNTRESS.', src: 'commission' },
  { t: at(10, 7, 0),  place: 'SHKV', text: 'NEADS first hears of United 93 — four minutes AFTER it has already crashed.', src: 'commission' },
  { t: at(10, 10, 0), place: 'PENT', text: 'Vice President Cheney conveys shootdown authorisation.', src: 'commission' },
  { t: at(10, 31, 0), place: 'LFI',  text: 'NEADS is told of the authorisation — and does not pass it down to its pilots.', src: 'commission' },
];

/* --- Flight 93 debris field ----------------------------------------------
   Distances are computed at runtime from the crater; the values quoted in
   reporting vary because "the debris field" means several different things
   (structural wreckage, human remains, and wind-carried paper).             */

export const DEBRIS = [
  { name: 'Impact crater', lat: 40.0511, lon: -78.9061,
    note: 'A crater roughly 30–50 ft across in reclaimed strip-mine fill. The bulk of the airframe compacted into it.', src: 'commission' },
  { name: 'Immediate wreckage ring', lat: 40.0530, lon: -78.9020,
    note: 'Heavy structure, engine components and the flight recorders were recovered within a few hundred yards.', src: 'commission' },
  { name: 'Adjacent hemlock grove (burn zone)', lat: 40.0545, lon: -78.9003,
    note: 'Scorched treeline immediately downrange of the crater, where lighter airframe fragments came to rest.', src: 'press' },
  { name: 'Indian Lake', lat: 40.0464, lon: -78.8547,
    note: 'Paper, insulation and light debris on the water, about 1.5 miles from the crater. The wind that morning was roughly 9–10 mph out of the northwest.', src: 'press' },
  { name: 'Indian Lake Marina', lat: 40.0410, lon: -78.8480,
    note: 'Light, high-drag debris recovered by residents and investigators.', src: 'press' },
  { name: 'New Baltimore', lat: 39.9958, lon: -78.7756,
    note: 'The furthest widely reported debris, about 8 miles southeast — paper and other wind-borne material, not structure.', src: 'press' },
];

export const DEBRIS_NOTE = {
  title: 'Reading the debris field',
  body: `The scatter is the single most-cited argument that United 93 was shot down, so it is worth stating precisely what is and is not disputed.

Not disputed: light material was found miles from the crater. The FBI recovered paper and soft goods around Indian Lake and as far as New Baltimore.

Disputed is what that implies. The NTSB and the FBI attributed the spread to a roughly 9–10 mph northwesterly wind acting on low-density, high-drag material — paper, insulation, upholstery foam — lofted by the impact fireball. The heavy structure, both engines, and both recorders were recovered at or within a few hundred yards of the crater.

A missile-initiated breakup at altitude predicts the opposite signature: a long trailing debris corridor of STRUCTURE — spars, skin panels, control surfaces — strewn along the flight path for miles. That corridor was not found.`,
  src: 'commission',
};

/* =============================================================================
   THE CLAIM UNDER TEST
   ========================================================================== */

export const CRITIC = {
  claimant: 'Col. Donn de Grand-Pre, U.S. Army (ret.)',
  venue: 'Interview on The Alex Jones Show',
  date: 'February 2004',
  quote: 'No, that was hit at 10:00 hours. It was taken out by the North Dakota Air Guard. I know the pilot who fired those two missiles to take down 93.',
  src: 'claim',
  assertions: [
    { k: 'Pilot',    v: '"Major" Rick Gibney', src: 'claim' },
    { k: 'Unit',     v: 'North Dakota Air National Guard (119th Fighter Wing, "Happy Hooligans"), Fargo', src: 'claim' },
    { k: 'Aircraft', v: 'F-16', src: 'claim' },
    { k: 'Weapons',  v: 'Two AIM-9 Sidewinder air-to-air missiles', src: 'claim' },
    { k: 'Time',     v: '10:00 EDT as spoken; later retellings harden this to 09:58', src: 'claim' },
    { k: 'Place',    v: 'Over Somerset County, Pennsylvania', src: 'claim' },
  ],
};

/* Gibney's documented day, as given by the North Dakota Air National Guard,
   by Gibney himself in interview, and by his passenger.                      */

export const GIBNEY = {
  name: 'Lt. Col. Rick Gibney',
  rankNote: {
    text: 'The claim calls him a Major. He was a lieutenant colonel. A small error, but it is the claimant\'s only checkable detail about the man, and it is wrong.',
    src: 'press',
  },
  passenger: 'Ed Jacoby Jr., Director, New York State Emergency Management Office',
  legs: [
    { from: 'KFAR', to: 'KBZN',
      why: 'Positioning leg. Gibney launches from his home base at Fargo and flies west to collect Jacoby, who is stranded in Montana with every civil aircraft in the country grounded.',
      src: 'press' },
    { from: 'KBZN', to: 'KALB',
      why: 'The mission itself: get New York State\'s emergency management director back to Albany so he can run the state response. Gibney requested clearance to fly lower than normal to reduce the physical stress on a passenger who was not a fighter pilot.',
      src: 'press' },
  ],
  landings: [
    { place: 'KFAR', role: 'Departure', src: 'press' },
    { place: 'KBZN', role: 'Landing 1 — picks up Jacoby', src: 'press' },
    { place: 'KALB', role: 'Landing 2 — delivers Jacoby', src: 'press' },
  ],
  afterword: 'Having dropped Jacoby at Albany, Gibney went back up and flew over New York City after dark. He described being, along with Air Force One, effectively the only thing airborne between New York and Seattle.',
  timingCaveat: {
    text: 'No minute-by-minute log of Gibney\'s day has been published. That cuts both ways, and this app does not pretend otherwise: rather than assert departure times, the feasibility panel lets you set them yourself and shows what speed each leg would then demand.',
    src: 'derived',
  },
  rebuttals: [
    { who: 'Sgt. David Somdahl, North Dakota Air National Guard', text: 'Confirmed Gibney was flying an F-16 that morning — on a transport tasking, carrying an emergency-management official from Montana to New York.', src: 'press' },
    { who: 'Ed Jacoby Jr., the passenger', text: 'Confirmed the route and Gibney\'s whereabouts when United 93 went down, and categorically denied that Gibney shot it down.', src: 'press' },
    { who: 'Rick Gibney', text: 'Declined to comment, saying he did not want to fuel debate by answering unsubstantiated charges.', src: 'press' },
  ],
};

/* The claim's implied itinerary. This is the thing the app actually measures:
   to be true, the claim requires Gibney to have done Fargo -> Shanksville ->
   Bozeman -> Albany, rather than Fargo -> Bozeman -> Albany.                 */

export const CLAIM_ROUTE = {
  id: 'claim',
  label: "Claim: Fargo → Shanksville → Bozeman → Albany",
  legs: [
    { from: 'KFAR', to: 'SHKV', arriveBy: at(9, 58, 0), note: 'Must be over Somerset County with a firing solution.' },
    { from: 'SHKV', to: 'KBZN', note: 'Then reverse course across the continent to collect Jacoby.' },
    { from: 'KBZN', to: 'KALB', note: 'Then cross the continent a third time to deliver him.' },
  ],
  src: 'derived',
};

export const DOC_ROUTE = {
  id: 'documented',
  label: 'Documented: Fargo → Bozeman → Albany',
  legs: [
    { from: 'KFAR', to: 'KBZN' },
    { from: 'KBZN', to: 'KALB' },
  ],
  src: 'press',
};

/* --- F-16 performance envelope, for the speed gauge ----------------------- */

export const F16 = {
  model: 'F-16C/D Fighting Falcon (General Dynamics / Lockheed Martin)',
  cruiseMph: 577,
  maxSeaLevelMph: 915,       // ~Mach 1.2 at sea level, CLEAN
  maxAltitudeMph: 1320,      // ~Mach 2.0 at 40,000 ft, CLEAN — not available here
  maxWithTanksMph: 1050,     // ~Mach 1.6 at altitude: the placarded limit with tanks
  combatRadiusMi: 340,       // unrefuelled, no external tanks
  combatRadiusTanksMi: 578,  // ~70% more with external tanks
  ferryRangeMi: 2450,        // one way, max external fuel, no combat allowance
  ferryRangeAltMi: 2277,     // a lower published figure; see the discrepancy register
  tanks: '2 x 370 US gal on the wing stations plus 1 x 300 gal centreline — about 1,040 gallons external, which roughly doubles the fuel.',
  placard: '600 KIAS or Mach 1.6, whichever is lower, with that tank fit and wingtip AIM-9s.',
  notes: [
    { text: 'Mach 2.0 is a clean-configuration dash number held for minutes, not a cruise speed. Carrying external tanks — which any transcontinental sortie requires — caps you far below it.', src: 'press' },
    { text: 'External tanks change this picture and an earlier version of this app understated them. Two 370-gallon wing tanks and a 300-gallon centreline add about 1,040 gallons — roughly doubling the fuel — for something like a 70% increase in operational radius, and a one-way ferry range around 2,450 miles.', src: 'press' },
    { text: 'So fuel does NOT rule out the Fargo-to-Pennsylvania leg. At 1,012 miles that is about 41% of ferry range: an ordinary transit for a tanked fighter. What fuel rules out is the whole claimed itinerary — 4,522 miles is roughly 1.85x maximum ferry range, so it needs at least one refuelling stop somewhere.', src: 'derived' },
    { text: 'Tanks cost speed. That fit, with wingtip Sidewinders, is placarded to 600 KIAS or Mach 1.6, whichever is lower — so the Mach 2.0 figure above is unavailable to any aircraft configured for this mission, and the fastest envelope drawn on the map uses Mach 1.6 instead.', src: 'press' },
    { text: 'Tanks do not cost armament, and it would be wrong to argue otherwise. Tanks occupy the wing and centreline stations; Sidewinders live on the wingtip rails. The published placard above explicitly describes carrying both at once.', src: 'press' },
    { text: 'Carrying a passenger requires a two-seat F-16B/D. A civilian in the back seat of a jet that then prosecutes an air-to-air kill is its own separate problem for the claim. This inference is the app\'s, not a sourced finding.', src: 'derived' },
  ],
};

/* --- Master event list ---------------------------------------------------- */

export function buildEvents() {
  const out = [];
  for (const f of FLIGHTS) {
    for (const [t, text, src] of f.events) {
      out.push({ t, text, src, kind: 'flight', flight: f.id, label: f.label, color: f.color });
    }
  }
  for (const f of MIL_FLIGHTS) {
    for (const [t, text, src] of f.events) {
      out.push({ t, text, src, kind: 'milflight', flight: f.id, label: f.label, color: f.color });
    }
  }
  for (const m of MILITARY) {
    out.push({ t: m.t, text: m.text, src: m.src, kind: 'military', label: 'Air defence command', color: 0xc9a6ff, place: m.place });
  }
  for (const e of criticEvents()) out.push(e);
  for (const e of callEvents()) out.push(e);
  out.push({
    t: at(9, 58, 0),
    text: 'Alleged missile engagement of United 93. Asserted by Donn de Grand-Pre in 2004; contradicted by the aircrew, the passenger, the unit, and the physical evidence.',
    src: 'claim', kind: 'claim', label: 'The claim', color: 0xffd447,
  });
  out.sort((a, b) => a.t - b.t);
  return out;
}

export const EVENTS = buildEvents();

export const SRC_META = {
  commission: { label: '9/11 Commission', tone: 'solid' },
  press:      { label: 'On the record',   tone: 'solid' },
  geo:        { label: 'Surveyed',        tone: 'solid' },
  recon:      { label: 'Reconstructed',   tone: 'soft' },
  ntsb:       { label: 'NTSB / FDR',      tone: 'solid' },
  derived:    { label: 'Computed here',   tone: 'soft' },
  foia:       { label: 'FOIA — redacted',  tone: 'warn' },
  claim:      { label: 'CLAIM — untested', tone: 'warn' },
};
