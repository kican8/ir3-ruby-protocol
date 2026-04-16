import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, X, Volume2, Eye } from 'lucide-react'
import bibliography from '../data/bibliography'

const SKY_COLORS = [
  { stop: 0, bg: '#1a1033', sun: '#4a2040' },
  { stop: 0.25, bg: '#2d1040', sun: '#e8643d' },
  { stop: 0.5, bg: '#5a2040', sun: '#e87a3d' },
  { stop: 0.75, bg: '#8a4030', sun: '#f4a942' },
  { stop: 1, bg: '#c47030', sun: '#f4b942' },
]

function lerpColor(c1, c2, t) {
  const parse = (c) => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]
  const [r1,g1,b1] = parse(c1), [r2,g2,b2] = parse(c2)
  const r = Math.round(r1 + (r2-r1)*t), g = Math.round(g1 + (g2-g1)*t), b = Math.round(b1 + (b2-b1)*t)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function getSkyColor(pct, key) {
  const p = Math.max(0, Math.min(1, pct))
  for (let i = 0; i < SKY_COLORS.length - 1; i++) {
    if (p >= SKY_COLORS[i].stop && p <= SKY_COLORS[i+1].stop) {
      const t = (p - SKY_COLORS[i].stop) / (SKY_COLORS[i+1].stop - SKY_COLORS[i].stop)
      return lerpColor(SKY_COLORS[i][key], SKY_COLORS[i+1][key], t)
    }
  }
  return SKY_COLORS[SKY_COLORS.length-1][key]
}

