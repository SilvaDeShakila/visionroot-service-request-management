import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../auth-context'
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/auth.schema'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: createAccount } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError('')
    try {
      await createAccount(data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.message || 'Unable to create your account. Please try again.',
        )
      } else {
        setApiError('Something went wrong. Please try again.')
      }
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">
            V
          </div>
          <span className="text-lg font-semibold tracking-wide">VisionRoot</span>
        </div>

        <div className="relative max-w-lg">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            GET STARTED
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Your support workspace starts here.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Create your account to submit service requests, monitor updates,
            and communicate with the support team.
          </p>
          <div className="mt-10 space-y-4 text-sm text-slate-300">
            <p>? Submit and manage service requests</p>
            <p>? Track request progress in one place</p>
            <p>? Access your personal support workspace</p>
          </div>
        </div>

        <p className="relative text-sm text-slate-500">
          © 2026 VisionRoot (Pvt) Ltd. All rights reserved.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                V
              </div>
              <span className="text-lg font-bold text-slate-900">VisionRoot</span>
            </div>
          </div>

          <div className="mb-7">
            <p className="text-sm font-semibold text-blue-600">CREATE ACCOUNT</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Get started today
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Fill in your details to create your service workspace account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="name" autoComplete="name" placeholder="Enter your full name" {...register('name')} className={inputClass} />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} className={inputClass} />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a strong password" {...register('password')} className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>}
              <p className="mt-1.5 text-xs text-slate-400">At least 8 characters, including uppercase, lowercase and a number.</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" {...register('confirmPassword')} className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-slate-400">
            Secure service request management platform
          </p>
        </div>
      </section>
    </main>
  )
}
