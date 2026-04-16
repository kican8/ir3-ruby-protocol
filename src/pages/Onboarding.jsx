import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Heart, Moon, Zap, Flame, Dumbbell, Sparkles, Scissors,
  Battery, Activity, Shield, Apple, Wind, BatteryCharging,
  ChevronLeft, ChevronRight, Check, Info, AlertTriangle
} from 'lucide-react'
import INTENTIONS from '../data/intentions'

const ICON_MAP = { Brain, Heart, Moon, Zap, Flame, Dumbbell, Sparkles, Scissors, Battery, Activity, Shield, Apple, Wind, BatteryCharging }

const SAFETY_FLAGS = [
  'Pregnancy',
  'Active cancer treatment',
  'Photosensitizing medications',
  'Seizure disorder',
  'Recent eye surgery',
  'Active skin lesions in treatment area',
]

const FITZPATRICK = [
  { type: 1, label: 'Type I', desc: 'Very fair, always burns' },
  { type: 2, label: 'Type II', desc: 'Fair, burns easily' },
  { type: 3, label: 'Type III', desc: 'Medium, sometimes burns' },
  { type: 4, label: 'Type IV', desc: 'Olive, rarely burns' },
  { type: 5, label: 'Type V', desc: 'Brown, very rarely burns' },
  { type: 6, label: 'Type VI', desc: 'Dark brown/black, never burns' },
]