export default function ActiveSession({ sessionConfig, onComplete, onCancel }) {
  const { sessionLengthSeconds, targetDose, estimatedDose, bodySiteLabel, goal, device, distance } = sessionConfig

  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const pausedAtRef = useRef(0)

  const remaining = Math.max(0, sessionLengthSeconds - elapsed)
  const progress = sessionLengthSeconds > 0 ? Math.min(elapsed / sessionLengthSeconds, 1) : 0
  const deliveredDose = estimatedDose * progress

  // Timer
  useEffect(() => {
    if (paused || completed) return
    startTimeRef.current = Date.now() - elapsed * 1000

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const newElapsed = Math.floor((now - startTimeRef.current) / 1000)
      setElapsed(newElapsed)

      if (newElapsed >= sessionLengthSeconds) {
        clearInterval(intervalRef.current)
        setCompleted(true)
        playAlarm()
        if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 500])
      }
    }, 250)

    return () => clearInterval(intervalRef.current)
  }, [paused, completed, sessionLengthSeconds])

  const playAlarm = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const playTone = (freq, start, dur) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur)
        osc.start(ctx.currentTime + start)
        osc.stop(ctx.currentTime + start + dur)
      }
      playTone(523, 0, 0.3)
      playTone(659, 0.35, 0.3)
      playTone(784, 0.7, 0.5)
    } catch (e) { /* audio not supported */ }
  }, [])

  const togglePause = () => {
    if (paused) {
      startTimeRef.current = Date.now() - elapsed * 1000
    }
    setPaused(!paused)
  }

  const handleCancel = () => {
    clearInterval(intervalRef.current)
    onCancel({
      ...sessionConfig,
      durationSeconds: elapsed,
      calculatedDose: deliveredDose,
      completed: false,
    })
  }

  const handleLog = () => {
    onComplete({
      ...sessionConfig,
      durationSeconds: completed ? sessionLengthSeconds : elapsed,
      calculatedDose: completed ? estimatedDose : deliveredDose,
      completed: true,
    })
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  // Random research tip
  const tip = useRef(
    bibliography[Math.floor(Math.random() * bibliography.length)]
  ).current

  // Sky/sun positioning
  const skyBg = getSkyColor(progress, 'bg')
  const sunColor = getSkyColor(progress, 'sun')
  // Sun rises from 110% (below horizon) to 30% (high in sky)
  const sunY = 110 - progress * 80

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: skyBg, transition: 'background 1s ease' }}>
      {/* Rising sun scene */}
      <div className="flex-1 relative overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={sunColor} stopOpacity="1" />
              <stop offset="60%" stopColor={sunColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={sunColor} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="horizonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="90%" stopColor={skyBg} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1a1033" />
            </linearGradient>
          </defs>

          {/* Sun glow */}
          <circle cx="200" cy={`${sunY}%`} r="80" fill="url(#sunGrad)" opacity="0.4" />
          {/* Sun body */}
          <motion.circle
            cx="200" cy={`${sunY}%`} r="35"
            fill={sunColor}
            animate={completed ? { scale: [1, 1.1, 1], opacity: [1, 0.9, 1] } : {}}
            transition={completed ? { duration: 2, repeat: Infinity } : {}}
            style={{ transformOrigin: `200px ${sunY}%`, filter: 'blur(1px)' }}
          />

          {/* Rays when near completion */}
          {progress > 0.85 && (
            <g opacity={Math.min((progress - 0.85) / 0.15, 1) * 0.5}>
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * Math.PI / 180
                const x1 = 200 + Math.cos(angle) * 45
                const y1 = (sunY / 100) * 400 + Math.sin(angle) * 45
                const x2 = 200 + Math.cos(angle) * 70
                const y2 = (sunY / 100) * 400 + Math.sin(angle) * 70
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sunColor} strokeWidth="2" opacity="0.6" />
              })}
            </g>
          )}

          {/* Horizon line */}
          <rect x="0" y="260" width="400" height="140" fill="url(#horizonGrad)" />
          <line x1="0" y1="260" x2="400" y2="260" stroke="rgba(196, 196, 212, 0.1)" strokeWidth="1" />

          {/* Ground */}
          <rect x="0" y="260" width="400" height="140" fill="#1a1033" opacity="0.7" />
        </svg>

        {/* Dose readout overlay */}
        <div className="absolute top-6 left-0 right-0 px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(196, 196, 212, 0.6)' }}>{bodySiteLabel}</div>
              <div className="text-xs" style={{ color: 'rgba(196, 196, 212, 0.4)' }}>{goal} · {device?.nickname}</div>
            </div>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(196, 196, 212, 0.6)' }}>
              <Eye size={12} /> {distance}"
            </div>
          </div>
        </div>

        {/* Completed overlay */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#f4b942' }}>Sunrise Complete</div>
                <div className="text-sm" style={{ color: '#c4c4d4' }}>{estimatedDose.toFixed(1)} J/cm² delivered</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom panel */}
      <div className="px-6 pb-8 pt-4" style={{ background: '#1a1033' }}>
        {/* Timer */}
        <div className="text-center mb-4">
          <div className="text-5xl font-bold tracking-tight font-mono" style={{ color: completed ? '#f4b942' : '#c4c4d4' }}>
            {formatTime(remaining)}
          </div>
          <div className="text-sm mt-1" style={{ color: '#9a8cb5' }}>
            {deliveredDose.toFixed(1)} / {estimatedDose.toFixed(1)} J/cm²
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full mt-3" style={{ background: '#2d1b4e' }}>
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #e8643d, #f4b942)`, width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>

        {/* Controls */}
        {!completed ? (
          <div className="flex items-center justify-center gap-6">
            <button onClick={handleCancel}
              className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(45, 27, 78, 0.7)' }}>
              <X size={20} color="#9a8cb5" />
            </button>
            <button onClick={togglePause}
              className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#e8643d' }}>
              {paused ? <Play size={28} color="#fff" /> : <Pause size={28} color="#fff" />}
            </button>
            <div className="w-12 h-12" /> {/* spacer */}
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={handleLog}
              className="w-full py-4 rounded-2xl font-semibold text-lg" style={{ background: '#f4b942', color: '#1a1033' }}>
              Log Session
            </button>
            <button onClick={() => onCancel(null)}
              className="w-full py-3 rounded-xl text-sm" style={{ color: '#9a8cb5' }}>
              Discard
            </button>
          </div>
        )}

        {/* Research tip */}
        {!completed && tip && (
          <div className="mt-4 text-center">
            <p className="text-[11px] leading-relaxed italic" style={{ color: 'rgba(196, 196, 212, 0.4)' }}>
              "{tip.plainLanguageSummary?.slice(0, 120)}..."
              <span className="not-italic"> — {tip.authors?.split(',')[0]} ({tip.year})</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
