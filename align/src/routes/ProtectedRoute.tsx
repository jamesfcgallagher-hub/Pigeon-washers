import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'

export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />
}
