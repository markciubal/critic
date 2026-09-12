/* =============================================================================
   steelman.js — the claim's best possible case.

   Everything else in this app tests the allegation. This builds the strongest
   version of it that physics and the calendar permit, and plots it.

   That is not a concession to the claim; it is the only way to find out what
   the claim actually rests on. If you only ever argue against the weakest
   reading, you never learn which of your own objections were load-bearing and
   which were decoration. Granting every favourable assumption at once and
   seeing what still fails is a better test than any of them separately.

   THE AIRCRAFT IS NOT REAL. Callsign HYPO 01 is a construct. It corresponds to
   no aircraft, no sortie and no record; it is drawn dashed, in white, and
   labelled as constructed at every appearance. No F-16 flew this track. The point of drawing it is to show what would have had to be
   true, not to suggest that it was.

   WHAT IT GRANTS

   Missiles, a perfect launch time, a perfect heading, no air-traffic routing,
   no weather, no turnaround, the two-seat problem waved away, and an order that
   did not exist. Every one of those is granted simultaneously.

   Fuel is no longer on that list. It used to be, and that was too generous:
   the external tanks are not an assumption this app makes for the claim, they
   are a finding the claim's own documented mission forces. See below.

   WHAT SURVIVES ANYWAY

   The kinematics work. That is the honest result and it is worth stating
   plainly: at the earliest departure the record permits, the run to Somerset
   County needs about Mach 1.26 sustained, which is inside the placarded limit
   for a tanked F-16. Speed and fuel do not stop this.

   What stops it is everything that is not physics. To launch at 08:46 on a
   heading that intercepts United 93 at 09:58, someone has to know at 08:46
   that United 93 will be hijacked at 09:28 and where it will be ninety minutes
   later. The air defence sector did not know the aircraft existed until 10:07.
   No order to fire had reached any pilot. And the same jet has to be in
   Montana and then New York the same day.

   So the claim does not fail on the airframe. It fails on knowledge, on
   authority, and on the testimony of the people involved — which is a more
   useful conclusion than "impossible", and a harder one to wave away.
   ========================================================================== */

import { PLACES, F16, CRITIC_CHAIN } from './data.js';
import { haversineMi, bearingDeg, gcInterp, machAt, samplePath } from './geo.js';
import { AIM9 } from './reachability.js';

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

export const HYPO = {
  callsign: 'HYPO 01',
  status: 'CONSTRUCTED — NOT A RECORD',
  type: 'F-16 (hypothetical)',
  disclaimer: 'A construct, not a sortie. No aircraft flew this track. It is drawn to show what the claim requires, not to suggest it happened.',
  color: 0xffffff,
  src: 'derived',
};


/* =============================================================================
   THE FUEL IS NOT A CONCESSION

   The app used to hand the claim its external tanks as a favour. That was too
   generous by half, and wrong in a way worth correcting in public: the tanks
   are not an assumption, they are a finding, and they follow from the mission
   nobody disputes.

   Bozeman to Albany is one leg of 1,843 miles. The app's own figures say the
   tank fit "roughly doubles" internal fuel, so a clean airframe reaches about
   half the tanked ferry range — call it 1,225 miles, and that is generous,
   because tanks add drag as well as fuel. Carrying a passenger forces a
   two-seat F-16B/D with about 17% less internal fuel, which brings a clean
   aircraft down to roughly 1,020 miles. The leg is nearly twice that. No
   configuration without external tanks flies it, and there was no aerial
   refuelling.

   So: the fuel is established, not granted.

   AND THAT IS THE PROBLEM FOR THE CLAIM

   The same documented mission that proves the tanks also proves the route, and
   the steelman only closes because it quietly deletes the middle of it. Fargo
   straight to Somerset County is 1,012 miles and needs about Mach 1.26 — which
   works. Fargo via Bozeman to Somerset County is 2,354 miles in the same 71
   minutes, which needs about Mach 2.9: roughly twice the Mach 1.6 placarded
   limit for a tanked jet, and above the clean Mach 2.0 dash figure the
   aircraft cannot use while carrying tanks anyway. That is before a single
   second on the ground at Bozeman, and he had to land there, shut down enough
   to board a civilian, and get airborne again.

   You can use the documented mission to establish the fuel, or to establish
   the route. The claim needs the first and cannot survive the second.
   ========================================================================== */

