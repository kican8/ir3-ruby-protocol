import { useState } from 'react'
import useStore from './hooks/useStore'

// Pages
import Onboarding from './pages/Onboarding'
import DeviceLibrary from './pages/DeviceLibrary'
import SessionBuilder from './pages/SessionBuilder'
import ActiveSession from './pages/ActiveSession'
import Dashboard from './pages/Dashboard'
import ProtocolCalendar from './pages/ProtocolCalendar'
import History from './pages/History'
import Research from './pages/Research'
import Settings from './pages/Settings'
import SunGallery from './pages/SunGallery'

// Components
import Navigation from './components/Navigation'

export default function App() {
  const store = useStore()
  const {
    userProfile, setUserProfile, updateProfile,
    devices, addDevice, removeDevice, updateDevice,
    sessions, addSession,
    disclaimerAccepted, setDisclaimerAccepted,
    getCurrentProtocolDay, getWeeklyDoseByRegion,
  } = store

  const [page, setPage] = useState('home')
  const [activeSession, setActiveSession] = useState(null)
  const [justOnboarded, setJustOnboarded] = useState(false)

  // Determine app state
  const needsOnboarding = !userProfile?.onboardingComplete
  const needsDevice = !needsOnboarding && devices.length === 0 && !justOnboarded
  const showNav = !needsOnboarding && !activeSession && !(needsDevice || justOnboarded)

  // Onboarding complete handler
  const handleOnboardingComplete = (profile, disclaimer) => {
    setUserProfile(profile)
    setDisclaimerAccepted(disclaimer)
    setJustOnboarded(true)
  }

  // Device setup complete
  const handleDeviceSetupComplete = () => {
    setJustOnboarded(false)
    setPage('home')
  }

  // Start a session from session builder
  const handleStartSession = (config) => {
    setActiveSession(config)
  }

  // Session completed
  const handleSessionComplete = (sessionData) => {
    addSession({
      deviceId: sessionData.deviceId,
      bodySite: sessionData.bodySite,
      bodySiteLabel: sessionData.bodySiteLabel,
      goal: sessionData.goal,
      distance: sessionData.distance,
      durationSeconds: sessionData.durationSeconds,
      sessionLengthSeconds: sessionData.sessionLengthSeconds,
      calculatedDose: sessionData.calculatedDose,
      estimatedDose: sessionData.estimatedDose,
      targetDoseRange: sessionData.targetDoseRange,
      completed: sessionData.completed,
    })
    setActiveSession(null)
    setPage('home')
  }

  // Session cancelled
  const handleSessionCancel = (partialData) => {
    if (partialData && partialData.durationSeconds > 30) {
      // Log partial session if more than 30 seconds
      addSession({
        deviceId: partialData.deviceId,
        bodySite: partialData.bodySite,
        bodySiteLabel: partialData.bodySiteLabel,
        goal: partialData.goal,
        distance: partialData.distance,
        durationSeconds: partialData.durationSeconds,
        sessionLengthSeconds: partialData.sessionLengthSeconds,
        calculatedDose: partialData.calculatedDose,
        estimatedDose: partialData.estimatedDose,
        targetDoseRange: partialData.targetDoseRange,
        completed: false,
      })
    }
    setActiveSession(null)
  }

  const navigate = (p) => setPage(p)

  // Active session overlay
  if (activeSession) {
    return (
      <ActiveSession
        sessionConfig={activeSession}
        onComplete={handleSessionComplete}
        onCancel={handleSessionCancel}
      />
    )
  }

  // Onboarding flow
  if (needsOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  // Device setup (first time after onboarding)
  if (justOnboarded || needsDevice) {
    return (
      <DeviceLibrary
        devices={devices}
        addDevice={addDevice}
        removeDevice={removeDevice}
        updateDevice={updateDevice}
        onContinue={handleDeviceSetupComplete}
      />
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#1a1033' }}>
      <div>
          {page === 'home' && (
            <Dashboard
              userProfile={userProfile}
              sessions={sessions}
              devices={devices}
              getCurrentProtocolDay={getCurrentProtocolDay}
              getWeeklyDoseByRegion={getWeeklyDoseByRegion}
              onStartSession={() => navigate('session-builder')}
              onNavigate={navigate}
            />
          )}
          {page === 'devices' && (
            <DeviceLibrary
              devices={devices}
              addDevice={addDevice}
              removeDevice={removeDevice}
              updateDevice={updateDevice}
              onBack={() => navigate('home')}
            />
          )}
          {page === 'session-builder' && (
            <SessionBuilder
              devices={devices}
              userProfile={userProfile}
              onStartSession={handleStartSession}
              onBack={() => navigate('home')}
            />
          )}
          {page === 'protocol' && (
            <ProtocolCalendar
              userProfile={userProfile}
              sessions={sessions}
              getCurrentProtocolDay={getCurrentProtocolDay}
              onBack={() => navigate('home')}
            />
          )}
          {page === 'history' && (
            <History
              sessions={sessions}
              onBack={() => navigate('home')}
            />
          )}
          {page === 'research' && (
            <Research
              userProfile={userProfile}
              onBack={() => navigate('home')}
            />
          )}
          {page === 'settings' && (
            <Settings
              userProfile={userProfile}
              updateProfile={updateProfile}
              onBack={() => navigate('home')}
            />
          )}
          {page === 'gallery' && (
            <SunGallery
              sessions={sessions}
              onBack={() => navigate('home')}
            />
          )}
      </div>

      {showNav && <Navigation currentPage={page} onNavigate={navigate} />}
    </div>
  )
}
