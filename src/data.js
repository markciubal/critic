/* =============================================================================
   data.js — 9/11 timeline, flight tracks, debris field, and the Gibney claim.

   SOURCING DISCIPLINE
   Every record carries a `src` tag. The UI renders these as colour-coded
   provenance badges so a user can always tell established record from
   allegation from my own arithmetic:

     'commission'  9/11 Commission Report (2004), incl. Staff Monograph on
                   the Four Flights; NTSB flight path studies.
     'press'       Contemporary reporting / on-the-record interviews.
     'claim'       An allegation, reproduced so it can be tested. Not a fact.
     'recon'       Path reconstruction: real documented waypoints, with the
                   segments between them interpolated. Shape is indicative.
     'ntsb'        NTSB Flight Path Study, 19 Feb 2002 — altitudes read off
                   the recovered flight data recorder.
     'geo'         Surveyed coordinates (airports, landmarks).
     'derived'     Computed by this app from the above. Shown with its inputs.
     'foia'        Acknowledged by NSA in a FOIA release whose substance is
                   redacted: the message is on the record, its content is not.

   SCOPE OF THE FACTUAL GUARANTEE
   Three families in this file are held to full sourcing: the CRITIC message
   sequence (critic.js), Rick Gibney's documented day and the allegation about
   him (CRITIC and GIBNEY below), and the ground eyewitness reports from
   Shanksville (EYEWITNESS below). Each record in those families carries a
   named publication and date, or is marked as an assumption or as
   unretrieved. Other material in this file is sourced to the standard of the
   `src` badge it carries and is not held to that standard.

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
      [at(8, 37, 52), 'Boston Center notifies NEADS, the first military warning of the day.', 'commission'],
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
      [at(8, 47, 0), 'Transponder code changes twice; the hijacking is under way.', 'commission'],
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
    pathNote: 'Altitudes and timings are FDR values from the NTSB Flight Path Study for American 77 (19 Feb 2002). The lateral track is not: the study publishes its ground track as a printed map, so the positions here are anchors traced from it (Dulles, the turn south, 35 mi west of the Pentagon, 3.5 mi west-southwest at 09:34) joined by a track chosen so that every derived ground speed lands where a 757 can fly. The 330-degree turn is drawn as a 3.3-mile arc spiralling to the rollout point; the study gives its start, its end and its total heading change, not its shape. The study places rollout “about 4 miles southwest”, which is rendered here on bearing 250 so the final heading comes out near 070, the heading the ground damage path shows.',

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
      { t: at(9, 9, 30), mark: '\u2022', label: 'Autopilot off 3 min; altitude sags to 22,000', src: 'ntsb' },
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
      [at(9, 37, 45), 'Impact, west face of the Pentagon, at about 460 knots (530 mph) with power near maximum.', 'ntsb'],
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
    pathNote: 'Altitudes are FDR values from the NTSB Flight Path Study (Figure 2), interpolated onto each point. The ground track is a 320-point polyline supplied to this project, at a uniform 1.96-mile spacing, replacing the handful of points previously traced by eye from the printed Figure 1. It was checked before use rather than taken on trust: all nine lettered events in the study fall on the line and in the right order, the ends sit 0.37 miles from Newark and 0.28 miles from the crash site, and every implied ground speed lands between 394 and 552 mph. What it is not is an NTSB digital product: the study publishes its ground track only as a printed map, so the origin of the polyline itself cannot be certified from the document. It is badged GEO for that reason.',
    /* Points where the record actually says something, as against the
       interpolation between them. Dropped on the map as a trail so it is
       visible which parts of this track are measured and which are drawn. */
    dataPoints: [
      { t: at(8, 42, 0), mark: 'A', label: 'Departs Newark', src: 'ntsb' },
      { t: at(9, 2, 0), mark: 'B', label: 'Levels at 35,000 ft', src: 'ntsb' },
      { t: at(9, 28, 8), mark: 'C', label: '600 ft deviation: the takeover', src: 'ntsb' },
      { t: at(9, 31, 58), mark: '•', label: 'Cockpit voice recorder begins', src: 'ntsb' },
      { t: at(9, 34, 0), mark: 'D', label: 'Climb begins, turns southeast', src: 'ntsb' },
      { t: at(9, 39, 0), mark: 'E', label: 'Tops out at 41,000 ft', src: 'ntsb' },
      { t: at(9, 41, 0), mark: '•', label: 'Transponder returns cease', src: 'ntsb' },
      { t: at(9, 46, 0), mark: 'F', label: 'Descent interrupted, 19,000 to 20,500 ft', src: 'ntsb' },
      { t: at(9, 57, 0), mark: '•', label: 'Revolt begins', src: 'commission' },
      { t: at(9, 59, 0), mark: 'G', label: '5,000 ft, full-deflection rolls', src: 'ntsb' },
      { t: at(10, 2, 0), mark: 'H', label: '10,000 ft, noses down', src: 'ntsb' },
      { t: at(10, 3, 11), mark: 'I', label: 'Impact, 490 kt, inverted', src: 'ntsb' },
    ],
    path: [
      [at(8, 42, 0), 40.6895, -74.1745, 0],         // A  Takeoff from Newark, NJ
      [at(8, 42, 18), 40.6940, -74.2107, 640],
      [at(8, 42, 35), 40.6964, -74.2475, 1240],
      [at(8, 42, 53), 40.6971, -74.2848, 1880],
      [at(8, 43, 11), 40.6965, -74.3224, 2510],
      [at(8, 43, 29), 40.6951, -74.3603, 3150],
      [at(8, 43, 47), 40.6931, -74.3983, 3790],
      [at(8, 44, 6), 40.6911, -74.4364, 4460],
      [at(8, 44, 24), 40.6894, -74.4745, 5100],
      [at(8, 44, 42), 40.6885, -74.5124, 5740],
      [at(8, 45, 0), 40.6886, -74.5500, 6380],
      [at(8, 45, 18), 40.6904, -74.5873, 7010],
      [at(8, 45, 36), 40.6940, -74.6241, 7650],
      [at(8, 45, 53), 40.7000, -74.6604, 8250],
      [at(8, 46, 11), 40.7081, -74.6961, 8890],
      [at(8, 46, 29), 40.7179, -74.7313, 9530],
      [at(8, 46, 47), 40.7287, -74.7661, 10160],
      [at(8, 47, 5), 40.7400, -74.8006, 10800],
      [at(8, 47, 23), 40.7514, -74.8349, 11440],
      [at(8, 47, 41), 40.7624, -74.8693, 12080],
      [at(8, 47, 59), 40.7728, -74.9040, 12710],
      [at(8, 48, 16), 40.7822, -74.9393, 13320],
      [at(8, 48, 34), 40.7902, -74.9753, 13950],
      [at(8, 48, 52), 40.7964, -75.0122, 14590],
      [at(8, 49, 10), 40.8004, -75.0495, 15230],
      [at(8, 49, 28), 40.8016, -75.0871, 15870],
      [at(8, 49, 46), 40.7995, -75.1246, 16500],
      [at(8, 50, 4), 40.7939, -75.1616, 17150],
      [at(8, 50, 22), 40.7849, -75.1973, 17810],
      [at(8, 50, 40), 40.7726, -75.2310, 18470],
      [at(8, 50, 58), 40.7573, -75.2621, 19130],
      [at(8, 51, 16), 40.7399, -75.2910, 19790],
      [at(8, 51, 33), 40.7218, -75.3193, 20410],
      [at(8, 51, 51), 40.7044, -75.3481, 21070],
      [at(8, 52, 8), 40.6892, -75.3788, 21690],
      [at(8, 52, 26), 40.6769, -75.4120, 22350],
      [at(8, 52, 44), 40.6671, -75.4471, 23010],
      [at(8, 53, 2), 40.6595, -75.4836, 23670],
      [at(8, 53, 20), 40.6538, -75.5208, 24330],
      [at(8, 53, 38), 40.6495, -75.5581, 24990],
      [at(8, 53, 56), 40.6463, -75.5955, 25650],
      [at(8, 54, 14), 40.6438, -75.6328, 26310],
      [at(8, 54, 32), 40.6419, -75.6701, 26970],
      [at(8, 54, 50), 40.6400, -75.7073, 27630],
      [at(8, 55, 8), 40.6379, -75.7445, 28130],
      [at(8, 55, 26), 40.6353, -75.7816, 28430],
      [at(8, 55, 43), 40.6319, -75.8186, 28720],
      [at(8, 56, 1), 40.6279, -75.8555, 29020],
      [at(8, 56, 19), 40.6236, -75.8924, 29320],
      [at(8, 56, 37), 40.6191, -75.9293, 29620],
      [at(8, 56, 55), 40.6149, -75.9663, 29920],
      [at(8, 57, 13), 40.6111, -76.0035, 30220],
      [at(8, 57, 31), 40.6079, -76.0409, 30520],
      [at(8, 57, 49), 40.6056, -76.0785, 30820],
      [at(8, 58, 7), 40.6044, -76.1161, 31120],
      [at(8, 58, 25), 40.6042, -76.1538, 31420],
      [at(8, 58, 43), 40.6052, -76.1914, 31720],
      [at(8, 59, 1), 40.6075, -76.2288, 32020],
      [at(8, 59, 19), 40.6112, -76.2659, 32320],
      [at(8, 59, 37), 40.6164, -76.3026, 32620],
      [at(8, 59, 55), 40.6230, -76.3388, 32920],
      [at(9, 0, 12), 40.6308, -76.3747, 33200],
      [at(9, 0, 30), 40.6394, -76.4103, 33500],
      [at(9, 0, 48), 40.6487, -76.4457, 33800],
      [at(9, 1, 6), 40.6582, -76.4811, 34100],
      [at(9, 1, 24), 40.6678, -76.5164, 34400],
      [at(9, 1, 42), 40.6772, -76.5518, 34700],
      [at(9, 2, 0), 40.6860, -76.5874, 35000],      // B  Levels at assigned altitude of 35,000 ft
      [at(9, 2, 14), 40.6941, -76.6233, 35000],
      [at(9, 2, 28), 40.7013, -76.6594, 35000],
      [at(9, 2, 42), 40.7077, -76.6958, 35000],
      [at(9, 2, 56), 40.7134, -76.7324, 35000],
      [at(9, 3, 10), 40.7186, -76.7692, 35000],
      [at(9, 3, 25), 40.7233, -76.8061, 35000],
      [at(9, 3, 39), 40.7276, -76.8432, 35000],
      [at(9, 3, 53), 40.7316, -76.8803, 35000],
      [at(9, 4, 7), 40.7354, -76.9176, 35000],
      [at(9, 4, 21), 40.7392, -76.9548, 35000],
      [at(9, 4, 35), 40.7429, -76.9921, 35000],
      [at(9, 4, 49), 40.7468, -77.0293, 35000],
      [at(9, 5, 3), 40.7509, -77.0665, 35000],
      [at(9, 5, 18), 40.7553, -77.1035, 35000],
      [at(9, 5, 32), 40.7600, -77.1405, 35000],
      [at(9, 5, 46), 40.7650, -77.1774, 35000],
      [at(9, 6, 0), 40.7702, -77.2142, 35000],
      [at(9, 6, 14), 40.7757, -77.2509, 35000],
      [at(9, 6, 28), 40.7813, -77.2876, 35000],
      [at(9, 6, 42), 40.7871, -77.3243, 35000],
      [at(9, 6, 56), 40.7929, -77.3609, 35000],
      [at(9, 7, 10), 40.7988, -77.3975, 35000],
      [at(9, 7, 24), 40.8048, -77.4341, 35000],
      [at(9, 7, 39), 40.8107, -77.4707, 35000],
      [at(9, 7, 53), 40.8166, -77.5073, 35000],
      [at(9, 8, 7), 40.8224, -77.5440, 35000],
      [at(9, 8, 21), 40.8281, -77.5806, 35000],
      [at(9, 8, 35), 40.8336, -77.6173, 35000],
      [at(9, 8, 49), 40.8390, -77.6541, 35000],
      [at(9, 9, 3), 40.8443, -77.6908, 35000],
      [at(9, 9, 17), 40.8496, -77.7276, 35000],
      [at(9, 9, 31), 40.8547, -77.7645, 35000],
      [at(9, 9, 45), 40.8598, -77.8013, 35000],
      [at(9, 9, 59), 40.8649, -77.8381, 35000],
      [at(9, 10, 13), 40.8699, -77.8750, 35000],
      [at(9, 10, 27), 40.8750, -77.9119, 35000],
      [at(9, 10, 41), 40.8800, -77.9487, 35000],
      [at(9, 10, 56), 40.8850, -77.9856, 35000],
      [at(9, 11, 10), 40.8901, -78.0224, 35000],
      [at(9, 11, 24), 40.8952, -78.0593, 35000],
      [at(9, 11, 38), 40.9004, -78.0961, 35000],
      [at(9, 11, 52), 40.9056, -78.1329, 35000],
      [at(9, 12, 6), 40.9109, -78.1697, 35000],
      [at(9, 12, 20), 40.9161, -78.2065, 35000],
      [at(9, 12, 34), 40.9214, -78.2433, 35000],
      [at(9, 12, 48), 40.9266, -78.2801, 35000],
      [at(9, 13, 2), 40.9319, -78.3169, 35000],
      [at(9, 13, 16), 40.9371, -78.3537, 35000],
      [at(9, 13, 30), 40.9423, -78.3905, 35000],
      [at(9, 13, 44), 40.9475, -78.4273, 35000],
      [at(9, 13, 58), 40.9526, -78.4641, 35000],
      [at(9, 14, 12), 40.9577, -78.5009, 35000],
      [at(9, 14, 26), 40.9627, -78.5378, 35000],
      [at(9, 14, 41), 40.9676, -78.5747, 35000],
      [at(9, 14, 55), 40.9725, -78.6115, 35000],
      [at(9, 15, 9), 40.9774, -78.6484, 35000],
      [at(9, 15, 23), 40.9822, -78.6853, 35000],
      [at(9, 15, 37), 40.9870, -78.7222, 35000],
      [at(9, 15, 51), 40.9918, -78.7591, 35000],
      [at(9, 16, 5), 40.9966, -78.7961, 35000],
      [at(9, 16, 19), 41.0014, -78.8330, 35000],
      [at(9, 16, 33), 41.0062, -78.8699, 35000],
      [at(9, 16, 47), 41.0110, -78.9068, 35000],
      [at(9, 17, 1), 41.0158, -78.9437, 35000],
      [at(9, 17, 15), 41.0207, -78.9806, 35000],
      [at(9, 17, 29), 41.0256, -79.0175, 35000],
      [at(9, 17, 43), 41.0306, -79.0543, 35000],
      [at(9, 17, 57), 41.0355, -79.0912, 35000],
      [at(9, 18, 11), 41.0405, -79.1281, 35000],
      [at(9, 18, 25), 41.0455, -79.1649, 35000],
      [at(9, 18, 39), 41.0505, -79.2018, 35000],
      [at(9, 18, 53), 41.0554, -79.2387, 35000],
      [at(9, 19, 7), 41.0603, -79.2756, 35000],
      [at(9, 19, 21), 41.0651, -79.3125, 35000],
      [at(9, 19, 35), 41.0699, -79.3494, 35000],
      [at(9, 19, 49), 41.0746, -79.3863, 35000],
      [at(9, 20, 3), 41.0792, -79.4232, 35000],
      [at(9, 20, 17), 41.0837, -79.4602, 35000],
      [at(9, 20, 31), 41.0881, -79.4972, 35000],
      [at(9, 20, 46), 41.0923, -79.5342, 35000],
      [at(9, 21, 0), 41.0965, -79.5713, 35000],
      [at(9, 21, 14), 41.1006, -79.6083, 35000],
      [at(9, 21, 28), 41.1046, -79.6454, 35000],
      [at(9, 21, 42), 41.1086, -79.6825, 35000],
      [at(9, 21, 56), 41.1125, -79.7196, 35000],
      [at(9, 22, 10), 41.1164, -79.7567, 35000],
      [at(9, 22, 24), 41.1203, -79.7938, 35000],
      [at(9, 22, 38), 41.1242, -79.8309, 35000],
      [at(9, 22, 52), 41.1282, -79.8680, 35000],
      [at(9, 23, 6), 41.1321, -79.9050, 35000],
      [at(9, 23, 20), 41.1361, -79.9421, 35000],
      [at(9, 23, 34), 41.1401, -79.9792, 35000],
      [at(9, 23, 48), 41.1441, -80.0163, 35000],
      [at(9, 24, 2), 41.1481, -80.0534, 35000],
      [at(9, 24, 16), 41.1520, -80.0905, 35000],
      [at(9, 24, 30), 41.1559, -80.1276, 35000],
      [at(9, 24, 44), 41.1596, -80.1647, 35000],
      [at(9, 24, 58), 41.1633, -80.2019, 35000],
      [at(9, 25, 12), 41.1668, -80.2390, 35000],
      [at(9, 25, 26), 41.1701, -80.2762, 35000],
      [at(9, 25, 40), 41.1732, -80.3134, 35000],
      [at(9, 25, 54), 41.1762, -80.3507, 35000],
      [at(9, 26, 8), 41.1790, -80.3879, 35000],
      [at(9, 26, 22), 41.1816, -80.4252, 35000],
      [at(9, 26, 36), 41.1842, -80.4625, 35000],
      [at(9, 26, 50), 41.1866, -80.4998, 35000],
      [at(9, 27, 4), 41.1891, -80.5371, 35000],
      [at(9, 27, 18), 41.1914, -80.5745, 35000],
      [at(9, 27, 32), 41.1938, -80.6118, 35000],
      [at(9, 27, 46), 41.1961, -80.6491, 35000],
      [at(9, 28, 0), 41.1985, -80.6865, 35000],     // C  600-ft deviation; assumed takeover point
      [at(9, 28, 14), 41.2010, -80.7238, 34930],
      [at(9, 28, 28), 41.2035, -80.7611, 34770],
      [at(9, 28, 42), 41.2061, -80.7984, 34610],
      [at(9, 28, 55), 41.2088, -80.8357, 34460],
      [at(9, 29, 9), 41.2115, -80.8730, 34540],
      [at(9, 29, 23), 41.2143, -80.9103, 34750],
      [at(9, 29, 37), 41.2172, -80.9475, 34970],
      [at(9, 29, 51), 41.2201, -80.9848, 35000],
      [at(9, 30, 5), 41.2231, -81.0220, 35000],
      [at(9, 30, 18), 41.2262, -81.0592, 35000],
      [at(9, 30, 32), 41.2292, -81.0964, 35000],
      [at(9, 30, 46), 41.2323, -81.1336, 35000],
      [at(9, 31, 0), 41.2354, -81.1708, 35000],
      [at(9, 31, 14), 41.2384, -81.2081, 35000],
      [at(9, 31, 28), 41.2413, -81.2453, 35000],
      [at(9, 31, 41), 41.2441, -81.2826, 35000],
      [at(9, 31, 55), 41.2468, -81.3199, 35000],
      [at(9, 32, 9), 41.2493, -81.3573, 35000],
      [at(9, 32, 23), 41.2515, -81.3948, 35000],
      [at(9, 32, 37), 41.2537, -81.4323, 35000],
      [at(9, 32, 51), 41.2559, -81.4697, 35000],
      [at(9, 33, 5), 41.2583, -81.5072, 35000],
      [at(9, 33, 19), 41.2610, -81.5445, 35000],
      [at(9, 33, 32), 41.2641, -81.5817, 35000],
      [at(9, 33, 46), 41.2679, -81.6187, 35000],
      [at(9, 34, 0), 41.2724, -81.6555, 35000],     // D  Starts climb to 41,000 ft; turns southeast
      [at(9, 34, 14), 41.2778, -81.6921, 35470],
      [at(9, 34, 29), 41.2838, -81.7284, 35970],
      [at(9, 34, 43), 41.2902, -81.7648, 36430],
      [at(9, 34, 57), 41.2966, -81.8014, 36900],
      [at(9, 35, 12), 41.3026, -81.8383, 37400],
      [at(9, 35, 26), 41.3078, -81.8757, 37870],
      [at(9, 35, 41), 41.3111, -81.9133, 38370],
      [at(9, 35, 55), 41.3115, -81.9508, 38830],
      [at(9, 36, 9), 41.3077, -81.9879, 39300],
      [at(9, 36, 24), 41.2990, -82.0239, 39800],
      [at(9, 36, 38), 41.2856, -82.0571, 40270],
      [at(9, 36, 52), 41.2677, -82.0855, 40730],
      [at(9, 37, 6), 41.2458, -82.1078, 41000],
      [at(9, 37, 21), 41.2210, -82.1245, 41000],
      [at(9, 37, 35), 41.1941, -82.1361, 41000],
      [at(9, 37, 49), 41.1664, -82.1421, 41000],
      [at(9, 38, 3), 41.1390, -82.1409, 41000],
      [at(9, 38, 17), 41.1133, -82.1309, 41000],
      [at(9, 38, 31), 41.0895, -82.1130, 41000],
      [at(9, 38, 45), 41.0672, -82.0897, 41000],
      [at(9, 39, 0), 41.0460, -82.0640, 41000],     // E  Maximum altitude of 41,000 ft
      [at(9, 39, 13), 41.0255, -82.0380, 40350],
      [at(9, 39, 25), 41.0058, -82.0115, 39750],
      [at(9, 39, 38), 40.9870, -81.9844, 39100],
      [at(9, 39, 50), 40.9692, -81.9564, 38500],
      [at(9, 40, 3), 40.9527, -81.9271, 37850],
      [at(9, 40, 15), 40.9374, -81.8964, 37250],
      [at(9, 40, 28), 40.9232, -81.8644, 36600],
      [at(9, 40, 41), 40.9099, -81.8315, 35950],
      [at(9, 40, 53), 40.8975, -81.7978, 35350],
      [at(9, 41, 6), 40.8857, -81.7635, 34700],
      [at(9, 41, 19), 40.8744, -81.7289, 34050],
      [at(9, 41, 32), 40.8635, -81.6942, 33400],
      [at(9, 41, 45), 40.8528, -81.6594, 32750],
      [at(9, 41, 57), 40.8424, -81.6245, 32150],
      [at(9, 42, 10), 40.8323, -81.5896, 31500],
      [at(9, 42, 23), 40.8226, -81.5545, 30850],
      [at(9, 42, 36), 40.8133, -81.5193, 30200],
      [at(9, 42, 48), 40.8044, -81.4838, 29600],
      [at(9, 43, 1), 40.7960, -81.4482, 28930],
      [at(9, 43, 14), 40.7880, -81.4122, 28070],
      [at(9, 43, 27), 40.7804, -81.3760, 27200],
      [at(9, 43, 39), 40.7732, -81.3396, 26400],
      [at(9, 43, 52), 40.7663, -81.3031, 25530],
      [at(9, 44, 5), 40.7594, -81.2665, 24670],
      [at(9, 44, 18), 40.7526, -81.2299, 23800],
      [at(9, 44, 31), 40.7456, -81.1934, 22930],
      [at(9, 44, 44), 40.7385, -81.1570, 22070],
      [at(9, 44, 56), 40.7310, -81.1208, 21270],
      [at(9, 45, 9), 40.7231, -81.0848, 20400],
      [at(9, 45, 22), 40.7146, -81.0492, 19530],
      [at(9, 45, 35), 40.7055, -81.0139, 19120],
      [at(9, 45, 47), 40.6957, -80.9791, 19420],
      [at(9, 46, 0), 40.6849, -80.9449, 19750],     // F  Brief interruption in descent
      [at(9, 46, 17), 40.6732, -80.9111, 20180],
      [at(9, 46, 34), 40.6607, -80.8779, 20420],
      [at(9, 46, 50), 40.6475, -80.8451, 20080],
      [at(9, 47, 7), 40.6337, -80.8126, 19720],
      [at(9, 47, 24), 40.6196, -80.7804, 19350],
      [at(9, 47, 41), 40.6052, -80.7482, 18990],
      [at(9, 47, 58), 40.5907, -80.7162, 18630],
      [at(9, 48, 15), 40.5764, -80.6840, 18270],
      [at(9, 48, 32), 40.5622, -80.6518, 17910],
      [at(9, 48, 48), 40.5483, -80.6194, 17570],
      [at(9, 49, 5), 40.5347, -80.5868, 17210],
      [at(9, 49, 22), 40.5213, -80.5540, 16850],
      [at(9, 49, 39), 40.5080, -80.5212, 16490],
      [at(9, 49, 56), 40.4949, -80.4882, 16130],
      [at(9, 50, 13), 40.4819, -80.4553, 15770],
      [at(9, 50, 30), 40.4688, -80.4223, 15410],
      [at(9, 50, 46), 40.4558, -80.3893, 15070],
      [at(9, 51, 3), 40.4426, -80.3563, 14710],
      [at(9, 51, 20), 40.4293, -80.3234, 14350],
      [at(9, 51, 37), 40.4159, -80.2906, 13990],
      [at(9, 51, 54), 40.4025, -80.2578, 13630],
      [at(9, 52, 11), 40.3890, -80.2250, 13270],
      [at(9, 52, 28), 40.3757, -80.1921, 12910],
      [at(9, 52, 45), 40.3625, -80.1591, 12560],
      [at(9, 53, 2), 40.3496, -80.1260, 12200],
      [at(9, 53, 19), 40.3370, -80.0928, 11840],
      [at(9, 53, 35), 40.3247, -80.0593, 11500],
      [at(9, 53, 52), 40.3130, -80.0255, 11150],
      [at(9, 54, 9), 40.3018, -79.9915, 10790],
      [at(9, 54, 26), 40.2910, -79.9572, 10430],
      [at(9, 54, 43), 40.2808, -79.9226, 10080],
      [at(9, 55, 0), 40.2709, -79.8878, 9720],
      [at(9, 55, 17), 40.2614, -79.8526, 9360],
      [at(9, 55, 34), 40.2522, -79.8172, 9010],
      [at(9, 55, 51), 40.2432, -79.7816, 8650],
      [at(9, 56, 8), 40.2345, -79.7457, 8290],
      [at(9, 56, 25), 40.2259, -79.7095, 7940],
      [at(9, 56, 43), 40.2174, -79.6731, 7560],
      [at(9, 57, 0), 40.2093, -79.6365, 7200],
      [at(9, 57, 17), 40.2018, -79.5996, 6890],
      [at(9, 57, 35), 40.1951, -79.5627, 6560],
      [at(9, 57, 52), 40.1895, -79.5256, 6250],
      [at(9, 58, 9), 40.1854, -79.4884, 5940],
      [at(9, 58, 26), 40.1829, -79.4511, 5620],
      [at(9, 58, 43), 40.1824, -79.4138, 5310],
      [at(9, 59, 0), 40.1841, -79.3765, 5000],      // G  Rapid control-wheel inputs; starts climbing
      [at(9, 59, 16), 40.1878, -79.3392, 5200],
      [at(9, 59, 33), 40.1923, -79.3019, 5400],
      [at(9, 59, 49), 40.1963, -79.2646, 5600],
      [at(10, 0, 6), 40.1984, -79.2273, 5810],
      [at(10, 0, 22), 40.1979, -79.1900, 6000],
      [at(10, 0, 38), 40.1952, -79.1526, 6490],
      [at(10, 0, 55), 40.1909, -79.1150, 7320],
      [at(10, 1, 11), 40.1854, -79.0774, 8100],
      [at(10, 1, 28), 40.1779, -79.0407, 8790],
      [at(10, 1, 44), 40.1669, -79.0065, 9400],
      [at(10, 2, 0), 40.1510, -78.9765, 10000],     // H  Noses down; starts rapid descent
      [at(10, 2, 18), 40.1304, -78.9513, 8200],
      [at(10, 2, 36), 40.1066, -78.9311, 6400],
      [at(10, 2, 54), 40.0811, -78.9159, 3290],
      [at(10, 3, 11), 40.0552, -78.9058, 0],        // I  Impact
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
      [at(9, 46, 0), 'Descent briefly interrupted: climbs from 19,000 to 20,500 ft, then resumes at 1,300 ft per minute.', 'ntsb'],
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
  { t: at(10, 7, 0),  place: 'SHKV', text: 'NEADS first hears of United 93, four minutes after it crashed.', src: 'commission' },
  { t: at(10, 10, 0), place: 'PENT', text: 'Vice President Cheney conveys shootdown authorisation. The earliest documented authorisation is about 10:10; the Commission places it between about 10:10 and 10:18.', src: 'commission' },
  { t: at(10, 31, 0), place: 'LFI',  text: 'NEADS is told of the authorisation and does not pass it down to its pilots.', src: 'commission' },
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
    note: 'Paper and small scraps of sheetmetal on the water, under 1.5 miles southeast of the crater. The wind that morning was northwesterly at 9–12 mph, blowing toward the lake. Somerset County coroner Wallace Miller stated that no human remains were found in the lake; remains were confined to about 70 acres around the crash site. Source: Popular Mechanics, "Debunking the 9/11 Myths", March 2005.', src: 'press' },
  { name: 'Indian Lake Marina', lat: 40.0410, lon: -78.8480,
    note: 'Light, high-drag debris recovered by residents and investigators.', src: 'press' },
  { name: 'New Baltimore', lat: 39.9958, lon: -78.7756,
    note: 'The furthest widely reported debris, about 8 miles southeast: paper and other wind-borne material, not structure.', src: 'press' },
];

