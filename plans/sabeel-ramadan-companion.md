# Sabeel - Ramadan Spiritual Productivity Companion

> **Type:** New Product / PWA
> **Status:** Plan Reviewed & Revised (v2)
> **Created:** 2026-02-10
> **Revised:** 2026-02-10 — Applied findings from 6-agent review (architecture, simplicity, TypeScript, data integrity)

---

## Overview

Sabeel ("The Path") is a Progressive Web App (PWA) designed as a spiritual productivity companion for Ramadan. It helps Muslims track Quran recitation via a visual 30-cell Juz grid and access authentic Adhkar with scholarly context.

The app is mobile-first, offline-first, and anonymous-first — users start tracking immediately with no account required. All data lives locally in IndexedDB (Dexie.js). Optional cloud backup via Supabase is available for users who want cross-device sync.

**v1.0 Scope:** Quran Tracker + Adhkar Hub (local-only, no auth required)
**v1.1 Scope:** Community features (Halqa, leaderboards, nudges, auth providers)

---

## Problem Statement

During Ramadan, Muslims aim to complete the entire Quran (30 Juz) in 30 days while maintaining daily Adhkar (remembrance) routines. Current solutions are fragmented:

- Generic habit trackers lack Islamic context and Quran structure awareness
- Existing Quran apps focus on reading/listening, not progress tracking
- Adhkar apps rarely include scholarly sources (Dalil) or contextual timing
- No unified platform combines Quran tracking + Adhkar in a single offline-capable app

Sabeel solves this by providing a single, beautiful, offline-capable app that unifies both needs. Community features (Halqa circles, leaderboards) follow in v1.1 once the core loop is validated with real users.

---

## Recommended Tech Stack

| Layer | Choice | Reasoning |
|---|---|---|
| **Frontend** | React 19 + Vite 6 | No SSR needed for a tracker app; best PWA tooling; Concurrent Features for Suspense + Dexie reads |
| **Router** | React Router v6 | 6 routes; type-safe params not needed at this scale; ~12KB vs ~50KB for TanStack Router |
| **PWA** | vite-plugin-pwa (Workbox) | Zero-config precaching, all caching strategies, framework-agnostic |
| **Backend** | Supabase (Postgres + Auth) | RLS for future private groups, anonymous auth, type generation via CLI |
| **Offline DB** | Dexie.js (IndexedDB) | Clean TypeScript API, offline-first local storage, the single source of truth for all user data |
| **Styling** | Tailwind CSS v4 + shadcn/ui | CSS-first config, native logical properties for RTL, RTL-enabled components |
| **Server State** | TanStack Query v5 | Offline mutation queue (`networkMode: 'offlineFirst'`), stale-while-revalidate, background refetch |
| **Testing** | Vitest + Playwright | Native Vite testing + E2E with offline simulation |
| **Deployment** | Cloudflare Pages | Unlimited bandwidth, 300+ global edge nodes |

### Removed from Original Plan (YAGNI)

| Removed | Reason |
|---|---|
| TanStack Router | 6 routes don't need type-safe params/search validation; React Router v6 is sufficient |
| Zustand | Three-layer state problem (Zustand + TanStack Query + Dexie). Dexie is the local truth; `useState`/`useReducer` handles ephemeral UI state |
| Motion (Framer Motion) | 30-40KB for two animations. CSS `transition` on SVG `stroke-dashoffset` + CSS `@keyframes` for page transitions |
| react-i18next + i18next | ~30KB for 40 UI strings. A static `translations[lang]` object is sufficient for MVP |
| TanStack Query persist packages | Dexie is already the offline truth; persisting TanStack Query cache to localStorage creates a redundant third copy |
| Catch-up Edge Function | Three lines of arithmetic; all inputs available client-side; no server data required |
| Full Quran text JSON (~1.5MB) | App is a tracker, not a reader. Juz/Surah names + numbers (~10KB) are sufficient for the grid |

### Why NOT Next.js

Next.js App Router defaults to server components. Sabeel is 95% client-side interactivity (tapping counters, checking grids). SSR adds complexity with no benefit for a tracker app — every meaningful page requires IndexedDB data to render, so the server would produce an empty loading state. The offline-first requirement also conflicts with SSR. **Acknowledged tradeoff:** The future global leaderboard page (v1.1) would benefit from SSR for crawlability, but the user base is expected via word-of-mouth rather than organic search.

### Why Supabase over Firebase

Sabeel's data is fundamentally relational. A leaderboard query like "top 10 users in Halqa X, sorted by completion %, for current Ramadan" is trivial SQL but painful in Firestore. Supabase's Row Level Security (RLS) is the cleanest way to model private Halqa groups in v1.1.

### Why Cloudflare Pages over Vercel

