import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LifeBuoy, Search, MessageSquare, Clock, Loader2,
  AlertCircle, ArrowUpRight, Filter, RefreshCw,
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useSupportTickets } from '../../support/hooks/useSupport'
import type {
  SupportPriority,
  SupportStatus,
} from '../../support/support.types'

const statusLabels: Record<SupportStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_FOR_USER: 'Waiting for User',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const statusStyles: Record<SupportStatus, string> = {
  OPEN: 'bg-blue-50 text-blue-700',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700',
  WAITING_FOR_USER: 'bg-amber-50 text-amber-700',
  RESOLVED: 'bg-emerald-50 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-600',
}

const priorityStyles: Record<SupportPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-50 text-amber-700',
  HIGH: 'bg-rose-50 text-rose-700',
}

function formatDate(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable'

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AdminSupportPage() {
  const [status, setStatus] = useState<SupportStatus | ''>('')
  const [priority, setPriority] = useState<SupportPriority | ''>('')
  const [search, setSearch] = useState('')

  const filters = {
    page: 1,
    limit: 50,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
  }

  const { data, isLoading, isError, refetch, isFetching } =
    useSupportTickets(filters)

  const tickets = data?.data.tickets ?? []
  const filteredTickets = tickets.filter((ticket) => {
    const term = search.trim().toLowerCase()
    if (!term) return true

    return (
      ticket.subject.toLowerCase().includes(term) ||
      ticket.user.name.toLowerCase().includes(term) ||
      ticket.user.email.toLowerCase().includes(term) ||
      ticket._id.toLowerCase().includes(term)
    )
  })

  const total = data?.data.pagination.total ?? 0

  return (
    <AdminLayout title="Support Centre" subtitle="Review customer requests and manage support conversations.">
      <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <LifeBuoy size={17} />
            Customer Support
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Support Centre
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review customer requests and manage support conversations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total matching tickets</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{total}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tickets shown</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {filteredTickets.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Filter size={23} />
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <h2 className="font-semibold text-slate-900">Filter tickets</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_190px_190px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subject, customer or ticket ID..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as SupportStatus | '')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_USER">Waiting for User</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as SupportPriority | '')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All priorities</option>
            <option value="LOW">Low priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="HIGH">High priority</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900">Customer tickets</h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest updated support conversations
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {filteredTickets.length} shown
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            Loading support tickets...
          </div>
        ) : isError ? (
          <div className="px-5 py-14 text-center">
            <AlertCircle size={30} className="mx-auto mb-3 text-rose-500" />
            <p className="font-semibold text-slate-800">Unable to load tickets</p>
            <p className="mt-1 text-sm text-slate-500">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800">No support tickets found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing the filters or search term.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/admin/support/${ticket._id}`}
                className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[ticket.status]}`}>
                      {statusLabels[ticket.status]}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[ticket.priority]}`}>
                      {ticket.priority} priority
                    </span>
                    <span className="text-xs text-slate-400">
                      {ticket.category}
                    </span>
                  </div>

                  <h3 className="truncate font-semibold text-slate-900 group-hover:text-blue-700">
                    {ticket.subject}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {ticket.user.name} · {ticket.user.email}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} />
                      Updated {formatDate(ticket.updatedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare size={13} />
                      {ticket.replies.length + 1} messages
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-xs text-slate-400">
                    #{ticket._id.slice(-8)}
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
          </div>
    </AdminLayout>
  )
}

