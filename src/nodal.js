/* =============================================================================
   NODAL ANALYSIS

   Everything in this case as a graph: people, aircraft, places, organisations,
   documents, events and claims, with the relations between them.

   Two rules keep it honest.

   Every edge carries a rung of the certainty ladder. An edge that says a person
   was aboard an aircraft is measured or published; an edge that says an agency
   originated a message is inferred, and says so. The graph is therefore not a
   picture of what happened. It is a picture of what is known, and how well.

   Every edge carries a citation. If a relation cannot be cited it is not drawn,
   however obvious it seems. There are relations missing from this graph that
   almost certainly existed, and their absence is the point: an entity diagram
   that fills its own gaps is a diagram of its author.
   ========================================================================== */

export const NODE_TYPES = {
  person: { label: 'Person', color: '#e0b050' },
  flight: { label: 'Aircraft', color: '#5fb3d4' },
  place: { label: 'Place', color: '#7a9bd4' },
  org: { label: 'Organisation', color: '#9b8fd4' },
  document: { label: 'Document', color: '#4ec9a0' },
  event: { label: 'Event', color: '#d08a4e' },
  claim: { label: 'Claim', color: '#c95f5f' },
};

/* The rungs are the app-wide ladder. Edge opacity and dash follow the rung, so
   the weakest relations are visibly the weakest without having to be read. */
export const EDGE_CERTAINTY = {
  measured: { dash: null, opacity: 1.0 },
  published: { dash: null, opacity: 0.9 },
  derived: { dash: [6, 3], opacity: 0.8 },
  inferred: { dash: [2, 4], opacity: 0.6 },
  contested: { dash: [2, 4], opacity: 0.6 },
  withheld: { dash: [1, 5], opacity: 0.45 },
};

