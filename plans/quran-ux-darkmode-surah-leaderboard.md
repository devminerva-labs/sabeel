# feat: Quran UX overhaul, dark mode fix, Surah list, testing guide & leaderboard foundation

## Overview

Six related issues reported after the Prayer Tracker integration:
1. Quran reader is slow to load on first open
2. Quran text is hard to read — translation clutters the Arabic
3. Juz grid is confusing for users who don't know Islamic terminology
4. Dark mode looks broken (appears light)
5. No way to verify that prayer/Quran tracking actually saves data
6. Dashboard is bare and the leaderboard (mentioned in the original plan) is missing

---

## Problem Statement

### 1. Slow Quran Reader

`useQuranReader` fires **two parallel `fetch()` calls** to `api.alquran.cloud` (Arabic + English editions) every time a Juz is opened for the first time. On a typical mobile connection (3G/LTE) this can take 2–5 seconds. The Dexie cache means *second* opens are instant, but the first open has no skeleton or progressive display — just a spinner. No prefetching of adjacent Juz either.

**Root cause:**
- `src/lib/api/quran.api.ts:19` — `Promise.all([arabicRes, englishRes])` — sequential JSON parse after parallel fetch, no streaming
- `src/hooks/useQuranReader.ts:6` — no `placeholderData` or optimistic display
- No background prefetch when a user hovers/taps a Juz tile before opening the reader

### 2. Quran Reader Text Visibility & Ayah Detail

Current `src/components/QuranReader.tsx:177`:
```tsx
<ArabicText as="p" className="text-xl leading-[2.4]">
  {ayah.arabic} ﴿{ayah.ayah}﴾
</ArabicText>
<p className="text-sm text-muted-foreground leading-relaxed">
  {ayah.ayah}. {ayah.translation}
</p>
```
Translation is always shown inline, cluttering the Arabic reading experience. There's no transliteration and no deeper context (tafsir, stories about the verse). The Quran should be read with Arabic prominent — tapping an ayah should reveal its full detail.

### 3. Juz Grid Confusion

