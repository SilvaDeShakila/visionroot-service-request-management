import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../auth/auth-context'
import {
  ArrowLeft, Send, LayoutDashboard, LogOut, Headphones,
  CreditCard, UserRound, MessageCircle, AlertCircle,
  CheckCircle2, FileText, Loader2
} from 'lucide-react'
import { createRequestSchema, type CreateRequestFormValues } from '../schemas/request.schema'
import { useCreateRequest } from '../hooks/useRequests'
import type { ApiErrorResponse } from '../../auth/types/auth.types'
import axios from 'axios'

const categories = [
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support', description: 'Technical issues and troubleshooting', icon: Headphones },
  { value: 'BILLING', label: 'Billing', description: 'Payments, invoices and charges', icon: CreditCard },
  { value: 'ACCOUNT', label: 'Account', description: 'Login and account assistance', icon: UserRound },
  { value: 'GENERAL', label: 'General', description: 'Other questions and assistance', icon: MessageCircle },
] as const

const priorities = [
  { value: 'LOW', label: 'Low', description: 'General assistance', style: 'border-slate-200 bg-white text-slate-600' },
  { value: 'MEDIUM', label: 'Medium', description: 'Needs attention', style: 'border-blue-200 bg-blue-50 text-blue-700' },
  { value: 'HIGH', label: 'High', description: 'Urgent assistance', style: 'border-rose-200 bg-rose-50 text-rose-700' },
] as const

function getInitials(name?: string) {
  return name
    ? name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
    : 'U'
}

export default function CreateRequestPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const createRequest = useCreateRequest()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'GENERAL',
      priority: 'MEDIUM',
    },
  })

  const selectedCategory = watch('category')
  const selectedPriority = watch('priority')

  const onSubmit = async (values: CreateRequestFormValues) => {
    try {
      await createRequest.mutateAsync(values)
      navigate('/requests')
    } catch {
      // The mutation error is displayed below.
    }
  }

  const errorMessage = createRequest.error
    ? axios.isAxiosError<ApiErrorResponse>(createRequest.error)
      ? createRequest.error.response?.data?.message || 'Unable to submit your request.'
      : 'Something went wrong. Please try again.'
    : null

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10'

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/requests" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <LayoutDashboard size={21} />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">VisionRoot</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Service Desk</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'User'}</p>
              <p className="text-xs text-slate-400">Customer account</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-4 ring-blue-50">
              {getInitials(user?.name)}
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/requests"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to my requests
        </Link>

        <section className="mt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            CUSTOMER SUPPORT
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Create a service request
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tell us how we can help. Provide the details below and our support team will review your request.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Request information</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Fields marked with * are required</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6 sm:p-8">
              <div>
                <label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Request title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  {...register('title')}
                  placeholder="e.g. Unable to access my account"
                  className={`${inputClass} ${errors.title ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                    <AlertCircle size={14} /> {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-semibold text-slate-700">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={6}
                  placeholder="Describe the issue, what happened, and what assistance you need..."
                  className={`${inputClass} resize-y leading-6 ${errors.description ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : ''}`}
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                    <AlertCircle size={14} /> {errors.description.message}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  Include enough information to help our team understand your request.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Request category <span className="text-rose-500">*</span>
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    const selected = selectedCategory === category.value
                    return (
                      <label
                        key={category.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          selected
                            ? 'border-blue-400 bg-blue-50/70 ring-2 ring-blue-500/10'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={category.value}
                          {...register('category')}
                          className="sr-only"
                        />
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon size={19} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold ${selected ? 'text-blue-800' : 'text-slate-800'}`}>
                            {category.label}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{category.description}</p>
                        </div>
                        {selected && <CheckCircle2 size={17} className="shrink-0 text-blue-600" />}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Priority level <span className="text-rose-500">*</span>
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {priorities.map((priority) => {
                    const selected = selectedPriority === priority.value
                    return (
                      <label
                        key={priority.value}
                        className={`flex cursor-pointer items-start gap-2 rounded-xl border p-4 transition ${
                          selected
                            ? priority.style + ' ring-2 ring-blue-500/10'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                        }`}
                      >
                        <input
                          type="radio"
                          value={priority.value}
                          {...register('priority')}
                          className="sr-only"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">{priority.label}</p>
                          <p className="mt-1 text-xs opacity-75">{priority.description}</p>
                        </div>
                        {selected && <CheckCircle2 size={16} className="shrink-0" />}
                      </label>
                    )
                  })}
                </div>
              </div>

              {errorMessage && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/requests"
                  className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createRequest.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createRequest.isPending ? (
                    <><Loader2 size={17} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={16} /> Submit request</>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Headphones size={20} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">How it works</h3>
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                  <p className="text-xs leading-5 text-slate-600">Submit your request with the relevant details.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                  <p className="text-xs leading-5 text-slate-600">Our support team reviews your submission.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
                  <p className="text-xs leading-5 text-slate-600">Track the progress from your requests dashboard.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">Helpful tips</h3>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs leading-5 text-slate-500">
                <li>• Use a clear and specific title.</li>
                <li>• Explain the issue with relevant details.</li>
                <li>• Select the category that best matches your request.</li>
                <li>• Choose a priority that reflects the urgency.</li>
              </ul>
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} VisionRoot. All rights reserved.</p>
          <p>Customer Service Portal</p>
        </footer>
      </main>
    </div>
  )
}
