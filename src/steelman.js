/* =============================================================================
   steelman.js — the claim's best possible case.

   Everything else in this app tests the allegation. This builds the strongest
   version of it that physics and the calendar permit, and plots it. Arguing
   only against the weakest reading would leave it unknown which objections are
   load-bearing. Granting every favourable assumption at once and seeing what
   still fails tests more than any objection taken separately.

   THE AIRCRAFT IS NOT REAL. Callsign STEELMAN is a construct. It corresponds to
   no aircraft, no sortie and no record; it is drawn dashed, in white, and
   labelled as constructed at every appearance. No F-16 flew this track. It is
   drawn to show what would have had to be true.

   WHAT IT GRANTS

   Missiles, a perfect launch time, a perfect heading, no air-traffic routing,
   no weather, no turnaround, the two-seat problem waved away, and an order that
   did not exist. Every one of those is granted simultaneously.

   Fuel is not on that list. The external tanks are not an assumption this app
   makes for the claim; they follow from the claim's own documented mission.
   See below.

   PROVENANCE OF THE CONDITIONS

   Every entry in CONCESSIONS carries a `status` field: CITED, with the
   document named in `source`, or GRANTED, meaning this app assumes it for the
   claim. Where a figure is computed here it is named in `derived`. Where the
   research could not source a figure, or found a better one, it is named in
   `open`. The same labels are printed at the head of each visible cost string.

   WHAT SURVIVES ANYWAY

   The kinematics work. At the earliest departure the record permits, the run to
   Somerset County needs about Mach 1.26 sustained, which is inside the
   placarded limit for a tanked F-16. Speed and fuel do not stop this.

   What stops it is outside the airframe. To launch at 08:46 on a heading that
   intercepts United 93 at 09:58, someone has to know at 08:46 that United 93
   will be hijacked at 09:28 and where it will be ninety minutes later. The air
   defence sector did not know the aircraft existed until 10:07. No order to
   fire had reached any pilot. And the same jet has to be in Montana and then
   New York the same day.

   The claim fails on knowledge, on authority, and on the testimony of the
   people involved, rather than on the aircraft.
   ========================================================================== */

import { PLACES, F16, CRITIC_CHAIN } from './data.js';
import { haversineMi, bearingDeg, gcInterp, machAt, samplePath } from './geo.js';
import { AIM9 } from './reachability.js';

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

export const HYPO = {
  /* Named STEELMAN rather than a plausible-looking military callsign, which
     would read like a real tail on a real sortie. The name says what the thing
     is every time it is spoken. */
  callsign: 'STEELMAN',
  status: 'CONSTRUCTED — NOT A RECORD',
  type: 'F-16 (hypothetical)',
  disclaimer: 'A construct. No aircraft flew this track. It is drawn to show what the claim requires.',
  color: 0xffffff,
  src: 'derived',
};


/* =============================================================================
   THE FUEL IS NOT A CONCESSION

   The app used to hand the claim its external tanks as a favour. The tanks are
   a finding instead, and they follow from the mission nobody disputes.

   Bozeman to Albany is one leg of 1,843 miles. Flight-manual figures give
   6,400 lb of external fuel against 6,950 lb internal in a single-seater, so
   the tank fit adds about 92% and a clean airframe reaches roughly half the
   tanked ferry range — on the app's 2,450-mile ferry figure, about 1,225
   miles, and that is generous, because tanks add drag as well as fuel.
   Carrying a passenger forces a two-seat F-16B/D with 18.7% less internal
   fuel, which brings a clean aircraft down to about 996 miles. The leg is 1.85
   times that. No configuration without external tanks flies it, and there was
   no aerial refuelling.

   On the USAF fact sheet's ferry figure of 2,002 miles the same arithmetic
   gives about 814 miles for a clean two-seater and the leg is 2.26 times that,
   so the finding holds on either number. The app's 2,450 is the weaker of the
   two for this argument. See `open` on the first concession.

   THE SAME MISSION CONSTRAINS THE ROUTE

   The documented mission that establishes the tanks also establishes the
   route, and the steelman only closes because it omits the middle of it. Fargo
   straight to Somerset County is 1,012 miles and needs about Mach 1.26, which
   works. Fargo via Bozeman to Somerset County is 2,354 miles in the same 71
   minutes, which needs about Mach 2.9: roughly twice the Mach 1.6 placarded
   limit for a tanked jet, and above the clean Mach 2.0 dash figure the
   aircraft cannot use while carrying tanks anyway. That is before any time on
   the ground at Bozeman, and he had to land there, shut down enough to board a
   civilian, and get airborne again.

   The documented mission establishes either the fuel or the route. The claim
   needs the first and does not survive the second.
   ========================================================================== */

