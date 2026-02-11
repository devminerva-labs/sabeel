# Testing Guide

## Manual Testing — IndexedDB (Dexie)

Open DevTools → **Application** → **Storage** → **IndexedDB** → **SabeelDB**

### Tables to inspect

| Table | What to check |
|-------|--------------|
| `quranProgress` | Rows for each Juz you've tapped — `status` should cycle: `not_started` → `in_progress` → `completed` |
| `adhkarSessions` | One row per `[sessionDate + category]` pair; `counts` object should increment per dhikr |
| `prayerLogs` | One row per `[date + prayer]`; `status` should be `prayed` or `missed` |
| `voluntaryPrayers` | One row per `[date + type]`; present = completed, absent = not done |
| `quranCache` | One row per Juz opened; `ayahs` array should have 100–200+ items |
| `tafsirCache` | One row per ayah tapped; `transliteration` + `tafsir` fields |

### Steps

1. Run the dev server: `npm run dev`
2. Open http://localhost:5173
3. Navigate to **Quran** — tap any Juz tile twice. Check `quranProgress` for a new row.
4. Open a Juz, tap a verse. Check `tafsirCache` for the fetched row.
5. Navigate to **Prayer** — tap a fard prayer. Check `prayerLogs`.
6. Navigate to **Adhkar** — increment any dhikr counter. Check `adhkarSessions`.

To clear all data: DevTools → Application → IndexedDB → SabeelDB → right-click → Delete database.

---

## Unit Tests (Vitest + fake-indexeddb)

### Run tests

```bash
npm test
```

### Test file location

`src/hooks/__tests__/usePrayerLog.test.ts`

### Adding tests

Follow the existing test as a pattern. Use `fake-indexeddb/auto` to mock IndexedDB in Node.js. Wrap hook renders in a React Query provider if the hook uses `useQuery`.