/* A two-seat F-16B/D trades internal fuel for the second cockpit. */
export const TWO_SEAT_FUEL_PENALTY = 0.17;

export function fuelProof() {
  const legFB = haversineMi(PLACES.KFAR, PLACES.KBZN);
  const legBA = haversineMi(PLACES.KBZN, PLACES.KALB);

  // Tanks "roughly double" the fuel, so clean is about half of tanked ferry.
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
    needsTanks: legBA > twoSeatCleanMi,
  };
}

/* What keeping Bozeman does to the intercept. `targetLatLon` is where United
   93 has to be met; the window is the same one the direct run gets. */
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

/* Each concession, what it grants, and what granting it costs. The last
   column is the point: four of these cannot be bought at any price, and the
   first is no longer a concession at all. */
export const CONCESSIONS = [
  {
    grant: 'He has the fuel',
    detail: 'Two 370-gallon wing tanks and a 300-gallon centreline, roughly doubling internal fuel.',
    cost: 'Nothing, because it is not a concession. The documented mission proves it.',
    costFn: (c) => `Nothing — this is not a concession at all. Bozeman to Albany is a single `
      + `leg of ${Math.round(c.fuel.legBA).toLocaleString()} miles, and a clean two-seat F-16D `
      + `reaches about ${Math.round(c.fuel.twoSeatCleanMi).toLocaleString()}. The leg is `
      + `${c.fuel.shortfall.toFixed(1)}× that, and there was no aerial refuelling, so the tanks `
      + `are established by the mission rather than granted by this app.`,
    blocking: false,
  },
  {
    grant: 'He has the missiles',
    detail: 'AIM-9M Sidewinders on the wingtip rails.',
    cost: 'Free. Tanks occupy the wing and centreline stations; the wingtips stay available. The published placard describes carrying both.',
    blocking: false,
  },
  {
    grant: 'He launches at the earliest moment the record permits',
    detail: '08:46:40 — the first impact, the first instant anyone had reason to act.',
    cost: 'Cheap, but it is already an assumption: no departure time for Gibney has ever been published.',
    blocking: false,
  },
  {
    grant: 'He flies the perfect heading',
    detail: 'A great circle from Fargo, 111 degrees, direct to where United 93 will be.',
    cost: 'Free in geometry. Not free in knowledge — see below.',
    blocking: false,
  },
  {
    grant: 'No routing, no weather, no turnaround',
    detail: 'No ATC vectors, no jet stream, no time on the ground.',
    cost: 'Free. The app grants these everywhere else too.',
    blocking: false,
  },
  {
    grant: 'The two-seat problem is waved away',
    detail: 'Ignore that carrying Jacoby requires an F-16B/D with 17% less internal fuel.',
    cost: 'Cheap on its own.',
    blocking: false,
  },
  {
    grant: 'He knows where United 93 will be',
    detail: 'To launch at 08:46 on an intercept heading, someone must already know that United 93 — airborne four minutes, entirely normal — will be seized at 09:28 and be over Somerset County at 09:58.',
    cost: 'This is foreknowledge of the hijacking, not intelligence about it. It cannot be granted without making the claim into a much larger and entirely different allegation.',
    blocking: true,
  },
  {
    grant: 'Someone is tracking it for him',
    detail: 'A controller vectoring him onto the target in real time.',
    cost: 'NEADS did not know United 93 existed until 10:07, four minutes after it hit the ground. There was no track to vector anyone onto, and Gibney was on a transport tasking, not the air defence net.',
    blocking: true,
  },
  {
    grant: 'He never collects Jacoby',
    detail: 'The shortest flyable version runs Fargo to the intercept and straight on to Albany — about 1,320 miles, roughly half of one tankful. It does not go to Bozeman.',
    cost: 'Bozeman is where Ed Jacoby was standing, and putting it back breaks the kinematics.',
    costFn: (c) => `Bozeman is where Ed Jacoby was standing. He was collected, he reached Albany, `
      + `and he has said on the record that Gibney flew him. And this is where the fuel argument `
      + `turns around: the documented mission is what proves the tanks, but it also proves the `
      + `route. Fargo straight to the intercept is `
      + `${Math.round(c.boz.directMi).toLocaleString()} mi — Mach ${c.boz.directMach.toFixed(2)}, `
      + `which works. Fargo via Bozeman is ${Math.round(c.boz.viaMi).toLocaleString()} mi in the same `
      + `${Math.round(c.boz.hours * 60)} minutes — Mach ${c.boz.viaMach.toFixed(2)}, or `
      + `${c.boz.overPlacard.toFixed(1)}× the placarded limit, with zero seconds on the ground. `
      + `The concession that makes the flying easy is the one that deletes the only first-hand `
      + `witness to the mission.`,
    blocking: true,
  },
  {
    grant: 'He has an order',
    detail: 'Authority to fire on a civilian airliner.',
    cost: 'The shootdown authorisation was conveyed around 10:10 and reached NEADS at 10:31, which did not pass it to its pilots. At 09:58 no such order existed anywhere in the chain.',
    blocking: true,
  },
];

