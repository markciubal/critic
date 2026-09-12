/* =============================================================================
   map3d.js — the 3D map.

   States are real geometry: us-atlas 1:10m TopoJSON, decoded in topo.js,
   projected through a composite Albers in projection.js, and extruded into
   slabs. Flight tracks ride above that plane with altitude on Y, exaggerated
   by a stated factor.
   ========================================================================== */

import * as THREE from '../vendor/three.module.js';
import { readStates } from './topo.js';
import {
  projectForState, projectLL, altToY, OMITTED_FIPS, UNITS_PER_MILE, setAltExaggeration,
} from './projection.js';
import {
  FLIGHTS, MIL_FLIGHTS, PLACES, DEBRIS, GIBNEY, CLAIM_ROUTE,
  CRITIC_NODES, CRITIC_CHAIN, DISTRIBUTION,
} from './data.js';
import { samplePath, gcPoints } from './geo.js';
import {
  BANDS, FUEL_RING, ringPoints, reachMi, MAX_DRAW_MI, AIM9,
  bandRadii, evidenceCeilingMi, DEPARTURE_BOUNDS,
} from './reachability.js';
import { destinationPoint } from './geo.js';

const COL = {
  bg: 0x070a0f,
  land: 0x1b2634,
  landHi: 0x2c3f55,
  edge: 0x3d5570,
  edgeHi: 0x7fb3d5,
  doc: 0x35d6a4,
  claim: 0xffd447,
  critic: 0xff7ad9,
  debris: 0xff8a5c,
  crater: 0xff4d4d,
};

/* The extruded slab is a plinth, not terrain. It was 1.1 units, which at
   true scale is roughly 24 miles of apparent thickness — taller than any
   altitude the app plots. Thinned so a 1x track clears it. */
const STATE_DEPTH = 0.6;

/* See _buildDebris for why this exists and why the UI has to declare it. */
export const DEBRIS_MAGNIFY = 42;

export class Map3D {
  constructor(canvas, topology) {
    this.canvas = canvas;
    this.hoverTarget = null;
    this.onPick = () => {};

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(COL.bg, 1);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(COL.bg, 300, 780);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.5, 900);

    // Orbit state: camera sits on a sphere around `target`.
    this.target = new THREE.Vector3(0, 0, 0);
    this.dist = 152;
    this.yaw = 0;
    this.pitch = 1.12;          // radians above the horizon
    this.minPitch = 0.12;
    this.maxPitch = 1.50;

    this._buildLights();
    this._buildStates(topology);
    this._buildGrid();
    this._buildFlights();
    this._buildGibney();
    this._buildDebris();
    this._buildCritic();
    this._buildReach();
    this._buildPlaces();

    // Follow mode: the camera continuously reframes whatever is airborne.
    this.following = true;
    this.followGoal = null;
    this.onManualCamera = () => {};
    // Markers are modelled at a size that reads at the national view; once the
    // camera can close to a quarter of that range they have to shrink with it
    // or an F-15 covers Rhode Island.
    this._markerScale = 1;
    this._lastRender = performance.now();

