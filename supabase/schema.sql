-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('admin', 'staff')) default 'staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for guest links
create table guest_links (
  id uuid default gen_random_uuid() primary key,
  token text unique not null,
  created_by uuid references auth.users(id) not null,
  expires_at timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for guest_links
alter table guest_links enable row level security;

-- Policies for guest_links
create policy "Staff and Admins can view links created by them." on guest_links
  for select using (auth.uid() = created_by);

create policy "Staff and Admins can create links." on guest_links
  for insert with check (auth.uid() = created_by);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'staff'); -- Default to staff for now, or handle via metadata
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to verify guest token securely (bypassing RLS for specific token lookup)
create or replace function get_guest_link_by_token(token_input text)
returns setof guest_links
language sql
security definer
as $$
  select * from guest_links where token = token_input;
$$;
