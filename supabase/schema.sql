-- ==========================================
-- CONSOLIDATED SCHEMA
-- Generated: 2025-12-08
-- Description: Single source of truth for database schema
-- ==========================================

-- ==========================================
-- 1. PROFILES & AUTH
-- ==========================================

-- Create a table for public profiles if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'staff')) default 'staff',
  force_password_change boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies (Optimized)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'staff'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 2. ENUMS
-- ==========================================

-- Enum for Case Status
do $$ begin
    if not exists (select 1 from pg_type where typname = 'case_status') then
        create type case_status as enum ('New', 'Under Investigation', 'Hearing Scheduled', 'Settled', 'Closed', 'Dismissed', 'Referred');
    end if;
end $$;

-- Enum for Party Type
do $$ begin
    if not exists (select 1 from pg_type where typname = 'party_type') then
        create type party_type as enum ('Complainant', 'Respondent', 'Witness');
    end if;
end $$;

-- Enum for Incident Type
do $$ begin
    if not exists (select 1 from pg_type where typname = 'incident_type') then
        create type incident_type as enum (
            'Theft', 
            'Harassment', 
            'Vandalism', 
            'Physical Injury', 
            'Property Damage', 
            'Public Disturbance', 
            'Other'
        );
    end if;
end $$;


-- ==========================================
-- 3. CORE TABLES
-- ==========================================