export const DEBRIS_NOTE = {
  title: 'Reading the debris field',
  body: `The scatter is the most-cited argument that United 93 was shot down. What is and is not disputed:

Not disputed: light material was found miles from the crater. Contemporaneous reporting placed debris more than two miles away at Indian Lake, and a cancelled check and a brokerage statement about eight miles away that week (Philadelphia Daily News, William Bunch, 15 November 2001). Most of the wreckage was buried 20–25 ft under the crater in soft reclaimed strip-mine soil.

Disputed is what that implies. The official account has three parts, all on the record by 2005: the material that travelled was light (paper, small sheetmetal scraps, insulation); Indian Lake is under 1.5 miles southeast of the crater, not the six miles reported in September 2001; and the wind was northwesterly at 9–12 mph, blowing toward the lake. Former NTSB investigator Matthew McCormick gave the mechanism ("very light debris will fly into the air, because of the concussion") and Somerset County coroner Wallace Miller stated that no human remains were found in the lake (Popular Mechanics, March 2005).

The "engine found a mile away" figure is a misreport. The object recovered away from the crater was an engine fan, found in a catchment basin just over 300 yards SOUTH of the crater, which is the direction the aircraft was travelling. The distance and direction are confirmed by Jeff Reinbold of the National Park Service (Popular Mechanics, March 2005). The Mirror's 2002 version, "a section of engine weighing a ton was located 2,000 yards", is the claim-side figure and no retrieved source supports it.

A missile-initiated breakup at altitude [[sidewinder]] predicts a different signature: a long trailing corridor of structure (spars, skin panels, control surfaces) strewn along the flight path for miles. That corridor was not found. The heavy structure and both recorders [[fdr]] were recovered at or within a few hundred yards of the crater.`,
  src: 'press',
  refs: ['DEBRIS'],
};

