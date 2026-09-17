-- TripMate Supabase 스키마
-- src/lib/types.ts (Trip / Place / Schedule / Expense) 기준으로 작성.
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- trips
-- ---------------------------------------------------------------
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  daily_budget integer not null default 0,
  emoji text,
  created_at timestamptz not null default now()
);

alter table trips enable row level security;

create policy "trips_select_own" on trips for select using (auth.uid() = user_id);
create policy "trips_insert_own" on trips for insert with check (auth.uid() = user_id);
create policy "trips_update_own" on trips for update using (auth.uid() = user_id);
create policy "trips_delete_own" on trips for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- places
-- ---------------------------------------------------------------
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  category text not null check (category in ('맛집', '카페', '관광지', '쇼핑', '숙소', '기타')),
  address text not null,
  opening_hours jsonb not null default '{}'::jsonb,
  closed_days text[] not null default '{}',
  map_url text,
  blog_url text,
  created_at timestamptz not null default now()
);

alter table places enable row level security;

create policy "places_select_own" on places for select using (auth.uid() = user_id);
create policy "places_insert_own" on places for insert with check (auth.uid() = user_id);
create policy "places_update_own" on places for update using (auth.uid() = user_id);
create policy "places_delete_own" on places for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- schedules
-- ---------------------------------------------------------------
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  memo text,
  created_at timestamptz not null default now()
);

alter table schedules enable row level security;

create policy "schedules_select_own" on schedules for select using (auth.uid() = user_id);
create policy "schedules_insert_own" on schedules for insert with check (auth.uid() = user_id);
create policy "schedules_update_own" on schedules for update using (auth.uid() = user_id);
create policy "schedules_delete_own" on schedules for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- expenses
-- ---------------------------------------------------------------
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  amount integer not null check (amount > 0),
  category text not null check (category in ('식비', '교통', '쇼핑', '관광', '숙박', '기타')),
  memo text,
  created_at timestamptz not null default now()
);

alter table expenses enable row level security;

create policy "expenses_select_own" on expenses for select using (auth.uid() = user_id);
create policy "expenses_insert_own" on expenses for insert with check (auth.uid() = user_id);
create policy "expenses_update_own" on expenses for update using (auth.uid() = user_id);
create policy "expenses_delete_own" on expenses for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------
create index if not exists places_trip_id_idx on places(trip_id);
create index if not exists schedules_trip_id_idx on schedules(trip_id);
create index if not exists schedules_place_id_idx on schedules(place_id);
create index if not exists expenses_trip_id_idx on expenses(trip_id);
