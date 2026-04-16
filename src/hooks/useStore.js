import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Central store hook that manages all IR3 Ruby Protocol app state
 * with localStorage persistence.
 */
export default function useStore() {
  const [userProfile, setUserProfile] = useLocalStorage('ir3-user', null)
  const [devices, setDevices] = useLocalStorage('ir3-devices', [])
  const [sessions, setSessions] = useLocalStorage('ir3-sessions', [])
  const [disclaimerAccepted, setDisclaimerAccepted] = useLocalStorage('ir3-disclaimer', false)

  // --- Profile helpers ---

  const updateProfile = useCallback(
    (updates) => {
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : { ...updates }))
    },
    [setUserProfile]
  )

  // --- Device helpers ---

  const addDevice = useCallback(
    (device) => {
      const newDevice = {
        ...device,
        id: device.id || crypto.randomUUID(),
        createdAt: device.createdAt || new Date().toISOString(),
      }
      setDevices((prev) => [...prev, newDevice])
      return newDevice
    },
    [setDevices]
  )

  const removeDevice = useCallback(
    (id) => {
      setDevices((prev) => prev.filter((d) => d.id !== id))
    },
    [setDevices]
  )

  const updateDevice = useCallback(
    (id, updates) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      )
    },
    [setDevices]
  )

  // --- Session helpers ---

  const addSession = useCallback(
    (session) => {
      const newSession = {
        ...session,
        id: session.id || crypto.randomUUID(),
        timestamp: session.timestamp || new Date().toISOString(),
      }
      setSessions((prev) => [...prev, newSession])
      return newSession
    },
    [setSessions]
  )

  const getSessionsByRegion = useCallback(
    (region) => {
      return sessions.filter(
        (s) => s.bodySite?.toLowerCase() === region?.toLowerCase()
      )
    },
    [sessions]
  )

  /**
   * Get the Monday 00:00:00 of the week containing the given date.
   * Week runs Monday to Sunday.
   */
  function getWeekStart(date) {
    const d = new Date(date)
    const day = d.getDay() // 0 = Sunday
    // Shift so Monday = 0
    const diff = day === 0 ? 6 : day - 1
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const getSessionsForWeek = useCallback(
    (weekStart) => {
      const start = new Date(weekStart)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + 7)

      return sessions.filter((s) => {
        const ts = new Date(s.timestamp)
        return ts >= start && ts < end
      })
    },
    [sessions]
  )

  /**
   * Calculate total J/cm2 delivered to each body region in the current
   * calendar week (Monday through Sunday).
   * @returns {Object} Map of { region: totalDose }
   */
  const getWeeklyDoseByRegion = useCallback(() => {
    const weekStart = getWeekStart(new Date())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const totals = {}
    for (const session of sessions) {
      const ts = new Date(session.timestamp)
      if (ts >= weekStart && ts < weekEnd) {
        const region = (session.bodySite || 'unknown').toLowerCase()
        const dose = session.estimatedDose || 0
        totals[region] = (totals[region] || 0) + dose
      }
    }
    return totals
  }, [sessions])

  /**
   * Calculate the current protocol day number based on protocolStartDate
   * stored in the user profile.
   * @returns {number|null} Day number (1-based) or null if no start date set
   */
  const getCurrentProtocolDay = useCallback(() => {
    if (!userProfile?.protocolStartDate) return null
    const start = new Date(userProfile.protocolStartDate)
    start.setHours(0, 0, 0, 0)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const diffMs = now - start
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    return diffDays + 1 // 1-based
  }, [userProfile])

  return {
    // Profile
    userProfile,
    setUserProfile,
    updateProfile,

    // Devices
    devices,
    addDevice,
    removeDevice,
    updateDevice,

    // Sessions
    sessions,
    addSession,
    getSessionsByRegion,
    getSessionsForWeek,
    getWeeklyDoseByRegion,
    getCurrentProtocolDay,

    // Disclaimer
    disclaimerAccepted,
    setDisclaimerAccepted,
  }
}
