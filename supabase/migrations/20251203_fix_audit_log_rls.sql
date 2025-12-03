-- Fix Audit Log RLS to allow authenticated users to insert their own logs
-- This is required because server actions use the authenticated client to log actions

DROP POLICY IF EXISTS "System insert audit logs" ON audit_logs;

CREATE POLICY "Authenticated users can insert audit logs"
ON audit_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
