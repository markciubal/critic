/* =============================================================================
   tour.js — a guided walk through the steelman argument.

   The steelman is the most demanding thing in this app to read cold. It grants
   ten things, and the whole point lives in the order: six concessions are free,
   the kinematics then survive, and only after that do four separate blockers
   land. Someone scrubbing a timeline at random will never assemble that order,
   and the argument collapses into "a fast jet could have got there", which is
   the opposite of what it says.

   So the tour is not decoration. It is the argument's sequence, made playable:
   each step sets the clock, moves the camera and opens the panel that carries
   the evidence, so the claim is being *watched* while it is being explained.

   Steps are data. Every body is a function taking a live context — the built
   steelman track, the line-of-sight comparison — so the tour cannot quote a
   figure the panel beside it disagrees with. The first draft did exactly that:
   it said "Mach 1.26 over 1,012 miles" from the prose in steelman.js while the
   panel three inches away computed Mach 1.22 over 990 miles from the model.
   Both came from the same allegation; only one was being calculated.

   `view` kinds:
     reset                  the whole country
     place:<KEY>            a named place from PLACES
     ua93                   United 93 at the current clock
     hypo                   HYPO 01 at the current clock
     fit:<KEY>,<KEY>        frame several places at once
   ========================================================================== */

import { F16 } from './data.js';
import { AIM9 } from './reachability.js';
import { HYPO, CONCESSIONS, VERDICT, LOS_HORIZON, FOREKNOWLEDGE } from './steelman.js';

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

/* The three acts, used for the chapter strip and the accent colour. A step's
   tone is a claim about what the step is doing to the argument, not a mood. */
export const TONES = {
  setup:    { label: 'The claim',      color: '#a2b5cf' },
  grant:    { label: 'What we grant',  color: '#ffd447' },
  survives: { label: 'What survives',  color: '#35d6a4' },
  blocks:   { label: 'What blocks it', color: '#ff1f3d' },
  verdict:  { label: 'The verdict',    color: '#eef3fa' },
};

const blocking = CONCESSIONS.filter((c) => c.blocking);
const free = CONCESSIONS.filter((c) => !c.blocking);

