/* =============================================================================
   military.js — military aircraft callsigns and tracks.

   This was missing from the first cut, which was an odd hole in an app whose
   central question is a military one. It matters here for three reasons.

   1. QUIT flight — the Langley alert scramble — was flown by a permanent
      detachment of the 119th Fighter Wing, North Dakota Air National Guard.
      That is Gibney's own wing. North Dakota ANG F-16s genuinely were airborne
      on September 11 and genuinely did fly the first combat air patrol over
      Washington. This is almost certainly the grain of truth the shootdown
      story grew around, and it is more interesting than the story.

   2. GOFER 06 was the only aircraft that came near both the Pentagon strike
      and the Shanksville crash. It was an unarmed Minnesota ANG C-130 cargo
      plane flying home from the Caribbean.

   3. Callsigns make the command timeline concrete. You can watch how little
      was actually airborne, and where it actually was.

   Tracks are reconstructions in the same sense as the airliner tracks:
   documented endpoints and documented events, interpolated between.
   ========================================================================== */

const at = (h, m, s = 0) => h * 3600 + m * 60 + s;

export const MIL_FLIGHTS = [
  {
    id: 'PANTA',
    label: 'PANTA 45 / 46',
    type: 'F-15C Eagle (x2)',
    unit: '102nd Fighter Wing, Massachusetts ANG',
    base: 'Otis ANGB, Cape Cod',
    armed: 'Armed',
    color: 0xc9a6ff,
    src: 'recon',
    path: [
      [at(8, 53, 0), 41.6584, -70.5214, 0],
      [at(8, 58, 0), 41.30, -71.20, 20000],
      [at(9, 9, 0), 40.50, -72.00, 26000],
      [at(9, 20, 0), 40.45, -72.60, 26000],
      [at(9, 25, 0), 40.72, -73.55, 25000],
      [at(11, 0, 0), 40.75, -73.70, 24000],
    ],
    events: [
      [at(8, 46, 0), 'Ordered to scramble after American 11.', 'commission'],
      [at(8, 53, 0), 'Airborne from Otis — seven minutes after the North Tower was already hit, with no target to fly to.', 'commission'],
      [at(9, 9, 0), 'Holding in military airspace off Long Island, waiting for something to intercept.', 'commission'],
      [at(9, 25, 0), 'Establishes a combat air patrol over New York City, 22 minutes after the South Tower was struck.', 'commission'],
    ],
  },
  {
    id: 'QUIT',
    label: 'QUIT 25 / 26 / 27',
    type: 'F-16 ADF (x3)',
    unit: '119th Fighter Wing, NORTH DAKOTA ANG — alert detachment',
    base: 'Langley AFB, Virginia',
    armed: 'Armed',
    color: 0x35d6a4,
    highlight: true,
    src: 'recon',
    path: [
      [at(9, 30, 0), 37.0829, -76.3605, 0],
      [at(9, 33, 0), 37.10, -75.80, 16000],
      [at(9, 35, 0), 37.12, -75.30, 21000],
      [at(9, 37, 0), 37.20, -75.45, 23000],
      [at(9, 42, 0), 37.80, -76.30, 25000],
      [at(9, 49, 0), 38.35, -76.80, 25000],
      [at(9, 58, 0), 38.87, -77.05, 23000],
      [at(11, 0, 0), 38.90, -77.10, 23000],
    ],
    events: [
      [at(9, 24, 0), 'Ordered to scramble. The pilots are a standing North Dakota ANG detachment sitting alert in Virginia.', 'commission'],
      [at(9, 30, 0), 'Airborne from Langley. Lead calls "Quit check"; two and three answer.', 'press'],
      [at(9, 35, 0), 'Vectored EAST over the Atlantic rather than north toward Washington — a routing error that costs critical minutes.', 'commission'],
      [at(9, 58, 0), 'QUIT 26 is over the Pentagon at 23,000 ft, flying the first combat air patrol ever mounted over the capital.', 'press'],
    ],
  },
  {
    id: 'GOFER',
    label: 'GOFER 06',
    type: 'C-130H Hercules',
    unit: '133rd Airlift Wing, Minnesota ANG',
    base: 'Transiting — Andrews toward Minnesota',
    armed: 'UNARMED cargo aircraft',
    color: 0x6fd3ff,
    src: 'recon',
    path: [
      [at(9, 30, 0), 38.81, -76.87, 3000],
      [at(9, 35, 0), 38.83, -77.00, 4500],
      [at(9, 37, 46), 38.88, -77.10, 5000],
      [at(9, 45, 0), 39.10, -77.60, 12000],
      [at(10, 5, 0), 40.15, -79.15, 20000],
      [at(10, 25, 0), 40.60, -80.60, 22000],
    ],
    events: [
      [at(9, 33, 0), 'Controllers ask this cargo crew to identify an unknown aircraft. It is American 77.', 'commission'],
      [at(9, 37, 46), 'Lt. Col. Steven O’Brien watches it strike the Pentagon: "Looks like that aircraft crashed into the Pentagon, sir."', 'press'],
      [at(10, 5, 0), 'Asked to look for United 93, the crew sees black smoke from an open field about 17 miles off — roughly 100 seconds after impact.', 'press'],
    ],
  },
  {
    id: 'BULLY',
    label: 'BULLY flight',
    type: 'F-16C (x3)',
    unit: '113th Wing / 121st Fighter Squadron, DC ANG',
    base: 'Andrews AFB, Maryland',
    armed: 'First aircraft UNARMED',
    color: 0xffa23e,
    src: 'recon',
    path: [
      [at(10, 38, 0), 38.8108, -76.8670, 0],
      [at(10, 42, 0), 38.85, -76.95, 8000],
      [at(11, 0, 0), 38.88, -77.05, 14000],
    ],
    events: [
      [at(10, 38, 0), 'First DC Air National Guard F-16 lifts off from Andrews — 35 minutes after United 93 is already down.', 'commission'],
      [at(10, 42, 0), 'Lt. Col. Marc Sasseville and 1st Lt. Heather Penney launch without live ammunition, intending to ram United 93 if they found it.', 'press'],
    ],
  },
];

