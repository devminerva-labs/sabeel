import { Outlet, NavLink } from 'react-router-dom'
import { OfflineIndicator } from '@/components/OfflineIndicator'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/quran', label: 'Quran', icon: '📖' },
  { to: '/prayer', label: 'Prayer', icon: '🕌' },
  { to: '/adhkar', label: 'Adhkar', icon: '📿' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
] as const

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <OfflineIndicator />

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20 max-w-lg mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-background border-t border-border safe-area-pb">
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`
              }
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
