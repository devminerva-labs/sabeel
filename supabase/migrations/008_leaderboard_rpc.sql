-- ================================================================
-- Fast leaderboard RPC function
-- Runs as SECURITY DEFINER to bypass RLS — single query, no recursion.
-- Returns aggregated juz progress for all members of a halaqah.
-- ================================================================

CREATE OR REPLACE FUNCTION get_halaqah_leaderboard(
  p_halaqah_id UUID,
  p_ramadan_year SMALLINT,
  p_my_user_id UUID
)
RETURNS TABLE (
  nickname TEXT,
  juz_completed INT,
  juz_in_progress INT,
  is_me BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    m.nickname,
    COALESCE(SUM(CASE WHEN qp.status = 'completed' THEN 1 ELSE 0 END), 0)::INT AS juz_completed,
    COALESCE(SUM(CASE WHEN qp.status = 'in_progress' THEN 1 ELSE 0 END), 0)::INT AS juz_in_progress,
    (m.user_id = p_my_user_id) AS is_me
  FROM halaqah_members m
  LEFT JOIN quran_progress qp
    ON qp.user_id = m.user_id
    AND qp.ramadan_year = p_ramadan_year
  WHERE m.halaqah_id = p_halaqah_id
  GROUP BY m.nickname, m.user_id
  ORDER BY juz_completed DESC, juz_in_progress DESC;
$$;