/* =============================================================================
   EYEWITNESS REPORTS FROM SHANKSVILLE

   One of the three families this app holds to full sourcing. Every record
   below names a publication, an author where the byline is known, and a date.

   The reports cut both ways and are presented that way. `cutsWhichWay` is the
   field that says which:

     'supports-claim'   the account is consistent with, or was offered in
                        support of, a shootdown.
     'undercuts-claim'  the account is inconsistent with a shootdown.
     'neutral'          the account bears on the question without settling it.

   Two accounts by the same witness can cut different ways; where that happens
   they are listed as separate records under the same name, because the field
   describes the account and not the person.

   Ordering rule for the second-aircraft material: the reports are stated in
   full before the explanation offered for them. A reader should be able to see
   what the witnesses said without the rebuttal already attached.
   ========================================================================== */

export const EYEWITNESS = [
  {
    id: 'purbaugh-aircraft',
    name: 'Lee Purbaugh',
    role: 'Scrapyard worker, 32',
    where: 'Rollock Inc. scrapyard, on a ridge overlooking the impact point',
    distanceMi: 0.5,
    distanceText: 'Less than half a mile',
    vantage: 'Direct view of the aircraft in its last seconds and of the impact',
    described: 'The aircraft was low, descending at about 45 degrees and rocking from side to side, then the nose dipped and it went into the ground. He describes it as intact and rolling, not breaking up.',
    quote: 'I heard this real loud noise coming over my head. I looked up and it was Flight 93, barely 50ft above me. It was coming down in a 45 degree and rocking from side to side. Then the nose suddenly dipped and it just crashed into the ground. There was this big fireball and then a huge cloud of smoke.',
    cutsWhichWay: 'undercuts-claim',
    src: 'press',
    source: 'The Mirror (London), "WHAT DID HAPPEN TO FLIGHT 93?", Richard Wallace, 12 September 2002',
    sourceNote: 'Retrieved from a 911research cache of the Mirror page, not from the Mirror itself.',
    url: 'https://www.911research.wtc7.net/~nin11evi/911research/cache/planes/evidence/mirror_whatdidhappen.html',
  },
  {
    id: 'purbaugh-second',
    name: 'Lee Purbaugh',
    role: 'Scrapyard worker, 32',
    where: 'Rollock Inc. scrapyard',
    distanceMi: 0.5,
    distanceText: 'Less than half a mile',
    vantage: 'Same vantage, after the impact',
    described: 'The same witness also reported a second aircraft, white, which circled the area about twice and then left.',
    quote: 'Yes, there was another plane. I didn\'t get a good look but it was white and it circled the area about twice and then it flew off over the horizon.',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'The Mirror (London), Richard Wallace, 12 September 2002',
    sourceNote: 'Cached copy. The account is of an aircraft after the impact, not before it.',
    url: 'https://www.911research.wtc7.net/~nin11evi/911research/cache/planes/evidence/mirror_whatdidhappen.html',
  },
  {
    id: 'mcelwain-before',
    name: 'Susan Mcelwain',
    role: 'Resident of Stonycreek Township, 51',
    where: 'In her minivan near an intersection, Stonycreek Township',
    distanceMi: 2,
    distanceText: 'About two miles from the site',
    vantage: 'Directly under the aircraft she describes',
    described: 'A white jet passed very low over her vehicle seconds before the impact. Two retrieved accounts place a second aircraft over the area before the crash rather than after it, hers and Susan Custer\'s. Hers is the only one that gives an interval.',
    quote: 'It came right over me, I reckon just 40 or 50ft above my mini-van. It was so low I ducked instinctively. It was travelling real fast, but hardly made any sound. Then it disappeared behind some trees. A few seconds later I heard this great explosion and saw this fireball rise up over the trees, so I figured the jet had crashed.',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'The Mirror (London), Richard Wallace, 12 September 2002',
    url: 'https://www.911research.wtc7.net/~nin11evi/911research/cache/planes/evidence/mirror_whatdidhappen.html',
  },
  {
    id: 'mcelwain-description',
    name: 'Susan Mcelwain',
    role: 'Resident of Stonycreek Township, 51',
    where: 'Stonycreek Township',
    distanceMi: 2,
    distanceText: 'About two miles from the site',
    vantage: 'Directly under the aircraft she describes',
    described: 'She described the aircraft as white, unmarked and military in appearance, with two rear-mounted engines, a large fin and two upright side fins, and rejected the Falcon 20 explanation offered later.',
    quote: 'It was white with no markings but it was definitely military, it just had that look. It had two rear engines, a big fin on the back like a spoiler on the back of a car and with two upright fins at the side. ... It definitely wasn\'t one of those executive jets.',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'The Mirror (London), Richard Wallace, 12 September 2002',
    sourceNote: 'Her physical description matches a Dassault Falcon 20 airframe, which has two rear-mounted engines and a large tail. She nonetheless stated it was not that aircraft.',
    url: 'https://www.911research.wtc7.net/~nin11evi/911research/cache/planes/evidence/mirror_whatdidhappen.html',
  },
  {
    id: 'mcelwain-2001',
    name: 'Susan Mcelwain',
    role: 'Resident of Stonycreek Township',
    where: 'Near an intersection, Stonycreek Township',
    distanceMi: 4,
    distanceText: 'Less than four miles from the site, per this report',
    vantage: 'Contemporaneous account given three days after the crash',
    described: 'Her earliest recorded account put the white jet less than a minute before the ground shook. It is the version closest in time to the event, and it is shorter and less specific than her 2002 account.',
    quote: 'Susan Mcelwain of Stonycreek Township said a small white jet with rear engines and no discernible markings swooped low over her minivan near an intersection and disappeared over a hilltop, nearly clipping the tops of trees lining the ridge. It was less than a minute later, Mcelwain said, that the ground shook and a white plume of smoke appeared over the ridge. "It was so close to me I ducked," Mcelwain said. "I heard it hit and saw the smoke."',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'The Bergen Record (NJ), "In Rural Hamlet, The Mystery Mounts; 5 Report Second Plane At Pa. Crash Site", Jeff Pillets, 14 September 2001',
    sourceNote: 'Retrieved from a History Commons / 911timeline mirror. The distance given here differs from the two miles in her 2002 Mirror account.',
    url: 'https://911timeline.s3.amazonaws.com/2001/bergenrecord091401.html',
  },
  {
    id: 'decker-chaney',
    name: 'Dennis Decker and Rick Chaney',
    role: 'Pallet makers',
    where: 'Buckstown Road, about a mile north of the site',
    distanceMi: 1,
    distanceText: 'About a mile north',
    vantage: 'Came outside after hearing the explosion',
    described: 'They heard the explosion, came out to see the mushroom cloud, and then saw a midsized white jet flying low and fast which appeared to circle and then leave. The sequence in their account is explosion first, aircraft second.',
    quote: 'About a mile north on Buckstown Road, Dennis Decker and Rick Chaney were at work making wooden pallets when they heard an explosion and came running outside to watch a large mushroom cloud spreading over the ridge. "As soon as we looked up, we saw a midsized jet flying low and fast," Decker said. "It appeared to make a loop or part of a circle, and then it turned fast and headed out." Decker and Chaney described the plane as a Lear-jet type, with engines mounted near the tail and painted white with no identifying markings.',
    cutsWhichWay: 'neutral',
    src: 'press',
    source: 'The Bergen Record (NJ), Jeff Pillets, 14 September 2001',
    url: 'https://911timeline.s3.amazonaws.com/2001/bergenrecord091401.html',
  },
  {
    id: 'custer-doppstadt',
    name: 'Susan Custer and Robin Doppstadt',
    role: 'Residents; Doppstadt was working in her family food-and-supply store',
    where: 'Near the crash site',
    distanceMi: null,
    distanceText: 'Not stated in the report',
    vantage: 'Ground level',
    described: 'Both describe a small white jet at or around the time of the impact. Doppstadt heard the crash first and then went outside and saw the jet circle once and climb away. Custer\'s account reads jet first, then the boom and the cloud, but gives no interval, so it does not establish how far ahead of the impact the aircraft passed.',
    quote: 'Susan Custer said she saw a small white jet streaking overhead. "Then I heard the boom and saw the mushroom cloud." Robin Doppstadt was working inside her family food-and-supply store when she heard the crash. When she went outside, she said, she saw a small white jet that looked like it was making a single circle over the crash site. "Then it climbed very quickly and took off."',
    cutsWhichWay: 'neutral',
    src: 'press',
    source: 'The Bergen Record (NJ), Jeff Pillets, 14 September 2001',
    url: 'https://911timeline.s3.amazonaws.com/2001/bergenrecord091401.html',
  },
  {
    id: 'peterson',
    name: 'Eric Peterson',
    role: 'Resident of Lambertsville',
    where: 'At work in his garage overlooking the village of Lambertsville',
    distanceMi: 2,
    distanceText: 'Roughly two miles from the impact',
    vantage: 'Clear view of the aircraft low and banked, and of the explosion',
    described: 'The aircraft was low enough to make out detail, banked onto its side, and intact until impact. This is the most frequently quoted close description of the aircraft\'s attitude.',
    quote: 'It was low enough, I thought you could probably count the rivets. You could see more of the roof of the plane than you could the belly. It was on its side. There was a great explosion and you could see the flames. It was a massive, massive explosion. Flames and then smoke and then a massive, massive mushroom cloud.',
    cutsWhichWay: 'undercuts-claim',
    src: 'press',
    source: 'The Plain Dealer (Cleveland), "Pennsylvania crash carries horror into small towns", 12 September 2001',
    sourceNote: 'Retrieved from a compiled witness page reproduced as a PDF at crono911.org, not from The Plain Dealer archive.',
    url: 'https://www.crono911.org/Fonti/918_UnitedAirlinesFlight93_Witnesses.pdf',
  },
  {
    id: 'lambert',
    name: 'Nevin Lambert',
    role: 'Farmer',
    where: 'His own side yard',
    distanceMi: 0.5,
    distanceText: 'Less than half a mile',
    vantage: 'Watched the crash from his property; later found small debris on it',
    described: 'He reported no smoke and no visible damage to the aircraft before impact.',
    quote: 'The plane seemed to be fully, or largely, intact. "I didn\'t see no smoke, nothing," said Nevin Lambert, an elderly farmer who witnessed the crash from his side yard less than a half-mile away.',
    cutsWhichWay: 'undercuts-claim',
    src: 'press',
    source: 'Philadelphia Daily News, "We Know it Crashed, But Not Why", William Bunch, 15 November 2001',
    sourceNote: 'Retrieved from a 911research cache.',
    url: 'https://911research.wtc7.net/cache/planes/analysis/flight93/philadelphiadailynews_111501.html',
  },
  {
    id: 'shepley',
    name: 'Linda Shepley',
    role: 'Resident near Stoystown',
    where: 'Near Stoystown',
    distanceMi: null,
    distanceText: 'Not stated; she had an unobstructed view of the final two minutes',
    vantage: 'Unobstructed view of the last two minutes of flight',
    described: 'She put the aircraft at roughly 2,500 ft, wobbling left and right, with the right wing dipping straight down before it went in. She rejects the shootdown account on the ground that the aircraft was intact.',
    quote: 'She recalls seeing the plane wobbling right and left, at a low altitude of roughly 2,500 feet, when suddenly the right wing abruptly dipped straight down, and the Boeing 757 plunged into the earth. "It\'s not true," said Shepley of the persistent rumors. "If it had been shot down, there would have been pieces flying, but it was intact -- there was nothing wrong with it."',
    cutsWhichWay: 'undercuts-claim',
    src: 'press',
    source: 'Philadelphia Daily News, William Bunch, 15 November 2001',
    url: 'https://911research.wtc7.net/cache/planes/analysis/flight93/philadelphiadailynews_111501.html',
  },
  {
    id: 'butler',
    name: 'Terry Butler',
    role: 'Worker at Stoystown Auto Wreckers',
    where: 'Stoystown Auto Wreckers, US Route 30',
    distanceMi: null,
    distanceText: 'Not stated',
    vantage: 'Saw the aircraft cross nearby property and drop below the tree line',
    described: 'The aircraft crossed the property, pulled up, rolled sharply right and dropped below the tree line. He reported at least two explosions on impact.',
    quote: 'It went across the property and then suddenly pulled up. It rose into the sky and then took a sharp right turn - sort of imbalanced - and just dropped below the tree line.',
    cutsWhichWay: 'undercuts-claim',
    src: 'press',
    source: 'The Tribune-Democrat (Johnstown), "Witness to Flight 93\'s final plunge a living memorial to heroes", David Hurst, 8 August 2021',
    url: 'https://www.tribdem.com/news/witness-to-flight-93s-final-plunge-a-living-memorial-to-heroes/article_b56ef0de-f3a3-11eb-9fff-afebbf74b06e.html',
  },
  {
    id: 'mcclatchey-photo',
    name: 'Val McClatchey',
    role: 'Resident of Indian Lake',
    where: 'Her home at Indian Lake',
    distanceMi: 2.5,
    distanceText: 'About 2.5 miles in a straight line, about 7 miles by road',
    vantage: 'Heard the aircraft and the impact; photographed the smoke column from her porch',
    described: 'She grabbed a digital camera and photographed the smoke column. Her image, "End of Serenity", is the only known photograph of the immediate aftermath. Three FBI agents came to her home about an hour later, examined the image and took her camera\'s memory card.',
    quote: 'McClatchey took the photograph at 10:05:52 a.m. - "just five seconds after Flight 93 crashed" - capturing the mushroom cloud. Three FBI agents visited her home about an hour later, examined the photo on her computer, photographed her house, and took her camera\'s memory card.',
    cutsWhichWay: 'neutral',
    src: 'press',
    source: 'Johnstown Magazine (tribdem.com), "A witness to history", Arlene Johns, 15 September 2021',
    url: 'https://www.tribdem.com/johnstown_magazine/a-witness-to-history/article_b58a006e-1b9d-11ec-b7eb-9ff36a537bc8.html',
  },
  {
    id: 'mcclatchey-argument',
    name: 'Val McClatchey',
    role: 'Resident of Indian Lake',
    where: 'Her home at Indian Lake',
    distanceMi: 2.5,
    distanceText: 'About 2.5 miles in a straight line',
    vantage: 'Photographic',
    described: 'Her own argument against the shootdown reading is that the photograph shows no vapour trails and no airborne debris.',
    quote: 'if it had been shot down, there would have been evidence in the sky ... you do not see any vapor trails or any remnants.',
    cutsWhichWay: 'undercuts-claim',
    src: 'press',
    source: 'Johnstown Magazine (tribdem.com), Arlene Johns, 15 September 2021',
    sourceNote: 'Unresolved tension, recorded rather than reconciled: the timestamp reported for the photograph is 10:05:52, from her camera clock, which does not agree with the 10:03:11 impact time. The accuracy of that camera clock is not established in any source retrieved here.',
    url: 'https://www.tribdem.com/johnstown_magazine/a-witness-to-history/article_b58a006e-1b9d-11ec-b7eb-9ff36a537bc8.html',
  },
  {
    id: 'blades',
    name: 'Kathy Blades',
    role: 'Summer resident',
    where: 'A summer cottage near the impact site',
    distanceMi: 0.25,
    distanceText: 'About a quarter of a mile',
    vantage: 'Ran outside after the crash',
    described: 'She saw the white jet after the crash and described its shape. She could not say how long after the impact it passed.',
    quote: 'Blades and her son ran outside after the crash and saw the jet, with sleek back wings and an angled cockpit, race overhead. "My son said, \'I think we\'re under attack!\'" She said she was so shocked by the crash she can\'t say exactly how long after the impact it was.',
    cutsWhichWay: 'neutral',
    src: 'press',
    source: 'Philadelphia Daily News, William Bunch, 15 November 2001',
    url: 'https://911research.wtc7.net/cache/planes/analysis/flight93/philadelphiadailynews_111501.html',
  },
  {
    id: 'temyer',
    name: 'Laura Temyer',
    role: 'Resident of Hooversville',
    where: 'Hooversville, several miles north of the site',
    distanceMi: null,
    distanceText: 'Several miles north',
    vantage: 'Heard the aircraft; did not see it',
    described: 'She heard the engine sound change and then three booms, and concluded the aircraft was shot down. She is the clearest case of a named witness who reached that conclusion from what she heard rather than from what she saw. She said she reported it to the FBI twice.',
    quote: '"I heard like a boom and the engine sounded funny," she told the Daily News. "I heard two more booms -- and then I did not hear anything." What does Temyer think she heard? "I think the plane was shot down," insists Temyer, who said she has twice told her story to the FBI.',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'Philadelphia Daily News, William Bunch, 15 November 2001',
    url: 'https://911research.wtc7.net/cache/planes/analysis/flight93/philadelphiadailynews_111501.html',
  },
  {
    id: 'wilt',
    name: 'Joe Wilt',
    role: 'Resident, 63',
    where: 'A quarter of a mile from the crash site',
    distanceMi: 0.25,
    distanceText: 'A quarter of a mile',
    vantage: 'Heard the impact; did not report seeing an aircraft',
    described: 'His first impression of the noise was a missile. This is an impression of a sound, not a sighting.',
    quote: 'The first thing I thought it was, was a missile.',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'The Washington Post, "Jetliner Was Diverted Toward Washington Before Crash in Pa.", 12 September 2001',
    sourceNote: 'Retrieved from a compiled witness page reproduced as a PDF at crono911.org, not from the Washington Post archive.',
    url: 'https://www.crono911.org/Fonti/918_UnitedAirlinesFlight93_Witnesses.pdf',
  },
  {
    id: 'stuhl',
    name: 'Ernie Stuhl',
    role: 'Mayor of Shanksville',
    where: 'Shanksville',
    distanceMi: null,
    distanceText: 'Not applicable; he is relaying other people\'s accounts',
    vantage: 'None. This is second-hand.',
    described: 'He relayed reports of a missile sound from two residents he declined to name, and said he understood F-16s were close. This is hearsay, not eyewitness testimony, and it is listed here so it is not mistaken for a sighting.',
    quote: '"I know of two people -- I will not mention names -- that heard a missile," Stuhl said. "They both live very close, within a couple of hundred yards. . .This one fellow\'s served in Vietnam and he says he\'s heard them, and he heard one that day." The mayor adds that based on what he knows about that morning, military F-16 fighter jets were "very, very close."',
    cutsWhichWay: 'supports-claim',
    src: 'press',
    source: 'Philadelphia Daily News, William Bunch, 15 November 2001',
    sourceNote: 'Hearsay. The two residents are unnamed and no retrieved source records their accounts directly.',
    url: 'https://911research.wtc7.net/cache/planes/analysis/flight93/philadelphiadailynews_111501.html',
  },
  {
    id: 'memorial-roster',
    name: 'Robyn Blanset, Ray Stevens, Linda Shepley, Doug Miller, Terry Butler, Eric Peterson, Viola Saylor, Anita McBride Miller, Paula Pluta',
    role: 'The Flight 93 National Memorial\'s "Witness to History" roster',
    where: 'Roof of the Blanset farmhouse near Quemahoning Dam; near Stoystown; Route 30 in a truck; Stoystown Auto Wreckers; a garage overlooking Lambertsville; a porch in Lambertsville; Lambertsville; near Lambertsville',
    distanceMi: null,
    distanceText: 'Peterson under two miles; Pluta drove under half a mile to the site; others not stated',
    vantage: 'Various ground vantages named by the memorial',
    described: 'The memorial\'s own witness programme names these people and their vantage points. None of them is presented as having seen a second aircraft.',
    quote: 'At work in his garage overlooking the village of Lambertsville ... spotted Flight 93 ... witnessed the explosion from its impact.',
    cutsWhichWay: 'neutral',
    src: 'press',
    source: 'Friends of Flight 93 National Memorial, "Witness to History"',
    url: 'https://www.flight93friends.org/learn/witness-to-history',
  },
];

