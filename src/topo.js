/* topo.js — minimal TopoJSON reader.

   us-atlas ships quantised TopoJSON: shared arcs stored as delta-encoded
   integers plus a transform back to lon/lat. Decoding it is about fifty
   lines, which is cheaper than taking on a dependency for one file format. */

function decodeArc(topology, arc) {
  const { scale: [sx, sy], translate: [tx, ty] } = topology.transform;
  let x = 0, y = 0;
  const out = new Array(arc.length);
  for (let i = 0; i < arc.length; i++) {
    x += arc[i][0];
    y += arc[i][1];
    out[i] = [x * sx + tx, y * sy + ty];
  }
  return out;
}

/* A negative index means "this arc, reversed" and is encoded as ~i. */
function stitch(arcs, indices) {
  const ring = [];
  for (const idx of indices) {
    const rev = idx < 0;
    const arc = arcs[rev ? ~idx : idx];
    const pts = rev ? arc.slice().reverse() : arc;
    // Shared endpoints would otherwise be duplicated at every seam.
    for (let i = ring.length ? 1 : 0; i < pts.length; i++) ring.push(pts[i]);
  }
  return ring;
}

/* Returns [{ id, name, polygons: [ [ring, hole...], ... ] }] where each ring
   is an array of [lon, lat]. Holes are kept; they matter for Michigan-style
   geometry and for any state with an enclave. */
export function readStates(topology, objectName = 'states') {
  const arcs = topology.arcs.map((a) => decodeArc(topology, a));
  const geoms = topology.objects[objectName].geometries;
  return geoms.map((g) => {
    let polygons;
    if (g.type === 'Polygon') polygons = [g.arcs.map((r) => stitch(arcs, r))];
    else if (g.type === 'MultiPolygon') polygons = g.arcs.map((p) => p.map((r) => stitch(arcs, r)));
    else polygons = [];
    return { id: g.id, name: g.properties ? g.properties.name : g.id, polygons };
  });
}