/* A two-seat F-16B/D trades internal fuel for the second cockpit.
   CITED: USAF T.O. 1F-16A-1 flight manual, figure 1-21 (Fuel Quantity Data).
   Total internal fuel is 6,950 lb (JP-4) / 7,290 lb (JP-5, JP-8) single-seat
   against 5,650 / 5,930 two-seat, a penalty of 18.7% on both fuels. The app
   previously used 17%. Corroborated by Aerospaceweb's model figures, 7,160 lb
   for the F-16C against 5,835 lb for the F-16D, which is 18.5% by weight. */
export const TWO_SEAT_FUEL_PENALTY = 0.187;

export function fuelProof() {
  const legFB = haversineMi(PLACES.KFAR, PLACES.KBZN);
  const legBA = haversineMi(PLACES.KBZN, PLACES.KALB);

  // Tanks add about 92% to a single-seater's internal fuel, so clean is about
  // half of tanked ferry. DERIVED from F16.ferryRangeMi.
  const cleanFerryMi = F16.ferryRangeMi / 2;
  const twoSeatCleanMi = cleanFerryMi * (1 - TWO_SEAT_FUEL_PENALTY);
  // Tanked two-seater: full external, reduced internal.
  const twoSeatTankedMi = F16.ferryRangeMi * ((1 - TWO_SEAT_FUEL_PENALTY) + 1) / 2;

  return {
    legFB,
    legBA,
    dayMi: legFB + legBA,
    cleanFerryMi,
    twoSeatCleanMi,
    twoSeatTankedMi,
    shortfall: legBA / twoSeatCleanMi,       // how far over a clean two-seater
    tankedUse: legBA / twoSeatTankedMi,      // how much of a tanked one it eats
    needsTanks: legBA > twoSeatCleanMi };
}

/* What keeping Bozeman does to the intercept. `targetLatLon` is where United
   93 has to be met; the window is the same one the direct run gets.

   `placardMach` and `overPlacard` are measured against F16.maxWithTanksMph,
   the Mach 1.6 tanked limit. That limit is reported rather than sourced: see
   the `open` field on the Jacoby concession and CONFIG_TRADE in
   reachability.js. */
export function bozemanCost(targetLatLon, departEDT, interceptEDT) {
  const hours = Math.max(1, interceptEDT - departEDT) / 3600;
  const directMi = haversineMi(PLACES.KFAR, targetLatLon);
  const viaMi = haversineMi(PLACES.KFAR, PLACES.KBZN)
    + haversineMi(PLACES.KBZN, targetLatLon);

  const directMph = directMi / hours;
  const viaMph = viaMi / hours;

  return {
    hours,
    directMi,
    viaMi,
    directMph,
    viaMph,
    directMach: machAt(directMph, 31000),
    viaMach: machAt(viaMph, 31000),
    placardMach: machAt(F16.maxWithTanksMph, 31000),
    overPlacard: viaMph / F16.maxWithTanksMph,
    // Zero ground time at Bozeman is assumed, which is impossible.
    groundTimeGranted: 0,
  };
}

/* Each concession, what it grants, and what granting it costs.

   Every premise carries a citation or an explicit concession label, and both
   reach the page.

   `status` is CITED or GRANTED. GRANTED means this app assumes the premise for
   the claim with no source behind it. CITED means a named document in `source`
   bears on it, and `blocking` says which way: on a non-blocking premise the
   document establishes it, and on a blocking one the document is what the
   grant runs into. main.js renders those two cases as separate badges, Cited
   and Cited against, so a refuting record cannot read as a supporting one.

   `source` names the document. `derived` names anything computed here. `open`
   names a figure the research could not source, or a better figure it found.
   All three are rendered under the premise; a citation that stays in the file
   is not a citation. The visible cost string repeats the label. */
