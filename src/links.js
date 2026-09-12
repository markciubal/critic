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
};

export function refsFor(key) {
  return REFS[key] || [];
}
