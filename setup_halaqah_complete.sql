-- ============================================================
-- COMPLETE HALAQAH SETUP - Run this entire file in Supabase
-- ============================================================

-- Step 1: Create helper function to check membership (fixes RLS recursion)
DROP FUNCTION IF EXISTS is_halaqah_member;

CREATE FUNCTION is_halaqah_member(p_halaqah_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM halaqah_members
    WHERE halaqah_id = p_halaqah_id AND user_id = p_user_id
  );
$$;

GRANT EXECUTE ON FUNCTION is_halaqah_member(UUID, UUID) TO authenticated;

-- Step 2: Fix RLS policies (drop and recreate)
DROP POLICY IF EXISTS "member_can_read_members" ON halaqah_members;
DROP POLICY IF EXISTS "member_can_read_halaqah" ON halaqahs;
DROP POLICY IF EXISTS "own_or_halaqah_member_progress" ON quran_progress;

CREATE POLICY "member_can_read_members" ON halaqah_members
  FOR SELECT USING (is_halaqah_member(halaqah_id, auth.uid()));

CREATE POLICY "member_can_read_halaqah" ON halaqahs
  FOR SELECT USING (
    created_by = auth.uid() OR is_halaqah_member(id, auth.uid())
  );

CREATE POLICY "own_or_halaqah_member_progress" ON quran_progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM halaqah_members my_m
      WHERE my_m.user_id = auth.uid()
        AND is_halaqah_member(my_m.halaqah_id, quran_progress.user_id)
    )
  );

-- Step 3: Create leaderboard RPC function
DROP FUNCTION IF EXISTS get_halaqah_leaderboard;

CREATE FUNCTION get_halaqah_leaderboard(
    p_halaqah_id UUID,
    p_ramadan_year SMALLINT,
    p_my_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'nickname', nickname,
            'juz_completed', juz_completed,
            'juz_in_progress', juz_in_progress,
            'is_me', is_me
        ) ORDER BY juz_completed DESC, juz_in_progress DESC
    ), '[]'::jsonb)
    INTO result
    FROM (
        SELECT 
            m.nickname,
            COALESCE(SUM(CASE WHEN qp.status = 'completed' THEN 1 ELSE 0 END), 0)::INT as juz_completed,
            COALESCE(SUM(CASE WHEN qp.status = 'in_progress' THEN 1 ELSE 0 END), 0)::INT as juz_in_progress,
            m.user_id = p_my_user_id as is_me
        FROM halaqah_members m
        LEFT JOIN quran_progress qp 
            ON qp.user_id = m.user_id 
            AND qp.ramadan_year = p_ramadan_year
        WHERE m.halaqah_id = p_halaqah_id
        GROUP BY m.nickname, m.user_id
    ) subquery;
    
    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO anon;

-- Verify everything was created
SELECT 'Setup complete!' as status;
SELECT proname FROM pg_proc WHERE proname IN ('is_halaqah_member', 'get_halaqah_leaderboard');
