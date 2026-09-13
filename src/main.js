/* =============================================================================
   main.js — app wiring: playback clock, scrubber, panels, labels.
   ========================================================================== */

import { Map3D, DEBRIS_MAGNIFY } from './map3d.js';
import {
  T0, T1, hms, FLIGHTS, PLACES, EVENTS, DEBRIS, DEBRIS_NOTE,
  CRITIC, GIBNEY, F16, SRC_META, CLAIM_ROUTE, MIL_FLIGHTS, CALLSIGNS, KERNEL,
  CRITIC_NODES, CRITIC_CHAIN, CRITIC_SUMMARY, CRITIC_GLIMPSE,
  DISTRIBUTION, CRITIC_BACKGROUND, FOIA,
} from './data.js';
/* A namespace view of the same module, used only for content that is being
   added to data.js alongside this file. Reading it through the namespace means
   the app still loads if the export is not there yet. */
import * as DATA from './data.js';
import { samplePath, haversineMi, machAt } from './geo.js';
import { ALT_CHOICES, trueScaleRatio } from './projection.js';
import {
  analyseClaim, analyseDocumented, ASSUMPTIONS, COMMAND_CHECK, classify, legAnalysis,
} from './analysis.js';
import { CONFLICTS, STATUS_META, conflictsFor, openCount } from './conflicts.js';
import {
  BANDS, FERRY_RING, HALF_FERRY_RING, AIM9, shanksvilleTest, reachMi,
  scaleComparison, TOLERANCES, DEPARTURE_BOUNDS, bandRadii, evidenceCeilingMi,
  CONFIG_TRADE,
} from './reachability.js';
import {
  HYPO, CONCESSIONS, VERDICT, buildHypoTrack,
  FOREKNOWLEDGE, HIJACK_T, foreknowledgeVerdict,
  fuelProof, bozemanCost, criticSnapshots,
} from './steelman.js';
import { CALLS, CALL_TOTALS, FARADAY, WHY_THEY_MATTER } from './calls.js';
import { GLOSSARY, glossaryList } from './glossary.js';
import { REFS, refsFor } from './links.js';
import { AWARENESS, ACTORS, AWARENESS_COUNTER, FIGHTERS_QUESTION, awarenessGap } from './awareness.js';
import { BOTTOM_LINE, WHY_CRITIC, WALKTHROUGH, PATHS } from './brief.js';
import { CERTAINTY, CERTAINTY_NOTE } from './certainty.js';
import { RECONSTRUCTION, RECON_NOTE } from './reconstruction.js';
import { CORRECTIONS, CORRECTIONS_NOTE } from './corrections.js';
import { wezWindow, LOS_HORIZON, losVsWez, mutualHorizonSmi } from './steelman.js';
import { TOUR_STEPS, TONES } from './tour.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
/* A provenance badge. Titled from SRC_META so hovering says what the badge
   means, and wired to the 'provenance' glossary entry so tapping one opens
   the same popover the (i) icons use. */
const srcTag = (k) => {
  const m = SRC_META[k];
  if (!m) return '';
  const title = m.title || m.note || `${m.label}: source kind for this statement`;
  return `<span class="src ${m.tone}" data-info="provenance" title="${esc(title)}">${m.label}</span>`;
};

/* Expand [[key]] markers in prose to (i) icons. Applied AFTER esc(), so the
   data modules can write '[[mach]]' and get a popover without any HTML. An
   unknown key expands to nothing, so the app runs before the glossary has it. */
const expandInfo = (s) => String(s).replace(/\[\[([a-zA-Z0-9]+)\]\]/g, (_, k) => info(k));
const ei = (s) => expandInfo(esc(s));
/* The same markers dropped, for text that goes into an attribute. */
const plain = (s) => String(s).replace(/\s*\[\[[a-zA-Z0-9]+\]\]/g, '');

/* A provenance line: the status of a figure, printed next to the figure. The
   data modules label every performance number CITED, DERIVED, REPORTED or not
   sourced, and those labels are only worth writing if the reader sees them.
   An empty or missing string renders nothing. */
const provLine = (s, label = '') => (typeof s === 'string' && s
  ? `<p class="prov">${label ? `<b>${esc(label)}</b> ` : ''}${ei(s)}</p>`
  : '');

/* AIM9.provenance is keyed by field name. This is the order the figures are
   printed in the card above it, with the label each one is printed under. */
const AIM9_PROV_ORDER = [
  ['seeker', 'Seeker'],
  ['speed', 'Speed'],
  ['warhead', 'Warhead'],
  ['rMaxMi', 'Max range'],
  ['rMaxOptimisticMi', 'Upper published range'],
  ['rMinMi', 'Min range'],
];

/* Reference chips for every key in obj.refs, when the data carries one. */
const refRows = (obj, extraClass = '') =>
  ((obj && obj.refs) || []).map((k) => refRow(k, extraClass)).join('');

const state = {
  t: T0,
  playing: false,
  rate: 15,
  claimDepart: 8 * 3600 + 46 * 60 + 40,   // user dial: earliest plausible launch (first impact)
  interceptT: 9 * 3600 + 58 * 60,    // the alleged shot
  follow: true,                      // camera reframes the action as you scrub
  altScale: 1,                       // vertical exaggeration; 1 = true scale
  toleranceMin: 10,                  // departure-time tolerance, in minutes
  layers: {
    AA11: true, UA175: true, AA77: true, UA93: true,
    PANTA: true, QUIT: true, GOFER: true, BULLY: true,
    debris: false, routeDoc: false, routeClaim: false, places: true,
    critic: true,
    envelope: false, wez: false, hypo: true, calls: false, aware: false,
    trail: false,
    /* The Mach 2.0 ring is a configuration the record rules out. It is drawn
       only when the layers drawer is switched to Full. */
    maxClean: false,
  },
};

/* Which layers the drawer's Simple / Full switch controls, as a group. */
const FULL_LAYERS = ['envelope', 'wez', 'trail', 'calls', 'aware', 'maxClean'];

let map;

/* =============================================================================
   Boot
   ========================================================================== */

/* The state geometry arrives one of two ways. In the modular source it is
   fetched; in the single-file build it is already embedded in the page. Same
   code path either way, so the bundle is not a different program. */
async function loadTopology() {
  const inline = document.getElementById('topo-data');
  if (inline) return JSON.parse(inline.textContent);
  const res = await fetch('data/states-10m.json');
  if (!res.ok) throw new Error(`states-10m.json — HTTP ${res.status}`);
  return res.json();
}

(async function boot() {
  try {
    const topology = await loadTopology();

    map = new Map3D($('#map'), topology);
    map.resize();
    map.onPick = handlePick;
    // Panning or zooming by hand is the user taking the wheel.
    map.onManualCamera = () => setFollow(false);
    window.__map = map;
    window.__state = state;   // read by the headless probes

    buildFlag90();
    buildTimelineUI();
    buildFlightStrip();
    renderEvents();
    renderBriefTab();
    renderAwareTab();
    renderClaimTab();
    renderDebrisTab();
    renderCriticTab();
    renderMilitaryTab();
    renderConflictsTab();
    renderLayersTab();
    renderNextRows();
    bindChrome();

    setAltScale(state.altScale);
    map.setMaxCleanVisible(!!state.layers.maxClean);
    setTolerance(state.toleranceMin);
    map.setCriticVisible(state.layers.critic);
    map.setAwarenessVisible(state.layers.aware);
    map.setReachVisible(state.layers.envelope || state.layers.wez);
    map.setHypoVisible(state.layers.hypo);
    map.setCallsVisible(state.layers.calls);
    map.setTrailVisible(state.layers.trail);
    setFollow(state.follow);
    setTime(T0);

    addEventListener('resize', () => map.resize());
    requestAnimationFrame(loop);
    const boot = $('#boot');
    boot.classList.add('gone');
    setTimeout(() => boot.remove(), 600);
  } catch (err) {
    console.error(err);
    const b = $('#boot');
    b.classList.add('error');
    b.querySelector('p').innerHTML =
      `Could not start.<br><code style="font-size:11px">${esc(err.message)}</code>` +
      `<br><br><span style="font-size:11px">This page loads ES modules and a JSON file over fetch, so it must be served over HTTP — <code>file://</code> will not work. Try <code>npx serve</code> or <code>python -m http.server</code>.</span>`;
  }
})();

/* =============================================================================
   Clock
   ========================================================================== */

let lastFrame = performance.now();

function loop(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;

  if (state.playing) {
    let t = state.t + dt * state.rate;
    if (t >= T1) { t = T1; setPlaying(false); }
    setTime(t);
  }

  const hoverName = map.hover();
  $('#hud-state').textContent = hoverName || '';

  map.render();
  drawLabels();
  requestAnimationFrame(loop);
}

function setTime(t) {
  state.t = Math.max(T0, Math.min(T1, t));
  map.setTime(state.t);
  $('#clock').textContent = hms(state.t);
  $('#scrub').value = String(Math.round(state.t));
  const pct = ((state.t - T0) / (T1 - T0)) * 100;
  $('#track-fill').style.width = `${pct}%`;
  $('#playhead').style.left = `${pct}%`;
  updateNowCard();
  updateEventHighlight();
  updateFlightStrip();
  map.followPoints(focusPoints());
  updateReach();
  map.setCalls(ua93StateAt, state.t);
  map.setTrail(state.t);
  if (state.layers.hypo) updateHypo();
  throttledReachPanels();
}

let lastPanelPaint = 0;
let panelTrailing = null;
/* Leading-edge throttle with a trailing repaint. Without the trailing call a
   scrub that lands inside the throttle window leaves the numbers stale until
   the next event — which, when the clock is paused, may never come. */
function throttledReachPanels(force = false) {
  const now = performance.now();
  if (!force && now - lastPanelPaint < 220) {
    clearTimeout(panelTrailing);
    panelTrailing = setTimeout(() => throttledReachPanels(true), 240);
    return;
  }
  clearTimeout(panelTrailing);
  panelTrailing = null;
  lastPanelPaint = now;
  if (!$('#reach-out')) return;
  renderReachPanel();
  renderWezPanel();
  renderSteelPanel();
  renderForeknowledgePanel();
  renderCriticVsSteelman();
}

/* United 93's live position is the target the alleged shot needs. Once it is
   down, the geometry freezes at the crater — the question of who was within
   ten miles of it does not go away at 10:03:11. */
function ua93PositionAt(t) {
  const f = FLIGHTS.find((x) => x.id === 'UA93');
  const first = f.path[0], last = f.path[f.path.length - 1];
  if (t <= first[0]) return { lat: first[1], lon: first[2] };
  if (t >= last[0]) return { lat: last[1], lon: last[2] };
  const sm = samplePath(f.path, t);
  return sm ? { lat: sm.lat, lon: sm.lon } : null;
}

function ua93Position() { return ua93PositionAt(state.t); }

/* The steelman is a fixed scenario — Fargo to wherever United 93 is at the
   alleged moment — so it is anchored on the intercept time, not the clock.
   Sampling "now" left the panel blank before 08:42, when United 93 had not
   yet taken off. */
function hypoTarget() { return ua93PositionAt(state.interceptT); }

/* The constructed track is rebuilt whenever the departure hypothesis moves,
   and sampled against the clock like any other aircraft. */
function updateHypo() {
  const target = hypoTarget();
  const track = target
    ? buildHypoTrack(target, state.claimDepart, state.interceptT)
    : null;
  map.setHypo(track, state.t, ua93StateAt(state.t) || ua93Position());
  return track;
}

/* United 93's full state at a time, for plotting the calls at the altitude
   the aircraft was actually flying. */
function ua93StateAt(t) {
  const f = FLIGHTS.find((x) => x.id === 'UA93');
  return samplePath(f.path, t);
}

function updateReach() {
  map.setReach({
    anchor: PLACES.KFAR,
    now: state.t,
    depart: state.claimDepart,
    toleranceMin: state.toleranceMin,
    showWez: state.layers.wez,
    showEnvelope: state.layers.envelope,
  });
}

/* =============================================================================
   What the camera should be looking at, at time t.

   The rule is simply "everything that is in the air right now", plus any crash
   site from the last couple of minutes so the camera lingers on an impact
   instead of snapping away from it the instant the aircraft stops existing.

   Framing the set rather than chasing a single aircraft means the camera
   glides instead of cutting: it tightens onto New England when only American
   11 is up, widens as three more launch across the Northeast and Ohio, and
   closes back in on Somerset County at the end.
   ========================================================================== */

const LINGER_S = 150;

function focusPoints() {
  const pts = [];
  for (const o of map.flightObjs.values()) {
    if (!o.visible) continue;
    const path = o.f.path;
    const t0 = path[0][0], t1 = path[path.length - 1][0];

    if (state.t >= t0 && state.t < t1) {
      const sm = samplePath(path, state.t);
      if (sm) pts.push({ lat: sm.lat, lon: sm.lon });
    } else if (!o.isMil && state.t >= t1 && state.t - t1 <= LINGER_S) {
      const last = path[path.length - 1];
      pts.push({ lat: last[1], lon: last[2] });
    }
  }
  return pts;
}

/* The legend is the only honest home for a scale control: the factor and the
   statement of what it means should never be able to drift apart. */
function setAltScale(k) {
  state.altScale = ALT_CHOICES.includes(k) ? k : 1;
  map.setAltScale(state.altScale);
  $$('#alt-group button').forEach((b) => b.classList.toggle('on', +b.dataset.alt === state.altScale));
  const note = $('#alt-note');
  /* The caveat is rendered, not only tooltipped: an exaggerated vertical axis
     is a distortion the reader has to be told about on screen. At 1x the
     legend stays one row. */
  note.hidden = state.altScale === 1;
  let text;
  if (state.altScale === 1) {
    note.innerHTML = `<b>True scale.</b> A 35,000 ft cruise is 6.6 miles above a country 2,800 miles across, about 1:${Math.round(trueScaleRatio()).toLocaleString()}. At true scale the tracks are almost flat.`;
    text = `True scale. A 35,000 ft cruise is 6.6 miles above a country 2,800 miles across, about 1:${Math.round(trueScaleRatio()).toLocaleString()}. At true scale the tracks are almost flat.`;
  } else {
    note.innerHTML = `Altitude exaggerated <b>${state.altScale}×</b> against ground distance, to make climbs and descents readable. The vertical axis is not to scale.`;
    text = `Altitude exaggerated ${state.altScale}× against ground distance, to make climbs and descents readable. The vertical axis is not to scale.`;
  }
  // The same wording also rides on the control as a tooltip, for the 1x case
  // where the legend stays one row.
  const ag = $('#alt-group');
  if (ag) ag.title = text;
}

/* The one place that turns the panel off and on, so the button's label and
   its accessible name cannot disagree about which way it is about to go. */
function setPanelHidden(hidden) {
  document.body.classList.toggle('panel-hidden', hidden);
  const b = $('#aside-toggle');
  if (b) {
    const label = hidden ? 'Show text' : 'Hide text';
    b.title = label;
    b.setAttribute('aria-label', label);
    const w = b.querySelector('.at-word');
    if (w) w.textContent = label;
  }
  setTimeout(() => map.resize(), 280);
}

function setFollow(on) {
  state.follow = on;
  map.setFollow(on);
  const b = $('#btn-follow');
  if (b) {
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  }
  if (on) map.followPoints(focusPoints());
}

function setPlaying(v) {
  state.playing = v;
  $('#play-glyph').textContent = v ? '❚❚' : '▶';
  // The playback-rate buttons are hidden on phones until the clock is running.
  document.body.classList.toggle('playing', !!v);
}

/* The Reset-view routine, shared by the header button, the map toggle and the
   walkthrough's "show on the map" chips. */
function resetViewFit() {
  setFollow(false);
  map.resetView();
}

const isPhone = () => innerWidth <= 860;

/* Swap the phone layout between the reading and the full-height map. The
   canvas changes size, so the renderer is resized and the view refitted. */
function setMapOpen(open, refit = true) {
  document.body.classList.toggle('map-open', open);
  const mapBtn = $('#btn-map');
  if (mapBtn) mapBtn.textContent = open ? 'Back to text' : 'Full map';
  const tab = ($('#tabs button.on') || {}).dataset?.tab || 'brief';
  document.body.classList.toggle('footer-min', !open && tab !== 'timeline');
  setTimeout(() => {
    map.resize();
    if (refit) resetViewFit();
  }, 260);
}

/* =============================================================================
   Timeline UI
   ========================================================================== */

function buildTimelineUI() {
  const scrub = $('#scrub');
  scrub.min = String(T0);
  scrub.max = String(T1);
  scrub.value = String(T0);
  scrub.addEventListener('input', () => { setPlaying(false); setTime(+scrub.value); });

  // Hour and half-hour ticks.
  const ticks = $('#ticks');
  for (let t = Math.ceil(T0 / 900) * 900; t <= T1; t += 900) {
    const d = document.createElement('div');
    d.className = 'tick';
    d.style.left = `${((t - T0) / (T1 - T0)) * 100}%`;
    d.textContent = hms(t).slice(0, 5);
    ticks.appendChild(d);
  }

  // One mark per event, sized by whether it is an impact or the claim.
  const marks = $('#event-marks');
  for (const ev of EVENTS) {
    const m = document.createElement('div');
    const major = /Impact|crashed|Impact,|strikes/i.test(ev.text) || ev.kind === 'claim';
    m.className = `emark${major ? ' big' : ''}${ev.kind === 'critic' ? ' critic-mark' : ''}`;
    m.style.left = `${((ev.t - T0) / (T1 - T0)) * 100}%`;
    m.style.background = hex(ev.color);
    m.style.color = hex(ev.color);
    m.title = `${hms(ev.t).slice(0, 5)} — ${ev.text}`;
    m.addEventListener('click', (e) => { e.stopPropagation(); setPlaying(false); setTime(ev.t); });
    m.addEventListener('mouseenter', (e) => showTip(e, ev.label, ev.text, ev.src));
    m.addEventListener('mouseleave', hideTip);
    marks.appendChild(m);
  }
}

function buildFlightStrip() {
  const strip = $('#flight-strip');
  strip.innerHTML = FLIGHTS.map((f) => `
    <div class="fs" data-fs="${f.id}">
      <span class="dot" style="background:${hex(f.color)}"></span>
      <span>${esc(f.label)}</span>
      <span class="st" data-st="${f.id}">—</span>
    </div>`).join('');
  $$('.fs').forEach((el) => el.addEventListener('click', () => {
    setFollow(false);
    const f = FLIGHTS.find((x) => x.id === el.dataset.fs);
    map.flyTo(samplePath(f.path, state.t) || PLACES[f.from], 52);
  }));
}

function updateFlightStrip() {
  for (const f of FLIGHTS) {
    const el = $(`.fs[data-fs="${f.id}"]`);
    const st = $(`[data-st="${f.id}"]`);
    const t0 = f.path[0][0], t1 = f.path[f.path.length - 1][0];
    el.classList.remove('live', 'down');
    el.style.color = '';
    if (state.t < t0) {
      st.textContent = `dep ${hms(t0).slice(0, 5)}`;
    } else if (state.t >= t1) {
      el.classList.add('down');
      st.textContent = `down ${hms(t1).slice(0, 5)}`;
    } else {
      const s = samplePath(f.path, state.t);
      el.classList.add('live');
      el.style.color = hex(f.color);
      st.textContent = s ? `${Math.round(s.altFt / 100) * 100} ft · ${Math.round(s.groundSpeedMph)} mph` : '—';
    }
  }
}

/* =============================================================================
   Panels — timeline tab
   ========================================================================== */

