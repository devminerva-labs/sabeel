import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/styles/globals.css'
import { getCurrentRamadanYear, getRamadanDayNumber, getLaylahPhase } from '@/lib/ramadan-dates'

// Clear stale-chunk reload flag on successful boot
sessionStorage.removeItem('sabeel_chunk_reload')

// Apply laylah-mode synchronously before first paint to prevent flash on refresh
try {
  const year = getCurrentRamadanYear()
  if (year) {
    const day = getRamadanDayNumber(year)
    if (day && getLaylahPhase(day) === 'active') {
      document.documentElement.classList.add('laylah-mode')
    }
  }
} catch { /* no-op if date logic fails */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
