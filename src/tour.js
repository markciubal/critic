/* =============================================================================
   tour.js — a guided walk through the steelman argument.

   The steelman is the most demanding thing in this app to read cold. It grants
   ten things, and the whole point lives in the order: the concessions are free,
   the kinematics then survive, and only after that do four separate blockers
   land. Someone scrubbing a timeline at random will never assemble that order,
   and the argument collapses into "a fast jet could have got there", which is
   the opposite of what it says.

   So the tour is not decoration. It is the argument's sequence, made playable:
   each step sets the clock, moves the camera and opens the panel that carries
   the evidence, so the claim is being *watched* while it is being explained.

   WRITTEN FOR SOMEONE WHO HAS NEVER READ AN NTSB REPORT

   The first version of this was written in the vocabulary of the sources it
   came from — "placarded to Mach 1.6", "combat radius", "primary returns".
   All correct, and all a wall to anyone who had not spent a week in the same
   documents. Every step now says it in plain words and puts the exact term
   behind an (i), so nothing is lost and nothing is in the way.

   Bodies are functions over a live context, so the tour cannot quote a figure
   the panel beside it disagrees with. The first draft did exactly that: it
   said "Mach 1.26 over 1,012 miles" from the prose in steelman.js while the
   panel three inches away computed Mach 1.22 over 990 miles from the model.

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

/* The acts, used for the chapter strip and the accent colour. A step's tone is
   a claim about what the step is doing to the argument, not a mood. */
export const TONES = {
  setup:    { label: 'The claim',      color: '#a2b5cf' },
  grant:    { label: 'What we grant',  color: '#ffd447' },
  survives: { label: 'What survives',  color: '#35d6a4' },
  blocks:   { label: 'What blocks it', color: '#ff1f3d' },
  verdict:  { label: 'The verdict',    color: '#eef3fa' },
};

const blocking = CONCESSIONS.filter((c) => c.blocking);
const free = CONCESSIONS.filter((c) => !c.blocking);

/* Each body takes (c, i): `c` is the live context, `i` is the info-icon
   helper, handed in from main.js so this module needs to know nothing about
   how the popover works. */