/* The framing this family needs to be read correctly. Sections are ordered so
   that reports come before explanations. */

export const EYEWITNESS_NOTE = {
  title: 'Reading the eyewitness reports',
  intro: [
    'Shanksville produced two distinct bodies of ground testimony. One describes the airliner itself in its last seconds. The other describes a second, white aircraft over the area. They are separate questions and are kept separate here.',
    'The accounts of the airliner are consistent with each other and with the flight data recorder: low, banked, rolling, intact. The accounts of a second aircraft are consistent with each other on the aircraft\'s appearance and differ on when it was there.',
  ],

  /* Reports first. */
  secondAircraft: {
    title: 'The second aircraft',
    reports: [
      'Five named residents reported a second aircraft to The Bergen Record within three days of the crash: Susan Mcelwain, Dennis Decker, Rick Chaney, Susan Custer and Robin Doppstadt. Lee Purbaugh and Kathy Blades gave similar accounts to other outlets. The descriptions agree on a small or midsized white jet with no markings and engines mounted near the tail.',
      'They differ on timing. Three of the five Bergen Record witnesses, Decker, Chaney and Doppstadt, describe seeing the aircraft after hearing the explosion or seeing the cloud. Two place it before: Mcelwain, by less than a minute in her 2001 account and by seconds in her 2002 account, and Custer, whose account reads jet first and then the boom and the cloud but gives no interval.',
      'Mcelwain rejected the Falcon 20 explanation when it was put to her. Her own physical description, of two rear-mounted engines and a large tail, matches a Falcon 20 airframe.',
    ],
    reportsSrc: 'press',
    officialHandling: [
      'On 13 September 2001 FBI Special Agent William Crowley was reported as saying investigators could not rule out a second aircraft, then as saying the same day that he had misspoken; federal agents at the site said that afternoon there was no evidence of one. Gen. Richard Myers denied a military shootdown in testimony to the Senate Armed Services Committee that week: "The armed forces did not shoot down any aircraft." Neither item is cited. The contemporaneous report carrying the Crowley statements could not be retrieved and the Myers transcript was not obtained, so both are held from secondary compilations and carried as reported rather than cited. The Crowley attribution is listed in full among the unverified accounts below.',
      'The FBI offered the Falcon 20 explanation within days, but did not release the operator, the pilot or the tail number at the time. The Philadelphia Daily News noted in November 2001 that authorities had neither identified the owner nor explained why the jet was airborne about 40 minutes after the FAA ordered all aircraft down. The explanation was therefore unfalsifiable for more than three years, which is the origin of the witnesses\' sense that they were being contradicted without being answered.',
    ],
    officialHandlingSrc: 'press',
    /* Explanation second. */
    explanation: {
      title: 'The Falcon 20',
      text: 'Popular Mechanics identified the aircraft in March 2005: a Dassault Falcon 20 operated by VF Corp. of Greensboro, North Carolina, inbound to Johnstown-Cambria airport 20 miles north of Shanksville. FAA Cleveland Center contacted the copilot when the aircraft was at 3,000 to 4,000 ft, not the 34,000 ft in the conspiracy version, and asked the crew to investigate. They descended to within 1,500 ft of the ground, circled, saw a hole in the ground with smoke coming from it, fixed the location and continued on.',
      quote: 'There was such a jet in the vicinity - a Dassault Falcon 20 business jet owned by the VF Corp. of Greensboro, N.C., an apparel company that markets Wrangler jeans and other brands. The VF plane was flying into Johnstown-Cambria airport, 20 miles north of Shanksville. According to David Newell, VF\'s director of aviation and travel, the FAA\'s Cleveland Center contacted copilot Yates Gladwell when the Falcon was at an altitude "in the neighborhood of 3000 to 4000 ft." - not 34,000 ft. "They were in a descent already going into Johnstown," Newell adds. "The FAA asked them to investigate and they did. They got down within 1500 ft. of the ground when they circled. They saw a hole in the ground with smoke coming out of it. They pinpointed the location and then continued on."',
      weight: 'This is the best-sourced account of the second aircraft. It rests on named sources: VF director of aviation David Newell, and copilot Yates Gladwell, who confirmed the account but declined direct quotation. It rests on interviews rather than on a released record. It also does not answer Mcelwain, whose account places an aircraft over her before the impact rather than after it.',
      src: 'press',
      source: 'Popular Mechanics, "Debunking the 9/11 Myths", March 2005, "The White Jet"',
      url: 'https://dickatlee.com/issues/911/asc/pm/pm7.html',
    },
    otherAircraft: [
      { text: 'The 9/11 Commission independently records that a civilian aircraft was close enough to United 93 to watch it visually, and at 10:01 reported that it had seen the aircraft "waving his wings". The Commission does not name that aircraft, so it does not itself confirm the Falcon 20.', src: 'commission' },
      { text: 'A second aircraft near the site is officially documented and identified: the unarmed Air National Guard C-130H that had watched American 77 hit the Pentagon 27 minutes earlier was still airborne en route to Minnesota and reported black smoke less than two minutes after the impact. An account of a second aircraft in the area is therefore not by itself anomalous.', src: 'commission' },
    ],
  },

  missile: {
    title: 'Did any witness see a missile or a fighter',
    text: 'No. Across every contemporaneous report retrieved here, no named ground witness at Shanksville describes seeing a military fighter aircraft, a missile in flight, or the aircraft shedding parts or breaking up before impact. The witnesses who reached a shootdown conclusion did so from sounds, or from the debris spread, or from hearsay. Laura Temyer heard booms. Joe Wilt heard a noise he took for a missile. Mayor Ernie Stuhl relayed two unnamed residents who said they heard one. The witnesses with the clearest view of the aircraft, Purbaugh, Peterson, Lambert, Shepley and Butler, all describe it as intact and under some control until it went into the ground.',
    src: 'derived',
    source: 'Cross-reading of The Bergen Record (14 September 2001), Philadelphia Daily News (15 November 2001), The Mirror (12 September 2002), and the compiled contemporaneous witness quotations from the Washington Post, Plain Dealer, USA Today and CNN of 12 September 2001',
    url: 'https://www.crono911.org/Fonti/918_UnitedAirlinesFlight93_Witnesses.pdf',
  },

  debris: {
    title: 'The debris spread',
    claimSide: 'Contemporaneous reporting put debris more than two miles away at Indian Lake and a cancelled check and a brokerage statement about eight miles away. Most of the wreckage was buried 20 to 25 ft under the crater in soft reclaimed strip-mine soil. The debris spread, rather than any sighting, is the strongest eyewitness-adjacent evidence the claim side has. Source: Philadelphia Daily News, William Bunch, 15 November 2001.',
    officialSide: 'The official explanation has three parts, all on the record by 2005. The material that travelled was light: paper, small scraps of sheetmetal, insulation. Indian Lake is under 1.5 miles southeast of the crater, not the six miles reported in September 2001. The wind that day was northwesterly at 9 to 12 mph, blowing toward the lake. Somerset County coroner Wallace Miller stated that no human remains were found in the lake; remains were confined to about 70 acres around the site. Former NTSB investigator Matthew McCormick gave the mechanism: "Very light debris will fly into the air, because of the concussion." Source: Popular Mechanics, March 2005, "Indian Lake".',
    rovingEngine: 'The "engine found a mile away" figure, which is what makes the spread look like missile damage, is a misreport. The object recovered away from the crater was an engine fan, found in a catchment basin just over 300 yards south of the crash site, which is the direction the aircraft was travelling. The distance and direction are confirmed by Jeff Reinbold of the National Park Service. The Mirror\'s 2002 version, "a section of engine weighing a ton was located 2,000 yards", is not supported by any retrieved source. Source: Popular Mechanics, March 2005, "Roving Engine".',
    windAttribution: 'The wind figure used by this app is the Popular Mechanics one: northwesterly at 9 to 12 mph. A widely repeated FBI attribution, to Special Agent Bill Crowley in the Pittsburgh Post-Gazette of 14 September 2001, gives the wind as "blowing southeast at about 9 m.p.h.", which is most likely the same fact stated loosely. That article could not be retrieved and is not quoted here as fetched.',
    src: 'press',
  },

  commissionSilence: {
    title: 'What the Commission did with eyewitnesses',
    paras: [
      'The 9/11 Commission Report contains no ground-eyewitness account of the Shanksville impact. The word "Shanksville" appears six times in the full report, including a photograph caption and endnotes, and does not once introduce a witness on the ground. The Commission\'s impact determination rests on instrumented and recorded data: the flight data recorder, the cockpit voice recorder, radar, air traffic control transmissions, infrared satellite data and the impact site.',
      'Its only direct engagement with a competing account at Shanksville is the footnote rejecting the Kim and Baum seismic estimate of 10:06:05, on the ground that the seismic data were too weak in signal-to-noise ratio and too speculative in signal source to contradict the recorded data sets. One of that study\'s principal authors now concedes that seismic data is not definitive for the impact. The Commission\'s argument there applies with equal force to human recollection, including the recollections on this page.',
      'On the allegation itself the Commission is more direct than a simple denial. It found that the Langley fighters were not scrambled in response to United 93, that NORAD did not have 47 minutes to intercept it, and that NORAD did not know the aircraft was hijacked until after it had crashed. At 10:10 the pilots over Washington were told "negative clearance to shoot", and shootdown authority first reached NEADS at 10:31. Of NORAD\'s position that it would have intercepted and shot United 93 down, the Commission wrote: "We are not so sure."',
    ],
    src: 'commission',
    source: 'The 9/11 Commission Report, Chapter 1, pp. 30, 44-45, and note 168, pp. 461-462',
    url: 'https://www.cia.gov/library/abbottabad-compound/0B/0B72A302B86EECAD443BBCDCDC76A5B1_911Report.pdf',
  },

  claimSideText: {
    title: 'The claim-side statement of the eyewitness case',
    text: 'The Mirror\'s 12 September 2002 article by Richard Wallace is the fullest statement of the eyewitness case for a shootdown, and is treated here as the claim-side text rather than as reporting. Several of its factual assertions are contradicted by later sourcing: it gives the impact as 10.06am, calls the business jet a "Fairchild Falcon 20" asked to descend from 34,000 ft, and states that the plane and pilot were never produced or identified. The aircraft was a Dassault Falcon 20, it was contacted at 3,000 to 4,000 ft, and the operator and copilot were named in 2005.',
    src: 'claim',
    source: 'The Mirror (London), Richard Wallace, 12 September 2002',
    url: 'https://www.911research.wtc7.net/~nin11evi/911research/cache/planes/evidence/mirror_whatdidhappen.html',
  },

  /* Accounts in circulation that are deliberately not used above. */
  unverified: [
    'FBI Special Agent Bill Crowley\'s explanation of the debris spread, attributed to the Pittsburgh Post-Gazette of 14 September 2001. The original could not be retrieved: old.post-gazette.com refuses connections and post-gazette.com returns 404 for the 2001 archive path. Held only from search snippets and secondary compilations, so it is not quoted as fetched.',
    'Nena Lensbouer\'s account of being first to reach the crater and of the crater\'s dimensions. The traceable source is American Free Press / Christopher Bollyn, which returned 403. That outlet is partisan and its Shanksville reporting is itself part of the claim literature, so the account is not used as a neutral eyewitness record.',
    'Kelly Leverknight\'s quote about the aircraft heading toward the school. Held from the Wikipedia article on United Airlines Flight 93 and a search snippet, not from the underlying 2001 newspaper report.',
    'Tom Spinelli\'s quotes, which appear only in the Mirror\'s 2002 article. No contemporaneous 2001 source for him was found. The Mirror also renders the location as "India Lake" rather than Indian Lake.',
    'The identity of the aircraft that reported United 93 "waving his wings" at 10:01. The Commission does not name it. It is commonly assumed to be the Falcon 20; no retrieved document makes that link.',
    'The registration of the Falcon 20. N20VF is an inference from a fleet registry, not a record of the 11 September flight.',
    'Whether the FAA or FBI ever published a document naming the Falcon 20 flight. The Popular Mechanics account rests on interviews, not on a released record.',
    'The Mirror\'s claim that a sonic boom was recorded at 9.22am by an earthquake monitoring station 60 miles from Shanksville. No source is given in the article and no independent confirmation was found.',
    'The claim, repeated in the Mirror, that 911 supervisor Glenn Cramer was gagged by the FBI. Uncorroborated in anything retrieved.',
  ],

  src: 'press',
};

