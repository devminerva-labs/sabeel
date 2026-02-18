# feat: Halaqah — Auth, Private Groups & Leaderboard

## Overview

Add optional authentication and a private group (Halaqah) system to Sabeel. Members of a Halaqah can see each other's Ramadan progress on a leaderboard, identified only by a self-chosen nickname. Login is never required — the app continues to work fully offline and without an account.

---

## Problem Statement

The dashboard already has a placeholder:
> "Compete with your circle — coming in v1.1. Invite your Halaqah · Private groups · Anonymous leaderboard"

A Halaqah is a study circle — a small group of Muslims who hold each other accountable. This feature makes that accountability concrete: members can see where everyone is in their Quran reading, who has prayed, and who has completed their adhkar. The competition is private, anonymous by default, and rooted in a genuine Islamic practice.

---

## Islamic Foundation

The concept of a Halaqah (حلقة — circle) is one of the oldest forms of Islamic learning. The Prophet (ﷺ) said:

> "No group of people gather together in a house from the houses of Allah, reciting the Book of Allah and studying it among themselves, except that tranquility descends upon them, mercy covers them, the angels surround them, and Allah makes mention of them to those in His presence."
>
> — Sahih Muslim 2699

Mutual accountability (muhasaba) is also a recognised principle. Umar ibn al-Khattab said: "Call yourselves to account before you are called to account." This feature gives that call a structure.

---

## What Already Exists

- `src/lib/supabase/client.ts` — nullable Supabase client, optional by design
- `supabase/migrations/001_initial_schema.sql` — `profiles`, `quran_progress`, `adhkar_sessions` tables with RLS
- `src/lib/api/quran-progress.api.ts` — `upsertJuzProgress`, `fetchAllProgress` (already sync-aware)
- `src/types/domain.ts` — `ProgressStatus`, `RamadanYear`, `JuzId` etc.
- `@supabase/supabase-js ^2.49.0` installed

**Missing:** auth UI, Halaqah tables, leaderboard query, sync trigger on login, group invite flow.

---

## Proposed Solution

### Architecture

```
User (no account) ──── Local Dexie only ──── works forever, no change

User (with account, no halaqah) ──── Local Dexie + Supabase sync

User (with account + halaqah) ──── Local Dexie + Supabase sync
                                    + Halaqah leaderboard (read others' progress)
```

Login is triggered from a "Join a Halaqah" prompt on the dashboard, or from a `/login` page. The rest of the app is untouched.

---

## Database Schema — New Migration

### `supabase/migrations/002_halaqah.sql`

```sql
-- Halaqah (private group)
CREATE TABLE halaqahs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 60),
  invite_code  TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ramadan_year SMALLINT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membership in a halaqah (one user can be in one halaqah per Ramadan year)
CREATE TABLE halaqah_members (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  halaqah_id   UUID NOT NULL REFERENCES halaqahs(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nickname     TEXT NOT NULL CHECK (length(nickname) BETWEEN 1 AND 30),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (halaqah_id, user_id),
  UNIQUE (halaqah_id, nickname)
);

-- RLS
ALTER TABLE halaqahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE halaqah_members ENABLE ROW LEVEL SECURITY;

-- Users can read halaqahs they are a member of
CREATE POLICY "member_can_read_halaqah" ON halaqahs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM halaqah_members
      WHERE halaqah_id = halaqahs.id AND user_id = auth.uid()
    )
  );

-- Creator can update/delete their halaqah
CREATE POLICY "creator_can_manage_halaqah" ON halaqahs
  FOR ALL USING (created_by = auth.uid());

-- Members can read other members in the same halaqah
CREATE POLICY "member_can_read_members" ON halaqah_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM halaqah_members self
      WHERE self.halaqah_id = halaqah_members.halaqah_id
        AND self.user_id = auth.uid()
    )
  );

-- Users can insert themselves as members (join via invite code)
CREATE POLICY "user_can_join" ON halaqah_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can remove themselves
CREATE POLICY "user_can_leave" ON halaqah_members
  FOR DELETE USING (user_id = auth.uid());

-- Allow members to read each other's quran_progress (for leaderboard)
-- Drop the old own-only policy and replace with halaqah-aware policy
DROP POLICY "own_progress" ON quran_progress;

CREATE POLICY "own_or_halaqah_member_progress" ON quran_progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM halaqah_members my_m
      JOIN halaqah_members their_m ON their_m.halaqah_id = my_m.halaqah_id
      WHERE my_m.user_id = auth.uid()
        AND their_m.user_id = quran_progress.user_id
    )
  );

CREATE POLICY "own_progress_write" ON quran_progress
  FOR ALL USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_halaqah_members_halaqah ON halaqah_members(halaqah_id);
CREATE INDEX idx_halaqah_members_user ON halaqah_members(user_id);
CREATE INDEX idx_halaqahs_invite ON halaqahs(invite_code);
```