/* Build the best-case track: Fargo to the intercept, then straight out to
   Albany, because the day has to end somewhere and Albany is where Gibney
   demonstrably put his passenger down.

   Note what the egress leg costs. Flying the target to Albany directly is the
   SHORTEST version of the claim — about 1,320 miles in total, roughly half of
   one tankful — but it skips Bozeman, and Bozeman is where Ed Jacoby was standing.
   The most generous flyable version of this allegation is therefore one in
   which Jacoby is never collected. He was collected, and he reached Albany,
   and he has said so. So the concession that makes the flying easy is the one
   that contradicts the only first-hand witness to the actual mission. */
export function buildHypoTrack(targetLatLon, departEDT, interceptEDT) {
  const from = PLACES.KFAR;
  const to = PLACES.KALB;
  const miles = haversineMi(from, targetLatLon);
  const seconds = Math.max(1, interceptEDT - departEDT);
  const mph = miles / (seconds / 3600);

  const path = [];
  const STEPS = 24;
  for (let i = 0; i <= STEPS; i++) {
    const f = i / STEPS;
    const p = gcInterp(from, targetLatLon, f);
    // Climb out, cruise, and let down onto the target's altitude band.
    const alt = f < 0.12 ? (f / 0.12) * 31000
      : f > 0.9 ? 31000 - ((f - 0.9) / 0.1) * 24000
        : 31000;
    path.push([departEDT + seconds * f, p.lat, p.lon, alt]);
  }

  /* The turn. At the closest point to United 93 he breaks straight for Albany,
     at ordinary cruise — no reason to hurry once the shot is taken. */
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
  };
}


/* =============================================================================
   THE CRITIC, AGAINST THE STEELMAN

   This app is named after DIRNSA CRITIC 1-2001 and is a companion to a records
   request for its text — and until now the steelman argument did not mention it
   once. That is a strange omission, because the CRITIC chain is the single most
   useful thing in the whole app for testing this claim.

   Here is why. Every other source describes what HAPPENED: recorders, radar,
   ATC tapes, the NEADS recordings. The CRITIC describes what the national
   command structure BELIEVED WAS HAPPENING, timestamped to the minute, in the
   channel designed to put information in front of the President inside ten
   minutes. And the sequence brackets the alleged shootdown on both sides —
   two messages before it, two after.

   So: where would the best-case shooter have been, each time one went out?

   The answer is the argument. At 09:49, when NORAD originates the CRITIC, the
   steelman aircraft is seventy-odd miles from United 93 — six times outside the
   range of its own missile. At 09:52, when NSA pushes DIRNSA CRITIC 1-2001
   across the watch community, it is still nearly fifty miles out, six minutes
   short. Then United 93 goes into the ground, and the two follow-ups that
   close the sequence — sent at 10:14 and 10:48, into the highest-priority
   channel the United States operates — are where a shootdown by a US fighter
   would have to appear, if it had happened.

   That is the document this app can name as the one that would change its mind.
   It exists. Its contents are withheld.
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
      /* How far outside the missile's reach, expressed as a multiple, because
         "72 miles" means nothing until you know the weapon reaches 11. */
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
  headline: 'The kinematics work. Nothing else does.',
  body: 'The fuel is not even in dispute: the documented Montana-to-Albany leg is 1,843 miles, which no clean F-16 flies, so the external tanks are established rather than granted. Add the missiles, the earliest permitted launch and a perfect heading, and the run to Somerset County needs roughly Mach 1.26 sustained — inside the placarded limit for a tanked jet, and about 41% of its ferry range. Speed and fuel do not stop this, and an argument that leans on them is leaning on the wrong thing. What stops it is that the launch requires knowing at 08:46 what would not happen until 09:28, that the sector had no track on the aircraft until four minutes after it crashed, that no order to fire existed at 09:58, and that the very mission which proves the fuel also puts Bozeman in the route — which pushes the intercept to about Mach 2.9, nearly twice what a tanked F-16 is permitted.',
  src: 'derived',
};

