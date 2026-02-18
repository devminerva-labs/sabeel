-- ============================================================
-- SIMPLE VERSION - Should work on any Supabase instance
-- ============================================================

-- Drop existing
DROP FUNCTION IF EXISTS public.get_halaqah_leaderboard;

-- Create simple version returning JSONB array
CREATE OR REPLACE FUNCTION public.get_halaqah_leaderboard(
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
    SELECT jsonb_agg(
        jsonb_build_object(
            'nickname', nickname,
            'juz_completed', juz_completed,
            'juz_in_progress', juz_in_progress,
            'is_me', is_me
        ) ORDER BY juz_completed DESC, juz_in_progress DESC
    )
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
    
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO anon;
