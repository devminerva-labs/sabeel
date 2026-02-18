-- ============================================================
-- VERSION 3 - Ultra simple, no complex syntax
-- ============================================================

DROP FUNCTION IF EXISTS get_halaqah_leaderboard;

CREATE FUNCTION get_halaqah_leaderboard(
    p_halaqah_id UUID,
    p_ramadan_year SMALLINT,
    p_my_user_id UUID
)
RETURNS TABLE (
    nickname text,
    juz_completed int,
    juz_in_progress int,
    is_me boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        m.nickname,
        0::int,
        0::int,
        false
    FROM halaqah_members m
    WHERE m.halaqah_id = p_halaqah_id
    LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO anon;
