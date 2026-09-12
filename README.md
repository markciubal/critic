# CRITIC — DIRNSA CRITIC 1-2001

A single-page app in plain JavaScript, built around one question: what was the
US national command structure actually told on the morning of 11 September
2001, and when?

The spine of it is the CRITIC chain. A Critical Intelligence Communication is
the highest-precedence alert in the American system, established under NSCID
No. 7 and designed to place information before the President within minutes. On
that morning NORAD originated one at 09:49 EDT; NSA's National Security
Operations Center retransmitted it as a LATERAL CRITIC three minutes later and
followed it up twice. NSA has acknowledged all four messages, released them
under FOIA, and redacted the substance.

So the app draws both halves of a comparison. It puts the four hijacked
aircraft, the military response and the Flight 93 debris field on a 3D map
against a scrubbable clock — the record of what was *happening* — and it marks
the four CRITIC date-time groups on that same clock as holes, because the
record of what was *reported* is still withheld.

It also carries a subsidiary case: a 2004 allegation that United 93 was shot
down, tested by measuring what that allegation would require an F-16 to do.

## Running it

There are two entry points, and they run the same code.

**`index.html`** — the single-file build. Everything is inlined: styles, all
eleven modules, Three.js and the state geometry. No fetch, no module loader, no
network. Double-click it, or serve it from anywhere. This is the deployable
artifact and what GitHub Pages serves.

**`dev.html`** — the modular shell. Loads `src/*.js` as ES modules and fetches
the TopoJSON, so it needs a local server. This is the one to read and edit.

```
python -m http.server 8000   # then open http://localhost:8000/dev.html
```

### Building

```
node build.mjs        # regenerates index.html from the source
```

`index.html` is generated but **committed**, because it is the artifact people
actually open. Rebuild and commit it alongside any change under `src/`.

The bundler is about 150 lines and does the minimum: each module is wrapped in
an IIFE and assigned into a registry, with its imports rewritten as
destructuring from that registry. Concatenation would not work — `at()` is
defined independently in four modules — and this way module scope is preserved
exactly, so the bundled source stays diffable against the originals. `export
let` is returned through a getter so live bindings stay live.

There is no package manager and no runtime dependency. Three.js is vendored in
`vendor/`; the state geometry is in `data/`.

## Controls

| | |
|---|---|
| Drag | Pan |
| Right-drag / shift-drag / ctrl-drag | Rotate |
| Scroll | Zoom |
| Click | Inspect a state, aircraft, airfield or debris point |
| Space | Play / pause |
| ← / → | Step 30s (hold Shift for 5 min) |
| Home | Back to 07:55 |
| F | Toggle Follow |

The map legend carries a **vertical scale** control: `1x true`, `2x`, `5x`.

### The steelman tour

**Steelman tour** in the top bar plays a scripted walk through the argument in
`src/steelman.js` — twelve steps, about three and a half minutes unattended.

It exists because the steelman is the one thing here that cannot be read out of
order. It grants ten assumptions, and the whole point lives in the sequence: six
concessions are free, the kinematics then *survive*, and only after that do four
separate blockers land. Someone scrubbing the timeline at random never assembles
that order, and the argument collapses into "a fast jet could have got there" —
which is the opposite of what it says.

Each step owns the clock, the camera, the visible layers and the open panel, and
sets all four, so what is being said and what is being shown cannot drift apart.
Step bodies are functions over the live model rather than fixed prose, so the
callout cannot print a figure the panel beside it disagrees with.

| | |
|---|---|
| Space | Pause / resume the tour |
| ← / → | Previous / next step |
| Esc | Leave |

Taking the camera by hand pauses the tour rather than being overridden on the
next tick. Leaving by any route — the tour button, the ✕, Esc, or running off
the end — restores the clock, the layers, the camera and the open tab exactly as
they were. The tour borrows the app; it does not redecorate it.

## What's in it

**The CRITIC chain** — the four messages on the timeline as first-class events,
each with its DTG, its position against the rest of the morning, and a
redaction bar standing in for what NSA withheld. Plus the alert network on the
map: NORAD Colorado to NSA Fort Meade drawn solid, because that hop is
documented, and everything onward drawn dashed, because the addressee lists are
redacted and a solid line would assert the thing the FOIA request is trying to
establish.

**Four flight tracks** — AA11, UA175, AA77 and UA93, with altitude on the
vertical axis, a ground track below, and a per-aircraft readout of altitude
and ground speed that updates as you scrub.

