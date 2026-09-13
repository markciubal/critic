/* =============================================================================
   links.js — where to go and read it yourself.

   Every claim in this app already carries a provenance badge saying what kind
   of source it rests on. That is half the job. The other half is letting the
   reader go and check, and until now the URLs only existed in the README,
   which almost nobody opens.

   So: an explicit registry keyed to the things the app already names — flight
   IDs, place keys, callsigns, glossary terms — rather than a routine that
   scans prose for words that look like article titles. Automatic linkifying
   gets "Logan" and "Dulles" right and then confidently links the wrong Albany.
   Explicit is duller and does not embarrass anybody.

   `kind` drives the chip colour: 'wiki' for background reading, 'doc' for a
   primary document, 'press' for reporting. The distinction matters here. A
   Wikipedia article is orientation, not evidence, and should not look like the
   NTSB study sitting beside it.

   URLS ARE NOT AUTOMATICALLY CHECKED. The ones that were uncertain when this
   was written were fetched and confirmed; the rest are long-lived Wikipedia
   articles and government documents already cited in the README. A dead link
   here is a defect like any other — the discrepancy register is the place for
   it if one is found.
   ========================================================================== */

const wiki = (slug, label = 'Wikipedia') =>
  ({ label, url: `https://en.wikipedia.org/wiki/${slug}`, kind: 'wiki' });

