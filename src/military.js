/* =============================================================================
   military.js — military aircraft callsigns and tracks.

   The claim under test is a military one, so the military picture is carried
   here in the same form as the airliner tracks. Three entries do most of the
   work.

   1. QUIT flight — the Langley alert scramble — was flown by a permanent
      detachment of the 119th Fighter Wing, North Dakota Air National Guard.
      That is Gibney's own wing. North Dakota ANG F-16s were airborne on
      September 11 and did fly the first combat air patrol over Washington.
      That is the documented fact the shootdown story is built on.

   2. GOFER 06 was the only aircraft that came near both the Pentagon strike
      and the Shanksville crash. It was an unarmed Minnesota ANG C-130 cargo
      plane flying home from the Caribbean.

   3. Callsigns make the command timeline concrete: what was airborne, and
      where it was.

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
    color: 0xb9a6ff,
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
      [at(8, 53, 0), 'Airborne from Otis, seven minutes after the North Tower was hit, with no target to fly to.', 'commission'],
      [at(9, 9, 0), 'Holding in military airspace off Long Island, waiting for something to intercept.', 'commission'],
      [at(9, 25, 0), 'Establishes a combat air patrol over New York City, 22 minutes after the South Tower was struck.', 'commission'],
    ],
  },
  {
    id: 'QUIT',
    label: 'QUIT (ND F-16s from Langley)',
    type: 'F-16 ADF (x3)',
    unit: '119th Fighter Wing, North Dakota ANG, alert detachment',
    base: 'Langley AFB, Virginia',
    armed: 'Armed: 2 of 3; third gun only',
    armedNote: 'Borgstrom launched in trail as Supervisor of Flying and his aircraft carried the six-barrel 20 mm gun without missiles. The allegation requires two Sidewinders, so one of the three North Dakota jets airborne that morning could not have fired them. Source: International Center for 9/11 Justice, Complete Timeline, "9:24 a.m. September 11, 2001: Fighter Jets Scrambled from Langley Air Force Base".',
    armedNoteSrc: 'press',
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
      [at(9, 24, 0), 'Scramble order issued. The pilots are a standing North Dakota ANG detachment sitting alert in Virginia: Dean Eckmann, Brad Derrig and Craig Borgstrom. Two aircraft carry missiles and a gun; Borgstrom\'s carries the gun only.', 'press'],
      [at(9, 30, 0), 'Airborne from Langley. Lead calls "Quit check"; two and three answer.', 'press'],
      [at(9, 35, 0), 'Vectored east over the Atlantic rather than north toward Washington, a routing error that costs critical minutes.', 'commission'],
      [at(9, 58, 0), 'QUIT 26 is over the Pentagon at 23,000 ft, flying the first combat air patrol ever mounted over the capital.', 'press'],
    ],
  },
  {
    id: 'GOFER',
    label: 'GOFER 06',
    type: 'C-130H Hercules',
    unit: '133rd Airlift Wing, Minnesota ANG',
    base: 'Andrews to Youngstown, Ohio',
    armed: 'Unarmed cargo aircraft',
    color: 0x6fd3ff,
    src: 'recon',
    /* Corrected. The first version of this track was traced from secondary
       retellings and was wrong three ways: it launched at 09:30 rather than
       the 1333Z on the Andrews tower strips, it continued west as though the
       aircraft reached Minnesota, and it passed within three miles of United
       93 — close enough to manufacture a contact that never happened.

       The primary sources are the 9/11 Commission's interview with the pilot
       and Miles Kara's radar reconstruction. O'Brien's own radio call put the
       smoke "about 30 miles" off; Kara's radar puts him roughly 34 nautical
       miles southeast of the crash site. Both are far outside the ten-mile
       ring the app draws for an AIM-9, which the earlier track was not. */
    path: [
      [at(9, 33, 0), 38.8108, -76.8670, 0],
      [at(9, 36, 0), 38.8500, -77.0200, 4000],
      [at(9, 37, 45), 38.8800, -77.0900, 5000],
      [at(9, 45, 0), 39.1500, -77.7000, 14000],
      [at(9, 55, 0), 39.4500, -78.0500, 21000],
      [at(10, 2, 0), 39.6627, -78.3377, 24000],
      [at(10, 4, 0), 39.7703, -78.4635, 24000],
      [at(10, 5, 0), 39.8330, -78.4164, 24000],
      [at(10, 6, 0), 39.8956, -78.3693, 24000],
      [at(10, 9, 0), 40.0835, -78.2272, 24000],
      [at(10, 21, 0), 40.6486, -79.4041, 18000],
      [at(10, 34, 0), 41.2607, -80.6791, 0],
    ],
    events: [
      [at(9, 33, 0), 'Wheels up from Andrews at 1333Z, three minutes late behind a 747 held for wake turbulence; the delay is why he was near United 93 at 10:03.', 'commission'],
      [at(9, 35, 0), 'Controllers ask this cargo crew to identify an unknown aircraft. It is American 77.', 'commission'],
      [at(9, 37, 45), 'Lt. Col. Steven O’Brien watches it strike the Pentagon: "Looks like that aircraft crashed into the Pentagon, sir." He asks to orbit; ATC refuses and sends him west.', 'press'],
      [at(10, 4, 0), 'Turns right onto heading 030, away from United 93’s projected path.', 'press'],
      [at(10, 5, 0), 'Reports "black smoke at our nine o’clock, looks like about 30 miles". It is the Flight 93 crash site.', 'commission'],
      [at(10, 34, 0), 'Diverts and lands at Youngstown, Ohio. He never reaches Minneapolis.', 'commission'],
    ],
  },
  {
    id: 'BULLY',
    label: 'BULLY flight',
    type: 'F-16C (x3)',
    unit: '113th Wing / 121st Fighter Squadron, DC ANG',
    base: 'Andrews AFB, Maryland',
    armed: 'First aircraft unarmed',
    color: 0xffa23e,
    src: 'recon',
    path: [
      [at(10, 38, 0), 38.8108, -76.8670, 0],
      [at(10, 42, 0), 38.85, -76.95, 8000],
      [at(11, 0, 0), 38.88, -77.05, 14000],
    ],
    events: [
      [at(10, 38, 0), 'First DC Air National Guard F-16 lifts off from Andrews, 35 minutes after United 93 is down.', 'commission'],
      [at(10, 42, 0), 'Lt. Col. Marc Sasseville and 1st Lt. Heather Penney launch without live ammunition, intending to ram United 93 if they found it.', 'press'],
    ],
  },
];