**A timeline** from 07:55 to 11:00 EDT — it has to clear FOLLOW-UP-2 AND FINAL
at 10:48 — with every event marked on the
scrubber. Clicking an event jumps the clock and flies the camera to it.

**Follow mode**, on by default: as you scrub, the camera continuously reframes
whatever is in the air. It tightens onto New England when only American 11 is
up, widens across the Northeast and Ohio as the others launch, and holds on a
crash site for a couple of minutes after an impact rather than cutting away the
instant the aircraft stops existing.

It frames the whole active set rather than chasing one aircraft, so the camera
glides instead of cutting. Panning or zooming by hand switches Follow off — you
have taken the wheel — while orbiting does not, so you can rotate around a
moving subject and stay locked on. `Reset view` stops following and shows the
whole country; the Follow button or `F` resumes.

**The Flight 93 debris field**, with distance rings at 1, 3 and 8 true miles
from the crater.

**Military aircraft and callsigns** — PANTA, QUIT, GOFER 06 and BULLY as
tracked layers, plus a callsign reference covering NEADS (HUNTRESS), the
tankers, the AWACS and the E-4B. See below for why QUIT matters.

**A discrepancy register** — every known contradiction between sources, with
the competing readings side by side, who says what, and a view on which
deserves more weight. See below.

**The claim tab** — the substance of the thing. See below.

## What the redaction leaves

Two fragments survived it, and both are errors:

- a report of a **"Boeing 767 aircraft originating from JFK"** heading for
  Washington — a flight that did not exist;
- confusion over the location of American Airlines Flight 77, which had struck
  the Pentagon twelve minutes before the CRITIC was originated.

That is not evidence the rest is wrong. It is the reason the rest is worth
having. Set the 09:49 origination against what the app already draws: NORAD
fired the nation's highest-priority warning channel twelve minutes after the
Pentagon was hit and fourteen minutes before United 93 went down — and NEADS
would not learn United 93 existed until 10:07, four minutes *after* it crashed.
At the moment the CRITIC went out, part of what was going up the chain was a
phantom, and the one real aircraft still flying was not in it.

## Reachability and the engagement zone

Gibney's day has documented *places* and essentially no documented *times*, so
for almost the whole morning nothing puts him at any particular point. The app
draws that as a disc rather than a line — everywhere an F-16 could reach from
its last anchor in the elapsed time — with rings at cruise, Mach 1.2 low and
Mach 2.0 high, plus a fixed ring at the 340-mile unrefuelled combat radius.

### The rings are bands, not lines

No departure time for Gibney has ever been published, so a hairline ring would
assert a precision the record does not have. Each band is drawn as an annulus —
solid outer edge, dashed inner — whose thickness is the departure-time
tolerance, selectable as exact / ±5 / ±10 / ±20 minutes and defaulting to ±10.
At 915 mph, ±10 minutes is a band **305 miles thick**. Every ring is labelled on
the map with its speed, its outer radius, and the band range.

The bounds that *are* documented are the day's own, and they beat an arbitrary
tolerance:

| Bound | Time | Why it matters |
|---|---|---|
| First knowledge | 08:46:40 | The first impact. Earlier needs foreknowledge, not orders. |
| National ground stop | 09:26 | The FAA halts all departures. |
| SCATANA | 09:45 | All aircraft ordered down — the point at which the documented tasking, fetching a man civil aviation can no longer move, actually exists. |

From first knowledge the app draws an **evidence ceiling**: the furthest he can
possibly have got by any moment, taking the earliest departure the record
permits. At 09:58 that ceiling is **1,088 miles** and Somerset County is 1,012 —
inside it by 76 miles. The kinematic door is open by a crack. Fuel is what
shuts it.

From an 08:46 departure, Somerset County enters the cruise envelope at 10:31,
the Mach 1.2 envelope at 09:52, and the Mach 2.0 envelope at 09:32. It never
enters the fuel ring at all: it is **3.0x** that radius, and waiting longer
does not help, because time buys distance and fuel does not.

Against that sits the weapon. An AIM-9M is a within-visual-range missile with a
maximum of roughly 11 miles and a minimum of about 0.6, so its engagement zone
is an annulus about 22 miles across, drawn around United 93 as it flies. At
09:58 the reachability envelope is about 2,200 miles across and the engagement
zone is 22 — a linear ratio of about **1:98**, or **1 part in 9,600 by area**.

The published missile figures are best-case: co-altitude, favourable aspect,
high and thin air. The FDR puts United 93 at about 5,000 ft at 09:58, the
bottom of its descent and the worst altitude band for a Sidewinder.

