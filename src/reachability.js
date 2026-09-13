/* =============================================================================
   reachability.js — where could he have been, and what could he have shot?

   Two geometries, read against each other.

   THE ENVELOPE. Gibney's day has documented PLACES — Fargo, Bozeman, Albany —
   and essentially no documented TIMES. So for almost the whole morning there
   is no evidence putting him at any particular point, and the accurate way to
   draw that is a disc rather than a line: the set of points an F-16 could reach
   from its last anchor in the time elapsed.

   THE WEZ. A weapon engagement zone is the region from which a missile can
   actually reach a target. For an AIM-9 that is about ten miles.

   Put those side by side and the claim's real difficulty appears. The envelope
   is a thousand miles across. The WEZ is twenty. The question is not whether he
   was somewhere inside a continent-sized disc but whether he was inside a
   twenty-mile circle around one airliner at one instant.

   A NOTE ON WHAT AN ENVELOPE IS NOT. A reachability disc is a statement about
   circles. Every point inside one is equally unevidenced, and on that morning
   the envelope of nearly every fighter in the eastern half of the country would
   have swept over Somerset County at some point. Drawing one proves nothing
   about where anybody was. It exists here to show the size of the gap in the
   record, and, once the fuel ring is on, to show that the gap is smaller than
   it first looks.

   PROVENANCE OF THE PERFORMANCE FIGURES

   The F-16 and AIM-9 numbers this file draws with come from data.js. Each one
   is labelled here as CITED (with the document), DERIVED (computed by this
   app) or REPORTED (attested only by a source that could not be retrieved).
   The `provenance` fields below carry those labels, and the visible notes
   repeat them where the status affects how the figure should be read.
   ========================================================================== */

import { destinationPoint, haversineMi } from './geo.js';
import { PLACES, F16 } from './data.js';

/* Speed bands, slowest first. Each is a point on the F-16's envelope rather
   than a round number picked for convenience. */
export const BANDS = [
  { key: 'cruise', label: 'Cruise', mph: F16.cruiseMph, color: 0x35d6a4,
    provenance: 'DERIVED. 577 mph is an estimate. No official or secondary source gives it; the nearest published figure is 504 kt (580 mph), itself uncited where it appears, and the USAF fact sheet gives no cruise speed. Used only for the egress leg to Albany, so nothing in the verdict turns on it.',
    note: 'What a fighter transits at. Faster speeds burn more fuel. This figure is an estimate rather than a published one.' },
  { key: 'sustained', label: 'Fastest at low altitude', mph: F16.maxSeaLevelMph, color: 0xffd447,
    provenance: 'CITED. 915 mph, Mach 1.2 at sea level (Aerospaceweb F-16 specifications). Corroborated by the Wikipedia spec block citing Frawley, which gives Mach 1.2, 800 kn, or 921 mph.',
    note: 'About Mach 1.2 down low. Sustainable for minutes, not hours.' },
  { key: 'dash', label: 'Fastest with tanks', mph: F16.maxWithTanksMph, color: 0xff8a5c,
    provenance: 'REPORTED, primary document not obtained. The 600 KIAS / Mach 1.6 placard for two 370-gallon wing tanks, a 300-gallon centreline tank and wingtip AIM-9s is attested only by a forum post quoting a personal F-16 Block 40 flight manual, a page that could not be retrieved. The primary stores-limitations manual (T.O. 1F-16C-1-3 / 1F-16C-1-4, figure 5-11) was not obtained. What is cited is the mechanism: T.O. 1F-16A-1 states the basic maximum, then refers stores-related reductions out to that supplement, and uses the same "whichever is lower" construction elsewhere. Tanks cost speed is established; Mach 1.6 specifically is not. This is the most load-bearing number in the app.',
    note: 'About Mach 1.6, the reported placarded limit with two wing tanks, a centreline tank and wingtip Sidewinders. The flight manual establishes that external stores reduce the limit; the specific figure comes from a source that could not be retrieved.' },
  { key: 'clean', label: 'Clean jet (not available to this claim)', mph: F16.maxAltitudeMph, color: 0xffffff,
    unavailable: true,
    provenance: 'DERIVED. 1,320 mph is this app\'s arithmetic, Mach 2.0 times the speed of sound at 40,000 ft. The USAF fact sheet gives 1,500 mph (Mach 2 at altitude), 180 mph higher. The band is ruled out for this claim either way, so the higher official figure changes nothing in the verdict.',
    note: 'Mach 2.0 at altitude, drawn only so the ceiling is visible. The 1,320 mph figure is computed here; the USAF fact sheet gives 1,500 mph. It is not available to this claim: Mach 2.0 is a clean figure, clean means no external tanks, and the tanks are inferred from the Montana-to-Albany leg: even with the reported refuelling over Fargo, its Fargo-to-Albany piece of 1,159 miles is beyond a clean two-seat F-16. An aircraft that flew that leg on one refuelling was carrying them, so its ceiling is the placarded Mach 1.6 above.' },
];

