import { AuthShell } from '@/components/layout/AuthShell'
import { LoginForm } from '@/features/auth/LoginForm'

export function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Align workspace"
    >
      <LoginForm />
    </AuthShell>
  )
}
