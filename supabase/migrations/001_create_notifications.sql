-- Create Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  message text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table notifications enable row level security;

-- Policies
drop policy if exists "Users can view own notifications" on notifications;
create policy "Users can view own notifications" on notifications
  for select using (auth.uid() = user_id);

drop policy if exists "System/Admins can insert notifications" on notifications;
create policy "System/Admins can insert notifications" on notifications
  for insert with check (true);

drop policy if exists "Users can update own notifications" on notifications;
create policy "Users can update own notifications" on notifications
  for update using (auth.uid() = user_id);
