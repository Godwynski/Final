-- =====================================================
-- MIGRATION: Complete RLS and Function Fixes
-- Date: 2025-12-03
-- Description: All optimizations and fixes in one file
-- =====================================================
-- 
-- This migration includes:
-- 1. RLS policy optimizations (wrap auth calls in subqueries)
-- 2. Consolidate duplicate audit_logs policies
-- 3. Fix search_cases function type mismatch
-- 4. Grant proper execute permissions
--
-- Run this AFTER the initial schema.sql has been applied
-- =====================================================

-- ==========================================
-- PART 1: OPTIMIZE RLS POLICIES
-- ==========================================

-- PROFILES TABLE
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- AUDIT_LOGS TABLE (Consolidate Duplicates)
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON audit_logs;
DROP POLICY IF EXISTS "System insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Allow select for admins" ON audit_logs;
DROP POLICY IF EXISTS "Admins view audit logs" ON audit_logs;

CREATE POLICY "Allow insert for authenticated users" ON audit_logs 
  FOR INSERT TO authenticated 
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins view audit logs" ON audit_logs 
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- CASES TABLE
DROP POLICY IF EXISTS "Staff/Admin insert cases" ON cases;
CREATE POLICY "Staff/Admin insert cases" ON cases 
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Staff/Admin update cases" ON cases;
CREATE POLICY "Staff/Admin update cases" ON cases 
  FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Admins delete cases" ON cases;
CREATE POLICY "Admins delete cases" ON cases 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- INVOLVED_PARTIES TABLE
DROP POLICY IF EXISTS "Staff/Admin manage parties" ON involved_parties;
CREATE POLICY "Staff/Admin manage parties" ON involved_parties 
  FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- CASE_NOTES TABLE
DROP POLICY IF EXISTS "Staff/Admin manage notes" ON case_notes;
CREATE POLICY "Staff/Admin manage notes" ON case_notes 
  FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- EVIDENCE TABLE
DROP POLICY IF EXISTS "Staff/Admin view evidence" ON evidence;
CREATE POLICY "Staff/Admin view evidence" ON evidence 
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Staff/Admin upload evidence" ON evidence;
CREATE POLICY "Staff/Admin upload evidence" ON evidence
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = uploaded_by);

-- NOTIFICATIONS TABLE
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- ==========================================
-- PART 2: FIX SEARCH_CASES FUNCTION
-- ==========================================

-- Drop the old function with wrong type
DROP FUNCTION IF EXISTS search_cases(text, text, text, timestamp with time zone, timestamp with time zone, integer, integer);

-- Recreate with correct type (real instead of float for match_rank)
CREATE OR REPLACE FUNCTION search_cases(
  p_query text DEFAULT '',
  p_status text DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  case_number integer,
  title text,
  status case_status,
  incident_date timestamp with time zone,
  created_at timestamp with time zone,
  incident_type incident_type,
  incident_location text,
  match_rank real,  -- FIXED: Changed from float to real
  full_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    c.id,
    c.case_number,
    c.title,
    c.status,
    c.incident_date,
    c.created_at,
    c.incident_type,
    c.incident_location,
    ts_rank(
      setweight(to_tsvector('english', coalesce(c.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(c.incident_location, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(c.narrative_facts, '')), 'C'),
      plainto_tsquery('english', p_query)
    ) as match_rank,
    count(*) OVER() as full_count
  FROM cases c
  LEFT JOIN involved_parties ip ON c.id = ip.case_id
  WHERE
    (p_query = '' OR 
      c.title ILIKE '%' || p_query || '%' OR
      c.incident_location ILIKE '%' || p_query || '%' OR
      c.case_number::text ILIKE '%' || p_query || '%' OR
      ip.name ILIKE '%' || p_query || '%'
    ) AND
    (p_status IS NULL OR c.status::text = p_status) AND
    (p_type IS NULL OR c.incident_type::text = p_type) AND
    (p_start_date IS NULL OR c.created_at >= p_start_date) AND
    (p_end_date IS NULL OR c.created_at <= p_end_date)
  ORDER BY 
    match_rank DESC,
    c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ==========================================
-- PART 3: GRANT EXECUTE PERMISSIONS
-- ==========================================

-- Grant on search_cases
GRANT EXECUTE ON FUNCTION search_cases TO anon;
GRANT EXECUTE ON FUNCTION search_cases TO authenticated;
GRANT EXECUTE ON FUNCTION search_cases TO service_role;

-- Grant on other RPC functions
GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO anon;
GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO authenticated;
GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO service_role;

GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO anon;
GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO authenticated;
GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO service_role;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
