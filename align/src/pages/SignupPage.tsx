import { AuthShell } from '@/components/layout/AuthShell'
import { SignupForm } from '@/features/auth/SignupForm'

export function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up Align for your team — free to start"
    >
      <SignupForm />
    </AuthShell>
  )
}
