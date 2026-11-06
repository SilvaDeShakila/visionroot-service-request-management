import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Flag,
  Pencil,
  Tag,
  Trash2,
  UserRound,
  XCircle,
} from 'lucide-react'
import { useRequest, useDeleteRequest, useUpdateRequestStatus } from '../hooks/useRequests'
import { useAuth } from '../../auth/auth-context'
import type { RequestStatus } from '../types/request.types'

const statusStyles: Record<RequestStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-200',
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

const nextStatuses: Record<RequestStatus, RequestStatus[]> = {
  PENDING: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: [],
  CANCELLED: [],
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getInitials(name?: string) {
  if (!name) return 'U'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function RequestDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data, isLoading, isError, refetch } = useRequest(id)
  const deleteRequest = useDeleteRequest()
  const updateStatus = useUpdateRequestStatus()

  const request = data?.data.request
  const isAdmin = user?.role === 'ADMIN'
  const canEdit = request?.status === 'PENDING'
  const canCancel = request?.status === 'PENDING'
  const availableStatuses = request ? nextStatuses[request.status] : []

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) return

    try {
      await deleteRequest.mutateAsync(id)
      navigate('/requests')
    } catch {
      // Mutation error is displayed below.
    }
  }

  const handleStatusChange = async (status: RequestStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status })
    } catch {
      // Mutation error is displayed below.
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading request details...</p>
        </div>
      </main>
    )
  }

  if (isError || !request) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FileText size={26} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">Request not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This request may not exist or you may not have permission to view it.
          </p>
          <button
            onClick={() => void refetch()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try again
          </button>
          <Link
            to={isAdmin ? '/admin/requests' : '/requests'}
            className="mt-4 block text-sm font-semibold text-slate-500 hover:text-blue-600"
          >
            Back to requests
          </Link>
        </div>
      </main>
    )
  }

  const priorityStyles =
    request.priority === 'HIGH'
      ? 'bg-red-50 text-red-700'
      : request.priority === 'MEDIUM'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-100 text-slate-600'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={isAdmin ? '/admin' : '/requests'} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              V
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">VisionRoot</span>
              <span className="ml-2 hidden text-xs font-medium text-slate-400 sm:inline">
                {isAdmin ? 'Admin Portal' : 'Customer Portal'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {getInitials(user?.name)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to={isAdmin ? '/admin/requests' : '/requests'}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to {isAdmin ? 'all requests' : 'my requests'}
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              {isAdmin ? 'Administration' : 'My requests'}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Request details
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review the information and current progress of this request.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold ring-1 ring-inset ${statusStyles[request.status]}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {statusLabels[request.status]}
          </span>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  Request #{request._id.slice(-8).toUpperCase()}
                </span>
                <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${priorityStyles}`}>
                  {request.priority} priority
                </span>
              </div>

              <h2 className="mt-5 break-words text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                {request.title}
              </h2>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <FileText size={15} />
                  Description
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                  {request.description}
                </p>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Tag size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">Category</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {categoryLabels[request.category] ?? request.category.replaceAll('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Flag size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">Priority</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {request.priority}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CalendarDays size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">Submitted</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock3 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">Last updated</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(request.updatedAt)}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <UserRound size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Submitted by (User ID)</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                      {request.user}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">Available actions</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {isAdmin
                  ? 'Manage the progress and status of this customer request.'
                  : 'Manage your request while it is still pending.'}
              </p>

              <div className="mt-5 space-y-3">
                {!isAdmin && canEdit && (
                  <Link
                    to={`/requests/${id}/edit`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Pencil size={16} />
                    Edit request
                  </Link>
                )}

                {isAdmin && availableStatuses.map((status) => (
                  <button
                    key={status}
                    disabled={updateStatus.isPending}
                    onClick={() => void handleStatusChange(status)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'IN_PROGRESS'
                      ? 'Start working'
                      : status === 'RESOLVED'
                        ? 'Mark as resolved'
                        : 'Cancel request'}
                  </button>
                ))}

                {!isAdmin && canCancel && (
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() => void handleStatusChange('CANCELLED')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Cancel request
                  </button>
                )}

                {!isAdmin && canEdit && (
                  <button
                    disabled={deleteRequest.isPending}
                    onClick={() => void handleDelete()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete request
                  </button>
                )}

                {availableStatuses.length === 0 && (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 size={17} />
                      <span className="text-sm font-semibold">Request completed</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      This request has reached a final status. No further status changes are available.
                    </p>
                  </div>
                )}
              </div>

              {(updateStatus.isError || deleteRequest.isError) && (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  Unable to complete the action. Please try again.
                </p>
              )}

              {updateStatus.isPending && (
                <p className="mt-3 text-center text-xs text-slate-500">Updating request status...</p>
              )}
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <CheckCircle2 size={19} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">Request information</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your request details accurate. You can edit or cancel a pending request before it is processed.
              </p>
            </section>
          </aside>
        </div>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} VisionRoot. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
