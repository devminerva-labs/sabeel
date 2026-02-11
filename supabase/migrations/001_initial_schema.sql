-- ================================================================
-- Sabeel v1.0 — Initial Schema
-- ================================================================

-- STATIC CONTENT (seeded once, read-only for users)

CREATE TABLE surahs (
  id          SMALLINT PRIMARY KEY CHECK (id BETWEEN 1 AND 114),
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  juz_start   SMALLINT NOT NULL CHECK (juz_start BETWEEN 1 AND 30),
  ayah_count  SMALLINT NOT NULL CHECK (ayah_count > 0)
);

CREATE TABLE juz (
  id          SMALLINT PRIMARY KEY CHECK (id BETWEEN 1 AND 30),
  start_surah SMALLINT NOT NULL REFERENCES surahs(id),
  start_ayah  SMALLINT NOT NULL CHECK (start_ayah > 0),
  end_surah   SMALLINT NOT NULL REFERENCES surahs(id),
  end_ayah    SMALLINT NOT NULL CHECK (end_ayah > 0)
);

-- USER DATA

CREATE TABLE profiles (
  id                UUID REFERENCES auth.users PRIMARY KEY,
  display_name      TEXT CHECK (length(display_name) > 0),
  preferred_lang    TEXT DEFAULT 'ar' CHECK (preferred_lang IN ('ar', 'en')),
  is_public         BOOLEAN DEFAULT FALSE,
  onboarded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quran progress at JUZ level (primary tracking)
-- ramadan_year: Gregorian year when Ramadan STARTS (set client-side from hardcoded lookup)
CREATE TABLE quran_progress (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  juz_id        SMALLINT NOT NULL REFERENCES juz(id),
  ramadan_year  SMALLINT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed'))
                DEFAULT 'not_started',
  completed_at  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, juz_id, ramadan_year)
);

-- Adhkar daily sessions
CREATE TABLE adhkar_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date  DATE NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('morning', 'evening', 'after_prayer',
                'before_sleep', 'anxiety')),
  completed     BOOLEAN DEFAULT FALSE,
  counts        JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at  TIMESTAMPTZ,
  CHECK ((completed = TRUE AND completed_at IS NOT NULL) OR completed = FALSE),
  UNIQUE (user_id, session_date, category)
);

-- ROW LEVEL SECURITY

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhkar_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "own_progress" ON quran_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "own_adhkar" ON adhkar_sessions
  FOR ALL USING (user_id = auth.uid());

-- Performance indexes
CREATE INDEX idx_quran_progress_user ON quran_progress(user_id, ramadan_year);
CREATE INDEX idx_adhkar_sessions_user ON adhkar_sessions(user_id, session_date);
