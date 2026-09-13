# -*- coding: utf-8 -*-
"""Build data/ : the machine-readable release of everything this project derived.

Two of these files do not exist anywhere else as far as I can establish.

cvr_typography.csv preserves a distinction the FBI transcript makes with
typefaces and every plain-text copy in circulation destroys: italic for English
actually spoken, bold for English translated out of Arabic. It changes the
meaning of most lines, because whether a shout came from a hijacker or a
passenger is carried by the typeface alone.

fdr_parameter_status.csv records which recorder channels the NTSB validated and
which it marked Not Working or Unconfirmed, per channel rather than per
parameter name. The distinction matters: ENG EPR COMMAND - L is validated and
ENG EPR COMMAND - R is not.

The large source documents are not redistributed. They are US Government works
and freely available; SOURCES.md gives each one a URL, a byte count and a
SHA-256 so anyone can confirm they have the same file this was built from.
"""
import csv, hashlib, io, json, os, re, sys

SCR = os.path.dirname(os.path.abspath(__file__))
REPO = 'C:/Users/markc/critic'
OUT = os.path.join(REPO, 'data')
os.makedirs(os.path.join(OUT, 'scripts'), exist_ok=True)


def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for blk in iter(lambda: f.read(1 << 20), b''):
            h.update(blk)
    return h.hexdigest()


# ============================================================ CVR typography ==
import pymupdf

FURN = re.compile(
    r"Original\s*\d\d/\d\d/\d{4}|Major\s*review\s*\d\d/\d\d/\d{4}|\d+\s*of\s*10\b"
    r"|10862\.adv\.doc|CVR\s*from\s*UA\s*F[\s!l]*ight\s*#?\s*9?\s*3?|CVRfrom|UAF!ight|adv\.doc", re.I)
TIME = re.compile(r'^\d\d[:.]\d\d[:.]\d+')


def build_cvr():
    doc = pymupdf.open(os.path.join(SCR, 'UA93_CVR.pdf'))
    spans = []
    for pno, pg in enumerate(doc, 1):
        for b in pg.get_text('dict')['blocks']:
            if 'lines' not in b:
                continue
            for ln in b['lines']:
                for sp in ln['spans']:
                    if not sp['text'].strip():
                        continue
                    f = sp['flags']
                    st = 'BOLD' if f & 16 else ('ITAL' if f & 2 else 'plain')
                    if 'Arial' in sp['font']:
                        st = 'AR'
                    spans.append((sp['text'], st, pno))

    ent, cur = [], None
    for t, st, pno in spans:
        s = t.strip()
        if TIME.match(s):
            if cur:
                ent.append(cur)
            cur = {'t': s, 'src': None, 'parts': [], 'page': pno}
        elif cur is not None and cur['src'] is None and re.match(r'^(CAM|HOT|RDO|CTR|ATIS|EX)', s):
            cur['src'] = s
        elif (cur is not None and cur['src'] is not None and not cur['parts']
              and cur['src'].rstrip().endswith(('-', ',', '.')) and re.fullmatch(r'[0-9?]', s)):
            # 'CAM-1' is sometimes split across spans, leaving the channel digit
            # stranded at the head of the speech. Reattach it to the source.
            cur['src'] = cur['src'].rstrip('-,. ') + '-' + s
        elif cur is not None:
            cur['parts'].append((t, st))
    if cur:
        ent.append(cur)

    rows = []
    for e in ent:
        text, styles = [], []
        for s_, st in e['parts']:
            if st == 'AR':
                continue
            chunk = s_ + ' '
            text.append(chunk)
            styles.extend([st] * len(chunk))
        raw = ''.join(text)

        masked = [False] * len(raw)
        for m in FURN.finditer(raw):
            for i in range(m.start(), m.end()):
                masked[i] = True
        kt = [c for i, c in enumerate(raw) if not masked[i]]
        ks = [styles[i] if i < len(styles) else 'plain' for i in range(len(raw)) if not masked[i]]

        joined = ''.join(kt)
        for m in re.finditer(r'\d\d\s*:\s*\d\d\s*[:.]?\s*\d+(\.\d)?', joined):
            for i in range(m.start(), m.end()):
                if i < len(ks):
                    ks[i] = 'DROP'
        kt = [c for c, st in zip(kt, ks) if st != 'DROP']
        ks = [st for st in ks if st != 'DROP']

        sp_t, sp_s, notes, depth, curn = [], [], [], 0, []
        for ch, st in zip(kt, ks):
            if ch == '[':
                depth += 1
                continue
            if ch == ']':
                depth -= 1
                if depth <= 0 and curn:
                    notes.append(''.join(curn).strip())
                    curn = []
                depth = max(0, depth)
                continue
            (curn if depth > 0 else sp_t).append(ch)
            if depth <= 0:
                sp_s.append(st)
        if curn:
            notes.append(''.join(curn).strip())

        def tidy(x):
            x = x.replace(chr(8217), "'").replace(chr(1567), ' ').replace('?', ' ')
            x = re.sub(r'\s+([,.!;:])', r'\1', x)
            x = re.sub(r"\s'\s?s\b", "'s", x)
            x = re.sub(r'\s{2,}', ' ', x)
            return x.strip(' .,-')

        spoken = tidy(''.join(sp_t))
        lang = {st for ch, st in zip(sp_t, sp_s) if not ch.isspace()}
        kind = ('translated_arabic' if 'BOLD' in lang and 'ITAL' not in lang
                else 'mixed' if 'BOLD' in lang and 'ITAL' in lang
                else 'english_spoken' if 'ITAL' in lang else 'unmarked')
        note = tidy('; '.join(n for n in notes if len(n) > 2))
        shouted = bool(spoken) and spoken.upper() == spoken and len(spoken) > 2
        if not spoken and not note:
            continue
        rows.append({
            'time_edt': re.sub(r'^(\d\d)[:.](\d\d)[:.](\d+)(?:\.(\d))?$',
                              lambda m: '%s:%s:%s%s' % (m.group(1), m.group(2), m.group(3)[:2],
                                                        ('.' + m.group(4)) if m.group(4) else ''),
                              e['t'].strip()),
            'source': (e['src'] or '').strip(),
            'speech': spoken,
            'language': kind,
            'shouted': 'yes' if shouted else '',
            'transcriber_note': note,
            'pdf_page': e['page'],
        })
    return rows


