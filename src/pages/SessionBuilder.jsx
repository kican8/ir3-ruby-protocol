import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, AlertTriangle, BookOpen, Zap } from 'lucide-react'
import doseTargets, { GOALS_BY_SITE, BODY_SITE_OPTIONS } from '../data/doseTargets'
import { calculateSession } from '../utils/doseCalculator'
import bibliography from '../data/bibliography'

const STEPS = ['Device', 'Body Site', 'Goal', 'Distance', 'Ready']

export default function SessionBuilder({ devices, userProfile, onStartSession, onBack }) {
  const [step, setStep] = useState(0)
  const [deviceId, setDeviceId] = useState(null)
  const [bodySite, setBodySite] = useState(null)
  const [goal, setGoal] = useState(null)
  const [distance, setDistance] = useState(12)
  const [showResearch, setShowResearch] = useState(false)

  const selectedDevice = devices.find(d => d.id === deviceId)
  const siteData = bodySite ? doseTargets[bodySite] : null
  const goals = bodySite ? (GOALS_BY_SITE[bodySite] || []) : []

  // Calculate session params
  const sessionCalc = useMemo(() => {
    if (!selectedDevice || !bodySite || !siteData) return null
    const targetDose = (siteData.min + siteData.max) / 2 // midpoint of range
    return calculateSession(selectedDevice, bodySite, targetDose, distance)
  }, [selectedDevice, bodySite, siteData, distance])

  // Relevant research
  const relevantPapers = useMemo(() => {
    if (!bodySite) return []
    const siteTerms = bodySite.toLowerCase().split('-')
    return bibliography.filter(p =>
      p.topics.some(t => siteTerms.some(s => t.includes(s))) ||
      (userProfile?.intentions || []).some(i => (p.intentionsBacked || []).includes(i))
    ).slice(0, 3)
  }, [bodySite, userProfile])

  const handleStart = () => {
    if (!sessionCalc || !selectedDevice) return
    onStartSession({
      deviceId: selectedDevice.id,
      device: selectedDevice,
      bodySite,
      bodySiteLabel: siteData?.label || bodySite,
      goal,
      distance,
      sessionLengthSeconds: sessionCalc.sessionLengthSeconds,
      targetDose: siteData ? (siteData.min + siteData.max) / 2 : 0,
      targetDoseRange: siteData ? { min: siteData.min, max: siteData.max } : { min: 0, max: 0 },
      estimatedDose: sessionCalc.estimatedDose,
      corticalDose: sessionCalc.corticalDose,
      warnings: sessionCalc.warnings,
    })
  }

  const groupedSites = useMemo(() => {
    const groups = {}
    BODY_SITE_OPTIONS.forEach(s => {
      if (!groups[s.category]) groups[s.category] = []
      groups[s.category].push(s)
    })
    return groups
  }, [])

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a1033' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pb-2">
        <button onClick={step > 0 ? () => setStep(s => s - 1) : onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1" style={{ color: '#f4b942' }}>Session Builder</h1>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-5 pb-4 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <span className="text-xs whitespace-nowrap px-2 py-1 rounded-full"
              style={{
                background: i === step ? 'rgba(232, 100, 61, 0.2)' : i < step ? 'rgba(244, 185, 66, 0.15)' : 'transparent',
                color: i === step ? '#e8643d' : i < step ? '#f4b942' : '#9a8cb5',
                fontWeight: i === step ? 600 : 400,
              }}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight size={12} color="#9a8cb5" />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Device */}
          {step === 0 && (
            <motion.div key="device" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#c4c4d4' }}>Pick a device</h2>
              {devices.length === 0 ? (
                <p className="text-sm" style={{ color: '#9a8cb5' }}>No devices yet. Add one from the Devices tab.</p>
              ) : (
                <div className="space-y-3">
                  {devices.map(d => (
                    <motion.button key={d.id} whileTap={{ scale: 0.98 }}
                      onClick={() => { setDeviceId(d.id); setStep(1) }}
                      className="w-full rounded-2xl p-4 text-left transition-all"
                      style={{
                        background: deviceId === d.id ? 'rgba(232, 100, 61, 0.15)' : 'rgba(45, 27, 78, 0.7)',
                        border: deviceId === d.id ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                      }}>
                      <div className="font-semibold" style={{ color: '#c4c4d4' }}>{d.nickname}</div>
                      <div className="text-xs mt-1" style={{ color: '#9a8cb5' }}>
                        {d.statedIrradiance} mW/cm² · {d.deviceType}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 1: Body Site */}
          {step === 1 && (
            <motion.div key="site" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#c4c4d4' }}>Target body site</h2>
              {Object.entries(groupedSites).map(([cat, sites]) => (
                <div key={cat} className="mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9a8cb5' }}>{cat}</h3>
                  <div className="flex flex-wrap gap-2">
                    {sites.map(s => (
                      <motion.button key={s.value} whileTap={{ scale: 0.95 }}
                        onClick={() => { setBodySite(s.value); setGoal(null); setStep(2) }}
                        className="px-3 py-2 rounded-xl text-sm transition-all"
                        style={{
                          background: bodySite === s.value ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
                          border: bodySite === s.value ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                          color: bodySite === s.value ? '#e8643d' : '#c4c4d4',
                        }}>{s.label}</motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <motion.div key="goal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-lg font-semibold mb-1" style={{ color: '#c4c4d4' }}>What's your goal?</h2>
              <p className="text-xs mb-4" style={{ color: '#9a8cb5' }}>For {siteData?.label || bodySite}</p>
              <div className="space-y-2">
                {goals.map(g => (
                  <motion.button key={g} whileTap={{ scale: 0.98 }}
                    onClick={() => { setGoal(g); setStep(3) }}
                    className="w-full rounded-xl p-4 text-left transition-all"
                    style={{
                      background: goal === g ? 'rgba(232, 100, 61, 0.15)' : 'rgba(45, 27, 78, 0.7)',
                      border: goal === g ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                    }}>
                    <span style={{ color: '#c4c4d4' }}>{g}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Distance */}
          {step === 3 && (
            <motion.div key="distance" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#c4c4d4' }}>Treatment distance</h2>
              <div className="flex gap-4 justify-center mb-6">
                {[6, 12, 18].map(d => (
                  <motion.button key={d} whileTap={{ scale: 0.95 }}
                    onClick={() => setDistance(d)}
                    className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all"
                    style={{
                      background: distance === d ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
                      border: distance === d ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                      color: distance === d ? '#e8643d' : '#c4c4d4',
                    }}>
                    <span className="text-2xl font-bold">{d}"</span>
                    {d === 12 && <span className="text-[10px] mt-0.5" style={{ color: '#9a8cb5' }}>Default</span>}
                  </motion.button>
                ))}
              </div>
              {distance < 12 && (
                <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(232, 100, 61, 0.15)' }}>
                  <AlertTriangle size={16} color="#e8643d" className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs" style={{ color: '#e8643d' }}>Close distance increases intensity. Monitor for heat and comfort.</p>
                </div>
              )}
              <button onClick={() => setStep(4)}
                className="w-full mt-6 py-4 rounded-2xl font-semibold" style={{ background: '#e8643d', color: '#fff' }}>
                Calculate Session
              </button>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 4 && sessionCalc && (
            <motion.div key="results" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-lg font-semibold mb-1" style={{ color: '#c4c4d4' }}>Your session is ready</h2>
              <p className="text-xs mb-6" style={{ color: '#9a8cb5' }}>
                {siteData?.label} · {goal} · {distance}" distance
              </p>

              {/* Main time display */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold tracking-tight" style={{ color: '#f4b942' }}>
                  {formatTime(sessionCalc.sessionLengthSeconds)}
                </div>
                <p className="text-sm mt-1" style={{ color: '#9a8cb5' }}>Session length</p>
              </div>

              {/* Dose info card */}
              <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.15)' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm" style={{ color: '#9a8cb5' }}>Estimated dose</span>
                  <span className="text-lg font-bold" style={{ color: '#e8643d' }}>{sessionCalc.estimatedDose} J/cm²</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm" style={{ color: '#9a8cb5' }}>Target range</span>
                  <span className="text-sm font-medium" style={{ color: '#c4c4d4' }}>{siteData?.min}–{siteData?.max} J/cm²</span>
                </div>

                {/* Dose bar visualization */}
                <div className="relative h-3 rounded-full mb-1" style={{ background: '#2d1b4e' }}>
                  {/* Target range */}
                  <div className="absolute h-full rounded-full"
                    style={{
                      left: `${(siteData.min / siteData.max) * 80}%`,
                      right: '10%',
                      background: 'rgba(244, 185, 66, 0.3)',
                    }} />
                  {/* Current dose marker */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                    style={{
                      left: `${Math.min((sessionCalc.estimatedDose / siteData.max) * 90, 95)}%`,
                      background: sessionCalc.estimatedDose >= siteData.min && sessionCalc.estimatedDose <= siteData.max ? '#f4b942' : '#e8643d',
                      boxShadow: '0 0 6px rgba(244, 185, 66, 0.5)',
                    }} />
                </div>
                <div className="flex justify-between text-[10px]" style={{ color: '#9a8cb5' }}>
                  <span>0</span><span>{siteData?.max} J/cm²</span>
                </div>

                {sessionCalc.isTranscranial && sessionCalc.corticalDose !== null && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(196, 196, 212, 0.1)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: '#9a8cb5' }}>Est. cortical dose (2.5% penetration)</span>
                      <span className="text-sm font-medium" style={{ color: '#c4c4d4' }}>{sessionCalc.corticalDose} J/cm²</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(196, 196, 212, 0.1)' }}>
                  <div className="flex justify-between text-xs" style={{ color: '#9a8cb5' }}>
                    <span>Irradiance at {distance}"</span>
                    <span>{sessionCalc.irradiance} mW/cm²</span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {sessionCalc.warnings.length > 0 && (
                <div className="space-y-2 mb-4">
                  {sessionCalc.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(232, 100, 61, 0.15)' }}>
                      <AlertTriangle size={14} color="#e8643d" className="mt-0.5 flex-shrink-0" />
                      <p className="text-xs" style={{ color: '#e8643d' }}>{w}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Research link */}
              {relevantPapers.length > 0 && (
                <button onClick={() => setShowResearch(true)}
                  className="flex items-center gap-2 text-xs mb-6" style={{ color: '#9a8cb5' }}>
                  <BookOpen size={14} /> Why this dose? ({relevantPapers.length} papers)
                </button>
              )}

              {/* Action buttons */}
              <button onClick={handleStart}
                className="w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 mb-3"
                style={{ background: '#e8643d', color: '#fff' }}>
                <Zap size={20} /> Start Session
              </button>
              <button onClick={() => setStep(0)}
                className="w-full py-3 rounded-xl text-sm" style={{ color: '#9a8cb5' }}>
                Adjust parameters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Research modal */}
      <AnimatePresence>
        {showResearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowResearch(false)}>
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              className="w-full max-w-md max-h-[70vh] overflow-y-auto rounded-t-3xl p-6"
              style={{ background: '#1a1033' }} onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#f4b942' }}>Why This Dose</h3>
              <div className="space-y-3">
                {relevantPapers.map(p => (
                  <div key={p.id} className="rounded-xl p-4" style={{ background: 'rgba(45, 27, 78, 0.7)' }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#c4c4d4' }}>{p.title}</p>
                    <p className="text-xs mb-2" style={{ color: '#9a8cb5' }}>{p.authors} ({p.year}) · {p.journal}</p>
                    <p className="text-xs" style={{ color: '#c4c4d4' }}>{p.whyItMatters}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowResearch(false)}
                className="w-full mt-4 py-3 rounded-xl text-sm" style={{ color: '#9a8cb5' }}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
