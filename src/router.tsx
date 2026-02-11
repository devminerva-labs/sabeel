import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DashboardPage } from '@/pages/DashboardPage'
import { TrackerPage } from '@/pages/TrackerPage'
import { AdhkarPage } from '@/pages/AdhkarPage'

// Lazy load Settings (rarely visited)
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
        path: 'tracker',
        element: (
          <ErrorBoundary level="feature">
            <TrackerPage />
          </ErrorBoundary>
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
