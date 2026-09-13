# United 93 recorder data

Machine-readable derivatives of the public flight and voice recorder record for United
Airlines Flight 93, 11 September 2001, prepared for [truth.help](https://truth.help).

Everything here is built from US Government documents that are already public. Nothing in
this directory is a leak, and nothing is a reconstruction dressed as a measurement — every
row carries a marker saying which it is.

## Why this exists

Two of these files, as far as I can establish, do not exist anywhere else in machine-readable
form. If you only take two things from this directory, take those.

### `cvr_typography.csv` — the transcript with its typefaces preserved

The FBI transcript of the cockpit voice recorder distinguishes **English actually spoken**
(italic in the original) from **English translated out of Arabic** (bold). Every plain-text
copy of that transcript in circulation destroys the distinction, and it changes the meaning
of most lines — whether a shout came from a hijacker or from a passenger is frequently
carried by the typeface alone.

This file reads the distinction back out of the PDF's font flags and keeps it as a field.

| time | source | language | speech |
|---|---|---|---|
| 09:58:52.8 | CAM-? | `english_spoken` | STAY BACK! |
| 09:58:57.6 | CAM-1 | `translated_arabic` | They want to get in there. Hold from the inside. |
| 09:59:11.5 | CAM-3 | `english_spoken` | Sit down! |
| 10:02:03.5 | CAM-1 | `english_spoken` | Shut them off! |
| 10:03:03 | CAM-3 | `translated_arabic` | Allah is the Greatest! |

That third row is the point. CAM-3 is keyed in the transcript legend as an Arabic-speaking
male — a hijacker — and he is shouting *in English*, because he is shouting at passengers.
You cannot see that in a plain-text copy.

302 rows covering the whole 31-minute recording. `language` is one of `english_spoken`,
`translated_arabic`, `mixed` (an Arabic sentence with English technical words inside it, of
which there are six), or `unmarked` (mostly the transcriber's own sound descriptions, which
are set in the plain face).

### `fdr_parameter_status.csv` — which channels the NTSB actually validated

The NTSB's factual report splits the recorder's parameters into a validated list and a list
headed *Parameters Not Working or Unconfirmed*. Both lists exist only as scanned images in a
38-page PDF, and the published data tabulation **contains channels from both**.

That last point cost this project an error: reservoir quantity readings were cited as data
when the Board had already disqualified them. Presence in the tabulation is not a validation
certificate.

Status is recorded **per channel, not per parameter name**, because they differ:
`ENG EPR COMMAND - L` is validated and `ENG EPR COMMAND - R` is not.

`established_by` says whether each row was read directly off the attachment or inferred from
absence on the not-working list. Every row is now read directly: vertical acceleration, which
the peak-g figure rests on, is on Attachment I-7, N1 and N2 are on I-3, and pressure altitude
(coarse and fine) is on I-1.

## The rest

| file | rows | what |
|---|---|---|
| `reconstruction.csv` / `.json` | 371 | 09:57:00–10:03:11, aircraft state and voices on one clock |
| `ua93_ground_track.csv` | 320 | ground track polyline, uniform ~1.96 mi spacing |
| `ua93_ntsb_anchors.csv` | 9 | the study's lettered events, the only points carrying a clock time |
| `derived_figures.csv` | 25 | every computed number, with the method that produced it |
| `SOURCES.md` | — | source documents with byte counts and SHA-256 |

## How to read the certainty markers

| marker | meaning |
|---|---|
| `measured` | an instrument wrote it down and the channel is on the validated list |
| `published` | an agency stated it in a document you can read |
| `derived` | computed here from published inputs; the method is in the same row |
| `inferred` | somebody reasoned to it — reasonable, not recorded |

The distinction that matters most is not in this table: **withheld** (the record exists and is
not being shown) versus **absent** (nobody recorded it). A withheld thing can be asked for. An
absent thing cannot, and no request will ever produce it.

## Known limits

- **The ground track is not an NTSB digital product.** The study publishes its track as a
  printed map. This polyline was supplied to the project and validated against the study's
  nine lettered anchors: all nine fall on the line in the right order, the ends sit 0.37 and
  0.28 miles from Newark and the crash site, and every implied ground speed lands between 394
  and 552 mph. Its own origin cannot be certified from the document.
- **Times between anchors are interpolated by arc length.** Only the nine lettered points
  carry a clock time from the source.
- **Analogue hydraulic pressure is decimated 32× in the published tabulation** — once per 64
  seconds against 0.5 Hz in the recorder — so the last 37–53 seconds before impact carry no
  analogue hydraulic data at all. That gap is in the publication, not the recording.
- **There is no cabin pressure channel below 10,000 ft.** The aircraft crossed below 10,000 ft
  at 09:54:51 and never regained it, so a hull breach during the last 8 minutes 19 seconds
  would leave no trace in this frame.
- **The CVR extraction has residual artifacts** where the source PDF contains malformed
  timestamps, which can strand a channel label at the head of a speech field. One known case
  at 09:59:11.5. The `pdf_page` column lets you check any row against the original.
- **Hydraulic supply pressure reads 1,488–1,860 psi** on a system usually quoted at 3,000 psi
  nominal, steady from before pushback, on a validated channel with provably correct scaling.
  Unexplained. The nominal figure is an assumption, not something taken from a document for
  this airframe, so the anomaly may be in the baseline.
- **AC BUS OFF and R ENG BLEED OVHT read an alert state from before takeoff.** AC BUS OFF - L
  and - R read BUS OFF on every sample from 08:39:09, and R ENG BLEED OVHT reads OVHT on every
  sample from 08:39:43. Both are validated channels. Neither is possible as a literal reading
  (the recorder itself runs on AC power), so the labels are inverted or the channels are stuck,
  and they are evidence of nothing.

## Reproducing it

`scripts/` contains the code that produced every file. The source documents are not
redistributed — `SOURCES.md` gives each one a URL and a SHA-256 so you can confirm you have
the same file. `pymupdf` is the only non-standard dependency.

## Corrections

This project publishes its own errors, dated, with the wrong version kept beside the right
one. At the time of writing there are 29, most of them introduced here rather than by a
source. If you find a thirtieth, that is the most useful thing you can send.

## Provenance and use

The underlying documents are US Government works and not subject to copyright in the United
States. These derivatives are released the same way — use them for anything, no permission
needed, no warranty offered.

The transcript contains the last words of people who died. It is already public and has been
for twenty years, and it is reproduced here because an argument about what happened to them
should be checkable. Please treat it accordingly.