export const TOUR_STEPS = [
  {
    id: 'why',
    tone: 'setup',
    title: 'Start by making the claim as strong as possible',
    body: (c, i) => `
      There is a story that a fighter pilot shot down United 93. This app exists to test it.
      <p>The useful way to test a claim is not to argue with its weakest version. It is to build
      the <em>best</em> version you can — give it every benefit of the doubt at once — and then
      see what is still wrong with it. That is called steelmanning ${i('steelman')}.</p>
      <p>So over the next few minutes this app hands the story
      <strong>everything it could reasonably want</strong>: the right aircraft, the right
      weapons, a perfect takeoff time, a perfect route. Then we look at what is left.</p>
      <p class="tour-warn"><strong>Nothing you are about to see on the map is real.</strong>
      The aircraft we draw, ${HYPO.callsign}, never existed. It is drawn in white dashes to show
      what the story would have needed, not to suggest any of it happened.</p>`,
    t: at(7, 59, 0),
    tab: 'claim',
    view: 'reset',
    layers: { hypo: false, envelope: false, wez: false },
  },

  {
    id: 'account',
    tone: 'setup',
    title: 'What the story actually says',
    body: (c, i) => `
      Rick Gibney was a real Air National Guard pilot in North Dakota. On 11 September he really
      did fly a state official, <strong>Ed Jacoby Jr.</strong>, from Montana back to Albany, New
      York. Jacoby has talked about the flight. That part is not in dispute.
      <p>The accusation, which surfaced years later, is that in between he was sent up from
      <strong>Fargo</strong>, caught <strong>United 93</strong> over Pennsylvania, and shot it
      down.</p>
      <p>So there are two versions of his day on the map: the one with witnesses, and the one
      without.</p>`,
    t: at(8, 42, 0),
    tab: 'claim',
    view: 'reset',
    layers: { routeDoc: true, routeClaim: true, hypo: false },
  },

  {
    id: 'grant-hardware',
    tone: 'grant',
    title: 'He had the fuel. That is not a favour — it is a fact.',
    body: (c, i) => `
      This app used to treat the extra fuel as something it was generously handing the story.
      That was wrong, and the correction is worth making out loud.
      <p>A fighter jet carries very little fuel on its own, so for long trips it bolts spare
      tanks to the outside ${i('dropTanks')}. The undisputed part of Gibney's day includes
      Montana to Albany <strong>in one hop of
      ${Math.round(c.fuel.legBA).toLocaleString()} miles</strong>. Without the extra tanks, a
      jet like his runs out at roughly
      ${Math.round(c.fuel.twoSeatCleanMi).toLocaleString()} miles ${i('twoSeat')} — and there
      was no refuelling in mid-air. He must have had the tanks. It is proven by the trip he
      actually made.</p>
      <p>He would also have had the missiles. They are short-range heat-seekers
      ${i('sidewinder')} that hang on the wingtips, and the tanks hang underneath, so carrying
      both at once is completely normal.</p>
      <p><em>Remember the fuel. It comes back later, and not in the way you would expect.</em></p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'place:KFAR',
    viewDist: 120,
    layers: { envelope: true, wez: false, hypo: false, routeDoc: false, routeClaim: true },
    highlight: '#reach-out',
  },

  {
    id: 'grant-launch',
    tone: 'grant',
    title: 'He took off the very first second anyone could have',
    body: (c, i) => `
      The clock above reads <strong>08:46:40</strong>. That is the moment the first aircraft hit
      the World Trade Center — the first instant anybody in the country had any reason to think
      something was wrong.
      <p>We are giving the story a takeoff at that exact second. No hesitation, no briefing, no
      time starting the engine, no taxiing to the runway.</p>
      <p>Even that is a gift, and it is worth naming: <strong>no record anywhere says what time
      Gibney actually took off.</strong> We picked the time that helps the story most.</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'place:KFAR',
    viewDist: 90,
    layers: { envelope: true, hypo: false },
  },

  {
    id: 'grant-heading',
    tone: 'grant',
    title: 'And he flew a flawless route',
    body: (c, i) => `
      Straight line from Fargo, dead on course, to the exact spot where United 93 will be over
      an hour later.
      <p>No being redirected by air traffic control, no headwind, no weather, no time spent on
      the ground anywhere. We also ignore a real problem: to carry a passenger he needed the
      two-seat version of the jet ${i('twoSeat')}, which holds less fuel.</p>
      <p>That is every easy assumption granted at once. The white dashed line now on the map is
      that perfect flight. It is the best case the story can possibly have.</p>`,
    t: at(9, 20, 0),
    tab: 'claim',
    view: 'hypo',
    viewDist: 90,
    layers: { hypo: true, envelope: true },
    highlight: '#steel-out',
  },

  {
    id: 'survives',
    tone: 'survives',
    title: 'And it works. The jet really could have got there.',
    body: (c, i) => `
      This is the honest result, and it is the reason building the best case was worth doing.
      <p>To cover the distance in the time available he would need about
      <strong>${Math.round(c.steel.mph).toLocaleString()} mph</strong> — roughly
      <strong>${c.steel.mach.toFixed(1)} times the speed of sound</strong> ${i('mach')}. His jet
      was allowed up to about ${F16.maxWithTanksMph.toLocaleString()} mph with the tanks fitted
      ${i('placard')}. So it fits, with room to spare.</p>
      <p>Anyone who tells you the story is impossible because the aircraft was too slow, or
      could not carry enough fuel, has not checked. <strong>Speed and fuel do not sink this
      story.</strong> Something else has to, or nothing does.</p>`,
    t: at(9, 48, 0),
    tab: 'claim',
    view: 'hypo',
    viewDist: 70,
    layers: { hypo: true, envelope: true, wez: false },
    highlight: '#steel-out',
  },

  {
    id: 'block-knowledge',
    tone: 'blocks',
    title: 'Problem 1: he would have to know the future',
    body: (c, i) => `
      Look at the clock, and look at United 93 on the map.
      <p>It is <strong>08:46</strong>. United 93 left Newark four minutes ago and is climbing
      normally. Nothing has happened to it. It will not be hijacked for another
      <strong>42 minutes</strong>.</p>
      <p>So to take off now, pointed at it, somebody has to already know that this particular
      ordinary flight is going to be hijacked at 09:28 — and where it is going to be at 09:58,
      an hour and a quarter from now.</p>
      <p>That is not a story about intelligence. That is a story about knowing in advance, which
      is a far bigger and completely different accusation.</p>
      <p class="tour-warn">${FOREKNOWLEDGE.caution}</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'ua93',
    viewDist: 60,
    layers: { hypo: true, UA93: true },
    highlight: '#fk-out',
  },

  {
    id: 'block-tracking',
    tone: 'blocks',
    title: 'Problem 2: nobody could have guided him to it',
    body: (c, i) => `
      Say we grant the impossible knowledge anyway. He still has to be steered onto an airliner
      crossing Pennsylvania at 400-odd miles an hour, and a pilot cannot find that alone.
      <p>The unit that would have done the steering ${i('neads')} <strong>did not know United 93
      existed until 10:07</strong> — which is the time now on the clock, and four minutes
      <em>after</em> the aircraft was already on the ground.</p>
      <p>There was nothing to point him at. And Gibney was flying a passenger that day, not
      sitting on the air-defence radio net.</p>`,
    t: at(10, 7, 0),
    tab: 'military',
    view: 'place:SHKV',
    viewDist: 90,
    layers: { hypo: true },
  },

  {
    id: 'block-order',
    tone: 'blocks',
    title: 'Problem 3: nobody had permission to shoot',
    body: (c, i) => `
      Grant the guidance too. He still needs an order authorising him to destroy a passenger
      aircraft with forty people on board. No pilot does that on his own judgement.
      <p>Permission to shoot down civilian airliners was passed down at about 10:10 and reached
      the air-defence sector at <strong>10:31</strong> — the time on the clock now. That sector
      then never passed it on to its own pilots at all.</p>
      <p>The shot is supposed to have happened at <strong>09:58</strong>. That is
      <strong>33 minutes before</strong> the permission existed anywhere in the chain of
      command.</p>`,
    t: at(10, 31, 0),
    tab: 'critic',
    view: 'reset',
    layers: { hypo: true, critic: true },
  },

  {
    id: 'block-jacoby',
    tone: 'blocks',
    title: 'Problem 4: the easy version deletes the only witness',
    body: (c, i) => `
      This one is self-inflicted, and it is the most damaging.
      <p>The version we have been flying goes Fargo → intercept → Albany. It is
      ${Math.round(c.steel.totalMi).toLocaleString()} miles, comfortably within one load of
      fuel — and <strong>it never goes to Montana</strong>. That is the only reason it fits so
      easily.</p>
      <p>But Montana is where Ed Jacoby was standing. He was picked up, he got to Albany, and he
      has said so himself. He is the one first-hand witness to the whole day.</p>
      <p><strong>And here is where the fuel comes back.</strong> The Montana trip is what proved
      Gibney had the extra tanks. But it also proves where he went. Put Montana back into the
      route and the trip to the intercept grows from
      ${Math.round(c.boz.directMi).toLocaleString()} to
      <strong>${Math.round(c.boz.viaMi).toLocaleString()} miles</strong> in the same
      ${Math.round(c.boz.hours * 60)} minutes. That needs
      <strong>${c.boz.viaMach.toFixed(1)} times the speed of sound</strong> —
      <strong>${c.boz.overPlacard.toFixed(1)} times faster than his jet was allowed to go</strong>
      ${i('placard')}, and that is granting him zero seconds on the ground in Montana to land
      and collect a passenger.</p>
      <p>So the same fact does both jobs, in opposite directions. Use the Montana trip to prove
      he had the fuel, and you have also proved he went to Montana — which makes the interception
      impossible. <strong>The story needs the first and cannot survive the second.</strong></p>`,
    t: at(10, 20, 0),
    tab: 'claim',
    view: 'fit:KBZN,KFAR,KALB',
    layers: { hypo: true, routeDoc: true, places: true },
    highlight: '#concessions',
  },

  {
    id: 'scale',
    tone: 'blocks',
    title: 'And the shot itself needs a twenty-mile coincidence',
    body: (c, i) => `
      Every circle drawn on this map so far has been generous to the story. This one is not.
      <p>His missiles ${i('sidewinder')} only reach about
      <strong>${c.los.wezMi} miles</strong>, and they will not work closer than about half a
      mile either, so the area he could actually hit is a thin ring ${i('wez')}.</p>
      <p>Compare that with how far apart the two aircraft could be and still <em>see</em> each
      other: about <strong>${Math.round(c.los.losMi)} miles</strong> ${i('lineOfSight')}. That is
      <strong>${Math.round(c.los.ratio)} times bigger</strong>.</p>
      <p>Spotting the airliner was never the difficult part. Being inside a twenty-mile circle
      around one specific aircraft at one specific instant is — and nothing in the record puts
      him there, or anywhere else.</p>`,
    t: at(9, 58, 0),
    tab: 'claim',
    view: 'ua93',
    viewDist: 40,
    layers: { hypo: true, wez: true, envelope: true },
    highlight: '#wez-out',
  },

  {
    id: 'verdict',
    tone: 'verdict',
    title: 'The flying works. Nothing else does.',
    body: (c, i) => `
      <p>Give the story the best jet, the best fuel, the fastest possible takeoff and a perfect
      route, and the flight itself is achievable. That is worth saying plainly, because it is
      true and because most people arguing against this story get it wrong.</p>
      <p>What defeats it is everything that is not flying: that he would have to know about a
      hijacking 42 minutes before it happened, that nobody was tracking the aircraft to guide
      him, that permission to shoot did not exist for another half hour, and that the trip which
      proves he had the fuel also proves he was somewhere else.</p>
      <p>That is a more useful answer than "impossible". A claim beaten on arithmetic just
      invites better arithmetic. A claim beaten on knowledge, permission and an eyewitness has
      nowhere left to go.</p>
      <p class="tour-warn">${HYPO.callsign} has been taken off the map. It was never there.</p>`,
    t: at(9, 58, 0),
    tab: 'claim',
    view: 'reset',
    layers: { hypo: false, wez: false },
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