    this.ray = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-10, -10);
    this._bindInput();
    this._applyCamera();
  }

  /* --- scene furniture --------------------------------------------------- */

  _buildLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xcfe6ff, 1.15);
    key.position.set(-60, 120, -70);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x4a7fb5, 0.5);
    rim.position.set(80, 40, 90);
    this.scene.add(rim);
  }

  _buildGrid() {
    const g = new THREE.GridHelper(600, 60, 0x16202c, 0x101820);
    g.position.y = -0.6;
    g.material.transparent = true;
    g.material.opacity = 0.5;
    this.scene.add(g);
  }

  _buildStates(topology) {
    this.stateMeshes = [];
    this.stateGroup = new THREE.Group();
    this.scene.add(this.stateGroup);

    const edgeGeoms = [];

    for (const st of readStates(topology)) {
      if (OMITTED_FIPS.has(st.id)) continue;
      const project = projectForState(st.id);
      const shapes = [];

      for (const poly of st.polygons) {
        // Rings under ~0.35 map units across are islands too small to read as
        // anything but z-fighting speckle; drop them.
        const rings = poly.map((ring) => ring.map(([lo, la]) => {
          const [x, z] = project(lo, la);
          return new THREE.Vector2(x, -z);
        }));
        if (!rings.length) continue;
        const outer = rings[0];
        if (ringSpan(outer) < 0.35) continue;

        const shape = new THREE.Shape(outer);
        for (let i = 1; i < rings.length; i++) {
          if (ringSpan(rings[i]) < 0.35) continue;
          shape.holes.push(new THREE.Path(rings[i]));
        }
        shapes.push(shape);

        for (const r of rings) {
          if (ringSpan(r) < 0.35) continue;
          edgeGeoms.push(ringToEdge(r, STATE_DEPTH + 0.015));
        }
      }
      if (!shapes.length) continue;

      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth: STATE_DEPTH, bevelEnabled: false, curveSegments: 1,
      });
      geom.rotateX(-Math.PI / 2);
      geom.computeVertexNormals();

      const mat = new THREE.MeshLambertMaterial({ color: COL.land });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.userData = { kind: 'state', id: st.id, name: st.name };
      this.stateGroup.add(mesh);
      this.stateMeshes.push(mesh);
    }

    if (edgeGeoms.length) {
      const merged = mergeLineGeoms(edgeGeoms);
      const lines = new THREE.LineSegments(
        merged,
        new THREE.LineBasicMaterial({ color: COL.edge, transparent: true, opacity: 0.85 }),
      );
      this.scene.add(lines);
      this.borderLines = lines;
    }
  }

  /* --- flights ------------------------------------------------------------ */

  _buildFlights() {
    this.flightObjs = new Map();
    const group = new THREE.Group();
    this.scene.add(group);

    for (const f of [...FLIGHTS, ...MIL_FLIGHTS]) {
      const isMil = MIL_FLIGHTS.includes(f);
      const dense = trackPoints(f);

      // Planned-but-unflown track, drawn faint the whole time.
      const ghost = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(dense),
        new THREE.LineBasicMaterial({ color: f.color, transparent: true, opacity: 0.16 }),
      );

      // Flown track, revealed by the scrubber.
      const flownGeom = new THREE.BufferGeometry();
      flownGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dense.length * 3), 3));
      const flown = new THREE.Line(flownGeom, new THREE.LineBasicMaterial({ color: f.color, linewidth: 2 }));
      flown.frustumCulled = false;

      // Ground track, so the map plane still reads when the camera is low.
      const shadowPts = dense.map((p) => new THREE.Vector3(p.x, STATE_DEPTH + 0.02, p.z));
      const shadowGeom = new THREE.BufferGeometry();
      shadowGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(shadowPts.length * 3), 3));
      const shadow = new THREE.Line(shadowGeom, new THREE.LineBasicMaterial({
        color: f.color, transparent: true, opacity: 0.35,
      }));
      shadow.frustumCulled = false;

      const marker = new THREE.Mesh(
        new THREE.ConeGeometry(0.85, 2.6, 5),
        new THREE.MeshBasicMaterial({ color: f.color }),
      );
      marker.rotation.x = Math.PI / 2;
      marker.userData = { kind: 'flight', id: f.id };
      marker.visible = false;

      // Vertical drop line tying the aircraft to its ground position.
      const tether = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
        new THREE.LineBasicMaterial({ color: f.color, transparent: true, opacity: 0.4 }),
      );
      tether.frustumCulled = false;

      const impact = new THREE.Mesh(
        new THREE.RingGeometry(0.6, 1.1, 32),
        new THREE.MeshBasicMaterial({ color: f.color, side: THREE.DoubleSide, transparent: true }),
      );
      const last = f.path[f.path.length - 1];
      const [ix, iz] = projectLL({ lat: last[1], lon: last[2] });
      impact.position.set(ix, STATE_DEPTH + 0.28, iz);
      impact.rotation.x = -Math.PI / 2;
      impact.visible = false;

      group.add(ghost, flown, shadow, marker, tether, impact);
      this.flightObjs.set(f.id, {
        f, dense, ghost, flown, shadow, marker, tether, impact,
        isMil, visible: true,
      });
    }
  }

  /* --- Gibney routes ------------------------------------------------------ */

  _buildGibney() {
    this.routeGroup = new THREE.Group();
    this.scene.add(this.routeGroup);
    this.routes = {};

    const mk = (legs, color, y, dashed) => {
      const g = new THREE.Group();
      for (const leg of legs) {
        const pts = gcPoints(PLACES[leg.from], PLACES[leg.to], 64).map((p, i, arr) => {
          const [x, z] = projectLL(p);
          // Bow each leg so overlapping routes stay separable in 3D.
          const t = i / (arr.length - 1);
          const lift = Math.sin(t * Math.PI) * y;
          return new THREE.Vector3(x, STATE_DEPTH + 0.4 + lift, z);
        });
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = dashed
          ? new THREE.LineDashedMaterial({ color, dashSize: 1.6, gapSize: 1.1, transparent: true, opacity: 0.95 })
          : new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 });
        const line = new THREE.Line(geom, mat);
        if (dashed) line.computeLineDistances();
        g.add(line);
      }
      this.routeGroup.add(g);
      return g;
    };

    this.routes.documented = mk(GIBNEY.legs, COL.doc, 5, false);
    this.routes.claim = mk(CLAIM_ROUTE.legs, COL.claim, 11, true);
    this.routes.documented.visible = false;
    this.routes.claim.visible = false;
  }

  /* --- debris ------------------------------------------------------------- */

  /* The debris field is about 8 miles across. The map is about 2,800 miles
     across. At true scale the entire field is a third of one map unit — far
     smaller than the markers that would represent it, and invisible at any
     camera distance the controls allow.

     So the field is drawn magnified about its own crater. This is a real
     distortion and the UI says so in as many words; the alternative is a
     single dot that conveys nothing about a scatter pattern, which is the
     one thing this layer exists to show. Distances quoted in the panel are
     always the true ones, computed from the unmagnified coordinates. */
  _buildDebris() {
    this.debrisGroup = new THREE.Group();
    this.debrisGroup.visible = false;
    this.scene.add(this.debrisGroup);
    this.debrisPos = new Map();

    const [cx, cz] = projectLL(DEBRIS[0]);
    const M = DEBRIS_MAGNIFY;
    const place = (d) => {
      const [x, z] = projectLL(d);
      return [cx + (x - cx) * M, cz + (z - cz) * M];
    };

    for (const d of DEBRIS) {
      const isCrater = d.name === 'Impact crater';
      const [x, z] = place(d);
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(isCrater ? 0.62 : 0.4, 14, 10),
        new THREE.MeshBasicMaterial({ color: isCrater ? COL.crater : COL.debris }),
      );
      m.position.set(x, STATE_DEPTH + 0.4, z);
      m.userData = { kind: 'debris', name: d.name, note: d.note, src: d.src, lat: d.lat, lon: d.lon };
      this.debrisGroup.add(m);
      this.debrisPos.set(d.name, m.position.clone());
    }

    // Distance rings at 1, 3 and 8 true miles, so the scatter reads as a
    // measurement rather than an impression.
    for (const mi of [1, 3, 8]) {
      const r = mi * UNITS_PER_MILE * M;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.06, r + 0.06, 128),
        new THREE.MeshBasicMaterial({ color: COL.debris, side: THREE.DoubleSide, transparent: true, opacity: 0.45 }),
      );
      ring.position.set(cx, STATE_DEPTH + 0.1, cz);
      ring.rotation.x = -Math.PI / 2;
      ring.userData = { kind: 'ring', mi };
      this.debrisGroup.add(ring);
    }
  }

  /* The CRITIC chain, drawn as a communications network rather than a flight
     path — it is the one layer here that is not an aircraft.

     Solid link: NORAD to NSA. That hop is documented, because NSA held the
     message and retransmitted it.

     Dashed links: NSA onward. Those are where a CRITIC is DESIGNED to land.
     The actual addressee lists, routing indicators and delivery times are
     redacted, so drawing them solid would assert exactly the thing the FOIA
     request is trying to establish. */
  _buildCritic() {
    this.criticGroup = new THREE.Group();
    this.criticGroup.visible = false;
    this.scene.add(this.criticGroup);
    this.criticLinks = [];

    for (const [key, n] of Object.entries(CRITIC_NODES)) {
      const [x, z] = projectLL(n);
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 10),
        new THREE.MeshBasicMaterial({ color: COL.critic }),
      );
      m.position.set(x, STATE_DEPTH + 0.35, z);
      m.userData = { kind: 'criticNode', key, name: n.name, note: n.note, src: n.src };
      this.criticGroup.add(m);
    }

    const arc = (fromKey, toKey, lift, dashed) => {
      const pts = gcPoints(CRITIC_NODES[fromKey], CRITIC_NODES[toKey], 48).map((p, i, a) => {
        const [x, z] = projectLL(p);
        const t = i / (a.length - 1);
        return new THREE.Vector3(x, STATE_DEPTH + 0.4 + Math.sin(t * Math.PI) * lift, z);
      });
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = dashed
        ? new THREE.LineDashedMaterial({ color: COL.critic, dashSize: 0.9, gapSize: 0.7, transparent: true, opacity: 0.85 })
        : new THREE.LineBasicMaterial({ color: COL.critic, transparent: true, opacity: 0.95 });
      const line = new THREE.Line(geom, mat);
      if (dashed) line.computeLineDistances();
      line.visible = false;
      this.criticGroup.add(line);
      return line;
    };

    for (const c of CRITIC_CHAIN) {
      const lines = [];
      if (c.to) {
        lines.push(arc(c.from, c.to, 14, false));
      } else {
        // A lateral push: one dashed arc per designed recipient.
        for (const dest of DISTRIBUTION.to) lines.push(arc(c.from, dest, 5, true));
      }
      this.criticLinks.push({ c, lines });
    }
  }

  /* Reachability rings and weapon engagement zones.

     Rings are rebuilt each time the clock moves, because their radius is a
     function of elapsed time. That is cheap — a ring is 120 points — and it
     keeps the geometry honest rather than scaling a fixed circle, which would
     be wrong under a conic projection. */
  _buildReach() {
    this.reachGroup = new THREE.Group();
    this.reachGroup.visible = false;
    this.scene.add(this.reachGroup);

    const mkRing = (color, opacity, dashed) => {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(121 * 3), 3));
      const mat = dashed
        ? new THREE.LineDashedMaterial({ color, dashSize: 1.4, gapSize: 1.0, transparent: true, opacity })
        : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const l = new THREE.Line(geom, mat);
      l.frustumCulled = false;
      l.visible = false;
      this.reachGroup.add(l);
      return l;
    };

    // Outer edge solid, inner edge dashed: the pair reads as one band whose
    // thickness is the departure-time tolerance.
    this.reachRings = BANDS.map((b) => ({
      band: b,
      outer: mkRing(b.color, 0.85, false),
      inner: mkRing(b.color, 0.45, true),
    }));
    // The hard limit set by first knowledge, drawn once, brightly.
    this.ceilingRing = mkRing(0xffffff, 0.32, true);
    this.fuelRing = mkRing(FUEL_RING.color, 0.95, true);
    this.reachLabelAnchors = [];
    // The engagement zone: an annulus, because a Sidewinder has a minimum
    // range as well as a maximum.
    this.wezOuter = mkRing(0xff4d4d, 1.0, false);
    this.wezInner = mkRing(0xff4d4d, 0.6, true);
    this.wezHome = mkRing(0xff4d4d, 0.5, true);
  }

  _writeRing(line, pts) {
    const attr = line.geometry.attributes.position;
    const n = attr.count;
    for (let i = 0; i < n; i++) {
      const p = pts[Math.min(i, pts.length - 1)];
      const [x, z] = projectLL(p);
      attr.setXYZ(i, x, STATE_DEPTH + 0.5, z);
    }
    attr.needsUpdate = true;
    if (line.material.isLineDashedMaterial) line.computeLineDistances();
  }

  /* `anchor` is the last position with any documentary claim to a time;
     `target` is United 93's live position, or null once it is down. */
  setReach(opts) {
    this._reachOpts = opts;
    if (!this.reachGroup.visible || !opts) return;
    const { anchor, now, depart, toleranceMin, target, showWez, showEnvelope } = opts;

    // Labels are anchored on a bearing that runs out over empty map rather
    // than through the northeast, where everything else already is.
    const LABEL_BEARING = 202;
    this.reachLabelAnchors = [];
    const anchorAt = (r, text, color) => {
      const p = destinationPoint(anchor, LABEL_BEARING, r);
      const [x, z] = projectLL(p);
      this.reachLabelAnchors.push({
        pos: new THREE.Vector3(x, STATE_DEPTH + 0.6, z), text, color,
      });
    };

    for (const { band, outer, inner } of this.reachRings) {
      const r = bandRadii(band.mph, now, depart, toleranceMin);
      const on = showEnvelope && r.outer > 1 && r.outer < MAX_DRAW_MI;
      outer.visible = on;
      inner.visible = on && r.inner > 1;
      if (on) {
        this._writeRing(outer, ringPoints(anchor, r.outer, 120));
        if (r.inner > 1) this._writeRing(inner, ringPoints(anchor, r.inner, 120));
        const span = toleranceMin > 0 ? ` (${Math.round(r.inner)}–${Math.round(r.outer)})` : '';
        anchorAt(r.outer, `${band.label} · ${band.mph} mph · ${Math.round(r.outer)} mi${span}`, band.color);
      }
    }

    const ceil = evidenceCeilingMi(BANDS[1].mph, now);
    const ceilOn = showEnvelope && ceil > 1 && ceil < MAX_DRAW_MI;
    this.ceilingRing.visible = ceilOn;
    if (ceilOn) {
      this._writeRing(this.ceilingRing, ringPoints(anchor, ceil, 120));
      anchorAt(ceil, `Evidence ceiling · earliest possible departure ${Math.round(ceil)} mi`, 0xffffff);
    }

    this.fuelRing.visible = showEnvelope;
    if (showEnvelope) {
      this._writeRing(this.fuelRing, ringPoints(anchor, FUEL_RING.miles, 120));
      anchorAt(FUEL_RING.miles, `Unrefuelled combat radius · ${FUEL_RING.miles} mi`, FUEL_RING.color);
    }

    const wezOn = showWez && !!target;
    this.wezOuter.visible = wezOn;
    this.wezInner.visible = wezOn;
    if (wezOn) {
      this._writeRing(this.wezOuter, ringPoints(target, AIM9.rMaxMi, 120));
      this._writeRing(this.wezInner, ringPoints(target, AIM9.rMinMi, 120));
    }

    // The same weapon drawn from the only place he is documented to have
    // been. At national zoom it is a dot, which is the honest impression.
    this.wezHome.visible = showWez;
    if (showWez) this._writeRing(this.wezHome, ringPoints(anchor, AIM9.rMaxMi, 120));
  }

  setReachVisible(v) {
    this.reachGroup.visible = v;
    if (v) this.setReach(this._reachOpts);
  }

  _buildPlaces() {
    this.placeGroup = new THREE.Group();
    this.scene.add(this.placeGroup);
    this.placeDots = [];
    for (const [key, p] of Object.entries(PLACES)) {
      const [x, z] = projectLL(p);
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0x9fb6cc }),
      );
      m.position.set(x, STATE_DEPTH + 0.3, z);
      m.userData = { kind: 'place', key, name: p.name };
      this.placeGroup.add(m);
      this.placeDots.push({ key, mesh: m, p });
    }
  }

  /* --- input -------------------------------------------------------------- */

  _bindInput() {
    const c = this.canvas;
    let dragging = false, lastX = 0, lastY = 0, moved = 0, button = 0;

    c.addEventListener('pointerdown', (e) => {
      dragging = true; moved = 0; button = e.button;
      lastX = e.clientX; lastY = e.clientY;
      c.setPointerCapture(e.pointerId);
    });

    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);

      if (button === 2 || e.shiftKey) {
        // Pan across the map plane, in the camera's own screen basis.
        const k = this.dist * 0.0013;
        const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
        const fwd = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
        this.target.addScaledVector(right, -dx * k).addScaledVector(fwd, -dy * k);
        this.onManualCamera();
      } else {
        this.yaw -= dx * 0.005;
        this.pitch = clamp(this.pitch - dy * 0.005, this.minPitch, this.maxPitch);
      }
      this._applyCamera();
    });

    const end = (e) => {
      if (dragging && moved < 5) this._pick();
      dragging = false;
      if (c.hasPointerCapture?.(e.pointerId)) c.releasePointerCapture(e.pointerId);
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('contextmenu', (e) => e.preventDefault());

    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.dist = clamp(this.dist * Math.exp(e.deltaY * 0.0011), 6, 460);
      this.onManualCamera();
      this._applyCamera();
    }, { passive: false });
  }

  _pick() {
    this.ray.setFromCamera(this.pointer, this.camera);
    const targets = [
      ...this.placeGroup.children,
      ...(this.debrisGroup.visible ? this.debrisGroup.children : []),
      ...(this.criticGroup.visible ? this.criticGroup.children : []),
      ...[...this.flightObjs.values()].filter((o) => o.marker.visible).map((o) => o.marker),
      ...this.stateMeshes,
    ];
    const hit = this.ray.intersectObjects(targets, false)[0];
    if (hit) this.onPick(hit.object.userData, hit.point);
    else this.onPick(null, null);
  }

  _applyCamera() {
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    this.camera.position.set(
      this.target.x + this.dist * cp * Math.sin(this.yaw),
      this.target.y + this.dist * sp,
      this.target.z + this.dist * cp * Math.cos(this.yaw),
    );
    this.camera.lookAt(this.target);
  }

  /* Work out the camera target and distance that frames a set of lat/lon
     points. Minimum extents stop a single airborne aircraft from being framed
     so tightly that you lose all sense of where in the country it is. */
  fitPoints(pts, pad = 1.7) {
    if (!pts.length) return null;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const p of pts) {
      const [x, z] = projectLL(p);
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
    const halfW = Math.max((maxX - minX) / 2, 12);
    const halfZ = Math.max((maxZ - minZ) / 2, 9);

    const vfov = this.camera.fov * Math.PI / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    const dW = halfW / Math.tan(hfov / 2);
    // Ground distance running away from the camera is foreshortened by pitch.
    const dZ = halfZ / Math.tan(vfov / 2) / Math.max(0.4, Math.sin(this.pitch));

    return { cx, cz, dist: clamp(Math.max(dW, dZ) * pad, 42, 260) };
  }

  /* Keep markers at a roughly constant apparent size as the camera closes in.
     Debris is deliberately excluded: it is modelled for its own magnified
     close-up scale and shrinking it would defeat the point. */
  _rescaleMarkers() {
    const k = clamp(this.dist / 152, 0.2, 1.6);
    if (Math.abs(k - this._markerScale) < 0.005) return;
    this._markerScale = k;
    for (const o of this.flightObjs.values()) {
      o.marker.scale.setScalar(k * (o.isMil ? 0.72 : 1));
    }
    for (const m of this.placeGroup.children) m.scale.setScalar(k);
    // Alert-network nodes are point locations like airfields, so they scale
    // the same way. Debris stays out of this — it is modelled for its own
    // magnified close-up and shrinking it would defeat the layer.
    for (const m of this.criticGroup.children) {
      if (m.userData.kind === 'criticNode') m.scale.setScalar(k);
    }
  }

  setFollow(on) {
    this.following = on;
    if (!on) this.followGoal = null;
  }

  /* Called on every clock change. Null/empty just holds the current framing,
     which is what you want before the first aircraft is airborne. */
  followPoints(pts) {
    if (!this.following) return;
    const fit = this.fitPoints(pts);
    if (fit) this.followGoal = fit;
  }

  flyTo(latlon, dist = 46) {
    const [x, z] = latlon.isVector3 ? [latlon.x, latlon.z] : projectLL(latlon);
    this._startTween(x, z, dist);
  }

  _startTween(tx, tz, td, ms = 620) {
    this._tween = {
      fx: this.target.x, fz: this.target.z, fd: this.dist,
      tx, tz, td, ms, start: performance.now(),
    };
  }

  resetView() {
    this.pitch = 1.12; this.yaw = 0;
    this._startTween(0, 0, 152);
  }

  /* --- per-frame update --------------------------------------------------- */

  setTime(t) {
    this._t = t;
    this._updateCritic(t);
    for (const o of this.flightObjs.values()) {
      const { f, dense, flown, shadow, marker, tether, impact } = o;
      const t0 = f.path[0][0], t1 = f.path[f.path.length - 1][0];
      const show = o.visible;
      o.ghost.visible = show;

      if (!show || t < t0) {
        flown.visible = shadow.visible = marker.visible = tether.visible = impact.visible = false;
        continue;
      }

      const ended = t >= t1;
      const frac = clamp((t - t0) / (t1 - t0), 0, 1);
      const n = Math.max(2, Math.ceil(frac * (dense.length - 1)) + 1);

      writeInto(flown, dense, n);
      writeInto(shadow, dense, n, true, STATE_DEPTH + 0.02);
      flown.visible = shadow.visible = true;

      if (ended && o.isMil) {
        // Still airborne past the end of our window — hold it at the last
        // known point rather than drawing an impact ring it never made.
        const last = f.path[f.path.length - 1];
        const [lx, lz] = projectLL({ lat: last[1], lon: last[2] });
        const ly = altToY(last[3]) + STATE_DEPTH + 0.05;
        marker.position.set(lx, ly, lz);
        marker.visible = true;
        impact.visible = false;
        const tp = tether.geometry.attributes.position;
        tp.setXYZ(0, lx, ly, lz);
        tp.setXYZ(1, lx, STATE_DEPTH + 0.02, lz);
        tp.needsUpdate = true;
        tether.visible = true;
        o.sample = { lat: last[1], lon: last[2], altFt: last[3], groundSpeedMph: 0, headingDeg: 0 };
      } else if (ended) {
        marker.visible = tether.visible = false;
        impact.visible = true;
      } else {
        impact.visible = false;
        const s = samplePath(f.path, t);
        if (s) {
          const [x, z] = projectLL(s);
          const y = altToY(s.altFt) + STATE_DEPTH + 0.05;
          marker.position.set(x, y, z);
          // Cone points +Y; rotating +90 deg about X aims it at +Z (south).
          // A world-Y turn of (pi - heading) then swings it onto the true
          // bearing, since heading 0 is north, which is -Z here.
          marker.rotation.set(Math.PI / 2, 0, 0);
          marker.rotateOnWorldAxis(Y_AXIS, Math.PI - s.headingDeg * Math.PI / 180);
          marker.visible = true;
          const tp = tether.geometry.attributes.position;
          tp.setXYZ(0, x, y, z);
          tp.setXYZ(1, x, STATE_DEPTH + 0.02, z);
          tp.needsUpdate = true;
          tether.visible = true;
          o.sample = s;
        }
      }
    }
  }

  /* Links appear when the clock reaches their date-time group and stay up. */
  _updateCritic(t) {
    if (!this.criticGroup.visible) return;
    for (const { c, lines } of this.criticLinks) {
      const on = t >= c.t;
      for (const l of lines) l.visible = on;
    }
  }

  setCriticVisible(v) {
    this.criticGroup.visible = v;
    this._updateCritic(this._t || 0);
  }

  /* Changing the vertical scale means rebuilding every track's geometry.
     That is cheap — a few hundred points in total — and it keeps altitude a
     real function of the data rather than a scaled-up copy of one shape. */
  setAltScale(k) {
    setAltExaggeration(k);
    for (const o of this.flightObjs.values()) {
      o.dense = trackPoints(o.f);
      o.ghost.geometry.setFromPoints(o.dense);
      o.ghost.geometry.computeBoundingSphere();
    }
    this.setTime(this._t ?? 0);
  }

  setFlightVisible(id, v) {
    const o = this.flightObjs.get(id);
    if (o) o.visible = v;
  }

  setDebrisVisible(v) { this.debrisGroup.visible = v; }
  setRouteVisible(which, v) { if (this.routes[which]) this.routes[which].visible = v; }

  hover() {
    if (this.pointer.x === this._hx && this.pointer.y === this._hy) return this._hoverName;
    this._hx = this.pointer.x; this._hy = this.pointer.y;
    this.ray.setFromCamera(this.pointer, this.camera);
    const hit = this.ray.intersectObjects(this.stateMeshes, false)[0];
    const next = hit ? hit.object : null;
    if (next !== this.hoverTarget) {
      if (this.hoverTarget) this.hoverTarget.material.color.setHex(COL.land);
      if (next) next.material.color.setHex(COL.landHi);
      this.hoverTarget = next;
      this.canvas.style.cursor = next ? 'pointer' : 'grab';
    }
    this._hoverName = next ? next.userData.name : null;
    return this._hoverName;
  }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render() {
    if (this._tween) {
      const tw = this._tween;
      const t = Math.min(1, (performance.now() - tw.start) / tw.ms);
      const e = 1 - Math.pow(1 - t, 3);
      this.target.x = tw.fx + (tw.tx - tw.fx) * e;
      this.target.z = tw.fz + (tw.tz - tw.fz) * e;
      this.dist = tw.fd + (tw.td - tw.fd) * e;
      this._applyCamera();
      if (t >= 1) this._tween = null;
    }

    // Exponential smoothing on a time delta, so the glide is identical
    // whether the machine is managing 20fps or 144.
    const now = performance.now();
    const dt = Math.min(0.05, (now - this._lastRender) / 1000);
    this._lastRender = now;

    if (this.following && this.followGoal && !this._tween) {
      const g = this.followGoal;
      const k = 1 - Math.exp(-2.8 * dt);
      const dx = g.cx - this.target.x, dz = g.cz - this.target.z, dd = g.dist - this.dist;
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01 || Math.abs(dd) > 0.01) {
        this.target.x += dx * k;
        this.target.z += dz * k;
        this.dist += dd * k;
        this._applyCamera();
      }
    }

    this._rescaleMarkers();

    const pulse = 1 + Math.sin(performance.now() * 0.004) * 0.22;
    for (const o of this.flightObjs.values()) {
      if (!o.impact.visible) continue;
      o.impact.scale.setScalar(pulse * this._markerScale);
      o.impact.material.opacity = 0.85 - (pulse - 1);
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* Project a world point to CSS pixel coordinates, for HTML labels. */
  toScreen(v3) {
    const p = v3.clone().project(this.camera);
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (p.x * 0.5 + 0.5) * r.width,
      y: (-p.y * 0.5 + 0.5) * r.height,
      behind: p.z > 1,
    };
  }
}