**An envelope is a statement about circles, not about people.** Every point
inside one is equally unevidenced, and that morning the envelope of nearly any
fighter in the eastern half of the country would have swept over Somerset
County eventually. It is drawn to show the size of the gap in the record, and
the fuel ring is drawn to show how much smaller that gap really is.

## The fuel is not a concession

The app used to grant the external tanks as a favour to the claim. That was too
generous, and the correction runs the other way from what you would expect.

Bozeman to Albany — an undisputed leg of Gibney's documented day — is
**1,843 miles in one hop**. The tank fit roughly doubles internal fuel, so a
clean airframe reaches about 1,225 miles; carrying a passenger forces a two-seat
F-16B/D with ~17% less internal fuel, which brings a clean jet down to about
**1,020 miles**. The leg is 1.8x that, and there was no aerial refuelling. The
tanks are established by the mission, not granted here.

Which then costs the claim the thing it needs most. The same documented mission
that proves the tanks also proves the route, and the steelman only closes
because it deletes the middle of it:

| Route to the intercept | Distance | Speed required |
|---|---|---|
| Fargo direct (skips Bozeman) | ~990 mi | ~Mach 1.2 — inside the placard |
| Fargo **via Bozeman** | ~2,330 mi | ~Mach 2.9 — nearly 2x the placard |

A tanked F-16 is placarded to Mach 1.6, and the clean Mach 2.0 dash figure is
unavailable to an aircraft carrying tanks. The via-Bozeman figure also grants
zero seconds on the ground, when he had to land, board a civilian and get
airborne again.

So one piece of evidence does both jobs in opposite directions. You can use the
documented mission to establish the fuel, or to establish the route. The claim
needs the first and cannot survive the second.

Both figures are computed live in `src/steelman.js` (`fuelProof`,
`bozemanCost`) rather than written down, so the panel and the tour cannot drift
from each other. Whether that Bozeman–Albany leg was truly flown nonstop is
logged as an open item in the discrepancy register.

## The claim being tested

In February 2004, Col. Donn de Grand-Pre (US Army, ret.) said on The Alex Jones
Show that United 93 was shot down by "Major" Rick Gibney of the North Dakota
Air National Guard, using two Sidewinder missiles.

Rick Gibney is a real person who really was flying an F-16 that morning, which
is presumably why the story attached to him. His actual tasking, confirmed by
his unit and by his passenger, was to fly Ed Jacoby Jr. — New York State's
director of emergency management — from Bozeman, Montana back to Albany, New
York, because every civil aircraft in the country was grounded.

The app tests the claim by taking its implied itinerary seriously and measuring
it:

- **Documented:** Fargo → Bozeman → Albany, about 2,530 miles.
- **Required by the claim:** Fargo → Shanksville → Bozeman → Albany, about
  4,520 miles, crossing the continent three times to finish exactly where the
  documented route finishes after crossing it once.

A dial sets the earliest moment Gibney could have launched; the app computes
the ground speed the Pennsylvania leg then demands and grades it against the
F-16's published envelope.

Two things about how this is presented are deliberate:

**The model is generous to the claim at every branch point.** Great-circle
legs, zero turnaround, instant climbs, still air, no fuel stop charged against
the clock. Those assumptions all make the claimed itinerary easier. They are
listed in the UI.

**The app does not overclaim on speed.** At the most favourable departure time,
the required speed comes out achievable-but-punishing rather than impossible,
and the app says so in those words. The claim fails on fuel, on geometry, and
on a command timeline in which NEADS did not learn United 93 existed until four
minutes after it hit the ground — not on raw airspeed. Overstating the speed
argument would have been the easy version and the wrong one.

## The grain of truth: QUIT flight

The single most useful fact in this app is one the claim distorts rather than
invents.

The 119th Fighter Wing — the Happy Hooligans, Gibney's own wing — kept a
permanent alert detachment at **Langley Air Force Base, Virginia**. When the
klaxon went at 09:24 it was three North Dakota pilots who ran to the jets:
Maj. Dean Eckmann, Maj. Brad Derrig and Maj. Craig Borgstrom, callsign
**QUIT 25/26/27**. They were vectored east over the Atlantic by mistake, lost
several minutes to it, and by 09:58 QUIT 26 was over the Pentagon at 23,000
feet flying the first combat air patrol ever mounted over the capital.