function renderEvents() {
  const CRASH_T = 10 * 3600 + 3 * 60 + 11;
  const top = $('#timeline-top');
  if (top) top.innerHTML = `<div class="jump-row">
      <button class="chip" data-goto="timeline" data-anchor="#crash">The crash &rarr;</button>
    </div>`;

  $('#event-list').innerHTML = EVENTS.map((ev, i) => `
    <div class="ev future${ev.kind === 'claim' ? ' claim-ev' : ''}${ev.kind === 'critic' ? ' critic-ev' : ''}" data-ev="${i}" data-t="${ev.t}">
      <div class="ev-t">${hms(ev.t)}</div>
      <div>
        <div class="ev-label" style="color:${hex(ev.color)}">${esc(ev.label)}</div>
        <div class="ev-text">${esc(ev.text)}</div>
        <div style="margin-top:5px">${srcTag(ev.src)}
          ${ev.flight === 'UA93' && Math.abs(ev.t - CRASH_T) < 60
            ? `<button class="chip chip-inline" data-goto="timeline" data-anchor="#crash">The crash &rarr;</button>` : ''}
        </div>
      </div>
    </div>`).join('');

  evEls = $$('.ev');
  lastNowIdx = -1;
  evEls.forEach((el) => el.addEventListener('click', (e) => {
    if (e.target.closest('[data-goto]')) return;   // the chip has its own job
    setPlaying(false);
    setTime(+el.dataset.t);
    const ev = EVENTS[+el.dataset.ev];
    if (state.follow) return;   // the clock change already reframed the camera
    if (ev.kind === 'flight' || ev.kind === 'milflight') {
      const f = [...FLIGHTS, ...MIL_FLIGHTS].find((x) => x.id === ev.flight);
      const sm = f && samplePath(f.path, ev.t);
      if (sm) map.flyTo(sm, 48);
    } else if (ev.place && PLACES[ev.place]) {
      map.flyTo(PLACES[ev.place], 60);
    }
  }));
}

let lastNowIdx = -1;
let evEls = [];

function updateEventHighlight() {
  let idx = -1;
  for (let i = 0; i < EVENTS.length; i++) if (EVENTS[i].t <= state.t) idx = i;
  if (idx === lastNowIdx) return;

  evEls.forEach((el, i) => {
    el.classList.toggle('future', i > idx);
    el.classList.toggle('past', i < idx);
    el.classList.toggle('now', i === idx);
  });

  lastNowIdx = idx;
  if (idx >= 0) {
    const el = evEls[idx];
    if (el && $('[data-body="timeline"]').offsetParent !== null) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}

function updateNowCard() {
  const airborne = FLIGHTS.filter((f) => {
    const t0 = f.path[0][0], t1 = f.path[f.path.length - 1][0];
    return state.t >= t0 && state.t < t1;
  });
  const down = FLIGHTS.filter((f) => state.t >= f.path[f.path.length - 1][0]);
  $('#now-card').innerHTML = `
    <div class="now-t">${hms(state.t)} EDT</div>
    <div class="now-sub">
      ${airborne.length} hijacked aircraft airborne · ${down.length} down
    </div>`;
}

/* =============================================================================
   Panels — the claim tab
   ========================================================================== */

/* Details on the Claim tab open on a desktop, where there is room, and start
   closed on a phone, where the tab would otherwise be a very long scroll. */
const openIfWide = () => (innerWidth > 860 ? ' open' : '');

function renderClaimTab() {
  const g = GIBNEY;
  $('#claim-body').innerHTML = `
    <div class="verdict verdict-top">
      <div class="bluf-kicker">The verdict</div>
      <h3>${ei(VERDICT.headline)}</h3>
      <p>${ei(VERDICT.body)}</p>
      <div style="margin-top:8px">${srcTag('derived')}${refRows(VERDICT)}</div>
      <div class="chip-row">
        <button class="chip chip-go" data-goto="tour">&#9654; Walk me through it</button>
        <button class="chip" data-cjump="CLAIM">Disputes about this</button>
      </div>
    </div>

    <div class="card">
      <h3>The allegation ${conflictChip('CLAIM')}</h3>
      ${refRow('UA93')}${refRow('COMMISSION')}${refRows(CRITIC)}
      <p>In <strong>${esc(CRITIC.date)}</strong>, ${esc(CRITIC.claimant)} told ${esc(CRITIC.venue)} that United 93 did not crash: it was shot down. ${srcTag('claim')}</p>
      <div class="quote">“${esc(CRITIC.quote)}” ${srcTag(CRITIC.src)}</div>
      <dl class="kv">
        ${CRITIC.assertions.map((a) => `<dt>${esc(a.k)}</dt><dd>${esc(a.v)}</dd>`).join('')}
      </dl>
      <p style="margin-top:10px">Everything below tests that claim.</p>
    </div>

    <div class="card">
      <h3>Rick Gibney's documented day</h3>
      ${refRow('GIBNEY_UNIT')}${refRows(g)}
      <p><strong>${esc(g.name)}</strong>, 119th Fighter Wing. He was flying an F-16 on the morning of September 11. That much the claim gets right. ${srcTag(g.src || 'press')}</p>
      <p>His tasking was to fly <strong>${esc(g.passenger)}</strong> home. With every civil aircraft in the country grounded, a fighter was the only way to move him.</p>
      <p style="font-size:11.5px;color:var(--ink-faint)">${ei(g.rankNote.text)} ${srcTag(g.rankNote.src)}</p>

      <h3 style="margin-top:14px">Where he landed</h3>
      ${g.landings.map((l, i) => `
        <div class="cmd-row" style="grid-template-columns:20px 1fr">
          <div class="t">${i + 1}</div>
          <div class="x"><strong style="color:var(--ink)">${esc(PLACES[l.place].name)}</strong><br>
          <span style="font-size:11.5px">${esc(l.role)}</span></div>
        </div>`).join('')}

      ${g.legs.map((l) => `<p style="margin-top:9px;font-size:12px">${ei(l.why)} ${srcTag(l.src)}</p>`).join('')}
      <p style="font-size:12px">${ei(g.afterword)}</p>
      <div class="chip-row">
        <button class="chip" data-act="show-doc">Draw this route</button>
        <button class="chip" data-act="show-claim">Draw the claimed route</button>
      </div>
    </div>

    <details class="card cd"${openIfWide()}>
      <summary><h3>Required speed</h3></summary>
      <p>The claim fixes one arrival time: Gibney must be over Somerset County at <strong>09:58</strong>. Set the earliest moment he could have launched from Fargo and the leg is forced.</p>
      ${refRow('F16')}${refRow('UA93')}
      <div class="dial">
        <label><span>Departure from Fargo</span><b id="dep-read">08:46</b></label>
        <input id="dep-dial" type="range" min="${7 * 3600}" max="${9 * 3600 + 50 * 60}" step="60" value="${state.claimDepart}" />
      </div>
      <div class="dial" style="margin-top:4px">
        <label><span>Departure-time tolerance</span><b id="tol-read"></b></label>
        <div class="alt-group" id="tol-group">
          ${TOLERANCES.map((t) => `<button data-tol="${t.minutes}"${t.minutes === state.toleranceMin ? ' class="on"' : ''}>${esc(t.label)}</button>`).join('')}
        </div>
        <p style="font-size:11.5px;color:var(--ink-faint);margin:6px 0 0" id="tol-note"></p>
      </div>
      <div id="speed-out"></div>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">
        Every assumption below favours the claim:
      </p>
      <ul class="plain" style="font-size:11.5px">
        ${ASSUMPTIONS.map((a) => `<li>${ei(a)}</li>`).join('')}
      </ul>
    </details>

    <details class="card cd" id="reach-card"${openIfWide()}>
      <summary><h3>Where he could have been</h3></summary>
      <p>His day has documented <em>places</em> (Fargo, Bozeman, Albany) and essentially no documented <em>times</em>. So for almost the whole morning nothing puts him at any particular point, and the app draws a disc rather than a line: everywhere an F-16 could reach from its last anchor in the time elapsed.</p>
      <div id="reach-out"></div>
      ${refRow('F16')}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">
        No departure time for Gibney has ever been published, so the rings are drawn as bands rather than hairlines. The bounds that <em>are</em> documented are the day's own: first knowledge at ${hms(DEPARTURE_BOUNDS.firstKnowledge.t).slice(0, 5)}, the national ground stop at ${hms(DEPARTURE_BOUNDS.groundStop.t).slice(0, 5)} ${info('groundStop')}, and SCATANA at ${hms(DEPARTURE_BOUNDS.scatana.t).slice(0, 5)} ${info('scatana')}, after which civil aviation could not move Ed Jacoby and the documented tasking to fly him applies. ${srcTag('commission')}
      </p>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">
        The reach ring shows where an F-16 could have been, not where anyone was. Every point inside it is equally unevidenced, and that morning the reach ring of nearly any fighter in the eastern half of the country would have covered Somerset County eventually. It shows the size of the gap in the record; the fuel ring shows how much smaller that gap is. ${srcTag('derived')}
      </p>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">
        The rings measure to the crater (${Math.round(haversineMi(PLACES.KFAR, PLACES.SHKV)).toLocaleString()} mi); the steelman measures to where United 93 was at 09:58 (${Math.round(haversineMi(PLACES.KFAR, hypoTarget() || PLACES.SHKV)).toLocaleString()} mi). ${srcTag('derived')}
      </p>
      <div class="chip-row">
        <button class="chip" data-act="show-envelope">Draw the reach rings</button>
        <button class="chip" data-act="show-wez">Draw the missile range</button>
      </div>
    </details>

    <div class="card">
      <h3>What he would have had to hit it with</h3>
      <p><strong>${esc(AIM9.designation)}</strong> ${info('sidewinder')}. ${esc(AIM9.inService)} ${srcTag(AIM9.src)}</p>
      ${refRows(AIM9)}
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55">A short-range missile that
      steers towards the heat of an engine. It has to be fired from fairly close, and inside about
      half a mile it has not armed itself yet, so the area it can reach is a ring rather than a
      circle ${info('wez')}.</p>
      <dl class="kv">
        <dt>Seeker</dt><dd>${esc(AIM9.seeker)}</dd>
        <dt>Speed</dt><dd>${esc(AIM9.speed)}</dd>
        <dt>Warhead</dt><dd>${esc(AIM9.warhead)}</dd>
        <dt>Max range</dt><dd>~${AIM9.rMaxMi} mi (published figures run to ${AIM9.rMaxOptimisticMi})</dd>
        <dt>Min range</dt><dd>~${AIM9.rMinMi} mi, so the zone is a ring, not a disc</dd>
      </dl>
      <div id="wez-out"></div>
      ${AIM9.notes.map((n) => `<p style="margin-top:9px;font-size:12px">${ei(n.text)} ${srcTag(n.src)}</p>`).join('')}
      ${AIM9.provenance ? `<div class="prov-block">
        <p class="prov-head">Where each figure above comes from</p>
        ${AIM9_PROV_ORDER.filter((r) => AIM9.provenance[r[0]]).map((r) => provLine(AIM9.provenance[r[0]], r[1] + ':')).join('')}
      </div>` : ''}
    </div>

    <div class="card steel">
      <h3>The strongest possible version</h3>
      <p>Everything else here tests the allegation. This grants it every favourable assumption at once and asks what still fails, to identify which objections matter.</p>
      <p class="hypo-warn"><strong>${esc(HYPO.callsign)}: ${esc(HYPO.status)}.</strong> ${esc(HYPO.disclaimer)}
      This is a <em>steelman</em> ${info('steelman')}: the claim's best possible case, built so it can be tested properly.</p>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55;margin-top:8px">
        <strong style="color:var(--ink)">Standing premise: the aircraft is carrying external fuel
        tanks</strong> ${info('dropTanks')}. The documented Montana-to-Albany leg, flown nonstop
        as reported, cannot be flown without them. Everything below assumes a tanked jet, so fuel
        is not an objection. The tanks do cost the claim Mach 2.0, which is available only clean
        ${info('placard')}. The 340-mile combat-radius ring this app once drew, the figure for a
        fighter carrying no tanks, has been removed for the same reason: it described a
        configuration the record rules out.</p>
      ${refRow('F16')}${refRow('GIBNEY')}
      <div id="steel-out"></div>
      <div id="concessions"></div>
      <div class="chip-row">
        <button class="chip" data-act="show-hypo">Plot ${esc(HYPO.callsign)}</button>
        <button class="chip" data-act="tour">&#9654; Walk me through it</button>
      </div>
    </div>

    <div class="card fk-card">
      <h3>${esc(FOREKNOWLEDGE.title)}</h3>
      <p>United 93 was seized at <strong>09:28</strong>. Before that it was an ordinary flight climbing out of Newark. So a launch aimed at it before 09:28 would be a response to a hijacking that had not yet happened.</p>
      <div id="fk-out"></div>
      <p class="fk-caution">${ei(FOREKNOWLEDGE.caution)} ${srcTag(FOREKNOWLEDGE.src)}</p>
    </div>

    <div class="card">
      <h3>${esc(CONFIG_TRADE.title)}</h3>
      ${refRows(CONFIG_TRADE)}
      <p>Speed and range come off the same wing stations, so an F-16 can have one or the other.
      Nobody observed the aircraft's configuration directly, but the Montana-to-Albany leg cannot
      be flown without external tanks ${info('dropTanks')}, so the tanks are established and the
      configuration is decided.</p>
      <div class="cmd-row">
        <div class="t" style="color:#fff">${CONFIG_TRADE.clean.topMph} mph</div>
        <div class="x"><strong style="color:var(--ink)">${esc(CONFIG_TRADE.clean.label)}.</strong> ${ei(CONFIG_TRADE.clean.note)}
        ${provLine(CONFIG_TRADE.clean.provenance, 'Provenance:')}</div>
      </div>
      <div class="cmd-row">
        <div class="t" style="color:${hex(0xff8a5c)}">${CONFIG_TRADE.tanked.topMph} mph</div>
        <div class="x"><strong style="color:var(--ink)">${esc(CONFIG_TRADE.tanked.label)}.</strong> ${ei(CONFIG_TRADE.tanked.note)}
        ${provLine(CONFIG_TRADE.tanked.provenance, 'Provenance:')}</div>
      </div>
      <p style="margin-top:11px">${ei(CONFIG_TRADE.reading)} ${srcTag(CONFIG_TRADE.src)}</p>
    </div>

    <div class="card">
      <h3>What the claim requires</h3>
      <div id="findings"></div>
      ${refRow('COMMISSION')}${refRow('F16')}
    </div>

    <details class="card cd"${openIfWide()}>
      <summary><h3>Route comparison</h3></summary>
      <div id="route-compare"></div>
    </details>

    <div class="card">
      <h3>${esc(COMMAND_CHECK.title)}</h3>
      <p>Set aside speed and fuel entirely. An intercept has to be <em>ordered</em>. ${srcTag('commission')}</p>
      ${COMMAND_CHECK.rows.map((r) => `
        <div class="cmd-row${r.src === 'claim' ? ' claim-row' : ''}">
          <div class="t">${esc(r.t)}</div><div class="x">${ei(r.text)} ${srcTag(r.src)}</div>
        </div>`).join('')}
      <p style="margin-top:11px">${ei(COMMAND_CHECK.conclusion)}</p>
      ${refRows(COMMAND_CHECK)}
    </div>

    <div class="card kernel-card">
      <h3>${esc(KERNEL.title)}</h3>
      ${KERNEL.paras.map((p) => `<p>${ei(p)}</p>`).join('')}
      <div style="margin-top:8px">${srcTag(KERNEL.src)}</div>
      ${refRows(KERNEL)}
      <div class="chip-row">
        <button class="chip" data-act="show-quit">Fly to QUIT flight</button>
        <button class="chip" data-act="show-gofer">Fly to GOFER 06</button>
        <button class="chip" data-goto="aware" data-anchor="#airborne">What was airborne &rarr;</button>
      </div>
    </div>

    <div class="card">
      <h3>The people involved</h3>
      ${GIBNEY.rebuttals.map((r) => `
        <div class="finding soft">
          <h4>${esc(r.who)}</h4>
          <p>${ei(r.text)}</p>
          <div style="margin-top:5px">${srcTag(r.src)}${refRows(r)}</div>
        </div>`).join('')}
    </div>

    <div class="verdict">
      <h3>Where this leaves the claim</h3>
      <p>The allegation rests on a single unsourced assertion by one man on a radio show, three years after the fact. Against it: the pilot's unit, the pilot's passenger, the distances, the Montana leg, and a command timeline in which the authority to fire arrived half an hour after the alleged shot.</p>
      <p>Nobody has published Gibney's minute-by-minute logs, and this app does not claim to have them. The finding is narrower: no single F-16 can be over Pennsylvania at 09:58 and in Bozeman, Montana, on the times required, and no assumption about missing records changes that.</p>
      <div style="margin-top:8px">${srcTag('derived')}</div>
    </div>

    <details class="card cd"${openIfWide()}>
      <summary><h3>The airframe</h3></summary>
      <p><strong>${esc(F16.model)}</strong></p>
      ${refRows(F16)}
      <dl class="kv">
        <dt>Cruise</dt><dd>~${F16.cruiseMph} mph</dd>
        <dt>Max, low</dt><dd>~${F16.maxSeaLevelMph} mph (Mach ${machAt(F16.maxSeaLevelMph, 0).toFixed(1)} at sea level)</dd>
        <dt>Max, high</dt><dd>~${F16.maxAltitudeMph} mph (Mach ${machAt(F16.maxAltitudeMph, 40000).toFixed(1)} at 40,000 ft)</dd>
        <dt>Max, with tanks</dt><dd>~${F16.maxWithTanksMph.toLocaleString()} mph (Mach ${machAt(F16.maxWithTanksMph, 40000).toFixed(1)} at 40,000 ft)</dd>
        <dt>Ferry range</dt><dd>~${F16.ferryRangeMi.toLocaleString()} mi one way with external tanks</dd>
      </dl>
      ${(F16.provenance || []).length ? `<div class="prov-block">
        <p class="prov-head">Where each figure above comes from</p>
        ${F16.provenance.map((p) => provLine(p.text, p.figure + ':')).join('')}
      </div>` : ''}
      ${F16.notes.map((n) => `<p style="margin-top:9px;font-size:12px">${ei(n.text)} ${srcTag(n.src)}</p>`).join('')}
    </details>`;

  /* Opening "Where he could have been" turns the rings on, so the reader who
     opens the card sees the thing it describes. Nothing is ever turned off
     from a panel. */
  const rc = $('#reach-card');
  if (rc) {
    /* A details rendered with the open attribute fires one toggle as it is
       inserted. That is not the reader opening it, so it is ignored: the
       rings start off and come on when the card is opened by hand. */
    let armed = false;
    rc.addEventListener('toggle', () => {
      if (!armed || !rc.open) return;
      state.layers.envelope = true;
      state.layers.wez = true;
      map.setReachVisible(true);
      syncLayerChecks();
      updateReach();
    });
    setTimeout(() => { armed = true; }, 0);
  }

  $$('#tol-group button').forEach((b) => b.addEventListener('click', () => {
    setTolerance(+b.dataset.tol);
  }));

  $('#dep-dial').addEventListener('input', (e) => {
    state.claimDepart = +e.target.value;
    updateSpeedPanel();
    throttledReachPanels(true);
    updateReach();
  });

  $$('#claim-body .chip[data-act]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.act === 'tour') { tourEnter(); return; }
    if (b.dataset.act === 'show-hypo') {
      state.layers.hypo = true;
      map.setHypoVisible(true);
      updateHypo();
      syncLayerChecks();
      setFollow(false);
      map.resetView();
      return;
    }
    if (b.dataset.act === 'show-envelope' || b.dataset.act === 'show-wez') {
      const k = b.dataset.act === 'show-envelope' ? 'envelope' : 'wez';
      state.layers[k] = true;
      map.setReachVisible(true);
      syncLayerChecks();
      updateReach();
      if (k === 'wez') { setFollow(false); map.flyTo(PLACES.KFAR, 26); }
      else { setFollow(false); map.resetView(); }
      return;
    }
    if (b.dataset.act === 'show-quit') return showMil('QUIT');
    if (b.dataset.act === 'show-gofer') return showMil('GOFER');
    const doc = b.dataset.act === 'show-doc';
    state.layers[doc ? 'routeDoc' : 'routeClaim'] = true;
    map.setRouteVisible(doc ? 'documented' : 'claim', true);
    syncLayerChecks();
    setFollow(false);
    map.resetView();
  }));

  updateSpeedPanel();
  renderReachPanel();
  renderWezPanel();
  renderSteelPanel();
  renderForeknowledgePanel();
  renderRouteCompare();
}

