/**
 * IR3 Ruby Protocol — Dose Targets by Body Site
 *
 * min / max values are in J/cm² (joules per square centimetre).
 * frequency is the recommended sessions-per-week range.
 */

const doseTargets = {
  'skin-face': { min: 3, max: 10, label: 'Skin / Face', frequency: '3–5×/week' },
  'skin-chest': { min: 3, max: 10, label: 'Skin / Chest', frequency: '3–5×/week' },
  'muscle-quads': { min: 5, max: 20, label: 'Quads', frequency: '3–5×/week' },
  'muscle-hamstrings': { min: 5, max: 20, label: 'Hamstrings', frequency: '3–5×/week' },
  'muscle-calves': { min: 5, max: 20, label: 'Calves', frequency: '3–5×/week' },
  'muscle-back': { min: 5, max: 20, label: 'Back', frequency: '3–5×/week' },
  'muscle-shoulders': { min: 5, max: 20, label: 'Shoulders', frequency: '3–5×/week' },
  'muscle-arms': { min: 5, max: 20, label: 'Arms', frequency: '3–5×/week' },
  'joint-knees': { min: 10, max: 60, label: 'Knees', frequency: '3–5×/week' },
  'joint-hands': { min: 10, max: 60, label: 'Hands', frequency: '3–5×/week' },
  'joint-feet': { min: 10, max: 60, label: 'Feet', frequency: '3–5×/week' },
  'transcranial-crown': { min: 20, max: 100, label: 'Crown / Skull (transcranial)', frequency: '3–5×/week', transcranial: true },
  'transcranial-forehead': { min: 20, max: 100, label: 'Forehead (transcranial)', frequency: '3–5×/week', transcranial: true },
  'eyes': { min: 3, max: 10, label: 'Eyes (closed-lid)', frequency: '2–3×/week' },
  'thyroid': { min: 5, max: 15, label: 'Thyroid', frequency: '2–3×/week' },
  'thymus': { min: 5, max: 15, label: 'Thymus / Chest', frequency: '2–3×/week' },
  'gut': { min: 10, max: 30, label: 'Gut / Lower Abdomen', frequency: '3–5×/week' },
  'liver': { min: 10, max: 30, label: 'Liver / Upper Abdomen', frequency: '3–5×/week' },
  'kidneys-adrenals': { min: 5, max: 15, label: 'Low Back (Kidneys/Adrenals)', frequency: '2–3×/week' },
  'gonadal': { min: 4, max: 10, label: 'Gonadal Region', frequency: '2–3×/week' },
  'hair-scalp': { min: 3, max: 5, label: 'Hair / Scalp', frequency: '3–5×/week' },
};

export default doseTargets;

/* ---------------------------------------------------------------
 * GOALS_BY_SITE — maps each body-site key to an array of goals
 * that the site is commonly associated with.
 * --------------------------------------------------------------- */

export const GOALS_BY_SITE = {
  'transcranial-crown': [
    'Cognitive performance',
    'Mood support',
    'Cerebral blood flow',
    'Neuroinflammation reduction',
    'Memory enhancement',
  ],
  'transcranial-forehead': [
    'Cognitive performance',
    'Mood support',
    'Cerebral blood flow',
    'Neuroinflammation reduction',
    'Memory enhancement',
  ],
  'skin-face': [
    'Collagen production',
    'Anti-aging',
    'Wound healing',
    'Skin tone',
    'Acne reduction',
  ],
  'skin-chest': [
    'Collagen production',
    'Anti-aging',
    'Wound healing',
    'Skin tone',
    'Acne reduction',
  ],
  'muscle-quads': [
    'Recovery',
    'Performance',
    'Soreness reduction',
    'Tissue repair',
  ],
  'muscle-hamstrings': [
    'Recovery',
    'Performance',
    'Soreness reduction',
    'Tissue repair',
  ],
  'muscle-calves': [
    'Recovery',
    'Performance',
    'Soreness reduction',
    'Tissue repair',
  ],
  'muscle-back': [
    'Recovery',
    'Performance',
    'Soreness reduction',
    'Tissue repair',
  ],
  'muscle-shoulders': [
    'Recovery',
    'Performance',
    'Soreness reduction',
    'Tissue repair',
  ],
  'muscle-arms': [
    'Recovery',
    'Performance',
    'Soreness reduction',
    'Tissue repair',
  ],
  'joint-knees': [
    'Pain relief',
    'Inflammation reduction',
    'Cartilage support',
    'Mobility',
  ],
  'joint-hands': [
    'Pain relief',
    'Inflammation reduction',
    'Cartilage support',
    'Mobility',
  ],
  'joint-feet': [
    'Pain relief',
    'Inflammation reduction',
    'Cartilage support',
    'Mobility',
  ],
  'thyroid': [
    'Thyroid support',
    'Hormonal balance',
    'Metabolism',
  ],
  'thymus': [
    'Immune support',
    'Thymus stimulation',
  ],
  'gut': [
    'Gut health',
    'Microbiome support',
    'Inflammation reduction',
  ],
  'liver': [
    'Bile flow',
    'Detoxification',
    'Inflammation reduction',
  ],
  'kidneys-adrenals': [
    'Adrenal support',
    'Stress resilience',
    'Energy',
  ],
  'gonadal': [
    'Testosterone support',
    'Hormonal optimization',
    'Fertility',
  ],
  'hair-scalp': [
    'Hair density',
    'Regrowth stimulation',
    'Scalp circulation',
  ],
  'eyes': [
    'Eye health',
    'Circadian entrainment',
  ],
};

/* ---------------------------------------------------------------
 * BODY_SITE_OPTIONS — dropdown-friendly array grouped by category
 * --------------------------------------------------------------- */

export const BODY_SITE_OPTIONS = [
  // Head
  { value: 'transcranial-crown', label: 'Crown / Skull (transcranial)', category: 'Head' },
  { value: 'transcranial-forehead', label: 'Forehead (transcranial)', category: 'Head' },
  { value: 'skin-face', label: 'Skin / Face', category: 'Head' },
  { value: 'eyes', label: 'Eyes (closed-lid)', category: 'Head' },
  { value: 'hair-scalp', label: 'Hair / Scalp', category: 'Head' },

  // Torso
  { value: 'skin-chest', label: 'Skin / Chest', category: 'Torso' },
  { value: 'thyroid', label: 'Thyroid', category: 'Torso' },
  { value: 'thymus', label: 'Thymus / Chest', category: 'Torso' },
  { value: 'gut', label: 'Gut / Lower Abdomen', category: 'Torso' },
  { value: 'liver', label: 'Liver / Upper Abdomen', category: 'Torso' },
  { value: 'kidneys-adrenals', label: 'Low Back (Kidneys/Adrenals)', category: 'Torso' },
  { value: 'gonadal', label: 'Gonadal Region', category: 'Torso' },
  { value: 'muscle-back', label: 'Back', category: 'Torso' },

  // Limbs
  { value: 'muscle-quads', label: 'Quads', category: 'Limbs' },
  { value: 'muscle-hamstrings', label: 'Hamstrings', category: 'Limbs' },
  { value: 'muscle-calves', label: 'Calves', category: 'Limbs' },
  { value: 'muscle-shoulders', label: 'Shoulders', category: 'Limbs' },
  { value: 'muscle-arms', label: 'Arms', category: 'Limbs' },
  { value: 'joint-knees', label: 'Knees', category: 'Limbs' },
  { value: 'joint-hands', label: 'Hands', category: 'Limbs' },
  { value: 'joint-feet', label: 'Feet', category: 'Limbs' },
];
