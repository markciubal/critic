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

   Fuel, missiles, a perfect launch time, a perfect heading, no air-traffic
   routing, no weather, no turnaround, the two-seat problem waved away, and an
   order that did not exist. Every one of those is granted simultaneously.

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

import { PLACES, F16 } from './data.js';
import { haversineMi, bearingDeg, gcInterp, machAt } from './geo.js';

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

export const HYPO = {
  callsign: 'HYPO 01',
  status: 'CONSTRUCTED — NOT A RECORD',
  type: 'F-16 (hypothetical)',
  disclaimer: 'A construct, not a sortie. No aircraft flew this track. It is drawn to show what the claim requires, not to suggest it happened.',
  color: 0xffffff,
  src: 'derived',
};

/* Each concession, what it grants, and what granting it costs. The last
   column is the point: three of these cannot be bought at any price. */
export const CONCESSIONS = [
  {
    grant: 'He has the fuel',
    detail: 'Two 370-gallon wing tanks and a 300-gallon centreline, roughly doubling internal fuel.',
    cost: 'Free. This is an ordinary fit, and 1,012 miles is about 41% of ferry range.',
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
    cost: 'Bozeman is where Ed Jacoby was standing. He was collected, he reached Albany, and he has said on the record that Gibney flew him. The concession that makes the flying easy is the one that contradicts the only first-hand witness to the mission.',
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

export const VERDICT = {
  headline: 'The kinematics work. Nothing else does.',
  body: 'Granting fuel, missiles, the earliest permitted launch and a perfect heading, the run to Somerset County needs roughly Mach 1.26 sustained — inside the placarded limit for a tanked F-16, and about 41% of its ferry range. Speed and fuel do not stop this, and an argument that leans on them is leaning on the wrong thing. What stops it is that the launch requires knowing at 08:46 what would not happen until 09:28, that the sector had no track on the aircraft until four minutes after it crashed, that no order to fire existed at 09:58, and that the pilot, his unit and his passenger all place him over Montana.',
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