/* =============================================================================
   THE FOREKNOWLEDGE HORIZON

   The sharpest form of the first blocking concession, and the one thing here
   that can be drawn as a hard line.

   United 93 was seized at 09:28. Before that moment it was an ordinary flight
   climbing out of Newark, and nothing about it distinguished it from any other
   aircraft in the sky. So a launch aimed at it before 09:28 is not a response
   to a hijacking; it is a response to a hijacking that has not happened yet.

   That gives a boundary with a radius rather than an argument. Take the
   fastest speed an F-16 can manage, multiply by the thirty minutes between the
   seizure and the alleged shot, and you get the set of points from which the
   target could be reached WITHOUT departing early. Inside it, no foreknowledge
   is needed. Outside it, the launch necessarily precedes the hijacking.

   Fargo is 1,012 miles out. The horizon is 660. It is not close.

   A caution on what this draws. The line does not show that anyone had
   foreknowledge. It shows what the claim REQUIRES — that is a statement about
   the claim, not about the world, and the label says so.
   ========================================================================== */

export const HIJACK_T = at(9, 28, 0);

export const FOREKNOWLEDGE = {
  title: 'What the claim requires him to have known',
  hijackLabel: 'United 93 seized, 09:28',
  caution: 'This is a statement about the claim, not about the world. These times are what the allegation requires, not evidence that anyone knew anything.',
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

   HYPO 01 is built to arrive where United 93 is at 09:58, so the range between
   them collapses to nothing at that moment by construction. What is worth
   measuring is the shape of that approach: how long the two are inside AIM-9
   range of each other, and how briefly.

   The answer is short. A closing fighter and a descending airliner spend a
   couple of minutes inside ten miles of each other and then the geometry opens
   again. That window is the whole of the opportunity the claim needs — and it
   is a window the record has to place a specific aircraft inside, to the
   minute, with nothing putting it there.
   ========================================================================== */

export function losRange(track, targetAt, t) {
  const a = trackSampleLL(track, t);
  const b = targetAt(t);
  if (!a || !b) return null;
  return { from: a, to: b, miles: haversineMi(a, b) };
}

/* Sample HYPO 01's own path — it is stored in the same [t,lat,lon,alt] shape
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

   Distinct from the sight LINE, and worth drawing separately. An aircraft can
   see — and be seen by — everything inside its radio horizon, which is set by
   altitude and the curvature of the Earth, not by any weapon:

       d (nautical miles) ~ 1.23 * sqrt(height in feet)

   Two aircraft see each other at the sum of their own horizons. At 31,000 ft
   with a target at 5,000, that is roughly 350 statute miles.

   Put that beside an AIM-9's eleven and the gap is the whole argument. Line of
   sight is not the constraint and never was. Being able to see an airliner
   from three hundred miles away buys nothing; the weapon still requires being
   inside a ring twenty-two miles across at one particular minute. Seeing is
   not shooting, and the horizon is drawn to make the ratio visible.
   ========================================================================== */

export const LOS_HORIZON = {
  title: 'Line-of-sight horizon',
  color: 0x74c7ff,
  note: 'Everything inside this is in view. Almost none of it is in range.',
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
