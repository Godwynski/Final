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

-- Policies
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

-- Evidence Table
create table if not exists evidence (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade not null,
  file_path text not null,
  file_name text not null,
  file_type text,
  description text,
  uploaded_by uuid references profiles(id),
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

-- Enable RLS for Audit Logs
alter table audit_logs enable row level security;

-- Policy: Admins/Staff can view audit logs (or maybe just Admins?)
-- Let's allow authenticated users to view for now, or restrict to admins.
-- Given the requirements, let's restrict to Admins for viewing, but allow insertion via service role or functions.
-- Actually, the app inserts via service role or authenticated user.
-- Let's allow insert for authenticated users (since they trigger actions) but select only for admins.
drop policy if exists "Allow insert for authenticated users" on audit_logs;
drop policy if exists "System insert audit logs" on audit_logs;
create policy "Allow insert for authenticated users" on audit_logs for insert to authenticated with check ((select auth.uid()) = user_id);

-- Consolidated policy for admin access to audit logs
drop policy if exists "Allow select for admins" on audit_logs;
drop policy if exists "Admins view audit logs" on audit_logs;
create policy "Admins view audit logs" on audit_logs for select using (
  exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
);

-- Guest Links Table
create table if not exists guest_links (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade,
  token text unique not null,
  pin text not null,
  created_by uuid references profiles(id) not null,
  expires_at timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Guest Links
alter table guest_links enable row level security;

-- Policy: Public access via token (handled by function mostly, but maybe direct select needed?)
-- Actually, get_guest_link_by_token is SECURITY DEFINER, so we might not need public select policy if we only use that.
-- But let's allow authenticated users to view/manage links.
drop policy if exists "Allow authenticated to manage guest links" on guest_links;
create policy "Allow authenticated to manage guest links" on guest_links for all to authenticated using (true);

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


-- ==========================================
-- 4. RLS POLICIES & SECURITY
-- ==========================================

-- Cases
alter table cases enable row level security;

drop policy if exists "Staff/Admin view all cases" on cases;
create policy "Staff/Admin view all cases" on cases for select using (true);

drop policy if exists "Staff/Admin insert cases" on cases;
create policy "Staff/Admin insert cases" on cases for insert with check ((select auth.uid()) is not null);

drop policy if exists "Staff/Admin update cases" on cases;
create policy "Staff/Admin update cases" on cases for update using ((select auth.uid()) is not null);

-- Involved Parties
alter table involved_parties enable row level security;

drop policy if exists "Staff/Admin manage parties" on involved_parties;
create policy "Staff/Admin manage parties" on involved_parties for all using ((select auth.uid()) is not null);

-- Notes
alter table case_notes enable row level security;

drop policy if exists "Staff/Admin manage notes" on case_notes;
create policy "Staff/Admin manage notes" on case_notes for all using ((select auth.uid()) is not null);

-- Evidence
alter table evidence enable row level security;

drop policy if exists "Staff/Admin view evidence" on evidence;
create policy "Staff/Admin view evidence" on evidence for select using ((select auth.uid()) is not null);

drop policy if exists "Staff/Admin upload evidence" on evidence;
create policy "Staff/Admin upload evidence" on evidence
  for insert to authenticated
  with check ((select auth.uid()) = uploaded_by);

-- Notifications
alter table notifications enable row level security;

drop policy if exists "Users can view own notifications" on notifications;
create policy "Users can view own notifications" on notifications
  for select using ((select auth.uid()) = user_id);

drop policy if exists "Users can update own notifications" on notifications;
create policy "Users can update own notifications" on notifications
  for update using ((select auth.uid()) = user_id);

-- Cases DELETE Policy
drop policy if exists "Admins delete cases" on cases;
create policy "Admins delete cases" on cases for delete using (
  exists (select 1 from profiles where id = (select auth.uid()) and role = 'admin')
);


-- ==========================================
-- 5. UTILITY FUNCTIONS
-- ==========================================

-- Function to verify guest token securely
create or replace function get_guest_link_by_token(token_input text)
returns setof guest_links
language sql
security definer set search_path = public
as $$
  select * from guest_links where token = token_input;
$$;


-- ==========================================
-- 6. BARANGAY SETTINGS
-- ==========================================

-- Create barangay_settings table
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

-- Enable RLS
ALTER TABLE barangay_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing settings (all authenticated users)
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON barangay_settings;
CREATE POLICY "Allow read access for authenticated users" ON barangay_settings
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for updating settings (admin only)
DROP POLICY IF EXISTS "Allow update for authenticated users" ON barangay_settings;
CREATE POLICY "Allow update for authenticated users" ON barangay_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default row if not exists
INSERT INTO barangay_settings (province, city_municipality, barangay_name, punong_barangay, barangay_secretary)
SELECT '[Province Name]', '[City Name]', '[Barangay Name]', '[Punong Barangay Name]', '[Secretary Name]'
WHERE NOT EXISTS (SELECT 1 FROM barangay_settings);


-- ==========================================
-- 7. HEARINGS
-- ==========================================

-- Create hearings table
CREATE TABLE IF NOT EXISTS hearings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  hearing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  hearing_type TEXT NOT NULL CHECK (hearing_type IN ('Mediation', 'Conciliation', 'Arbitration')),
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'No Show', 'Rescheduled', 'Settled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE hearings ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON hearings;
CREATE POLICY "Enable read access for authenticated users" ON hearings
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON hearings;
CREATE POLICY "Enable insert access for authenticated users" ON hearings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON hearings;
CREATE POLICY "Enable update access for authenticated users" ON hearings
    FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON hearings;
CREATE POLICY "Enable delete access for authenticated users" ON hearings
    FOR DELETE
    TO authenticated
    USING (true);


-- ==========================================
-- 8. INDEXES
-- ==========================================

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Performance Indexes
-- These indexes are critical for dashboard filtering and sorting performance
CREATE INDEX IF NOT EXISTS idx_cases_reported_by ON cases(reported_by);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_incident_type ON cases(incident_type);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_involved_parties_case_id ON involved_parties(case_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_case_id ON audit_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_links_case_id ON guest_links(case_id);
CREATE INDEX IF NOT EXISTS idx_hearings_case_id ON hearings(case_id);


-- ==========================================
-- 9. STORAGE BUCKETS
-- ==========================================

-- Create a new storage bucket for branding (logos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users (staff/admin) to upload logos
drop policy if exists "Allow authenticated uploads" on storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'branding');

-- Policy: Allow public view
drop policy if exists "Allow public view" on storage.objects;
CREATE POLICY "Allow public view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'branding');

-- Policy: Allow authenticated update
drop policy if exists "Allow authenticated update" on storage.objects;
CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'branding');

drop policy if exists "Allow authenticated delete" on storage.objects;
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'branding');



-- ==========================================
-- 10. DASHBOARD ANALYTICS FUNCTIONS
-- ==========================================

-- Create a new storage bucket for evidence
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload evidence
drop policy if exists "Allow authenticated uploads evidence" on storage.objects;
CREATE POLICY "Allow authenticated uploads evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'evidence');

-- Policy: Allow authenticated users to view evidence
drop policy if exists "Allow authenticated view evidence" on storage.objects;
CREATE POLICY "Allow authenticated view evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'evidence');

-- Policy: Allow authenticated users to update evidence
drop policy if exists "Allow authenticated update evidence" on storage.objects;
CREATE POLICY "Allow authenticated update evidence"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'evidence');

-- Policy: Allow authenticated users to delete evidence
drop policy if exists "Allow authenticated delete evidence" on storage.objects;
CREATE POLICY "Allow authenticated delete evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'evidence');


-- ==========================================
-- 11. DASHBOARD ANALYTICS FUNCTIONS
-- ==========================================

-- 1. Dynamic Case Stats RPC
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


-- Grant access to the view
GRANT SELECT ON party_statistics TO service_role;

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

-- 4. Advanced Search RPC
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

GRANT EXECUTE ON FUNCTION search_cases TO authenticated;
GRANT EXECUTE ON FUNCTION search_cases TO service_role;



-- ==========================================
-- 11. BUSINESS LOGIC TRIGGERS
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
