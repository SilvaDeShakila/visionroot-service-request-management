import { AuthProvider } from './features/auth/auth-context'
import { PreferencesProvider } from './features/preferences/preferences-context'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <AppRoutes />
      </PreferencesProvider>
    </AuthProvider>
  )
}

export default App
