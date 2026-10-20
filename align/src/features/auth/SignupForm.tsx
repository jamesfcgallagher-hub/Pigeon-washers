import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FormValues {
  fullName: string
  companyName: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const password = watch('password')

  async function onSubmit({ fullName, companyName, email, password }: FormValues) {
    setServerError('')

    const slug = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          company_slug: slug,
        },
      },
    })

    if (error) {
      setServerError(error.message)
    } else {
      setVerificationSent(true)
      setTimeout(() => navigate('/login'), 4000)
    }
  }

  if (verificationSent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
          <svg className="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Check your inbox</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          We&apos;ve sent a confirmation link to your email. Click it to activate your account.
        </p>
        <p className="text-xs text-gray-400">Redirecting to login…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Full name"
        type="text"
        autoComplete="name"
        placeholder="Alex Johnson"
        error={errors.fullName?.message}
        {...register('fullName', { required: 'Full name is required' })}
      />
      <Input
        label="Company name"
        type="text"
        placeholder="Acme Inc."
        error={errors.companyName?.message}
        {...register('companyName', { required: 'Company name is required' })}
      />
      <Input
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
        })}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
        })}
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (v) => v === password || 'Passwords do not match',
        })}
      />

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-1">
        Create account
      </Button>

      <p className="text-center text-xs text-gray-400">
        By signing up you agree to our{' '}
        <span className="text-brand-600 hover:underline cursor-pointer">Terms</span> and{' '}
        <span className="text-brand-600 hover:underline cursor-pointer">Privacy Policy</span>.
      </p>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