export const CONCESSIONS = [
  {
    grant: 'He has the fuel',
    detail: 'Two 370-gallon wing tanks and a 300-gallon centreline tank. The flight manual gives 6,400 lb of external fuel against 6,950 lb internal in a single-seater and 5,650 lb in a two-seater: about 92% more fuel in the first case, about 113% in the second.',
    status: 'CITED',
    source: 'Tank fit: Eaton Mission Systems / Blue Aerospace F-16 wing and centreline tank datasheet, 370-gallon wing and 300-gallon centreline assemblies with part numbers. Fuel quantities: USAF T.O. 1F-16A-1 flight manual, figure 1-21, Fuel Quantity Data. Carrying two AIM-9 and two external tanks on one payload line: USAF F-16 fact sheet.',
    derived: 'The 1,040-gallon external total is this app\'s arithmetic (2 x 370 + 300). The clean and two-seat ranges below are computed here from F16.ferryRangeMi.',
    open: 'The 2,450-mile ferry range this app uses is not sourced to a retrievable document. The USAF fact sheet gives 2,002 miles, 448 lower. On the official figure a clean two-seater reaches about 814 miles and the Bozeman-Albany leg is 2.26 times that rather than 1.85, so the finding survives and gets stronger.',
    cost: 'CITED: not a concession. The documented mission, flown nonstop as reported, establishes it.',
    costFn: (c) => `CITED: not a concession. Bozeman to Albany is a single `
      + `leg of ${Math.round(c.fuel.legBA).toLocaleString()} miles, and a clean two-seat F-16D `
      + `reaches about ${Math.round(c.fuel.twoSeatCleanMi).toLocaleString()}. The leg is `
      + `${c.fuel.shortfall.toFixed(1)}× that, and there was no aerial refuelling, so the tanks `
      + `are established by the mission rather than granted by this app.`,
    blocking: false,
  },
  {
    grant: 'He has the missiles',
    detail: 'AIM-9M Sidewinders on the wingtip rails.',
    status: 'CITED',
    source: 'USAF T.O. 1F-16A-1 flight manual, aircraft description: basic armament is a fuselage-mounted 20 mm gun and an air-to-air missile on each wingtip, with additional stores on the underwing pylons and the fuselage centreline. USAF F-16 fact sheet payload line: two AIM-9 and two external fuel tanks.',
    cost: 'CITED: free. The flight manual puts the missiles on the wingtip rails and the other stores on the wing pylons and the centreline, so the tanks and the Sidewinders do not compete for stations.',
    blocking: false,
  },
  {
    grant: 'He launches at the earliest moment the record permits',
    detail: '08:46:40 — the first impact, the first instant anyone had reason to act.',
    status: 'GRANTED',
    source: '08:46:40 is the 9/11 Commission\'s impact time for American 11.',
    open: 'No departure time for Gibney has ever been published. The route and the tasking are on the record; the clock is not.',
    cost: 'GRANTED: an assumption. It is cheap, but no departure time for Gibney has ever been published.',
    blocking: false,
  },
  {
    grant: 'He flies the perfect heading',
    detail: 'A great circle from Fargo, 111 degrees, direct to where United 93 will be.',
    status: 'GRANTED',
    derived: 'The bearing and the track are computed here from the two positions.',
    cost: 'GRANTED: an assumption. The heading costs the claim nothing on its own. It requires knowing where United 93 will be, which is the next premise but one.',
    blocking: false,
  },
  {
    grant: 'No routing, no weather, no turnaround',
    detail: 'No ATC vectors, no jet stream, no time on the ground.',
    status: 'GRANTED',
    cost: 'GRANTED: an assumption. The app grants these everywhere else too.',
    blocking: false,
  },
  {
    grant: 'The two-seat problem is waved away',
    detail: 'Ignore that carrying Jacoby requires an F-16B/D, which holds 18.7% less internal fuel: 5,650 lb against 6,950 lb on JP-4, 5,930 against 7,290 on JP-5 and JP-8.',
    status: 'GRANTED',
    source: 'Fuel penalty: USAF T.O. 1F-16A-1, figure 1-21. Carriage: the same manual defines two-seat gross weight with two occupants, two wingtip AIM-9s and a full gun load aboard, and the rear cockpit has its own AIM-9 tone control. Command: AFI 11-2F-16 Volume 3, 1 July 1999, paragraph 7.1.6, the edition in force on 11 September 2001, leaves the front-seat pilot in command responsible.',
    open: 'Whether USAF regulation permitted live air-to-air missiles on a sortie carrying a civilian passenger is unresolved. The 1999 instruction carries passenger briefing requirements and states no rule either way, and the current edition could not be retrieved. No prohibition was found, which is not the same as permission.',
    cost: 'GRANTED: cheap on its own. The fuel penalty and the carriage are both documented; the back seat costs fuel and adds a witness rather than a second decision-maker, since the front-seat pilot in command retains responsibility.',
    blocking: false,
  },
  {
    grant: 'He knows where United 93 will be',
    detail: 'To launch at 08:46 on an intercept heading, someone must already know that United 93 — airborne four minutes, entirely normal — will be seized at 09:28 and be over Somerset County at 09:58.',
    status: 'CITED',
    source: '9/11 Commission Report: United 93 was seized at 09:28 and was over Somerset County at 09:58. Both times postdate the 08:46 launch this concession requires.',
    cost: 'CITED against: this is foreknowledge of the hijacking rather than intelligence about it. Granting it converts the claim into a much larger and entirely different allegation.',
    blocking: true,
  },
  {
    grant: 'Someone is tracking it for him',
    detail: 'A controller vectoring him onto the target in real time.',
    status: 'CITED',
    source: '9/11 Commission Report: NEADS first learned of United 93 at 10:07. Gibney\'s documented tasking that day was a transport flight.',
    cost: 'CITED against: NEADS did not know United 93 existed until 10:07, four minutes after it hit the ground. There was no track to vector anyone onto. On the documented account he was on a transport tasking and not on the air defence net.',
    blocking: true,
  },
  {
    grant: 'He never collects Jacoby',
    detail: 'The shortest flyable version runs Fargo to the intercept and straight on to Albany — about 1,320 miles, roughly half of one tankful. It does not go to Bozeman.',
    status: 'CITED',
    source: 'Ed Jacoby has said on the record that Gibney flew him from Bozeman to Albany. The route is the documented part of the day.',
    derived: 'The distances, Mach numbers and the multiple of the placarded limit are computed here from the positions and the window.',
    open: 'The placarded Mach 1.6 limit that the multiple is measured against is reported rather than sourced: the only attestation is a forum post quoting a personal F-16 Block 40 flight manual, and the primary stores-limitations manual (T.O. 1F-16C-1-3 / 1F-16C-1-4, figure 5-11) was not obtained.',
    cost: 'CITED against: Jacoby was in Bozeman; adding it to the route breaks the kinematics.',
    costFn: (c) => `CITED against: Jacoby was in Bozeman. He was collected, he reached Albany, and he has said on `
      + `the record that Gibney flew him. The documented mission that shows the tanks also shows `
      + `the route. Fargo straight to the intercept is `
      + `${Math.round(c.boz.directMi).toLocaleString()} mi, Mach ${c.boz.directMach.toFixed(2)}, `
      + `which works. Fargo via Bozeman is ${Math.round(c.boz.viaMi).toLocaleString()} mi in the same `
      + `${Math.round(c.boz.hours * 60)} minutes: Mach ${c.boz.viaMach.toFixed(2)}, or `
      + `${c.boz.overPlacard.toFixed(1)}x the reported placarded limit, with zero seconds on the ground.`,
    blocking: true,
  },
  {
    grant: 'He has an order',
    detail: 'Authority to fire on a civilian airliner.',
    status: 'CITED',
    source: '9/11 Commission Report: the Vice President\'s authorisation is placed between about 10:10 and 10:18, with no documentary record of the call; NEADS received the order at 10:31 and did not pass it to its pilots.',
    cost: 'CITED against: the earliest documented authorisation is about 10:10. The Commission places the Vice President\'s authorisation between about 10:10 and 10:18; there is no documentary record of the call, and NEADS received the order at 10:31 and did not pass it to its pilots. At 09:58 no such order existed anywhere in the chain.',
    blocking: true,
  },
];

