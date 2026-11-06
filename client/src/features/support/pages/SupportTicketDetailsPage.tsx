import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  LifeBuoy, ArrowLeft, Send, Loader2, AlertCircle,
  Clock, User, ShieldCheck, MessageSquare, RefreshCw,
} from 'lucide-react'
import { useAuth } from '../../auth/auth-context'
import {
  useSupportTicket,
  useAddSupportReply,
  useUpdateSupportStatus,
} from '../hooks/useSupport'
import type { SupportStatus } from '../support.types'

const statusStyles: Record<SupportStatus, string> = {
  OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  WAITING_FOR_USER: 'bg-amber-50 text-amber-700 border-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
}

const statusLabels: Record<SupportStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_FOR_USER: 'Waiting for User',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const statusOptions: SupportStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_USER',
  'RESOLVED',
  'CLOSED',
]

function formatDateTime(date: string) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable'

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function SupportTicketDetailsPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [reply, setReply] = useState('')
  const [replyError, setReplyError] = useState('')
  const [statusError, setStatusError] = useState('')

  const { data, isLoading, isError, refetch } = useSupportTicket(id)
  const addReply = useAddSupportReply()
  const updateStatus = useUpdateSupportStatus()

  const ticket = data?.data.ticket
  const isAdmin = user?.role === 'ADMIN'
  const isClosed = ticket?.status === 'CLOSED'

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setReplyError('')

    if (reply.trim().length === 0) {
      setReplyError('Please enter a message.')
      return
    }

    try {
      await addReply.mutateAsync({
        id,
        message: reply.trim(),
      })
      setReply('')
    } catch {
      setReplyError('Unable to send your reply. Please try again.')
    }
  }

  async function handleStatusChange(status: SupportStatus) {
    setStatusError('')

    try {
      await updateStatus.mutateAsync({ id, status })
    } catch {
      setStatusError('Unable to update the ticket status. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 size={24} className="mr-3 animate-spin" />
        Loading support conversation...
      </div>
    )
  }

  if (isError || !ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle size={34} className="mx-auto mb-4 text-rose-500" />
          <h2 className="text-lg font-bold text-slate-900">Ticket unavailable</h2>
          <p className="mt-2 text-sm text-slate-500">
            This ticket could not be found or you may not have permission to view it.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => void refetch()}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Try again
            </button>
            <button
              onClick={() => navigate(isAdmin ? '/admin/support' : '/support')}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to tickets
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to={isAdmin ? '/admin/support' : '/support'} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <LifeBuoy size={21} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">VisionRoot</h1>
              <p className="text-xs text-slate-500">Support conversation</p>
            </div>
          </Link>
          <Link
            to={isAdmin ? '/admin/support' : '/support'}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            Back to tickets
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {statusLabels[ticket.status]}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {ticket.priority} priority
                </span>
                <span className="text-xs text-slate-400">{ticket.category}</span>
              </div>
              <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                {ticket.subject}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Ticket #{ticket._id}
              </p>
            </div>

            {isAdmin && (
              <div className="w-full shrink-0 sm:w-56">
                <label htmlFor="ticket-status" className="mb-2 block text-xs font-semibold text-slate-500">
                  Update ticket status
                </label>
                <select
                  id="ticket-status"
                  value={ticket.status}
                  disabled={updateStatus.isPending}
                  onChange={(event) => void handleStatusChange(event.target.value as SupportStatus)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{statusLabels[status]}</option>
                  ))}
                </select>
                {statusError && <p role="alert" className="mt-2 text-xs text-rose-600">{statusError}</p>}
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <User size={16} />
                {ticket.user.name} ({ticket.user.email})
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} />
                Submitted {formatDateTime(ticket.createdAt)}
              </span>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2">
              <MessageSquare size={19} className="text-blue-600" />
              <h3 className="font-bold text-slate-900">Conversation</h3>
            </div>
            <span className="text-xs text-slate-400">
              {ticket.replies.length + 1} messages
            </span>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <article className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <User size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {ticket.user.name}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                    CUSTOMER
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDateTime(ticket.createdAt)}
                  </span>
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <p className="whitespace-pre-wrap break-words">{ticket.message}</p>
                </div>
              </div>
            </article>

            {ticket.replies.map((item) => {
              const adminReply = item.senderRole === 'ADMIN'

              return (
                <article key={item._id} className="flex gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    adminReply ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {adminReply ? <ShieldCheck size={19} /> : <User size={19} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.sender?.name || (adminReply ? 'Support team' : 'Customer')}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        adminReply ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {adminReply ? 'SUPPORT TEAM' : 'CUSTOMER'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>
                    <div className={`rounded-2xl p-4 text-sm leading-7 ${
                      adminReply
                        ? 'rounded-tl-sm bg-indigo-50 text-slate-700'
                        : 'rounded-tl-sm bg-slate-50 text-slate-700'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{item.message}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="border-t border-slate-100 p-5 sm:p-7">
            {isClosed ? (
              <div className="rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-600">
                This ticket is closed. Replies are disabled.
              </div>
            ) : (
              <form onSubmit={handleReply}>
                <label htmlFor="support-reply" className="mb-2 block text-sm font-semibold text-slate-800">
                  Write a reply
                </label>
                <textarea
                  id="support-reply"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={4}
                  maxLength={3000}
                  placeholder="Type your message here..."
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-xs text-slate-400">{reply.length}/3000 characters</span>
                    {replyError && (
                      <p role="alert" className="mt-1 text-xs text-rose-600">{replyError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={addReply.isPending || !reply.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addReply.isPending
                      ? <Loader2 size={17} className="animate-spin" />
                      : <Send size={17} />}
                    Send reply
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <button
          onClick={() => void refetch()}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <RefreshCw size={15} /> Refresh conversation
        </button>
      </main>
    </div>
  )
}
