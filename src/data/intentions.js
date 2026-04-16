/**
 * IR3 Ruby Protocol - Intentions / Wellness Goals
 * Each intention maps to a photobiomodulation use case backed by published evidence.
 * Icons reference Lucide React icon component names.
 */
const INTENTIONS = [
  {
    id: 'cognitive-performance',
    title: 'Cognitive Performance',
    description: 'Focus, mental clarity, memory, learning capacity',
    icon: 'Brain',
    evidenceSummary:
      'Backed by published transcranial PBM trials including Naeser et al. (2014) and Salehpour et al. (2018).',
  },
  {
    id: 'mood-emotional-balance',
    title: 'Mood & Emotional Balance',
    description: 'Stress resilience, emotional regulation, sense of calm',
    icon: 'Heart',
    evidenceSummary:
      'Transcranial PBM has shown antidepressant effects in Cassano et al. (2016) and Schiffer et al. (2009) clinical studies.',
  },
  {
    id: 'sleep-quality',
    title: 'Sleep Quality',
    description: 'Deeper sleep, easier onset, circadian rhythm support',
    icon: 'Moon',
    evidenceSummary:
      'Red/NIR light influences melatonin production and circadian signaling. Zhao et al. (2012) showed improved sleep in athletes.',
  },
  {
    id: 'pain-relief',
    title: 'Pain Relief',
    description: 'Joint pain, muscle soreness, chronic discomfort',
    icon: 'Zap',
    evidenceSummary:
      'Extensive evidence including Chow et al. (2009) meta-analysis demonstrating analgesic effects of PBM for chronic pain.',
  },
  {
    id: 'inflammation-reduction',
    title: 'Inflammation Reduction',
    description: 'Systemic and localized inflammatory response modulation',
    icon: 'Flame',
    evidenceSummary:
      'Hamblin (2017) reviewed anti-inflammatory mechanisms of PBM including modulation of NF-kB and cytokine pathways.',
  },
  {
    id: 'athletic-recovery',
    title: 'Athletic Recovery',
    description: 'Faster muscle recovery, reduced DOMS, performance support',
    icon: 'Dumbbell',
    evidenceSummary:
      'Ferraresi et al. (2012) and Leal-Junior et al. (2015) demonstrated enhanced recovery and reduced muscle fatigue.',
  },
  {
    id: 'skin-health',
    title: 'Skin Health & Appearance',
    description: 'Collagen production, wound healing, complexion support',
    icon: 'Sparkles',
    evidenceSummary:
      'Wunsch & Matuschka (2014) RCT showed significant improvements in skin complexion and collagen density.',
  },
  {
    id: 'hair-growth',
    title: 'Hair Growth',
    description: 'Stimulate follicles, support thickness and coverage',
    icon: 'Scissors',
    evidenceSummary:
      'Multiple RCTs including Lanzafame et al. (2013) and Kim et al. (2013) showed increased hair density with red/NIR light.',
  },
  {
    id: 'energy-vitality',
    title: 'Energy & Vitality',
    description: 'Cellular energy (ATP), mitochondrial function, daily vitality',
    icon: 'Battery',
    evidenceSummary:
      'PBM enhances mitochondrial cytochrome c oxidase activity and ATP production (Karu, 2008; de Freitas & Hamblin, 2016).',
  },
  {
    id: 'hormonal-support',
    title: 'Hormonal Support',
    description: 'Thyroid function, testosterone, hormonal balance',
    icon: 'Activity',
    evidenceSummary:
      'Hofling et al. (2013) showed PBM improved thyroid function. Ener et al. (2015) demonstrated testosterone support.',
  },
  {
    id: 'immune-support',
    title: 'Immune Support',
    description: 'Immune cell activity, resilience, systemic defense',
    icon: 'Shield',
    evidenceSummary:
      'PBM modulates immune cells including macrophages and lymphocytes. Reviewed in Hamblin (2017) and Brosseau et al. (2005).',
  },
  {
    id: 'gut-health',
    title: 'Gut Health',
    description: 'Digestive comfort, microbiome support, abdominal wellness',
    icon: 'Apple',
    evidenceSummary:
      'Emerging evidence for abdominal PBM in gut motility and inflammation. Liebert et al. (2019) explored microbiome effects.',
  },
  {
    id: 'respiratory-wellness',
    title: 'Respiratory Wellness',
    description: 'Lung function support, airway comfort, breathing ease',
    icon: 'Wind',
    evidenceSummary:
      'PBM applied to the chest has shown benefits in pulmonary inflammation models. de Lima et al. (2014) studied airway effects.',
  },
  {
    id: 'longevity-anti-aging',
    title: 'Longevity & Anti-Aging',
    description: 'Cellular repair, oxidative stress reduction, healthy aging',
    icon: 'BatteryCharging',
    evidenceSummary:
      'PBM reduces oxidative stress markers and supports mitochondrial health, key longevity pathways (Hamblin, 2018; Salehpour et al., 2019).',
  },
]

export default INTENTIONS