---

## Implementation Phases

### Phase 1 — Auth Layer

**New files:**
- `src/lib/api/auth.api.ts`
- `src/hooks/useAuth.ts`
- `src/pages/LoginPage.tsx`
- `src/pages/AuthCallbackPage.tsx` (magic link redirect handler)

**`src/lib/api/auth.api.ts`**
```ts
// signInWithEmail(email, password)
// signUpWithEmail(email, password)
// signInWithMagicLink(email)
// signOut()
// getSession()
```

**`src/hooks/useAuth.ts`**
```ts
// Returns: { user, session, isLoading, signIn, signUp, signOut, sendMagicLink }
// Listens to supabase.auth.onAuthStateChange
// On sign-in: triggers local→Supabase sync (see Phase 3)
```

**`src/pages/LoginPage.tsx`** — route: `/login`
- Tab toggle: "Sign in" / "Create account" / "Magic link"
- Email + password fields
- On success → redirect to `/app/halaqah` or back to where they came from
- "Continue without account" link back to `/app`

**Router additions:**
```ts
{ path: '/login', element: <LoginPage /> }
{ path: '/auth/callback', element: <AuthCallbackPage /> }
```

**Dashboard change:** "Join a Halaqah" button → if not logged in, goes to `/login?next=/app/halaqah`

---

### Phase 2 — Halaqah UI

**New files:**
- `src/lib/api/halaqah.api.ts`
- `src/hooks/useHalaqah.ts`
- `src/pages/HalaqahPage.tsx`

**Route:** `/app/halaqah` — added to Layout nav (replacing the placeholder)

**`src/lib/api/halaqah.api.ts`**
```ts
// createHalaqah(name, nickname, ramadanYear) → { halaqah, member }
// joinHalaqah(inviteCode, nickname) → { halaqah, member }
// leaveHalaqah(halaqahId)
// getMyHalaqah(userId, ramadanYear) → halaqah | null
// getLeaderboard(halaqahId, ramadanYear) → LeaderboardEntry[]
```

**`LeaderboardEntry` shape:**
```ts
interface LeaderboardEntry {
  nickname: string
  juzCompleted: number   // count of completed juz
  juzInProgress: number
  isMe: boolean          // highlight current user's row
}
```

**`src/pages/HalaqahPage.tsx`** — three states:
1. **Not logged in** → prompt to sign in
2. **Logged in, no halaqah** → "Create a Halaqah" form OR "Join with code" input
3. **In a halaqah** → leaderboard table + invite code share panel

**Leaderboard table columns:** Rank · Nickname · Juz completed · Juz in progress

---

### Phase 3 — Local → Supabase Sync

**Modified files:**
- `src/hooks/useAuth.ts` — trigger sync on login
- `src/lib/api/quran-progress.api.ts` — add `syncLocalProgress(userId)`

**Sync logic in `syncLocalProgress`:**
```ts
// 1. Read all QuranProgressRecords from Dexie where syncedAt is null
// 2. Batch upsert to Supabase quran_progress table
// 3. Update syncedAt on the local Dexie records
// 4. On conflict (server newer) → take server value
```

**When sync runs:**
- On login (one-time catch-up)
- When a juz status changes AND user is logged in (real-time)

The `QuranProgressRecord` in Dexie already has a `syncedAt` field — use it as the sync marker.

---

## New Files Summary