function speedBar(mph) {
  const max = 1600;
  const v = classify(mph);
  const pct = Math.min(100, (mph / max) * 100);
  const mark = (val, label) => `<div class="bar-mark" style="left:${(val / max) * 100}%">${label}</div>`;
  return `
    <div class="bar"><div class="bar-fill b-${v.key}" style="width:${pct}%"></div></div>
    <div class="bar-marks">
      ${mark(F16.cruiseMph, 'cruise')}
      ${mark(F16.maxSeaLevelMph, 'M1.2')}
      ${mark(F16.maxAltitudeMph, 'M2.0 max')}
    </div>`;
}

function setTolerance(min) {
  const t = TOLERANCES.find((x) => x.minutes === min) || TOLERANCES[2];
  state.toleranceMin = t.minutes;
  $$('#tol-group button').forEach((b) => b.classList.toggle('on', +b.dataset.tol === t.minutes));
  $('#tol-read').textContent = t.minutes ? `±${t.minutes} min` : 'exact';
  $('#tol-note').textContent = t.note;
  updateReach();
  throttledReachPanels(true);
}

function renderForeknowledgePanel() {
  const out = $('#fk-out');
  if (!out) return;
  const target = hypoTarget();
  if (!target) return;
  /* The Mach 2.0 band is a clean-jet figure and the tanks are established, so
     it is not available to this claim and is left out of the best case. */
  const usable = BANDS.filter((b) => !b.unavailable);
  const v = foreknowledgeVerdict(haversineMi(PLACES.KFAR, target), state.interceptT, usable);

  out.innerHTML = `
    <div class="leg fk-leg">
      <div class="leg-head">
        <span class="leg-name">Best case, at the fastest a tanked jet goes</span>
        <span class="leg-dist">${v.best.mph} mph</span>
      </div>
      <div class="leg-speed v-impossible">
        ${Math.round(v.best.leadMin)}<small>minutes of foreknowledge required</small>
      </div>
      <div class="leg-mach">
        He must be off the ground at ${hms(v.best.departBy).slice(0, 5)},
        ${Math.round(v.best.leadMin)} minutes before United 93 was seized.
      </div>
    </div>
    <p style="font-size:11.5px;color:var(--ink-faint);margin:10px 0 4px">
      Every speed the tanked jet can manage, and how far ahead of the hijacking each one puts the launch:
    </p>
    ${v.rows.map((r) => `
      <div class="cmd-row">
        <div class="t" style="color:${hex(r.color)}">${hms(r.departBy).slice(0, 5)}</div>
        <div class="x"><strong style="color:var(--ink)">${esc(r.label)}</strong>, ${r.mph} mph.
        ${r.requires
          ? `<strong class="v-impossible">${Math.round(r.leadMin)} min before the hijacking.</strong>`
          : 'No foreknowledge needed.'}</div>
      </div>`).join('')}
    <div class="fk-verdict">
      <strong>${v.allRequire ? 'Every achievable speed requires foreknowledge.' : 'Some speeds avoid it.'}</strong>
      The furthest he could start from and still arrive without leaving early (the fastest tanked speed
      multiplied by the thirty minutes between the seizure and the alleged shot) is
      <strong>${Math.round(v.horizonMi)} miles</strong>. Fargo is <strong>${Math.round(v.distMi)}</strong>,
      further by <strong class="v-impossible">${Math.round(v.outsideBy)} miles</strong>.
      Mach 2.0 is clean only and not available to this claim ${info('placard')}.
    </div>`;
}

function renderLosPanel(h) {
  const out = $('#los-out');
  if (!out || !h) return;
  const w = wezWindow(h, (t) => ua93StateAt(t) || ua93Position(), AIM9.rMaxMi);
  const now = map.hypoLosInfo;
  const tgt = ua93StateAt(state.interceptT);
  const lv = losVsWez(31000, tgt ? tgt.altFt : 5000, AIM9.rMaxMi);

  out.innerHTML = `
    <div class="leg ${now && now.inWez ? 'los-hot' : ''}">
      <div class="leg-head">
        <span class="leg-name">Line of sight to United 93</span>
        <span class="leg-dist">${now ? (now.miles < 1 ? now.miles.toFixed(2) : Math.round(now.miles)) + ' mi now' : 'not airborne'}</span>
      </div>
      <div class="leg-mach">
        ${w.enter === null
          ? 'Never inside AIM-9 range.'
          : `Inside AIM-9 range from <strong style="color:var(--ink)">${hms(w.enter).slice(0, 8)}</strong>
             to <strong style="color:var(--ink)">${hms(w.exit).slice(0, 8)}</strong>,
             a window of <strong class="v-impossible">${(w.durationS / 60).toFixed(1)} minutes</strong>.`}
      </div>
      <p style="margin:8px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.5">
        That window is the only opportunity the claim has, and it exists only because this track
        was constructed to arrive there. No record puts any specific aircraft inside it.
      </p>
    </div>
    <div class="cmd-row">
      <div class="t" style="color:${hex(LOS_HORIZON.color)}">${Math.round(lv.losMi)} mi</div>
      <div class="x"><strong style="color:var(--ink)">Line-of-sight horizon</strong> ${info('lineOfSight')}: what it can
        <em>see</em>, from 31,000 ft against a target at 5,000. Against
        <strong>${lv.wezMi} mi</strong> of weapon, that is a ratio of
        <strong class="v-impossible">${Math.round(lv.ratio)}:1</strong>.
        ${ei(LOS_HORIZON.note)} ${srcTag(LOS_HORIZON.src)}</div>
    </div>`;
}

/* Whether the concession data carries its own cited/granted marking. Until it
   does, the list renders as it did before rather than labelling every premise
   from a guess. */
const CONCESSION_STATUS_PRESENT =
  CONCESSIONS.some((c) => c.cited != null || c.granted != null || c.status);

/* A premise in the steelman is established by a source, contradicted by one,
   or assumed in the claim's favour. The status label is compared case-blind,
   because the data writes CITED and GRANTED in upper case. `blocking` decides
   which way a citation runs: on a blocking premise the named record is what
   the grant runs into, so it is badged Cited against rather than Cited.

   Every field that names a document, an arithmetic step or an unsourced figure
   is returned for rendering. A citation that never reaches the page is not a
   citation. */
function concessionStatus(c) {
  if (!CONCESSION_STATUS_PRESENT) return { badge: '', notes: [] };
  const citedVal = c.cited ?? c.citation ?? null;
  const grantedVal = c.granted ?? null;
  const status = String(c.status || '').toLowerCase();
  const isCited = status === 'cited' || (citedVal != null && citedVal !== false);
  const badgeFor = (label, tone, title) =>
    `<span class="src ${tone}" title="${esc(title)}">${label}</span>`;

  let badge;
  if (isCited && c.blocking) {
    badge = badgeFor('Cited against', 'against',
      'A source contradicts this premise. The record named below is what the grant runs into.');
  } else if (isCited) {
    badge = badgeFor('Cited', 'solid', 'A source establishes this premise; the app is not assuming it.');
  } else {
    badge = badgeFor('Granted', 'warn', 'No source establishes this. The app assumes it in the claim’s favour.');
  }
  if (typeof citedVal === 'string' && SRC_META[citedVal]) badge += ` ${srcTag(citedVal)}`;

  const notes = [];
  const add = (label, v) => { if (typeof v === 'string' && v) notes.push([label, v]); };
  add(isCited && c.blocking ? 'The record' : 'Source', c.source);
  if (typeof citedVal === 'string' && !SRC_META[citedVal]) add('Source', citedVal);
  add('Computed here', c.derived);
  add('Not sourced', c.open);
  add('Assumed', grantedVal);
  return { badge, notes };
}

