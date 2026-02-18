-- ================================================================
-- Migration 010: Prayer logs sync + adhkar category constraint fix
-- ================================================================

-- 1. Add prayer_logs table for cross-device sync
CREATE TABLE IF NOT EXISTS prayer_logs (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  prayer     TEXT NOT NULL CHECK (prayer IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
  status     TEXT NOT NULL CHECK (status IN ('prayed', 'missed')),
  prayed_at  TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date, prayer)
);

ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_prayer_logs" ON prayer_logs
  FOR ALL USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_prayer_logs_user ON prayer_logs(user_id, date);

-- 2. Fix adhkar_sessions category constraint to include all 8 app categories
--    The original only had 5; 'eating', 'home', 'quran_dua' were missing
ALTER TABLE adhkar_sessions
  DROP CONSTRAINT IF EXISTS adhkar_sessions_category_check;

ALTER TABLE adhkar_sessions
  ADD CONSTRAINT adhkar_sessions_category_check
  CHECK (category IN ('morning', 'evening', 'after_prayer', 'before_sleep', 'anxiety', 'eating', 'home', 'quran_dua'));
