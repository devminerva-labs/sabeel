-- ================================================================
-- Sabeel v1.1 — Halaqah (private group) + leaderboard
-- ================================================================

-- Private study circle
CREATE TABLE halaqahs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 60),
  invite_code  TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ramadan_year SMALLINT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membership — one user per halaqah per Ramadan year
CREATE TABLE halaqah_members (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  halaqah_id   UUID NOT NULL REFERENCES halaqahs(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nickname     TEXT NOT NULL CHECK (length(nickname) BETWEEN 1 AND 30),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (halaqah_id, user_id),
  UNIQUE (halaqah_id, nickname)
);

-- ROW LEVEL SECURITY

ALTER TABLE halaqahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE halaqah_members ENABLE ROW LEVEL SECURITY;

-- Members can read their own halaqah
CREATE POLICY "member_can_read_halaqah" ON halaqahs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM halaqah_members
      WHERE halaqah_id = halaqahs.id AND user_id = auth.uid()
    )
  );

-- Creator can insert, update, delete their halaqah
CREATE POLICY "creator_can_manage_halaqah" ON halaqahs
  FOR ALL USING (created_by = auth.uid());

-- Any authenticated user can insert a halaqah (creator becomes member via separate insert)
CREATE POLICY "auth_can_create_halaqah" ON halaqahs
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Members can read other members in the same halaqah (for leaderboard)
CREATE POLICY "member_can_read_members" ON halaqah_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM halaqah_members self
      WHERE self.halaqah_id = halaqah_members.halaqah_id
        AND self.user_id = auth.uid()
    )
  );

-- Users can insert themselves as a member (join via invite code)
CREATE POLICY "user_can_join" ON halaqah_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can remove themselves (leave)
CREATE POLICY "user_can_leave" ON halaqah_members
  FOR DELETE USING (user_id = auth.uid());

-- LEADERBOARD: drop own-only quran_progress SELECT and replace with halaqah-aware policy
DROP POLICY "own_progress" ON quran_progress;

CREATE POLICY "own_progress_write" ON quran_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "own_progress_update" ON quran_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "own_progress_delete" ON quran_progress
  FOR DELETE USING (user_id = auth.uid());

-- Allow reading own progress OR progress of halaqah members
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

-- Performance indexes
CREATE INDEX idx_halaqah_members_halaqah ON halaqah_members(halaqah_id);
CREATE INDEX idx_halaqah_members_user ON halaqah_members(user_id);
CREATE INDEX idx_halaqahs_invite ON halaqahs(invite_code);
CREATE INDEX idx_halaqahs_year ON halaqahs(ramadan_year);