The Quran page (`src/pages/QuranPage.tsx`) shows a 5×6 grid of numbered tiles (1–30) with tiny start-surah names. Most non-Arabic speakers don't know what "Juz 14" is — they know "Surah Al-Kahf" or "Surah Yaseen". There's no Surah list page (`/quran/surah` route doesn't exist).

### 4. Dark Mode Not Working

**Root cause identified:** The project uses **Tailwind CSS v4** (CSS-first config via `@theme` in `globals.css`). The `useTheme` hook applies a `.dark` class to `<html>`, and the CSS variables in `.dark {}` selector DO update correctly. However, Tailwind v4's `dark:` utility variants use `prefers-color-scheme: dark` media query by **default** — NOT the `.dark` class — unless explicitly configured with:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This line is **missing** from `src/styles/globals.css`. Result: CSS variables switch correctly (backgrounds change), but any component using `dark:text-green-300`, `dark:text-amber-300`, etc. never activates. The dark background (#0d1f12) shows but text colours remain light-mode values, making the app look like a "half-dark" broken state.

**Fix is one line in globals.css.**

### 5. No Testing Workflow

There are no unit or integration tests for:
- `usePrayerLog` (Dexie writes/reads)
- `useVoluntaryPrayers` (Dexie writes/reads)
- `useQuranProgress` (Dexie writes/reads)

Manual testing is possible via DevTools but the team needs a documented workflow.

### 6. Leaderboard Missing

Per `plans/sabeel-ramadan-companion.md:17`:
> v1.1 Scope: Community features (Halqa, leaderboards, nudges, auth providers)

The leaderboard was never in v1.0 scope. The Dashboard currently shows a Bismillah header + progress ring + two quick-action buttons. It needs improvement with more meaningful stats. The leaderboard requires Supabase auth (v1.1).

---

## Technical Considerations

### Dark Mode (Critical — 1 line fix)
- `src/styles/globals.css` needs `@custom-variant dark (&:where(.dark, .dark *));` after the `@import "tailwindcss"` line
- Tailwind v4 docs confirm this is required for class-based dark mode
- The `.dark` CSS variables overrides are correct — only the variant registration is missing

### Quran Performance
- `src/lib/api/quran.api.ts` — consider streaming or skeleton data (show Arabic while English loads)
- Add `prefetchQuery` in `QuranPage` when hovering/selecting a Juz tile
- Consider storing a lightweight ayah-count-only index to show skeletons immediately

### Surah List Page
- `src/components/QuranReader.tsx` already has all 114 `SURAH_NAMES` with Arabic + English
- Need `src/content/surah-data.ts` with surah metadata (number, name, revelation type, verse count, Juz it starts in)
- New route: `/quran/surah` — list of 114 surahs sorted by number
- Clicking a surah navigates to the reader at that surah's starting Juz
- The QuranPage should have a tab/toggle: **Juz View** | **Surah View**

### Translation Toggle
- Add `showTranslation` state to `QuranReader`
- Persist preference in `localStorage` (key: `sabeel_show_translation`)
- Arabic text should increase to `text-2xl` when translation is hidden

### Testing
- Use Vitest + `fake-indexeddb` for unit tests of Dexie hooks
- Manual testing workflow: DevTools → Application → IndexedDB → SabeelDB

### Dashboard Improvement (without leaderboard)
- Add today's prayer completion count
- Add today's adhkar completion status
- Leaderboard placeholder card linking to v1.1 waitlist

---

## Acceptance Criteria

### Phase 1 — Dark Mode Fix (1 line)
- [ ] `src/styles/globals.css`: Add `@custom-variant dark (&:where(.dark, .dark *));`
- [ ] Setting dark mode in Settings actually makes the app visually dark
- [ ] All `dark:` variants (text colours, backgrounds) activate correctly
- [ ] System mode correctly follows OS preference

### Phase 2 — Quran Reader UX: Ayah Detail Panel
- [ ] Arabic text is displayed prominently (`text-2xl leading-[2.8]`) — no inline translation by default
- [ ] Tapping any ayah opens a **bottom sheet / detail panel** showing:
  - Arabic text (large)
  - Transliteration (romanised pronunciation)
  - Translation (English, Sahih International)
  - Tafsir summary (brief contextual note or story about the verse)
  - Surah + ayah reference (e.g. "Al-Baqarah 2:255")
- [ ] Panel is dismissable by swiping down or tapping outside
- [ ] Skeleton placeholder shows immediately while API loads
- [ ] Adjacent Juz is prefetched when a Juz tile is selected

### Phase 3 — Surah List
- [ ] `/quran` page has a "By Surah" tab alongside the existing "By Juz" tab
- [ ] Surah list shows: surah number, Arabic name, English name, revelation type, verse count
- [ ] Tapping a surah opens the QuranReader at that surah's Juz
- [ ] Surah search/filter input (by name or number)
- [ ] No new route needed — inline tab within QuranPage

### Phase 4 — Dashboard Improvements
- [ ] Dashboard shows today's prayer count (X/5 prayed)
- [ ] Dashboard shows today's adhkar completion (how many categories done)
- [ ] Dashboard shows Quran reading streak (days in a row with at least 1 Juz marked)
- [ ] Leaderboard card is a placeholder ("Coming in v1.1 — invite your Halqa")

### Phase 5 — Testing Workflow
- [ ] `TESTING.md` documents manual DevTools testing workflow for Dexie data
- [ ] At least one Vitest unit test for `usePrayerLog` using `fake-indexeddb`
- [ ] README updated with testing instructions

---

## Implementation Plan

### Phase 1: Dark Mode Fix

**File:** `src/styles/globals.css`

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* ... existing theme ... */
}
```

This is the only change required. Tailwind v4 will then use the `.dark` class applied by `useTheme` to activate all `dark:` variants.

Also update `vite.config.ts` PWA shortcuts to use new `/quran` path instead of `/tracker`.

### Phase 2: Ayah Detail Bottom Sheet

**Design:** Arabic text flows in a clean, large font. Each ayah is a tappable `<button>`. Tapping opens a bottom sheet (`AyahDetailSheet`) that slides up from the bottom.

**New component:** `src/components/AyahDetailSheet.tsx`

```tsx
// src/components/AyahDetailSheet.tsx (outline)
interface AyahDetailSheetProps {
  ayah: { surah: number; ayah: number; arabic: string; translation: string } | null
  onClose: () => void
}
// Renders: arabicText (large), transliteration, translation, tafsir summary
// Dismissed via backdrop click or swipe-down
```

**New data source:** `src/lib/api/tafsir.api.ts`

- Use `api.alquran.cloud/v1/ayah/{surahNumber}:{ayahNumber}/en.muyassar` for short English tafsir
- Cache in Dexie `quranCache` or a new `tafsirCache` table (keyed by `surah:ayah`)
- Transliteration: available from `api.alquran.cloud/v1/ayah/{ref}/en.transliteration`

**File:** `src/components/QuranReader.tsx`

- Change each ayah row from a `<div>` to a `<button onClick={() => setSelectedAyah(ayah)}>`
- Arabic text: `className="text-2xl leading-[2.8]"` — prominent
- Remove inline translation paragraph — content moves to the detail sheet
- Add `<AyahDetailSheet ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />`

**New Dexie table (optional — for tafsir caching):**
```typescript
// src/lib/db.ts — add to version 4
tafsirCache: 'surahAyah' // key: "2:255"
```

### Phase 3: Quran Loading Skeleton

**File:** `src/hooks/useQuranReader.ts`

Add `placeholderData` to `useQuery` that returns an array of empty skeleton objects (based on known Juz lengths).

**File:** `src/components/QuranReader.tsx`

Replace full-page spinner with inline skeleton rows that pulse while loading.

**File:** `src/pages/QuranPage.tsx`

Add `queryClient.prefetchQuery()` on Juz tile hover/focus:
```tsx
// src/pages/QuranPage.tsx (outline)
const queryClient = useQueryClient()
onMouseEnter={() => queryClient.prefetchQuery({
  queryKey: ['quran-juz', juz.id],
  queryFn: () => getJuzCached(juz.id),
  staleTime: Infinity,
})
```

### Phase 4: Surah List Tab

**New file:** `src/content/surah-data.ts` — 114 surah entries with `{ id, arabicName, englishName, revelationType, verseCount, juz }`.

**File:** `src/pages/QuranPage.tsx`

Add `view: 'juz' | 'surah'` state. Render `SurahListView` when `view === 'surah'`.

**New component:** `src/components/SurahList.tsx` — scrollable list of 114 surahs with search.

### Phase 5: Dashboard Stats

**File:** `src/pages/DashboardPage.tsx`

Import `usePrayerLog`, `useVoluntaryPrayers`, `useAdhkarSessions`.
Add stats bar:
- Prayer: `{prayedCount}/5 prayed today`
- Adhkar: `{completedCategories}/{totalCategories} categories`
- Leaderboard placeholder card

### Phase 6: Testing Setup

**New file:** `src/hooks/__tests__/usePrayerLog.test.ts`

```typescript
// src/hooks/__tests__/usePrayerLog.test.ts (outline)
import 'fake-indexeddb/auto'
import { renderHook, act } from '@testing-library/react'
import { usePrayerLog } from '../usePrayerLog'
```

**New file:** `TESTING.md` — DevTools manual testing guide.

---

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Tailwind v4 dark mode fix may not catch all edge cases | Test all pages in dark mode after fix |
| alquran.cloud API rate limits on prefetch | Only prefetch on hover with 300ms debounce |
| 114-surah dataset size | Static file, ~5KB, no runtime cost |
| fake-indexeddb may not match all Dexie v4 behaviour | Use Dexie's own `Dexie.dependencies.indexedDB = require('fake-indexeddb')` pattern |
| Leaderboard scope creep | Explicitly defer all Supabase auth to v1.1 — only add a UI placeholder |

---

## Open Questions Before Implementation

1. **Ayah detail data sources:** The plan uses `alquran.cloud` for tafsir (en.muyassar) and transliteration. Are these the preferred editions, or should the user be able to select a tafsir edition? **Recommendation:** Start with en.muyassar (short, accessible), add edition selector in Settings later.

2. **Surah navigation:** When user taps a Surah, should the reader open at the first ayah of that Surah specifically, or at the beginning of the Juz that contains it? The API returns full Juz data — we'd need to scroll to the correct surah header.

3. **Dashboard reading streak:** How to define a "streak"? Days where at least 1 Juz status changed? Or days where at least 1 Juz was marked `completed`?

4. **Leaderboard scope for v1.1:** The original plan mentions "Halqa circles" (private groups). Should v1.1 also have a global anonymous leaderboard, or friends-only? Privacy implication: users must opt-in.

5. **Prayer times calculation:** `src/lib/prayer-times.ts` defaults to Makkah coords and UmmAlQura method. Should Settings page have a "Detect my location" button that calls `navigator.geolocation`? This is a prerequisite for accurate prayer times.

---

## References

### Internal
- `src/styles/globals.css:40` — `.dark {}` CSS variable overrides (correct)
- `src/styles/globals.css:1` — `@import "tailwindcss"` (missing `@custom-variant dark` after this)
- `src/components/QuranReader.tsx:128` — main reader component
- `src/hooks/useQuranReader.ts:6` — React Query wrapper
- `src/lib/api/quran.api.ts:18` — dual API fetch
- `src/lib/prayer-times.ts:22` — defaults to Makkah
- `plans/sabeel-ramadan-companion.md:17` — v1.1 leaderboard scope
- `src/pages/DashboardPage.tsx` — current dashboard

### External
- [Tailwind v4 Dark Mode — class-based](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark (&:where(.dark, .dark *));`
- [React Query v5 — prefetchQuery](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientprefetchquery)
- [Dexie.js — Best Practices](https://dexie.org/docs/Tutorial/Best-Practices)
- [fake-indexeddb — Testing Dexie](https://github.com/dumbmatter/fakeIndexedDB)
- [alquran.cloud API](https://alquran.cloud/api) — rate limits unknown, use conservatively

---

## Surah Data ERD (new content file)

```
SurahData {
  id: number          // 1–114
  arabicName: string  // الفاتحة
  englishName: string // Al-Fatiha
  transliteration: string // Al-Fatihah
  revelationType: 'meccan' | 'medinan'
  verseCount: number  // 7
  juzStart: number    // 1 (which Juz this surah begins in)
}
```

No DB changes needed — this is a static content file similar to `juz-data.ts`.