const TOTAL_STEPS = 7

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)

  // Form state
  const [intentions, setIntentions] = useState([])
  const [name, setName] = useState('')
  const [schedule, setSchedule] = useState(5)
  const [solar, setSolar] = useState(null)
  const [age, setAge] = useState('')
  const [sex, setSex] = useState(null)
  const [fitzpatrick, setFitzpatrick] = useState(null)
  const [safetyFlags, setSafetyFlags] = useState([])
  const [showSafetyModal, setShowSafetyModal] = useState(false)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(null)
  const [maxWarning, setMaxWarning] = useState(false)

  const next = () => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)) }
  const back = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }

  const toggleIntention = (id) => {
    setIntentions(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 4) { setMaxWarning(true); setTimeout(() => setMaxWarning(false), 2000); return prev }
      return [...prev, id]
    })
  }

  const toggleSafety = (flag) => {
    setSafetyFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag])
  }

  const handleComplete = () => {
    onComplete({
      name: name.trim() || 'Friend',
      intentions,
      scheduleDaysPerWeek: schedule,
      solarExposure: solar || 'sometimes',
      age: age ? Number(age) : null,
      sex,
      fitzpatrickType: fitzpatrick,
      safetyFlags,
      onboardingComplete: true,
      protocolStartDate: new Date().toISOString().split('T')[0],
      currentProtocolWeek: 1,
    }, disclaimerAccepted)
  }

  const canContinue = () => {
    switch (step) {
      case 0: return intentions.length >= 1
      case 1: return true
      case 2: return true
      case 3: return solar !== null
      case 4: return true
      case 5: return true
      case 6: return disclaimerAccepted
      default: return false
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a1033' }}>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2 px-4">
        {step > 0 && (
          <button onClick={back} className="absolute left-4 p-2 text-[#9a8cb5] hover:text-[#c4c4d4]">
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: i === step ? '#e8643d' : i < step ? '#f4b942' : '#2d1b4e' }} />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {step === 0 && <IntentionsStep intentions={intentions} toggleIntention={toggleIntention} maxWarning={maxWarning} showTooltip={showTooltip} setShowTooltip={setShowTooltip} />}
        {step === 1 && <NameStep name={name} setName={setName} />}
        {step === 2 && <ScheduleStep schedule={schedule} setSchedule={setSchedule} />}
        {step === 3 && <SolarStep solar={solar} setSolar={setSolar} />}
        {step === 4 && <BiometricsStep age={age} setAge={setAge} sex={sex} setSex={setSex} fitzpatrick={fitzpatrick} setFitzpatrick={setFitzpatrick} />}
        {step === 5 && <SafetyStep safetyFlags={safetyFlags} toggleSafety={toggleSafety} showSafetyModal={showSafetyModal} setShowSafetyModal={setShowSafetyModal} />}
        {step === 6 && <WelcomeStep disclaimerAccepted={disclaimerAccepted} setDisclaimerAccepted={setDisclaimerAccepted} name={name} />}
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8" style={{ background: 'linear-gradient(transparent, #1a1033 30%)' }}>
        {step === 4 && (
          <button onClick={next} className="w-full mb-3 py-3 rounded-xl text-sm font-medium" style={{ color: '#9a8cb5' }}>
            Skip
          </button>
        )}
        <button
          onClick={step === TOTAL_STEPS - 1 ? handleComplete : next}
          disabled={!canContinue()}
          className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            background: canContinue() ? '#e8643d' : '#2d1b4e',
            color: canContinue() ? '#fff' : '#9a8cb5',
            opacity: canContinue() ? 1 : 0.6,
          }}
        >
          {step === TOTAL_STEPS - 1 ? "Let's Add Your Device" : 'Continue'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

/* ── Step Components ── */

function IntentionsStep({ intentions, toggleIntention, maxWarning, showTooltip, setShowTooltip }) {
  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#f4b942' }}>What brings you to IR³ Ruby?</h1>
      <p className="text-sm mb-6" style={{ color: '#9a8cb5' }}>Pick what matters most to you (up to 4). Your protocol adapts to your priorities.</p>

      <div className="grid grid-cols-2 gap-3">
        {INTENTIONS.map((item) => {
          const Icon = ICON_MAP[item.icon] || Zap
          const selected = intentions.includes(item.id)
          return (
            <div
              key={item.id}
              onClick={() => toggleIntention(item.id)}
              className="relative rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer active:scale-[0.97]"
              style={{
                background: selected ? 'rgba(232, 100, 61, 0.15)' : 'rgba(45, 27, 78, 0.7)',
                border: selected ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
              }}
            >
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#e8643d' }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
              <Icon size={24} style={{ color: selected ? '#e8643d' : '#9a8cb5' }} className="mb-2" />
              <div className="text-sm font-semibold mb-1" style={{ color: '#c4c4d4' }}>{item.title}</div>
              <div className="text-xs leading-tight" style={{ color: '#9a8cb5' }}>{item.description}</div>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setShowTooltip(showTooltip === item.id ? null : item.id) }}
                className="absolute bottom-2 right-2 p-1 opacity-50 hover:opacity-100 cursor-pointer"
              >
                <Info size={14} color="#9a8cb5" />
              </span>
              {showTooltip === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-10 right-1 left-1 p-3 rounded-xl text-xs z-10"
                  style={{ background: '#2d1b4e', border: '1px solid rgba(196, 196, 212, 0.2)', color: '#c4c4d4' }}
                >
                  {item.evidenceSummary}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {maxWarning && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="text-center mt-4 text-sm font-medium" style={{ color: '#e8643d' }}
        >
          Maximum 4 — focus keeps your protocol effective.
        </motion.div>
      )}
    </div>
  )
}

function NameStep({ name, setName }) {
  return (
    <div className="pt-16 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#f4b942' }}>What should we call you?</h1>
      <p className="text-sm mb-8 text-center" style={{ color: '#9a8cb5' }}>A name or nickname — whatever feels right.</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full max-w-xs text-center text-xl py-4 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e8643d]"
        style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.15)', color: '#c4c4d4' }}
        autoFocus
      />
    </div>
  )
}

