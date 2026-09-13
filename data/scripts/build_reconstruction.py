# -*- coding: utf-8 -*-
"""Build src/reconstruction.js: the last six minutes, second by second.

Two sources on one clock. The aircraft state comes from the NTSB tabulation for
DCA01MA065 - altitude, roll, pitch, vertical acceleration, engine parameters,
autopilot selections. The voices come from the FBI transcript of the cockpit
voice recorder, whose typography distinguishes English actually spoken from
English translated out of Arabic, a distinction the plain text of that document
destroys and which matters on almost every line.

Nothing here is narrated. Every row is a recorded value or a transcribed line,
and each carries the rung of the certainty ladder it belongs on.
"""
import csv, io, os, re, sys, json

SCRATCH = os.path.dirname(os.path.abspath(__file__))
REPO = 'C:/Users/markc/critic'
A = os.path.join(SCRATCH, 'DCA01MA065_tabAtoE.csv')
M = os.path.join(SCRATCH, 'DCA01MA065_tabMtoT.csv')
U = os.path.join(SCRATCH, 'DCA01MA065_tabUtoZ.csv')
CVR = os.path.join(SCRATCH, 'UA93_CVR.pdf')

T0, T1 = '09:57:00', '10:03:11'


def secs(t):
    p = [int(x) for x in re.split(r'[:.]', t)[:3]]
    while len(p) < 3:
        p.append(0)
    return p[0] * 3600 + p[1] * 60 + p[2]


def col(path, idx):
    rows = list(csv.reader(io.open(path, encoding='utf-8', errors='replace')))
    out = {}
    for r in rows[10:]:
        if len(r) <= idx:
            continue
        t, v = r[0].strip(), r[idx].strip()
        if not t or not v or not (T0 <= t <= T1):
            continue
        try:
            out[secs(t)] = float(v)
        except ValueError:
            out[secs(t)] = v
    return out


alt = col(A, 68)
roll = col(M, 56)
pitch = col(M, 38)
nz = col(U, 14)
epr_l, epr_r = col(A, 156), col(A, 157)

print('FDR samples in window: alt=%d roll=%d pitch=%d nz=%d'
      % (len(alt), len(roll), len(pitch), len(nz)))

# ------------------------------------------------------------------ CVR -----
import pymupdf
doc = pymupdf.open(CVR)
spans = []
for pg in doc:
    for b in pg.get_text('dict')['blocks']:
        if 'lines' not in b:
            continue
        for ln in b['lines']:
            for sp in ln['spans']:
                if sp['text'].strip():
                    f = sp['flags']
                    style = 'BOLD' if f & 16 else ('ITAL' if f & 2 else 'plain')
                    if 'Arial' in sp['font']:
                        style = 'AR'
                    spans.append((sp['text'].strip(), style))

TIME = re.compile(r'^\d\d[:.]\d\d[:.]\d+')
ent, cur = [], None
for t, st in spans:
    if TIME.match(t):
        if cur:
            ent.append(cur)
        cur = {'t': t, 'src': None, 'parts': []}
    elif cur is not None and cur['src'] is None and re.match(r'^(CAM|HOT|RDO|CTR|ATIS|EX)', t):
        cur['src'] = t
    elif cur is not None:
        cur['parts'].append((t, st))
if cur:
    ent.append(cur)


FURNITURE = re.compile(
    r"Original\s*\d\d/\d\d/\d{4}"
    r"|Major\s*review\s*\d\d/\d\d/\d{4}"
    r"|\d+\s*of\s*10\b"
    r"|10862\.adv\.doc"
    r"|CVR\s*from\s*UA\s*F[\s!l]*ight\s*#?\s*9?\s*3?"
    r"|CVRfrom|UAF!ight|adv\.doc", re.I)


