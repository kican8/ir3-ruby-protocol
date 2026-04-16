import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ExternalLink, BookOpen, AlertTriangle, ChevronDown, Copy, Search, Check } from 'lucide-react'
import bibliography from '../data/bibliography'
import INTENTIONS from '../data/intentions'

const EVIDENCE_LABELS = {
  'rct': { label: 'Strong evidence (RCT)', color: '#f4b942' },
  'systematic-review': { label: 'Strong evidence (Review)', color: '#f4b942' },
  'clinical-trial': { label: 'Clinical trial', color: '#e8643d' },
  'mechanistic': { label: 'Mechanistic rationale', color: '#9a8cb5' },
  'animal-study': { label: 'Emerging evidence', color: '#9a8cb5' },
}

const TOPICS = ['All', 'mechanism', 'foundational', 'transcranial', 'cognitive', 'skin', 'muscle', 'recovery', 'penetration', 'thyroid', 'gut', 'sleep', 'hair', 'pain', 'inflammation', 'longevity', 'mood', 'metabolic']

export default function Research({ userProfile, onBack }) {
  const [section, setSection] = useState(0) // 0=how, 1=intentions, 2=bibliography, 3=caveats
  const [selectedIntention, setSelectedIntention] = useState(null)
  const [filterTopic, setFilterTopic] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllIntentions, setShowAllIntentions] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const userIntentions = userProfile?.intentions || []

  const filteredBiblio = useMemo(() => {
    let list = bibliography
    if (filterTopic !== 'All') {
      list = list.filter(p => p.topics.includes(filterTopic))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.journal.toLowerCase().includes(q)
      )
    }
    return list
  }, [filterTopic, searchQuery])

  const intentionPapers = useMemo(() => {
    if (!selectedIntention) return []
    return bibliography.filter(p => (p.intentionsBacked || []).includes(selectedIntention))
  }, [selectedIntention])

  const copyApa = (paper) => {
    const cite = `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}, ${paper.volume}, ${paper.pages}.`
    navigator.clipboard.writeText(cite).then(() => {
      setCopiedId(paper.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const tabs = [
    { label: 'How PBM Works', id: 0 },
    { label: 'Your Intentions', id: 1 },
    { label: 'Bibliography', id: 2 },
    { label: 'Caveats', id: 3 },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: '#1a1033' }}>
      <div className="flex items-center gap-3 p-5 pb-2">
        <button onClick={onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold" style={{ color: '#f4b942' }}>Research</h1>
      </div>

      {/* Section tabs */}
      <div className="px-5 flex gap-1 overflow-x-auto pb-4">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setSection(tab.id)}
            className="text-xs px-3 py-2 rounded-full whitespace-nowrap transition-all"
            style={{
              background: section === tab.id ? 'rgba(232, 100, 61, 0.2)' : 'transparent',
              color: section === tab.id ? '#e8643d' : '#9a8cb5',
              fontWeight: section === tab.id ? 600 : 400,
            }}>{tab.label}</button>
        ))}
      </div>

      <div className="px-5">
        {/* Section 0: How PBM Works */}
        {section === 0 && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(45, 27, 78, 0.7)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#c4c4d4' }}>How Photobiomodulation Works</h2>

              <p className="text-sm mb-3 leading-relaxed" style={{ color: '#c4c4d4' }}>
                Inside every cell in your body, tiny power plants called <strong style={{ color: '#f4b942' }}>mitochondria</strong> produce the energy currency of life: ATP. The final enzyme in this energy chain is called <strong style={{ color: '#f4b942' }}>cytochrome c oxidase</strong> (CCO). This enzyme has a remarkable property — it absorbs red (600–700nm) and near-infrared (780–1100nm) light.
              </p>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: '#c4c4d4' }}>
                When red or NIR photons hit CCO, they displace a molecule of nitric oxide (NO) that's bound to the enzyme's active site. This unbinding does two things: it immediately boosts ATP production (more cellular energy), and the released NO enters the bloodstream as a vasodilator, improving local circulation. The cell also activates protective signaling pathways — including antioxidant defense and anti-inflammatory responses.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#c4c4d4' }}>
                This is why <strong style={{ color: '#e8643d' }}>dose matters</strong>. Too little light and the enzyme isn't sufficiently stimulated. Too much and the cell becomes stressed — a phenomenon called the <strong style={{ color: '#e8643d' }}>biphasic dose response</strong> (Huang et al., 2009). IR³ Ruby calculates your dose precisely to stay in the therapeutic window.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Intentions */}
        {section === 1 && (
          <div className="space-y-3">
            {INTENTIONS
              .filter(i => showAllIntentions || userIntentions.includes(i.id))
              .map(intention => {
                const papers = bibliography.filter(p => (p.intentionsBacked || []).includes(intention.id))
                const isUserIntention = userIntentions.includes(intention.id)
                return (
                  <div key={intention.id}
                    className="rounded-2xl p-4 transition-all"
                    style={{
                      background: 'rgba(45, 27, 78, 0.7)',
                      opacity: isUserIntention ? 1 : 0.6,
                      border: isUserIntention ? '1px solid rgba(232, 100, 61, 0.2)' : '1px solid rgba(196, 196, 212, 0.08)',
                    }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: '#c4c4d4' }}>{intention.title}</h3>
                        {isUserIntention && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(232, 100, 61, 0.2)', color: '#e8643d' }}>Your goal</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9a8cb5' }}>{intention.evidenceSummary}</p>
                    {papers.length > 0 && (
                      <button onClick={() => setSelectedIntention(selectedIntention === intention.id ? null : intention.id)}
                        className="flex items-center gap-1 text-xs"
                        style={{ color: '#e8643d' }}>
                        <BookOpen size={12} /> View Research ({papers.length} papers)
                        <ChevronDown size={12} className={`transition-transform ${selectedIntention === intention.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}

                    <AnimatePresence>
                      {selectedIntention === intention.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-2 overflow-hidden">
                          {intentionPapers.map(p => (
                            <PaperCard key={p.id} paper={p} onCopy={copyApa} copiedId={copiedId} />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

            {!showAllIntentions && userIntentions.length < INTENTIONS.length && (
              <button onClick={() => setShowAllIntentions(true)}
                className="w-full py-3 text-xs rounded-xl" style={{ color: '#9a8cb5', background: 'rgba(45, 27, 78, 0.3)' }}>
                Show all intentions ({INTENTIONS.length - userIntentions.length} more)
              </button>
            )}
          </div>
        )}

        {/* Section 2: Full Bibliography */}
        {section === 2 && (
          <div>
            {/* Search */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="#9a8cb5" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search papers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.15)', color: '#c4c4d4' }} />
            </div>

            {/* Topic filter */}
            <div className="flex gap-1 overflow-x-auto pb-3 mb-3">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setFilterTopic(t)}
                  className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{
                    background: filterTopic === t ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.5)',
                    color: filterTopic === t ? '#e8643d' : '#9a8cb5',
                  }}>{t === 'All' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>

            <p className="text-xs mb-3" style={{ color: '#9a8cb5' }}>{filteredBiblio.length} papers</p>

            <div className="space-y-3">
              {filteredBiblio.map(p => (
                <PaperCard key={p.id} paper={p} onCopy={copyApa} copiedId={copiedId} showSummary />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Honest Caveats */}
        {section === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(232, 100, 61, 0.15)' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} color="#e8643d" />
                <h2 className="text-lg font-bold" style={{ color: '#f4b942' }}>Honest Caveats</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#c4c4d4' }}>Consumer devices are not calibrated research instruments</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9a8cb5' }}>
                    The irradiance values on your device's spec sheet were likely measured under ideal conditions. Real-world output varies with distance, angle, temperature, LED age, and power supply stability. Our dose calculations are estimates, not laboratory measurements. Treat them as informed approximations.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#c4c4d4' }}>Evidence strength varies by goal</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9a8cb5' }}>
                    Some intention categories (skin rejuvenation, muscle recovery, pain relief) are backed by multiple randomized controlled trials. Others (gut health, hormonal optimization, longevity) have strong mechanistic rationale but fewer direct clinical trials. We mark the evidence level on each intention card and each citation so you can calibrate your expectations honestly.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#c4c4d4' }}>PBM is a supplement, not a standalone fix</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9a8cb5' }}>
                    Photobiomodulation works best in the context of other healthy practices — adequate sleep, real sun exposure, nutrient-dense food, movement, stress management. Red light therapy is powerful scaffolding around a sun-anchored, well-lived life. It's not a replacement for the fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PaperCard({ paper, onCopy, copiedId, showSummary }) {
  const evidence = EVIDENCE_LABELS[paper.evidenceLevel] || EVIDENCE_LABELS['mechanistic']

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(26, 16, 51, 0.8)', border: '1px solid rgba(196, 196, 212, 0.08)' }}>
      <p className="text-sm font-semibold mb-1 leading-tight" style={{ color: '#c4c4d4' }}>{paper.title}</p>
      <p className="text-xs mb-1" style={{ color: '#9a8cb5' }}>
        {paper.authors} ({paper.year}) · <span style={{ fontStyle: 'italic' }}>{paper.journal}</span>
        {paper.volume && `, ${paper.volume}`}{paper.pages && `, ${paper.pages}`}
      </p>
      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mb-2"
        style={{ background: `${evidence.color}22`, color: evidence.color }}>
        {evidence.label}
      </span>

      {showSummary && paper.plainLanguageSummary && (
        <p className="text-xs mt-2 leading-relaxed" style={{ color: '#c4c4d4' }}>{paper.plainLanguageSummary}</p>
      )}
      {paper.whyItMatters && (
        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9a8cb5' }}>{paper.whyItMatters}</p>
      )}

      <div className="flex items-center gap-3 mt-2">
        {paper.pubmedUrl && (
          <a href={paper.pubmedUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px]" style={{ color: '#e8643d' }}>
            <ExternalLink size={10} /> PubMed
          </a>
        )}
        <button onClick={() => onCopy(paper)}
          className="flex items-center gap-1 text-[10px]" style={{ color: '#9a8cb5' }}>
          {copiedId === paper.id ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Cite</>}
        </button>
      </div>
    </div>
  )
}