/* Build the best-case track: Fargo to the intercept, then straight out to
   Albany, because the day has to end somewhere and Albany is where Gibney
   demonstrably put his passenger down.

   The egress leg has a cost. Flying the target to Albany directly is the
   shortest version of the claim — about 1,320 miles in total, roughly half of
   one tankful — but it skips Bozeman, where Ed Jacoby was standing. The most
   generous flyable version of this allegation is one in which Jacoby is never
   collected. He was collected, he reached Albany, and he has said so.

   `withinTankedLimit` is measured against F16.maxWithTanksMph, the reported
   Mach 1.6 tanked placard. See the Jacoby concession's `open` field. */
export function buildHypoTrack(targetLatLon, departEDT, interceptEDT) {
  const from = PLACES.KFAR;
  const to = PLACES.KALB;
  const miles = haversineMi(from, targetLatLon);
  const seconds = Math.max(1, interceptEDT - departEDT);
  const mph = miles / (seconds / 3600);

  const path = [];
  const speeds = [];
  const STEPS = 24;
  for (let i = 0; i <= STEPS; i++) {
    const f = i / STEPS;
    const p = gcInterp(from, targetLatLon, f);
    // Climb out, cruise, and let down onto the target's altitude band.
    const alt = f < 0.12 ? (f / 0.12) * 31000
      : f > 0.9 ? 31000 - ((f - 0.9) / 0.1) * 24000
        : 31000;
    path.push([departEDT + seconds * f, p.lat, p.lon, alt]);
    speeds.push(mph);
  }

  /* The turn. At the closest point to United 93 he breaks straight for Albany,
     at ordinary cruise. F16.cruiseMph is an estimate rather than a published
     figure; nothing in the verdict turns on the egress leg. */
  const egressMi = haversineMi(targetLatLon, to);
  const egressS = (egressMi / F16.cruiseMph) * 3600;
  const EG = 16;
  for (let i = 1; i <= EG; i++) {
    const f = i / EG;
    const p = gcInterp(targetLatLon, to, f);
    const alt = f < 0.25 ? 7000 + (f / 0.25) * 21000
      : f > 0.82 ? 28000 - ((f - 0.82) / 0.18) * 28000
        : 28000;
    path.push([interceptEDT + egressS * f, p.lat, p.lon, alt]);
    speeds.push(F16.cruiseMph);
  }

  const totalMi = miles + egressMi;
  return {
    path,
    miles,
    seconds,
    mph,
    mach: machAt(mph, 31000),
    bearing: bearingDeg(from, targetLatLon),
    withinTankedLimit: mph <= F16.maxWithTanksMph,
    ferryFraction: miles / F16.ferryRangeMi,
    egressMi,
    egressBearing: bearingDeg(targetLatLon, to),
    arrivesAlbany: interceptEDT + egressS,
    totalMi,
    totalFerryFraction: totalMi / F16.ferryRangeMi,
    skipsBozeman: true,
    /* Per-vertex speed, so the trail can be coloured by what it demands,
       and the ceiling it is measured against. */
    speeds,
    placardMph: F16.maxWithTanksMph,
  };
}


