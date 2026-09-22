-- Enable Row Level Security on daily_logs.
-- Authenticated users may SELECT/INSERT/UPDATE/DELETE only their own rows
-- (auth.uid() = user_id).

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid references public.habits (id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, log_date)
);

create index if not exists daily_logs_user_id_idx on public.daily_logs (user_id);
create index if not exists daily_logs_habit_id_idx on public.daily_logs (habit_id);

-- RLS
alter table public.daily_logs enable row level security;

-- daily_logs policies
create policy "daily_logs_select_own" on public.daily_logs
  for select to authenticated
  using (auth.uid() = user_id);

create policy "daily_logs_insert_own" on public.daily_logs
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "daily_logs_update_own" on public.daily_logs
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "daily_logs_delete_own" on public.daily_logs
  for delete to authenticated
  using (auth.uid() = user_id);