import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth-context'
import {
  Plus, Search, ClipboardList, Clock, CheckCircle2,
  XCircle, LogOut, LayoutDashboard, ChevronLeft,
  ChevronRight, RefreshCw, FileText, ArrowUpRight,
  Headphones, LifeBuoy, Settings, Menu,
  Sparkles, ArrowRight, Activity, CalendarDays,
  CircleDot, Zap
} from 'lucide-react'
import { useRequests } from '../hooks/useRequests'
import type { RequestStatus } from '../types/request.types'

const statusStyles: Record<RequestStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
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

const statusOptions: { label: string; value: RequestStatus | '' }[] = [
  { label: 'All requests', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

function formatDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable'

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInitials(name?: string) {
  return name
    ? name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
    : 'U'
}

function getAvatarUrl(avatar: string | null | undefined) {
  if (!avatar) return null

  if (avatar.startsWith('preset:')) {
    return `/avatars/${avatar.slice(7)}.svg`
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  return `${new URL(apiBaseUrl).origin}${avatar}`
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'HIGH':
      return 'bg-rose-50 text-rose-700'
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-700'
    case 'LOW':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function MyRequestsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // Fetch complete status counts independently of the current list filters.
  const { data: allRequestsData } = useRequests({ page: 1, limit: 1 })
  const { data: pendingData } = useRequests({ status: 'PENDING', page: 1, limit: 1 })
  const { data: inProgressData } = useRequests({ status: 'IN_PROGRESS', page: 1, limit: 1 })
  const { data: resolvedData } = useRequests({ status: 'RESOLVED', page: 1, limit: 1 })
  const { data: cancelledData } = useRequests({ status: 'CANCELLED', page: 1, limit: 1 })

  const summary = [
    {
      label: 'Total requests',
      value: allRequestsData?.data.pagination.total ?? 0,
      icon: ClipboardList,
      iconStyle: 'bg-blue-50 text-blue-700',
      description: 'Your submitted requests',
    },
    {
      label: 'Pending',
      value: pendingData?.data.pagination.total ?? 0,
      icon: Clock,
      iconStyle: 'bg-amber-50 text-amber-700',
      description: 'Awaiting attention',
    },
    {
      label: 'In Progress',
      value: inProgressData?.data.pagination.total ?? 0,
      icon: Activity,
      iconStyle: 'bg-indigo-50 text-indigo-700',
      description: 'Currently being handled',
    },
    {
      label: 'Resolved',
      value: resolvedData?.data.pagination.total ?? 0,
      icon: CheckCircle2,
      iconStyle: 'bg-emerald-50 text-emerald-700',
      description: 'Successfully completed',
    },
    {
      label: 'Cancelled',
      value: cancelledData?.data.pagination.total ?? 0,
      icon: XCircle,
      iconStyle: 'bg-slate-100 text-slate-600',
      description: 'Closed requests',
    },
  ]
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-[258px] shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
          <Link to="/requests" className="flex h-[82px] items-center gap-3 border-b border-slate-100 px-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <LayoutDashboard size={21} />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-950">VisionRoot</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Service desk</p>
            </div>
          </Link>

          <div className="flex-1 px-4 py-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">
              <Link
                to="/requests"
                className="flex items-center gap-3 rounded-xl bg-blue-50 px-3.5 py-3 text-sm font-bold text-blue-700"
              >
                <LayoutDashboard size={18} />
                My requests
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
              </Link>

              <Link
                to="/requests/new"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Plus size={18} />
                Create a request
              </Link>
            </nav>

            <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Help & support
            </p>

            <div className="space-y-1">
              <Link
                to="/support"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <LifeBuoy size={18} />
                Support centre
              </Link>
              <Link
                to="/preferences"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings size={18} />
                Preferences
              </Link>
            </div>
          </div>

          <div className="p-4">
            <div className="rounded-2xl bg-[#101d38] p-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Headphones size={18} />
              </div>
              <p className="mt-4 text-sm font-bold">Need assistance?</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Submit a service request and our team will review it.
              </p>
              <Link
                to="/requests/new"
                className="mt-4 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2.5 text-xs font-semibold transition hover:bg-white/20"
              >
                Get support <ArrowUpRight size={14} />
              </Link>
            </div>


          </div>
        </aside>

        {/* Main workspace */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between px-4 sm:px-7 xl:px-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                  aria-label="Toggle navigation"
                >
                  <Menu size={21} />
                </button>
                <div>
                  <p className="text-sm font-bold text-slate-900">Customer workspace</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Manage your service requests</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                <Link to="/profile" className="flex items-center gap-3 rounded-xl transition hover:opacity-80" aria-label="Open my profile">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'Customer'}</p>
                    <p className="text-[11px] text-slate-400">Customer account · My profile</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-100 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-100">
                    {user?.avatar ? (
                      <img
                        src={getAvatarUrl(user.avatar) ?? undefined}
                        alt={`${user.name}'s profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </div>
            </div>

            {/* Mobile navigation */}
            {mobileMenuOpen && (
              <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
                <nav className="flex flex-col gap-1">
                  <Link
                    to="/requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700"
                  >
                    <LayoutDashboard size={17} /> My requests
                  </Link>
                  <Link
                    to="/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <LifeBuoy size={17} /> Support centre
                  </Link>
                  <Link
                    to="/requests/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Plus size={17} /> Create a request
                  </Link>
                </nav>
              </div>
            )}
          </header>

          <main className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 sm:py-9 xl:px-10">
            {/* Welcome panel */}
            <section className="relative isolate overflow-hidden rounded-[26px] bg-[#101e3a] px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10">
              <div className="absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border-[45px] border-white/[0.035]" />
              <div className="absolute -bottom-40 right-40 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute right-10 top-8 hidden h-24 w-24 rounded-3xl border border-white/10 bg-white/[0.04] rotate-12 lg:block" />

              <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-blue-200">
                    <Sparkles size={13} />
                    Your service workspace
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Welcome back, {firstName}.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-[15px]">
                    Everything you need to manage your service requests, follow progress and stay connected with our support team.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      to="/requests/new"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
                    >
                      <Plus size={17} /> Create a request <ArrowRight size={16} />
                    </Link>
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
                      <Activity size={15} className="text-emerald-400" />
                      Your support hub
                    </span>
                  </div>
                </div>

                <div className="hidden min-w-[210px] rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm md:block">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Activity size={16} className="text-emerald-400" />
                    Request updates
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">
                    Stay informed
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    Open any request to review its current status and details.
                  </p>
                </div>
              </div>
            </section>

            {/* Summary cards */}
            <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-5 xl:gap-4">
              {summary.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.025)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconStyle}`}>
                        <Icon size={19} />
                      </div>
                      <ArrowUpRight size={16} className="text-slate-300 transition group-hover:text-blue-500" />
                    </div>
                    <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{item.value}</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{item.label}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{item.description}</p>
                  </div>
                )
              })}
            </section>

            {/* Request history */}
            <section className="mt-8">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <FileText size={18} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Your requests</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Keep track of the service requests you have submitted.
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {pagination?.total ?? 0} request{pagination?.total === 1 ? '' : 's'} in total
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_3px_15px_rgba(15,23,42,0.035)]">
                {/* Search and filters */}
                <div className="border-b border-slate-100 px-4 pt-5 sm:px-6">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value || 'ALL'}
                          type="button"
                          onClick={() => {
                            setStatus(option.value)
                            setPage(1)
                          }}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            status === option.value
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative mb-4 lg:mb-0 lg:w-64">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value)
                          setPage(1)
                        }}
                        placeholder="Search your requests..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                    <p className="mt-4 text-sm font-medium text-slate-500">Loading your requests...</p>
                  </div>
                ) : isError ? (
                  <div className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                      <RefreshCw size={24} />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900">Unable to load requests</h3>
                    <p className="mt-2 text-sm text-slate-500">Something went wrong while retrieving your requests.</p>
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <RefreshCw size={15} /> Try again
                    </button>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <ClipboardList size={29} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {search || status ? 'No matching requests' : 'Your workspace is ready'}
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      {search || status
                        ? 'We could not find any requests matching your search. Try a different keyword or status.'
                        : 'You have not submitted a service request yet. Create your first request and our team can help you.'}
                    </p>
                    {!search && !status && (
                      <Link
                        to="/requests/new"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Plus size={17} /> Create your first request
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-slate-100">
                      {requests.map((request) => (
                        <article
                          key={request._id}
                          className="group px-4 py-5 transition hover:bg-slate-50/70 sm:px-6"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 transition group-hover:text-blue-700 sm:text-[15px]">
                                  {request.title}
                                </h3>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[request.status]}`}>
                                  <CircleDot size={11} />
                                  {statusLabels[request.status]}
                                </span>
                              </div>

                              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                                {request.description}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                  <Headphones size={13} className="text-slate-400" />
                                  {categoryLabels[request.category] ?? request.category}
                                </span>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ${getPriorityStyle(request.priority)}`}>
                                  <Zap size={11} className="mr-1" />
                                  {request.priority} priority
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                  <CalendarDays size={13} />
                                  {formatDate(request.createdAt)}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center sm:self-center">
                              <Link
                                to={`/requests/${request._id}`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                              >
                                View details
                                <ArrowUpRight size={15} />
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <p className="text-xs text-slate-500">
                        Showing <span className="font-bold text-slate-800">{requests.length}</span> of{' '}
                        <span className="font-bold text-slate-800">{pagination?.total ?? 0}</span> requests
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={page <= 1}
                          onClick={() => setPage((current) => current - 1)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft size={15} /> Previous
                        </button>
                        <span className="min-w-14 text-center text-xs font-bold text-slate-600">
                          {pagination?.page ?? page} / {Math.max(pagination?.totalPages ?? 1, 1)}
                        </span>
                        <button
                          type="button"
                          disabled={page >= (pagination?.totalPages ?? 1)}
                          onClick={() => setPage((current) => current + 1)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <footer className="mt-9 flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 py-5 text-[11px] text-slate-400 sm:flex-row">
              <p>Â© {new Date().getFullYear()} VisionRoot. All rights reserved.</p>
              <p className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Customer service workspace
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}





