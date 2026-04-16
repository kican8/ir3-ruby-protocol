import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import SpiralSun from '../components/SpiralSun'
import protocol from '../data/protocol'
import doseTargets from '../data/doseTargets'

export default function Dashboard({ userProfile, sessions, devices, getCurrentProtocolDay, getWeeklyDoseByRegion, onStartSession, onNavigate }) {
  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  // Build spiral sun session data from this month's sessions
  const monthSessions = useMemo(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const result = []
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStart = new Date(year, month, d)
      const dayEnd = new Date(year, month, d + 1)
      const daySessions = sessions.filter(s => {
        const ts = new Date(s.timestamp)
        return ts >= dayStart && ts < dayEnd
      })
      if (daySessions.length > 0) {
        const totalDose = daySessions.reduce((sum, s) => sum + (s.calculatedDose || s.estimatedDose || 0), 0)
        const anyComplete = daySessions.some(s => s.completed)
        result.push({
          day: d,
          status: anyComplete ? 'full' : 'partial',
          dosePercent: Math.min(100, totalDose * 10), // rough scale
        })
      }
    }
    // Mark rest days (Sunday by default)
    for (let d = 1; d <= Math.min(dayOfMonth, daysInMonth); d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), d)
      if (date.getDay() === 0 && !result.find(r => r.day === d)) {
        result.push({ day: d, status: 'rest', dosePercent: 0 })
      }
    }
    return result
  }, [sessions, today, daysInMonth, dayOfMonth])

  // Protocol day info
  const protocolDay = getCurrentProtocolDay()
  const protocolWeek = protocolDay ? Math.ceil(protocolDay / 7) : null
  const protocolDayOfWeek = protocolDay ? ((protocolDay - 1) % 7) : null

  const currentPhase = protocolWeek ? protocol.phases.find(p => p.weeks.includes(Math.min(protocolWeek, 12))) : null
  const weekSchedule = protocolWeek && protocolWeek <= 12 ? protocol.weekSchedules?.[protocolWeek] : null
  const todaySchedule = weekSchedule ? weekSchedule[protocolDayOfWeek] : null

  const weeklyDose = getWeeklyDoseByRegion()

  // Monthly completion %
  const completedDays = monthSessions.filter(s => s.status === 'full' || s.status === 'rest').length
  const completionPct = dayOfMonth > 0 ? Math.round((completedDays / dayOfMonth) * 100) : 0

  return (
    <div className="min-h-screen pb-24" style={{ background: '#1a1033' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-lg font-bold" style={{ color: '#f4b942' }}>
          {userProfile?.name ? `Hey, ${userProfile.name}` : 'IR³ Ruby'}
        </h1>
        {currentPhase && (
          <p className="text-xs mt-0.5" style={{ color: '#9a8cb5' }}>
            Week {protocolWeek} · Phase {currentPhase.id}: {currentPhase.name}
          </p>
        )}
      </div>

      {/* Spiral Sun */}
      <div className="flex justify-center py-4">
        <SpiralSun
          daysInMonth={daysInMonth}
          currentDay={dayOfMonth}
          sessions={monthSessions}
          size={280}
        />
      </div>

      {/* Month progress */}
      <div className="text-center mb-4">
        <p className="text-sm" style={{ color: '#c4c4d4' }}>
          Day {dayOfMonth} of {daysInMonth} · {completionPct}% on track
        </p>
        <p className="text-xs" style={{ color: '#9a8cb5' }}>
          {completedDays} sessions this month
        </p>
      </div>

      {/* Today's session card */}
      <div className="px-5 mb-4">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.15)' }}>
          {todaySchedule?.isSession ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} color="#e8643d" />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#e8643d' }}>Today's Session</span>
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: '#c4c4d4' }}>
                {doseTargets[todaySchedule.bodySite]?.label || todaySchedule.bodySite}
              </div>
              <div className="text-xs mb-3" style={{ color: '#9a8cb5' }}>
                ~{currentPhase?.baseMinutes || 10} min · {todaySchedule.distance || 12}" distance
              </div>
              <button onClick={onStartSession}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{ background: '#e8643d', color: '#fff' }}>
                Start Session <ChevronRight size={16} />
              </button>
            </>
          ) : todaySchedule?.isRest ? (
            <div className="text-center py-4">
              <div className="text-lg font-semibold mb-1" style={{ color: '#c4c4d4' }}>Rest Day</div>
              <p className="text-xs" style={{ color: '#9a8cb5' }}>Recovery is part of the protocol. Your body builds during rest.</p>
            </div>
          ) : (
            <>
              <div className="text-sm font-semibold mb-3" style={{ color: '#c4c4d4' }}>Ready for a session?</div>
              <button onClick={onStartSession}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{ background: '#e8643d', color: '#fff' }}>
                <Plus size={16} /> New Session
              </button>
            </>
          )}
        </div>
      </div>

      {/* Weekly dose by region */}
      {Object.keys(weeklyDose).length > 0 && (
        <div className="px-5 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9a8cb5' }}>
            This Week's Dose
          </h3>
          <div className="space-y-2">
            {Object.entries(weeklyDose).map(([region, dose]) => {
              const target = doseTargets[region]
              const maxDose = target ? target.max * 3 : 60 // weekly max estimate
              const pct = Math.min((dose / maxDose) * 100, 100)
              return (
                <div key={region} className="rounded-xl p-3" style={{ background: 'rgba(45, 27, 78, 0.5)' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs" style={{ color: '#c4c4d4' }}>{target?.label || region}</span>
                    <span className="text-xs font-medium" style={{ color: '#f4b942' }}>{dose.toFixed(1)} J/cm²</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#2d1b4e' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #e8643d, #f4b942)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {[
          { label: 'Session Builder', icon: Plus, action: () => onNavigate('session-builder') },
          { label: 'Protocol Calendar', icon: Calendar, action: () => onNavigate('protocol') },
          { label: 'Session History', icon: Clock, action: () => onNavigate('history') },
          { label: 'Sun Gallery', icon: TrendingUp, action: () => onNavigate('gallery') },
        ].map(link => (
          <motion.button key={link.label} whileTap={{ scale: 0.97 }}
            onClick={link.action}
            className="rounded-xl p-3 flex items-center gap-2 text-left"
            style={{ background: 'rgba(45, 27, 78, 0.5)', border: '1px solid rgba(196, 196, 212, 0.08)' }}>
            <link.icon size={16} color="#9a8cb5" />
            <span className="text-xs" style={{ color: '#c4c4d4' }}>{link.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
