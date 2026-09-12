/* geo.js — spherical geometry helpers. Everything in statute miles. */

const R_MI = 3958.7613;
const D2R = Math.PI / 180;

export function haversineMi(a, b) {
  const dLat = (b.lat - a.lat) * D2R;
  const dLon = (b.lon - a.lon) * D2R;
  const la1 = a.lat * D2R, la2 = b.lat * D2R;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R_MI * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bearingDeg(a, b) {
  const la1 = a.lat * D2R, la2 = b.lat * D2R, dLon = (b.lon - a.lon) * D2R;
  const y = Math.sin(dLon) * Math.cos(la2);
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
  return (Math.atan2(y, x) / D2R + 360) % 360;
}

/* Great-circle interpolation, t in [0,1]. Falls back to linear for
   coincident points so we never divide by a zero sine. */
export function gcInterp(a, b, t) {
  const la1 = a.lat * D2R, lo1 = a.lon * D2R, la2 = b.lat * D2R, lo2 = b.lon * D2R;
  const d = haversineMi(a, b) / R_MI;
  if (d < 1e-9) return { lat: a.lat, lon: a.lon };
  const sd = Math.sin(d);
  const A = Math.sin((1 - t) * d) / sd, B = Math.sin(t * d) / sd;
  const x = A * Math.cos(la1) * Math.cos(lo1) + B * Math.cos(la2) * Math.cos(lo2);
  const y = A * Math.cos(la1) * Math.sin(lo1) + B * Math.cos(la2) * Math.sin(lo2);
  const z = A * Math.sin(la1) + B * Math.sin(la2);
  return { lat: Math.atan2(z, Math.hypot(x, y)) / D2R, lon: Math.atan2(y, x) / D2R };
}

export function gcPoints(a, b, n = 48) {
  const out = [];
  for (let i = 0; i <= n; i++) out.push(gcInterp(a, b, i / n));
  return out;
}

/* Sample a flight track [[t,lat,lon,alt],...] at time t.
   Returns null outside the track's own time window. */
export function samplePath(path, t) {
  if (!path.length) return null;
  if (t < path[0][0] || t > path[path.length - 1][0]) return null;
  let i = 0;
  while (i < path.length - 2 && path[i + 1][0] < t) i++;
  const [t0, la0, lo0, a0] = path[i];
  const [t1, la1, lo1, a1] = path[i + 1];
  const f = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
  const p = gcInterp({ lat: la0, lon: lo0 }, { lat: la1, lon: lo1 }, f);
  const prev = { lat: la0, lon: lo0 }, next = { lat: la1, lon: lo1 };
  const legMi = haversineMi(prev, next);
  const legHrs = (t1 - t0) / 3600;
  return {
    lat: p.lat, lon: p.lon,
    altFt: a0 + (a1 - a0) * f,
    groundSpeedMph: legHrs > 0 ? legMi / legHrs : 0,
    headingDeg: bearingDeg(prev, next),
  };
}

export function pathLengthMi(path) {
  let d = 0;
  for (let i = 1; i < path.length; i++) {
    d += haversineMi({ lat: path[i - 1][1], lon: path[i - 1][2] }, { lat: path[i][1], lon: path[i][2] });
  }
  return d;
}

/* Speed of sound falls with temperature, so Mach for a given ground speed
   depends on altitude. ISA up to the tropopause, constant above it. */
export function machAt(mph, altFt = 30000) {
  const tK = altFt < 36089 ? 288.15 - 0.0019812 * altFt : 216.65;
  const aMs = 20.0468 * Math.sqrt(tK);       // speed of sound, m/s
  return mph / (aMs * 2.2369363);            // m/s -> mph
}

/* Direct geodesic problem: where do you end up starting at `from`, holding
   `bearingDeg`, after `distMi`? Needed to draw reachability rings, which are
   circles on the sphere and emphatically not circles on the projected map. */
export function destinationPoint(from, bearingDeg, distMi) {
  const d = distMi / R_MI;
  const br = bearingDeg * D2R;
  const la1 = from.lat * D2R, lo1 = from.lon * D2R;
  const sinLa2 = Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(br);
  const la2 = Math.asin(Math.min(1, Math.max(-1, sinLa2)));
  const y = Math.sin(br) * Math.sin(d) * Math.cos(la1);
  const x = Math.cos(d) - Math.sin(la1) * sinLa2;
  const lo2 = lo1 + Math.atan2(y, x);
  return { lat: la2 / D2R, lon: ((lo2 / D2R + 540) % 360) - 180 };
}