/* The wider radio picture — callsigns without a drawn track. */
export const CALLSIGNS = [
  { cs: 'HUNTRESS', what: 'Northeast Air Defense Sector (NEADS), Rome NY',
    note: 'The weapons controllers running the air defence response, and the voice on the NEADS tapes.', src: 'commission' },
  { cs: 'PANTA 45 / 46', what: 'F-15C, 102nd FW, Massachusetts ANG, Otis',
    note: 'First fighters airborne, 08:53.', src: 'commission' },
  { cs: 'QUIT 25 / 26 / 27', what: 'F-16 ADF, 119th FW, North Dakota ANG, at Langley',
    note: 'Gibney’s parent wing, though not Gibney: the pilots were Dean Eckmann, Brad Derrig and Craig Borgstrom. Borgstrom was the Supervisor of Flying, who launched in trail as a third aircraft with the gun and no missiles.', src: 'press' },
  { cs: 'BULLY / WILD / CAPS', what: 'F-16C, 113th Wing, DC ANG, Andrews',
    note: 'Launched after United 93 was already down. Source wording on these varies.', src: 'press' },
  { cs: 'GOFER 06', what: 'C-130H3, 133rd AW, Minnesota ANG',
    note: 'Witnessed the Pentagon impact and the Shanksville smoke, then diverted to Youngstown. Some accounts render it "Gofer 86".', src: 'press' },
  { cs: 'VENUS 77', what: 'E-4B National Airborne Operations Center',
    note: 'Frequently cited in shootdown claims. A flying command post, not an armed aircraft.', src: 'press' },
  { cs: 'ANGEL', what: 'F/A-18, VMFA-321, Marine Reserve, Andrews',
    note: 'Later high-altitude patrol over Washington.', src: 'press' },
  { cs: 'STEEL / MAINE / TAZZ / TEAL', what: 'KC-135 and KC-10 tankers',
    note: 'Support out of Pittsburgh, Bangor, Rickenbacker and McGuire, the aircraft that make long sorties possible.', src: 'press' },
  { cs: 'BANDSAW / CHALICE', what: 'AWACS radar aircraft',
    note: 'Airborne radar coverage off the mid-Atlantic coast.', src: 'press' },
];

