/* =============================================================================
   reachability.js — where could he have been, and what could he have shot?

   Two geometries, and they are worth reading against each other.

   THE ENVELOPE. Gibney's day has documented PLACES — Fargo, Bozeman, Albany —
   and essentially no documented TIMES. So for almost the whole morning there
   is no evidence putting him at any particular point, and the honest way to
   draw that is not a line but a disc: the set of points an F-16 could reach
   from its last anchor in the time elapsed.

   THE WEZ. A weapon engagement zone is the region from which a missile can
   actually reach a target. For an AIM-9 that is about ten miles.

   Put those side by side and the claim's real difficulty appears. The envelope
   is a thousand miles across. The WEZ is twenty. Being somewhere inside a
   continent-sized disc is not the question; the question is whether he was
   inside a twenty-mile circle around one airliner at one instant.

   A NOTE ON WHAT AN ENVELOPE IS NOT. A reachability disc is a statement about
   circles, not about people. Every point inside one is equally unevidenced,
   and on that morning the envelope of nearly every fighter in the eastern half
   of the country would have swept over Somerset County at some point. Drawing
   one proves nothing about where anybody was. It exists here to show the size
   of the gap in the record — and, once the fuel ring is on, to show that the
   gap is far smaller than it first looks.
   ========================================================================== */

import { destinationPoint, haversineMi } from './geo.js';
import { PLACES, F16 } from './data.js';

/* Speed bands, slowest first. Each is a real point on the F-16's envelope
   rather than a round number picked for convenience. */
export const BANDS = [
  { key: 'cruise', label: 'Cruise', mph: F16.cruiseMph, color: 0x35d6a4,
    note: 'What a fighter actually transits at. Anything faster is bought with fuel.' },
  { key: 'sustained', label: 'Max, low altitude', mph: F16.maxSeaLevelMph, color: 0xffd447,
    note: 'About Mach 1.2 down low. Sustainable for minutes, not hours.' },
  { key: 'dash', label: 'Max, high altitude', mph: F16.maxAltitudeMph, color: 0xff8a5c,
    note: 'Mach 2.0 clean. A dash number, and unavailable with the external tanks a transcontinental sortie requires.' },
];

/* The fuel ring does not grow with the clock. That is the point of it. */
export const FUEL_RING = {
  key: 'fuel',
  label: 'Unrefuelled combat radius',
  miles: F16.combatRadiusMi,
  color: 0xff5964,
  note: 'Fixed at roughly 340 miles regardless of how long you wait. Time buys distance; fuel does not.',
};

/* --- ring geometry --------------------------------------------------------
   A constant-distance ring on a sphere is not a circle on the projected map,
   so it is generated in lat/lon and projected point by point. */

export function ringPoints(center, radiusMi, n = 120) {
  const out = [];
  for (let i = 0; i <= n; i++) out.push(destinationPoint(center, (i / n) * 360, radiusMi));
  return out;
}

export const reachMi = (mph, seconds) => Math.max(0, mph * (seconds / 3600));

/* =============================================================================
   Departure-time tolerance, and why the rings have thickness

   A single ring asserts a departure time to the minute. No departure time for
   Gibney has ever been published — repeated searching turns up the route and
   the tasking and no clock — so a hairline ring is false precision, and the
   band is the honest shape.

   There are, however, real bounds, and they beat an arbitrary tolerance:

   FIRST KNOWLEDGE, 08:46:40. The first impact. Before this nobody in Fargo
   has a reason to launch anything, so a departure earlier than this requires
   foreknowledge rather than tasking. This is the hard outer limit on how far
   he can possibly have got by any given moment.

   GROUND STOP, 09:25-09:26. The FAA halts all departures nationally.

   SCATANA, 09:45. Every airborne aircraft is ordered down. This is the bound
   that matters for the documented mission: Jacoby was at the National
   Emergency Management Association conference in Montana, and the reason a
   fighter had to fetch him is that civil aviation no longer existed. Before
   the ground stop he could simply have flown home.
   ========================================================================== */

const at = (h, m, sec = 0) => h * 3600 + m * 60 + sec;

export const DEPARTURE_BOUNDS = {
  firstKnowledge: {
    t: at(8, 46, 40),
    label: 'First knowledge',
    why: 'The first impact. Earlier than this, a launch needs foreknowledge, not orders.',
    src: 'commission',
  },
  groundStop: {
    t: at(9, 26, 0),
    label: 'National ground stop',
    why: 'The FAA halts all departures. A fighter starts to be the only way to move anyone.',
    src: 'commission',
  },
  scatana: {
    t: at(9, 45, 0),
    label: 'SCATANA',
    why: 'All airborne aircraft ordered down. This is when the documented tasking — fetch a man civil aviation can no longer move — actually exists.',
    src: 'commission',
  },
  documented: {
    t: null,
    label: 'Departure time',
    why: 'Never published. The route and the tasking are on the record; the clock is not.',
    src: 'derived',
  },
};

