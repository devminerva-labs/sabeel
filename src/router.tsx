import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DashboardPage } from '@/pages/DashboardPage'
import { AdhkarPage } from '@/pages/AdhkarPage'

// Lazy load heavier pages
const QuranPage = lazy(() =>
  import('@/pages/QuranPage').then((m) => ({ default: m.QuranPage })),
)
const PrayerPage = lazy(() =>
  import('@/pages/PrayerPage').then((m) => ({ default: m.PrayerPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function RouteErrorFallback() {
  return (
    <div className="p-8 text-center space-y-4">
      <p className="text-xl font-semibold">Page not found</p>
      <a href="/" className="text-primary underline">Go home</a>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary level="feature">
            <DashboardPage />
          </ErrorBoundary>
        ),
      },
      {
        path: 'quran',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <QuranPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: 'prayer',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <PrayerPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: 'adhkar',
        element: (
          <ErrorBoundary level="feature">
            <AdhkarPage />
          </ErrorBoundary>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <SettingsPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
    ],
  },
])
