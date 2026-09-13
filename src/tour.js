/* =============================================================================
   tour.js — a guided walk through the steelman argument.

   The steelman is the most demanding thing in this app to read cold. It grants
   ten things, and the whole point lives in the order: the concessions are free,
   the kinematics then survive, and only after that do four separate blockers
   land. Someone scrubbing a timeline at random will never assemble that order,
   and the argument collapses into "a fast jet could have got there", which is
   the opposite of what it says.

   The last two steps are the CRITIC. This app is named after DIRNSA CRITIC
   1-2001 and exists as a companion to a records request for its text. It
   belongs at the end rather than among the blockers, because it is not another
   objection. It is the document that would settle the question either way, it
   is dated to the minute, and it is withheld.

   Each step sets the clock, moves the camera and opens the panel that carries
   the evidence, so the claim is being watched while it is being explained.

   WRITTEN FOR SOMEONE WHO HAS NEVER READ AN NTSB REPORT

   Every step says it in plain words and puts the exact term behind an (i), so
   nothing is lost and nothing is in the way.

   Bodies are functions over a live context, so the tour cannot quote a figure
   the panel beside it disagrees with.

   Each step also carries `src` (a badge key) and `refs` (links.js REFS keys);
   main.js renders them at the foot of the tour body.

   `view` kinds:
     reset                  the whole country
     place:<KEY>            a named place from PLACES
     ua93                   United 93 at the current clock
     hypo                   STEELMAN at the current clock
     fit:<KEY>,<KEY>        frame several places at once
   ========================================================================== */

import { F16 } from './data.js';
import { AIM9 } from './reachability.js';
import { HYPO, CONCESSIONS, VERDICT, LOS_HORIZON, FOREKNOWLEDGE } from './steelman.js';

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

/* Local copies rather than imports from main.js, which would be a cycle. Small
   enough that duplicating them costs less than the coupling would. */
