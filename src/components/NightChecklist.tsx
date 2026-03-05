import { useState, useEffect } from 'react'
import { NIGHT_CHECKLIST_ITEMS } from '@/lib/laylatul-qadr-data'
import type { NightChecklistState } from '@/lib/laylatul-qadr-data'

function todayISO() {
  return new Date().toLocaleDateString('sv-SE')
}

function storageKey(date: string) {
  return `laylah_checklist_${date}`
}

function loadChecklist(date: string): NightChecklistState {
  try {
    const raw = localStorage.getItem(storageKey(date))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveChecklist(date: string, state: NightChecklistState) {
  localStorage.setItem(storageKey(date), JSON.stringify(state))
}

export function NightChecklist() {
  const date = todayISO()
  const [state, setState] = useState<NightChecklistState>(() => loadChecklist(date))

  useEffect(() => {
    saveChecklist(date, state)
  }, [date, state])

  function toggle(key: string) {
    setState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const completedCount = NIGHT_CHECKLIST_ITEMS.filter((item) => state[item.key]).length

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Tonight's Ibadah</h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{NIGHT_CHECKLIST_ITEMS.length}
        </span>
      </div>

      <div className="space-y-2">
        {NIGHT_CHECKLIST_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => toggle(item.key)}
            className="w-full flex items-start gap-3 text-left group"
          >
            <span
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                state[item.key]
                  ? 'bg-primary border-primary'
                  : 'border-border group-hover:border-primary/50'
              }`}
            >
              {state[item.key] && (
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <div>
              <p className={`text-sm font-medium transition-colors ${state[item.key] ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {item.label}
              </p>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {completedCount === NIGHT_CHECKLIST_ITEMS.length && (
        <p className="text-xs text-center text-primary font-medium pt-1">
          Alhamdulillah — may Allah accept your worship tonight.
        </p>
      )}
    </div>
  )
}