/* =============================================================================
   THE CLAIM UNDER TEST
   ========================================================================== */

export const CRITIC = {
  claimant: 'Col. Donn de Grand-Pre, U.S. Army (ret.)',
  venue: 'Interview on The Alex Jones Show, broadcast on 42 stations',
  date: 'February 2004',
  quote: 'No, that was hit at 10:00 hours. It was taken out by the North Dakota Air Guard. I know the pilot who fired those two missiles to take down 93.',
  quoteSrcNote: {
    text: 'The second and third sentences are as quoted by Popular Mechanics, March 2005. The opening "No, that was hit at 10:00 hours" comes from 911facts.dk quoting the Prison Planet transcript of the broadcast. The transcript at its original address (prisonplanet.com/022904degrand.html) returns 403; the text used here is from a third-party mirror.',
    src: 'claim',
  },
  /* The allegation is a composite of two sources. De Grand-Pre said on air
     that he knew the pilot; he did not name him. The name, the rank, the
     weapon count and the 09:58 time come from LetsRoll911.org, which cited
     him. This app tests the composite, and labels which half is which. */
  provenance: {
    title: 'Who said what',
    paras: [
      'De Grand-Pre never named Gibney. On the broadcast he said only that the pilot was "an old friend of mine from the Air National Guard" and that North Dakota was his home state. The name "Gibney" does not appear anywhere in the transcript. Source: transcript of the Alex Jones interview with Col. Donn de Grand-Pre, mirrored from prisonplanet.com/022904degrand.html.',
      'The name "Major Rick Gibney", the rank Major, the two Sidewinders and the time 09:58 all come from LetsRoll911.org, citing de Grand-Pre. Popular Mechanics quotes that page as: "Major Rick Gibney fired two Sidewinder missiles at the aircraft and destroyed it in midflight at precisely 0958." Source: Popular Mechanics, "Debunking the 9/11 Myths", March 2005.',
      'An earlier version of this app said de Grand-Pre made the claim about Rick Gibney. That compressed two sources into one and has been corrected.',
    ],
    src: 'claim',
  },
  assertions: [
    { k: 'Pilot',    v: '"Major" Rick Gibney. Named by LetsRoll911.org citing de Grand-Pre, not by de Grand-Pre on air.', src: 'claim' },
    { k: 'Unit',     v: 'North Dakota Air National Guard (119th Fighter Wing, "Happy Hooligans"). De Grand-Pre says the wing had moved from Hector Field, Fargo, to Langley.', src: 'claim' },
    { k: 'Aircraft', v: 'F-16', src: 'claim' },
    { k: 'Weapons',  v: 'Two AIM-9 Sidewinder air-to-air missiles. From LetsRoll911.org.', src: 'claim' },
    { k: 'Time',     v: 'Order at 09:35 and a 09:35–10:00 engagement window in the transcript; 10:00 in de Grand-Pre\'s own restatement; 09:58 in LetsRoll911.org. The established impact time is 10:03:11.', src: 'claim' },
    { k: 'Place',    v: 'Over southern Pennsylvania, described in the transcript as a rendezvous reached from Langley in "a matter of minutes".', src: 'claim' },
    { k: 'Corroboration offered', v: 'De Grand-Pre says he attended a ceremony in North Dakota a year later at which the pilot was decorated. No retrieved source confirms or rebuts this.', src: 'claim' },
  ],
  /* Contradictions inside the allegation, before anything external is weighed
     against it. */
  internal: [
    { text: 'The three times given are mutually inconsistent: 09:35 to 10:00 as the engagement window in the transcript, 10:00 as de Grand-Pre\'s restatement, 09:58 in LetsRoll911.org. None of them is 10:03:11, the impact time established by the flight data recorder, the cockpit voice recorder, radar, air traffic control and the impact site.', src: 'claim' },
    { text: 'The narrative places the firing aircraft in a North Dakota Air Guard F-16 launched from Langley at 09:35, and names a pilot who was at Fargo that morning and then in Montana. Both cannot hold. The claim has to give up either the named pilot or the Langley launch.', src: 'derived' },
  ],
  dateNote: {
    text: 'Popular Mechanics gives only "February 2004". The date 29 February 2004 is widely repeated and is inferred from the filename of the original Prison Planet transcript (022904degrand.html) and from 911facts.dk\'s citation of it. This app does not assert a day.',
    src: 'derived',
  },
  refs: ['CLAIMANT'],
};

