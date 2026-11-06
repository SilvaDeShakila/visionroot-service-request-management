import { NavLink, useNavigate } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  LifeBuoy,
  UserRound,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../auth/auth-context'
import type { ReactNode } from 'react'

interface AdminLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

function getInitials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'AD'
}

const navigation = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Service Requests', path: '/admin/requests', icon: ClipboardList, end: false },
  { label: 'Support Centre', path: '/admin/support', icon: LifeBuoy, end: false },
  { label: 'My Profile', path: '/admin/profile', icon: UserRound, end: false },
]

export default function AdminLayout({ title, subtitle, children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Local authentication state is cleared by the auth context.
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-slate-800 md:flex">
      <aside className="z-20 flex w-full shrink-0 flex-col bg-[#11152b] text-white md:sticky md:top-0 md:h-screen md:w-[258px]">
        <div className="flex h-[78px] items-center gap-3 border-b border-white/[0.08] px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-950/40">
            <Activity size={21} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[19px] font-bold tracking-tight">VisionRoot</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-400">
              Management Portal
            </p>
          </div>
        </div>

        <div className="px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-indigo-950/30'
                      : 'font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} />
                    {item.label}
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mx-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2 text-violet-300">
            <ShieldCheck size={16} />
            <span className="text-xs font-semibold">Administrator access</span>
          </div>
          <p className="text-xs leading-5 text-slate-400">
            You are viewing the platform management workspace.
          </p>
        </div>

        <div className="mt-auto border-t border-white/[0.08] p-4">
          <NavLink
            to="/admin/profile"
            className="mb-3 flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Administrator'}</p>
              <p className="truncate text-xs text-slate-400">{user?.email ?? 'Admin Account'}</p>
            </div>
            <UserRound size={15} className="text-slate-500" />
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex min-h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>VisionRoot</span>
              <ChevronRight size={13} />
              <span className="text-violet-600">{title}</span>
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'Administrator'}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 ring-4 ring-violet-50">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8 xl:p-10">
          {children}
          <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-[11px] text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} VisionRoot. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck size={13} /> Secure management workspace
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}