def render(e):
    """Reassemble the line, then separate speech from the transcriber notes.

    Style has to be tracked per character, not per span: a single line often
    switches between translated Arabic and spoken English mid-sentence, and the
    bracketed notes are set in the plain face regardless. Building a parallel
    style array and slicing it alongside the text is the only way to keep the
    two aligned once the furniture is stripped out."""
    text, styles = [], []
    for s_, st in e["parts"]:
        if st == "AR":
            continue
        chunk = s_ + " "
        text.append(chunk)
        styles.extend([st] * len(chunk))
    raw = "".join(text)

    # drop page furniture, keeping the style array in step
    keep_t, keep_s = [], []
    masked = [False] * len(raw)
    for m in FURNITURE.finditer(raw):
        for i in range(m.start(), m.end()):
            masked[i] = True
    for i, ch in enumerate(raw):
        if not masked[i]:
            keep_t.append(ch)
            keep_s.append(styles[i] if i < len(styles) else "plain")

    # a stray timestamp can ride along when two entries share a line
    joined = "".join(keep_t)
    for m in re.finditer(r"\d\d\s*:\s*\d\d\s*[:.]?\s*\d+(\.\d)?", joined):
        for i in range(m.start(), m.end()):
            if i < len(keep_s):
                keep_s[i] = "DROP"
    keep_t = [c for c, st in zip(keep_t, keep_s) if st != "DROP"]
    keep_s = [st for st in keep_s if st != "DROP"]

    # split bracketed notes from speech
    speech_t, speech_s, notes, depth, cur = [], [], [], 0, []
    for ch, st in zip(keep_t, keep_s):
        if ch == "[":
            depth += 1
            continue
        if ch == "]":
            depth -= 1
            if depth <= 0 and cur:
                notes.append("".join(cur).strip())
                cur = []
            depth = max(0, depth)
            continue
        if depth > 0:
            cur.append(ch)
        else:
            speech_t.append(ch)
            speech_s.append(st)
    if cur:
        notes.append("".join(cur).strip())

    def tidy(x):
        # The scan renders unmapped Arabic glyphs as question marks, so a bare
        # "?" here is almost never punctuation.
        x = x.replace(chr(8217), "'").replace(chr(1567), " ").replace("?", " ")
        x = re.sub(r"\s+([,.!;:])", r"\1", x)
        x = re.sub(r"\s{2,}", " ", x)
        x = re.sub(r" ' ?s\b", "'s", x)
        x = re.sub(r"^[\d\s.,;:]+", "", x)
        return x.strip(" .,-")

    joined2 = "".join(speech_t)
    # a source label can ride along when a malformed timestamp split an entry
    for mm in re.finditer(r"\b(CAM|HOT|RDO|CTR)[- ]?\w?\b", joined2):
        for k in range(mm.start(), mm.end()):
            speech_s[k] = "DROP"
    speech_t = [c for c, st in zip(speech_t, speech_s) if st != "DROP"]
    speech_s = [st for st in speech_s if st != "DROP"]
    spoken = tidy("".join(speech_t))
    lang = {st for ch, st in zip(speech_t, speech_s) if not ch.isspace()}
    kind = ("arabic" if "BOLD" in lang and "ITAL" not in lang
            else "mixed" if "BOLD" in lang and "ITAL" in lang
            else "english" if "ITAL" in lang
            else "unmarked")
    note = tidy("; ".join(n for n in notes if len(n) > 2))
    if spoken.upper() == spoken and len(spoken) > 2:
        kind = kind + "-shout"
    return spoken, kind, note


voices = {}
for e in ent:
    m = TIME.match(e['t'])
    if not m:
        continue
    s = secs(e['t'])
    if not (secs(T0) <= s <= secs(T1)):
        continue
    text, kind, note = render(e)
    if not text and not note:
        continue
    voices.setdefault(s, []).append({
        'who': (e['src'] or '').replace('-', ' ').strip(),
        'text': text, 'kind': kind, 'note': note.strip(),
    })
print('CVR entries in window: %d seconds carry speech or sound' % len(voices))

