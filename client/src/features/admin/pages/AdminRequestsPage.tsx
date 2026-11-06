import { useState } from 'react'
import { Search, ClipboardList, Clock3, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useRequests, useUpdateRequestStatus } from '../../requests/hooks/useRequests'
import type { RequestStatus } from '../../requests/types/request.types'

const statusStyles: Record<RequestStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200',
}

const statusLabels: Record<RequestStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CANCELLED: 'Cancelled',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminRequestsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filters = {
    search: search.trim() || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter as RequestStatus,
    page: 1,
    limit: 100,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  }

  const { data, isLoading, isError, refetch, isFetching } = useRequests(filters)
  const updateStatus = useUpdateRequestStatus()
  const requests = data?.data.requests ?? []
  const total = data?.data.pagination.total ?? requests.length

  const handleStatusChange = (id: string, status: RequestStatus) => {
    updateStatus.mutate({ id, status })
  }

  return (
    <AdminLayout
      title="Service Requests"
      subtitle="Review and manage service requests submitted to VisionRoot."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Requests</p>
            <span className="rounded-xl bg-violet-50 p-2.5 text-violet-600"><ClipboardList size={19} /></span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{total}</p>
          <p className="mt-1 text-xs text-slate-400">All submitted requests</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Clock3 size={19} /></span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{requests.filter((r) => r.status === 'PENDING').length}</p>
          <p className="mt-1 text-xs text-slate-400">Awaiting attention in this list</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><RefreshCw size={19} /></span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{requests.filter((r) => r.status === 'IN_PROGRESS').length}</p>
          <p className="mt-1 text-xs text-slate-400">Currently being handled</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Resolved</p>
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><CheckCircle2 size={19} /></span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{requests.filter((r) => r.status === 'RESOLVED').length}</p>
          <p className="mt-1 text-xs text-slate-400">Successfully completed</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Service Requests</h2>
            <p className="mt-1 text-xs text-slate-400">Search, review and update request statuses.</p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by request title or description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-500">
            <RefreshCw size={18} className="animate-spin text-violet-600" />
            Loading service requests...
          </div>
        ) : isError ? (
          <div className="px-6 py-16 text-center">
            <AlertCircle size={30} className="mx-auto text-rose-500" />
            <p className="mt-3 font-semibold text-slate-800">Unable to load requests</p>
            <p className="mt-1 text-sm text-slate-500">Please check the server connection and try again.</p>
            <button onClick={() => void refetch()} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Try again</button>
          </div>
        ) : requests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ClipboardList size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">No requests found</p>
            <p className="mt-1 text-sm text-slate-400">Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4">Request</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr key={request._id} className="transition hover:bg-slate-50/70">
                    <td className="max-w-[280px] px-5 py-4">
                      <p className="truncate text-sm font-semibold text-slate-800">{request.title}</p>
                      <p className="mt-1 truncate text-xs text-slate-400">{request.description}</p>
                      <p className="mt-1 text-[10px] text-slate-400">ID: {request._id}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{request.category.replaceAll('_', ' ')}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        request.priority === 'HIGH' ? 'bg-rose-50 text-rose-700' :
                        request.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{request.priority}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatDate(request.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Update status for ${request.title}`}
                        value={request.status}
                        disabled={updateStatus.isPending}
                        onChange={(event) => handleStatusChange(request._id, event.target.value as RequestStatus)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          Showing {requests.length} of {total} requests
        </div>
      </section>
    </AdminLayout>
  )
}

