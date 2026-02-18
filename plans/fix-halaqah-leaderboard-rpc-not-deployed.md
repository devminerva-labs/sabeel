# fix: Halaqah leaderboard returns empty data due to missing RPC function

🐛 **Type:** Bug fix
**Severity:** High — core Halaqah feature is broken for all users

---

## Problem Statement

The Halaqah leaderboard shows every member with 0 completed Juz, and the browser console reports a 404:

```
[Error] Failed to load resource: the server responded with a status of 404 ()
{
  "code": "PGRST202",
  "message": "Could not find the function public.get_halaqah_leaderboard(p_halaqah_id, p_my_user_id, p_ramadan_year) in the schema cache"
}
```

---

## Root Cause Analysis

There are **two compounding bugs**:

### Bug 1 — Migration 008 was never applied to production

The function `get_halaqah_leaderboard` is defined in:

```
supabase/migrations/008_leaderboard_rpc.sql
```

But it was never executed against the remote Supabase database. Evidence: multiple manual deploy scripts exist in the project root (`deploy_leaderboard_simple.sql`, `deploy_leaderboard_v3.sql`, `deploy_leaderboard_function.sql`), all suggesting repeated manual attempts to deploy the function — none succeeded in a durable way.

PostgREST's `PGRST202` error occurs precisely when the function **does not exist** in the database schema cache. The parameters it lists (`p_halaqah_id, p_my_user_id, p_ramadan_year`) are alphabetically sorted — this is how PostgREST reports what it searched for, confirming the function is simply absent.

**Affected file:** `supabase/migrations/008_leaderboard_rpc.sql:7`

### Bug 2 — Migration 008 is missing GRANT EXECUTE

Even if the function were deployed, the migration lacks permission grants. Compare:

- `deploy_leaderboard_simple.sql:48-49` includes:
  ```sql
  GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(...) TO authenticated;
  GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(...) TO anon;
  ```
- `supabase/migrations/008_leaderboard_rpc.sql` has **no GRANT statements**.

Without `GRANT EXECUTE`, the `authenticated` role (used by all logged-in users via the Supabase JS client) cannot call the function — it would return a permission error.

### Bug 3 — Client-side fallback also shows 0 Juz

When the RPC fails, `getLeaderboard()` falls back to a client-side join of `halaqah_members` + `quran_progress` (`src/lib/api/halaqah.api.ts:165-200`).

This fallback reads `quran_progress` from Supabase, but user progress is stored locally in **Dexie (IndexedDB)** and only syncs to Supabase on login (`src/lib/api/quran-progress.api.ts`). If a user tracked Quran progress while offline or before the sync feature existed, their `quran_progress` rows in Supabase are empty — so the fallback also shows 0.

---

## Data Flow (current, broken)

```
HalaqahPage
  └── HalaqahContent
        └── Leaderboard
              └── useHalaqah(userId)   [src/hooks/useHalaqah.ts:33-39]
                    └── getLeaderboard(halaqahId, year, userId)
                          └── supabase.rpc('get_halaqah_leaderboard', {...})
                                ↓ 404 PGRST202 — function missing
                          └── fallback: client-side join
                                ↓ quran_progress empty in Supabase
                          ← returns [] or all-zeros entries
```

---

## Proposed Fix

### Fix 1 — Add GRANT EXECUTE to migration 008 and deploy it

Update `supabase/migrations/008_leaderboard_rpc.sql` to include proper grants and `public.` schema prefix, then apply it via the Supabase SQL editor or CLI.

**`supabase/migrations/008_leaderboard_rpc.sql`** — add after function definition:

```sql
-- Grant execute permission to all authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO anon;
```

Also prefix the function name with `public.`:
```sql
-- Before:
CREATE OR REPLACE FUNCTION get_halaqah_leaderboard(...)

-- After:
CREATE OR REPLACE FUNCTION public.get_halaqah_leaderboard(...)
```

**Deployment:** Run the complete `008_leaderboard_rpc.sql` in the Supabase SQL Editor (Dashboard → SQL Editor → New query), or via:
```bash
supabase db push --linked
```