/* =============================================================================
   THE CRITIC, AGAINST THE STEELMAN

   This app is named after DIRNSA CRITIC 1-2001 and is a companion to a records
   request for its text. The CRITIC chain is the most useful sequence in the
   app for testing this claim.

   Every other source describes what HAPPENED: recorders, radar, ATC tapes, the
   NEADS recordings. The CRITIC describes what the national command structure
   BELIEVED WAS HAPPENING, timestamped to the minute, in the channel designed
   to put information in front of the President inside ten minutes. The
   sequence brackets the alleged shootdown on both sides: two messages before
   it, two after.

   So: where would the best-case shooter have been, each time one went out?

   At 09:49, when NORAD originates the CRITIC, the steelman aircraft is
   seventy-odd miles from United 93, six times outside the range of its own
   missile. At 09:52, when NSA pushes DIRNSA CRITIC 1-2001 across the watch
   community, it is still nearly fifty miles out, six minutes short. United 93
   then goes into the ground, and the two follow-ups that close the sequence,
   sent at 10:14 and 10:48 into the highest-priority channel the United States
   operates, are where a shootdown by a US fighter would have to appear.

   That is the document this app can name as the one that would change its
   mind. It exists, and its contents are withheld.
   ========================================================================== */

export function criticSnapshots(hypoTrack, ua93Path, interceptEDT) {
  if (!hypoTrack || !ua93Path) return [];
  const impactT = ua93Path[ua93Path.length - 1][0];
  const landsT = hypoTrack.arrivesAlbany;

  return CRITIC_CHAIN.map((c) => {
    const hp = samplePath(hypoTrack.path, c.t);
    const up = c.t <= impactT ? samplePath(ua93Path, c.t) : null;
    const sepMi = (hp && up) ? haversineMi(hp, up) : null;

    return {
      c,
      hypo: hp,
      target: up,
      sepMi,
      /* How far outside the missile's reach, as a multiple: 72 miles means
         nothing until you know the weapon reaches 11. */
      outsideBy: sepMi === null ? null : sepMi / AIM9.rMaxMi,
      inRange: sepMi === null ? false : sepMi <= AIM9.rMaxMi,
      losMi: (hp && up) ? mutualHorizonSmi(hp.altFt, up.altFt) : null,
      minsToShot: (interceptEDT - c.t) / 60,
      // Negative once United 93 is down; positive while it is still flying.
      minsAfterImpact: (c.t - impactT) / 60,
      airborne: !!hp && c.t <= landsT,
      landed: c.t > landsT,
    };
  });
}

