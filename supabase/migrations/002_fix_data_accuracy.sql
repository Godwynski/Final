-- =====================================================
-- MIGRATION: Fix Data Accuracy and Search Pagination
-- Date: 2025-12-08
-- Description:
-- 1. Updates get_case_stats_dynamic to include ALL statuses in categories.
-- 2. Updates search_cases to fix duplicate counting in pagination.
-- =====================================================

-- ==========================================
-- 1. FIX DASHBOARD STATS
-- ==========================================

-- Redefine the function with comprehensive status lists
CREATE OR REPLACE FUNCTION get_case_stats_dynamic(
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER set search_path = public
AS $$
DECLARE
  total_count integer;
  active_count integer;
  resolved_count integer;
  new_count integer;
BEGIN
  SELECT
    count(*),
    -- Active: New, Under Investigation, plus Hearing Scheduled
    count(*) FILTER (WHERE status IN ('New', 'Under Investigation', 'Hearing Scheduled')),
    -- Resolved: Settled, Closed, Dismissed, plus Referred
    count(*) FILTER (WHERE status IN ('Settled', 'Closed', 'Dismissed', 'Referred')),
    count(*) FILTER (WHERE status = 'New')
  INTO
    total_count,
    active_count,
    resolved_count,
    new_count
  FROM cases
  WHERE
    (p_start_date IS NULL OR created_at >= p_start_date) AND
    (p_end_date IS NULL OR created_at <= p_end_date) AND
    (p_type IS NULL OR incident_type::text = p_type) AND
    (p_status IS NULL OR status::text = p_status);

  RETURN json_build_object(
    'total', total_count,
    'active', active_count,
    'resolved', resolved_count,
    'new', new_count
  );
END;
$$;

-- Grant permissions (just to be safe, though replacement preserves attributes)
GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO authenticated;
GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO service_role;


-- ==========================================
-- 2. FIX SEARCH PAGINATION
-- ==========================================

-- Redefine search_cases to use GROUP BY instead of DISTINCT
-- This ensures 'full_count' counts the unique cases, not the joined rows
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
  match_rank real,
  full_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER set search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.case_number,
    c.title,
    c.status,
    c.incident_date,
    c.created_at,
    c.incident_type,
    c.incident_location,
    -- Rank calculation (needs to be in Group By or aggregate? No, these columns are from 'c')
    -- Since we group by c.id, we can just use the expression.
    ts_rank(
      setweight(to_tsvector('english', coalesce(c.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(c.incident_location, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(c.narrative_facts, '')), 'C'),
      plainto_tsquery('english', p_query)
    ) as match_rank,
    -- Count of the resulting groups (unique cases)
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
  GROUP BY c.id
  ORDER BY 
    match_rank DESC,
    c.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION search_cases TO authenticated;
GRANT EXECUTE ON FUNCTION search_cases TO service_role;
