-- ──────────────────────────────────────────────────────────────
-- OzDoc AI — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ──────────────────────────────────────────────────────────────

-- Health profile — one row per authenticated user.
create table if not exists public.health_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  full_name text,
  date_of_birth date,
  sex text check (sex in ('female','male','intersex','prefer-not-to-say')),
  height_cm integer,
  weight_kg numeric,
  blood_type text,
  chronic_conditions text[] default '{}',
  past_surgeries text[] default '{}',
  medications text[] default '{}',
  allergies text[] default '{}',
  medicare_number text, -- encrypt client-side before saving
  emergency_contacts jsonb default '[]'::jsonb,
  consented_to_terms boolean default false,
  location text, -- suburb/town + state
  is_indigenous boolean default false,
  is_rural_remote boolean default false,
  my_health_record_linked boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Consultations — saved chat sessions.
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null default 'New consultation',
  summary text,
  triage text check (triage in ('emergency','urgent','see-gp-soon','telehealth','self-care')),
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists consultations_user_id_idx on public.consultations(user_id);
create index if not exists consultations_created_at_idx on public.consultations(created_at desc);

-- Telehealth bookings.
create table if not exists public.telehealth_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slot_iso timestamptz not null,
  doctor_name text not null,
  price_aud numeric not null default 59.00,
  bulk_billed boolean default false,
  consultation_summary text, -- AI-generated summary passed to GP
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz default now()
);

-- eScripts — electronic prescriptions.
create table if not exists public.escripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consultation_id uuid references public.consultations(id),
  medication_name text not null,
  dosage text not null,
  quantity integer not null default 1,
  repeats integer not null default 0,
  pharmacy_name text,
  pharmacy_address text,
  status text not null default 'pending' check (status in ('pending','sent','dispensed','expired')),
  prescribed_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '12 months')
);

create index if not exists escripts_user_id_idx on public.escripts(user_id);

-- Chronic care plans — ongoing condition management.
create table if not exists public.chronic_care_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  condition_type text not null,
  condition_name text not null,
  gp_name text,
  started_at timestamptz default now(),
  next_checkin_at timestamptz default (now() + interval '30 days'),
  last_checkin_at timestamptz,
  medications text[] default '{}',
  targets text[] default '{}',
  notes text default '',
  status text not null default 'active' check (status in ('active','paused','completed')),
  created_at timestamptz default now()
);

create index if not exists chronic_care_user_id_idx on public.chronic_care_plans(user_id);

-- ──────────────────────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────────────────────

alter table public.health_profiles enable row level security;
alter table public.consultations enable row level security;
alter table public.telehealth_bookings enable row level security;
alter table public.escripts enable row level security;
alter table public.chronic_care_plans enable row level security;

-- Profiles: user can see/edit only their own row.
create policy "profiles_select_own" on public.health_profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.health_profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.health_profiles
  for update using (auth.uid() = user_id);

-- Consultations: owner-only access.
create policy "consults_select_own" on public.consultations
  for select using (auth.uid() = user_id);
create policy "consults_insert_own" on public.consultations
  for insert with check (auth.uid() = user_id);
create policy "consults_update_own" on public.consultations
  for update using (auth.uid() = user_id);
create policy "consults_delete_own" on public.consultations
  for delete using (auth.uid() = user_id);

-- Bookings: owner-only access.
create policy "bookings_select_own" on public.telehealth_bookings
  for select using (auth.uid() = user_id);
create policy "bookings_insert_own" on public.telehealth_bookings
  for insert with check (auth.uid() = user_id);

-- eScripts: owner-only access.
create policy "escripts_select_own" on public.escripts
  for select using (auth.uid() = user_id);
create policy "escripts_insert_own" on public.escripts
  for insert with check (auth.uid() = user_id);

-- Chronic care plans: owner-only access.
create policy "chronic_care_select_own" on public.chronic_care_plans
  for select using (auth.uid() = user_id);
create policy "chronic_care_insert_own" on public.chronic_care_plans
  for insert with check (auth.uid() = user_id);
create policy "chronic_care_update_own" on public.chronic_care_plans
  for update using (auth.uid() = user_id);