export const VERDICT = {
  headline: 'The flight is within the aircraft\'s performance. The knowledge, tracking, order and witness the claim needs are absent from the record.',
  body: 'The fuel is not in dispute: the documented Montana-to-Albany leg, flown nonstop as reported, is 1,843 miles, which no clean F-16 flies, so the external tanks are established rather than granted. Add the missiles, the earliest permitted launch and a perfect heading, and the run to Somerset County needs about Mach 1.2 sustained, inside the placarded limit for a tanked jet and about 40% of its ferry range. Speed and fuel do not rule it out. Four other conditions do: the launch requires knowing at 08:46 what would not happen until 09:28; the sector had no track on the aircraft until four minutes after it crashed; no order to fire is documented before about 10:10 and none reached the sector until 10:31; and the mission that shows the fuel also puts Bozeman in the route, which pushes the intercept to about Mach 2.9, nearly twice what a tanked F-16 is permitted.',
  src: 'derived',
};

/* =============================================================================
   THE FOREKNOWLEDGE HORIZON

   The sharpest form of the first blocking concession, and the one thing here
   that can be drawn as a line.

   United 93 was seized at 09:28. Before that moment it was an ordinary flight
   climbing out of Newark, and nothing about it distinguished it from any other
   aircraft in the sky. A launch aimed at it before 09:28 precedes the
   hijacking it is supposed to be responding to.

   That gives a boundary with a radius. Take the fastest speed an F-16 can
   manage, multiply by the thirty minutes between the seizure and the alleged
   shot, and the result is the set of points from which the target could be
   reached without departing early. Inside it, no foreknowledge is needed.
   Outside it, the launch necessarily precedes the hijacking.

   Fargo is 1,012 miles out. The horizon was 660 when the clean Mach 2.0 band
   was still drawn; once the unavailable clean band is filtered out and the
   fastest band is the placarded Mach 1.6, it is 525. Fargo is outside both.
   The 525 figure depends on the tanked placard, which is reported rather than
   sourced; see CONFIG_TRADE in reachability.js.

   The line does not show that anyone had foreknowledge. It shows what the
   claim requires, which is a statement about the claim. The label says so.
   ========================================================================== */

export const HIJACK_T = at(9, 28, 0);

export const FOREKNOWLEDGE = {
  title: 'What the claim requires him to have known',
  hijackLabel: 'United 93 seized, 09:28',
  caution: 'These times are what the allegation requires. They are not evidence that anyone knew anything.',
  src: 'derived',
};

export const horizonMi = (maxMph, interceptT) =>
  maxMph * ((interceptT - HIJACK_T) / 3600);

/* For each speed the airframe can manage: when must he leave, and how far
   ahead of the hijacking does that put him? */
export function foreknowledgeRows(distMi, interceptT, bands) {
  return bands.map((b) => {
    const departBy = interceptT - (distMi / b.mph) * 3600;
    const leadS = HIJACK_T - departBy;
    return {
      label: b.label,
      mph: b.mph,
      color: b.color,
      departBy,
      leadMin: leadS / 60,
      requires: leadS > 0,
    };
  });
}

