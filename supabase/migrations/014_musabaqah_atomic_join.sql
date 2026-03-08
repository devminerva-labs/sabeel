-- Replace client-side TOCTOU join with an atomic RPC.
-- The FOR UPDATE lock on quiz_sessions serializes concurrent join attempts,
-- making the count check + insert a single safe transaction.

CREATE OR REPLACE FUNCTION join_quiz_session(p_invite_code text, p_nickname text)
RETURNS TABLE (
  id          uuid,
  invite_code text,
  category    text,
  status      text,
  host_id     uuid,
  question_ids text[],
  max_players smallint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session quiz_sessions%ROWTYPE;
  v_count   int;
BEGIN
  -- Lock the session row for the duration of this transaction.
  -- Concurrent callers will block here until the first one commits,
  -- preventing two simultaneous joins from both passing the capacity check.
  SELECT * INTO v_session
  FROM quiz_sessions
  WHERE quiz_sessions.invite_code = upper(trim(p_invite_code))
    AND quiz_sessions.status = 'lobby'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Code not found or game already started'
      USING ERRCODE = 'P0002';
  END IF;

  -- Count after acquiring the lock — now safe from concurrent modification
  SELECT COUNT(*) INTO v_count
  FROM quiz_session_members
  WHERE quiz_session_members.session_id = v_session.id;

  IF v_count >= v_session.max_players THEN
    RAISE EXCEPTION 'session_full'
      USING ERRCODE = 'P0001',
            DETAIL  = format('This game is full (%s players max)', v_session.max_players);
  END IF;

  -- Idempotent: if already a member just return the session (e.g. page reload)
  IF NOT EXISTS (
    SELECT 1 FROM quiz_session_members
    WHERE quiz_session_members.session_id = v_session.id
      AND quiz_session_members.user_id    = auth.uid()
  ) THEN
    INSERT INTO quiz_session_members (session_id, user_id, nickname)
    VALUES (v_session.id, auth.uid(), p_nickname);
  END IF;

  RETURN QUERY
    SELECT v_session.id,
           v_session.invite_code,
           v_session.category,
           v_session.status,
           v_session.host_id,
           v_session.question_ids,
           v_session.max_players;
END;
$$;

GRANT EXECUTE ON FUNCTION join_quiz_session(text, text) TO authenticated;