/* --- helpers -------------------------------------------------------------- */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const Y_AXIS = new THREE.Vector3(0, 1, 0);

function ringSpan(ring) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of ring) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  }
  return Math.max(maxX - minX, maxY - minY);
}

/* Outline at the top face of the extrusion. */
function ringToEdge(ring, y) {
  const arr = new Float32Array(ring.length * 6);
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    arr[i * 6 + 0] = a.x; arr[i * 6 + 1] = y; arr[i * 6 + 2] = -a.y;
    arr[i * 6 + 3] = b.x; arr[i * 6 + 4] = y; arr[i * 6 + 5] = -b.y;
  }
  return arr;
}

function mergeLineGeoms(chunks) {
  let n = 0;
  for (const c of chunks) n += c.length;
  const out = new Float32Array(n);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(out, 3));
  return g;
}

/* Project a flight's waypoints into world space at the current vertical
   scale, then subdivide. Point count is independent of the scale, so the
   preallocated line buffers stay valid across a change. */
function trackPoints(f) {
  const full = f.path.map(([, la, lo, alt]) => {
    const [x, z] = projectLL({ lat: la, lon: lo });
    return new THREE.Vector3(x, altToY(alt) + STATE_DEPTH + 0.05, z);
  });
  return densify(full, 6);
}

/* Subdivide so a revealed partial track has enough vertices to look smooth. */
function densify(pts, per) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    for (let j = 0; j < per; j++) out.push(pts[i].clone().lerp(pts[i + 1], j / per));
  }
  out.push(pts[pts.length - 1].clone());
  return out;
}

/* Rewrite the first n vertices of a line, then collapse the tail onto the
   last live vertex so the unused buffer never draws a spike to the origin. */
function writeInto(line, pts, n, flatten = false, flatY = 0) {
  const attr = line.geometry.attributes.position;
  const last = Math.min(n, pts.length) - 1;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[Math.min(i, last)];
    attr.setXYZ(i, p.x, flatten ? flatY : p.y, p.z);
  }
  attr.needsUpdate = true;
}
