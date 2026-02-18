# fix: Bismillah incorrectly displayed as verse 1 in all Surahs

## Problem Statement

All surahs in the Quran reader are showing the Bismillah (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ) either:
- **As verse 1** — displayed with a verse number ﴿١﴾ making it look like a counted ayah
- **Merged into verse 1** — the Bismillah text is prepended to the first verse's Arabic text

This is theologically incorrect. The correct rules are:

| Surah | Bismillah Rule |
|-------|---------------|
| Surah 1 (Al-Fatiha) | Bismillah **IS** verse 1 — display normally |
| Surah 9 (At-Tawbah) | **No Bismillah** at all |
| All other surahs (2–8, 10–114) | Bismillah is a **basmala header**, NOT a numbered verse |

## Root Cause

The app fetches Quran data from `api.alquran.cloud/v1/juz/{n}/quran-uthmani`. The Al-Quran Cloud API returns the Bismillah as `numberInSurah: 1` (i.e., `ayah: 1`) at the start of each surah within a juz — identical in shape to any other verse. Since `fetchJuzFromAPI` in `src/lib/api/quran.api.ts` maps `ar.numberInSurah` directly to the `ayah` field and `QuranReader.tsx` renders every ayah uniformly with a verse number, the Bismillah gets rendered as verse ﴿١﴾.

**Affected files:**
- `src/lib/api/quran.api.ts:37–42` — mapping loop with no Bismillah detection
- `src/components/QuranReader.tsx:181–214` — render loop with no special Bismillah handling

## Proposed Solution

Add a `isBismillah` flag to the cached ayah record and handle display in the reader:

### Step 1 — Detect Bismillah in `quran.api.ts`

The Bismillah text in the Uthmani script is:
```
بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
```
(various diacritical forms exist — match by `numberInSurah === 1` AND surah !== 1 AND surah !== 9, or by text prefix match)

**Detection logic (reliable):**
```ts
// src/lib/api/quran.api.ts
const BISMILLAH_SURAH = 1
const NO_BISMILLAH_SURAH = 9
const BISMILLAH_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'

function isBismillahAyah(ar: AlQuranAyah): boolean {
  if (ar.surah.number === BISMILLAH_SURAH) return false  // Al-Fatiha: it's a real verse
  if (ar.surah.number === NO_BISMILLAH_SURAH) return false  // At-Tawbah: no bismillah
  return ar.numberInSurah === 1 && ar.text.startsWith('بِسْمِ')
}
```

### Step 2 — Add `isBismillah` to the ayah shape

```ts
// src/lib/db.ts — QuranCacheRecord
ayahs: Array<{
  surah: number
  ayah: number
  arabic: string
  translation: string
  isBismillah?: boolean  // true for basmala-header ayahs in non-Fatiha surahs
}>
```

Bump `CACHE_SCHEMA_VERSION` from `1` → `2` in `quran.api.ts` to force re-fetch and repopulate cache with the new field.

### Step 3 — Render Bismillah as a styled header in `QuranReader.tsx`

```tsx
// src/components/QuranReader.tsx
{ayah.isBismillah ? (
  // Render as unlabeled basmala — no verse number, distinct style
  <div className="text-center py-3">
    <ArabicText as="p" className="text-2xl text-muted-foreground">
      {ayah.arabic}
    </ArabicText>
  </div>
) : (
  // Normal verse button
  <button onClick={...} ...>
    <ArabicText as="p" className="text-2xl leading-[2.8]">
      {ayah.arabic} ﴿{ayah.ayah}﴾
    </ArabicText>
  </button>
)}
```

The Bismillah header should appear **between** the surah title header and the first numbered verse.

## Acceptance Criteria

- [ ] Surah 1 (Al-Fatiha): Bismillah displays as verse ﴿١﴾ (unchanged, correct)
- [ ] Surah 9 (At-Tawbah): No Bismillah appears at all (unchanged, correct)
- [ ] All other surahs: Bismillah renders as a centered, unlabeled basmala header — not a numbered verse
- [ ] Tapping the Bismillah header does NOT open the AyahDetailSheet (it is not an ayah)
- [ ] Verse numbers continue from ﴿١﴾ for the actual first verse after the basmala
- [ ] `CACHE_SCHEMA_VERSION` bumped to `2` — existing cached data is invalidated and re-fetched
- [ ] No regression in Juz navigation, prefetching, or offline caching behavior

## Files to Change

| File | Change |
|------|--------|
| `src/lib/api/quran.api.ts` | Add `isBismillahAyah()` helper, set `isBismillah` flag in mapping loop, bump `CACHE_SCHEMA_VERSION` to `2` |
| `src/lib/db.ts` | Add `isBismillah?: boolean` to `QuranCacheRecord.ayahs` array type |
| `src/components/QuranReader.tsx` | Branch render logic — basmala header vs. tappable verse button |

## Edge Cases

- **Juz 1**: Contains Surah 1 (Bismillah is verse 1) and Surah 2 (Bismillah is header)
- **Juz boundary surahs**: A surah may start mid-juz; the first ayah returned by the API for that surah in that juz should still be detected as Bismillah
- **AyahDetailSheet**: Ensure `selectedAyah` is never set to a Bismillah-header ayah (no tap handler needed on it)
- **Text matching**: Al-Quran Cloud uses Uthmani orthography with specific Unicode. Use `ar.text.startsWith('بِسْمِ')` as primary check alongside `numberInSurah === 1` as guard

## References

- Affected API: `https://api.alquran.cloud/v1/juz/{n}/quran-uthmani`
- Fetch logic: `src/lib/api/quran.api.ts:21–43`
- Render loop: `src/components/QuranReader.tsx:181–214`
- Cache schema: `src/lib/db.ts:43–48`
- Cache version constant: `src/lib/api/quran.api.ts:6`
