/* =============================================================================
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

export const RECON_START = 35820;
export const RECON_END = 36191;

export const RECONSTRUCTION = [
 {
  "t": 35820,
  "alt": 7210,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.982,
  "voices": [],
  "beat": "The revolt begins.",
  "beatRung": "published",
  "beatNote": "The Commission fixes the start of the passenger assault here."
 },
 {
  "t": 35821,
  "alt": 7188,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35822,
  "alt": 7165,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.986,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35823,
  "alt": 7146,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35824,
  "alt": 7122,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35825,
  "alt": 7103,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35826,
  "alt": 7080,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35827,
  "alt": 7059,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35828,
  "alt": 7038,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35829,
  "alt": 7016,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35830,
  "alt": 6994,
  "roll": -0.7,
  "pitch": 0.0,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35831,
  "alt": 6973,
  "roll": -1.1,
  "pitch": 0.0,
  "g": 0.982,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35832,
  "alt": 6950,
  "roll": -1.1,
  "pitch": 0.0,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35833,
  "alt": 6928,
  "roll": -0.7,
  "pitch": 0.0,
  "g": 0.982,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35834,
  "alt": 6906,
  "roll": -0.7,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35835,
  "alt": 6886,
  "roll": -0.7,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35836,
  "alt": 6862,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.982,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35837,
  "alt": 6839,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.979,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35838,
  "alt": 6818,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.982,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35839,
  "alt": 6796,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35840,
  "alt": 6774,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.998,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35841,
  "alt": 6752,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 1.0,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35842,
  "alt": 6730,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35843,
  "alt": 6708,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35844,
  "alt": 6687,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35845,
  "alt": 6666,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35846,
  "alt": 6644,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35847,
  "alt": 6624,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35848,
  "alt": 6602,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35849,
  "alt": 6582,
  "roll": 0.0,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35850,
  "alt": 6558,
  "roll": -0.4,
  "pitch": 0.0,
  "g": 0.986,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35851,
  "alt": 6536,
  "roll": -1.4,
  "pitch": 0.0,
  "g": 0.982,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35852,
  "alt": 6515,
  "roll": -2.8,
  "pitch": 0.0,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35853,
  "alt": 6494,
  "roll": -4.9,
  "pitch": 0.0,
  "g": 0.979,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35854,
  "alt": 6471,
  "roll": -6.7,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35855,
  "alt": 6449,
  "roll": -8.8,
  "pitch": 0.0,
  "g": 0.991,
  "voices": [],
  "beat": "The rolling starts.",
  "beatRung": "measured",
  "beatNote": "Roll angle leaves zero within seconds of the assault beginning. The Commission says Jarrah began rolling in response; the parameter agrees on timing."
 },
 {
  "t": 35856,
  "alt": 6426,
  "roll": -11.2,
  "pitch": 0.0,
  "g": 1.005,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35857,
  "alt": 6404,
  "roll": -13.4,
  "pitch": 0.0,
  "g": 1.007,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35858,
  "alt": 6381,
  "roll": -15.1,
  "pitch": 0.0,
  "g": 1.018,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35859,
  "alt": 6358,
  "roll": -16.9,
  "pitch": 0.0,
  "g": 1.034,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35860,
  "alt": 6335,
  "roll": -18.3,
  "pitch": 0.0,
  "g": 1.044,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35861,
  "alt": 6313,
  "roll": -19.3,
  "pitch": 0.0,
  "g": 1.053,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35862,
  "alt": 6291,
  "roll": -20.0,
  "pitch": 0.0,
  "g": 1.046,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of papers being shuffled, or movements"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35863,
  "alt": 6269,
  "roll": -20.4,
  "pitch": 0.0,
  "g": 1.048,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35864,
  "alt": 6246,
  "roll": -20.7,
  "pitch": 0.0,
  "g": 1.055,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35865,
  "alt": 6225,
  "roll": -21.1,
  "pitch": 0.0,
  "g": 1.055,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35866,
  "alt": 6203,
  "roll": -21.4,
  "pitch": 0.4,
  "g": 1.06,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35867,
  "alt": 6181,
  "roll": -21.4,
  "pitch": 0.4,
  "g": 1.062,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35868,
  "alt": 6160,
  "roll": -21.8,
  "pitch": 0.4,
  "g": 1.062,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35869,
  "alt": 6138,
  "roll": -21.4,
  "pitch": 0.4,
  "g": 1.057,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35870,
  "alt": 6115,
  "roll": -21.4,
  "pitch": 0.4,
  "g": 1.06,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35871,
  "alt": 6095,
  "roll": -21.8,
  "pitch": 0.4,
  "g": 1.082,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35872,
  "alt": 6076,
  "roll": -21.8,
  "pitch": 0.4,
  "g": 1.092,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35873,
  "alt": 6055,
  "roll": -21.4,
  "pitch": 0.4,
  "g": 1.06,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35874,
  "alt": 6036,
  "roll": -20.7,
  "pitch": 0.4,
  "g": 1.046,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35875,
  "alt": 6015,
  "roll": -19.7,
  "pitch": 0.4,
  "g": 1.039,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Is there something",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35876,
  "alt": 5995,
  "roll": -18.6,
  "pitch": 0.4,
  "g": 1.039,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35877,
  "alt": 5974,
  "roll": -16.9,
  "pitch": 0.4,
  "g": 1.032,
  "voices": [
   {
    "who": "CAM 1",
    "text": "A fight",
    "kind": "unmarked",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35878,
  "alt": 5953,
  "roll": -15.5,
  "pitch": 0.4,
  "g": 1.025,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35879,
  "alt": 5933,
  "roll": -13.4,
  "pitch": 0.4,
  "g": 1.027,
  "voices": [
   {
    "who": "CAM 2",
    "text": "Yeah",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35880,
  "alt": 5913,
  "roll": -11.6,
  "pitch": 0.4,
  "g": 1.016,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35881,
  "alt": 5891,
  "roll": -10.2,
  "pitch": 0.4,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35882,
  "alt": 5866,
  "roll": 9.1,
  "pitch": 1.1,
  "g": 1.176,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a light knock on the door"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35883,
  "alt": 5852,
  "roll": 5.3,
  "pitch": 1.4,
  "g": 0.977,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35884,
  "alt": 5830,
  "roll": -30.9,
  "pitch": 1.1,
  "g": 0.961,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35885,
  "alt": 5806,
  "roll": -7.7,
  "pitch": 1.4,
  "g": 1.316,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35886,
  "alt": 5788,
  "roll": 7.0,
  "pitch": 0.7,
  "g": 0.844,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35887,
  "alt": 5764,
  "roll": -24.3,
  "pitch": 1.1,
  "g": 1.211,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35888,
  "alt": 5744,
  "roll": -27.4,
  "pitch": 0.0,
  "g": 0.801,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35889,
  "alt": 5716,
  "roll": 12.3,
  "pitch": 1.1,
  "g": 1.286,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35890,
  "alt": 5690,
  "roll": 19.7,
  "pitch": 0.4,
  "g": 0.863,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35891,
  "alt": 5670,
  "roll": -4.6,
  "pitch": 0.7,
  "g": 1.229,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35892,
  "alt": 5644,
  "roll": -25.0,
  "pitch": 0.0,
  "g": 0.986,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35893,
  "alt": 5624,
  "roll": -3.9,
  "pitch": 0.7,
  "g": 1.126,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35894,
  "alt": 5593,
  "roll": 22.5,
  "pitch": 0.7,
  "g": 1.016,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35895,
  "alt": 5579,
  "roll": 1.4,
  "pitch": 0.7,
  "g": 1.062,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of opening"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35896,
  "alt": 5546,
  "roll": -33.7,
  "pitch": 0.7,
  "g": 1.135,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35897,
  "alt": 5525,
  "roll": -33.7,
  "pitch": -0.4,
  "g": 0.936,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35898,
  "alt": 5494,
  "roll": 0.7,
  "pitch": 0.7,
  "g": 1.245,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35899,
  "alt": 5476,
  "roll": 2.5,
  "pitch": 0.7,
  "g": 1.094,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35900,
  "alt": 5458,
  "roll": -17.9,
  "pitch": 1.1,
  "g": 1.151,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a male scream from a distance, and fighting in the background"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35901,
  "alt": 5440,
  "roll": -24.6,
  "pitch": 0.7,
  "g": 0.812,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a male screaming from a distance"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35902,
  "alt": 5418,
  "roll": 10.9,
  "pitch": 1.8,
  "g": 1.288,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35903,
  "alt": 5399,
  "roll": 22.1,
  "pitch": 0.7,
  "g": 0.934,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35904,
  "alt": 5382,
  "roll": 3.9,
  "pitch": 1.1,
  "g": 1.197,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35905,
  "alt": 5363,
  "roll": -12.0,
  "pitch": 0.7,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35906,
  "alt": 5343,
  "roll": -3.2,
  "pitch": 0.7,
  "g": 1.023,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35907,
  "alt": 5319,
  "roll": 6.3,
  "pitch": 0.7,
  "g": 0.842,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35908,
  "alt": 5304,
  "roll": -19.7,
  "pitch": 1.1,
  "g": 1.085,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35909,
  "alt": 5266,
  "roll": -46.4,
  "pitch": -0.4,
  "g": 0.945,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35910,
  "alt": 5240,
  "roll": -29.5,
  "pitch": -0.7,
  "g": 1.073,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35911,
  "alt": 5208,
  "roll": 14.4,
  "pitch": 1.8,
  "g": 1.389,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35912,
  "alt": 5174,
  "roll": 36.9,
  "pitch": 0.4,
  "g": 1.044,
  "voices": [
   {
    "who": "CAM ?",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible phrase. Far-away. Hard to hear"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35913,
  "alt": 5155,
  "roll": 23.6,
  "pitch": -0.4,
  "g": 0.952,
  "voices": [
   {
    "who": "CAM 1.",
    "text": "Let's go guys! Allah is Greatest. Allah is Greatest. Oh guys! Allah is Greatest",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35914,
  "alt": 5134,
  "roll": -12.3,
  "pitch": 1.8,
  "g": 1.389,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35915,
  "alt": 5104,
  "roll": -37.3,
  "pitch": 0.7,
  "g": 1.048,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35916,
  "alt": 5093,
  "roll": -17.6,
  "pitch": 1.1,
  "g": 1.277,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35917,
  "alt": 5076,
  "roll": 19.0,
  "pitch": 2.8,
  "g": 1.366,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35918,
  "alt": 5068,
  "roll": 21.8,
  "pitch": 2.1,
  "g": 0.911,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35919,
  "alt": 5068,
  "roll": -2.1,
  "pitch": 2.8,
  "g": 1.3,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35920,
  "alt": 5063,
  "roll": -20.7,
  "pitch": 2.5,
  "g": 1.025,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35921,
  "alt": 5062,
  "roll": -6.3,
  "pitch": 2.8,
  "g": 1.135,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ugh!",
    "kind": "unmarked",
    "note": "The sound of a fight/struggle"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35922,
  "alt": 5060,
  "roll": 13.7,
  "pitch": 2.8,
  "g": 1.076,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35923,
  "alt": 5055,
  "roll": 8.1,
  "pitch": 2.5,
  "g": 0.995,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ugh!",
    "kind": "unmarked",
    "note": "The sound of a fight/struggle"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35924,
  "alt": 5059,
  "roll": 11.2,
  "pitch": 2.8,
  "g": 1.009,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Oh Allah! Oh Allah! Oh the most Gracious!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35925,
  "alt": 5046,
  "roll": 37.6,
  "pitch": 2.1,
  "g": 0.989,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35926,
  "alt": 5035,
  "roll": 30.2,
  "pitch": 1.1,
  "g": 0.785,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35927,
  "alt": 5029,
  "roll": 0.7,
  "pitch": 2.5,
  "g": 1.298,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ugh! Ugh!",
    "kind": "english",
    "note": "The sound of a fight/struggle"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35928,
  "alt": 5022,
  "roll": -21.8,
  "pitch": 2.5,
  "g": 1.087,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35929,
  "alt": 5017,
  "roll": -12.3,
  "pitch": 2.5,
  "g": 1.156,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35930,
  "alt": 5012,
  "roll": -7.4,
  "pitch": 2.5,
  "g": 1.08,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35931,
  "alt": 5014,
  "roll": 0.0,
  "pitch": 2.5,
  "g": 0.897,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35932,
  "alt": 5010,
  "roll": 17.2,
  "pitch": 2.8,
  "g": 1.039,
  "voices": [
   {
    "who": "CAM ?",
    "text": "STAY BACK!",
    "kind": "english-shout",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35933,
  "alt": 5013,
  "roll": -1.1,
  "pitch": 2.8,
  "g": 1.025,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35934,
  "alt": 5009,
  "roll": -26.7,
  "pitch": 2.8,
  "g": 0.998,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35935,
  "alt": 5008,
  "roll": -6.7,
  "pitch": 3.2,
  "g": 1.286,
  "voices": [
   {
    "who": "CAM ?",
    "text": "In the cockpit",
    "kind": "english",
    "note": "A native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35936,
  "alt": 5007,
  "roll": 7.0,
  "pitch": 3.2,
  "g": 1.048,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35937,
  "alt": 5011,
  "roll": 3.2,
  "pitch": 2.5,
  "g": 0.973,
  "voices": [
   {
    "who": "CAM ?",
    "text": "In the cockpit",
    "kind": "english",
    "note": "A native English speaking male"
   },
   {
    "who": "CAM 1",
    "text": "They want to get in there. Hold, hold from the inside. Hold from the inside. Hold. عاوزين يدخلوالهناك. إمسك, إمسك من الداخل. إمسك من الداخل. إمسك",
    "kind": "arabic",
    "note": "The door"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35938,
  "alt": 5013,
  "roll": 3.9,
  "pitch": 2.5,
  "g": 0.95,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35939,
  "alt": 5012,
  "roll": 1.8,
  "pitch": 2.1,
  "g": 0.959,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35940,
  "alt": 5011,
  "roll": 1.8,
  "pitch": 2.1,
  "g": 0.959,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35941,
  "alt": 5010,
  "roll": 2.1,
  "pitch": 2.1,
  "g": 0.968,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35942,
  "alt": 5005,
  "roll": 3.2,
  "pitch": 2.1,
  "g": 0.982,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35943,
  "alt": 5004,
  "roll": 9.8,
  "pitch": 2.1,
  "g": 1.0,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35944,
  "alt": 5000,
  "roll": 13.7,
  "pitch": 2.1,
  "g": 0.89,
  "voices": [
   {
    "who": "CAM,?",
    "text": "hold the door",
    "kind": "english",
    "note": "U/I; Multiple native English speaking voices"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35945,
  "alt": 4998,
  "roll": -5.6,
  "pitch": 2.5,
  "g": 1.13,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35946,
  "alt": 4994,
  "roll": -8.1,
  "pitch": 2.5,
  "g": 1.002,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35947,
  "alt": 4992,
  "roll": -2.1,
  "pitch": 2.5,
  "g": 1.021,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35948,
  "alt": 4991,
  "roll": -0.4,
  "pitch": 2.5,
  "g": 1.009,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35949,
  "alt": 4992,
  "roll": 1.1,
  "pitch": 2.5,
  "g": 0.995,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Stop him",
    "kind": "english",
    "note": "A native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35950,
  "alt": 4993,
  "roll": 2.5,
  "pitch": 2.5,
  "g": 1.002,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35951,
  "alt": 4993,
  "roll": 3.2,
  "pitch": 2.5,
  "g": 0.993,
  "voices": [
   {
    "who": "CAM 3",
    "text": "Sit down! Sit down!",
    "kind": "english",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35952,
  "alt": 4993,
  "roll": 3.9,
  "pitch": 2.5,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35953,
  "alt": 4994,
  "roll": 4.2,
  "pitch": 2.5,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35954,
  "alt": 4995,
  "roll": 4.2,
  "pitch": 2.5,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35955,
  "alt": 4996,
  "roll": 4.6,
  "pitch": 2.5,
  "g": 0.984,
  "voices": [
   {
    "who": "CAM 3",
    "text": "Sit down!",
    "kind": "english",
    "note": ""
   }
  ],
  "beat": "The autopilot levels off at the altitude somebody selected eleven minutes earlier.",
  "beatRung": "measured",
  "beatNote": "ALT HOLD engages at 4,996 ft. The target was dialled in at 09:48:32, nine minutes before the revolt. The machine simply arrived."
 },
 {
  "t": 35956,
  "alt": 4995,
  "roll": 4.2,
  "pitch": 2.5,
  "g": 0.984,
  "voices": [
   {
    "who": "CAM ?",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35957,
  "alt": 4995,
  "roll": 3.9,
  "pitch": 2.5,
  "g": 0.979,
  "voices": [
   {
    "who": "CAM 1",
    "text": "What",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35958,
  "alt": 4995,
  "roll": 4.6,
  "pitch": 2.5,
  "g": 0.842,
  "voices": [
   {
    "who": "CAM 1",
    "text": "There are some guys. All those guys",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35959,
  "alt": 4990,
  "roll": 26.0,
  "pitch": 2.8,
  "g": 1.172,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35960,
  "alt": 4980,
  "roll": 28.5,
  "pitch": 2.1,
  "g": 0.776,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Let's get them",
    "kind": "english",
    "note": "A native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35961,
  "alt": 4985,
  "roll": -5.6,
  "pitch": 3.5,
  "g": 1.195,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35962,
  "alt": 4973,
  "roll": -35.5,
  "pitch": 3.2,
  "g": 1.085,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35963,
  "alt": 4973,
  "roll": -26.4,
  "pitch": 2.5,
  "g": 1.034,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35964,
  "alt": 4973,
  "roll": 8.4,
  "pitch": 3.9,
  "g": 1.298,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35965,
  "alt": 4974,
  "roll": 15.5,
  "pitch": 3.5,
  "g": 1.03,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Sit down!",
    "kind": "english",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35966,
  "alt": 4988,
  "roll": -11.2,
  "pitch": 3.9,
  "g": 1.08,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35967,
  "alt": 4984,
  "roll": -33.7,
  "pitch": 3.5,
  "g": 1.021,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a fight in the background!"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35968,
  "alt": 4991,
  "roll": -27.4,
  "pitch": 3.2,
  "g": 0.918,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35969,
  "alt": 4992,
  "roll": 12.3,
  "pitch": 4.6,
  "g": 1.288,
  "voices": [
   {
    "who": "CAM 1",
    "text": "What",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35970,
  "alt": 4994,
  "roll": 22.5,
  "pitch": 3.5,
  "g": 0.945,
  "voices": [
   {
    "who": "CAM 2",
    "text": "! What",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35971,
  "alt": 5008,
  "roll": -6.0,
  "pitch": 3.9,
  "g": 1.078,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35972,
  "alt": 5007,
  "roll": -30.6,
  "pitch": 3.5,
  "g": 1.011,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35973,
  "alt": 5012,
  "roll": -23.2,
  "pitch": 3.2,
  "g": 1.014,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35974,
  "alt": 5015,
  "roll": 13.7,
  "pitch": 3.9,
  "g": 1.19,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35975,
  "alt": 5009,
  "roll": 32.0,
  "pitch": 2.8,
  "g": 0.943,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35976,
  "alt": 5016,
  "roll": 10.2,
  "pitch": 2.8,
  "g": 0.963,
  "voices": [
   {
    "who": "CAM 2",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35977,
  "alt": 5014,
  "roll": -27.8,
  "pitch": 3.9,
  "g": 1.311,
  "voices": [
   {
    "who": "CAM 1",
    "text": "What",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35978,
  "alt": 5016,
  "roll": -36.6,
  "pitch": 2.5,
  "g": 0.81,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35979,
  "alt": 5013,
  "roll": -10.9,
  "pitch": 3.2,
  "g": 1.227,
  "voices": [
   {
    "who": "CAM 2",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35980,
  "alt": 5016,
  "roll": -9.8,
  "pitch": 3.2,
  "g": 0.961,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35981,
  "alt": 5022,
  "roll": 15.1,
  "pitch": 3.5,
  "g": 1.238,
  "voices": [
   {
    "who": "CAM 1",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35982,
  "alt": 5025,
  "roll": 18.6,
  "pitch": 2.8,
  "g": 0.799,
  "voices": [
   {
    "who": "CAM 2",
    "text": "Trust in Allah, and in him",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35983,
  "alt": 5029,
  "roll": 3.9,
  "pitch": 2.8,
  "g": 1.005,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35984,
  "alt": 5033,
  "roll": 0.4,
  "pitch": 2.5,
  "g": 0.957,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35985,
  "alt": 5034,
  "roll": 1.4,
  "pitch": 2.5,
  "g": 0.943,
  "voices": [
   {
    "who": "CAM",
    "text": "Sit down. 7010 ،",
    "kind": "english",
    "note": "From a distance"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35986,
  "alt": 5032,
  "roll": 2.5,
  "pitch": 2.1,
  "g": 0.943,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud metal to metal snap"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35987,
  "alt": 5032,
  "roll": 3.5,
  "pitch": 2.1,
  "g": 0.952,
  "voices": [
   {
    "who": "CAM 2",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35988,
  "alt": 5030,
  "roll": 3.9,
  "pitch": 2.1,
  "g": 0.959,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a snap"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35989,
  "alt": 5032,
  "roll": 4.6,
  "pitch": 2.1,
  "g": 0.966,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35990,
  "alt": 5032,
  "roll": 4.9,
  "pitch": 2.1,
  "g": 0.961,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud metal to metal snap"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35991,
  "alt": 5030,
  "roll": 17.9,
  "pitch": 2.5,
  "g": 1.092,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35992,
  "alt": 5027,
  "roll": 4.2,
  "pitch": 2.8,
  "g": 1.304,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35993,
  "alt": 5104,
  "roll": -0.4,
  "pitch": 9.5,
  "g": 2.955,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "english",
    "note": "Shouted by an Arabic speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35994,
  "alt": 5214,
  "roll": 2.1,
  "pitch": 20.4,
  "g": 2.719,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud thump"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35995,
  "alt": 5249,
  "roll": 1.1,
  "pitch": 8.4,
  "g": -0.788,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "unmarked",
    "note": "Shouted with force, by an Arabic speaking male"
   },
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The start of crash sounds mixed with glass/plate; End of crash sounds"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35996,
  "alt": 5317,
  "roll": 1.1,
  "pitch": 6.7,
  "g": 0.865,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35997,
  "alt": 5377,
  "roll": 2.1,
  "pitch": 9.1,
  "g": 0.654,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of 3 alert tones"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35998,
  "alt": 5366,
  "roll": 2.8,
  "pitch": 2.5,
  "g": -0.616,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The start of series of very loud crashes"
   },
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "unmarked",
    "note": "Shouted with force, by an Arabic speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 35999,
  "alt": 5369,
  "roll": 4.6,
  "pitch": 1.1,
  "g": 0.789,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36000,
  "alt": 5437,
  "roll": 5.6,
  "pitch": 7.0,
  "g": 2.28,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "End of crash sounds"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36001,
  "alt": 5491,
  "roll": 4.9,
  "pitch": 14.1,
  "g": 2.126,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36002,
  "alt": 5565,
  "roll": 2.5,
  "pitch": 10.2,
  "g": 0.773,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36003,
  "alt": 5625,
  "roll": 0.7,
  "pitch": 8.4,
  "g": 0.581,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36004,
  "alt": 5680,
  "roll": 0.7,
  "pitch": 8.1,
  "g": 0.801,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36005,
  "alt": 5734,
  "roll": 1.4,
  "pitch": 8.4,
  "g": 0.984,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36006,
  "alt": 5788,
  "roll": 1.4,
  "pitch": 8.4,
  "g": 1.002,
  "voices": [
   {
    "who": "CAM ?",
    "text": "There is nothing",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36007,
  "alt": 5841,
  "roll": 1.8,
  "pitch": 8.4,
  "g": 0.982,
  "voices": [
   {
    "who": "CAM",
    "text": "1 Is that it Shall we finish it off",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36008,
  "alt": 5888,
  "roll": 1.8,
  "pitch": 7.0,
  "g": 0.783,
  "voices": [
   {
    "who": "CAM ?",
    "text": "No. Not yet",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36009,
  "alt": 5934,
  "roll": 2.1,
  "pitch": 7.4,
  "g": 0.963,
  "voices": [
   {
    "who": "CAM 2",
    "text": "When they all come, we finish it off",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": "They decide to wait.",
  "beatRung": "published",
  "beatNote": "Asked whether to finish it off, the answer is no. Not yet. When they all come, we finish it off."
 },
 {
  "t": 36010,
  "alt": 5978,
  "roll": 2.5,
  "pitch": 7.4,
  "g": 0.963,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36011,
  "alt": 6025,
  "roll": 2.8,
  "pitch": 7.0,
  "g": 0.968,
  "voices": [
   {
    "who": "CAM 1",
    "text": "There is nothing",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36012,
  "alt": 6052,
  "roll": 2.5,
  "pitch": 5.3,
  "g": 0.517,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36013,
  "alt": 6069,
  "roll": 2.8,
  "pitch": 3.2,
  "g": 0.528,
  "voices": [
   {
    "who": "CAM 2",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36014,
  "alt": 6077,
  "roll": 3.2,
  "pitch": 2.5,
  "g": 0.732,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "unmarked",
    "note": "It was shouted by a native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36015,
  "alt": 6084,
  "roll": 3.9,
  "pitch": 2.5,
  "g": 0.902,
  "voices": [
   {
    "who": "CAM ?",
    "text": "I'm injured",
    "kind": "english",
    "note": "It was said by a native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36016,
  "alt": 6085,
  "roll": 3.9,
  "pitch": 2.1,
  "g": 0.89,
  "voices": [
   {
    "who": "CAM ?",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36017,
  "alt": 6082,
  "roll": 3.5,
  "pitch": 1.8,
  "g": 0.785,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud metal to metal snap"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36018,
  "alt": 6068,
  "roll": 3.2,
  "pitch": 0.4,
  "g": 0.689,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36019,
  "alt": 6048,
  "roll": 3.2,
  "pitch": -0.4,
  "g": 0.778,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36020,
  "alt": 6021,
  "roll": 2.8,
  "pitch": -0.7,
  "g": 0.785,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36021,
  "alt": 5997,
  "roll": 2.5,
  "pitch": -1.1,
  "g": 0.977,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "english",
    "note": "A faint, distant shout"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36022,
  "alt": 5986,
  "roll": 2.5,
  "pitch": 1.1,
  "g": 1.472,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Oh Allah! Oh Allah! Oh Gracious!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36023,
  "alt": 5981,
  "roll": 2.1,
  "pitch": 1.4,
  "g": 1.167,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36024,
  "alt": 5977,
  "roll": 1.4,
  "pitch": 1.8,
  "g": 1.071,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36025,
  "alt": 5987,
  "roll": 1.1,
  "pitch": 2.5,
  "g": 1.231,
  "voices": [
   {
    "who": "CAM ?",
    "text": "In the cockpit. If we don't we'll die!",
    "kind": "english",
    "note": "Shouted by a native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36026,
  "alt": 5998,
  "roll": 1.1,
  "pitch": 2.8,
  "g": 1.105,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36027,
  "alt": 6025,
  "roll": 1.1,
  "pitch": 3.9,
  "g": 1.373,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36028,
  "alt": 6044,
  "roll": 1.1,
  "pitch": 4.2,
  "g": 0.95,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36029,
  "alt": 6050,
  "roll": 0.7,
  "pitch": 2.5,
  "g": 0.597,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Up, down. Up, down, in the cockpit",
    "kind": "mixed",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36030,
  "alt": 6060,
  "roll": 0.7,
  "pitch": 2.1,
  "g": 0.995,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of auto-pilot disconnect warning starts, and continuous until the end of the recording"
   }
  ],
  "beat": "The autopilot comes off.",
  "beatRung": "measured",
  "beatNote": "The disconnect warning starts and runs to the end of the recording. From here the aircraft is hand-flown."
 },
 {
  "t": 36031,
  "alt": 6073,
  "roll": 1.1,
  "pitch": 2.8,
  "g": 1.094,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36032,
  "alt": 6082,
  "roll": 1.4,
  "pitch": 2.5,
  "g": 0.938,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36033,
  "alt": 6086,
  "roll": 2.1,
  "pitch": 1.8,
  "g": 0.78,
  "voices": [
   {
    "who": "CAM 1",
    "text": "The Cockpit",
    "kind": "mixed",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36034,
  "alt": 6090,
  "roll": 1.1,
  "pitch": 1.8,
  "g": 0.966,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36035,
  "alt": 6099,
  "roll": 0.4,
  "pitch": 1.8,
  "g": 0.94,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36036,
  "alt": 6104,
  "roll": 0.7,
  "pitch": 1.8,
  "g": 0.986,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36037,
  "alt": 6116,
  "roll": 1.8,
  "pitch": 2.5,
  "g": 1.277,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Up, down. Saeed, up, down!!",
    "kind": "arabic",
    "note": "Arabic first name. See picture"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36038,
  "alt": 6133,
  "roll": 2.1,
  "pitch": 3.5,
  "g": 1.268,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36039,
  "alt": 6154,
  "roll": 2.5,
  "pitch": 3.5,
  "g": 1.027,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36040,
  "alt": 6172,
  "roll": 2.8,
  "pitch": 3.5,
  "g": 0.973,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36041,
  "alt": 6198,
  "roll": 3.2,
  "pitch": 3.5,
  "g": 1.037,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36042,
  "alt": 6236,
  "roll": 3.9,
  "pitch": 4.2,
  "g": 1.213,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Roll it!",
    "kind": "english",
    "note": "Command shouted, in the distance, by a native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36043,
  "alt": 6276,
  "roll": 4.9,
  "pitch": 5.3,
  "g": 1.3,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36044,
  "alt": 6332,
  "roll": 5.6,
  "pitch": 6.0,
  "g": 1.085,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36045,
  "alt": 6455,
  "roll": 5.3,
  "pitch": 13.7,
  "g": 3.779,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36046,
  "alt": 6544,
  "roll": 4.9,
  "pitch": 11.6,
  "g": -0.38,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of the first of two loud plates/glass crashes"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36047,
  "alt": 6588,
  "roll": 6.0,
  "pitch": 4.2,
  "g": 0.025,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of the second of two loud plates/glass crashes"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36048,
  "alt": 6662,
  "roll": 6.7,
  "pitch": 9.1,
  "g": 1.501,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36049,
  "alt": 6757,
  "roll": 6.7,
  "pitch": 9.5,
  "g": 1.453,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36050,
  "alt": 6855,
  "roll": 6.7,
  "pitch": 12.3,
  "g": 1.506,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36051,
  "alt": 6945,
  "roll": 7.0,
  "pitch": 10.2,
  "g": 0.778,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36052,
  "alt": 7045,
  "roll": 7.7,
  "pitch": 11.2,
  "g": 1.121,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36053,
  "alt": 7148,
  "roll": 8.1,
  "pitch": 12.0,
  "g": 1.185,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36054,
  "alt": 7255,
  "roll": 8.8,
  "pitch": 12.7,
  "g": 1.201,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36055,
  "alt": 7365,
  "roll": 9.5,
  "pitch": 12.7,
  "g": 1.053,
  "voices": [
   {
    "who": "CAM ?",
    "text": "",
    "kind": "unmarked",
    "note": "Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36056,
  "alt": 7478,
  "roll": 10.2,
  "pitch": 13.0,
  "g": 1.089,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36057,
  "alt": 7599,
  "roll": 6.3,
  "pitch": 14.1,
  "g": 1.007,
  "voices": [
   {
    "who": "HOT 2",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a microphone being moved"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36058,
  "alt": 7707,
  "roll": -4.6,
  "pitch": 12.7,
  "g": 0.668,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36059,
  "alt": 7795,
  "roll": -5.3,
  "pitch": 10.5,
  "g": 0.547,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Allah is the Greatest! Allah is the Greatest!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36060,
  "alt": 7890,
  "roll": -2.5,
  "pitch": 10.2,
  "g": 0.776,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36061,
  "alt": 7957,
  "roll": -0.7,
  "pitch": 7.7,
  "g": 0.162,
  "voices": [
   {
    "who": "CAM 2",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase; The sound a metallic click"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36062,
  "alt": 7976,
  "roll": -0.4,
  "pitch": 3.5,
  "g": -0.12,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36063,
  "alt": 7999,
  "roll": 0.0,
  "pitch": 3.2,
  "g": 0.565,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36064,
  "alt": 7986,
  "roll": 0.4,
  "pitch": 0.7,
  "g": 0.386,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36065,
  "alt": 7986,
  "roll": 1.4,
  "pitch": 0.7,
  "g": 0.819,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36066,
  "alt": 7987,
  "roll": 15.8,
  "pitch": 2.1,
  "g": 1.247,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36067,
  "alt": 7988,
  "roll": 16.9,
  "pitch": 1.8,
  "g": 1.002,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36068,
  "alt": 7972,
  "roll": 15.5,
  "pitch": 0.4,
  "g": 0.634,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Is that it I mean, shall we pull it down",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36069,
  "alt": 7958,
  "roll": 15.8,
  "pitch": 0.0,
  "g": 0.863,
  "voices": [
   {
    "who": "CAM 2",
    "text": "Yes, put it in it, and pull it down",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36070,
  "alt": 7935,
  "roll": 19.0,
  "pitch": -0.7,
  "g": 0.874,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36071,
  "alt": 7914,
  "roll": 21.4,
  "pitch": -0.7,
  "g": 0.991,
  "voices": [
   {
    "who": "CAM 1",
    "text": "engine",
    "kind": "english",
    "note": "U/I; U/I"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36072,
  "alt": 7889,
  "roll": 19.3,
  "pitch": -0.4,
  "g": 1.064,
  "voices": [
   {
    "who": "CAM",
    "text": "Saeed!",
    "kind": "arabic",
    "note": "U/I; Arabic Name. See picture"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36073,
  "alt": 7863,
  "roll": 19.3,
  "pitch": -0.7,
  "g": 0.922,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36074,
  "alt": 7841,
  "roll": 20.4,
  "pitch": -0.7,
  "g": 1.105,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36075,
  "alt": 7812,
  "roll": 22.9,
  "pitch": -0.7,
  "g": 1.098,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36076,
  "alt": 7813,
  "roll": 23.2,
  "pitch": 1.1,
  "g": 1.794,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Cut off the oxygen!",
    "kind": "mixed",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36077,
  "alt": 7813,
  "roll": 23.2,
  "pitch": 2.1,
  "g": 1.288,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36078,
  "alt": 7811,
  "roll": 23.6,
  "pitch": 1.1,
  "g": 0.957,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Cut off the oxygen! Cut off the oxygen! Cut off the! oxygen",
    "kind": "mixed",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36079,
  "alt": 7808,
  "roll": 24.3,
  "pitch": 1.1,
  "g": 1.027,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36080,
  "alt": 7803,
  "roll": 24.3,
  "pitch": 1.1,
  "g": 1.066,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36081,
  "alt": 7800,
  "roll": 24.6,
  "pitch": 1.1,
  "g": 1.044,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36082,
  "alt": 7793,
  "roll": 24.6,
  "pitch": 1.1,
  "g": 1.034,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36083,
  "alt": 7785,
  "roll": 25.0,
  "pitch": 0.7,
  "g": 1.027,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud metallic click"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36084,
  "alt": 7775,
  "roll": 25.3,
  "pitch": 0.7,
  "g": 1.016,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36085,
  "alt": 7764,
  "roll": 25.3,
  "pitch": 0.4,
  "g": 1.014,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36086,
  "alt": 7752,
  "roll": 25.7,
  "pitch": 0.7,
  "g": 1.153,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36087,
  "alt": 7750,
  "roll": 16.2,
  "pitch": 1.4,
  "g": 0.977,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36088,
  "alt": 7746,
  "roll": -4.9,
  "pitch": 1.4,
  "g": 0.952,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36089,
  "alt": 7737,
  "roll": 1.8,
  "pitch": 1.1,
  "g": 0.947,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36090,
  "alt": 7736,
  "roll": 2.8,
  "pitch": 1.4,
  "g": 1.046,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36091,
  "alt": 7729,
  "roll": 2.5,
  "pitch": 1.4,
  "g": 0.895,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36092,
  "alt": 7725,
  "roll": 2.8,
  "pitch": 0.7,
  "g": 0.927,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36093,
  "alt": 7717,
  "roll": 2.8,
  "pitch": 1.1,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36094,
  "alt": 7712,
  "roll": 2.8,
  "pitch": 1.1,
  "g": 1.011,
  "voices": [
   {
    "who": "CAM ?",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36095,
  "alt": 7711,
  "roll": 4.9,
  "pitch": 1.1,
  "g": 1.121,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36096,
  "alt": 7710,
  "roll": 9.1,
  "pitch": 1.4,
  "g": 1.062,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36097,
  "alt": 7714,
  "roll": 9.1,
  "pitch": 1.4,
  "g": 1.076,
  "voices": [
   {
    "who": "CAM 2",
    "text": "",
    "kind": "unmarked",
    "note": "U/I; Unintelligible Arabic phrase"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36098,
  "alt": 7715,
  "roll": 7.7,
  "pitch": 1.8,
  "g": 1.078,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36099,
  "alt": 7721,
  "roll": 7.0,
  "pitch": 1.8,
  "g": 0.986,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of 2 metallic snaps"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36100,
  "alt": 7725,
  "roll": -1.8,
  "pitch": 1.8,
  "g": 1.078,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36101,
  "alt": 7739,
  "roll": -2.8,
  "pitch": 2.5,
  "g": 1.277,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Up, down. Up, down",
    "kind": "arabic",
    "note": ""
   },
   {
    "who": "CAM 2",
    "text": "What",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36102,
  "alt": 7801,
  "roll": -1.4,
  "pitch": 3.5,
  "g": 1.561,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Up, down",
    "kind": "arabic",
    "note": ""
   },
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "english",
    "note": "In the background"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36103,
  "alt": 7908,
  "roll": 0.0,
  "pitch": 14.4,
  "g": 3.983,
  "voices": [],
  "beat": "Plus 3.98 g, then minus 1.08 g one second later.",
  "beatRung": "measured",
  "beatNote": "The pitch attitude moves eleven degrees in a second. A 757 is certified to 2.5 g and its ultimate load is 3.75."
 },
 {
  "t": 36104,
  "alt": 7964,
  "roll": 1.4,
  "pitch": 8.1,
  "g": -1.079,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of the first of two loud crashes"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36105,
  "alt": 8001,
  "roll": 4.6,
  "pitch": 1.1,
  "g": -0.033,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of the second of two loud crashes"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36106,
  "alt": 8036,
  "roll": 8.8,
  "pitch": 5.6,
  "g": 1.204,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36107,
  "alt": 8063,
  "roll": 8.4,
  "pitch": 4.6,
  "g": 0.86,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36108,
  "alt": 8098,
  "roll": 8.1,
  "pitch": 4.2,
  "g": 0.945,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36109,
  "alt": 8122,
  "roll": 7.0,
  "pitch": 3.5,
  "g": 0.744,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of two snaps"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36110,
  "alt": 8153,
  "roll": 6.7,
  "pitch": 4.2,
  "g": 1.096,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36111,
  "alt": 8185,
  "roll": 7.0,
  "pitch": 4.6,
  "g": 1.124,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36112,
  "alt": 8217,
  "roll": 7.0,
  "pitch": 4.9,
  "g": 1.082,
  "voices": [
   {
    "who": "CAM ?",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud grunt"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36113,
  "alt": 8250,
  "roll": 7.4,
  "pitch": 4.9,
  "g": 1.085,
  "voices": [
   {
    "who": "CAM\"?",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud grunt"
   },
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "english",
    "note": "A loud shout by a male from a distance"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36114,
  "alt": 8295,
  "roll": 6.3,
  "pitch": 4.9,
  "g": 1.085,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36115,
  "alt": 8395,
  "roll": 7.0,
  "pitch": 8.4,
  "g": 2.154,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Ah!",
    "kind": "english",
    "note": "A loud shout by a native English speaking male"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36116,
  "alt": 8549,
  "roll": 8.8,
  "pitch": 20.0,
  "g": 3.768,
  "voices": [],
  "beat": "The hardest pull of the flight.",
  "beatRung": "measured",
  "beatNote": "Pitch reaches 22.9 degrees. The peak vertical acceleration anywhere in the recording is 4.148 g."
 },
 {
  "t": 36117,
  "alt": 8715,
  "roll": 11.6,
  "pitch": 22.9,
  "g": 1.302,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36118,
  "alt": 8819,
  "roll": 17.9,
  "pitch": 10.9,
  "g": -0.827,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "A loud crash that lasted for 2.16 seconds"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36119,
  "alt": 8946,
  "roll": 32.3,
  "pitch": 13.7,
  "g": 1.126,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Shut them off!",
    "kind": "unmarked",
    "note": "U/I"
   }
  ],
  "beat": "Everything stops.",
  "beatRung": "measured",
  "beatNote": "For twenty seconds the controls are still, roll parks at 32 to 33 degrees and does not move, and the aircraft coasts to its highest point."
 },
 {
  "t": 36120,
  "alt": 9056,
  "roll": 33.4,
  "pitch": 13.0,
  "g": 0.663,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36121,
  "alt": 9165,
  "roll": 32.7,
  "pitch": 12.3,
  "g": 0.993,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36122,
  "alt": 9264,
  "roll": 32.7,
  "pitch": 11.6,
  "g": 0.84,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36123,
  "alt": 9356,
  "roll": 32.7,
  "pitch": 10.9,
  "g": 0.897,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Shut them off!",
    "kind": "english",
    "note": ""
   }
  ],
  "beat": "Shut them off.",
  "beatRung": "published",
  "beatNote": "Said in English, inside an otherwise Arabic exchange."
 },
 {
  "t": 36124,
  "alt": 9441,
  "roll": 32.7,
  "pitch": 9.8,
  "g": 0.879,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36125,
  "alt": 9520,
  "roll": 32.7,
  "pitch": 9.5,
  "g": 0.881,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36126,
  "alt": 9590,
  "roll": 33.0,
  "pitch": 8.8,
  "g": 0.886,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "the start of numerous metallic clicks"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36127,
  "alt": 9654,
  "roll": 33.0,
  "pitch": 8.1,
  "g": 0.876,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36128,
  "alt": 9710,
  "roll": 33.0,
  "pitch": 7.4,
  "g": 0.87,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36129,
  "alt": 9759,
  "roll": 33.0,
  "pitch": 6.3,
  "g": 0.876,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36130,
  "alt": 9800,
  "roll": 33.0,
  "pitch": 5.6,
  "g": 0.881,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36131,
  "alt": 9834,
  "roll": 33.4,
  "pitch": 5.3,
  "g": 0.876,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36132,
  "alt": 9859,
  "roll": 33.0,
  "pitch": 4.2,
  "g": 0.883,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The end of the clicks"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36133,
  "alt": 9882,
  "roll": 33.0,
  "pitch": 3.5,
  "g": 0.888,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36134,
  "alt": 9896,
  "roll": 33.0,
  "pitch": 3.2,
  "g": 0.892,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Go!",
    "kind": "english",
    "note": ""
   },
   {
    "who": "CAM 1",
    "text": "Go!",
    "kind": "english",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36135,
  "alt": 9902,
  "roll": 33.0,
  "pitch": 2.5,
  "g": 0.895,
  "voices": [
   {
    "who": "CAM ?",
    "text": "MOVE!",
    "kind": "english-shout",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36136,
  "alt": 9899,
  "roll": 32.7,
  "pitch": 1.8,
  "g": 0.902,
  "voices": [
   {
    "who": "CAM ?",
    "text": "MOVE!",
    "kind": "english-shout",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36137,
  "alt": 9890,
  "roll": 32.7,
  "pitch": 1.1,
  "g": 0.904,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Turn it up!",
    "kind": "english",
    "note": "A very loud shout, by a native. English speaking male"
   }
  ],
  "beat": "Both thrust levers start closing.",
  "beatRung": "measured",
  "beatNote": "EPR falls from 1.18 to 0.79 over the next forty seconds, left and right together, mean difference 0.007. In the same second a passenger shouts Turn it up."
 },
 {
  "t": 36138,
  "alt": 9877,
  "roll": 32.3,
  "pitch": 0.4,
  "g": 0.904,
  "voices": [
   {
    "who": "CAM 1",
    "text": "Down, down",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36139,
  "alt": 9855,
  "roll": 32.0,
  "pitch": -0.4,
  "g": 0.906,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36140,
  "alt": 9827,
  "roll": 32.0,
  "pitch": -0.7,
  "g": 0.904,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of 5 loud clicks"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36141,
  "alt": 9790,
  "roll": 19.3,
  "pitch": -1.4,
  "g": 0.897,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36142,
  "alt": 9752,
  "roll": 14.1,
  "pitch": -1.8,
  "g": 0.991,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36143,
  "alt": 9719,
  "roll": -1.1,
  "pitch": -1.1,
  "g": 1.121,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Pull it down! Pull it down! DOWN!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36144,
  "alt": 9680,
  "roll": -19.3,
  "pitch": -1.4,
  "g": 0.947,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36145,
  "alt": 9632,
  "roll": -22.9,
  "pitch": -2.1,
  "g": 0.915,
  "voices": [
   {
    "who": "CAM ?",
    "text": "Down. Push, push, push, push. push",
    "kind": "english",
    "note": "U/I"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36146,
  "alt": 9588,
  "roll": -27.1,
  "pitch": -2.5,
  "g": 0.986,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36147,
  "alt": 9526,
  "roll": -45.4,
  "pitch": -2.5,
  "g": 1.112,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36148,
  "alt": 9466,
  "roll": -48.9,
  "pitch": -3.5,
  "g": 0.979,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36149,
  "alt": 9409,
  "roll": -15.5,
  "pitch": -2.8,
  "g": 1.254,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36150,
  "alt": 9348,
  "roll": 13.4,
  "pitch": -3.2,
  "g": 1.128,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36151,
  "alt": 9282,
  "roll": 28.8,
  "pitch": -3.9,
  "g": 0.959,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36152,
  "alt": 9213,
  "roll": 33.4,
  "pitch": -4.6,
  "g": 0.959,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of 4 alert tones"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36153,
  "alt": 9134,
  "roll": 33.0,
  "pitch": -5.6,
  "g": 0.84,
  "voices": [
   {
    "who": "CAM 2",
    "text": "Hey! Hey! Give it to me. Give it to me",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36154,
  "alt": 9052,
  "roll": 32.3,
  "pitch": -6.0,
  "g": 0.796,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36155,
  "alt": 8963,
  "roll": 11.2,
  "pitch": -6.0,
  "g": 1.158,
  "voices": [
   {
    "who": "CAM 2",
    "text": "Give it to me. Give it to me. Give it to me",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36156,
  "alt": 8871,
  "roll": 2.8,
  "pitch": -7.0,
  "g": 0.808,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36157,
  "alt": 8770,
  "roll": 3.9,
  "pitch": -7.4,
  "g": 0.805,
  "voices": [
   {
    "who": "CAM 2",
    "text": "Give it to me. Give it to me. Give it to me",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36158,
  "alt": 8667,
  "roll": 5.3,
  "pitch": -8.1,
  "g": 0.787,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36159,
  "alt": 8557,
  "roll": 5.6,
  "pitch": -8.4,
  "g": 0.853,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36160,
  "alt": 8446,
  "roll": 6.0,
  "pitch": -8.4,
  "g": 0.886,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36161,
  "alt": 8332,
  "roll": 6.0,
  "pitch": -8.8,
  "g": 0.888,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36162,
  "alt": 8212,
  "roll": 6.3,
  "pitch": -9.1,
  "g": 0.897,
  "voices": [
   {
    "who": "",
    "text": "C AM",
    "kind": "unmarked-shout",
    "note": "The sound of a grunt"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36163,
  "alt": 8092,
  "roll": 6.3,
  "pitch": -9.1,
  "g": 0.904,
  "voices": [
   {
    "who": "CAM.",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud air noise starts"
   }
  ],
  "beat": "A loud air noise begins.",
  "beatRung": "published",
  "beatNote": "The transcript records it starting here, stopping at 10:02:52 and restarting 1.2 seconds later. A cockpit door and a hull breach are both candidates; the tape would settle it and has never been released."
 },
 {
  "t": 36164,
  "alt": 7970,
  "roll": 6.3,
  "pitch": -9.5,
  "g": 0.913,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36165,
  "alt": 7843,
  "roll": 6.3,
  "pitch": -9.5,
  "g": 0.913,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36166,
  "alt": 7715,
  "roll": 6.0,
  "pitch": -9.8,
  "g": 0.918,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36167,
  "alt": 7585,
  "roll": 6.3,
  "pitch": -9.8,
  "g": 0.936,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36168,
  "alt": 7454,
  "roll": 7.0,
  "pitch": -9.8,
  "g": 0.94,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36169,
  "alt": 7318,
  "roll": 7.7,
  "pitch": -9.8,
  "g": 0.97,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36170,
  "alt": 7185,
  "roll": 8.1,
  "pitch": -9.8,
  "g": 0.979,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36171,
  "alt": 7050,
  "roll": 8.4,
  "pitch": -9.8,
  "g": 0.968,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36172,
  "alt": 6914,
  "roll": 9.1,
  "pitch": -10.2,
  "g": 0.899,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud air noise stops"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36173,
  "alt": 6767,
  "roll": 17.2,
  "pitch": -10.5,
  "g": 0.771,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud air noise starts"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36174,
  "alt": 6615,
  "roll": 18.3,
  "pitch": -10.9,
  "g": 0.922,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36175,
  "alt": 6459,
  "roll": 17.9,
  "pitch": -11.2,
  "g": 0.883,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36176,
  "alt": 6301,
  "roll": 17.9,
  "pitch": -12.0,
  "g": 0.918,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36177,
  "alt": 6135,
  "roll": 17.6,
  "pitch": -11.6,
  "g": 1.05,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36178,
  "alt": 5984,
  "roll": 19.3,
  "pitch": -11.6,
  "g": 1.021,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a grunt"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36179,
  "alt": 5813,
  "roll": 48.9,
  "pitch": -10.9,
  "g": 1.687,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36180,
  "alt": 5618,
  "roll": 77.7,
  "pitch": -13.0,
  "g": 0.872,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36181,
  "alt": 5402,
  "roll": 80.5,
  "pitch": -15.1,
  "g": 0.686,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36182,
  "alt": 5173,
  "roll": 79.1,
  "pitch": -17.2,
  "g": 0.938,
  "voices": [
   {
    "who": "CAM",
    "text": "3 Allah is the Greatest!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36183,
  "alt": 4886,
  "roll": 105.5,
  "pitch": -20.7,
  "g": 1.366,
  "voices": [
   {
    "who": "CAM 3",
    "text": "Allah is the Greatest!!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": "The roll passes ninety degrees.",
  "beatRung": "measured",
  "beatNote": "Past ninety the wing stops holding the aircraft up and starts pulling it down. The sink rate doubles in the six seconds that follow."
 },
 {
  "t": 36184,
  "alt": 4552,
  "roll": 145.9,
  "pitch": -26.0,
  "g": 1.254,
  "voices": [
   {
    "who": "CAM 3",
    "text": "Allah is the Greatest!",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36185,
  "alt": 4157,
  "roll": 156.4,
  "pitch": -28.8,
  "g": 0.494,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of 4 alert tones"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36186,
  "alt": 3750,
  "roll": 158.9,
  "pitch": -30.2,
  "g": 0.57,
  "voices": [
   {
    "who": "CAM 3",
    "text": "Allah is the Greatest!",
    "kind": "arabic",
    "note": ""
   },
   {
    "who": "CAM 3",
    "text": "! Allah is the Greatest",
    "kind": "arabic",
    "note": ""
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36187,
  "alt": 3294,
  "roll": 161.4,
  "pitch": -34.5,
  "g": 0.803,
  "voices": [
   {
    "who": "CAM ?",
    "text": "NO!!!",
    "kind": "unmarked-shout",
    "note": "The sound of a struggle, and a native English speaking man shouting loudly"
   }
  ],
  "beat": "Inverted. 161.4 degrees.",
  "beatRung": "measured",
  "beatNote": "The maximum roll angle in the recording. This is the channel behind the word inverted."
 },
 {
  "t": 36188,
  "alt": 2764,
  "roll": 153.6,
  "pitch": -38.0,
  "g": 0.968,
  "voices": [],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 },
 {
  "t": 36189,
  "alt": 2189,
  "roll": 142.0,
  "pitch": -41.1,
  "g": 1.188,
  "voices": [
   {
    "who": "HOT 2",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a microphone that continued until the end of the recording"
   },
   {
    "who": "CAM 3",
    "text": "Allah is the Greatest! Allah is the Greatest!",
    "kind": "arabic",
    "note": "A whisper"
   },
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "The sound of a loud air noise stops, and screams"
   },
   {
    "who": "CAM 3",
    "text": "Allah is the Greatest! Allah is the Greatest!",
    "kind": "arabic",
    "note": "A whisper"
   }
  ],
  "beat": "Last recorded second.",
  "beatRung": "measured",
  "beatNote": "Pitch 41.1 degrees nose-down, 2,189 ft pressure altitude, sinking 575 feet per second. The terrain is about 2,370 ft above sea level, so this is ground level."
 },
 {
  "t": 36190,
  "alt": null,
  "roll": null,
  "pitch": null,
  "g": null,
  "voices": [
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "Silence"
   },
   {
    "who": "CAM",
    "text": "",
    "kind": "unmarked",
    "note": "End of recording"
   }
  ],
  "beat": null,
  "beatRung": null,
  "beatNote": null
 }
];