export const NODES = [
  /* --- people ------------------------------------------------------------ */
  { id: 'jarrah', type: 'person', label: 'Ziad Jarrah',
    note: 'Lebanese. Trained in Florida, not type-rated on a 757. Keyed as CAM-1 on the voice recorder, the left seat.',
    cite: 'CVR transcript legend; 9/11 Commission ch. 7', src: 'commission' },
  { id: 'saeed', type: 'person', label: 'Saeed al-Ghamdi',
    note: 'Aboard United 93. Jarrah calls him by name twice in the last three minutes.',
    cite: 'CVR 10:00:37 and 10:01:12', src: 'commission' },
  { id: 'haznawi', type: 'person', label: 'Ahmed al-Haznawi', note: 'Aboard United 93.',
    cite: '9/11 Commission ch. 1', src: 'commission' },
  { id: 'nami', type: 'person', label: 'Ahmed al-Nami', note: 'Aboard United 93. Entered at Miami, 28 May 2001.',
    cite: '9/11 and Terrorist Travel', src: 'commission' },
  { id: 'ahmed_ghamdi', type: 'person', label: 'Ahmed al-Ghamdi',
    note: 'Aboard United 175. Entered at Dulles, 2 May 2001.', cite: '9/11 and Terrorist Travel', src: 'commission' },
  { id: 'hamza_ghamdi', type: 'person', label: 'Hamza al-Ghamdi',
    note: 'Aboard United 175. Entered at Miami, 28 May 2001.', cite: '9/11 and Terrorist Travel', src: 'commission' },
  { id: 'mihdhar', type: 'person', label: 'Khalid al-Mihdhar',
    note: 'Aboard American 77. Known to CIA by true name from January 2000. Watchlisted 23 August 2001.',
    cite: 'Joint Inquiry; 9/11 Commission ch. 8', src: 'commission' },
  { id: 'hazmi', type: 'person', label: 'Nawaf al-Hazmi',
    note: 'Aboard American 77. Arrival at Los Angeles on 15 January 2000 was known.',
    cite: 'Joint Inquiry; 9/11 Commission ch. 8', src: 'commission' },
  { id: 'ksm', type: 'person', label: 'Khalid Sheikh Mohammed',
    note: 'Applied for a US visa on 23 July 2001 under the alias Abdulrahman al Ghamdi, listing his address as New York, while on the TIPOFF watchlist since 1996.',
    cite: '9/11 and Terrorist Travel, printed p. 29', src: 'commission' },
  { id: 'binladin', type: 'person', label: 'Usama Bin Ladin', note: 'Subject of 70 of the 71 declassified daily briefs.',
    cite: 'CIA PDB release, 11 September 2026', src: 'foia' },
  { id: 'obrien', type: 'person', label: 'Lt Col Steven O Brien',
    note: 'Commanded GOFER 06. Watched American 77 strike the Pentagon; later reported smoke from about thirty miles.',
    cite: '9/11 Commission MFR, 6 May 2004', src: 'commission' },
  { id: 'felt', type: 'person', label: 'Edward Felt',
    note: 'Passenger. Called 911 from United 93 at about 09:58. No recording has been released.',
    cite: 'Westmoreland County dispatch', src: 'press' },
  { id: 'gibney', type: 'person', label: 'Rick Gibney',
    note: 'Air National Guard pilot at Fargo. Flew a state official from Montana to Albany that afternoon. That part is not in dispute.',
    cite: 'InForum; Popular Mechanics, March 2005', src: 'press' },
  { id: 'jacoby', type: 'person', label: 'Edward Jacoby Jr',
    note: 'New York State emergency management. The passenger on the documented Gibney flight, and its only witness.',
    cite: 'Popular Mechanics, March 2005', src: 'press' },
  { id: 'claimant', type: 'person', label: 'The claimant',
    note: 'A retired Army colonel who asserted the shootdown on a radio broadcast in February 2004, three years after the fact and without a document.',
    cite: 'Broadcast transcript, third-party mirror', src: 'claim' },

  /* --- aircraft ---------------------------------------------------------- */
  { id: 'ua93', type: 'flight', label: 'United 93',
    note: 'Boeing 757-222, N591UA. Newark to San Francisco. 44 aboard.', cite: 'NTSB Flight Path Study, 19 Feb 2002', src: 'ntsb' },
  { id: 'ua175', type: 'flight', label: 'United 175', note: 'Struck the South Tower.', cite: '9/11 Commission ch. 1', src: 'commission' },
  { id: 'aa11', type: 'flight', label: 'American 11', note: 'Struck the North Tower.', cite: '9/11 Commission ch. 1', src: 'commission' },
  { id: 'aa77', type: 'flight', label: 'American 77', note: 'Struck the Pentagon at 09:37.', cite: '9/11 Commission ch. 1', src: 'commission' },
  { id: 'gofer06', type: 'flight', label: 'GOFER 06',
    note: 'Unarmed Minnesota Air National Guard C-130H3, Andrews to Minneapolis. The only aircraft near both the Pentagon and Shanksville.',
    cite: 'Commission MFR; 84th RADES radar', src: 'commission' },
  { id: 'falcon20', type: 'flight', label: 'Falcon 20',
    note: 'Civilian business jet. Descended and passed the crash site coordinates at about 10:10, before anyone at Cleveland mentioned GOFER 06.',
    cite: 'Cleveland ARTCC; Popular Mechanics', src: 'press' },
  { id: 'steelman', type: 'flight', label: 'STEELMAN',
    note: 'Constructed, not a record. The fighter the claim requires, granted every favourable assumption at once. No such aircraft flew.',
    cite: 'Built by this project', src: 'derived' },

  /* --- places ------------------------------------------------------------ */
  { id: 'kewr', type: 'place', label: 'Newark', note: 'Departure, 08:42.', cite: 'NTSB Flight Path Study', src: 'ntsb' },
  { id: 'shksv', type: 'place', label: 'Shanksville', note: 'Impact at 10:03:11. Terrain about 2,370 ft MSL.', cite: 'NTSB Flight Path Study', src: 'ntsb' },
  { id: 'capitol', type: 'place', label: 'The Capitol', note: 'Bears 118.4 degrees from the turnaround. The track settles on 117.5.', cite: 'Computed here', src: 'derived' },
  { id: 'pentagon', type: 'place', label: 'The Pentagon', note: 'Struck 09:37. GOFER 06 had the aircraft in sight.', cite: 'Commission MFR', src: 'commission' },
  { id: 'kfar', type: 'place', label: 'Fargo', note: 'Where the claim puts the fighter. 1,012 miles from the crash site.', cite: 'Computed here', src: 'derived' },
  { id: 'andrews', type: 'place', label: 'Andrews', note: 'GOFER 06 departed about 09:33, roughly 27 minutes ahead of its filed time.', cite: 'Commission MFR', src: 'commission' },
  { id: 'zob', type: 'place', label: 'Cleveland Center', note: 'Issued GOFER 06 the deconfliction turn to 030 at about 10:03.', cite: 'ZOB Imperial sector tape', src: 'press' },

  /* --- organisations ----------------------------------------------------- */
  { id: 'norad', type: 'org', label: 'NORAD', note: 'Binational command. States it is outside the US Freedom of Information Act.', cite: 'NORAD FOIA policy', src: 'foia' },
  { id: 'neads', type: 'org', label: 'NEADS', note: 'The air defence sector. First heard the words United 93 at 10:07, four minutes after impact.', cite: 'NEADS tapes', src: 'commission' },
  { id: 'nsa', type: 'org', label: 'NSA', note: 'Retransmitted the CRITIC laterally as DIRNSA CRITIC 1-2001.', cite: 'NSA FOIA case 56796', src: 'foia' },
  { id: 'cia', type: 'org', label: 'CIA', note: 'Released 71 daily briefs on 11 September 2026, one of them post-attack.', cite: 'CIA release', src: 'foia' },
  { id: 'ntsb', type: 'org', label: 'NTSB', note: 'Technical support to a criminal case, not a statutory investigation. Produced the Flight Path Study and the recorder reports.', cite: 'DCA01MA065', src: 'ntsb' },
  { id: 'fbi', type: 'org', label: 'FBI', note: 'Ran the criminal case. Holds the voice recorder audio, withheld under exemption 7A.', cite: 'FOIPA 1486098-001', src: 'foia' },

  /* --- documents --------------------------------------------------------- */
  { id: 'critic1', type: 'document', label: 'CRITIC 111349Z', when: '09:49',
    note: 'The first message. Text withheld. Its originator is inferred, never stated by NSA.', cite: 'NSA FOIA case 56796', src: 'foia' },
  { id: 'critic2', type: 'document', label: 'CRITIC 111352Z', when: '09:52',
    note: 'NSA retransmits laterally as DIRNSA CRITIC 1-2001, the first NSA CRITIC of 2001. Addressees withheld.', cite: 'NSA FOIA case 56796', src: 'foia' },
  { id: 'critic3', type: 'document', label: 'Follow-up 111414Z', when: '10:14',
    note: 'Eleven minutes after impact, nine after the smoke report. Text withheld.', cite: 'NSA FOIA case 56796', src: 'foia' },
  { id: 'critic4', type: 'document', label: 'Follow-up 111448Z', when: '10:48',
    note: 'Final message in the series. Text withheld.', cite: 'NSA FOIA case 56796', src: 'foia' },
  { id: 'critic_sum', type: 'document', label: 'CRITIC summary 131303Z',
    note: 'Two days later. Its released comment paragraph sources the crash to press reporting, puts United 93 origin at JFK rather than Newark, and brackets the impact to within an hour.',
    cite: 'NSA FOIA case 56796', src: 'foia' },
  { id: 'pdb12', type: 'document', label: 'PDB 12 Sept 2001',
    note: 'Situation Report, 0400 EDT. Names one flight, United 175, hedged twice. United 93 does not appear.',
    cite: 'CIA, declassified 11 September 2026', src: 'foia' },
  { id: 'pdb6aug', type: 'document', label: 'PDB 6 Aug 2001',
    note: 'Bin Ladin Determined To Strike in US. Carries no aircraft, no date and no name.', cite: 'CIA', src: 'foia' },
  { id: 'fps', type: 'document', label: 'NTSB Flight Path Study',
    note: '19 February 2002. Publishes altitude and a printed ground track, and the sentence attributing the final manoeuvre to flight control inputs.',
    cite: 'NTSB DCA01MA065', src: 'ntsb' },
  { id: 'fdr_rep', type: 'document', label: 'FDR factual report',
    note: '15 February 2002. Carries the validated parameter list, the Not Working list, and the tabulation this project reads.',
    cite: 'NTSB DCA01MA065', src: 'ntsb' },
  { id: 'cvr_doc', type: 'document', label: 'CVR transcript',
    note: 'FBI. Italic marks English as spoken, bold marks English translated from Arabic. The audio has never been released.',
    cite: 'FBI, reviewed 4 Dec 2003', src: 'foia' },
  { id: 'joint_inq', type: 'document', label: 'Joint Inquiry report',
    note: 'Found no intelligence or law enforcement information linking sixteen of the nineteen to terrorism. Carries the May 2001 Canada reporting at printed p. 204.',
    cite: 'CRPT-107hrpt792', src: 'commission' },

  /* --- events ------------------------------------------------------------ */
  { id: 'e_takeover', type: 'event', label: 'Takeover', when: '09:28', note: '600 ft deviation. The assumed takeover point.', cite: 'NTSB Flight Path Study', src: 'ntsb' },
  { id: 'e_altsel', type: 'event', label: 'Altitude selected 4,992 ft', when: '09:48:32',
    note: 'Dialled into the mode control panel nine minutes before the revolt. The autopilot levels there at 09:59:15.', cite: 'FDR ALTITUDE SELECTED-MAN', src: 'ntsb' },
  { id: 'e_revolt', type: 'event', label: 'The revolt', when: '09:57', note: 'Passengers begin the assault.', cite: '9/11 Commission ch. 1', src: 'commission' },
  { id: 'e_roll', type: 'event', label: 'Rolling starts', when: '09:57:35', note: 'Roll leaves zero within seconds of the assault. Altitude held within about 30 ft by the autopilot throughout.', cite: 'FDR ROLL ANGLE CAPT', src: 'ntsb' },
  { id: 'e_apoff', type: 'event', label: 'Autopilot off', when: '10:00:30', note: 'Disconnect warning starts and runs to the end of the recording.', cite: 'CVR; NTSB autopilot study', src: 'ntsb' },
  { id: 'e_peakg', type: 'event', label: 'Peak 4.148 g', when: '10:01:56', note: 'One sample of 40,400 reaches 4 g. None reaches 5. Minimum is minus 1.885 g twelve seconds earlier.', cite: 'FDR VERTICAL ACCELERATION', src: 'ntsb' },
  { id: 'e_apex', type: 'event', label: 'Apex 9,902 ft', when: '10:02:15', note: 'The highest point. The lettered anchor five seconds later reads 9,827 and is not the maximum.', cite: 'FDR pressure altitude', src: 'ntsb' },
  { id: 'e_throttle', type: 'event', label: 'Thrust to idle', when: '10:02:17', note: 'Both levers together, EPR 1.18 to 0.79 over forty seconds, mean left-right difference 0.007.', cite: 'FDR ENG EPR-ACTUAL', src: 'ntsb' },
  { id: 'e_airnoise', type: 'event', label: 'Loud air noise', when: '10:02:43', note: 'Starts, stops at 10:02:52, restarts 1.2 seconds later. A door and a breach are both candidates. The tape would settle it.', cite: 'CVR transcript', src: 'foia' },
  { id: 'e_roll90', type: 'event', label: 'Roll passes 90 degrees', when: '10:03:03', note: 'Past ninety the wing stops holding the aircraft up and starts pulling it down. Sink doubles in six seconds.', cite: 'FDR ROLL ANGLE CAPT', src: 'ntsb' },
  { id: 'e_impact', type: 'event', label: 'Impact', when: '10:03:11', note: 'Inverted at 161 degrees, pitch minus 41, about 490 knots.', cite: 'NTSB Flight Path Study', src: 'ntsb' },
  { id: 'e_vector', type: 'event', label: 'GOFER vectored to 030', when: '10:03', note: 'Routine deconfliction after the crew reported no traffic in sight. Moved it away from a 15 nm closest approach.', cite: 'ZOB tape; Commission MFR', src: 'press' },
  { id: 'e_smoke', type: 'event', label: 'Smoke reported', when: '10:05', note: 'Black smoke at our nine o clock, looks like about 30 miles. The crew could not tell ground from air.', cite: 'ZOB certified transcript', src: 'press' },
  { id: 'e_neads', type: 'event', label: 'NEADS first hears United 93', when: '10:07', note: 'Four minutes after impact.', cite: 'NEADS tapes', src: 'commission' },
  { id: 'e_falcon', type: 'event', label: 'Falcon passes coordinates', when: '10:10', note: 'Before anyone at Cleveland mentions GOFER 06 for the same job.', cite: 'ZOB tape', src: 'press' },
  { id: 'e_auth', type: 'event', label: 'Shootdown authority reaches the sector', when: '10:31', note: 'Twenty-eight minutes after impact.', cite: '9/11 Commission ch. 1', src: 'commission' },

  /* --- claims ------------------------------------------------------------ */
  { id: 'claim_shoot', type: 'claim', label: 'The shootdown claim',
    note: 'That a fighter from Fargo intercepted United 93 over Somerset County and destroyed it with two Sidewinders.',
    cite: 'Radio broadcast, February 2004', src: 'claim' },
  { id: 'claim_steel', type: 'claim', label: 'The steelman',
    note: 'The claim granted everything at once: the aircraft, the weapons, the earliest takeoff, a perfect route, no delays, no weather.',
    cite: 'Built by this project', src: 'derived' },
];

