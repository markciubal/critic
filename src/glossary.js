/* =============================================================================
   glossary.js — every technical term this app uses, explained once.

   The app was written by someone who had just read a lot of NTSB studies and
   it showed. "Placarded to Mach 1.6", "combat radius", "primary returns",
   "DTG" — all correct, all opaque to anyone who has not spent a week in the
   same documents. A page that argues carefully and then loses the reader at
   the vocabulary has not argued carefully.

   So the rule now is: the prose says it in plain words, and the precise term
   lives behind an (i). Nothing is dumbed down and nothing is removed — the
   jargon is still there for anyone who wants it, one click away, with its
   provenance attached. The reader chooses the depth.

   `plain` is the one-sentence version, written for someone who has never
   thought about this before. `more` is the detail, and may be omitted.
   ========================================================================== */

export const GLOSSARY = {
  steelman: {
    term: 'Steelman',
    plain: 'Building the strongest possible version of an argument you disagree with, then testing that instead of an easy version.',
    more: 'It is the opposite of a straw man. If you only ever knock down the weakest form of a claim, you never find out which of your objections actually mattered — so this app grants the claim every favourable assumption at once and looks at what is still standing.',
    src: 'derived',
    link: { label: 'Wikipedia — steelmanning', url: 'https://en.wikipedia.org/wiki/Straw_man#Steelmanning' },
  },

  mach: {
    term: 'Mach',
    plain: 'Speed measured against the speed of sound. Mach 1 is the speed of sound; Mach 2 is twice that.',
    more: 'The speed of sound is not a fixed number — it falls as air gets colder, so it is slower high up. At 31,000 ft it is about 675 mph, against about 761 mph at sea level. That is why the same aircraft has different Mach limits at different heights.',
    src: 'derived',
    link: { label: 'Wikipedia — Mach number', url: 'https://en.wikipedia.org/wiki/Mach_number' },
  },

  placard: {
    term: 'Placarded limit',
    plain: 'The maximum speed the aircraft is legally and structurally allowed to fly in a given configuration — literally written on a placard in the cockpit.',
    more: 'An F-16 carrying external fuel tanks and wingtip missiles is limited to 600 knots indicated or Mach 1.6, whichever comes first. The famous "Mach 2" figure applies only to a clean jet carrying nothing, which no aircraft flying across the country could be.',
    src: 'press',
    link: { label: 'Wikipedia — F-16', url: 'https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon' },
  },

  dropTanks: {
    term: 'External fuel tanks',
    plain: 'Extra fuel tanks bolted to the outside of the aircraft, because a fighter carries very little fuel internally.',
    more: 'Two 370-gallon tanks under the wings plus one 300-gallon tank on the belly add about 1,040 gallons, roughly doubling what the jet carries. They cost speed and agility, which is why they are not fitted for combat patrols.',
    src: 'press',
    link: { label: 'Wikipedia — drop tank', url: 'https://en.wikipedia.org/wiki/Drop_tank' },
  },

  ferryRange: {
    term: 'Ferry range',
    plain: 'How far the aircraft can fly one way on a full load of fuel, in a straight line, with nothing left over.',
    more: 'It is the absolute maximum — no combat, no circling, no diversion, no reserve for a missed approach. Real missions never use all of it, which is why "inside ferry range" is a weaker statement than it sounds.',
    src: 'press',
    link: { label: 'Wikipedia — range', url: 'https://en.wikipedia.org/wiki/Range_(aeronautics)' },
  },

  combatRadius: {
    term: 'Combat radius',
    plain: 'How far out the aircraft can go, fight, and still get home — so it is much less than half the ferry range.',
    more: 'Fighting burns fuel fast, so a large slice is set aside for it. For a one-way trip with no fight and no return it is the wrong yardstick, and an earlier version of this app used it wrongly. The ring has since been removed from the map entirely, because a combat radius also presumes no external fuel tanks — and the documented Montana leg proves this aircraft had them. Both errors are logged in the discrepancy register.',
    src: 'press',
    link: { label: 'Wikipedia — radius of action', url: 'https://en.wikipedia.org/wiki/Radius_of_action' },
  },

  sidewinder: {
    term: 'AIM-9 Sidewinder',
    plain: 'A short-range, heat-seeking missile. It finds a target by its engine heat, and only works close in.',
    more: 'The AIM-9M was the version in US service in 2001. Published maximum range is about 11 miles in ideal conditions; it also has a minimum range of about half a mile, below which the missile has not armed itself. So the zone it can hit is a ring, not a circle.',
    src: 'press',
    link: { label: 'Wikipedia — AIM-9', url: 'https://en.wikipedia.org/wiki/AIM-9_Sidewinder' },
  },

  wez: {
    term: 'Engagement zone',
    plain: 'The ring of distances where a missile could actually reach its target — not too far, and not too close.',
    more: 'Drawn on the map as a ring rather than a disc, because a missile fired from inside the minimum range has not finished arming and will not guide.',
    src: 'derived',
    link: { label: 'Wikipedia — AIM-9', url: 'https://en.wikipedia.org/wiki/AIM-9_Sidewinder' },
  },

  lineOfSight: {
    term: 'Line-of-sight horizon',
    plain: 'How far apart two aircraft can be and still see each other, before the curve of the Earth gets in the way.',
    more: 'It rises with height: from 31,000 ft against a target at 5,000 ft, two aircraft can see each other about 360 miles apart. That is roughly thirty times further than a Sidewinder can shoot — so seeing the target was never the hard part.',
    src: 'derived',
    link: { label: 'Wikipedia — line of sight', url: 'https://en.wikipedia.org/wiki/Line-of-sight_propagation' },
  },

  transponder: {
    term: 'Transponder',
    plain: 'A box on the aircraft that answers radar with its identity and altitude. Switch it off and controllers lose the readout, though a faint blip may remain.',
    more: 'What is left is called a primary return — an echo off the airframe itself, with no identity and no altitude attached. Three of the four hijacked aircraft had their transponders switched off.',
    src: 'commission',
    link: { label: 'Wikipedia — transponder', url: 'https://en.wikipedia.org/wiki/Transponder_(aeronautics)' },
  },

  fdr: {
    term: 'Flight data recorder',
    plain: 'The "black box" — it records what the aircraft actually did, second by second, and it is the best evidence there is.',
    more: 'Only two of the four recorders were recovered: United 93 and American 77. That is why those two flights have real altitudes on this map and the other two have estimates. The NTSB published a Flight Path Study for each.',
    src: 'ntsb',
    link: { label: 'Wikipedia — flight recorder', url: 'https://en.wikipedia.org/wiki/Flight_recorder' },
  },

  neads: {
    term: 'NEADS',
    plain: 'The Northeast Air Defense Sector — the military unit responsible for scrambling fighters over that part of the country.',
    more: 'Based in Rome, New York. Its tapes are one of the best sources for the morning, and they show it did not know United 93 existed until 10:07, four minutes after the aircraft had already hit the ground.',
    src: 'commission',
    link: { label: 'Wikipedia — NEADS', url: 'https://en.wikipedia.org/wiki/Northeast_Air_Defense_Sector' },
  },

  critic: {
    term: 'CRITIC',
    plain: 'The highest-priority message in US intelligence, meant to reach the President within ten minutes.',
    more: 'Short for Critical Intelligence Communication. It is reserved for events of immediate national consequence. Four were sent on the morning of 11 September; their contents are still withheld, which is what the FOIA request behind this app is asking for.',
    src: 'foia',
    link: { label: 'Wikipedia — NSA', url: 'https://en.wikipedia.org/wiki/National_Security_Agency' },
  },

  dtg: {
    term: 'Date-time group',
    plain: 'The military timestamp on a message — day, hour, minute, and a letter for the time zone.',
    more: '111349ZSEP01 means the 11th day, 13:49, zone Z (which is GMT), September 2001. In September New York is on daylight saving time, four hours behind Zulu, so 13:49Z is 09:49 in the morning in New York.',
    src: 'derived',
    link: { label: 'Wikipedia — date-time group', url: 'https://en.wikipedia.org/wiki/Date-time_group' },
  },

  twoSeat: {
    term: 'Two-seat F-16',
    plain: 'A version of the F-16 with a second seat behind the pilot — the only kind that can carry a passenger.',
    more: 'Designated F-16B or F-16D. The second cockpit takes space that would otherwise hold fuel, so it carries about 17% less internally than the single-seat version. Gibney was carrying a passenger, so his aircraft had to be one of these.',
    src: 'derived',
    link: { label: 'Wikipedia — F-16 variants', url: 'https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon_variants' },
  },

  airfone: {
    term: 'Airfone',
    plain: 'The seatback telephone airlines fitted in the 1990s. You swiped a credit card and it connected through a ground network — nothing to do with mobile phones.',
    more: 'On United 93 they were installed in the seatbacks of rows 23 to 34. Thirty-five of the thirty-seven calls from that aircraft went through them; only two were mobile calls, both made low down during the descent.',
    src: 'commission',
    link: { label: 'Wikipedia — Airfone', url: 'https://en.wikipedia.org/wiki/Airfone' },
  },

  knots: {
    term: 'Knots',
    plain: 'Nautical miles per hour, the unit aviation uses. One knot is about 1.15 mph.',
    src: 'derived',
    link: { label: 'Wikipedia — knot', url: 'https://en.wikipedia.org/wiki/Knot_(unit)' },
  },

  provenance: {
    term: 'Provenance badges',
    plain: 'The small coloured tags on every claim, saying where it came from and how much weight it can carry.',
    more: 'Green means the documentary record — commission reports, transcripts, recorders. Blue means something reconstructed or calculated here. Red means an allegation being tested, not a finding. Nothing on this page is asserted without one.',
    src: 'derived',
  },

  foia: {
    term: 'FOIA',
    plain: 'The Freedom of Information Act — the law that lets anyone ask a US government agency for its records.',
    more: 'Agencies may withhold material under specific exemptions, and they must say which one they are using. This app is a companion to a pending request for the text of the 11 September CRITIC messages.',
    src: 'foia',
    link: { label: 'Wikipedia — FOIA', url: 'https://en.wikipedia.org/wiki/Freedom_of_Information_Act_(United_States)' },
  },
};

/* Ordered for a glossary panel: alphabetical by display term. */
export function glossaryList() {
  return Object.entries(GLOSSARY)
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => a.term.localeCompare(b.term));
}