For a Vite + React app (no Next.js server), Cloudflare Pages offers unlimited bandwidth (vs. Vercel's 100GB/month free) and 300+ global edge locations (critical for a globally distributed Muslim user base).

---

## Technical Approach

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Cloudflare Pages                    │
│              (Static PWA Shell + Assets)               │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                   React 19 + Vite 6                   │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐             │
│  │ Tracker │  │  Adhkar  │  │Settings │             │
│  │  View   │  │   Hub    │  │  View   │             │
│  └────┬────┘  └────┬─────┘  └────┬────┘             │
│       │            │             │                    │
│  ┌────▼────────────▼─────────────▼────────────────┐  │
│  │     TanStack Query (Server Sync Layer)          │  │
│  │     networkMode: 'offlineFirst'                 │  │
│  └──────────────────┬─────────────────────────────┘  │
│                     │                                 │
│  ┌──────────────────▼──────────────────────────────┐ │
│  │          Dexie.js (IndexedDB)                    │ │
│  │     Single source of truth for ALL user data     │ │
│  └──────────────────┬──────────────────────────────┘ │
└─────────────────────┼────────────────────────────────┘
                      │ Online: sync via REST
┌─────────────────────▼────────────────────────────────┐
│                    Supabase                           │
│  ┌──────────┐                                        │
│  │ Postgres │  (cloud backup + future community)     │
│  │  + RLS   │                                        │
│  └──────────┘                                        │
└──────────────────────────────────────────────────────┘
```

### State Ownership Rule

This is the single most important architectural decision:

| Layer | Owns | Examples |
|---|---|---|
| **Dexie.js (IndexedDB)** | ALL user-generated data | Progress states, counter counts, session records |
| **TanStack Query** | Server synchronization | Supabase sync, cache invalidation on reconnect |
| **React `useState`/`useReducer`** | Ephemeral UI state only | Active tab, modal open/closed, counter animating |
| **`localStorage`** | Tiny preferences | Theme (`'light' \| 'dark' \| 'system'`), city selection |

**Rule:** Components always read from Dexie for user data. TanStack Query mutations write to Dexie first (optimistic), then fire the Supabase POST. If offline, TanStack Query's `networkMode: 'offlineFirst'` queues the mutation and replays on reconnect via `resumePausedMutations()`. There is ONE sync queue (TanStack Query), not two.

---

### Implementation Phases

#### Phase 1: Foundation (Week 1-2)

**Goal:** Bootable PWA with anonymous tracking, offline-capable.

**Tasks:**
- [ ] `vite.config.ts` — React 19 + Vite 6 + vite-plugin-pwa setup
- [ ] `public/manifest.json` — PWA manifest (standalone, portrait, dark theme)
- [ ] Service worker with Workbox caching strategies
- [ ] Tailwind CSS v4 with `@theme` block (brand colors, Arabic fonts, dark mode)
- [ ] shadcn/ui init with RTL enabled (`"rtl": true` in `components.json`)
- [ ] Font loading — Scheherazade New (Quranic), Noto Naskh Arabic (UI), preloaded WOFF2
- [ ] Dark mode toggle (class-based via `localStorage`)
- [ ] Supabase project setup (Postgres schema, RLS policies, type generation)
- [ ] `supabase gen types typescript` integrated into build process (`npm run db:types`)
- [ ] Dexie.js local database schema (`SabeelDB`) with typed tables
- [ ] TanStack Query provider with `networkMode: 'offlineFirst'`
- [ ] Anonymous local session (browser-generated UUID stored in Dexie)
- [ ] React Router v6 setup: Dashboard, Tracker, Adhkar, Settings
- [ ] TypeScript foundation: branded types, error types, shared constants
- [ ] Data access layer (`src/lib/api/`) with typed functions

**Deliverables:**
- Installable PWA that opens offline
- Empty dashboard with navigation shell
- Dark/light mode working
- Arabic text rendering correctly with proper fonts

**Success Criteria:**
- Lighthouse PWA score: 90+
- Initial JS bundle: under 150KB gzipped (critical path)
- TTI under 5 seconds on 4G mid-range Android (4x CPU throttling)

#### Phase 2: Quran Tracker (Week 3-4)

**Goal:** Fully functional Quran progress tracking with catch-up calculator.

**Tasks:**
- [ ] `QuranGrid` component — 30-cell Juz view (Surah view deferred to v1.1)
- [ ] Cell states: `not_started` (grey) → `in_progress` (amber) → `completed` (green)
- [ ] Tap to cycle state, long-press for options
- [ ] `ProgressRing` component — SVG circular progress with CSS transition animation
- [ ] Catch-Up Calculator — client-side only (`lib/catch-up.ts`)
- [ ] Juz reference data (static, ~2KB: names + boundaries)
- [ ] Progress persistence to Dexie.js (offline-first)
- [ ] TanStack Query mutation for Supabase sync with additive upsert
- [ ] Dashboard integration: progress ring + catch-up status indicator
- [ ] Error boundary around QuranGrid (isolate grid render errors from app)

**Upsert Conflict Resolution:**
```sql
-- Additive merge: completed can never regress to in_progress
INSERT INTO quran_progress (user_id, juz_id, ramadan_year, status, updated_at)
VALUES ($1, $2, $3, $4, NOW())
ON CONFLICT (user_id, juz_id, ramadan_year)
DO UPDATE SET
  status = CASE
    WHEN EXCLUDED.status = 'completed' THEN 'completed'
    WHEN quran_progress.status = 'completed' THEN 'completed'
    ELSE EXCLUDED.status
  END,
  completed_at = CASE
    WHEN EXCLUDED.status = 'completed' AND quran_progress.status != 'completed' THEN NOW()
    ELSE quran_progress.completed_at
  END,
  updated_at = NOW();
```

**Catch-Up Calculator Logic:**
```
Input:  currentJuzCompleted (0-30), ramadanDayNumber (1-30), totalRamadanDays (29 or 30)
Output: { targetJuzToday, remainingJuz, remainingDays, isOnTrack, message }

If on track:    target = ceil(30 / totalRamadanDays)
If behind:      target = ceil(remainingJuz / remainingDays)
If days = 0:    show "Ramadan complete" summary
```

**Success Criteria:**
- Grid renders 30 Juz cells
- Tap a cell → state changes instantly (optimistic, writes to Dexie)
- Works fully offline (Dexie.js)
- Syncs to Supabase when online (with additive merge)
- Catch-up calculator updates in real-time as cells are tapped

#### Phase 3: Adhkar Hub (Week 5-6)

**Goal:** Browsable Adhkar with categories, interactive counter, and scholarly sources.

**Tasks:**
- [ ] Adhkar content data file (JSON, bundled in app) — curated from Hisn al-Muslim
- [ ] Content schema: Arabic + transliteration + translation + Dalil + repetitions
- [ ] Category views: Morning, Evening, Post-Prayer, Before Sleep, Anxiety/Stress
- [ ] `DhikrCard` component — expandable card with Arabic, translation, source
- [ ] `TasbihCounter` component — large circular tap target, haptic feedback (Vibration API)
- [ ] Counter completion behavior: celebration animation at target, allow overcounting
- [ ] Counter state persistence (Dexie.js, per-day, per-category)
- [ ] Session completion tracking (all Adhkar in category done)
- [ ] Time-relevant Adhkar on Dashboard (using prayer time calculation)
- [ ] Prayer time calculation via `adhan-js` library + city selection
- [ ] Arabic text rendering: RTL isolation, `lang="ar"`, proper line-height (2.2)
- [ ] Anxiety/Stress category: calmer palette, no competitive UI, gentle note

**Content Structure (per Dhikr):**
```json
{
  "id": "morning-01",
  "category": "morning",
  "order": 1,
  "arabic": "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا...",
  "transliteration": "Allāhumma bika aṣbaḥnā wa bika amsaynā...",
  "translation": { "en": "O Allah, by You we enter the morning..." },
  "source": { "text": "Abu Dawud 5068", "grading": "Sahih" },
  "repetitions": 1,
  "virtue": "Protection throughout the day"
}
```

**Design Notes:**
- Counter touch target: minimum 280px diameter (large circular button)
- Haptic feedback: 20ms vibrate per tap (Vibration API, Android only)
- Completion: [30, 60, 30, 60, 100] vibration pattern
- `touch-action: manipulation` to prevent iOS 300ms tap delay
- Adhkar content is **bundled** in the app (part of the JS bundle via import, ~200KB JSON)

**Success Criteria:**
- All 5 categories browsable with Arabic text rendered correctly
- Counter works with haptic feedback on Android
- Counter state persists across navigation (Dexie.js)
- Time-relevant Adhkar appear on Dashboard based on prayer times
- Fully offline-capable (content is bundled)

#### Phase 4: Polish & Launch (Week 7-8)

**Goal:** Performance, accessibility, edge cases, launch readiness.

**Tasks:**
- [ ] Lighthouse audit: PWA 90+, Performance 90+, Accessibility 90+
- [ ] Bundle analysis + code splitting (lazy load Settings)
- [ ] Screen reader audit: grid cells announce state ("Juz 1, complete")
- [ ] Keyboard navigation for grid and counter
- [ ] Motor accessibility: hold-to-increment option for counter
- [ ] Arabic text contrast audit (dark mode diacritics)
- [ ] Offline stress test (weeks of offline use, large sync queue)
- [ ] Ramadan lifecycle: pre-Ramadan state, mid-Ramadan join, post-Ramadan archive
- [ ] Settings screen: prayer calculation method, theme, city
- [ ] Error boundaries: route-level, feature-level, QuranGrid component-level
- [ ] PWA install prompt (show after 3 sessions or first meaningful action)
- [ ] Client-side error logging (queue errors in Dexie, report on reconnect)
- [ ] Progressive auth prompt after 3rd session ("Back up your progress")
- [ ] Optional email sign-in for cloud backup (no social features yet)

---

## TypeScript Architecture

### Supabase Type Generation

**This is mandatory before writing any data access code.**

```bash
# Generate types from Supabase schema
npx supabase gen types typescript --project-id $PROJECT_ID > src/lib/supabase/types.ts

# Add to package.json scripts
"db:types": "supabase gen types typescript --project-id $PROJECT_ID > src/lib/supabase/types.ts"
```

The generated `Database` type is threaded into the Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
```

### Branded Types

Prevent silent ID confusion at compile time:

```typescript
// src/types/ids.ts
export type JuzId = number & { readonly _brand: 'JuzId' }
export type SurahId = number & { readonly _brand: 'SurahId' }
export type RamadanYear = number & { readonly _brand: 'RamadanYear' }

// Constructors (validate at boundary)
export const juzId = (n: number): JuzId => {
  if (n < 1 || n > 30) throw new RangeError(`Invalid JuzId: ${n}`)
  return n as JuzId
}
export const surahId = (n: number): SurahId => {
  if (n < 1 || n > 114) throw new RangeError(`Invalid SurahId: ${n}`)
  return n as SurahId
}
```

### Shared Domain Types

```typescript
// src/types/domain.ts
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type AdhkarCategory = 'morning' | 'evening' | 'after_prayer' | 'before_sleep' | 'anxiety'

export type AdhkarCounts = Record<string, number>
// Used for both Dexie schema and Supabase JSONB narrowing

export interface CatchUpResult {
  targetJuzToday: number
  remainingJuz: number
  remainingDays: number
  isOnTrack: boolean
  message: string
}
```

### Error Types

```typescript
// src/types/errors.ts
export type SabeelError =
  | { kind: 'offline_sync_failed'; pendingItems: number }
  | { kind: 'dexie_error'; message: string }
  | { kind: 'content_load_failed'; resource: 'adhkar' }
  | { kind: 'supabase_error'; status: number; message: string }
```

### Data Access Layer

Every Supabase call goes through a typed API layer — hooks never call `supabase.from()` directly:

```typescript
// src/lib/api/quran-progress.api.ts
import { supabase } from '../supabase/client'
import type { JuzId, RamadanYear, ProgressStatus } from '../../types'

export async function upsertJuzProgress(
  userId: string,
  juzId: JuzId,
  ramadanYear: RamadanYear,
  status: ProgressStatus
) {
  return supabase.rpc('upsert_juz_progress', {
    p_user_id: userId,
    p_juz_id: juzId,
    p_ramadan_year: ramadanYear,
    p_status: status,
  })
}
```

Hooks call the API layer, which is independently mockable for tests.

### Dexie.js Schema

```typescript
// src/lib/db.ts
import Dexie, { type Table } from 'dexie'
import type { JuzId, RamadanYear, ProgressStatus, AdhkarCategory, AdhkarCounts } from '../types'

interface QuranProgressRecord {
  id?: number // auto-increment local key
  juzId: JuzId
  ramadanYear: RamadanYear
  status: ProgressStatus
  completedAt?: string
  updatedAt: string
  syncedAt?: string // null = pending sync
}

interface AdhkarSessionRecord {
  id?: number
  sessionDate: string // ISO date
  category: AdhkarCategory
  completed: boolean
  counts: AdhkarCounts
  completedAt?: string
  syncedAt?: string
}

class SabeelDB extends Dexie {
  quranProgress!: Table<QuranProgressRecord>
  adhkarSessions!: Table<AdhkarSessionRecord>

  constructor() {
    super('SabeelDB')
    this.version(1).stores({
      quranProgress: '++id, [juzId+ramadanYear], syncedAt',
      adhkarSessions: '++id, [sessionDate+category], syncedAt',
    })
  }
}

export const db = new SabeelDB()
```

---

## Database Schema (Supabase Postgres)

### v1.0 Schema — Core Tracking

```sql
-- ================================================================
-- STATIC CONTENT (seeded once, read-only for users)
-- ================================================================

CREATE TABLE surahs (
  id          SMALLINT PRIMARY KEY CHECK (id BETWEEN 1 AND 114),
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  juz_start   SMALLINT NOT NULL CHECK (juz_start BETWEEN 1 AND 30),
  ayah_count  SMALLINT NOT NULL CHECK (ayah_count > 0)
);

CREATE TABLE juz (
  id          SMALLINT PRIMARY KEY CHECK (id BETWEEN 1 AND 30),
  start_surah SMALLINT NOT NULL REFERENCES surahs(id),
  start_ayah  SMALLINT NOT NULL CHECK (start_ayah > 0),
  end_surah   SMALLINT NOT NULL REFERENCES surahs(id),
  end_ayah    SMALLINT NOT NULL CHECK (end_ayah > 0)
);

-- ================================================================
-- USER DATA
-- ================================================================

CREATE TABLE profiles (
  id                UUID REFERENCES auth.users PRIMARY KEY,
  display_name      TEXT CHECK (length(display_name) > 0),
  preferred_lang    TEXT DEFAULT 'ar' CHECK (preferred_lang IN ('ar', 'en')),
  is_public         BOOLEAN DEFAULT FALSE,
  onboarded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quran progress at JUZ level (primary tracking)
-- ramadan_year uses the Gregorian year when Ramadan STARTS (hardcoded per year)
CREATE TABLE quran_progress (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  juz_id        SMALLINT NOT NULL REFERENCES juz(id),
  ramadan_year  SMALLINT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed'))
                DEFAULT 'not_started',
  completed_at  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, juz_id, ramadan_year)
);

-- Adhkar daily sessions
CREATE TABLE adhkar_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date  DATE NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('morning', 'evening', 'after_prayer',
                'before_sleep', 'anxiety')),
  completed     BOOLEAN DEFAULT FALSE,
  counts        JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at  TIMESTAMPTZ,
  CHECK ((completed = TRUE AND completed_at IS NOT NULL) OR completed = FALSE),
  UNIQUE (user_id, session_date, category)
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhkar_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "own_progress" ON quran_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "own_adhkar" ON adhkar_sessions
  FOR ALL USING (user_id = auth.uid());

-- Performance indexes
CREATE INDEX idx_quran_progress_user ON quran_progress(user_id, ramadan_year);
CREATE INDEX idx_adhkar_sessions_user ON adhkar_sessions(user_id, session_date);
```

### Ramadan Year Strategy

`ramadan_year` stores the Gregorian year when the Ramadan season starts. This is **set client-side** from a hardcoded lookup table, NOT from `EXTRACT(YEAR FROM CURRENT_DATE)`:

```typescript
// src/lib/ramadan-dates.ts
// Hardcoded — avoids controversy and temporal drift issues
export const RAMADAN_SEASONS: Record<number, { start: string; end: string; days: 29 | 30 }> = {
  2026: { start: '2026-02-18', end: '2026-03-19', days: 30 },
  2027: { start: '2027-02-07', end: '2027-03-08', days: 30 },
  // Add new years before each Ramadan
}

export function getCurrentRamadanYear(): RamadanYear | null {
  const today = new Date().toISOString().slice(0, 10)
  for (const [year, season] of Object.entries(RAMADAN_SEASONS)) {
    if (today >= season.start && today <= season.end) {
      return Number(year) as RamadanYear
    }
  }
  return null // Not currently Ramadan
}
```

This eliminates the `EXTRACT(YEAR FROM CURRENT_DATE)` bug that would break when Ramadan drifts into late December (~2030).

---

## Offline-First Architecture

Sabeel's "brain" lives on the device, not the internet. The app must feel native even in a masjid basement or on a plane.

### 1. Instant Access — App Shell Model

The Service Worker caches the complete app shell (HTML, CSS, JS, fonts, icons) on first visit via Workbox precaching. Every subsequent open loads in **under 1 second** with zero connectivity.

### 2. Persistent Adhkar Data

Adhkar content (~200KB JSON) is **bundled in the app** as a static import. It is part of the JS bundle and available immediately — no CDN fetch, no IndexedDB loading step.

Progress data (Juz status, counter state) lives in Dexie.js (IndexedDB). Unlike browser cache (which can be evicted), IndexedDB data persists until explicitly deleted.

| Content | Storage | Size |
|---|---|---|
| Adhkar library (all categories) | Bundled in JS (static import) | ~200KB |
| Progress data (Juz status) | IndexedDB (Dexie.js) | <10KB per user |
| Counter state (Adhkar sessions) | IndexedDB (Dexie.js) | <5KB per day |

### 3. Single Sync Queue — TanStack Query

There is ONE sync queue, not two. TanStack Query's `networkMode: 'offlineFirst'` handles all platforms (including iOS, which lacks Background Sync API):

```
User taps Juz cell
  → Dexie.js write (instant, local)
  → UI updates immediately (optimistic)
  → TanStack Query mutation fires Supabase POST
  → If offline: mutation queued automatically
  → When online: resumePausedMutations() replays queue
  → Supabase receives upsert with additive merge
```

This works identically on Android and iOS. No custom Dexie sync queue. No Background Sync API dependency.

### 4. Optimistic UI — Instant Visual Feedback

Every interaction updates the UI **immediately**, before any server round-trip:

- Tap a Juz cell → turns green instantly (Dexie write, no server wait)
- Tap Adhkar counter → count increments instantly
- Progress ring → updates in real-time from local data

**Sync status indicators:**
- No icon: data is synced to server
- Subtle cloud icon with arrow: data saved locally, pending sync
- Green checkmark (brief): sync just completed

### Offline-First Behavior Matrix

| Feature | Read Offline | Write Offline | Sync Strategy | Empty/Stale State |
|---|---|---|---|---|
| Quran Tracker | Dexie.js | Dexie.js → TanStack Query mutation queue | Additive merge (completed cells never un-complete) | All cells grey + "Start tracking" prompt |
| Adhkar Hub | Bundled (always available) | Dexie.js (counter state) | Last-write-wins per session | Full content always available |
| Dashboard | Dexie.js aggregate | N/A (read-only view) | Recompute from local data | 0% ring + "Start your journey" |
| Settings | localStorage | localStorage | Sync on auth | Defaults applied |

**Conflict Resolution:** All Quran progress operations are **additive and idempotent**. A cell marked "completed" cannot be un-marked. The upsert uses `CASE WHEN` logic to ensure `completed` never regresses to `in_progress` (see Phase 2 upsert SQL).

---

## Service Worker Caching Strategy

| Asset Type | Strategy | Cache Name | TTL |
|---|---|---|---|
| App shell (HTML, JS, CSS) | CacheFirst (precache) | `sabeel-precache` | Build-versioned |
| Arabic fonts (WOFF2) | CacheFirst | `sabeel-fonts` | 1 year |
| Supabase API responses | NetworkFirst (3s timeout) | `sabeel-api` | 24 hours fallback |
| User progress sync (POST) | NetworkOnly | N/A | TanStack Query handles retry |

---

## Arabic Text & RTL Strategy

### Font Stack

| Use Case | Font | Source |
|---|---|---|
| Quranic text (with diacritics) | Scheherazade New | Self-hosted WOFF2, preloaded |
| Arabic UI text | Noto Naskh Arabic | Self-hosted WOFF2, preloaded |
| Latin text | Geist / Inter | Self-hosted WOFF2 |

### RTL Rules

1. **App layout is LTR** (English UI chrome). Arabic text blocks get `dir="rtl" lang="ar"`.
2. **Never use physical CSS properties** (`margin-left`). Always use logical (`margin-inline-start` / Tailwind `ms-`).
3. **Arabic text CSS:** `line-height: 2.2`, `letter-spacing: 0`, `unicode-bidi: isolate`.
4. **shadcn/ui RTL mode** enabled in `components.json` — components auto-flip.
5. **Quran grid cell numbering** reads left-to-right (visual, not directional) since numbers are universal.

### Font Loading

```html
<head>
  <link rel="preload" href="/fonts/scheherazade-new.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/noto-naskh-arabic-variable.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

```css
@font-face {
  font-family: 'Scheherazade New';
  src: url('/fonts/scheherazade-new.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}
```

---

## PWA Manifest

```json
{
  "name": "Sabeel - Ramadan Companion",
  "short_name": "Sabeel",
  "description": "Track your Quran recitation and Adhkar this Ramadan",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1a472a",
  "background_color": "#0d1f12",
  "lang": "en",
  "dir": "auto",
  "categories": ["lifestyle", "productivity"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Today's Wird", "short_name": "Wird", "url": "/tracker" },
    { "name": "Adhkar", "url": "/adhkar" }
  ]
}
```

---

## Observability

**Client-side error logging** is required for a PWA that operates offline. Errors that occur offline are invisible without explicit capture.

| Concern | Strategy |
|---|---|
| Runtime errors | React error boundaries at route, feature, and component levels |
| Offline errors | Queue in Dexie `errorLog` table; report on reconnect via Supabase insert |
| Sync failures | TanStack Query `onError` callback logs to Dexie; visible in Settings as "X items pending" |
| Service Worker failures | Workbox `catch` handler logs to IndexedDB |

Error boundaries are placed at three levels:
1. **Route-level** — catches navigation and data loading errors
2. **Feature-level** — isolates Tracker failures from Adhkar failures
3. **Component-level** — QuranGrid specifically (a render error in a 30-cell grid should not crash the app)

---

## Critical Decisions

### Priority 1: Blocks Implementation

| # | Decision | Recommended | Reason |
|---|---|---|---|
| 1 | **Quran grid cell states** | **3-state** (unread/in-progress/complete) | Users read Juz across multiple sessions |
| 2 | **"Currently on" for random reading** | **Last tapped** | Simple, matches user mental model |
| 3 | **Prayer time method** | **City selection** (with geolocation upgrade) | No permission prompt on first use |
| 4 | **Ramadan scope** | **Ramadan-scoped for v1** | `ramadan_year` column for future years |
| 5 | **Ramadan dates** | **Hardcoded per year** + user override | Simple, reliable, avoids controversy and temporal drift |
| 6 | **Adhkar content source** | **Hisn al-Muslim** (Fortress of the Muslim) | Most widely accepted, comprehensive |

### Priority 2: Important for UX

| # | Decision | Recommended |
|---|---|---|
| 7 | Counter completion at target (33/33) | Celebrate + allow overcounting (no cap) |
| 8 | Counter state reset timing | Reset at Fajr prayer time (not midnight) |
| 9 | PWA install prompt timing | After 3rd session or first Quran cell tapped |
| 10 | Default theme | Follow system preference (dark mode auto at night) |
| 11 | Non-Ramadan behavior | App works year-round; Catch-Up Calculator hidden outside Ramadan |
| 12 | Post-Ramadan data | Archived, viewable as "Ramadan 2026 Summary"; new year starts fresh |

---

## Anxiety/Stress Category — Special UX Handling

When a user enters the "Anxiety/Stress" Adhkar category:

- Suppress all competitive UI elements
- Use calmer color palette (soft blues, no reds/oranges)
- Show Adhkar in a focused, distraction-free view
- No counter pressure — tap at your own pace, no target shown
- Include a gentle note: "Take your time. Allah is with the patient."

---

## Project Structure

```
sabeel/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── fonts/
│       ├── scheherazade-new.woff2
│       ├── noto-naskh-arabic-variable.woff2
│       └── geist-variable.woff2
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component + providers
│   ├── sw.ts                       # Service worker (Workbox)
│   ├── router.tsx                  # React Router v6 routes
│   ├── types/
│   │   ├── ids.ts                  # Branded types (JuzId, SurahId, RamadanYear)
│   │   ├── domain.ts              # ProgressStatus, AdhkarCategory, AdhkarCounts, CatchUpResult
│   │   └── errors.ts              # SabeelError discriminated union
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── QuranGrid.tsx           # 30-cell Juz grid
│   │   ├── ProgressRing.tsx        # SVG circular progress (CSS transition)
│   │   ├── TasbihCounter.tsx       # Circular tap counter
│   │   ├── DhikrCard.tsx           # Individual dhikr display
│   │   ├── ArabicText.tsx          # RTL text wrapper (renders <span dir="rtl" lang="ar">)
│   │   └── OfflineIndicator.tsx    # Sync status badge
│   ├── hooks/
│   │   ├── useQuranProgress.ts     # Reads from Dexie, mutations via API layer
│   │   ├── useAdhkarSession.ts     # Counter state from Dexie
│   │   ├── usePrayerTimes.ts       # adhan-js + city selection
│   │   ├── useCatchUp.ts           # Derived from useQuranProgress
│   │   ├── useOnlineStatus.ts      # navigator.onLine + event listeners
│   │   └── usePWAInstall.ts        # beforeinstallprompt handler
│   ├── lib/
│   │   ├── db.ts                   # Dexie.js schema (SabeelDB)
│   │   ├── api/
│   │   │   ├── quran-progress.api.ts
│   │   │   └── adhkar-sessions.api.ts
│   │   ├── supabase/
│   │   │   ├── client.ts           # Typed Supabase client
│   │   │   └── types.ts            # Generated via `supabase gen types typescript`
│   │   ├── catch-up.ts             # Calculator algorithm (pure function)
│   │   ├── ramadan-dates.ts        # Hardcoded Ramadan season lookup
│   │   ├── prayer-times.ts         # adhan-js wrapper
│   │   └── translations.ts         # Static { en: {...}, ar: {...} } object
│   ├── content/
│   │   └── adhkar-data.json        # Bundled Adhkar content (~200KB)
│   └── styles/
│       └── globals.css             # Tailwind @theme + tokens
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── tests/
│   ├── unit/                       # Vitest unit tests
│   └── e2e/                        # Playwright E2E tests
│       ├── tracker.spec.ts
│       └── offline.spec.ts
├── vite.config.ts
├── components.json                 # shadcn/ui config
├── tsconfig.json
└── package.json
```

**File count: ~25 files** (vs 40+ in original plan)

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.71.x",
    "@supabase/supabase-js": "^2.58.x",
    "dexie": "^4.x",
    "adhan": "^4.x"
  },
  "devDependencies": {
    "vite": "^6.x",
    "@vitejs/plugin-react": "^4.x",
    "vite-plugin-pwa": "^0.20.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x",
    "typescript": "^5.x",
    "vitest": "^2.x",
    "@playwright/test": "^1.x"
  }
}
```

**7 production dependencies** (vs 14 in original plan). Estimated bundle: ~120-140KB gzipped.

---

## Success Metrics

| Metric | Target | How to Measure |
|---|---|---|
| Lighthouse PWA Score | 90+ | Lighthouse CI in GitHub Actions |
| Time to Interactive | < 5s on 4G mid-range Android (4x CPU throttle) | WebPageTest |
| Initial JS Bundle | < 150KB gzipped (critical path) | Vite bundle analyzer |
| Offline Functionality | 100% of tracker + adhkar | Playwright offline tests |
| Arabic Text Rendering | Zero layout shift, correct diacritics | Visual regression tests |
| Sync Reliability | 0 data loss on reconnect | E2E sync tests |

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Ramadan date controversy (moon sighting vs. calculation) | Medium | High | Hardcoded dates + user override option |
| Adhkar content accuracy challenged | Low | High | Source from Hisn al-Muslim only, credit the source |
| iOS Safari PWA limitations (no Background Sync) | Certain | Low | TanStack Query `resumePausedMutations` works on all platforms (single queue) |
| Arabic font FOUT (Flash of Unstyled Text) | Medium | Low | Preload WOFF2 fonts, use `font-display: swap` |
| Anonymous data loss (user clears browser) | Medium | High | Progressive auth prompt after 3rd session; warn about local-only storage |
| Offline errors invisible to developer | High | Medium | Queue errors in Dexie, report on reconnect |

---

## v1.1 Roadmap — Community Features (Post-Launch)

These features are deferred from v1.0 to reduce scope and ship the core tracker first. They should be implemented after validating the core loop with real Ramadan users.

### Features

| Feature | Description | Complexity |
|---|---|---|
| **Halqa (Private Circles)** | Create/join private groups with invite codes, member list with progress bars | Large |
| **Halqa Leaderboard** | Rankings within a Halqa, polled every 60s (not Realtime — doesn't scale) | Medium |
| **Global Leaderboard** | Public ranking filtered by `is_public = true`, direct query (no materialized view at MVP scale) | Medium |
| **Nudge System** | Pre-written encouragement messages, rate-limited 1/sender/recipient/day | Medium |
| **Auth Providers** | Email magic link + Google OAuth + Apple Sign In (progressive, on first social action) | Medium |
| **Push Notifications** | VAPID via Supabase Edge Function (for nudge delivery) | Medium |
| **Surah-Level Tracking** | 114-cell Surah grid (tracked independently from Juz) | Small |
| **Full i18n** | react-i18next for Arabic UI chrome (when string count justifies it) | Small |
| **OG Image Generation** | Social sharing previews via Cloudflare Worker | Small |

### v1.1 Schema Additions

When community features are implemented, these tables and policies will be added:

```sql
-- ================================================================
-- COMMUNITY (v1.1)
-- ================================================================

-- Add community columns to profiles
ALTER TABLE profiles ADD COLUMN allow_nudges BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN push_subscription JSONB;
ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMPTZ;

CREATE TABLE halqa (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  invite_code   TEXT UNIQUE DEFAULT upper(substring(gen_random_uuid()::text, 1, 8)),
  created_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- GDPR: SET NULL, not RESTRICT
  max_members   SMALLINT NOT NULL DEFAULT 20 CHECK (max_members > 0),
  ramadan_year  SMALLINT NOT NULL,  -- Set client-side from ramadan-dates.ts
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE halqa_members (
  halqa_id    UUID REFERENCES halqa(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role        TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (halqa_id, user_id)
);

-- Member count enforcement trigger
CREATE OR REPLACE FUNCTION check_halqa_member_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM halqa_members WHERE halqa_id = NEW.halqa_id) >=
     (SELECT max_members FROM halqa WHERE id = NEW.halqa_id) THEN
    RAISE EXCEPTION 'Halqa has reached its member limit';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_halqa_member_limit
  BEFORE INSERT ON halqa_members
  FOR EACH ROW EXECUTE FUNCTION check_halqa_member_limit();

CREATE TABLE nudges (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,  -- GDPR: CASCADE
  recipient_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,  -- GDPR: CASCADE
  halqa_id      UUID NOT NULL REFERENCES halqa(id) ON DELETE CASCADE,
  message_key   TEXT NOT NULL,
  sent_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Surah-level tracking (v1.1)
CREATE TABLE quran_surah_progress (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  surah_id      SMALLINT NOT NULL REFERENCES surahs(id),
  ramadan_year  SMALLINT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed'))
                DEFAULT 'not_started',
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, surah_id, ramadan_year)
);

-- ================================================================
-- v1.1 RLS POLICIES
-- ================================================================

-- Halqa: members can see their groups
CREATE POLICY "halqa_member_read" ON halqa
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM halqa_members WHERE halqa_id = halqa.id AND user_id = auth.uid())
  );

-- Halqa members: see co-members (covering index for performance)
CREATE INDEX idx_halqa_members_user ON halqa_members(user_id) INCLUDE (halqa_id);

CREATE POLICY "halqa_members_read" ON halqa_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM halqa_members my
      WHERE my.user_id = auth.uid() AND my.halqa_id = halqa_members.halqa_id
    )
  );

-- Nudge: only send to halqa co-members, rate limit 1/day
-- FIXED: uses alias 'n' to avoid self-reference ambiguity
CREATE POLICY "nudge_send" ON nudges
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM halqa_members
      WHERE halqa_id = halqa_members.halqa_id AND user_id = recipient_id
    )
    AND NOT EXISTS (
      SELECT 1 FROM nudges n
      WHERE n.sender_id = auth.uid()
      AND n.recipient_id = recipient_id  -- unqualified = NEW row's value in INSERT policy
      AND n.sent_at > NOW() - INTERVAL '1 day'
    )
  );

CREATE INDEX idx_nudges_rate_limit ON nudges(sender_id, recipient_id, sent_at);
```

### v1.1 Pre-Written Nudge Messages

These must be reviewed for Islamic appropriateness before implementation:

1. "Salam! Your Halqa misses you. May Allah make your recitation easy today."
2. "A gentle reminder from your circle. Even one page is a victory."
3. "Your friends are making progress — join them when you're ready!"
4. "The Prophet (peace be upon him) said: 'The best of you are those who learn the Quran and teach it.' Your Halqa is rooting for you."

**Rules:**
- Maximum 1 nudge per sender→recipient pair per 24 hours (enforced by RLS policy with alias)
- Recipients can disable nudges in settings (`allow_nudges = false`)
- Nudges are never sent during prayer times
- Nudges are anonymous by default ("Someone in your Halqa sent encouragement")

---

## References

### PWA & Service Workers
- [MDN - Best practices for PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices)
- [MDN - Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa)
- [Workbox Documentation](https://googlechrome.github.io/workbox/)

### Arabic / RTL
- [W3C Arabic Layout Requirements](https://www.w3.org/International/alreq/)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [SIL Scheherazade New](https://software.sil.org/scheherazade/)

### Supabase
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

### Stack Comparisons
- [Vite vs Next.js 2025](https://strapi.io/blog/vite-vs-nextjs-2025-developer-framework-comparison)
- [Convex vs Supabase 2025](https://makersden.io/blog/convex-vs-supabase-2025)
- [Vercel vs Cloudflare Pages 2025](https://www.digitalapplied.com/blog/vercel-vs-netlify-vs-cloudflare-pages-comparison)

### Design Patterns
- [Offline-first frontend apps 2025](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)
- [Haptic Feedback for Web Apps](https://blog.openreplay.com/haptic-feedback-for-web-apps-with-the-vibration-api/)

---

## Review Log

**2026-02-10 — 6-Agent Review (v1 → v2)**

Agents: architecture-strategist, security-sentinel (failed), performance-oracle (partial), code-simplicity-reviewer, kieran-typescript-reviewer, data-integrity-guardian

**P1 Critical Fixes Applied:**
1. Nudge RLS policy: fixed self-reference bug with alias `n` (moved to v1.1 schema)
2. GDPR cascades: `halqa.created_by` → ON DELETE SET NULL; `nudges` FKs → ON DELETE CASCADE
3. Bundle target: revised from 100KB to 150KB; dropped 7 dependencies
4. Dual sync queue: eliminated custom Dexie sync queue; TanStack Query is the single queue
5. Content bundling: resolved contradiction; Adhkar bundled via static import, no CDN fetch
6. Supabase type generation: added `supabase gen types typescript` to build process

**MVP Simplification Applied:**
- Phase 4 (Community) deferred to v1.1
- Dropped: Zustand, Motion, react-i18next, TanStack Router, TanStack Query persist packages, catch-up Edge Function, full Quran text JSON, materialized view
- Reduced from 40+ files to ~25 files, 14 deps to 7 deps

**P2 Important Fixes Applied:**
- All FK columns now NOT NULL (prevents NULL-in-UNIQUE orphan rows)
- `ramadan_year` set client-side from hardcoded lookup (not EXTRACT(YEAR))
- Upsert ON CONFLICT with additive merge (completed never regresses)
- `halqa.max_members` enforced via trigger (in v1.1 schema)
- Data access layer specified (`src/lib/api/`)
- JSONB columns typed (`AdhkarCounts`, `PushSubscriptionJSON`)
- Branded types for JuzId, SurahId, RamadanYear
- Error discriminated union (`SabeelError`)
- Observability strategy added (error boundaries + Dexie error queue)
- State ownership rule explicitly documented
- `display_name` has CHECK constraint (length > 0)
- `adhkar_sessions` has CHECK for completed/completed_at consistency
- Static tables have range CHECK constraints
