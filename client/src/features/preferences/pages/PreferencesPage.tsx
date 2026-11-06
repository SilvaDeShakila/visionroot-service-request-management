import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Bell, Check, LayoutDashboard, LogOut, Moon,
  RotateCcw, Settings, ShieldCheck, Sun, Accessibility,
  Monitor, Mail, Megaphone, ClipboardCheck,
} from 'lucide-react'
import { useAuth } from '../../auth/auth-context'
import { usePreferences } from '../preferences-context'

type ToggleProps = {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

function Toggle({ label, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
export default function PreferencesPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { preferences, updatePreference, resetPreferences } = usePreferences()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
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
            <Link
              to="/requests"
              className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <ClipboardCheck size={18} />
              My requests
            </Link>
            <Link
              to="/profile"
              className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <ShieldCheck size={18} />
              My profile
            </Link>

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Help & support
            </p>
            <div className="space-y-1">
              <Link
                to="/support"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Bell size={18} />
                Support centre
              </Link>
              <Link
                to="/preferences"
                className="flex items-center gap-3 rounded-xl bg-blue-50 px-3.5 py-3 text-sm font-semibold text-blue-700"
              >
                <Settings size={18} />
                Preferences
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {user?.name?.trim().charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-600"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <Link
                to="/requests"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Back to requests"
              >
                <ArrowLeft size={19} />
              </Link>
              <div>
                <p className="text-sm font-bold text-slate-900">Preferences</p>
                <p className="text-xs text-slate-500">Manage your app experience</p>
              </div>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Check size={14} />
              Auto-saved
            </span>
          </header>

          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Personalise your workspace
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Your preferences
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Adjust the appearance, layout and accessibility of your VisionRoot experience.
                Your choices are saved automatically on this device.
              </p>
            </div>

            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Sun size={19} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Appearance</h2>
                    <p className="text-xs text-slate-500">Choose how VisionRoot looks</p>
                  </div>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updatePreference('theme', 'light')}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      preferences.theme === 'light'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-4 flex h-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                      <div className="flex w-3/4 gap-2">
                        <div className="h-12 w-1/4 rounded bg-white shadow-sm" />
                        <div className="flex-1 space-y-2 rounded bg-white p-2 shadow-sm">
                          <div className="h-2 w-1/2 rounded bg-slate-200" />
                          <div className="h-5 rounded bg-blue-100" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Sun size={16} /> Light
                      </span>
                      {preferences.theme === 'light' && <Check size={17} className="text-blue-600" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updatePreference('theme', 'dark')}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      preferences.theme === 'dark'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-4 flex h-20 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                      <div className="flex w-3/4 gap-2">
                        <div className="h-12 w-1/4 rounded bg-slate-700" />
                        <div className="flex-1 space-y-2 rounded bg-slate-800 p-2">
                          <div className="h-2 w-1/2 rounded bg-slate-600" />
                          <div className="h-5 rounded bg-blue-900" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Moon size={16} /> Dark
                      </span>
                      {preferences.theme === 'dark' && <Check size={17} className="text-blue-600" />}
                    </div>
                  </button>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Monitor size={19} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Dashboard layout</h2>
                    <p className="text-xs text-slate-500">Control the spacing in your workspace</p>
                  </div>
                </div>
                <div className="grid gap-3 p-6 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updatePreference('density', 'comfortable')}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      preferences.density === 'comfortable'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-3 space-y-2 rounded-lg bg-slate-50 p-3">
                      <div className="h-3 w-2/5 rounded bg-slate-300" />
                      <div className="h-8 rounded bg-white shadow-sm" />
                      <div className="h-8 rounded bg-white shadow-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Comfortable</p>
                        <p className="mt-1 text-xs text-slate-500">More spacing and breathing room</p>
                      </div>
                      {preferences.density === 'comfortable' && <Check size={17} className="text-blue-600" />}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePreference('density', 'compact')}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      preferences.density === 'compact'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mb-3 space-y-1 rounded-lg bg-slate-50 p-3">
                      <div className="h-3 w-2/5 rounded bg-slate-300" />
                      <div className="h-5 rounded bg-white shadow-sm" />
                      <div className="h-5 rounded bg-white shadow-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Compact</p>
                        <p className="mt-1 text-xs text-slate-500">Tighter spacing, more content</p>
                      </div>
                      {preferences.density === 'compact' && <Check size={17} className="text-blue-600" />}
                    </div>
                  </button>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Bell size={19} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Notification preferences</h2>
                    <p className="text-xs text-slate-500">Choose the updates you would like to receive</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 px-6">
                  <div className="flex items-center justify-between gap-5 py-5">
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="mt-0.5 text-slate-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Email notifications</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Master preference for email updates</p>
                      </div>
                    </div>
                    <Toggle
                      label='Email notifications'
                      checked={preferences.emailNotifications}
                      onChange={(value) => updatePreference('emailNotifications', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-5 py-5">
                    <div className="flex items-start gap-3">
                      <ClipboardCheck size={18} className="mt-0.5 text-slate-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Request status updates</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Updates when your service request changes</p>
                      </div>
                    </div>
                    <Toggle
                      label='Request status updates'
                      checked={preferences.requestUpdates}
                      disabled={!preferences.emailNotifications}
                      onChange={(value) => updatePreference('requestUpdates', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-5 py-5">
                    <div className="flex items-start gap-3">
                      <Megaphone size={18} className="mt-0.5 text-slate-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Product announcements</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">News about features and service improvements</p>
                      </div>
                    </div>
                    <Toggle
                      label='Product announcements'
                      checked={preferences.productAnnouncements}
                      disabled={!preferences.emailNotifications}
                      onChange={(value) => updatePreference('productAnnouncements', value)}
                    />
                  </div>
                </div>
                <div className="border-t border-blue-100 bg-blue-50/60 px-6 py-3">
                  <p className="text-xs leading-5 text-blue-800">
                    These choices are saved locally as preferences. Actual notification delivery is not yet connected.
                  </p>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Accessibility size={19} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Accessibility</h2>
                    <p className="text-xs text-slate-500">Make the interface more comfortable to use</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-5 p-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Reduce motion</p>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                      Minimise animations and transitions throughout the application.
                    </p>
                  </div>
                  <Toggle
                    label='Reduce motion'
                    checked={preferences.reduceMotion}
                    onChange={(value) => updatePreference('reduceMotion', value)}
                  />
                </div>
              </section>

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">Reset preferences</p>
                  <p className="mt-1 text-xs text-slate-500">Restore all settings to their default values.</p>
                </div>
                <button
                  type="button"
                  onClick={resetPreferences}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <RotateCcw size={16} />
                  Reset to defaults
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              VisionRoot · Your workspace, your way
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}


