import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth-context'
import { Plus, Search, ClipboardList, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { useRequests } from '../hooks/useRequests'
import type { RequestStatus } from '../types/request.types'

const statusStyles: Record<RequestStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

const statusLabels: Record<RequestStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CANCELLED: 'Cancelled',
}

const categoryLabels: Record<string, string> = {
  TECHNICAL_SUPPORT: 'Technical Support',
  BILLING: 'Billing',
  ACCOUNT: 'Account',
  GENERAL: 'General',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MyRequestsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RequestStatus | ''>('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = useRequests({
    search: search.trim() || undefined,
    status: status || undefined,
    page,
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const requests = data?.data.requests ?? []
  const pagination = data?.data.pagination

  const summary = [
    {
      label: 'Total requests',
      value: pagination?.total ?? 0,
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending',
      value: requests.filter((item) => item.status === 'PENDING').length,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Resolved',
      value: requests.filter((item) => item.status === 'RESOLVED').length,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Cancelled',
      value: requests.filter((item) => item.status === 'CANCELLED').length,
      icon: XCircle,
      color: 'bg-slate-100 text-slate-600',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600">VISIONROOT SERVICE DESK</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My service requests
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track and manage the service requests you have submitted.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/requests/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={17} />
              New request
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>

        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summary.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon size={19} />
                </div>
                <p className="mt-4 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
              </div>
            )
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-slate-900">Request history</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search requests..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                />
              </div>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as RequestStatus | '')
                  setPage(1)
                }}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <p className="text-sm text-red-600">Unable to load your requests.</p>
              <button onClick={() => void refetch()} className="mt-3 text-sm font-semibold text-blue-600">
                Try again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <ClipboardList size={38} className="mx-auto text-slate-300" />
              <h3 className="mt-4 font-semibold text-slate-800">No requests found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {search || status ? 'Try changing your search or filter.' : 'You have not submitted a service request yet.'}
              </p>
              {!search && !status && (
                <Link to="/requests/new" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <Plus size={16} /> Create your first request
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <div key={request._id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{request.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[request.status]}`}>
                          {statusLabels[request.status]}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{request.description}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                        <span>{categoryLabels[request.category]}</span>
                        <span>Priority: {request.priority}</span>
                        <span>{formatDate(request.createdAt)}</span>
                      </div>
                    </div>
                    <Link
                      to={`/requests/${request._id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                    >
                      <Eye size={16} />
                      View details
                    </Link>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing {requests.length} of {pagination?.total ?? 0} requests
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-sm text-slate-500">
                    {pagination?.page ?? page} / {Math.max(pagination?.totalPages ?? 1, 1)}
                  </span>
                  <button
                    disabled={page >= (pagination?.totalPages ?? 1)}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
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
