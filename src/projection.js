/* projection.js — Albers USA, hand-rolled.

   A single conic projection cannot show the whole country: centre it on the
   lower 48 and Alaska smears across the Pacific. The standard answer, and
   the one used here, is a composite — three Albers conic equal-area
   projections, with Alaska and Hawaii scaled and tucked into the southwest
   corner. Dispatch is per STATE rather than per point, using FIPS ids, which
   avoids the usual mess of testing whether a coordinate falls in an inset box.

   Output is in map units on the XZ plane: +X east, -Z north, Y reserved for
   altitude. One map unit is roughly one degree of longitude at the centre. */

const D2R = Math.PI / 180;

function conicEqualArea({ parallels, rotateLon, centerLon, centerLat, scale }) {
  const [p0, p1] = parallels.map((d) => d * D2R);
  const sp0 = Math.sin(p0);
  const n = Math.abs(p0 - p1) < 1e-9 ? sp0 : (sp0 + Math.sin(p1)) / 2;
  const C = Math.cos(p0) ** 2 + 2 * n * sp0;

  // Takes an ALREADY-ROTATED longitude, because the centre is specified in
  // post-rotation coordinates and must not have the rotation applied twice.
  const raw = (lamDeg, lat) => {
    const lam = lamDeg * D2R;
    const phi = lat * D2R;
    const inner = C - 2 * n * Math.sin(phi);
    const rho = Math.sqrt(Math.max(inner, 0)) / n;
    const theta = n * lam;
    return [rho * Math.sin(theta), -rho * Math.cos(theta)];
  };

  const [cx, cy] = raw(centerLon, centerLat);

  return (lon, lat) => {
    const [x, y] = raw(lon + rotateLon, lat);
    return [(x - cx) * scale, -(y - cy) * scale];   // [mapX, mapZ], -Z = north
  };
}

const K = 180; // overall map scale

const lower48 = conicEqualArea({
  parallels: [29.5, 45.5], rotateLon: 96, centerLon: -0.6, centerLat: 38.7, scale: K,
});
const alaskaRaw = conicEqualArea({
  parallels: [55, 65], rotateLon: 154, centerLon: -2, centerLat: 58.5, scale: K * 0.35,
});
const hawaiiRaw = conicEqualArea({
  parallels: [8, 18], rotateLon: 157, centerLon: -3, centerLat: 20.9, scale: K,
});
const prRaw = conicEqualArea({
  parallels: [8, 18], rotateLon: 66, centerLon: 0, centerLat: 18.1, scale: K * 1.5,
});

// Inset placements, in map units, relative to the lower-48 frame.
const INSET = {
  '02': { p: alaskaRaw, dx: -78, dz: 38 },   // Alaska
  '15': { p: hawaiiRaw, dx: -48, dz: 40 },   // Hawaii
  '72': { p: prRaw,     dx: 58,  dz: 44 },   // Puerto Rico
  '78': { p: prRaw,     dx: 58,  dz: 44 },   // US Virgin Islands
};

/* Territories in the Pacific are far outside any sensible frame and no
   aircraft in this story goes near them, so they are dropped rather than
   drawn in a misleading place. */
export const OMITTED_FIPS = new Set(['60', '66', '69']);

export function projectForState(fips) {
  const ins = INSET[fips];
  if (!ins) return lower48;
  return (lon, lat) => {
    const [x, z] = ins.p(lon, lat);
    return [x + ins.dx, z + ins.dz];
  };
}

/* Flights, airports and debris all live in the lower 48. */
export function project(lon, lat) {
  return lower48(lon, lat);
}

export function projectLL({ lat, lon }) {
  return lower48(lon, lat);
}

/* Map units per statute mile, measured off the projection itself rather than
   guessed, by projecting two points a known distance apart near the centre. */
function measureUnitsPerMile() {
  const a = lower48(-96, 39), b = lower48(-95, 39);
  const mi = 69.172 * Math.cos(39 * D2R);       // one degree of longitude at 39N
  return Math.hypot(b[0] - a[0], b[1] - a[1]) / mi;
}
export const UNITS_PER_MILE = measureUnitsPerMile();

/* Vertical scale.

   This defaults to 1 — true scale, the same units vertically as horizontally.
   A 35,000 ft cruise is 6.6 miles above a country 2,800 miles across, so at
   true scale the tracks sit nearly flat. That is not a rendering failure; it
   is what the geometry actually looks like, and an app that argues from
   distances should not quietly inflate one axis by a factor of 28 to make a
   nicer picture.

   2x and 5x are available because altitude STRUCTURE — United 93's climb to
   41,000 and its dive to 5,000, the difference between a cruise and a descent
   — is genuinely hard to read at 1. Those are working views, and the legend
   names the factor whenever it is not 1.

   Live binding: importers see changes made through setAltExaggeration, and
   altToY reads the current value at call time. */
export let ALT_EXAGGERATION = 1;
export const ALT_CHOICES = [1, 2, 5];
export function setAltExaggeration(k) {
  ALT_EXAGGERATION = ALT_CHOICES.includes(k) ? k : 1;
  return ALT_EXAGGERATION;
}
export const altToY = (ft) => (ft / 5280) * UNITS_PER_MILE * ALT_EXAGGERATION;

/* For the legend: how flat "flat" really is. */
export const trueScaleRatio = (ft = 35000) => (2800 * 5280) / ft;
