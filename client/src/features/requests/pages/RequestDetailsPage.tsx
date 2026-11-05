import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, UserRound, Tag, Trash2, Pencil, CheckCircle2 } from 'lucide-react'
import { useRequest, useDeleteRequest, useUpdateRequestStatus } from '../hooks/useRequests'
import { useAuth } from '../../auth/auth-context'
import type { RequestStatus } from '../types/request.types'

const statusStyles: Record<RequestStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  RESOLVED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
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
      // The mutation error is displayed below.
    }
  }

  const handleStatusChange = async (status: RequestStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status })
    } catch {
      // The mutation error is displayed below.
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    )
  }

  if (isError || !request) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Request not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            This request may not exist or you may not have permission to view it.
          </p>
          <button onClick={() => void refetch()} className="mt-4 text-sm font-semibold text-blue-600">
            Try again
          </button>
          <Link to="/requests" className="mt-4 block text-sm font-semibold text-slate-600">
            Back to requests
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to={isAdmin ? '/admin' : '/requests'}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[request.status]}`}>
                {statusLabels[request.status]}
              </span>
              <span className="text-xs text-slate-400">
                Request ID: {request._id}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              {request.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {request.description}
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div className="flex items-start gap-3">
              <Tag size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-400">Category</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {categoryLabels[request.category]}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-400">Priority</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {request.priority}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-400">Submitted</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-400">Last updated</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(request.updatedAt)}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <UserRound size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-400">Submitted by (User ID)</p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {request.user}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-8">
            <h2 className="font-semibold text-slate-900">Available actions</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {!isAdmin && canEdit && (
                <Link
                  to={`/requests/${id}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600"
                >
                  <Pencil size={16} /> Edit request
                </Link>
              )}

              {isAdmin && availableStatuses.map((status) => (
                <button
                  key={status}
                  disabled={updateStatus.isPending}
                  onClick={() => void handleStatusChange(status)}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {status === 'IN_PROGRESS' ? 'Start working' : status === 'RESOLVED' ? 'Mark as resolved' : 'Cancel request'}
                </button>
              ))}

              {!isAdmin && canCancel && (
                <button
                  disabled={updateStatus.isPending}
                  onClick={() => void handleStatusChange('CANCELLED')}
                  className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel request
                </button>
              )}

              {!isAdmin && canEdit && (
                <button
                  disabled={deleteRequest.isPending}
                  onClick={() => void handleDelete()}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} /> Delete request
                </button>
              )}

              {availableStatuses.length === 0 && (
                <p className="text-sm text-slate-500">
                  This request has reached a final status. No further status changes are available.
                </p>
              )}
            </div>

            {(updateStatus.isError || deleteRequest.isError) && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                Unable to complete the action. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
