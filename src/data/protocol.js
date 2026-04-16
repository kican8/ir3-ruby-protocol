/**
 * IR3 Ruby Protocol — 12-Week Programme
 *
 * Four phases, each with weekly session schedules that rotate through
 * body sites in a balanced way.
 */

/* ---------------------------------------------------------------
 * Helper — build a week of day entries
 * --------------------------------------------------------------- */

const REST = { isSession: false, isRest: true, bodySite: null, distance: 0, notes: 'Rest day' };

function session(bodySite, distance = 6, notes = '') {
  return { isSession: true, isRest: false, bodySite, distance, notes };
}

/* ---------------------------------------------------------------
 * Phase definitions
 * --------------------------------------------------------------- */

const phases = [
  {
    id: 1,
    name: 'Foundation',
    weeks: [1, 2, 3],
    description: 'Conservative dosing to build tolerance. 8-minute base sessions, 4 per week.',
    baseMinutes: 8,
    sessionsPerWeek: 4,
  },
  {
    id: 2,
    name: 'Loading',
    weeks: [4, 5, 6, 7],
    description: 'Full therapeutic doses. 12-minute base sessions, 5 per week.',
    baseMinutes: 12,
    sessionsPerWeek: 5,
  },
  {
    id: 3,
    name: 'Consolidation',
    weeks: [8, 9, 10],
    description: 'Variable intensity with mandatory deload in week 9.',
    baseMinutes: 12,
    sessionsPerWeek: 5,
  },
  {
    id: 4,
    name: 'Integration',
    weeks: [11, 12],
    description: 'Transitioning to sustainable maintenance. 10-minute sessions, 4 per week.',
    baseMinutes: 10,
    sessionsPerWeek: 4,
  },
];

/* ---------------------------------------------------------------
 * Weekly schedules (Mon=0 … Sun=6)
 *
 * Phase 1 (wks 1-3):  4 sessions — Mon / Tue / Thu / Fri
 * Phase 2 (wks 4-7):  5 sessions — Mon / Tue / Wed / Thu / Fri
 * Phase 3 (wks 8,10): 5 sessions — Mon / Tue / Wed / Thu / Fri
 *          (wk 9):    3 sessions — Mon / Wed / Fri (deload)
 * Phase 4 (wks 11-12): 4 sessions — Mon / Tue / Thu / Fri
 * --------------------------------------------------------------- */