export const TOLERANCES = [
  { key: 'none', label: 'exact', minutes: 0,
    note: 'A hairline ring, which asserts a departure time nobody has published.' },
  { key: 't5', label: '±5 min', minutes: 5, note: 'Tight.' },
  { key: 't10', label: '±10 min', minutes: 10,
    note: 'A reasonable allowance for scramble, taxi, and climb-out on an unrecorded launch.' },
  { key: 't20', label: '±20 min', minutes: 20, note: 'Loose.' },
];

/* Inner and outer radius of a band at time `now`, for a departure hypothesis
   of `dep` give or take `minutes`. Leaving earlier means flying further, so
   the earlier bound gives the OUTER edge. */
export function bandRadii(mph, now, dep, minutes) {
  const early = dep - minutes * 60;
  const late = dep + minutes * 60;
  return {
    outer: reachMi(mph, now - early),
    inner: reachMi(mph, now - late),
  };
}

/* The hard limit, regardless of hypothesis: he cannot have left before there
   was anything to leave for. */
export function evidenceCeilingMi(mph, now) {
  return reachMi(mph, now - DEPARTURE_BOUNDS.firstKnowledge.t);
}

/* Beyond this the ring wraps into nonsense under a conic projection, and an
   F-16 is out of fuel several times over anyway. */
export const MAX_DRAW_MI = 2600;

/* --- the Shanksville test -------------------------------------------------
   For a given departure from Fargo, when does Somerset County first fall
   inside each band — and does it ever fall inside the fuel ring? */

export function shanksvilleTest(departEDT) {
  const miles = haversineMi(PLACES.KFAR, PLACES.SHKV);
  return {
    miles,
    bands: BANDS.map((b) => ({
      ...b,
      entersAt: departEDT + (miles / b.mph) * 3600,
      minutes: (miles / b.mph) * 60,
    })),
    fuel: {
      reachable: miles <= FUEL_RING.miles,
      radii: miles / FUEL_RING.miles,
    },
  };
}

/* =============================================================================
   Weapon engagement zone
   ========================================================================== */

export const AIM9 = {
  designation: 'AIM-9M Sidewinder',
  inService: 'The variant in US service in 2001.',
  seeker: 'All-aspect infrared — homes on engine exhaust and airframe heat.',
  speed: 'Mach 2.5',
  warhead: 'Annular blast-fragmentation, roughly 20 lb.',
  rMinMi: 0.6,
  rMaxMi: 11.2,        // ~10 nm, the figure usually quoted
  rMaxOptimisticMi: 18, // upper bound seen in some published ranges
  src: 'press',
  notes: [
    { text: 'It is a within-visual-range weapon. The whole engagement is a knife fight by the standards of modern air combat — you must be close enough to see what you are shooting.', src: 'press' },
    { text: 'Published maxima are best-case: co-altitude, favourable aspect, high and thin air. Kinematic range falls off sharply at low altitude, where drag is worst.', src: 'press' },
    { text: 'That matters here. The flight data recorder puts United 93 at about 5,000 ft at 09:58 — the bottom of its descent, the worst altitude band for a Sidewinder, and nowhere near the conditions the published figures assume.', src: 'derived' },
    { text: 'Minimum range is real too. Inside roughly half a mile the missile has not armed and settled, so the zone is an annulus rather than a disc.', src: 'press' },
  ],
};

/* The inverse question, and the sharper one. Instead of asking where Gibney
   could have been, ask where he MUST have been: inside this annulus around
   United 93 at the moment of the alleged shot. */
export function engagementAnnulus(targetLatLon) {
  return {
    outer: ringPoints(targetLatLon, AIM9.rMaxMi, 72),
    inner: ringPoints(targetLatLon, AIM9.rMinMi, 48),
    rMax: AIM9.rMaxMi,
    rMin: AIM9.rMinMi,
  };
}

/* The ratio that carries the argument. */
export function scaleComparison(departEDT, nowEDT) {
  const envelopeMi = reachMi(F16.maxSeaLevelMph, Math.max(0, nowEDT - departEDT));
  return {
    envelopeDiameterMi: envelopeMi * 2,
    wezDiameterMi: AIM9.rMaxMi * 2,
    ratio: envelopeMi > 0 ? (envelopeMi / AIM9.rMaxMi) : 0,
    areaRatio: envelopeMi > 0 ? Math.pow(envelopeMi / AIM9.rMaxMi, 2) : 0,
  };
}
