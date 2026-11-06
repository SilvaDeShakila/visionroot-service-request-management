import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LifeBuoy, Plus, MessageSquare, Clock, ArrowRight,
  Loader2, AlertCircle, CheckCircle2, ClipboardList,
} from 'lucide-react'
import { useSupportTickets, useCreateSupportTicket } from '../hooks/useSupport'
import type {
  SupportCategory,
  SupportPriority,
  SupportStatus,
} from '../support.types'

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
  WAITING_FOR_USER: 'Waiting for You',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const priorityStyles: Record<SupportPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-50 text-amber-700',
  HIGH: 'bg-rose-50 text-rose-700',
}

const categoryLabels: Record<SupportCategory, string> = {
  TECHNICAL: 'Technical',
  ACCOUNT: 'Account',
  BILLING: 'Billing',
  GENERAL: 'General',
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

export default function SupportCentrePage() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState<SupportCategory>('GENERAL')
  const [priority, setPriority] = useState<SupportPriority>('MEDIUM')
  const [formError, setFormError] = useState('')

  const { data, isLoading, isError, refetch } = useSupportTickets({
    page: 1,
    limit: 10,
  })
  const createTicket = useCreateSupportTicket()

  const tickets = data?.data.tickets ?? []

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (subject.trim().length < 5) {
      setFormError('Subject must contain at least 5 characters.')
      return
    }

    if (message.trim().length < 10) {
      setFormError('Please provide at least 10 characters describing your issue.')
      return
    }

    try {
      const response = await createTicket.mutateAsync({
        subject: subject.trim(),
        message: message.trim(),
        category,
        priority,
      })

      navigate(`/support/${response.data.ticket._id}`)
    } catch {
      setFormError('Unable to submit your ticket. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/requests" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <LifeBuoy size={21} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">VisionRoot</h1>
              <p className="text-xs text-slate-500">Support Centre</p>
            </div>
          </Link>
          <Link
            to="/requests"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Back to workspace
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-blue-100">
                <LifeBuoy size={19} />
                <span className="text-sm font-semibold">We're here to help</span>
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">How can we support you?</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                Submit a support ticket and keep track of your conversations with our support team.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((current) => !current)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={18} />
              {showForm ? 'Close form' : 'Create a ticket'}
            </button>
          </div>
        </section>

        {showForm && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Create a support ticket</h3>
              <p className="mt-1 text-sm text-slate-500">
                Describe your issue clearly so our team can assist you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="ticket-subject" className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="ticket-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={120}
                  placeholder="Briefly describe your issue"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ticket-category" className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    id="ticket-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as SupportCategory)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="TECHNICAL">Technical</option>
                    <option value="ACCOUNT">Account</option>
                    <option value="BILLING">Billing</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ticket-priority" className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>
                  <select
                    id="ticket-priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as SupportPriority)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="ticket-message" className="mb-2 block text-sm font-medium text-slate-700">
                  Describe your issue
                </label>
                <textarea
                  id="ticket-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  maxLength={3000}
                  placeholder="Provide details about the problem you're experiencing..."
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <p className="mt-1 text-right text-xs text-slate-400">{message.length}/3000</p>
              </div>

              {formError && (
                <div role="alert" className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle size={17} />
                  {formError}
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTicket.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createTicket.isPending && <Loader2 size={17} className="animate-spin" />}
                  Submit ticket
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your support tickets</h3>
              <p className="mt-1 text-sm text-slate-500">Review your previous support conversations.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200">
              <ClipboardList size={16} />
              {data?.data.pagination.total ?? 0} tickets
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-slate-500">
              <Loader2 size={22} className="mr-3 animate-spin" />
              Loading your tickets...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-rose-500" size={28} />
              <p className="font-semibold text-slate-800">Couldn't load your tickets</p>
              <button onClick={() => void refetch()} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
                Try again
              </button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MessageSquare size={25} />
              </div>
              <h4 className="font-semibold text-slate-900">No support tickets yet</h4>
              <p className="mt-1 text-sm text-slate-500">Create a ticket if you need help with your account or services.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={17} /> Create your first ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/support/${ticket._id}`}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                          {statusLabels[ticket.status]}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                          {ticket.priority} priority
                        </span>
                        <span className="text-xs text-slate-400">{categoryLabels[ticket.category]}</span>
                      </div>
                      <h4 className="truncate text-base font-semibold text-slate-900 group-hover:text-blue-700">
                        {ticket.subject}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{ticket.message}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} /> Updated {formatDate(ticket.updatedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquare size={14} /> {ticket.replies.length} replies
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-blue-600">
                      View conversation
                      <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0" />
          Your support conversations are available here so you can follow updates in one place.
        </div>
      </main>
    </div>
  )
}
