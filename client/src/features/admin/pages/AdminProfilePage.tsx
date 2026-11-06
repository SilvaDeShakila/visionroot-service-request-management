import { Mail, ShieldCheck, UserRound, Fingerprint, BadgeCheck } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useAuth } from '../../auth/auth-context'

function getInitials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'AD'
}

export default function AdminProfilePage() {
  const { user } = useAuth()

  return (
    <AdminLayout
      title="My Profile"
      subtitle="View your administrator account information."
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="h-36 bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-600" />
        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
              {getInitials(user?.name)}
            </div>
            <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:mb-2">
              <BadgeCheck size={15} />
              Active account
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {user?.name ?? 'Administrator'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">VisionRoot Administrator</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900">Account Information</h2>
          <p className="mt-1 text-sm text-slate-400">
            Your registered account details.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <UserRound size={19} />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-400">Full Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{user?.name ?? 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
                <Mail size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Email Address</p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-800">{user?.email ?? 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <ShieldCheck size={19} />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-400">Account Role</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{user?.role ?? 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                <Fingerprint size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Account ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-800">{user?.id ?? 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-violet-600" />
        <div>
          <p className="text-sm font-semibold text-violet-900">Administrator account</p>
          <p className="mt-1 text-xs leading-5 text-violet-700">
            This account has administrator access to the VisionRoot management workspace.
            Profile editing is not currently available.
          </p>
        </div>
      </section>
    </AdminLayout>
  )
}
