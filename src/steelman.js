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
   no aircraft, no sortie and no record; it is drawn dashed, in white, labelled
   as constructed at every appearance, and it is off by default. No F-16 flew
   this track. The point of drawing it is to show what would have had to be
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
    grant: 'He has an order',
    detail: 'Authority to fire on a civilian airliner.',
    cost: 'The shootdown authorisation was conveyed around 10:10 and reached NEADS at 10:31, which did not pass it to its pilots. At 09:58 no such order existed anywhere in the chain.',
    blocking: true,
  },
];

/* Build the best-case track. The target position is sampled from United 93's
   own path rather than hard-coded, so this stays correct if that path is
   ever revised. */
export function buildHypoTrack(targetLatLon, departEDT, interceptEDT) {
  const from = PLACES.KFAR;
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

  return {
    path,
    miles,
    seconds,
    mph,
    mach: machAt(mph, 31000),
    bearing: bearingDeg(from, targetLatLon),
    withinTankedLimit: mph <= F16.maxWithTanksMph,
    ferryFraction: miles / F16.ferryRangeMi,
  };
}

export const VERDICT = {
  headline: 'The kinematics work. Nothing else does.',
  body: 'Granting fuel, missiles, the earliest permitted launch and a perfect heading, the run to Somerset County needs roughly Mach 1.26 sustained — inside the placarded limit for a tanked F-16, and about 41% of its ferry range. Speed and fuel do not stop this, and an argument that leans on them is leaning on the wrong thing. What stops it is that the launch requires knowing at 08:46 what would not happen until 09:28, that the sector had no track on the aircraft until four minutes after it crashed, that no order to fire existed at 09:58, and that the pilot, his unit and his passenger all place him over Montana.',
  src: 'derived',
};