function renderSteelPanel() {
  const target = hypoTarget();
  if (!target || !$('#steel-out')) return;
  const h = buildHypoTrack(target, state.claimDepart, state.interceptT);

  $('#steel-out').innerHTML = `
    <div class="leg hypo-leg">
      <div class="leg-head">
        <span class="leg-name" style="font-family:var(--mono)">${esc(HYPO.callsign)}</span>
        <span class="leg-dist">${Math.round(h.miles)} mi · bearing ${Math.round(h.bearing)}°</span>
      </div>
      <div class="leg-speed ${h.withinTankedLimit ? 'v-hard' : 'v-impossible'}">
        ${Math.round(h.mph).toLocaleString()}<small>mph required</small>
      </div>
      <div class="leg-mach">
        Mach ${h.mach.toFixed(2)} · ${h.withinTankedLimit
          ? 'inside the Mach 1.6 placard for a tanked jet'
          : 'beyond the tanked placard; needs a clean jet, which has no external fuel'} ·
        ${Math.round(h.ferryFraction * 100)}% of ferry range
      </div>
    </div>
    <div id="los-out"></div>
    <div class="cmd-row">
      <div class="t">${Math.round(h.egressMi)} mi</div>
      <div class="x">At the closest point to United 93 he turns straight for
        <strong style="color:var(--ink)">Albany</strong>, bearing ${Math.round(h.egressBearing)}°,
        arriving about ${hms(h.arrivesAlbany).slice(0, 5)}.</div>
    </div>
    <div class="cmd-row">
      <div class="t">${Math.round(h.totalMi).toLocaleString()} mi</div>
      <div class="x">Whole day: <strong class="v-routine">${Math.round(h.totalFerryFraction * 100)}% of ferry range</strong>,
        inside one tankful, and it does not go to Bozeman. This shortest flyable
        version of the claim is one in which Ed Jacoby is not collected; Jacoby was collected,
        and has said so.</div>
    </div>`;

  renderLosPanel(h);

  /* The costs that are arithmetic rather than assertion are computed here, so
     the concession list cannot drift from the model the panel above it uses. */
  const ctx = { fuel: fuelProof(), boz: bozemanCost(target, state.claimDepart, state.interceptT) };

  /* Counted from the data rather than typed in, and phrased as "the last N"
     only while the blocking premises really are the last N. */
  const blocking = CONCESSIONS.filter((c) => c.blocking).length;
  const tail = CONCESSIONS.slice(CONCESSIONS.length - blocking).every((c) => c.blocking);
  const word = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][blocking] || String(blocking);
  const blockingLine = blocking
    ? `${tail ? `The last ${word}` : `${word[0].toUpperCase()}${word.slice(1)} of them`} cannot be granted at all.`
    : '';

  $('#concessions').innerHTML = `
    <p style="font-size:11.5px;color:var(--ink-faint);margin:12px 0 6px">
      Granted simultaneously.
      ${CONCESSION_STATUS_PRESENT
    ? `Each premise is marked <span class="src solid">Cited</span> where a source establishes it,
         <span class="src against">Cited against</span> where the record named under it runs the
         other way, and <span class="src warn">Granted</span> where this app is assuming it in the
         claim's favour.`
    : 'The first is established by the documented mission rather than granted by this app.'}
      ${blockingLine}
    </p>
    ${CONCESSIONS.map((c) => {
    const st = concessionStatus(c);
    return `
      <div class="concession ${c.blocking ? 'blocking' : 'free'}">
        <div class="cn-grant">${esc(c.grant)} ${st.badge}</div>
        <div class="cn-detail">${ei(c.detail)}</div>
        ${st.notes.map(([label, text]) => `<div class="cn-note"><b>${esc(label)}:</b> ${ei(text)}</div>`).join('')}
        <div class="cn-cost">${ei(c.costFn ? c.costFn(ctx) : c.cost)}</div>
      </div>`;
  }).join('')}
    <div class="verdict" style="margin-top:12px">
      <h3>${ei(VERDICT.headline)}</h3>
      <p>${ei(VERDICT.body)}</p>
      <div style="margin-top:8px">${srcTag(VERDICT.src)}${refRows(VERDICT)}</div>
    </div>`;
}

function renderReachPanel() {
  const t = shanksvilleTest(state.claimDepart);
  const rows = t.bands.map((b) => {
    const reached = state.t >= b.entersAt;
    const label = b.unavailable ? 'Max clean, not available to this claim' : b.label;
    return `<div class="cmd-row"${b.unavailable ? ' style="opacity:.6"' : ''}>
      <div class="t" style="color:${hex(b.color)}">${hms(b.entersAt).slice(0, 5)}</div>
      <div class="x"><strong style="color:var(--ink)">${esc(label)}</strong>, ${Math.round(b.mph)} mph.
      Somerset County enters this reach ring ${Math.round(b.minutes)} min after departure${reached ? ' <span style="color:var(--claim)">(reached)</span>' : ''}.
      ${provLine(b.note)}${provLine(b.provenance, 'Provenance:')}</div>
    </div>`;
  }).join('');

  /* The whole claimed itinerary against the tank, computed from the route
     rather than typed in, so the two cannot drift apart. */
  const claimMi = CLAIM_ROUTE.legs.reduce((s, l) => s + haversineMi(PLACES[l.from], PLACES[l.to]), 0);
  const claimFerry = claimMi / F16.ferryRangeMi;

  const elapsed = Math.max(0, state.t - state.claimDepart);
  const rNow = reachMi(BANDS[1].mph, elapsed);

  const band = bandRadii(BANDS[1].mph, state.t, state.claimDepart, state.toleranceMin);
  const ceil = evidenceCeilingMi(BANDS[1].mph, state.t);

  $('#reach-out').innerHTML = `
    <div class="leg">
      <div class="leg-head">
        <span class="leg-name">Where the band reaches, at ${BANDS[1].mph} mph</span>
        <span class="leg-dist">${hms(elapsed).slice(0, 5)} elapsed</span>
      </div>
      <div class="leg-speed v-${rNow > HALF_FERRY_RING.miles ? 'hard' : 'routine'}">
        ${Math.round(band.inner).toLocaleString()}–${Math.round(band.outer).toLocaleString()}<small>mi</small>
      </div>
      <div class="leg-mach">
        Band is ${Math.round(band.outer - band.inner).toLocaleString()} mi thick: ${state.toleranceMin ? `±${state.toleranceMin} min of departure` : 'no tolerance applied'}.
        Fargo to Somerset County is ${Math.round(t.miles)} mi.
      </div>
    </div>
    <div class="cmd-row" style="border-top:1px solid var(--line-2)">
      <div class="t" style="color:#fff">${Math.round(ceil).toLocaleString()} mi</div>
      <div class="x"><strong style="color:var(--ink)">Furthest he could be by now</strong>: the evidence ceiling, taking the earliest departure the record permits (${hms(DEPARTURE_BOUNDS.firstKnowledge.t).slice(0, 5)}, ${ei(DEPARTURE_BOUNDS.firstKnowledge.why)}) ${srcTag(DEPARTURE_BOUNDS.firstKnowledge.src)}</div>
    </div>
    ${rows}
    <div class="cmd-row" style="border-top:1px solid var(--line-2)">
      <div class="t" style="color:${hex(HALF_FERRY_RING.color)}">${HALF_FERRY_RING.miles.toLocaleString()} mi</div>
      <div class="x"><strong style="color:var(--ink)">Farthest he could go and still get home</strong> (ferry half-radius ${info('ferryRange')}): the furthest point he could reach and still
      return on the same tanks. Somerset County is <strong class="v-routine">${Math.round(t.miles / HALF_FERRY_RING.miles * 100)}%</strong> of it,
      so even the round trip is not excluded by fuel alone.
      ${provLine(HALF_FERRY_RING.provenance, 'Provenance:')}</div>
    </div>
    <div class="cmd-row">
      <div class="t" style="color:${hex(FERRY_RING.color)}">${FERRY_RING.miles.toLocaleString()} mi</div>
      <div class="x"><strong style="color:var(--ink)">${esc(FERRY_RING.label)}</strong>: Somerset County is
      <strong class="v-routine">${(t.fuel.ferryFraction * 100).toFixed(0)}%</strong> of this, well inside it.
      Fuel does not rule out the Pennsylvania leg. It rules out the full ${Math.round(claimMi).toLocaleString()}-mile itinerary,
      about ${claimFerry.toFixed(2)}× ferry range, which needs a refuelling stop. ${srcTag('derived')}
      ${provLine(FERRY_RING.provenance, 'Provenance:')}</div>
    </div>`;
}

function renderWezPanel() {
  const sc = scaleComparison(state.claimDepart, state.t);

  /* Before the claimed takeoff the envelope has zero radius, so the ratio is a
     division by nothing and the panel used to read "ratio 1 : 0 ... 1 part in
     0". That is not a small number, it is an undefined one, and printing it as
     a finding is exactly the sort of thing this app exists to complain about.
     Say plainly that the clock has not reached the comparison yet. */
  const started = sc.envelopeDiameterMi > 1 && Number.isFinite(sc.ratio) && sc.ratio > 0;

  $('#wez-out').innerHTML = `
    <div class="leg" style="border-color:#6b2b2b;background:rgba(255,89,100,.05)">
      <div class="leg-head">
        <span class="leg-name">The ring he had to be inside</span>
        <span class="leg-dist">${(AIM9.rMaxMi * 2).toFixed(0)} mi across</span>
      </div>
      <p style="margin:0 0 8px;font-size:12.5px;color:var(--ink-dim);line-height:1.5">
        To fire, he must have been within about <strong style="color:var(--ink)">${AIM9.rMaxMi} miles</strong> of United 93, and no closer than ${AIM9.rMinMi}. The map draws that ring at Fargo, the one place the record puts him, so its size can be read against the reach ring it sits inside.
      </p>
      ${started ? `
      <div class="leg-mach">
        How far he could have got by now: <strong style="color:var(--ink)">${Math.round(sc.envelopeDiameterMi).toLocaleString()} mi</strong> across ·
        how far the missile reaches: <strong style="color:var(--ink)">${Math.round(sc.wezDiameterMi)} mi</strong> ·
        ratio <strong class="v-impossible">1 : ${Math.round(sc.ratio).toLocaleString()}</strong>
      </div>
      <p style="margin:9px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.5">
        By area that is about <strong class="v-impossible">1 part in ${Math.round(sc.areaRatio).toLocaleString()}</strong>.
        Line of sight is not the limit. The missile requires being within about ${AIM9.rMaxMi} miles of the airliner at one instant, and no record places him there, or anywhere else, at that time.
      </p>` : `
      <div class="leg-mach">
        The clock is at ${hms(state.t).slice(0, 5)}, before the takeoff this app grants him at
        ${hms(state.claimDepart).slice(0, 5)}. He has gone nowhere yet, so there is nothing to
        compare the missile's reach against.
      </div>
      <p style="margin:9px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.5">
        After ${hms(state.claimDepart).slice(0, 5)} the area he could be in grows every second;
        the area he could shoot into stays ${(AIM9.rMaxMi * 2).toFixed(0)} miles across.
      </p>`}
    </div>`;
}

function updateSpeedPanel() {
  const a = analyseClaim(state.claimDepart, state.interceptT);
  $('#dep-read').textContent = hms(state.claimDepart).slice(0, 5);

  const d = a.dash;
  const finite = Number.isFinite(d.mph);
  $('#speed-out').innerHTML = `
    <div class="leg">
      <div class="leg-head">
        <span class="leg-name">Fargo → Somerset County, PA</span>
        <span class="leg-dist">${Math.round(d.miles)} mi · ${Math.round(d.seconds / 60)} min</span>
      </div>
      <div class="leg-speed v-${d.verdict.key}">
        ${finite ? Math.round(d.mph).toLocaleString() : '∞'}<small>mph required</small>
      </div>
      <div class="leg-mach">
        Mach ${finite ? d.mach.toFixed(2) : '∞'} at altitude · ${esc(d.verdict.label)}
      </div>
      ${speedBar(finite ? d.mph : 9999)}
      <p style="margin:10px 0 0;font-size:12px;color:var(--ink-dim)">
        That is <strong class="v-routine">${Math.round(d.ferrySpent * 100)}%</strong> of a tanked jet's one-way range.
      </p>
    </div>`;

  $('#findings').innerHTML = a.findings.map((f) => `
    <div class="finding ${f.weight}">
      <h4>${esc(f.title)}</h4>
      <p>${ei(f.text)} ${f.src ? srcTag(f.src) : ''}</p>
    </div>`).join('');
}

function renderRouteCompare() {
  const doc = analyseDocumented();
  const claimLegs = CLAIM_ROUTE.legs.map((l) => legAnalysis(l.from, l.to, 0));
  const claimTotal = claimLegs.reduce((s, l) => s + l.miles, 0);

  const row = (l) => `<div class="cmd-row">
      <div class="t">${Math.round(l.miles)} mi</div>
      <div class="x">${esc(l.from.name)} → ${esc(l.to.name)}</div>
    </div>`;

  $('#route-compare').innerHTML = `
    <p style="color:var(--doc)"><strong>Documented</strong> ${srcTag('press')}</p>
    ${doc.legs.map(row).join('')}
    <p style="margin-top:6px"><strong style="color:var(--doc);font-family:var(--mono)">${Math.round(doc.totalMi)} mi</strong> total, one stop.</p>

    <p style="margin-top:14px;color:var(--claim)"><strong>Required by the claim</strong> ${srcTag('claim')}</p>
    ${claimLegs.map(row).join('')}
    <p style="margin-top:6px"><strong style="color:var(--claim);font-family:var(--mono)">${Math.round(claimTotal)} mi</strong> total: ${(claimTotal / doc.totalMi).toFixed(1)}× the documented route, and ${(claimTotal / F16.ferryRangeMi).toFixed(1)}× the jet's maximum ferry range ${info('ferryRange')}. ${srcTag('derived')}</p>
    <p style="margin-top:9px;font-size:12px">The claimed itinerary crosses the continent three times; the documented one crosses it once.</p>`;
}

/* =============================================================================
   Panels — Flight 93 / debris
   ========================================================================== */

/* Eyewitness reports, rendered under The crash because that is what they
   describe. The data module may hold them as a bare list or as a wrapper with
   a note, and field names are read defensively so this renders whatever shape
   arrives. Where a witness account and the explanation for it differ, both are
   shown: the report is not deleted and the explanation is not omitted. */
function witnessItems() {
  const w = DATA.EYEWITNESS;
  if (!w) return [];
  if (Array.isArray(w)) return w;
  for (const k of ['items', 'witnesses', 'reports', 'list']) {
    if (Array.isArray(w[k])) return w[k];
  }
  return [];
}

/* Turn a string, or an array of them, into paragraphs. The eyewitness note
   holds some sections as one string and some as a list. */
const paras = (v, cls = '') => (Array.isArray(v) ? v : (v ? [v] : []))
  .map((t) => `<p${cls ? ` class="${cls}"` : ''}>${ei(t)}</p>`).join('');

/* The framing this family needs to be read correctly, rendered in the same
   card stack as the accounts themselves rather than on another tab. The data
   module fixes the order and this follows it: what the witnesses said, then
   how the reports were handled, then the explanation offered for them. */
function eyewitnessNoteCard(meta) {
  const sa = meta.secondAircraft;
  const ex = sa && sa.explanation;
  const sections = [];

  if (sa) {
    sections.push(`
      <h4>${esc(sa.title || 'The second aircraft')}</h4>
      ${paras(sa.reports)}
      ${sa.reportsSrc ? `<p class="prov">${srcTag(sa.reportsSrc)}</p>` : ''}
      ${paras(sa.officialHandling)}
      ${sa.officialHandlingSrc ? `<p class="prov">${srcTag(sa.officialHandlingSrc)}</p>` : ''}`);

    if (ex) {
      sections.push(`
        <h4>${esc(ex.title || 'The explanation offered')}</h4>
        ${paras(ex.text)}
        ${ex.quote ? `<blockquote class="ew-quote">${esc(ex.quote)}</blockquote>` : ''}
        ${paras(ex.weight)}
        <p class="prov">${ex.src ? srcTag(ex.src) : ''} ${ex.source ? esc(ex.source) : ''}</p>`);
    }

    if (Array.isArray(sa.otherAircraft) && sa.otherAircraft.length) {
      sections.push(sa.otherAircraft
        .map((o) => `<p>${ei(o.text)} ${o.src ? srcTag(o.src) : ''}</p>`).join(''));
    }
  }

  for (const k of ['missile', 'debris', 'commissionSilence', 'claimSideText']) {
    const s = meta[k];
    if (!s) continue;
    sections.push(`
      <h4>${esc(s.title || k)}</h4>
      ${paras(s.paras)}
      ${paras(s.text)}
      ${paras(s.claimSide)}
      ${paras(s.officialSide)}
      ${paras(s.rovingEngine)}
      ${paras(s.windAttribution)}
      <p class="prov">${s.src ? srcTag(s.src) : ''} ${s.source ? esc(s.source) : ''}</p>`);
  }

  if (Array.isArray(meta.unverified) && meta.unverified.length) {
    sections.push(`
      <h4>Accounts in circulation that are not used here</h4>
      <ul class="ew-unver">${meta.unverified.map((t) => `<li>${ei(t)}</li>`).join('')}</ul>`);
  }

  if (!sections.length) return '';
  return `<div class="card">
      <h3>${esc(meta.title || 'Reading the eyewitness reports')}</h3>
      ${sections.join('')}
    </div>`;
}

function eyewitnessCard() {
  const items = witnessItems();
  if (!items.length) return '';
  /* The records may arrive as a bare array with the framing held separately,
     or as a wrapper carrying both. Either way the framing is found, because
     an unrendered note is the same as no note. */
  const meta = (Array.isArray(DATA.EYEWITNESS) ? DATA.EYEWITNESS_NOTE : DATA.EYEWITNESS) || {};

  const pick = (o, keys) => { for (const k of keys) if (o[k]) return o[k]; return ''; };

  /* Which way a record cuts is a field on the record, not a judgement made
     here. Colour follows the app's existing key: claim yellow for accounts
     that support the allegation, documented green for accounts that cut
     against it, faint for accounts that bear on it without settling it. */
  const WAY = {
    'supports-claim':  { label: 'Supports the claim', tally: 'support the claim', color: 'var(--claim)' },
    'undercuts-claim': { label: 'Cuts against the claim', tally: 'cut against it', color: 'var(--doc)' },
    'neutral':         { label: 'Neither way', tally: 'settle neither way', color: 'var(--ink-faint)' },
  };
  const WAY_ORDER = ['supports-claim', 'undercuts-claim', 'neutral'];

  const rows = items.map((w) => {
    const who = pick(w, ['who', 'name', 'witness']);
    const role = pick(w, ['role', 'place', 'from']);
    const where = pick(w, ['where', 'vantage']);
    const said = pick(w, ['said', 'described', 'account', 'report', 'text', 'what']);
    const quote = pick(w, ['quote']);
    const dist = pick(w, ['distanceText']);
    const cite = pick(w, ['source']);
    const citeNote = pick(w, ['sourceNote']);
    const other = pick(w, ['explanation', 'counter', 'official', 'against', 'differs', 'reading']);
    const otherSrc = pick(w, ['explanationSrc', 'counterSrc', 'officialSrc', 'againstSrc']);
    const way = WAY[w.cutsWhichWay];
    const label = who || role || (typeof w.t === 'number' ? hms(w.t).slice(0, 5) : '');
    const stand = [role, where, dist].filter(Boolean).join('. ');
    return `<div class="cmd-row">
      <div class="t">${esc(label)}</div>
      <div class="x">
        ${stand ? `<div style="color:var(--ink-dim);font-size:11.5px;margin-bottom:3px">${esc(stand)}.</div>` : ''}
        ${ei(said)}
        ${w.src ? srcTag(w.src) : ''}
        ${way ? `<div style="margin-top:4px;font-size:11px;font-family:var(--mono);color:${way.color}">${esc(way.label)}</div>` : ''}
        ${quote ? `<div style="margin-top:5px;padding-left:8px;border-left:2px solid var(--line);color:var(--ink-dim);font-size:11.5px">${esc(quote)}</div>` : ''}
        ${other ? `<div style="margin-top:5px;color:var(--ink-faint)">
          <strong style="color:var(--ink-dim)">Against it:</strong> ${ei(other)} ${otherSrc ? srcTag(otherSrc) : ''}
        </div>` : ''}
        ${cite ? `<div style="margin-top:5px;font-size:11px;color:var(--ink-faint)">${esc(cite)}${citeNote ? ` ${esc(citeNote)}` : ''}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  const tally = items.reduce((a, w) => { if (w.cutsWhichWay) a[w.cutsWhichWay] = (a[w.cutsWhichWay] || 0) + 1; return a; }, {});
  const tallyLine = Object.keys(tally).length
    ? `<p style="font-size:11.5px;color:var(--ink-faint);margin-top:0">
        ${items.length} accounts:
        ${WAY_ORDER.filter((k) => tally[k]).map((k) => `<span style="color:${WAY[k].color}">${tally[k]} ${esc(WAY[k].tally)}</span>`).join(', ')}.
      </p>`
    : '';

  return `<div class="card">
      <h3>Eyewitness reports</h3>
      ${paras(meta.intro)}
      ${tallyLine}
      ${rows}
      ${meta.note ? `<p style="font-size:11.5px;color:var(--ink-faint);margin-top:9px">${ei(meta.note)} ${meta.src ? srcTag(meta.src) : ''}</p>` : ''}
    </div>
    ${eyewitnessNoteCard(meta)}`;
}

function renderDebrisTab() {
  const crater = DEBRIS[0];
  const rows = DEBRIS.map((d) => {
    const mi = haversineMi(crater, d);
    return `<div class="leg" data-debris="${esc(d.name)}">
      <div class="leg-head">
        <span class="leg-name">${esc(d.name)}</span>
        <span class="leg-dist">${mi < 0.1 ? 'origin' : mi.toFixed(2) + ' mi'}</span>
      </div>
      <p style="margin:0;font-size:12px;color:var(--ink-dim);line-height:1.5">${ei(d.note)}</p>
      <div style="margin-top:6px">${srcTag(d.src)}</div>
    </div>`;
  }).join('');

  $('#debris-body').innerHTML = `
    <div class="card">
      <h3>United 93, final minutes ${conflictChip('UA93')}</h3>
      ${refRow('UA93')}
      <p>Departed Newark 25 minutes late, which is the reason the hijackers were still airborne when news of the other three aircraft reached the passengers by phone. ${srcTag('commission')}</p>
      <p>The revolt began at <strong>09:57</strong>. At 09:59 the aircraft was down to <strong>5,000 ft</strong>; the fight for the controls then pitched it back up to about 10,000 before it went over. It hit the ground at <strong>10:03:11</strong>, 40 degrees nose-down and inverted, at about <strong>490 knots (563 mph)</strong> ${info('knots')}. ${srcTag('ntsb')}</p>
      <div class="chip-row">
        <button class="chip" data-act="fly-crash">Fly to the impact site</button>
        <button class="chip" data-act="show-debris">Show debris field</button>
        <button class="chip" data-act="goto-1003">Jump to 10:03</button>
      </div>
    </div>

    <div class="card">
      <h3>${esc(WHY_THEY_MATTER.title)}</h3>
      ${refRows(WHY_THEY_MATTER)}
      ${WHY_THEY_MATTER.paras.map((t) => `<p>${ei(t)}</p>`).join('')}
      <div class="call-split">
        <div class="cs-cell"><b>${CALL_TOTALS.total}</b><span>calls</span></div>
        <div class="cs-cell airfone"><b>${CALL_TOTALS.airfone}</b><span>Airfone</span></div>
        <div class="cs-cell cellular"><b>${CALL_TOTALS.cellular}</b><span>cellular</span></div>
      </div>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        ${esc(CALL_TOTALS.window)}. ${srcTag(CALL_TOTALS.src)}
      </p>
      <div class="chip-row"><button class="chip" data-act="show-calls">Plot the calls</button></div>
    </div>

    <div class="card">
      <h3>${esc(FARADAY.title)}</h3>
      <div class="quote">“${esc(FARADAY.claim)}” ${srcTag(FARADAY.claimSrc)}</div>
      ${refRows(FARADAY)}
      ${FARADAY.answers.map((a) => `
        <div class="finding hard">
          <h4>${esc(a.head)}</h4>
          <p>${ei(a.text)}</p>
          <div style="margin-top:5px">${srcTag(a.src)}</div>
        </div>`).join('')}
      <p style="margin-top:11px">${ei(FARADAY.reading)} ${srcTag(FARADAY.src)}</p>
    </div>

    <div class="card">
      <h3>The calls</h3>
      ${CALLS.map((c) => `
        <div class="call-row ${c.type}">
          <div class="cr-t">${hms(c.t).slice(0, 5)}</div>
          <div>
            <div class="cr-who">${esc(c.who)} <span class="cr-to">→ ${esc(c.to)}</span>
              <span class="cr-type">${c.type === 'cellular' ? 'CELLULAR' : 'Airfone'}</span></div>
            <div class="cr-note">${ei(c.note)} ${c.src ? srcTag(c.src) : ''}</div>
          </div>
        </div>`).join('')}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:9px">
        A representative set, not all ${CALL_TOTALS.total}; many of the total are repeat calls by the same people. Times are approximate to the minute; sources vary by a minute or two on several. ${srcTag('press')}
      </p>
    </div>

    <div class="card">
      <h3>${esc(DEBRIS_NOTE.title)}</h3>
      ${refRow('UA93')}${refRow('SHKV')}${refRows(DEBRIS_NOTE)}
      ${DEBRIS_NOTE.body.split('\n\n').map((p) => `<p>${ei(p)}</p>`).join('')}
      <div>${srcTag(DEBRIS_NOTE.src)}</div>
    </div>

    <div class="card">
      <h3>Recorded debris locations</h3>
      <p style="font-size:11.5px;color:var(--ink-faint)">Distances below are true, computed from the crater coordinates, and the rings on the map mark 1, 3 and 8 true miles. <strong style="color:var(--debris)">The field is drawn on the map at roughly ${DEBRIS_MAGNIFY}× magnification</strong>; an 8-mile scatter is smaller than a single pixel on a map of the whole country. ${srcTag('derived')}</p>
      ${rows}
    </div>

    ${eyewitnessCard()}`;

  $$('#debris-body .chip[data-act]').forEach((b) => b.addEventListener('click', () => {
    const act = b.dataset.act;
    if (act === 'show-calls') {
      state.layers.calls = true;
      map.setCallsVisible(true);
      map.setCalls(ua93StateAt, state.t);
      syncLayerChecks();
      setPlaying(false);
      setTime(10 * 3600 + 3 * 60);
      setFollow(true);
    }
    if (act === 'fly-crash') { setFollow(false); map.flyTo(PLACES.SHKV, 22); }
    if (act === 'show-debris') {
      setFollow(false);
      state.layers.debris = true;
      map.setDebrisVisible(true);
      map.flyTo(map.debrisPos.get(DEBRIS[0].name), 30);
      syncLayerChecks();
    }
    if (act === 'goto-1003') { setPlaying(false); setTime(10 * 3600 + 3 * 60 + 11); }
  }));

  $$('[data-debris]').forEach((el) => el.addEventListener('click', () => {
    const d = DEBRIS.find((x) => x.name === el.dataset.debris);
    if (!d) return;
    setFollow(false);
    state.layers.debris = true;
    map.setDebrisVisible(true);
    map.flyTo(map.debrisPos.get(d.name), 24);
    syncLayerChecks();
  }));
}

/* =============================================================================
   Panels — CRITIC

   The one panel where the subject is a document nobody has read. It is written
   to make the gap legible rather than to paper over it: each message gets its
   DTG, its time against the rest of the morning, what is publicly known of its
   content, and a redaction bar standing in for what is not.
   ========================================================================== */


/* =============================================================================
   The CRITIC against the steelman

   The app is named after these messages and spent a long time arguing the
   shootdown claim without once putting the two next to each other. They belong
   together: the CRITIC sequence is the only minute-stamped record of what the
   government believed while this was supposedly happening, and it brackets the
   alleged shot on both sides.
   ========================================================================== */

function renderCriticVsSteelman() {
  const host = $('#critic-steel');
  if (!host) return;

  const target = hypoTarget();
  const steel = target ? buildHypoTrack(target, state.claimDepart, state.interceptT) : null;
  const ua93 = FLIGHTS.find((f) => f.id === 'UA93');
  const snaps = criticSnapshots(steel, ua93.path, state.interceptT);
  if (!snaps.length) return;

  const row = (k) => {
    if (k.sepMi !== null) {
      return `
        <div class="cmd-row">
          <div class="t" style="color:var(--critic)">${hms(k.c.t).slice(0, 5)}</div>
          <div class="x">
            <strong style="color:var(--ink)">${esc(k.c.mapLabel)}</strong>:
            ${HYPO.callsign} would be <strong class="v-impossible">${Math.round(k.sepMi)} mi</strong>
            from United 93. That is <strong>${k.outsideBy.toFixed(1)}×</strong> the reach of its
            own missile, with ${Math.round(k.minsToShot)} minutes left to close.
            <span style="color:var(--ink-faint)">In sight of it (the two could see each other
            ${Math.round(k.losMi)} mi apart ${info('lineOfSight')}) but not able to shoot at it.</span>
          </div>
        </div>`;
    }
    return `
      <div class="cmd-row">
        <div class="t" style="color:var(--critic)">${hms(k.c.t).slice(0, 5)}</div>
        <div class="x">
          <strong style="color:var(--ink)">${esc(k.c.mapLabel)}</strong>: United 93 has been on
          the ground <strong>${Math.round(k.minsAfterImpact)} minutes</strong>.
          ${k.landed
            ? `${HYPO.callsign} has already landed at Albany.`
            : `${HYPO.callsign} is over Pennsylvania, headed for Albany.`}
        </div>
      </div>`;
  };

  host.innerHTML = `
    ${snaps.map(row).join('')}
    <p style="margin:11px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.55">
      The first two messages go out while the best-case shooter is still tens of miles short.
      That does not rule the claim out on its own: he is closing fast, and the claim needs only
      one instant. The two later messages are the harder question. If an American fighter had
      just destroyed an American airliner, the channel built to reach the President in ten
      minutes is where that would appear, and two messages went out on it after United 93 was down.
    </p>
    <p style="margin:9px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.55">
      The contents of all four messages are withheld, so this app cannot say whether they
      mention a shootdown. The messages are timestamped to the minute, sit in NSA's own files,
      and are withheld under a stated ground that the pending request contests. A record of that
      kind would settle the question either way. ${srcTag('derived')}
    </p>`;
}

function renderCriticTab() {
  const msg = (c) => `
    <div class="leg critic-msg" data-criticjump="${c.id}">
      <div class="leg-head">
        <span class="critic-t">${hms(c.t).slice(0, 5)}</span>
        <span class="dtg">${esc(c.dtg)}</span>
      </div>
      <div class="leg-name" style="margin-bottom:5px">${esc(c.title)}</div>
      <p style="margin:0;font-size:12.5px;color:var(--ink-dim);line-height:1.5">${ei(c.body)}</p>
      <div class="redact"><b>Withheld:</b> ${ei(c.gap)}</div>
      <div class="critic-ctx">${ei(c.context)}</div>
      <div style="margin-top:6px">${srcTag(c.src)} ${conflictChip('CRITIC')}</div>
      ${refRows(c)}
    </div>`;

  $('#critic-body').innerHTML = `
    <div class="card">
      <h3>DIRNSA CRITIC 1-2001: the four withheld messages</h3>
      <p style="font-size:12.5px;color:var(--ink);line-height:1.55">
        A <strong>CRITIC</strong> ${info('critic')} is the most urgent message
        type US intelligence has. It is supposed to be in front of the President within ten
        minutes. Four went out that morning, and what they said is still withheld. That text is
        what the public-records request ${info('foia')} behind this app is asking for.</p>
      ${refRow('NSA_RELEASE')}${refRow('MUCKROCK')}${refRow('KARA_CRITIC')}
      <details class="more">
        <summary>More about how a CRITIC works</summary>
        ${CRITIC_BACKGROUND.paras.map((t) => `<p>${ei(t)}</p>`).join('')}
        <div>${srcTag(CRITIC_BACKGROUND.src)}</div>
        ${refRows(CRITIC_BACKGROUND)}
      </details>
      ${refRow('NSA')}${refRow('NORAD')}${refRow('NEADS')}
    </div>

    <div class="card">
      <h3>DIRNSA CRITIC 1-2001: the chain</h3>
      <p style="font-size:11.5px;color:var(--ink-faint)">The codes beside each time are military timestamps ${info('dtg')}, NSA's own, from its records release. Clock times here are New York time. ${srcTag('foia')}</p>
      ${refRow('NSA_RELEASE')}
      ${CRITIC_CHAIN.map(msg).join('')}
      <div class="leg critic-msg" style="opacity:.75">
        <div class="leg-head">
          <span class="critic-t">13 Sep</span>
          <span class="dtg">${esc(CRITIC_SUMMARY.dtg)}</span>
        </div>
        <div class="leg-name" style="margin-bottom:5px">${esc(CRITIC_SUMMARY.title)}</div>
        <p style="margin:0;font-size:12.5px;color:var(--ink-dim);line-height:1.5">${ei(CRITIC_SUMMARY.body)}</p>
        <div class="redact"><b>Withheld:</b> ${ei(CRITIC_SUMMARY.gap)}</div>
        <div class="critic-ctx">Two days later, so it sits outside this app's clock.</div>
        ${CRITIC_SUMMARY.src ? `<div style="margin-top:6px">${srcTag(CRITIC_SUMMARY.src)}</div>` : ''}
        ${refRows(CRITIC_SUMMARY)}
      </div>
    </div>

    <div class="card critic-steel-card">
      <h3>Where the shootdown claim would have been, each time one went out</h3>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55">
        Every other source in this app describes what happened. The CRITIC describes
        what the government believed was happening, to the minute. Where
        ${esc(HYPO.callsign)}, the best case the shootdown story can have ${info('steelman')},
        would have been at each of these four moments:
      </p>
      <div id="critic-steel"></div>
    </div>

    <div class="card glimpse">
      <h3>${esc(CRITIC_GLIMPSE.title)}</h3>
      ${refRows(CRITIC_GLIMPSE)}
      ${CRITIC_GLIMPSE.items.map((i) => `
        <div class="finding hard">
          <h4>${esc(i.text)}</h4>
          <p>${ei(i.note)}</p>
          <div style="margin-top:5px">${srcTag(i.src)}</div>
        </div>`).join('')}
      <p style="margin-top:11px">${ei(CRITIC_GLIMPSE.reading)}</p>
      <div>${srcTag(CRITIC_GLIMPSE.src)}</div>
    </div>

    <div class="card">
      <h3>Distribution</h3>
      <p>${ei(DISTRIBUTION.note)} ${srcTag(DISTRIBUTION.src)}</p>
      ${refRows(DISTRIBUTION)}
      <div class="chip-row">
        <button class="chip" data-act="show-critic">Show the alert network</button>
      </div>
    </div>

    <div class="card">
      <h3>The pending request</h3>
      <dl class="foia-row">
        <dt>Status</dt><dd>${esc(FOIA.status)}</dd>
        <dt>Filed</dt><dd>${esc(FOIA.filed)}, via <a href="${FOIA.requestUrl}" target="_blank" rel="noopener noreferrer">${esc(FOIA.filedVia)}: &ldquo;${esc(FOIA.requestTitle)}&rdquo;</a></dd>
        <dt>Publication</dt><dd><a href="${FOIA.publishUrl}" target="_blank" rel="noopener noreferrer">${esc(FOIA.publishAt)}</a></dd>
        <dt>Auto-declass</dt><dd>${esc(FOIA.autoDeclass)}</dd>
      </dl>
      <p style="margin-top:9px;font-size:12px">${ei(FOIA.autoDeclassNote)}</p>
      <h3 style="margin-top:14px">What is being asked for</h3>
      <ul class="plain">${FOIA.scope.map((x) => `<li>${ei(x)}</li>`).join('')}</ul>
      <p style="margin-top:10px;font-size:12px;color:var(--ink-faint)">If records are released, they land here: each message against the minute of the morning it was sent, with the rest of the timeline already drawn around it.</p>
      <div>${srcTag(FOIA.src)}</div>
      ${refRows(FOIA)}
    </div>`;

  renderCriticVsSteelman();

  $$('#critic-body .chip[data-act]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.act !== 'show-critic') return;
    state.layers.critic = true;
    map.setCriticVisible(true);
    syncLayerChecks();
    setFollow(false);
    map.resetView();
  }));
}

/* =============================================================================
   Panels — military
   ========================================================================== */

function renderMilitaryTab() {
  const card = (f) => `
    <div class="leg${f.highlight ? ' kernel-leg' : ''}" data-milfly="${f.id}">
      <div class="leg-head">
        <span class="leg-name" style="color:${hex(f.color)};font-family:var(--mono)">${esc(f.label)} ${conflictChip(f.id)}</span>
        <span class="leg-dist">${esc(f.type)}</span>
      </div>
      <div style="font-size:12px;color:var(--ink-dim);line-height:1.5">
        <div><strong style="color:var(--ink)">${esc(f.unit)}</strong></div>
        <div>${esc(f.base)}</div>
        <div class="armed ${/UNARMED/.test(f.armed) ? 'unarmed' : ''}">${esc(f.armed)}</div>
      </div>
      <div style="margin-top:8px">
        ${f.events.map((e) => `<div class="cmd-row"><div class="t">${hms(e[0]).slice(0, 5)}</div><div class="x">${ei(e[1])} ${e[2] ? srcTag(e[2]) : ''}</div></div>`).join('')}
      </div>
      ${refRow(f.id)}${refRows(f)}
      <div class="chip-row"><button class="chip" data-milshow="${f.id}">Fly to</button></div>
    </div>`;

  $('#military-body').innerHTML = `
    <div class="card">
      <h3>What was airborne</h3>
      <p>An air defence built to look outward had a handful of alert fighters for the whole continental United States that morning. This is what got up, when, and where it went. ${srcTag('commission')}</p>
      <p style="font-size:11.5px;color:var(--ink-faint)">Tracks are reconstructions from documented endpoints and events, like the airliner tracks. Callsigns are as recorded on the NEADS ${info('neads')} tapes and in interviews; where sources disagree on a rendering, the entry says so. ${srcTag('recon')}</p>
    </div>

    <div class="card kernel-card">
      <h3>${esc(KERNEL.title)}</h3>
      ${KERNEL.paras.map((p) => `<p>${ei(p)}</p>`).join('')}
      <div style="margin-top:8px">${srcTag(KERNEL.src)}</div>
      ${refRows(KERNEL)}
      <div class="chip-row">
        <button class="chip" data-milshow="QUIT">Fly to QUIT flight</button>
        <button class="chip" data-milshow="GOFER">Fly to GOFER 06</button>
      </div>
    </div>

    <div class="card">
      <h3>Tracked aircraft</h3>
      ${MIL_FLIGHTS.map(card).join('')}
    </div>

    <div class="card">
      <h3>Callsign reference</h3>
      <p style="font-size:11.5px;color:var(--ink-faint)">The wider radio picture, including aircraft with no track drawn here.</p>
      ${CALLSIGNS.map((c) => `
        <div class="cs-row">
          <div class="cs-name">${esc(c.cs)}${/GOFER/.test(c.cs) ? ' ' + conflictChip('GOFER') : ''}${/BULLY/.test(c.cs) ? ' ' + conflictChip('BULLY') : ''}</div>
          <div>
            <div class="cs-what">${ei(c.what)}</div>
            <div class="cs-note">${ei(c.note)}</div>
            <div style="margin-top:4px">${srcTag(c.src)}</div>
            ${refRows(c)}
          </div>
        </div>`).join('')}
    </div>`;

  $$('[data-milshow]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    showMil(b.dataset.milshow);
  }));
}

/* Fly to wherever that aircraft is at the current clock time, re-enabling its
   track first in case the user has switched it off. */
function showMil(id) {
  setFollow(false);
  state.layers[id] = true;
  map.setFlightVisible(id, true);
  syncLayerChecks();
  map.setTime(state.t);
  const f = MIL_FLIGHTS.find((x) => x.id === id);
  if (!f) return;
  const sm = samplePath(f.path, Math.max(state.t, f.path[0][0]));
  if (sm) map.flyTo(sm, 60);
}

/* =============================================================================
   Panels — conflicts

   The register is rendered strongest-reading-first, with the app's own known
   defects shown in the same list as everyone else's contradictions. That is
   the point: an app that grades its sources should be gradeable itself.
   ========================================================================== */

/* A small inline marker other panels can drop next to an affected record. */
/* A tag names a group of register entries; an id names one. Chips carry
   either, so both are resolved here. */
function conflictsForKey(key) {
  const byTag = conflictsFor(key);
  if (byTag.length) return byTag;
  const one = CONFLICTS.find((c) => c.id === key);
  return one ? [one] : [];
}

function conflictChip(tag) {
  const cs = conflictsForKey(tag);
  if (!cs.length) return '';
  const bad = cs.filter((c) => c.status === 'todo').length;
  const n = cs.length;
  return `<button class="cflag ${bad ? 'bad' : ''}" data-cjump="${esc(tag)}"
    title="${n} recorded ${n === 1 ? 'discrepancy affects' : 'discrepancies affect'} this record">${n} ${n === 1 ? 'dispute' : 'disputes'}</button>`;
}

function renderConflictsTab() {
  renderCertainty();
  renderCorrections();
  const card = (c) => {
    const st = STATUS_META[c.status];
    return `
    <div class="card conflict" id="cf-${c.id}" data-tags="${esc(c.tags.join(' '))}">
      <div class="cf-head">
        <span class="cf-status ${st.tone}">${esc(st.label)}</span>
        <span class="cf-tags">${c.tags.map(esc).join(' · ')}</span>
      </div>
      <h4 class="cf-subject">${esc(c.subject)}</h4>
      <p class="cf-why">${ei(c.why)}</p>
      ${refRows(c)}
      <div class="cf-readings">
        ${c.readings.map((r, i) => `
          <div class="cf-reading${i === 0 ? ' first' : ''}">
            <div class="cf-v">${ei(r.v)}</div>
            <div class="cf-who">${esc(r.who)} ${srcTag(r.src)}</div>
            <div class="cf-weight">${ei(r.weight)}</div>
          </div>`).join('')}
      </div>
      <div class="cf-reading-note"><strong>Reading:</strong> ${ei(c.reading)}</div>
      ${c.appSays ? `<div class="cf-app"><strong>In this app:</strong> ${ei(c.appSays)}</div>` : ''}
    </div>`;
  };

  const counts = {};
  for (const c of CONFLICTS) counts[c.status] = (counts[c.status] || 0) + 1;

  $('#conflicts-body').innerHTML = `
    <div class="card">
      <h3>Sources and disputes</h3>
      <div id="cf-showing" class="cf-showing hidden"></div>
      <p>Every account of that morning conflicts with some other account somewhere. Each known discrepancy is recorded here with its competing readings and, where one can be had, a view on which deserves more weight.</p>
      <p>This app's own errors are in the same list, under the same headings. ${srcTag('derived')}</p>
      <div class="cf-legend">
        ${Object.entries(STATUS_META).map(([k, m]) => `
          <div class="cf-legend-row">
            <span class="cf-status ${m.tone}">${esc(m.label)}</span>
            <span>${esc(m.blurb)}</span>
            <span class="cf-n">${counts[k] || 0}</span>
          </div>`).join('')}
      </div>
    </div>
    ${CONFLICTS.map(card).join('')}`;
}

/* The 'Showing disputes about' line at the top of the Sources tab. A plain
   tap on the tab clears it (see gotoTab). */
function setConflictHeader(text) {
  const el = $('#cf-showing');
  if (!el) return;
  if (!text) { el.classList.add('hidden'); el.textContent = ''; return; }
  el.textContent = `Showing disputes about: ${text}`;
  el.classList.remove('hidden');
}

/* Jump from an inline marker to the first matching register entry. */
function jumpToConflict(key) {
  gotoTab('conflicts');
  const cs = conflictsForKey(key);
  const first = cs[0];
  if (!first) { setConflictHeader(''); return; }
  const label = conflictsFor(key).length ? key : first.subject;
  setConflictHeader(label);
  const el = $(`#cf-${first.id}`);
  if (el) {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    el.classList.add('cf-hit');
    setTimeout(() => el.classList.remove('cf-hit'), 1600);
  }
}