# ------------------------------------------------- the beats worth marking ---
BEATS = {
    secs('09:57:00'): ('The revolt begins.', 'published',
                       'The Commission fixes the start of the passenger assault here.'),
    secs('09:57:35'): ('The rolling starts.', 'measured',
                       'Roll angle leaves zero within seconds of the assault beginning. The Commission says Jarrah began rolling in response; the parameter agrees on timing.'),
    secs('09:59:15'): ('The autopilot levels off at the altitude somebody selected eleven minutes earlier.', 'measured',
                       'ALT HOLD engages at 4,996 ft. The target was dialled in at 09:48:32, nine minutes before the revolt. The machine simply arrived.'),
    secs('10:00:09'): ('They decide to wait.', 'published',
                       'Asked whether to finish it off, the answer is no. Not yet. When they all come, we finish it off.'),
    secs('10:00:30'): ('The autopilot comes off.', 'measured',
                       'The disconnect warning starts and runs to the end of the recording. From here the aircraft is hand-flown.'),
    secs('10:01:43'): ('Plus 3.98 g, then minus 1.08 g one second later.', 'measured',
                       'The pitch attitude moves eleven degrees in a second. A 757 is certified to 2.5 g and its ultimate load is 3.75.'),
    secs('10:01:56'): ('The hardest pull of the flight.', 'measured',
                       'Pitch reaches 22.9 degrees. The peak vertical acceleration anywhere in the recording is 4.148 g.'),
    secs('10:01:59'): ('Everything stops.', 'measured',
                       'For twenty seconds the controls are still, roll parks at 32 to 33 degrees and does not move, and the aircraft coasts to its highest point.'),
    secs('10:02:03'): ('Shut them off.', 'published',
                       'Said in English, inside an otherwise Arabic exchange.'),
    secs('10:02:17'): ('Both thrust levers start closing.', 'measured',
                       'EPR falls from 1.18 to 0.79 over the next forty seconds, left and right together, mean difference 0.007. In the same second a passenger shouts Turn it up.'),
    secs('10:02:43'): ('A loud air noise begins.', 'published',
                       'The transcript records it starting here, stopping at 10:02:52 and restarting 1.2 seconds later. A cockpit door and a hull breach are both candidates; the tape would settle it and has never been released.'),
    secs('10:03:03'): ('The roll passes ninety degrees.', 'measured',
                       'Past ninety the wing stops holding the aircraft up and starts pulling it down. The sink rate doubles in the six seconds that follow.'),
    secs('10:03:07'): ('Inverted. 161.4 degrees.', 'measured',
                       'The maximum roll angle in the recording. This is the channel behind the word inverted.'),
    secs('10:03:09'): ('Last recorded second.', 'measured',
                       'Pitch 41.1 degrees nose-down, 2,189 ft pressure altitude, sinking 575 feet per second. The terrain is about 2,370 ft above sea level, so this is ground level.'),
}

rows = []
for s in range(secs(T0), secs(T1) + 1):
    has = s in alt or s in roll or s in voices or s in BEATS
    if not has:
        continue
    beat = BEATS.get(s)
    rows.append({
        't': s,
        'alt': int(round(alt[s])) if s in alt and isinstance(alt.get(s), float) else None,
        'roll': round(roll[s], 1) if s in roll and isinstance(roll.get(s), float) else None,
        'pitch': round(pitch[s], 1) if s in pitch and isinstance(pitch.get(s), float) else None,
        'g': round(nz[s], 3) if s in nz and isinstance(nz.get(s), float) else None,
        'voices': voices.get(s, []),
        'beat': beat[0] if beat else None,
        'beatRung': beat[1] if beat else None,
        'beatNote': beat[2] if beat else None,
    })

print('rows emitted: %d' % len(rows))
print('rows with a voice: %d   rows with a beat: %d'
      % (sum(1 for r in rows if r['voices']), sum(1 for r in rows if r['beat'])))

HEAD = '''/* =============================================================================
   THE LAST SIX MINUTES

   Two recorders on one clock, and nothing else. Aircraft state comes from the
   NTSB tabulation for DCA01MA065: altitude, roll, pitch and vertical
   acceleration, sampled once a second. The voices come from the FBI transcript
   of the cockpit voice recorder.

   The transcript distinguishes English that was actually spoken from English
   translated out of Arabic, by using italic for one and bold for the other.
   Every plain-text copy of that document in circulation destroys the
   distinction, and it changes the meaning of most of these lines: whether a
   shout came from a hijacker or a passenger is often carried by the typeface
   alone. This file preserves it as a `kind` field, read from the font flags of
   the original PDF.

   Nothing here is narrated and nothing is reconstructed. Each row is a recorded
   value or a transcribed line. The marked beats carry the rung of the certainty
   ladder they sit on, so a reader can see which parts an instrument wrote down
   and which parts a person wrote down.
   ========================================================================== */

export const RECON_NOTE =
  'Every row is a recorded value or a transcribed line. Aircraft state from the NTSB '
  + 'flight data recorder tabulation; voices from the FBI transcript. Italic in the original '
  + 'marks English as spoken, bold marks English translated from Arabic, and that difference '
  + 'is preserved here.';

export const RECON_START = %d;
export const RECON_END = %d;

export const RECONSTRUCTION = ''' % (secs(T0), secs(T1))

out = HEAD + json.dumps(rows, ensure_ascii=False, indent=1) + ';\n'
p = os.path.join(REPO, 'src/reconstruction.js')
io.open(p, 'w', encoding='utf-8').write(out)
print('wrote %s  (%d KB)' % (p, len(out) // 1024))