### Fix 2 — Invalidate leaderboard query after Quran progress sync

After progress syncs to Supabase, the leaderboard query cache must be invalidated so it refetches. In the Quran progress sync logic, add query invalidation:

**`src/hooks/useHalaqah.ts`** — after successful sync:

```ts
// After sync completes, refetch leaderboard
qc.invalidateQueries({ queryKey: ['halaqah-leaderboard'] })
```

### Fix 3 — Verify RPC response shape matches client expectations

Migration 008 returns `RETURNS TABLE (...)` (SETOF rows). The Supabase JS client delivers this as an `Array` of objects with snake_case keys. The existing client code at `src/lib/api/halaqah.api.ts:144-160` already handles both JSONB and array responses correctly — no changes needed here.

---

## Acceptance Criteria

- [ ] `public.get_halaqah_leaderboard` exists in the Supabase SQL schema (verify in Dashboard → Database → Functions)
- [ ] Calling the function from the Supabase SQL Editor returns member rows with correct juz counts
- [ ] Browser console no longer shows the 404 / PGRST202 error on the Halaqah page
- [ ] Leaderboard shows actual Juz completion counts from synced progress
- [ ] After a user marks a Juz complete and syncs, the leaderboard reflects the update within 30 seconds (the `refetchInterval` in `useHalaqah.ts:38`)
- [ ] The `is_me` flag correctly highlights the current user's row

---

## Implementation Steps

### Step 1: Update migration 008

Edit `supabase/migrations/008_leaderboard_rpc.sql`:
- Add `public.` schema prefix to the function name
- Add `GRANT EXECUTE` statements for `authenticated` and `anon` roles

### Step 2: Deploy the function to production

Go to the Supabase Dashboard → SQL Editor and run the updated `008_leaderboard_rpc.sql` content in full. Verify the function appears in Dashboard → Database → Functions.

### Step 3: Reload the PostgREST schema cache (if needed)

If the function is deployed but still returning PGRST202, reload the schema cache:
```sql
NOTIFY pgrst, 'reload schema';
```

### Step 4: Verify with a test query

In the Supabase SQL Editor:
```sql
SELECT * FROM public.get_halaqah_leaderboard(
  '<your-halaqah-uuid>',
  2026::SMALLINT,
  '<your-user-uuid>'
);
```

### Step 5: Clean up root-level deploy scripts

Once migration 008 is properly deployed, delete the ad-hoc scripts from the repo root:
- `deploy_leaderboard_simple.sql`
- `deploy_leaderboard_v3.sql`
- `deploy_leaderboard_function.sql`
- `setup_halaqah_complete.sql`

---

## Files to Change

| File | Change |
|------|--------|
| `supabase/migrations/008_leaderboard_rpc.sql` | Add `public.` prefix + `GRANT EXECUTE` statements |
| `deploy_leaderboard_simple.sql` | Delete (cleanup) |
| `deploy_leaderboard_v3.sql` | Delete (cleanup) |
| `deploy_leaderboard_function.sql` | Delete (cleanup) |
| `setup_halaqah_complete.sql` | Delete (cleanup) |

---

## References

### Internal

- RPC call: `src/lib/api/halaqah.api.ts:135-142`
- Fallback join: `src/lib/api/halaqah.api.ts:165-200`
- Hook with 30s polling: `src/hooks/useHalaqah.ts:33-39`
- Migration to fix: `supabase/migrations/008_leaderboard_rpc.sql:7`
- Working RPC example (no params): `supabase/migrations/005_admin_user_stats.sql` + `src/lib/api/admin.api.ts:16`
- RLS fix reference: `supabase/migrations/003_fix_halaqah_rls_recursion.sql`

### External

- Supabase PGRST202 docs: https://supabase.com/docs/reference/javascript/rpc
- PostgREST schema cache: https://postgrest.org/en/stable/references/schema_cache.html
- Supabase GRANT permissions: https://supabase.com/docs/guides/database/postgres/roles
