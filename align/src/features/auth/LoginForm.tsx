import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FormValues {
  email: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  async function onSubmit({ email, password }: FormValues) {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setServerError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Email"
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
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        hint="Forgot your password? Use the reset link below."
        {...register('password', { required: 'Password is required' })}
      />

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-1">
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          Sign up free
        </Link>
      </p>
    </form>
  )
}