function ScheduleStep({ schedule, setSchedule }) {
  return (
    <div className="pt-16">
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#f4b942' }}>How many days per week can you commit?</h1>
      <p className="text-sm mb-8 text-center" style={{ color: '#9a8cb5' }}>We'll build your protocol around this.</p>
      <div className="flex gap-4 justify-center">
        {[4, 5, 6].map(d => (
          <motion.button
            key={d}
            onClick={() => setSchedule(d)}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-2xl font-bold transition-all"
            style={{
              background: schedule === d ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
              border: schedule === d ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
              color: schedule === d ? '#e8643d' : '#c4c4d4',
            }}
          >
            {d}
            <span className="text-xs font-normal mt-1" style={{ color: '#9a8cb5' }}>days</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function SolarStep({ solar, setSolar }) {
  const options = [
    { value: 'yes', label: 'Yes', desc: 'I get morning sun most days' },
    { value: 'sometimes', label: 'Sometimes', desc: 'A few days a week' },
    { value: 'no', label: 'No', desc: 'Rarely or never' },
  ]
  return (
    <div className="pt-16">
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#f4b942' }}>Do you get direct morning sunlight?</h1>
      <p className="text-sm mb-8 text-center" style={{ color: '#9a8cb5' }}>Natural light is your primary signal. Red light therapy supplements it. Your answer adjusts protocol intensity.</p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        {options.map(o => (
          <motion.button
            key={o.value}
            onClick={() => setSolar(o.value)}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl p-4 text-left transition-all"
            style={{
              background: solar === o.value ? 'rgba(232, 100, 61, 0.15)' : 'rgba(45, 27, 78, 0.7)',
              border: solar === o.value ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
            }}
          >
            <div className="font-semibold" style={{ color: solar === o.value ? '#e8643d' : '#c4c4d4' }}>{o.label}</div>
            <div className="text-xs mt-1" style={{ color: '#9a8cb5' }}>{o.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function BiometricsStep({ age, setAge, sex, setSex, fitzpatrick, setFitzpatrick }) {
  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#f4b942' }}>Optional: Fine-tune your protocol</h1>
      <p className="text-sm mb-6 text-center" style={{ color: '#9a8cb5' }}>This helps personalize dose recommendations. Skip if you prefer.</p>

      <div className="max-w-xs mx-auto space-y-6">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#9a8cb5' }}>Age</label>
          <input
            type="number" value={age} onChange={e => setAge(e.target.value)}
            placeholder="Optional" min="16" max="100"
            className="w-full py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e8643d]"
            style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.15)', color: '#c4c4d4' }}
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9a8cb5' }}>Sex</label>
          <div className="flex gap-2">
            {['Male', 'Female', 'Other'].map(s => (
              <button key={s} onClick={() => setSex(s)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: sex === s ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
                  border: sex === s ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                  color: sex === s ? '#e8643d' : '#c4c4d4',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9a8cb5' }}>Fitzpatrick Skin Type</label>
          <div className="grid grid-cols-3 gap-2">
            {FITZPATRICK.map(f => (
              <button key={f.type} onClick={() => setFitzpatrick(f.type)}
                className="py-2 px-2 rounded-xl text-xs transition-all"
                style={{
                  background: fitzpatrick === f.type ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
                  border: fitzpatrick === f.type ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                  color: fitzpatrick === f.type ? '#e8643d' : '#c4c4d4',
                }}>
                <div className="font-semibold">{f.label}</div>
                <div style={{ color: '#9a8cb5', fontSize: '10px' }}>{f.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SafetyStep({ safetyFlags, toggleSafety, showSafetyModal, setShowSafetyModal }) {
  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#f4b942' }}>Safety Check</h1>
      <p className="text-sm mb-6 text-center" style={{ color: '#9a8cb5' }}>Check any that apply to you. This helps us keep your sessions safe.</p>

      <div className="max-w-xs mx-auto space-y-3">
        {SAFETY_FLAGS.map(flag => (
          <button key={flag} onClick={() => {
            toggleSafety(flag)
            if (!safetyFlags.includes(flag)) setShowSafetyModal(true)
          }}
            className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all"
            style={{
              background: safetyFlags.includes(flag) ? 'rgba(232, 100, 61, 0.15)' : 'rgba(45, 27, 78, 0.7)',
              border: safetyFlags.includes(flag) ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
            }}>
            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: safetyFlags.includes(flag) ? '#e8643d' : 'transparent', border: safetyFlags.includes(flag) ? 'none' : '2px solid #9a8cb5' }}>
              {safetyFlags.includes(flag) && <Check size={12} color="#fff" />}
            </div>
            <span className="text-sm" style={{ color: '#c4c4d4' }}>{flag}</span>
          </button>
        ))}
      </div>

      {safetyFlags.length === 0 && (
        <p className="text-center text-xs mt-6" style={{ color: '#9a8cb5' }}>None apply? Great — just continue.</p>
      )}

      {/* Safety modal */}
      <AnimatePresence>
        {showSafetyModal && safetyFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowSafetyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="rounded-2xl p-6 max-w-sm"
              style={{ background: '#2d1b4e', border: '1px solid rgba(232, 100, 61, 0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              <AlertTriangle size={32} className="mx-auto mb-3" color="#e8643d" />
              <h3 className="text-lg font-bold text-center mb-3" style={{ color: '#f4b942' }}>Healthcare Provider Recommended</h3>
              <p className="text-sm text-center mb-5" style={{ color: '#c4c4d4' }}>
                We recommend consulting with your healthcare provider before starting a PBM protocol. You can still explore the app, but please get medical clearance before running sessions.
              </p>
              <button onClick={() => setShowSafetyModal(false)}
                className="w-full py-3 rounded-xl font-semibold" style={{ background: '#e8643d', color: '#fff' }}>
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function WelcomeStep({ disclaimerAccepted, setDisclaimerAccepted, name }) {
  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#f4b942' }}>
        Welcome{name ? `, ${name}` : ''}.
      </h1>
      <p className="text-sm mb-6 text-center leading-relaxed" style={{ color: '#c4c4d4' }}>
        Over the next 12 weeks, you'll follow a progressive photobiomodulation protocol calibrated to your device and your goals.
      </p>

      <div className="max-w-sm mx-auto space-y-3 mb-6">
        {[
          { phase: 'Phase 1 — Foundation', desc: 'Weeks 1–3. Gentle start to build tolerance.' },
          { phase: 'Phase 2 — Loading', desc: 'Weeks 4–7. Full therapeutic doses.' },
          { phase: 'Phase 3 — Consolidation', desc: 'Weeks 8–10. Variable intensity with a deload.' },
          { phase: 'Phase 4 — Integration', desc: 'Weeks 11–12. Sustainable maintenance.' },
        ].map(p => (
          <div key={p.phase} className="rounded-xl p-3" style={{ background: 'rgba(45, 27, 78, 0.7)' }}>
            <div className="text-sm font-semibold" style={{ color: '#e8643d' }}>{p.phase}</div>
            <div className="text-xs mt-1" style={{ color: '#9a8cb5' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="max-w-sm mx-auto rounded-xl p-4 mb-4" style={{ background: 'rgba(45, 27, 78, 0.5)', border: '1px solid rgba(196, 196, 212, 0.1)' }}>
        <h3 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#9a8cb5' }}>Important Disclaimer</h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: '#9a8cb5' }}>
          IR³ Ruby is an educational and habit-tracking tool, not a medical device. Information provided is not medical advice.
          Users should consult a licensed healthcare provider before starting any photobiomodulation protocol.
          Dose calculations are estimates based on published research and user-entered device specifications.
          Individual results vary and no outcomes are guaranteed. Eye safety is the user's responsibility.
        </p>
        <button onClick={() => setDisclaimerAccepted(!disclaimerAccepted)}
          className="flex items-center gap-3">
          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: disclaimerAccepted ? '#e8643d' : 'transparent', border: disclaimerAccepted ? 'none' : '2px solid #9a8cb5' }}>
            {disclaimerAccepted && <Check size={12} color="#fff" />}
          </div>
          <span className="text-sm" style={{ color: '#c4c4d4' }}>I understand and accept</span>
        </button>
      </div>
    </div>
  )
}
