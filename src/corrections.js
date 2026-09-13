/* =============================================================================
   CORRECTIONS

   Everything this app has got wrong and then fixed, dated, with the wrong
   version still readable. Most research sites in this subject have no such
   page, which is exactly why it is worth having one: a claim that has never
   been corrected is not the same as a claim that has never been wrong.

   Several of these were introduced by the assistant that built the app rather
   than by a source, and they are marked the same way as the rest. The point of
   the list is not to apportion blame but to let a reader see the failure rate.
   ========================================================================== */

export const CORRECTIONS = [
  {
    on: '2026-09-12',
    what: 'The apex of the final climb was given as 9,827 ft.',
    wrong: 'Repeated several times as the highest point the aircraft reached before the dive.',
    right: '9,902 ft at 10:02:15. The 9,827 figure is the value at the NTSB lettered anchor H, which sits five seconds past the apex and is not the maximum.',
    why: 'The anchor was read as though it were the peak. Found by a verification script written for the public data release, on its first run, which is the argument for writing one.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The parameter audit was reported as complete when two of its load-bearing entries were not checked.',
    wrong: 'The app said every cited recorder channel had been verified against the NTSB attachments.',
    right: 'Roll angle rested on a subagent report of a page nobody here had opened, and the engine channels rested on absence from a list read in fragments. Both have now been read directly and both hold: ROLL ANGLE CAPT at the tail of I-5, and ENG EPR-ACTUAL, FUEL FLOW and FUEL CUTOFF for both engines at the tail of I-2. Vertical acceleration and engine N1 still rest on absence rather than sight.',
    why: 'A reader pointed out that roll angle and engine symmetry carry the cascade argument and needed doing before the app leaned harder on them. They did, and the audit that claimed to have done it had not.',
    rung: 'published',
  },
  {
    on: '2026-09-12',
    what: 'A yaw-axis anomaly was reported as unexplained when it had a documented cause.',
    wrong: 'The app noted that the rudder moved while the rudder pedals did not, correlating at minus 0.055, and left it standing as an oddity.',
    right: 'The yaw damper channels are on the NTSB not-working list, and a yaw damper moves the rudder independently of the pedals by design. There was never anything to explain. The yaw axis is excluded.',
    why: 'Fell out of auditing every cited parameter against Attachment I, which is the check that should have preceded the observation rather than followed it.',
    rung: 'published',
  },
  {
    on: '2026-09-12',
    what: 'The app cited a flight recorder channel the NTSB had declared not working.',
    wrong: 'Hydraulic reservoir quantity was read off the tabulation and reported as though it were data.',
    right: 'HYD SYS LO QTY - C, - L and - R are all listed in Attachment I-9, Parameters Not Working or Unconfirmed. They should never have been cited. Hydraulic supply pressure and low-pressure, by contrast, are on the validated list at Attachment I-4, so those citations stand.',
    why: 'Presence in the published tabulation was treated as proof a parameter was good. It is not: the tabulation carries unvalidated channels too. Every parameter this app cites now needs checking against Attachment I, and that audit is open rather than done.',
    rung: 'published',
  },
  {
    on: '2026-09-12',
    what: 'A hydraulic pressure oddity was guessed at instead of checked.',
    wrong: 'The app said the 1,488 to 1,860 psi readings probably pointed at a decode scaling problem.',
    right: 'The scaling is correct and provably so. The parameter database defines HYD PRES as ten bits, y = 4x, range 0 to 4,092 psi, and all 237 published values are exact multiples of 4. The guess was wrong. What the check did find is that the recorder sampled this parameter every two seconds while the published tabulation shows it every sixty-four, so the blind window in the final dive is withheld data rather than absent data.',
    why: 'A reader asked for the oddity to be investigated rather than left flagged. Guessing at a cause and labelling the guess probable is the same error as asserting it.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The app said all three hydraulic systems read normal to three seconds before impact.',
    wrong: 'Presented as though the systems had been measured and found intact.',
    right: 'One threshold discrete read normal. The analogue pressure channels are sampled once every 64 seconds and stop at 10:02:18, 10:02:26 and 10:02:34, so the final dive has no analogue hydraulic data. And the reservoir quantity discrete reads LO QTY on 45 of 79 samples on the left system, which the app had not looked at before asserting the systems were clean.',
    why: 'A reader asked whether the hydraulic channels had blind spots like the cabin altitude one. They have three. The quantity indication turns out to be threshold chatter from before pushback rather than damage, but the app had claimed more than it had checked.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The app quoted half of a two-sentence paragraph and described the whole of it wrongly.',
    wrong: 'The 12 September brief was characterised as the intelligence community working from fragments the morning after, and only the first sentence of the al-Ghamdi paragraph was quoted.',
    right: 'Sentence one is a same-morning manifest match. Sentence two most likely reaches back into reporting already held, on the strength of the time-stamp pattern on page 1, where every fresh item is dated in the clear and this one is not. Both sentences are now quoted.',
    why: 'A reader asked whether that second sentence meant somebody had been tracking a hijacker. It does not, because the CIA wrote similar name and may have boarded. But the question exposed that the app was quoting the convenient half of a source, which is worse than the error it was defending against.',
    rung: 'inferred',
  },
  {
    on: '2026-09-12',
    what: 'The app argued that a recorder running to impact told against a warhead.',
    wrong: 'The walkthrough said the recorder ran coherently to impact, where a warhead normally stops one within milliseconds.',
    right: 'Most recorders in real missile cases keep running. Twenty-five minutes and a landing at Baghdad, about seventy-five minutes at Aktau, a hundred and four seconds at KAL 007, and PS752 recorded through the burst. The real discriminator is the systems cascade that follows, and United 93 has none.',
    why: 'A reader asked what a proximity fuze does to the argument. It defeats it, and the comparison set had already said so in material this app had read and not applied.',
    rung: 'published',
  },
  {
    on: '2026-09-12',
    what: 'The flight data recorder tabulation was described as unpublished.',
    wrong: 'The app said the engine, hydraulic and acceleration channels had never been released either way, and put that in the walkthrough.',
    right: 'They are published, in the NTSB flight data recorder factual report for DCA01MA065 of 15 February 2002. Peak vertical acceleration is +4.148 g and the minimum is -1.885 g, of 40,400 samples.',
    why: 'Nobody checked whether the factual report existed before asserting that it did not.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The inverted impact attitude was doubted on provenance grounds.',
    wrong: 'A register entry was opened questioning whether the NTSB badge on 40 degrees nose-down and inverted was earned.',
    right: 'ROLL ANGLE CAPT and PITCH ANGLE CAPT are validated recorded parameters. Roll passes 90 degrees at 10:03:03 and peaks at 161.4 degrees; pitch reaches minus 41.1 degrees. The badge was correct and the doubt was not.',
    why: 'Provenance was judged from the wording of a summary rather than from the parameter list behind it.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The recording was said to end with the aircraft still airborne.',
    wrong: 'The last sample of 2,189 ft was read as height above ground, implying 3.8 seconds of missing recording.',
    right: 'That is pressure altitude on the standard datum. The crash site terrain is about 2,370 ft above sea level, so on a normal high-pressure morning the aircraft was at ground level. Both recorders ran to impact.',
    why: 'A units error. Pressure altitude is not height above terrain.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The cabin pressure blind window was understated.',
    wrong: 'Given as roughly five minutes, from about 09:58.',
    right: 'The aircraft crossed below 10,000 ft at 09:54:51 and never regained it. The window is 09:54:50 to 10:03:09, eight minutes and nineteen seconds, and the revolt begins 130 seconds inside it.',
    why: 'Taken from a whole-minute anchor in a summary instead of from the recorded altitude.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'Passenger oxygen was cited as evidence against a hull breach.',
    wrong: 'The app noted that PASS OXY ON reads OFF throughout, as though that bore on whether the cabin was breached in the final minutes.',
    right: 'Masks deploy on a cabin altitude of about 14,000 ft, so below 10,000 ft that parameter is blind for the same reason the cabin discrete is. It says the masks never deployed. It says nothing about a breach in that window.',
    why: 'A true statement used to support something it does not support.',
    rung: 'absent',
  },
  {
    on: '2026-09-12',
    what: 'The GOFER 06 track put the crash site in the wrong place.',
    wrong: 'The drawn track never turned to 030 and placed the crash site at eleven or twelve o clock throughout, contradicting the radio call the app itself quotes.',
    right: 'Rebuilt from the two contemporaneous constraints. The site now sits at nine o clock, thirty miles off, across 10:04 to 10:06.',
    why: 'The track was drawn to look plausible rather than built from the call.',
    rung: 'derived',
  },
  {
    on: '2026-09-12',
    what: 'The smoke report was timed to 10:06.',
    wrong: 'Attributed to the 9/11 Commission at 10:06.',
    right: 'About 10:05. Note 170 of the Commission report puts the transmission about one minute thirty-seven seconds after impact, and the analyst the 10:06 came from explicitly disowns it as the time of the report.',
    why: 'A figure attached to the wrong sentence in the source.',
    rung: 'published',
  },
  {
    on: '2026-09-12',
    what: 'The United 93 ground track was too coarse to be honest.',
    wrong: 'Twenty-two points traced by eye from a printed map, with the 09:02 anchor about forty miles from its true position.',
    right: 'A 320-point polyline, validated against all nine of the lettered anchors in the study, with endpoints 0.37 and 0.28 miles from Newark and the crash site.',
    why: 'An approximation presented without saying how approximate.',
    rung: 'derived',
  },
  {
    on: '2026-09-12',
    what: 'The pilot of GOFER 06 was described as having witnessed the Shanksville crash.',
    wrong: 'The app said he watched it.',
    right: 'He saw a smoke column from about thirty miles, could not tell whether it came from the ground or the air, and put its top at 3,000 to 5,000 ft. The identification came from the controller, not the crew.',
    why: 'A witness account inflated in the retelling, by this app.',
    rung: 'published',
  },
  {
    on: '2026-09-12',
    what: 'The rolls were said to have thrown people around.',
    wrong: 'Described as bobbing occupants between 0.75 and 1.5 g.',
    right: 'The autopilot held altitude within about thirty feet throughout the rolling phase and lateral acceleration never exceeded 0.07 g. The floor tilted and the horizon went; there was very little vertical excursion. The Commission also says off balance, not off their feet.',
    why: 'A physical effect asserted before the altitude trace was read.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'A four-to-six g reading was offered as evidence of a manoeuvre rather than a weapon.',
    wrong: 'Stated as though the two were alternatives.',
    right: 'A false dichotomy: a warhead causes manoeuvres. After an R-98 detonated about fifty metres behind Korean Air 007, the entire recorded signature was a 113-second pitch-up from damaged elevator cabling.',
    why: 'A reasoning error, not a factual one, and the more dangerous kind.',
    rung: 'inferred',
  },
  {
    on: '2026-09-12',
    what: 'The steelman quoted a performance limit from a document that does not contain it.',
    wrong: 'The 600 KIAS placard for that stores configuration was attributed to T.O. 1F-16C-1.',
    right: 'That technical order gives the basic airspeed maximum and refers stores limits elsewhere. The figure traces to a forum post quoting a personal copy of a flight manual, reached only through search summaries.',
    why: 'The single most load-bearing number in the steelman, cited to the wrong document. It is now a concession rather than a citation.',
    rung: 'contested',
  },
  {
    on: '2026-09-12',
    what: 'The map could not be dragged on a phone.',
    wrong: 'The canvas set no touch-action, so the browser claimed each drag as a page scroll and cancelled it mid-motion. There was also no pinch zoom, and tapping a marker usually failed.',
    right: 'Fixed. One finger pans, two fingers pinch and rotate, and the tap threshold is fourteen pixels for touch rather than five.',
    why: 'Never tested under a finger.',
    rung: 'measured',
  },
  {
    on: '2026-09-12',
    what: 'The NTSB Flight Path Study was dated 12 February 2002.',
    wrong: 'Cited repeatedly with that date.',
    right: '19 February 2002.',
    why: 'A transcription error, repeated because nobody rechecked it.',
    rung: 'published',
  },
];

export const CORRECTIONS_NOTE =
  'Every one of these was published here in the wrong form first. The wrong version is '
  + 'kept beside the right one on purpose: a reader cannot judge how much to trust a source '
  + 'that only shows its final answers.';
