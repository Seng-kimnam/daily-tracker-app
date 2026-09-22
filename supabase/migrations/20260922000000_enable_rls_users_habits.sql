-- Enable Row Level Security on users and habits.
-- Authenticated users may SELECT/INSERT/UPDATE/DELETE only their own rows
-- (auth.uid() = user_id).

-- users table (profile per account)
create table if not exists public.users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- habits table
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists habits_user_id_idx on public.habits (user_id);

-- RLS
alter table public.users enable row level security;
alter table public.habits enable row level security;

-- users policies
create policy "users_select_own" on public.users
  for select to authenticated
  using (auth.uid() = user_id);

create policy "users_insert_own" on public.users
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "users_update_own" on public.users
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_delete_own" on public.users
  for delete to authenticated
  using (auth.uid() = user_id);

-- habits policies
create policy "habits_select_own" on public.habits
  for select to authenticated
  using (auth.uid() = user_id);

create policy "habits_insert_own" on public.habits
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "habits_update_own" on public.habits
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_delete_own" on public.habits
  for delete to authenticated
  using (auth.uid() = user_id);