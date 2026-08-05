create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  timezone text not null default 'Asia/Shanghai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  category text not null check (category in ('health', 'focus', 'study', 'mindful', 'creative', 'home')),
  color text not null check (color in ('sage', 'sunrise', 'clover', 'sky', 'lavender', 'berry')),
  icon text not null check (icon in ('leaf', 'droplet', 'book-open', 'dumbbell', 'sparkles', 'moon', 'pen-line', 'heart')),
  frequency text not null check (frequency in ('daily', 'weekdays')),
  start_date date not null,
  archived boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id text not null references public.habits(id) on delete cascade,
  date date not null,
  completed_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now(),
  constraint checkins_one_per_day unique (user_id, habit_id, date)
);

create index if not exists habits_user_order_idx on public.habits(user_id, archived, display_order, created_at);
create index if not exists checkins_user_date_idx on public.checkins(user_id, date);
create index if not exists checkins_habit_date_idx on public.checkins(habit_id, date);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.checkins enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "habits_select_own" on public.habits;
create policy "habits_select_own" on public.habits
  for select using (auth.uid() = user_id);

drop policy if exists "habits_insert_own" on public.habits;
create policy "habits_insert_own" on public.habits
  for insert with check (auth.uid() = user_id);

drop policy if exists "habits_update_own" on public.habits;
create policy "habits_update_own" on public.habits
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "habits_delete_own" on public.habits;
create policy "habits_delete_own" on public.habits
  for delete using (auth.uid() = user_id);

drop policy if exists "checkins_select_own" on public.checkins;
create policy "checkins_select_own" on public.checkins
  for select using (auth.uid() = user_id);

drop policy if exists "checkins_insert_own" on public.checkins;
create policy "checkins_insert_own" on public.checkins
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.habits
      where habits.id = checkins.habit_id
      and habits.user_id = auth.uid()
    )
  );

drop policy if exists "checkins_update_own" on public.checkins;
create policy "checkins_update_own" on public.checkins
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