/* The 'Next' footer at the bottom of every tab: one road through the app in
   the order the argument is made, and a way back to the start. */
const TAB_ORDER = ['brief', 'claim', 'aware', 'critic', 'timeline', 'conflicts'];
const TAB_LABELS = {
  brief: 'Start here', claim: 'The claim', aware: 'Who knew', critic: 'CRITIC',
  timeline: 'Timeline', conflicts: 'Sources',
};

function nextRow(name) {
  const i = TAB_ORDER.indexOf(name);
  const next = TAB_ORDER[(i + 1) % TAB_ORDER.length];
  return `<div class="next-row">
    <button class="chip chip-next" data-goto="${next}">Next: ${esc(TAB_LABELS[next])} &rarr;</button>
    ${name !== 'brief' ? `<button class="chip" data-goto="brief">Back to Start here</button>` : ''}
  </div>`;
}

function renderNextRows() {
  for (const name of TAB_ORDER) {
    const host = $(`#${name}-next`);
    if (host) host.innerHTML = nextRow(name);
  }
}

/* =============================================================================
   Panels — layers
   ========================================================================== */

/* Push one layer's state at the map. The drawer's checkboxes, the Simple /
   Full switch and the panels' chips all end up here. */
function applyLayer(k) {
  const on = !!state.layers[k];
  if (FLIGHTS.some((f) => f.id === k) || MIL_FLIGHTS.some((f) => f.id === k)) {
    map.setFlightVisible(k, on);
  }
  else if (k === 'debris') map.setDebrisVisible(on);
  else if (k === 'critic') map.setCriticVisible(on);
  else if (k === 'aware') map.setAwarenessVisible(on);
  else if (k === 'hypo') { map.setHypoVisible(on); if (on) updateHypo(); }
  else if (k === 'calls') { map.setCallsVisible(on); map.setCalls(ua93StateAt, state.t); }
  else if (k === 'trail') { map.setTrailVisible(on); map.setTrail(state.t); }
  else if (k === 'envelope' || k === 'wez') {
    map.setReachVisible(state.layers.envelope || state.layers.wez);
    updateReach();
  }
  else if (k === 'maxClean') { map.setMaxCleanVisible(on); updateReach(); }
  else if (k === 'routeDoc') map.setRouteVisible('documented', on);
  else if (k === 'routeClaim') map.setRouteVisible('claim', on);
  else if (k === 'places') map.placeGroup.visible = on;
  map.setTime(state.t);
}

/* The Simple / Full switch reads the group: Full when every grouped layer
   is on, Simple when none is, and neither when the reader has mixed them. */
function syncModeSwitch() {
  const all = FULL_LAYERS.every((k) => state.layers[k]);
  const none = FULL_LAYERS.every((k) => !state.layers[k]);
  $$('[data-mode]').forEach((b) => {
    b.classList.toggle('on', (b.dataset.mode === 'full' && all) || (b.dataset.mode === 'simple' && none));
  });
}

function setLayerMode(mode) {
  for (const k of FULL_LAYERS) state.layers[k] = mode === 'full';
  syncLayerChecks();
  applyAllLayers();
}

/* The last six minutes, rendered as its marked beats rather than as all 371
   rows. A reader asking to understand something needs a shape before a
   database; the full second-by-second array is one toggle away and is the same
   data. The rung filter is the certainty ladder made operable: ask for measured
   only, and watch most of the narration go. */
let reconRung = 'all';
let reconAll = false;

function reconVoiceHTML(v) {
  const cls = v.kind.replace(/-shout$/, '');
  const shout = /-shout$/.test(v.kind) ? ' rv-shout' : '';
  const tag = cls === 'arabic' ? 'translated from Arabic'
    : cls === 'english' ? 'English as spoken'
      : cls === 'mixed' ? 'Arabic with English words' : '';
  return `<div class="rv rv-${cls}${shout}">
    ${v.who ? `<span class="rv-who">${v.who}</span>` : ''}
    ${v.text ? `<span class="rv-text">${v.text}</span>` : ''}
    ${v.note ? `<span class="rv-note">${v.note}</span>` : ''}
    ${tag ? `<span class="rv-tag">${tag}</span>` : ''}
  </div>`;
}

