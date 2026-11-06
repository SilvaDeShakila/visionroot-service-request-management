
import { useEffect, useState } from 'react'
import { Search, Users, ShieldCheck, UserRound, RefreshCw } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import apiClient from '../../../lib/api-client'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function loadUsers() {
    try {
      const response = await apiClient.get('/users')
      setUsers(response.data.data.users)
    } catch {
      setError('Unable to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    apiClient.get('/users')
      .then((response) => {
        if (active) {
          setUsers(response.data.data.users)
          setError('')
        }
      })
      .catch(() => {
        if (active) {
          setError('Unable to load users. Please try again.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  async function changeRole(userId: string, role: 'USER' | 'ADMIN') {
    try {
      setUpdating(userId)
      setError('')
      await apiClient.patch(`/users/${userId}/role`, { role })
      await loadUsers()
    } catch {
      setError('Unable to update user role. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminLayout
      title="User Management"
      subtitle="View registered users and manage their access roles"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
              <Users size={21} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total registered users</p>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <ShieldCheck size={21} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Administrators</p>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((user) => user.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Registered Users</h2>
            <p className="mt-1 text-xs text-slate-500">Manage user access and administrator roles</p>
          </div>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
              />
            </div>
            <button
              onClick={() => { setLoading(true); void loadUsers() }}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
              title="Refresh users"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UserRound className="mx-auto mb-3 text-slate-300" size={32} />
            <p className="font-medium text-slate-700">No users found</p>
            <p className="mt-1 text-sm text-slate-400">Try another search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Registered</th>
                  <th className="px-5 py-4">Manage access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={updating === user._id}
                        onChange={(event) =>
                          void changeRole(user._id, event.target.value as 'USER' | 'ADMIN')
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-violet-400 disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      {updating === user._id && (
                        <span className="ml-2 text-xs text-slate-400">Saving...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}



