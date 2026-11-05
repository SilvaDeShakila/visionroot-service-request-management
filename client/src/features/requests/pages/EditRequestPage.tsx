import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import axios from 'axios'
import { createRequestSchema, type CreateRequestFormValues } from '../schemas/request.schema'
import { useRequest, useUpdateRequest } from '../hooks/useRequests'
import type { ApiErrorResponse } from '../../auth/types/auth.types'

const categories = [
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support' },
  { value: 'BILLING', label: 'Billing' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'GENERAL', label: 'General' },
] as const

const priorities = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
] as const

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'

export default function EditRequestPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useRequest(id)
  const updateRequest = useUpdateRequest()
  const request = data?.data.request

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (request) {
      reset({
        title: request.title,
        description: request.description,
        category: request.category,
        priority: request.priority,
      })
    }
  }, [request, reset])

  const onSubmit = async (values: CreateRequestFormValues) => {
    try {
      await updateRequest.mutateAsync({ id, data: values })
      navigate(`/requests/${id}`)
    } catch {
      // The mutation error is displayed below.
    }
  }

  const errorMessage = updateRequest.error
    ? axios.isAxiosError<ApiErrorResponse>(updateRequest.error)
      ? updateRequest.error.response?.data?.message || 'Unable to update your request.'
      : 'Something went wrong. Please try again.'
    : null

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    )
  }

  if (isError || !request || request.status !== 'PENDING') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Request cannot be edited</h1>
          <p className="mt-2 text-sm text-slate-500">
            This request may not exist or it may no longer be pending.
          </p>
          <Link
            to="/requests"
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to requests
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/requests/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to request
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">VISIONROOT SERVICE DESK</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Edit service request
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update the information in your pending service request.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Request title
              </label>
              <input
                id="title"
                {...register('title')}
                className={inputClass}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={5}
                className={`${inputClass} resize-y`}
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select id="category" {...register('category')} className={inputClass}>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="text-sm font-semibold text-slate-700">
                  Priority
                </label>
                <select id="priority" {...register('priority')} className={inputClass}>
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMessage && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to={`/requests/${id}`}
                className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateRequest.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {updateRequest.isPending ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
