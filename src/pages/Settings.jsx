import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, User, Target, Calendar, Sun, Shield, Trash2, AlertTriangle } from 'lucide-react'
import INTENTIONS from '../data/intentions'

export default function Settings({ userProfile, updateProfile, onBack }) {
  const [showReset, setShowReset] = useState(false)
  const [editingIntentions, setEditingIntentions] = useState(false)
  const [tempIntentions, setTempIntentions] = useState(userProfile?.intentions || [])

  const toggleIntention = (id) => {
    setTempIntentions(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const saveIntentions = () => {
    updateProfile({ intentions: tempIntentions })
    setEditingIntentions(false)
  }

  const resetApp = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#1a1033' }}>
      <div className="flex items-center gap-3 p-5 pb-2">
        <button onClick={onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-bold" style={{ color: '#f4b942' }}>Settings</h1>
      </div>

      <div className="px-5 space-y-4 mt-4">
        {/* Profile section */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <User size={16} color="#e8643d" />
            <h2 className="text-sm font-bold" style={{ color: '#c4c4d4' }}>Profile</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#9a8cb5' }}>Name</span>
              <span style={{ color: '#c4c4d4' }}>{userProfile?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#9a8cb5' }}>Schedule</span>
              <span style={{ color: '#c4c4d4' }}>{userProfile?.scheduleDaysPerWeek || '–'} days/week</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#9a8cb5' }}>Morning sun</span>
              <span style={{ color: '#c4c4d4' }}>{userProfile?.solarExposure || '–'}</span>
            </div>
            {userProfile?.age && (
              <div className="flex justify-between">
                <span style={{ color: '#9a8cb5' }}>Age</span>
                <span style={{ color: '#c4c4d4' }}>{userProfile.age}</span>
              </div>
            )}
          </div>
        </div>

        {/* Intentions */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={16} color="#e8643d" />
              <h2 className="text-sm font-bold" style={{ color: '#c4c4d4' }}>Health Intentions</h2>
            </div>
            <button onClick={() => { setTempIntentions(userProfile?.intentions || []); setEditingIntentions(!editingIntentions) }}
              className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(232, 100, 61, 0.2)', color: '#e8643d' }}>
              {editingIntentions ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!editingIntentions ? (
            <div className="flex flex-wrap gap-2">
              {(userProfile?.intentions || []).map(id => {
                const intention = INTENTIONS.find(i => i.id === id)
                return intention ? (
                  <span key={id} className="text-xs px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(232, 100, 61, 0.15)', color: '#e8643d' }}>
                    {intention.title}
                  </span>
                ) : null
              })}
            </div>
          ) : (
            <div>
              <p className="text-xs mb-2" style={{ color: '#9a8cb5' }}>Select up to 4 intentions. Changes update your protocol.</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {INTENTIONS.map(i => (
                  <button key={i.id} onClick={() => toggleIntention(i.id)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{
                      background: tempIntentions.includes(i.id) ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
                      color: tempIntentions.includes(i.id) ? '#e8643d' : '#9a8cb5',
                      border: tempIntentions.includes(i.id) ? '1px solid #e8643d' : '1px solid rgba(196, 196, 212, 0.1)',
                    }}>{i.title}</button>
                ))}
              </div>
              <button onClick={saveIntentions} disabled={tempIntentions.length === 0}
                className="w-full py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: tempIntentions.length > 0 ? '#e8643d' : '#2d1b4e', color: '#fff' }}>
                Save Intentions
              </button>
            </div>
          )}
        </div>

        {/* Protocol info */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} color="#e8643d" />
            <h2 className="text-sm font-bold" style={{ color: '#c4c4d4' }}>Protocol</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#9a8cb5' }}>Started</span>
              <span style={{ color: '#c4c4d4' }}>{userProfile?.protocolStartDate || 'Not started'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#9a8cb5' }}>Current week</span>
              <span style={{ color: '#c4c4d4' }}>{userProfile?.currentProtocolWeek || '–'}</span>
            </div>
          </div>
        </div>

        {/* Safety flags */}
        {(userProfile?.safetyFlags || []).length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(232, 100, 61, 0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} color="#e8643d" />
              <h2 className="text-sm font-bold" style={{ color: '#c4c4d4' }}>Safety Flags</h2>
            </div>
            <div className="space-y-1">
              {userProfile.safetyFlags.map(flag => (
                <div key={flag} className="flex items-center gap-2">
                  <AlertTriangle size={12} color="#e8643d" />
                  <span className="text-xs" style={{ color: '#c4c4d4' }}>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(45, 27, 78, 0.5)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#9a8cb5' }}>
            IR³ Ruby is an educational and habit-tracking tool, not a medical device. Information provided is not medical advice.
            Consult a licensed healthcare provider before starting any photobiomodulation protocol.
            Dose calculations are estimates. Individual results vary.
          </p>
        </div>

        {/* Reset */}
        <button onClick={() => setShowReset(!showReset)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm"
          style={{ color: '#9a8cb5', background: 'rgba(45, 27, 78, 0.3)' }}>
          <Trash2 size={14} /> Reset All Data
        </button>

        {showReset && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-xl p-4" style={{ background: 'rgba(232, 100, 61, 0.1)', border: '1px solid rgba(232, 100, 61, 0.3)' }}>
            <p className="text-xs mb-3" style={{ color: '#e8643d' }}>This will delete all your data including profile, devices, and session history. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={resetApp} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: '#e8643d', color: '#fff' }}>
                Confirm Reset
              </button>
              <button onClick={() => setShowReset(false)} className="flex-1 py-2 rounded-lg text-xs" style={{ color: '#9a8cb5' }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
