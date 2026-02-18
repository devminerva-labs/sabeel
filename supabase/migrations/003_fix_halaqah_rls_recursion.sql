-- ================================================================
-- Fix infinite recursion in halaqah_members RLS policy
-- The SELECT policy on halaqah_members referenced halaqah_members
-- in its own subquery, causing infinite recursion.
-- Fix: use a SECURITY DEFINER function to bypass RLS for the check.
-- ================================================================

-- Helper function that checks membership without going through RLS
CREATE OR REPLACE FUNCTION is_halaqah_member(p_halaqah_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM halaqah_members
    WHERE halaqah_id = p_halaqah_id AND user_id = p_user_id
  );
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "member_can_read_members" ON halaqah_members;

-- Recreate using the security definer function (no recursion)
CREATE POLICY "member_can_read_members" ON halaqah_members
  FOR SELECT USING (
    is_halaqah_member(halaqah_id, auth.uid())
  );

-- Also fix the halaqahs read policy (same issue — references halaqah_members under RLS)
DROP POLICY IF EXISTS "member_can_read_halaqah" ON halaqahs;

CREATE POLICY "member_can_read_halaqah" ON halaqahs
  FOR SELECT USING (
    created_by = auth.uid()
    OR is_halaqah_member(id, auth.uid())
  );

-- Fix quran_progress leaderboard policy (also joins halaqah_members under RLS)
DROP POLICY IF EXISTS "own_or_halaqah_member_progress" ON quran_progress;

CREATE POLICY "own_or_halaqah_member_progress" ON quran_progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM halaqah_members my_m
      WHERE my_m.user_id = auth.uid()
        AND is_halaqah_member(my_m.halaqah_id, quran_progress.user_id)
    )
  );
