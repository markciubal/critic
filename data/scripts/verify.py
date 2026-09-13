# -*- coding: utf-8 -*-
"""Re-derive the headline figures from the released CSVs.

Run this before trusting anything in ../. It recomputes each number from the
data rather than reading it from derived_figures.csv, so a disagreement means
either the data or the claim is wrong, and you will know which.
"""
import csv, io, os, sys

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
fails = []


def check(label, got, want, tol=0.0):
    ok = (abs(got - want) <= tol) if isinstance(want, float) else (got == want)
    print('%-52s %-14s %s' % (label, got, 'OK' if ok else 'MISMATCH expected %s' % want))
    if not ok:
        fails.append(label)


rows = list(csv.DictReader(io.open(os.path.join(D, 'reconstruction.csv'), encoding='utf-8')))
num = lambda r, k: float(r[k]) if r[k] else None

roll = [(r['time_edt'], num(r, 'roll_deg')) for r in rows if r['roll_deg']]
check('max roll angle (deg)', max(v for _, v in roll), 161.4, 0.05)
check('time of max roll', max(roll, key=lambda x: x[1])[0], '10:03:07')
check('samples with |roll| > 90 deg', sum(1 for _, v in roll if abs(v) > 90), 7)

pitch = [(r['time_edt'], num(r, 'pitch_deg')) for r in rows if r['pitch_deg']]
check('min pitch angle (deg)', min(v for _, v in pitch), -41.1, 0.05)

alt = [(r['time_edt'], num(r, 'pressure_alt_ft')) for r in rows if r['pressure_alt_ft']]
check('apex of the final climb (ft)', max(v for _, v in alt), 9902.0, 0.5)
check('last recorded altitude (ft)', alt[-1][1], 2189.0, 0.5)
a = dict(alt)
check('sink rate over the last second (ft/s)', a['10:03:08'] - a['10:03:09'], 575.0, 0.5)

cvr = list(csv.DictReader(io.open(os.path.join(D, 'cvr_typography.csv'), encoding='utf-8')))
check('CVR rows', len(cvr), 302)
check('lines of English as spoken', sum(1 for r in cvr if r['language'] == 'english_spoken'), 92)
check('lines translated from Arabic', sum(1 for r in cvr if r['language'] == 'translated_arabic'), 54)

st = list(csv.DictReader(io.open(os.path.join(D, 'fdr_parameter_status.csv'), encoding='utf-8')))
check('channels marked not working', sum(1 for r in st if r['status'] != 'validated'), 20)
check('validated rows resting on absence, not sight',
      sum(1 for r in st if r['status'] == 'validated' and 'absence' in r['established_by']), 4)

trk = list(csv.reader(io.open(os.path.join(D, 'ua93_ground_track.csv'), encoding='utf-8')))[1:]
check('ground track points', len(trk), 320)

print()
print('FAILED: %d' % len(fails) if fails else 'all checks passed')
sys.exit(1 if fails else 0)