So "North Dakota Air Guard F-16s were up there on 9/11" is *true*. That is
almost certainly how Gibney's name got attached to a shootdown. Everything
built on top of it is not: those jets launched from Virginia, not Fargo; they
were holding over Washington; and Gibney was not among them.

Meanwhile the one aircraft that actually came near both the Pentagon strike and
the Shanksville crash was **GOFER 06** — an unarmed Minnesota ANG C-130 flying
home from the Caribbean, whose crew was asked to look for smoke and found it.
Its pilot, Lt. Col. Steven O'Brien, said later there was no way he would have
had any means of engaging either airliner.

Scrub to 09:58 with the QUIT layer on and the claim event visible, and the two
sit on the same minute in the event list.

## The discrepancy register

Every account of that morning conflicts with some other account somewhere, and
a clean-looking record implies a settledness the evidence does not have. So
each known conflict is recorded in `src/conflicts.js` and rendered in the
Conflicts tab with its competing readings ordered strongest-first, each tagged
with its source and a note on why it carries the weight it does.

Entries carry one of four statuses:

| Status | Meaning |
|---|---|
| `resolved` | The app follows the best-supported reading. |
| `todo` | **The app still carries the weaker reading.** A known defect. |
| `open` | Sources conflict and nothing available settles it. |
| `flagged` | Not a conflict between sources — a single source contradicting itself. |
| `withheld` | Not disputed — redacted. Identified, dated, acknowledged, and blank. |

This app's own errors are in the same list under the same headings, in the same
red, with no softer wording. At the time of writing there are 14 entries, 10 of
them unresolved, 4 of which are defects in this app rather than in the record.

Affected records elsewhere in the UI carry an inline ⚠ marker that jumps to the
relevant entry — the GOFER 06 card, the callsign reference, the Flight 93 and
claim panels.

The richest entry is GOFER 06's distance from the crash site, where four
sources give 30 miles, ~34 nautical miles, 20 miles and 17 miles. The figure
shrinks with every retelling, which is how remembered distances behave.

## Provenance

Every record in `src/data.js` carries a `src` tag, and the UI renders it as a
badge, because the whole point of an app like this is that a reader can tell
the categories apart:

| Tag | Meaning |
|---|---|
| `commission` | 9/11 Commission Report and its staff monograph on the four flights |
| `press` | Contemporary reporting / on-the-record interviews |
| `geo` | Surveyed coordinates |
| `recon` | Path reconstruction — documented waypoints, interpolated between |
| `ntsb` | NTSB Flight Path Study — altitudes off the recovered flight data recorder |
| `derived` | Arithmetic done by this app, shown with its inputs |
| `claim` | An allegation, reproduced so it can be tested. Not a fact. |

## Known limitations

These are real and stated rather than buried:

- **Flight tracks are reconstructions, not radar data** — with one exception.
  No 84th RADES radar file is plotted anywhere in this app. AA11, UA175 and
  AA77 are hand-placed waypoints from the Commission narrative, roughly one
  every six minutes, with great-circle interpolation between them. A real RADES
  track would be ~4.8-second sweeps: several hundred points per flight.
- **United 93 is the exception, and only vertically.** Its altitudes are FDR
  values from the NTSB Flight Path Study (Figure 2) and are tagged `ntsb`. Its
  lateral track is traced by eye from the study's printed radar ground track
  (Figure 1), so the ground path is still an approximation.
- **No published minute-by-minute log of Gibney's day exists.** The app does
  not invent one — that is exactly why departure time is a dial you set rather
  than a number asserted. The argument is built to not depend on it.
- **Altitude defaults to true scale (1x)** — the same units up as across. At
  that scale the tracks look almost flat, because a 35,000 ft cruise is 6.6
  miles above a country 2,800 miles wide, a ratio of about **1:422**. That is
  the honest picture, and an app that argues from distances should not inflate
  one axis to make a nicer one. 2x and 5x are offered because altitude
  *structure* — United 93's climb to 41,000 and its dive to 5,000 — is hard to
  read at 1x, and the legend names the factor whenever it is not 1.
- **The extruded state slab is a plinth, not terrain.** It was 1.1 map units,
  which at true scale is about 24 miles of apparent thickness — taller than any
  altitude the app plots. It is now 0.6 so a 1x track clears it. It still
  measures nothing.
- **The debris field is drawn at ~42× magnification.** An 8-mile scatter is
  smaller than a pixel on a map of the whole country. All *quoted* distances
  are true, computed from unmagnified coordinates.
- **Alaska, Hawaii and Puerto Rico are in conventional Albers insets** and are
  not at true position or scale. Pacific territories are dropped rather than
  drawn somewhere misleading.
