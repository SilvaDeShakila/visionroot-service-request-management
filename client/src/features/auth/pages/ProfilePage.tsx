import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, BadgeCheck, Fingerprint, LayoutDashboard, LifeBuoy,
  LogOut, Mail, Plus, Save, ShieldCheck, Settings, UserRound,
  X, CircleUserRound, Camera, ImagePlus, Check, LoaderCircle,
} from 'lucide-react'
import { useAuth } from '../auth-context'

function getInitials(name?: string) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
}


function getAvatarUrl(avatar: string | null | undefined) {
  if (!avatar) return null

  if (avatar.startsWith('preset:')) {
    return `/avatars/${avatar.slice(7)}.svg`
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  return `${new URL(apiBaseUrl).origin}${avatar}`
}
export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateProfile, uploadAvatar, selectAvatarPreset, logout } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState(
    user?.avatar?.startsWith('preset:') ? user.avatar.slice(7) : '',
  )
  const [isAvatarSaving, setIsAvatarSaving] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState('')
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
  }, [user])

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null)
      return
    }

    const previewUrl = URL.createObjectURL(avatarFile)
    setAvatarPreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [avatarFile])

  useEffect(() => {
    setSelectedPreset(
      user?.avatar?.startsWith('preset:') ? user.avatar.slice(7) : '',
    )
  }, [user?.avatar])

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setAvatarMessage('')
    setAvatarError('')

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Please choose a JPG, PNG, or WEBP image.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('The image must be smaller than 2 MB.')
      event.target.value = ''
      return
    }

    setAvatarFile(file)
    setSelectedPreset('')
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return

    setIsAvatarSaving(true)
    setAvatarError('')
    setAvatarMessage('')

    try {
      await uploadAvatar(avatarFile)
      setAvatarFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setAvatarMessage('Your profile picture has been updated.')
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } }
      setAvatarError(
        apiError.response?.data?.message ?? 'Unable to upload your photo. Please try again.',
      )
    } finally {
      setIsAvatarSaving(false)
    }
  }

  const handlePresetSelect = async (preset: string) => {
    setSelectedPreset(preset)
    setAvatarFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsAvatarSaving(true)
    setAvatarError('')
    setAvatarMessage('')

    try {
      await selectAvatarPreset(preset)
      setAvatarMessage('Your avatar has been updated.')
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } }
      setAvatarError(
        apiError.response?.data?.message ?? 'Unable to update your avatar. Please try again.',
      )
      setSelectedPreset(
        user?.avatar?.startsWith('preset:') ? user.avatar.slice(7) : '',
      )
    } finally {
      setIsAvatarSaving(false)
    }
  }
  const displayedAvatar = avatarPreview ?? getAvatarUrl(user?.avatar)

  const hasChanges = name.trim() !== user?.name || email.trim().toLowerCase() !== user?.email

  const handleCancel = () => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setMessage('')
    setError('')
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (name.trim().length < 2) {
      setError('Name must contain at least 2 characters.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    if (!hasChanges) {
      setMessage('Your profile is already up to date.')
      return
    }

    setIsSaving(true)

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })
      setMessage('Your profile has been updated successfully.')
    } catch (err) {
      const apiError = err as {
        response?: { data?: { message?: string } }
      }
      setError(
        apiError.response?.data?.message ??
        'Unable to update your profile. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

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
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            <nav className="space-y-1">
              <Link to="/requests" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                <LayoutDashboard size={18} /> My requests
              </Link>
              <Link to="/requests/new" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                <Plus size={18} /> Create a request
              </Link>
            </nav>

            <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Help & support</p>
            <nav className="space-y-1">
              <Link to="/support" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                <LifeBuoy size={18} /> Support centre
              </Link>
              <Link to="/preferences" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                <Settings size={18} /> Preferences
              </Link>
            </nav>

            <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Account</p>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-3.5 py-3 text-sm font-bold text-blue-700">
              <CircleUserRound size={18} /> My profile
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
            </div>
          </div>

          <div className="p-4">
            <div className="rounded-2xl bg-[#101d38] p-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <LifeBuoy size={18} />
              </div>
              <p className="mt-4 text-sm font-bold">Need assistance?</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Our support team is here to help with your service requests.</p>
              <Link to="/support" className="mt-4 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2.5 text-xs font-semibold transition hover:bg-white/20">
                Visit support centre <ArrowLeft className="rotate-180" size={14} />
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between px-4 sm:px-7 xl:px-10">
              <div>
                <p className="text-sm font-bold text-slate-900">Customer workspace</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Manage your account information</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'Customer'}</p>
                  <p className="text-[11px] text-slate-400">Customer account</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-100 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-100">
                  {displayedAvatar ? (
                    <img src={displayedAvatar} alt={`${user?.name ?? 'User'} avatar`} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                  <LogOut size={15} /><span className="hidden sm:inline">Log out</span>
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1100px] px-4 py-7 sm:px-7 sm:py-9 xl:px-10">
            <div className="mb-6">
              <Link to="/requests" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-blue-700">
                <ArrowLeft size={15} /> Back to my requests
              </Link>
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Account settings</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">My Profile</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">View and update your personal account information.</p>
              </div>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="h-32 bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-500 sm:h-36" />
              <div className="px-5 pb-7 sm:px-8">
                <div className="-mt-11 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
                    {displayedAvatar ? (
                      <img src={displayedAvatar} alt={`${user?.name ?? 'User'} profile picture`} className="h-full w-full object-cover" />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:mb-2">
                    <BadgeCheck size={15} /> Active account
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">{user?.name ?? 'Customer'}</h2>
                  <p className="mt-1 text-sm text-slate-500">VisionRoot Customer</p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">Profile picture</h2>
                <p className="mt-1 text-sm text-slate-400">Upload your own photo or choose an illustrated avatar.</p>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 text-3xl font-bold text-blue-700 shadow-sm">
                    {displayedAvatar ? (
                      <img src={displayedAvatar} alt="Profile picture preview" className="h-full w-full object-cover" />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-400">Current preview</span>
                </div>

                <div className="min-w-0 flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    aria-label="Choose a profile picture"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAvatarSaving}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                    >
                      <ImagePlus size={17} /> Choose photo
                    </button>

                    {avatarFile && (
                      <button
                        type="button"
                        onClick={() => void handleAvatarUpload()}
                        disabled={isAvatarSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isAvatarSaving ? <LoaderCircle size={17} className="animate-spin" /> : <Camera size={17} />}
                        {isAvatarSaving ? 'Uploading...' : 'Save photo'}
                      </button>
                    )}

                    {avatarFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        disabled={isAvatarSaving}
                        className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400">JPG, PNG or WEBP · Maximum file size: 2 MB</p>

                  <div className="mt-7">
                    <p className="mb-3 text-sm font-semibold text-slate-700">Choose an illustrated avatar</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { id: 'avatar-blue', label: 'Ocean blue' },
                        { id: 'avatar-purple', label: 'Royal purple' },
                        { id: 'avatar-green', label: 'Fresh green' },
                        { id: 'avatar-orange', label: 'Warm orange' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => void handlePresetSelect(preset.id)}
                          disabled={isAvatarSaving}
                          aria-pressed={selectedPreset === preset.id}
                          className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition hover:border-blue-300 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-60 ${
                            selectedPreset === preset.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-100 bg-white'
                          }`}
                        >
                          <img
                            src={`/avatars/${preset.id}.svg`}
                            alt={`${preset.label} avatar`}
                            className="h-16 w-16 rounded-2xl object-cover"
                          />
                          <span className="text-xs font-semibold text-slate-700">{preset.label}</span>
                          {selectedPreset === preset.id && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                              <Check size={12} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {avatarError && (
                    <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {avatarError}
                    </div>
                  )}
                  {avatarMessage && (
                    <div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {avatarMessage}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="text-base font-bold text-slate-900">Personal information</h2>
                <p className="mt-1 text-sm text-slate-400">Keep your name and email address up to date.</p>
              </div>

              <form onSubmit={(event) => void handleSave(event)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                    <div className="relative">
                      <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="Enter your full name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="you@example.com" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}
                {message && (
                  <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button type="button" onClick={handleCancel} disabled={isSaving || !hasChanges} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                    <X size={16} /> Cancel
                  </button>
                  <button type="submit" disabled={isSaving || !hasChanges} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                    <Save size={16} /> {isSaving ? 'Saving changes...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5">
                <h2 className="text-base font-bold text-slate-900">Account information</h2>
                <p className="mt-1 text-sm text-slate-400">Your account identification and access level.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="rounded-xl bg-blue-100 p-2.5 text-blue-700"><ShieldCheck size={19} /></span>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Account role</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{user?.role ?? 'Not available'}</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <span className="rounded-xl bg-amber-100 p-2.5 text-amber-700"><Fingerprint size={19} /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Account ID</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">{user?.id ?? 'Not available'}</p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="py-8 text-center text-xs text-slate-400">
              VisionRoot Customer Workspace
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}
