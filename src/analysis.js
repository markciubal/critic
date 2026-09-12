/* =============================================================================
   analysis.js — the feasibility engine.

   This is the part of the app that actually adjudicates anything. Given a
   route and a set of time constraints, it computes the ground speed each leg
   would demand and compares that against the F-16's published envelope.

   It is deliberately generous to the claim at every branch point: shortest
   great-circle legs, zero time on the ground, instant climbs and descents, no
   headwind, no air-traffic routing, no fuel stop. Those are all concessions
   that make the claimed itinerary easier, not harder. If it still fails under
   assumptions that favourable, the failure is not an artefact of the model.
   ========================================================================== */

import { PLACES, F16, CLAIM_ROUTE, DOC_ROUTE } from './data.js';
import { haversineMi, machAt } from './geo.js';

export const ASSUMPTIONS = [
  'Great-circle legs — no ATC routing, no airway dogleg, no holding.',
  'Zero turnaround: landing, boarding a passenger and taking off again take no time at all.',
  'Instantaneous climb and descent; the whole leg is flown at cruise altitude.',
  'Still air. A real westbound leg fights the jet stream, often by 80–120 mph.',
  'No fuel stop and no tanker rendezvous is charged against the clock.',
];

/* Verdict bands, expressed against the airframe rather than against a vibe. */
export function classify(mph) {
  if (mph <= F16.cruiseMph) return { key: 'routine', label: 'Routine cruise', rank: 0 };
  if (mph <= F16.maxSeaLevelMph) return { key: 'hard', label: 'Hard, sustained — burns fuel fast', rank: 1 };
  if (mph <= F16.maxWithTanksMph) return { key: 'dash', label: 'Beyond any sustainable cruise', rank: 2 };
  return { key: 'impossible', label: 'Exceeds the airframe outright', rank: 3 };
}

export function legAnalysis(fromKey, toKey, seconds) {
  const a = PLACES[fromKey], b = PLACES[toKey];
  const miles = haversineMi(a, b);
  const hours = seconds / 3600;
  const mph = hours > 0 ? miles / hours : Infinity;
  return {
    fromKey, toKey, from: a, to: b, miles, seconds, hours, mph,
    mach: machAt(mph, 35000),
    verdict: classify(mph),
    // How many unrefuelled combat radii this leg spends.
    radiiSpent: miles / F16.combatRadiusMi,
    overFerry: miles > F16.ferryRangeMi,
  };
}

/* -----------------------------------------------------------------------------
   The claim's itinerary.

   `departEDT` is user-controlled: the earliest moment Gibney could plausibly
   have launched. The claim fixes the Shanksville arrival at 09:58. Everything
   after that is unconstrained in time, so rather than invent arrival times the
   app reports those legs as distance and fuel problems instead of speed ones.
--------------------------------------------------------------------------- */

export function analyseClaim(departEDT, interceptEDT) {
  const dash = legAnalysis('KFAR', 'SHKV', interceptEDT - departEDT);
  const back = legAnalysis('SHKV', 'KBZN', 0);   // time unconstrained
  const deliver = legAnalysis('KBZN', 'KALB', 0);
  const totalMi = dash.miles + back.miles + deliver.miles;
  return {
    id: 'claim',
    label: CLAIM_ROUTE.label,
    departEDT, interceptEDT,
    dash,
    untimed: [back, deliver],
    totalMi,
    radiiSpent: totalMi / F16.combatRadiusMi,
    findings: claimFindings(dash, back, deliver, totalMi),
  };
}

