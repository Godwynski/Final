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
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

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
        create type case_status as enum ('New', 'Under Investigation', 'Settled', 'Closed');
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
  incident_type incident_type default 'Other', -- From migration 002
  narrative_facts text, -- From migration 002
  narrative_action text, -- From migration 002
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
  case_id uuid references cases(id) on delete set null, -- From migration 003
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
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
create policy "Staff/Admin insert cases" on cases for insert with check (auth.uid() is not null);

drop policy if exists "Staff/Admin update cases" on cases;
create policy "Staff/Admin update cases" on cases for update using (auth.uid() is not null);

-- Involved Parties
alter table involved_parties enable row level security;

drop policy if exists "Staff/Admin manage parties" on involved_parties;
create policy "Staff/Admin manage parties" on involved_parties for all using (auth.uid() is not null);

-- Notes
alter table case_notes enable row level security;

drop policy if exists "Staff/Admin manage notes" on case_notes;
create policy "Staff/Admin manage notes" on case_notes for all using (auth.uid() is not null);

-- Evidence
alter table evidence enable row level security;

drop policy if exists "Staff/Admin view evidence" on evidence;
create policy "Staff/Admin view evidence" on evidence for select using (auth.uid() is not null);

drop policy if exists "Staff/Admin upload evidence" on evidence;
create policy "Staff/Admin upload evidence" on evidence for insert with check (auth.uid() is not null);

-- Audit Logs
alter table audit_logs enable row level security;

drop policy if exists "Admins view audit logs" on audit_logs;
create policy "Admins view audit logs" on audit_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "System insert audit logs" on audit_logs;
create policy "System insert audit logs" on audit_logs for insert with check (true);

-- Guest Links
alter table guest_links enable row level security;

drop policy if exists "Staff and Admins can view links created by them." on guest_links;
drop policy if exists "Staff and Admins can view all links." on guest_links;
create policy "Staff and Admins can view all links." on guest_links
  for select using (auth.uid() is not null);

drop policy if exists "Staff and Admins can create links." on guest_links;
create policy "Staff and Admins can create links." on guest_links
  for insert with check (auth.uid() = created_by);

-- Notifications
alter table notifications enable row level security;

drop policy if exists "Users can view own notifications" on notifications;
create policy "Users can view own notifications" on notifications
  for select using (auth.uid() = user_id);

drop policy if exists "System/Admins can insert notifications" on notifications;
create policy "System/Admins can insert notifications" on notifications
  for insert with check (true);

drop policy if exists "Users can update own notifications" on notifications;
create policy "Users can update own notifications" on notifications
  for update using (auth.uid() = user_id);


-- ==========================================
-- 5. UTILITY FUNCTIONS
-- ==========================================

-- Function to verify guest token securely
create or replace function get_guest_link_by_token(token_input text)
returns setof guest_links
language sql
security definer
as $$
  select * from guest_links where token = token_input;
$$;
