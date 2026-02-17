-- Allow any authenticated user to look up a halaqah by invite code (for joining)
-- Without this, non-members can't find the halaqah to join it.
CREATE POLICY "anyone_can_lookup_by_invite" ON halaqahs
  FOR SELECT USING (auth.uid() IS NOT NULL);