/* The documented facts the allegation is built on, and where it departs from
   them. This is the material the STEELMAN is entitled to grant. */
export const KERNEL = {
  title: 'The documented facts behind the claim',
  paras: [
    'North Dakota Air National Guard [[ang]] F-16s were in the air on September 11 and flew the first combat air patrol over Washington. The 119th Fighter Wing (the Happy Hooligans, Gibney’s own wing) kept a permanent alert detachment at Langley Air Force Base in Virginia from 1 March 1999 to June 2007. The 09:24 scramble order [[scramble]] went to three North Dakota pilots: Dean Eckmann, Brad Derrig and Craig Borgstrom. Their callsign was QUIT. They were airborne at 09:30. By 09:58 QUIT 26 was over the Pentagon at 23,000 feet, flying the first combat air patrol ever mounted over the capital.',
    'This was in print more than two years before the allegation named a pilot. In November 2001 the Philadelphia Daily News, quoting the New York Times, reported that the Langley fighters were being handled by the North Dakota Air National Guard and that its commander, Maj. Gen. Mike Haugen, described the order his pilots received: "A person came on the radio and identified themselves as being with the Secret Service and he said, I want you to protect the White House at all costs."',
    'The rest of the allegation does not follow from that. Those jets launched from Virginia, not Fargo. They were holding over Washington, and their morning is accounted for on the NEADS [[neads]] tapes. One of the three, Borgstrom, carried no missiles at all, while the allegation requires two Sidewinders. Rick Gibney was a fourth North Dakota pilot, at Fargo, flying a transport tasking, which is why his name attaches to a mission over Montana rather than to QUIT flight. He told InForum in 2011: "I was the only airplane between Seattle and New York City."',
    'The 9/11 Commission found that the Langley fighters were not scrambled in response to United 93, that NEADS never located United 93 on radar because it was already in the ground, and that shortly after 10:10 the Langley pilots were explicitly instructed: "negative clearance to shoot".',
    'The one aircraft that came near both the Pentagon and Shanksville was GOFER 06, an unarmed Minnesota Air National Guard C-130 flying home from the Caribbean, whose crew was asked to look for smoke and found it. Asked later whether he could have engaged either airliner, the pilot said he had no means of doing so.',
    'Sources for this section: the scramble order, the airborne time and the gun-only third aircraft come from the International Center for 9/11 Justice complete timeline entry for 09:24; the pilot names and the Langley detachment from the McChord Air Museum feature on F-16A ADF 82-0929 and from Dave Roepke, "Unforgettable day", 2011; the Haugen quotation from the Philadelphia Daily News of 15 November 2001, quoting the New York Times; the wing designation dates from the 119th Wing lineage; the findings in the previous paragraph from Chapter 1 of the 9/11 Commission Report. Two things are not asserted: the ranks of the three Langley pilots, which no retrieved source gives and which an earlier version of this file guessed at, and the aircraft type, which the Commission does not state for Langley.',
  ],
  sources: [
    'Scramble order, airborne time and the gun-only third aircraft: International Center for 9/11 Justice, Complete Timeline, "9:24 a.m. September 11, 2001: Fighter Jets Scrambled from Langley Air Force Base".',
    'Pilot names and the Langley detachment: McChord Air Museum feature on F-16A ADF 82-0929; Dave Roepke, "Unforgettable day: North Dakota Guard pilots who flew on 9/11 tell their stories", 2011.',
    'Haugen and the Secret Service order: Philadelphia Daily News, William Bunch, 15 November 2001, quoting the New York Times.',
    'Wing designation dates: 119th Wing lineage. Redesignated 119th Fighter Wing on 17 October 1995; redesignated 119th Wing on 1 March 2008.',
    'Commission findings: The 9/11 Commission Report, Chapter 1.',
  ],
  caveat: 'The ranks of the three Langley pilots are not asserted here. No retrieved source gives them, and an earlier version of this file called all three Major without a source. The 9/11 Commission does not name the aircraft type for the Langley alert jets; the F-16A ADF attribution comes from the McChord Air Museum and ic911 pages.',
  caveatSrc: 'derived',
  src: 'press',
  refs: ['AVIATIONIST', 'NEADS_FILES', 'QUIT'],
};
