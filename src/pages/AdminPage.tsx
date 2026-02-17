import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserStats, type UserStat } from '@/lib/api/admin.api'

const ADMIN_ID = '41dc3097-39b0-482f-a087-62c9a6bdbc5d'

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user?.id === ADMIN_ID

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) {
      setLoading(false)
      return
    }
    getUserStats().then(({ data, error }) => {
      if (error) setError(error)
      else setUsers(data ?? [])
      setLoading(false)
    })
  }, [authLoading, isAdmin])

  if (!authLoading && !isAdmin) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-xl font-semibold">Access Denied</p>
        <p className="text-sm text-muted-foreground">This page is restricted to admins.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  const totalUsers = users.length
  const activeToday = users.filter((u) => {
    if (!u.last_sign_in_at) return false
    const diff = Date.now() - new Date(u.last_sign_in_at).getTime()
    return diff < 24 * 60 * 60 * 1000
  }).length
  const totalJuzCompleted = users.reduce((sum, u) => sum + u.juz_completed, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-background p-4 text-center space-y-1">
          <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
          <p className="text-xs text-muted-foreground">Total Users</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 text-center space-y-1">
          <p className="text-2xl font-bold text-foreground">{activeToday}</p>
          <p className="text-xs text-muted-foreground">Active Today</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 text-center space-y-1">
          <p className="text-2xl font-bold text-foreground">{totalJuzCompleted}</p>
          <p className="text-xs text-muted-foreground">Juz Completed</p>
        </div>
      </div>

      {/* User list */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">All Users</h2>
        <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
          {users.map((user) => (
            <div key={user.user_id} className="px-4 py-3 bg-background">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.display_name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-medium text-foreground">
                    {user.juz_completed}<span className="text-muted-foreground font-normal">/30</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.juz_in_progress > 0 && `${user.juz_in_progress} reading · `}
                    {timeAgo(user.last_sign_in_at)}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-status-completed transition-all duration-300"
                  style={{ width: `${(user.juz_completed / 30) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No users yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
