-- ============================================================
-- Align — Database Schema
-- Run this in the Supabase SQL editor (or via supabase db push)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- Enums
-- ============================================================
create type user_role   as enum ('owner', 'manager', 'staff');
create type goal_type   as enum ('long_term', 'short_term');
create type goal_status as enum ('draft', 'active', 'completed', 'cancelled');
create type plan_tier   as enum ('free', 'pro', 'enterprise');

-- ============================================================
-- companies
-- ============================================================
create table companies (
  id                       uuid primary key default uuid_generate_v4(),
  name                     text not null,
  slug                     text not null unique,
  logo_url                 text,
  stripe_customer_id       text,
  stripe_subscription_id   text,
  plan                     plan_tier not null default 'free',
  created_at               timestamptz not null default now()
);

alter table companies enable row level security;

-- ============================================================
-- users (public profile, mirrors auth.users)
-- ============================================================
create table users (
  id           uuid primary key references auth.users(id) on delete cascade,
  company_id   uuid not null references companies(id) on delete cascade,
  full_name    text not null,
  avatar_url   text,
  role         user_role not null default 'staff',
  created_at   timestamptz not null default now()
);

alter table users enable row level security;

-- ============================================================
-- org_nodes  (adjacency-list hierarchy)
-- ============================================================
create table org_nodes (
  id           uuid primary key default uuid_generate_v4(),
  company_id   uuid not null references companies(id) on delete cascade,
  user_id      uuid not null references users(id) on delete cascade,
  manager_id   uuid references users(id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (company_id, user_id)
);

alter table org_nodes enable row level security;

-- ============================================================
-- goals
-- ============================================================
create table goals (
  id              uuid primary key default uuid_generate_v4(),
  company_id      uuid not null references companies(id) on delete cascade,
  title           text not null,
  description     text,
  type            goal_type   not null default 'short_term',
  status          goal_status not null default 'draft',
  progress        int not null default 0 check (progress between 0 and 100),
  due_date        date,
  assigned_to     uuid references users(id) on delete set null,
  created_by      uuid not null references users(id),
  parent_goal_id  uuid references goals(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table goals enable row level security;

-- auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger goals_updated_at
  before update on goals
  for each row execute function set_updated_at();

-- ============================================================
-- Auth trigger: create user profile + company on first sign-up
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  company_id uuid;
begin
  -- Only create a company when metadata is present (owner sign-up)
  if new.raw_user_meta_data->>'company_name' is not null then
    insert into companies (name, slug)
    values (
      new.raw_user_meta_data->>'company_name',
      new.raw_user_meta_data->>'company_slug'
    )
    returning id into company_id;

    insert into users (id, company_id, full_name, role)
    values (
      new.id,
      company_id,
      coalesce(new.raw_user_meta_data->>'full_name', new.email),
      'owner'
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row-Level Security Policies
-- ============================================================

-- Helper: get the caller's company_id
create or replace function my_company_id()
returns uuid language sql stable as $$
  select company_id from users where id = auth.uid()
$$;

-- Helper: get the caller's role
create or replace function my_role()
returns user_role language sql stable as $$
  select role from users where id = auth.uid()
$$;

-- companies: members can read their own company; owners can update
create policy "company members can read"
  on companies for select
  using (id = my_company_id());

create policy "owners can update company"
  on companies for update
  using (id = my_company_id() and my_role() = 'owner');

-- users: company members can read peers; owners/managers can insert; users update themselves
create policy "company members can read users"
  on users for select
  using (company_id = my_company_id());

create policy "users can update own profile"
  on users for update
  using (id = auth.uid());

create policy "owners can manage users"
  on users for all
  using (company_id = my_company_id() and my_role() = 'owner');

-- org_nodes
create policy "company members can read org"
  on org_nodes for select
  using (company_id = my_company_id());

create policy "owners can manage org"
  on org_nodes for all
  using (company_id = my_company_id() and my_role() = 'owner');

-- goals: all members read; staff update own assigned goals; managers+ full write
create policy "company members can read goals"
  on goals for select
  using (company_id = my_company_id());

create policy "staff can update assigned goal progress"
  on goals for update
  using (company_id = my_company_id() and assigned_to = auth.uid());

create policy "managers can create goals"
  on goals for insert
  with check (company_id = my_company_id() and my_role() in ('owner', 'manager'));

create policy "managers can update goals"
  on goals for update
  using (company_id = my_company_id() and my_role() in ('owner', 'manager'));

create policy "owners can delete goals"
  on goals for delete
  using (company_id = my_company_id() and my_role() = 'owner');
