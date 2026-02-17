-- Restrict get_user_stats() to the admin user only
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  email TEXT,
  signed_up_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  juz_completed BIGINT,
  juz_in_progress BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS user_id,
    p.display_name,
    u.email,
    u.created_at AS signed_up_at,
    u.last_sign_in_at,
    COUNT(qp.id) FILTER (WHERE qp.status = 'completed') AS juz_completed,
    COUNT(qp.id) FILTER (WHERE qp.status = 'in_progress') AS juz_in_progress
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  LEFT JOIN quran_progress qp ON qp.user_id = p.id
  WHERE auth.uid() = '41dc3097-39b0-482f-a087-62c9a6bdbc5d'
  GROUP BY p.id, p.display_name, u.email, u.created_at, u.last_sign_in_at
  ORDER BY u.last_sign_in_at DESC NULLS LAST;
$$;
