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
import { wezWindow, LOS_HORIZON, losVsWez, mutualHorizonSmi } from './steelman.js';
import { TOUR_STEPS, TONES } from './tour.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
const srcTag = (k) => {
  const m = SRC_META[k];
  return m ? `<span class="src ${m.tone}">${m.label}</span>` : '';
};

const state = {
  t: T0,
  playing: false,
  rate: 15,
  claimDepart: 8 * 3600 + 46 * 60,   // user dial: earliest plausible launch
  interceptT: 9 * 3600 + 58 * 60,    // the alleged shot
  follow: true,                      // camera reframes the action as you scrub
  altScale: 1,                       // vertical exaggeration; 1 = true scale
  toleranceMin: 10,                  // departure-time tolerance, in minutes
  layers: {
    AA11: true, UA175: true, AA77: true, UA93: true,
    PANTA: true, QUIT: true, GOFER: true, BULLY: true,
    debris: false, routeDoc: false, routeClaim: false, places: true,
    critic: true,
    envelope: true, wez: true, hypo: true, calls: true, aware: true,
    trail: true,
  },
};

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
    bindChrome();

    setAltScale(state.altScale);
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
  $('#hud-state').textContent = hoverName || '—';

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
  if (state.altScale === 1) {
    note.innerHTML = `<b>True scale.</b> A 35,000 ft cruise is 6.6 miles above a country 2,800 miles across — about 1:${Math.round(trueScaleRatio()).toLocaleString()}. The tracks look almost flat because they are.`;
  } else {
    note.innerHTML = `Altitude exaggerated <b>${state.altScale}×</b> against ground distance, to make climbs and descents readable. The vertical axis is not to scale.`;
  }
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
  $('#event-list').innerHTML = EVENTS.map((ev, i) => `
    <div class="ev future${ev.kind === 'claim' ? ' claim-ev' : ''}${ev.kind === 'critic' ? ' critic-ev' : ''}" data-ev="${i}" data-t="${ev.t}">
      <div class="ev-t">${hms(ev.t)}</div>
      <div>
        <div class="ev-label" style="color:${hex(ev.color)}">${esc(ev.label)}</div>
        <div class="ev-text">${esc(ev.text)}</div>
        <div style="margin-top:5px">${srcTag(ev.src)}</div>
      </div>
    </div>`).join('');

  evEls = $$('.ev');
  lastNowIdx = -1;
  evEls.forEach((el) => el.addEventListener('click', () => {
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

function renderClaimTab() {
  const g = GIBNEY;
  $('#claim-body').innerHTML = `
    <div class="card">
      <h3>The allegation ${conflictChip('CLAIM')}</h3>
      ${refRow('UA93')}${refRow('COMMISSION')}
      <p>In <strong>${esc(CRITIC.date)}</strong>, ${esc(CRITIC.claimant)} told ${esc(CRITIC.venue)} that United 93 did not crash — it was shot down. ${srcTag('claim')}</p>
      <div class="quote">“${esc(CRITIC.quote)}”</div>
      <dl class="kv">
        ${CRITIC.assertions.map((a) => `<dt>${esc(a.k)}</dt><dd>${esc(a.v)}</dd>`).join('')}
      </dl>
      <p style="margin-top:10px">This app takes that seriously enough to measure it. Everything below is the test.</p>
    </div>

    <div class="card">
      <h3>Rick Gibney's documented day</h3>
      ${refRow('GIBNEY_UNIT')}
      <p><strong>${esc(g.name)}</strong>, 119th Fighter Wing. He was flying an F-16 on the morning of September 11 — that much the claim gets right, and it is probably why the story attached to him. ${srcTag('press')}</p>
      <p>His tasking was to fly <strong>${esc(g.passenger)}</strong> home. With every civil aircraft in the country grounded, a fighter was the only way to move him.</p>
      <p style="font-size:11.5px;color:var(--ink-faint)">${esc(g.rankNote.text)}</p>

      <h3 style="margin-top:14px">Where he landed</h3>
      ${g.landings.map((l, i) => `
        <div class="cmd-row" style="grid-template-columns:20px 1fr">
          <div class="t">${i + 1}</div>
          <div class="x"><strong style="color:var(--ink)">${esc(PLACES[l.place].name)}</strong><br>
          <span style="font-size:11.5px">${esc(l.role)}</span></div>
        </div>`).join('')}

      ${g.legs.map((l) => `<p style="margin-top:9px;font-size:12px">${esc(l.why)}</p>`).join('')}
      <p style="font-size:12px">${esc(g.afterword)}</p>
      <div class="chip-row">
        <button class="chip" data-act="show-doc">Draw this route</button>
        <button class="chip" data-act="show-claim">Draw the claimed route</button>
      </div>
    </div>

    <div class="card">
      <h3>Required speed</h3>
      <p>The claim fixes one arrival time: Gibney must be over Somerset County at <strong>09:58</strong>. Set the earliest moment he could have launched from Fargo and the leg is forced.</p>
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
        ${ASSUMPTIONS.map((a) => `<li>${esc(a)}</li>`).join('')}
      </ul>
    </div>

    <div class="card">
      <h3>Where he could have been</h3>
      <p>His day has documented <em>places</em> — Fargo, Bozeman, Albany — and essentially no documented <em>times</em>. So for almost the whole morning nothing puts him at any particular point, and the honest way to draw that is a disc rather than a line: everywhere an F-16 could reach from its last anchor in the time elapsed.</p>
      <div id="reach-out"></div>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">
        No departure time for Gibney has ever been published, so the rings are drawn as bands rather than hairlines. The bounds that <em>are</em> documented are the day's own: first knowledge at ${hms(DEPARTURE_BOUNDS.firstKnowledge.t).slice(0, 5)}, the national ground stop at ${hms(DEPARTURE_BOUNDS.groundStop.t).slice(0, 5)}, and SCATANA at ${hms(DEPARTURE_BOUNDS.scatana.t).slice(0, 5)} — the point at which the documented tasking, fetching a man civil aviation could no longer move, actually exists. ${srcTag('commission')}
      </p>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">
        An envelope is a statement about circles, not about people. Every point inside one is equally unevidenced, and that morning the envelope of nearly any fighter in the eastern half of the country would have swept over Somerset County eventually. It is drawn to show the size of the gap in the record — and, once the fuel ring is on, how much smaller that gap really is. ${srcTag('derived')}
      </p>
      <div class="chip-row">
        <button class="chip" data-act="show-envelope">Draw the envelope</button>
        <button class="chip" data-act="show-wez">Draw the missile range</button>
      </div>
    </div>

    <div class="card">
      <h3>What he would have had to hit it with</h3>
      <p><strong>${esc(AIM9.designation)}</strong> ${info('sidewinder')} — ${esc(AIM9.inService)} ${srcTag(AIM9.src)}</p>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55">In plain terms: a short-range
      missile that steers towards the heat of an engine. It has to be fired from fairly close, and
      not too close — inside about half a mile it has not armed itself yet. So the area it can
      actually reach is a ring, not a circle ${info('wez')}.</p>
      <dl class="kv">
        <dt>Seeker</dt><dd>${esc(AIM9.seeker)}</dd>
        <dt>Speed</dt><dd>${esc(AIM9.speed)}</dd>
        <dt>Warhead</dt><dd>${esc(AIM9.warhead)}</dd>
        <dt>Max range</dt><dd>~${AIM9.rMaxMi} mi (published figures run to ${AIM9.rMaxOptimisticMi})</dd>
        <dt>Min range</dt><dd>~${AIM9.rMinMi} mi — the zone is a ring, not a disc</dd>
      </dl>
      <div id="wez-out"></div>
      ${AIM9.notes.map((n) => `<p style="margin-top:9px;font-size:12px">${esc(n.text)} ${srcTag(n.src)}</p>`).join('')}
    </div>

    <div class="card steel">
      <h3>The strongest possible version</h3>
      <p>Everything else here tests the allegation. This grants it every favourable assumption at once and asks what still fails — which is the only way to find out which objections were load-bearing.</p>
      <p class="hypo-warn"><strong>${esc(HYPO.callsign)} — ${esc(HYPO.status)}.</strong> ${esc(HYPO.disclaimer)}
      This is a <em>steelman</em> ${info('steelman')}: the claim's best possible case, built so it can be tested properly.</p>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55;margin-top:8px">
        <strong style="color:var(--ink)">Standing premise: the aircraft is carrying external fuel
        tanks</strong> ${info('dropTanks')}. That is not a favour to the claim — the documented
        Montana-to-Albany leg cannot be flown without them. Everything below assumes a tanked
        jet, so fuel is never the objection. The combat-radius ring this app once drew has been
        removed for the same reason: it measures an aircraft carrying nothing, which this one
        demonstrably was not. What the tanks <em>do</em> cost the claim is Mach 2.0, which is
        only available clean ${info('placard')}.</p>
      <div id="steel-out"></div>
      <div id="concessions"></div>
      <div class="chip-row">
        <button class="chip" data-act="show-hypo">Plot ${esc(HYPO.callsign)}</button>
        <button class="chip" data-act="tour">&#9654; Walk me through it</button>
      </div>
    </div>

    <div class="card fk-card">
      <h3>${esc(FOREKNOWLEDGE.title)}</h3>
      <p>United 93 was seized at <strong>09:28</strong>. Before that it was an ordinary flight climbing out of Newark. So a launch aimed at it earlier than 09:28 is not a response to a hijacking — it is a response to one that has not happened yet.</p>
      <div id="fk-out"></div>
      <p class="fk-caution">${esc(FOREKNOWLEDGE.caution)} ${srcTag(FOREKNOWLEDGE.src)}</p>
    </div>

    <div class="card">
      <h3>${esc(CONFIG_TRADE.title)}</h3>
      <p>Speed and range come off the same wing stations, so an F-16 can have one or the other.
      This used to be left open here, because nobody observed the aircraft. It is not open: the
      Montana-to-Albany leg cannot be flown without external tanks ${info('dropTanks')}, so the
      tanks are established and the configuration is decided.</p>
      <div class="cmd-row">
        <div class="t" style="color:#fff">${CONFIG_TRADE.clean.topMph} mph</div>
        <div class="x"><strong style="color:var(--ink)">${esc(CONFIG_TRADE.clean.label)}</strong> — ${esc(CONFIG_TRADE.clean.note)}</div>
      </div>
      <div class="cmd-row">
        <div class="t" style="color:${hex(0xff8a5c)}">${CONFIG_TRADE.tanked.topMph} mph</div>
        <div class="x"><strong style="color:var(--ink)">${esc(CONFIG_TRADE.tanked.label)}</strong> — ${esc(CONFIG_TRADE.tanked.note)}</div>
      </div>
      <p style="margin-top:11px"><strong>${esc(CONFIG_TRADE.reading)}</strong> ${srcTag(CONFIG_TRADE.src)}</p>
    </div>

    <div class="card">
      <h3>What the claim actually requires</h3>
      <div id="findings"></div>
    </div>

    <div class="card">
      <h3>Route comparison</h3>
      <div id="route-compare"></div>
    </div>

    <div class="card">
      <h3>${esc(COMMAND_CHECK.title)}</h3>
      <p>Set aside speed and fuel entirely. An intercept has to be <em>ordered</em>. ${srcTag('commission')}</p>
      ${COMMAND_CHECK.rows.map((r) => `
        <div class="cmd-row${r.src === 'claim' ? ' claim-row' : ''}">
          <div class="t">${esc(r.t)}</div><div class="x">${esc(r.text)}</div>
        </div>`).join('')}
      <p style="margin-top:11px"><strong>${esc(COMMAND_CHECK.conclusion)}</strong></p>
    </div>

    <div class="card kernel-card">
      <h3>${esc(KERNEL.title)}</h3>
      ${KERNEL.paras.map((p) => `<p>${esc(p)}</p>`).join('')}
      <div style="margin-top:8px">${srcTag(KERNEL.src)}</div>
      <div class="chip-row">
        <button class="chip" data-act="show-quit">Fly to QUIT flight</button>
        <button class="chip" data-act="show-gofer">Fly to GOFER 06</button>
      </div>
    </div>

    <div class="card">
      <h3>The people actually involved</h3>
      ${GIBNEY.rebuttals.map((r) => `
        <div class="finding soft">
          <h4>${esc(r.who)}</h4>
          <p>${esc(r.text)}</p>
          <div style="margin-top:5px">${srcTag(r.src)}</div>
        </div>`).join('')}
    </div>

    <div class="verdict">
      <h3>Where this leaves the claim</h3>
      <p>The allegation rests on a single unsourced assertion by one man on a radio show, three years after the fact. Against it: the pilot's unit, the pilot's passenger, the distances, the fuel, and a command timeline in which the authority to fire arrived half an hour after the alleged shot.</p>
      <p>It is worth being precise about what is <em>not</em> being claimed here. Nobody has published Gibney's minute-by-minute logs, and this app does not pretend to have them. The point is narrower and stronger than that: <strong>the claim fails on geometry it cannot escape.</strong> No assumption about missing paperwork puts one F-16 over Pennsylvania and in Bozeman, Montana on the same morning.</p>
      <div style="margin-top:8px">${srcTag('derived')}</div>
    </div>

    <div class="card">
      <h3>The airframe</h3>
      <p><strong>${esc(F16.model)}</strong></p>
      <dl class="kv">
        <dt>Cruise</dt><dd>~${F16.cruiseMph} mph</dd>
        <dt>Max, low</dt><dd>~${F16.maxSeaLevelMph} mph (Mach ${machAt(F16.maxSeaLevelMph, 0).toFixed(1)} at sea level)</dd>
        <dt>Max, high</dt><dd>~${F16.maxAltitudeMph} mph (Mach ${machAt(F16.maxAltitudeMph, 40000).toFixed(1)} at 40,000 ft)</dd>
        <dt>Range, tanks fitted</dt><dd>~${F16.ferryRangeMi.toLocaleString()} mi one way</dd>
        <dt>Ferry range</dt><dd>~${F16.ferryRangeMi} mi with external tanks</dd>
      </dl>
      ${F16.notes.map((n) => `<p style="margin-top:9px;font-size:12px">${esc(n.text)} ${srcTag(n.src)}</p>`).join('')}
    </div>`;

  $$('#tol-group button').forEach((b) => b.addEventListener('click', () => {
    setTolerance(+b.dataset.tol);
  }));

  $('#dep-dial').addEventListener('input', (e) => {
    state.claimDepart = +e.target.value;
    updateSpeedPanel();
    throttledReachPanels(true);
    updateReach();
  });

  $$('#claim-body .chip').forEach((b) => b.addEventListener('click', () => {
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
  const v = foreknowledgeVerdict(haversineMi(PLACES.KFAR, target), state.interceptT, BANDS);

  out.innerHTML = `
    <div class="leg fk-leg">
      <div class="leg-head">
        <span class="leg-name">Best case, at the fastest the airframe goes</span>
        <span class="leg-dist">${v.best.mph} mph</span>
      </div>
      <div class="leg-speed v-impossible">
        ${Math.round(v.best.leadMin)}<small>minutes of foreknowledge required</small>
      </div>
      <div class="leg-mach">
        He must be off the ground at ${hms(v.best.departBy).slice(0, 5)} —
        ${Math.round(v.best.leadMin)} minutes before United 93 was seized.
      </div>
    </div>
    <p style="font-size:11.5px;color:var(--ink-faint);margin:10px 0 4px">
      Every speed the airframe can manage, and how far ahead of the hijacking each one puts the launch:
    </p>
    ${v.rows.map((r) => `
      <div class="cmd-row">
        <div class="t" style="color:${hex(r.color)}">${hms(r.departBy).slice(0, 5)}</div>
        <div class="x"><strong style="color:var(--ink)">${esc(r.label)}</strong> — ${r.mph} mph.
        ${r.requires
          ? `<strong class="v-impossible">${Math.round(r.leadMin)} min before the hijacking.</strong>`
          : 'No foreknowledge needed.'}</div>
      </div>`).join('')}
    <div class="fk-verdict">
      <strong>${v.allRequire ? 'Every achievable speed requires foreknowledge.' : 'Some speeds avoid it.'}</strong>
      The furthest he could start from and still arrive without leaving early — the fastest speed
      multiplied by the thirty minutes between the seizure and the alleged shot — is
      <strong>${Math.round(v.horizonMi)} miles</strong>. Fargo is <strong>${Math.round(v.distMi)}</strong>,
      further by <strong class="v-impossible">${Math.round(v.outsideBy)} miles</strong>.
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
             to <strong style="color:var(--ink)">${hms(w.exit).slice(0, 8)}</strong> —
             a window of <strong class="v-impossible">${(w.durationS / 60).toFixed(1)} minutes</strong>.`}
      </div>
      <p style="margin:8px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.5">
        That window is the whole of the opportunity the claim needs, and it exists only because
        this track was <em>built</em> to arrive there. The record has to put a specific aircraft
        inside it, to the minute. Nothing does.
      </p>
    </div>
    <div class="cmd-row">
      <div class="t" style="color:${hex(LOS_HORIZON.color)}">${Math.round(lv.losMi)} mi</div>
      <div class="x"><strong style="color:var(--ink)">Line-of-sight horizon</strong> — what it can
        <em>see</em>, from 31,000 ft against a target at 5,000. Against
        <strong>${lv.wezMi} mi</strong> of weapon, that is a ratio of
        <strong class="v-impossible">${Math.round(lv.ratio)}:1</strong>.
        ${esc(LOS_HORIZON.note)} Seeing was never the constraint.</div>
    </div>`;
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
          : 'beyond the tanked placard — needs a clean jet, which has no external fuel'} ·
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
      <div class="x">Whole day — <strong class="v-routine">${Math.round(h.totalFerryFraction * 100)}% of ferry range</strong>,
        inside one tankful. <strong>And it never goes to Bozeman.</strong> That is the shortest
        flyable version of the claim, and it is one in which Ed Jacoby is never collected —
        which is contradicted by Jacoby, who was.</div>
    </div>`;

  renderLosPanel(h);

  /* The costs that are arithmetic rather than assertion are computed here, so
     the concession list cannot drift from the model the panel above it uses. */
  const ctx = { fuel: fuelProof(), boz: bozemanCost(target, state.claimDepart, state.interceptT) };

  $('#concessions').innerHTML = `
    <p style="font-size:11.5px;color:var(--ink-faint);margin:12px 0 6px">
      Granted simultaneously. The last four cannot be bought at any price — and the first is
      not a concession at all, because the documented mission establishes it.
    </p>
    ${CONCESSIONS.map((c) => `
      <div class="concession ${c.blocking ? 'blocking' : 'free'}">
        <div class="cn-grant">${esc(c.grant)}</div>
        <div class="cn-detail">${esc(c.detail)}</div>
        <div class="cn-cost">${esc(c.costFn ? c.costFn(ctx) : c.cost)}</div>
      </div>`).join('')}
    <div class="verdict" style="margin-top:12px">
      <h3>${esc(VERDICT.headline)}</h3>
      <p>${esc(VERDICT.body)}</p>
      <div style="margin-top:8px">${srcTag(VERDICT.src)}</div>
    </div>`;
}

function renderReachPanel() {
  const t = shanksvilleTest(state.claimDepart);
  const rows = t.bands.map((b) => {
    const reached = state.t >= b.entersAt;
    return `<div class="cmd-row">
      <div class="t" style="color:${hex(b.color)}">${hms(b.entersAt).slice(0, 5)}</div>
      <div class="x"><strong style="color:var(--ink)">${esc(b.label)}</strong> — ${Math.round(b.mph)} mph.
      Somerset County enters this envelope ${Math.round(b.minutes)} min after departure${reached ? ' <span style="color:var(--claim)">— reached</span>' : ''}.</div>
    </div>`;
  }).join('');

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
        Band is ${Math.round(band.outer - band.inner).toLocaleString()} mi thick — ${state.toleranceMin ? `±${state.toleranceMin} min of departure` : 'no tolerance applied'}.
        Fargo to Somerset County is ${Math.round(t.miles)} mi.
      </div>
    </div>
    <div class="cmd-row" style="border-top:1px solid var(--line-2)">
      <div class="t" style="color:#fff">${Math.round(ceil).toLocaleString()} mi</div>
      <div class="x"><strong style="color:var(--ink)">Evidence ceiling</strong> — the furthest he can possibly be, taking the earliest departure the record permits (${hms(DEPARTURE_BOUNDS.firstKnowledge.t).slice(0, 5)}, ${esc(DEPARTURE_BOUNDS.firstKnowledge.why)}) ${srcTag(DEPARTURE_BOUNDS.firstKnowledge.src)}</div>
    </div>
    ${rows}
    <div class="cmd-row" style="border-top:1px solid var(--line-2)">
      <div class="t" style="color:${hex(HALF_FERRY_RING.color)}">${HALF_FERRY_RING.miles.toLocaleString()} mi</div>
      <div class="x"><strong style="color:var(--ink)">Ferry half-radius</strong> — the furthest point he could reach and still
      return on the same tanks. Somerset County is <strong class="v-routine">${Math.round(t.miles / HALF_FERRY_RING.miles * 100)}%</strong> of it,
      so even the round trip is not excluded by fuel alone.</div>
    </div>
    <div class="cmd-row">
      <div class="t" style="color:${hex(FERRY_RING.color)}">${FERRY_RING.miles.toLocaleString()} mi</div>
      <div class="x"><strong style="color:var(--ink)">${esc(FERRY_RING.label)}</strong> — Somerset County is
      <strong class="v-routine">${(t.fuel.ferryFraction * 100).toFixed(0)}%</strong> of this, well inside it.
      <strong>Fuel does not rule out the Pennsylvania leg.</strong> What it rules out is the full 4,522-mile itinerary,
      about 1.85× ferry range, which needs a refuelling stop. ${srcTag('press')}</div>
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
        To fire, he must have been within about <strong style="color:var(--ink)">${AIM9.rMaxMi} miles</strong> of United 93 — and no closer than ${AIM9.rMinMi}. The map draws that ring at Fargo, the one place the record puts him, so its size can be read against the envelope it sits inside.
      </p>
      ${started ? `
      <div class="leg-mach">
        How far he could have got by now: <strong style="color:var(--ink)">${Math.round(sc.envelopeDiameterMi).toLocaleString()} mi</strong> across ·
        how far the missile reaches: <strong style="color:var(--ink)">${Math.round(sc.wezDiameterMi)} mi</strong> ·
        ratio <strong class="v-impossible">1 : ${Math.round(sc.ratio).toLocaleString()}</strong>
      </div>
      <p style="margin:9px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.5">
        By area that is about <strong class="v-impossible">1 part in ${Math.round(sc.areaRatio).toLocaleString()}</strong>.
        The question was never whether he could reach Pennsylvania. It is whether he was inside a twenty-mile circle around one airliner at one instant — and nothing in the record puts him there, or anywhere else.
      </p>` : `
      <div class="leg-mach">
        The clock is at ${hms(state.t).slice(0, 5)}, before the takeoff this app grants him at
        ${hms(state.claimDepart).slice(0, 5)}. He has gone nowhere yet, so there is nothing to
        compare the missile's reach against.
      </div>
      <p style="margin:9px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.5">
        Move the clock past ${hms(state.claimDepart).slice(0, 5)} and this becomes the whole
        argument: the area he could be in grows every second, while the area he could shoot into
        stays ${(AIM9.rMaxMi * 2).toFixed(0)} miles across and never moves.
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
      <p>${esc(f.text)}</p>
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
    <p style="margin-top:6px"><strong style="color:var(--claim);font-family:var(--mono)">${Math.round(claimTotal)} mi</strong> total — ${(claimTotal / doc.totalMi).toFixed(1)}× the documented route, and ${(claimTotal / F16.ferryRangeMi).toFixed(1)}× the jet's maximum ferry range.</p>
    <p style="margin-top:9px;font-size:12px">The claimed itinerary crosses the continent three times to end up exactly where the documented one ends up after crossing it once.</p>`;
}

/* =============================================================================
   Panels — Flight 93 / debris
   ========================================================================== */

function renderDebrisTab() {
  const crater = DEBRIS[0];
  const rows = DEBRIS.map((d) => {
    const mi = haversineMi(crater, d);
    return `<div class="leg" data-debris="${esc(d.name)}">
      <div class="leg-head">
        <span class="leg-name">${esc(d.name)}</span>
        <span class="leg-dist">${mi < 0.1 ? 'origin' : mi.toFixed(2) + ' mi'}</span>
      </div>
      <p style="margin:0;font-size:12px;color:var(--ink-dim);line-height:1.5">${esc(d.note)}</p>
      <div style="margin-top:6px">${srcTag(d.src)}</div>
    </div>`;
  }).join('');

  $('#debris-body').innerHTML = `
    <div class="card">
      <h3>United 93 — final minutes ${conflictChip('UA93')}</h3>
      <p>Departed Newark 25 minutes late, which is the reason the hijackers were still airborne when news of the other three aircraft reached the passengers by phone. ${srcTag('commission')}</p>
      <p>The revolt began at <strong>09:57</strong>. At 09:59 the aircraft was down to <strong>5,000 ft</strong>; the fight for the controls then pitched it back up to about 10,000 before it went over. It hit the ground at <strong>10:03:11</strong>, 40 degrees nose-down and inverted, at about <strong>490 knots (563 mph)</strong>. ${srcTag('ntsb')}</p>
      <div class="chip-row">
        <button class="chip" data-act="fly-crash">Fly to the impact site</button>
        <button class="chip" data-act="show-debris">Show debris field</button>
        <button class="chip" data-act="goto-1003">Jump to 10:03</button>
      </div>
    </div>

    <div class="card">
      <h3>${esc(WHY_THEY_MATTER.title)}</h3>
      ${WHY_THEY_MATTER.paras.map((t) => `<p>${esc(t)}</p>`).join('')}
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
      ${FARADAY.answers.map((a) => `
        <div class="finding hard">
          <h4>${esc(a.head)}</h4>
          <p>${esc(a.text)}</p>
          <div style="margin-top:5px">${srcTag(a.src)}</div>
        </div>`).join('')}
      <p style="margin-top:11px"><strong>${esc(FARADAY.reading)}</strong> ${srcTag(FARADAY.src)}</p>
    </div>

    <div class="card">
      <h3>The calls</h3>
      ${CALLS.map((c) => `
        <div class="call-row ${c.type}">
          <div class="cr-t">${hms(c.t).slice(0, 5)}</div>
          <div>
            <div class="cr-who">${esc(c.who)} <span class="cr-to">→ ${esc(c.to)}</span>
              <span class="cr-type">${c.type === 'cellular' ? 'CELLULAR' : 'Airfone'}</span></div>
            <div class="cr-note">${esc(c.note)}</div>
          </div>
        </div>`).join('')}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:9px">
        A representative set, not all ${CALL_TOTALS.total} — many of the total are repeat calls by the same people. Times are approximate to the minute; sources vary by a minute or two on several. ${srcTag('press')}
      </p>
    </div>

    <div class="card">
      <h3>${esc(DEBRIS_NOTE.title)}</h3>
      ${refRow('UA93')}${refRow('SHKV')}
      ${DEBRIS_NOTE.body.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('')}
      <div>${srcTag(DEBRIS_NOTE.src)}</div>
    </div>

    <div class="card">
      <h3>Recorded debris locations</h3>
      <p style="font-size:11.5px;color:var(--ink-faint)">Distances below are true, computed from the crater coordinates, and the rings on the map mark 1, 3 and 8 true miles. <strong style="color:var(--debris)">The field is drawn on the map at roughly ${DEBRIS_MAGNIFY}× magnification</strong> — an 8-mile scatter is smaller than a single pixel on a map of the whole country. ${srcTag('derived')}</p>
      ${rows}
    </div>`;

  $$('#debris-body .chip').forEach((b) => b.addEventListener('click', () => {
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
            <strong style="color:var(--ink)">${esc(k.c.mapLabel)}</strong> —
            ${HYPO.callsign} would be <strong class="v-impossible">${Math.round(k.sepMi)} mi</strong>
            from United 93. That is <strong>${k.outsideBy.toFixed(1)}×</strong> the reach of its
            own missile, with ${Math.round(k.minsToShot)} minutes left to close.
            <span style="color:var(--ink-faint)">In sight of it — the two could see each other
            ${Math.round(k.losMi)} mi apart ${info('lineOfSight')} — but nowhere near able to
            shoot at it.</span>
          </div>
        </div>`;
    }
    return `
      <div class="cmd-row">
        <div class="t" style="color:var(--critic)">${hms(k.c.t).slice(0, 5)}</div>
        <div class="x">
          <strong style="color:var(--ink)">${esc(k.c.mapLabel)}</strong> — United 93 has been on
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
      That is not damning on its own — he is closing fast, and the claim only needs one instant.
      The second pair is the harder question. If an American fighter had just destroyed an
      American airliner, the channel built to reach the President in ten minutes is where that
      would appear, and two messages went out on it after United 93 was down.
    </p>
    <p style="margin:9px 0 0;font-size:12px;color:var(--ink-dim);line-height:1.55">
      <strong style="color:var(--ink)">What this app can and cannot say.</strong> It cannot tell
      you those messages are silent about a shootdown, because their contents are withheld. It
      can tell you that this is the record which would settle the question either way, that it is
      timestamped to the minute, that it sits in NSA's own files, and that the reason you cannot
      read it is a decision somebody made and can be asked to justify. ${srcTag('derived')}
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
      <p style="margin:0;font-size:12.5px;color:var(--ink-dim);line-height:1.5">${esc(c.body)}</p>
      <div class="redact"><b>Withheld:</b> ${esc(c.gap)}</div>
      <div class="critic-ctx">${esc(c.context)}</div>
      <div style="margin-top:6px">${srcTag(c.src)} ${conflictChip('CRITIC')}</div>
    </div>`;

  $('#critic-body').innerHTML = `
    <div class="card">
      <h3>${esc(CRITIC_BACKGROUND.title)}</h3>
      <p style="font-size:12.5px;color:var(--ink);line-height:1.55">
        In plain terms: a <strong>CRITIC</strong> ${info('critic')} is the most urgent message
        type US intelligence has. It is supposed to be in front of the President within ten
        minutes. Four went out that morning, and what they said is still withheld — which is
        what the public-records request ${info('foia')} behind this app is asking for.</p>
      ${CRITIC_BACKGROUND.paras.map((t) => `<p>${esc(t)}</p>`).join('')}
      <div>${srcTag(CRITIC_BACKGROUND.src)}</div>
      ${refRow('NSA')}${refRow('NORAD')}${refRow('NEADS')}
    </div>

    <div class="card">
      <h3>DIRNSA CRITIC 1-2001 — the chain</h3>
      <p style="font-size:11.5px;color:var(--ink-faint)">The codes beside each time are military timestamps ${info('dtg')} — NSA's own, from its records release. Clock times here are New York time. ${srcTag('foia')}</p>
      ${CRITIC_CHAIN.map(msg).join('')}
      <div class="leg critic-msg" style="opacity:.75">
        <div class="leg-head">
          <span class="critic-t">13 Sep</span>
          <span class="dtg">${esc(CRITIC_SUMMARY.dtg)}</span>
        </div>
        <div class="leg-name" style="margin-bottom:5px">${esc(CRITIC_SUMMARY.title)}</div>
        <p style="margin:0;font-size:12.5px;color:var(--ink-dim);line-height:1.5">${esc(CRITIC_SUMMARY.body)}</p>
        <div class="redact"><b>Withheld:</b> ${esc(CRITIC_SUMMARY.gap)}</div>
        <div class="critic-ctx">Two days later, so it sits outside this app's clock.</div>
      </div>
    </div>

    <div class="card critic-steel-card">
      <h3>Where the shootdown claim would have been, each time one went out</h3>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55">
        Every other source in this app describes what <em>happened</em>. The CRITIC describes
        what the government <em>believed was happening</em>, to the minute. So it is worth
        asking where ${esc(HYPO.callsign)} — the best case the shootdown story can have
        ${info('steelman')} — would have been at each of these four moments.
      </p>
      <div id="critic-steel"></div>
    </div>

    <div class="card glimpse">
      <h3>${esc(CRITIC_GLIMPSE.title)}</h3>
      ${CRITIC_GLIMPSE.items.map((i) => `
        <div class="finding hard">
          <h4>${esc(i.text)}</h4>
          <p>${esc(i.note)}</p>
          <div style="margin-top:5px">${srcTag(i.src)}</div>
        </div>`).join('')}
      <p style="margin-top:11px">${esc(CRITIC_GLIMPSE.reading)}</p>
      <div>${srcTag(CRITIC_GLIMPSE.src)}</div>
    </div>

    <div class="card">
      <h3>Distribution</h3>
      <p>${esc(DISTRIBUTION.note)} ${srcTag(DISTRIBUTION.src)}</p>
      <div class="chip-row">
        <button class="chip" data-act="show-critic">Show the alert network</button>
      </div>
    </div>

    <div class="card">
      <h3>The pending request</h3>
      <dl class="foia-row">
        <dt>Status</dt><dd>${esc(FOIA.status)}</dd>
        <dt>Filed via</dt><dd>${esc(FOIA.filedVia)}</dd>
        <dt>Publication</dt><dd>${esc(FOIA.publishAt)}</dd>
        <dt>Auto-declass</dt><dd>${esc(FOIA.autoDeclass)}</dd>
      </dl>
      <p style="margin-top:9px;font-size:12px">${esc(FOIA.autoDeclassNote)}</p>
      <h3 style="margin-top:14px">What is being asked for</h3>
      <ul class="plain">${FOIA.scope.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <p style="margin-top:10px;font-size:12px;color:var(--ink-faint)">If records are released, they land here: each message against the minute of the morning it was sent, with the rest of the timeline already drawn around it.</p>
      <div>${srcTag(FOIA.src)}</div>
    </div>`;

  renderCriticVsSteelman();

  $$('#critic-body .chip').forEach((b) => b.addEventListener('click', () => {
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
        ${f.events.map((e) => `<div class="cmd-row"><div class="t">${hms(e[0]).slice(0, 5)}</div><div class="x">${esc(e[1])}</div></div>`).join('')}
      </div>
      ${refRow(f.id)}
      <div class="chip-row"><button class="chip" data-milshow="${f.id}">Fly to</button></div>
    </div>`;

  $('#military-body').innerHTML = `
    <div class="card">
      <h3>What was actually airborne</h3>
      <p>An air defence built to look outward had a handful of alert fighters for the whole continental United States that morning. This is what got up, when, and where it went. ${srcTag('commission')}</p>
      <p style="font-size:11.5px;color:var(--ink-faint)">Tracks are reconstructions from documented endpoints and events, like the airliner tracks. Callsigns are as recorded on the NEADS tapes and in interviews; where sources disagree on a rendering, the entry says so.</p>
    </div>

    <div class="card kernel-card">
      <h3>${esc(KERNEL.title)}</h3>
      ${KERNEL.paras.map((p) => `<p>${esc(p)}</p>`).join('')}
      <div style="margin-top:8px">${srcTag(KERNEL.src)}</div>
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
            <div class="cs-what">${esc(c.what)}</div>
            <div class="cs-note">${esc(c.note)}</div>
            <div style="margin-top:4px">${srcTag(c.src)}</div>
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
function conflictChip(tag) {
  const cs = conflictsFor(tag);
  if (!cs.length) return '';
  const bad = cs.filter((c) => c.status === 'todo').length;
  return `<button class="cflag ${bad ? 'bad' : ''}" data-cjump="${tag}"
    title="${cs.length} recorded discrepancy/discrepancies affecting this record">&#9888; ${cs.length}</button>`;
}

function renderConflictsTab() {
  const card = (c) => {
    const st = STATUS_META[c.status];
    return `
    <div class="card conflict" id="cf-${c.id}">
      <div class="cf-head">
        <span class="cf-status ${st.tone}">${esc(st.label)}</span>
        <span class="cf-tags">${c.tags.map(esc).join(' · ')}</span>
      </div>
      <h4 class="cf-subject">${esc(c.subject)}</h4>
      <p class="cf-why">${esc(c.why)}</p>
      <div class="cf-readings">
        ${c.readings.map((r, i) => `
          <div class="cf-reading${i === 0 ? ' first' : ''}">
            <div class="cf-v">${esc(r.v)}</div>
            <div class="cf-who">${esc(r.who)} ${srcTag(r.src)}</div>
            <div class="cf-weight">${esc(r.weight)}</div>
          </div>`).join('')}
      </div>
      <div class="cf-reading-note"><strong>Reading:</strong> ${esc(c.reading)}</div>
      ${c.appSays ? `<div class="cf-app"><strong>In this app:</strong> ${esc(c.appSays)}</div>` : ''}
    </div>`;
  };

  const counts = {};
  for (const c of CONFLICTS) counts[c.status] = (counts[c.status] || 0) + 1;

  $('#conflicts-body').innerHTML = `
    <div class="card">
      <h3>Where the sources disagree</h3>
      <p>Every account of that morning conflicts with some other account somewhere. Hiding that would make this app look more settled than the evidence is, so each known discrepancy is recorded here with its competing readings and — where one can be had — a view on which deserves more weight.</p>
      <p>This app's own errors are in the same list, under the same headings, with no softer wording. ${srcTag('derived')}</p>
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

/* Jump from an inline marker to the first matching register entry. */
function jumpToConflict(tag) {
  $$('#tabs button').forEach((x) => x.classList.remove('on'));
  $('#tabs button[data-tab="conflicts"]').classList.add('on');
  $$('.tab-body').forEach((sec) => sec.classList.toggle('hidden', sec.dataset.body !== 'conflicts'));
  const first = conflictsFor(tag)[0];
  if (!first) return;
  const el = $(`#cf-${first.id}`);
  if (el) {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    el.classList.add('cf-hit');
    setTimeout(() => el.classList.remove('cf-hit'), 1600);
  }
}

/* =============================================================================
   Panels — layers
   ========================================================================== */

function renderLayersTab() {
  /* A flight carrying a pathNote gets it printed under its own toggle. The
     note is the difference between what the recorder says and what this app
     drew, and a caveat nobody can read is not a caveat. */
  const fl = FLIGHTS.map((f) => `
    <label class="toggle">
      <input type="checkbox" data-layer="${f.id}" ${state.layers[f.id] ? 'checked' : ''}>
      <span class="swatch" style="background:${hex(f.color)}"></span>
      <span>${esc(f.label)}</span>
      <span class="meta">${esc(f.type.replace('Boeing ', 'B'))}</span>
    </label>
    ${f.pathNote ? `<p style="font-size:11px;color:var(--ink-faint);line-height:1.55;
        margin:2px 0 10px 26px;border-left:2px solid var(--rule);padding-left:8px">
        ${esc(f.pathNote)} ${srcTag(f.src)}</p>` : ''}
    ${refRow(f.id, 'ref-indent')}`).join('');

  $('#layers-body').innerHTML = `
    <div class="card">
      <h3>Hijacked aircraft</h3>
      ${fl}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Tracks are reconstructions: documented positions and times, with the segments between them interpolated. The shape is indicative, not radar data. United 93 and American 77 are the two whose recorders were recovered, so their altitudes and timings are FDR values and their notes say where the drawing starts and the record stops. American 11 and United 175 have no recorder at all. ${srcTag('recon')}
      </p>
    </div>

    <div class="card">
      <h3>Military aircraft</h3>
      ${MIL_FLIGHTS.map((f) => `
        <label class="toggle">
          <input type="checkbox" data-layer="${f.id}" ${state.layers[f.id] ? 'checked' : ''}>
          <span class="swatch" style="background:${hex(f.color)}"></span>
          <span style="font-family:var(--mono);font-size:11.5px">${esc(f.label)}</span>
          <span class="meta">${esc(f.type.split(' ')[0])}</span>
        </label>`).join('')}
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Shown by default. QUIT flight is the North Dakota Air National Guard detachment at Langley — the unit at the centre of the claim. ${srcTag('press')}
      </p>
    </div>

    <div class="card">
      <h3>Gibney routes</h3>
      <label class="toggle">
        <input type="checkbox" data-layer="routeDoc" ${state.layers.routeDoc ? 'checked' : ''}>
        <span class="swatch" style="background:var(--doc)"></span>
        <span>Documented route</span><span class="meta">solid</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="routeClaim" ${state.layers.routeClaim ? 'checked' : ''}>
        <span class="swatch" style="background:var(--claim)"></span>
        <span>Route required by the claim</span><span class="meta">dashed</span>
      </label>
    </div>

    <div class="card">
      <h3>Geometry of the claim</h3>
      <label class="toggle">
        <input type="checkbox" data-layer="envelope" ${state.layers.envelope ? 'checked' : ''}>
        <span class="swatch" style="background:#ffd447"></span>
        <span>Reachability envelope</span><span class="meta">from Fargo</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="wez" ${state.layers.wez ? 'checked' : ''}>
        <span class="swatch" style="background:#ff4d4d"></span>
        <span>Sidewinder engagement zone</span><span class="meta">${AIM9.rMaxMi} mi, from Fargo</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="trail" ${state.layers.trail ? 'checked' : ''}>
        <span class="swatch" style="background:var(--ua93)"></span>
        <span>Recorded-data trail</span><span class="meta">UA93 + AA77 · FDR</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="calls" ${state.layers.calls ? 'checked' : ''}>
        <span class="swatch" style="background:#74c7ff"></span>
        <span>Phone calls from United 93</span><span class="meta">37 calls</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="aware" ${state.layers.aware ? 'checked' : ''}>
        <span class="swatch" style="background:#35d6a4"></span>
        <span>Who knew, and when</span><span class="meta">FAA &rarr; military</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="hypo" ${state.layers.hypo ? 'checked' : ''}>
        <span class="swatch" style="background:#fff"></span>
        <span>${esc(HYPO.callsign)} — best-case track</span><span class="meta">constructed</span>
      </label>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Rings grow from the departure time set on the claim tab. The red ring around United 93 is the zone a shooter had to be inside; at national zoom it is a dot, which is the honest impression. ${srcTag('derived')}
      </p>
    </div>

    <div class="card">
      <h3>Alert network</h3>
      <label class="toggle">
        <input type="checkbox" data-layer="critic" ${state.layers.critic ? 'checked' : ''}>
        <span class="swatch" style="background:var(--critic)"></span>
        <span>CRITIC chain</span><span class="meta">NORAD &rarr; NSA</span>
      </label>
      <p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px">
        Links appear as the clock reaches each date-time group. Solid is documented; dashed is where a CRITIC is designed to land, since the addressee lists are redacted. ${srcTag('foia')}
      </p>
    </div>

    <div class="card">
      <h3>Ground</h3>
      <label class="toggle">
        <input type="checkbox" data-layer="debris" ${state.layers.debris ? 'checked' : ''}>
        <span class="swatch" style="background:var(--debris)"></span>
        <span>Flight 93 debris field</span><span class="meta">${DEBRIS_MAGNIFY}× mag</span>
      </label>
      <label class="toggle">
        <input type="checkbox" data-layer="places" ${state.layers.places ? 'checked' : ''}>
        <span class="swatch" style="background:#9fb6cc"></span>
        <span>Airports &amp; landmarks</span>
      </label>
    </div>

    <div class="card">
      <h3>Plain-English glossary</h3>
      <p style="font-size:12px;color:var(--ink-dim);line-height:1.55">Every technical term this
      app uses, in ordinary words. The same definitions sit behind the small
      <span class="ii" style="cursor:default;pointer-events:none"></span> marks throughout the
      page &mdash; click one wherever you see it.</p>
      ${glossaryList().map((g) => `
        <div class="gl-row">
          <div class="gl-term">${esc(g.term)}</div>
          <div class="gl-plain">${esc(g.plain)}</div>
          ${g.more ? `<div class="gl-more">${esc(g.more)}</div>` : ''}
          ${g.link ? `<div class="ref-row"><a class="ref ref-wiki" href="${g.link.url}"
            target="_blank" rel="noopener noreferrer">${esc(g.link.label)}</a></div>` : ''}
        </div>`).join('')}
    </div>

    <div class="card">
      <h3>How to read this map ${conflictChip('DATA')}</h3>
      <p>States are real geometry — US Census cartographic boundaries at 1:10,000,000, extruded. Alaska, Hawaii and Puerto Rico sit in the conventional insets and are <em>not</em> at true position or scale. ${srcTag('geo')}</p>
      <p>The vertical axis defaults to <strong>true scale</strong> — the same units up as across. That makes the tracks look nearly flat, which is the honest picture: a cruising airliner is about 1:${Math.round(trueScaleRatio()).toLocaleString()} against the width of the country. The control in the map legend raises it to 2× or 5× when you need to read altitude structure, and says so whenever it is not 1.</p>
      <p>Provenance badges appear on every claim in this app: <span class="src solid">solid</span> for the documentary record, <span class="src soft">soft</span> for reconstruction or arithmetic done here, <span class="src warn">warn</span> for an allegation being tested.</p>
    </div>`;

  $$('[data-layer]').forEach((cb) => cb.addEventListener('change', () => {
    const k = cb.dataset.layer;
    state.layers[k] = cb.checked;
    if (FLIGHTS.some((f) => f.id === k) || MIL_FLIGHTS.some((f) => f.id === k)) {
      map.setFlightVisible(k, cb.checked);
    }
    else if (k === 'debris') map.setDebrisVisible(cb.checked);
    else if (k === 'critic') map.setCriticVisible(cb.checked);
    else if (k === 'aware') map.setAwarenessVisible(cb.checked);
    else if (k === 'hypo') { map.setHypoVisible(cb.checked); if (cb.checked) updateHypo(); }
    else if (k === 'calls') { map.setCallsVisible(cb.checked); map.setCalls(ua93StateAt, state.t); }
    else if (k === 'trail') { map.setTrailVisible(cb.checked); map.setTrail(state.t); }
    else if (k === 'envelope' || k === 'wez') {
      map.setReachVisible(state.layers.envelope || state.layers.wez);
      updateReach();
    }
    else if (k === 'routeDoc') map.setRouteVisible('documented', cb.checked);
    else if (k === 'routeClaim') map.setRouteVisible('claim', cb.checked);
    else if (k === 'places') map.placeGroup.visible = cb.checked;
    map.setTime(state.t);
  }));
}

function syncLayerChecks() {
  $$('[data-layer]').forEach((cb) => { cb.checked = !!state.layers[cb.dataset.layer]; });
}

/* =============================================================================
   Labels overlay
   ========================================================================== */

const labelEls = new Map();

function drawLabels() {
  const wanted = new Map();

  if (state.layers.places) {
    for (const { key, mesh, p } of map.placeDots) {
      wanted.set(`p:${key}`, { pos: mesh.position, text: p.short || p.name, cls: 'dim', rank: 3 });
    }
  }

  for (const [id, o] of map.flightObjs) {
    if (!o.visible) continue;
    if (o.marker.visible) {
      const s = o.sample;
      wanted.set(`f:${id}`, {
        pos: o.marker.position,
        text: `${id} · ${Math.round((s?.altFt ?? 0) / 100) * 100} ft`,
        cls: 'flight', color: hex(o.f.color), rank: o.isMil ? 1.5 : 0,
      });
    } else if (o.impact.visible) {
      wanted.set(`f:${id}`, { pos: o.impact.position, text: `${id} impact`, cls: 'flight', color: hex(o.f.color), rank: 1 });
    }
  }

  if (map.hypoGroup && map.hypoGroup.visible && map.hypoHorizonInfo) {
    const hz = map.hypoHorizonInfo;
    wanted.set('horizon', {
      ringLL: hz.ringLL, order: hz.order,
      text: `Line-of-sight horizon · ${Math.round(hz.miles)} mi`,
      cls: 'ring', color: hex(LOS_HORIZON.color), rank: 2.4,
    });
  }

  if (map.hypoGroup && map.hypoGroup.visible && map.hypoLosInfo) {
    const li = map.hypoLosInfo;
    wanted.set('los', {
      pos: li.mid,
      text: `${li.miles < 1 ? li.miles.toFixed(2) : Math.round(li.miles)} mi${li.inWez ? ' — WITHIN AIM-9 RANGE' : ''}`,
      cls: `flight los${li.inWez ? ' hot' : ''}`,
      color: li.inWez ? '#ff4d4d' : li.miles <= 50 ? '#ffd447' : '#9fb6cc',
      rank: 1.1,
    });
  }

  if (map.hypoGroup && map.hypoGroup.visible && map.hypoMarker.visible) {
    const sm = map._hypoSample;
    wanted.set('hypo', {
      pos: map.hypoMarker.position,
      text: `${HYPO.callsign} — CONSTRUCTED · ${Math.round((sm?.altFt ?? 0) / 100) * 100} ft`,
      cls: 'flight hypo', color: '#ffffff', rank: 1.2,
    });
  }

  /* The awareness handoffs, and a standing counter on the military node. */
  for (const al of map.awarenessLabels()) {
    wanted.set(al.key, {
      pos: al.pos,
      text: al.text,
      cls: `aware-line aw-${al.actor}${al.fresh ? ' fresh' : ''}${al.dark ? ' dark' : ''}`,
      rank: al.dark ? 0.15 : 0.35,
    });
  }

  /* The CRITIC arcs, named as each message fires. These outrank almost
     everything else on the map: the withheld messages are the subject. */
  for (const cl of map.criticLabels()) {
    wanted.set(cl.key, {
      pos: cl.pos,
      text: cl.text,
      cls: `critic-line${cl.fresh ? ' fresh' : ''}`,
      rank: 0.2,
    });
  }

  if (map.reachGroup.visible && map.reachLabelAnchors) {
    for (const a of map.reachLabelAnchors) {
      wanted.set(`r:${a.text}`, {
        ringLL: a.ringLL, order: a.order, text: a.text,
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

  /* Seed the declutter with the HUD and legend boxes so a label never lands
     underneath them. They are HTML siblings, not part of the scene, so the
     layout has no other way to know they are in the way. */
  const hostBox = host.getBoundingClientRect();
  const taken = ['#hud', '#legend', '#aside-toggle'].map((sel) => {
    const el = $(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      l: r.left - hostBox.left - 6, r: r.right - hostBox.left + 6,
      t: r.top - hostBox.top - 6, b: r.bottom - hostBox.top + 6,
    };
  }).filter(Boolean);

  const ordered = [...wanted.entries()].sort((a, b) => (a[1].rank ?? 9) - (b[1].rank ?? 9));

  for (const [k, w] of ordered) {
    let el = labelEls.get(k);
    if (!el) {
      el = document.createElement('div');
      host.appendChild(el);
      labelEls.set(k, el);
    }
    if (el.textContent !== w.text) el.textContent = w.text;
    el.className = `map-label ${w.cls}`;
    if (w.color) el.style.color = w.color;

    /* A ring label walks its own ring, from the preferred bearing outward,
       and stops at the first vertex on screen. So if any part of a ring is
       visible, its label is too — which is the rule the reader expects. */
    let s;
    if (w.ringLL) {
      const M = 10;
      const fits = (q) => !q.behind && q.x > M && q.y > M && q.x < W - M && q.y < H - M;
      for (const i of w.order) {
        const q = map.llToScreen(w.ringLL[i]);
        if (fits(q)) { s = q; break; }
      }
      if (!s) { el.style.display = 'none'; continue; }
    } else {
      s = map.toScreen(w.pos);
      if (s.behind || s.x < -60 || s.y < -30 || s.x > W + 60 || s.y > H + 30) {
        el.style.display = 'none';
        continue;
      }
    }

    // Pin labels are translated (-50%, -140%) so their box sits above the
    // anchor; ring labels are centred on it. Using the wrong box makes the
    // declutter reject the wrong ones.
    const w2 = (el.offsetWidth || w.text.length * 6) / 2;
    const h = el.offsetHeight || 15;
    const centred = w.cls === 'ring';
    const box = centred
      ? { l: s.x - w2, r: s.x + w2, t: s.y - h * 0.5, b: s.y + h * 0.5 }
      : { l: s.x - w2, r: s.x + w2, t: s.y - h * 1.4, b: s.y - h * 0.4 };

    const blocked = taken.some((o) => box.l < o.r + 2 && box.r > o.l - 2 && box.t < o.b + 2 && box.b > o.t - 2);
    if (blocked) { el.style.display = 'none'; continue; }

    taken.push(box);
    el.style.display = '';
    el.style.left = `${s.x}px`;
    el.style.top = `${s.y}px`;
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
  map.setHypoVisible(state.layers.hypo);
  map.setCallsVisible(state.layers.calls);
  map.setTrailVisible(state.layers.trail);
  updateReach();
  updateHypo();
  map.setTrail(state.t);
  map.setCalls(ua93StateAt, state.t);
  map.setTime(state.t);
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
  $('#tour-body').innerHTML = typeof step.body === 'function'
    ? step.body(tourContext(), info)
    : step.body;
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

function bindInfo() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ii');
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

function renderBriefTab() {
  const bl = BOTTOM_LINE, wc = WHY_CRITIC;

  const section = (w) => `
    <details class="wt" id="${w.id}">
      <summary>
        <span class="wt-kicker">${esc(w.kicker)}</span>
        <span class="wt-head">${esc(w.headline)}</span>
        <span class="wt-more" aria-hidden="true"></span>
      </summary>
      <div class="wt-body">
        ${w.body.map((p) => `<p>${p}</p>`).join('')}
        ${w.counter ? `
          <div class="wt-counter">
            <div class="wt-counter-q">${esc(w.counter.point)}</div>
            <p>${w.counter.text}</p>
            ${w.counter.more === 'awareness'
              ? `<button class="chip" data-goto="aware">See the whole chain &rarr;</button>` : ''}
          </div>` : ''}
      </div>
    </details>`;

  $('#brief-body').innerHTML = `
    <div class="card bluf">
      <div class="bluf-kicker">${esc(bl.kicker)}</div>
      <h2>${esc(bl.headline)}</h2>
      ${bl.paras.map((p) => `<p>${p}</p>`).join('')}
      <p class="bluf-note">${esc(bl.verdictNote)} ${srcTag(bl.src)}</p>
      <div class="chip-row">
        <button class="chip chip-go" data-goto="tour">&#9654; Walk me through it</button>
      </div>
    </div>

    <div class="card critic-steel-card">
      <div class="bluf-kicker">${esc(wc.kicker)}</div>
      <h3>${esc(wc.headline)}</h3>
      ${wc.paras.map((p) => `<p>${p}</p>`).join('')}
      <p class="bluf-note">${esc(wc.hook)} ${srcTag(wc.src)}</p>
      <div class="chip-row">
        <button class="chip" data-goto="critic">The four messages &rarr;</button>
      </div>
    </div>

    <h3 class="sec-head">The walkthrough</h3>
    <p class="sec-note">${WALKTHROUGH.length} steps. Headlines alone are the short version;
    open any one for the detail and the strongest objection to it.</p>
    ${WALKTHROUGH.map(section).join('')}

    <h3 class="sec-head">However long you have</h3>
    <div class="paths">
      ${PATHS.map((p) => `
        <button class="path" data-goto="${esc(p.act.replace('tab:', ''))}">
          <span class="path-min">${esc(p.min)}</span>
          <span class="path-label">${esc(p.label)}</span>
          <span class="path-note">${esc(p.note)}</span>
        </button>`).join('')}
    </div>`;

  $$('#brief-body [data-goto]').forEach((b) => b.addEventListener('click', () => {
    const to = b.dataset.goto;
    if (to === 'tour') { tourEnter(); return; }
    gotoTab(to);
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
          <p class="aw-what">${esc(a.what)}</p>
          <p class="aw-bearing"><strong>What it establishes:</strong> ${esc(a.bearing)}
            ${srcTag(a.src)}</p>
          ${a.weigh === 'fighters-question' ? `
            <button class="chip" data-weigh="fighters-question">
              Does this show foreknowledge? &rarr;</button>` : ''}
        </div>
      </div>`;
  };

  const fq = FIGHTERS_QUESTION;

  $('#aware-body').innerHTML = `
    <div class="card bluf">
      <div class="bluf-kicker">The short version</div>
      <h2>The crash was not a surprise to the government. It was a surprise to the military.</h2>
      <p>The civil side had United 93 continuously for
        <strong>${Math.round(g.civilMinutes)} minutes</strong> before it went down. They heard the
        takeover live, kept it on radar after the transponder went off, and worked out how many
        minutes it was from Washington.</p>
      <p>The air defence sector heard the words "United 93" for the first time
        <strong>${Math.round(g.militaryLateMinutes)} minutes after it had already crashed</strong> —
        a gap of ${Math.round(g.gapMinutes)} minutes between the two halves of the same government.</p>
      <p class="bluf-note">That gap is the most important fact about Flight 93, and it is the
        thing the shootdown story needs not to exist. ${srcTag('derived')}</p>
    </div>

    <div class="card">
      <h3>Who is who</h3>
      ${Object.values(ACTORS).map((a) => `
        <div class="aw-key"><i style="background:${a.color}"></i>
          <b>${esc(a.label)}</b> — ${esc(a.note)}</div>`).join('')}
    </div>

    <h3 class="sec-head">The chain, minute by minute</h3>
    <div class="aw-list">${AWARENESS.map(row).join('')}</div>

    <div class="card fk-card" id="fighters-question">
      <h3>${esc(fq.title)}</h3>
      <p><strong>${esc(fq.short)}</strong></p>
      ${fq.readings.map((r) => `
        <div class="cmd-row">
          <div class="t" style="color:var(--ink-faint)">${esc(r.who)}</div>
          <div class="x">${esc(r.v)} <span style="color:var(--ink-faint)">${esc(r.weight)}</span>
            ${srcTag(r.src)}</div>
        </div>`).join('')}
      <ul class="plain" style="margin-top:10px">
        ${fq.points.map((p) => `<li>${esc(p)}</li>`).join('')}
      </ul>
      <p class="fk-caution"><strong>The limit:</strong> ${esc(fq.limit)} ${srcTag(fq.src)}</p>
    </div>

    <div class="card">
      <h3>The objection this answers</h3>
      <p class="aw-obj">${esc(AWARENESS_COUNTER.objection)}</p>
      ${AWARENESS_COUNTER.answers.map((a) => `
        <div class="finding">
          <h4>${esc(a.point)}</h4>
          <p>${esc(a.detail)} ${srcTag(a.src)}</p>
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
function gotoTab(name) {
  const btn = $(`#tabs button[data-tab="${name}"]`);
  if (!btn) return;
  $$('#tabs button').forEach((x) => x.classList.toggle('on', x === btn));
  $$('.tab-body').forEach((sec) => sec.classList.toggle('hidden', sec.dataset.body !== name));
  const body = $(`.tab-body[data-body="${name}"]`);
  if (body) body.scrollTop = 0;
  document.body.classList.remove('map-open');
}

function bindChrome() {
  $('#btn-play').addEventListener('click', () => {
    if (state.t >= T1) setTime(T0);
    setPlaying(!state.playing);
  });

  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cjump]');
    if (chip) { e.preventDefault(); e.stopPropagation(); jumpToConflict(chip.dataset.cjump); }
  }, true);

  const n = openCount();
  if (n) $('#conflict-count').textContent = ` ${n}`;

  $$('#alt-group button').forEach((b) => b.addEventListener('click', () => setAltScale(+b.dataset.alt)));

  $('#btn-follow').addEventListener('click', () => setFollow(!state.follow));

  $('#btn-reset-view').addEventListener('click', () => {
    setFollow(false);
    map.resetView();
  });

  $$('#rate-group button').forEach((b) => b.addEventListener('click', () => {
    $$('#rate-group button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    state.rate = +b.dataset.rate;
  }));

  $$('#tabs button').forEach((b) => b.addEventListener('click', () => gotoTab(b.dataset.tab)));

  // Mobile: swap between the map and the reading, since both cannot be tall.
  const mapBtn = $('#btn-map');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    document.body.classList.toggle('map-open');
    mapBtn.textContent = document.body.classList.contains('map-open') ? 'Read' : 'Map';
    setTimeout(() => map.resize(), 260);
  });

  $('#aside-toggle').addEventListener('click', () => {
    document.body.classList.toggle('panel-hidden');
    setTimeout(() => map.resize(), 280);
  });

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
