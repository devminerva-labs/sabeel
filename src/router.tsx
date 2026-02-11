import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { TrackerPage } from '@/pages/TrackerPage'
import { AdhkarPage } from '@/pages/AdhkarPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tracker', element: <TrackerPage /> },
      { path: 'adhkar', element: <AdhkarPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