cvr = build_cvr()
with io.open(os.path.join(OUT, 'cvr_typography.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(cvr[0].keys()))
    w.writeheader()
    w.writerows(cvr)
print('cvr_typography.csv: %d rows' % len(cvr))
from collections import Counter
print('   language mix:', dict(Counter(r['language'] for r in cvr)))

# ============================================================ reconstruction ==
recon = json.loads(re.search(r'export const RECONSTRUCTION = (\[[\s\S]*\]);',
                   io.open(os.path.join(REPO, 'src/reconstruction.js'), encoding='utf-8').read()).group(1))
with io.open(os.path.join(OUT, 'reconstruction.json'), 'w', encoding='utf-8') as f:
    json.dump(recon, f, ensure_ascii=False, indent=1)


def hms(t):
    return '%02d:%02d:%02d' % (t // 3600, (t % 3600) // 60, t % 60)


with io.open(os.path.join(OUT, 'reconstruction.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['time_edt', 'pressure_alt_ft', 'roll_deg', 'pitch_deg', 'vertical_g',
                'voices', 'marked_beat', 'beat_certainty'])
    for r in recon:
        voices = ' | '.join(
            ('%s: %s [%s]' % (v['who'], v['text'] or v['note'], v['kind'])).strip()
            for v in r['voices'])
        w.writerow([hms(r['t']), r['alt'] if r['alt'] is not None else '',
                    r['roll'] if r['roll'] is not None else '',
                    r['pitch'] if r['pitch'] is not None else '',
                    r['g'] if r['g'] is not None else '',
                    voices, r['beat'] or '', r['beatRung'] or ''])
print('reconstruction.csv/.json: %d rows, %d beats' % (len(recon), sum(1 for r in recon if r['beat'])))

# ================================================================ UA93 track ==
sys.path.insert(0, SCR)
from ua93_track import TRACK, EVENTS  # noqa: E402
with io.open(os.path.join(OUT, 'ua93_ground_track.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['index', 'longitude', 'latitude'])
    for i, (lo, la) in enumerate(TRACK):
        w.writerow([i, '%.5f' % lo, '%.5f' % la])
with io.open(os.path.join(OUT, 'ua93_ntsb_anchors.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['letter', 'time_edt', 'event', 'latitude', 'longitude'])
    for L, t, note, pt in EVENTS:
        w.writerow([L, t, note, '%.5f' % pt[1], '%.5f' % pt[0]])
print('ua93_ground_track.csv: %d points; anchors: %d' % (len(TRACK), len(EVENTS)))

# ==================================================== FDR parameter status ====
# Only what was read directly off the attachments, with how it was established.
PARAMS = [
    # parameter, port, status, attachment, how
    ('ROLL ANGLE CAPT', 'EFIS L/C-A-1', 'validated', 'I-5', 'direct read'),
    ('ROLL DISAGREE CAPT', 'EFIS L/C-A-1', 'validated', 'I-5', 'direct read'),
    ('PITCH ANGLE CAPT', 'EFIS L/C-A-1', 'validated', 'I-5', 'direct read'),
    ('PITCH DISAGREE CAPT', 'EFIS L/C-A-1', 'validated', 'I-5', 'direct read'),
    ('PASS OXY ON', 'EICAS L/R-A-1', 'validated', 'I-5', 'direct read'),
    ('LATERAL ACCELERATION', 'ACCEL', 'validated', 'I-5', 'direct read'),
    ('LONGITUDINAL ACCEL', 'ACCEL', 'validated', 'I-5', 'direct read'),
    ('ENG EPR-ACTUAL - L', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG EPR-ACTUAL - R', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG FUEL FLOW - L', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG FUEL FLOW - R', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG FUEL CUTOFF - L', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG FUEL CUTOFF - R', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG FUEL VALVE - L', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENG EPR COMMAND - L', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('ENGINE FIRE - L', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('ENGINE FIRE - R', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('ENGINE OVHT - L', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('ENGINE OVHT - R', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('ENG VIBRATION - R', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('HYD PRES - C', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('HYD PRES - L', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('HYD PRES - R', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('HYD SYS LO PRESS - C', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('HYD SYS LO PRESS - L', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('HYD SYS LO PRESS - R', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('HYD RSVR PRESS < 17 - C/L/R', 'EICAS L/R-A-1', 'validated', 'I-4', 'direct read'),
    ('RUDDER POSITION', 'EICAS L/R-A-1', 'validated', 'I-6', 'direct read'),
    ('RUDDER PEDAL POSN', 'SYNCHRO', 'validated', 'I-6', 'direct read'),
    ('CABIN ALT > 10kft', 'EICAS L/R-A-1', 'validated', 'I-2', 'direct read'),
    ('CONTROL COLUMN POSN-CAPT', 'SYNCHRO', 'validated', 'I-2', 'direct read'),
    ('CONTROL WHEEL POSN-CAPT', 'SYNCHRO', 'validated', 'I-2', 'direct read'),
    ('COMPUTED AIRSPEED', 'ADC L/R-A-4', 'validated', 'I-2', 'direct read'),
    ('AC BUS OFF - L', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('AC BUS OFF - R', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('AFT CARGO FIRE', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU BLEED VALVE', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU BUS AC VOLTS', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU EGT', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU FAULT', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU FIRE', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU GEN APB OPEN', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU LOW OIL QUANT', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('APU RPM', 'EICAS L/R-A-1', 'validated', 'I-1', 'direct read'),
    ('ECS PACK ON/OFF LEFT', 'TMC L-D-4', 'validated', 'I-2', 'direct read'),
    ('ECS PACK ON/OFF RIGHT', 'TMC L-D-4', 'validated', 'I-2', 'direct read'),
    ('MASTER CAUTION LIGHT', 'EICAS L/R-A-1', 'validated', 'I-5', 'direct read'),
    ('MASTER WARNING CAPT', 'WEU WARN', 'validated', 'I-5', 'direct read'),
    ('MASTER WARNING F/O', 'WEU WARN', 'validated', 'I-5', 'direct read'),
    ('OVERSPEED', 'ADC L/R-A-4', 'validated', 'I-5', 'direct read'),
    ('R ENG BLEED OVHT', 'EICAS L/R-A-1', 'validated', 'I-5', 'direct read'),
    ('STAB POSITION', 'FCC C-A-4 / FCC L-A-4 / FCC R-A-4 / MCP A-A-2', 'validated', 'I-6', 'direct read'),
    ('STAB TRIM FAULT', 'EICAS L/R-A-1', 'validated', 'I-6', 'direct read'),
    ('STAB TRIM MODULE', 'EICAS L/R-A-1', 'validated', 'I-6', 'direct read'),
    ('UNSCHED STAB MOVE', 'EICAS L/R-A-1', 'validated', 'I-6', 'direct read'),
    ('YAW DAMPER - L', 'EICAS L/R-A-1', 'validated', 'I-7', 'direct read'),
    ('YAW DAMPER - R', 'EICAS L/R-A-1', 'validated', 'I-7', 'direct read'),
    ('YAW DAMPER MODULE', 'EICAS L/R-A-1', 'validated', 'I-7', 'direct read'),
    ('VERTICAL ACCELERATION', 'ACCEL', 'validated', 'I-7', 'direct read'),
    ('ENG N1-ACTUAL - L/R', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('ENG N2-ACTUAL - L/R', 'EICAS L/R-A-1', 'validated', 'I-3', 'direct read'),
    ('ALTITUDE (1013.25mB)', 'ADC L/R-A-4', 'validated', 'I-1', 'direct read'),
    ('HYD SYS LO QTY - C', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-9', 'direct read'),
    ('HYD SYS LO QTY - L', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-9', 'direct read'),
    ('HYD SYS LO QTY - R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-9', 'direct read'),
    ('ENG EPR COMMAND - R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('ENG EGT-LEFT', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('ENG EGT-RIGHT', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('ENG FUEL PRES - L', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('ENG FUEL PRES - R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('ENG BLEED OFF - L/R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('VIB IDENT 1-L / 1-R / 2-L / 2-R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('YAW DAMPER ENGAGE L/R', 'YAW DMPR', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('VERTICAL DEVIATION', 'FMC L/R-D-4', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('TOTAL FUEL QUANTITY', 'FQPU', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('STATIC AIR TEMP', 'ADC L/R-A-4', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('RUDDER PCU', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('TRUE HEADING CAPT', 'EFIS L/C-A-1', 'not_working_or_unconfirmed', 'I-10', 'direct read'),
    ('ALTITUDE REPORTING', 'TCAS', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('ALTITUDE SELECT', 'TMC L-D-4', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('IDG OIL LEVEL - R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-9', 'direct read'),
    ('ICE DETECTOR - L/R', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-9', 'direct read'),
    ('APU BUS FREQ', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('APU LOAD', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
    ('APU OIL LEVEL', 'EICAS L/R-A-1', 'not_working_or_unconfirmed', 'I-8', 'direct read'),
]
with io.open(os.path.join(OUT, 'fdr_parameter_status.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['parameter', 'port', 'status', 'attachment', 'established_by'])
    w.writerows(PARAMS)
nv = sum(1 for p in PARAMS if p[2] == 'validated')
print('fdr_parameter_status.csv: %d rows (%d validated, %d not working)' % (len(PARAMS), nv, len(PARAMS) - nv))

# ========================================================= derived figures ====
DERIVED = [
    ('peak vertical acceleration', '+4.148 g', '10:01:56', 'measured',
     'Maximum of 40,400 samples in the NTSB tabulation. Exactly one sample reaches 4 g; none reaches 5 or 6.'),
    ('minimum vertical acceleration', '-1.885 g', '10:01:44', 'measured', 'Minimum of the same 40,400 samples.'),
    ('maximum roll angle', '+161.4 deg', '10:03:07', 'measured', 'ROLL ANGLE CAPT. Passes 90 deg at 10:03:03.'),
    ('pitch at last sample', '-41.1 deg', '10:03:09', 'measured', 'PITCH ANGLE CAPT, final recorded value.'),
    ('maximum lateral acceleration', '0.112 g', '10:02:00', 'measured', 'Whole flight, on a channel with +/-1 g full scale.'),
    ('altitude at last sample', '2189 ft', '10:03:09', 'measured',
     'Pressure altitude on the 1013.25 mB datum. Crash site terrain is about 2,370 ft MSL, so this is ground level.'),
    ('apex of the final climb', '9902 ft', '10:02:15', 'measured',
     'Maximum of the per-second pressure altitude samples. The NTSB anchor H at 10:02 reads 9,827 ft, which is five seconds past the apex and is not the maximum.'),
    ('sink rate, last recorded second', '575 ft/s', '10:03:08 to 10:03:09', 'derived',
     '2764 ft minus 2189 ft over one second.'),
    ('sink rate doubles after the roll passes 90 deg', '229 to 456 ft/s', '10:03:02 to 10:03:07', 'derived',
     'Per-second differences of pressure altitude. The roll crosses 90 deg at 10:03:03.'),
    ('EPR left-right difference during thrust reduction', 'mean 0.007, max 0.062', '10:01:50 to 10:03:10', 'derived',
     '80 paired samples of ENG EPR-ACTUAL L and R.'),
    ('thrust retardation begins', '10:02:17', '10:02:17', 'derived',
     'EPR peaks 1.197 at 10:02:09-14 then falls to 0.79 by 10:02:45. The CVR has Shut them off at 10:02:03.5.'),
    ('selected altitude changed to 4,992 ft', '09:48:32', '09:48:32', 'measured',
     'ALTITUDE SELECTED-MAN. Nine minutes before the revolt. ALT HOLD engages at 4,996 ft at 09:59:15.'),
    ('cabin pressure blind window', '8 min 19 s', '09:54:50 to 10:03:09', 'derived',
     'The aircraft crosses below 10,000 ft at 09:54:51 and never regains it, so the CABIN ALT > 10kft discrete cannot trip.'),
    ('analogue hydraulic pressure sampling', 'once per 64 s in the tabulation, 0.5 Hz in the recorder', '', 'derived',
     'Decimation factor 32. Last samples 10:02:18, 10:02:26 and 10:02:34, i.e. 53, 45 and 37 s before impact.'),
    ('hydraulic supply pressure, all systems', '1488 to 1860 psi', 'whole flight', 'measured',
     'Validated channel, correct scaling (y = 4x, 10 bit, 0 to 4092 psi, all values exact multiples of 4). Unexplained against a nominal usually quoted at 3000 psi.'),
    ('GOFER 06 bearing to the crash site', 'nine o clock, 30 statute mi, 10:04 to 10:06', '', 'derived',
     'Solved from the ATC vector to heading 030 and the radio call. The app previously drew 11 to 12 o clock, which contradicted the call it quoted.'),
    ('UA93 heading after the turnaround vs the Capitol', '117.5 deg flown, 118.4 deg to the Capitol, 91.9 deg to Newark', '', 'derived',
     'Great-circle bearings from the westernmost track point. The NTSB records the turn as flown in autopilot heading select mode.'),
    ('auxiliary power unit speed (APU RPM)', '0.0 per cent', '08:39:42 to 10:02:54', 'measured',
     'All 79 samples in the NTSB tabulation, one every 64 s. Validated channel (Attachment I-1). APU BUS AC VOLTS reads 2.5 VAC on all 79. The APU was not running at any point in the recording.'),
    ('auxiliary power unit exhaust temperature (APU EGT)', '6 to 8 deg C', 'whole flight', 'measured',
     'All 79 samples, one every 64 s, the last at 10:02:50. 8 deg C from 08:50:18 to 08:57:46, 6 deg C otherwise. Validated channel (Attachment I-1). APU FIRE, APU FAULT and AFT CARGO FIRE read normal to the end.'),
    ('overspeed warning on', '10:02:39', '10:02:39 to 10:03:09', 'measured',
     'OVERSPEED, validated channel, on from 10:02:39 to the last sample. COMPUTED AIRSPEED rises every second from 338 kt at 10:02:28 to 487.5 kt at 10:03:09. The only other overspeed is 09:44:37 to 09:45:40. The FBI transcript starts a loud air noise at 10:02:43.1.'),
    ('both air-conditioning packs switched off', 'between 10:01:17 and 10:01:21', '10:01:17 to 10:01:21', 'measured',
     'ECS PACK ON/OFF LEFT and RIGHT read ON to 10:01:17 and OFF from 10:01:21 to the last sample. CAM-1 Cut off the oxygen! is at 10:01:16.9 on the CVR. The recorder does not show who moved the switches.'),
    ('CVR alert tones matching the master caution light', '09:46:03.2, 09:59:57.8, 10:02:32.1', '', 'derived',
     'MASTER CAUTION LIGHT, sampled every 4 s, comes on at 09:46:04, 10:00:00 and 10:02:32. Each onset falls within one 4 s sample of a tone set in the FBI transcript (four, three and four tones). The 09:45:42.3 tones fall with the master caution off on both neighbouring samples and stay unexplained.'),
    ('CVR alert tones after leaving the selected altitude by 300 ft', '09:59:57.8, 10:03:05.5', '', 'derived',
     'Selected altitude 4,992 ft from 09:48:32. The aircraft moves more than 300 ft off it at 09:59:56 (5,317 ft) and 10:03:04 (4,552 ft), about 2 s before each tone set. No crossing back inside 300 ft produced a tone. No altitude alert channel is recorded, so this is a timing match only.'),
    ('NODAK99 departure from Bozeman', 'near 15:39 EDT (19:39Z)', '15:39', 'derived',
     'No wind, filed true airspeed 500 kt, no refuelling time. Bozeman to Toronto 1,544 mi is about 161 min, counted back from the 22:20Z Toronto estimate in the flight plan Toronto Centre held at 21:39Z (NARA NAID 7599510). Refuelling time moves it earlier, a tailwind later. Toronto to Albany 300 mi is about 31 min, which agrees with the 22:49Z Albany arrival on the ALB TRACON strip (NARA NAID 7601591). The records do not name the pilot.'),
    ('Fargo off the Bozeman-Albany great circle', '56 mi north, 685 mi along its 1,843 mi', '', 'derived',
     'Cross-track and along-track great-circle distances. Bozeman to Fargo is 687 mi and Fargo to Albany 1,159 mi. No record times or places the refuelling; InForum 2011 puts it roughly above Fargo.'),
]
with io.open(os.path.join(OUT, 'derived_figures.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['quantity', 'value', 'time_edt', 'certainty', 'method'])
    w.writerows(DERIVED)
print('derived_figures.csv: %d rows' % len(DERIVED))

# =============================================================== checksums ====
IA_TAB = ('NTSB Attachment III. Internet Archive item https://archive.org/details/NTSB_FOIA_Appeal_2012-00001-A_Nov_10_2011, '
          'folder `111028_0837_NTSB-Appeal_No._FOIA-2012-00001-9-11_Records/UA93-FDR-Tabular_files`')
SRC = [
    ('UA93_CVR.pdf', 'FBI transcript of the United 93 cockpit voice recorder',
     'https://www.nps.gov/flni/learn/historyculture/upload/CVR-Transcript.pdf'),
    ('UAL93FDR.pdf', 'NTSB Specialists Factual Report, Digital Flight Data Recorder, DCA01MA065, 15 Feb 2002',
     'https://nsarchive2.gwu.edu/NSAEBB/NSAEBB196/doc04.pdf'),
    ('DCA01MA065_tabAtoE.csv', 'NTSB tabulated FDR parameters A to E', IA_TAB),
    ('DCA01MA065_tabFtoL.csv', 'NTSB tabulated FDR parameters F to L', IA_TAB),
    ('DCA01MA065_tabMtoT.csv', 'NTSB tabulated FDR parameters M to T', IA_TAB),
    ('DCA01MA065_tabUtoZ.csv', 'NTSB tabulated FDR parameters U to Z', IA_TAB),
    ('757UALmap.xls', 'United Airlines 757 DFDR data frame layout', 'NTSB Attachment IV'),
    ('V_757.txt', 'United Airlines 757-3b parameter database dump, 1110 parameters',
     'http://www.warrenstutt.com/NTSBFOIARequest2-1-09/CDROM/757-3b_1.TXT'),
    ('ZBW_FD_TRASH.TXT', 'Boston ARTCC flight-data message file, 11 Sep 2001, catalogue title 5 ZBW 70 FD SEPT 11 TRASH.TXT. '
     'Holds the NODAK99 and NODAC99 F-16 flight plans. FAA 9/11 records, Record Group 237, NARA NAID 7599510',
     'https://catalog.archives.gov/id/7599510'),
    ('ALB_TRACON_strips_91101.pdf', 'Albany TRACON flight strips, 11 Sep 2001, catalogue title 5 ALB 7 Flight Strips ALB TRACON 91101.pdf. '
     'NODAK99 and NODAC99 strips on page 12. FAA 9/11 records, Record Group 237, NARA NAID 7601591',
     'https://catalog.archives.gov/id/7601591'),
    ('nd_hj_2007_hr10.pdf', 'North Dakota House Journal, 60th Legislative Assembly, 16 January 2007',
     'https://www.ndlegis.gov/assembly/60-2007/regular/journals/HR10.pdf'),
]
lines = []
for fn, desc, url in SRC:
    p = os.path.join(SCR, fn)
    if not os.path.exists(p):
        lines.append('| %s | %s | _not present when this was built_ | | %s |' % (fn, desc, url))
        continue
    lines.append('| `%s` | %s | %d | `%s` | %s |' % (fn, desc, os.path.getsize(p), sha256(p), url))
io.open(os.path.join(OUT, 'SOURCES.md'), 'w', encoding='utf-8').write(
    '# Sources\n\nThe large source documents are not redistributed here. They are US Government works, apart from\n'
    'the North Dakota House Journal, which is a state record, and all are freely available. Each is\n'
    'listed with a byte count and a SHA-256 so you can confirm you have the same file these data were\n'
    'built from.\n\n'
    '| file | what it is | bytes | sha256 | where |\n|---|---|---|---|---|\n' + '\n'.join(lines) + '\n')
print('SOURCES.md written')