/* Gibney's documented day, as given by the North Dakota Air National Guard,
   by Gibney himself in interview, and by his passenger.                      */

export const GIBNEY = {
  name: 'Lt. Col. Rick Gibney',
  src: 'press',
  unit: '119th Fighter Wing, North Dakota Air National Guard, Fargo ("Happy Hooligans")',
  unitNote: {
    text: 'The designation "119th Fighter Wing" is correct for 2001. The wing was redesignated 119th Fighter Wing on 17 October 1995 and became the 119th Wing on 1 March 2008, so post-2008 sources that call it the 119th Wing are using the later name. It held a detachment at Langley Air Force Base, Virginia, from 1 March 1999 to June 2007.',
    src: 'press',
  },
  rankNote: {
    text: 'The claim calls him a Major. He was a lieutenant colonel on 11 September 2001. The rank is given by North Dakota Air National Guard spokesman Master Sgt. David Somdahl, quoted in Popular Mechanics, March 2005: "Gibney (a lieutenant colonel, not a major)". His official 119th Wing biography could not be retrieved, so the rank rests on that spokesman statement rather than on a service record. He was a colonel and the wing\'s commander by the time of the 2011 and 2019 interviews, which is why later reporting calls him Col. Gibney.',
    src: 'press',
  },
  passenger: 'Ed Jacoby Jr., Director, New York State Emergency Management Office',
  legs: [
    { from: 'KFAR', to: 'KBZN',
      why: 'Positioning leg. Gibney launched from his home base at Fargo in a two-seat F-16 and flew west to collect a passenger stranded in Montana with every civil aircraft in the country grounded [[groundStop]]. The original tasking was to collect FEMA director Joe Allbaugh, who travelled by other means; Jacoby went instead. North Dakota adjutant general Maj. Gen. Michael Haugen, who was at the same conference, acted as Gibney\'s crew chief. Sources: Air National Guard spokesman Master Sgt. David Somdahl in Popular Mechanics, March 2005; Dave Roepke, "Unforgettable day", The Forum of Fargo-Moorhead, 25 August 2011.',
      src: 'press' },
    { from: 'KBZN', to: 'KALB',
      why: 'The mission itself: return New York State\'s emergency management director to Albany. FAA records at the National Archives time this leg: an F-16 filed as NODAK99 on a route beginning at Bozeman was estimated over Toronto at 18:20 EDT, with an Albany arrival time of 18:49 EDT. The records do not name the pilot; the type, date, route and onward Langley leg match the accounts of his flight. A second flight plan, NODAC99, takes the same type on from Albany to Langley via Atlantic City, proposed for 19:50 EDT, and the North Dakota House Journal of 16 January 2007 records that Gibney "returned Mr. Edward Jacoby to Albany on Sept. 11th, then flew on to the Langley Alert Detachment for duty." Gibney asked for permission to fly at lower altitudes to ease stress on Jacoby. The aircraft refuelled in the air roughly over Fargo on the eastbound leg; only Roepke\'s 2011 account reports this, and no retrieved source documents a ground fuel stop. Sources: Somdahl in Popular Mechanics, March 2005, for the delivery to Albany; FAA flight-data messages and Albany TRACON flight strips, National Archives, NAIDs 7599510 and 7601591, for the callsigns, route and times; North Dakota House Journal, 16 January 2007, for Albany then Langley; April Baumgarten, InForum, 11 September 2019, for the lower altitudes; Dave Roepke, "Unforgettable day", The Forum of Fargo-Moorhead, 25 August 2011, for the refuelling.',
      src: 'press' },
  ],
  landings: [
    { place: 'KFAR', role: 'Departure', src: 'press' },
    { place: 'KBZN', role: 'Landing 1: picks up Jacoby', src: 'press' },
    { place: 'KALB', role: 'Landing 2: delivers Jacoby', src: 'press' },
  ],
  sourceConflict: {
    title: 'Which Montana airport',
    text: 'Two readings are in print. Popular Mechanics (2005), InForum (2019) and Jacoby\'s own quoted words all say Bozeman. The 2011 InForum piece says Missoula. A record, not only press, now settles it: the FAA flight plan for NODAK99, the eastbound F-16, held at the National Archives (NAID 7599510), gives a route beginning BZN, Bozeman. The geography agrees: Jacoby places himself at Big Sky, which is about 45 miles from Bozeman and about 200 miles from Missoula. This app uses Bozeman and records the conflict.',
    src: 'press',
  },
  afterword: 'After dropping Jacoby at Albany, Gibney went back up. It was dark as he flew over New York City. He described the smell of the smoke and the look of the city, and said of the airspace: "I was the only airplane between Seattle and New York City." InForum (2019) describes him as "the only plane in the sky - except for Air Force One". Sources: April Baumgarten, InForum, 11 September 2019; Dave Roepke, "Unforgettable day", 2011.',
  timingCaveat: {
    text: 'No minute-by-minute log of Gibney\'s day has been published. FAA records at the National Archives time the eastbound leg: NODAK99, on a route from Bozeman, was estimated over Toronto at 18:20 EDT with an Albany arrival time of 18:49 EDT, so the Bozeman departure was in the afternoon. No retrieved source times the morning or the refuelling: the tasking, the Fargo departure and the Bozeman arrival are all untimed. The Bozeman arrival is the time the claim turns on. An afternoon departure does not by itself rule out the claimed itinerary, because Shanksville to Bozeman is 1,667 miles, under three hours at cruise. The missing morning times do not favour either side. Rather than assert times, the feasibility panel lets you set them and shows the speed each leg would then demand.',
    src: 'derived',
  },
  rebuttals: [
    { who: 'Master Sgt. David Somdahl, North Dakota Air National Guard, in Popular Mechanics, March 2005', text: 'Gibney flew an F-16 that morning but nowhere near Shanksville. He took off from Fargo, flew to Bozeman, Montana, to collect Ed Jacoby Jr., and flew Jacoby on to Albany, New York.', src: 'press' },
    { who: 'Ed Jacoby Jr., the passenger, in Popular Mechanics, March 2005', text: 'Confirmed the day\'s events in his own words: "I was in Big Sky for an emergency managers meeting. Someone called to say an F-16 was landing in Bozeman. From there we flew to Albany." Popular Mechanics reports that he is outraged by the claim that Gibney shot down Flight 93.', src: 'press' },
    { who: 'Rick Gibney, in Popular Mechanics, March 2005', text: 'Declined to comment, saying he was reluctant to fuel debate by responding to unsubstantiated charges. That remains his only documented response to the allegation itself. He has since spoken publicly about his 11 September flight (119th Wing media event, 25 August 2011; NDSU students, September 2019) without addressing the allegation.', src: 'press' },
    { who: 'The 119th Fighter Wing', text: 'The wing presents Gibney\'s 11 September role as the Jacoby flight and links the 2019 InForum interview as its own account. Beyond the 2005 Somdahl statement there is no separate unit denial of the allegation on record.', src: 'press' },
    { who: 'The 9/11 Commission', text: 'NEADS never located United 93 on radar because it was already in the ground, and shortly after 10:10 the Langley fighters were explicitly told "negative clearance to shoot". The Commission declined to accept NORAD\'s assertion that it would have intercepted and shot the aircraft down: "We are not so sure."', src: 'commission' },
  ],
  /* Where the claim has to give something up on its own terms. */
  derivedFinding: {
    text: 'The allegation is self-defeating on its own geometry. It places the firing pilot in a North Dakota Air Guard F-16 launched from Langley at 09:35 and intercepting over southern Pennsylvania, and it names a pilot who was at Fargo and then in Montana. The two halves cannot both stand. Reasoned here from the de Grand-Pre transcript and the Somdahl and Jacoby accounts.',
    src: 'derived',
  },
  conflation: {
    text: 'Gibney did fly combat air patrols over Washington, D.C., but after 11 September, under Operation Noble Eagle. His North Dakota National Guard biography line reads: "Following Sept. 11, 2001, he led numerous F-16 missions in Operation Noble Eagle, flying combat air patrols over Washington, D.C., and around the nation." Retellings that drop the word "following" are the source of the recurring description of Gibney as having scrambled from Langley on the day.',
    src: 'press',
  },
  /* Stated rather than quietly omitted, so no reader mistakes an absence for
     a record. */
  unverified: [
    'The Jacoby quote "I summarily dismiss that because Lt. Col. Gibney was with me at that time." It is repeated by many secondary sources but could not be retrieved from an originating publication. The Jacoby words used above are the ones Popular Mechanics prints.',
    'The Jacoby quote "It disgusts me to see this because the public is being misled." Returned by a search summary only; not present in the Popular Mechanics text retrieved. Not used here.',
    'An earlier version said Gibney described himself as airborne alongside Air Force One. No retrieved source says "alongside". InForum (2019) mentions Air Force One only as the one other aircraft in the sky, and that is the wording the afterword above uses.',
    'Any 2004 Fargo Forum article that first broke the Gibney denial. Widely assumed to exist; no retrievable copy was found. The Somdahl and Jacoby quotes trace to Popular Mechanics\' own March 2005 reporting.',
    'The original LetsRoll911.org page naming "Major Rick Gibney". The site is defunct. Its wording survives only as quoted inside Popular Mechanics.',
    'Gibney\'s official 119th Wing biography (119wg.ang.af.mil) returned 403. His exact rank date, his position title in September 2001 and his promotion dates could not be confirmed from an official record.',
    'The tasking time, the Fargo departure time, the Bozeman arrival and pickup times, and the time of the in-air refuelling. No retrieved source states any of them. The eastbound leg is timed by FAA records at the National Archives (estimated over Toronto at 18:20 EDT, Albany arrival time 18:49 EDT); the morning is not.',
    'The pilot of NODAK99. The FAA flight plan and flight strips do not name him. The identification rests on the type, date, route and onward Langley leg matching the accounts of Gibney\'s flight.',
    'The tail number and model of the aircraft Gibney flew. The 2011 account says only "a two-seater F-16", which implies an F-16B or D, and the FAA flight plan gives the type only as F16/I. No source names the model or serial.',
    'Whether Gibney was decorated at a North Dakota ceremony "a year later", as de Grand-Pre claims. No retrieved source confirms or rebuts it.',
  ],
  refs: ['GIBNEY', 'INFORUM_2011', 'NARA_FAA_NODAK', 'ND_HOUSE_2007', 'GIBNEY_UNIT'],
};

