-- quiz_sessions: one row per game session
CREATE TABLE quiz_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code  text NOT NULL UNIQUE
               DEFAULT upper(substring(md5(random()::text), 1, 6)),
  category     text NOT NULL
               CHECK (category IN ('general','prophets','quran','history','sunnah','names')),
  question_ids text[] NOT NULL,
  status       text NOT NULL DEFAULT 'lobby'
               CHECK (status IN ('lobby','active','finished')),
  host_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at   timestamptz,
  ended_at     timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- quiz_session_members: who is in the session (max 2)
CREATE TABLE quiz_session_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nickname   text NOT NULL,
  joined_at  timestamptz DEFAULT now(),
  UNIQUE (session_id, user_id)
);

-- quiz_answers: one row per question per player
CREATE TABLE quiz_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_idx int NOT NULL CHECK (question_idx BETWEEN 0 AND 29),
  answer       text NOT NULL CHECK (answer IN ('A','B','C','D')),
  is_correct   boolean NOT NULL,
  UNIQUE (session_id, user_id, question_idx)
);

-- Indexes
CREATE INDEX idx_quiz_sessions_invite      ON quiz_sessions(invite_code);
CREATE INDEX idx_quiz_members_session      ON quiz_session_members(session_id);
CREATE INDEX idx_quiz_members_user         ON quiz_session_members(user_id);
CREATE INDEX idx_quiz_answers_session_user ON quiz_answers(session_id, user_id);

-- RLS
ALTER TABLE quiz_sessions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers         ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper (avoids RLS recursion — same as is_halaqah_member pattern)
CREATE OR REPLACE FUNCTION is_quiz_member(p_session_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM quiz_session_members
    WHERE session_id = p_session_id AND user_id = p_user_id
  );
$$;

-- quiz_sessions policies
CREATE POLICY "members_can_read_session"
  ON quiz_sessions FOR SELECT
  USING (is_quiz_member(id, auth.uid()));

CREATE POLICY "lobby_lookup_for_join"
  ON quiz_sessions FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'lobby');

CREATE POLICY "host_can_create"
  ON quiz_sessions FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "host_can_update"
  ON quiz_sessions FOR UPDATE
  USING (host_id = auth.uid());

-- quiz_session_members policies
CREATE POLICY "members_can_read_members"
  ON quiz_session_members FOR SELECT
  USING (is_quiz_member(session_id, auth.uid()));

CREATE POLICY "user_can_join"
  ON quiz_session_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- quiz_answers policies
CREATE POLICY "members_can_read_answers"
  ON quiz_answers FOR SELECT
  USING (is_quiz_member(session_id, auth.uid()));

CREATE POLICY "user_submits_own_answers"
  ON quiz_answers FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RPC: fetch both players' scores after the quiz
CREATE OR REPLACE FUNCTION get_quiz_results(p_session_id uuid)
RETURNS TABLE (user_id uuid, nickname text, score bigint)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT m.user_id, m.nickname,
    COUNT(a.id) FILTER (WHERE a.is_correct = true) AS score
  FROM quiz_session_members m
  LEFT JOIN quiz_answers a
    ON a.session_id = m.session_id AND a.user_id = m.user_id
  WHERE m.session_id = p_session_id
  GROUP BY m.user_id, m.nickname;
$$;

-- RPC: delete session after results are shown (data cleanup)
CREATE OR REPLACE FUNCTION delete_quiz_session(p_session_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM quiz_sessions
  WHERE id = p_session_id
    AND is_quiz_member(p_session_id, auth.uid());
$$;

GRANT EXECUTE ON FUNCTION is_quiz_member(uuid, uuid)    TO authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_results(uuid)         TO authenticated;
GRANT EXECUTE ON FUNCTION delete_quiz_session(uuid)      TO authenticated;