export const EDGES = [
  /* who was on what */
  { s: 'jarrah', t: 'ua93', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'saeed', t: 'ua93', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'haznawi', t: 'ua93', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'nami', t: 'ua93', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'felt', t: 'ua93', k: 'aboard', c: 'published', cite: 'Passenger manifest' },
  { s: 'ahmed_ghamdi', t: 'ua175', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'hamza_ghamdi', t: 'ua175', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'mihdhar', t: 'aa77', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'hazmi', t: 'aa77', k: 'aboard', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'obrien', t: 'gofer06', k: 'commanded', c: 'published', cite: 'Commission MFR, 6 May 2004' },

  /* flying */
  { s: 'jarrah', t: 'e_altsel', k: 'at the controls for', c: 'inferred',
    cite: 'The recorder cannot say whose hands were on the inceptors. Only the captain side is recorded.' },
  { s: 'ua93', t: 'kewr', k: 'departed', c: 'published', cite: 'NTSB Flight Path Study' },
  { s: 'ua93', t: 'shksv', k: 'impacted at', c: 'published', cite: 'NTSB Flight Path Study' },
  { s: 'ua93', t: 'capitol', k: 'probable target', c: 'derived',
    cite: 'Track settles on 117.5 deg; the Capitol bears 118.4 and Newark 91.9. Corroborated independently by the 12 Sept brief.' },
  { s: 'aa77', t: 'pentagon', k: 'struck', c: 'published', cite: '9/11 Commission ch. 1' },
  { s: 'gofer06', t: 'andrews', k: 'departed', c: 'published', cite: 'Commission MFR' },
  { s: 'gofer06', t: 'pentagon', k: 'witnessed the strike on', c: 'published', cite: 'Commission MFR; O Brien radio call' },
  { s: 'gofer06', t: 'e_smoke', k: 'reported', c: 'published', cite: 'ZOB certified transcript' },
  { s: 'zob', t: 'e_vector', k: 'issued', c: 'published', cite: 'ZOB Imperial sector tape' },
  { s: 'falcon20', t: 'e_falcon', k: 'performed', c: 'published', cite: 'ZOB tape' },

  /* what the recorders say */
  { s: 'fdr_rep', t: 'e_peakg', k: 'records', c: 'measured', cite: 'VERTICAL ACCELERATION, validated channel' },
  { s: 'fdr_rep', t: 'e_apex', k: 'records', c: 'measured', cite: 'Pressure altitude, per second' },
  { s: 'fdr_rep', t: 'e_roll90', k: 'records', c: 'measured', cite: 'ROLL ANGLE CAPT, validated at Attachment I-5' },
  { s: 'fdr_rep', t: 'e_throttle', k: 'records', c: 'measured', cite: 'ENG EPR-ACTUAL L and R, validated at Attachment I-2' },
  { s: 'fdr_rep', t: 'e_altsel', k: 'records', c: 'measured', cite: 'ALTITUDE SELECTED-MAN' },
  { s: 'fdr_rep', t: 'e_roll', k: 'records', c: 'measured', cite: 'ROLL ANGLE CAPT' },
  { s: 'cvr_doc', t: 'e_revolt', k: 'records', c: 'published', cite: 'Sounds of struggle from 09:57:55' },
  { s: 'cvr_doc', t: 'e_airnoise', k: 'records', c: 'published', cite: 'Transcriber note at 10:02:43.1' },
  { s: 'cvr_doc', t: 'e_apoff', k: 'records', c: 'published', cite: 'Disconnect warning at 10:00:30.2' },
  { s: 'fps', t: 'e_impact', k: 'records', c: 'published', cite: 'Flight Path Study, p. 2' },
  { s: 'jarrah', t: 'saeed', k: 'names aloud', c: 'measured', cite: 'CVR 10:00:37 and 10:01:12' },
  { s: 'ntsb', t: 'fps', k: 'produced', c: 'published', cite: 'DCA01MA065' },
  { s: 'ntsb', t: 'fdr_rep', k: 'produced', c: 'published', cite: 'DCA01MA065' },
  { s: 'fbi', t: 'cvr_doc', k: 'produced and withholds the audio of', c: 'withheld', cite: 'FOIPA 1486098-001, exemption 7A' },

  /* the CRITIC chain */
  { s: 'norad', t: 'critic1', k: 'originated', c: 'inferred',
    cite: 'A researcher reading of a redaction footprint. NSA has never stated it.' },
  { s: 'critic1', t: 'critic2', k: 'retransmitted as', c: 'published', cite: 'NSA FOIA case 56796' },
  { s: 'nsa', t: 'critic2', k: 'sent', c: 'published', cite: 'DIRNSA CRITIC 1-2001' },
  { s: 'critic2', t: 'critic3', k: 'followed by', c: 'published', cite: 'NSA FOIA case 56796' },
  { s: 'critic3', t: 'critic4', k: 'followed by', c: 'published', cite: 'NSA FOIA case 56796' },
  { s: 'critic2', t: 'critic_sum', k: 'summarised two days later by', c: 'published', cite: 'NSA FOIA case 56796' },
  { s: 'critic_sum', t: 'e_impact', k: 'brackets to within an hour', c: 'published',
    cite: 'The comment paragraph sources the crash to press reporting and puts the origin at JFK.' },
  { s: 'critic1', t: 'e_vector', k: 'precedes by 14 minutes', c: 'derived',
    cite: 'A CRITIC reaches intelligence watch floors, not a civil air traffic facility. There is no channel between them.' },

  /* what the briefs say */
  { s: 'cia', t: 'pdb12', k: 'produced', c: 'published', cite: 'Declassified 11 September 2026' },
  { s: 'pdb12', t: 'ua175', k: 'names as boarded by an al-Ghamdi', c: 'contested',
    cite: 'May have boarded. Both verbs hedged. Three men of that surname flew that morning.' },
  { s: 'pdb12', t: 'capitol', k: 'names as a target', c: 'published',
    cite: 'Reporting suggests the Capitol and the White House also may have been targets.' },
  { s: 'pdb12', t: 'saeed', k: 'similar name, identity declined', c: 'contested',
    cite: 'The drafter wrote named al-Ghamdi one sentence earlier and chose a similar name for this one.' },
  { s: 'ksm', t: 'saeed', k: 'used the same surname as an alias', c: 'published',
    cite: 'Abdulrahman al Ghamdi, 23 July 2001, via the same travel agency Saeed used.' },
  { s: 'joint_inq', t: 'mihdhar', k: 'documents as known and unlocated', c: 'published',
    cite: 'Watchlisted 23 August 2001, FBI case opened 28 August, never found.' },
  { s: 'joint_inq', t: 'hazmi', k: 'documents as known and unlocated', c: 'published', cite: 'Same finding.' },

  /* the claim and its test */
  { s: 'claimant', t: 'claim_shoot', k: 'asserted', c: 'published', cite: 'Radio broadcast, February 2004' },
  { s: 'claim_shoot', t: 'gibney', k: 'names as the pilot', c: 'claim', cite: 'The claim names him; no document does.' },
  { s: 'gibney', t: 'jacoby', k: 'flew, documented', c: 'published', cite: 'Montana to Albany, confirmed by the passenger.' },
  { s: 'claim_steel', t: 'steelman', k: 'draws', c: 'derived', cite: 'Constructed to show what the claim requires.' },
  { s: 'steelman', t: 'kfar', k: 'must depart', c: 'derived',
    cite: 'Earliest usable takeoff 08:46, needing 1,257 mph at the moment of the hijacking and crossing inside the placard at about 09:55.' },
  { s: 'claim_steel', t: 'e_neads', k: 'blocked by', c: 'published',
    cite: 'The sector first heard the words United 93 at 10:07, four minutes after impact. Nobody could have guided him.' },
  { s: 'claim_steel', t: 'e_auth', k: 'blocked by', c: 'published',
    cite: 'Authority reached the sector at 10:31, twenty-eight minutes after impact.' },
  { s: 'claim_steel', t: 'e_roll90', k: 'contradicted by', c: 'measured',
    cite: 'The roll is attributed to flight control inputs, and on a 757 aerodynamic loads cannot back-drive the wheel.' },
  { s: 'claim_steel', t: 'e_throttle', k: 'contradicted by', c: 'measured',
    cite: 'Both engines symmetric to 10:03:06, mean EPR difference 0.007. No cascade of system failures.' },
  { s: 'e_airnoise', t: 'claim_steel', k: 'the one opening left', c: 'contested',
    cite: 'A hull breach below 10,000 ft would leave no trace. The cabin pressure discrete is blind from 09:54:50.' },
];

export const NODAL_NOTE =
  'Every edge carries how well the relation is known and a citation for it. Relations that cannot be '
  + 'cited are not drawn, however obvious they seem, because a diagram that fills its own gaps is a '
  + 'diagram of its author.';
