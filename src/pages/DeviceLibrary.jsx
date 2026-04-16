import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Sun, ChevronLeft, Check } from 'lucide-react'

const DEVICE_TYPES = ['Panel', 'Handheld', 'Heat Lamp', 'Helmet', 'Bed', 'Other']
const WAVELENGTHS = ['630nm', '660nm', '810nm', '830nm', '850nm', 'Broadband/Heat Lamp', 'Other']
const WL_COLORS = { '630nm': '#ef4444', '660nm': '#dc2626', '810nm': '#a855f7', '830nm': '#8b5cf6', '850nm': '#7c3aed', 'Broadband/Heat Lamp': '#f59e0b', 'Other': '#6b7280' }

const emptyDevice = {
  nickname: '', deviceType: 'Panel', numHeads: 1,
  statedIrradiance: '', statedDistance: '',
  wavelengths: [], beamAngle: '', purchaseDate: '',
}

export default function DeviceLibrary({ devices, addDevice, removeDevice, updateDevice, onBack, onContinue }) {
  const [editing, setEditing] = useState(null) // null | 'new' | deviceId
  const [form, setForm] = useState({ ...emptyDevice })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [errors, setErrors] = useState({})

  const openNew = () => { setForm({ ...emptyDevice }); setEditing('new'); setErrors({}) }
  const openEdit = (device) => { setForm({ ...device }); setEditing(device.id); setErrors({}) }
  const close = () => { setEditing(null); setErrors({}) }

  const toggleWavelength = (wl) => {
    setForm(f => ({
      ...f,
      wavelengths: f.wavelengths.includes(wl)
        ? f.wavelengths.filter(w => w !== wl)
        : [...f.wavelengths, wl]
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.nickname.trim()) e.nickname = 'Required'
    if (!form.statedIrradiance || Number(form.statedIrradiance) <= 0) e.irradiance = 'Required'
    if (!form.statedDistance || Number(form.statedDistance) <= 0) e.distance = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = () => {
    if (!validate()) return
    const device = {
      ...form,
      statedIrradiance: Number(form.statedIrradiance),
      statedDistance: Number(form.statedDistance),
      numHeads: Number(form.numHeads) || 1,
      beamAngle: form.beamAngle ? Number(form.beamAngle) : null,
    }
    if (editing === 'new') {
      addDevice(device)
    } else {
      updateDevice(editing, device)
    }
    close()
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#1a1033' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pb-2">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2" style={{ color: '#9a8cb5' }}><ChevronLeft size={24} /></button>
        )}
        <h1 className="text-xl font-bold flex-1" style={{ color: '#f4b942' }}>Your Devices</h1>
        <button onClick={openNew}
          className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-sm font-semibold"
          style={{ background: '#e8643d', color: '#fff' }}>
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Device list */}
      <div className="px-5 space-y-3 mt-4">
        {devices.length === 0 && !editing && (
          <div className="text-center py-16">
            <Sun size={48} className="mx-auto mb-4" style={{ color: '#2d1b4e' }} />
            <p className="text-lg font-semibold mb-2" style={{ color: '#c4c4d4' }}>Add your first device</p>
            <p className="text-sm mb-6" style={{ color: '#9a8cb5' }}>We need your device specs to calculate accurate doses.</p>
            <button onClick={openNew}
              className="py-3 px-6 rounded-xl font-semibold" style={{ background: '#e8643d', color: '#fff' }}>
              <Plus size={16} className="inline mr-2" />Add Device
            </button>
          </div>
        )}

        <AnimatePresence>
          {devices.map(device => (
            <motion.div key={device.id} layout
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(45, 27, 78, 0.7)', border: '1px solid rgba(196, 196, 212, 0.15)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold" style={{ color: '#c4c4d4' }}>{device.nickname}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(232, 100, 61, 0.2)', color: '#e8643d' }}>
                    {device.deviceType}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(device)} className="p-2 rounded-lg hover:bg-white/5"><Pencil size={16} color="#9a8cb5" /></button>
                  <button onClick={() => setDeleteConfirm(device.id)} className="p-2 rounded-lg hover:bg-white/5"><Trash2 size={16} color="#9a8cb5" /></button>
                </div>
              </div>
              <div className="text-sm mb-2" style={{ color: '#9a8cb5' }}>
                {device.statedIrradiance} mW/cm² at {device.statedDistance}" · {device.numHeads} emitter{device.numHeads > 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(device.wavelengths || []).map(wl => (
                  <span key={wl} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${WL_COLORS[wl] || '#6b7280'}22`, color: WL_COLORS[wl] || '#6b7280' }}>
                    {wl}
                  </span>
                ))}
              </div>

              {/* Delete confirmation */}
              <AnimatePresence>
                {deleteConfirm === device.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(196, 196, 212, 0.1)' }}>
                    <span className="text-xs flex-1" style={{ color: '#e8643d' }}>Delete {device.nickname}?</span>
                    <button onClick={() => { removeDevice(device.id); setDeleteConfirm(null) }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#e8643d', color: '#fff' }}>Delete</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#9a8cb5' }}>Cancel</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Continue button when devices exist */}
      {devices.length > 0 && onContinue && (
        <div className="fixed bottom-0 left-0 right-0 p-5 pb-8" style={{ background: 'linear-gradient(transparent, #1a1033 30%)' }}>
          <button onClick={onContinue}
            className="w-full py-4 rounded-2xl font-semibold" style={{ background: '#e8643d', color: '#fff' }}>
            Continue to Dashboard
          </button>
        </div>
      )}

      {/* Add/Edit form modal */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            <motion.div
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6"
              style={{ background: '#1a1033', border: '1px solid rgba(196, 196, 212, 0.15)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: '#f4b942' }}>
                  {editing === 'new' ? 'Add Device' : 'Edit Device'}
                </h2>
                <button onClick={close} className="p-2"><X size={20} color="#9a8cb5" /></button>
              </div>

              <div className="space-y-4">
                <Field label="Device Nickname *" error={errors.nickname}>
                  <input type="text" value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                    placeholder='e.g., "My Red Light Panel"' className="form-input" />
                </Field>

                <Field label="Device Type">
                  <div className="grid grid-cols-3 gap-2">
                    {DEVICE_TYPES.map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, deviceType: t }))}
                        className="py-2 px-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: form.deviceType === t ? 'rgba(232, 100, 61, 0.2)' : 'rgba(45, 27, 78, 0.7)',
                          border: form.deviceType === t ? '2px solid #e8643d' : '2px solid rgba(196, 196, 212, 0.1)',
                          color: form.deviceType === t ? '#e8643d' : '#c4c4d4',
                        }}>{t}</button>
                    ))}
                  </div>
                </Field>

                <Field label="Number of Emitters">
                  <input type="number" min="1" max="10" value={form.numHeads}
                    onChange={e => setForm(f => ({ ...f, numHeads: e.target.value }))} className="form-input" />
                </Field>

                <Field label="Irradiance (mW/cm²) *" error={errors.irradiance}>
                  <input type="number" min="1" value={form.statedIrradiance}
                    onChange={e => setForm(f => ({ ...f, statedIrradiance: e.target.value }))}
                    placeholder="e.g., 100" className="form-input" />
                </Field>

                <Field label="Measured at Distance (inches) *" error={errors.distance}>
                  <input type="number" min="1" value={form.statedDistance}
                    onChange={e => setForm(f => ({ ...f, statedDistance: e.target.value }))}
                    placeholder="e.g., 6" className="form-input" />
                </Field>

                <Field label="Wavelengths">
                  <div className="flex flex-wrap gap-2">
                    {WAVELENGTHS.map(wl => (
                      <button key={wl} onClick={() => toggleWavelength(wl)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: form.wavelengths.includes(wl) ? `${WL_COLORS[wl]}33` : 'rgba(45, 27, 78, 0.7)',
                          border: form.wavelengths.includes(wl) ? `2px solid ${WL_COLORS[wl]}` : '2px solid rgba(196, 196, 212, 0.1)',
                          color: form.wavelengths.includes(wl) ? WL_COLORS[wl] : '#9a8cb5',
                        }}>{wl}</button>
                    ))}
                  </div>
                </Field>

                <Field label="Beam Angle (optional)">
                  <input type="number" min="1" max="180" value={form.beamAngle}
                    onChange={e => setForm(f => ({ ...f, beamAngle: e.target.value }))}
                    placeholder="Degrees" className="form-input" />
                </Field>

                <button onClick={save}
                  className="w-full py-4 rounded-2xl font-semibold mt-4" style={{ background: '#e8643d', color: '#fff' }}>
                  <Check size={16} className="inline mr-2" />{editing === 'new' ? 'Save Device' : 'Update Device'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(45, 27, 78, 0.7);
          border: 1px solid rgba(196, 196, 212, 0.15);
          color: #c4c4d4;
          font-size: 0.875rem;
          outline: none;
        }
        .form-input:focus {
          border-color: #e8643d;
          box-shadow: 0 0 0 2px rgba(232, 100, 61, 0.2);
        }
      `}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm mb-1.5" style={{ color: '#9a8cb5' }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: '#e8643d' }}>{error}</p>}
    </div>
  )
}
