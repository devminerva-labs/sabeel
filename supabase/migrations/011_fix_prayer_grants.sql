-- ================================================================
-- Migration 011: Explicit grants for prayer_logs + PostgREST reload
-- ================================================================

-- Ensure authenticated users can fully access their prayer_logs rows.
-- The default Supabase privileges may not cover tables created via CLI migrations.
GRANT SELECT, INSERT, UPDATE, DELETE ON prayer_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON prayer_logs TO service_role;

-- Reload PostgREST schema cache so the new prayer_logs table is
-- immediately visible to the REST API (same fix as migration 88b3a40).
SELECT pg_notify('pgrst', 'reload schema');
