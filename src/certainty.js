/* =============================================================================
   HOW WELL IS THIS KNOWN?

   The provenance badges on every fact in this app say where it came from: the
   Commission, the NTSB, a FOIA release, the press. They do not say how solidly
   it is known, and those are not the same question. A sentence in an NTSB
   document and a parameter written by an NTSB-recovered recorder both carry an
   NTSB badge; one is a measurement and the other is prose.

   So this is the second axis. Seven rungs, from a thing an instrument wrote
   down to a thing nobody ever recorded.

   The rung that matters most is the last two, because they look identical from
   outside and behave completely differently. WITHHELD means the record exists
   and somebody is not showing it to you: that can be asked for, appealed,
   litigated. ABSENT means it was never captured at all: no request in the world
   will produce it, and anyone who promises otherwise is selling something.
   ========================================================================== */

export const CERTAINTY = [
  {
    id: 'measured',
    rank: 1,
    label: 'Measured',
    gloss: 'An instrument wrote it down, and the file is public.',
    detail: 'The strongest thing this app has. Not an account of an event but a recording made during it, by a device with no opinion.',
    examples: [
      'Roll angle 161.4 degrees at 10:03:07. The aircraft really was inverted, and this is the channel that says so.',
      'Passenger oxygen reads OFF on all 79 samples, with no transition. The masks never deployed.',
      'All three hydraulic systems read normal to 10:03:08, and both engines are still running at 10:03:06.',
    ],
    src: 'ntsb',
  },
  {
    id: 'published',
    rank: 2,
    label: 'Published',
    gloss: 'An agency stated it in a document you can read.',
    detail: 'Strong, but it is a sentence rather than a measurement, and sentences carry judgement. Where an agency states something this app quotes it and names the page.',
    examples: [
      'Impact at 10:03:11, from the NTSB Flight Path Study of 19 February 2002.',
      'About two minutes of rapid, full left and right control wheel inputs, from the same study.',
    ],
    src: 'ntsb',
  },
  {
    id: 'derived',
    rank: 3,
    label: 'Derived',
    gloss: 'Computed here, from published inputs, with the arithmetic shown.',
    detail: 'Only as good as its inputs and its method, both of which are stated so you can redo it. Where a derived figure disagrees with a published one, the app says so rather than choosing quietly.',
    examples: [
      'On a heading of 030 the crash site sits at nine o clock, thirty miles off, for a three-minute window. That is the geometry behind the radio call.',
      'The descent steepened roughly twelvefold in the seconds after the roll passed ninety degrees.',
    ],
    src: 'derived',
  },
  {
    id: 'inferred',
    rank: 4,
    label: 'Inferred',
    gloss: 'Somebody reasoned to it. Reasonable, but not recorded anywhere.',
    detail: 'This is where most public accounts of 11 September actually live, including several the app itself used to state as fact. Marking it is the point.',
    examples: [
      'That NORAD originated the 09:49 CRITIC. Widely repeated; never stated by NSA.',
      'That the rolls were an attempt to unbalance the passengers. The Commission says it; its footnotes cite only the two recorders and quote no statement of purpose.',
    ],
    src: 'derived',
  },
  {
    id: 'contested',
    rank: 5,
    label: 'Contested',
    gloss: 'Sources disagree, and the disagreement has not been resolved.',
    detail: 'Left open on purpose. An app that grades other people to the second should not quietly pick a winner when its own sources conflict.',
    examples: [
      'How far GOFER 06 was from the smoke: seventeen, twenty, thirty or thirty-four miles, depending on which account and which unit of distance.',
    ],
    src: 'press',
  },
  {
    id: 'withheld',
    rank: 6,
    label: 'Withheld',
    gloss: 'The record exists. You are not allowed to see it.',
    detail: 'This can be asked for. Every withheld item in this app has a filing route, an agency and an exemption to argue against, and they are listed rather than lamented.',
    examples: [
      'The text of all four CRITIC messages of 11 September 2001.',
      'The cockpit voice recorder audio. The transcript is public; the tape has never been released.',
    ],
    src: 'foia',
  },
  {
    id: 'absent',
    rank: 7,
    label: 'Absent',
    gloss: 'Nobody recorded it. No request will ever produce it.',
    detail: 'The rung people mistake for the one above. There is nothing to file for, nothing to appeal, and no amount of suspicion changes that. Naming it honestly is the difference between a gap and a conspiracy.',
    examples: [
      'Cabin pressure below 10,000 feet. The data frame has no such channel, and the aircraft was below 10,000 feet from 09:58 to impact.',
      'Whether anyone reached the controls. Only the captain inceptors were recorded, and they cannot say whose hands were on them.',
    ],
    src: 'derived',
  },
];

export const CERTAINTY_NOTE =
  'Every fact in this app carries two marks: where it came from, and how well it is known. '
  + 'The second is the one that matters when the two disagree.';
