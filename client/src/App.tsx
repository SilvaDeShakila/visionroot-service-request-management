import { AuthProvider } from './features/auth/auth-context'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