const weekSchedules = {
  // ── Phase 1: Foundation ──────────────────────────────────────
  1: [
    session('skin-face', 8, 'Intro session — gentle face exposure'),
    session('transcranial-crown', 6, 'First transcranial session — start conservatively'),
    REST,
    session('gut', 6, 'Abdominal exposure'),
    session('muscle-back', 6, 'Posterior chain'),
    REST,
    REST,
  ],
  2: [
    session('thyroid', 8, 'Neck / thyroid focus'),
    session('muscle-quads', 6, 'Lower body intro'),
    REST,
    session('transcranial-crown', 6, 'Transcranial — building tolerance'),
    session('skin-face', 8, 'Skin maintenance'),
    REST,
    REST,
  ],
  3: [
    session('gonadal', 8, 'Gonadal — conservative dose'),
    session('gut', 6, 'Abdominal follow-up'),
    REST,
    session('thymus', 6, 'Immune / thymus exposure'),
    session('muscle-back', 6, 'Back recovery'),
    REST,
    REST,
  ],

  // ── Phase 2: Loading ─────────────────────────────────────────
  4: [
    session('transcranial-crown', 6, 'Increased transcranial dose'),
    session('gut', 6, 'Deeper abdominal exposure'),
    session('muscle-quads', 6, 'Quad loading'),
    session('thyroid', 6, 'Thyroid support'),
    session('skin-face', 6, 'Skin loading dose'),
    REST,
    REST,
  ],
  5: [
    session('liver', 6, 'Upper abdomen / liver'),
    session('muscle-hamstrings', 6, 'Posterior legs'),
    session('transcranial-forehead', 6, 'Forehead transcranial'),
    session('gonadal', 6, 'Hormonal support'),
    session('muscle-back', 6, 'Full back exposure'),
    REST,
    REST,
  ],
  6: [
    session('transcranial-crown', 6, 'Crown session — full dose'),
    session('gut', 6, 'Gut health maintenance'),
    session('joint-knees', 4, 'Joint support — closer distance'),
    session('thymus', 6, 'Immune loading'),
    session('skin-chest', 6, 'Chest skin exposure'),
    REST,
    REST,
  ],
  7: [
    session('muscle-shoulders', 6, 'Shoulder recovery'),
    session('liver', 6, 'Liver / detox support'),
    session('transcranial-forehead', 6, 'Forehead PBM'),
    session('kidneys-adrenals', 6, 'Low back / adrenal'),
    session('muscle-calves', 6, 'Calf exposure'),
    REST,
    REST,
  ],

  // ── Phase 3: Consolidation ───────────────────────────────────
  8: [
    session('transcranial-crown', 6, 'Peak transcranial dose'),
    session('gut', 6, 'Gut consolidation'),
    session('muscle-quads', 6, 'Quad consolidation'),
    session('thyroid', 6, 'Thyroid maintenance'),
    session('gonadal', 6, 'Hormonal consolidation'),
    REST,
    REST,
  ],
  // Week 9: DELOAD — 3 sessions, shorter duration
  9: [
    session('skin-face', 8, 'Deload — gentle skin session'),
    REST,
    session('transcranial-crown', 8, 'Deload — reduced transcranial'),
    REST,
    session('gut', 8, 'Deload — light abdominal'),
    REST,
    REST,
  ],
  10: [
    session('transcranial-forehead', 6, 'Return to full dose'),
    session('muscle-back', 6, 'Back — full intensity'),
    session('liver', 6, 'Liver support'),
    session('joint-hands', 4, 'Hand joint care'),
    session('hair-scalp', 6, 'Scalp stimulation'),
    REST,
    REST,
  ],

  // ── Phase 4: Integration ─────────────────────────────────────
  11: [
    session('transcranial-crown', 6, 'Maintenance transcranial'),
    session('gut', 6, 'Maintenance gut'),
    REST,
    session('thyroid', 6, 'Thyroid — sustainable dose'),
    session('skin-face', 6, 'Skin maintenance'),
    REST,
    REST,
  ],
  12: [
    session('muscle-back', 6, 'Final back session'),
    session('gonadal', 6, 'Hormonal maintenance'),
    REST,
    session('transcranial-crown', 6, 'Closing transcranial'),
    session('eyes', 8, 'Gentle eye / circadian session'),
    REST,
    REST,
  ],
};

/* ---------------------------------------------------------------
 * Assembled protocol export
 * --------------------------------------------------------------- */

const protocol = {
  phases,
  weekSchedules,
};

export default protocol;

/* ---------------------------------------------------------------
 * INTENTION_TO_SITES — maps each user intention to the body sites
 * that receive scheduling priority for that goal.
 * --------------------------------------------------------------- */

export const INTENTION_TO_SITES = {
  'cognitive-performance': ['transcranial-crown', 'transcranial-forehead'],
  'mood-emotional-balance': ['transcranial-crown', 'transcranial-forehead'],
  'sleep-quality': ['transcranial-crown', 'eyes'],
  'metabolic-health': ['gut', 'liver'],
  'hormonal-optimization': ['gonadal', 'thyroid', 'kidneys-adrenals'],
  'gut-digestive-health': ['gut', 'liver'],
  'recovery-athletic': ['muscle-quads', 'muscle-hamstrings', 'muscle-back', 'joint-knees'],
  'skin-anti-aging': ['skin-face', 'skin-chest'],
  'hair-scalp-health': ['hair-scalp'],
  'chronic-pain-inflammation': ['joint-knees', 'joint-hands', 'muscle-back'],
  'immune-function': ['thymus', 'thyroid'],
  'longevity-mitochondrial': ['thymus', 'gut', 'transcranial-crown'],
  'nervous-system-reset': ['transcranial-crown', 'transcranial-forehead'],
  'energy-fatigue': ['kidneys-adrenals', 'thyroid', 'transcranial-crown'],
};