function renderRecon() {
  const host = $('#recon-host');
  if (!host) return;
  const beats = RECONSTRUCTION.filter((r) => r.beat);
  const shown = beats.filter((b) => reconRung === 'all' || b.beatRung === reconRung);
  const rungs = ['all', ...new Set(beats.map((b) => b.beatRung))];

  const block = (b) => {
    const near = RECONSTRUCTION.filter(
      (r) => Math.abs(r.t - b.t) <= 3 && r.voices.length,
    ).flatMap((r) => r.voices);
    const st = [
      b.alt != null ? `${b.alt.toLocaleString()} ft` : null,
      b.roll != null ? `roll ${b.roll}\u00b0` : null,
      b.pitch != null ? `pitch ${b.pitch}\u00b0` : null,
      b.g != null ? `${b.g} g` : null,
    ].filter(Boolean);
    return `<li class="beat" data-rung="${b.beatRung}">
      <div class="beat-t">${hms(b.t)}</div>
      <div class="beat-main">
        <p class="beat-head">${expandInfo(b.beat)}</p>
        ${b.beatNote ? `<p class="beat-note">${expandInfo(b.beatNote)}</p>` : ''}
        ${st.length ? `<div class="beat-state">${st.join('<span class="sep">\u00b7</span>')}</div>` : ''}
        ${near.length ? `<div class="beat-voices">${near.map(reconVoiceHTML).join('')}</div>` : ''}
        <span class="pill cert-pill cert-${b.beatRung}">${b.beatRung}</span>
      </div>
    </li>`;
  };

  const rowLine = (r) => `<tr>
    <td class="mono">${hms(r.t)}</td>
    <td class="mono num">${r.alt != null ? r.alt.toLocaleString() : ''}</td>
    <td class="mono num">${r.roll != null ? r.roll : ''}</td>
    <td class="mono num">${r.pitch != null ? r.pitch : ''}</td>
    <td class="mono num">${r.g != null ? r.g : ''}</td>
    <td>${r.voices.map((v) => `<span class="rv-mini rv-${v.kind.replace(/-shout$/, '')}">${v.text || v.note}</span>`).join(' ')}</td>
  </tr>`;

  host.innerHTML = `
    <section class="card recon">
      <p class="kicker">The record</p>
      <h2>The last six minutes</h2>
      <p class="recon-range">09:57:00 to 10:03:11, the revolt to the ground.</p>
      <p class="sec-note">${RECON_NOTE}</p>
      <div class="recon-filter">
        <span class="rf-label">Show</span>
        ${rungs.map((r) => `<button class="chip${r === reconRung ? ' on' : ''}" data-rung="${r}">${r === 'all' ? 'everything' : r}</button>`).join('')}
      </div>
      <ol class="beats">${shown.map(block).join('')}</ol>
      ${shown.length === 0 ? '<p class="sec-note">Nothing in this reconstruction sits on that rung.</p>' : ''}
      <button class="chip" id="recon-toggle">${reconAll ? 'Hide' : 'Show'} every recorded second (${RECONSTRUCTION.length} rows)</button>
      ${reconAll ? `<div class="recon-table-wrap"><table class="recon-table">
        <thead><tr><th>time</th><th>alt ft</th><th>roll</th><th>pitch</th><th>g</th><th>voices and sounds</th></tr></thead>
        <tbody>${RECONSTRUCTION.map(rowLine).join('')}</tbody></table></div>` : ''}
    </section>`;

  host.querySelectorAll('[data-rung]').forEach((btn) => {
    if (btn.tagName !== 'BUTTON') return;
    btn.addEventListener('click', () => { reconRung = btn.dataset.rung; renderRecon(); });
  });
  const tg = $('#recon-toggle');
  if (tg) tg.addEventListener('click', () => { reconAll = !reconAll; renderRecon(); });
}

/* Corrections. Dated, with the wrong version kept beside the right one. */
function renderCorrections() {
  const host = $('#corrections-host');
  if (!host) return;
  host.innerHTML = `
    <section class="card">
      <h2>Corrections</h2>
      <p class="sec-note">${CORRECTIONS_NOTE}</p>
      <ol class="corr">
        ${CORRECTIONS.map((c) => `
          <li class="corr-item">
            <div class="corr-head"><span class="corr-date mono">${c.on}</span>
              <span class="pill cert-pill cert-${c.rung}">${c.rung}</span></div>
            <p class="corr-what">${expandInfo(c.what)}</p>
            <p class="corr-wrong"><span class="corr-k">Said</span>${expandInfo(c.wrong)}</p>
            <p class="corr-right"><span class="corr-k">Now</span>${expandInfo(c.right)}</p>
            <p class="corr-why"><span class="corr-k">Why</span>${expandInfo(c.why)}</p>
          </li>`).join('')}
      </ol>
    </section>`;
}

/* The certainty ladder. Rendered beside the glossary because it is the same
   kind of thing: a key to how the rest of the app should be read. */
function renderCertainty() {
  const host = $('#certainty-host');
  if (!host) return;
  host.innerHTML = `
    <section class="card">
      <h2>How well is each thing known?</h2>
      <p class="sec-note">${CERTAINTY_NOTE}</p>
      <ol class="certainty">
        ${CERTAINTY.map((c) => `
          <li class="cert cert-${c.id}">
            <div class="cert-head">
              <span class="cert-rank">${c.rank}</span>
              <span class="cert-label">${c.label}</span>
              ${srcTag(c.src)}
            </div>
            <p class="cert-gloss">${expandInfo(c.gloss)}</p>
            <p class="cert-detail">${expandInfo(c.detail)}</p>
            <ul class="cert-ex">${c.examples.map((e) => `<li>${expandInfo(e)}</li>`).join('')}</ul>
          </li>`).join('')}
      </ol>
    </section>`;
}

/* The layers drawer. Rendered once at boot into #layers-body, which lives
   inside #layers-drawer on the stage; it is the single home of every
   [data-layer] checkbox, so syncLayerChecks has one place to look. */

function renderLayersTab() {
  const toggle = (key, swatch, label, meta, extra = '') => `
    <label class="toggle">
      <input type="checkbox" data-layer="${key}" ${state.layers[key] ? 'checked' : ''}>
      <span class="swatch" style="background:${swatch}"></span>
      <span>${label}</span>
      <span class="meta">${meta}${extra}</span>
    </label>`;

  const fl = FLIGHTS.map((f) => `
    ${toggle(f.id, hex(f.color), esc(f.label), esc(f.type.replace('Boeing ', 'B')))}
    ${refRow(f.id, 'ref-indent')}`).join('');

  /* A flight carrying a pathNote is the difference between what the recorder
     says and what this app drew. Kept, behind one disclosure. */
  const notes = FLIGHTS.filter((f) => f.pathNote).map((f) => `
    <p style="font-size:11px;color:var(--ink-faint);line-height:1.55;margin:6px 0 8px;
        border-left:2px solid var(--line-2);padding-left:8px">
      <strong style="color:var(--ink-dim)">${esc(f.label)}.</strong> ${ei(f.pathNote)} ${srcTag(f.src)}</p>`).join('');

  $('#layers-body').innerHTML = `
    <div class="card">
      <div class="mode-switch" role="group" aria-label="How much to draw">
        <button data-mode="simple">Simple</button>
        <button data-mode="full">Full</button>
      </div>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Simple draws the aircraft, the places and the four messages. Full adds the reach rings,
        the missile range, the recorder points, the phone calls and the who-knew network.
      </p>
      <div class="legend-key in-drawer">
        <div><i style="background:#35d6a4"></i>How far he could have flown, at cruise</div>
        <div><i style="background:#ffd447"></i>Fastest possible</div>
        <div><i class="dash" style="border-color:#ff8a5c"></i>Fuel limit</div>
        <div><i class="dash" style="border-color:#fff"></i>STEELMAN, the constructed track</div>
        <div><i style="background:#ff1f3d"></i>The four withheld messages</div>
      </div>
    </div>

    <div class="card">
      <h3>Geometry of the claim</h3>
      ${toggle('envelope', '#ffd447', 'How far the fighter could have flown (rings)', 'reach envelope', ' ' + info('ferryRange'))}
      ${toggle('wez', '#ff4d4d', `Missile range (Sidewinder, ${Math.round(AIM9.rMaxMi)} mi)`, 'engagement zone', ' ' + info('wez'))}
      ${toggle('trail', 'var(--ua93)', 'Points the flight recorders confirm', 'FDR', ' ' + info('fdr'))}
      ${toggle('calls', '#74c7ff', 'Phone calls from United 93', `${CALL_TOTALS.total} calls`, ' ' + info('airfone'))}
      ${toggle('aware', '#35d6a4', 'Who knew, and when', 'FAA &rarr; military', ' ' + info('neads'))}
      ${toggle('hypo', '#fff', 'The fighter the claim needs (built here)', esc(HYPO.callsign), ' ' + info('steelman'))}
      ${toggle('maxClean', '#ffffff', 'Mach 2.0 ring (clean jet, not available to the claim)', 'Full only', ' ' + info('placard'))}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Rings grow from the departure time set on the claim tab. The red ring is the missile's reach drawn from Fargo, the only place he is documented to have been; at national zoom it is a dot. The constructed fighter carries the same ring with it. ${srcTag('derived')}
      </p>
    </div>

    <div class="card">
      <h3>Alert network</h3>
      ${toggle('critic', 'var(--critic)', 'The four withheld messages', 'CRITIC chain', ' ' + info('critic'))}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Links appear as the clock reaches each date-time group ${info('dtg')}. Solid is documented; dashed is where a CRITIC is designed to land, since the addressee lists are redacted. ${srcTag('foia')}
      </p>
    </div>

    <div class="card">
      <h3>Hijacked aircraft</h3>
      ${fl}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Tracks are reconstructions: documented positions and times, with the segments between them interpolated. The shape is indicative, not radar data. United 93 and American 77 are the two whose recorders ${info('fdr')} were recovered, so their altitudes and timings are FDR values. American 11 and United 175 have no recorder at all. ${srcTag('recon')}
      </p>
      ${notes ? `<details class="more"><summary>Why this track is drawn this way</summary>${notes}</details>` : ''}
    </div>

    <div class="card">
      <h3>Military aircraft</h3>
      ${MIL_FLIGHTS.map((f) => toggle(f.id, hex(f.color),
        `<span style="font-family:var(--mono);font-size:11.5px">${esc(f.label)}</span>`, esc(f.type.split(' ')[0]))).join('')}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Shown by default. QUIT flight is the North Dakota Air National Guard detachment at Langley, the unit at the centre of the claim. ${srcTag('press')}
      </p>
    </div>

    <div class="card">
      <h3>Gibney routes</h3>
      ${toggle('routeDoc', 'var(--doc)', 'Documented route', 'solid')}
      ${toggle('routeClaim', 'var(--claim)', 'Route required by the claim', 'dashed')}
    </div>

    <div class="card">
      <h3>Ground</h3>
      ${toggle('debris', 'var(--debris)', 'Flight 93 debris field', `${DEBRIS_MAGNIFY}× mag`)}
      ${toggle('places', '#9fb6cc', 'Airports &amp; landmarks', '')}
    </div>`;

  const gh = $('#glossary-host');
  if (gh) gh.innerHTML = `
    <div class="card">
      <h3>Plain-English glossary</h3>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55">Every technical term this
      app uses, in ordinary words. The same definitions sit behind the small
      <span class="ii" style="cursor:default;pointer-events:none"></span> marks throughout the
      page; click one wherever you see it.</p>
      ${glossaryList().map((g) => `
        <div class="gl-row">
          <div class="gl-term">${esc(g.term)}</div>
          <div class="gl-plain">${esc(g.plain)}</div>
          ${g.more ? `<div class="gl-more">${esc(g.more)}</div>` : ''}
          <div class="ref-row">${srcTag(g.src)}${g.link ? `<a class="ref ref-wiki" href="${g.link.url}"
            target="_blank" rel="noopener noreferrer">${esc(g.link.label)}</a>` : ''}</div>
        </div>`).join('')}
    </div>`;

  const mh = $('#mapkey-host');
  if (mh) mh.innerHTML = `
    <div class="card">
      <h3>How to read this map ${conflictChip('DATA')}</h3>
      <p>States are real geometry: US Census cartographic boundaries at 1:10,000,000, extruded. Alaska, Hawaii and Puerto Rico sit in the conventional insets and are <em>not</em> at true position or scale. ${srcTag('geo')}</p>
      <p>The vertical axis defaults to <strong>true scale</strong>, the same units up as across. That makes the tracks look nearly flat, which is accurate: a cruising airliner is about 1:${Math.round(trueScaleRatio()).toLocaleString()} against the width of the country. The control in the map legend raises it to 2× or 5× when you need to read altitude structure, and says so whenever it is not 1.</p>
      <p>Provenance badges ${info('provenance')} appear on every claim in this app: <span class="src solid">solid</span> for the documentary record, <span class="src soft">soft</span> for reconstruction or arithmetic done here, <span class="src warn">warn</span> for an allegation being tested.</p>
      <div class="legend-key in-drawer">
        <div><i style="background:#35d6a4"></i>Green ring: how far he could have flown, at cruise</div>
        <div><i style="background:#ffd447"></i>Yellow ring: fastest possible</div>
        <div><i class="dash" style="border-color:#ff8a5c"></i>Orange dashed: fuel limit</div>
        <div><i class="dash" style="border-color:#fff"></i>White dashed: STEELMAN, the constructed track</div>
        <div><i style="background:#ff1f3d"></i>Red: the four withheld messages</div>
      </div>
    </div>`;

  $$('[data-layer]').forEach((cb) => cb.addEventListener('change', () => {
    state.layers[cb.dataset.layer] = cb.checked;
    applyLayer(cb.dataset.layer);
    syncModeSwitch();
  }));
  $$('[data-mode]').forEach((b) => b.addEventListener('click', () => setLayerMode(b.dataset.mode)));
  syncModeSwitch();
}

function syncLayerChecks() {
  $$('[data-layer]').forEach((cb) => { cb.checked = !!state.layers[cb.dataset.layer]; });
  syncModeSwitch();
}

function setDrawerOpen(open) {
  const d = $('#layers-drawer');
  if (!d) return;
  d.classList.toggle('hidden', !open);
  const b = $('#btn-layers');
  if (b) { b.classList.toggle('on', open); b.setAttribute('aria-expanded', String(open)); }
}

/* =============================================================================
   Labels overlay
   ========================================================================== */

const labelEls = new Map();

/* Where a pin label may sit relative to its anchor, tried in order: above
   first, then round the compass. dx/dy are in label half-widths / heights. */
const PIN_FAN = [
  { dx: 0, dy: -1 }, { dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 },
  { dx: 0, dy: 1 }, { dx: -1, dy: 1 }, { dx: -1, dy: 0 }, { dx: -1, dy: -1 },
];

/* The freshest two of a set of arc badges are shown; the rest fold into the
   second one as 'and N earlier', so the map never fills with old messages. */
function capBadges(list) {
  const sorted = [...list].sort((a, b) => (b.t ?? 0) - (a.t ?? 0));
  if (sorted.length <= 2) return sorted;
  const keep = sorted.slice(0, 2);
  const n = sorted.length - 2;
  keep[1] = { ...keep[1], text: `${keep[1].text} · and ${n} earlier` };
  return keep;
}

function drawLabels() {
  const wanted = new Map();
  const phone = isPhone();

  if (state.layers.places) {
    for (const { key, mesh, p } of map.placeDots) {
      wanted.set(`p:${key}`, { pos: mesh.position, text: p.short || p.name, cls: 'dim', rank: 3 });
    }
  }

  // NORAD, where the CRITIC chain starts, is a place on this map from the start.
  if (map.criticNodePos && map.criticNodePos.NORAD) {
    wanted.set('p:NORAD', { pos: map.criticNodePos.NORAD, text: 'NORAD', cls: 'dim', rank: 2.9 });
  }

  for (const [id, o] of map.flightObjs) {
    if (!o.visible) continue;
    if (o.marker.visible) {
      const s = o.sample;
      const name = o.isMil
        ? (phone ? (id === 'QUIT' ? 'QUIT F-16' : id) : (o.f.label || id))
        : id;
      wanted.set(`f:${id}`, {
        pos: o.marker.position,
        text: `${name} · ${Math.round((s?.altFt ?? 0) / 100) * 100} ft`,
        cls: 'flight', color: hex(o.f.color), rank: o.isMil ? 1.5 : 0,
      });
    } else if (o.impact.visible) {
      wanted.set(`f:${id}`, { pos: o.impact.position, text: `${id} impact`, cls: 'flight', color: hex(o.f.color), rank: 1 });
    }
  }

  if (!phone && map.hypoGroup && map.hypoGroup.visible && map.hypoHorizonInfo) {
    const hz = map.hypoHorizonInfo;
    wanted.set('horizon', {
      ringLL: hz.ringLL, order: hz.order,
      text: `How far he could see · ${Math.round(hz.miles)} mi`,
      cls: 'ring', color: hex(LOS_HORIZON.color), rank: 0.05,
    });
  }

  if (map.hypoGroup && map.hypoGroup.visible && map.hypoLosInfo) {
    const li = map.hypoLosInfo;
    const mi = li.miles < 1 ? li.miles.toFixed(2) : Math.round(li.miles).toLocaleString();
    wanted.set('los', {
      pos: li.mid,
      text: phone
        ? `${mi} mi${li.inWez ? ' · IN RANGE' : ''}`
        : `${HYPO.callsign} → UA93 · ${mi} mi${li.inWez ? ' · WITHIN AIM-9 RANGE' : ''}`,
      cls: `flight los${li.inWez ? ' hot' : ''}`,
      color: li.inWez ? '#ff4d4d' : li.miles <= 50 ? '#ffd447' : '#9fb6cc',
      rank: 0.06,
    });
  }

  if (map.hypoGroup && map.hypoGroup.visible && map.hypoMarker.visible) {
    const sm = map._hypoSample;
    wanted.set('hypo', {
      pos: map.hypoMarker.position,
      text: `${HYPO.callsign} · CONSTRUCTED · ${Math.round((sm?.altFt ?? 0) / 100) * 100} ft`,
      cls: 'flight hypo', color: '#ffffff', rank: 0.07,
    });
  }

  /* The awareness handoffs, capped to the freshest two, and a standing
     counter on the military node. */
  const aw = map.awarenessLabels();
  const awDark = aw.filter((l) => l.dark);
  for (const al of [...awDark, ...capBadges(aw.filter((l) => !l.dark))]) {
    wanted.set(al.key, {
      pos: al.pos,
      text: al.text,
      cls: `aware-line aw-${al.actor}${al.fresh ? ' fresh' : ''}${al.dark ? ' dark' : ''}`,
      rank: al.dark ? 0.15 : 0.35,
    });
  }

  /* The CRITIC arcs, named as each message fires. These outrank almost
     everything else on the map: the withheld messages are the subject. */
  for (const cl of capBadges(map.criticLabels())) {
    wanted.set(cl.key, {
      pos: cl.pos,
      text: cl.text,
      cls: `critic-line${cl.fresh ? ' fresh' : ''}`,
      rank: 0.2,
    });
  }

  // Ring labels are desktop only: on a phone there is no room beside a ring.
  if (!phone && map.reachGroup.visible && map.reachLabelAnchors) {
    for (const a of map.reachLabelAnchors) {
      wanted.set(`r:${a.key || a.text}`, {
        ringLL: a.ringLL, order: a.order, text: a.text, title: a.title,
        cls: 'ring', color: hex(a.color), rank: 2.5,
      });
    }
  }

  if (map.debrisGroup.visible) {
    for (const m of map.debrisGroup.children) {
      if (m.userData.kind !== 'debris') continue;
      wanted.set(`d:${m.userData.name}`, { pos: m.position, text: m.userData.name, cls: 'dim', rank: 2 });
    }
  }

  for (const [k, el] of labelEls) {
    if (!wanted.has(k)) { el.remove(); labelEls.delete(k); }
  }

  const host = $('#labels');
  const W = host.clientWidth, H = host.clientHeight;
  const M = 6;   // nothing is placed closer than this to the stage edge

  /* Seed the declutter with the HUD, legend and buttons so a label never
     lands underneath them. They are HTML siblings, not part of the scene, so
     the layout has no other way to know they are in the way. */
  const hostBox = host.getBoundingClientRect();
  const taken = ['#hud', '#legend', '#aside-toggle', '#btn-layers', '#layers-drawer:not(.hidden)', '#tour:not(.hidden)']
    .map((sel) => {
      const el = $(sel);
      if (!el || !el.offsetParent) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return {
        l: r.left - hostBox.left - 6, r: r.right - hostBox.left + 6,
        t: r.top - hostBox.top - 6, b: r.bottom - hostBox.top + 6,
      };
    }).filter(Boolean);

  const overlaps = (box) => taken.some((o) => box.l < o.r + 2 && box.r > o.l - 2 && box.t < o.b + 2 && box.b > o.t - 2);
  const inside = (box) => box.l > M && box.t > M && box.r < W - M && box.b < H - M;

  // Strictly rank order: the flight pins are registered before any place label.
  const ordered = [...wanted.entries()].sort((a, b) => (a[1].rank ?? 9) - (b[1].rank ?? 9));

  for (const [k, w] of ordered) {
    let el = labelEls.get(k);
    if (!el) {
      el = document.createElement('div');
      el.innerHTML = '<i class="lead"></i><span class="lt"></span>';
      host.appendChild(el);
      labelEls.set(k, el);
    }
    const lt = el.lastElementChild;
    if (lt.textContent !== w.text) lt.textContent = w.text;
    el.className = `map-label ${w.cls}`;
    if (w.title !== undefined) el.title = w.title || '';
    if (w.color) el.style.color = w.color;

    // The label box, measured before anything is placed, so the fit test is
    // on the box rather than on the anchor point.
    const w2 = (el.offsetWidth || w.text.length * 6.5) / 2;
    const h = el.offsetHeight || 16;
    const lead = el.firstElementChild;

    if (w.ringLL) {
      /* A ring label walks its own ring, from the preferred bearing outward,
         and stops at the first vertex whose label box is on screen and clear
         of everything placed so far. If none fits, it is hidden rather than
         clipped. The box sits just above the ring point, with a tick down
         to it. */
      let box = null, s = null;
      for (const i of w.order) {
        const q = map.llToScreen(w.ringLL[i]);
        if (q.behind) continue;
        const b = { l: q.x - w2, r: q.x + w2, t: q.y - h - 7, b: q.y };
        if (inside(b) && !overlaps(b)) { box = b; s = q; break; }
      }
      if (!box) { el.style.display = 'none'; continue; }
      taken.push(box);
      el.style.display = '';
      el.style.left = `${box.l}px`;
      el.style.top = `${box.t}px`;
      lead.style.display = '';
      lead.style.left = `${w2}px`;
      lead.style.top = `${h}px`;
      lead.style.width = '1px';
      lead.style.height = '7px';
      lead.style.transform = '';
      continue;
    }

    const s = map.toScreen(w.pos);
    if (s.behind || s.x < -60 || s.y < -30 || s.x > W + 60 || s.y > H + 30) {
      el.style.display = 'none';
      continue;
    }

    /* Pin labels try a fan of offsets round the anchor before giving up,
       and are never placed outside the stage. A short leader ties the box
       back to the point it names. */
    const gap = 8;
    let box = null, off = null;
    for (const f of PIN_FAN) {
      const cx = s.x + f.dx * (w2 + gap);
      const cy = s.y + f.dy * (h * 0.5 + gap);
      const b = { l: cx - w2, r: cx + w2, t: cy - h / 2, b: cy + h / 2 };
      if (inside(b) && !overlaps(b)) { box = b; off = f; break; }
    }
    if (!box) { el.style.display = 'none'; continue; }

    taken.push(box);
    el.style.display = '';
    el.style.left = `${box.l}px`;
    el.style.top = `${box.t}px`;

    // Leader: from the anchor to the near edge of the box, in box coordinates.
    const ax = s.x - box.l, ay = s.y - box.t;
    const ex = Math.max(0, Math.min(2 * w2, ax));
    const ey = Math.max(0, Math.min(h, ay));
    const len = Math.hypot(ax - ex, ay - ey);
    if (len < 2) { lead.style.display = 'none'; }
    else {
      lead.style.display = '';
      lead.style.left = `${ex}px`;
      lead.style.top = `${ey}px`;
      lead.style.width = `${len}px`;
      lead.style.height = '1px';
      lead.style.transform = `rotate(${Math.atan2(ay - ey, ax - ex)}rad)`;
    }
    void off;
  }
}


