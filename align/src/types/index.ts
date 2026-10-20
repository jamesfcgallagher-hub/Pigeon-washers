export type UserRole = 'owner' | 'manager' | 'staff'
export type GoalType = 'long_term' | 'short_term'
export type GoalStatus = 'draft' | 'active' | 'completed' | 'cancelled'
export type Plan = 'free' | 'pro' | 'enterprise'

export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: Plan
  created_at: string
}

export interface User {
  id: string
  company_id: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface OrgNode {
  id: string
  company_id: string
  user_id: string
  manager_id: string | null
  created_at: string
}

export interface Goal {
  id: string
  company_id: string
  title: string
  description: string | null
  type: GoalType
  status: GoalStatus
  progress: number
  due_date: string | null
  assigned_to: string | null
  created_by: string
  parent_goal_id: string | null
  created_at: string
  updated_at: string
}
