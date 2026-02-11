import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-amber-950 text-center text-sm py-1 font-medium">
      Offline — your data is saved locally
    </div>
  )
}
