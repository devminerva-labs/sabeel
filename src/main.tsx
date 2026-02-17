import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/styles/globals.css'

// Clear stale-chunk reload flag on successful boot
sessionStorage.removeItem('sabeel_chunk_reload')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
