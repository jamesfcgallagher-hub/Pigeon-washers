-- ============================================================
-- Align — Dev Seed Data
-- Run AFTER schema.sql, and AFTER creating auth users manually
-- or via the Supabase Auth admin panel.
-- Replace the UUIDs with real auth.users ids.
-- ============================================================

-- 1. Company
insert into companies (id, name, slug, plan) values
  ('11111111-0000-0000-0000-000000000001', 'Demo Corp', 'demo-corp', 'pro');

-- 2. Users  (these must already exist in auth.users)
insert into users (id, company_id, full_name, role) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Alice Owner',   'owner'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Bob Manager',   'manager'),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Carol Staff',   'staff');

-- 3. Org hierarchy
insert into org_nodes (company_id, user_id, manager_id) values
  ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', null),
  ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002');

-- 4. Goals
insert into goals (company_id, title, description, type, status, progress, due_date, assigned_to, created_by) values
  ('11111111-0000-0000-0000-000000000001',
   'Reach $1M ARR',
   'Hit the $1M annual recurring revenue milestone by end of year.',
   'long_term', 'active', 15,
   '2026-12-31',
   'aaaaaaaa-0000-0000-0000-000000000001',
   'aaaaaaaa-0000-0000-0000-000000000001'),

  ('11111111-0000-0000-0000-000000000001',
   'Launch v2 product',
   'Ship the redesigned product by Q3.',
   'short_term', 'active', 40,
   '2026-09-30',
   'aaaaaaaa-0000-0000-0000-000000000002',
   'aaaaaaaa-0000-0000-0000-000000000001'),

  ('11111111-0000-0000-0000-000000000001',
   'Complete onboarding flow',
   'Build and QA the new user onboarding experience.',
   'short_term', 'draft', 0,
   '2026-07-15',
   'aaaaaaaa-0000-0000-0000-000000000003',
   'aaaaaaaa-0000-0000-0000-000000000002');