/* The claim's implied itinerary. This is the thing the app actually measures:
   to be true, the claim requires Gibney to have done Fargo -> Shanksville ->
   Bozeman -> Albany, rather than Fargo -> Bozeman -> Albany.                 */

export const CLAIM_ROUTE = {
  id: 'claim',
  label: "Claim: Fargo → Shanksville → Bozeman → Albany",
  legs: [
    { from: 'KFAR', to: 'SHKV', arriveBy: at(9, 58, 0), note: 'Must be over Somerset County with a firing solution.' },
    { from: 'SHKV', to: 'KBZN', note: 'Then west to Bozeman to collect Jacoby.' },
    { from: 'KBZN', to: 'KALB', note: 'Then east again to deliver him to Albany.' },
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
  tanks: '2 x 370 US gal on the wing stations plus 1 x 300 gal centreline, about 1,040 gallons external, which roughly doubles the fuel.',
  placard: '600 KIAS or Mach 1.6, whichever is lower, with that tank fit and wingtip AIM-9s. Reported rather than cited: T.O. 1F-16A-1 establishes that external stores reduce the limit and refers the specific figures out to the stores supplement, but the Mach 1.6 value is attested only by a forum post quoting a personal F-16 Block 40 flight manual, and the supplement itself (T.O. 1F-16C-1-3 / 1F-16C-1-4, figure 5-11) was not obtained.',
  notes: [
    { text: 'Mach 2.0 [[mach]] is a clean-configuration dash number held for minutes, not a cruise speed. Carrying external tanks [[dropTanks]], which any transcontinental sortie requires, caps the aircraft well below it.', src: 'press' },
    { text: 'External tanks change this picture and an earlier version of this app understated them. Two 370-gallon wing tanks and a 300-gallon centreline add about 1,040 gallons, roughly doubling the fuel, for something like a 70% increase in operational radius [[combatRadius]] and a one-way ferry range [[ferryRange]] around 2,450 miles.', src: 'press' },
    { text: 'Fuel does not rule out the Fargo-to-Pennsylvania leg. At 1,012 miles that is about 41% of ferry range, an ordinary transit for a tanked fighter. Fuel does rule out the claimed itinerary as a whole: 4,522 miles is roughly 1.85x maximum ferry range, so it requires at least one refuelling stop.', src: 'derived' },
    { text: 'That tank fit, with wingtip Sidewinders [[sidewinder]], is placarded [[placard]] to 600 KIAS [[knots]] or Mach 1.6, whichever is lower. The flight manual establishes that external stores reduce the airspeed limit; the Mach 1.6 value itself comes from a source that could not be retrieved, so it is carried here as reported rather than cited. The Mach 2.0 figure above is unavailable to any aircraft configured for this mission, and the fastest envelope drawn on the map uses Mach 1.6.', src: 'press' },
    { text: 'Tanks and Sidewinders can be carried together. Tanks occupy the wing and centreline stations; Sidewinders use the wingtip rails. The published placard above describes carrying both at once.', src: 'press' },
    { text: 'Carrying a passenger requires a two-seat F-16B/D [[twoSeat]]. A civilian in the back seat of a jet that then prosecutes an air-to-air kill is a separate problem for the claim. This inference is the app\'s, not a sourced finding.', src: 'derived' },
  ],
  /* The status of each figure printed in the airframe card, in the order the
     card prints them. CITED names a document, DERIVED means this app computed
     it, REPORTED means the only attestation could not be retrieved. The same
     labels are carried in reachability.js, which draws the rings with these
     numbers; they are repeated here so the card cannot print a figure without
     its status. */
  provenance: [
    { figure: 'Cruise, 577 mph',
      text: 'DERIVED. An estimate. No official or secondary source gives it, the nearest published figure is 504 kt (580 mph) and is itself uncited where it appears, and the USAF fact sheet gives no cruise speed. Used only for the egress leg to Albany, so nothing in the verdict turns on it.' },
    { figure: 'Max at low altitude, 915 mph',
      text: 'CITED. Mach 1.2 at sea level, from the Aerospaceweb F-16 specifications, corroborated by the Wikipedia spec block citing Frawley at Mach 1.2, 800 kn or 921 mph.' },
    { figure: 'Max at altitude, 1,320 mph',
      text: 'DERIVED. This app\'s arithmetic: Mach 2.0 times the speed of sound at 40,000 ft. The USAF fact sheet gives 1,500 mph, 180 higher. The figure is a clean-configuration number. This app treats it as unavailable to this claim because it infers from the Montana leg that external tanks were fitted; that inference depends on the single in-air refuelling reported in 2011, and no record documents the tank fit. The Montana-route finding does not rest on it: the Bozeman detour needs roughly Mach 2.9, beyond this clean figure as well.' },
    { figure: 'Max with tanks, 1,050 mph',
      text: 'REPORTED, primary document not obtained. The 600 KIAS / Mach 1.6 placard for two 370-gallon wing tanks, a 300-gallon centreline tank and wingtip AIM-9s is attested only by a forum post quoting a personal F-16 Block 40 flight manual. T.O. 1F-16A-1 establishes that external stores reduce the limit and refers the figures out to the stores supplement (T.O. 1F-16C-1-3 / 1F-16C-1-4, figure 5-11), which was not obtained. This is the most load-bearing number in the app.' },
    { figure: 'Ferry range, 2,450 mi',
      text: 'NOT SOURCED to a retrievable document. The USAF fact sheet gives 2,002 miles ferry range, 448 lower. Somerset County, 1,012 miles from Fargo, is well inside either figure, and every finding that uses the ferry number survives the lower one.' },
  ],
  refs: ['F16'],
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
    text: 'Alleged missile engagement of United 93. The 09:58 time comes from LetsRoll911.org citing Donn de Grand-Pre; de Grand-Pre himself said 10:00. The allegation is contradicted by the named pilot\'s unit, by his passenger, by the command timeline, and by the debris pattern.',
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