function claimFindings(dash, back, deliver, totalMi) {
  const f = [];

  f.push({
    weight: dash.verdict.rank >= 2 ? 'hard' : 'soft',
    title: 'The dash to Pennsylvania',
    text: `Fargo to Shanksville is ${Math.round(dash.miles)} miles. Covering it in the time set on the dial demands ${Math.round(dash.mph)} mph — Mach ${dash.mach.toFixed(2)} at altitude. ${dash.verdict.label}.`,
  });

  f.push({
    weight: 'soft',
    title: 'Fuel is weaker than it first looks — and this app overstated it',
    text: `An earlier version of this analysis called fuel the binding constraint. With external tanks it is not. Two 370-gallon wing tanks and a 300-gallon centreline roughly double the fuel and give a one-way ferry range near ${F16.ferryRangeMi.toLocaleString()} miles, so the ${Math.round(dash.miles)}-mile run to Pennsylvania is about ${Math.round(dash.miles / F16.ferryRangeMi * 100)}% of it — an ordinary transit. Fuel only bites on the full itinerary, which needs a refuelling stop somewhere.`,
  });

  f.push({
    weight: 'hard',
    title: 'The claim does not remove the rest of the day',
    text: `Shanksville back to Bozeman is ${Math.round(back.miles)} miles; Bozeman on to Albany is another ${Math.round(deliver.miles)}. The claimed itinerary totals ${Math.round(totalMi)} miles — ${(totalMi / F16.ferryRangeMi).toFixed(1)}x the jet's maximum ferry range with external tanks, and it crosses the continent three times instead of once.`,
  });

  f.push({
    weight: 'hard',
    title: 'The detour has no purpose',
    text: 'For the claim to hold, Gibney must fly east past Bozeman to Pennsylvania, shoot down an airliner, then fly all the way back west to collect his passenger, then east again. Bozeman is roughly on the way from Fargo to nowhere near Somerset County. The documented route is the one a person with this tasking would actually fly.',
  });

  f.push({
    weight: 'soft',
    title: 'The two-seat problem',
    text: 'Carrying Jacoby requires a two-seat F-16B/D. The claim therefore needs a jet configured for a passenger to have prosecuted an air-to-air engagement — with, on its own account, a civilian emergency-management director in the back seat either before or after the shot. This point is the app\'s inference, not a sourced finding.',
  });

  return f;
}

export function analyseDocumented() {
  const l1 = legAnalysis('KFAR', 'KBZN', 0);
  const l2 = legAnalysis('KBZN', 'KALB', 0);
  const totalMi = l1.miles + l2.miles;
  return {
    id: 'documented',
    label: DOC_ROUTE.label,
    legs: [l1, l2],
    totalMi,
    note: `${Math.round(totalMi)} miles in two legs with one stop — a long day, but an ordinary one for a fighter with tanker support, and it is the route the unit, the pilot and the passenger all describe.`,
  };
}

/* -----------------------------------------------------------------------------
   Time-to-Shanksville: for any departure time on the dial, what speed does
   the intercept demand? Used to draw the speed-vs-departure curve.
--------------------------------------------------------------------------- */

export function speedCurve(interceptEDT, fromEDT, toEDT, step = 60) {
  const miles = haversineMi(PLACES.KFAR, PLACES.SHKV);
  const pts = [];
  for (let t = fromEDT; t <= toEDT; t += step) {
    const secs = interceptEDT - t;
    if (secs <= 0) break;
    pts.push({ t, mph: miles / (secs / 3600) });
  }
  return { miles, pts };
}

/* -----------------------------------------------------------------------------
   The independent check: the command timeline.

   Even setting every aerodynamic and fuel question aside, an intercept has to
   be ordered. These are the Commission's own timestamps, and they close the
   window from the other end.
--------------------------------------------------------------------------- */

export const COMMAND_CHECK = {
  title: 'The order that was never given',
  rows: [
    { t: '09:58', text: 'Alleged moment of the missile shot.', src: 'claim' },
    { t: '10:03:11', text: 'United 93 strikes the ground in Stonycreek Township.', src: 'commission' },
    { t: '10:07', text: 'NEADS is told about United 93 for the first time — four minutes after it has already crashed.', src: 'commission' },
    { t: '10:10–10:15', text: 'Vice President Cheney conveys shootdown authorisation.', src: 'commission' },
    { t: '10:31', text: 'NEADS receives the authorisation, and does not pass it down to its pilots.', src: 'commission' },
    { t: '10:42', text: 'The first armed fighter launches from Andrews.', src: 'commission' },
  ],
  conclusion: 'The air defence sector did not know United 93 existed until after it was down, and the authority to fire arrived 33 minutes after the alleged shot. For the claim to be true, a pilot two time zones away must have executed an order that nobody had yet been given, against a target his sector had not yet been told about.',
  src: 'derived',
};
