import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import MyRequestsPage from '../features/requests/pages/MyRequestsPage'
import CreateRequestPage from '../features/requests/pages/CreateRequestPage'
import RequestDetailsPage from '../features/requests/pages/RequestDetailsPage'
import EditRequestPage from '../features/requests/pages/EditRequestPage'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'
import AdminRequestsPage from '../features/admin/pages/AdminRequestsPage'
import AdminProfilePage from '../features/admin/pages/AdminProfilePage'
import ProfilePage from '../features/auth/pages/ProfilePage'
import PreferencesPage from '../features/preferences/pages/PreferencesPage'
import SupportCentrePage from '../features/support/pages/SupportCentrePage'
import SupportTicketDetailsPage from '../features/support/pages/SupportTicketDetailsPage'
import AdminSupportPage from '../features/admin/pages/AdminSupportPage'
import AdminUsersPage from '../features/admin/pages/AdminUsersPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Navigate to="/requests" replace />} />
        <Route path="/requests" element={<MyRequestsPage />} />
        <Route path="/requests/new" element={<CreateRequestPage />} />
        <Route path="/requests/:id" element={<RequestDetailsPage />} />
        <Route path="/requests/:id/edit" element={<EditRequestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/support" element={<SupportCentrePage />} />
        <Route path="/support/:id" element={<SupportTicketDetailsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/requests" element={<AdminRequestsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/support" element={<AdminSupportPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/support/:id" element={<SupportTicketDetailsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
