import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

// Convert polar coordinates to cartesian for SVG path commands
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180 // -90 so 0° is top
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

// Build an SVG arc path for a segment (annular sector)
// innerR/outerR: radii, startAngle/endAngle: degrees (0 = top, clockwise)
function arcPath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const gapAngle = 1.5 // degrees of gap between segments
  const adjustedStart = startAngle + gapAngle / 2
  const adjustedEnd = endAngle - gapAngle / 2
  if (adjustedEnd <= adjustedStart) return ''

  const outerStart = polarToCartesian(cx, cy, outerR, adjustedStart)
  const outerEnd = polarToCartesian(cx, cy, outerR, adjustedEnd)
  const innerStart = polarToCartesian(cx, cy, innerR, adjustedStart)
  const innerEnd = polarToCartesian(cx, cy, innerR, adjustedEnd)

  const sweep = adjustedEnd - adjustedStart
  const largeArc = sweep > 180 ? 1 : 0

  // Path: outer arc clockwise, line to inner end, inner arc counter-clockwise, close
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

const STATUS_COLORS = {
  empty: '#2d1b4e',
  partial: '#e8643d',
  full: '#f4b942',
  rest: '#c4c4d4',
  missed: 'url(#missedPattern)',
}

export default function SpiralSun({
  daysInMonth = 30,
  currentDay = 1,
  sessions = [],
  size = 400,
}) {
  const center = size / 2
  const outerRadius = size * 0.46
  const coreRadius = size * 0.12
  const trackGap = size * 0.008 // gap between concentric tracks

  // Organize days into weeks (Mon-Sun). Day 1's weekday is derived from the month.
  // For the prototype, we assume day 1 is a Monday for simplicity.
  const weeks = useMemo(() => {
    const result = []
    let week = []
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d)
      if (week.length === 7 || d === daysInMonth) {
        result.push([...week])
        week = []
      }
    }
    return result
  }, [daysInMonth])

  const numTracks = weeks.length
  const trackWidth = (outerRadius - coreRadius - trackGap * numTracks) / numTracks

  // Build session lookup
  const sessionMap = useMemo(() => {
    const map = {}
    sessions.forEach((s) => (map[s.day] = s))
    return map
  }, [sessions])

  // Calculate monthly completion for core glow
  const completionPct = useMemo(() => {
    if (currentDay < 1) return 0
    const daysToCount = Math.min(currentDay, daysInMonth)
    let completed = 0
    for (let d = 1; d <= daysToCount; d++) {
      const s = sessionMap[d]
      if (s && (s.status === 'full' || s.status === 'rest')) completed++
    }
    return daysToCount > 0 ? completed / daysToCount : 0
  }, [sessionMap, currentDay, daysInMonth])

  const coreGlowing = completionPct >= 0.75
  // Scale glow brightness from 75% to 100% completion
  const glowIntensity = coreGlowing
    ? Math.min((completionPct - 0.75) / 0.25, 1)
    : 0

  // Flatten segments for stagger animation index
  let globalIndex = 0

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Missed status: subtle diagonal stripe pattern */}
        <pattern
          id="missedPattern"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" fill="#3a2958" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#2d1b4e" strokeWidth="2" />
        </pattern>

        {/* Outer glow filter */}
        <filter id="outerGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.015} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0.5 0 0 0  0.3 0.2 0 0 0  0 0 0 0 0  0 0 0 0.4 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Core glow filter */}
        <filter id="coreGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.04} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0.6 0 0 0  0.6 0.3 0 0 0  0 0 0 0 0  0 0 0 0.8 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient to unify rings into a sun shape */}
        <radialGradient id="sunOverlay" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4b942" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#e8643d" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1a1033" stopOpacity="0.12" />
        </radialGradient>
      </defs>

      <g filter="url(#outerGlow)">
        {/* Render tracks from outermost (week 1) to innermost */}
        {weeks.map((week, weekIdx) => {
          const trackOuterR = outerRadius - weekIdx * (trackWidth + trackGap)
          const trackInnerR = trackOuterR - trackWidth
          const segmentAngle = 360 / 7

          return week.map((day, dayIdx) => {
            const startAngle = dayIdx * segmentAngle
            const endAngle = startAngle + segmentAngle
            const d = arcPath(center, center, trackInnerR, trackOuterR, startAngle, endAngle)

            const session = sessionMap[day]
            const status = session ? session.status : 'empty'
            const fill = STATUS_COLORS[status]
            const segIdx = globalIndex++

            return (
              <motion.path
                key={`seg-${day}`}
                d={d}
                fill={fill}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: segIdx * 0.04,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                style={{ transformOrigin: `${center}px ${center}px` }}
              />
            )
          })
        })}

        {/* Unifying overlay to blend rings into cohesive sun */}
        <circle cx={center} cy={center} r={outerRadius} fill="url(#sunOverlay)" pointerEvents="none" />

        {/* Core circle */}
        {coreGlowing ? (
          <motion.circle
            cx={center}
            cy={center}
            r={coreRadius}
            fill={`rgba(244, 185, 66, ${0.3 + glowIntensity * 0.7})`}
            filter="url(#coreGlow)"
            initial={{ scale: 1, opacity: 0.3 + glowIntensity * 0.7 }}
            animate={
              completionPct >= 1
                ? {
                    scale: [1, 1.08, 1],
                    opacity: [1, 0.85, 1],
                  }
                : { scale: 1, opacity: 0.3 + glowIntensity * 0.7 }
            }
            transition={
              completionPct >= 1
                ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.6 }
            }
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        ) : (
          <circle cx={center} cy={center} r={coreRadius} fill="#2d1b4e" />
        )}
      </g>
    </svg>
  )
}
