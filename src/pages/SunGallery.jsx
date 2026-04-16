import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Sun } from 'lucide-react'
import SpiralSun from '../components/SpiralSun'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function SunGallery({ sessions, onBack }) {
  // Group sessions by month and build a sun for each
  const monthSuns = useMemo(() => {
    if (!sessions || sessions.length === 0) return []

    const months = {}
    sessions.forEach(s => {
      const d = new Date(s.timestamp)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[key]) {
        months[key] = {
          key,
          year: d.getFullYear(),
          month: d.getMonth(),
          label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
          sessions: [],
        }
      }
      months[key].sessions.push(s)
    })

    return Object.values(months).sort((a, b) => b.key.localeCompare(a.key)).map(m => {
      const daysInMonth = new Date(m.year, m.month + 1, 0).getDate()
      const spiralSessions = []
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStart = new Date(m.year, m.month, d)
        const dayEnd = new Date(m.year, m.month, d + 1)
        const daySessions = m.sessions.filter(s => {
          const ts = new Date(s.timestamp)
          return ts >= dayStart && ts < dayEnd
        })
        if (daySessions.length > 0) {
          const anyComplete = daySessions.some(s => s.completed)
          spiralSessions.push({
            day: d,
            status: anyComplete ? 'full' : 'partial',
            dosePercent: 100,
          })
        }
        // Rest day (Sunday)
        const dayOfWeek = new Date(m.year, m.month, d).getDay()
        if (dayOfWeek === 0 && !spiralSessions.find(s => s.day === d)) {
          spiralSessions.push({ day: d, status: 'rest', dosePercent: 0 })
        }
      }
      return { ...m, daysInMonth, spiralSessions, totalSessions: m.sessions.length }
    })
  }, [sessions])

  return (
    <div className="min-h-screen pb-24" style={{ background: '#1a1033' }}>
      <div className="flex items-center gap-3 p-5 pb-2">
        <button onClick={onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold" style={{ color: '#f4b942' }}>Sun Gallery</h1>
      </div>

      <p className="px-5 text-xs mb-4" style={{ color: '#9a8cb5' }}>
        Each sun tells the story of a month's practice. Over a year, twelve suns accumulate — your visual archive.
      </p>

      {monthSuns.length === 0 ? (
        <div className="text-center py-16 px-5">
          <Sun size={48} className="mx-auto mb-4" style={{ color: '#2d1b4e' }} />
          <p className="text-lg font-semibold mb-2" style={{ color: '#c4c4d4' }}>Your sun begins at dawn</p>
          <p className="text-sm" style={{ color: '#9a8cb5' }}>Complete sessions to start filling your first monthly sun.</p>
        </div>
      ) : (
        <div className="px-5 grid grid-cols-2 gap-4">
          {monthSuns.map((m, i) => (
            <motion.div key={m.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center">
              <SpiralSun
                daysInMonth={m.daysInMonth}
                currentDay={m.daysInMonth}
                sessions={m.spiralSessions}
                size={150}
              />
              <p className="text-xs font-semibold mt-2" style={{ color: '#c4c4d4' }}>{m.label}</p>
              <p className="text-[10px]" style={{ color: '#9a8cb5' }}>{m.totalSessions} sessions</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