| File | Purpose |
|------|---------|
| `supabase/migrations/002_halaqah.sql` | Halaqah + member tables, updated RLS |
| `src/lib/api/auth.api.ts` | Supabase auth calls |
| `src/lib/api/halaqah.api.ts` | CRUD + leaderboard query |
| `src/hooks/useAuth.ts` | Auth state, session listener, sync trigger |
| `src/hooks/useHalaqah.ts` | Halaqah state + leaderboard data |
| `src/pages/LoginPage.tsx` | Sign in / sign up / magic link UI |
| `src/pages/AuthCallbackPage.tsx` | Magic link redirect handler |
| `src/pages/HalaqahPage.tsx` | Create/join/view halaqah + leaderboard |

**Modified files:**

| File | Change |
|------|--------|
| `src/router.tsx` | Add `/login`, `/auth/callback`, `/app/halaqah` routes |
| `src/components/Layout.tsx` | Add Halaqah to nav (replacing placeholder) |
| `src/pages/DashboardPage.tsx` | Replace leaderboard placeholder with "Open Halaqah" link |
| `src/lib/api/quran-progress.api.ts` | Add `syncLocalProgress` function |

---

## Acceptance Criteria

### Auth
- [ ] User can sign up with email + password
- [ ] User can sign in with email + password
- [ ] User can request a magic link (passwordless)
- [ ] Magic link redirects to `/auth/callback` and then to `/app/halaqah`
- [ ] User can sign out
- [ ] App works fully without any account (no regression)
- [ ] Session persists across page refreshes

### Halaqah
- [ ] Logged-in user can create a halaqah with a name and nickname
- [ ] Creating generates a unique 8-character invite code
- [ ] User can join an existing halaqah by entering an invite code and choosing a nickname
- [ ] Nicknames are unique per halaqah (enforced by DB UNIQUE constraint)
- [ ] User can only be in one halaqah per Ramadan year
- [ ] User can leave a halaqah
- [ ] Invite code is shareable (copy to clipboard button)

### Leaderboard
- [ ] Leaderboard shows all members of the halaqah, ranked by juz completed
- [ ] Each row shows: rank, nickname, juz completed count, in-progress count
- [ ] Current user's row is visually highlighted
- [ ] Real names are never shown (nickname only)
- [ ] Leaderboard only shows the current Ramadan year's data

### Sync
- [ ] On login, local Dexie progress syncs to Supabase
- [ ] After sync, updating a juz status syncs immediately (if online)
- [ ] Offline changes are queued (`syncedAt = null`) and sync when online + logged in
- [ ] No data loss on conflict (server and local are merged, not overwritten)

---

## Edge Cases

- **User creates account mid-Ramadan** — all past local progress should sync on first login
- **Multiple devices** — Supabase is source of truth when logged in; local Dexie is used for offline reads
- **Halaqah creator leaves** — allow creator to transfer ownership OR delete halaqah
- **Duplicate invite code join** — `UNIQUE (halaqah_id, user_id)` prevents double-joining
- **Nickname already taken in halaqah** — `UNIQUE (halaqah_id, nickname)` returns a clear error
- **Supabase unavailable** — catch errors in all API calls, show "sync pending" state, never crash

---

## Non-Goals (v1.1 scope)

- Prayer and adhkar data is NOT synced or shown in the leaderboard (Quran progress only for now)
- No push notifications for group activity
- No halaqah chat or messaging
- No public leaderboards (halaqah is always private)

---

## References

### Internal
- Auth client: `src/lib/supabase/client.ts`
- Existing sync API: `src/lib/api/quran-progress.api.ts`
- Current DB schema: `supabase/migrations/001_initial_schema.sql`
- Profile table: `001_initial_schema.sql:25–31`
- Dexie schema + `syncedAt` field: `src/lib/db.ts:4–11`
- Leaderboard placeholder: `src/pages/DashboardPage.tsx:119–127`
- RamadanYear type: `src/types/ids.ts:4`

### External
- Supabase Auth docs: https://supabase.com/docs/guides/auth
- Supabase RLS guide: https://supabase.com/docs/guides/auth/row-level-security
- Magic link setup: https://supabase.com/docs/guides/auth/passwordless-login/auth-magic-link
- Supabase JS client v2: https://supabase.com/docs/reference/javascript
