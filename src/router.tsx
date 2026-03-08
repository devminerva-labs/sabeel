import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'

// Auto-reload on stale chunk errors (happens after deploys)
function lazyWithReload<T extends { default: React.ComponentType }>(
  factory: () => Promise<T>,
) {
  return lazy(() =>
    factory().catch((err) => {
      if (
        err?.message?.includes('Failed to fetch dynamically imported module') ||
        err?.message?.includes('Loading chunk') ||
        err?.message?.includes('Importing a module script failed')
      ) {
        // Only reload once to avoid infinite loop
        const key = 'sabeel_chunk_reload'
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1')
          window.location.reload()
        }
      }
      throw err
    }),
  )
}

const DashboardPage = lazyWithReload(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const AdhkarPage = lazyWithReload(() =>
  import('@/pages/AdhkarPage').then((m) => ({ default: m.AdhkarPage })),
)
const HalaqahPage = lazyWithReload(() =>
  import('@/pages/HalaqahPage').then((m) => ({ default: m.HalaqahPage })),
)
const ProphetStoriesPage = lazyWithReload(() =>
  import('@/pages/ProphetStoriesPage').then((m) => ({ default: m.ProphetStoriesPage })),
)

// Lazy load heavier pages
const QuranPage = lazyWithReload(() =>
  import('@/pages/QuranPage').then((m) => ({ default: m.QuranPage })),
)
const PrayerPage = lazyWithReload(() =>
  import('@/pages/PrayerPage').then((m) => ({ default: m.PrayerPage })),
)
const SettingsPage = lazyWithReload(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const AdminPage = lazyWithReload(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
)
const LaylatulQadrPage = lazyWithReload(() =>
  import('@/pages/LaylatulQadrPage').then((m) => ({ default: m.LaylatulQadrPage })),
)
const MusabaqahPage = lazyWithReload(() =>
  import('@/pages/MusabaqahPage').then((m) => ({ default: m.MusabaqahPage })),
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
    element: <LandingPage />,
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '/app',
    element: <Layout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <DashboardPage />
            </ErrorBoundary>
          </Suspense>
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
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <AdhkarPage />
            </ErrorBoundary>
          </Suspense>
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
      {
        path: 'prophets',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <ProphetStoriesPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: 'halaqah',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <HalaqahPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: 'laylah',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <LaylatulQadrPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: 'musabaqah',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <MusabaqahPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ErrorBoundary level="feature">
              <AdminPage />
            </ErrorBoundary>
          </Suspense>
        ),
      },
    ],
  },
])