-- Cases Table
create table if not exists cases (
  id uuid default gen_random_uuid() primary key,
  case_number serial,
  title text not null,
  description text,
  incident_date timestamp with time zone not null,
  incident_location text,
  status case_status default 'New',
  incident_type incident_type default 'Other',
  narrative_facts text,
  narrative_action text,
  resolution_details jsonb,
  reported_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Involved Parties Table
create table if not exists involved_parties (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade not null,
  name text not null,
  type party_type not null,
  contact_number text,
  email text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Case Notes Table
create table if not exists case_notes (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade not null,
  content text not null,
  created_by uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guest Links Table (Pre-defined for reference in Evidence)
create table if not exists guest_links (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade,
  token text unique not null,
  pin text not null,
  created_by uuid references profiles(id) not null,
  expires_at timestamp with time zone not null,
  is_active boolean default true,
  recipient_name text,
  recipient_email text,
  recipient_phone text,
  terms_accepted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Evidence Table
create table if not exists evidence (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade not null,
  file_path text not null,
  file_name text not null,
  file_type text,
  description text,
  uploaded_by uuid references profiles(id),
  guest_link_id uuid references guest_links(id) on delete set null,
  is_visible_to_others boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Logs Table
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  case_id uuid references cases(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  message text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Barangay Settings Table
CREATE TABLE IF NOT EXISTS barangay_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province TEXT NOT NULL DEFAULT '',
    city_municipality TEXT NOT NULL DEFAULT '',
    barangay_name TEXT NOT NULL DEFAULT '',
    punong_barangay TEXT NOT NULL DEFAULT '',
    barangay_secretary TEXT NOT NULL DEFAULT '',
    logo_barangay_url TEXT,
    logo_city_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO barangay_settings (province, city_municipality, barangay_name, punong_barangay, barangay_secretary)
SELECT '[Province Name]', '[City Name]', '[Barangay Name]', '[Punong Barangay Name]', '[Secretary Name]'
WHERE NOT EXISTS (SELECT 1 FROM barangay_settings);

-- Hearings Table
CREATE TABLE IF NOT EXISTS hearings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  hearing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  hearing_type TEXT NOT NULL CHECK (hearing_type IN ('Mediation', 'Conciliation', 'Arbitration')),
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'No Show', 'Rescheduled', 'Settled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Visits Table (with tracking extensions)
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  visit_type TEXT DEFAULT 'page_view' CHECK (visit_type IN ('page_view', 'session', 'unique_daily')),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  visitor_email TEXT,
  visitor_name TEXT,
  visitor_role TEXT DEFAULT 'anonymous',
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 4. RLS POLICIES & SECURITY
-- ==========================================

-- Enable RLS on all tables
alter table cases enable row level security;
alter table involved_parties enable row level security;
alter table case_notes enable row level security;
alter table evidence enable row level security;
alter table audit_logs enable row level security;
alter table guest_links enable row level security;
alter table notifications enable row level security;
alter table barangay_settings enable row level security;
alter table hearings enable row level security;
alter table site_visits enable row level security;

-- Audit Logs Policies
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

-- Cases Policies
DROP POLICY IF EXISTS "Staff/Admin view all cases" ON cases;
create policy "Staff/Admin view all cases" on cases for select using (true);

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

-- Involved Parties Policies
DROP POLICY IF EXISTS "Staff/Admin manage parties" ON involved_parties;
CREATE POLICY "Staff/Admin manage parties" ON involved_parties 
  FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- Case Notes Policies
DROP POLICY IF EXISTS "Staff/Admin manage notes" ON case_notes;
CREATE POLICY "Staff/Admin manage notes" ON case_notes 
  FOR ALL USING ((SELECT auth.uid()) IS NOT NULL);

-- Evidence Policies
DROP POLICY IF EXISTS "Staff/Admin view evidence" ON evidence;
CREATE POLICY "Staff/Admin view evidence" ON evidence 
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Staff/Admin upload evidence" ON evidence;
CREATE POLICY "Staff/Admin upload evidence" ON evidence
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = uploaded_by);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Guest Links Policies
DROP POLICY IF EXISTS "Allow authenticated to manage guest links" on guest_links;
create policy "Allow authenticated to manage guest links" on guest_links for all to authenticated using (true);

-- Barangay Settings Policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON barangay_settings;
CREATE POLICY "Allow read access for authenticated users" ON barangay_settings
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow update for authenticated users" ON barangay_settings;
CREATE POLICY "Allow update for authenticated users" ON barangay_settings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Hearings Policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON hearings;
CREATE POLICY "Enable read access for authenticated users" ON hearings
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON hearings;
CREATE POLICY "Enable insert access for authenticated users" ON hearings
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON hearings;
CREATE POLICY "Enable update access for authenticated users" ON hearings
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON hearings;
CREATE POLICY "Enable delete access for authenticated users" ON hearings
    FOR DELETE TO authenticated USING (true);

-- Site Visits Policies
DROP POLICY IF EXISTS "Admins can view site visits" ON site_visits;
CREATE POLICY "Admins can view site visits" ON site_visits
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Anyone can insert site visits" ON site_visits;
CREATE POLICY "Anyone can insert site visits" ON site_visits
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete site visits" ON site_visits;
CREATE POLICY "Admins can delete site visits" ON site_visits
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- ==========================================
-- 5. STORAGE BUCKETS
-- ==========================================

-- Branding Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('branding', 'branding', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Allow authenticated uploads" on storage.objects;
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'branding');
DROP POLICY IF EXISTS "Allow public view" on storage.objects;
CREATE POLICY "Allow public view" ON storage.objects FOR SELECT TO public USING (bucket_id = 'branding');
DROP POLICY IF EXISTS "Allow authenticated update" on storage.objects;
CREATE POLICY "Allow authenticated update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'branding');
DROP POLICY IF EXISTS "Allow authenticated delete" on storage.objects;
CREATE POLICY "Allow authenticated delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'branding');

-- Evidence Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', false) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Allow authenticated uploads evidence" on storage.objects;
CREATE POLICY "Allow authenticated uploads evidence" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'evidence');
DROP POLICY IF EXISTS "Allow authenticated view evidence" on storage.objects;
CREATE POLICY "Allow authenticated view evidence" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'evidence');
DROP POLICY IF EXISTS "Allow authenticated update evidence" on storage.objects;
CREATE POLICY "Allow authenticated update evidence" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'evidence');
DROP POLICY IF EXISTS "Allow authenticated delete evidence" on storage.objects;
CREATE POLICY "Allow authenticated delete evidence" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'evidence');


-- ==========================================
-- 6. INDEXES
-- ==========================================

-- Cases
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_incident_type ON cases(incident_type);
CREATE INDEX IF NOT EXISTS idx_cases_reported_by ON cases(reported_by);
CREATE INDEX IF NOT EXISTS idx_cases_title_search ON cases USING GIN(to_tsvector('english', coalesce(title, '')));
CREATE INDEX IF NOT EXISTS idx_cases_location_search ON cases USING GIN(to_tsvector('english', coalesce(incident_location, '')));

-- Involved Parties
CREATE INDEX IF NOT EXISTS idx_involved_parties_case_id ON involved_parties(case_id);
CREATE INDEX IF NOT EXISTS idx_involved_parties_name_search ON involved_parties USING GIN(to_tsvector('english', coalesce(name, '')));

-- Hearings
CREATE INDEX IF NOT EXISTS idx_hearings_hearing_date ON hearings(hearing_date);
CREATE INDEX IF NOT EXISTS idx_hearings_case_id ON hearings(case_id);

-- Other Tables
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_guest_link_id ON evidence(guest_link_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_case_id ON audit_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_links_case_id ON guest_links(case_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Site Visits
CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON site_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_path ON site_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_site_visits_ip_address ON site_visits(ip_address);
CREATE INDEX IF NOT EXISTS idx_site_visits_user_id ON site_visits(user_id);

-- Performance optimization indexes (added for query speed)
-- Optimize hearing date range queries (used in calendar)
CREATE INDEX IF NOT EXISTS idx_hearings_date_status ON hearings(hearing_date, status) 
WHERE status IN ('Scheduled', 'Rescheduled');

-- Optimize stale case queries (New/Under Investigation by updated_at)
CREATE INDEX IF NOT EXISTS idx_cases_status_updated ON cases(status, updated_at DESC)
WHERE status IN ('New', 'Under Investigation');

-- NEW: Additional composite indexes for common query patterns
-- Composite index for filtering by status and type together
CREATE INDEX IF NOT EXISTS idx_cases_status_type ON cases(status, incident_type);

-- Composite index for date range queries with type
CREATE INDEX IF NOT EXISTS idx_cases_type_created ON cases(incident_type, created_at DESC);

-- Composite index for evidence ordering by case
CREATE INDEX IF NOT EXISTS idx_evidence_case_created ON evidence(case_id, created_at DESC);

-- Composite index for notes ordering by case
CREATE INDEX IF NOT EXISTS idx_case_notes_case_created ON case_notes(case_id, created_at DESC);

-- Composite index for audit log queries by user and time
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);

-- Composite index for guest links by case and active status
CREATE INDEX IF NOT EXISTS idx_guest_links_case_active ON guest_links(case_id, is_active, expires_at);

-- Composite index for unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- NEW: Materialized View for Dashboard Statistics
-- This pre-aggregates common dashboard queries for faster performance
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dashboard_stats AS
SELECT 
  status,
  incident_type,
  DATE_TRUNC('day', created_at) as day,
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as case_count,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as weekly_count,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as monthly_count
FROM cases
GROUP BY status, incident_type, DATE_TRUNC('day', created_at), DATE_TRUNC('month', created_at);

-- Create indexes on materialized view for fast lookups
CREATE INDEX IF NOT EXISTS idx_mv_dashboard_stats_day ON mv_dashboard_stats(day DESC);
CREATE INDEX IF NOT EXISTS idx_mv_dashboard_stats_month ON mv_dashboard_stats(month DESC);
CREATE INDEX IF NOT EXISTS idx_mv_dashboard_stats_status ON mv_dashboard_stats(status);
CREATE INDEX IF NOT EXISTS idx_mv_dashboard_stats_type ON mv_dashboard_stats(incident_type);

-- Function to refresh materialized view (can be called manually or via cron)
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_stats;
END;
$$;

GRANT EXECUTE ON FUNCTION refresh_dashboard_stats TO authenticated;


-- ==========================================
-- 7. FUNCTIONS & RPCs
-- ==========================================

-- Function to verify guest token securely
create or replace function get_guest_link_by_token(token_input text)
returns setof guest_links
language sql
security definer set search_path = public
as $$
  select * from guest_links where token = token_input;
$$;


-- 1. Dynamic Case Stats RPC (Improved from fix_data_accuracy)
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
    -- Active: Under Investigation, plus Hearing Scheduled (EXCLUDE 'New' to avoid double-counting with new_count)
    count(*) FILTER (WHERE status IN ('Under Investigation', 'Hearing Scheduled')),
    -- Resolved: Settled, Closed, Dismissed, plus Referred
    count(*) FILTER (WHERE status IN ('Settled', 'Closed', 'Dismissed', 'Referred')),
    -- New: Only New status
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

GRANT EXECUTE ON FUNCTION get_case_stats_dynamic TO anon;
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
SECURITY DEFINER set search_path = public
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

GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO anon;
GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO authenticated;
GRANT EXECUTE ON FUNCTION get_analytics_charts_dynamic TO service_role;


-- 3. Party Statistics View
CREATE OR REPLACE VIEW party_statistics WITH (security_invoker = true) AS
SELECT
  name,
  array_agg(DISTINCT type) as roles,
  max(contact_number) as contact,
  count(case_id) as "caseCount",
  max(created_at) as "lastActive",
  array_agg(case_id) as "caseIds"
FROM involved_parties
GROUP BY name;

GRANT SELECT ON party_statistics TO service_role;


-- 4. Advanced Search RPC (Redefined with Pagination Fix from 002 and Sorting from 003)
DROP FUNCTION IF EXISTS search_cases(text, text, text, timestamp with time zone, timestamp with time zone, integer, integer);
CREATE OR REPLACE FUNCTION search_cases(
  p_query text DEFAULT '',
  p_status text DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0,
  p_sort_by text DEFAULT 'created_at',
  p_sort_order text DEFAULT 'desc'
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
DECLARE
  sort_column text;
  sort_direction text;
BEGIN
  -- Validate and sanitize sort column to prevent SQL injection
  sort_column := CASE p_sort_by
    WHEN 'case_number' THEN 'c.case_number'
    WHEN 'title' THEN 'c.title'
    WHEN 'status' THEN 'c.status'
    WHEN 'incident_date' THEN 'c.incident_date'
    WHEN 'created_at' THEN 'c.created_at'
    ELSE 'c.created_at'  -- Default fallback
  END;

  -- Validate sort direction
  sort_direction := CASE LOWER(p_sort_order)
    WHEN 'asc' THEN 'ASC'
    WHEN 'desc' THEN 'DESC'
    ELSE 'DESC'  -- Default fallback
  END;

  -- Use dynamic SQL to apply sorting
  RETURN QUERY EXECUTE format('
    SELECT
      c.id,
      c.case_number,
      c.title,
      c.status,
      c.incident_date,
      c.created_at,
      c.incident_type,
      c.incident_location,
      ts_rank(
        setweight(to_tsvector(''english'', coalesce(c.title, '''')), ''A'') ||
        setweight(to_tsvector(''english'', coalesce(c.incident_location, '''')), ''B'') ||
        setweight(to_tsvector(''english'', coalesce(c.narrative_facts, '''')), ''C''),
        plainto_tsquery(''english'', $1)
      ) as match_rank,
      count(*) OVER() as full_count
    FROM cases c
    LEFT JOIN involved_parties ip ON c.id = ip.case_id
    WHERE
      ($1 = '''' OR 
        c.title ILIKE ''%%'' || $1 || ''%%'' OR
        c.incident_location ILIKE ''%%'' || $1 || ''%%'' OR
        c.case_number::text ILIKE ''%%'' || $1 || ''%%'' OR
        ip.name ILIKE ''%%'' || $1 || ''%%''
      ) AND
      ($2 IS NULL OR c.status::text = $2) AND
      ($3 IS NULL OR c.incident_type::text = $3) AND
      ($4 IS NULL OR c.created_at >= $4) AND
      ($5 IS NULL OR c.created_at <= $5)
    GROUP BY c.id
    ORDER BY %s %s, c.created_at DESC
    LIMIT $6
    OFFSET $7
  ', sort_column, sort_direction)
  USING p_query, p_status, p_type, p_start_date, p_end_date, p_limit, p_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION search_cases TO anon;
GRANT EXECUTE ON FUNCTION search_cases TO authenticated;
GRANT EXECUTE ON FUNCTION search_cases TO service_role;


-- ==========================================
-- 8. BUSINESS LOGIC TRIGGERS
-- ==========================================

-- Function to close guest links when case is closed
create or replace function public.close_guest_links_on_case_closure()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'Closed' and old.status != 'Closed' then
    update public.guest_links
    set is_active = false
    where case_id = new.id;
  end if;
  return new;
end;
$$;

-- Trigger for case closure
drop trigger if exists on_case_closed on cases;
create trigger on_case_closed
  after update on cases
  for each row
  execute procedure public.close_guest_links_on_case_closure();

-- CLEANUP: Drop legacy functions and views that might cause security warnings
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT oid::regprocedure AS func_signature
             FROM pg_proc
             WHERE proname IN ('create_case_with_parties', 'get_analytics_summary', 'get_dashboard_stats')
             AND pronamespace = 'public'::regnamespace
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || r.func_signature || ' CASCADE';
    END LOOP;
END $$;

DROP VIEW IF EXISTS public.view_involved_parties_summary;