/* The trade the two fastest bands describe, stated once rather than left in a
   tooltip. */
export const CONFIG_TRADE = {
  title: 'The configuration is inferred, and it sets the top speed',
  clean: {
    label: 'Clean: ruled out',
    topMph: F16.maxAltitudeMph,
    radiusMi: F16.combatRadiusMi,
    note: 'Mach 2.0 available, but no external fuel, and the documented Montana-to-Albany leg, refuelled once over Fargo as reported, cannot be flown without external fuel. This configuration is not open to the claim.',
    provenance: 'Top speed: DERIVED (see the clean band above; the fact sheet gives 1,500 mph). Radius: the 340-mile figure is 295 nmi from the F-16C Block 50/52 spec block, where it is a hi-lo-hi mission carrying four 1,000 lb bombs, not a clean airframe. The app labels it "unrefuelled, no external tanks", which is wrong. The USAF fact sheet separately gives more than 500 miles for the air-to-surface radius. The figure is not drawn anywhere.',
  },
  tanked: {
    label: 'With tanks: what he had',
    topMph: F16.maxWithTanksMph,
    radiusMi: F16.combatRadiusTanksMi,
    note: 'Ferry range near 2,450 miles, so the distance is easy. Reported placard of Mach 1.6, which is therefore the ceiling used for every version of this claim.',
    provenance: 'Top speed: REPORTED, primary document not obtained (see the dash band above). Ferry range: the app\'s 2,450 miles is not sourced to a retrievable document; the USAF fact sheet gives 2,002 miles ferry range, 448 lower. Radius: 578 miles is DERIVED, being 340 x 1.7, the app\'s own arithmetic. A published figure exists for this exact fit — two 370-gallon tanks, one 300-gallon tank, two AIM-9 and two AIM-120 — and it is 865 nmi, or 995 statute miles. The app\'s number understates the airframe by about 40%, which makes the flying harder for the claim than the sources do.',
  },
  reading: 'Nobody observed the aircraft\'s configuration directly, but the Montana leg points to it: if the refuelling reported over Fargo was his only one, he was carrying tanks [[dropTanks]], so he had the range and did not have Mach 2.0 [[mach]]. The reported tanked placard [[placard]], Mach 1.6, is the ceiling used for every version of the claim. The flight manual establishes that external stores reduce the airspeed limit; the Mach 1.6 value itself comes from a source that could not be retrieved, so it is carried here as reported rather than cited.',
  src: 'derived',
  refs: ['F16'],
};

/* The fuel limits that actually apply.

   The 340-mile combat-radius ring used to be drawn here and is gone, for two
   reasons.

   It was the wrong yardstick. A combat radius is out, fight, and back; the
   claim needs a one-way transit with no fight. An earlier version of this app
   drew only that ring and said Somerset County "never enters it, however long
   you wait", which was true of the ring and misleading about the claim. That
   error is logged in the discrepancy register.

   And it describes an aircraft this one very likely was not. Combat radius
   with no tanks presumes no tanks; the Montana-to-Albany leg, with its one
   reported refuelling over Fargo, implies the tanks were fitted. Drawing a
   limit for a configuration the record makes unlikely is an
   error that flatters the argument. The 340-mile figure is also mislabelled at
   source: it is a strike profile carrying four 1,000 lb bombs.

   What remains does not grow with time. Time buys distance; fuel does not. */
export const FERRY_RING = {
  key: 'ferry',
  label: 'Ferry range with tanks, one way',
  miles: F16.ferryRangeMi,
  color: 0xff8a5c,
  provenance: 'The 2,450-mile figure is not sourced to a retrievable document. The USAF fact sheet gives more than 2,002 miles ferry range (1,740 nautical miles). Somerset County, 1,012 miles from Fargo, is well inside either ring.',
  note: 'One way, maximum external fuel, no combat allowance and no reserve. Somerset County sits well inside this, which is why fuel does not rule out the Pennsylvania leg on its own. The 2,450-mile figure is the app\'s; the USAF fact sheet gives 2,002.',
};

/* Half of ferry range is the more useful number of the two, because it is the
   furthest point you can reach and still come back on the same tanks. */
