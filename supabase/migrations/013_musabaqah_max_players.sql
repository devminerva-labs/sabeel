-- Add max_players to quiz_sessions (1-4 players, defaults to 2 for existing rows)
ALTER TABLE quiz_sessions
  ADD COLUMN max_players smallint NOT NULL DEFAULT 2
    CHECK (max_players BETWEEN 1 AND 4);

-- Harden delete_quiz_session to host-only
-- Previously any member could delete; now only the session host can
CREATE OR REPLACE FUNCTION delete_quiz_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM quiz_sessions
  WHERE id = p_session_id
    AND host_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION delete_quiz_session(uuid) TO authenticated;