/* =============================================================================
   Picking + tooltip
   ========================================================================== */

function handlePick(ud) {
  if (!ud) { hideTip(); return; }
  if (ud.kind === 'state') {
    showTipAt(ud.name, `FIPS ${ud.id}`, 'geo');
  } else if (ud.kind === 'debris') {
    showTipAt(ud.name, ud.note, ud.src);
  } else if (ud.kind === 'datum') {
    showTipAt(`${ud.mark === '\u2022' ? '' : ud.mark + ' — '}${ud.label}`,
      `${ud.flight || ''} · ${hms(ud.t)} · ${Math.round(ud.altFt).toLocaleString()} ft\nA point where the recorder says something. Between these, the track is interpolated.`,
      ud.src);
  } else if (ud.kind === 'call') {
    showTipAt(`${ud.who} → ${ud.to}`,
      `${ud.callType === 'cellular' ? 'CELLULAR' : 'Airfone'} · ${hms(ud.t).slice(0, 5)}\n${ud.note}`,
      'commission');
  } else if (ud.kind === 'awareNode') {
    showTipAt(ud.name, ud.note, ud.src);
  } else if (ud.kind === 'criticNode') {
    showTipAt(ud.name, ud.note, ud.src);
  } else if (ud.kind === 'place') {
    showTipAt(ud.key, PLACES[ud.key].name, 'geo');
  } else if (ud.kind === 'flight') {
    const f = FLIGHTS.find((x) => x.id === ud.id);
    const s = samplePath(f.path, state.t);
    showTipAt(f.label, s
      ? `${f.type} · ${f.reg}\n${Math.round(s.altFt).toLocaleString()} ft · ${Math.round(s.groundSpeedMph)} mph · hdg ${Math.round(s.headingDeg)}°\n${f.souls} aboard`
      : f.type, 'recon');
  }
}

let tipTimer;

function showTip(e, title, body, src) {
  const tip = $('#tooltip');
  tip.innerHTML = `<b>${esc(title)}</b>${esc(body)}${src ? `<div style="margin-top:6px">${srcTag(src)}</div>` : ''}`;
  tip.classList.remove('hidden');
  const x = Math.min(e.clientX + 14, innerWidth - 310);
  tip.style.left = `${x}px`;
  tip.style.top = `${Math.max(8, e.clientY - 20)}px`;
}

function showTipAt(title, body, src) {
  const tip = $('#tooltip');
  tip.innerHTML = `<b>${esc(title)}</b>${esc(body).replace(/\n/g, '<br>')}${src ? `<div style="margin-top:6px">${srcTag(src)}</div>` : ''}`;
  tip.classList.remove('hidden');
  const r = $('#map').getBoundingClientRect();
  tip.style.left = `${r.left + 16}px`;
  tip.style.top = `${r.bottom - 150}px`;
  clearTimeout(tipTimer);
  tipTimer = setTimeout(hideTip, 6000);
}

function hideTip() { $('#tooltip').classList.add('hidden'); }

/* =============================================================================
   Chrome
   ========================================================================== */

/* =============================================================================
   The steelman tour

   A scripted walk through the argument in steelman.js. Each step owns four
   things — the clock, the camera, the visible layers and the open panel — and
   sets all four, so what is being said and what is being shown cannot drift
   apart.

   Two rules make it safe to hand a stranger:

   1. It is fully reversible. Entering snapshots the clock, the layers, the
      camera mode and the open tab; leaving by any route — the ✕, Esc, the
      button, or falling off the end — puts all of them back. The tour borrows
      the app, it does not redecorate it.

   2. It never moves on its own. An earlier version advanced on a timer, which
      is the wrong shape for this: the whole point is to look at the map while
      you read, and a clock running underneath turns that into a race. The
      reader advances it, every time.

      What replaces the timer is a signal rather than a deadline. Each step
      moves the camera and opens a panel, and those take about a second to
      settle; once they have, the thing the step is talking about flashes
      briefly, and the Next control lights to say there is more. Nothing is
      taken away if you ignore it.
   ========================================================================== */

const tour = {
  on: false,
  i: 0,
  settle: null,        // timer that flashes the step's UI once the camera lands
  saved: null,
};

function tourEnter() {
  if (tour.on) return;

  // Everything the tour is about to take over, remembered exactly as it is.
  tour.saved = {
    t: state.t,
    playing: state.playing,
    follow: state.follow,
    layers: { ...state.layers },
    tab: ($('#tabs button.on') || {}).dataset?.tab || 'brief',
  };

  tour.on = true;
  tour.i = 0;
  setPlaying(false);
  setFollow(false);

  $('#tour').classList.remove('hidden');
  $('#btn-tour').classList.add('on');
  document.body.classList.add('touring');
  buildTourDots();
  tourGo(0);
}

function tourExit() {
  if (!tour.on) return;
  tour.on = false;
  clearTimeout(tour.settle);
  $('#tour').classList.add('hidden');
  $('#btn-tour').classList.remove('on');
  document.body.classList.remove('touring');
  $$('.tour-lit').forEach((el) => el.classList.remove('tour-lit'));
  $('#tour-next').classList.remove('ready');

  const sv = tour.saved;
  if (sv) {
    Object.assign(state.layers, sv.layers);
    syncLayerChecks();
    applyAllLayers();
    tourTab(sv.tab);
    setTime(sv.t);
    setFollow(sv.follow);
    setPlaying(sv.playing);
    map.resetView();
  }
  tour.saved = null;
}

/* Layer state lives in `state.layers`, but the calls that push it at the map
   are scattered through the layer-toggle handler. The tour needs to set many
   at once, so they are gathered here — and the handler is left alone, because
   rewriting it to use this would change behaviour the tour has no business
   changing. */
function applyAllLayers() {
  for (const f of FLIGHTS) map.setFlightVisible(f.id, !!state.layers[f.id]);
  for (const f of MIL_FLIGHTS) map.setFlightVisible(f.id, !!state.layers[f.id]);
  map.setDebrisVisible(state.layers.debris);
  map.placeGroup.visible = state.layers.places;
  map.setCriticVisible(state.layers.critic);
  map.setAwarenessVisible(state.layers.aware);
  map.setRouteVisible('documented', state.layers.routeDoc);
  map.setRouteVisible('claim', state.layers.routeClaim);
  map.setReachVisible(state.layers.envelope || state.layers.wez);
  map.setMaxCleanVisible(!!state.layers.maxClean);
  map.setHypoVisible(state.layers.hypo);
  map.setCallsVisible(state.layers.calls);
  map.setTrailVisible(state.layers.trail);
  updateReach();
  updateHypo();
  map.setTrail(state.t);
  map.setCalls(ua93StateAt, state.t);
  map.setTime(state.t);
  syncModeSwitch();
}

const tourTab = (name) => gotoTab(name);

/* `view` is resolved here rather than in tour.js so the step data stays free
   of anything that needs the map to exist. */
function tourView(step) {
  const v = step.view || 'reset';
  const d = step.viewDist;

  if (v === 'reset') { map.resetView(); return; }

  if (v === 'ua93') {
    const s = ua93Position();
    if (s) map.flyTo(s, d || 46);
    else map.resetView();
    return;
  }

  if (v === 'hypo') {
    const s = map._hypoSample;
    if (s) map.flyTo(s, d || 46);
    else map.resetView();
    return;
  }

  if (v.startsWith('place:')) {
    const pl = PLACES[v.slice(6)];
    if (pl) map.flyTo(pl, d || 46);
    return;
  }

  if (v.startsWith('fit:')) {
    map.flyToFit(v.slice(4).split(',').map((k) => PLACES[k]).filter(Boolean));
    return;
  }

  map.resetView();
}

/* What the step bodies are allowed to quote. Built fresh on every step from
   the same model the Claim panel reads, so the callout and the panel behind it
   can never print different numbers for the same claim. */
function tourContext() {
  const target = hypoTarget();
  const steel = target ? buildHypoTrack(target, state.claimDepart, state.interceptT) : null;
  const tgt = ua93StateAt(state.interceptT);
  return {
    steel: steel || { miles: 0, mph: 0, mach: 0, ferryFraction: 0, totalMi: 0, totalFerryFraction: 0 },
    los: losVsWez(31000, tgt ? tgt.altFt : 5000, AIM9.rMaxMi),
    critic: criticSnapshots(steel, FLIGHTS.find((f) => f.id === 'UA93').path, state.interceptT),
    fuel: fuelProof(),
    boz: bozemanCost(target || PLACES.SHKV, state.claimDepart, state.interceptT),
  };
}

function tourGo(i) {
  if (!tour.on) return;
  if (i < 0) i = 0;
  if (i >= TOUR_STEPS.length) { tourExit(); return; }

  tour.i = i;
  clearTimeout(tour.settle);

  const step = TOUR_STEPS[i];
  const tone = TONES[step.tone] || TONES.setup;

  // Layers first, so the camera flies to something that is actually drawn.
  if (step.layers) {
    Object.assign(state.layers, step.layers);
    syncLayerChecks();
  }
  if (typeof step.t === 'number') setTime(step.t);
  if (step.layers) applyAllLayers();
  if (step.tab) tourTab(step.tab);
  tourView(step);

  const el = $('#tour');
  el.style.setProperty('--tour-accent', tone.color);
  $('#tour-chapter').textContent = tone.label;
  $('#tour-count').textContent = `${i + 1} / ${TOUR_STEPS.length}`;
  $('#tour-title').textContent = step.title;
  const body = typeof step.body === 'function' ? step.body(tourContext(), info) : step.body;
  /* The foot of each step: where it comes from, and where to read it. The
     final step also opens the road to the Sources tab. */
  const foot = (step.src || (step.refs && step.refs.length) || step.last) ? `
    <div class="tour-src">
      ${step.src ? srcTag(step.src) : ''}${refRows(step)}
      ${step.last ? `<div class="chip-row" style="margin-top:8px">
        <button class="chip" data-tour-goto="conflicts">Sources and disputes &rarr;</button>
        <button class="chip" data-tour-goto="brief">Back to Start here</button>
      </div>` : ''}
    </div>` : '';
  $('#tour-body').innerHTML = expandInfo(body) + foot;
  $('#tour-body').scrollTop = 0;

  // The position bar now says where you are, not how long you have left.
  $('#tour-bar-fill').style.width = `${((i + 1) / TOUR_STEPS.length * 100).toFixed(1)}%`;

  $('#tour-prev').disabled = i === 0;
  $('#tour-next').textContent = step.last ? '✓' : '›';
  $('#tour-next').title = step.last ? 'Finish and restore the view' : 'Next step (→)';

  $$('#tour-dots > i').forEach((dot, n) => {
    dot.classList.toggle('done', n < i);
    dot.classList.toggle('on', n === i);
  });

  /* Nothing flashes yet. The camera tween runs ~620 ms and the panel has to
     lay out and scroll, so flashing now would draw the eye to something still
     moving. Wait for it to settle, then point. */
  $$('.tour-lit').forEach((x) => x.classList.remove('tour-lit'));
  $('#tour-next').classList.remove('ready');
  tour.settle = setTimeout(() => tourSettled(step), 900);
}

/* The camera has stopped and the panel is in place: now say where to look. */
function tourSettled(step) {
  if (!tour.on) return;

  if (step.highlight) {
    const target = $(step.highlight);
    if (target) {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      // Restart the animation even if the class is already present.
      target.classList.remove('tour-lit');
      void target.offsetWidth;
      target.classList.add('tour-lit');
    }
  }

  /* And the map: whatever labels this step put on screen get one pulse, so the
     eye is pulled to the thing being described rather than hunting the map. */
  flashMapLabels();

  if (!step.last) $('#tour-next').classList.add('ready');
}

/* One brief pulse across the live map labels. Cheap, and it works for every
   step without the step having to name what it drew.

   The class goes on the CONTAINER, not the labels. drawLabels() rewrites every
   label's className on every frame — so a class set on a label survives about
   16 milliseconds, which is how the first version of this silently did nothing
   at all. The container is never touched by the label loop. */
let labelFlashTimer = null;

function flashMapLabels() {
  const box = $('#labels');
  clearTimeout(labelFlashTimer);
  box.classList.remove('flash');
  void box.offsetWidth;                 // restart the animation
  box.classList.add('flash');
  labelFlashTimer = setTimeout(() => box.classList.remove('flash'), 1700);
}

function buildTourDots() {
  $('#tour-dots').innerHTML = TOUR_STEPS.map(() => '<i></i>').join('');
}

function bindTour() {
  $('#btn-tour').addEventListener('click', () => (tour.on ? tourExit() : tourEnter()));
  $('#tour-close').addEventListener('click', tourExit);
  const end = $('#tour-end');
  if (end) end.addEventListener('click', tourExit);
  // The final step's chips leave the tour and land on a tab.
  $('#tour-body').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tour-goto]');
    if (!b) return;
    const to = b.dataset.tourGoto;
    tourExit();
    gotoTab(to);
  });
  $('#tour-prev').addEventListener('click', () => tourGo(tour.i - 1));
  $('#tour-next').addEventListener('click', () => {
    if (TOUR_STEPS[tour.i].last) { tourExit(); return; }
    tourGo(tour.i + 1);
  });
  $('#tour-replay').addEventListener('click', () => tourSettled(TOUR_STEPS[tour.i]));
}

/* =============================================================================
   The (i) mechanism

   One popover, one handler, terms defined once in glossary.js. The prose reads
   plainly and the precise vocabulary sits behind the icon, so nothing has been
   removed for the reader who wants it and nothing is in the way of the reader
   who does not.
   ========================================================================== */

/* Drop into any template string: `... the speed of sound ${info('mach')}` */
function info(key) {
  const g = GLOSSARY[key];
  if (!g) return '';
  return `<button type="button" class="ii" data-info="${key}"
    aria-label="What does ${esc(g.term)} mean?" title="${esc(g.term)}"></button>`;
}

let infoOpenFor = null;

function hideInfo() {
  $('#info-pop').classList.add('hidden');
  $$('.ii.on').forEach((b) => b.classList.remove('on'));
  infoOpenFor = null;
}

function showInfo(btn) {
  const g = GLOSSARY[btn.dataset.info];
  if (!g) return;

  const pop = $('#info-pop');
  $('#ip-term').textContent = g.term;
  $('#ip-plain').textContent = g.plain;
  $('#ip-more').textContent = g.more || '';
  $('#ip-src').innerHTML = srcTag(g.src) + (g.link
    ? ` <a class="ref ref-wiki" href="${g.link.url}" target="_blank" rel="noopener noreferrer"
         >${esc(g.link.label)} &rarr;</a>`
    : '');

  $$('.ii.on').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  pop.classList.remove('hidden');

  /* Placed after it is visible, so the measured height is the real one, and
     flipped above the icon when there is no room below. */
  const r = btn.getBoundingClientRect();
  const pr = pop.getBoundingClientRect();
  let left = r.left + r.width / 2 - pr.width / 2;
  left = Math.max(10, Math.min(left, innerWidth - pr.width - 10));
  let top = r.bottom + 8;
  if (top + pr.height > innerHeight - 10) top = r.top - pr.height - 8;
  /* Both branches are relative to the icon, and the icon can be off-screen —
     scrolled below the fold of a panel, say. Clamp to the viewport last, so a
     definition is always readable even when the thing it defines is not. */
  top = Math.max(10, Math.min(top, innerHeight - pr.height - 10));
  pop.style.left = `${Math.round(left)}px`;
  pop.style.top = `${Math.round(top)}px`;

  infoOpenFor = btn;
}

/* Everything that opens the popover: the (i) icons, and the provenance
   badges, which carry data-info="provenance". Bound once at document level,
   so icons in HTML rendered later work without any rebinding. */