export function foreknowledgeVerdict(distMi, interceptT, bands) {
  const rows = foreknowledgeRows(distMi, interceptT, bands);
  const best = rows.reduce((a, b) => (a.leadMin <= b.leadMin ? a : b));
  const maxMph = Math.max(...bands.map((b) => b.mph));
  const r = horizonMi(maxMph, interceptT);
  return {
    rows,
    best,
    horizonMi: r,
    distMi,
    outsideBy: distMi - r,
    allRequire: rows.every((x) => x.requires),
  };
}

/* =============================================================================
   Line of sight and the engagement window

   STEELMAN is built to arrive where United 93 is at 09:58, so the range
   between them collapses to nothing at that moment by construction. What is
   worth measuring is the shape of that approach: how long the two are inside
   AIM-9 range of each other.

   The window is short. A closing fighter and a descending airliner spend a
   couple of minutes inside ten miles of each other and then the geometry opens
   again. The record has to place a specific aircraft inside that window, to
   the minute, and nothing in it does.
   ========================================================================== */

export function losRange(track, targetAt, t) {
  const a = trackSampleLL(track, t);
  const b = targetAt(t);
  if (!a || !b) return null;
  return { from: a, to: b, miles: haversineMi(a, b) };
}

/* Sample STEELMAN's own path — it is stored in the same [t,lat,lon,alt] shape
   as every other track here. */
export function trackSampleLL(track, t) {
  const p = track.path;
  if (!p.length || t < p[0][0]) return null;
  if (t >= p[p.length - 1][0]) {
    const L = p[p.length - 1];
    return { lat: L[1], lon: L[2], altFt: L[3] };
  }
  let i = 0;
  while (i < p.length - 2 && p[i + 1][0] < t) i++;
  const [t0, la0, lo0, a0] = p[i];
  const [t1, la1, lo1, a1] = p[i + 1];
  const f = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
  const q = gcInterp({ lat: la0, lon: lo0 }, { lat: la1, lon: lo1 }, f);
  return { lat: q.lat, lon: q.lon, altFt: a0 + (a1 - a0) * f };
}

/* How long the two are inside weapon range, and how close they get. */
export function wezWindow(track, targetAt, rMaxMi) {
  const t0 = track.path[0][0];
  const t1 = track.path[track.path.length - 1][0];
  let enter = null, exit = null, min = Infinity, minAt = null;
  for (let t = t0; t <= t1; t += 5) {
    const r = losRange(track, targetAt, t);
    if (!r) continue;
    if (r.miles < min) { min = r.miles; minAt = t; }
    if (r.miles <= rMaxMi) {
      if (enter === null) enter = t;
      exit = t;
    }
  }
  return {
    enter, exit, minMi: min === Infinity ? null : min, minAt,
    durationS: enter !== null ? exit - enter : 0,
  };
}

/* =============================================================================
   The line-of-sight horizon

   Distinct from the sight LINE. An aircraft can see, and be seen by,
   everything inside its radio horizon, which is set by altitude and the
   curvature of the Earth rather than by any weapon:

       d (nautical miles) ~ 1.23 * sqrt(height in feet)

   Two aircraft see each other at the sum of their own horizons. At 31,000 ft
   with a target at 5,000, that is roughly 350 statute miles.

   The AIM-9 reaches about eleven. Line of sight is not the constraint. Seeing
   an airliner from three hundred miles away buys nothing on its own; the
   weapon still requires being inside a ring twenty-two miles across at one
   particular minute, and the horizon is drawn so the ratio is visible.
   ========================================================================== */

export const LOS_HORIZON = {
  title: 'Line-of-sight horizon',
  color: 0x74c7ff,
  note: 'Range at which the two aircraft can see each other. Missile range is about 11 miles.',
  src: 'derived',
};

/* Radio/visual horizon in statute miles for a given altitude. */
export const horizonSmi = (ft) => 1.23 * Math.sqrt(Math.max(0, ft)) * 1.15078;

/* Mutual horizon: the range at which two aircraft can see each other. */
export function mutualHorizonSmi(ftA, ftB) {
  return horizonSmi(ftA) + horizonSmi(ftB);
}

export function losVsWez(hypoAltFt, targetAltFt, rMaxMi) {
  const los = mutualHorizonSmi(hypoAltFt, targetAltFt);
  return { losMi: los, wezMi: rMaxMi, ratio: los / rMaxMi };
}
