/**
 * IR3 Ruby Protocol — Research Bibliography
 *
 * Real papers from the photobiomodulation (PBM) / low-level light therapy
 * literature. Each entry carries plain-language summaries written for a
 * smart layperson audience.
 */

const bibliography = [
  // ───────────────────────────────────────────────
  // 1. Foundational mechanism — cytochrome c oxidase
  // ───────────────────────────────────────────────
  {
    id: "karu-2005",
    authors: "Karu, T. I.",
    year: 2005,
    title:
      "Multiple roles of cytochrome c oxidase in mammalian cells under action of red and IR-A radiation",
    journal: "IUBMB Life",
    volume: "57(10)",
    pages: "607–615",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/16283066/",
    plainLanguageSummary:
      "This paper identified the enzyme cytochrome c oxidase — the final step of your cell's energy-production chain — as the primary target that absorbs red and near-infrared light. When the light hits this enzyme, it triggers a cascade of beneficial chemical signals inside the cell.",
    whyItMatters:
      "This is the foundational 'why it works' paper for all of photobiomodulation. It explains the basic biology: red/NIR light is absorbed by an enzyme in your mitochondria, which then boosts cellular energy (ATP) and reduces oxidative stress.",
    topics: ["mechanism", "foundational"],
    intentionsBacked: ["energy-fatigue", "longevity-mitochondrial"],
    evidenceLevel: "mechanistic",
  },

  {
    id: "hamblin-2017",
    authors: "Hamblin, M. R.",
    year: 2017,
    title: "Mechanisms and applications of the anti-inflammatory effects of photobiomodulation",
    journal: "AIMS Biophysics",
    volume: "4(3)",
    pages: "337–361",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/28748217/",
    plainLanguageSummary:
      "A comprehensive review of how PBM reduces inflammation throughout the body. The light decreases pro-inflammatory cytokines, increases anti-inflammatory cytokines, and modulates reactive oxygen species — calming overactive immune responses without suppressing necessary ones.",
    whyItMatters:
      "Chronic inflammation is behind many modern health complaints — joint pain, brain fog, slow healing. This review pulls together decades of evidence showing PBM can meaningfully reduce inflammation through well-understood biological pathways.",
    topics: ["mechanism", "inflammation", "foundational"],
    intentionsBacked: [
      "chronic-pain-inflammation",
      "immune-function",
      "recovery-athletic",
    ],
    evidenceLevel: "systematic-review",
  },

  // ───────────────────────────────────────────────
  // 2. Biphasic dose response
  // ───────────────────────────────────────────────
  {
    id: "huang-2009",
    authors: "Huang, Y. Y., Chen, A. C., Carroll, J. D., Hamblin, M. R.",
    year: 2009,
    title: "Biphasic dose response in low level light therapy",
    journal: "Dose-Response",
    volume: "7(4)",
    pages: "358–383",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/20011653/",
    plainLanguageSummary:
      "This paper explains why 'more light' is not always better. There is a sweet spot: too little light does nothing, the right dose stimulates healing, and too much can actually inhibit the benefits. The relationship follows the Arndt-Schulz curve.",
    whyItMatters:
      "Understanding the biphasic dose response is critical for anyone using light therapy. It's why protocol design — wavelength, power density, time — matters so much. Random overuse can be counterproductive.",
    topics: ["dose-response", "foundational"],
    intentionsBacked: [
      "energy-fatigue",
      "longevity-mitochondrial",
      "recovery-athletic",
    ],
    evidenceLevel: "mechanistic",
  },

  // ───────────────────────────────────────────────
  // 3. Transcranial PBM — brain applications
  // ───────────────────────────────────────────────
  {
    id: "naeser-2014",
    authors: "Naeser, M. A., Zafonte, R., Krengel, M. H., et al.",
    year: 2014,
    title:
      "Significant improvements in cognitive performance post-transcranial, red/near-infrared light-emitting diode treatments in chronic, mild traumatic brain injury: open-protocol study",
    journal: "Journal of Neurotrauma",
    volume: "31(11)",
    pages: "1008–1017",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24568233/",
    plainLanguageSummary:
      "Patients with chronic mild traumatic brain injury received LED light therapy applied to the forehead and scalp. After a series of treatments, they showed significant improvements in attention, inhibition, and executive function — improvements their families also noticed.",
    whyItMatters:
      "This is one of the landmark papers showing that near-infrared light can reach the brain through the skull and produce meaningful cognitive improvements — even years after the original injury.",
    topics: ["transcranial", "cognitive", "foundational"],
    intentionsBacked: ["cognitive-performance", "mood-emotional-balance"],
    evidenceLevel: "clinical-trial",
  },

  {
    id: "salehpour-2018",
    authors:
      "Salehpour, F., Mahmoudi, J., Kamari, F., Sadigh-Eteghad, S., Rasta, S. H., Hamblin, M. R.",
    year: 2018,
    title:
      "Brain photobiomodulation therapy: a narrative review",
    journal: "Molecular Neurobiology",
    volume: "55(8)",
    pages: "6601–6636",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/29327206/",
    plainLanguageSummary:
      "A thorough review of transcranial PBM covering animal and human studies. It maps out how NIR light improves cerebral blood flow, reduces neuroinflammation, and stimulates neurogenesis. Applications range from TBI and stroke to Alzheimer's and depression.",
    whyItMatters:
      "This paper is a one-stop reference for the brain benefits of PBM. It summarizes dozens of studies showing that light therapy can support brain health through multiple complementary mechanisms.",
    topics: ["transcranial", "cognitive", "review"],
    intentionsBacked: [
      "cognitive-performance",
      "mood-emotional-balance",
      "nervous-system-reset",
    ],
    evidenceLevel: "systematic-review",
  },

  // ───────────────────────────────────────────────
  // 4. Cognitive / mood / depression
  // ───────────────────────────────────────────────
  {
    id: "cassano-2016",
    authors:
      "Cassano, P., Petrie, S. R., Hamblin, M. R., Henderson, T. A., Iosifescu, D. V.",
    year: 2016,
    title:
      "Review of transcranial photobiomodulation for major depressive disorder: targeting brain metabolism, inflammation, oxidative stress, and neurogenesis",
    journal: "Neurophotonics",
    volume: "3(3)",
    pages: "031404",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/26989758/",
    plainLanguageSummary:
      "This review examines how shining near-infrared light on the forehead may help with major depression. The proposed mechanisms include boosting brain energy metabolism, reducing neuroinflammation, and promoting the growth of new brain cells in mood-regulating regions.",
    whyItMatters:
      "Depression affects hundreds of millions of people. This paper builds a strong biological case for why transcranial PBM could become a safe, non-drug treatment option — or a complement to existing therapies.",
    topics: ["transcranial", "depression", "mood"],
    intentionsBacked: ["mood-emotional-balance", "cognitive-performance"],
    evidenceLevel: "systematic-review",
  },

  {
    id: "barrett-2013",
    authors: "Barrett, D. W., Gonzalez-Lima, F.",
    year: 2013,
    title:
      "Transcranial infrared laser stimulation produces beneficial cognitive and emotional effects in humans",
    journal: "Neuroscience",
    volume: "230",
    pages: "13–23",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/23200785/",
    plainLanguageSummary:
      "Healthy university students received a single session of transcranial infrared laser to the forehead. Compared to a sham group, they showed improved performance on sustained-attention and working-memory tasks, plus reported more positive emotional states.",
    whyItMatters:
      "This controlled trial showed that even a single session of transcranial light can boost cognitive performance and mood in healthy people — not just those with brain injuries or depression.",
    topics: ["transcranial", "cognitive", "mood"],
    intentionsBacked: [
      "cognitive-performance",
      "mood-emotional-balance",
      "energy-fatigue",
    ],
    evidenceLevel: "rct",
  },

  {
    id: "gonzalez-lima-2014",
    authors: "Gonzalez-Lima, F., Barrett, D. W.",
    year: 2014,
    title:
      "Augmentation of cognitive brain functions with transcranial lasers",
    journal: "Frontiers in Systems Neuroscience",
    volume: "8",
    pages: "36",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24672441/",
    plainLanguageSummary:
      "This paper explains the science behind using transcranial laser light to enhance normal brain function. It reviews how cytochrome c oxidase in neurons responds to NIR light, increasing oxygen consumption and metabolic capacity in prefrontal brain regions.",
    whyItMatters:
      "It shows PBM is not just for treating disease — it can augment cognitive function in healthy brains, supporting the idea of light therapy as a brain-optimization tool.",
    topics: ["transcranial", "cognitive", "mechanism"],
    intentionsBacked: ["cognitive-performance", "energy-fatigue"],
    evidenceLevel: "mechanistic",
  },

  // ───────────────────────────────────────────────
  // 5. Skin / anti-aging
  // ───────────────────────────────────────────────
  {
    id: "wunsch-2014",
    authors: "Wunsch, A., Matuschka, K.",
    year: 2014,
    title:
      "A controlled trial to determine the efficacy of red and near-infrared light treatment in patient satisfaction, reduction of fine lines, wrinkles, skin roughness, and intradermal collagen density increase",
    journal: "Photomedicine and Laser Surgery",
    volume: "32(2)",
    pages: "93–100",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24286286/",
    plainLanguageSummary:
      "Participants received red (611–650 nm) and near-infrared (570–850 nm) LED treatments twice per week. After 30 sessions, they had significantly fewer wrinkles, less roughness, and increased collagen density measured by ultrasound — compared to controls who used only the device without therapeutic wavelengths.",
    whyItMatters:
      "This is one of the most-cited clinical trials proving that red/NIR light genuinely rebuilds collagen and reduces wrinkles. It's hard evidence that light therapy delivers real, measurable skin rejuvenation.",
    topics: ["skin", "anti-aging", "collagen"],
    intentionsBacked: ["skin-anti-aging", "longevity-mitochondrial"],
    evidenceLevel: "rct",
  },

  // ───────────────────────────────────────────────
  // 6. Muscle recovery / athletic performance
  // ───────────────────────────────────────────────
  {
    id: "ferraresi-2012",
    authors: "Ferraresi, C., Hamblin, M. R., Parizotto, N. A.",
    year: 2012,
    title:
      "Low-level laser (light) therapy (LLLT) on muscle tissue: performance, fatigue and repair benefited by the power of light",
    journal: "Photonics & Lasers in Medicine",
    volume: "1(4)",
    pages: "267–286",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/23626925/",
    plainLanguageSummary:
      "A detailed review of how red and NIR light therapy affects muscles. The evidence shows PBM can reduce muscle fatigue during exercise, decrease creatine kinase (a marker of muscle damage) afterward, and speed up repair of injured muscle fibers.",
    whyItMatters:
      "Whether you're an elite athlete or a weekend warrior, this review shows that light therapy before or after exercise can help you perform better, hurt less, and recover faster.",
    topics: ["muscle", "recovery", "athletic"],
    intentionsBacked: ["recovery-athletic", "chronic-pain-inflammation"],
    evidenceLevel: "systematic-review",
  },

  {
    id: "leal-junior-2015",
    authors:
      "Leal-Junior, E. C., Vanin, A. A., Miranda, E. F., de Carvalho, P. T., Dal Corso, S., Bjordal, J. M.",
    year: 2015,
    title:
      "Effect of phototherapy (low-level laser therapy and light-emitting diode therapy) on exercise performance and markers of exercise recovery: a systematic review with meta-analysis",
    journal: "Lasers in Medical Science",
    volume: "30(2)",
    pages: "925–939",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24249354/",
    plainLanguageSummary:
      "This meta-analysis pooled results from many trials and found that PBM applied before exercise significantly increased time to exhaustion, number of repetitions, and speed — while also reducing post-exercise blood lactate and creatine kinase levels.",
    whyItMatters:
      "A meta-analysis is considered among the strongest forms of evidence. This one confirms across multiple studies that light therapy genuinely improves athletic performance and accelerates recovery.",
    topics: ["muscle", "recovery", "athletic", "meta-analysis"],
    intentionsBacked: ["recovery-athletic", "energy-fatigue"],
    evidenceLevel: "systematic-review",
  },

  // ───────────────────────────────────────────────
  // 7. Penetration physics / dosimetry
  // ───────────────────────────────────────────────
  {
    id: "henderson-2015",
    authors: "Henderson, T. A., Morries, L. D.",
    year: 2015,
    title:
      "Near-infrared photonic energy penetration: can infrared phototherapy effectively reach the human brain?",
    journal: "Neuropsychiatric Disease and Treatment",
    volume: "11",
    pages: "2191–2208",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/26346298/",
    plainLanguageSummary:
      "This study measured how much near-infrared light actually passes through the human skull to reach the brain. Using cadaver tissue and live imaging, they showed that NIR light at 810 nm can penetrate roughly 3 cm — enough to reach cortical brain tissue.",
    whyItMatters:
      "Skeptics often ask 'Can light really reach the brain?' This paper provides direct physical measurements proving that yes, meaningful amounts of NIR photons penetrate skull and meninges to reach brain tissue.",
    topics: ["penetration", "physics", "transcranial"],
    intentionsBacked: ["cognitive-performance", "nervous-system-reset"],
    evidenceLevel: "mechanistic",
  },

  // ───────────────────────────────────────────────
  // 8. Thyroid
  // ───────────────────────────────────────────────
  {
    id: "hofling-2013",
    authors:
      "Hofling, D. B., Chavantes, M. C., Juliano, A. G., et al.",
    year: 2013,
    title:
      "Low-level laser in the treatment of patients with hypothyroidism induced by chronic autoimmune thyroiditis: a randomized, placebo-controlled clinical trial",
    journal: "Lasers in Medical Science",
    volume: "28(3)",
    pages: "743–753",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/22718472/",
    plainLanguageSummary:
      "Patients with Hashimoto's thyroiditis (an autoimmune condition causing underactive thyroid) received laser light therapy directly over the thyroid gland. After treatment, many were able to reduce or eliminate their thyroid medication, and thyroid antibody levels dropped significantly.",
    whyItMatters:
      "This RCT suggests that targeted PBM can improve thyroid function in autoimmune thyroiditis — a condition that affects millions. It points to PBM's potential for hormonal and autoimmune applications.",
    topics: ["thyroid", "autoimmune", "hormonal"],
    intentionsBacked: [
      "hormonal-optimization",
      "metabolic-health",
      "immune-function",
    ],
    evidenceLevel: "rct",
  },

  // ───────────────────────────────────────────────
  // 9. Gut / systemic
  // ───────────────────────────────────────────────
  {
    id: "liebert-2019",
    authors: "Liebert, A., Bicknell, B., Johnstone, D. M., et al.",
    year: 2019,
    title:
      "Photobiomics: can light, including photobiomodulation, alter the microbiome?",
    journal: "Photobiomodulation, Photomedicine, and Laser Surgery",
    volume: "37(11)",
    pages: "681–693",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/31596658/",
    plainLanguageSummary:
      "This emerging-research review explores how PBM applied to the abdomen or even to remote body sites might influence the gut microbiome. Preliminary evidence suggests that light therapy can shift the balance of gut bacteria toward healthier compositions.",
    whyItMatters:
      "The gut microbiome affects everything from mood to immunity. If PBM can positively reshape gut flora — even indirectly through systemic effects — it opens up an entirely new dimension of light therapy.",
    topics: ["gut", "microbiome", "systemic"],
    intentionsBacked: [
      "gut-digestive-health",
      "immune-function",
      "metabolic-health",
    ],
    evidenceLevel: "mechanistic",
  },

  // ───────────────────────────────────────────────
  // 10. Sleep / circadian
  // ───────────────────────────────────────────────
  {
    id: "zhao-2012",
    authors: "Zhao, J., Tian, Y., Nie, J., Xu, J., Liu, D.",
    year: 2012,
    title:
      "Red light and the sleep quality and endurance performance of Chinese female basketball players",
    journal: "Journal of Athletic Training",
    volume: "47(6)",
    pages: "673–678",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/23182016/",
    plainLanguageSummary:
      "Female basketball players received 30 minutes of whole-body red light therapy every night for 14 days. Compared to controls, the light group showed significant improvements in sleep quality (measured by the Pittsburgh Sleep Quality Index) and also improved endurance performance.",
    whyItMatters:
      "This study is one of the few RCTs directly linking red light therapy to better sleep. Better sleep drives better recovery, mood, and performance — making this a foundational paper for nighttime PBM protocols.",
    topics: ["sleep", "circadian", "athletic"],
    intentionsBacked: ["sleep-quality", "recovery-athletic", "energy-fatigue"],
    evidenceLevel: "rct",
  },

  // ───────────────────────────────────────────────
  // 11. Hair regrowth
  // ───────────────────────────────────────────────
  {
    id: "lanzafame-2013",
    authors:
      "Lanzafame, R. J., Blanche, R. R., Bodian, A. B., Chiacchierini, R. P., Fernandez-Obregon, A., Kazmirek, E. R.",
    year: 2013,
    title:
      "The growth of human scalp hair mediated by visible red light laser and LED sources in males",
    journal: "Lasers in Surgery and Medicine",
    volume: "45(8)",
    pages: "487–495",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24078483/",
    plainLanguageSummary:
      "Men with androgenetic alopecia (pattern hair loss) used a red light device on their scalp every other day for 16 weeks. The treatment group showed a statistically significant increase in hair density compared to sham — on average about 35% more hair counts.",
    whyItMatters:
      "Hair loss affects self-confidence for many people. This double-blind, sham-controlled trial demonstrates that red light can genuinely stimulate new hair growth, not just slow loss.",
    topics: ["hair", "scalp", "growth"],
    intentionsBacked: ["hair-scalp-health"],
    evidenceLevel: "rct",
  },

  {
    id: "jimenez-2014",
    authors:
      "Jimenez, J. J., Wikramanayake, T. C., Bergfeld, W., et al.",
    year: 2014,
    title:
      "Efficacy and safety of a low-level laser device in the treatment of male and female pattern hair loss: a multicenter, randomized, sham device-controlled, double-blind study",
    journal: "American Journal of Clinical Dermatology",
    volume: "15(2)",
    pages: "115–127",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24474692/",
    plainLanguageSummary:
      "A large, multicenter clinical trial tested a low-level laser comb for hair loss in both men and women. After 26 weeks, the laser group had significantly higher hair counts than the sham group, and the results were consistent across multiple study sites.",
    whyItMatters:
      "This is one of the largest and most rigorous trials supporting laser/LED therapy for hair regrowth. Its multicenter design and inclusion of both sexes strengthens confidence in the results.",
    topics: ["hair", "scalp", "growth"],
    intentionsBacked: ["hair-scalp-health"],
    evidenceLevel: "rct",
  },

  // ───────────────────────────────────────────────
  // 12. Pain / inflammation
  // ───────────────────────────────────────────────
  {
    id: "chow-2009",
    authors: "Chow, R. T., Johnson, M. I., Lopes-Martins, R. A., Bjordal, J. M.",
    year: 2009,
    title:
      "Efficacy of low-level laser therapy in the management of neck pain: a systematic review and meta-analysis of randomised placebo or active-treatment controlled trials",
    journal: "The Lancet",
    volume: "374(9705)",
    pages: "1897–1908",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/19913903/",
    plainLanguageSummary:
      "This Lancet meta-analysis reviewed 16 randomized trials of laser therapy for neck pain. It concluded that LLLT reduces pain immediately after treatment and up to 22 weeks later, with optimal doses identified for chronic neck pain.",
    whyItMatters:
      "Published in one of the world's top medical journals, this meta-analysis provides strong, mainstream-accepted evidence that light therapy works for chronic pain — specifically neck pain, one of the most common complaints.",
    topics: ["pain", "inflammation", "neck"],
    intentionsBacked: ["chronic-pain-inflammation"],
    evidenceLevel: "systematic-review",
  },

  // ───────────────────────────────────────────────
  // 13. Mitochondrial / longevity / aging
  // ───────────────────────────────────────────────
  {
    id: "de-freitas-2016",
    authors: "de Freitas, L. F., Hamblin, M. R.",
    year: 2016,
    title:
      "Proposed mechanisms of photobiomodulation or low-level light therapy",
    journal: "IEEE Journal of Selected Topics in Quantum Electronics",
    volume: "22(3)",
    pages: "7000417",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/28070154/",
    plainLanguageSummary:
      "An in-depth technical review of the molecular mechanisms behind PBM. It covers how light dissociates nitric oxide from cytochrome c oxidase, generates brief bursts of reactive oxygen species that activate protective cell-signaling pathways, and modulates calcium and gene expression.",
    whyItMatters:
      "For anyone who wants to understand the deeper science, this paper maps the complete chain from photon absorption to gene expression changes. It shows PBM activates the same cellular defense pathways associated with longevity and stress resilience.",
    topics: ["mechanism", "mitochondrial", "longevity"],
    intentionsBacked: ["longevity-mitochondrial", "energy-fatigue"],
    evidenceLevel: "mechanistic",
  },

  {
    id: "hamblin-2018",
    authors: "Hamblin, M. R.",
    year: 2018,
    title: "Photobiomodulation for traumatic brain injury and stroke",
    journal: "Journal of Neuroscience Research",
    volume: "96(4)",
    pages: "731–743",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/29131369/",
    plainLanguageSummary:
      "Reviews the evidence for using PBM after brain injuries and stroke. NIR light reduces brain swelling, limits the area of cell death, promotes formation of new neurons and blood vessels, and improves long-term neurological outcomes in both animal models and early human trials.",
    whyItMatters:
      "Brain injuries and stroke are leading causes of disability. This review shows PBM has neuroprotective effects that could meaningfully improve outcomes when used alongside standard medical care.",
    topics: ["transcranial", "neuroprotection", "TBI"],
    intentionsBacked: [
      "cognitive-performance",
      "nervous-system-reset",
      "longevity-mitochondrial",
    ],
    evidenceLevel: "systematic-review",
  },

  // ───────────────────────────────────────────────
  // 14. Immune function
  // ───────────────────────────────────────────────
  {
    id: "ferraresi-2015",
    authors: "Ferraresi, C., Kaippert, B., Avci, P., et al.",
    year: 2015,
    title:
      "Low-level laser (light) therapy increases mitochondrial membrane potential and ATP synthesis in C2C12 myotubes with a peak response at 3–6 h",
    journal: "Photochemistry and Photobiology",
    volume: "91(2)",
    pages: "460–467",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/25443662/",
    plainLanguageSummary:
      "This lab study measured exactly how muscle cells respond to red/NIR light. ATP (cellular energy) production increased significantly, peaking 3–6 hours after treatment. The mitochondrial membrane potential — a key indicator of mitochondrial health — also rose substantially.",
    whyItMatters:
      "It quantifies the energy boost from PBM at the cellular level and reveals the timing: benefits peak hours after treatment, which has practical implications for when to schedule sessions relative to activity.",
    topics: ["mitochondrial", "ATP", "muscle", "mechanism"],
    intentionsBacked: [
      "energy-fatigue",
      "longevity-mitochondrial",
      "recovery-athletic",
    ],
    evidenceLevel: "mechanistic",
  },

  // ───────────────────────────────────────────────
  // 15. Metabolic / body composition
  // ───────────────────────────────────────────────
  {
    id: "avci-2013",
    authors: "Avci, P., Nyame, T. T., Gupta, G. K., Sadasivam, M., Hamblin, M. R.",
    year: 2013,
    title: "Low-level laser therapy for fat layer reduction: a comprehensive review",
    journal: "Lasers in Surgery and Medicine",
    volume: "45(6)",
    pages: "349–357",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/23749426/",
    plainLanguageSummary:
      "Reviews the evidence for using red and NIR light to reduce subcutaneous fat. Multiple trials showed measurable reductions in waist circumference and fat layer thickness. The proposed mechanism involves light creating temporary pores in fat cell membranes, allowing lipids to leak out.",
    whyItMatters:
      "Body composition is a key health marker. This review shows that PBM may complement diet and exercise for fat reduction — though it works best as part of a broader metabolic health strategy, not a standalone solution.",
    topics: ["metabolic", "body-composition", "fat"],
    intentionsBacked: ["metabolic-health", "skin-anti-aging"],
    evidenceLevel: "systematic-review",
  },
];

export default bibliography;
