# Align — SaaS Goal-Setting & Progress Tracking Tool

## Overview
Align is a goal-setting and progress-tracking tool for management teams. It enables companies to define organisational hierarchies, assign goals at every level of the org chart, and track progress in real time.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel |
| Billing | Stripe |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Forms | React Hook Form |
| State | React Context + hooks |

---

## Folder Structure
```
align/
├── public/
├── src/
│   ├── assets/
│   ├── components/         # Shared UI components
│   │   ├── ui/             # Primitives (Button, Input, Card…)
│   │   └── layout/         # Shell, Sidebar, Header
│   ├── features/           # Feature-sliced modules
│   │   ├── auth/           # Login, Signup, password reset
│   │   ├── goals/          # Goal list, detail, create/edit
│   │   ├── org/            # Org hierarchy tree
│   │   ├── users/          # User management
│   │   └── billing/        # Stripe billing portal
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Supabase client, Stripe helpers
│   ├── pages/              # Route-level page components
│   ├── routes/             # React Router config + guards
│   ├── store/              # Context providers
│   └── types/              # TypeScript interfaces/types
├── supabase/
│   ├── schema.sql          # Full DB schema
│   └── seed.sql            # Dev seed data
├── .env.example
├── plan.md                 # ← this file
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Database Schema

### `companies`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | |
| slug | text | unique |
| logo_url | text | nullable |
| stripe_customer_id | text | nullable |
| stripe_subscription_id | text | nullable |
| plan | text | free \| pro \| enterprise |
| created_at | timestamptz | |

### `users` (extends Supabase auth.users)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | mirrors auth.users.id |
| company_id | uuid FK → companies | |
| full_name | text | |
| avatar_url | text | nullable |
| role | enum | owner \| manager \| staff |
| created_at | timestamptz | |

### `org_nodes` (hierarchy — adjacency list)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| company_id | uuid FK → companies | |
| user_id | uuid FK → users | |
| manager_id | uuid FK → users | nullable (null = top of tree) |
| created_at | timestamptz | |

### `goals`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| company_id | uuid FK → companies | |
| title | text | |
| description | text | nullable |
| type | enum | long_term \| short_term |
| status | enum | draft \| active \| completed \| cancelled |
| progress | int | 0–100 |
| due_date | date | nullable |
| assigned_to | uuid FK → users | nullable |
| created_by | uuid FK → users | |
| parent_goal_id | uuid FK → goals | nullable (for goal trees) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Auth Flows
- **Signup**: email + password → creates auth.users row → trigger creates public.users row
- **Login**: email + password via Supabase Auth
- **Invite flow** (future): owner invites user by email; user signs up and is linked to the company
- **Password Reset**: Supabase magic link

## Row-Level Security (RLS) Principles
- Users can only read/write data belonging to their `company_id`
- `owner` can manage users, goals, org structure
- `manager` can create/edit goals for themselves and direct reports
- `staff` can view goals and update progress on goals assigned to them

---

## Pages & Routes
| Path | Component | Auth |
|------|-----------|------|
| `/` | Redirect → `/dashboard` | required |
| `/login` | LoginPage | public |
| `/signup` | SignupPage | public |
| `/dashboard` | DashboardPage | required |
| `/goals` | GoalsPage | required |
| `/goals/:id` | GoalDetailPage | required |
| `/goals/new` | GoalFormPage | manager+ |
| `/org` | OrgChartPage | required |
| `/settings` | SettingsPage | owner |
| `/billing` | BillingPage | owner |

---

## Stripe Billing (future)
- Plans: Free (1 team, 5 users), Pro ($29/mo, unlimited), Enterprise (custom)
- Checkout via Stripe Checkout hosted page
- Webhook handles `customer.subscription.updated` → update `companies.plan`

---

## Development Phases
- [x] Phase 1 — Scaffold + Schema + Auth screens
- [ ] Phase 2 — Dashboard + Goal CRUD
- [ ] Phase 3 — Org chart + hierarchy
- [ ] Phase 4 — Stripe billing integration
- [ ] Phase 5 — Notifications + activity feed
- [ ] Phase 6 — Analytics + reporting