const esc0 = (x) => String(x).replace(/[&<>"]/g, (ch) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const hms0 = (t) => [t / 3600, (t % 3600) / 60, t % 60]
  .map((n) => String(Math.floor(n)).padStart(2, '0')).join(':');

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
      <p>It does so by building the strongest version of the claim, granting every benefit of
      the doubt at once, and then checking what is still wrong with it. That is called
      steelmanning ${i('steelman')}.</p>
      <p class="tour-warn"><strong>Nothing you are about to see on the map is real.</strong>
      The aircraft we draw, ${HYPO.callsign}, never existed. It is drawn in white dashes to show
      what the story would have needed, not to suggest any of it happened.</p>`,
    t: at(7, 59, 0),
    tab: 'claim',
    view: 'reset',
    layers: { hypo: false, envelope: false, wez: false },
    src: 'derived',
    refs: [],
  },

  {
    id: 'account',
    tone: 'setup',
    title: 'What the story actually says',
    body: (c, i) => `
      Rick Gibney was an Air National Guard ${i('ang')} pilot in North Dakota. On 11 September
      he flew a state official, Ed Jacoby Jr., from Montana to Albany, New York. Jacoby has
      described the flight. That part is not in dispute.
      <p>The accusation, made in 2004, is that in between he was scrambled ${i('scramble')}
      from Fargo, intercepted United 93 over Pennsylvania, and shot it down.</p>
      <p>The claim names Gibney, and Gibney was at Fargo, so the steelman starts there. The
      wing's other F-16s that morning were at Langley, and their morning is on the NEADS
      ${i('neads')} tapes.</p>
      <p>The map draws both versions of his day: the documented route and the alleged one.</p>`,
    t: at(8, 42, 0),
    tab: 'claim',
    view: 'reset',
    layers: { routeDoc: true, routeClaim: true, hypo: false },
    src: 'press',
    refs: ['GIBNEY', 'CLAIMANT', 'GIBNEY_UNIT'],
  },

  {
    id: 'grant-hardware',
    tone: 'grant',
    title: 'He had the fuel: the documented flight points to it',
    body: (c, i) => `
      A fighter carries little fuel on its own; for long trips it carries external tanks
      ${i('dropTanks')}. The documented part of Gibney's day includes Montana to Albany,
      ${Math.round(c.fuel.legBA).toLocaleString()} miles, refuelled in mid-air roughly over
      Fargo. That leaves Fargo to Albany, ${Math.round(c.fuel.legFA).toLocaleString()} miles,
      in one hop. Without tanks a jet like his runs out at roughly
      ${Math.round(c.fuel.twoSeatCleanMi).toLocaleString()} miles ${i('twoSeat')}. So if that
      was his only refuelling, he had the tanks. No record says it was.
      <p>He would also have had the missiles: short-range heat-seekers ${i('sidewinder')} on
      the wingtips, with the tanks underneath. Carrying both is normal.</p>
      <p>From here on every version of the story assumes a tanked jet.</p>
      <p>Tanks add drag. A tanked F-16 is limited to about
      ${F16.maxWithTanksMph.toLocaleString()} mph ${i('placard')}; the Mach 2 figure applies
      only to a clean jet. So the tanks also cap his speed at Mach 1.6 ${i('mach')}.</p>
      <p>An earlier version of this app drew a 340-mile combat-radius ring, the figure for a
      fighter carrying no tanks. That ring is gone: the documented leg, with one refuelling,
      needs the tanks.</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'place:KFAR',
    viewDist: 120,
    layers: { envelope: true, wez: false, hypo: false, routeDoc: false, routeClaim: true },
    highlight: '#reach-out',
    src: 'derived',
    refs: ['F16', 'GIBNEY'],
  },

  {
    id: 'grant-launch',
    tone: 'grant',
    title: 'He took off at the earliest possible moment',
    body: (c, i) => `
      The clock above reads 08:46:40. That is the moment the first aircraft hit the World
      Trade Center, the first instant anybody in the country had a reason to think something
      was wrong.
      <p>The story is given a takeoff at that exact second, with no time allowed for
      hesitation, briefing, engine start or taxiing to the runway.</p>
      <p>This is itself an assumption: no published record gives Gibney's takeoff time from Fargo. The
      app uses the time most favourable to the claim.</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'place:KFAR',
    viewDist: 90,
    layers: { envelope: true, hypo: false },
    src: 'derived',
    refs: ['COMMISSION'],
  },

  {
    id: 'grant-heading',
    tone: 'grant',
    title: 'He flew a flawless route',
    body: (c, i) => `
      A straight line from Fargo, on course, to the exact spot where United 93 will be over
      an hour later.
      <p>No redirection by air traffic control ${i('atc')}, no headwind, no weather, no time
      spent on the ground anywhere. A real problem is also set aside: to carry a passenger he
      needed the two-seat version of the jet ${i('twoSeat')}, which holds less fuel.</p>
      <p>That is every easy assumption granted at once. The white dashed line now on the map
      is that flight: the best case the story can have.</p>`,
    t: at(9, 20, 0),
    tab: 'claim',
    view: 'hypo',
    viewDist: 90,
    layers: { hypo: true, envelope: true },
    highlight: '#steel-out',
    src: 'derived',
    refs: ['F16'],
  },

  {
    id: 'survives',
    tone: 'survives',
    title: 'The jet could have got there',
    body: (c, i) => `
      To cover the distance in the time available he would need about
      ${Math.round(c.steel.mph).toLocaleString()} mph, roughly
      ${c.steel.mach.toFixed(1)} times the speed of sound ${i('mach')}. His jet was allowed up
      to about ${F16.maxWithTanksMph.toLocaleString()} mph with the tanks fitted
      ${i('placard')}. So it fits, within the placard limit; fuel burn at that speed is not
      modelled here.
      <p>Speed and fuel do not rule the story out, so the objection that the aircraft was too
      slow or too short-ranged does not hold.</p>`,
    t: at(9, 48, 0),
    tab: 'claim',
    view: 'hypo',
    viewDist: 70,
    layers: { hypo: true, envelope: true, wez: false },
    highlight: '#steel-out',
    src: 'derived',
    refs: ['F16'],
  },

  {
    id: 'block-knowledge',
    tone: 'blocks',
    title: 'Problem 1: he would have to know about the hijacking before it happened',
    body: (c, i) => `
      Look at the clock, and at United 93 on the map.
      <p>It is 08:46. United 93 left Newark four minutes ago and is climbing normally. Nothing
      has happened to it. It will not be hijacked for another 42 minutes.</p>
      <p>So to take off now, pointed at it, somebody has to already know that this particular
      flight is going to be hijacked at 09:28, and where it is going to be at 09:58, an hour
      and a quarter from now.</p>
      <p>That is foreknowledge of the hijacking, a much larger and different accusation than
      the one made.</p>
      <p class="tour-warn">${FOREKNOWLEDGE.caution}</p>`,
    t: at(8, 46, 40),
    tab: 'claim',
    view: 'ua93',
    viewDist: 60,
    layers: { hypo: true, UA93: true },
    highlight: '#fk-out',
    src: 'commission',
    refs: ['COMMISSION', 'NEADS'],
  },

  {
    id: 'block-tracking',
    tone: 'blocks',
    title: 'Problem 2: nobody could have guided him to it',
    body: (c, i) => `
      Grant the knowledge anyway. He still has to be steered onto an airliner crossing
      Pennsylvania at about 370 mph (the speed of its recorded track after 09:46), and a pilot
      cannot find that alone.
      <p>The civil side had the aircraft the whole time. Cleveland Center ${i('faa')} heard the
      hijacking live at 09:28 and never lost it, even after the transponder ${i('transponder')}
      went off. By 09:46 the FAA had worked out it was twenty-nine minutes from Washington.</p>
      <p>The military side, which could send a fighter, was not told. The air defence sector
      ${i('neads')} heard the words "United 93" for the first time at 10:07, the time on the
      clock now, four minutes after the aircraft crashed.</p>
      <p>In between, on recorded lines, the FAA discussed asking the military for help for
      twenty-five minutes, 09:28 to 09:53, and did not do it. 09:36: has anyone requested fighters? 09:49: "Do we want to think about, uh,
      scrambling aircraft?" "Oh, God, I don't know." 09:53: still discussing.</p>
      <p>The civil side of the government did know. Air traffic control ${i('atc')} cannot task
      or vector ${i('vector')} fighters; the organisation that can had no track and received no
      request; and on the documented account Gibney was on a transport tasking rather than the
      air defence net.</p>`,
    t: at(10, 7, 0),
    tab: 'aware',
    view: 'reset',
    layers: { hypo: true, aware: true },
    highlight: '#aware-body',
    src: 'commission',
    refs: ['COMMISSION', 'NEADS'],
  },

  {
    id: 'block-order',
    tone: 'blocks',
    title: 'Problem 3: nobody had permission to shoot',
    body: (c, i) => `
      Grant the guidance too. He still needs an order from the chain of command authorising him
      to destroy a passenger aircraft with forty people on board.
      <p>The claim needs him to have fired without any order. The earliest documented
      authorisation to engage civilian aircraft is about 10:10; it came down through NORAD
      ${i('norad')} and reached the sector ${i('neads')} at 10:31, the time on the clock now.
      The sector never passed it to its own pilots.</p>
      <p>The alleged shot is at 09:58. That is 33 minutes before the order reached the sector,
      and before the permission is documented anywhere in the chain of command.</p>`,
    t: at(10, 31, 0),
    tab: 'critic',
    view: 'reset',
    layers: { hypo: true, critic: true },
    src: 'commission',
    refs: ['COMMISSION'],
  },

  {
    id: 'block-jacoby',
    tone: 'blocks',
    title: 'Problem 4: the shortest route leaves out the only witness',
    body: (c, i) => `
      The version flown so far goes Fargo → intercept → Albany. It is
      ${Math.round(c.steel.totalMi).toLocaleString()} miles, within one load of fuel, and it
      does not go to Montana. That is why it fits.
      <p>Jacoby was in Bozeman. He was picked up, reached Albany, and has said so. He is the one
      first-hand witness to Gibney's flight that day.</p>
      <p>The documented flight began at Fargo and went west to Montana, and the tanks are
      inferred from its eastbound leg, which was refuelled in the air roughly over Fargo. Put
      Montana back and the trip to the intercept grows from ${Math.round(c.boz.directMi).toLocaleString()} to
      ${Math.round(c.boz.viaMi).toLocaleString()} miles in the same
      ${Math.round(c.boz.hours * 60)} minutes. That needs
      ${c.boz.viaMach.toFixed(1)} times the speed of sound ${i('mach')},
      ${c.boz.overPlacard.toFixed(1)} times faster than his jet was allowed to go
      ${i('placard')}, and that grants zero seconds on the ground in Montana to land and
      collect a passenger.</p>`,
    t: at(10, 20, 0),
    tab: 'claim',
    view: 'fit:KBZN,KFAR,KALB',
    layers: { hypo: true, routeDoc: true, places: true },
    highlight: '#concessions',
    src: 'press',
    refs: ['GIBNEY'],
  },

  {
    id: 'scale',
    tone: 'blocks',
    title: 'The shot requires being inside a twenty-mile ring',
    body: (c, i) => `
      This ring is set by the missile's range rather than by how far the aircraft could travel.
      <p>His missiles ${i('sidewinder')} reach about ${c.los.wezMi} miles, and will not work
      closer than about half a mile, so the area he could hit is a thin ring ${i('wez')}.</p>
      <p>Compare that with how far apart the two aircraft could be and still see each other:
      about ${Math.round(c.los.losMi)} miles ${i('lineOfSight')}, or
      ${Math.round(c.los.ratio)} times bigger.</p>
      <p>Line of sight is the wider constraint. The missile requires being within about
      ${AIM9.rMaxMi} miles of the airliner at one instant, and no record places him there, or
      anywhere else, at that time.</p>`,
    t: at(9, 58, 0),
    tab: 'claim',
    view: 'ua93',
    viewDist: 40,
    layers: { hypo: true, wez: true, envelope: true },
    highlight: '#wez-out',
    src: 'press',
    refs: ['AIM9'],
  },

  {
    id: 'critic-live',
    tone: 'blocks',
    title: 'The government was writing it down at the time',
    body: (c, i) => `
      This app is named after what is on screen now. A CRITIC ${i('critic')} is the most
      urgent message the US intelligence system has, meant to be in front of the President
      within ten minutes. Four went out that morning.
      <p>They are contemporaneous: the government's own record, at the time, of what it
      believed was happening. Two were sent before the alleged shot and two after.</p>
      ${c.critic.slice(0, 2).map((k) => `
      <div class="tour-crit">
        <b>${esc0(k.c.mapLabel)}</b> &middot; ${hms0(k.c.t).slice(0, 5)}<br>
        ${k.sepMi === null ? 'Not yet airborne.' : `
        ${HYPO.callsign} would be ${Math.round(k.sepMi)} miles from United 93,
        ${k.outsideBy.toFixed(1)}× further than its missile can reach, with
        ${Math.round(k.minsToShot)} minutes left to close.`}
      </div>`).join('')}
      <p>At both of these moments the best-case shooter is still tens of miles from United 93
      and has not fired. That is not impossible; he is closing fast. The last stretch of the run
      coincides with two timestamped messages in the national warning channel.</p>`,
    t: at(9, 52, 0),
    tab: 'critic',
    view: 'hypo',
    viewDist: 95,
    layers: { hypo: true, critic: true, UA93: true, wez: true },
    src: 'foia',
    refs: ['KARA_CRITIC', 'MUCKROCK', 'MANEKI'],
  },

  {
    id: 'critic-silence',
    tone: 'blocks',
    title: 'Two more messages follow. Their contents are withheld.',
    body: (c, i) => `
      United 93 is on the ground. A US fighter destroying a US airliner is the kind of
      information the CRITIC ${i('critic')} channel exists to carry.
      <p>Two more messages go out on it.</p>
      ${c.critic.slice(2).map((k) => `
      <div class="tour-crit">
        <b>${esc0(k.c.mapLabel)}</b> &middot; ${hms0(k.c.t).slice(0, 5)}<br>
        United 93 has been down ${Math.round(k.minsAfterImpact)} minutes.
        ${k.landed
          ? `${HYPO.callsign} has already landed at Albany.`
          : `${HYPO.callsign} is over Pennsylvania on its way to Albany.`}
      </div>`).join('')}
      <p>Their contents are withheld, so this app cannot say whether they mention a shootdown.
      A summary written two days later, where any correction to the record would go, is
      withheld along with them.</p>
      <p>What is known: the documents exist, they are dated to the minute, they would settle
      the question either way, and NSA has withheld them. That is what the records request
      ${i('foia')} behind this app asks for.</p>`,
    t: at(10, 48, 0),
    tab: 'critic',
    view: 'reset',
    layers: { hypo: true, critic: true },
    highlight: '#critic-body',
    src: 'foia',
    refs: ['KARA_CRITIC', 'MUCKROCK', 'MANEKI', 'NSA'],
  },

  {
    id: 'verdict',
    tone: 'verdict',
    title: 'The flight was feasible. The knowledge, guidance, order and witness it needs are not documented.',
    body: (c, i) => `
      <p>Give the story the best jet, the best fuel, the fastest possible takeoff and a perfect
      route, and the flight itself is achievable.</p>
      <p>The remaining problems are not about flying: he would have to know about the
      hijacking 42 minutes before it happened; the military was not tracking the airliner, so
      nobody in a position to guide him could; shootdown authority did not reach the sector
      until 10:31; and his documented flight that day began at Fargo and went west to Montana,
      with his fuel tanks inferred from its eastbound leg, which was refuelled in the air
      roughly over Fargo.</p>
      <p>The result does not depend on speed or fuel figures that could be revised. It depends
      on the time of the hijacking, the absence of any order, and an eyewitness.</p>
      <p class="tour-warn">${HYPO.callsign} has been removed from the map. It was a construct;
      no such aircraft flew.</p>`,
    t: at(9, 58, 0),
    tab: 'claim',
    view: 'reset',
    layers: { hypo: false, wez: false },
    last: true,
    src: 'derived',
    refs: [],
  },
];

/* The chapter strip: one dot per step, grouped by tone, so the shape of the
   argument (grant, grant, grant, survive, block, block, block) is visible up
   front. */
export function tourChapters() {
  const out = [];
  for (const s of TOUR_STEPS) {
    const prev = out[out.length - 1];
    if (prev && prev.tone === s.tone) prev.count += 1;
    else out.push({ tone: s.tone, count: 1, label: TONES[s.tone].label });
  }
  return out;
}