- **Follow holds its last framing when nothing is airborne** rather than
  snapping back to a national view, which would mean a jarring zoom-out every
  time you scrubbed before 07:59. Use `Reset view` to get the country back.
- **Marker sizes are not to scale** and never were. They shrink with camera
  distance so they stay legible at any zoom; at close range an aircraft glyph
  still covers several miles of ground.

## Layout

```
index.html          GENERATED single-file build — the deployable artifact
dev.html            modular shell for development
build.mjs           the bundler
styles.css
src/
  main.js           playback clock, scrubber, panels, label overlay, tour driver
  map3d.js          Three.js scene: extruded states, tracks, routes, debris
  data.js           timeline, airliners, debris, the claim; provenance tags
  military.js       military callsigns, tracks and the QUIT/GOFER records
  conflicts.js      the discrepancy register, including this app's own defects
  critic.js         DIRNSA CRITIC 1-2001: the chain, the alert network, the gaps
  reachability.js   travel envelopes, the AIM-9 engagement zone, the scale ratio
  steelman.js       the claim's best possible case, and what survives it
  tour.js           the guided walk through that argument — steps as data
  analysis.js       the feasibility engine
  geo.js            haversine, great-circle interpolation, Mach
  projection.js     composite Albers USA, hand-rolled
  topo.js           minimal TopoJSON decoder (~50 lines, no dependency)
data/states-10m.json    US Census cartographic boundaries, 1:10m (us-atlas)
vendor/three.module.js  Three.js r160
```

## Sources

- [9/11 Commission Report](https://www.9-11commission.gov/report/) and the
  staff monograph on the four flights
- [NTSB Flight Path Study — United Airlines Flight 93](https://www.ntsb.gov/about/Documents/Flight_Path_Study_UA93.pdf)
  (19 Feb 2002) — the FDR altitude profile
- [NTSB Flight Path Study — American Airlines Flight 77](https://www.ntsb.gov/about/Documents/Flight_Path_Study_AA77.pdf)
  — not yet incorporated; AA77's track is still `recon`
- [9/11 Commission MFR, interview with Lt. Col. Steven O'Brien](https://www.archives.gov/files/declassification/iscap/pdf/2011-048-doc22.pdf)
  (6 May 2004) — GOFER 06's own account

### On the radar data

Both NTSB studies are seven-page scans: every page is a single image with no
extractable text, so they yield printed maps and plots to read against, not
tables to import. The underlying 84th RADES files are a separate matter — the
84 RADES no longer processes FOIA requests for public release, so the public
pool is closed at whatever is already out.
- [Sky HISTORY — Flight 93 myths debunked](https://www.history.co.uk/articles/911-flight-93-myths-debunked)
- [911facts.dk — "Flight 93 was shot down"](https://www.911facts.dk/?p=7706&lang=en)
  (origin and wording of the de Grand-Pre claim)
- [InForum — Happy Hooligans pilot recalls emergency flight to New York on 9/11](https://www.inforum.com/newsmd/former-happy-hooligans-pilot-recalls-emergency-flight-to-new-york-on-9-11)
  (Gibney's own account)
- [us-atlas](https://github.com/topojson/us-atlas) for state geometry
- Miles Kara, ["Chaos Theory: 9-11; CRITICS, a snapshot of the national
  awareness"](https://www.oredigger61.org/?p=895) — the description of NSA's
  prior, redacted release, with the DTGs
- Sharon A. Maneki, *Did Anyone Tell the President? Establishing the CRITICOMM
  System*, NSA Center for Cryptologic History — the CRITIC system itself
- [The Aviationist — US air defence's response to the September 11 attacks](https://theaviationist.com/2011/09/07/9-11/)
  (callsign roster: PANTA, QUIT, the tankers, AWACS, HUNTRESS)
- [9-11 Revisited — NEADS files](https://www.oredigger61.org/?cat=19) for the
  QUIT 25/26/27 numbering and the Supervisor of Flying launching in trail
- [Wikipedia — Steven O'Brien (pilot)](https://en.wikipedia.org/wiki/Steven_O%27Brien_\(pilot\))
  for GOFER 06

### A note on callsign sourcing

Callsigns are the one area where sources genuinely conflict, so the app says so
rather than picking silently. GOFER 06 appears as "Gofer 86" in at least one
otherwise careful roster. The Andrews DC ANG flights are variously given as
BULLY, WILD and CAPS. Those disagreements are recorded in the callsign
reference rather than smoothed over.
