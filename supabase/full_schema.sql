-- ==========================================
-- 1. PROFILES & AUTH
-- ==========================================

-- Create a table for public profiles if it doesn't exist
-- Create a table for public profiles if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text, -- Added full name
  role text check (role in ('admin', 'staff')) default 'staff',
  force_password_change boolean default false, -- Added force password change
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (safe to run multiple times)
alter table profiles enable row level security;

-- Policies (Drop first to ensure updates are applied)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup (Improved version with metadata support)
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
    coalesce(new.raw_user_meta_data->>'role', 'staff'), -- Use metadata role or default to staff
    new.raw_user_meta_data->>'full_name' -- Use metadata full_name
  )
  on conflict (id) do nothing; -- Prevent error if profile already exists
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
  reported_by uuid references profiles(id), -- Changed to profiles for joins
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
  email text, -- Added email
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Case Notes Table
create table if not exists case_notes (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade not null,
  content text not null,
  created_by uuid references profiles(id) not null, -- Changed to profiles for joins
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
  uploaded_by uuid references profiles(id), -- Changed to profiles for joins
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Logs Table
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id), -- Changed to profiles for joins
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guest Links Table
create table if not exists guest_links (
  id uuid default gen_random_uuid() primary key,
  case_id uuid references cases(id) on delete cascade,
  token text unique not null,
  pin text not null, -- Added PIN
  created_by uuid references profiles(id) not null, -- Changed to profiles
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

-- Notifications RLS
alter table notifications enable row level security;

drop policy if exists "Users can view own notifications" on notifications;
create policy "Users can view own notifications" on notifications
  for select using (auth.uid() = user_id);

drop policy if exists "System/Admins can insert notifications" on notifications;
create policy "System/Admins can insert notifications" on notifications
  for insert with check (true); -- Allow system/actions to insert

drop policy if exists "Users can update own notifications" on notifications;
create policy "Users can update own notifications" on notifications
  for update using (auth.uid() = user_id);

-- Ensure columns exist (Idempotent modifications)
do $$ begin
    -- Add case_id to guest_links if it doesn't exist
    if not exists (select 1 from information_schema.columns where table_name = 'guest_links' and column_name = 'case_id') then
        alter table guest_links add column case_id uuid references cases(id) on delete cascade;
    end if;

    -- Add pin to guest_links
    if not exists (select 1 from information_schema.columns where table_name = 'guest_links' and column_name = 'pin') then
        alter table guest_links add column pin text default '000000'; -- Default for migration
        alter table guest_links alter column pin drop default;
    end if;

    -- Add email to involved_parties
    if not exists (select 1 from information_schema.columns where table_name = 'involved_parties' and column_name = 'email') then
        alter table involved_parties add column email text;
    end if;

    -- Add full_name to profiles
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table profiles add column full_name text;
    end if;

    -- Add force_password_change to profiles
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'force_password_change') then
        alter table profiles add column force_password_change boolean default false;
    end if;
end $$;

-- ==========================================
-- 3.1 FIX FOREIGN KEYS (MIGRATION)
-- ==========================================
-- This block ensures that if tables were created referencing auth.users, they are updated to reference profiles.
-- This is crucial for PostgREST joins (e.g., fetching user email with notes).

do $$
begin
  -- Fix case_notes.created_by
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'case_notes_created_by_fkey') then
    alter table case_notes drop constraint case_notes_created_by_fkey;
    alter table case_notes add constraint case_notes_created_by_fkey foreign key (created_by) references profiles(id);
  end if;

  -- Fix cases.reported_by
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'cases_reported_by_fkey') then
    alter table cases drop constraint cases_reported_by_fkey;
    alter table cases add constraint cases_reported_by_fkey foreign key (reported_by) references profiles(id);
  end if;

  -- Fix evidence.uploaded_by
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'evidence_uploaded_by_fkey') then
    alter table evidence drop constraint evidence_uploaded_by_fkey;
    alter table evidence add constraint evidence_uploaded_by_fkey foreign key (uploaded_by) references profiles(id);
  end if;
  
   -- Fix guest_links.created_by
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'guest_links_created_by_fkey') then
    alter table guest_links drop constraint guest_links_created_by_fkey;
    alter table guest_links add constraint guest_links_created_by_fkey foreign key (created_by) references profiles(id);
  end if;

  -- Fix audit_logs.user_id
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'audit_logs_user_id_fkey') then
    alter table audit_logs drop constraint audit_logs_user_id_fkey;
    alter table audit_logs add constraint audit_logs_user_id_fkey foreign key (user_id) references profiles(id);
  end if;
end $$;


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


-- ==========================================
-- 6. UTILITIES (Commented Out)
-- ==========================================

/*
-- Promote a user to admin:
update profiles
set role = 'admin'
where email = 'your-email@example.com';
*/
