import { useAuth } from '@/store/AuthContext'
import { Button } from '@/components/ui/Button'

export function DashboardPage() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            {profile && (
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, {profile.full_name} — {profile.role}
              </p>
            )}
          </div>
          <Button variant="secondary" onClick={signOut}>Sign out</Button>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center text-gray-400">
          Goals and org chart coming in Phase 2
        </div>
      </div>
    </div>
  )
}
