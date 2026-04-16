import { Home, Smartphone, BookOpen, Settings, Plus } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'session-builder', label: '', icon: Plus, center: true },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ background: '#1a1033', borderTop: '1px solid rgba(196, 196, 212, 0.08)' }}>
      <div className="flex items-center justify-around px-2 pb-6 pt-2 max-w-md mx-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = currentPage === item.id

          if (item.center) {
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className="w-14 h-14 -mt-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: '#e8643d', boxShadow: '0 4px 20px rgba(232, 100, 61, 0.4)' }}>
                <Icon size={24} color="#fff" />
              </button>
            )
          }

          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all">
              <Icon size={20} color={active ? '#e8643d' : '#9a8cb5'} />
              <span className="text-[10px]" style={{ color: active ? '#e8643d' : '#9a8cb5' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
