-- 1. Dynamic Case Stats RPC
CREATE OR REPLACE FUNCTION get_case_stats_dynamic(
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count integer;
  active_count integer;
  resolved_count integer;
  new_count integer;
BEGIN
  SELECT
    count(*),
    count(*) FILTER (WHERE status IN ('New', 'Under Investigation')),
    count(*) FILTER (WHERE status IN ('Settled', 'Closed', 'Dismissed')),
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

GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO authenticated;
GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO service_role;

-- 2. Dynamic Charts RPC
CREATE OR REPLACE FUNCTION get_analytics_charts_dynamic(
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_status text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  status_data json;
  type_data json;
  trend_data json;
BEGIN
  -- Status Distribution
  SELECT json_agg(t) INTO status_data FROM (
    SELECT status as name, count(*) as value
    FROM cases
    WHERE
      (p_start_date IS NULL OR created_at >= p_start_date) AND
      (p_end_date IS NULL OR created_at <= p_end_date) AND
      (p_type IS NULL OR incident_type::text = p_type) AND
      (p_status IS NULL OR status::text = p_status)
    GROUP BY status
  ) t;

  -- Incident Types
  SELECT json_agg(t) INTO type_data FROM (
    SELECT incident_type as name, count(*) as value
    FROM cases
    WHERE
      (p_start_date IS NULL OR created_at >= p_start_date) AND
      (p_end_date IS NULL OR created_at <= p_end_date) AND
      (p_type IS NULL OR incident_type::text = p_type) AND
      (p_status IS NULL OR status::text = p_status)
    GROUP BY incident_type
  ) t;

  -- Trend Data (Monthly)
  SELECT json_agg(t) INTO trend_data FROM (
    SELECT
      to_char(created_at, 'Mon') as name,
      count(*) as cases,
      date_trunc('month', created_at) as m_date
    FROM cases
    WHERE
      (p_start_date IS NULL OR created_at >= p_start_date) AND
      (p_end_date IS NULL OR created_at <= p_end_date) AND
      (p_type IS NULL OR incident_type::text = p_type) AND
      (p_status IS NULL OR status::text = p_status)
    GROUP BY 1, 3
    ORDER BY 3
  ) t;

  RETURN json_build_object(
    'statusData', coalesce(status_data, '[]'::json),
    'typeData', coalesce(type_data, '[]'::json),
    'trendData', coalesce(trend_data, '[]'::json)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO authenticated;
GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO service_role;

-- 3. Party Statistics View
CREATE OR REPLACE VIEW party_statistics AS
SELECT
  name,
  array_agg(DISTINCT type) as roles,
  max(contact_number) as contact,
  count(case_id) as "caseCount",
  max(created_at) as "lastActive",
  array_agg(case_id) as "caseIds"
FROM involved_parties
GROUP BY name;

-- Grant access to the view
GRANT SELECT ON party_statistics TO authenticated;
GRANT SELECT ON party_statistics TO service_role;
