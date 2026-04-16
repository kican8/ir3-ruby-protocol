import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Check, Circle, Moon } from 'lucide-react'
import protocol from '../data/protocol'
import doseTargets from '../data/doseTargets'

export default function ProtocolCalendar({ userProfile, sessions, getCurrentProtocolDay, onBack }) {
  const protocolDay = getCurrentProtocolDay() || 1
  const currentWeek = Math.ceil(protocolDay / 7)

  return (
    <div className="min-h-screen pb-24" style={{ background: '#1a1033' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pb-2">
        <button onClick={onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}><ChevronLeft size={24} /></button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#f4b942' }}>12-Week Protocol</h1>
          <p className="text-xs" style={{ color: '#9a8cb5' }}>You're on Day {protocolDay} · Week {Math.min(currentWeek, 12)}</p>
        </div>
      </div>

      {/* Phase overview */}
      <div className="px-5 flex gap-2 mb-4 overflow-x-auto pb-2">
        {protocol.phases.map(phase => {
          const isActive = phase.weeks.includes(Math.min(currentWeek, 12))
          const isPast = phase.weeks[phase.weeks.length - 1] < currentWeek
          return (
            <div key={phase.id}
              className="flex-shrink-0 rounded-xl px-3 py-2"
              style={{
                background: isActive ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.5)',
                border: isActive ? '2px solid #e8643d' : '2px solid transparent',
              }}>
              <div className="text-xs font-bold" style={{ color: isActive ? '#e8643d' : isPast ? '#f4b942' : '#9a8cb5' }}>
                Phase {phase.id}
              </div>
              <div className="text-[10px]" style={{ color: '#9a8cb5' }}>{phase.name}</div>
              <div className="text-[10px]" style={{ color: '#9a8cb5' }}>Wk {phase.weeks[0]}–{phase.weeks[phase.weeks.length-1]}</div>
            </div>
          )
        })}
      </div>

      {/* Week-by-week schedule */}
      <div className="px-5 space-y-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(week => {
          const phase = protocol.phases.find(p => p.weeks.includes(week))
          const schedule = protocol.weekSchedules?.[week] || []
          const isCurrent = week === Math.min(currentWeek, 12)
          const isPast = week < currentWeek

          return (
            <motion.div key={week}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: week * 0.03 }}
              className="rounded-2xl p-4"
              style={{
                background: isCurrent ? 'rgba(232, 100, 61, 0.1)' : 'rgba(45, 27, 78, 0.5)',
                border: isCurrent ? '1px solid rgba(232, 100, 61, 0.3)' : '1px solid rgba(196, 196, 212, 0.08)',
              }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-bold" style={{ color: isCurrent ? '#e8643d' : isPast ? '#f4b942' : '#c4c4d4' }}>
                    Week {week}
                  </span>
                  <span className="text-xs ml-2" style={{ color: '#9a8cb5' }}>
                    {phase?.name} · {phase?.baseMinutes}min
                  </span>
                </div>
                {isPast && <Check size={16} color="#f4b942" />}
                {isCurrent && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#e8643d', color: '#fff' }}>Current</span>}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['M','T','W','T','F','S','S'].map((d, i) => {
                  const dayData = schedule[i]
                  const dayNum = (week - 1) * 7 + i + 1
                  const isPastDay = dayNum < protocolDay
                  const isToday = dayNum === protocolDay

                  return (
                    <div key={i} className="text-center">
                      <div className="text-[10px] mb-1" style={{ color: '#9a8cb5' }}>{d}</div>
                      <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center"
                        style={{
                          background: isToday ? '#e8643d' : dayData?.isRest ? 'rgba(196, 196, 212, 0.1)' : dayData?.isSession ? (isPastDay ? 'rgba(244, 185, 66, 0.2)' : 'rgba(45, 27, 78, 0.7)') : 'transparent',
                          border: isToday ? 'none' : '1px solid rgba(196, 196, 212, 0.08)',
                        }}>
                        {dayData?.isRest ? (
                          <Moon size={10} color="#c4c4d4" />
                        ) : dayData?.isSession ? (
                          <div className="text-[8px] font-medium" style={{ color: isToday ? '#fff' : isPastDay ? '#f4b942' : '#9a8cb5' }}>
                            {(doseTargets[dayData.bodySite]?.label || dayData.bodySite || '').slice(0, 3)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
