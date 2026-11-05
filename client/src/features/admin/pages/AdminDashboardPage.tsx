import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth-context'
import { Link } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import axios from 'axios'
import { useRequests, useUpdateRequestStatus } from '../../requests/hooks/useRequests'
import type {
  RequestFilters,
  RequestStatus,
  ServiceRequest,
} from '../../requests/types/request.types'

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const categoryOptions = [
  { value: '', label: 'All categories' },
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support' },
  { value: 'BILLING', label: 'Billing' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'GENERAL', label: 'General' },
]

const priorityOptions = [
  { value: '', label: 'All priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

function statusStyle(status: RequestStatus) {
  const styles: Record<RequestStatus, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    IN_PROGRESS: 'bg-blue-50 text-blue-700',
    RESOLVED: 'bg-emerald-50 text-emerald-700',
    CANCELLED: 'bg-slate-100 text-slate-600',
  }
  return styles[status]
}

function priorityStyle(priority: ServiceRequest['priority']) {
  const styles = {
    LOW: 'text-slate-500',
    MEDIUM: 'text-amber-600',
    HIGH: 'text-red-600',
  }
  return styles[priority]
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [page, setPage] = useState(1)

  const filters: RequestFilters = {
    search: search.trim() || undefined,
    status: (status || undefined) as RequestStatus | undefined,
    category: (category || undefined) as RequestFilters['category'],
    priority: (priority || undefined) as RequestFilters['priority'],
    page,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }

  const { data, isLoading, isError, error, refetch, isFetching } = useRequests(filters)
  const updateStatus = useUpdateRequestStatus()

  const requests = data?.data.requests ?? []
  const pagination = data?.data.pagination
  const total = pagination?.total ?? 0

  const pendingCount = requests.filter((item) => item.status === 'PENDING').length
  const inProgressCount = requests.filter((item) => item.status === 'IN_PROGRESS').length
  const resolvedCount = requests.filter((item) => item.status === 'RESOLVED').length

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setPage(1)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      navigate('/login', { replace: true })
    }
  }

  const handleStatusUpdate = async (id: string, nextStatus: RequestStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: nextStatus })
    } catch {
      // The API error is displayed below.
    }
  }

  const mutationError = updateStatus.error
    ? axios.isAxiosError(updateStatus.error)
      ? updateStatus.error.response?.data?.message || 'Unable to update request status.'
      : 'Something went wrong while updating the request.'
    : null

  const queryError = isError
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || 'Unable to load service requests.'
      : 'Something went wrong while loading requests.'
    : null

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-blue-600">
              VISIONROOT TECHNOLOGIES
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Administration
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              Admin Portal
            </span>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Service Requests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review, track and manage customer service requests.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total requests</p>
              <ClipboardList className="text-blue-600" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{total}</p>
            <p className="mt-1 text-xs text-slate-400">Across all matching records</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <Clock3 className="text-amber-600" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{pendingCount}</p>
            <p className="mt-1 text-xs text-slate-400">On this page</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">In progress</p>
              <AlertCircle className="text-blue-600" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{inProgressCount}</p>
            <p className="mt-1 text-xs text-slate-400">On this page</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{resolvedCount}</p>
            <p className="mt-1 text-xs text-slate-400">On this page</p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative xl:col-span-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => handleFilterChange(setSearch)(event.target.value)}
                  placeholder="Search requests..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <select
                value={status}
                onChange={(event) => handleFilterChange(setStatus)(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={category}
                onChange={(event) => handleFilterChange(setCategory)(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(event) => handleFilterChange(setPriority)(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {mutationError && (
            <div role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {mutationError}
            </div>
          )}

          {queryError && (
            <div role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {queryError}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            </div>
          ) : requests.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <ClipboardList className="mx-auto text-slate-300" size={38} />
              <h3 className="mt-4 font-semibold text-slate-800">No requests found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Request</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Priority</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Created</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((request) => {
                      const nextStatuses: RequestStatus[] =
                        request.status === 'PENDING'
                          ? ['IN_PROGRESS', 'CANCELLED']
                          : request.status === 'IN_PROGRESS'
                            ? ['RESOLVED', 'CANCELLED']
                            : []

                      return (
                        <tr key={request._id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <p className="max-w-xs truncate text-sm font-semibold text-slate-800">
                              {request.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ID: {request._id.slice(-8)}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {request.category.replaceAll('_', ' ')}
                          </td>
                          <td className={`px-5 py-4 text-sm font-semibold ${priorityStyle(request.priority)}`}>
                            {request.priority}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(request.status)}`}>
                              {request.status.replaceAll('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/requests/${request._id}`}
                                title="View request"
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                              >
                                <Eye size={16} />
                              </Link>
                              {nextStatuses.length > 0 && (
                                <select
                                  aria-label={`Update status for ${request.title}`}
                                  defaultValue=""
                                  disabled={updateStatus.isPending}
                                  onChange={(event) => {
                                    const value = event.target.value as RequestStatus
                                    if (value) void handleStatusUpdate(request._id, value)
                                  }}
                                  className="max-w-36 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600 outline-none focus:border-blue-500 disabled:opacity-50"
                                >
                                  <option value="" disabled>Update status</option>
                                  {nextStatuses.map((nextStatus) => (
                                    <option key={nextStatus} value={nextStatus}>
                                      {nextStatus.replaceAll('_', ' ')}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing {requests.length} of {total} requests
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || isFetching}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-2 text-sm font-medium text-slate-600">
                    Page {page} of {pagination?.totalPages ?? 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={page >= (pagination?.totalPages ?? 1) || isFetching}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