export const HALF_FERRY_RING = {
  key: 'halfferry',
  label: 'Ferry half-radius: furthest point he could still return from',
  miles: Math.round(F16.ferryRangeMi / 2),
  color: 0xffbe4d,
  provenance: 'DERIVED, half of the ferry figure above. On the USAF fact sheet\'s 2,002-mile ferry range the half-radius is 1,001 miles and Somerset County, at 1,012 miles from Fargo, falls just outside it rather than at 83% of it. The one-way reach is inside either figure; only the round trip is sensitive to which ferry number is used.',
  note: 'Out and back on one tankful, with nothing spent on combat and no reserve. Somerset County is inside this too, at about 83% of it, so even the round trip is not excluded by fuel alone. On the USAF fact sheet\'s lower ferry figure the half-radius is 1,001 miles and Somerset County sits just outside it.',
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

   A single ring asserts a departure time to the minute. No departure time from
   Fargo has ever been published — repeated searching turns up the route and
   the tasking and no clock, so a hairline ring is false precision, and the
   band is the accurate shape.

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
    why: 'The FAA halts all departures. From this point civil aviation cannot move anyone who is not already airborne.',
    src: 'commission',
  },
  scatana: {
    t: at(9, 45, 0),
    label: 'SCATANA',
    why: 'All airborne aircraft ordered down. From this point civil aviation cannot move Ed Jacoby, and the documented tasking to fly him applies.',
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
      reachable: miles <= HALF_FERRY_RING.miles,
      halfFerryFraction: miles / HALF_FERRY_RING.miles,
      ferryFraction: miles / FERRY_RING.miles,
      insideFerry: miles <= FERRY_RING.miles,
    },
  };
}

/* =============================================================================
   Weapon engagement zone
   ========================================================================== */

export const AIM9 = {
  designation: 'AIM-9M Sidewinder',
  inService: 'The variant in US service in 2001.',
  seeker: 'All-aspect infrared; homes on engine exhaust and airframe heat.',
  speed: 'Mach 2.5',
  warhead: 'Annular blast-fragmentation, roughly 20 lb.',
  rMinMi: 0.6,
  rMaxMi: 11.2,        // ~10 nm, the figure usually quoted
  rMaxOptimisticMi: 18, // upper bound seen in some published ranges
  src: 'press',
  refs: ['AIM9'],
  /* Status of each figure above. Nothing in this file computes with the
     seeker, the speed or the warhead; the two range figures set the annulus. */
  provenance: {
    seeker: 'CITED. The AIM-9M is an improved AIM-9L and inherits the L model\'s all-aspect capability.',
    speed: 'CITED, with a caveat. Specification tables give Mach 2.5+; the Air Force Association\'s weapons index gives Mach 2+ for the family. No computation here uses missile speed.',
    warhead: 'CITED. WDU-17/B annular blast-fragmentation, 9.4 kg (20.8 lb), per Parsch\'s Directory of U.S. Military Rockets and Missiles. The Air Force Association index gives the same warhead type.',
    rMaxMi: 'CITED, conservative end of a wide spread. 11.2 statute miles is 18 km, the figure published for the AIM-9L from which the M derives; the Air Force Association index gives 10+ miles. The same specification table shows 40+ km with a question mark, flagged as uncertain, so the low figure is used.',
    rMaxOptimisticMi: 'REPORTED. The 18-mile upper bound comes from the US Navy AIM-9M fact file, which could not be retrieved directly; it reached this app through search summaries only.',
    rMinMi: 'WEAKLY CITED. 0.6 miles comes from a whole-family reference table spanning every variant through the AIM-9X, not from an AIM-9M placard, and no primary statement of an AIM-9M minimum launch range was located. It sets only the inner edge of the annulus.',
  },
  notes: [
    { text: 'It is a within-visual-range weapon: the shooter must be close enough to see the target. The range figures used here (about 0.6 to 11 miles) are the published AIM-9M figures; see the AIM-9 references.', src: 'press' },
    { text: 'Published maxima are best-case: co-altitude, favourable aspect, high and thin air. Kinematic range falls off sharply at low altitude, where drag is worst. This is standard physics rather than a sourced AIM-9M figure; no citable statement of the degradation was found.', src: 'derived' },
    { text: 'That matters here. The flight data recorder puts United 93 at about 5,000 ft at 09:58, the bottom of its descent, the worst altitude band for a Sidewinder, and nowhere near the conditions the published figures assume.', src: 'derived' },
    { text: 'Minimum range is real too. Inside roughly half a mile the missile has not armed and settled, so the zone is an annulus rather than a disc. The 0.6-mile figure is the published whole-family minimum, not an AIM-9M-specific placard.', src: 'press' },
  ],
};

/* The inverse question: instead of asking where Gibney could have been, ask
   where he must have been — inside this annulus around United 93 at the moment
   of the alleged shot. */
export function engagementAnnulus(targetLatLon) {
  return {
    outer: ringPoints(targetLatLon, AIM9.rMaxMi, 72),
    inner: ringPoints(targetLatLon, AIM9.rMinMi, 48),
    rMax: AIM9.rMaxMi,
    rMin: AIM9.rMinMi,
  };
}

/* The ratio between the two geometries. */
export function scaleComparison(departEDT, nowEDT) {
  const envelopeMi = reachMi(F16.maxSeaLevelMph, Math.max(0, nowEDT - departEDT));
  return {
    envelopeDiameterMi: envelopeMi * 2,
    wezDiameterMi: AIM9.rMaxMi * 2,
    ratio: envelopeMi > 0 ? (envelopeMi / AIM9.rMaxMi) : 0,
    areaRatio: envelopeMi > 0 ? Math.pow(envelopeMi / AIM9.rMaxMi, 2) : 0,
  };
}