/* The wider radio picture — callsigns without a drawn track. */
export const CALLSIGNS = [
  { cs: 'HUNTRESS', what: 'Northeast Air Defense Sector (NEADS), Rome NY',
    note: 'The weapons controllers running the entire air defence response. The voice on the tapes.', src: 'commission' },
  { cs: 'PANTA 45 / 46', what: 'F-15C — 102nd FW, Massachusetts ANG, Otis',
    note: 'First fighters airborne, 08:53.', src: 'commission' },
  { cs: 'QUIT 25 / 26 / 27', what: 'F-16 ADF — 119th FW, North Dakota ANG, at Langley',
    note: 'Gibney’s parent wing. QUIT 27 was the Supervisor of Flying, who launched in trail as a third aircraft.', src: 'press' },
  { cs: 'BULLY / WILD / CAPS', what: 'F-16C — 113th Wing, DC ANG, Andrews',
    note: 'Launched after United 93 was already down. Source wording on these varies.', src: 'press' },
  { cs: 'GOFER 06', what: 'C-130H — 133rd AW, Minnesota ANG',
    note: 'Witnessed the Pentagon impact and the Shanksville smoke. Some accounts render it "Gofer 86".', src: 'press' },
  { cs: 'VENUS 77', what: 'E-4B National Airborne Operations Center',
    note: 'Frequently cited in shootdown claims. A flying command post, not an armed aircraft.', src: 'press' },
  { cs: 'ANGEL', what: 'F/A-18 — VMFA-321, Marine Reserve, Andrews',
    note: 'Later high-altitude patrol over Washington.', src: 'press' },
  { cs: 'STEEL / MAINE / TAZZ / TEAL', what: 'KC-135 and KC-10 tankers',
    note: 'Support out of Pittsburgh, Bangor, Rickenbacker and McGuire — the aircraft that make long sorties possible at all.', src: 'press' },
  { cs: 'BANDSAW / CHALICE', what: 'AWACS radar aircraft',
    note: 'Airborne radar coverage off the mid-Atlantic coast.', src: 'press' },
];

/* Why the QUIT entry is the most important row in this file. */
export const KERNEL = {
  title: 'The grain of truth in the claim',
  paras: [
    'North Dakota Air National Guard F-16s really were in the air on September 11, and they really did defend Washington. The 119th Fighter Wing — the Happy Hooligans, Gibney’s own wing — kept a permanent alert detachment at Langley Air Force Base in Virginia. When the klaxon went at 09:24 it was three North Dakota pilots who ran to the jets: Maj. Dean Eckmann, Maj. Brad Derrig and Maj. Craig Borgstrom. Their callsign was QUIT. By 09:58 QUIT 26 was over the Pentagon at 23,000 feet, flying the first combat air patrol ever mounted over the capital.',
    'So "North Dakota Air Guard F-16s were up there" is true, and that is presumably how the story started. Everything built on top of it is not. Those jets launched from Virginia, not Fargo. They were holding over Washington, and their morning is accounted for on the NEADS tapes. Rick Gibney was not among them — he was flying a transport tasking out of Fargo, which is why his name attaches to a mission over Montana rather than to QUIT flight.',
    'The one aircraft that actually came near both the Pentagon and Shanksville was GOFER 06: an unarmed Minnesota Air National Guard C-130 flying home from the Caribbean, whose crew was asked to look for smoke and found it. Asked later whether he could have engaged either airliner, the pilot said there was no way he would have had any means of doing so.',
  ],
  src: 'press',
};
