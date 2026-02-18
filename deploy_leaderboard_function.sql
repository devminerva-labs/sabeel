-- ============================================================
-- HALAQAH LEADERBOARD FUNCTION
-- Run this entire block in Supabase SQL Editor
-- ============================================================

-- First, drop if exists (clean start)
DROP FUNCTION IF EXISTS public.get_halaqah_leaderboard;

-- Create the function using PL/pgSQL (more compatible)
CREATE OR REPLACE FUNCTION public.get_halaqah_leaderboard(
    p_halaqah_id UUID,
    p_ramadan_year SMALLINT,
    p_my_user_id UUID
)
RETURNS SETOF RECORD
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT 
            m.nickname::TEXT as nickname,
            COALESCE(COUNT(CASE WHEN qp.status = 'completed' THEN 1 END), 0)::INTEGER as juz_completed,
            COALESCE(COUNT(CASE WHEN qp.status = 'in_progress' THEN 1 END), 0)::INTEGER as juz_in_progress,
            (m.user_id = p_my_user_id)::BOOLEAN as is_me
        FROM halaqah_members m
        LEFT JOIN quran_progress qp 
            ON qp.user_id = m.user_id 
            AND qp.ramadan_year = p_ramadan_year
        WHERE m.halaqah_id = p_halaqah_id
        GROUP BY m.nickname, m.user_id
        ORDER BY 
            COALESCE(COUNT(CASE WHEN qp.status = 'completed' THEN 1 END), 0) DESC,
            COALESCE(COUNT(CASE WHEN qp.status = 'in_progress' THEN 1 END), 0) DESC
    LOOP
        RETURN NEXT rec;
    END LOOP;
    RETURN;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_halaqah_leaderboard(UUID, SMALLINT, UUID) TO anon;

-- Verify it was created
SELECT proname FROM pg_proc WHERE proname = 'get_halaqah_leaderboard';
