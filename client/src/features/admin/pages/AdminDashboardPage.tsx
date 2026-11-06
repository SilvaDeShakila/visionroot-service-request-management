import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  AlertCircle,
  Loader2,
  CalendarDays,
  Filter,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useAuth } from '../../auth/auth-context'
import { useRequests } from '../../requests/hooks/useRequests'
import type { RequestStatus } from '../../requests/types/request.types'

const statusMeta: Record<RequestStatus, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
  RESOLVED: { label: 'Resolved', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
}

const categoryLabels: Record<string, string> = {
  TECHNICAL_SUPPORT: 'Technical Support',
  BILLING: 'Billing',
  ACCOUNT: 'Account',
  GENERAL: 'General',
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | RequestStatus>('ALL')

  const recentQuery = useRequests({ page: 1, limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })
  const pendingQuery = useRequests({ status: 'PENDING', page: 1, limit: 1 })
  const progressQuery = useRequests({ status: 'IN_PROGRESS', page: 1, limit: 1 })
  const resolvedQuery = useRequests({ status: 'RESOLVED', page: 1, limit: 1 })
  const cancelledQuery = useRequests({ status: 'CANCELLED', page: 1, limit: 1 })

  const requests = recentQuery.data?.data.requests ?? []
  const total = recentQuery.data?.data.pagination.total ?? 0
  const pending = pendingQuery.data?.data.pagination.total ?? 0
  const inProgress = progressQuery.data?.data.pagination.total ?? 0
  const resolved = resolvedQuery.data?.data.pagination.total ?? 0
  const cancelled = cancelledQuery.data?.data.pagination.total ?? 0

  const queries = [recentQuery, pendingQuery, progressQuery, resolvedQuery, cancelledQuery]
  const loading = queries.some((query) => query.isLoading)
  const error = queries.some((query) => query.isError)

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase()
    return requests.filter((request) => {
      const matchesSearch = !term || [
        request.title,
        request.description,
        request._id,
        categoryLabels[request.category] ?? request.category,
      ].join(' ').toLowerCase().includes(term)

      return matchesSearch && (statusFilter === 'ALL' || request.status === statusFilter)
    })
  }, [requests, search, statusFilter])

  const stats = [
    { label: 'Total Requests', value: total, icon: ClipboardList, accent: 'text-violet-600', surface: 'bg-violet-50', note: 'All submitted requests' },
    { label: 'Pending', value: pending, icon: Clock3, accent: 'text-amber-600', surface: 'bg-amber-50', note: 'Waiting for attention' },
    { label: 'In Progress', value: inProgress, icon: RefreshCw, accent: 'text-blue-600', surface: 'bg-blue-50', note: 'Currently being handled' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, accent: 'text-emerald-600', surface: 'bg-emerald-50', note: 'Successfully completed' },
    { label: 'Cancelled', value: cancelled, icon: XCircle, accent: 'text-slate-500', surface: 'bg-slate-100', note: 'Closed without resolution' },
  ]

  const distribution = [
    { label: 'Pending', value: pending, color: 'bg-amber-500' },
    { label: 'In Progress', value: inProgress, color: 'bg-blue-500' },
    { label: 'Resolved', value: resolved, color: 'bg-emerald-500' },
    { label: 'Cancelled', value: cancelled, color: 'bg-slate-400' },
  ]

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Monitor platform activity and service request performance."
    >
      <section className="relative overflow-hidden rounded-[26px] bg-[#211c4b] px-6 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full border-[50px] border-violet-400/[0.09]" />
        <div className="pointer-events-none absolute -bottom-36 right-48 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative z-[1] flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-semibold text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ADMINISTRATOR WORKSPACE
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-[32px]">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Administrator'}.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/75">
              Here is an overview of your service request platform. Monitor activity and keep everything moving.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
            <CalendarDays className="text-violet-200" size={19} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/70">Today</p>
              <p className="mt-0.5 text-sm font-semibold">{today}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">Platform Performance</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Service Request Overview</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live database figures
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
            <Loader2 className="mr-2 animate-spin text-violet-600" size={19} />
            Loading platform statistics...
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            <AlertCircle size={20} />
            Unable to load dashboard statistics. Check the server connection and refresh the page.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <article key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.surface} ${stat.accent}`}>
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Overview</span>
                  </div>
                  <p className="mt-5 text-[13px] font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-[30px] font-bold tracking-tight text-slate-900">{stat.value.toLocaleString()}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{stat.note}</p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {!loading && !error && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">Request Status Distribution</h3>
                <p className="mt-1 text-xs text-slate-400">Breakdown of all service requests</p>
              </div>
              <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-center">
              <div
                className="relative mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: total > 0
                    ? `conic-gradient(#10b981 0% ${(resolved / total) * 100}%, #3b82f6 ${(resolved / total) * 100}% ${((resolved + inProgress) / total) * 100}%, #f59e0b ${((resolved + inProgress) / total) * 100}% ${((resolved + inProgress + pending) / total) * 100}%, #94a3b8 ${((resolved + inProgress + pending) / total) * 100}% 100%)`
                    : '#e2e8f0',
                }}
              >
                <div className="flex h-[126px] w-[126px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">{total}</span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Requests</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                {distribution.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {item.value} <span className="font-normal text-slate-400">{total ? `(${Math.round((item.value / total) * 100)}%)` : '(0%)'}</span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full transition-all duration-700 ${item.color}`} style={{ width: `${total ? (item.value / total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Platform Snapshot</h3>
                <p className="mt-1 text-xs text-slate-400">Current request workload</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Completion Rate</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{total ? Math.round((resolved / total) * 100) : 0}%</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={21} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Awaiting Attention</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{pending.toLocaleString()}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Clock3 size={21} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Currently Active</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{inProgress.toLocaleString()}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <RefreshCw size={21} />
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Recent Service Requests</h2>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">LATEST 8</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">A quick look at the latest activity on your platform</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="search"
                aria-label="Search service requests"
                placeholder="Search requests..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 sm:w-56"
              />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <select
                aria-label="Filter requests by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'ALL' | RequestStatus)}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-medium text-slate-600 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:w-40"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 animate-spin text-violet-600" size={19} />
            Loading recent requests...
          </div>
        ) : error ? (
          <div className="flex min-h-48 items-center justify-center gap-2 px-5 text-sm text-rose-600">
            <AlertCircle size={18} />
            Could not load recent requests. Please refresh and try again.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-6 py-4">Request Details</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((request) => {
                    const status = statusMeta[request.status]
                    return (
                      <tr key={request._id} className="transition-colors hover:bg-violet-50/30">
                        <td className="px-6 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                              <ClipboardList size={17} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate text-xs font-bold text-slate-800">{request.title}</p>
                              <p className="mt-1 text-[10px] text-slate-400">ID: {request._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-600">{categoryLabels[request.category] ?? request.category}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            request.priority === 'HIGH' ? 'text-rose-600' :
                            request.priority === 'MEDIUM' ? 'text-amber-600' : 'text-slate-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              request.priority === 'HIGH' ? 'bg-rose-500' :
                              request.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            {request.priority.charAt(0) + request.priority.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ring-1 ring-inset ${status.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-500">{formatDate(request.createdAt)}</td>
                      </tr>
                    )
                  })}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <ClipboardList size={22} />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          {search || statusFilter !== 'ALL' ? 'No matching requests found' : 'No service requests yet'}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {search || statusFilter !== 'ALL' ? 'Try changing your search or status filter.' : 'New requests will appear here when submitted.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[11px] text-slate-400">
                Showing <span className="font-bold text-slate-600">{filteredRequests.length}</span> of {requests.length} recent requests
                <span className="mx-1.5 text-slate-300">|</span>
                <span className="font-semibold text-slate-600">{total.toLocaleString()}</span> total records
              </p>
              <button
                type="button"
                onClick={() => navigate('/admin/requests')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
              >
                View All Service Requests
                <ArrowUpRight size={15} />
              </button>
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  )
}