export const REFS = {
  /* --- the four aircraft ---------------------------------------------- */
  AA11:  [wiki('American_Airlines_Flight_11')],
  UA175: [wiki('United_Airlines_Flight_175')],
  AA77:  [
    wiki('American_Airlines_Flight_77'),
    { label: 'NTSB Flight Path Study', kind: 'doc',
      url: 'https://www.ntsb.gov/about/Documents/Flight_Path_Study_AA77.pdf' },
  ],
  UA93:  [
    wiki('United_Airlines_Flight_93'),
    { label: 'NTSB Flight Path Study', kind: 'doc',
      url: 'https://www.ntsb.gov/about/Documents/Flight_Path_Study_UA93.pdf' },
  ],

  /* --- airports and sites ---------------------------------------------- */
  KBOS: [wiki('Logan_International_Airport')],
  KEWR: [wiki('Newark_Liberty_International_Airport')],
  KIAD: [wiki('Washington_Dulles_International_Airport')],
  KLAX: [wiki('Los_Angeles_International_Airport')],
  KSFO: [wiki('San_Francisco_International_Airport')],
  WTC1: [wiki('World_Trade_Center_(1973%E2%80%932001)', 'Wikipedia — WTC')],
  WTC2: [wiki('World_Trade_Center_(1973%E2%80%932001)', 'Wikipedia — WTC')],
  PENT: [wiki('The_Pentagon')],
  SHKV: [wiki('Flight_93_National_Memorial', 'Wikipedia — memorial')],
  KFAR: [wiki('Hector_International_Airport')],
  KBZN: [wiki('Bozeman_Yellowstone_International_Airport')],
  KALB: [wiki('Albany_International_Airport')],
  OTIS: [wiki('Otis_Air_National_Guard_Base')],
  LFI:  [wiki('Langley_Air_Force_Base')],
  ADW:  [wiki('Joint_Base_Andrews')],
  KYNG: [wiki('Youngstown%E2%80%93Warren_Regional_Airport')],

  /* --- units and aircraft types ---------------------------------------- */
  QUIT:  [wiki('1st_Fighter_Wing', 'Wikipedia — 1st FW'), wiki('Langley_Air_Force_Base', 'Langley AFB')],
  PANTA: [wiki('102nd_Intelligence_Wing', 'Wikipedia — 102nd (ex-102nd FW)')],
  GOFER: [
    wiki('133rd_Airlift_Wing', 'Wikipedia — 133rd AW'),
    { label: "9/11 Commission MFR — O'Brien interview", kind: 'doc',
      url: 'https://www.archives.gov/files/declassification/iscap/pdf/2011-048-doc22.pdf' },
  ],
  BULLY: [wiki('113th_Wing', 'Wikipedia — 113th Wing')],
  GIBNEY_UNIT: [wiki('119th_Wing', 'Wikipedia — 119th Wing')],

  /* --- the institutions ------------------------------------------------ */
  NORAD: [wiki('North_American_Aerospace_Defense_Command')],
  NSA:   [wiki('National_Security_Agency')],
  NEADS: [wiki('Northeast_Air_Defense_Sector')],

  /* --- the primary record ---------------------------------------------- */
  COMMISSION: [
    { label: '9/11 Commission Report', kind: 'doc',
      url: 'https://www.9-11commission.gov/report/' },
    wiki('9/11_Commission'),
  ],

  /* --- the claim, the pilot, and the secondary record --------------------
     URLs here are taken from the README's source list, plus the ones fetched
     and confirmed on 12 Sep 2026 for the keys the README left without a URL
     (the NSA release, Maneki, the MuckRock request, the F-16 and AIM-9 fact
     sheets, the debris reporting). */
  CLAIMANT: [
    { label: '911facts.dk — origin and wording of the de Grand-Pre claim', kind: 'press',
      url: 'https://www.911facts.dk/?p=7706&lang=en' },
  ],
  GIBNEY: [
    { label: "InForum — Gibney's own account of the flight", kind: 'press',
      url: 'https://www.inforum.com/newsmd/former-happy-hooligans-pilot-recalls-emergency-flight-to-new-york-on-9-11' },
  ],
  KARA_CRITIC: [
    { label: 'Miles Kara — CRITICs, a snapshot of the national awareness (the four DTGs)', kind: 'press',
      url: 'https://www.oredigger61.org/?p=895' },
  ],
  KARA_NEADS: [
    { label: 'Miles Kara — Gofer 06 posts (84th RADES radar reconstruction)', kind: 'press',
      url: 'https://www.oredigger61.org/?cat=49' },
    { label: 'Miles Kara — Gofer 06 pilot interview, transcribed', kind: 'press',
      url: 'https://www.oredigger61.org/?p=6314' },
  ],
  /* The release itself: NSA's redacted FOIA response, twelve scanned pages,
     as linked from Kara's post. The original 911myths host has gone; the
     Wayback Machine copy (2 Dec 2018) was fetched and confirmed as a PDF. */
  NSA_RELEASE: [
    { label: 'NSA FOIA release — the four CRITIC messages, redacted (12-page scan, archived copy)', kind: 'doc',
      url: 'https://web.archive.org/web/20181202044029/http://www.911myths.com/images/d/d4/NSA_FOIA.pdf' },
  ],
  AVIATIONIST: [
    { label: 'The Aviationist — the air defence response (callsign roster)', kind: 'press',
      url: 'https://theaviationist.com/2011/09/07/9-11/' },
  ],
  NEADS_FILES: [
    { label: '9-11 Revisited — NEADS files', kind: 'press',
      url: 'https://www.oredigger61.org/?cat=19' },
  ],
  MANEKI: [
    { label: 'Maneki, "Did Anyone Tell the President?" — NSA Center for Cryptologic History', kind: 'doc',
      url: 'https://www.nsa.gov/Press-Room/Digital-Media-Center/Document-Gallery/igphoto/2002751847/' },
    { label: 'Same paper, PDF (media.defense.gov)', kind: 'doc',
      url: 'https://media.defense.gov/2021/Jun/29/2002751847/-1/-1/0/DID_ANYONE_TELL_THE_PRESIDENT.PDF' },
  ],
  MUCKROCK: [
    { label: 'MuckRock — "Release of 9/11 CRITIC", the request to NSA (filed 11 Sep 2026)', kind: 'doc',
      url: 'https://www.muckrock.com/foi/united-states-of-america-10/release-of-911-critic-national-security-agency-220673/' },
    { label: 'critic.markciubal.com — where any release is published', kind: 'press',
      url: 'https://critic.markciubal.com/' },
  ],
  /* The flight manual scan on the NRC docket is the cover, scope and a few
     procedure pages only; it identifies the manual but does not reproduce
     the external-stores limits table, and the prose says so. */
  F16: [
    { label: 'USAF fact sheet — F-16 Fighting Falcon', kind: 'doc',
      url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/' },
    { label: 'T.O. 1F-16C-1 flight manual, F-16C/D Blocks 25/30/32 — cover and scope pages (NRC docket scan)', kind: 'doc',
      url: 'https://www.nrc.gov/docs/ML0303/ML030310495.pdf' },
    wiki('General_Dynamics_F-16_Fighting_Falcon', 'Wikipedia — F-16'),
  ],
  AIM9: [
    { label: 'USAF fact sheet — AIM-9 Sidewinder', kind: 'doc',
      url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104557/aim-9-sidewinder/' },
    wiki('AIM-9_Sidewinder', 'Wikipedia — AIM-9 Sidewinder'),
  ],
  DEBRIS: [
    { label: 'Popular Mechanics — 9/11 myths debunked (the debris field)', kind: 'press',
      url: 'https://www.popularmechanics.com/military/a66051920/911-myths-debunked/' },
    { label: 'Sky HISTORY — Flight 93 myths debunked (Indian Lake, the wind)', kind: 'press',
      url: 'https://www.history.co.uk/articles/911-flight-93-myths-debunked' },
    wiki('Debunking_9/11_Myths', 'Wikipedia — Debunking 9/11 Myths'),
  ],
};

export function refsFor(key) {
  return REFS[key] || [];
}