const INFO_SEL = '.ii, .src[data-info]';

function bindInfo() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest(INFO_SEL);
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      if (infoOpenFor === btn) hideInfo(); else showInfo(btn);
      return;
    }
    if (!e.target.closest('#info-pop')) hideInfo();
  });

  // Hover is a convenience on the desktop; click is the real interaction.
  document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.ii');
    if (btn && !infoOpenFor) showInfo(btn);
  });
  document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.ii');
    if (btn && infoOpenFor === btn && !btn.matches(':focus-visible')) hideInfo();
  });

  addEventListener('keydown', (e) => { if (e.code === 'Escape') hideInfo(); });
  addEventListener('scroll', hideInfo, true);
  addEventListener('resize', hideInfo);
}

/* =============================================================================
   The brand flag

   A 1990s animated GIF, rebuilt honestly. Those things worked by slicing the
   flag into vertical columns and displacing each one on a sine a frame out of
   step with its neighbour — the ripple is the phase offset, nothing more. This
   does the same with CSS animation delays, so it costs a few hundred bytes
   rather than forty kilobytes and it can be switched off for anyone who has
   asked the operating system for less motion.

   The flag is drawn to a 49x26 canvas and scaled up with pixelated rendering,
   so the chunky edges are real pixels rather than a filter pretending. Stripes
   are two pixels each, which is the smallest that stays crisp. Fifty stars do
   not fit in a twenty-pixel canton and never did; the originals used a dot
   field and so does this.
   ========================================================================== */

const FLAG_SLICES = 14;

function flagDataURL() {
  const STRIPE = 2;                       // pixels per stripe
  const H = STRIPE * 13;                  // 26
  const W = Math.round(H * 1.9);          // 49 — the official 1.9:1 ratio
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');

  // Thirteen stripes, red first and last.
  for (let i = 0; i < 13; i++) {
    g.fillStyle = i % 2 === 0 ? '#b22234' : '#f4f6f9';
    g.fillRect(0, i * STRIPE, W, STRIPE);
  }

  // Canton: seven stripes tall, 0.76 of the hoist wide.
  const cw = Math.round(H * 0.76), ch = STRIPE * 7;
  g.fillStyle = '#3c3b6e';
  g.fillRect(0, 0, cw, ch);

  /* A dot field rather than fifty stars. At a fourteen-pixel canton a star is
     one pixel, so drawing fifty of them would be a claim the resolution cannot
     support — and the GIFs this is imitating did not manage it either. */
  g.fillStyle = '#ffffff';
  for (let row = 0; row < 5; row++) {
    const y = 1 + row * 3;
    const odd = row % 2 === 1;
    for (let col = 0; col < (odd ? 4 : 5); col++) {
      g.fillRect(2 + col * 4 + (odd ? 2 : 0), y, 1, 1);
    }
  }

  return c.toDataURL('image/png');
}

function buildFlag90() {
  const host = $('#flag90');
  if (!host) return;
  const src = `url("${flagDataURL()}")`;
  host.style.setProperty('--flag-src', src);
  host.innerHTML = '';

  for (let i = 0; i < FLAG_SLICES; i++) {
    const slice = document.createElement('i');
    // Each column shows its own portion of the same image and runs the same
    // animation, one step behind the column to its left.
    /* Percentage background-position is NOT a pixel offset: the browser
       computes P x (elementWidth - imageWidth), and that bracket is already
       negative when the image is wider than the box. Writing a minus sign here
       flips it and pushes every slice but the first off to the right, which is
       how the first version of this rendered as a six-pixel sliver. */
    slice.style.backgroundPosition =
      `${((i * 100) / (FLAG_SLICES - 1)).toFixed(4)}% 0`;
    slice.style.animationDelay = `${(-i * 0.08).toFixed(3)}s`;
    host.appendChild(slice);
  }
}

/* Reference chips. Explicit links from links.js, never inferred from prose —
   an automatic linkifier gets "Logan" and "Dulles" right and then confidently
   links the wrong Albany. `rel` is set because these all leave the page. */
function refRow(key, extraClass = '') {
  const rs = refsFor(key);
  if (!rs.length) return '';
  return `<div class="ref-row ${extraClass}">${rs.map((r) => `
    <a class="ref ref-${r.kind}" href="${r.url}" target="_blank" rel="noopener noreferrer"
       title="${esc(r.url)}">${esc(r.label)}</a>`).join('')}</div>`;
}

/* =============================================================================
   Start here — the bottom line, then the walkthrough

   The old front door was a timeline scrubber and seven tabs, which asked the
   reader to assemble the argument from parts. This states it in the order an
   argument should be stated: conclusion, reasoning, evidence, objections.

   Every section is a headline you can read in five seconds over a body you can
   open if you want it. Skim the headlines and the whole case takes about ninety
   seconds; open everything and it is an hour. Counter-arguments sit inside the
   sections they undercut rather than in a rebuttal page at the end, because one
   that only appears after the reader is convinced is decoration.
   ========================================================================== */

/* Put the map where a walkthrough section is talking about, without
   entering the tour: the clock, the layers and the camera of that section's
   `show`, reusing the tour's view logic. On a phone the map is opened too. */
function showOnMap(show) {
  if (!show) return;
  setPlaying(false);
  if (typeof show.t === 'number') setTime(show.t);
  Object.assign(state.layers, show.layers || {});
  syncLayerChecks();
  applyAllLayers();
  setFollow(false);
  tourView(show);
  if (isPhone()) {
    setMapOpen(true, false);
    setTimeout(() => { map.resize(); tourView(show); }, 300);
  }
}

function renderBriefTab() {
  renderRecon();
  const bl = BOTTOM_LINE, wc = WHY_CRITIC;
  const walkthroughLine = 'The walkthrough below is the argument in text. The tour shows the same argument on the map, and the claim tab holds the working.';
  const alreadySaid = WALKTHROUGH.some((w) =>
    (w.body || []).some((p) => /the working/i.test(String(p))));

  const section = (w) => `
    <details class="wt" id="${w.id}">
      <summary>
        <span class="wt-kicker">${esc(w.kicker)}</span>
        <span class="wt-head">${esc(w.headline)}</span>
        <span class="wt-more" aria-hidden="true"></span>
      </summary>
      <div class="wt-body">
        ${w.body.map((p) => `<p>${expandInfo(p)}</p>`).join('')}
        ${w.counter ? `
          <div class="wt-counter">
            <div class="wt-counter-q">${esc(w.counter.point)}</div>
            <p>${expandInfo(w.counter.text)}</p>
            ${w.counter.more === 'awareness'
              ? `<button class="chip" data-goto="aware">See the whole chain &rarr;</button>` : ''}
          </div>` : ''}
        <div class="wt-src">${w.src ? srcTag(w.src) : ''}${refRows(w)}</div>
        <div class="chip-row">
          ${w.show ? `<button class="chip" data-show="${esc(w.id)}">Show on the map</button>` : ''}
          ${w.id === 'w-shot' ? `<button class="chip" data-goto="timeline" data-anchor="#crash">The crash &rarr;</button>` : ''}
        </div>
      </div>
    </details>`;

  const blocker = bl.paras[2] || bl.paras[bl.paras.length - 1] || '';
  const rest = bl.paras.filter((p) => p !== blocker);

  $('#brief-body').innerHTML = `
    <div class="card bluf">
      <div class="bluf-kicker">The question</div>
      <h2>Did a US fighter shoot down United 93?</h2>
      <p class="bluf-answer">${expandInfo(bl.headline)}</p>
      <p>${expandInfo(blocker)} ${srcTag(bl.src)}</p>
      <div class="chip-row">
        <button class="chip chip-go" data-goto="tour">&#9654; Walk me through it (2 min)</button>
        <button class="chip" data-scroll="#w-claim">Read the ${WALKTHROUGH.length} steps</button>
      </div>
      <details class="more">
        <summary>More</summary>
        ${rest.map((p) => `<p>${expandInfo(p)} ${srcTag(bl.src)}</p>`).join('')}
        <p class="bluf-note">${expandInfo(esc(bl.verdictNote))} ${srcTag(bl.src)}</p>
      </details>
    </div>

    ${alreadySaid ? '' : `<p class="sec-note">${walkthroughLine}</p>`}

    <h3 class="sec-head">The walkthrough</h3>
    <p class="sec-note">${WALKTHROUGH.length} steps. Headlines alone are the short version;
    open any one for the detail and the strongest objection to it.</p>
    ${WALKTHROUGH.map(section).join('')}

    <h3 class="sec-head">However long you have</h3>
    <div class="paths compact">
      ${PATHS.map((p) => `
        <button class="path" data-goto="${esc(p.act.replace('tab:', ''))}" title="${esc(plain(p.note))}">
          <span class="path-min">${esc(p.min)}</span>
          <span class="path-label">${esc(plain(p.label))}</span>
        </button>`).join('')}
    </div>

    <div class="card critic-steel-card">
      <div class="bluf-kicker">${esc(wc.kicker)}</div>
      <h3>${esc(wc.headline)}</h3>
      ${wc.paras.map((p) => `<p>${expandInfo(p)}</p>`).join('')}
      <p class="bluf-note">${expandInfo(esc(wc.hook))} ${srcTag(wc.src)}${refRows(wc)}</p>
      <div class="chip-row">
        <button class="chip" data-goto="critic">The four messages &rarr;</button>
      </div>
    </div>

    ${nextRow('brief')}`;

  $$('#brief-body [data-show]').forEach((b) => b.addEventListener('click', () => {
    const w = WALKTHROUGH.find((x) => x.id === b.dataset.show);
    if (w && w.show) showOnMap(w.show);
  }));
  $$('#brief-body [data-scroll]').forEach((b) => b.addEventListener('click', () => {
    const el = $(b.dataset.scroll);
    if (!el) return;
    el.open = true;
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }));
}

/* =============================================================================
   Who knew — the awareness chain

   Built because the app used to say "NEADS did not know United 93 existed until
   10:07" and stop there, which invites the obvious objection that the FAA knew
   for thirty-five minutes. It did. That is documented here in full, including
   how badly it reflects on the FAA, because an argument that hides its best
   counter-evidence is not an argument.
   ========================================================================== */

function renderAwareTab() {
  const g = awarenessGap();

  const row = (a) => {
    const act = ACTORS[a.actor];
    return `
      <div class="aw${a.pivotal ? ' aw-pivot' : ''}" style="--aw:${act.color}">
        <div class="aw-t">${hms(a.t).slice(0, 5)}</div>
        <div class="aw-main">
          <div class="aw-actor">${esc(act.label)}</div>
          <div class="aw-who">${esc(a.who)}</div>
          ${a.bluf ? `<p class="aw-bluf">${ei(a.bluf)}</p>` : ''}
          <p class="aw-what">${ei(a.what)}</p>
          <p class="aw-bearing"><strong>What it establishes:</strong> ${ei(a.bearing)}
            ${srcTag(a.src)}</p>
          ${refRows(a)}
          <div class="chip-row" style="margin-top:6px">
          ${a.weigh === 'fighters-question' ? `
            <button class="chip" data-weigh="fighters-question">
              Does this show foreknowledge? &rarr;</button>` : ''}
          ${a.conflict ? conflictChip(a.conflict) : ''}
          ${a.pivotal ? `<button class="chip" data-goto="aware" data-anchor="#airborne">What was airborne &rarr;</button>` : ''}
          </div>
        </div>
      </div>`;
  };

  const fq = FIGHTERS_QUESTION;

  $('#aware-body').innerHTML = `
    <div class="jump-row">
      <button class="chip" data-goto="aware" data-anchor="#airborne">What was airborne &rarr;</button>
    </div>
    <div class="card bluf">
      <div class="bluf-kicker">The short version</div>
      <h2>The FAA knew about the hijacking for ${Math.round(g.civilMinutes)} minutes. The military learned of it ${Math.round(g.militaryLateMinutes)} minutes after the crash.</h2>
      <p>The civil side had United 93 continuously for
        <strong>${Math.round(g.civilMinutes)} minutes</strong> before it went down. They heard the
        takeover live, kept it on radar after the transponder ${info('transponder')} went off, and
        worked out how many minutes it was from Washington.</p>
      <p>The air defence sector ${info('neads')} heard the words "United 93" for the first time
        <strong>${Math.round(g.militaryLateMinutes)} minutes after it had already crashed</strong>:
        a gap of ${Math.round(g.gapMinutes)} minutes between the FAA and the military.</p>
      <p class="bluf-note">The shootdown claim requires that gap not to exist. ${srcTag('derived')}</p>
      ${refRow('COMMISSION')}${refRow('NEADS')}
    </div>

    <div class="card">
      <h3>Who is who</h3>
      ${Object.values(ACTORS).map((a) => `
        <div class="aw-key"><i style="background:${a.color}"></i>
          <b>${esc(a.label)}</b>: ${ei(a.note)}</div>`).join('')}
    </div>

    <h3 class="sec-head">The chain, minute by minute</h3>
    <div class="aw-list">${AWARENESS.map(row).join('')}</div>

    <div class="card fk-card" id="fighters-question">
      <h3>${esc(fq.title)}</h3>
      <p><strong>${ei(fq.short)}</strong></p>
      ${refRows(fq)}
      ${fq.readings.map((r) => `
        <div class="cmd-row">
          <div class="t" style="color:var(--ink-faint)">${esc(r.who)}</div>
          <div class="x">${ei(r.v)} <span style="color:var(--ink-faint)">${ei(r.weight)}</span>
            ${srcTag(r.src)}</div>
        </div>`).join('')}
      <ul class="plain" style="margin-top:10px">
        ${fq.points.map((p) => `<li>${ei(p)}</li>`).join('')}
      </ul>
      <p class="fk-caution"><strong>The limit:</strong> ${ei(fq.limit)} ${srcTag(fq.src)}</p>
    </div>

    <div class="card">
      <h3>The objection this answers</h3>
      <p class="aw-obj">${ei(AWARENESS_COUNTER.objection)}</p>
      ${refRows(AWARENESS_COUNTER)}
      ${AWARENESS_COUNTER.answers.map((a) => `
        <div class="finding">
          <h4>${esc(a.point)}</h4>
          <p>${ei(a.detail)} ${srcTag(a.src)}</p>
        </div>`).join('')}
    </div>`;

  $$('#aware-body [data-weigh]').forEach((b) => b.addEventListener('click', () => {
    const el = $('#fighters-question');
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el.classList.remove('tour-lit'); void el.offsetWidth; el.classList.add('tour-lit');
    }
  }));
}

/* One way in and out of every tab, so the brief's chips and the tab bar cannot
   get out of step. */
/* Old tab names still used by data and chips resolve to where that content
   now lives: a tab plus an anchor inside it, or the layers drawer. */
const ALIAS = {
  debris: ['timeline', '#crash'],
  military: ['aware', '#airborne'],
  layers: 'drawer',
};

function gotoTab(name, anchor) {
  const alias = ALIAS[name];
  if (alias === 'drawer') { setDrawerOpen($('#layers-drawer').classList.contains('hidden')); return; }
  if (Array.isArray(alias)) { anchor = anchor || alias[1]; name = alias[0]; }

  const btn = $(`#tabs button[data-tab="${name}"]`);
  if (!btn) return;
  $$('#tabs button').forEach((x) => x.classList.toggle('on', x === btn));
  $$('.tab-body').forEach((sec) => sec.classList.toggle('hidden', sec.dataset.body !== name));
  const body = $(`.tab-body[data-body="${name}"]`);
  if (body) body.scrollTop = 0;
  document.body.classList.remove('map-open');
  const mapBtn = $('#btn-map');
  if (mapBtn) mapBtn.textContent = 'Full map';
  // The footer is a scrubber row everywhere except the Timeline tab.
  document.body.classList.toggle('footer-min', name !== 'timeline');
  btn.scrollIntoView({ inline: 'nearest', block: 'nearest' });

  // The who-knew network is what that tab is about, so it comes on with it.
  // A tab never turns a layer off.
  if (name === 'aware' && !state.layers.aware) {
    state.layers.aware = true;
    syncLayerChecks();
    applyLayer('aware');
  }

  if (anchor) {
    const el = $(anchor);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }
}

function bindChrome() {
  $('#btn-play').addEventListener('click', () => {
    if (state.t >= T1) setTime(T0);
    setPlaying(!state.playing);
  });

  /* One delegated handler for every cross-tab chip on the page, so chips in
     HTML rendered later need no binding of their own. */
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cjump]');
    if (chip) { e.preventDefault(); e.stopPropagation(); jumpToConflict(chip.dataset.cjump); return; }
    const go = e.target.closest('[data-goto]');
    if (go) {
      e.preventDefault(); e.stopPropagation();
      const to = go.dataset.goto;
      if (to === 'tour') { tourEnter(); return; }
      gotoTab(to, go.dataset.anchor);
    }
  }, true);

  const n = openCount();
  if (n) $('#conflict-count').textContent = ` ${n}`;

  $$('#alt-group button').forEach((b) => b.addEventListener('click', () => setAltScale(+b.dataset.alt)));

  $('#btn-follow').addEventListener('click', () => setFollow(!state.follow));

  $('#btn-reset-view').addEventListener('click', resetViewFit);

  $$('#rate-group button').forEach((b) => b.addEventListener('click', () => {
    $$('#rate-group button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    state.rate = +b.dataset.rate;
  }));

  // A plain tap on a tab clears any 'Showing disputes about' header.
  $$('#tabs button').forEach((b) => b.addEventListener('click', () => {
    setConflictHeader('');
    gotoTab(b.dataset.tab);
  }));

  // Mobile: swap between the map and the reading, since both cannot be tall.
  const mapBtn = $('#btn-map');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    setMapOpen(!document.body.classList.contains('map-open'));
  });

  $('#aside-toggle').addEventListener('click', () => {
    setPanelHidden(!document.body.classList.contains('panel-hidden'));
  });

  // The layers drawer.
  const lb = $('#btn-layers');
  if (lb) lb.addEventListener('click', () => setDrawerOpen($('#layers-drawer').classList.contains('hidden')));
  const dc = $('#drawer-close');
  if (dc) dc.addEventListener('click', () => setDrawerOpen(false));

  /* A right-edge fade on the sideways-scrolling strips, switched off once the
     strip is scrolled to its end so it never suggests content that is not
     there. */
  for (const sel of ['#tabs', '#flight-strip']) {
    const el = $(sel);
    if (!el) continue;
    const upd = () => el.classList.toggle('at-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    el.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    setTimeout(upd, 0);
  }

  document.body.classList.toggle('footer-min', (($('#tabs button.on') || {}).dataset?.tab || 'brief') !== 'timeline');

  bindTour();
  bindInfo();

  addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;

    // While the tour has the floor, the transport keys drive the tour.
    if (tour.on) {
      if (e.code === 'Escape') { tourExit(); return; }
      if (e.code === 'ArrowLeft') { e.preventDefault(); tourGo(tour.i - 1); return; }
      if (e.code === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        if (TOUR_STEPS[tour.i].last) tourExit(); else tourGo(tour.i + 1);
        return;
      }
    }

    if (e.code === 'Space') { e.preventDefault(); $('#btn-play').click(); }
    if (e.code === 'KeyF') setFollow(!state.follow);
    if (e.code === 'ArrowLeft') { setPlaying(false); setTime(state.t - (e.shiftKey ? 300 : 30)); }
    if (e.code === 'ArrowRight') { setPlaying(false); setTime(state.t + (e.shiftKey ? 300 : 30)); }
    if (e.code === 'Home') { setPlaying(false); setTime(T0); }
  });
}
