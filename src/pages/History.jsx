import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Filter, Clock, Zap } from 'lucide-react'
import doseTargets from '../data/doseTargets'

export default function History({ sessions, onBack }) {
  const [filterRegion, setFilterRegion] = useState('all')

  const regions = useMemo(() => {
    const set = new Set(sessions.map(s => s.bodySite).filter(Boolean))
    return ['all', ...Array.from(set)]
  }, [sessions])

  const filtered = useMemo(() => {
    const list = filterRegion === 'all' ? sessions : sessions.filter(s => s.bodySite === filterRegion)
    return [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [sessions, filterRegion])

  const totalDose = filtered.reduce((sum, s) => sum + (s.calculatedDose || s.estimatedDose || 0), 0)
  const totalTime = filtered.reduce((sum, s) => sum + (s.durationSeconds || s.sessionLengthSeconds || 0), 0)

  const formatDate = (ts) => {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="min-h-screen pb-24" style={{ background: '#1a1033' }}>
      <div className="flex items-center gap-3 p-5 pb-2">
        <button onClick={onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold" style={{ color: '#f4b942' }}>Session History</h1>
      </div>

      {/* Stats */}
      <div className="px-5 flex gap-3 mb-4">
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(45, 27, 78, 0.5)' }}>
          <div className="text-lg font-bold" style={{ color: '#f4b942' }}>{filtered.length}</div>
          <div className="text-[10px]" style={{ color: '#9a8cb5' }}>Sessions</div>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(45, 27, 78, 0.5)' }}>
          <div className="text-lg font-bold" style={{ color: '#e8643d' }}>{totalDose.toFixed(0)}</div>
          <div className="text-[10px]" style={{ color: '#9a8cb5' }}>Total J/cm²</div>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(45, 27, 78, 0.5)' }}>
          <div className="text-lg font-bold" style={{ color: '#c4c4d4' }}>{Math.round(totalTime / 60)}</div>
          <div className="text-[10px]" style={{ color: '#9a8cb5' }}>Minutes</div>
        </div>
      </div>

      {/* Region filter */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={14} color="#9a8cb5" className="flex-shrink-0" />
          {regions.map(r => (
            <button key={r} onClick={() => setFilterRegion(r)}
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all"
              style={{
                background: filterRegion === r ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.5)',
                color: filterRegion === r ? '#e8643d' : '#9a8cb5',
                border: filterRegion === r ? '1px solid #e8643d' : '1px solid transparent',
              }}>
              {r === 'all' ? 'All' : (doseTargets[r]?.label || r)}
            </button>
          ))}
        </div>
      </div>

      {/* Session list */}
      <div className="px-5 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={40} className="mx-auto mb-3" style={{ color: '#2d1b4e' }} />
            <p className="text-sm" style={{ color: '#9a8cb5' }}>No sessions yet. Start your first one!</p>
          </div>
        ) : filtered.map((session, i) => (
          <motion.div key={session.id || i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(45, 27, 78, 0.5)', border: '1px solid rgba(196, 196, 212, 0.08)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: session.completed ? 'rgba(244, 185, 66, 0.2)' : 'rgba(232, 100, 61, 0.2)' }}>
              <Zap size={16} color={session.completed ? '#f4b942' : '#e8643d'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: '#c4c4d4' }}>
                {doseTargets[session.bodySite]?.label || session.bodySiteLabel || session.bodySite || 'Session'}
              </div>
              <div className="text-xs" style={{ color: '#9a8cb5' }}>
                {session.goal || ''} {session.goal ? '·' : ''} {formatDate(session.timestamp)}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold" style={{ color: '#f4b942' }}>
                {(session.calculatedDose || session.estimatedDose || 0).toFixed(1)} J
              </div>
              <div className="text-[10px]" style={{ color: '#9a8cb5' }}>
                {formatTime(session.durationSeconds || session.sessionLengthSeconds || 0)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