export const TOUR_STEPS = [
  {
    id: 'why',
    tone: 'setup',
    title: 'Why build the best version of a claim you think is wrong',
    body: (c) => `
      Everything else in this app tests Major Rick Gibney's account. This tests the
      <em>strongest possible</em> version of it.
      <p>Arguing only against the weakest reading teaches you nothing: you never find out which
      of your objections were load-bearing and which were decoration. So the next few minutes
      grant the claim <strong>${CONCESSIONS.length} favourable assumptions at once</strong> —
      fuel, missiles, a perfect launch, a perfect heading — and then ask what is still standing.</p>
      <p class="tour-warn"><strong>${HYPO.callsign} is a construct.</strong> ${HYPO.disclaimer}</p>`,
    t: at(7, 59, 0),
    tab: 'claim',
    view: 'reset',
    layers: { hypo: false, envelope: false, wez: false },
    dwellMs: 15000,
  },

  {
    id: 'account',
    tone: 'setup',
    title: 'What the account actually says',
    body: (c) => `
      Gibney is a North Dakota Air National Guard pilot. On 11 September he flew New York
      emergency-management director <strong>Ed Jacoby Jr.</strong> from Montana to Albany —
      that part is documented and Jacoby has described it on the record.
      <p>The allegation added later is that between those two points he was scrambled from
      <strong>Fargo</strong>, intercepted <strong>United 93</strong> over Somerset County,
      Pennsylvania, and shot it down.</p>
      <p>Two routes, then: the one with witnesses, and the one without. The map is showing both.</p>`,
    t: at(8, 42, 0),
    tab: 'claim',
    view: 'reset',
    layers: { routeDoc: true, routeClaim: true, hypo: false },
    dwellMs: 15000,
  },

  {
    id: 'grant-hardware',
    tone: 'grant',
    title: 'The fuel is not a concession — it is proven',
    body: (c) => `
      This app used to hand the claim its drop tanks as a favour. That was too generous, and
      the correction is worth making out loud.
      <p><strong>Fuel.</strong> The undisputed part of Gibney's day includes Bozeman to Albany
      in one leg: <strong>${Math.round(c.fuel.legBA).toLocaleString()} miles</strong>. Tanks
      roughly double internal fuel, so a clean jet reaches about
      ${Math.round(c.fuel.cleanFerryMi).toLocaleString()} — and carrying a passenger forces a
      two-seat D-model with 17% less, down to about
      <strong>${Math.round(c.fuel.twoSeatCleanMi).toLocaleString()}</strong>. The leg is
      <strong>${c.fuel.shortfall.toFixed(1)}×</strong> that, with no aerial refuelling
      available. The tanks are established by the mission, not granted here.</p>
      <p><strong>Missiles.</strong> ${free[1].detail} Tanks take the wing and centreline
      stations; the wingtip rails stay free. The placard describes carrying both.</p>
      <p>So Fargo to the intercept — ${Math.round(c.steel.miles).toLocaleString()} miles,
      ${Math.round(c.steel.ferryFraction * 100)}% of ferry range — is comfortably inside the
      envelope on the map. Any argument against this claim that leans on fuel is leaning on the
      wrong thing. <em>Hold on to that, because it comes back.</em></p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'place:KFAR',
    viewDist: 120,
    layers: { envelope: true, wez: false, hypo: false, routeDoc: false, routeClaim: true },
    highlight: '#reach-out',
    dwellMs: 22000,
  },

  {
    id: 'grant-launch',
    tone: 'grant',
    title: 'Granted: he launches the instant anyone could have',
    body: (c) => `
      The clock is at <strong>08:46:40</strong> — American 11 striking the North Tower. It is
      the first moment in the entire day that anyone, anywhere, had a reason to act.
      <p>So the tour hands the claim a launch at that exact second. Not a minute of hesitation,
      no briefing, no start-up, no taxi.</p>
      <p>${free[2].cost}</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'place:KFAR',
    viewDist: 90,
    layers: { envelope: true, hypo: false },
    dwellMs: 14000,
  },

  {
    id: 'grant-heading',
    tone: 'grant',
    title: 'Granted: the perfect heading, flown perfectly',
    body: (c) => `
      ${free[3].detail}
      <p>No air-traffic vectors, no jet stream, no weather deviation, no time on the ground.
      The two-seat problem — that carrying Jacoby needs an F-16B/D with 17% less internal fuel
      — is waved away too.</p>
      <p>That is <strong>${free.length} of the ${CONCESSIONS.length} concessions</strong>, all
      free or nearly so. ${HYPO.callsign} is now on the map, drawn dashed and white because it
      is a construct and nothing else on this map is.</p>`,
    t: at(9, 20, 0),
    tab: 'claim',
    view: 'hypo',
    viewDist: 90,
    layers: { hypo: true, envelope: true },
    highlight: '#steel-out',
    dwellMs: 16000,
  },

  {
    id: 'survives',
    tone: 'survives',
    title: 'And it works. The kinematics are not the problem.',
    body: (c) => `
      This is the honest result, and the reason the steelman was worth building.
      <p>The run needs <strong>${Math.round(c.steel.mph).toLocaleString()} mph</strong> —
      <strong>Mach ${c.steel.mach.toFixed(2)}</strong> sustained. The placarded limit with
      tanks is ${F16.maxWithTanksMph.toLocaleString()} mph, so the claim fits
      <em>inside</em> it. The jet can physically do this.</p>
      <p>Anyone who tells you Gibney's account is impossible because an F-16 is too slow or
      too short-legged has not checked. Speed and fuel do not stop this claim. Something else
      has to, or nothing does.</p>`,
    t: at(9, 48, 0),
    tab: 'claim',
    view: 'hypo',
    viewDist: 70,
    layers: { hypo: true, envelope: true, wez: false },
    highlight: '#steel-out',
    dwellMs: 16000,
  },

  {
    id: 'block-knowledge',
    tone: 'blocks',
    title: `Blocker 1 — he has to know at 08:46 what happens at 09:28`,
    body: (c) => `
      Look at the clock, and look at United 93.
      <p>It is <strong>08:46</strong>. United 93 is four minutes out of Newark, climbing,
      entirely normal. Its hijacking is <strong>42 minutes away</strong>. Nobody aboard knows,
      nobody on the ground knows, and there is nothing whatsoever to intercept.</p>
      <p>${blocking[0].cost}</p>
      <p class="tour-warn">${FOREKNOWLEDGE.caution}</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'ua93',
    viewDist: 60,
    layers: { hypo: true, UA93: true },
    highlight: '#fk-out',
    dwellMs: 18000,
  },

  {
    id: 'block-tracking',
    tone: 'blocks',
    title: 'Blocker 2 — nobody could have vectored him onto it',
    body: (c) => `
      Grant the foreknowledge anyway. He still has to be <em>steered</em> onto a target
      crossing Pennsylvania at 400-odd miles an hour.
      <p>${blocking[1].cost}</p>
      <p>The clock is now at <strong>10:07</strong> — the moment NEADS first learned United 93
      existed. It had already been on the ground for four minutes.</p>`,
    t: at(10, 7, 0),
    tab: 'military',
    view: 'place:SHKV',
    viewDist: 90,
    layers: { hypo: true },
    dwellMs: 17000,
  },

  {
    id: 'block-order',
    tone: 'blocks',
    title: 'Blocker 3 — no order to fire existed',
    body: (c) => `
      Grant the tracking too. He still needs authority to destroy a civilian airliner with
      forty people aboard.
      <p>${blocking[3].cost}</p>
      <p>The alleged shot is at <strong>09:58</strong>. The clock is at <strong>10:31</strong>
      — thirty-three minutes later, and the authorisation has only just reached the sector
      that never passed it on.</p>`,
    t: at(10, 31, 0),
    tab: 'critic',
    view: 'reset',
    layers: { hypo: true, critic: true },
    dwellMs: 17000,
  },

  {
    id: 'block-jacoby',
    tone: 'blocks',
    title: 'Blocker 4 — the easy version erases the only witness',
    body: (c) => `
      This is the one that does the most damage, and it is self-inflicted.
      <p>The shortest flyable version of the claim runs Fargo → intercept → Albany:
      <strong>${Math.round(c.steel.totalMi).toLocaleString()} miles</strong>,
      <strong>${Math.round(c.steel.totalFerryFraction * 100)}%</strong> of ferry range —
      inside one tankful. That is the routing ${HYPO.callsign} is flying. It never goes near
      Bozeman.</p>
      <p><strong>And here the fuel comes back.</strong> The mission that proved the tanks is
      the same mission that proves the route. Put Bozeman back and the run to the intercept
      goes from ${Math.round(c.boz.directMi).toLocaleString()} miles to
      <strong>${Math.round(c.boz.viaMi).toLocaleString()}</strong> in the same
      ${Math.round(c.boz.hours * 60)} minutes: Mach ${c.boz.directMach.toFixed(2)} becomes
      <strong>Mach ${c.boz.viaMach.toFixed(2)}</strong> —
      <strong>${c.boz.overPlacard.toFixed(1)}×</strong> the placarded limit for a tanked jet,
      and that grants zero seconds on the ground at Bozeman for landing and boarding a
      civilian.</p>
      <p>${blocking[2].cost}</p>
      <p>So one piece of evidence is doing both jobs, in opposite directions. Use the
      documented mission to establish the fuel and you have also established the route. The
      claim needs the first and cannot survive the second.</p>`,
    t: at(10, 20, 0),
    tab: 'claim',
    view: 'fit:KBZN,KFAR,KALB',
    layers: { hypo: true, routeDoc: true, places: true },
    highlight: '#concessions',
    dwellMs: 26000,
  },

  {
    id: 'scale',
    tone: 'blocks',
    title: 'And the shot itself is a twenty-mile coincidence',
    body: (c) => `
      Every ring on this map has been generous. This one is not.
      <p>To fire, he must be within <strong>${c.los.wezMi} miles</strong> of United 93 — and no
      nearer than ${AIM9.rMinMi}, because a Sidewinder has a minimum range too. Set that beside
      the <strong>${Math.round(c.los.losMi)} miles</strong> at which the two aircraft could
      merely <em>see</em> each other: a ratio of
      <strong>${Math.round(c.los.ratio)} to 1</strong>.</p>
      <p>${LOS_HORIZON.note} Seeing was never the constraint. Being inside a twenty-mile circle around one airliner
      at one instant is — and nothing in the record puts him there, or anywhere else.</p>`,
    t: at(9, 58, 0),
    tab: 'claim',
    view: 'ua93',
    viewDist: 40,
    layers: { hypo: true, wez: true, envelope: true },
    highlight: '#wez-out',
    dwellMs: 18000,
  },

  {
    id: 'verdict',
    tone: 'verdict',
    title: VERDICT.headline,
    body: (c) => `
      <p>${VERDICT.body}</p>
      <p>That is a more useful conclusion than "impossible", and a much harder one to wave
      away. A claim refuted on arithmetic invites a better arithmetician. A claim refuted on
      knowledge, authority and first-hand testimony has nowhere left to go.</p>
      <p class="tour-warn">${HYPO.callsign} has been removed from the map. It was never there.</p>`,
    t: at(9, 58, 0),
    tab: 'claim',
    view: 'reset',
    layers: { hypo: false, wez: false },
    dwellMs: 22000,
    last: true,
  },
];

/* The chapter strip: one dot per step, grouped by tone, so the shape of the
   argument — grant, grant, grant, survive, block, block, block — is visible
   before it is heard. */
export function tourChapters() {
  const out = [];
  for (const s of TOUR_STEPS) {
    const prev = out[out.length - 1];
    if (prev && prev.tone === s.tone) prev.count += 1;
    else out.push({ tone: s.tone, count: 1, label: TONES[s.tone].label });
  }
  return out;
}
